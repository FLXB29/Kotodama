import { apiPaths, requestApi } from '../../lib/apiClient'
import type {
  KanjiSummary,
  KanjiDetailData,
  BunpoItem,
  JlptExamSummary,
  JlptExamDetail,
  JlptSubmissionResult,
  JlptAttempt,
} from './nhaikanjiTypes'

export type KanjiListResponse = {
  items: KanjiSummary[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type BunpoListResponse = {
  items: BunpoItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const nhaikanjiApi = {
  async fetchKanjiList(
    params: {
      level?: string
      query?: string
      page?: number
      limit?: number
    } = {}
  ): Promise<KanjiListResponse> {
    const { level = 'ALL', query = '', page = 1, limit = 50 } = params
    return requestApi<KanjiListResponse>({
      method: 'GET',
      url: apiPaths.nhaikanji.kanjiList(level, query, page, limit),
    })
  },

  async fetchKanjiDetail(kanjiChar: string): Promise<KanjiDetailData> {
    return requestApi<KanjiDetailData>({
      method: 'GET',
      url: apiPaths.nhaikanji.kanjiDetail(kanjiChar),
    })
  },

  async fetchBunpoList(
    params: {
      level?: string
      bookId?: string
      query?: string
      page?: number
      limit?: number
    } = {}
  ): Promise<BunpoListResponse> {
    const { level = 'ALL', bookId = 'all', query = '', page = 1, limit = 50 } = params
    return requestApi<BunpoListResponse>({
      method: 'GET',
      url: apiPaths.nhaikanji.bunpoList(level, bookId, query, page, limit),
    })
  },

  async fetchJlptExams(
    params: {
      level?: string
      section?: string
    } = {}
  ): Promise<{ exams: JlptExamSummary[] }> {
    const { level = 'ALL', section = 'all' } = params
    return requestApi<{ exams: JlptExamSummary[] }>({
      method: 'GET',
      url: apiPaths.nhaikanji.jlptExams(level, section),
    })
  },

  async fetchJlptExamDetail(examId: string): Promise<JlptExamDetail> {
    return requestApi<JlptExamDetail>({
      method: 'GET',
      url: apiPaths.nhaikanji.jlptExamDetail(examId),
    })
  },

  async submitJlptExam(payload: {
    examId: string
    answers: Record<string, number | string>
  }): Promise<JlptSubmissionResult> {
    return requestApi<JlptSubmissionResult>({
      method: 'POST',
      url: apiPaths.nhaikanji.jlptSubmit,
      data: payload,
    })
  },

  async listJlptAttempts(level = 'N3'): Promise<{ attempts: JlptAttempt[] }> {
    return requestApi<{ attempts: JlptAttempt[] }>({ method: 'GET', url: apiPaths.nhaikanji.jlptAttempts(level) })
  },

  async createJlptAttempt(payload: { examId: string; level: string; mode?: 'exam' | 'review' }): Promise<JlptAttempt> {
    return requestApi<JlptAttempt>({ method: 'POST', url: apiPaths.nhaikanji.jlptAttempts(payload.level), data: payload })
  },

  async fetchJlptAttempt(attemptId: string): Promise<JlptAttempt> {
    return requestApi<JlptAttempt>({ method: 'GET', url: apiPaths.nhaikanji.jlptAttempt(attemptId) })
  },

  async saveJlptAttempt(
    attemptId: string,
    payload: Pick<JlptAttempt, 'answers' | 'currentQuestion' | 'remainingSeconds'>
  ): Promise<{ saved: boolean }> {
    return requestApi<{ saved: boolean }>({ method: 'PUT', url: apiPaths.nhaikanji.jlptAttempt(attemptId), data: payload })
  },

  async submitJlptAttempt(attemptId: string, answers: Record<string, number | string>): Promise<JlptSubmissionResult> {
    return requestApi<JlptSubmissionResult>({ method: 'POST', url: apiPaths.nhaikanji.jlptAttemptSubmit(attemptId), data: { answers } })
  },
}
