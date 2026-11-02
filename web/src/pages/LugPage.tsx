import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { fetchWeather } from '../api/client'
import type { User } from '../types'

type LugPageMode = 'home' | 'news'

interface LugPageProps {
  mode: LugPageMode
  user: User | null
  onOpenAuth: () => void
  onLogout: () => void
}

const FALLBACK_WEATHER = '当前天气：沈阳铁西 16.5°C 多云'

const BASE_STYLE = `
:host { display:block; width:100%; }
.lug-shadow-body {
  display:flex;
  min-height:100vh;
  flex-direction:column;
  margin:0;
  padding:0;
  background:#fff !important;
  color:#40514e;
  font-family:-apple-system,BlinkMacSystemFont,"Noto Sans","Open Sans",Roboto,"Segoe UI","Helvetica Neue","Lucida Grande","Microsoft YaHei",Arial,sans-serif;
  font-size:16px;
  line-height:1.5;
  -moz-osx-font-smoothing:grayscale;
  -webkit-font-smoothing:antialiased;
  text-rendering:optimizeLegibility;
}
.lug-shadow-body *, .lug-shadow-body *::before, .lug-shadow-body *::after { box-sizing:border-box; }
.lug-shadow-body .initial-content { flex:1 0 auto; }
.lug-shadow-body .site-logo img { width:28px; height:28px; object-fit:contain; }
.lug-shadow-body.layout--splash .masthead {
  position:absolute; top:0; left:0; right:0; z-index:20;
  height:auto; background:transparent !important;
}
.lug-shadow-body.layout--splash .masthead__inner-wrap { position:relative; }
.lug-shadow-body.layout--splash .masthead,
.lug-shadow-body.layout--splash .masthead .greedy-nav a,
.lug-shadow-body.layout--splash .masthead .site-title,
.lug-shadow-body.layout--splash .visible-links a,
.lug-shadow-body.layout--splash .search__toggle { color:#fff !important; }
.lug-shadow-body .site-logo img { width:28px; height:28px; object-fit:contain; }
.lug-shadow-body .lug-user-wrap { position:relative; margin-left:12px; }
.lug-shadow-body .lug-user-wrap .search__toggle { position:relative; padding:0; border:0; background:transparent; color:inherit; cursor:pointer; }
.lug-shadow-body #footer .footer__logo { margin-left:auto; }
.lug-shadow-body .lug-nav--intro-only {
  display:block; max-width:900px; margin:1rem auto 0;
}
.lug-shadow-body .lug-nav--intro-only .nav-right {
  margin-left:0; background:#f3f6f6; border-radius:6px;
}
.lug-shadow-body .lug-nav--intro-only .description {
  display:block; margin:0; padding:1em 1.25em;
}
.lug-shadow-body .lug-nav--intro-only .description p {
  margin:0; font-size:.9em; line-height:1.65; text-align:left;
}
.lug-shadow-body .lug-nav--intro-only .description p + p { margin-top:.55em; }
.lug-shadow-body .lug-nav--intro-only + .archive-group { margin-top:2rem; }
.lug-shadow-body .lug-user-popover {
  position:absolute; right:0; top:calc(100% + 10px); z-index:40;
  min-width:170px; padding:6px 0; border:1px solid #cfd4d3; border-radius:4px;
  background:#fff; color:#40514e; box-shadow:0 8px 24px rgba(0,0,0,.16);
}
.lug-shadow-body .lug-user-popover a, .lug-shadow-body .lug-user-popover button {
  display:flex; width:100%; align-items:center; gap:8px; padding:7px 12px;
  border:0; background:transparent; color:#40514e; font:inherit; font-size:13px;
  text-align:left; cursor:pointer;
}
.lug-shadow-body .lug-user-popover a:hover, .lug-shadow-body .lug-user-popover button:hover { background:#f3f6f6; color:#11999e; text-decoration:none; }
.lug-shadow-body .lug-user-popover .divider { height:1px; margin:5px 0; background:#e5e7eb; }
.lug-shadow-body .footer__logo img.lug-footer-logo { opacity:.95; }
.lug-shadow-body .lug-watermark {
  position:fixed; left:-150px; bottom:-150px; z-index:-1; width:430px; height:430px;
  object-fit:contain; opacity:.055; pointer-events:none; filter:grayscale(1);
}
.lug-shadow-body .lug-mobile-links { display:none; }
@media (max-width: 48em) {
  .lug-shadow-body { font-size:14px; }
  .lug-shadow-body.layout--splash .masthead {
    position:relative; background:#f3f6f6 !important; color:#40514e;
  }
  .lug-shadow-body.layout--splash .masthead,
  .lug-shadow-body.layout--splash .masthead .greedy-nav a,
  .lug-shadow-body.layout--splash .masthead .site-title,
  .lug-shadow-body.layout--splash .search__toggle { color:#40514e !important; }
  .lug-shadow-body .visible-links { display:none; }
  .lug-shadow-body .lug-nav--intro-only { margin-top:.75rem; }
  .lug-shadow-body .lug-user-wrap {
    position:absolute; top:14px; right:16px; margin:0;
  }
  .lug-shadow-body .lug-user-wrap .search__toggle { color:#40514e !important; }
  .lug-shadow-body .lug-mobile-links {
    position:static; display:flex; flex-wrap:wrap; justify-content:center; gap:18px;
    padding:8px 16px; background:#f3f6f6; color:#40514e; font-size:14px;
  }
  .lug-shadow-body .lug-mobile-links a { color:#40514e; }
  .lug-shadow-body .page__hero--overlay { padding-top:3em; }
}
@media (min-width: 64em) {
  .lug-shadow-body { font-size:18px; }
}
`

