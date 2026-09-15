import { readFile, readdir } from 'node:fs/promises'
import fs from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import zlib from 'node:zlib'

const __dirname = dirname(fileURLToPath(import.meta.url))
const migrationsDirectory = join(__dirname, 'migrations')
const fixturePath = join(__dirname, '../fixtures/curriculum/curriculum_seed.json.gz')

export async function runMigrations(pool) {
  if (!pool) return
  const client = await pool.connect()
  try {
    await client.query("SELECT pg_advisory_lock(hashtext('kotodama_schema_migrations'))")
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `)

    const migrationFiles = (await readdir(migrationsDirectory))
      .filter((name) => /^\d+_[a-z0-9_]+\.sql$/.test(name))
      .sort()

    const appliedRows = await client.query('SELECT name FROM schema_migrations')
    const applied = new Set(appliedRows.rows.map((r) => r.name))

    for (const name of migrationFiles) {
      if (applied.has(name)) continue
      const rawSql = await readFile(join(migrationsDirectory, name), 'utf8')
      const sql = rawSql.replace(/^\uFEFF/, '')
      await client.query('BEGIN')
      try {
        await client.query(sql)
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [name])
        await client.query('COMMIT')
        console.log(`[AutoMigrate] Applied migration ${name}`)
      } catch (err) {
        await client.query('ROLLBACK')
        console.error(`[AutoMigrate] Failed migration ${name}:`, err.message)
        throw err
      }
    }
  } finally {
    await client.query("SELECT pg_advisory_unlock(hashtext('kotodama_schema_migrations'))").catch(() => {})
    client.release()
  }
}

export async function seedCurriculumIfEmpty(pool) {
  if (!pool) return
  if (!fs.existsSync(fixturePath)) {
    console.warn('[AutoSeed] Seed fixture not found at:', fixturePath)
    return
  }

  const client = await pool.connect()
  try {
    await client.query("SELECT pg_advisory_lock(hashtext('kotodama_curriculum_seed'))")
    const countRes = await client.query('SELECT COUNT(*)::int as count FROM curriculum_courses')
    const count = countRes.rows[0]?.count ?? 0
    if (count > 0) {
      return
    }

    console.log('[AutoSeed] curriculum_courses is empty. Seeding from fixture...')
    const compressed = await readFile(fixturePath)
    const jsonStr = zlib.gunzipSync(compressed).toString('utf8')
    const data = JSON.parse(jsonStr)

    const { courses = [], units = [], terms = [], courseTerms = [] } = data

    await client.query('BEGIN')

    for (const c of courses) {
      await client.query(
        `
        INSERT INTO curriculum_courses (
          course_code, title, level, provider_source, visibility, rights_status, description, is_curated, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        ON CONFLICT (course_code) DO NOTHING
      `,
        [c.course_code, c.title, c.level, c.provider_source, c.visibility, c.rights_status, c.description, c.is_curated]
      )
    }

    for (const u of units) {
      await client.query(
        `
        INSERT INTO curriculum_units (
          unit_id, course_code, unit_key, ordinal, title, topic, is_curated, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        ON CONFLICT (unit_id) DO NOTHING
      `,
        [u.unit_id, u.course_code, u.unit_key, u.ordinal, u.title, u.topic, u.is_curated]
      )
    }

    const termChunkSize = 100
    for (let i = 0; i < terms.length; i += termChunkSize) {
      const chunk = terms.slice(i, i + termChunkSize)
      const valueClauses = []
      const params = []
      chunk.forEach((t, idx) => {
        const offset = idx * 9
        valueClauses.push(
          `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9})`
        )
        params.push(
          t.term_id,
          t.normalized_key,
          t.display_word,
          t.display_reading || '',
          typeof t.meanings === 'string' ? t.meanings : JSON.stringify(t.meanings || []),
          t.han_viet || null,
          typeof t.examples === 'string' ? t.examples : JSON.stringify(t.examples || []),
          typeof t.raw_source_references === 'string'
            ? t.raw_source_references
            : JSON.stringify(t.raw_source_references || []),
          t.is_curated || false
        )
      })

      await client.query(
        `
        INSERT INTO curriculum_terms (
          term_id, normalized_key, display_word, display_reading, meanings, han_viet, examples, raw_source_references, is_curated
        ) VALUES ${valueClauses.join(', ')}
        ON CONFLICT (term_id) DO NOTHING
      `,
        params
      )
    }

    const ctChunkSize = 100
    for (let i = 0; i < courseTerms.length; i += ctChunkSize) {
      const chunk = courseTerms.slice(i, i + ctChunkSize)
      const valueClauses = []
      const params = []
      chunk.forEach((ct, idx) => {
        const offset = idx * 7
        valueClauses.push(
          `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7})`
        )
        params.push(
          ct.course_code,
          ct.unit_id,
          ct.term_id,
          ct.ordinal,
          ct.source_record_id || '',
          typeof ct.provenance === 'string' ? ct.provenance : JSON.stringify(ct.provenance || {}),
          ct.is_curated || false
        )
      })

      await client.query(
        `
        INSERT INTO curriculum_course_terms (
          course_code, unit_id, term_id, ordinal, source_record_id, provenance, is_curated
        ) VALUES ${valueClauses.join(', ')}
        ON CONFLICT (course_code, unit_id, ordinal) DO NOTHING
      `,
        params
      )
    }

    await client.query('COMMIT')
    console.log(
      `[AutoSeed] Successfully seeded ${courses.length} courses, ${units.length} units, and ${terms.length} terms.`
    )
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('[AutoSeed] Error seeding curriculum:', err.message)
    throw err
  } finally {
    await client.query("SELECT pg_advisory_unlock(hashtext('kotodama_curriculum_seed'))").catch(() => {})
    client.release()
  }
}

export async function autoMigrateAndSeed(pool, { seedCurriculum = true } = {}) {
  if (!pool) return
  await runMigrations(pool)
  if (seedCurriculum) await seedCurriculumIfEmpty(pool)
}
