import { spawn } from 'node:child_process'
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export class TranscriptionProviderError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'TranscriptionProviderError'
    this.code = code
  }
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'ignore' })
    child.once('error', (error) => reject(error))
    child.once('exit', (code) => {
      if (code === 0) return resolve()
      reject(new TranscriptionProviderError('AUDIO_EXTRACTION_FAILED', `FFmpeg exited with code ${code}.`))
    })
  })
}

function parsePlaylistDurations(playlist) {
  return playlist
    .split(/\r?\n/)
    .filter((line) => line.startsWith('#EXTINF:'))
    .map((line) => Number.parseFloat(line.slice('#EXTINF:'.length)))
    .filter((duration) => Number.isFinite(duration) && duration > 0)
}

/**
 * Produces mono WAV PCM chunks so Faster-Whisper always receives a portable,
 * seekable audio container. Some FFmpeg builds write fragmented M4A segments
 * that are valid only through their playlist and cannot be decoded independently.
 * A temporary directory is intentionally used: the source video remains the durable record.
 */
export async function extractAudioChunks({ sourcePath, ffmpegPath = 'ffmpeg', chunkSeconds = 180 }) {
  const directory = await mkdtemp(join(tmpdir(), 'kotodama-transcript-'))
  const playlistPath = join(directory, 'chunks.m3u8')
  try {
    await run(ffmpegPath, [
      '-nostdin',
      '-v',
      'error',
      '-y',
      '-i',
      sourcePath,
      '-map',
      '0:a:0',
      '-vn',
      '-ac',
      '1',
      '-ar',
      '16000',
      '-c:a',
      'pcm_s16le',
      '-f',
      'segment',
      '-segment_time',
      String(chunkSeconds),
      '-reset_timestamps',
      '1',
      '-segment_list',
      playlistPath,
      '-segment_list_type',
      'm3u8',
      join(directory, 'chunk-%04d.wav'),
    ])
    const [names, playlist] = await Promise.all([readdir(directory), readFile(playlistPath, 'utf8')])
    const chunkNames = names.filter((name) => /^chunk-\d+\.wav$/.test(name)).sort()
    if (!chunkNames.length)
      throw new TranscriptionProviderError('AUDIO_TRACK_MISSING', 'Video does not contain an audio track.')
    const durations = parsePlaylistDurations(playlist)
    let offsetSeconds = 0
    const chunks = chunkNames.map((name, index) => {
      const chunk = { path: join(directory, name), name, offsetSeconds }
      offsetSeconds += durations[index] ?? chunkSeconds
      return chunk
    })
    return {
      directory,
      chunks,
      durationSeconds: offsetSeconds,
    }
  } catch (error) {
    await rm(directory, { recursive: true, force: true })
    if (error instanceof TranscriptionProviderError) throw error
    if (error?.code === 'ENOENT')
      throw new TranscriptionProviderError('FFMPEG_UNAVAILABLE', 'FFmpeg is unavailable on the media worker.')
    throw new TranscriptionProviderError('AUDIO_EXTRACTION_FAILED', 'Cannot extract audio from this video.')
  }
}

export async function removeExtractedAudio(directory) {
  await rm(directory, { recursive: true, force: true })
}

export function normalizeDiarizedTranscript(payload, offsetSeconds = 0) {
  const segments = Array.isArray(payload?.segments) ? payload.segments : []
  const normalized = segments
    .map((segment) => {
      const start = Number(segment.start)
      const end = Number(segment.end)
      const text = typeof segment.text === 'string' ? segment.text.trim() : ''
      if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start || !text) return null
      return {
        startMs: Math.round((offsetSeconds + start) * 1_000),
        endMs: Math.round((offsetSeconds + end) * 1_000),
        textJa: text,
        speakerLabel: typeof segment.speaker === 'string' && segment.speaker.trim() ? segment.speaker.trim() : null,
        speakerConfidence: null,
        confidence: null,
        tokens: normalizeTranscriptWords(segment.words, offsetSeconds, start, end),
      }
    })
    .filter(Boolean)
  if (!normalized.length)
    throw new TranscriptionProviderError(
      'TRANSCRIPT_EMPTY',
      'The transcription provider did not return usable timed segments.'
    )
  return normalized
}

