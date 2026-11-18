// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { JlptAttempt, JlptSubmissionResult } from './nhaikanjiTypes'
import {
  backupJlptAttemptProgress,
  finishJlptAttempt,
  generateLookupCode,
  getJlptAttempt,
  importJlptAttempt,
  listJlptAttempts,
  lookupJlptAttempt,
  saveJlptAttemptProgress,
  syncGuestAttemptsToUser,
} from './jlptAttempts'
import { nhaikanjiApi } from './nhaikanjiApi'

vi.mock('./nhaikanjiApi', () => ({
  nhaikanjiApi: {
    fetchJlptAttempt: vi.fn(),
    listJlptAttempts: vi.fn(),
    submitJlptAttempt: vi.fn(),
    saveJlptAttempt: vi.fn(),
    submitJlptExam: vi.fn(),
    lookupJlptAttempt: vi.fn(),
    syncJlptAttempts: vi.fn(),
  },
}))

const now = '2026-09-23T10:00:00.000Z'
const attempt = (status: JlptAttempt['status'] = 'in_progress'): JlptAttempt => ({
  id: 'b8ddf0e1-3f80-4cbe-8944-e3e9be387f45',
  examId: 'toan-n3-202512-full',
  level: 'N3',
  mode: 'exam',
  status,
  answers: { q1: 3 },
  currentQuestion: 0,
  remainingSeconds: 8000,
  startedAt: now,
  updatedAt: now,
})

const result: JlptSubmissionResult = {
  examId: 'toan-n3-202512-full',
  totalQuestions: 101,
  correctCount: 1,
  scorePercentage: 1,
  passed: false,
  questionResults: [],
}

describe('JLPT attempt persistence', () => {
  beforeEach(() => vi.clearAllMocks())

  it('opens a server attempt on a device with no local copy', async () => {
    vi.mocked(nhaikanjiApi.fetchJlptAttempt).mockResolvedValueOnce({ ...attempt('completed'), result })
    const found = await getJlptAttempt(attempt().id, 'signed-in-user')
    expect(nhaikanjiApi.fetchJlptAttempt).toHaveBeenCalledWith(attempt().id)
    expect(found?.status).toBe('completed')
    expect(found?.result?.scorePercentage).toBe(1)
  })

  it('never replaces a submitted local result with a stale progress write', async () => {
    vi.mocked(nhaikanjiApi.submitJlptExam).mockResolvedValueOnce(result)
    const draft = attempt()
    await finishJlptAttempt(draft, null, { q1: 3 })
    backupJlptAttemptProgress(draft, null, { answers: { q1: 1 }, currentQuestion: 1, remainingSeconds: 100 })
    await saveJlptAttemptProgress(draft, null, { answers: { q1: 1 }, currentQuestion: 1, remainingSeconds: 100 })
    const found = await getJlptAttempt(draft.id, null)
    expect(found?.status).toBe('completed')
    expect(found?.answers).toEqual({ q1: 3 })
    expect(found?.result?.scorePercentage).toBe(1)
  })

  it('keeps a completed server result when a newer local draft exists', async () => {
    const draft = { ...attempt(), persistence: 'server' as const }
    backupJlptAttemptProgress(draft, 'signed-in-user', {
      answers: { q1: 1 },
      currentQuestion: 1,
      remainingSeconds: 100,
    })
    vi.mocked(nhaikanjiApi.listJlptAttempts).mockResolvedValueOnce({
      attempts: [{ ...attempt('completed'), result }],
    })
    vi.mocked(nhaikanjiApi.fetchJlptAttempt).mockResolvedValueOnce({ ...attempt('completed'), result })
    const summaries = await listJlptAttempts('N3', 'signed-in-user')
    expect(summaries).toHaveLength(1)
    expect(summaries[0]?.status).toBe('completed')
    const found = await getJlptAttempt(draft.id, 'signed-in-user')
    expect(found?.status).toBe('completed')
    expect(found?.result?.scorePercentage).toBe(1)
    expect(nhaikanjiApi.saveJlptAttempt).not.toHaveBeenCalled()
  })

  it('generates a clean and formatted lookup code', () => {
    const code = generateLookupCode('N3')
    expect(code).toMatch(/^KT-N3-[2-9A-HJ-NP-Z]{5}$/)
  })

  it('syncs guest attempts to user account and calls API sync', async () => {
    vi.mocked(nhaikanjiApi.syncJlptAttempts).mockResolvedValueOnce({
      syncedCount: 1,
      attempts: [],
    })

    const guestAttempt = { ...attempt('completed'), lookupCode: 'KT-N3-TEST1', result }
    importJlptAttempt(guestAttempt, null)

    const syncedCount = await syncGuestAttemptsToUser('user-uuid-123')
    expect(syncedCount).toBe(1)
    expect(nhaikanjiApi.syncJlptAttempts).toHaveBeenCalled()

    const userAttempts = await listJlptAttempts('N3', 'user-uuid-123')
    expect(userAttempts.some((a) => a.id === guestAttempt.id)).toBe(true)
  })

  it('looks up an attempt locally or falls back to backend API', async () => {
    const remoteAttempt = { ...attempt('completed'), lookupCode: 'KT-N3-230784', result }
    vi.mocked(nhaikanjiApi.lookupJlptAttempt).mockResolvedValueOnce(remoteAttempt)

    const found = await lookupJlptAttempt('KT-N3-230784', null)
    expect(found).not.toBeNull()
    expect(found?.lookupCode).toBe('KT-N3-230784')
    expect(found?.result?.scorePercentage).toBe(1)
  })
})
