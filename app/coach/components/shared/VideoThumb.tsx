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

// Module-level cache: vimeoId → thumbnail URL
const vimeoThumbCache = new Map<string, string>()

function FamillePlaceholder({ famille, size, fullWidth }: { famille?: FamilleMin | null; size: number; fullWidth: boolean }) {
  const color = famille?.couleur || '#2C2C44'
  const hex = color.replace('#', '')
  const r = parseInt(hex.slice(0, 2), 16) || 44
  const g = parseInt(hex.slice(2, 4), 16) || 44
  const b = parseInt(hex.slice(4, 6), 16) || 68
  return (
    <div style={{
      width: '100%', height: '100%',
      background: `linear-gradient(135deg, rgba(${r},${g},${b},0.45) 0%, rgba(${r},${g},${b},0.18) 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {fullWidth && famille && (
        <span style={{ fontSize: 40, lineHeight: 1, opacity: 0.7 }}>
          {FAMILLE_EMOJI[famille.nom] || '🏅'}
        </span>
      )}
    </div>
  )
}

export function VideoThumb({
  url, size = 72, famille, fullWidth = false,
}: {
  url?: string | null
  size?: number
  famille?: FamilleMin | null
  fullWidth?: boolean
}) {
  const [thumbUrl, setThumbUrl] = useState<string | null>(() => {
    const vid = url ? getVimeoId(url) : null
    return vid ? (vimeoThumbCache.get(vid) || null) : null
  })
  const [hovered, setHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const ytId = url ? getYoutubeId(url) : null
  const vimeoId = url ? getVimeoId(url) : null

  // Lazy-fetch Vimeo thumbnail when element enters viewport
  useEffect(() => {
    if (!vimeoId) return
    const cached = vimeoThumbCache.get(vimeoId)
    if (cached) { setThumbUrl(cached); return }

    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      fetch(`/api/vimeo-thumb?id=${vimeoId}`)
        .then(r => r.json())
        .then((data: { url?: string }) => {
          const u = data.url || ''
          if (u) { vimeoThumbCache.set(vimeoId, u); setThumbUrl(u) }
        })
        .catch(() => {})
    }, { rootMargin: '600px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [vimeoId])

  const containerStyle: React.CSSProperties = {
    width: fullWidth ? '100%' : size,
    height: fullWidth ? undefined : Math.round(size * 0.56),
    aspectRatio: fullWidth ? '16/9' : undefined,
    borderRadius: fullWidth ? 0 : '8px',
    overflow: 'hidden',
    flexShrink: 0,
    position: 'relative',
  }

  // ── No URL → famille emoji placeholder (fullWidth) or gradient (small) ──
  if (!url) {
    return (
      <div style={containerStyle}>
        <FamillePlaceholder famille={famille} size={size} fullWidth={fullWidth} />
      </div>
    )
  }

  // ── YouTube ──
  if (ytId) {
    const thumb = `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
    return (
      <div style={containerStyle}
        onMouseEnter={() => fullWidth && setHovered(true)}
        onMouseLeave={() => fullWidth && setHovered(false)}
      >
        {fullWidth && hovered ? (
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0`}
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            allow="autoplay"
          />
        ) : (
          <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        )}
      </div>
    )
  }

  // ── Vimeo ──
  if (vimeoId) {
    return (
      <div ref={containerRef} style={containerStyle}
        onMouseEnter={() => fullWidth && setHovered(true)}
        onMouseLeave={() => fullWidth && setHovered(false)}
      >
        {fullWidth && hovered ? (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&background=1`}
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            allow="autoplay; fullscreen"
          />
        ) : thumbUrl ? (
          <img src={thumbUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          // Loading: show famille gradient (disappears once thumbnail loads)
          <FamillePlaceholder famille={famille} size={size} fullWidth={fullWidth} />
        )}
      </div>
    )
  }

  // ── Raw video file ──
  return (
    <div style={containerStyle}>
      <video src={url} muted loop playsInline preload="metadata"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
  )
}
