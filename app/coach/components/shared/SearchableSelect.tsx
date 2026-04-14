'use client'

import { useState } from 'react'

export function SearchableSelect({ value, items, onChange, placeholder, triggerStyle, zIndex = 500 }: {
  value: string
  items: { id: string; nom: string }[]
  onChange: (item: { id: string; nom: string }) => void
  placeholder?: string
  triggerStyle?: React.CSSProperties
  zIndex?: number
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const selected = items.find(i => i.id === value)
  const filtered = items.filter(i => i.nom.toLowerCase().includes(search.toLowerCase())).sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: '#212135', border: '1px solid #2C2C44', borderRadius: '10px',
          padding: '10px 14px', color: selected ? '#F0F0F8' : '#555',
          cursor: 'pointer', fontSize: '14px', outline: 'none', textAlign: 'left',
          ...triggerStyle,
        }}>
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected?.nom || placeholder || 'Sélectionner...'}
        </span>
        <span style={{ color: '#444', fontSize: '10px', flexShrink: 0 }}>▼</span>
      </button>

      {open && (
        <div
          onClick={() => { setOpen(false); setSearch('') }}
          style={{ position: 'fixed', inset: 0, zIndex, background: 'rgba(0,0,0,0.75)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#18182A', borderRadius: '20px 20px 0 0', maxHeight: '70vh', display: 'flex', flexDirection: 'column', border: '1px solid #22223A' }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
              <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: '#2A2A35' }} />
            </div>
            <div style={{ padding: '12px 16px 6px' }}>
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="input"
                style={{ fontSize: '14px' }}
              />
            </div>
            <div style={{ padding: '4px 20px 6px', color: '#444', fontSize: '11px', fontWeight: '600' }}>
              {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {filtered.map(item => {
                const isSelected = item.id === value
                return (
                  <button
                    key={item.id}
                    onClick={() => { onChange(item); setOpen(false); setSearch('') }}
                    style={{
                      display: 'flex', alignItems: 'center', width: '100%',
                      padding: '14px 20px', textAlign: 'left', border: 'none',
                      borderBottom: '1px solid #1C1C2C',
                      background: isSelected ? 'rgba(0,122,255,0.08)' : 'transparent',
                      color: isSelected ? '#007AFF' : '#D0D0E8',
                      cursor: 'pointer', fontSize: '14px', fontWeight: isSelected ? '700' : '400',
                    }}>
                    <span style={{ flex: 1 }}>{item.nom}</span>
                    {isSelected && <span style={{ color: '#007AFF', fontSize: '16px' }}>✓</span>}
                  </button>
                )
              })}
              {filtered.length === 0 && (
                <div style={{ padding: '32px', textAlign: 'center', color: '#444', fontSize: '13px' }}>Aucun résultat</div>
              )}
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid #22223A' }}>
              <button
                onClick={() => { setOpen(false); setSearch('') }}
                className="btn btn-ghost btn-block">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
