export function parseRange(header, byteSize) {
  const match = /^bytes=(\d*)-(\d*)$/i.exec(String(header ?? ''))
  if (!match || (!match[1] && !match[2]) || !Number.isSafeInteger(byteSize) || byteSize <= 0) return null
  const first = match[1] ? Number(match[1]) : undefined
  const last = match[2] ? Number(match[2]) : undefined
  if ([first, last].some((value) => value !== undefined && (!Number.isSafeInteger(value) || value < 0))) return null
  if (first === undefined) {
    if (!last) return null
    return { start: Math.max(0, byteSize - last), end: byteSize - 1 }
  }
  const end = Math.min(last ?? byteSize - 1, byteSize - 1)
  return first <= end && first < byteSize ? { start: first, end } : null
}
