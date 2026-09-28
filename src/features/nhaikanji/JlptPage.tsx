import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  Award,
  BookOpenCheck,
  BrainCircuit,
  CalendarDays,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  Headphones,
  Search,
} from 'lucide-react'
import { Button, Badge, Input } from '../../components/ui'
import { nhaikanjiApi } from './nhaikanjiApi'
import type { JlptAttempt, JlptExamSummary } from './nhaikanjiTypes'
import JlptExamTakingPage from './JlptExamTakingPage'
import { useAuth } from '../auth/authContext'
import { listJlptAttempts, startJlptAttempt } from './jlptAttempts'

type LevelMeta = {
  id: string
  title: string
  description: string
  tone: string
}

type LaunchState = { examId: string; mode: 'exam' | 'review' | 'result'; attemptId?: string }

const LEVELS: LevelMeta[] = [
  { id: 'N1', title: 'Đề mô phỏng N1', description: 'Trình độ cao nhất', tone: 'n1' },
  { id: 'N2', title: 'Đề mô phỏng N2', description: 'Trình độ nâng cao', tone: 'n2' },
  { id: 'N3', title: 'Đề mô phỏng N3', description: 'Trình độ trung cấp', tone: 'n3' },
  { id: 'N4', title: 'Đề mô phỏng N4', description: 'Trình độ sơ trung cấp', tone: 'n4' },
  { id: 'N5', title: 'Đề mô phỏng N5', description: 'Trình độ cơ bản', tone: 'n5' },
]

function getSessionMeta(session: JlptExamSummary['session']) {
  const raw = String(session ?? '').trim()
  if (raw === '1' || raw === '01' || raw === '7' || raw === '07') return { label: 'Kỳ 1', month: '07' }
  if (raw === '2' || raw === '02' || raw === '12') return { label: 'Kỳ 2', month: '12' }
  return { label: raw ? `Kỳ ${raw}` : 'Kỳ thi', month: raw || '—' }
}

function examYear(exam: Pick<JlptExamSummary, 'year'>) {
  return String(exam.year || '').match(/(?:19|20)\d{2}/)?.[0] || String(exam.year || '')
}

function getSessionKey(exam: Pick<JlptExamSummary, 'year' | 'session'>) {
  const meta = getSessionMeta(exam.session)
  return `${examYear(exam)}|${meta.month}`
}

function paperTitle(level: string, exam: Pick<JlptExamSummary, 'year' | 'session'>) {
  const session = getSessionMeta(exam.session)
  return `JLPT ${level} — Tháng ${session.month}, năm ${examYear(exam) || '—'}`
}

function sectionLabel(exam: JlptExamSummary) {
  if (exam.isFullMock || exam.section === 'full_mock') return 'Toàn đề'
  return exam.sectionLabel || 'Phần thi'
}

type SessionGroup = {
  key: string
  year: string
  sessionRaw: JlptExamSummary['session']
  meta: ReturnType<typeof getSessionMeta>
  representativeExam: JlptExamSummary
  fullMockExam?: JlptExamSummary | undefined
  sectionExams: JlptExamSummary[]
  allExams: JlptExamSummary[]
  hasListening: boolean
  inProgress: boolean
  completed: boolean
  latestScore?: number | undefined
}

