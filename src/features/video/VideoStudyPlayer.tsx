import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Captions, CircleAlert, LoaderCircle, Play, UsersRound } from 'lucide-react'
import { Button, Card, PageShell } from '../../components/ui'
import { API_BASE_URL, getApiErrorMessage } from '../../lib/apiClient'
import { createPlaybackSession } from './videoApi'
import type { MediaAsset, TranscriptSegment, TranscriptVersion } from './videoTypes'

function formatTimestamp(milliseconds: number) {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000))
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

function findActiveSegment(segments: TranscriptSegment[], currentTimeMs: number) {
  return (
    segments.find((segment) => currentTimeMs >= segment.startMs && currentTimeMs < segment.endMs) ??
    [...segments].reverse().find((segment) => segment.startMs <= currentTimeMs) ??
    null
  )
}

type TimedTextToken = {
  text: string
  startMs: number
  endMs: number
}

function createTimedTokens(segment: TranscriptSegment, maxPhraseLength = 8): TimedTextToken[] {
  const exactTokens = segment.tokens
    .filter(
      (token) =>
        token.surface &&
        Number.isFinite(token.startMs) &&
        Number.isFinite(token.endMs) &&
        (token.endMs ?? 0) > (token.startMs ?? 0)
    )
    .sort((left, right) => (left.startMs ?? 0) - (right.startMs ?? 0))
  if (exactTokens.length) {
    const phrases: TimedTextToken[] = []
    let phrase: TimedTextToken | null = null
    for (const token of exactTokens) {
      const text = token.surface
      const startMs = token.startMs ?? segment.startMs
      const endMs = token.endMs ?? startMs
      if (!phrase) phrase = { text, startMs, endMs }
      else {
        phrase.text += text
        phrase.endMs = endMs
      }
      if (/[、。！？!?]$/u.test(text) || Array.from(phrase.text.replaceAll(/\s/gu, '')).length >= maxPhraseLength) {
        phrases.push(phrase)
        phrase = null
      }
    }
    if (phrase) phrases.push(phrase)
    return phrases
  }
  const text = segment.textJa.trim()
  if (!text) return []

  const wordUnits =
    typeof Intl.Segmenter === 'function'
      ? Array.from(new Intl.Segmenter('ja', { granularity: 'word' }).segment(text), ({ segment: token }) => token)
      : Array.from(text)
  const units: string[] = []
  let phrase = ''
  let phraseLength = 0

  for (const word of wordUnits) {
    phrase += word
    phraseLength += Array.from(word.replaceAll(/\s/gu, '')).length
    if (/[、。！？!?]$/u.test(word) || phraseLength >= maxPhraseLength) {
      units.push(phrase)
      phrase = ''
      phraseLength = 0
    }
  }
  if (phrase) units.push(phrase)

  const weights = units.map((token) => Math.max(1, Array.from(token.replaceAll(/\s/gu, '')).length))
  const totalWeight = weights.reduce((total, weight) => total + weight, 0)
  const totalDuration = Math.max(1, segment.endMs - segment.startMs)
  let completedWeight = 0

  return units.map((text, index) => {
    const weight = weights[index] ?? 1
    const startMs = segment.startMs + Math.round((totalDuration * completedWeight) / totalWeight)
    completedWeight += weight
    const isLast = index === units.length - 1
    const endMs = isLast ? segment.endMs : segment.startMs + Math.round((totalDuration * completedWeight) / totalWeight)
    return { text, startMs, endMs }
  })
}

