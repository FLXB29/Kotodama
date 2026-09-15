import assert from 'node:assert/strict'
import test from 'node:test'
import { parseRange } from './media-range.mjs'

test('media ranges support seeking, open ends, and suffix requests from browsers', () => {
  assert.deepEqual(parseRange('bytes=10-19', 100), { start: 10, end: 19 })
  assert.deepEqual(parseRange('bytes=90-', 100), { start: 90, end: 99 })
  assert.deepEqual(parseRange('bytes=-10', 100), { start: 90, end: 99 })
  assert.deepEqual(parseRange('bytes=-200', 100), { start: 0, end: 99 })
  assert.deepEqual(parseRange('bytes=90-200', 100), { start: 90, end: 99 })
  for (const value of ['bytes=-', 'bytes=-0', 'bytes=100-', 'bytes=20-10', 'bytes=0-1,4-5', 'bytes=1e2-']) {
    assert.equal(parseRange(value, 100), null, value)
  }
  assert.equal(parseRange('bytes=0-', 0), null)
})
