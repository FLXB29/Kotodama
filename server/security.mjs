import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCallback)
const ACCESS_TOKEN_TTL_SECONDS = 60 * 15
const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 14

export const nowSeconds = () => Math.floor(Date.now() / 1000)
export const randomToken = (bytes = 32) => randomBytes(bytes).toString('base64url')
export const sha256 = (value) => createHmac('sha256', 'kotodama-token-hash').update(value).digest('hex')

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('base64url')
  const derived = await scrypt(password, salt, 64)
  return `scrypt$${salt}$${Buffer.from(derived).toString('base64url')}`
}

export async function verifyPassword(password, stored) {
  const [algorithm, salt, encoded] = String(stored).split('$')
  if (algorithm !== 'scrypt' || !salt || !encoded) return false
  const expected = Buffer.from(encoded, 'base64url')
  const derived = Buffer.from(await scrypt(password, salt, expected.length))
  return expected.length === derived.length && timingSafeEqual(expected, derived)
}

const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url')
const decode = (value) => JSON.parse(Buffer.from(value, 'base64url').toString('utf8'))

function signClaims(claims, secret) {
  const header = encode({ alg: 'HS256', typ: 'JWT' })
  const payload = encode(claims)
  const signature = createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url')
  return `${header}.${payload}.${signature}`
}

function verifyClaims(token, secret) {
  const [header, payload, signature] = String(token).split('.')
  if (!header || !payload || !signature) return null
  const expected = createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url')
  const received = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (received.length !== expectedBuffer.length || !timingSafeEqual(received, expectedBuffer)) return null
  try {
    return decode(payload)
  } catch {
    return null
  }
}

export function signAccessToken({ userId, role, tokenVersion = 0, secret, expiresIn = ACCESS_TOKEN_TTL_SECONDS }) {
  return signClaims({ sub: userId, role, ver: tokenVersion, iat: nowSeconds(), exp: nowSeconds() + expiresIn }, secret)
}

export function verifyAccessToken(token, secret) {
  const claims = verifyClaims(token, secret)
  return claims &&
    typeof claims.sub === 'string' &&
    typeof claims.role === 'string' &&
    Number.isInteger(claims.ver) &&
    claims.exp > nowSeconds()
    ? claims
    : null
}

export function signPlaybackToken({ userId, assetId, tokenVersion = 0, secret, expiresIn = 300 }) {
  return signClaims(
    {
      sub: userId,
      assetId,
      ver: tokenVersion,
      scope: 'media:playback',
      iat: nowSeconds(),
      exp: nowSeconds() + expiresIn,
    },
    secret
  )
}

export function verifyPlaybackToken(token, secret) {
  const claims = verifyClaims(token, secret)
  return claims &&
    claims.scope === 'media:playback' &&
    typeof claims.sub === 'string' &&
    typeof claims.assetId === 'string' &&
    Number.isInteger(claims.ver) &&
    claims.exp > nowSeconds()
    ? claims
    : null
}

export function safeEqual(left, right) {
  const a = Buffer.from(String(left ?? ''))
  const b = Buffer.from(String(right ?? ''))
  return a.length === b.length && timingSafeEqual(a, b)
}

export function validateEmail(value) {
  return typeof value === 'string' && /^\S+@\S+\.\S+$/.test(value) && value.length <= 254
}
export function validatePassword(value) {
  return typeof value === 'string' && value.length >= 8 && value.length <= 128
}
export const tokenTtl = { access: ACCESS_TOKEN_TTL_SECONDS, refresh: REFRESH_TOKEN_TTL_SECONDS }
