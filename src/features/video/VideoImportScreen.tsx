import { useRef, useState } from 'react'
import { Button } from '../../components/ui'
import { getApiErrorMessage } from '../../lib/apiClient'
import { importYouTubeVideo, uploadLocalVideo } from './videoApi'
import type { MediaAsset, UploadProgress } from './videoTypes'
import { ArrowUpFromLine, FolderOpen, Link2, Zap } from 'lucide-react'

export default function VideoImportScreen({ onImport }: { onImport: (video: MediaAsset) => void }) {
  const [tab, setTab] = useState<'url' | 'file'>('file')
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<UploadProgress | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const importFile = async (file?: File) => {
    if (!file) return
    if (!file.type.startsWith('video/') && !/\.(mp4|webm|mov|ogv)$/i.test(file.name))
      return setError('Vui lòng chọn tệp video MP4, WebM, MOV hoặc OGV.')
    if (file.size > 2 * 1024 ** 3) return setError('Tệp vượt quá giới hạn 2 GB.')
    setError('')
    setProgress({ loaded: 0, total: file.size, percent: 0 })
    setUploading(true)
    try {
      const result = await uploadLocalVideo(file, setProgress)
      onImport(result.asset)
    } catch (uploadError) {
      setError(getApiErrorMessage(uploadError, 'Không thể tải video lên. Vui lòng thử lại.'))
    } finally {
      setUploading(false)
    }
  }
  const importUrl = async () => {
    try {
      const parsed = new URL(url)
      if (!/(^|\.)youtube\.com$|^youtu\.be$/i.test(parsed.hostname))
        return setError('Hiện chỉ hỗ trợ URL YouTube trong chế độ local.')
      setError('')
      setUploading(true)
      const result = await importYouTubeVideo(parsed.toString())
      onImport(result.asset)
    } catch (importError) {
      if (importError instanceof TypeError) setError('Đường dẫn video chưa hợp lệ.')
      else setError(getApiErrorMessage(importError, 'Không thể nhập video YouTube.'))
    } finally {
      setUploading(false)
    }
  }

  return (
    <section className="video-import-screen video-import-screen--showcase">
      <div className="video-import-orb video-import-orb--rose" />
      <div className="video-import-orb video-import-orb--violet" />
      <header className="video-import-showcase__header">
        <p className="video-import-showcase__badge">
          <Zap aria-hidden="true" size={15} /> NHẬP VIDEO AI
        </p>
        <h1>
          Nhập video để bắt đầu
          <br />
          học tiếng Nhật qua immersion
        </h1>
        <p>
          AI sẽ trích xuất bản ghi âm, thêm furigana, dịch phụ đề
          <br />
          và xây dựng bài học từ vựng + ngữ pháp hoàn chỉnh cho bạn.
        </p>
      </header>

      <div className="video-import-showcase__tabs" role="tablist" aria-label="Nguồn video">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'url'}
          className={tab === 'url' ? 'is-active' : ''}
          onClick={() => setTab('url')}
          disabled={uploading}
        >
          <Link2 aria-hidden="true" size={18} /> <span>YouTube / URL</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'file'}
          className={tab === 'file' ? 'is-active' : ''}
          onClick={() => setTab('file')}
          disabled={uploading}
        >
          <FolderOpen aria-hidden="true" size={18} /> <span>Tệp cục bộ</span>
        </button>
      </div>

      {tab === 'url' ? (
        <div className="video-import-showcase__panel">
          <label htmlFor="video-url" className="video-import-showcase__label">
            Đường dẫn video
          </label>
          <div className="video-import-showcase__url-row">
            <Link2 aria-hidden="true" size={19} />
            <input
              id="video-url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              inputMode="url"
            />
            <Button className="video-import-showcase__submit" onClick={() => void importUrl()} disabled={uploading}>
              {uploading ? 'Đang nhập…' : 'Nhập YouTube'}
            </Button>
          </div>
          <p className="video-import-showcase__hint">
            Local: video được tải riêng bằng yt-dlp, rồi xử lý transcript như tệp cục bộ.
          </p>
        </div>
      ) : (
        <button
          type="button"
          className={`video-import-showcase__dropzone${dragging ? ' is-dragging' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            void importFile(event.dataTransfer.files[0])
          }}
          disabled={uploading}
        >
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            hidden
            onChange={(event) => void importFile(event.target.files?.[0])}
          />
          <ArrowUpFromLine aria-hidden="true" size={36} />
          <strong>{uploading ? `Đang tải lên ${progress?.percent ?? 0}%` : 'Kéo thả hoặc chọn video'}</strong>
          <small>{uploading ? 'Không đóng trang cho đến khi tải xong.' : 'MP4, WebM, MOV, OGV · tối đa 2 GB'}</small>
        </button>
      )}
      {error && (
        <p className="video-import-showcase__error" role="alert">
          {error}
        </p>
      )}
    </section>
  )
}
