import { useState } from 'react'
import { GAMES } from '../data/games'
import GameCard from '../components/GameCard'

const ALL_WEEKS = [...new Map(
  GAMES.filter(g => typeof g.wk === 'number').map(g => [g.wk, g])
).entries()]
  .map(([wk, g]) => ({ wk, date: g.date }))
  .sort((a, b) => a.wk - b.wk)

const UPCOMING_WK = ALL_WEEKS.find(w => GAMES.some(g => g.wk === w.wk && g.status === 'upcoming'))?.wk
  || ALL_WEEKS[0]?.wk

const DAY_FULL = { mon:'Monday', tue:'Tuesday', wed:'Wednesday', thu:'Thursday', fri:'Friday', sat:'Saturday' }

function fmtWkDate(date) {
  // "April 17" → "April 17"
  return date || ''
}

export default function Schedule() {
  const [activeWk, setActiveWk] = useState(UPCOMING_WK)

  const games = GAMES.filter(g => g.wk === activeWk)
  const weekInfo = ALL_WEEKS.find(w => w.wk === activeWk)

  const byDay = games.reduce((acc, g) => {
    if (!acc[g.day]) acc[g.day] = []
    acc[g.day].push(g)
    return acc
  }, {})
  const dayOrder = ['mon','tue','wed','thu','fri','sat','sun']
  const sortedDays = Object.keys(byDay).sort((a,b) => dayOrder.indexOf(a) - dayOrder.indexOf(b))

  // Find the very first upcoming game across all weeks for NEXT label
  const firstUpcoming = GAMES.find(g => g.status === 'upcoming')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 114 }}>
      {/* Week date nav */}
      <div style={{
        display: 'flex', alignItems: 'stretch',
        background: 'var(--bg)', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 114, zIndex: 50,
        overflowX: 'auto', scrollbarWidth: 'none',
      }}>
        {ALL_WEEKS.map(({ wk, date }) => {
          const active = wk === activeWk
          const [mon, day] = (date || '').split(' ')
          const mo = { April:'Apr', May:'May', June:'Jun', July:'Jul', August:'Aug' }[mon] || mon
          return (
            <button key={wk} onClick={() => setActiveWk(wk)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '12px 20px',
              borderBottom: active ? '2px solid var(--gold)' : '2px solid transparent',
              flexShrink: 0, textAlign: 'center',
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: active ? 'var(--gold)' : 'var(--muted2)' }}>WK {wk}</div>
              <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 600, fontSize: 20, color: active ? 'var(--gold)' : 'var(--white)', lineHeight: 1, marginTop: 3 }}>{mo} {day}</div>
            </button>
          )
        })}
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 48px 60px' }}>
        {/* Week header */}
        <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 28, color: 'var(--white)', marginBottom: 24 }}>
          Week {activeWk} · {fmtWkDate(weekInfo?.date)}
        </h2>

        {games.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--muted)' }}>No games this week.</div>
        ) : (
          sortedDays.map(day => (
            <div key={day} style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted2)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 8, marginBottom: 12 }}>
                {DAY_FULL[day] || day}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {byDay[day].map(g => {
                  const isNext = firstUpcoming?.id === g.id
                  return <GameCard key={g.id} game={g} isNext={isNext} />
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
