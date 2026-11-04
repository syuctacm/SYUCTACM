import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { createWikiPage, fetchWikiPage, fetchWikiTree, updateWikiPage } from '../api/client'
import { MarkdownContent } from '../components/MarkdownContent'
import { WikiTree } from '../components/WikiTree'
import { canWrite } from '../lib/permissions'
import type { User, WikiTreeItem } from '../types'

interface WikiEditPageProps {
  user: User | null
  authReady: boolean
}

export function WikiEditPage({ user, authReady }: WikiEditPageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === undefined

  const [title, setTitle] = useState('')
  const [groupName, setGroupName] = useState('')
  const [content, setContent] = useState('')
  const [treeItems, setTreeItems] = useState<WikiTreeItem[]>([])
  const [previewMode, setPreviewMode] = useState(false)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isNew) return
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchWikiPage(Number(id))
        if (!cancelled) {
          setTitle(data.title)
          setGroupName(data.group_name)
          setContent(data.content)
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
  }, [id, isNew])

  useEffect(() => {
    if (!canWrite(user)) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetchWikiTree()
        if (!cancelled) {
          setTreeItems(res.items ?? [])
        }
      } catch {
        // 分组补全失败不影响编辑功能
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user])

  if (!authReady) {
    return <div className="py-20 text-center text-gray-400 text-sm">正在加载...</div>
  }

  if (!canWrite(user)) {
    return <Navigate to="/wiki" replace />
  }

  const groupOptions = [...new Set(treeItems.map((i) => i.group_name))]
    .filter((g) => g !== '')
    .sort()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('标题不能为空')
      return
    }
    if (!content.trim()) {
      setError('内容不能为空')
      return
    }
    setSaving(true)
    setError('')
    try {
      const saved = isNew
        ? await createWikiPage({ title: title.trim(), content, group_name: groupName.trim() })
        : await updateWikiPage(Number(id), {
            title: title.trim(),
            content,
            group_name: groupName.trim(),
          })
      navigate(`/wiki/${saved.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
      setSaving(false)
    }
  }

  return (
    <div id="main" role="main" className="lug-single-main">
      <WikiTree
        currentId={id ? Number(id) : undefined}
        canCreate={canWrite(user)}
        items={treeItems.length > 0 ? treeItems : undefined}
      />

      <article className="page h-entry">
        <div className="page__inner-wrap">
          <header className="lug-page-header">
            <div className="lug-page-header__row">
              <h1 className="page__title">{isNew ? '新建 Wiki 页面' : '编辑 Wiki 页面'}</h1>
              <div className="lug-page-actions">
                <button
                  type="button"
                  onClick={() => setPreviewMode((v) => !v)}
                  className="lug-btn"
                >
                  {previewMode ? '返回编辑' : '预览 Markdown'}
                </button>
                <Link
                  to={isNew ? '/wiki' : `/wiki/${id}`}
                  className="lug-btn"
                >
                  取消
                </Link>
              </div>
            </div>
          </header>

          <section className="page__content">
            {loading ? (
              <div className="lug-state-box">正在加载页面内容...</div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-600 text-xs">
                    {error}
                  </div>
                )}

                {previewMode ? (
                  <div className="p-5 rounded border border-[#cfd4d3] bg-[#fafcfc]">
                    <h2 style={{ marginTop: 0 }}>{title || '（未填写标题）'}</h2>
                    <MarkdownContent content={content || '*暂无正文内容*'} />
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="lug-clean-form">
                    <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="wiki-title" className="text-xs font-semibold text-gray-600">
                          页面标题 *
                        </label>
                        <input
                          id="wiki-title"
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="例如：图论最短路与生成树模板"
                          required
                          className="lug-input"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="wiki-group" className="text-xs font-semibold text-gray-600">
                          所属分组（如：关于 / 训练 / 算法 / 传承）
                        </label>
                        <input
                          id="wiki-group"
                          type="text"
                          value={groupName}
                          onChange={(e) => setGroupName(e.target.value)}
                          placeholder="留空归入「其他文档」"
                          list="wiki-group-options"
                          className="lug-input"
                        />
                        <datalist id="wiki-group-options">
                          {groupOptions.map((name) => (
                            <option key={name} value={name} />
                          ))}
                        </datalist>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 mt-4">
                      <label htmlFor="wiki-content" className="text-xs font-semibold text-gray-600">
                        正文内容（支持标准 Markdown，二级/三级标题自动生成右侧目录） *
                      </label>
                      <textarea
                        id="wiki-content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={18}
                        placeholder="使用 ## 小节标题 编写结构化知识文档..."
                        required
                        className="lug-textarea font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-3 mt-5">
                      <button
                        type="submit"
                        disabled={saving}
                        className="lug-btn lug-btn--primary"
                      >
                        {saving ? '正在保存...' : '保存并发布修订'}
                      </button>
                      <Link
                        to={isNew ? '/wiki' : `/wiki/${id}`}
                        className="lug-btn"
                      >
                        取消返回
                      </Link>
                    </div>
                  </form>
                )}
              </>
            )}
          </section>
        </div>
      </article>
    </div>
  )
}
