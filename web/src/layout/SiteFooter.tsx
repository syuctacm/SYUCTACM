import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchWeather } from '../api/client'
import {
  SvgBookTileIcon,
  SvgCommentsTileIcon,
  SvgWeatherSunCloudIcon,
} from '../components/LugIcons'

const FALLBACK_WEATHER = '当前天气：沈阳铁西 16.5°C 多云'
const COPYRIGHT_YEAR = new Date().getFullYear()

export function SiteFooter() {
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
            <span>{weatherText}</span>
            <SvgWeatherSunCloudIcon className="lug-inline-svg" />
          </p>
        </div>

        <div className="lug-footer__extras">
          <ul className="lug-footer__links">
            <li>
              <Link to="/wiki">
                <SvgBookTileIcon className="lug-footer-svg" />
                关于我们
              </Link>
            </li>
            <li>
              <a href="mailto:noreply@mail.syuctacm.cn">
                <SvgCommentsTileIcon className="lug-footer-svg" />
                联系我们
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
