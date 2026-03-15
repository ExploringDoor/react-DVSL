import { useState, useEffect } from 'react'

export default function Countdown({ targetDate, targetTime }) {
  const [diff, setDiff] = useState(null)

  useEffect(() => {
    const target = new Date(`${targetDate}T${targetTime}:00`)
    const update = () => {
      const ms = target - Date.now()
      if (ms <= 0) { setDiff(null); return }
      const d = Math.floor(ms / 86400000)
      const h = Math.floor((ms % 86400000) / 3600000)
      const m = Math.floor((ms % 3600000) / 60000)
      const s = Math.floor((ms % 60000) / 1000)
      setDiff({ d, h, m, s })
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [targetDate, targetTime])

  if (!diff) return null

  const units = [
    { val: diff.d, label: 'days' },
    { val: diff.h, label: 'hrs'  },
    { val: diff.m, label: 'min'  },
    { val: diff.s, label: 'sec'  },
  ]

  return (
    <div className="flex items-center gap-3">
      {units.map(u => (
        <div key={u.label} className="text-center">
          <div className="font-display font-black text-2xl text-dvsl-lime tabular-nums leading-none">
            {String(u.val).padStart(2, '0')}
          </div>
          <div className="text-dvsl-muted text-xs font-mono mt-0.5">{u.label}</div>
        </div>
      ))}
    </div>
  )
}
