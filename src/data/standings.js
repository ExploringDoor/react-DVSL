import { TEAMS } from './teams'

// 2026 current standings — derived from team records
export const STANDINGS = [...TEAMS]
  .map(t => {
    const gp = t.w + t.l
    const pct = gp > 0 ? t.w / gp : 0
    const diff = t.rs - t.ra
    return {
      team: t.short,
      name: t.name,
      id:   t.id,
      color: t.color,
      w: t.w, l: t.l, gp,
      pct,
      rs: t.rs, ra: t.ra,
      diff: diff >= 0 ? `+${diff}` : `${diff}`,
      pts: t.w * 2 + t.l,
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
