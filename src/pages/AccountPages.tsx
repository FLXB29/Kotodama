import { useCallback, useEffect, type CSSProperties, type ReactNode } from 'react'
import PageHeader from '../components/PageHeader'
import { Button, Card, PageShell, Select, Switch } from '../components/ui'
import { usePersistentState } from '../lib/usePersistentState'
import { LogOut, Settings2 } from 'lucide-react'
import { apiPaths, requestApi } from '../lib/apiClient'
import { useAuth } from '../features/auth/authContext'

type Accent = 'rose' | 'blue' | 'violet' | 'orange' | 'emerald' | 'white'
type Background = 'midnight' | 'ocean' | 'sakura' | 'forest' | 'ivory' | 'sky'
type AccountPreferences = {
  dailyWords: number
  reviewLimit: number | 'unlimited'
  autoPronounce: boolean
  furigana: boolean
  romaji: boolean
  pitchAccent: boolean
  reminders: boolean
  streakReminders: boolean
  publicProfile: boolean
  analytics: boolean
  accent: Accent
  background: Background
}

const accents: Record<Accent, { label: string; base: string; hover: string; subtle: string }> = {
  rose: { label: 'Hồng đỏ', base: '#ff4d6d', hover: '#ff6b85', subtle: 'rgb(255 77 109 / 15%)' },
  blue: { label: 'Xanh dương', base: '#4d8bff', hover: '#70a3ff', subtle: 'rgb(77 139 255 / 15%)' },
  violet: { label: 'Tím', base: '#a855f7', hover: '#ba7cff', subtle: 'rgb(168 85 247 / 15%)' },
  orange: { label: 'Cam', base: '#f97316', hover: '#fb923c', subtle: 'rgb(249 115 22 / 15%)' },
  emerald: { label: 'Ngọc lục', base: '#10b981', hover: '#34d399', subtle: 'rgb(16 185 129 / 15%)' },
  white: { label: 'Trắng', base: '#f4f3ed', hover: '#fffdf5', subtle: 'rgb(244 243 237 / 15%)' },
}
const backgrounds: Record<
  Background,
  {
    label: string
    swatch: string
    canvas: string
    subtle: string
    surface: string
    elevated: string
    hover: string
    tone: 'dark' | 'light'
  }
> = {
  midnight: {
    label: 'Đen Sumi',
    swatch: '#09090f',
    canvas: '#09090f',
    subtle: '#0d0d15',
    surface: '#111119',
    elevated: '#171722',
    hover: '#1e1e2c',
    tone: 'dark',
  },
  ocean: {
    label: 'Xanh Asagi',
    swatch: '#d9edf1',
    canvas: '#eaf5f7',
    subtle: '#dceef2',
    surface: '#f5fbfc',
    elevated: '#ffffff',
    hover: '#cce4e9',
    tone: 'light',
  },
  sakura: {
    label: 'Hồng Sakura',
    swatch: '#f8d9df',
    canvas: '#fff0f3',
    subtle: '#fde4e9',
    surface: '#fff8f9',
    elevated: '#ffffff',
    hover: '#f8d7df',
    tone: 'light',
  },
  forest: {
    label: 'Xanh Matcha',
    swatch: '#dce8d2',
    canvas: '#edf4e6',
    subtle: '#e1edda',
    surface: '#f7fbf4',
    elevated: '#ffffff',
    hover: '#d3e3c8',
    tone: 'light',
  },
  ivory: {
    label: 'Giấy Washi',
    swatch: '#f4ead6',
    canvas: '#fbf5e8',
    subtle: '#f3ead8',
    surface: '#fffaf1',
    elevated: '#fffdf8',
    hover: '#eee1c9',
    tone: 'light',
  },
  sky: {
    label: 'Mận Ume',
    swatch: '#eadceb',
    canvas: '#f6edf6',
    subtle: '#eee2ef',
    surface: '#fcf7fc',
    elevated: '#ffffff',
    hover: '#e5d4e6',
    tone: 'light',
  },
}

