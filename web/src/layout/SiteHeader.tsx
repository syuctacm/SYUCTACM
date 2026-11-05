import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  SvgGithubIcon,
  SvgLoginIcon,
  SvgNewsIcon,
  SvgOjServerIcon,
  SvgSurveyIcon,
  SvgUserIcon,
  SvgWikiStarIcon,
} from '../components/LugIcons'
import type { User } from '../types'

interface SiteHeaderProps {
  user: User | null
  onOpenAuth: () => void
  onLogout: () => void
}

export function SiteHeader({ user, onOpenAuth, onLogout }: SiteHeaderProps) {
  const { pathname } = useLocation()
  const overlay = pathname === '/' || pathname === '/news'
  const isWikiActive = pathname.startsWith('/wiki')
  const isNewsActive = pathname.startsWith('/news') || pathname.startsWith('/article')

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `lug-menu__link${isActive ? ' is-active' : ''}`

  return (
    <header className={`lug-masthead${overlay ? ' lug-masthead--overlay' : ''}`}>
      <div className="lug-masthead__inner">
        <nav className="lug-masthead__nav" aria-label="Primary navigation">
          <Link to="/" className="lug-brand" aria-label="ACM @ SYUCT 首页">
            <img src="/logo.png" alt="ACM @ SYUCT" />
            <span className="lug-brand__title">ACM @ SYUCT</span>
          </Link>

          <ul className="lug-menu">
            <li className="lug-menu__item">
              <NavLink
                to="/wiki"
                className={() => `lug-menu__link${isWikiActive ? ' is-active' : ''}`}
              >
                <SvgWikiStarIcon className="lug-nav-svg" />
                <span>Wiki</span>
              </NavLink>
            </li>

            <li className="lug-menu__item">
              <NavLink
                to="/news"
                className={() => `lug-menu__link${isNewsActive ? ' is-active' : ''}`}
              >
                <SvgNewsIcon className="lug-nav-svg" />
                <span>News</span>
              </NavLink>
            </li>

            <li className="lug-menu__item">
              <a
                className="lug-menu__link"
                href="https://github.com/syuctacm"
                target="_blank"
                rel="noreferrer"
              >
                <SvgGithubIcon className="lug-nav-svg" />
                <span>Github</span>
              </a>
            </li>

            <li className="lug-menu__item">
              <a
                className="lug-menu__link"
                href="https://oj.syuctacm.cn"
                target="_blank"
                rel="noreferrer"
              >
                <SvgOjServerIcon className="lug-nav-svg" />
                <span>OJ</span>
              </a>
            </li>
            <li className="lug-menu__item lug-menu__item--auth">
              {user ? (
                <UserMenu user={user} onLogout={onLogout} />
              ) : (
                <button
                  type="button"
                  className="lug-menu__link lug-menu__auth-btn"
                  onClick={onOpenAuth}
                >
                  <span>Login</span>
                </button>
              )}
            </li>
          </ul>
        </nav>
      </div>

      <div className="lug-mobile-nav">
        <div className="lug-mobile-nav__inner">
          <NavLink to="/wiki" className={linkClass}>
            <SvgWikiStarIcon className="lug-nav-svg--sm" />
            <span>Wiki</span>
          </NavLink>
          <NavLink to="/news" className={linkClass}>
            <SvgNewsIcon className="lug-nav-svg--sm" />
            <span>News</span>
          </NavLink>
          <a href="https://github.com/syuctacm" target="_blank" rel="noreferrer">
            <SvgGithubIcon className="lug-nav-svg--sm" />
            <span>Github</span>
          </a>
          <a href="https://oj.syuctacm.cn" target="_blank" rel="noreferrer">
            <SvgOjServerIcon className="lug-nav-svg--sm" />
            <span>OJ</span>
          </a>
          {user?.role === 'admin' && (
            <>
              <NavLink to="/admin/articles" className={linkClass}>
                <span>文章管理</span>
              </NavLink>
              <NavLink to="/admin/surveys" className={linkClass}>
                <span>问卷管理</span>
              </NavLink>
            </>
          )}
          {user ? (
            <button
              type="button"
              className="lug-mobile-nav__auth"
              onClick={onLogout}
              title="点击退出登录"
            >
              <SvgUserIcon className="lug-nav-svg--sm" />
              <span>{user.nickname || user.username} (退出)</span>
            </button>
          ) : (
            <button type="button" className="lug-mobile-nav__auth" onClick={onOpenAuth}>
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

interface UserMenuProps {
  user: User
  onLogout: () => void
}

function UserMenu({ user, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className="lug-user" ref={menuRef}>
      <button
        type="button"
        className="lug-menu__link lug-menu__auth-btn"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <SvgUserIcon className="lug-nav-svg" />
        <span>{user.nickname || user.username}</span>
      </button>

      {open && (
        <div className="lug-user__dropdown">
          <div className="lug-user__meta">
            <div className="lug-user__name">{user.nickname || user.username}</div>
            <div className="lug-user__role">
              @{user.username} · {user.role === 'admin' ? '管理员' : '正式成员'}
            </div>
          </div>
          <div className="divider" />
          <Link to="/wiki/new" onClick={() => setOpen(false)}>
            <SvgWikiStarIcon className="lug-dropdown-svg" />
            新建 Wiki 页面
          </Link>
          <Link to="/surveys" onClick={() => setOpen(false)}>
            <SvgSurveyIcon className="lug-dropdown-svg" />
            队内问卷系统
          </Link>
          {user.role === 'admin' && (
            <>
              <div className="divider" />
              <Link to="/admin/articles" onClick={() => setOpen(false)}>
                <SvgNewsIcon className="lug-dropdown-svg" />
                文章管理后台
              </Link>
              <Link to="/admin/surveys" onClick={() => setOpen(false)}>
                <SvgSurveyIcon className="lug-dropdown-svg" />
                问卷管理后台
              </Link>
            </>
          )}
          <div className="divider" />
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onLogout()
            }}
          >
            <SvgLoginIcon className="lug-dropdown-svg" />
            退出登录
          </button>
        </div>
      )}
    </div>
  )
}
