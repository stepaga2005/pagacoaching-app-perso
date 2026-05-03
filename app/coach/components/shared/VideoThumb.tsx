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

// Module-level caches
const thumbCache = new Map<string, string>()
const inFlight = new Map<string, Promise<string>>()
const rawThumbCache = new Map<string, string>()
let capturingCount = 0
const captureQueue: Array<() => void> = []
const MAX_QUEUE = 20

function drainQueue() {
  while (capturingCount < 2 && captureQueue.length > 0) captureQueue.shift()!()
}

function captureFirstFrame(url: string): Promise<string> {
  if (rawThumbCache.has(url)) return Promise.resolve(rawThumbCache.get(url)!)
  return new Promise(resolve => {
    const run = () => {
      capturingCount++
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.crossOrigin = 'anonymous'
      video.muted = true
      video.playsInline = true
      const done = (result: string) => {
        video.src = ''; video.load()
        capturingCount--; drainQueue(); resolve(result)
      }
      video.addEventListener('loadedmetadata', () => { video.currentTime = 0.5 })
      video.addEventListener('seeked', () => {
        try {
          const canvas = document.createElement('canvas')
          const scale = Math.min(1, 320 / video.videoWidth)
          canvas.width = Math.round(video.videoWidth * scale)
          canvas.height = Math.round(video.videoHeight * scale)
          canvas.getContext('2d')!.drawImage(video, 0, 0, canvas.width, canvas.height)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.75)
          rawThumbCache.set(url, dataUrl)
          done(dataUrl)
        } catch { done('') }
      })
      video.addEventListener('error', () => done(''))
      video.src = url
    }
    if (capturingCount < 2) run()
    else if (captureQueue.length < MAX_QUEUE) captureQueue.push(run)
    else resolve('')
  })
}

async function fetchVimeoThumb(vimeoId: string): Promise<string> {
  if (thumbCache.has(vimeoId)) return thumbCache.get(vimeoId)!
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

function PlayBtn() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: 'rgba(0,0,0,0.52)', border: '2px solid rgba(255,255,255,0.65)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}>
        <span style={{ color: '#FFF', fontSize: 15, marginLeft: 3, lineHeight: 1 }}>▶</span>
      </div>
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
  const [isMobile, setIsMobile] = useState(false)
  const [thumbUrl, setThumbUrl] = useState<string | null>(() =>
    vimeoId ? (thumbCache.get(vimeoId) || null) : null
  )
  const [playing, setPlaying] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!vimeoId || thumbUrl) return
    fetchVimeoThumb(vimeoId).then(u => { if (u) setThumbUrl(u) })
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

  if (!url) {
    return (
      <div style={containerStyle}>
        <GradientBox famille={famille} fullWidth={fullWidth} size={size} withEmoji={true} />
      </div>
    )
  }

  // ── YouTube ──────────────────────────────────────────────────────────────
  if (ytId) {
    const thumb = `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
    const showPlayer = fullWidth && (isMobile ? playing : hovered)
    return (
      <div style={{ ...containerStyle, cursor: fullWidth && isMobile ? 'pointer' : 'default' }}
        onMouseEnter={() => !isMobile && fullWidth && setHovered(true)}
        onMouseLeave={() => !isMobile && fullWidth && setHovered(false)}
        onClick={fullWidth && isMobile ? e => { e.stopPropagation(); setPlaying(true) } : undefined}
      >
        {showPlayer ? (
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0`}
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            allow="autoplay"
          />
        ) : (
          <>
            <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            {fullWidth && isMobile && <PlayBtn />}
          </>
        )}
      </div>
    )
  }

  // ── Vimeo ─────────────────────────────────────────────────────────────────
  if (vimeoId) {
    const showPlayer = fullWidth && (isMobile ? playing : hovered)
    return (
      <div style={{ ...containerStyle, cursor: fullWidth && isMobile ? 'pointer' : 'default' }}
        onMouseEnter={() => !isMobile && fullWidth && setHovered(true)}
        onMouseLeave={() => !isMobile && fullWidth && setHovered(false)}
        onClick={fullWidth && isMobile ? e => { e.stopPropagation(); setPlaying(true) } : undefined}
      >
        {showPlayer ? (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&background=1`}
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            allow="autoplay; fullscreen"
          />
        ) : thumbUrl ? (
          <>
            <img src={thumbUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            {fullWidth && isMobile && <PlayBtn />}
          </>
        ) : (
          <>
            <GradientBox famille={famille} fullWidth={fullWidth} size={size} withEmoji={false} />
            {fullWidth && isMobile && <PlayBtn />}
          </>
        )}
      </div>
    )
  }

  // ── Raw mp4 (Supabase Storage) ────────────────────────────────────────────
  return <RawVideoThumb url={url} famille={famille} fullWidth={fullWidth} size={size}
    containerStyle={containerStyle} isMobile={isMobile} />
}

function RawVideoThumb({ url, famille, fullWidth, size, containerStyle, isMobile }: {
  url: string; famille?: FamilleMin | null; fullWidth: boolean; size: number
  containerStyle: React.CSSProperties; isMobile: boolean
}) {
  const [thumb, setThumb] = useState<string | null>(() => rawThumbCache.get(url) || null)
  const [playing, setPlaying] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  useEffect(() => {
    // Capture first frame on desktop only — crashes mobile browsers
    if (thumb || isMobile) return
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        observer.disconnect()
        captureFirstFrame(url).then(t => { if (t && mountedRef.current) setThumb(t) })
      }
    }, { threshold: 0.1 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [url, thumb, isMobile])

  // Mobile: static card + ▶ button → tap plays inline
  if (isMobile && fullWidth) {
    return (
      <div style={containerStyle}>
        {playing ? (
          <video
            src={url} autoPlay playsInline controls
            style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', position: 'relative', cursor: 'pointer' }}
            onClick={e => { e.stopPropagation(); setPlaying(true) }}
          >
            <GradientBox famille={famille} fullWidth={fullWidth} size={size} withEmoji={true} />
            <PlayBtn />
          </div>
        )}
      </div>
    )
  }

  // Desktop or small size: captured frame or gradient
  return (
    <div ref={ref} style={containerStyle}>
      {thumb
        ? <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: '#E8E8E8' }} />
        : <GradientBox famille={famille} fullWidth={fullWidth} size={size} withEmoji={true} />
      }
    </div>
  )
}
