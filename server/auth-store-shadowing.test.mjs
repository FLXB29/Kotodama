import assert from 'node:assert/strict'
import test from 'node:test'
import { createAuthStore } from './auth-store.mjs'

const ownerId = 'owner-1'
const otherUserId = 'owner-2'

function mediaAsset(id, ownerUserId) {
  return {
    id,
    ownerUserId,
    sourceType: 'user_upload',
    title: 'Owned Japanese video',
    language: 'ja',
    rightsBasis: 'owned',
    sourceReference: null,
    originalFilename: 'owned.mp4',
  }
}

test('shadowing targets are bound to the owner, ready transcript and its segment', async () => {
  const store = createAuthStore()
  await store.createMediaAsset(mediaAsset('asset-a', ownerId))
  await store.createMediaAsset(mediaAsset('asset-b', ownerId))
  const transcriptA = await store.saveMachineTranscript({
    mediaAssetId: 'asset-a',
    provider: 'test',
    segments: [
      {
        speakerLabel: null,
        startMs: 100,
        endMs: 1_800,
        textJa: 'こんにちは。',
        tokens: [],
      },
    ],
  })
  const transcriptB = await store.saveMachineTranscript({
    mediaAssetId: 'asset-b',
    provider: 'test',
    segments: [{ speakerLabel: null, startMs: 100, endMs: 1_800, textJa: 'さようなら。', tokens: [] }],
  })
  const segmentA = transcriptA.segments[0]

  assert.equal(
    await store.createShadowingSession({
      userId: otherUserId,
      mediaAssetId: 'asset-a',
      mode: 'sequential',
    }),
    null
  )
  assert.equal(
    await store.createShadowingSession({
      userId: ownerId,
      mediaAssetId: 'asset-a',
      transcriptVersionId: transcriptB.id,
      mode: 'sequential',
    }),
    null
  )

  const session = await store.createShadowingSession({
    userId: ownerId,
    mediaAssetId: 'asset-a',
    transcriptVersionId: transcriptA.id,
    mode: 'sequential',
  })
  assert.ok(session)
  const resolved = await store.resolveShadowingAttemptTarget(session.id, ownerId, segmentA.id)
  assert.equal(resolved?.segment.textJa, 'こんにちは。')
  assert.equal(await store.resolveShadowingAttemptTarget(session.id, otherUserId, segmentA.id), null)
  assert.equal(await store.resolveShadowingAttemptTarget(session.id, ownerId, transcriptB.segments[0].id), null)
})

test('a stale running media job is requeued before its maximum attempts are exhausted', async () => {
  const store = createAuthStore()
  await store.createMediaAsset(mediaAsset('asset-recovery', ownerId))
  await store.enqueueMediaProcessingJob('asset-recovery', 'upload_verify', { input: {}, provider: 'test' })
  const claimed = await store.claimNextMediaProcessingJob()
  assert.equal(claimed?.status, 'running')

  const recovered = await store.recoverStaleMediaProcessingJobs({ staleAfterMs: 0, now: Date.now() + 1 })
  assert.deepEqual(recovered, { requeued: 1, failed: 0 })
  const retried = await store.claimNextMediaProcessingJob()
  assert.equal(retried?.attemptCount, 2)
})
