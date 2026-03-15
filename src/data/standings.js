import { TEAMS } from './teams'

// 2025 final standings with realistic run totals
const SEASON_DATA = [
  { short:'GOLD', rs:226, ra:71,  streak:'L1' },
  { short:'BA1',  rs:167, ra:73,  streak:'W4' },
  { short:'TBIR', rs:124, ra:64,  streak:'L2' },
  { short:'SA',   rs:163, ra:63,  streak:'L1' },
  { short:'TI',   rs:148, ra:105, streak:'W2' },
  { short:'KI',   rs:116, ra:80,  streak:'W4' },
  { short:'GJC',  rs:138, ra:112, streak:'L3' },
  { short:'BOB',  rs:132, ra:88,  streak:'W2' },
  { short:'BSMC', rs:125, ra:139, streak:'L1' },
  { short:'BOO',  rs:118, ra:118, streak:'L2' },
  { short:'CHABAD',rs:136,ra:99,  streak:'L1' },
  { short:'BOR',  rs:105, ra:132, streak:'L1' },
  { short:'TBI1', rs:112, ra:121, streak:'L2' },
  { short:'BAMI', rs:95,  ra:152, streak:'L3' },
  { short:'KA',   rs:108, ra:129, streak:'L1' },
  { short:'BSB',  rs:99,  ra:140, streak:'L2' },
  { short:'OS',   rs:88,  ra:165, streak:'L5' },
  { short:'TSMC', rs:94,  ra:192, streak:'L2' },
]

export const STANDINGS = [...TEAMS]
  .map(t => {
    const sd = SEASON_DATA.find(s => s.short === t.short) || { rs: 100, ra: 100, streak: '—' }
    const gp  = t.w + t.l
    const pct = gp > 0 ? t.w / gp : 0
    const diff = sd.rs - sd.ra
    return {
      team:   t.short,
      name:   t.name,
      id:     t.id,
      color:  t.color,
      w: t.w, l: t.l, gp,
      pct,
      rs: sd.rs, ra: sd.ra,
      diff: diff >= 0 ? `+${diff}` : `${diff}`,
      pts:  t.w * 2 + t.l,
      streak: sd.streak,
    }
  })
  .sort((a, b) => b.pct - a.pct || b.w - a.w)
  .map((row, i, arr) => {
    const leader = arr[0]
    const gb = i === 0 ? '—' : ((leader.w - row.w) + (row.l - leader.l)) / 2
    return { ...row, gb }
  })

export const LEAGUE_HISTORY = [
  { year: 2025, champion: "Goldstein's",    runnerUp: 'Beth Am' },
  { year: 2024, champion: 'Shir Ami',       runnerUp: 'Keneseth Israel' },
  { year: 2023, champion: 'Shir Ami',       runnerUp: 'Beth Am' },
  { year: 2021, champion: 'Beth Or Orange', runnerUp: 'Shir Ami' },
  { year: 2020, champion: null,             runnerUp: null, note: 'Season cancelled (COVID-19)' },
]
