import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { fetchWikiTree } from '../api/client'
import { groupWikiTree } from '../lib/wikiTree'
import {
  SvgBookTileIcon,
  SvgCalendarTileIcon,
  SvgCommentsTileIcon,
  SvgDocItemIcon,
  SvgFolderPageIcon,
  SvgOjServerIcon,
  SvgTagsTileIcon,
  SvgTerminalTileIcon,
  SvgTrophyTileIcon,
  SvgWikiStarIcon,
} from './LugIcons'
import type { WikiTreeItem } from '../types'

interface WikiTreeProps {
  currentId?: number
  canCreate: boolean
  items?: WikiTreeItem[]
}

function renderItemIcon(title: string, group: string) {
  const text = `${group} ${title}`
  if (text.includes('关于') || text.includes('简介') || text.includes('ACM @ SYUCT')) {
    return <SvgWikiStarIcon className="lug-wiki-nav-svg" />
  }
  if (text.includes('OJ') || text.includes('评测') || text.includes('平台')) {
    return <SvgOjServerIcon className="lug-wiki-nav-svg" />
  }
  if (text.includes('标签') || text.includes('分类')) {
    return <SvgTagsTileIcon className="lug-wiki-nav-svg" />
  }
  if (text.includes('赛') || text.includes('荣誉') || text.includes('获奖')) {
    return <SvgTrophyTileIcon className="lug-wiki-nav-svg" />
  }
  if (text.includes('训练') || text.includes('日历') || text.includes('安排')) {
    return <SvgCalendarTileIcon className="lug-wiki-nav-svg" />
  }
  if (text.includes('路线') || text.includes('模板') || text.includes('算法')) {
    return <SvgTerminalTileIcon className="lug-wiki-nav-svg" />
  }
  if (text.includes('联系') || text.includes('加入') || text.includes('招新')) {
    return <SvgCommentsTileIcon className="lug-wiki-nav-svg" />
  }
  if (text.includes('指南') || text.includes('手册') || text.includes('薪火')) {
    return <SvgBookTileIcon className="lug-wiki-nav-svg" />
  }
  if (group) {
    return <SvgDocItemIcon className="lug-wiki-nav-svg" />
  }
  return <SvgFolderPageIcon className="lug-wiki-nav-svg" />
}

export function WikiTree({ currentId, canCreate, items }: WikiTreeProps) {
  const { pathname } = useLocation()
  const [fetchedTree, setFetchedTree] = useState<WikiTreeItem[] | null>(null)
  const [error, setError] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (items) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetchWikiTree()
        if (!cancelled) {
          setFetchedTree(res.items ?? [])
        }
      } catch {
        if (!cancelled) {
          setError('页面树加载失败')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [items])

  const tree = items ?? fetchedTree
  const isOverviewActive = pathname === '/wiki' && currentId === undefined

  if (error) {
    return (
      <div className="sidebar sticky">
        <div className="lug-wiki-tree-state">{error}</div>
      </div>
    )
  }

  if (tree === null) {
    return (
      <div className="sidebar sticky">
        <div className="lug-wiki-tree-state">正在加载目录...</div>
      </div>
    )
  }

  const groups = groupWikiTree(tree)

  return (
    <div className="sidebar sticky">
      <nav className="nav__list" aria-label="Wiki navigation">
        <input
          id="ac-toc"
          name="accordion-toc"
          type="checkbox"
          checked={mobileOpen}
          onChange={(e) => setMobileOpen(e.target.checked)}
        />
        <label htmlFor="ac-toc">切换 Wiki 目录</label>

        <ul className="nav__items">
          <li>
            <span className="nav__sub-title">总览</span>
            <ul>
              <li>
                <Link to="/wiki" className={isOverviewActive ? 'active' : ''}>
                  <SvgWikiStarIcon className="lug-wiki-nav-svg" />
                  <span>ACM @ SYUCT 知识库</span>
                </Link>
              </li>
            </ul>
          </li>

          {groups.map((g) => (
            <li key={g.group || '__ungrouped'}>
              <span className="nav__sub-title">{g.group === '' ? '其他文档' : g.group}</span>
              <ul>
                {g.pages.map((page) => (
                  <li key={page.id}>
                    <Link
                      to={`/wiki/${page.id}`}
                      className={page.id === currentId ? 'active' : ''}
                    >
                      {renderItemIcon(page.title, g.group)}
                      <span>{page.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {canCreate && (
          <div className="lug-wiki-actions">
            <Link to="/wiki/new" className="lug-wiki-new-btn">
              <Plus className="w-3.5 h-3.5" />
              <span>新建页面</span>
            </Link>
          </div>
        )}
      </nav>
    </div>
  )
}
