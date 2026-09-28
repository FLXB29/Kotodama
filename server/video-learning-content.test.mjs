import assert from 'node:assert/strict'
import test from 'node:test'
import { buildVideoLearningContent } from './video-learning-content.mjs'

test('learning content returns only dictionary-grounded vocabulary from transcript tokens', async () => {
  const queried = []
  const dictionary = {
    async getWordDetail(word) {
      queried.push(word)
      return word === '学校'
        ? { word: '学校', reading: 'がっこう', meanings: ['trường học'], jlpt: 'N5', partOfSpeech: 'noun' }
        : null
    },
  }
  const content = await buildVideoLearningContent({
    dictionary,
    transcript: {
      id: 'transcript-1',
      segments: [
        { id: 'segment-1', tokens: [{ surface: '学校' }, { surface: 'に' }] },
        { id: 'segment-2', tokens: [{ surface: '学校' }, { surface: '行く' }] },
      ],
    },
  })

  assert.deepEqual(queried, ['学校', '行く'])
  assert.deepEqual(content.vocabulary, [
    {
      word: '学校',
      reading: 'がっこう',
      meanings: ['trường học'],
      jlpt: 'N5',
      partOfSpeech: 'noun',
      occurrenceCount: 2,
      firstSegmentId: 'segment-1',
      segmentIds: ['segment-1', 'segment-2'],
    },
  ])
  assert.deepEqual(content.grammarAnnotations, [])
  assert.equal(content.provenance.grammar, 'unavailable')
})