export default function VideoStudyPlayer({
  video,
  transcript,
  onBack,
}: {
  video: MediaAsset
  transcript: TranscriptVersion
  onBack: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null)
  const [playbackError, setPlaybackError] = useState<string | null>(null)
  const [currentTimeMs, setCurrentTimeMs] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [speaker, setSpeaker] = useState('all')
  const [mediaDurationMs, setMediaDurationMs] = useState(video.durationMs)
  const timelineSegments = useMemo(() => {
    const maximumTimeMs = mediaDurationMs && mediaDurationMs > 0 ? mediaDurationMs : null
    return transcript.segments
      .flatMap((segment) =>
        createTimedTokens(segment, 36).map((part, index) => ({
          ...segment,
          id: `${segment.id}-${index}`,
          sequenceNo: segment.sequenceNo * 1_000 + index,
          startMs: part.startMs,
          endMs: part.endMs,
          textJa: part.text,
          tokens: segment.tokens.filter(
            (token) =>
              token.startMs !== null && token.endMs !== null && token.startMs < part.endMs && token.endMs > part.startMs
          ),
        }))
      )
      .filter((segment) => maximumTimeMs === null || segment.startMs < maximumTimeMs)
      .map((segment) =>
        maximumTimeMs === null ? segment : { ...segment, endMs: Math.min(segment.endMs, maximumTimeMs) }
      )
      .filter((segment) => segment.endMs > segment.startMs)
      .sort((left, right) => left.startMs - right.startMs || left.endMs - right.endMs)
  }, [mediaDurationMs, transcript.segments])

  useEffect(() => {
    let mounted = true
    void createPlaybackSession(video.id)
      .then((session) => {
        if (mounted) setPlaybackUrl(`${API_BASE_URL}${session.contentUrl}`)
      })
      .catch((error) => {
        if (mounted) setPlaybackError(getApiErrorMessage(error, 'Không thể tạo phiên phát video.'))
      })
    return () => {
      mounted = false
    }
  }, [video.id])

  const speakers = useMemo(
    () => [
      ...new Set(
        timelineSegments.map((segment) => segment.speakerLabel).filter((value): value is string => Boolean(value))
      ),
    ],
    [timelineSegments]
  )
  const visibleSegments = useMemo(
    () =>
      speaker === 'all' ? timelineSegments : timelineSegments.filter((segment) => segment.speakerLabel === speaker),
    [speaker, timelineSegments]
  )
  const activeSegment = findActiveSegment(timelineSegments, currentTimeMs)

  function jumpTo(segment: TranscriptSegment) {
    const player = videoRef.current
    if (!player) return
    player.currentTime = segment.startMs / 1000
    setCurrentTimeMs(segment.startMs)
    void player.play().catch(() => undefined)
  }

  return (
    <PageShell width="wide" className="video-study-page">
      <header className="video-study-header">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft aria-hidden="true" size={17} /> Video khác
        </Button>
        <div>
          <span className="video-study-eyebrow">
            <Captions aria-hidden="true" size={15} /> PHIÊN HỌC VIDEO
          </span>
          <h1>{video.title}</h1>
          <p>{timelineSegments.length} câu thoại đã được căn thời gian.</p>
        </div>
      </header>

      <section className="video-study-layout" aria-label="Trình phát và transcript video">
        <Card padding="none" className="video-study-player-card">
          <div className="video-study-player">
            {playbackUrl ? (
              <video
                ref={videoRef}
                controls
                preload="metadata"
                src={playbackUrl}
                onLoadedMetadata={(event) => {
                  const durationMs = Math.round(event.currentTarget.duration * 1_000)
                  if (Number.isFinite(durationMs) && durationMs > 0) setMediaDurationMs(durationMs)
                }}
                onTimeUpdate={(event) => setCurrentTimeMs(event.currentTarget.currentTime * 1000)}
                onRateChange={(event) => setPlaybackRate(event.currentTarget.playbackRate)}
              >
                Trình duyệt của bạn không hỗ trợ phát video này.
              </video>
            ) : playbackError ? (
              <div className="video-study-feedback" role="alert">
                <CircleAlert aria-hidden="true" size={30} />
                <p>{playbackError}</p>
              </div>
            ) : (
              <div className="video-study-feedback" aria-live="polite">
                <LoaderCircle aria-hidden="true" size={30} />
                <p>Đang tạo phiên phát video an toàn…</p>
              </div>
            )}
          </div>
          <div className="video-study-controls">
            <label>
              Tốc độ
              <select
                value={playbackRate}
                onChange={(event) => {
                  const nextRate = Number(event.target.value)
                  setPlaybackRate(nextRate)
                  if (videoRef.current) videoRef.current.playbackRate = nextRate
                }}
              >
                {[0.75, 1, 1.25, 1.5].map((rate) => (
                  <option key={rate} value={rate}>
                    {rate}×
                  </option>
                ))}
              </select>
            </label>
            {activeSegment ? (
              <Button variant="secondary" onClick={() => jumpTo(activeSegment)}>
                <Play aria-hidden="true" size={16} /> Phát lại câu đang chọn
              </Button>
            ) : null}
          </div>
        </Card>

        <Card padding="none" className="video-study-transcript">
          <header>
            <div>
              <span>
                <UsersRound aria-hidden="true" size={15} /> TRANSCRIPT
              </span>
              <h2>Lời thoại theo thời gian</h2>
            </div>
            {speakers.length > 1 ? (
              <label className="video-study-speaker-filter">
                Người nói
                <select value={speaker} onChange={(event) => setSpeaker(event.target.value)}>
                  <option value="all">Tất cả</option>
                  {speakers.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </header>
          <div className="video-study-segments" aria-live="polite">
            {visibleSegments.map((segment) => {
              const active = segment.id === activeSegment?.id
              const timedTokens = active ? createTimedTokens(segment) : []
              const highlightTimeMs = currentTimeMs + 80
              return (
                <button
                  key={segment.id}
                  type="button"
                  className={active ? 'is-active' : undefined}
                  onClick={() => jumpTo(segment)}
                  aria-current={active ? 'true' : undefined}
                >
                  <time>{formatTimestamp(segment.startMs)}</time>
                  <span className="video-study-segment-copy">
                    {segment.speakerLabel ? <small>{segment.speakerLabel}</small> : null}
                    <strong>
                      {active
                        ? timedTokens.map((token, index) => {
                            const state =
                              highlightTimeMs >= token.endMs
                                ? 'is-spoken'
                                : highlightTimeMs >= token.startMs
                                  ? 'is-speaking'
                                  : undefined
                            return (
                              <span key={`${token.startMs}-${index}`} className={state}>
                                {token.text}
                              </span>
                            )
                          })
                        : segment.textJa}
                    </strong>
                  </span>
                </button>
              )
            })}
          </div>
        </Card>
      </section>
    </PageShell>
  )
}
