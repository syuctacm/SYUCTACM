import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchArticles } from '../api/client'
import { LugHero } from '../components/LugHero'
import { CATEGORY_FILTER_OPTIONS, CATEGORY_LABELS } from '../lib/categories'
import { formatChineseDate } from '../lib/format'
import type { Article } from '../types'

export function NewsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') ?? ''
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchArticles({ category: category || undefined })
      .then((res) => {
        if (!cancelled) {
          setArticles(res.items ?? [])
          setError('')
        }
      })
      .catch(() => {
        if (!cancelled) setError('文章列表加载失败，请稍后重试')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [category])

  const chooseCategory = (key: string) => {
    setLoading(true)
    if (key) setSearchParams({ category: key })
    else setSearchParams({})
  }

  return (
    <div className="lug-page">
      <LugHero
        title="News"
        lead="沈阳化工大学 ACM-ICPC 集训队新闻与动态"
        actionLabel="返回首页"
        actionTo="/"
      />

      <div className="lug-container">
        <section className="lug-articles" aria-labelledby="news-title">
          <h2 id="news-title" className="lug-section-title">
            最新文章
          </h2>

          <div className="lug-news-filter">
            {CATEGORY_FILTER_OPTIONS.map((item) => (
              <button
                type="button"
                key={item.key}
                className={category === item.key ? 'is-active' : ''}
                onClick={() => chooseCategory(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="lug-state">正在加载文章列表...</div>
          ) : error ? (
            <div className="lug-state">{error}</div>
          ) : articles.length === 0 ? (
            <div className="lug-state">暂无该分类的文章</div>
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
                    <span className="lug-article__category">
                      {CATEGORY_LABELS[article.category] ?? article.category}
                    </span>
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
