import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteWikiPage, fetchWikiPage, fetchWikiTree } from '../api/client'
import { SvgCalendarTileIcon, SvgTocDocIcon } from '../components/LugIcons'
import { MarkdownContent } from '../components/MarkdownContent'
import { WikiTree } from '../components/WikiTree'
import { formatDateTime } from '../lib/format'
import { canWrite, isAdmin } from '../lib/permissions'
import { extractToc } from '../lib/toc'
import { flattenWikiTree } from '../lib/wikiTree'
import type { User, WikiPage, WikiTreeItem } from '../types'

interface WikiPageViewProps {
  user: User | null
}

export function WikiPageView({ user }: WikiPageViewProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [page, setPage] = useState<WikiPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [treeItems, setTreeItems] = useState<WikiTreeItem[]>([])

  useEffect(() => {
    if (!id) return
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchWikiPage(Number(id))
        if (!cancelled) {
          setPage(data)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '页面加载失败')
          setLoading(false)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetchWikiTree()
        if (!cancelled) {
          setTreeItems(res.items ?? [])
        }
      } catch {
        // 忽略：树仅用于导航，正文不依赖
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const toc = useMemo(() => (page ? extractToc(page.content) : []), [page])

  const flatTree = useMemo(() => flattenWikiTree(treeItems), [treeItems])
  const currentIndex = page ? flatTree.findIndex((item) => item.id === page.id) : -1
  const prevPage = currentIndex > 0 ? flatTree[currentIndex - 1] : undefined
  const nextPage =
    currentIndex >= 0 && currentIndex < flatTree.length - 1
      ? flatTree[currentIndex + 1]
      : undefined

  const handleDelete = async () => {
    if (!page) return
    if (!window.confirm(`确定要删除 Wiki 页面「${page.title}」吗？该操作不可恢复。`)) return
    try {
      await deleteWikiPage(page.id)
      navigate('/wiki')
    } catch (err) {
      window.alert(err instanceof Error ? err.message : '删除失败')
    }
  }

  return (
    <div id="main" role="main" className="lug-single-main">
      <WikiTree
        currentId={page?.id ?? (id ? Number(id) : undefined)}
        canCreate={canWrite(user)}
        items={treeItems.length > 0 ? treeItems : undefined}
      />

      <article className="page h-entry" itemScope itemType="https://schema.org/CreativeWork">
        <div className="page__inner-wrap">
          {loading ? (
            <div className="lug-state-box">正在加载 Wiki 页面...</div>
          ) : error || !page ? (
            <div className="lug-state-box">
              <p>{error || '页面不存在'}</p>
              <p style={{ marginTop: '0.75rem' }}>
                <Link to="/wiki">← 返回 Wiki 知识库首页</Link>
              </p>
            </div>
          ) : (
            <>
              <header className="lug-page-header">
                <div className="lug-page-header__row">
                  <div>
                    {page.group_name && (
                      <div className="lug-page-kicker">{page.group_name}</div>
                    )}
                    <h1 id="page-title" className="page__title p-name" itemProp="headline">
                      <Link to={`/wiki/${page.id}`} itemProp="url">
                        {page.title}
                      </Link>
                    </h1>
                  </div>

                  <div className="lug-page-actions">
                    {canWrite(user) && (
                      <button
                        type="button"
                        onClick={() => navigate(`/wiki/${page.id}/edit`)}
                        className="lug-btn lug-btn--primary"
                      >
                        编辑本页
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => navigate(`/wiki/${page.id}/history`)}
                      className="lug-btn"
                    >
                      修订历史 ({page.revision_count})
                    </button>
                    {isAdmin(user) && (
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="lug-btn lug-btn--danger"
                      >
                        删除
                      </button>
                    )}
                  </div>
                </div>
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

                <MarkdownContent content={page.content} />
              </section>

              <footer className="page__meta">
                <p className="page__date">
                  <strong>
                    <SvgCalendarTileIcon className="lug-meta-svg" /> 更新时间:
                  </strong>{' '}
                  <time dateTime={page.updated_at}>{formatDateTime(page.updated_at)}</time>
                  {page.updated_by && (
                    <span className="lug-meta-sep">· 最后维护：{page.updated_by}</span>
                  )}
                </p>
              </footer>

              <nav className="pagination" aria-label="Post pagination">
                {prevPage ? (
                  <Link
                    to={`/wiki/${prevPage.id}`}
                    className="pagination--pager"
                    title={prevPage.title}
                  >
                    ← 上一页：{prevPage.title}
                  </Link>
                ) : (
                  <Link to="/wiki" className="pagination--pager" title="返回 Wiki 首页">
                    ← Wiki 知识库首页
                  </Link>
                )}
                {nextPage ? (
                  <Link
                    to={`/wiki/${nextPage.id}`}
                    className="pagination--pager"
                    title={nextPage.title}
                  >
                    下一页：{nextPage.title} →
                  </Link>
                ) : (
                  <span className="pagination--pager disabled">已是最后一页</span>
                )}
              </nav>
            </>
          )}
        </div>
      </article>
    </div>
  )
}
