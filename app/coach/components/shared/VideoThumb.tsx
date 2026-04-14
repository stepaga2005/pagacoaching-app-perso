'use client'

import { useState } from 'react'
import { Famille } from '../../lib/types'
import { getYoutubeId, getVimeoId } from '../../lib/utils'

const FAMILLE_EMOJI: Record<string, string> = {
  'Vitesse': '⚡', 'Accélération': '🏃', 'Décélération': '🛑',
  'Force': '💪', 'Puissance': '🔥', 'Pliométrie': '🦘',
  'Coordination': '🎯', 'Appuis': '👟', 'COD': '↩️',
  'Mobilité': '🔄', 'Stretch': '🧘', 'Prévention': '🛡️',
  'Cardio': '❤️', 'Proprioception': '⚖️',
  'Technique de base': '🎓', 'Technique athlétique': '🏆',
}

export function VideoThumb({ url, size = 72, famille }: { url?: string | null; size?: number; famille?: Famille }) {
  const [hovered, setHovered] = useState(false)
  const ytId = url ? getYoutubeId(url) : null
  const vimeoId = url ? getVimeoId(url) : null

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
        borderColor: `transparent transparent transparent #111`,
        marginLeft: small ? '2px' : '2px',
      }} />
    </div>
  )

  if (!url) {
    const color = famille?.couleur || '#6B7280'
    const emoji = famille ? (FAMILLE_EMOJI[famille.nom] || '🏅') : '▷'
    const hex = color.replace('#', '')
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return (
      <div style={{
        width: size, height: size, borderRadius: '10px',
        background: `linear-gradient(135deg, rgba(${r},${g},${b},0.35) 0%, rgba(${r},${g},${b},0.15) 100%)`,
        border: `1.5px solid rgba(${r},${g},${b},0.5)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: size * 0.42, lineHeight: 1 }}>{emoji}</span>
      </div>
    )
  }

  if (ytId) {
    const thumb = `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
    return (
      <div style={{ position: 'relative', width: size, height: size * 0.56, flexShrink: 0 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {!hovered && (
          <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer' }}>
            <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
              <PlayBtn />
            </div>
          </div>
        )}
        {hovered && (
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&modestbranding=1`}
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px', display: 'block' }}
            allow="autoplay"
          />
        )}
      </div>
    )
  }

  if (vimeoId) {
    return (
      <div style={{ position: 'relative', width: size, height: size * 0.56, flexShrink: 0, borderRadius: '8px', overflow: 'hidden' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {!hovered ? (
          <div style={{
            width: '100%', height: '100%', cursor: 'pointer',
            background: 'linear-gradient(135deg, #1AB7EA22, #1AB7EA0A)',
            border: '1.5px solid #1AB7EA40',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px',
          }}>
            <PlayBtn small={size < 60} />
            <span style={{ fontSize: '8px', fontWeight: '800', color: '#1AB7EA', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Vimeo</span>
          </div>
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
    <div style={{ width: size, height: size * 0.56, borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#18182A' }}>
      <video
        src={url}
        muted
        loop
        playsInline
        preload="metadata"
        onMouseEnter={e => (e.currentTarget as HTMLVideoElement).play().catch(() => {})}
        onMouseLeave={e => { const v = e.currentTarget as HTMLVideoElement; v.pause(); v.currentTime = 0 }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'pointer' }}
      />
    </div>
  )
}
