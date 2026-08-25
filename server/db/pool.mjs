import pg from 'pg'

const { Pool } = pg

function sslOptions() {
  if (process.env.DATABASE_SSL !== 'true') return undefined
  return { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false' }
}

export function createDatabasePool(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) return null

  const pool = new Pool({
    connectionString,
    ssl: sslOptions(),
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    application_name: 'kotodama-api',
  })

  pool.on('error', (error) => {
    console.error('PostgreSQL pool error:', error.message)
  })

  return pool
}

export async function databaseHealth(pool) {
  if (!pool) return { mode: 'memory', connected: false }
  const startedAt = performance.now()
  await pool.query('select 1')
  return { mode: 'postgresql', connected: true, latencyMs: Math.round(performance.now() - startedAt) }
}
