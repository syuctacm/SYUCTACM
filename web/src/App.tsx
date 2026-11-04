import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { SiteHeader } from './layout/SiteHeader'
import { SiteFooter } from './layout/SiteFooter'
import { LugPage } from './pages/LugPage'
import { ArticlePage } from './pages/ArticlePage'
import { WikiListPage } from './pages/WikiListPage'
import { WikiPageView } from './pages/WikiPageView'
import { WikiEditPage } from './pages/WikiEditPage'
import { WikiHistoryPage } from './pages/WikiHistoryPage'
import { WikiRevisionPage } from './pages/WikiRevisionPage'
import { SurveyListPage } from './pages/SurveyListPage'
import { SurveyFillPage } from './pages/SurveyFillPage'
import { AdminSurveyListPage } from './pages/AdminSurveyListPage'
import { AdminSurveyEditPage } from './pages/AdminSurveyEditPage'
import { AdminSurveySubmissionPage } from './pages/AdminSurveySubmissionPage'
import { AdminArticleListPage } from './pages/AdminArticleListPage'
import { AdminArticleEditPage } from './pages/AdminArticleEditPage'
import { AuthModal } from './components/AuthModal'
import { clearToken, fetchMe, getToken } from './api/client'
import type { User } from './types'

function ArticleRoute() {
  const { id } = useParams<{ id: string }>()
  return <ArticlePage key={id} />
}

function WikiPageRoute({ user }: { user: User | null }) {
  const { id } = useParams<{ id: string }>()
  return <WikiPageView key={id} user={user} />
}

function SiteShell() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [user, setUser] = useState<User | null>(null)
  const [authReady, setAuthReady] = useState(() => getToken() === null)

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  useEffect(() => {
    if (!getToken()) return
    let cancelled = false
    fetchMe()
      .then((res) => {
        if (!cancelled) setUser(res.user)
      })
      .catch(() => clearToken())
      .finally(() => {
        if (!cancelled) setAuthReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleLogout = () => {
    clearToken()
    setUser(null)
    navigate('/')
  }

  const isSplashRoute = pathname === '/' || pathname === '/news'
  const isWideSingleRoute =
    pathname.startsWith('/wiki') || pathname.startsWith('/article/')

  return (
    <div className="lug-root flex min-h-screen flex-col">
      <SiteHeader
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <main
        className={
          isSplashRoute || isWideSingleRoute
            ? 'flex-1 w-full'
            : 'flex-1 w-full max-w-[1040px] mx-auto px-5'
        }
      >
        <Routes>
          <Route path="/" element={<LugPage key="home" mode="home" />} />
          <Route path="/news" element={<LugPage key="news" mode="news" />} />
          <Route path="/article/:id" element={<ArticleRoute />} />
          <Route path="/wiki" element={<WikiListPage user={user} />} />
          <Route path="/wiki/new" element={<WikiEditPage user={user} authReady={authReady} />} />
          <Route path="/wiki/:id" element={<WikiPageRoute user={user} />} />
          <Route
            path="/wiki/:id/edit"
            element={<WikiEditPage user={user} authReady={authReady} />}
          />
          <Route path="/wiki/:id/history" element={<WikiHistoryPage user={user} />} />
          <Route path="/wiki/:id/revisions/:rid" element={<WikiRevisionPage />} />
          <Route path="/surveys" element={<SurveyListPage />} />
          <Route path="/surveys/:id" element={<SurveyFillPage authReady={authReady} />} />
          <Route
            path="/admin/surveys"
            element={<AdminSurveyListPage user={user} authReady={authReady} />}
          />
          <Route
            path="/admin/surveys/new"
            element={<AdminSurveyEditPage user={user} authReady={authReady} />}
          />
          <Route
            path="/admin/surveys/:id"
            element={<AdminSurveyEditPage user={user} authReady={authReady} />}
          />
          <Route
            path="/admin/surveys/:id/submissions/:sid"
            element={<AdminSurveySubmissionPage user={user} authReady={authReady} />}
          />
          <Route
            path="/admin/articles"
            element={<AdminArticleListPage user={user} authReady={authReady} />}
          />
          <Route
            path="/admin/articles/new"
            element={<AdminArticleEditPage user={user} authReady={authReady} />}
          />
          <Route
            path="/admin/articles/:id/edit"
            element={<AdminArticleEditPage user={user} authReady={authReady} />}
          />
          <Route path="*" element={<LugPage key="home-fallback" mode="home" />} />
        </Routes>
      </main>

      <SiteFooter />

      <img src="/logo.png" alt="" aria-hidden="true" className="lug-watermark" />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(u) => setUser(u)}
      />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteShell />
    </BrowserRouter>
  )
}
