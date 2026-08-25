import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { randomUUID } from 'node:crypto'

export class YouTubeProviderError extends Error {
  constructor(code, message, detail = null) {
    super(message)
    this.code = code
    this.detail = detail
  }
}

export function describeYouTubeDownloadFailure(detail) {
  const source = String(detail ?? '').trim()
  const normalized = source.toLowerCase()

  if (normalized.includes('this video is not available') || normalized.includes('video unavailable'))
    return new YouTubeProviderError(
      'YOUTUBE_VIDEO_UNAVAILABLE',
      'Video YouTube này không còn khả dụng. Có thể video đã bị gỡ, để riêng tư hoặc bị giới hạn khu vực/tài khoản.',
      source
    )
  if (normalized.includes('private video'))
    return new YouTubeProviderError(
      'YOUTUBE_VIDEO_PRIVATE',
      'Video YouTube đang ở chế độ riêng tư nên không thể nhập.',
      source
    )
  if (normalized.includes('sign in to confirm your age') || normalized.includes('age-restricted'))
    return new YouTubeProviderError(
      'YOUTUBE_VIDEO_AGE_RESTRICTED',
      'Video YouTube bị giới hạn độ tuổi nên không thể nhập tự động.',
      source
    )
  if (normalized.includes('sign in to confirm you') || normalized.includes('not a bot'))
    return new YouTubeProviderError(
      'YOUTUBE_ACCESS_RESTRICTED',
      'YouTube đang yêu cầu xác minh phiên truy cập. Hãy thử một video công khai khác hoặc cập nhật yt-dlp.',
      source
    )
  if (normalized.includes('members-only') || normalized.includes('members only'))
    return new YouTubeProviderError(
      'YOUTUBE_MEMBERS_ONLY',
      'Video này chỉ dành cho hội viên YouTube nên không thể nhập.',
      source
    )
  return new YouTubeProviderError(
    'YOUTUBE_DOWNLOAD_FAILED',
    'Không thể tải video từ YouTube. Hãy kiểm tra liên kết hoặc thử một video công khai khác.',
    source
  )
}

export function normalizeYouTubeUrl(value) {
  try {
    const url = new URL(String(value ?? '').trim())
    const hostname = url.hostname.toLowerCase()
    const supportedHost = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be'].includes(hostname)
    const videoId = hostname === 'youtu.be' ? url.pathname.slice(1) : url.searchParams.get('v')
    if (!supportedHost || !/^[A-Za-z0-9_-]{6,}$/.test(videoId ?? '')) return null
    return hostname === 'youtu.be'
      ? `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`
      : `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`
  } catch {
    return null
  }
}

function run(command, args, { timeoutMs }) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
    let stdout = ''
    let stderr = ''
    const timer = setTimeout(() => child.kill('SIGTERM'), timeoutMs)
    child.stdout.on('data', (chunk) => (stdout += chunk))
    child.stderr.on('data', (chunk) => (stderr += chunk))
    child.once('error', (error) => {
      clearTimeout(timer)
      reject(new YouTubeProviderError('YTDLP_UNAVAILABLE', `Không thể chạy yt-dlp: ${error.message}`))
    })
    child.once('close', (code) => {
      clearTimeout(timer)
      if (code === 0) return resolve({ stdout, stderr })
      reject(describeYouTubeDownloadFailure(stderr || `yt-dlp kết thúc với mã ${code}.`))
    })
  })
}

export async function downloadYouTubeVideo({ sourceUrl, config }) {
  const normalizedUrl = normalizeYouTubeUrl(sourceUrl)
  if (!normalizedUrl) throw new YouTubeProviderError('YOUTUBE_URL_INVALID', 'URL YouTube không hợp lệ.')
  const directory = await mkdtemp(join(tmpdir(), 'kotodama-youtube-'))
  const outputTemplate = join(directory, `${randomUUID()}.%(ext)s`)
  const ffmpegPath = config.transcription?.ffmpegPath
  const ffmpegLocation = /[\\/]/.test(ffmpegPath ?? '') ? dirname(ffmpegPath) : null
  try {
    const { stdout } = await run(
      config.youtube.ytdlpPath,
      [
        '--no-playlist',
        '--no-warnings',
        '--restrict-filenames',
        '--format',
        'bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/b',
        '--merge-output-format',
        'mp4',
        ...(ffmpegLocation ? ['--ffmpeg-location', ffmpegLocation] : []),
        '--print',
        '%(title)s',
        '--print',
        'after_move:filepath',
        '--output',
        outputTemplate,
        '--',
        normalizedUrl,
      ],
      { timeoutMs: config.youtube.timeoutMs }
    )
    const lines = stdout
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
    const filePath = lines.at(-1)
    const title = lines.at(-2)
    if (!filePath || !title)
      throw new YouTubeProviderError('YOUTUBE_DOWNLOAD_INVALID', 'yt-dlp không trả về video hợp lệ.')
    return { directory, filePath, title: title.slice(0, 200), sourceUrl: normalizedUrl }
  } catch (error) {
    await rm(directory, { recursive: true, force: true })
    throw error
  }
}

export async function removeDownloadedYouTubeVideo(directory) {
  if (directory) await rm(directory, { recursive: true, force: true })
}
