import { Link } from 'react-router-dom'
import { getTeamByShort } from '../data/teams'
import TeamBadge from './TeamBadge'

function cleanField(f) {
  return f?.replace(/\s*(6pm|7pm|7:30pm|8pm|6:30pm)/i, '') || f
}
function parseTime(f) {
  const m = f?.match(/([\d:]+\s*(am|pm))/i)
  return m ? m[0].toUpperCase() : '7:30 PM'
}

export default function GameCard({ game, isNext = false }) {
  const away = getTeamByShort(game.away)
  const home = getTeamByShort(game.home)
  const ac = away?.color || '#6b7280'
  const hc = home?.color || '#6b7280'
  const done = game.status === 'final'
  const aWin = done && game.awayScore > game.homeScore
  const hWin = done && game.homeScore > game.awayScore
  const field = cleanField(game.field)
  const time  = parseTime(game.field)

  return (
    <div style={{
      background: 'var(--card)',
      borderBottom: '1px solid var(--border)',
      padding: '14px 20px',
    }}>
      {/* Status label */}
      {isNext && (
        <div style={{fontSize:11,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--gold)',paddingBottom:6,paddingLeft:44}}>
          NEXT
        </div>
      )}
      {done && (
        <div style={{fontSize:11,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--muted2)',paddingBottom:6,paddingLeft:44}}>
          FINAL
        </div>
      )}

      <div style={{display:'flex',alignItems:'stretch',gap:0}}>
        {/* Teams + scores */}
        <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}>
          {[
            { t:game.away, team:away, color:ac, score:game.awayScore, won:aWin },
            { t:game.home, team:home, color:hc, score:game.homeScore, won:hWin },
          ].map(side => (
            <div key={side.t} style={{display:'flex',alignItems:'center',gap:10}}>
              <TeamBadge short={side.t} size={34} />
              <Link
                to={`/teams/${side.team?.id || side.t}`}
                style={{
                  fontFamily:"'Barlow Condensed',sans-serif",
                  fontWeight: side.won ? 800 : 400,
                  fontSize: 22,
                  letterSpacing: '.02em',
                  textTransform: 'uppercase',
                  color: side.won ? 'var(--white)' : 'var(--muted)',
                  textDecoration: 'none',
                  flex: 1,
                  lineHeight: 1,
                }}
              >
                {side.t}
                {!done && side.team && (
                  <span style={{fontSize:12,fontWeight:400,color:'var(--muted2)',marginLeft:6}}>
                    ({side.team.w}-{side.team.l})
                  </span>
                )}
              </Link>
              {done && (
                <span style={{
                  fontFamily:"'Barlow Condensed',sans-serif",
                  fontWeight: side.won ? 800 : 400,
                  fontSize: 30,
                  color: side.won ? 'var(--white)' : 'var(--muted)',
                  minWidth: 32,
                  textAlign: 'right',
                  lineHeight: 1,
                }}>
                  {side.score}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{width:1,background:'var(--border)',margin:'0 20px'}} />

        {/* Field + time */}
        <div style={{display:'flex',flexDirection:'column',justifyContent:'center',minWidth:120}}>
          <div style={{fontWeight:700,fontSize:16,color:'var(--white)',marginBottom:4}}>{field}</div>
          {!done && (
            <div style={{fontSize:14,fontWeight:700,color:'var(--gold)',marginTop:4}}>{time}</div>
          )}
        </div>

        {/* Gameday button for upcoming */}
        {!done && (
          <>
            <div style={{width:1,background:'var(--border)',margin:'0 20px'}} />
            <div style={{display:'flex',alignItems:'center'}}>
              <button className="btn-outline" style={{fontSize:14,whiteSpace:'nowrap'}}>GAMEDAY</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
