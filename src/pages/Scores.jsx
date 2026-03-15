import { useState } from 'react'
import { GAMES } from '../data/games'
import GameCard from '../components/GameCard'
import { Link } from 'react-router-dom'

const WEEKS_WITH_SCORES = [...new Map(
  GAMES.filter(g => g.status === 'final').map(g => [g.wk, g])
).entries()]
  .map(([wk, g]) => ({ wk, date: g.date }))
  .filter(w => typeof w.wk === 'number')
  .sort((a, b) => b.wk - a.wk)

const DAY_FULL = { mon:'Monday', tue:'Tuesday', wed:'Wednesday', thu:'Thursday', fri:'Friday', sat:'Saturday', sun:'Sunday' }

export default function Scores() {
  const [activeWk, setActiveWk] = useState(WEEKS_WITH_SCORES[0]?.wk)

  const games = GAMES.filter(g => g.wk === activeWk && g.status === 'final')
  const byDay = games.reduce((acc, g) => {
    if (!acc[g.day]) acc[g.day] = []
    acc[g.day].push(g)
    return acc
  }, {})

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 114 }}>
      {/* Page header */}
      <div style={{ padding: '32px 48px 0', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>
          Season Schedule · Hover a game for details
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 64, textTransform: 'uppercase', color: 'var(--white)', lineHeight: 1, letterSpacing: '.01em' }}>
            Scores
          </h1>
          <Link to="/schedule" style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
            Full Schedule →
          </Link>
        </div>
      </div>

      {/* Week date nav */}
      <div style={{
        display: 'flex', alignItems: 'stretch',
        background: 'var(--bg)', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 114, zIndex: 50,
        overflowX: 'auto', scrollbarWidth: 'none',
      }}>
        {WEEKS_WITH_SCORES.map(({ wk, date }) => {
          const active = wk === activeWk
          const [mon, day] = (date || '').split(' ')
          const mo = { April:'Apr', May:'May', June:'Jun', July:'Jul', August:'Aug' }[mon] || mon
          return (
            <button key={wk} onClick={() => setActiveWk(wk)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '12px 22px',
              borderBottom: active ? '2px solid var(--gold)' : '2px solid transparent',
              flexShrink: 0, textAlign: 'center',
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: active ? 'var(--gold)' : 'var(--muted2)' }}>WK {wk}</div>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 20, color: active ? 'var(--gold)' : 'var(--white)', lineHeight: 1, marginTop: 3 }}>{mo} {day}</div>
            </button>
          )
        })}
      </div>

      {/* Games list */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 48px 60px' }}>
        {games.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--muted)' }}>No scores for this week.</div>
        ) : (
          Object.entries(byDay).map(([day, dayGames]) => (
            <div key={day} style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted2)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 8, marginBottom: 12 }}>
                {DAY_FULL[day] || day}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {dayGames.map(g => <GameCard key={g.id} game={g} />)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
