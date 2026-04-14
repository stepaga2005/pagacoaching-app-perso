// ─── Shared utility functions ─────────────────────────────────────────────

export function haptic(type: 'light' | 'medium' | 'success' = 'light') {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return
  const patterns: Record<string, number[]> = { light: [8], medium: [25], success: [8, 60, 12] }
  navigator.vibrate(patterns[type])
}

export function getYoutubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

export function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return m ? m[1] : null
}
