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

export type TranscriptSegment = {
  id: string
  sequenceNo: number
  speakerLabel: string | null
  speakerConfidence: number | null
  startMs: number
  endMs: number
  textJa: string
  textFurigana: string | null
  textVi: string | null
  confidence: number | null
  tokens: TranscriptToken[]
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

export type UploadProgress = { loaded: number; total: number; percent: number }
export type ListeningPreferences = { hideJp: boolean; hideFurigana: boolean; hideVi: boolean }
