import assert from 'node:assert/strict'
import test from 'node:test'
import { autoMigrateAndSeed } from './db/auto-migrate-and-seed.mjs'
import { startMediaWorker } from './media-worker.mjs'

test('a migration failure aborts startup instead of hiding an unusable database', async () => {
  let released = false
  const client = {
    async query(sql) {
      if (sql.includes('CREATE TABLE')) throw new Error('migration permission denied')
      return { rows: [] }
    },
    release() {
      released = true
    },
  }
  await assert.rejects(autoMigrateAndSeed({ connect: async () => client }), /migration permission denied/)
  assert.equal(released, true)
})

test('embedded worker recovers from a polling failure and stops without waiting for another poll', async () => {
  let attempts = 0
  let observed
  const polled = new Promise((resolve) => {
    observed = resolve
  })
  const worker = startMediaWorker({
    store: {
      async claimNextMediaProcessingJob() {
        attempts += 1
        if (attempts === 1) throw new Error('temporary database disconnect')
        observed()
        return null
      },
    },
    config: { media: { workerPollMs: 10 } },
  })
  try {
    await polled
  } finally {
    await worker.stop()
  }
  assert.equal(attempts, 2)
})
