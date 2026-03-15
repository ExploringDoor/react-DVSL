import { useState } from 'react'

// Photo data — using placeholder patterns since real photos aren't available
const ALBUMS = [
  {
    id: 'week6',
    title: 'Week 6 Action',
    date: 'June 15, 2025',
    count: 18,
    cover: null,
    tags: ['game', 'week6'],
  },
  {
    id: 'week5',
    title: 'Week 5 Highlights',
    date: 'June 8, 2025',
    count: 24,
    cover: null,
    tags: ['game', 'week5'],
  },
  {
    id: 'opening-day',
    title: 'Opening Day 2025',
    date: 'May 4, 2025',
    count: 31,
    cover: null,
    tags: ['event', 'opening-day'],
  },
  {
    id: 'end-of-season-2024',
    title: 'End of Season Party 2024',
    date: 'August 2024',
    count: 47,
    cover: null,
    tags: ['event', 'party'],
  },
  {
    id: 'playoffs-2024',
    title: '2024 Playoff Championship',
    date: 'August 2024',
    count: 29,
    cover: null,
    tags: ['game', 'playoffs'],
  },
]

// Generate placeholder photo tiles using CSS gradients
const GRAD_PALETTES = [
  ['#a3e63520','#1a1e29'],
  ['#3b82f620','#1a1e29'],
  ['#f59e0b20','#1a1e29'],
  ['#ef444420','#1a1e29'],
  ['#a78bfa20','#1a1e29'],
  ['#34d39920','#1a1e29'],
]

function PhotoPlaceholder({ index, label }) {
  const [c1, c2] = GRAD_PALETTES[index % GRAD_PALETTES.length]
  return (
    <div
      className="aspect-square rounded-lg flex items-center justify-center text-dvsl-muted text-xs font-mono cursor-pointer hover:opacity-80 transition-opacity"
      style={{ background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`, border: '1px solid #252a38' }}
    >
      {label || `Photo ${index+1}`}
    </div>
  )
}

export default function Photos() {
  const [activeAlbum, setActiveAlbum] = useState(null)

  if (activeAlbum) {
    const album = ALBUMS.find(a => a.id === activeAlbum)
    return (
      <div className="min-h-screen bg-dvsl-bg pt-16">
        <div className="border-b border-dvsl-border bg-dvsl-surface">
          <div className="max-w-5xl mx-auto px-4 py-10">
            <button onClick={() => setActiveAlbum(null)} className="text-dvsl-muted text-xs hover:text-dvsl-lime transition-colors mb-4 block">
              ← All Albums
            </button>
            <p className="section-label mb-2">{album.date}</p>
            <h1 className="font-display text-5xl text-dvsl-text">{album.title}</h1>
            <p className="text-dvsl-muted text-sm mt-1">{album.count} photos</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Upload prompt */}
          <div className="card p-6 mb-6 border-dashed text-center">
            <p className="text-dvsl-muted text-sm mb-2">📸 Have photos from this game?</p>
            <p className="text-dvsl-muted text-xs mb-3">Send them to the league coordinator to add to this album.</p>
            <button className="btn-primary text-xs">Submit Photos</button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {Array.from({ length: album.count }).map((_, i) => (
              <PhotoPlaceholder key={i} index={i} label={null} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dvsl-bg pt-16">
      <div className="border-b border-dvsl-border bg-dvsl-surface">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="section-label mb-2">DVSL Softball</p>
          <h1 className="font-display text-5xl text-dvsl-text">Photos</h1>
          <p className="text-dvsl-muted text-sm mt-1">{ALBUMS.reduce((a,b)=>a+b.count,0)} photos across {ALBUMS.length} albums</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Contribute prompt */}
        <div className="card p-4 mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-dvsl-text text-sm font-medium">📸 Have photos to share?</p>
            <p className="text-dvsl-muted text-xs mt-0.5">Submit game photos to the league coordinator for addition to the gallery.</p>
          </div>
          <button className="btn-primary shrink-0 text-xs">Submit Photos</button>
        </div>

        {/* Album grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALBUMS.map((album, ai) => {
            const [c1, c2] = GRAD_PALETTES[ai % GRAD_PALETTES.length]
            return (
              <button
                key={album.id}
                onClick={() => setActiveAlbum(album.id)}
                className="card overflow-hidden text-left hover:border-dvsl-lime/40 transition-all group"
              >
                {/* Cover art */}
                <div
                  className="h-40 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)` }}
                >
                  <div className="grid grid-cols-3 gap-1 p-4 w-full h-full">
                    {Array.from({length: 6}).map((_,i) => (
                      <div key={i} className="rounded" style={{ background: `${c1.replace('20','40')}` }} />
                    ))}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-dvsl-text font-semibold text-sm group-hover:text-dvsl-lime transition-colors">{album.title}</h3>
                  <p className="text-dvsl-muted text-xs mt-1">{album.date} · {album.count} photos</p>
                  <div className="flex gap-1 mt-2">
                    {album.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-dvsl-border text-dvsl-muted font-mono">{tag}</span>
                    ))}
                  </div>
                </div>
              </button>
            )
          })}

          {/* Empty/add more placeholder */}
          <div className="card border-dashed p-8 flex flex-col items-center justify-center text-center gap-2 min-h-[200px]">
            <span className="text-3xl">📷</span>
            <p className="text-dvsl-muted text-sm">More albums coming</p>
            <p className="text-dvsl-muted text-xs">Photos added throughout the season</p>
          </div>
        </div>
      </div>
    </div>
  )
}