function getSectionDetail(exam: JlptExamSummary) {
  const isVocab = exam.section === 'vocab' || exam.id.includes('-vocab')
  const isGrammarReading = exam.section === 'grammar-reading' || exam.id.includes('-grammar-reading')
  const isGrammar = exam.section === 'grammar'
  const isReading = exam.section === 'reading'
  const isListening = exam.section === 'listening' || exam.id.includes('-listening')

  if (isVocab) {
    return {
      partBadge: 'Phần 1',
      title: 'Từ vựng (文字・語彙)',
      jpTitle: '言語知識（文字・語彙）',
      icon: '🔤',
      defaultQuestions: 35,
      defaultMinutes: 30,
      description: 'Cách đọc Kanji, biểu thức từ vựng, từ đồng nghĩa và cách dùng từ trong câu.',
    }
  }
  if (isGrammarReading) {
    return {
      partBadge: 'Phần 2',
      title: 'Ngữ pháp & Đọc hiểu (文法・読解)',
      jpTitle: '文法・読解',
      icon: '📖',
      defaultQuestions: 38,
      defaultMinutes: 70,
      description: 'Ngữ pháp câu, ghép sao ★, đọc hiểu ngắn, trung, dài và bài tìm kiếm thông tin.',
    }
  }
  if (isGrammar) {
    return {
      partBadge: 'Phần 2A',
      title: 'Ngữ pháp (文法)',
      jpTitle: '文法',
      icon: '📝',
      defaultQuestions: 22,
      defaultMinutes: 30,
      description: 'Ngữ pháp câu, dấu sao ★ và bài điền từ vào đoạn văn.',
    }
  }
  if (isReading) {
    return {
      partBadge: 'Phần 2B',
      title: 'Đọc hiểu (読解)',
      jpTitle: '読解',
      icon: '📑',
      defaultQuestions: 16,
      defaultMinutes: 40,
      description: 'Đoạn văn ngắn, trung, dài và bài đọc tìm kiếm thông tin.',
    }
  }
  if (isListening) {
    return {
      partBadge: 'Phần 3',
      title: 'Nghe hiểu (聴解)',
      jpTitle: '聴解',
      icon: '🎧',
      defaultQuestions: 28,
      defaultMinutes: 40,
      description: 'Đầy đủ âm thanh chất lượng cao, tranh minh họa và bản chép lời (Script kèm dịch).',
    }
  }

  return {
    partBadge: exam.sectionLabel || 'Phần thi',
    title: exam.sectionLabel || 'Phần thi',
    jpTitle: exam.sectionLabelJP || 'JLPT',
    icon: '📋',
    defaultQuestions: exam.questionCount,
    defaultMinutes: exam.timeLimit,
    description: 'Rèn luyện kỹ năng theo định dạng chuẩn đề thi JLPT.',
  }
}

