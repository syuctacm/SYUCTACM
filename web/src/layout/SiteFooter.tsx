import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchWeather } from '../api/client'

const COPYRIGHT_YEAR = new Date().getFullYear()
const FALLBACK_WEATHER = '当前天气：沈阳铁西 16.5°C 多云'

interface SiteFooterProps {
  onOpenRecruit: () => void
  onOpenHonors: () => void
  onOpenCalendar: () => void
  onOpenLinks: () => void
}

export function SiteFooter({
  onOpenRecruit,
  onOpenHonors,
  onOpenCalendar,
  onOpenLinks,
}: SiteFooterProps) {
  const [weatherText, setWeatherText] = useState(FALLBACK_WEATHER)

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

  return (
    <footer className="lug-footer" id="footer">
      <div className="lug-footer__inner">
        <div className="lug-footer__about">
          <p>
            沈阳化工大学 ACM-ICPC 集训队由全校程序设计与算法竞赛爱好者组成，致力于搭建算法学习、
            竞赛训练与技术交流的平台，代表学校参加 ICPC、CCPC 及各类程序设计竞赛。
          </p>
          <p className="weather">
            {weatherText}
            <i className="fas fa-cloud-sun fa-fw" aria-hidden="true" style={{ marginLeft: 4 }} />
          </p>
        </div>

        <div className="lug-footer__extras">
          <ul className="lug-footer__links">
            <li>
              <Link to="/wiki">
                <i className="fad fa-address-card fa-fw" aria-hidden="true" />
                关于我们
              </Link>
            </li>
            <li>
              <a href="mailto:noreply@mail.syuctacm.cn">
                <i className="fas fa-phone-alt fa-fw" aria-hidden="true" />
                联系我们
              </a>
            </li>
            <li>
              <button type="button" className="lug-footer__link-button" onClick={onOpenRecruit}>
                <i className="fad fa-user-plus fa-fw" aria-hidden="true" />
                加入我们
              </button>
            </li>
            <li>
              <button type="button" className="lug-footer__link-button" onClick={onOpenCalendar}>
                <i className="fad fa-calendar-alt fa-fw" aria-hidden="true" />
                活动日历
              </button>
            </li>
            <li>
              <button type="button" className="lug-footer__link-button" onClick={onOpenHonors}>
                <i className="fad fa-trophy fa-fw" aria-hidden="true" />
                荣誉殿堂
              </button>
            </li>
            <li>
              <button type="button" className="lug-footer__link-button" onClick={onOpenLinks}>
                <i className="fad fa-link fa-fw" aria-hidden="true" />
                友情链接
              </button>
            </li>
            <li>
              <a href="https://github.com/syuctacm" target="_blank" rel="noreferrer">
                <i className="fab fa-github fa-fw" aria-hidden="true" />
                GitHub 组织
              </a>
            </li>
          </ul>

          <div className="lug-footer__logo" aria-label={`ACM @ SYUCT ${COPYRIGHT_YEAR}`}>
            <img src="/logo.png" alt="ACM @ SYUCT" />
          </div>
        </div>
      </div>
    </footer>
  )
}
