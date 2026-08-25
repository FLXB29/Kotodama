import { readFile, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const { Client, Pool } = pg
const migrationsDirectory = join(dirname(fileURLToPath(import.meta.url)), 'migrations')
const connectionString = process.env.DATABASE_URL

if (!connectionString) throw new Error('DATABASE_URL is required to run migrations.')

function sslOptions() {
  if (process.env.DATABASE_SSL !== 'true') return undefined
  return { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false' }
}

async function ensureDatabase() {
  const target = new URL(connectionString)
  const databaseName = decodeURIComponent(target.pathname.slice(1))
  if (!databaseName || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(databaseName))
    throw new Error('DATABASE_URL must contain a safe PostgreSQL database name.')

  const adminUrl = new URL(target)
  adminUrl.pathname = '/postgres'
  const client = new Client({ connectionString: adminUrl.toString(), ssl: sslOptions() })
  await client.connect()
  try {
    const result = await client.query('select 1 from pg_database where datname = $1', [databaseName])
    if (!result.rowCount) {
      await client.query(`create database "${databaseName}" encoding 'UTF8' template template0`)
      console.log(`Created PostgreSQL database ${databaseName}.`)
    }
  } finally {
    await client.end()
  }
}

async function migrate() {
  await ensureDatabase()
  const pool = new Pool({ connectionString, ssl: sslOptions(), application_name: 'kotodama-migrator' })
  const client = await pool.connect()
  try {
    await client.query(`
      create table if not exists schema_migrations (
        name text primary key,
        applied_at timestamptz not null default now()
      )
    `)
    await client.query("select pg_advisory_lock(hashtext('kotodama_schema_migrations'))")

    const migrationFiles = (await readdir(migrationsDirectory))
      .filter((name) => /^\d+_[a-z0-9_]+\.sql$/.test(name))
      .sort()
    const appliedRows = await client.query('select name from schema_migrations')
    const applied = new Set(appliedRows.rows.map((row) => row.name))

    for (const name of migrationFiles) {
      if (applied.has(name)) continue
      const sql = await readFile(join(migrationsDirectory, name), 'utf8')
      await client.query('begin')
      try {
        await client.query(sql)
        await client.query('insert into schema_migrations (name) values ($1)', [name])
        await client.query('commit')
        console.log(`Applied migration ${name}.`)
      } catch (error) {
        await client.query('rollback')
        throw error
      }
    }
  } finally {
    await client.query("select pg_advisory_unlock(hashtext('kotodama_schema_migrations'))").catch(() => {})
    client.release()
    await pool.end()
  }
}

await migrate()
