import assert from 'node:assert/strict'
import test from 'node:test'
import { assessAzurePronunciation, PronunciationProviderError } from './pronunciation-provider.mjs'

test('Azure pronunciation provider normalizes scores and phoneme evidence without exposing raw response', async () => {
  let request
  const result = await assessAzurePronunciation({
    audioPath: 'attempt.wav',
    referenceText: 'こんにちは。',
    config: { key: 'test-key', region: 'japaneast', timeoutMs: 1000 },
    readAudio: async () => Buffer.from('wav'),
    fetchImpl: async (url, options) => {
      request = { url, options }
      return {
        ok: true,
        json: async () => ({
          DisplayText: 'こんにちは。',
          NBest: [
            {
              Display: 'こんにちは。',
              PronunciationAssessment: {
                PronScore: 87.4,
                AccuracyScore: 89.1,
                FluencyScore: 81.2,
                CompletenessScore: 100,
              },
              Words: [
                {
                  Word: 'こんにちは',
                  PronunciationAssessment: { AccuracyScore: 89, ErrorType: 'None' },
                  Phonemes: [{ Phoneme: 'k', PronunciationAssessment: { AccuracyScore: 92 } }],
                },
              ],
            },
          ],
        }),
      }
    },
  })

  assert.equal(request.url.searchParams.get('language'), 'ja-JP')
  assert.equal(request.options.headers['Ocp-Apim-Subscription-Key'], 'test-key')
  assert.equal(result.accuracyScore, 89)
  assert.equal(result.fluencyScore, 81)
  assert.deepEqual(result.words, [
    { word: 'こんにちは', accuracyScore: 89, errorType: 'None', phonemes: [{ phoneme: 'k', accuracyScore: 92 }] },
  ])
})

test('Azure pronunciation provider fails closed when no credentials are configured', async () => {
  await assert.rejects(
    () => assessAzurePronunciation({ audioPath: 'attempt.wav', referenceText: 'こんにちは', config: {} }),
    (error) => error instanceof PronunciationProviderError && error.code === 'AZURE_PRONUNCIATION_NOT_CONFIGURED'
  )
})
