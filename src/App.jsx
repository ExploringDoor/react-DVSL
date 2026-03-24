import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
        <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:80, color:'rgba(0,0,0,0.05)' }}>404</p>
        <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, color:'var(--white)' }}>Page Not Found</p>
        <a href="/" style={{ color:'var(--gold)', fontSize:14 }}>← Back to Home</a>
      </div>
    </div>
  )
}

function Layout({ children }) {
  return (
    <>
      {/* Ticker at very top - scrolls away naturally */}
      <div style={{ position: 'relative', zIndex: 200 }}>
        <Ticker />
      </div>

      {/* Navbar sticks after ticker scrolls away */}
      <div style={{ position: 'sticky', top: 0, zIndex: 300 }}>
        <Navbar />
      </div>

      <main>
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
          <Route path="/schedule2"      element={<Schedule2 />} />
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
