import assert from 'node:assert/strict'
import test from 'node:test'
import { describeYouTubeDownloadFailure, normalizeYouTubeUrl } from './youtube-provider.mjs'

test('normalizes only a concrete YouTube watch URL', () => {
  assert.equal(normalizeYouTubeUrl('https://youtu.be/AbCdEF_1234?t=20'), 'https://www.youtube.com/watch?v=AbCdEF_1234')
  assert.equal(
    normalizeYouTubeUrl('https://www.youtube.com/watch?v=AbCdEF_1234&list=ignored'),
    'https://www.youtube.com/watch?v=AbCdEF_1234'
  )
  assert.equal(normalizeYouTubeUrl('https://example.com/watch?v=AbCdEF_1234'), null)
  assert.equal(normalizeYouTubeUrl('https://youtube.com/playlist?list=AbCdEF_1234'), null)
})

test('explains unavailable and restricted YouTube videos without exposing yt-dlp output', () => {
  const unavailable = describeYouTubeDownloadFailure('ERROR: [youtube] abc: This video is not available')
  assert.equal(unavailable.code, 'YOUTUBE_VIDEO_UNAVAILABLE')
  assert.match(unavailable.message, /không còn khả dụng/i)

  const privateVideo = describeYouTubeDownloadFailure('ERROR: [youtube] abc: Private video')
  assert.equal(privateVideo.code, 'YOUTUBE_VIDEO_PRIVATE')
  assert.match(privateVideo.message, /riêng tư/i)
})
