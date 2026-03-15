import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ScrollToTop from './components/ScrollToTop'
import Ticker     from './components/Ticker'
import Navbar     from './components/Navbar'
import Footer     from './components/Footer'
import Home       from './pages/Home'
import Scores     from './pages/Scores'
import Schedule   from './pages/Schedule'
import Standings  from './pages/Standings'
import Stats      from './pages/Stats'
import Teams      from './pages/Teams'
import TeamDetail from './pages/TeamDetail'
import Playoffs   from './pages/Playoffs'
import Rules      from './pages/Rules'
import Photos     from './pages/Photos'

const TICKER_H = 46  // approximate ticker height

function NotFound() {
  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:80, color:'rgba(255,255,255,0.06)' }}>404</p>
        <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, color:'var(--white)' }}>Page Not Found</p>
        <a href="/" style={{ color:'var(--gold)', fontSize:14 }}>← Back to Home</a>
      </div>
    </div>
  )
}

function Layout({ children }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      {/* Ticker — fixed at very top, slides up when scrolled */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 301,
        transform: scrolled ? `translateY(-${TICKER_H}px)` : 'translateY(0)',
        transition: 'transform 0.25s ease',
      }}>
        <Ticker />
      </div>

      {/* Navbar — fixed below ticker, stays visible always */}
      <div style={{
        position: 'fixed', left: 0, right: 0, zIndex: 300,
        top: scrolled ? 0 : TICKER_H,
        transition: 'top 0.25s ease',
      }}>
        <Navbar />
      </div>

      {/* Page content — paddingTop accounts for ticker + navbar when at top */}
      <main style={{ paddingTop: TICKER_H + 62 }}>
        {children}
      </main>

      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/scores"        element={<Scores />} />
          <Route path="/schedule"      element={<Schedule />} />
          <Route path="/standings"     element={<Standings />} />
          <Route path="/stats"         element={<Stats />} />
          <Route path="/teams"         element={<Teams />} />
          <Route path="/teams/:teamId" element={<TeamDetail />} />
          <Route path="/playoffs"      element={<Playoffs />} />
          <Route path="/rules"         element={<Rules />} />
          <Route path="/photos"        element={<Photos />} />
          <Route path="/index.html"         element={<Navigate to="/" replace />} />
          <Route path="/schedule.html"      element={<Navigate to="/schedule" replace />} />
          <Route path="/standings-history.html" element={<Navigate to="/standings" replace />} />
          <Route path="/stats.html"         element={<Navigate to="/stats" replace />} />
          <Route path="/playoffs.html"      element={<Navigate to="/playoffs" replace />} />
          <Route path="/rules.html"         element={<Navigate to="/rules" replace />} />
          <Route path="/photos.html"        element={<Navigate to="/photos" replace />} />
          <Route path="*"                   element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
