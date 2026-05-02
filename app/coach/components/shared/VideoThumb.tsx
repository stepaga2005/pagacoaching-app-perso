'use client'

import { useEffect, useState } from 'react'
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

// Module-level: thumbnail cache + in-flight dedup
const thumbCache = new Map<string, string>()
const inFlight = new Map<string, Promise<string>>()

async function fetchThumb(vimeoId: string): Promise<string> {
  const cached = thumbCache.get(vimeoId)
  if (cached) return cached
  if (inFlight.has(vimeoId)) return inFlight.get(vimeoId)!
  const p = fetch(`/api/vimeo-thumb?id=${vimeoId}`)
    .then(r => r.json())
    .then((d: { url?: string }) => {
      const url = d.url || ''
      if (url) thumbCache.set(vimeoId, url)
      inFlight.delete(vimeoId)
      return url
    })
    .catch(() => { inFlight.delete(vimeoId); return '' })
  inFlight.set(vimeoId, p)
  return p
}

function GradientBox({ famille, fullWidth, size, withEmoji }: {
  famille?: FamilleMin | null; fullWidth: boolean; size: number; withEmoji: boolean
}) {
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
      {withEmoji && fullWidth && famille && (
        <span style={{ fontSize: 40, lineHeight: 1, opacity: 0.75 }}>
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
  const ytId = url ? getYoutubeId(url) : null
  const vimeoId = url ? getVimeoId(url) : null

  const [thumbUrl, setThumbUrl] = useState<string | null>(() =>
    vimeoId ? (thumbCache.get(vimeoId) || null) : null
  )
  const [hovered, setHovered] = useState(false)

  // Fetch Vimeo thumbnail immediately on mount (deduped)
  useEffect(() => {
    if (!vimeoId || thumbUrl) return
    fetchThumb(vimeoId).then(u => { if (u) setThumbUrl(u) })
  }, [vimeoId]) // eslint-disable-line react-hooks/exhaustive-deps

  const containerStyle: React.CSSProperties = {
    width: fullWidth ? '100%' : size,
    height: fullWidth ? undefined : Math.round(size * 0.56),
    aspectRatio: fullWidth ? '16/9' : undefined,
    borderRadius: fullWidth ? 0 : '8px',
    overflow: 'hidden',
    flexShrink: 0,
    position: 'relative',
  }

  // ── No URL → emoji placeholder ──────────────────────────────────
  if (!url) {
    return (
      <div style={containerStyle}>
        <GradientBox famille={famille} fullWidth={fullWidth} size={size} withEmoji={true} />
      </div>
    )
  }

  // ── YouTube ──────────────────────────────────────────────────────
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

  // ── Vimeo ─────────────────────────────────────────────────────────
  if (vimeoId) {
    return (
      <div style={containerStyle}
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
          // Still loading: gradient without emoji (video exists but thumb not yet ready)
          <GradientBox famille={famille} fullWidth={fullWidth} size={size} withEmoji={false} />
        )}
      </div>
    )
  }

  // ── Raw video file ────────────────────────────────────────────────
  return (
    <div style={containerStyle}>
      <video src={url} muted loop playsInline preload="metadata"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
  )
}
