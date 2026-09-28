import assert from 'node:assert/strict'
import test from 'node:test'
import { alignTokens, evaluateShadowingAttempt } from './shadowing-scorer.mjs'

test('alignTokens correctly identifies matching, missing, and extra words', () => {
  const ref = ['わたし', 'は', 'がくせい', 'です']
  const rec = ['わたし', 'は', 'がくせい', 'です']
  const alignments = alignTokens(ref, rec)
  assert.equal(alignments.length, 4)
  assert.ok(alignments.every((a) => a.status === 'correct'))
})

test('alignTokens detects missing and mispronounced words', () => {
  const ref = ['わたし', 'は', 'せんせい', 'です']
  const rec = ['わたし', 'は', 'がくせい']
  const alignments = alignTokens(ref, rec)
  assert.ok(alignments.some((a) => a.status === 'mispronounced' || a.status === 'missing'))
})

test('evaluateShadowingAttempt awards high score for exact match with good timing', () => {
  const result = evaluateShadowingAttempt({
    referenceText: '学校に行きます。',
    recognizedText: '学校に行きます',
    referenceDurationMs: 2000,
    userDurationMs: 2100,
  })
  assert.ok(result.overallScore >= 90)
  assert.ok(result.contentScore >= 95)
  assert.equal(result.timingScore, 100)
  assert.equal(result.scoringVersion, 'whisper_basic_v1')
  assert.ok(result.feedback.disclaimer.includes('chưa phải điểm phát âm âm vị'))
  assert.equal(result.pitchScore, null)
  assert.equal(result.pitchContour, undefined)
})

test('evaluateShadowingAttempt penalizes missing audio / empty transcript', () => {
  const result = evaluateShadowingAttempt({
    referenceText: 'おはようございます。',
    recognizedText: '',
    referenceDurationMs: 1500,
    userDurationMs: 0,
  })
  assert.equal(result.overallScore, 0)
  assert.equal(result.contentScore, 0)
  // With 0ms duration → "too short" message; with longer duration → "no voice" message
  assert.ok(
    result.feedback.summary.includes('Bài thu quá ngắn') ||
      result.feedback.summary.includes('Chưa phát hiện được giọng nói') ||
      result.feedback.summary.includes('chưa nhận rõ lời nói')
  )
})

test('evaluateShadowingAttempt penalizes speaking too slow or too fast', () => {
  const fastResult = evaluateShadowingAttempt({
    referenceText: 'こんにちは、元気ですか。',
    recognizedText: 'こんにちは、元気ですか。',
    referenceDurationMs: 4000,
    userDurationMs: 1000, // too fast
  })
  assert.ok(fastResult.timingScore < 100)
  assert.ok(fastResult.feedback.tips.some((t) => t.includes('nhanh')))
})

test('evaluateShadowingAttempt integrates DSP pitch comparison and outputs pitch contour', () => {
  const dspComparison = {
    pitchScore: 92,
    rhythmScore: 95,
    referenceContour: [{ timeMs: 0, f0Hz: 220, semitone: 0, voiced: true }],
    userContour: [{ timeMs: 0, f0Hz: 225, semitone: 0.38, voiced: true }],
    feedbackTips: ['Ngữ điệu và cao độ bám sát câu gốc.'],
  }
  const result = evaluateShadowingAttempt({
    referenceText: '初めまして、よろしくお願いします。',
    recognizedText: '初めまして、よろしくお願いします。',
    referenceDurationMs: 2500,
    userDurationMs: 2450,
    dspComparison,
  })
  assert.ok(result.overallScore >= 90)
  assert.equal(result.pitchScore, 92)
  assert.equal(result.timingScore, 95)
  assert.equal(result.scoringVersion, 'dsp_pitch_dtw_v2')
  assert.ok(result.pitchContour.reference.length === 1)
  assert.ok(result.pitchContour.user.length === 1)
  assert.ok(result.feedback.tips.includes('Ngữ điệu và cao độ bám sát câu gốc.'))
})

test('evaluateShadowingAttempt keeps the managed pronunciation baseline separate from local similarity', () => {
  const providerAssessment = {
    provider: 'azure_pronunciation_assessment',
    recognizedText: '学校に行きます',
    overallScore: 86,
    accuracyScore: 88,
    fluencyScore: 82,
    completenessScore: 100,
    words: [],
  }
  const result = evaluateShadowingAttempt({
    referenceText: '学校に行きます。',
    recognizedText: providerAssessment.recognizedText,
    referenceDurationMs: 2000,
    userDurationMs: 2100,
    providerAssessment,
  })
  assert.equal(result.providerAssessment, providerAssessment)
  assert.equal(result.feedback.providerAssessment, providerAssessment)
  assert.ok(result.feedback.disclaimer.includes('baseline dịch vụ ngoài'))
})
