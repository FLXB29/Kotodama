import assert from 'node:assert/strict'
import test from 'node:test'
import { analyzePcm16MonoWavQuality, AudioQualityError } from './audio-quality.mjs'

function pcmWav(samples) {
  const dataLength = samples.length * 2
  const wav = Buffer.alloc(44 + dataLength)
  wav.write('RIFF', 0)
  wav.writeUInt32LE(36 + dataLength, 4)
  wav.write('WAVE', 8)
  wav.write('fmt ', 12)
  wav.writeUInt32LE(16, 16)
  wav.writeUInt16LE(1, 20)
  wav.writeUInt16LE(1, 22)
  wav.writeUInt32LE(16_000, 24)
  wav.writeUInt32LE(32_000, 28)
  wav.writeUInt16LE(2, 32)
  wav.writeUInt16LE(16, 34)
  wav.write('data', 36)
  wav.writeUInt32LE(dataLength, 40)
  samples.forEach((sample, index) => wav.writeInt16LE(sample, 44 + index * 2))
  return wav
}

test('audio quality passes a voiced recording and exposes only measured signal metrics', () => {
  const samples = Array.from({ length: 16_000 }, (_, index) =>
    Math.round(8_000 * Math.sin((index / 16_000) * Math.PI * 2 * 220))
  )
  const quality = analyzePcm16MonoWavQuality(pcmWav(samples))
  assert.equal(quality.status, 'pass')
  assert.equal(quality.reason, null)
  assert.ok(quality.rmsDbfs > -20)
  assert.ok(quality.activeFrameRatio > 0.9)
})

test('audio quality marks silence and sustained clipping unscorable instead of grading them as pronunciation', () => {
  assert.equal(analyzePcm16MonoWavQuality(pcmWav(new Array(16_000).fill(0))).status, 'unscorable')
  const clipped = analyzePcm16MonoWavQuality(pcmWav(new Array(16_000).fill(32_767)))
  assert.equal(clipped.status, 'unscorable')
  assert.equal(clipped.reason, 'excessive_clipping')
})

test('audio quality rejects a WAV contract that was not normalized by the server', () => {
  const wav = pcmWav(new Array(16_000).fill(0))
  wav.writeUInt32LE(44_100, 24)
  assert.throws(() => analyzePcm16MonoWavQuality(wav), AudioQualityError)
})
