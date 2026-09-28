import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { readWavDurationMs, TranscriptionProviderError } from './transcription-provider.mjs'

function pcmWav({ sampleRate = 16_000, channels = 1, milliseconds = 1_250 } = {}) {
  const bytesPerSample = 2
  const byteRate = sampleRate * channels * bytesPerSample
  const dataLength = Math.round((byteRate * milliseconds) / 1_000)
  const wav = Buffer.alloc(44 + dataLength)
  wav.write('RIFF', 0)
  wav.writeUInt32LE(36 + dataLength, 4)
  wav.write('WAVE', 8)
  wav.write('fmt ', 12)
  wav.writeUInt32LE(16, 16)
  wav.writeUInt16LE(1, 20)
  wav.writeUInt16LE(channels, 22)
  wav.writeUInt32LE(sampleRate, 24)
  wav.writeUInt32LE(byteRate, 28)
  wav.writeUInt16LE(channels * bytesPerSample, 32)
  wav.writeUInt16LE(16, 34)
  wav.write('data', 36)
  wav.writeUInt32LE(dataLength, 40)
  return wav
}

test('readWavDurationMs reads PCM duration from WAV data, not client metadata', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'kotodama-wav-test-'))
  const filePath = join(directory, 'attempt.wav')
  try {
    await writeFile(filePath, pcmWav())
    assert.equal(await readWavDurationMs(filePath), 1_250)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test('readWavDurationMs rejects non-WAV data', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'kotodama-wav-test-'))
  const filePath = join(directory, 'attempt.wav')
  try {
    await writeFile(filePath, 'not audio')
    await assert.rejects(() => readWavDurationMs(filePath), TranscriptionProviderError)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