function normalizeTranscriptWords(words, offsetSeconds, segmentStart, segmentEnd) {
  if (!Array.isArray(words)) return []
  return words
    .map((word, index) => {
      const start = Number(word?.start)
      const end = Number(word?.end)
      const surface = typeof word?.word === 'string' ? word.word.trim() : ''
      if (!surface || !Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null
      const boundedStart = Math.max(segmentStart, start)
      const boundedEnd = Math.min(segmentEnd, end)
      if (boundedEnd <= boundedStart) return null
      return {
        sequenceNo: index + 1,
        surface,
        reading: null,
        lemma: null,
        partOfSpeech: null,
        startMs: Math.round((offsetSeconds + boundedStart) * 1_000),
        endMs: Math.round((offsetSeconds + boundedEnd) * 1_000),
      }
    })
    .filter(Boolean)
}

export async function transcribeJapaneseAudioChunk({ filePath, fileName, config, fetchImpl = fetch }) {
  if (config?.provider === 'local_whisper')
    return transcribeJapaneseAudioWithLocalAsr({ filePath, fileName, config, fetchImpl })
  if (!config?.apiKey)
    throw new TranscriptionProviderError(
      'TRANSCRIPTION_PROVIDER_UNAVAILABLE',
      'The configured transcription provider is unavailable.'
    )
  if (config.provider === 'gemini') return transcribeJapaneseAudioWithGemini({ filePath, config, fetchImpl })
  return transcribeJapaneseAudioWithOpenAI({ filePath, fileName, config, fetchImpl })
}

async function transcribeJapaneseAudioWithLocalAsr({ filePath, fileName, config, fetchImpl }) {
  if (!config.localAsrUrl)
    throw new TranscriptionProviderError(
      'TRANSCRIPTION_PROVIDER_UNAVAILABLE',
      'Local ASR service URL is not configured.'
    )
  const audio = await readFile(filePath)
  const form = new FormData()
  form.set('file', new Blob([audio], { type: fileName.endsWith('.wav') ? 'audio/wav' : 'audio/mp4' }), fileName)
  const response = await fetchImpl(`${config.localAsrUrl}/v1/transcribe/japanese`, {
    method: 'POST',
    body: form,
    signal: AbortSignal.timeout(config.timeoutMs),
  })
  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new TranscriptionProviderError(
      'TRANSCRIPTION_PROVIDER_FAILED',
      `Local ASR request failed (${response.status}): ${detail.slice(0, 300)}`
    )
  }
  return response.json()
}

async function transcribeJapaneseAudioWithOpenAI({ filePath, fileName, config, fetchImpl }) {
  const audio = await readFile(filePath)
  const form = new FormData()
  form.set('model', config.model)
  form.set('language', 'ja')
  form.set('response_format', 'diarized_json')
  form.set('chunking_strategy', 'auto')
  form.set('file', new Blob([audio], { type: 'audio/mp4' }), fileName)
  const response = await fetchImpl('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.apiKey}` },
    body: form,
    signal: AbortSignal.timeout(config.timeoutMs),
  })
  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new TranscriptionProviderError(
      response.status === 429 ? 'TRANSCRIPTION_RATE_LIMITED' : 'TRANSCRIPTION_PROVIDER_FAILED',
      `OpenAI transcription request failed (${response.status}): ${detail.slice(0, 300)}`
    )
  }
  return response.json()
}

const geminiTranscriptSchema = {
  type: 'OBJECT',
  properties: {
    segments: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          start: { type: 'NUMBER' },
          end: { type: 'NUMBER' },
          text: { type: 'STRING' },
        },
        required: ['start', 'end', 'text'],
      },
    },
  },
  required: ['segments'],
}

function geminiResponseText(payload) {
  return payload?.candidates?.[0]?.content?.parts
    ?.map((part) => (typeof part?.text === 'string' ? part.text : ''))
    .join('')
    .trim()
}

async function transcribeJapaneseAudioWithGemini({ filePath, config, fetchImpl }) {
  const audio = await readFile(filePath)
  const response = await fetchImpl(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.model)}:generateContent?key=${encodeURIComponent(config.apiKey)}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: [
                  'Transcribe this Japanese audio chunk.',
                  'Return only the requested JSON. Split by natural utterance.',
                  'Return one short natural sentence or speech unit per segment; split at Japanese punctuation when possible.',
                  'Keep each segment under approximately 12 seconds and never merge multiple sentences into one segment.',
                  'start and end are seconds relative to this chunk and must be as accurate as possible.',
                  'Use Japanese text exactly as spoken. Do not translate. Do not invent speaker names.',
                ].join(' '),
              },
              { inline_data: { mime_type: 'audio/mp4', data: audio.toString('base64') } },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: geminiTranscriptSchema,
          temperature: 0,
        },
      }),
      signal: AbortSignal.timeout(config.timeoutMs),
    }
  )
  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new TranscriptionProviderError(
      response.status === 429 ? 'TRANSCRIPTION_RATE_LIMITED' : 'TRANSCRIPTION_PROVIDER_FAILED',
      `Gemini transcription request failed (${response.status}): ${detail.slice(0, 300)}`
    )
  }
  try {
    return JSON.parse(geminiResponseText(await response.json()) || '')
  } catch {
    throw new TranscriptionProviderError(
      'TRANSCRIPTION_PROVIDER_FAILED',
      'Gemini did not return valid transcript JSON.'
    )
  }
}
