import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar    from './components/Navbar'
import Footer    from './components/Footer'
import Home      from './pages/Home'
import Scores    from './pages/Scores'
import Schedule  from './pages/Schedule'
import Standings from './pages/Standings'
import Stats     from './pages/Stats'
import Teams     from './pages/Teams'
import TeamDetail from './pages/TeamDetail'
import Playoffs  from './pages/Playoffs'
import Rules     from './pages/Rules'
import Photos    from './pages/Photos'

function NotFound() {
  return (
    <div className="min-h-screen bg-dvsl-bg flex items-center justify-center pt-16">
      <div className="text-center">
        <p className="font-display text-8xl text-dvsl-border mb-4">404</p>
        <p className="font-display text-3xl text-dvsl-text mb-2">Page Not Found</p>
        <p className="text-dvsl-muted text-sm mb-6">That page doesn't exist or has been moved.</p>
        <a href="/" className="btn-primary inline-block">← Back to Home</a>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/scores"     element={<Scores />} />
          <Route path="/schedule"   element={<Schedule />} />
          <Route path="/standings"  element={<Standings />} />
          <Route path="/stats"      element={<Stats />} />
          <Route path="/teams"      element={<Teams />} />
          <Route path="/teams/:teamId" element={<TeamDetail />} />
          <Route path="/playoffs"   element={<Playoffs />} />
          <Route path="/rules"      element={<Rules />} />
          <Route path="/photos"     element={<Photos />} />
          {/* Legacy HTML redirects */}
          <Route path="/index.html"     element={<Navigate to="/" replace />} />
          <Route path="/schedule.html"  element={<Navigate to="/schedule" replace />} />
          <Route path="/standings.html" element={<Navigate to="/standings" replace />} />
          <Route path="/stats.html"     element={<Navigate to="/stats" replace />} />
          <Route path="/teams.html"     element={<Navigate to="/teams" replace />} />
          <Route path="/playoffs.html"  element={<Navigate to="/playoffs" replace />} />
          <Route path="/rules.html"     element={<Navigate to="/rules" replace />} />
          <Route path="/photos.html"    element={<Navigate to="/photos" replace />} />
          <Route path="*"           element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
