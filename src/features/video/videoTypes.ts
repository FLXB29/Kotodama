export type MediaProcessingStatus = 'draft' | 'uploading' | 'queued' | 'processing' | 'ready' | 'failed' | 'cancelled'

export type MediaAsset = {
  id: string
  sourceType: 'user_upload' | 'catalog' | 'youtube'
  title: string
  language: 'ja'
  rightsBasis: 'owned' | 'licensed' | 'internal' | 'unknown'
  sourceReference: string | null
  originalFilename: string | null
  mimeType: string | null
  byteSize: number | null
  durationMs: number | null
  processingStatus: MediaProcessingStatus
  errorCode: string | null
  errorMessage: string | null
  createdAt: string
  updatedAt: string
}

export type MediaProcessingJob = {
  id: string
  mediaAssetId: string
  jobType: string
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled'
  attemptCount: number
  provider: string | null
  input: Record<string, unknown>
  output: Record<string, unknown>
  errorCode: string | null
  errorMessage: string | null
  startedAt: string | null
  finishedAt: string | null
  createdAt: string
  updatedAt: string
}

export type TranscriptChunk = {
  id: string
  sequenceNo: number
  text: string
  reading: string | null
  romaji: string | null
  startMs: number
  endMs: number
}

export type TranscriptSegment = {
  id: string
  sequenceNo: number
  speakerLabel: string | null
  speakerConfidence: number | null
  startMs: number
  endMs: number
  textJa: string
  textFurigana: string | null
  textRomaji?: string | null
  textVi: string | null
  confidence: number | null
  tokens: TranscriptToken[]
  chunks?: TranscriptChunk[]
}

export type TranscriptToken = {
  id: string
  sequenceNo: number
  surface: string
  reading: string | null
  lemma: string | null
  partOfSpeech: string | null
  startMs: number | null
  endMs: number | null
}

export type TranscriptVersion = {
  id: string
  mediaAssetId: string
  version: number
  language: 'ja'
  source: 'machine' | 'editor' | 'import'
  provider: string | null
  status: 'ready'
  qualityScore: number | null
  createdAt: string
  updatedAt: string
  segments: TranscriptSegment[]
}

export type VideoLearningVocabularyItem = {
  word: string
  reading: string | null
  meanings: string[]
  jlpt: string | null
  partOfSpeech: string | null
  occurrenceCount: number
  firstSegmentId: string
  segmentIds: string[]
}

export type VideoLearningContent = {
  transcriptVersionId: string | null
  vocabulary: VideoLearningVocabularyItem[]
  grammarAnnotations: []
  provenance: {
    vocabulary: 'dictionary_exact_lookup'
    grammar: 'unavailable'
    generatedAt: string
    segmentCount: number
  }
}

export type UploadProgress = { loaded: number; total: number; percent: number }
export type ListeningPreferences = { hideJp: boolean; hideFurigana: boolean; hideVi: boolean }

export type ShadowingSession = {
  id: string
  userId: string
  mediaAssetId: string
  transcriptVersionId: string | null
  mode: 'sequential' | 'random' | 'roleplay'
  selectedSpeakerLabel: string | null
  status: 'active' | 'completed' | 'cancelled'
  currentSegmentSequence: number
  startedAt: string
  completedAt: string | null
}

export type ShadowingTokenAlignment = {
  surface: string | null
  status: 'correct' | 'missing' | 'extra' | 'mispronounced'
  score?: number
  recognized: string | null
}

export type ShadowingScore = {
  shadowingAttemptId: string
  overallScore: number
  contentScore: number
  accuracyScore?: number
  fluencyScore?: number
  completenessScore?: number
  pronunciationScore: number
  timingScore: number
  prosodyScore: number | null
  confidence: number
  feedback: {
    summary: string
    tips: string[]
    durationRatio?: number
    userDurationMs?: number
    referenceDurationMs?: number
    disclaimer?: string
    providerAssessment?: ManagedPronunciationAssessment | null
    audioQuality?: ShadowingAudioQuality | null
  }
  scoringVersion: string
  createdAt: string
}

export type ShadowingAttempt = {
  id: string
  sessionId: string
  transcriptSegmentId: string
  attemptNo: number
  audioStorageKey: string | null
  durationMs: number | null
  recognizedText: string | null
  alignment: ShadowingTokenAlignment[]
  evaluatorProvider: string | null
  evaluationStatus: 'pending' | 'processing' | 'scored' | 'failed' | 'unscorable'
  createdAt: string
  score?: ShadowingScore | null
}

export type PitchPoint = {
  timeMs: number
  f0Hz: number | null
  semitone: number | null
  voiced: boolean
}

export type PitchContourData = {
  reference: PitchPoint[]
  user: PitchPoint[]
}

export type ManagedPronunciationAssessment = {
  provider: 'azure_pronunciation_assessment'
  recognizedText: string
  overallScore: number | null
  accuracyScore: number | null
  fluencyScore: number | null
  completenessScore: number | null
  words: Array<{
    word: string
    accuracyScore: number | null
    errorType: string | null
    phonemes: Array<{ phoneme: string; accuracyScore: number | null }>
  }>
}

export type ShadowingAudioQuality = {
  status: 'pass' | 'warning' | 'unscorable'
  reason: string | null
  rmsDbfs: number
  peak: number
  clippingRatio: number
  activeFrameRatio: number
}

export type ShadowingEvaluationResult = {
  attempt: ShadowingAttempt
  evaluation: {
    overallScore: number
    contentScore: number
    timingScore: number
    accuracyScore?: number
    fluencyScore?: number
    completenessScore?: number
    pronunciationScore: number
    pitchScore: number | null
    confidence: number
    alignment: ShadowingTokenAlignment[]
    pitchContour?: PitchContourData
    feedback: {
      summary: string
      tips: string[]
      durationRatio?: number
      userDurationMs?: number
      referenceDurationMs?: number
      disclaimer?: string
      providerAssessment?: ManagedPronunciationAssessment | null
      audioQuality?: ShadowingAudioQuality | null
    }
    providerAssessment?: ManagedPronunciationAssessment | null
    audioQuality?: ShadowingAudioQuality | null
    scoringVersion: string
  }
}
