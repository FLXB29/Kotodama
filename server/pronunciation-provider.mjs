import { readFile } from 'node:fs/promises'

export class PronunciationProviderError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'PronunciationProviderError'
    this.code = code
  }
}

function score(value) {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? Math.max(0, Math.min(100, Math.round(numeric))) : null
}

function normalizeWord(word) {
  const assessment = word?.PronunciationAssessment ?? {}
  const phonemes = Array.isArray(word?.Phonemes)
    ? word.Phonemes.map((phoneme) => ({
        phoneme: phoneme.Phoneme ?? null,
        accuracyScore: score(phoneme?.PronunciationAssessment?.AccuracyScore),
      })).filter((phoneme) => phoneme.phoneme)
    : []
  return {
    word: word?.Word ?? '',
    accuracyScore: score(assessment.AccuracyScore),
    errorType: assessment.ErrorType ?? null,
    phonemes,
  }
}

/**
 * Calls Azure's documented short-audio Speech endpoint. The input must be the
 * server-generated 16 kHz PCM WAV, never the browser blob. Raw provider JSON
 * is intentionally discarded; callers receive a small stable contract only.
 */
export async function assessAzurePronunciation({
  audioPath,
  referenceText,
  config,
  fetchImpl = fetch,
  readAudio = readFile,
}) {
  if (!config?.key || !config?.region) {
    throw new PronunciationProviderError('AZURE_PRONUNCIATION_NOT_CONFIGURED', 'Azure pronunciation is not configured.')
  }
  const text = String(referenceText ?? '').trim()
  if (!text) throw new PronunciationProviderError('AZURE_REFERENCE_TEXT_REQUIRED', 'Reference text is required.')

  const endpoint = new URL(
    `https://${config.region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1`
  )
  endpoint.searchParams.set('language', 'ja-JP')
  endpoint.searchParams.set('format', 'detailed')
  const assessmentHeader = Buffer.from(
    JSON.stringify({
      ReferenceText: text,
      GradingSystem: 'HundredMark',
      Granularity: 'Phoneme',
      EnableMiscue: true,
    }),
    'utf8'
  ).toString('base64')
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs ?? 15_000)
  try {
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Ocp-Apim-Subscription-Key': config.key,
        'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000',
        Accept: 'application/json',
        'Pronunciation-Assessment': assessmentHeader,
      },
      body: await readAudio(audioPath),
    })
    if (!response.ok) {
      throw new PronunciationProviderError(
        'AZURE_PRONUNCIATION_REQUEST_FAILED',
        `Azure pronunciation request failed (${response.status}).`
      )
    }
    const payload = await response.json()
    const best = Array.isArray(payload.NBest) ? payload.NBest[0] : null
    if (!best) {
      return {
        provider: 'azure_pronunciation_assessment',
        recognizedText: payload.DisplayText ?? '',
        overallScore: null,
        accuracyScore: null,
        fluencyScore: null,
        completenessScore: null,
        words: [],
      }
    }
    const assessment = best.PronunciationAssessment ?? {}
    return {
      provider: 'azure_pronunciation_assessment',
      recognizedText: best.Display ?? best.Lexical ?? payload.DisplayText ?? '',
      overallScore: score(assessment.PronScore),
      accuracyScore: score(assessment.AccuracyScore),
      fluencyScore: score(assessment.FluencyScore),
      completenessScore: score(assessment.CompletenessScore),
      words: Array.isArray(best.Words) ? best.Words.map(normalizeWord).filter((word) => word.word) : [],
    }
  } catch (error) {
    if (error instanceof PronunciationProviderError) throw error
    if (error?.name === 'AbortError') {
      throw new PronunciationProviderError('AZURE_PRONUNCIATION_TIMEOUT', 'Azure pronunciation timed out.')
    }
    throw new PronunciationProviderError('AZURE_PRONUNCIATION_UNAVAILABLE', 'Azure pronunciation is unavailable.')
  } finally {
    clearTimeout(timeout)
  }
}
