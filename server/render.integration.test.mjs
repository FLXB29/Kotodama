import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import test from 'node:test'
import pg from 'pg'

const databaseUrl = process.env.RENDER_TEST_DATABASE_URL

test(
  'Render startup, bundled content, embedded video worker, playback and SRS survive a restart',
  {
    skip: !databaseUrl,
    timeout: 60000,
  },
  async () => {
    const connection = new URL(databaseUrl)
    assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(connection.hostname), 'Use an isolated local test database')
    const pool = new pg.Pool({ connectionString: databaseUrl })
    const schema = `render_smoke_${randomUUID().replaceAll('-', '')}`
    const storage = await mkdtemp(join(tmpdir(), 'kotodama-render-'))
    const base = 'http://127.0.0.1:8917'
    let child
    let output = ''
    await pool.query(`CREATE SCHEMA ${schema}`)
    connection.searchParams.set('options', `-c search_path=${schema},public`)
    const stop = async () => {
      if (child && child.exitCode === null && child.signalCode === null) {
        const exited = once(child, 'exit')
        child.kill('SIGTERM')
        await exited
      }
    }
    const start = async () => {
      child = spawn(process.execPath, ['--experimental-sqlite', 'server/index.mjs'], {
        env: {
          ...process.env,
          NODE_ENV: 'production',
          RENDER: 'true',
          RENDER_EXTERNAL_URL: base,
          APP_ORIGIN: base,
          CORS_ORIGINS: base,
          PORT: '8917',
          HOST: '127.0.0.1',
          AUTH_JWT_SECRET: 'render-test-only-secret-at-least-32-characters',
          DATABASE_URL: connection.toString(),
          DATABASE_SSL: 'false',
          CURRICULUM_STORAGE: 'postgres',
          ANIME_STORAGE: 'postgres',
          MEDIA_STORAGE_PATH: storage,
          MEDIA_WORKER_ENABLED: 'true',
          MEDIA_WORKER_POLL_MS: '250',
          TRANSCRIPTION_PROVIDER: 'openai',
          OPENAI_API_KEY: '',
          GEMINI_API_KEY: '',
          SMTP_HOST: '',
          SMTP_FROM: '',
          BOOTSTRAP_ADMIN_EMAIL: '',
          VNJPDICT_DB_PATH: '',
          NHAIKANJI_DATA_PATH: '',
          MAZII_CRAWLER_DATA_PATH: '',
        },
        stdio: ['ignore', 'pipe', 'pipe'],
        windowsHide: true,
      })
      child.stdout.on('data', (chunk) => {
        output += chunk
      })
      child.stderr.on('data', (chunk) => {
        output += chunk
      })
      for (let attempt = 0; attempt < 150; attempt += 1) {
        try {
          if ((await fetch(`${base}/health`)).ok) return
        } catch {
          /* starting */
        }
        if (child.exitCode !== null) throw new Error(output)
        await new Promise((done) => setTimeout(done, 100))
      }
      throw new Error(`Render test server did not start: ${output}`)
    }
    let headers = {}
    const call = async (path, method = 'GET', body, status = 200) => {
      const response = await fetch(base + path, {
        method,
        headers: { ...headers, 'content-type': 'application/json' },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      })
      const payload = await response.json()
      assert.equal(response.status, status, `${path}: ${JSON.stringify(payload)}`)
      return { response, data: payload.data }
    }
    const setSession = ({ response, data }) => {
      const cookies = response.headers
        .getSetCookie()
        .map((cookie) => cookie.split(';')[0])
        .join('; ')
      headers = {
        authorization: `Bearer ${data.accessToken}`,
        cookie: cookies,
        'x-csrf-token': cookies.match(/kotodama_csrf=([^;]+)/)[1],
      }
    }
    try {
      await start()
      const capabilities = (await call('/api/v1/video/capabilities')).data
      assert.equal(capabilities.youtubeImportEnabled, false)
      assert.equal(capabilities.transcriptionEnabled, false)
      assert.equal((await call('/ready')).data.emailConfigured, false)
      assert.equal((await call('/api/v1/curriculum/catalog')).data.items.length, 7)
      const terms = (await call('/api/v1/curriculum/courses/mimikara_n3/units/unit-1/terms')).data
      assert.ok(terms.items.length > 0)
      assert.equal((await call('/api/v1/dictionary/search?keyword=gakkou&limit=1')).data.results[0].word, '学校')
      assert.ok((await call('/api/v1/nhaikanji/kanji?limit=1')).data.total > 2000)
      assert.ok((await call('/api/v1/nhaikanji/bunpo?limit=1')).data.total > 500)
      const email = `render-${randomUUID()}@kotodama.test`
      const password = 'render-test-password-12345'
      setSession(await call('/api/v1/auth/register', 'POST', { name: 'Render test', email, password }, 201))
      const asset = (
        await call(
          '/api/v1/video/assets',
          'POST',
          {
            sourceType: 'user_upload',
            title: 'Render playback verification',
            language: 'ja',
            rightsBasis: 'owned',
            originalFilename: 'render-test.mp4',
          },
          201
        )
      ).data
      const video = process.env.RENDER_TEST_VIDEO_PATH
        ? await readFile(process.env.RENDER_TEST_VIDEO_PATH)
        : Buffer.concat([Buffer.alloc(4), Buffer.from('ftypisom'), Buffer.alloc(24)])
      const upload = await fetch(`${base}/api/v1/video/assets/${asset.id}/upload`, {
        method: 'PUT',
        headers: { ...headers, 'content-type': 'video/mp4' },
        body: video,
      })
      assert.equal(upload.status, 202)
      let verified = false
      for (let attempt = 0; attempt < 60; attempt += 1) {
        const jobs = (await call(`/api/v1/video/assets/${asset.id}/jobs`)).data.items
        verified = jobs.some((job) => job.jobType === 'upload_verify' && job.status === 'succeeded')
        if (verified) break
        await new Promise((done) => setTimeout(done, 100))
      }
      assert.equal(verified, true, 'npm start must process uploads without a separately launched worker')
      const playback = (await call(`/api/v1/video/assets/${asset.id}/playback-session`, 'POST', {})).data
      const range = await fetch(base + playback.contentUrl, { headers: { range: 'bytes=-8' } })
      assert.equal(range.status, 206)
      assert.equal(range.headers.get('content-range'), `bytes ${video.length - 8}-${video.length - 1}/${video.length}`)
      assert.deepEqual(Buffer.from(await range.arrayBuffer()), video.subarray(-8))
      assert.equal((await fetch(`${base}/api/v1/video/assets/${asset.id}/content`)).status, 401)
      const card = (
        await call(
          '/api/v1/srs/add',
          'POST',
          {
            type: 'vocab',
            term: '学校',
            reading: 'がっこう',
            meaning: 'Trường học',
            jlptLevel: 'N5',
          },
          201
        )
      ).data
      const reviewed = (await call('/api/v1/srs/review', 'POST', { cardId: card.id, rating: 'good' })).data
      assert.equal(reviewed.id, card.id)
      const cardCount = (await call('/api/v1/srs/stats')).data.totalCards
      await stop()
      await start()
      setSession(await call('/api/v1/auth/login', 'POST', { email, password }))
      assert.equal((await call('/api/v1/srs/stats')).data.totalCards, cardCount)
      const savedDeck = (await call('/api/v1/srs/deck')).data
      assert.ok(savedDeck.items.some((item) => item.id === card.id && item.repetition === reviewed.repetition))
      const replay = (await call(`/api/v1/video/assets/${asset.id}/playback-session`, 'POST', {})).data
      const content = await fetch(base + replay.contentUrl)
      assert.equal(content.status, 200)
      assert.deepEqual(Buffer.from(await content.arrayBuffer()), video)
      assert.equal((await call('/api/v1/curriculum/catalog')).data.items.length, 7)
    } finally {
      await stop()
      await pool.query(`DROP SCHEMA ${schema} CASCADE`)
      await pool.end()
      await rm(storage, { recursive: true, force: true })
    }
  }
)
