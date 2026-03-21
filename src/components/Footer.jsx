import { Link } from 'react-router-dom'

const LINKS = [
  ['/','Home'],['/scores','Scores'],['/schedule','Schedule'],
  ['/standings','Standings'],['/stats','Stats'],['/teams','Teams'],
  ['/playoffs','Brackets'],['/rules','Field Guide'],['/photos','Gallery'],
]

export default function Footer() {
  return (
    <footer style={{borderTop:'1px solid rgba(0,0,0,0.07)',background:'var(--dark)',marginTop:64}}>
      <div style={{maxWidth:1100,margin:'0 auto',padding:'40px 40px 24px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:24,marginBottom:32}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--gold)'}}>
            ⬡ DVSL
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:'4px 2px'}}>
            {LINKS.map(([to,label]) => (
              <Link key={to} to={to} style={{fontSize:12,fontWeight:600,letterSpacing:'.05em',textTransform:'uppercase',color:'var(--muted)',textDecoration:'none',padding:'4px 10px',transition:'color .15s'}}
                onMouseEnter={e=>e.target.style.color='var(--white)'}
                onMouseLeave={e=>e.target.style.color='var(--muted)'}
              >{label}</Link>
            ))}
          </div>
        </div>
        <div style={{borderTop:'1px solid rgba(0,0,0,0.05)',paddingTop:20,color:'var(--muted2)',fontSize:12}}>
          © 2026 DVSL · Delaware Valley Synagogue League
        </div>
      </div>
    </footer>
  )
}
