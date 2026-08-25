import { copyFile, open, mkdir, rename, rm, stat } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'

const MP4_SIGNATURE = Buffer.from('ftyp')
const WEBM_SIGNATURE = Buffer.from([0x1a, 0x45, 0xdf, 0xa3])
const OGG_SIGNATURE = Buffer.from('OggS')

export class MediaStorageError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'MediaStorageError'
    this.code = code
  }
}

function extensionForMime(mimeType) {
  if (mimeType === 'video/mp4') return '.mp4'
  if (mimeType === 'video/quicktime') return '.mov'
  if (mimeType === 'video/webm') return '.webm'
  if (mimeType === 'video/ogg') return '.ogv'
  return null
}

function detectMimeType(header) {
  if (header.subarray(0, 4).equals(WEBM_SIGNATURE)) return 'video/webm'
  if (header.subarray(0, 4).equals(OGG_SIGNATURE)) return 'video/ogg'
  if (header.length >= 8 && header.subarray(4, 8).equals(MP4_SIGNATURE)) return 'video/mp4'
  return null
}

function safeStorageKey(value) {
  if (!/^[0-9a-f-]{36}\/source-[0-9a-f-]{36}\.(mp4|mov|webm|ogv)$/i.test(value))
    throw new MediaStorageError('STORAGE_KEY_INVALID', 'Storage key is invalid.')
  return value
}

export class LocalMediaStorage {
  constructor({ rootPath, maxUploadBytes }) {
    this.rootPath = resolve(rootPath)
    this.maxUploadBytes = maxUploadBytes
  }

  absolutePath(storageKey) {
    return join(this.rootPath, ...safeStorageKey(storageKey).split('/'))
  }

  async writeUpload(assetId, request) {
    const contentLength = Number(request.headers['content-length'] ?? 0)
    if (!Number.isSafeInteger(contentLength) || contentLength < 0)
      throw new MediaStorageError('UPLOAD_LENGTH_INVALID', 'Invalid upload length.')
    if (contentLength > this.maxUploadBytes)
      throw new MediaStorageError('UPLOAD_TOO_LARGE', 'The upload exceeds the configured limit.')

    const tempPath = join(this.rootPath, assetId, `.upload-${randomUUID()}.part`)
    await mkdir(dirname(tempPath), { recursive: true })
    let size = 0
    const handle = await open(tempPath, 'wx')
    try {
      for await (const chunk of request) {
        size += chunk.length
        if (size > this.maxUploadBytes)
          throw new MediaStorageError('UPLOAD_TOO_LARGE', 'The upload exceeds the configured limit.')
        await handle.write(chunk)
      }
      if (!size) throw new MediaStorageError('UPLOAD_EMPTY', 'The upload is empty.')
    } catch (error) {
      await handle.close()
      await rm(tempPath, { force: true })
      throw error
    }
    await handle.close()

    try {
      const headerHandle = await open(tempPath, 'r')
      const header = Buffer.alloc(32)
      const { bytesRead } = await headerHandle.read(header, 0, header.length, 0)
      await headerHandle.close()
      const detectedMimeType = detectMimeType(header.subarray(0, bytesRead))
      if (!detectedMimeType)
        throw new MediaStorageError('UPLOAD_FORMAT_UNSUPPORTED', 'Only MP4, WebM, MOV, and OGV videos are accepted.')
      const extension = extensionForMime(detectedMimeType)
      const storageKey = `${assetId}/source-${randomUUID()}${extension}`
      await rename(tempPath, this.absolutePath(storageKey))
      return { storageKey, mimeType: detectedMimeType, byteSize: size }
    } catch (error) {
      await rm(tempPath, { force: true })
      throw error
    }
  }

  async inspect(storageKey) {
    const filePath = this.absolutePath(storageKey)
    const [file, handle] = await Promise.all([stat(filePath), open(filePath, 'r')])
    try {
      const header = Buffer.alloc(32)
      const { bytesRead } = await handle.read(header, 0, header.length, 0)
      const mimeType = detectMimeType(header.subarray(0, bytesRead))
      if (!mimeType) throw new MediaStorageError('UPLOAD_FORMAT_UNSUPPORTED', 'The stored video format is unsupported.')
      return { byteSize: file.size, mimeType }
    } finally {
      await handle.close()
    }
  }

  async importDownloadedVideo(assetId, sourcePath) {
    const temporaryKey = `${assetId}/source-${randomUUID()}.mp4`
    const destinationPath = this.absolutePath(temporaryKey)
    await mkdir(dirname(destinationPath), { recursive: true })
    await copyFile(sourcePath, destinationPath)
    try {
      const inspection = await this.inspect(temporaryKey)
      if (inspection.byteSize > this.maxUploadBytes)
        throw new MediaStorageError('YOUTUBE_VIDEO_TOO_LARGE', 'Video YouTube vượt quá dung lượng cho phép.')
      return { storageKey: temporaryKey, ...inspection }
    } catch (error) {
      await rm(destinationPath, { force: true })
      throw error
    }
  }
}

export function createMediaStorage(config) {
  return new LocalMediaStorage({ rootPath: config.media.storagePath, maxUploadBytes: config.media.maxUploadBytes })
}
