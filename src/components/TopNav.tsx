import { useState } from 'react'
import { BookOpen, Flame, House, LogIn, Search, Settings, Video, Zap, type LucideIcon } from 'lucide-react'
import { Button, IconButton } from './ui'
import type { Page } from '../types/app'

const NAV_TABS: Array<{ id: Page; label: string; icon: LucideIcon }> = [
  { id: 'home', label: 'Trang chủ', icon: House },
  { id: 'vocabulary', label: 'Tra Từ', icon: Search },
  { id: 'video', label: 'Video AI', icon: Video },
  { id: 'courses', label: 'Khóa Học', icon: BookOpen },
]

export default function TopNav({
  onSearchFocus,
  page,
  navigate,
  isAuthenticated,
  userName,
}: {
  onSearchFocus: () => void
  page: Page
  navigate: (page: Page) => void
  isAuthenticated: boolean
  userName?: string | undefined
}) {
  const [credits] = useState(0)

  return (
    <>
      <a className="skip-link" href="#main-content">
        Chuyển đến nội dung chính
      </a>
      <nav className="nav-bar" aria-label="Điều hướng chính">
        <div className="nav-inner">
          <button type="button" className="nav-brand" onClick={() => navigate('home')}>
            <span className="nav-brand__mark">
              <img src="/kotodama-logo.png" alt="" />
            </span>
            <span>Kotodama</span>
          </button>
          <div className="nav-divider" />
          <div className="nav-tabs nav-tabs--desktop">
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`nav-tab${page === tab.id ? ' active' : ''}`}
                aria-current={page === tab.id ? 'page' : undefined}
                onClick={() => navigate(tab.id)}
              >
                <tab.icon aria-hidden="true" size={18} strokeWidth={1.9} />
                {tab.label}
                {tab.id === 'video' && <span className="nav-ai-badge">AI</span>}
              </button>
            ))}
          </div>
          {page === 'vocabulary' && (
            <Button variant="secondary" size="sm" className="nav-search-button" onClick={onSearchFocus}>
              Tìm từ
            </Button>
          )}
          <div className="nav-actions">
            <div className="nav-stat nav-stat--streak">
              <Flame aria-hidden="true" size={17} strokeWidth={2} /> 0
            </div>
            <div className="nav-stat nav-stat--credits">
              <Zap aria-hidden="true" size={17} strokeWidth={2} /> {credits}
            </div>
            {isAuthenticated ? (
              <>
                <IconButton label="Cài đặt" onClick={() => navigate('settings')}>
                  <Settings aria-hidden="true" size={18} strokeWidth={1.9} />
                </IconButton>
                <IconButton label="Hồ sơ" className="nav-profile-button" onClick={() => navigate('profile')}>
                  {userName?.trim().slice(0, 1).toUpperCase() || 'K'}
                </IconButton>
              </>
            ) : (
              <Button size="sm" onClick={() => navigate('login')}>
                <LogIn aria-hidden="true" size={17} strokeWidth={2} />
                Đăng nhập
              </Button>
            )}
          </div>
        </div>
      </nav>
      <nav className="nav-mobile" aria-label="Điều hướng chính trên điện thoại">
        {NAV_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`nav-mobile__item${page === tab.id ? ' is-active' : ''}`}
            aria-current={page === tab.id ? 'page' : undefined}
            onClick={() => navigate(tab.id)}
          >
            <tab.icon aria-hidden="true" size={18} strokeWidth={1.9} />
            <span>{tab.label}</span>
            {tab.id === 'video' && <i>AI</i>}
          </button>
        ))}
      </nav>
    </>
  )
}
