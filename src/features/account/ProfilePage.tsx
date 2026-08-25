import { useState } from 'react'
import { Button, Card, EmptyState, PageShell, Tabs } from '../../components/ui'
import type { Page } from '../../types/app'
import { useAuth } from '../auth/authContext'
import { LEARNING_LANGUAGES, useLearningPlan } from '../learning/learningPlan'
import { ArrowRight, Award, BookOpenCheck, Languages, Sparkles, UserRound } from 'lucide-react'

type Tab = 'overview' | 'activity' | 'badges'
const badges = [
  [BookOpenCheck, 'Bước đầu tiên', 'Hoàn thành bài học đầu tiên', 'lessons'],
  [Sparkles, 'Nhịp học', 'Hoàn thành 5 hoạt động', 'activities'],
  [Languages, 'Nhà sưu tầm', 'Lưu 10 từ để ôn', 'words'],
  [Award, 'Không bỏ cuộc', 'Duy trì chuỗi 7 ngày', 'streak'],
] as const

export default function LocalProfilePage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [tab, setTab] = useState<Tab>('overview')
  const [plan] = useLearningPlan()
  const { status, user } = useAuth()
  const completedLessons = 0
  const minutes = 0
  const savedWords = 0
  const totalActivities = 0
  const streak = 0
  const profileTabs = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'activity', label: 'Hoạt động' },
    { id: 'badges', label: 'Huy hiệu' },
  ]
  const name = plan ? `Người học ${LEARNING_LANGUAGES[plan.language].label}` : 'Người học Kotodama'
  const authenticated = status === 'authenticated'

  return (
    <PageShell width="wide" className="profile-page">
      <header className="page-header">
        <div className="page-header__eyebrow">
          <UserRound aria-hidden="true" size={15} strokeWidth={2.25} /> HỒ SƠ CỦA BẠN
        </div>
        <h1>Hành trình học tập</h1>
        <p>Tiến độ, hoạt động và huy hiệu sẽ được tổng hợp khi dữ liệu học tập được kết nối.</p>
      </header>
      {authenticated && user && !user.emailVerified && (
        <Card padding="md" className="profile-security-notice">
          <div>
            <strong>Email của bạn chưa được xác minh</strong>
            <p>Xác minh để tăng độ an toàn và dùng tính năng khôi phục mật khẩu.</p>
          </div>
          <Button size="sm" onClick={() => onNavigate('verifyEmail')}>
            Xác minh email
          </Button>
        </Card>
      )}
      <Card className="profile-hero" padding="none">
        <div className="profile-hero__cover">
          <span>{plan ? LEARNING_LANGUAGES[plan.language].native : 'ことだま'}</span>
        </div>
        <div className="profile-hero__body">
          <div className="profile-identity">
            <div className="profile-identity__avatar" aria-hidden="true">
              {plan ? LEARNING_LANGUAGES[plan.language].flag : 'K'}
            </div>
            <div>
              <div className="profile-identity__title">
                <h2>{name}</h2>
                <span>HỒ SƠ HỌC TẬP</span>
              </div>
              <p>
                {plan
                  ? `${plan.dailyWords} từ mới · ${plan.dailyMinutes} phút mỗi ngày`
                  : 'Hãy tạo lộ trình để bắt đầu ghi nhận hành trình học.'}
              </p>
            </div>
          </div>
          <Button size="sm" onClick={() => onNavigate('onboarding')}>
            {plan ? 'Điều chỉnh lộ trình' : 'Tạo lộ trình'}
          </Button>
          <div className="profile-stat-grid">
            <ProfileStat value={`${streak}`} label="Chuỗi ngày" />
            <ProfileStat value={`${completedLessons}`} label="Bài đã học" />
            <ProfileStat value={`${minutes}p`} label="Thời gian học" />
            <ProfileStat value={`${plan ? 1 : 0}`} label="Ngôn ngữ" />
            <ProfileStat value={`${savedWords}`} label="Từ lưu SRS" />
          </div>
        </div>
      </Card>
      <div className="profile-tabs">
        <Tabs value={tab} onChange={(value) => setTab(value as Tab)} tabs={profileTabs} />
      </div>
      {tab === 'overview' && (
        <div className="profile-overview-grid">
          <Card padding="lg" className="profile-panel">
            <PanelHeading
              title="Tiếp tục hành trình"
              subtitle={'Bài học và tiến độ sẽ xuất hiện khi dữ liệu khóa học được kết nối.'}
            />
            <EmptyState
              title="Chưa có bài học đang diễn ra"
              description="Không hiển thị bài học minh họa. Nội dung sẽ đến từ API khóa học."
              action={
                <Button onClick={() => onNavigate(plan ? 'courses' : 'onboarding')}>
                  {plan ? 'Xem khóa học' : 'Tạo lộ trình'}
                </Button>
              }
            />
          </Card>
          <Card padding="lg" className="profile-panel">
            <PanelHeading
              title="Bảo mật tài khoản"
              subtitle={
                authenticated ? 'Mật khẩu và trạng thái email của bạn.' : 'Đăng nhập để quản lý mật khẩu và email.'
              }
            />
            <Button variant="secondary" onClick={() => onNavigate(authenticated ? 'security' : 'login')}>
              {authenticated ? (
                <>
                  Mở bảo mật <ArrowRight aria-hidden="true" size={15} />
                </>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </Card>
          {user?.role === 'admin' && (
            <Card padding="lg" className="profile-panel">
              <PanelHeading title="Quản trị tài khoản" subtitle="Kiểm soát người dùng, quyền và hoạt động quản trị." />
              <Button variant="secondary" onClick={() => onNavigate('accountAdmin')}>
                Mở quản trị <ArrowRight aria-hidden="true" size={15} />
              </Button>
            </Card>
          )}
          <Card padding="lg" className="profile-panel">
            <PanelHeading title="Ôn tập hôm nay" subtitle="Hàng đợi SRS sẽ xuất hiện khi dữ liệu được kết nối." />
            <Button variant="secondary" onClick={() => onNavigate('review')}>
              Mở hàng đợi SRS <ArrowRight aria-hidden="true" size={15} />
            </Button>
          </Card>
        </div>
      )}
      {tab === 'activity' && (
        <Card padding="lg" className="profile-panel">
          <PanelHeading title="Hoạt động học tập" subtitle="Bản đồ hoạt động sẽ hiển thị từ dữ liệu học tập thực tế." />
          <EmptyState
            title="Chưa có hoạt động để hiển thị"
            description="Frontend không tạo hoạt động minh họa; dữ liệu sẽ được đồng bộ từ API."
          />
        </Card>
      )}
      {tab === 'badges' && (
        <div className="badges-grid">
          {badges.map(([Icon, title, description, kind]) => {
            const unlocked =
              kind === 'lessons' ? completedLessons >= 1 : kind === 'activities' ? totalActivities >= 5 : false
            return (
              <Card padding="md" className={`achievement-card ${unlocked ? 'is-unlocked' : ''}`} key={title}>
                <span className="achievement-card__icon">
                  <Icon aria-hidden="true" size={23} />
                </span>
                <div>
                  <h2>{title}</h2>
                  <p>{description}</p>
                  <small>{unlocked ? 'Đã mở khóa' : 'Chưa mở khóa'}</small>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </PageShell>
  )
}

function ProfileStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="profile-stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}
function PanelHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="panel-heading">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  )
}
