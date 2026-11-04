import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchArticle } from '../api/client'
import { SvgCalendarTileIcon, SvgTagsTileIcon, SvgTocDocIcon } from '../components/LugIcons'
import { MarkdownContent } from '../components/MarkdownContent'
import { CATEGORY_LABELS } from '../lib/categories'
import { formatChineseDate, formatDate } from '../lib/format'
import { extractToc } from '../lib/toc'
import type { Article } from '../types'

export function ArticlePage() {
  const { id } = useParams<{ id: string }>()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchArticle(Number(id))
        if (!cancelled) {
          setArticle(data)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '文章加载失败')
          setLoading(false)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  const toc = useMemo(() => (article ? extractToc(article.content) : []), [article])

  return (
    <div id="main" role="main" className="lug-single-main lug-single-main--article">
      <article className="page h-entry lug-article-page" itemScope itemType="https://schema.org/CreativeWork">
        <div className="page__inner-wrap">
          {loading ? (
            <div className="lug-state-box">正在加载文章...</div>
          ) : error || !article ? (
            <div className="lug-state-box">
              <p>{error || '文章不存在'}</p>
              <p style={{ marginTop: '0.75rem' }}>
                <Link to="/news">← 返回文章列表</Link>
              </p>
            </div>
          ) : (
            <>
              <header className="lug-page-header">
                <h1 id="page-title" className="page__title p-name" itemProp="headline">
                  {article.title}
                </h1>
                <p className="lug-archive-item__meta" style={{ marginTop: '0.5rem' }}>
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
                      <span>作者：{article.author_name}</span>
                    </>
                  )}
                </p>
              </header>

              <section className="page__content e-content" itemProp="text">
                {toc.length > 0 && (
                  <aside className="sidebar__right sticky">
                    <nav className="toc" aria-label="Table of contents">
                      <header>
                        <h4 className="nav__title">
                          <SvgTocDocIcon className="lug-toc-svg" />
                          <span>目录</span>
                        </h4>
                      </header>
                      <ul className="toc__menu">
                        {toc.map((item) => (
                          <li
                            key={item.id}
                            className={item.level === 3 ? 'toc__menu-sub' : ''}
                          >
                            <a href={`#${item.id}`}>{item.text}</a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </aside>
                )}

                {article.summary && (
                  <blockquote className="lug-article-summary">
                    <p>{article.summary}</p>
                  </blockquote>
                )}

                <MarkdownContent content={article.content} />
              </section>

              <footer className="page__meta">
                <p className="page__taxonomy">
                  <strong>
                    <SvgTagsTileIcon className="lug-meta-svg" /> 分类:{' '}
                  </strong>
                  <span itemProp="keywords">
                    <Link
                      to={`/news?category=${article.category}`}
                      className="page__taxonomy-item p-category"
                    >
                      {CATEGORY_LABELS[article.category] ?? article.category}
                    </Link>
                  </span>
                </p>
                <p className="page__date">
                  <strong>
                    <SvgCalendarTileIcon className="lug-meta-svg" /> 发布时间:
                  </strong>{' '}
                  <time dateTime={formatDate(article.created_at)}>
                    {formatChineseDate(article.created_at)}
                  </time>
                </p>
              </footer>

              <nav className="pagination" aria-label="Post pagination">
                <Link to="/news" className="pagination--pager">
                  ← 返回 News 列表
                </Link>
                <Link to="/" className="pagination--pager">
                  返回官网首页 →
                </Link>
              </nav>
            </>
          )}
        </div>
      </article>
    </div>
  )
}
