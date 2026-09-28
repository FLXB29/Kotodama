export const normalizeChoiceText = (value, expectedChoiceNumber = null) => {
  let normalized = String(value ?? '').normalize('NFKC')
  if (expectedChoiceNumber !== null) {
    const label = String(expectedChoiceNumber)
    normalized = normalized
      .replace(new RegExp(`^\\s*${label}[.)．、]\\s*`, 'u'), '')
      .replace(new RegExp(`^\\s*${label}\\s+`, 'u'), '')
  }
  return normalized.replace(/\s+/gu, '').trim()
}
