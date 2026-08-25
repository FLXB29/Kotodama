import assert from 'node:assert/strict'
import test from 'node:test'
import {
  hashPassword,
  safeEqual,
  signAccessToken,
  signPlaybackToken,
  validateEmail,
  validatePassword,
  verifyAccessToken,
  verifyPlaybackToken,
  verifyPassword,
} from './security.mjs'

test('passwords are salted and verified with constant-time comparison', async () => {
  const stored = await hashPassword('correct-horse-battery-staple')
  assert.match(stored, /^scrypt\$/)
  assert.equal(await verifyPassword('correct-horse-battery-staple', stored), true)
  assert.equal(await verifyPassword('not-the-password', stored), false)
})

test('playback tokens are asset-scoped, short-lived signed capabilities', () => {
  const secret = 'test-secret-that-is-long-enough'
  const token = signPlaybackToken({ userId: 'u1', assetId: 'asset-1', secret })
  assert.equal(verifyPlaybackToken(token, secret)?.assetId, 'asset-1')
  assert.equal(verifyPlaybackToken(`${token}x`, secret), null)
  assert.equal(
    verifyPlaybackToken(signPlaybackToken({ userId: 'u1', assetId: 'asset-1', secret, expiresIn: -1 }), secret),
    null
  )
})

test('access tokens reject expired or tampered claims', () => {
  const secret = 'test-secret-that-is-long-enough'
  const token = signAccessToken({ userId: 'u1', role: 'learner', secret })
  assert.equal(verifyAccessToken(token, secret)?.sub, 'u1')
  assert.equal(verifyAccessToken(`${token}x`, secret), null)
  assert.equal(
    verifyAccessToken(signAccessToken({ userId: 'u1', role: 'learner', secret, expiresIn: -1 }), secret),
    null
  )
})

test('input validation and CSRF comparison are strict', () => {
  assert.equal(validateEmail('person@example.com'), true)
  assert.equal(validateEmail('not-an-email'), false)
  assert.equal(validatePassword('12345678'), true)
  assert.equal(validatePassword('short'), false)
  assert.equal(safeEqual('csrf-token', 'csrf-token'), true)
  assert.equal(safeEqual('csrf-token', 'other'), false)
})
