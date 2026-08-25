import { useState } from 'react'
import VideoImportScreen from './VideoImportScreen'
import type { MediaAsset, TranscriptVersion } from './videoTypes'
import VideoProcessingScreen from './VideoProcessingScreen'
import VideoStudyPlayer from './VideoStudyPlayer'

export default function VideoLearningPage() {
  const [video, setVideo] = useState<MediaAsset | null>(null)
  const [learningSession, setLearningSession] = useState<{ video: MediaAsset; transcript: TranscriptVersion } | null>(
    null
  )

  if (learningSession) return <VideoStudyPlayer {...learningSession} onBack={() => setLearningSession(null)} />
  if (!video) return <VideoImportScreen onImport={setVideo} />
  return (
    <VideoProcessingScreen
      video={video}
      onCancel={() => setVideo(null)}
      onReady={(readyVideo, transcript) => setLearningSession({ video: readyVideo, transcript })}
    />
  )
}
