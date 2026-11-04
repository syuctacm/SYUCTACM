import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchWikiPages } from '../api/client'
import { SvgCalendarTileIcon, SvgTocDocIcon } from '../components/LugIcons'
import { WikiTree } from '../components/WikiTree'
import { formatDateTime } from '../lib/format'
import { canWrite } from '../lib/permissions'
import { groupWikiTree } from '../lib/wikiTree'
import type { User, WikiPageSummary, WikiTreeItem } from '../types'

interface WikiListPageProps {
  user: User | null
}

export function WikiListPage({ user }: WikiListPageProps) {
  const [pages, setPages] = useState<WikiPageSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetchWikiPages(1, 50)
        if (!cancelled) {
          setPages(res.items ?? [])
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setError('Wiki 列表加载失败，请稍后重试')
          setLoading(false)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const treeItems: WikiTreeItem[] = useMemo(
    () =>
      pages.map((p) => ({
        id: p.id,
        title: p.title,
        group_name: p.group_name,
      })),
    [pages]
  )

  const groups = useMemo(() => groupWikiTree(treeItems), [treeItems])
  const firstPage = groups[0]?.pages[0]

  return (
    <div id="main" role="main" className="lug-single-main">
      <WikiTree canCreate={canWrite(user)} items={!loading && !error ? treeItems : undefined} />

      <article className="page h-entry" itemScope itemType="https://schema.org/CreativeWork">
        <div className="page__inner-wrap">
          <header className="lug-page-header">
            <div className="lug-page-header__row">
              <h1 id="page-title" className="page__title p-name" itemProp="headline">
                <Link to="/wiki" itemProp="url">
                  沈阳化工大学 ACM-ICPC 集训队
                </Link>
              </h1>

              {canWrite(user) && (
                <div className="lug-page-actions">
                  <Link to="/wiki/new" className="lug-btn lug-btn--primary">
                    + 新建 Wiki 页面
                  </Link>
                </div>
              )}
            </div>
          </header>

          <section className="page__content e-content" itemProp="text">
            <aside className="sidebar__right sticky">
              <nav className="toc" aria-label="Table of contents">
                <header>
                  <h4 className="nav__title">
                    <SvgTocDocIcon className="lug-toc-svg" />
                    <span>目录</span>
                  </h4>
                </header>
                <ul className="toc__menu">
                  <li>
                    <a href="#网络平台与训练服务">网络平台与训练服务</a>
                  </li>
                  <li>
                    <a href="#赛事与特色活动">赛事与特色活动</a>
                  </li>
                  <li>
                    <a href="#联系与加入我们">联系与加入我们</a>
                  </li>
                  <li>
                    <a href="#知识库全部条目">知识库全部条目</a>
                  </li>
                </ul>
              </nav>
            </aside>

            <p>
              <strong>沈阳化工大学 ACM-ICPC 集训队</strong>（ACM @ SYUCT）是由全校程序设计与算法竞赛爱好者自发组织、
              计算机科学与技术学院指导教师团队统筹指导的学术型竞技社团，旨在联合全校喜爱算法、数学与计算机科学的同学，
              搭建代码切磋、思想碰撞与经验传承的开放平台。
            </p>

            <h2 id="网络平台与训练服务">
              网络平台与训练服务
              <a className="permalink" href="#网络平台与训练服务" aria-hidden="true" tabIndex={-1}>
                #
              </a>
            </h2>
            <ul>
              <li>
                <p>
                  <strong>
                    <a href="https://oj.syuctacm.cn" target="_blank" rel="noreferrer">
                      校内核心评测平台（Hydro OJ）
                    </a>
                    ：
                  </strong>
                </p>
                <p>
                  集训队日常训练、新生选拔赛、专题题单与个人训练热力图（Activity Calendar）的核心基础设施。
                </p>
              </li>
              <li>
                <p>
                  <strong>
                    <a href="https://oj.syuctacm.cn/p" target="_blank" rel="noreferrer">
                      算法专题与题目标签榜（Tag Stat）
                    </a>
                    ：
                  </strong>
                </p>
                <p>
                  标准化的题库算法分类（模拟、贪心、二分、动态规划、图论、数论与数据结构），支持实时查看各专题刷题排行。
                </p>
              </li>
              <li>
                <p>
                  <strong>
                    <Link to="/news?category=senior">薪火相传经验档案库</Link>：
                  </strong>
                </p>
                <p>
                  收录自 13 届、14 届、15 届以来历届队长与老队员在算法训练、ICPC 赛场、考研保研与名企实习中的真实总结。
                </p>
              </li>
            </ul>

            <h2 id="赛事与特色活动">
              赛事与特色活动
              <a className="permalink" href="#赛事与特色活动" aria-hidden="true" tabIndex={-1}>
                #
              </a>
            </h2>
            <ul>
              <li>
                <p>
                  <strong>秋季新生算法选拔赛与入门讲堂：</strong>
                </p>
                <p>
                  每年秋季学期面向全校大一、大二同学开放，从 C/C++ 基础语法、STL 容器到基础算法思维，帮助零基础同学迈入算法竞赛大门。
                </p>
              </li>
              <li>
                <p>
                  <strong>每周例行训练赛与赛后讲评：</strong>
                </p>
                <p>
                  每周末组织 5 小时全真模拟赛或 Codeforces / AtCoder 线上合练，赛后由高年级队员现场拆解核心题型与代码实现。
                </p>
              </li>
              <li>
                <p>
                  <strong>ICPC / CCPC / 辽宁省赛出征：</strong>
                </p>
                <p>
                  选拔优秀三人小队代表沈阳化工大学参加国际大学生程序设计竞赛（ICPC）、中国大学生程序设计竞赛（CCPC）、辽宁省赛及蓝桥杯、天梯赛等赛事。
                </p>
              </li>
            </ul>

            <h2 id="联系与加入我们">
              联系与加入我们
              <a className="permalink" href="#联系与加入我们" aria-hidden="true" tabIndex={-1}>
                #
              </a>
            </h2>
            <ul>
              <li>
                官方邮箱：<code>noreply@mail.syuctacm.cn</code>
              </li>
              <li>日常训练室：沈阳化工大学计算机科学与技术学院 ACM 集训实验室</li>
              <li>
                GitHub 组织：
                <a href="https://github.com/syuctacm" target="_blank" rel="noreferrer">
                  https://github.com/syuctacm
                </a>
              </li>
              <li>
                协作说明：本 Wiki 对所有登录成员开放编写与修订权限，每次修改均自动生成版本快照，支持随时比对与一键回退。
              </li>
            </ul>

            <h2 id="知识库全部条目">
              知识库全部条目
              <a className="permalink" href="#知识库全部条目" aria-hidden="true" tabIndex={-1}>
                #
              </a>
            </h2>
            {loading ? (
              <p className="lug-muted-note">正在加载知识库目录...</p>
            ) : error ? (
              <p className="lug-muted-note">{error}</p>
            ) : pages.length === 0 ? (
              <p className="lug-muted-note">
                当前暂无自定义词条。
                {canWrite(user)
                  ? ' 点击右上角「+ 新建 Wiki 页面」创建第一篇文档。'
                  : ' 登录后即可参与创建与编辑。'}
              </p>
            ) : (
              <div className="lug-wiki-index">
                {groups.map((g) => (
                  <div key={g.group || '__ungrouped'} className="lug-wiki-index__group">
                    <h3>{g.group === '' ? '其他文档' : g.group}</h3>
                    <ul>
                      {g.pages.map((item) => {
                        const full = pages.find((p) => p.id === item.id)
                        return (
                          <li key={item.id}>
                            <Link to={`/wiki/${item.id}`}>{item.title}</Link>
                            {full && (
                              <span className="lug-wiki-index__meta">
                                （更新于 {formatDateTime(full.updated_at)}
                                {full.updated_by ? ` · ${full.updated_by}` : ''}）
                              </span>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>

          <footer className="page__meta">
            <p className="page__date">
              <strong>
                <SvgCalendarTileIcon className="lug-meta-svg" /> 知识库状态:
              </strong>{' '}
              <span>共收录 {pages.length} 篇协作文档 · 支持 Markdown 实时预览与历史版本回溯</span>
            </p>
          </footer>

          {firstPage && (
            <nav className="pagination" aria-label="Post pagination">
              <span className="pagination--pager disabled">Wiki 首页</span>
              <Link
                to={`/wiki/${firstPage.id}`}
                className="pagination--pager"
                title={firstPage.title}
              >
                下一页：{firstPage.title} →
              </Link>
            </nav>
          )}
        </div>
      </article>
    </div>
  )
}
