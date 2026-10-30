import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import type { User } from '../types'

interface SiteHeaderProps {
  user: User | null
  onOpenAuth: () => void
  onLogout: () => void
}

const NAV_ITEMS = [
  { label: 'Wiki', to: '/wiki', icon: 'fa-star' },
  { label: 'News', to: '/news', icon: 'fa-newspaper' },
] as const

export function SiteHeader({ user, onOpenAuth, onLogout }: SiteHeaderProps) {
  const { pathname } = useLocation()
  const overlay = pathname === '/' || pathname === '/news'

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
            {NAV_ITEMS.map((item) => (
              <li className="lug-menu__item" key={item.label}>
                <NavLink to={item.to} className={linkClass}>
                  <i className={`fad ${item.icon} fa-fw`} aria-hidden="true" />
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="lug-menu__item">
              <a
                className="lug-menu__link"
                href="https://github.com/syuctacm"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-github fa-fw" aria-hidden="true" />
                Github
              </a>
            </li>
            <li className="lug-menu__item">
              <a
                className="lug-menu__link"
                href="https://oj.syuctacm.cn"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fad fa-server fa-fw" aria-hidden="true" />
                OJ
              </a>
            </li>
          </ul>

          <div className="lug-user">
            {user ? (
              <UserMenu user={user} onLogout={onLogout} />
            ) : (
              <button
                type="button"
                className="lug-user__button"
                onClick={onOpenAuth}
                aria-label="登录或注册"
                title="登录 / 注册"
              >
                <i className="fad fa-right-to-bracket fa-fw" aria-hidden="true" />
              </button>
            )}
          </div>
        </nav>
      </div>

      <div className="lug-mobile-nav">
        <div className="lug-mobile-nav__inner">
          {NAV_ITEMS.map((item) => (
            <NavLink to={item.to} className={linkClass} key={item.label}>
              <i className={`fad ${item.icon} fa-fw`} aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
          <a href="https://github.com/syuctacm" target="_blank" rel="noreferrer">
            <i className="fab fa-github fa-fw" aria-hidden="true" /> Github
          </a>
          <a href="https://oj.syuctacm.cn" target="_blank" rel="noreferrer">
            <i className="fad fa-server fa-fw" aria-hidden="true" /> OJ
          </a>
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
    <div ref={menuRef}>
      <button
        type="button"
        className="lug-user__button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <i
          className={`fad ${user.role === 'admin' ? 'fa-user-shield' : 'fa-user'} fa-fw`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="lug-user__dropdown">
          {user.role === 'admin' && (
            <>
              <Link to="/admin/articles" onClick={() => setOpen(false)}>
                <i className="fad fa-file-lines fa-fw" aria-hidden="true" />
                文章管理
              </Link>
              <Link to="/admin/surveys" onClick={() => setOpen(false)}>
                <i className="fad fa-clipboard-list fa-fw" aria-hidden="true" />
                问卷管理
              </Link>
              <div className="divider" />
            </>
          )}
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onLogout()
            }}
          >
            <i className="fad fa-right-from-bracket fa-fw" aria-hidden="true" />
            退出登录
          </button>
        </div>
      )}
    </div>
  )
}
