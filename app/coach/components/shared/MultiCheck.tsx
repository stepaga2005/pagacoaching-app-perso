'use client'

import { useState } from 'react'

export function MultiCheck({ label, options, selected, onChange }: {
  label: string
  options: string[]
  selected: string[]
  onChange: (vals: string[]) => void
}) {
  const [open, setOpen] = useState(false)

  function toggle(val: string) {
    if (selected.includes(val)) {
      onChange(selected.filter(v => v !== val))
    } else {
      onChange([...selected, val])
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <button type="button" onClick={() => setOpen(o => !o)} style={{
        width: '100%', background: '#212135', border: '1px solid #2C2C44',
        borderRadius: '8px', padding: '11px 14px', color: selected.length ? '#FFF' : '#555',
        fontSize: '14px', outline: 'none', cursor: 'pointer', textAlign: 'left',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span>{selected.length ? selected.join(', ') : label}</span>
        <span style={{ color: '#555', fontSize: '12px' }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200,
          background: '#212135', border: '1px solid #2C2C44', borderRadius: '8px',
          maxHeight: '220px', overflowY: 'auto', marginTop: '4px',
        }}>
          {options.map(opt => (
            <label key={opt} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px', cursor: 'pointer',
              background: selected.includes(opt) ? '#1A6FFF15' : 'transparent',
            }}>
              <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)}
                style={{ accentColor: '#1A6FFF', width: '14px', height: '14px' }} />
              <span style={{ color: selected.includes(opt) ? '#1A6FFF' : '#CCC', fontSize: '13px' }}>{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
