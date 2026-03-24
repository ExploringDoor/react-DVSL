import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { WEEKS } from '../data/games'
import { getTeamByShort } from '../data/teams'
import { GamedayModal, BoxScoreModal, RecapModal } from '../components/GameModals'

function cleanField(f) {
  if (!f) return ''
  return f.replace(/\s*(6pm|7pm|7:30pm|8pm|6:30pm|6:00pm)/i, '').trim()
}
function parseTime(f) {
  if (!f) return '7:30 PM'
  const m = f.match(/(\d+:\d+|\d+)\s*(am|pm)/i)
  if (!m) return '7:30 PM'
  const t = m[1], p = m[2].toUpperCase()
  return t.includes(':') ? t + ' ' + p : t + ':00 ' + p
}

function GameRow({ game }) {
  const [modal, setModal] = useState(null)
  const away = getTeamByShort(game.away)
  const home = getTeamByShort(game.home)
  const isFinal = game.status === 'final'
  const field = cleanField(game.field)
  const time = parseTime(game.field)

  return (
    <>
      {modal === 'gameday' && <GamedayModal game={game} onClose={() => setModal(null)} />}
      {modal === 'boxscore' && <BoxScoreModal game={game} onClose={() => setModal(null)} />}
      {modal === 'recap' && <RecapModal game={game} onClose={() => setModal(null)} />}

      <div style={{
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.09)',
        borderTop: '3px solid #0057FF',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 10,
        display: 'flex',
        alignItems: 'stretch',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
        className="game-card-hover"
      >
        {/* Teams */}
        <div style={{ flex: 1, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[{ t: game.away, team: away }, { t: game.home, team: home }].map((side, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 9,
                background: (side.team?.color || '#6b7280') + '18',
                border: '2px solid ' + (side.team?.color || '#6b7280'),
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 10, color: side.team?.color || '#333', textTransform: 'uppercase' }}>
                  {(side.t || '').slice(0, 4)}
                </span>
              </div>
              <div style={{ minWidth: 0 }}>
                <Link to={'/teams/' + (side.team?.id || side.t.toLowerCase())} style={{
                  fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 22,
                  textTransform: 'uppercase', color: side.team?.color || '#111',
                  textDecoration: 'none', lineHeight: 1, display: 'block',
                }}>
                  {side.team?.name || side.t}
                </Link>
                <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)' }}>
                  ({side.team?.w}-{side.team?.l})
                </span>
              </div>
              {isFinal && (
                <div style={{ marginLeft: 'auto', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: i === 0 ? (game.awayR > game.homeR ? 38 : 26) : (game.homeR > game.awayR ? 38 : 26), color: i === 0 ? (game.awayR > game.homeR ? '#111' : '#aaa') : (game.homeR > game.awayR ? '#111' : '#aaa'), lineHeight: 1 }}>
                  {i === 0 ? game.awayR : game.homeR}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right side */}
        {isFinal ? (
          <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(0,0,0,0.07)', flexShrink: 0 }}>
            <button onClick={() => setModal('recap')} style={{ flex: 1, background: '#0057FF', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', padding: '0 20px', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase', color: '#fff', whiteSpace: 'nowrap' }}>
              RECAP
            </button>
            <button onClick={() => setModal('boxscore')} style={{ flex: 1, background: '#0057FF', border: 'none', cursor: 'pointer', padding: '0 20px', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase', color: '#fff', whiteSpace: 'nowrap' }}>
              BOX SCORE
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: '1px solid rgba(0,0,0,0.07)', padding: '14px 20px', flexShrink: 0, gap: 4 }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 28, color: '#0057FF', lineHeight: 1 }}>{time}</div>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', fontWeight: 600 }}>{field}</div>
            <button onClick={() => setModal('gameday')} className="btn-outline btn-gameday-pulse" style={{ fontSize: 11, fontWeight: 700, padding: '6px 12px', marginTop: 4, whiteSpace: 'nowrap' }}>
              GAMEDAY
            </button>
          </div>
        )}
      </div>
    </>
  )
}

function Timeline({ data }) {
  const ref = useRef(null)
  const containerRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.getBoundingClientRect().height)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 10%', 'end 50%'],
  })

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height])
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1])

  return (
    <div ref={containerRef} style={{ width: '100%', fontFamily: "'Barlow',sans-serif" }}>
      <div ref={ref} style={{ position: 'relative', maxWidth: 1000, margin: '0 auto', paddingBottom: 60 }}>
        {data.map((item, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: index === 0 ? 16 : 48, gap: 24 }}>

            {/* LEFT — sticky date */}
            <div style={{ position: 'sticky', top: 80, alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 40, width: 160, flexShrink: 0 }}>
              {/* Dot */}
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: item.hasGames ? '#0057FF' : '#ccc', border: '3px solid #fff', boxShadow: item.hasGames ? '0 0 0 3px rgba(0,87,255,0.2)' : 'none', zIndex: 10, marginBottom: 10 }} />
              {/* Date label */}
              <div style={{ textAlign: 'right', paddingRight: 8 }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 32, color: item.hasGames ? '#0057FF' : '#ccc', lineHeight: 1 }}>
                  {item.day}
                </div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 16, color: item.hasGames ? '#333' : '#bbb', marginTop: 2 }}>
                  {item.month}
                </div>
                {item.wk !== 'A' && item.wk !== 'B' && (
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: '#999', textTransform: 'uppercase', marginTop: 4 }}>
                    Week {item.wk}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — games */}
            <div style={{ flex: 1, minWidth: 0, paddingLeft: 24 }}>
              {item.games.length > 0 ? (
                item.games.map(g => <GameRow key={g.id} game={g} />)
              ) : (
                <div style={{ background: '#fff', border: '1px dashed rgba(0,0,0,0.12)', borderRadius: 10, padding: '16px 20px', color: '#bbb', fontSize: 13, fontStyle: 'italic' }}>
                  No games scheduled
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Animated vertical line */}
        <div style={{
          position: 'absolute', left: 166, top: 0,
          height: height + 'px',
          width: 2,
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.08) 10%, rgba(0,0,0,0.08) 90%, transparent 100%)',
          overflow: 'hidden',
        }}>
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px]"
            style={{
              height: heightTransform,
              opacity: opacityTransform,
              position: 'absolute', left: 0, right: 0, top: 0,
              width: 2,
              background: 'linear-gradient(to bottom, #0057FF, #00c8ff)',
              borderRadius: 2,
              boxShadow: '0 0 8px rgba(0,87,255,0.4)',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default function Schedule2() {
  const timelineData = WEEKS.map(w => {
    const parts = (w.date || '').split(' ')
    return {
      wk: w.wk,
      month: parts[0] || '',
      day: parts[1] || '',
      date: w.date,
      games: w.games || [],
      hasGames: (w.games || []).length > 0,
    }
  })

  return (
    <div style={{ background: '#f2f4f8', minHeight: '100vh' }}>
      {/* Page header */}
      <div style={{ background: '#fff', borderBottom: '3px solid #0057FF', padding: '28px clamp(16px,4vw,48px) 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#0057FF', marginBottom: 4 }}>
            2026 Season
          </div>
          <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 'clamp(32px,6vw,52px)', textTransform: 'uppercase', color: '#111', lineHeight: 1 }}>
            Full Schedule
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px clamp(16px,4vw,32px) 60px' }}>
        <Timeline data={timelineData} />
      </div>
    </div>
  )
}
