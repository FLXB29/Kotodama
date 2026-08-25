import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button, Card, PageShell, Textarea } from '../../components/ui'
import type { Page } from '../../types/app'
import {
  ACTIVE_LEARNING_LANGUAGE,
  LEARNING_LANGUAGES,
  LEARNING_LEVELS,
  type LearningLanguage,
  type LearningLevel,
  type LearningPlan,
  useLearningPlan,
} from './learningPlan'

const levels = Object.entries(LEARNING_LEVELS) as Array<[LearningLevel, string]>
const wordGoals = [10, 20, 30, 50]
const minuteGoals = [10, 20, 30, 45]

export default function OnboardingPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [savedPlan, setSavedPlan] = useLearningPlan()
  const [step, setStep] = useState(1)
  const [language] = useState<LearningLanguage>(ACTIVE_LEARNING_LANGUAGE)
  const [level, setLevel] = useState<LearningLevel>(savedPlan?.level ?? 'beginner')
  const [dailyWords, setDailyWords] = useState(savedPlan?.dailyWords ?? 20)
  const [dailyMinutes, setDailyMinutes] = useState(savedPlan?.dailyMinutes ?? 20)
  const [reason, setReason] = useState(savedPlan?.reason ?? '')
  const complete = () => {
    const plan: LearningPlan = {
      language,
      level,
      dailyWords,
      dailyMinutes,
      reason: reason.trim(),
      startedAt: savedPlan?.startedAt ?? new Date().toISOString(),
    }
    setSavedPlan(plan)
    onNavigate('home')
  }

  return (
    <PageShell width="wide" className="onboarding-page">
      <div className="onboarding-intro">
        <span>{savedPlan ? 'ĐIỀU CHỈNH LỘ TRÌNH' : 'BẮT ĐẦU HÀNH TRÌNH'}</span>
        <h1>{savedPlan ? 'Tinh chỉnh nhịp học của bạn' : 'Tạo lộ trình học riêng'}</h1>
        <p>Chỉ mất một phút. Bạn luôn có thể đổi các lựa chọn này trong Cài đặt.</p>
      </div>
      <div className="onboarding-progress" aria-label={`Bước ${step} trên 3`}>
        {[1, 2, 3].map((index) => (
          <span className={index <= step ? 'is-active' : ''} key={index}>
            {index}
          </span>
        ))}
      </div>
      <Card padding="lg" className="onboarding-card">
        {step === 1 && (
          <>
            <StepHeading
              title="Bạn muốn học ngôn ngữ nào?"
              description="Tiếng Nhật đang là lộ trình duy nhất được mở trong giai đoạn hiện tại."
            />
            <div className="onboarding-language-grid">
              <div className="onboarding-language is-selected" aria-label="Tiếng Nhật đang được chọn">
                <span>{LEARNING_LANGUAGES[ACTIVE_LEARNING_LANGUAGE].flag}</span>
                <strong>{LEARNING_LANGUAGES[ACTIVE_LEARNING_LANGUAGE].label}</strong>
                <small>{LEARNING_LANGUAGES[ACTIVE_LEARNING_LANGUAGE].native}</small>
              </div>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <StepHeading
              title="Bạn đang ở cấp độ nào?"
              description="Chọn gần đúng nhất; lộ trình vẫn có thể được điều chỉnh sau."
            />
            <div className="onboarding-option-grid">
              {levels.map(([id, label]) => (
                <button
                  type="button"
                  className={`onboarding-option ${level === id ? 'is-selected' : ''}`}
                  onClick={() => setLevel(id)}
                  aria-pressed={level === id}
                  key={id}
                >
                  {label}
                </button>
              ))}
            </div>
            <StepHeading title="Nhịp học mong muốn" description="Mục tiêu nên đủ nhẹ để bạn duy trì mỗi ngày." />
            <div className="onboarding-goal-row">
              <GoalPicker
                label="Từ mới mỗi ngày"
                values={wordGoals}
                value={dailyWords}
                suffix="từ"
                onChange={setDailyWords}
              />
              <GoalPicker
                label="Thời gian mỗi ngày"
                values={minuteGoals}
                value={dailyMinutes}
                suffix="phút"
                onChange={setDailyMinutes}
              />
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <StepHeading
              title="Điều gì khiến bạn muốn học?"
              description="Không bắt buộc — câu trả lời giúp lộ trình của bạn rõ ràng hơn."
            />
            <Textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Ví dụ: Tôi muốn hiểu anime mà không cần phụ đề."
              rows={4}
            />
            <div className="onboarding-summary">
              <span>{LEARNING_LANGUAGES[language].flag}</span>
              <div>
                <strong>
                  {LEARNING_LANGUAGES[language].label} · {LEARNING_LEVELS[level]}
                </strong>
                <p>
                  {dailyWords} từ mới · {dailyMinutes} phút mỗi ngày
                </p>
              </div>
            </div>
          </>
        )}
        <div className="onboarding-actions">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep((current) => current - 1)}>
              <ArrowLeft aria-hidden="true" size={16} /> Quay lại
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => onNavigate('home')}>
              Để sau
            </Button>
          )}
          {step < 3 ? (
            <Button onClick={() => setStep((current) => current + 1)}>
              Tiếp tục <ArrowRight aria-hidden="true" size={16} />
            </Button>
          ) : (
            <Button onClick={complete}>Tạo lộ trình</Button>
          )}
        </div>
      </Card>
    </PageShell>
  )
}

function StepHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="onboarding-step-heading">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}
function GoalPicker({
  label,
  values,
  value,
  suffix,
  onChange,
}: {
  label: string
  values: number[]
  value: number
  suffix: string
  onChange: (value: number) => void
}) {
  return (
    <div className="onboarding-goal">
      <strong>{label}</strong>
      <div>
        {values.map((item) => (
          <button
            type="button"
            className={item === value ? 'is-selected' : ''}
            onClick={() => onChange(item)}
            key={item}
          >
            {item} {suffix}
          </button>
        ))}
      </div>
    </div>
  )
}
