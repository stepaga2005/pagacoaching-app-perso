'use client'

import { useEffect, useRef, useState } from 'react'
import { getYoutubeId, getVimeoId } from '../../lib/utils'

type FamilleMin = { id?: string; nom: string; couleur: string }

// Module-level cache: vimeoId → thumbnail URL
const vimeoThumbCache = new Map<string, string>()

export function VideoThumb({
  url, size = 72, famille, fullWidth = false,
}: {
  url?: string | null
  size?: number
  famille?: FamilleMin | null
  fullWidth?: boolean
}) {
  const [thumbUrl, setThumbUrl] = useState<string | null>(() => {
    const vimeoId = url ? getVimeoId(url) : null
    return vimeoId ? (vimeoThumbCache.get(vimeoId) || null) : null
  })
  const containerRef = useRef<HTMLDivElement>(null)

  const ytId = url ? getYoutubeId(url) : null
  const vimeoId = url ? getVimeoId(url) : null

  // Lazy-fetch Vimeo thumbnail when visible
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
    }, { rootMargin: '600px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [vimeoId])

  const w = fullWidth ? '100%' : size
  const h = fullWidth ? undefined : Math.round(size * 0.56)
  const ratio = fullWidth ? ('16/9' as const) : undefined

  const containerStyle: React.CSSProperties = {
    width: w, height: h, aspectRatio: ratio,
    borderRadius: fullWidth ? 0 : '8px',
    overflow: 'hidden', flexShrink: 0,
    background: '#12121E',
  }

  // YouTube — static thumbnail image
  if (ytId) {
    const thumb = `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
    return (
      <div style={containerStyle}>
        <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    )
  }

  // Vimeo — lazy-loaded static thumbnail
  if (vimeoId) {
    return (
      <div ref={containerRef} style={containerStyle}>
        {thumbUrl
          ? <img src={thumbUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <div style={{ width: '100%', height: '100%', background: '#12121E' }} />
        }
      </div>
    )
  }

  // No URL — colored family placeholder
  if (!url) {
    const color = famille?.couleur || '#2C2C44'
    const hex = color.replace('#', '')
    const r = parseInt(hex.slice(0, 2), 16) || 44
    const g = parseInt(hex.slice(2, 4), 16) || 44
    const b = parseInt(hex.slice(4, 6), 16) || 68
    return (
      <div style={{
        ...containerStyle,
        background: `linear-gradient(135deg, rgba(${r},${g},${b},0.4) 0%, rgba(${r},${g},${b},0.15) 100%)`,
      }} />
    )
  }

  // Raw video file
  return (
    <div style={containerStyle}>
      <video src={url} muted loop playsInline preload="metadata"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
  )
}
