import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchWikiRevision } from '../api/client'
import { MarkdownContent } from '../components/MarkdownContent'
import { WikiTree } from '../components/WikiTree'
import { formatDateTime } from '../lib/format'
import type { WikiRevisionDetail } from '../types'

export function WikiRevisionPage() {
  const { id, rid } = useParams<{ id: string; rid: string }>()
  const [revision, setRevision] = useState<WikiRevisionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id || !rid) return
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchWikiRevision(Number(id), Number(rid))
        if (!cancelled) {
          setRevision(data)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '该版本加载失败')
          setLoading(false)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, rid])

  return (
    <div id="main" role="main" className="lug-single-main">
      <WikiTree currentId={id ? Number(id) : undefined} canCreate={false} />

      <article className="page h-entry">
        <div className="page__inner-wrap">
          {loading ? (
            <div className="lug-state-box">正在加载历史版本...</div>
          ) : error || !revision ? (
            <div className="lug-state-box">
              <p>{error || '该版本不存在'}</p>
              <p style={{ marginTop: '0.75rem' }}>
                <Link to={`/wiki/${id}/history`}>← 返回修订历史</Link>
              </p>
            </div>
          ) : (
            <>
              <header className="lug-page-header">
                <div className="lug-page-header__row">
                  <div>
                    <div className="lug-page-kicker">
                      历史只读快照 · r{revision.id} · {formatDateTime(revision.created_at)} · 修订人：{revision.editor}
                    </div>
                    <h1 className="page__title">{revision.title}</h1>
                  </div>
                  <div className="lug-page-actions">
                    <Link to={`/wiki/${revision.page_id}/history`} className="lug-btn">
                      ← 返回修订历史
                    </Link>
                    <Link to={`/wiki/${revision.page_id}`} className="lug-btn lug-btn--primary">
                      查看当前最新版本 →
                    </Link>
                  </div>
                </div>
              </header>

              <section className="page__content e-content">
                <MarkdownContent content={revision.content} />
              </section>
            </>
          )}
        </div>
      </article>
    </div>
  )
}
