'use client'

import { useEffect, useRef, useState } from 'react'

export function MultiCheck({ label, options, selected, onChange }: {
  label: string
  options: string[]
  selected: string[]
  onChange: (vals: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  function toggle(val: string) {
    if (selected.includes(val)) {
      onChange(selected.filter(v => v !== val))
    } else {
      onChange([...selected, val])
    }
  }

  function handleOpen() {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setRect({ top: r.bottom + 4, left: r.left, width: r.width })
    }
    setOpen(o => !o)
  }

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  // Reposition on scroll/resize
  useEffect(() => {
    if (!open) return
    function reposition() {
      if (btnRef.current) {
        const r = btnRef.current.getBoundingClientRect()
        setRect({ top: r.bottom + 4, left: r.left, width: r.width })
      }
    }
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)
    return () => {
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
    }
  }, [open])

  const sorted = [...options].sort((a, b) => a.localeCompare(b, 'fr'))

  return (
    <div style={{ position: 'relative' }}>
      <button ref={btnRef} type="button" onClick={handleOpen} style={{
        width: '100%', background: '#212135', border: '1px solid #2C2C44',
        borderRadius: '8px', padding: '11px 14px', color: selected.length ? '#FFF' : '#555',
        fontSize: '14px', outline: 'none', cursor: 'pointer', textAlign: 'left',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, marginRight: '8px' }}>
          {selected.length ? selected.join(', ') : label}
        </span>
        <span style={{ color: '#555', fontSize: '12px', flexShrink: 0 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && rect && (
        <div style={{
          position: 'fixed',
          top: rect.top,
          left: rect.left,
          width: rect.width,
          zIndex: 9000,
          background: '#212135',
          border: '1px solid #2C2C44',
          borderRadius: '8px',
          maxHeight: '240px',
          overflowY: 'auto',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        }}>
          {sorted.map(opt => (
            <label key={opt} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px', cursor: 'pointer',
              background: selected.includes(opt) ? '#1A6FFF15' : 'transparent',
            }}
              onMouseDown={e => e.preventDefault()}
            >
              <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)}
                style={{ accentColor: '#1A6FFF', width: '14px', height: '14px', flexShrink: 0 }} />
              <span style={{ color: selected.includes(opt) ? '#1A6FFF' : '#CCC', fontSize: '13px' }}>{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
