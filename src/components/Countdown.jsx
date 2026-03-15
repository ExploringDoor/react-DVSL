import { useState, useEffect } from 'react'

export default function Countdown({ targetDate, targetTime }) {
  const [parts, setParts] = useState({ d: 0, h: 0, m: 0, s: 0, past: false })

  useEffect(() => {
    function calc() {
      const target = new Date(`${targetDate}T${to24(targetTime)}`)
      const diff = target - Date.now()
      if (diff <= 0) { setParts(p => ({ ...p, past: true })); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setParts({ d, h, m, s, past: false })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [targetDate, targetTime])

  function to24(t) {
    const [time, period] = t.split(' ')
    let [h, m] = time.split(':').map(Number)
    if (period === 'PM' && h < 12) h += 12
    if (period === 'AM' && h === 12) h = 0
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00`
  }

  if (parts.past) return <span className="text-dvsl-muted text-sm">Game underway</span>

  return (
    <div className="flex items-center gap-3">
      {[['d', parts.d], ['h', parts.h], ['m', parts.m], ['s', parts.s]].map(([label, val]) => (
        <div key={label} className="text-center">
          <div className="font-mono text-2xl font-bold text-dvsl-lime leading-none">
            {String(val).padStart(2, '0')}
          </div>
          <div className="text-dvsl-muted text-xs font-mono uppercase mt-0.5">{label}</div>
        </div>
      ))}
    </div>
  )
}
