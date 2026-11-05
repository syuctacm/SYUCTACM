import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchArticles, fetchWeather } from '../api/client'
import {
  SvgCalendarTileIcon,
  SvgWeatherSunCloudIcon,
} from '../components/LugIcons'
import { CATEGORY_FILTERS, CATEGORY_LABELS } from '../lib/categories'
import { formatChineseDate, formatDate } from '../lib/format'
import type { Article, ArticleCategory } from '../types'

type LugPageMode = 'home' | 'news'

interface LugPageProps {
  mode: LugPageMode
}

const FALLBACK_WEATHER = '当前天气：沈阳铁西 16.5°C 多云'
const NEWS_PAGE_SIZE = 10

export function LugPage({ mode }: LugPageProps) {
  const isHome = mode === 'home'
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = (searchParams.get('category') || '') as ArticleCategory | ''
  const searchQuery = searchParams.get('q') || ''
  const [page, setPage] = useState(1)

  const [articles, setArticles] = useState<Article[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(!isHome)
  const [weatherText, setWeatherText] = useState(FALLBACK_WEATHER)

  useEffect(() => {
    if (!isHome) return
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
  }, [isHome])

  useEffect(() => {
    if (isHome) return
    let cancelled = false
    fetchArticles({
      category: activeCategory ? activeCategory : undefined,
      search: searchQuery ? searchQuery : undefined,
      page,
      page_size: NEWS_PAGE_SIZE,
    })
      .then((res) => {
        if (!cancelled) {
          setArticles(res.items ?? [])
          setTotal(res.total ?? 0)
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [isHome, activeCategory, page, searchQuery])

  const totalPages = Math.max(1, Math.ceil(total / NEWS_PAGE_SIZE))

  const handleCategoryChange = (cat: ArticleCategory | '') => {
    setLoading(true)
    setPage(1)
    if (cat === '') {
      setSearchParams({})
    } else {
      setSearchParams({ category: cat })
    }
  }

  const handlePageChange = (nextPage: number) => {
    setLoading(true)
    setPage(nextPage)
  }

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = String(new FormData(event.currentTarget).get('q') || '').trim()
    const next = new URLSearchParams(searchParams)
    if (value) next.set('q', value)
    else next.delete('q')
    setLoading(true)
    setPage(1)
    setSearchParams(next)
  }

  return (
    <div className="lug-splash-page">
      <div
        className="lug-hero"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.26), rgba(0, 0, 0, 0.3)), url('/lug/autumn-1.jpg')",
        }}
      >
        <div className="lug-hero__wrapper">
          <h1 className="lug-hero__title" id="page-title" itemProp="headline">
            {isHome ? 'ACM @ SYUCT' : 'ACM 新闻与动态'}
          </h1>
          <p className="lug-hero__lead">
            {isHome
              ? '沈阳化工大学 ACM-ICPC 集训队'
              : '赛事喜报、集训通知、选拔安排与历届队员薪火相传总结'}
          </p>
        </div>
      </div>

      <div className="lug-splash-main">
        {isHome && (
          <section className="lug-intro-card" aria-label="集训队简介">
            <p>
              沈阳化工大学 ACM-ICPC 集训队是由全校程序设计与算法竞赛爱好者自发组织、教练组统一指导的竞技团队，
              旨在联合全校计算机与数学爱好者，搭建思维与代码交流共享的平台，宣传算法之美，
              选拔培育代表学校出战 ICPC、CCPC 及各省高校程序设计大赛的优秀梯队。
            </p>
            <p className="lug-intro-card__weather">
              <span>{weatherText}</span>
              <SvgWeatherSunCloudIcon className="lug-inline-svg" />
            </p>
          </section>
        )}

        <div className={isHome ? 'lug-archive-section' : 'lug-news-archive'}>
          <div className="lug-archive-header">
            <h3 className="lug-archive-subtitle">
              {isHome ? <Link to="/news">最新文章</Link> : '文章归档'}
            </h3>

            {!isHome && (
              <div className="lug-archive-controls">
                <form className="lug-search-form" role="search" onSubmit={handleSearch}>
                  <input
                    key={searchQuery}
                    name="q"
                    type="search"
                    defaultValue={searchQuery}
                    placeholder="搜索文章标题"
                    aria-label="搜索文章标题"
                    className="lug-search-input"
                  />
                  <button type="submit" className="lug-search-btn">搜索</button>
                </form>
                <div className="lug-category-pills" role="tablist" aria-label="文章分类筛选">
                  {CATEGORY_FILTERS.map((f) => {
                    const active = activeCategory === f.value
                    return (
                      <button
                        key={f.value || 'all'}
                        type="button"
                        onClick={() => handleCategoryChange(f.value)}
                        className={`lug-category-pill${active ? ' is-active' : ''}`}
                      >
                        {f.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {isHome ? (
            <div className="lug-entries-list">
              <div className="lug-list-item">
                <article
                  className="lug-archive-item"
                  itemScope
                  itemType="https://schema.org/CreativeWork"
                >
                  <h2 className="lug-archive-item__title" itemProp="headline">
                    <Link to="/news" rel="permalink">
                      ACM 集训队新生招新与训练安排
                    </Link>
                  </h2>
                  <p className="lug-archive-item__meta">
                    <span className="lug-archive-item__date">
                      <SvgCalendarTileIcon className="lug-meta-svg" />
                      <time dateTime="2026-10-19">2026 年 10 月 19 日</time>
                    </span>
                    <span className="lug-meta-sep">·</span>
                    <span>示例文章</span>
                  </p>
                  <p className="lug-archive-item__excerpt" itemProp="description">
                    这是首页文章列表的示例内容，后续可由后台管理替换。
                  </p>
                </article>
              </div>
            </div>
          ) : loading ? (
            <p className="lug-state-text">正在加载文章...</p>
          ) : articles.length === 0 ? (
            <p className="lug-state-text">暂无相关文章</p>
          ) : (
            <div className="lug-entries-list">
              {articles.map((article) => (
                <div className="lug-list-item" key={article.id}>
                  <article
                    className="lug-archive-item"
                    itemScope
                    itemType="https://schema.org/CreativeWork"
                  >
                    <h2 className="lug-archive-item__title" itemProp="headline">
                      <Link to={`/article/${article.id}`} rel="permalink">
                        {article.title}
                      </Link>
                      {article.is_pinned && <span className="lug-pin-badge">置顶</span>}
                    </h2>
                    <p className="lug-archive-item__meta">
                      <span className="lug-archive-item__date">
                        <SvgCalendarTileIcon className="lug-meta-svg" />
                        <time dateTime={formatDate(article.created_at)}>
                          {formatChineseDate(article.created_at)}
                        </time>
                      </span>
                      <span className="lug-meta-sep">·</span>
                      <span>{CATEGORY_LABELS[article.category] ?? article.category}</span>
                      {article.author_name && (
                        <>
                          <span className="lug-meta-sep">·</span>
                          <span>{article.author_name}</span>
                        </>
                      )}
                    </p>
                    <p className="lug-archive-item__excerpt" itemProp="description">
                      {article.summary || article.content.slice(0, 140)}
                    </p>
                  </article>
                </div>
              ))}
            </div>
          )}

          {!isHome && totalPages > 1 && (
            <nav className="pagination" aria-label="Pagination">
              <ul>
                <li>
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    className={page <= 1 ? 'disabled' : ''}
                  >
                    上一页
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <li key={n}>
                    <button
                      type="button"
                      onClick={() => handlePageChange(n)}
                      className={n === page ? 'current disabled' : ''}
                    >
                      {n}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                    className={page >= totalPages ? 'disabled' : ''}
                  >
                    下一页
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  )
}
