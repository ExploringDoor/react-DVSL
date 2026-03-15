// Pitcher season stats per team — used in game cards
export const PITCHER_STATS = {
  GOLD: { name: 'Josh Weinberg',   wl: '7-3', era: '2.84' },
  SA:   { name: 'Carlos Rivera',   wl: '8-2', era: '2.11' },
  KI:   { name: 'Kevin Park',      wl: '6-4', era: '3.22' },
  BOB:  { name: 'Bobby Marchetti', wl: '5-5', era: '3.98' },
  TBIR: { name: 'Tom Birnbaum',    wl: '7-3', era: '2.65' },
  AJ:   { name: 'Al Jacobs',       wl: '4-6', era: '4.12' },
  TSMC: { name: 'Rob Zwick',       wl: '3-7', era: '4.55' },
  BSMC: { name: 'Andy Katz',       wl: '2-8', era: '5.10' },
  BA1:  { name: 'Lou DiMaggio',    wl: '6-4', era: '3.10' },
  BOR:  { name: 'Phil Stern',      wl: '5-5', era: '3.75' },
  TBI1: { name: 'Marco Vitale',    wl: '6-4', era: '3.20' },
  BSB:  { name: 'Sal Bianchi',     wl: '4-6', era: '4.30' },
  GJC:  { name: 'Tony Greco',      wl: '7-3', era: '2.90' },
  BAMI: { name: 'Frank Palermo',   wl: '3-7', era: '4.80' },
  BOO:  { name: 'Chris Rosario',   wl: '5-5', era: '3.60' },
  OS:   { name: 'Marty Drexler',   wl: '2-8', era: '5.50' },
  TI:   { name: 'Jake Robbins',    wl: '7-3', era: '2.70' },
  KA:   { name: 'Barry Kahn',      wl: '4-6', era: '4.20' },
  BTBJ: { name: 'Andy Katz',       wl: '3-7', era: '4.90' },
}

export function getPitcher(short) {
  return PITCHER_STATS[short] || { name: `${short} Player`, wl: '—·—', era: '—' }
}

// Fake but realistic H and E per game based on score
export function fakeHE(score, seed) {
  const h = Math.round(score * 1.4 + (seed % 4))
  const e = seed % 3 === 0 ? 1 : 0
  return { h, e }
}