export function JlptPage() {
  const { user } = useAuth()
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null)
  const [launch, setLaunch] = useState<LaunchState | null>(null)
  const [query, setQuery] = useState('')
  const [yearFilter, setYearFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'not-started' | 'in-progress' | 'completed'>('all')
  const [answerMode, setAnswerMode] = useState(false)

  const examQuery = useQuery({
    queryKey: ['jlpt-exams', selectedLevel],
    queryFn: () => nhaikanjiApi.fetchJlptExams({ level: selectedLevel || 'N3' }),
    enabled: Boolean(selectedLevel),
  })

  const attemptsQuery = useQuery({
    queryKey: ['jlpt-attempts', selectedLevel, user?.id || 'guest'],
    queryFn: () => listJlptAttempts(selectedLevel || 'N3', user?.id),
    enabled: Boolean(selectedLevel),
  })

  const attemptsByExam = useMemo(() => {
    const grouped = new Map<string, JlptAttempt[]>()
    for (const attempt of attemptsQuery.data || []) {
      grouped.set(attempt.examId, [...(grouped.get(attempt.examId) || []), attempt])
    }
    return grouped
  }, [attemptsQuery.data])

  const launchExam = async (exam: JlptExamSummary) => {
    const attempt = await startJlptAttempt(exam.id, selectedLevel || 'N3', user?.id, exam.timeLimit)
    setLaunch({ examId: exam.id, mode: 'exam', attemptId: attempt.id })
    void attemptsQuery.refetch()
  }

  const sessionGroupsByYear = useMemo(() => {
    const allAvailable = (examQuery.data?.exams || []).filter((exam) => exam.available)
    const normalizedQuery = query.trim().toLocaleLowerCase()

    // 1. Group all available exams by year -> sessionKey
    const yearMap = new Map<string, Map<string, JlptExamSummary[]>>()

    for (const exam of allAvailable) {
      const y = examYear(exam) || 'Khác'
      const key = getSessionKey(exam)

      if (!yearMap.has(y)) {
        yearMap.set(y, new Map())
      }
      const sessionMap = yearMap.get(y)!
      sessionMap.set(key, [...(sessionMap.get(key) || []), exam])
    }

    // 2. Build normalized session groups per year (max 2 sessions per year: Kỳ 1 and Kỳ 2)
    const result: Array<[string, SessionGroup[]]> = []

    for (const [year, sessionMap] of yearMap.entries()) {
      if (yearFilter !== 'all' && year !== yearFilter) {
        continue
      }

      const sessions: SessionGroup[] = []

      for (const [key, exams] of sessionMap.entries()) {
        const rep = exams[0]
        if (!rep) continue
        const meta = getSessionMeta(rep.session)
        const fullMock = exams.find((e) => e.isFullMock || e.section === 'full_mock')
        const sections = exams.filter((e) => !e.isFullMock && e.section !== 'full_mock')

        let hasInProgress = false
        let hasCompleted = false
        let latestScore: number | undefined = undefined

        for (const e of exams) {
          const attempts = attemptsByExam.get(e.id) || []
          if (attempts[0]?.status === 'in_progress') hasInProgress = true
          const completedAttempts = attempts.filter((a) => a.status === 'completed')
          const firstCompleted = completedAttempts[0]
          if (firstCompleted) {
            hasCompleted = true
            if (latestScore === undefined) {
              latestScore = firstCompleted.result?.scorePercentage ?? firstCompleted.scorePercentage ?? 0
            }
          }
        }

        if (normalizedQuery) {
          const haystack = `${year} ${meta.label} ${meta.month} ${exams
            .map((e) => `${e.title || ''} ${sectionLabel(e)}`)
            .join(' ')}`.toLocaleLowerCase()
          if (!haystack.includes(normalizedQuery)) {
            continue
          }
        }

        if (statusFilter === 'not-started' && (hasInProgress || hasCompleted)) {
          continue
        }
        if (statusFilter === 'in-progress' && !hasInProgress) {
          continue
        }
        if (statusFilter === 'completed' && !hasCompleted) {
          continue
        }

        const hasListening = exams.some((e) => e.section === 'listening' || e.id.includes('-listening'))

        sessions.push({
          key,
          year,
          sessionRaw: rep.session,
          meta,
          representativeExam: rep,
          fullMockExam: fullMock,
          sectionExams: sections,
          allExams: exams,
          hasListening,
          inProgress: hasInProgress,
          completed: hasCompleted,
          latestScore,
        })
      }

      // Sort sessions ascending by month: Kỳ 1 (07) then Kỳ 2 (12)
      sessions.sort((a, b) => a.meta.month.localeCompare(b.meta.month))

      if (sessions.length > 0) {
        result.push([year, sessions])
      }
    }

    // Sort years descending (2025, 2024, 2023, ...)
    return result.sort(([a], [b]) => b.localeCompare(a, undefined, { numeric: true }))
  }, [attemptsByExam, examQuery.data?.exams, query, statusFilter, yearFilter])

  const years = useMemo(
    () =>
      [...new Set((examQuery.data?.exams || []).map(examYear).filter(Boolean))].sort((a, b) =>
        b.localeCompare(a, undefined, { numeric: true })
      ),
    [examQuery.data?.exams]
  )

  const currentPaper = useMemo(
    () => (examQuery.data?.exams || []).filter((exam) => getSessionKey(exam) === selectedPaper),
    [examQuery.data?.exams, selectedPaper]
  )

  if (launch) {
    return (
      <JlptExamTakingPage
        key={`${launch.examId}:${launch.attemptId || 'review'}:${launch.mode}`}
        examId={launch.examId}
        mode={launch.mode}
        attemptId={launch.attemptId}
        onBack={() => {
          setLaunch(null)
          void attemptsQuery.refetch()
        }}
      />
    )
  }

  if (!selectedLevel) {
    return (
      <main className="jlpt-page jlpt-level-page">
        <header className="jlpt-level-page__heading">
          <span>
            <GraduationCap size={22} aria-hidden="true" /> Luyện thi JLPT
          </span>
          <h1>Đề mô phỏng JLPT</h1>
          <p>Chọn cấp độ để xem các kỳ đề, làm từng phần hoặc học lại đáp án.</p>
        </header>

        <div className="jlpt-level-list" aria-label="Chọn cấp độ JLPT">
          {LEVELS.map((level) => (
            <button
              key={level.id}
              type="button"
              className={`jlpt-level-row jlpt-level-row--${level.tone}`}
              onClick={() => setSelectedLevel(level.id)}
            >
              <span className="jlpt-level-row__mark">{level.id}</span>
              <span className="jlpt-level-row__copy">
                <strong>{level.title}</strong>
                <small>{level.description}</small>
                <em>Xem các kỳ đề</em>
              </span>
              <ChevronRight aria-hidden="true" />
            </button>
          ))}
        </div>

        <article className="jlpt-ai-notice">
          <BrainCircuit size={21} aria-hidden="true" />
          <div>
            <strong>Đề AI</strong>
            <p>Đang chuẩn bị ngân hàng câu hỏi có kiểm duyệt. Chỉ mở khi nội dung và đáp án đã được rà soát.</p>
          </div>
          <Badge variant="secondary">Sắp mở</Badge>
        </article>
      </main>
    )
  }

  const representative = currentPaper[0]
  if (selectedPaper && representative) {
    const fullMockExam = currentPaper.find((e) => e.isFullMock || e.section === 'full_mock')

    // Find tailored section exams (prefer high-quality ToanSensei split from full mock)
    const vocabExam =
      currentPaper.find((e) => e.id.includes('-vocab') && e.id.startsWith('toan-')) ||
      currentPaper.find((e) => e.section === 'vocab' || e.id.includes('-vocab'))

    const grammarReadingExam =
      currentPaper.find((e) => e.id.includes('-grammar-reading') && e.id.startsWith('toan-')) ||
      currentPaper.find((e) => e.section === 'grammar-reading' || e.id.includes('-grammar-reading'))

    const listeningExam =
      currentPaper.find((e) => e.id.includes('-listening') && e.id.startsWith('toan-')) ||
      currentPaper.find((e) => e.section === 'listening' || e.id.includes('-listening'))

    // Collect only genuinely distinct remaining sections (avoid duplicate vocab/grammar/listening)
    const otherSections: JlptExamSummary[] = []
    for (const exam of currentPaper) {
      if (exam.isFullMock || exam.section === 'full_mock') continue
      if (exam.id === vocabExam?.id || exam.id === grammarReadingExam?.id || exam.id === listeningExam?.id) continue

      const isVocab = exam.section === 'vocab' || exam.id.includes('-vocab')
      const isGrammarReading = exam.section === 'grammar-reading' || exam.id.includes('-grammar-reading')
      const isListening = exam.section === 'listening' || exam.id.includes('-listening')

      // Deduplicate: If we already have this section type, don't show legacy duplicates
      if (isVocab && vocabExam) continue
      if (isGrammarReading && grammarReadingExam) continue
      if (isListening && listeningExam) continue
      if (grammarReadingExam && (exam.section === 'grammar' || exam.section === 'reading')) continue

      otherSections.push(exam)
    }

    const displaySections = [vocabExam, grammarReadingExam, listeningExam, ...otherSections].filter(
      Boolean
    ) as JlptExamSummary[]

    const fullMockAttempts = fullMockExam ? attemptsByExam.get(fullMockExam.id) || [] : []
    const fullMockInProgress = fullMockAttempts.find((a) => a.status === 'in_progress')
    const fullMockCompletedAttempts = fullMockAttempts.filter((a) => a.status === 'completed')
    const fullMockCompleted = fullMockCompletedAttempts[0]

    return (
      <main className="jlpt-page">
        <section className="jlpt-paper-picker">
          <button type="button" className="jlpt-back-button" onClick={() => setSelectedPaper(null)}>
            <ArrowLeft size={17} /> Quay lại danh sách kỳ đề
          </button>
          <header className="jlpt-paper-picker__heading">
            <span>{getSessionMeta(representative.session).label}</span>
            <h2>{paperTitle(selectedLevel, representative)}</h2>
            <p>
              Chọn thi thử trọn gói tính điểm 180 chuẩn JLPT, hoặc luyện tập riêng từng nội dung theo nhu cầu. 
              Bản chép lời nghe (Script) và giải thích chi tiết được hiển thị đầy đủ sau khi nộp bài hoặc trong chế độ học đáp án.
            </p>
          </header>

          {/* LỰA CHỌN 1: THI THỬ TRỌN GÓI (LÀM CẢ 3 PHẦN - 180 ĐIỂM) */}
          {fullMockExam && (
            <section className="jlpt-session-mode-section">
              <div className="jlpt-session-mode-heading">
                <span className="jlpt-session-mode-badge">LỰA CHỌN 1</span>
                <div>
                  <h3>Thi Thử Trọn Gói (Làm Cả 3 Phần — 180 Điểm)</h3>
                  <p>Phù hợp kiểm tra thực lực tổng quát, tính điểm đỗ/trượt theo 3 khối kiến thức chuẩn JLPT.</p>
                </div>
              </div>

              <article className="jlpt-fullmock-hero-card">
                <div className="jlpt-fullmock-hero-card__header">
                  <div className="jlpt-fullmock-hero-card__badges">
                    <span className="jlpt-badge-gold">
                      <Award size={15} /> 180 ĐIỂM CHUẨN JLPT
                    </span>
                    <Badge variant="primary">Thi thử trọn gói</Badge>
                    {fullMockInProgress && <span className="jlpt-status-pill in-progress">Đang làm dở</span>}
                    {!fullMockInProgress && fullMockCompleted && (
                      <span className="jlpt-status-pill completed">
                        Lần gần nhất · {fullMockCompleted.result?.scorePercentage ?? fullMockCompleted.scorePercentage ?? 0}%
                        {fullMockCompleted.result?.scaledTotalScore !== undefined
                          ? ` (${fullMockCompleted.result.scaledTotalScore}/180 điểm)`
                          : ''}
                      </span>
                    )}
                  </div>
                  <div className="jlpt-fullmock-hero-card__meta">
                    <span>
                      <Clock3 size={15} /> {fullMockExam.timeLimit} phút
                    </span>
                    <span>•</span>
                    <span>{fullMockExam.questionCount} câu hỏi (3 phần thi)</span>
                  </div>
                </div>

                <div className="jlpt-fullmock-hero-card__body">
                  <div className="jlpt-fullmock-hero-card__info">
                    <h4>Mô phỏng kỳ thi chính thức (総合模擬試験)</h4>
                    <p>
                      Làm bài liền mạch cả 3 phần: <strong>Từ vựng</strong> (35 câu),{' '}
                      <strong>Ngữ pháp & Đọc hiểu</strong> (38 câu) và <strong>Nghe hiểu</strong> (28 câu). Hệ thống
                      chấm điểm thang 180, xét điểm liệt từng phần và cấp chứng chỉ chuẩn CEFR.
                    </p>
                  </div>

                  <div className="jlpt-fullmock-hero-card__chips">
                    <div className="jlpt-chip">
                      <span className="jlpt-chip__num">1</span>
                      <div>
                        <strong>Từ vựng</strong>
                        <small>35 câu · 30p</small>
                      </div>
                    </div>
                    <div className="jlpt-chip">
                      <span className="jlpt-chip__num">2</span>
                      <div>
                        <strong>Ngữ pháp & Đọc hiểu</strong>
                        <small>38 câu · 70p</small>
                      </div>
                    </div>
                    <div className="jlpt-chip">
                      <span className="jlpt-chip__num">3</span>
                      <div>
                        <strong>Nghe hiểu</strong>
                        <small>28 câu · 40p</small>
                      </div>
                    </div>
                  </div>
                </div>

                {fullMockCompletedAttempts.length > 0 && (
                  <div className="jlpt-attempt-history">
                    <strong>Lịch sử thi trọn gói</strong>
                    {fullMockCompletedAttempts.slice(0, 3).map((attempt, index) => (
                      <button
                        key={attempt.id}
                        type="button"
                        onClick={() => setLaunch({ examId: fullMockExam.id, mode: 'result', attemptId: attempt.id })}
                      >
                        <span>
                          Lần {index + 1} · {new Date(attempt.finishedAt || attempt.updatedAt).toLocaleDateString('vi-VN')}
                        </span>
                        <b>
                          {attempt.result?.scaledTotalScore !== undefined
                            ? `${attempt.result.scaledTotalScore}/180 điểm`
                            : `${attempt.result?.scorePercentage ?? attempt.scorePercentage ?? 0}%`}
                        </b>
                      </button>
                    ))}
                    {fullMockCompletedAttempts.length > 3 && (
                      <details>
                        <summary>Xem thêm {fullMockCompletedAttempts.length - 3} lần làm</summary>
                        {fullMockCompletedAttempts.slice(3).map((attempt, index) => (
                          <button
                            key={attempt.id}
                            type="button"
                            onClick={() => setLaunch({ examId: fullMockExam.id, mode: 'result', attemptId: attempt.id })}
                          >
                            <span>
                              Lần {index + 4} ·{' '}
                              {new Date(attempt.finishedAt || attempt.updatedAt).toLocaleDateString('vi-VN')}
                            </span>
                            <b>
                              {attempt.result?.scaledTotalScore !== undefined
                                ? `${attempt.result.scaledTotalScore}/180 điểm`
                                : `${attempt.result?.scorePercentage ?? attempt.scorePercentage ?? 0}%`}
                            </b>
                          </button>
                        ))}
                      </details>
                    )}
                  </div>
                )}

                <div className="jlpt-fullmock-hero-card__actions">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setLaunch({ examId: fullMockExam.id, mode: 'review' })}
                  >
                    <BookOpenCheck size={16} /> Học đáp án toàn đề
                  </Button>
                  {fullMockInProgress ? (
                    <Button
                      size="sm"
                      onClick={() => setLaunch({ examId: fullMockExam.id, mode: 'exam', attemptId: fullMockInProgress.id })}
                    >
                      <FileText size={16} /> Tiếp tục
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => void launchExam(fullMockExam)}>
                      <FileText size={16} /> {fullMockCompleted ? 'Thi lại toàn đề' : 'Thi toàn đề'}
                    </Button>
                  )}
                </div>
              </article>
            </section>
          )}

          {/* LỰA CHỌN 2: LUYỆN TẬP RIÊNG TỪNG NỘI DUNG */}
          {displaySections.length > 0 && (
            <section className="jlpt-session-mode-section">
              <div className="jlpt-session-mode-heading">
                <span className="jlpt-session-mode-badge jlpt-session-mode-badge--secondary">
                  {fullMockExam ? 'LỰA CHỌN 2' : 'CÁC PHẦN THI'}
                </span>
                <div>
                  <h3>Luyện Tập Riêng Từng Nội Dung</h3>
                  <p>Chọn 1 trong các phần bên dưới để rèn luyện trọng tâm theo thời gian ngắn hơn.</p>
                </div>
              </div>

              <div className="jlpt-paper-picker__grid">
                {displaySections.map((exam) => {
                  const detail = getSectionDetail(exam)
                  const examAttempts = attemptsByExam.get(exam.id) || []
                  const inProgress = examAttempts.find((a) => a.status === 'in_progress')
                  const completedAttempts = examAttempts.filter((a) => a.status === 'completed')
                  const completed = completedAttempts[0]

                  return (
                    <article className="jlpt-paper-option jlpt-exam-card" key={exam.id}>
                      <div>
                        <Badge variant="secondary">{detail.partBadge}</Badge>
                        <span className="jlpt-paper-option__meta">
                          {inProgress ? (
                            <span className="jlpt-status-pill in-progress">Đang làm dở</span>
                          ) : completed ? (
                            <span className="jlpt-status-pill completed">
                              Gần nhất · {completed.result?.scorePercentage ?? completed.scorePercentage ?? 0}%
                            </span>
                          ) : (
                            <>
                              <Clock3 size={14} /> {exam.timeLimit || detail.defaultMinutes} phút
                            </>
                          )}
                        </span>
                      </div>

                      <div className="jlpt-section-card__body">
                        <div className="jlpt-section-card__title-row">
                          <span className="jlpt-section-card__icon">{detail.icon}</span>
                          <div>
                            <h3>{detail.title}</h3>
                            <p className="jlpt-section-card__jp-sub">{detail.jpTitle}</p>
                          </div>
                        </div>
                        <p className="jlpt-section-card__desc">
                          {exam.questionCount || detail.defaultQuestions} câu hỏi · {detail.description}
                        </p>
                      </div>

                      {completedAttempts.length > 0 && (
                        <div className="jlpt-attempt-history">
                          <strong>Lịch sử gần đây</strong>
                          {completedAttempts.slice(0, 2).map((attempt, index) => (
                            <button
                              key={attempt.id}
                              type="button"
                              onClick={() => setLaunch({ examId: exam.id, mode: 'result', attemptId: attempt.id })}
                            >
                              <span>
                                Lần {index + 1} ·{' '}
                                {new Date(attempt.finishedAt || attempt.updatedAt).toLocaleDateString('vi-VN')}
                              </span>
                              <b>{attempt.result?.scorePercentage ?? attempt.scorePercentage ?? 0}%</b>
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="jlpt-paper-option__actions">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setLaunch({ examId: exam.id, mode: 'review' })}
                        >
                          <BookOpenCheck size={16} /> Học đáp án
                        </Button>
                        {inProgress ? (
                          <Button
                            size="sm"
                            onClick={() => setLaunch({ examId: exam.id, mode: 'exam', attemptId: inProgress.id })}
                          >
                            <FileText size={16} /> Tiếp tục
                          </Button>
                        ) : (
                          <Button size="sm" onClick={() => void launchExam(exam)}>
                            <FileText size={16} /> {completed ? 'Làm lại phần này' : 'Làm phần này'}
                          </Button>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          )}
        </section>
      </main>
    )
  }

  return (
    <main className="jlpt-page jlpt-paper-list-page">
      <button type="button" className="jlpt-back-button" onClick={() => setSelectedLevel(null)}>
        <ArrowLeft size={17} /> Luyện thi JLPT
      </button>
      <header className="jlpt-paper-list-page__heading">
        <div>
          <span>Đề mô phỏng</span>
          <h1>{selectedLevel}</h1>
          <p>Mỗi năm gồm 2 kỳ thi (Tháng 7 & Tháng 12). Chọn kỳ thi để làm trọn gói 180 điểm hoặc làm riêng từng phần.</p>
        </div>
        <Button variant={answerMode ? 'secondary' : 'primary'} onClick={() => setAnswerMode((value) => !value)}>
          <BookOpenCheck size={17} /> {answerMode ? 'Quay lại làm đề' : 'Học đáp án các kỳ đề'}
        </Button>
      </header>

      <section className="jlpt-paper-filters" aria-label="Lọc kỳ đề">
        <label className="jlpt-search">
          <Search size={18} aria-hidden="true" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm theo năm, tháng hoặc phần thi"
          />
        </label>
        <div className="jlpt-filter-row">
          <label className="jlpt-year-select">
            <CalendarDays size={17} />
            <span className="sr-only">Chọn năm</span>
            <select value={yearFilter} onChange={(event) => setYearFilter(event.target.value)}>
              <option value="all">Tất cả năm</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
          <div className="jlpt-status-tabs" aria-label="Trạng thái làm đề">
            {[
              ['all', 'Tất cả'],
              ['not-started', 'Chưa làm'],
              ['in-progress', 'Đang làm'],
              ['completed', 'Đã làm'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={statusFilter === value ? 'is-active' : ''}
                onClick={() => setStatusFilter(value as typeof statusFilter)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>
      {!user && <p className="jlpt-local-history-note">Lịch sử khi chưa đăng nhập chỉ lưu trên thiết bị này.</p>}

      {examQuery.isLoading && (
        <div className="jlpt-grid" aria-label="Đang tải đề">
          {[0, 1, 2, 3].map((item) => (
            <div className="jlpt-exam-card--skeleton" key={item} />
          ))}
        </div>
      )}
      {examQuery.isError && (
        <section className="jlpt-empty">
          <FileText size={30} />
          <h2>Chưa tải được kỳ đề</h2>
          <p>Hãy thử tải lại trang sau ít phút.</p>
        </section>
      )}
      {!examQuery.isLoading &&
        !examQuery.isError &&
        sessionGroupsByYear.map(([year, sessions]) => (
          <section className="jlpt-year-group" key={year}>
            <h2>
              <CalendarDays size={18} /> {year}
            </h2>
            <div className="jlpt-paper-grid">
              {sessions.map((session) => (
                <button
                  type="button"
                  className="jlpt-session-card"
                  key={session.key}
                  onClick={() => setSelectedPaper(session.key)}
                >
                  <span className="jlpt-session-card__badge">{session.meta.label}</span>
                  <span className="jlpt-session-card__body">
                    <strong>
                      {session.meta.label} — tháng {session.meta.month}
                    </strong>
                    <small>
                      {answerMode
                        ? 'Mở lời giải và đáp án'
                        : session.fullMockExam
                          ? 'Thi thử trọn gói 180 điểm hoặc làm riêng 3 phần'
                          : `${session.representativeExam.questionCount} câu · ${sectionLabel(session.representativeExam)}`}
                    </small>
                    <em>
                      {session.inProgress ? 'Đang làm dở · ' : session.completed ? 'Đã làm · ' : ''}
                      {session.fullMockExam
                        ? '3 phần thi (Từ vựng, Ngữ pháp - Đọc hiểu, Nghe)'
                        : sectionLabel(session.representativeExam)}
                      {session.hasListening && (
                        <>
                          <span> · </span>
                          <Headphones size={13} aria-label="Có phần nghe" />
                        </>
                      )}
                    </em>
                  </span>
                  <ChevronRight aria-hidden="true" />
                </button>
              ))}
            </div>
          </section>
        ))}
      {!examQuery.isLoading && !examQuery.isError && sessionGroupsByYear.length === 0 && (
        <section className="jlpt-empty">
          <FileText size={30} />
          <h2>Chưa có kỳ đề phù hợp</h2>
          <p>
            {statusFilter !== 'all' && statusFilter !== 'not-started'
              ? 'Chưa có đề nào ở trạng thái này. Hãy chọn đề để bắt đầu một lần làm bài.'
              : 'Thử đổi bộ lọc hoặc chọn một cấp độ khác.'}
          </p>
        </section>
      )}
    </main>
  )
}

export default JlptPage
