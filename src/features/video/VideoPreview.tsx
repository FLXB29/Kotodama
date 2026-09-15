import { useEffect, useState } from 'react'
import { API_BASE_URL, getApiErrorMessage } from '../../lib/apiClient'
import { Button } from '../../components/ui'
import { createPlaybackSession } from './videoApi'

export default function VideoPreview({ assetId }: { assetId: string }) {
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let active = true
    void createPlaybackSession(assetId)
      .then((session) => {
        if (active) {
          setError(null)
          setUrl(`${API_BASE_URL}${session.contentUrl}`)
        }
      })
      .catch((failure: unknown) => {
        if (active) setError(getApiErrorMessage(failure, 'Không thể mở video.'))
      })
    return () => {
      active = false
    }
  }, [assetId, attempt])
  return (
    <section aria-label="Xem video đã tải lên">
      {url ? (
        <video
          aria-label="Video đã tải lên"
          src={url}
          controls
          playsInline
          preload="metadata"
          style={{ width: '100%', maxHeight: '65vh', background: '#000' }}
          onError={() => setError('Không phát được video hoặc liên kết đã hết hạn. Hãy mở lại video.')}
        />
      ) : null}
      {error ? (
        <>
          <p role="alert">{error}</p>
          <Button onClick={() => setAttempt((value) => value + 1)}>Mở lại video</Button>
        </>
      ) : null}
    </section>
  )
}
