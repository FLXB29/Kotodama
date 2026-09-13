import { DatabaseSync } from 'node:sqlite'
import fs from 'node:fs'
import pg from 'pg'

const { Pool } = pg

const NIHONGO_DB_PATH = process.env.NIHONGO_DB_PATH || 'd:/Tieng_Nhat/web/server/data/nihongo.db'
const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('DATABASE_URL is required.')
  process.exit(1)
}

if (!fs.existsSync(NIHONGO_DB_PATH)) {
  console.error(`nihongo.db not found at ${NIHONGO_DB_PATH}`)
  process.exit(1)
}

const COURSES = [
  {
    course_code: 'mimikara_n3',
    title: 'Mimikara Oboeru N3 (耳から覚える)',
    level: 'N3',
    provider_source: 'Mimikara Oboeru',
    description: 'Giáo trình từ vựng Mimikara Oboeru N3 kèm âm thanh và câu ví dụ chuẩn.',
  },
  {
    course_code: 'tango_n3',
    title: 'Tango N3 (2000 Từ vựng)',
    level: 'N3',
    provider_source: 'Tango 2000',
    description: '2000 từ vựng thiết yếu cho kỳ thi JLPT N3 chia theo chủ đề cuộc sống.',
  },
  {
    course_code: 'mimikara_n2',
    title: 'Mimikara Oboeru N2 (耳から覚える)',
    level: 'N2',
    provider_source: 'Mimikara Oboeru',
    description: 'Giáo trình từ vựng trung cao cấp Mimikara Oboeru N2.',
  },
  {
    course_code: 'tango_n2',
    title: 'Tango N2 (1500 Từ vựng)',
    level: 'N2',
    provider_source: 'Tango 1500',
    description: '1500 từ vựng nâng cao JLPT N2 theo ngữ cảnh thực tế.',
  },
  {
    course_code: 'mimikara_n1',
    title: 'Mimikara Oboeru N1 (耳から覚える)',
    level: 'N1',
    provider_source: 'Mimikara Oboeru',
    description: 'Giáo trình cao cấp Mimikara Oboeru N1.',
  },
  {
    course_code: 'tango_n1',
    title: 'Tango N1 (1000 Từ vựng)',
    level: 'N1',
    provider_source: 'Tango 1000',
    description: '1000 từ vựng cao cấp JLPT N1 cho học thuật và công việc.',
  },
  {
    course_code: 'se',
    title: 'Từ vựng CNTT (SE IT)',
    level: 'SE',
    provider_source: 'Kotodama IT Specialist',
    description: 'Tổng hợp từ vựng chuyên ngành kỹ sư cầu nối (BrSE) và lập trình viên tiếng Nhật.',
  },
]

