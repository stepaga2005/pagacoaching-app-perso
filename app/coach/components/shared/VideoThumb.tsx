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

// ── Caches module-level ──────────────────────────────────────────────────────
const thumbCache = new Map<string, string>()
const inFlight   = new Map<string, Promise<string>>()
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
      video.preload = 'metadata'; video.crossOrigin = 'anonymous'
      video.muted = true; video.playsInline = true
      const done = (r: string) => {
        video.src = ''; video.load(); capturingCount--; drainQueue(); resolve(r)
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
          rawThumbCache.set(url, dataUrl); done(dataUrl)
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
      const url = d.url || ''; if (url) thumbCache.set(vimeoId, url)
      inFlight.delete(vimeoId); return url
    })
    .catch(() => { inFlight.delete(vimeoId); return '' })
  inFlight.set(vimeoId, p); return p
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function isMobileDevice() {
  return typeof window !== 'undefined' && window.innerWidth < 768
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

function PlayBtn({ size = 44 }: { size?: number }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex',
      alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
    }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: 'rgba(0,0,0,0.55)', border: '2px solid rgba(255,255,255,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}>
        <span style={{ color: '#FFF', fontSize: size * 0.35, marginLeft: size * 0.07, lineHeight: 1 }}>▶</span>
      </div>
    </div>
  )
}

// Modal plein écran pour lire une vidéo sur mobile (Vimeo / YouTube)
function VideoModal({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.96)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%', width: 40, height: 40, color: '#FFF', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}
      >✕</button>
      <div
        style={{ width: '100%', maxWidth: 600, aspectRatio: '16/9', padding: '0 12px', boxSizing: 'border-box' }}
        onClick={e => e.stopPropagation()}
      >
        <iframe
          src={src}
          style={{ width: '100%', height: '100%', border: 'none', borderRadius: 8 }}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}

// ── Composant principal ──────────────────────────────────────────────────────
export function VideoThumb({
  url, size = 72, famille, fullWidth = false,
}: {
  url?: string | null
  size?: number
  famille?: FamilleMin | null
  fullWidth?: boolean
}) {
  // Initialisation immédiate pour éviter le flash "desktop" sur mobile
  const [mobile, setMobile] = useState(() => isMobileDevice())
  const ytId    = url ? getYoutubeId(url) : null
  const vimeoId = url ? getVimeoId(url)   : null

  const [thumbUrl, setThumbUrl] = useState<string | null>(() =>
    vimeoId ? (thumbCache.get(vimeoId) || null) : null
  )
  const [modalSrc, setModalSrc] = useState<string | null>(null)
  const [hovered, setHovered]   = useState(false)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
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
    overflow: 'hidden', flexShrink: 0, position: 'relative',
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
    const embedSrc = `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0`
    return (
      <>
        {modalSrc && <VideoModal src={modalSrc} onClose={() => setModalSrc(null)} />}
        <div style={containerStyle}
          onMouseEnter={() => !mobile && fullWidth && setHovered(true)}
          onMouseLeave={() => !mobile && fullWidth && setHovered(false)}
        >
          {fullWidth && !mobile && hovered ? (
            <iframe src={embedSrc} style={{ width: '100%', height: '100%', border: 'none', display: 'block' }} allow="autoplay" />
          ) : (
            <>
              <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              {fullWidth && mobile && (
                <div style={{ position: 'absolute', inset: 0, cursor: 'pointer' }}
                  onClick={e => { e.stopPropagation(); setModalSrc(embedSrc) }}>
                  <PlayBtn />
                </div>
              )}
            </>
          )}
        </div>
      </>
    )
  }

  // ── Vimeo ─────────────────────────────────────────────────────────────────
  if (vimeoId) {
    const embedSrc = mobile
      ? `https://player.vimeo.com/video/${vimeoId}?autoplay=1`
      : `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&background=1`

    return (
      <>
        {modalSrc && <VideoModal src={modalSrc} onClose={() => setModalSrc(null)} />}
        <div style={containerStyle}
          onMouseEnter={() => !mobile && fullWidth && setHovered(true)}
          onMouseLeave={() => !mobile && fullWidth && setHovered(false)}
        >
          {fullWidth && !mobile && hovered ? (
            <iframe src={embedSrc} style={{ width: '100%', height: '100%', border: 'none', display: 'block' }} allow="autoplay; fullscreen" />
          ) : (
            <>
              {thumbUrl
                ? <img src={thumbUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                : <GradientBox famille={famille} fullWidth={fullWidth} size={size} withEmoji={false} />
              }
              {fullWidth && mobile && (
                <div style={{ position: 'absolute', inset: 0, cursor: 'pointer' }}
                  onClick={e => { e.stopPropagation(); setModalSrc(`https://player.vimeo.com/video/${vimeoId}?autoplay=1`) }}>
                  <PlayBtn />
                </div>
              )}
            </>
          )}
        </div>
      </>
    )
  }

  // ── Raw mp4 (Supabase Storage — exercices TC) ─────────────────────────────
  return (
    <RawVideoThumb
      url={url} famille={famille} fullWidth={fullWidth}
      size={size} containerStyle={containerStyle} mobile={mobile}
    />
  )
}

function RawVideoThumb({ url, famille, fullWidth, size, containerStyle, mobile }: {
  url: string; famille?: FamilleMin | null; fullWidth: boolean; size: number
  containerStyle: React.CSSProperties; mobile: boolean
}) {
  // Capture frame uniquement sur desktop
  const [thumb, setThumb] = useState<string | null>(() => rawThumbCache.get(url) || null)
  const [playing, setPlaying] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  useEffect(() => {
    if (thumb || mobile) return
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        obs.disconnect()
        captureFirstFrame(url).then(t => { if (t && mountedRef.current) setThumb(t) })
      }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [url, thumb, mobile])

  // Mobile fullWidth : gradient + ▶ → lecture inline dans la carte
  if (mobile && fullWidth) {
    return (
      <div style={containerStyle}>
        {playing ? (
          <video
            src={url} autoPlay playsInline controls
            style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000', display: 'block' }}
          />
        ) : (
          <>
            <GradientBox famille={famille} fullWidth={fullWidth} size={size} withEmoji={true} />
            <div
              style={{ position: 'absolute', inset: 0, cursor: 'pointer' }}
              onClick={e => { e.stopPropagation(); setPlaying(true) }}
            >
              <PlayBtn />
            </div>
          </>
        )}
      </div>
    )
  }

  // Desktop ou petite taille : frame capturée ou gradient
  return (
    <div ref={ref} style={containerStyle}>
      {thumb
        ? <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: '#E8E8E8' }} />
        : <GradientBox famille={famille} fullWidth={fullWidth} size={size} withEmoji={true} />
      }
    </div>
  )
}
