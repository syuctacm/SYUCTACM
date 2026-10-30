import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchArticles, fetchWeather } from '../api/client'
import { LugHero } from '../components/LugHero'
import { formatChineseDate } from '../lib/format'
import type { Article } from '../types'

const FALLBACK_WEATHER = '当前天气：沈阳铁西 16.5°C 多云'

interface HomePageProps {
  onOpenCalendar: () => void
  onOpenLinks: () => void
}

export function HomePage({ onOpenCalendar, onOpenLinks }: HomePageProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    let cancelled = false
    fetchArticles()
      .then((res) => {
        if (!cancelled) setArticles((res.items ?? []).slice(0, 5))
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="lug-page">
      <LugHero
        title="ACM @ SYUCT"
        lead="沈阳化工大学 ACM-ICPC 集训队"
        actionLabel="了解更多"
        actionTo="/wiki"
      />

      <div className="lug-service-wrap">
        <nav className="lug-service-hub" aria-label="社团服务导航">
          <div className="lug-service-hub__side">
            <div className="lug-service-grid">
              <a
                className="lug-service-tile lug-service-tile--tint-red"
                href="https://oj.syuctacm.cn"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fad fa-terminal fa-fw" aria-hidden="true" />
                <span>Hydro OJ</span>
              </a>
              <a
                className="lug-service-tile lug-service-tile--tint-green"
                href="https://oj.syuctacm.cn/p"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fad fa-tags fa-fw" aria-hidden="true" />
                <span>题目标签榜</span>
              </a>
              <Link className="lug-service-tile lug-service-tile--tint-blue" to="/news?category=senior">
                <i className="fad fa-book-open fa-fw" aria-hidden="true" />
                <span>薪火相传</span>
              </Link>
              <Link className="lug-service-tile lug-service-tile--tint-yellow" to="/news?category=contest">
                <i className="fad fa-graduation-cap fa-fw" aria-hidden="true" />
                <span>历届选拔赛</span>
              </Link>
            </div>
          </div>

          <div className="lug-service-hub__middle">
            <p>
              沈阳化工大学 ACM-ICPC 集训队是由全校程序设计与算法竞赛爱好者自发组织、教练组统一指导的竞技团队，
              旨在联合全校计算机与数学爱好者，搭建思维与代码交流共享的平台，宣传算法之美，
              选拔培育代表学校出战 ICPC、CCPC 及各省高校程序设计大赛的优秀梯队。
            </p>
            <p className="weather">
              {weatherText}
              <i className="fas fa-cloud-sun fa-fw" aria-hidden="true" style={{ marginLeft: 4 }} />
            </p>
          </div>

          <div className="lug-service-hub__side">
            <div className="lug-service-grid">
              <button
                type="button"
                className="lug-service-tile lug-service-tile--fg-red"
                onClick={onOpenCalendar}
              >
                <i className="fad fa-calendar-alt fa-fw" aria-hidden="true" />
                <span>活动日历</span>
              </button>
              <a className="lug-service-tile lug-service-tile--fg-green" href="mailto:noreply@mail.syuctacm.cn">
                <i className="fad fa-comments fa-fw" aria-hidden="true" />
                <span>联系我们</span>
              </a>
              <Link className="lug-service-tile lug-service-tile--fg-blue" to="/wiki">
                <i className="fad fa-thumbs-up fa-fw" aria-hidden="true" />
                <span>更多服务</span>
              </Link>
              <button
                type="button"
                className="lug-service-tile lug-service-tile--fg-yellow"
                onClick={onOpenLinks}
              >
                <i className="fad fa-link fa-fw" aria-hidden="true" />
                <span>友情链接</span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      <div className="lug-container">
        <section id="articles" className="lug-articles">
          <h2 className="lug-section-title">
            <Link to="/news">最新文章</Link>
          </h2>

          {loading ? (
            <div className="lug-state">正在加载文章列表...</div>
          ) : articles.length === 0 ? (
            <div className="lug-state">暂无文章</div>
          ) : (
            <div className="lug-article-list">
              {articles.map((article) => (
                <article className="lug-article" key={article.id}>
                  <h3 className="lug-article__title">
                    <Link to={`/article/${article.id}`}>{article.title}</Link>
                  </h3>
                  <p className="lug-article__meta">
                    <i className="far fa-calendar-alt fa-fw" aria-hidden="true" />
                    <time dateTime={article.created_at}>{formatChineseDate(article.created_at)}</time>
                  </p>
                  {article.summary && <p className="lug-article__summary">{article.summary}</p>}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