export function SettingsPage({ onLogout }: { onLogout: () => void }) {
  const { status } = useAuth()
  const [dailyWords, setDailyWords] = usePersistentState('kotodama.settings.daily-words', '20')
  const [reviewLimit, setReviewLimit] = usePersistentState('kotodama.settings.review-limit', '100')
  const [autoPronounce, setAutoPronounce] = usePersistentState('kotodama.settings.auto-pronounce', true)
  const [furigana, setFurigana] = usePersistentState('kotodama.settings.furigana', true)
  const [romaji, setRomaji] = usePersistentState('kotodama.settings.romaji', false)
  const [pitchAccent, setPitchAccent] = usePersistentState('kotodama.settings.pitch-accent', true)
  const [reminders, setReminders] = usePersistentState('kotodama.settings.reminders', false)
  const [streakReminders, setStreakReminders] = usePersistentState('kotodama.settings.streak-reminders', true)
  const [publicProfile, setPublicProfile] = usePersistentState('kotodama.settings.public-profile', false)
  const [analytics, setAnalytics] = usePersistentState('kotodama.settings.analytics', true)
  const [accent, setAccent] = usePersistentState<Accent>('kotodama.settings.accent', 'rose')
  const [background, setBackground] = usePersistentState<Background>('kotodama.settings.background', 'midnight')
  const activeBackground = backgrounds[background] ? background : 'midnight'

  useEffect(() => {
    if (status !== 'authenticated') return
    let active = true
    void requestApi<AccountPreferences>({
      method: 'GET',
      url: apiPaths.account.preferences,
      dedupeKey: 'account:preferences',
    })
      .then((value) => {
        if (!active) return
        setDailyWords(String(value.dailyWords))
        setReviewLimit(String(value.reviewLimit))
        setAutoPronounce(value.autoPronounce)
        setFurigana(value.furigana)
        setRomaji(value.romaji)
        setPitchAccent(value.pitchAccent)
        setReminders(value.reminders)
        setStreakReminders(value.streakReminders)
        setPublicProfile(value.publicProfile)
        setAnalytics(value.analytics)
        setAccent(value.accent)
        setBackground(value.background)
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [
    setAccent,
    setAnalytics,
    setAutoPronounce,
    setBackground,
    setDailyWords,
    setFurigana,
    setPitchAccent,
    setPublicProfile,
    setReminders,
    setReviewLimit,
    setRomaji,
    setStreakReminders,
    status,
  ])

  const persistPreference = useCallback(
    (patch: Partial<AccountPreferences>) => {
      if (status !== 'authenticated') return
      void requestApi<AccountPreferences>({ method: 'POST', url: apiPaths.account.preferences, data: patch }).catch(
        () => undefined
      )
    },
    [status]
  )

  useEffect(() => {
    const palette = accents[accent]
    const backgroundPalette = backgrounds[activeBackground]
    document.documentElement.style.setProperty('--color-accent', palette.base)
    document.documentElement.style.setProperty('--color-accent-hover', palette.hover)
    document.documentElement.style.setProperty('--color-accent-subtle', palette.subtle)
    document.documentElement.style.setProperty('--color-bg-canvas', backgroundPalette.canvas)
    document.documentElement.style.setProperty('--color-bg-subtle', backgroundPalette.subtle)
    document.documentElement.style.setProperty('--color-bg-surface', backgroundPalette.surface)
    document.documentElement.style.setProperty('--color-bg-elevated', backgroundPalette.elevated)
    document.documentElement.style.setProperty('--color-bg-hover', backgroundPalette.hover)
    const textPalette =
      backgroundPalette.tone === 'light'
        ? {
            text: '#1c1b20',
            secondary: 'rgb(28 27 32 / 68%)',
            muted: 'rgb(28 27 32 / 52%)',
            disabled: 'rgb(28 27 32 / 36%)',
            border: 'rgb(28 27 32 / 13%)',
            borderSubtle: 'rgb(28 27 32 / 8%)',
            borderStrong: 'rgb(28 27 32 / 22%)',
            borderHover: 'rgb(28 27 32 / 18%)',
            selected: 'rgb(28 27 32 / 7%)',
            overlay: 'rgb(255 253 248 / 92%)',
          }
        : {
            text: '#eaeae0',
            secondary: 'rgb(234 234 224 / 55%)',
            muted: 'rgb(234 234 224 / 38%)',
            disabled: 'rgb(234 234 224 / 28%)',
            border: 'rgb(255 255 255 / 7%)',
            borderSubtle: 'rgb(255 255 255 / 5%)',
            borderStrong: 'rgb(255 255 255 / 18%)',
            borderHover: 'rgb(255 255 255 / 14%)',
            selected: 'rgb(255 255 255 / 8%)',
            overlay: 'rgb(13 13 23 / 92%)',
          }
    document.documentElement.style.setProperty('--color-text', textPalette.text)
    document.documentElement.style.setProperty('--color-text-secondary', textPalette.secondary)
    document.documentElement.style.setProperty('--color-text-muted', textPalette.muted)
    document.documentElement.style.setProperty('--color-text-disabled', textPalette.disabled)
    document.documentElement.style.setProperty('--color-border', textPalette.border)
    document.documentElement.style.setProperty('--color-border-subtle', textPalette.borderSubtle)
    document.documentElement.style.setProperty('--color-border-strong', textPalette.borderStrong)
    document.documentElement.style.setProperty('--color-border-hover', textPalette.borderHover)
    document.documentElement.style.setProperty('--color-bg-selected', textPalette.selected)
    document.documentElement.style.setProperty('--color-bg-overlay', textPalette.overlay)
    document.documentElement.dataset['accent'] = accent
    document.documentElement.dataset['background'] = activeBackground
    document.documentElement.dataset['backgroundTone'] = backgroundPalette.tone
  }, [accent, activeBackground])

  return (
    <PageShell width="wide" className="settings-page">
      <PageHeader
        eyebrow="TÙY CHỈNH"
        title="Cài đặt"
        description="Tùy chỉnh nhịp học và giao diện để Kotodama hợp với bạn hơn."
        icon={Settings2}
      />
      <div className="settings-stack">
        <SettingsSection title="Học tập" description="Đặt nhịp độ và cách hiển thị phù hợp với bạn.">
          <SettingsSelect
            label="Mục tiêu từ mới mỗi ngày"
            description="Số từ mới gợi ý trong một ngày học."
            value={dailyWords}
            onChange={(value) => {
              setDailyWords(value)
              persistPreference({ dailyWords: Number(value) })
            }}
            options={[
              ['10', '10 từ'],
              ['20', '20 từ'],
              ['30', '30 từ'],
              ['50', '50 từ'],
            ]}
          />
          <SettingsSelect
            label="Giới hạn ôn tập mỗi ngày"
            description="Giúp phiên ôn tập luôn vừa sức."
            value={reviewLimit}
            onChange={(value) => {
              setReviewLimit(value)
              persistPreference({ reviewLimit: value === 'unlimited' ? 'unlimited' : Number(value) })
            }}
            options={[
              ['50', '50 lượt'],
              ['100', '100 lượt'],
              ['200', '200 lượt'],
              ['unlimited', 'Không giới hạn'],
            ]}
          />
          <SettingsToggle
            label="Tự phát âm"
            description="Tự động phát âm khi mở một từ mới."
            checked={autoPronounce}
            onChange={(value) => {
              setAutoPronounce(value)
              persistPreference({ autoPronounce: value })
            }}
          />
          <SettingsToggle
            label="Hiển thị Furigana"
            description="Hiển thị cách đọc trên chữ Kanji."
            checked={furigana}
            onChange={(value) => {
              setFurigana(value)
              persistPreference({ furigana: value })
            }}
          />
          <SettingsToggle
            label="Hiển thị Romaji"
            description="Hiển thị phiên âm Latinh khi cần."
            checked={romaji}
            onChange={(value) => {
              setRomaji(value)
              persistPreference({ romaji: value })
            }}
          />
          <SettingsToggle
            label="Cao độ (pitch accent)"
            description="Hiện thông tin cao độ cho từ tiếng Nhật."
            checked={pitchAccent}
            onChange={(value) => {
              setPitchAccent(value)
              persistPreference({ pitchAccent: value })
            }}
          />
        </SettingsSection>

        <SettingsSection title="Giao diện" description="Cá nhân hóa sắc thái để Kotodama hợp với bạn hơn.">
          <div className="settings-row">
            <div className="settings-row__copy">
              <h3>Màu nền</h3>
              <p>Chọn sắc thái nền chính cho toàn bộ giao diện.</p>
            </div>
            <div className="background-options" aria-label="Chọn màu nền">
              {(Object.keys(backgrounds) as Background[]).map((key) => (
                <button
                  type="button"
                  className={`background-option ${activeBackground === key ? 'is-active' : ''}`}
                  style={{ '--background-option': backgrounds[key].swatch } as CSSProperties}
                  onClick={() => {
                    setBackground(key)
                    persistPreference({ background: key })
                  }}
                  title={backgrounds[key].label}
                  aria-label={backgrounds[key].label}
                  aria-pressed={activeBackground === key}
                  key={key}
                />
              ))}
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row__copy">
              <h3>Màu nhấn</h3>
              <p>Màu áp dụng cho thao tác chính và trạng thái đang chọn.</p>
            </div>
            <div className="accent-options" aria-label="Chọn màu nhấn">
              {(Object.keys(accents) as Accent[]).map((key) => (
                <button
                  type="button"
                  className={`accent-option accent-option--${key} ${accent === key ? 'is-active' : ''}`}
                  style={{ '--accent-option': accents[key].base } as CSSProperties}
                  onClick={() => {
                    setAccent(key)
                    persistPreference({ accent: key })
                  }}
                  title={accents[key].label}
                  aria-label={accents[key].label}
                  aria-pressed={accent === key}
                  key={key}
                />
              ))}
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Thông báo" description="Các lựa chọn này được lưu trên thiết bị hiện tại.">
          <SettingsToggle
            label="Nhắc học tập"
            description="Nhận lời nhắc cho lịch học bạn đã đặt."
            checked={reminders}
            onChange={(value) => {
              setReminders(value)
              persistPreference({ reminders: value })
            }}
          />
          <SettingsToggle
            label="Duy trì chuỗi ngày"
            description="Nhắc bạn trước khi chuỗi học tập kết thúc."
            checked={streakReminders}
            onChange={(value) => {
              setStreakReminders(value)
              persistPreference({ streakReminders: value })
            }}
          />
        </SettingsSection>

        <SettingsSection title="Quyền riêng tư" description="Bạn luôn kiểm soát dữ liệu hiển thị của mình.">
          <SettingsToggle
            label="Hồ sơ công khai"
            description="Cho phép người khác xem hồ sơ và các huy hiệu của bạn."
            checked={publicProfile}
            onChange={(value) => {
              setPublicProfile(value)
              persistPreference({ publicProfile: value })
            }}
          />
          <SettingsToggle
            label="Dữ liệu cải thiện sản phẩm"
            description="Cho phép sử dụng dữ liệu ẩn danh để cải thiện trải nghiệm."
            checked={analytics}
            onChange={(value) => {
              setAnalytics(value)
              persistPreference({ analytics: value })
            }}
          />
        </SettingsSection>

        <Card padding="lg" className="settings-subscription">
          <div>
            <span className="settings-kicker">GÓI HIỆN TẠI</span>
            <h2>Kotodama Free</h2>
            <p>Các tính năng trả phí chưa được mở trong bản thử nghiệm này.</p>
          </div>
          <Button variant="secondary" disabled>
            Sắp có
          </Button>
        </Card>
        <Card padding="lg" className="settings-danger">
          <div>
            <h2>Vùng cần thận trọng</h2>
            <p>Xóa tài khoản cần được xác nhận qua hệ thống máy chủ.</p>
          </div>
          <Button variant="danger" disabled>
            Xóa tài khoản
          </Button>
        </Card>
        <Card padding="lg" className="settings-logout">
          <div>
            <h2>Phiên đăng nhập</h2>
            <p>Đăng xuất khỏi tài khoản trên thiết bị này.</p>
          </div>
          <Button variant="danger" onClick={onLogout}>
            <LogOut aria-hidden="true" size={16} strokeWidth={2} />
            Đăng xuất
          </Button>
        </Card>
      </div>
    </PageShell>
  )
}

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <Card padding="lg" className="settings-section">
      <div className="settings-section__heading">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      <div className="settings-section__rows">{children}</div>
    </Card>
  )
}

function SettingsToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="settings-row">
      <div className="settings-row__copy">
        <h3>{label}</h3>
        <p>{description}</p>
      </div>
      <Switch label={label} checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

function SettingsSelect({
  label,
  description,
  value,
  onChange,
  options,
}: {
  label: string
  description: string
  value: string
  onChange: (value: string) => void
  options: Array<[string, string]>
}) {
  return (
    <div className="settings-row">
      <div className="settings-row__copy">
        <h3>{label}</h3>
        <p>{description}</p>
      </div>
      <Select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </Select>
    </div>
  )
}