function appendStyles(root: ShadowRoot) {
  if (!root.querySelector('link[data-syuctacm-lug-css]')) {
    const lug = document.createElement('link')
    lug.rel = 'stylesheet'
    lug.href = '/lug/ustc-main.css'
    lug.dataset.syuctacmLugCss = 'true'
    root.appendChild(lug)
  }
  if (!root.querySelector('link[data-syuctacm-fa-css]')) {
    const fa = document.createElement('link')
    fa.rel = 'stylesheet'
    fa.href = '/fontawesome/css/all.min.css'
    fa.dataset.syuctacmFaCss = 'true'
    root.appendChild(fa)
  }

  // Keep local overrides after the upstream LUG stylesheet so responsive and
  // mobile-only rules cannot be overridden by the imported theme.
  const oldStyle = root.querySelector('style[data-syuctacm-lug-base]')
  if (oldStyle) oldStyle.remove()
  const style = document.createElement('style')
  style.dataset.syuctacmLugBase = 'true'
  style.textContent = BASE_STYLE
  root.appendChild(style)
}

export function LugPage({
  mode,
  user,
  onOpenAuth,
  onLogout,
}: LugPageProps) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null)
  const [weatherText, setWeatherText] = useState(FALLBACK_WEATHER)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const attachShadow = useCallback((node: HTMLDivElement | null) => {
    hostRef.current = node
    if (!node) return
    const root = node.shadowRoot ?? node.attachShadow({ mode: 'open' })
    appendStyles(root)
    setShadowRoot(root)
  }, [])

  useEffect(() => {
    let cancelled = false
    fetchWeather()
      .then((w) => {
        if (!cancelled) {
          setWeatherText(`当前天气：沈阳铁西 ${w.temperature.toFixed(1)}°C ${w.text}`)
        }
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])

  if (!shadowRoot) {
    return <div ref={attachShadow} className="lug-shadow-host" />
  }

  return (
    <div ref={attachShadow} className="lug-shadow-host">
      {createPortal(
        <LugDocument
          mode={mode}
          user={user}
          weatherText={weatherText}
          userMenuOpen={userMenuOpen}
          onToggleUserMenu={() => setUserMenuOpen((v) => !v)}
          onCloseUserMenu={() => setUserMenuOpen(false)}
          onOpenAuth={onOpenAuth}
          onLogout={onLogout}
        />,
        shadowRoot,
      )}
    </div>
  )
}

interface LugDocumentProps {
  mode: LugPageMode
  user: User | null
  weatherText: string
  userMenuOpen: boolean
  onToggleUserMenu: () => void
  onCloseUserMenu: () => void
  onOpenAuth: () => void
  onLogout: () => void
}

function LugDocument({
  mode,
  user,
  weatherText,
  userMenuOpen,
  onToggleUserMenu,
  onCloseUserMenu,
  onOpenAuth,
  onLogout,
}: LugDocumentProps) {
  const isHome = mode === 'home'

  return (
    <div className="layout--splash lug-shadow-body">
      <div className="masthead">
        <div className="masthead__inner-wrap">
          <div className="masthead__menu">
            <nav aria-label="Primary navigation" className="greedy-nav" id="site-nav">
              <a className="site-logo" href="/">
                <img alt="ACM @ SYUCT" src="/logo.png" />
              </a>
              <a className="site-title" href="/">
                ACM @ SYUCT
              </a>
              <ul className="visible-links">
                <li className="masthead__menu-item">
                  <Link to="/wiki">
                    <i className="fad fa-star fa-lg fa-fw" aria-hidden="true" />
                    Wiki
                  </Link>
                </li>
                <li className="masthead__menu-item">
                  <Link to="/news">
                    <i className="fad fa-newspaper fa-lg fa-fw" aria-hidden="true" />
                    News
                  </Link>
                </li>
                <li className="masthead__menu-item">
                  <a href="https://github.com/syuctacm" target="_blank" rel="noreferrer">
                    <i className="fab fa-github fa-lg fa-fw" aria-hidden="true" />
                    Github
                  </a>
                </li>
                <li className="masthead__menu-item">
                  <a href="https://oj.syuctacm.cn" target="_blank" rel="noreferrer">
                    <i className="fad fa-server fa-lg fa-fw" aria-hidden="true" />
                    OJ
                  </a>
                </li>
              </ul>
              <div className="lug-user-wrap">
                <button
                  className="search__toggle"
                  type="button"
                  onClick={user ? onToggleUserMenu : onOpenAuth}
                  aria-label={user ? '打开用户菜单' : '登录或注册'}
                  aria-expanded={user ? userMenuOpen : undefined}
                >
                  <i className={`fad ${user ? 'fa-user' : 'fa-right-to-bracket'} fa-lg`} aria-hidden="true" />
                </button>
                {user && userMenuOpen && (
                  <div className="lug-user-popover">
                    {user.role === 'admin' && (
                      <>
                        <Link to="/admin/articles" onClick={onCloseUserMenu}>
                          <i className="fad fa-file-lines fa-fw" aria-hidden="true" /> 文章管理
                        </Link>
                        <Link to="/admin/surveys" onClick={onCloseUserMenu}>
                          <i className="fad fa-clipboard-list fa-fw" aria-hidden="true" /> 问卷管理
                        </Link>
                        <div className="divider" />
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        onCloseUserMenu()
                        onLogout()
                      }}
                    >
                      <i className="fad fa-right-from-bracket fa-fw" aria-hidden="true" /> 退出登录
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>

      <div className="lug-mobile-links">
        <Link to="/wiki">Wiki</Link>
        <Link to="/news">News</Link>
        <a href="https://github.com/syuctacm" target="_blank" rel="noreferrer">Github</a>
        <a href="https://oj.syuctacm.cn" target="_blank" rel="noreferrer">OJ</a>
      </div>

      <div className="initial-content">
        <div
          className="page__hero--overlay"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,.25), rgba(0,0,0,.25)), url('/lug/autumn-1.jpg')",
          }}
        >
          <div className="wrapper">
            <h1 className="page__title" id="page-title" itemProp="headline">
              {isHome ? 'ACM @ SYUCT' : 'News'}
            </h1>
            <p className="page__lead">
              {isHome
                ? '沈阳化工大学 ACM-ICPC 集训队'
                : '沈阳化工大学 ACM-ICPC 集训队新闻与动态'}
            </p>
            <p>
              <Link className="btn btn--light-outline btn--large" to={isHome ? '/wiki' : '/'}>
                {isHome ? '了解更多' : '返回首页'}
              </Link>
            </p>
          </div>
        </div>

        <div id="main" role="main">
          <article className="splash" itemScope itemType="https://schema.org/CreativeWork">
            <section className="page__content" itemProp="text">
              {isHome && (
                <nav className="lug-nav lug-nav--intro-only" aria-label="集训队简介">
                  <div className="nav-right">
                    <div className="description">
                      <p>
                        沈阳化工大学 ACM-ICPC 集训队是由全校程序设计与算法竞赛爱好者自发组织、教练组统一指导的竞技团队，
                        旨在联合全校计算机与数学爱好者，搭建思维与代码交流共享的平台，宣传算法之美，
                        选拔培育代表学校出战 ICPC、CCPC 及各省高校程序设计大赛的优秀梯队。
                      </p>
                      <p style={{ marginTop: '0.5em' }}>
                        {weatherText}
                        <i className="fa-fw fas fa-cloud-sun" aria-hidden="true" />
                      </p>
                    </div>
                  </div>
                </nav>
              )}

              <div className="archive-group">
                <div className="archive-group__item">
                  <h3 className="archive__subtitle">
                    <Link to="/news">{isHome ? '最新文章' : '文章列表'}</Link>
                  </h3>
                  <div className="list__item">
                    <article className="archive__item" itemScope itemType="https://schema.org/CreativeWork">
                      <h2 className="archive__item-title no_toc p-name" itemProp="headline">
                        <Link className="u-url" to="/news" rel="permalink">
                          ACM 集训队新生招新与训练安排
                        </Link>
                      </h2>
                      <p className="page__meta">
                        <span className="page__meta-date">
                          <i aria-hidden="true" className="far fa-calendar-alt" />
                          <time dateTime="2026-10-19">2026 年 10 月 19 日</time>
                        </span>
                      </p>
                      <p className="archive__item-excerpt p-summary" itemProp="description">
                        这是首页文章列表的示例内容，后续可由后台管理替换。
                      </p>
                    </article>
                  </div>
                </div>
              </div>
            </section>
          </article>
        </div>
      </div>

      <div className="page__footer" id="footer">
        <footer>
          <div className="footer-row">
            <div className="footer-block footer__about">
              <p>
                沈阳化工大学 ACM-ICPC 集训队由全校程序设计与算法竞赛爱好者组成，致力于搭建算法学习、
                竞赛训练与技术交流的平台，代表学校参加 ICPC、CCPC 及各类程序设计竞赛。
              </p>
              <p style={{ marginTop: '0.5em' }}>
                {weatherText}
                <i className="fa-fw fas fa-cloud-sun" aria-hidden="true" />
              </p>
            </div>
            <div className="footer-block footer__extras">
              <div className="footer__contact">
                <ul>
                  <li>
                    <Link to="/wiki">
                      <i className="fad fa-fw fa-address-card" aria-hidden="true" /> 关于我们
                    </Link>
                  </li>
                  <li>
                    <a href="mailto:noreply@mail.syuctacm.cn">
                      <i className="fas fa-fw fa-phone-alt" aria-hidden="true" /> 联系我们
                    </a>
                  </li>
                </ul>
              </div>
              <div className="footer__logo">
                <div className="footer__logo-image">
                  <img src="/logo.png" alt="ACM @ SYUCT" className="lug-footer-logo" />
                </div>
                <div className="footer__logo-text" />
              </div>
            </div>
          </div>
        </footer>
      </div>

      <img src="/logo.png" alt="" aria-hidden="true" className="lug-watermark" />
    </div>
  )
}
