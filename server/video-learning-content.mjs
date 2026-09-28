const japaneseText = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u
const nonVocabulary = new Set([
  'は',
  'が',
  'を',
  'に',
  'で',
  'と',
  'の',
  'も',
  'へ',
  'や',
  'か',
  'ね',
  'よ',
  'ぞ',
  'さ',
])

/**
 * Builds view-model data only from the exact current transcript and the
 * bundled dictionary. It deliberately does not invent grammar or summary
 * content when no reviewed annotation pipeline exists yet.
 */
export async function buildVideoLearningContent({ transcript, dictionary, maxVocabulary = 80 }) {
  const candidates = new Map()
  for (const segment of transcript?.segments ?? []) {
    for (const token of segment.tokens ?? []) {
      const word = String(token?.lemma || token?.surface || '').trim()
      if (!word || nonVocabulary.has(word) || !japaneseText.test(word) || /^[、。！？!?ー]+$/u.test(word)) continue
      const current = candidates.get(word) ?? {
        word,
        occurrenceCount: 0,
        segmentIds: [],
        firstSegmentId: segment.id,
      }
      current.occurrenceCount += 1
      if (!current.segmentIds.includes(segment.id)) current.segmentIds.push(segment.id)
      candidates.set(word, current)
    }
  }

  const vocabulary = []
  const ordered = [...candidates.values()]
    .sort((left, right) => right.occurrenceCount - left.occurrenceCount || left.word.localeCompare(right.word, 'ja'))
    .slice(0, maxVocabulary)
  for (const candidate of ordered) {
    const detail = await dictionary.getWordDetail(candidate.word)
    if (!detail) continue
    vocabulary.push({
      word: detail.word,
      reading: detail.reading ?? null,
      meanings: Array.isArray(detail.meanings) ? detail.meanings : [],
      jlpt: detail.jlpt ?? null,
      partOfSpeech: detail.partOfSpeech ?? null,
      occurrenceCount: candidate.occurrenceCount,
      firstSegmentId: candidate.firstSegmentId,
      segmentIds: candidate.segmentIds,
    })
  }

  const segments = transcript?.segments ?? []
  return {
    transcriptVersionId: transcript?.id ?? null,
    vocabulary,
    grammarAnnotations: [],
    provenance: {
      vocabulary: 'dictionary_exact_lookup',
      grammar: 'unavailable',
      generatedAt: new Date().toISOString(),
      segmentCount: segments.length,
    },
  }
}
