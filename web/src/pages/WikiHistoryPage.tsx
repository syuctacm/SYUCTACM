import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchWikiPage, fetchWikiRevisions, revertWikiPage } from '../api/client'
import { WikiTree } from '../components/WikiTree'
import { formatDateTime } from '../lib/format'
import { canWrite } from '../lib/permissions'
import type { User, WikiRevision } from '../types'

interface WikiHistoryPageProps {
  user: User | null
}

export function WikiHistoryPage({ user }: WikiHistoryPageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [revisions, setRevisions] = useState<WikiRevision[]>([])
  const [pageTitle, setPageTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [revertingId, setRevertingId] = useState<number | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    ;(async () => {
      try {
        const [pageRes, revRes] = await Promise.all([
          fetchWikiPage(Number(id)),
          fetchWikiRevisions(Number(id)),
        ])
        if (!cancelled) {
          setPageTitle(pageRes.title)
          setRevisions(revRes.items ?? [])
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '修订历史加载失败')
          setLoading(false)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  const handleRevert = async (rid: number) => {
    if (!id) return
    if (!window.confirm('确定要回退到该版本吗？当前内容将被替换，且此操作会记录一次新的修订。')) return
    setRevertingId(rid)
    try {
      const page = await revertWikiPage(Number(id), rid)
      navigate(`/wiki/${page.id}`)
    } catch (err) {
      window.alert(err instanceof Error ? err.message : '回退失败')
      setRevertingId(null)
    }
  }

  return (
    <div id="main" role="main" className="lug-single-main">
      <WikiTree currentId={id ? Number(id) : undefined} canCreate={canWrite(user)} />

      <article className="page h-entry">
        <div className="page__inner-wrap">
          <header className="lug-page-header">
            <div className="lug-page-header__row">
              <div>
                <div className="lug-page-kicker">版本控制 · 修订留痕</div>
                <h1 className="page__title">
                  {pageTitle ? `修订历史：${pageTitle}` : '修订历史'}
                </h1>
              </div>
              {id && (
                <div className="lug-page-actions">
                  <Link to={`/wiki/${id}`} className="lug-btn">
                    ← 返回词条正文
                  </Link>
                </div>
              )}
            </div>
          </header>

          <section className="page__content">
            {loading ? (
              <div className="lug-state-box">正在加载修订历史...</div>
            ) : error ? (
              <div className="lug-state-box">{error}</div>
            ) : revisions.length === 0 ? (
              <div className="lug-state-box">暂无历史修订记录</div>
            ) : (
              <ul className="list-none m-0 p-0">
                {revisions.map((rev, idx) => (
                  <li
                    key={rev.id}
                    className="py-3.5 border-b border-[#e5e7eb] flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="text-sm">
                      <span className="inline-block px-2 py-0.5 rounded bg-[#f3f6f6] border border-[#cfd4d3] font-mono text-xs text-[#187165] mr-2.5">
                        r{rev.id}{idx === 0 ? ' · 最新' : ''}
                      </span>
                      <span className="font-semibold text-[#40514e]">{rev.title}</span>
                      <span className="text-xs text-gray-500 ml-3">
                        {formatDateTime(rev.created_at)} · 修订人：{rev.editor}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/wiki/${rev.page_id}/revisions/${rev.id}`)}
                        className="lug-btn"
                      >
                        查看快照
                      </button>
                      {canWrite(user) && (
                        <button
                          type="button"
                          onClick={() => handleRevert(rev.id)}
                          disabled={revertingId !== null}
                          className="lug-btn lug-btn--danger"
                        >
                          {revertingId === rev.id ? '回退中...' : '回退到此版'}
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </article>
    </div>
  )
}
