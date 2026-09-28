import { readFile } from 'node:fs/promises'

export class AudioQualityError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'AudioQualityError'
    this.code = code
  }
}

function readPcm16MonoWav(wav) {
  if (wav.length < 44 || wav.toString('ascii', 0, 4) !== 'RIFF' || wav.toString('ascii', 8, 12) !== 'WAVE') {
    throw new AudioQualityError('INVALID_WAV', 'Expected a RIFF/WAV audio file.')
  }

  let format = null
  let data = null
  for (let offset = 12; offset + 8 <= wav.length;) {
    const chunkId = wav.toString('ascii', offset, offset + 4)
    const chunkSize = wav.readUInt32LE(offset + 4)
    const contentStart = offset + 8
    const contentEnd = contentStart + chunkSize
    if (contentEnd > wav.length) break
    if (chunkId === 'fmt ' && chunkSize >= 16) {
      format = {
        audioFormat: wav.readUInt16LE(contentStart),
        channels: wav.readUInt16LE(contentStart + 2),
        sampleRate: wav.readUInt32LE(contentStart + 4),
        bitsPerSample: wav.readUInt16LE(contentStart + 14),
      }
    }
    if (chunkId === 'data') {
      data = wav.subarray(contentStart, contentEnd)
      break
    }
    offset = contentEnd + (chunkSize % 2)
  }

  if (!format || !data || data.length < 2 || data.length % 2 !== 0) {
    throw new AudioQualityError('INVALID_WAV', 'WAV file has no usable PCM data.')
  }
  if (
    format.audioFormat !== 1 ||
    format.channels !== 1 ||
    format.bitsPerSample !== 16 ||
    format.sampleRate !== 16_000
  ) {
    throw new AudioQualityError('UNEXPECTED_NORMALIZED_WAV', 'Expected 16 kHz mono PCM WAV after conversion.')
  }
  return data
}

/**
 * A conservative pre-inference gate for the server-normalized recording.
 * It does not estimate SNR or pronunciation; it only prevents near-silence
 * and sustained hard clipping from being turned into a zero score.
 */
export function analyzePcm16MonoWavQuality(wav) {
  const data = readPcm16MonoWav(wav)
  const sampleCount = data.length / 2
  const frameSamples = 320 // 20 ms at the canonical 16 kHz rate
  let sumSquares = 0
  let peak = 0
  let clippedSamples = 0
  let activeFrames = 0
  let frameSumSquares = 0
  let frameCount = 0

  for (let index = 0; index < sampleCount; index++) {
    const value = data.readInt16LE(index * 2) / 32_768
    const magnitude = Math.abs(value)
    sumSquares += value * value
    frameSumSquares += value * value
    peak = Math.max(peak, magnitude)
    if (magnitude >= 0.99) clippedSamples++
    frameCount++
    if (frameCount === frameSamples || index === sampleCount - 1) {
      const frameRms = Math.sqrt(frameSumSquares / frameCount)
      if (frameRms >= 0.01) activeFrames++
      frameSumSquares = 0
      frameCount = 0
    }
  }

  const rms = Math.sqrt(sumSquares / sampleCount)
  const rmsDbfs = rms > 0 ? 20 * Math.log10(rms) : -120
  const totalFrames = Math.ceil(sampleCount / frameSamples)
  const activeFrameRatio = activeFrames / Math.max(1, totalFrames)
  const clippingRatio = clippedSamples / sampleCount
  let status = 'pass'
  let reason = null

  if (rmsDbfs < -50 || activeFrameRatio < 0.03) {
    status = 'unscorable'
    reason = 'too_quiet_or_silent'
  } else if (clippingRatio > 0.02) {
    status = 'unscorable'
    reason = 'excessive_clipping'
  } else if (rmsDbfs < -40 || clippingRatio > 0.002) {
    status = 'warning'
    reason = rmsDbfs < -40 ? 'quiet_recording' : 'some_clipping'
  }

  return {
    status,
    reason,
    rmsDbfs: Math.round(rmsDbfs * 10) / 10,
    peak: Math.round(peak * 10_000) / 10_000,
    clippingRatio: Math.round(clippingRatio * 10_000) / 10_000,
    activeFrameRatio: Math.round(activeFrameRatio * 10_000) / 10_000,
  }
}

export async function analyzeWavAudioQuality(filePath) {
  return analyzePcm16MonoWavQuality(await readFile(filePath))
}
