import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import pg from 'pg'

const { Pool } = pg
const databaseUrl = process.env.DATABASE_URL
const port = 8892
const baseUrl = `http://127.0.0.1:${port}`
const email = `postgres-${Date.now()}@kotodama.test`
const password = 'correct-horse-battery-staple'

function cookiesFrom(response) {
  const setCookies =
    response.headers.getSetCookie?.() ?? String(response.headers.get('set-cookie') ?? '').split(/,(?=\s*kotodama_)/)
  return setCookies
    .map((cookie) => cookie.trim().split(';')[0])
    .filter(Boolean)
    .join('; ')
}
function csrfFrom(cookies) {
  return cookies.match(/(?:^|;\s*)kotodama_csrf=([^;]+)/)?.[1]
}

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      if ((await fetch(`${baseUrl}/health`)).ok) return
    } catch {
      /* API is still starting. */
    }
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  throw new Error('PostgreSQL API test server did not start.')
}

function startServer(storagePath) {
  return spawn(process.execPath, ['server/index.mjs'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      API_PORT: String(port),
      DATABASE_URL: databaseUrl,
      MEDIA_STORAGE_PATH: storagePath,
      OPENAI_API_KEY: '',
      YOUTUBE_IMPORT_ENABLED: 'false',
    },
    stdio: 'ignore',
  })
}

function startWorker(storagePath) {
  return spawn(process.execPath, ['server/media-worker.mjs'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
      MEDIA_STORAGE_PATH: storagePath,
      MEDIA_WORKER_POLL_MS: '25',
      OPENAI_API_KEY: '',
      YOUTUBE_IMPORT_ENABLED: 'false',
    },
    stdio: 'ignore',
  })
}

async function stopServer(server) {
  if (!server || server.exitCode !== null) return
  server.kill('SIGTERM')
  await Promise.race([
    new Promise((resolve) => server.once('exit', resolve)),
    new Promise((resolve) => setTimeout(resolve, 1_000)),
  ])
}

async function waitForJob(assetId, headers) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const response = await fetch(`${baseUrl}/api/v1/video/assets/${assetId}/jobs`, { headers })
    const payload = await response.json()
    const job = payload.data?.items?.[0]
    if (job?.status === 'succeeded') return job
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  throw new Error('Media worker did not verify the uploaded video.')
}

test('PostgreSQL persists an account and verified uploaded video across restarts', { skip: !databaseUrl }, async () => {
  let server
  let worker
  const storageRoot = await mkdtemp(join(tmpdir(), 'kotodama-media-postgres-'))
  const pool = new Pool({ connectionString: databaseUrl })
  try {
    server = startServer(storageRoot)
    await waitForServer()
    const register = await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'PostgreSQL Persistence Test', email, password }),
    })
    assert.equal(register.status, 201)
    const registered = await register.json()
    const registerCookies = cookiesFrom(register)
    const registerCsrf = csrfFrom(registerCookies)
    assert.ok(registerCsrf)
    const accountHeaders = {
      authorization: `Bearer ${registered.data.accessToken}`,
      cookie: registerCookies,
      'x-csrf-token': registerCsrf,
      'content-type': 'application/json',
    }
    const preferences = await fetch(`${baseUrl}/api/v1/account/preferences`, {
      method: 'POST',
      headers: accountHeaders,
      body: JSON.stringify({ dailyWords: 30, accent: 'emerald' }),
    })
    assert.equal(preferences.status, 200)
    const learningPlan = await fetch(`${baseUrl}/api/v1/account/learning-plan`, {
      method: 'POST',
      headers: accountHeaders,
      body: JSON.stringify({
        language: 'jp',
        level: 'intermediate',
        dailyWords: 30,
        dailyMinutes: 20,
        reason: 'PostgreSQL persistence',
      }),
    })
    assert.equal(learningPlan.status, 200)
    const videoDraft = await fetch(`${baseUrl}/api/v1/video/assets`, {
      method: 'POST',
      headers: accountHeaders,
      body: JSON.stringify({
        sourceType: 'user_upload',
        title: 'PostgreSQL video draft',
        language: 'ja',
        rightsBasis: 'owned',
        originalFilename: 'persistence-test.mp4',
      }),
    })
    assert.equal(videoDraft.status, 201)
    const video = (await videoDraft.json()).data
    const mp4 = Buffer.concat([Buffer.alloc(4), Buffer.from('ftypisom'), Buffer.alloc(24)])
    const upload = await fetch(`${baseUrl}/api/v1/video/assets/${video.id}/upload`, {
      method: 'PUT',
      headers: { ...accountHeaders, 'content-type': 'video/mp4' },
      body: mp4,
    })
    assert.equal(upload.status, 202)
    worker = startWorker(storageRoot)
    const verifiedJob = await waitForJob(video.id, accountHeaders)
    assert.equal(verifiedJob.status, 'succeeded')

    await stopServer(server)
    await stopServer(worker)
    worker = undefined
    server = startServer(storageRoot)
    await waitForServer()
    const login = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    assert.equal(login.status, 200)
    const loggedIn = await login.json()
    assert.equal(loggedIn.data.user.id, registered.data.user.id)
    const profile = await fetch(`${baseUrl}/api/v1/account/profile`, {
      headers: { authorization: `Bearer ${loggedIn.data.accessToken}` },
    })
    assert.equal(profile.status, 200)
    const account = await profile.json()
    assert.equal(account.data.preferences.dailyWords, 30)
    assert.equal(account.data.preferences.accent, 'emerald')
    assert.equal(account.data.learningPlan.level, 'intermediate')
    const savedVideo = await fetch(`${baseUrl}/api/v1/video/assets/${video.id}`, {
      headers: { authorization: `Bearer ${loggedIn.data.accessToken}` },
    })
    assert.equal(savedVideo.status, 200)
    assert.equal((await savedVideo.json()).data.originalFilename, 'persistence-test.mp4')
  } finally {
    await stopServer(worker)
    await stopServer(server)
    const user = await pool.query('select id from users where email = $1', [email])
    if (user.rows[0]) {
      await pool.query('delete from audit_logs where actor_user_id = $1 or target_user_id = $1', [user.rows[0].id])
      await pool.query('delete from users where id = $1', [user.rows[0].id])
    }
    await pool.end()
    await rm(storageRoot, { recursive: true, force: true })
  }
})