async function seed() {
  console.log(`[Seed] Connecting to SQLite: ${NIHONGO_DB_PATH}`)
  const sqlite = new DatabaseSync(NIHONGO_DB_PATH, { readOnly: true })
  const pool = new Pool({ connectionString: DATABASE_URL })
  const client = await pool.connect()

  try {
    console.log('[Seed] Connected to PostgreSQL')

    await client.query('BEGIN')

    // 1. Insert Courses
    console.log('[Seed] Upserting courses...')
    for (const c of COURSES) {
      await client.query(
        `
        INSERT INTO curriculum_courses (
          course_code, title, level, provider_source, visibility, rights_status, description, is_curated, updated_at
        ) VALUES ($1, $2, $3, $4, 'public', 'verified', $5, true, NOW())
        ON CONFLICT (course_code) DO UPDATE SET
          title = EXCLUDED.title,
          level = EXCLUDED.level,
          provider_source = EXCLUDED.provider_source,
          visibility = 'public',
          rights_status = 'verified',
          description = EXCLUDED.description,
          is_curated = true,
          updated_at = NOW()
      `,
        [c.course_code, c.title, c.level, c.provider_source, c.description]
      )
    }

    // 2. Insert Units
    console.log('[Seed] Reading units from SQLite...')
    const sqliteUnits = sqlite.prepare('SELECT * FROM curriculum_units ORDER BY curriculum_code, unit_number').all()
    console.log(`[Seed] Found ${sqliteUnits.length} units in SQLite.`)

    for (const u of sqliteUnits) {
      const unitKey = `unit-${u.unit_number}`
      const unitId = `${u.curriculum_code}:${unitKey}`
      const title = u.unit_title?.trim() || `Unit ${u.unit_number}`
      const topic = u.pos_type || ''

      await client.query(
        `
        INSERT INTO curriculum_units (
          unit_id, course_code, unit_key, ordinal, title, topic, is_curated, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, true, NOW())
        ON CONFLICT (course_code, unit_key) DO UPDATE SET
          title = EXCLUDED.title,
          topic = EXCLUDED.topic,
          is_curated = true,
          updated_at = NOW()
      `,
        [unitId, u.curriculum_code, unitKey, u.unit_number, title, topic]
      )
    }

    // 3. Insert Terms & Course Terms in fast multi-row batches
    console.log('[Seed] Reading all curriculum words from SQLite...')
    const sqliteWords = sqlite.prepare('SELECT * FROM curriculum_words ORDER BY id').all()
    console.log(`[Seed] Found ${sqliteWords.length} words in SQLite.`)

    // Assign strictly unique ordinals per unit
    const unitWordCounters = new Map()
    const enrichedWords = sqliteWords.map((w) => {
      const unitKey = `unit-${w.unit_number}`
      const unitId = `${w.curriculum_code}:${unitKey}`
      const currentOrdinal = (unitWordCounters.get(unitId) || 0) + 1
      unitWordCounters.set(unitId, currentOrdinal)

      return {
        ...w,
        computedUnitId: unitId,
        computedOrdinal: currentOrdinal,
      }
    })

    const BATCH_SIZE = 200

    for (let i = 0; i < enrichedWords.length; i += BATCH_SIZE) {
      const slice = enrichedWords.slice(i, i + BATCH_SIZE)

      // Batch insert terms
      const termPlaceholders = []
      const termValues = []
      let pIdx = 1

      for (const w of slice) {
        const displayWord = (w.kanji || w.kana || '').trim()
        const displayReading = (w.kana || w.romaji || '').trim()
        const normalizedKey = `${displayWord}:${displayReading}`
        const termId = `term:${w.curriculum_code}:${w.id}`
        const meanings = w.meaning ? [w.meaning.trim()] : []

        let examples = []
        if (w.examples) {
          try {
            const raw = JSON.parse(w.examples)
            if (Array.isArray(raw)) {
              examples = raw.map((ex) => ({
                ja: ex.jp || ex.ja || '',
                jp: ex.jp || ex.ja || '',
                vi: ex.vi || '',
                audio: ex.audio || '',
              }))
            }
          } catch {
            examples = []
          }
        }

        termPlaceholders.push(
          `($${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, true, NOW())`
        )
        termValues.push(
          termId,
          normalizedKey,
          displayWord,
          displayReading,
          JSON.stringify(meanings),
          w.hanviet?.trim() || null,
          JSON.stringify(examples)
        )
      }

      await client.query(
        `
        INSERT INTO curriculum_terms (
          term_id, normalized_key, display_word, display_reading, meanings, han_viet, examples, is_curated, updated_at
        ) VALUES ${termPlaceholders.join(', ')}
        ON CONFLICT (term_id) DO UPDATE SET
          normalized_key = EXCLUDED.normalized_key,
          display_word = EXCLUDED.display_word,
          display_reading = EXCLUDED.display_reading,
          meanings = EXCLUDED.meanings,
          han_viet = EXCLUDED.han_viet,
          examples = EXCLUDED.examples,
          is_curated = true,
          updated_at = NOW()
      `,
        termValues
      )

      // Batch insert course_terms
      const ctPlaceholders = []
      const ctValues = []
      let ctIdx = 1

      for (const w of slice) {
        const termId = `term:${w.curriculum_code}:${w.id}`
        const provenance = {
          source: 'nihongo.db',
          audioUrl: w.audio_url || '',
          posType: w.pos_type || '',
        }

        ctPlaceholders.push(`($${ctIdx++}, $${ctIdx++}, $${ctIdx++}, $${ctIdx++}, $${ctIdx++}, $${ctIdx++}, true, NOW())`)
        ctValues.push(w.curriculum_code, w.computedUnitId, termId, w.computedOrdinal, String(w.id), JSON.stringify(provenance))
      }

      await client.query(
        `
        INSERT INTO curriculum_course_terms (
          course_code, unit_id, term_id, ordinal, source_record_id, provenance, is_curated, updated_at
        ) VALUES ${ctPlaceholders.join(', ')}
        ON CONFLICT (course_code, unit_id, ordinal) DO UPDATE SET
          term_id = EXCLUDED.term_id,
          source_record_id = EXCLUDED.source_record_id,
          provenance = EXCLUDED.provenance,
          is_curated = true,
          updated_at = NOW()
      `,
        ctValues
      )

      const done = Math.min(i + BATCH_SIZE, enrichedWords.length)
      console.log(`[Seed] Progress: ${done}/${enrichedWords.length} words ingested...`)
    }

    await client.query('COMMIT')
    console.log('[Seed] Transaction committed successfully!')

    // Verify counts in Postgres
    const courseRes = await client.query('SELECT count(*) as c FROM curriculum_courses')
    const unitRes = await client.query('SELECT count(*) as c FROM curriculum_units')
    const termRes = await client.query('SELECT count(*) as c FROM curriculum_terms')
    const ctRes = await client.query('SELECT count(*) as c FROM curriculum_course_terms')

    console.log('--- Postgres Verification ---')
    console.log('curriculum_courses:', courseRes.rows[0].c)
    console.log('curriculum_units:', unitRes.rows[0].c)
    console.log('curriculum_terms:', termRes.rows[0].c)
    console.log('curriculum_course_terms:', ctRes.rows[0].c)
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('[Seed Error]:', err)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

seed()
