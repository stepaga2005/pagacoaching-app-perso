type ToastType = 'success' | 'error' | 'info'

let current: { el: HTMLElement; timer: ReturnType<typeof setTimeout> } | null = null

export function toast(message: string, type: ToastType = 'info', duration = 3500) {
  if (typeof window === 'undefined') return

  if (current) {
    clearTimeout(current.timer)
    current.el.remove()
    current = null
  }

  const colors: Record<ToastType, { bg: string; border: string; icon: string }> = {
    success: { bg: '#0D2E1A', border: '#2ECC71', icon: '✓' },
    error:   { bg: '#2E0D0D', border: '#E74C3C', icon: '✕' },
    info:    { bg: '#0D1A2E', border: '#1A6FFF', icon: 'ℹ' },
  }
  const c = colors[type]

  const el = document.createElement('div')
  el.style.cssText = [
    'position:fixed', 'bottom:24px', 'left:50%', 'transform:translateX(-50%) translateY(0)',
    `background:${c.bg}`, `border:1px solid ${c.border}`, 'border-radius:10px',
    'padding:12px 20px', 'color:#FFF', 'font-size:13px', 'font-weight:600',
    'display:flex', 'align-items:center', 'gap:8px',
    'box-shadow:0 8px 32px rgba(0,0,0,0.6)', 'z-index:9999',
    'transition:opacity 0.3s ease, transform 0.3s ease',
    'max-width:80vw', 'text-align:center', 'pointer-events:none',
  ].join(';')

  const icon = document.createElement('span')
  icon.style.cssText = `color:${c.border};font-size:14px;flex-shrink:0`
  icon.textContent = c.icon

  const text = document.createElement('span')
  text.textContent = message

  el.appendChild(icon)
  el.appendChild(text)
  document.body.appendChild(el)

  requestAnimationFrame(() => {
    el.style.opacity = '1'
    el.style.transform = 'translateX(-50%) translateY(0)'
  })

  const timer = setTimeout(() => {
    el.style.opacity = '0'
    el.style.transform = 'translateX(-50%) translateY(8px)'
    setTimeout(() => { el.remove(); if (current?.el === el) current = null }, 300)
  }, duration)

  current = { el, timer }
}
