'use client'

import { useEffect, useRef, useState } from 'react'
import { getYoutubeId, getVimeoId } from '../../lib/utils'

type FamilleMin = { id?: string; nom: string; couleur: string }

const FAMILLE_EMOJI: Record<string, string> = {
  'Vitesse': '⚡', 'Accélération': '🏃', 'Décélération': '🛑',
  'Force': '💪', 'Puissance': '🔥', 'Pliométrie': '🦘',
  'Coordination': '🎯', 'Appuis': '👟', 'COD': '↩️',
  'Mobilité': '🔄', 'Stretch': '🧘', 'Prévention': '🛡️',
  'Cardio': '❤️', 'Proprioception': '⚖️',
  'Technique de base': '🎓', 'Technique athlétique': '🏆',
}

// Module-level cache: vimeoId → thumbnail URL (or 'error')
const vimeoThumbCache = new Map<string, string>()

export function VideoThumb({
  url, size = 72, famille, fullWidth = false,
}: {
  url?: string | null
  size?: number
  famille?: FamilleMin | null
  fullWidth?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const [thumbUrl, setThumbUrl] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const ytId = url ? getYoutubeId(url) : null
  const vimeoId = url ? getVimeoId(url) : null

  // Lazy-fetch Vimeo thumbnail on visibility
  useEffect(() => {
    if (!vimeoId) return
    const cached = vimeoThumbCache.get(vimeoId)
    if (cached) { setThumbUrl(cached); return }

    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      fetch(`https://vimeo.com/api/v2/video/${vimeoId}.json`)
        .then(r => r.json())
        .then((data: Array<{ thumbnail_large?: string; thumbnail_medium?: string }>) => {
          const u = data[0]?.thumbnail_large || data[0]?.thumbnail_medium || ''
          if (u) { vimeoThumbCache.set(vimeoId, u); setThumbUrl(u) }
        })
        .catch(() => {})
    }, { rootMargin: '400px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [vimeoId])

  const PlayBtn = ({ small = false }: { small?: boolean }) => (
    <div style={{
      width: small ? 22 : 28, height: small ? 22 : 28, borderRadius: '50%',
      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
    }}>
      <div style={{
        width: 0, height: 0, borderStyle: 'solid',
        borderWidth: small ? '4px 0 4px 7px' : '5px 0 5px 9px',
        borderColor: 'transparent transparent transparent #111',
        marginLeft: '2px',
      }} />
    </div>
  )

  const w = fullWidth ? '100%' : size
  const h = fullWidth ? undefined : size * 0.56
  const ratio = fullWidth ? '16/9' : undefined
  const baseStyle: React.CSSProperties = {
    width: w, height: h, aspectRatio: ratio,
    borderRadius: fullWidth ? 0 : '8px',
    overflow: 'hidden', flexShrink: 0, position: 'relative',
  }

  if (!url) {
    const color = famille?.couleur || '#6B7280'
    const emoji = famille ? (FAMILLE_EMOJI[famille.nom] || '🏅') : '▷'
    const hex = color.replace('#', '')
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    const containerH = fullWidth ? undefined : size
    const containerW = fullWidth ? '100%' : size
    return (
      <div style={{
        width: containerW, height: containerH, aspectRatio: ratio,
        borderRadius: fullWidth ? 0 : '10px',
        background: `linear-gradient(135deg, rgba(${r},${g},${b},0.35) 0%, rgba(${r},${g},${b},0.15) 100%)`,
        border: fullWidth ? 'none' : `1.5px solid rgba(${r},${g},${b},0.5)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: fullWidth ? 36 : size * 0.42, lineHeight: 1 }}>{emoji}</span>
      </div>
    )
  }

  if (ytId) {
    const thumb = `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
    return (
      <div style={baseStyle} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        {!hovered ? (
          <>
            <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'pointer' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.25)' }}>
              <PlayBtn small={!fullWidth && size < 60} />
            </div>
          </>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&modestbranding=1`}
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            allow="autoplay"
          />
        )}
      </div>
    )
  }

  if (vimeoId) {
    return (
      <div ref={containerRef} style={baseStyle} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        {!hovered ? (
          thumbUrl ? (
            <>
              <img src={thumbUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'pointer' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                <PlayBtn small={!fullWidth && size < 60} />
              </div>
            </>
          ) : !fullWidth ? (
            // Small size while loading: show famille-colored placeholder
            (() => {
              const color = famille?.couleur || '#1AB7EA'
              const emoji = famille ? (FAMILLE_EMOJI[famille.nom] || '🏅') : '▶'
              const hex = color.replace('#', '')
              const r = parseInt(hex.slice(0, 2), 16)
              const g = parseInt(hex.slice(2, 4), 16)
              const b = parseInt(hex.slice(4, 6), 16)
              return (
                <div style={{
                  width: '100%', height: '100%',
                  background: `linear-gradient(135deg, rgba(${r},${g},${b},0.35) 0%, rgba(${r},${g},${b},0.15) 100%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: size * 0.38, lineHeight: 1 }}>{emoji}</span>
                </div>
              )
            })()
          ) : (
            // Full-width while loading: subtle gradient
            <div style={{
              width: '100%', height: '100%', cursor: 'pointer',
              background: 'linear-gradient(135deg, #1AB7EA18, #1AB7EA08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <PlayBtn small={false} />
            </div>
          )
        ) : (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&background=1`}
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            allow="autoplay; fullscreen"
          />
        )}
      </div>
    )
  }

  return (
    <div style={baseStyle}>
      <video
        src={url} muted loop playsInline preload="metadata"
        onMouseEnter={e => (e.currentTarget as HTMLVideoElement).play().catch(() => {})}
        onMouseLeave={e => { const v = e.currentTarget as HTMLVideoElement; v.pause(); v.currentTime = 0 }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'pointer' }}
      />
    </div>
  )
}
