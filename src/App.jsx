import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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

export default function App() {
  return (
    <BrowserRouter>
      {/* Ticker sits above everything, fixed at very top */}
      <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:300 }}>
        <Ticker />
        <Navbar />
      </div>
      <main style={{ paddingTop: 114 }}>
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
          {/* Legacy redirects */}
          <Route path="/index.html"        element={<Navigate to="/" replace />} />
          <Route path="/schedule.html"     element={<Navigate to="/schedule" replace />} />
          <Route path="/standings-history.html" element={<Navigate to="/standings" replace />} />
          <Route path="/stats.html"        element={<Navigate to="/stats" replace />} />
          <Route path="/playoffs.html"     element={<Navigate to="/playoffs" replace />} />
          <Route path="/rules.html"        element={<Navigate to="/rules" replace />} />
          <Route path="/photos.html"       element={<Navigate to="/photos" replace />} />
          <Route path="*"                  element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
