import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar  from './components/Navbar'
import Footer  from './components/Footer'
import Home       from './pages/Home'
import Scores     from './pages/Scores'
import Schedule   from './pages/Schedule'
import Standings  from './pages/Standings'
import Stats      from './pages/Stats'
import Teams      from './pages/Teams'
import TeamDetail from './pages/TeamDetail'
import Rules      from './pages/Rules'
import Playoffs   from './pages/Playoffs'

function NotFound() {
  return (
    <div className="min-h-screen bg-dvsl-bg pt-32 flex flex-col items-center justify-center text-center px-4">
      <p className="font-display font-black text-8xl text-dvsl-border mb-4">404</p>
      <h1 className="font-display font-bold text-2xl text-dvsl-text mb-2">Page Not Found</h1>
      <p className="text-dvsl-muted text-sm mb-6">That pitch was way outside.</p>
      <a href="/" className="btn-primary">Back to Home</a>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      {/* pt-21 accounts for fixed navbar (h-14) + ticker (h-7) */}
      <main>
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/scores"      element={<Scores />} />
          <Route path="/schedule"    element={<Schedule />} />
          <Route path="/standings"   element={<Standings />} />
          <Route path="/stats"       element={<Stats />} />
          <Route path="/teams"       element={<Teams />} />
          <Route path="/teams/:teamId" element={<TeamDetail />} />
          <Route path="/rules"       element={<Rules />} />
          <Route path="/playoffs"    element={<Playoffs />} />
          {/* Legacy HTML redirects */}
          <Route path="/schedule.html"         element={<Navigate to="/schedule" replace />} />
          <Route path="/stats.html"            element={<Navigate to="/stats" replace />} />
          <Route path="/standings-history.html" element={<Navigate to="/standings" replace />} />
          <Route path="/playoffs.html"         element={<Navigate to="/playoffs" replace />} />
          <Route path="/rules.html"            element={<Navigate to="/rules" replace />} />
          <Route path="*"            element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
