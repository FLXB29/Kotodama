import assert from 'node:assert/strict'
import test from 'node:test'
import { readConfig } from './config.mjs'

test('production configuration requires database, email and browser security settings', () => {
  assert.throws(() => readConfig({ NODE_ENV: 'production' }), /DATABASE_URL/)
  assert.throws(
    () =>
      readConfig({
        NODE_ENV: 'production',
        DATABASE_URL: 'postgresql://user:password@localhost:5432/kotodama',
        AUTH_JWT_SECRET: 'a-secret-with-at-least-thirty-two-characters',
        CORS_ORIGINS: 'https://app.example.com',
        APP_ORIGIN: 'https://app.example.com',
      }),
    /SMTP_HOST/
  )
})

test('YouTube import is opt-in locally and always disabled in production', () => {
  assert.equal(readConfig({}).youtube.enabled, false)
  assert.equal(readConfig({ YOUTUBE_IMPORT_ENABLED: 'true' }).youtube.enabled, true)
})

test('local Whisper ASR needs only its local service URL, not a cloud API key', () => {
  const config = readConfig({
    TRANSCRIPTION_PROVIDER: 'local_whisper',
    LOCAL_ASR_URL: 'http://127.0.0.1:8788',
    LOCAL_ASR_MODEL: 'large-v3',
  })
  assert.equal(config.transcription.enabled, true)
  assert.equal(config.transcription.provider, 'local_whisper')
  assert.equal(config.transcription.apiKey, undefined)
  assert.equal(config.transcription.localAsrUrl, 'http://127.0.0.1:8788')
})

test('production configuration accepts an explicit SMTP and trusted-proxy policy', () => {
  const config = readConfig({
    NODE_ENV: 'production',
    DATABASE_URL: 'postgresql://user:password@localhost:5432/kotodama',
    AUTH_JWT_SECRET: 'a-secret-with-at-least-thirty-two-characters',
    CORS_ORIGINS: 'https://app.example.com',
    APP_ORIGIN: 'https://app.example.com',
    SMTP_HOST: 'smtp.example.com',
    SMTP_FROM: 'Kotodama <no-reply@example.com>',
    MEDIA_STORAGE_PATH: '/var/lib/kotodama/media',
    TRUST_PROXY: 'true',
  })
  assert.equal(config.production, true)
  assert.equal(config.smtp.enabled, true)
  assert.equal(config.trustProxy, true)
  assert.match(config.media.storagePath, /kotodama[\\/]media$/)
  assert.equal(config.youtube.enabled, false)
})
