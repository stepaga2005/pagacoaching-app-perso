'use client'

import { useState } from 'react'
import { Exercice } from '../lib/types'
import { VideoThumb } from './shared/VideoThumb'

export function ExercicePicker({ exercices, onConfirm, onClose }: {
  exercices: Exercice[]
  onConfirm: (exs: Exercice[]) => void
  onClose: () => void
}) {
  const [recherche, setRecherche] = useState('')
  const [filtresFamille, setFiltresFamille] = useState<string[]>([])
  const [selection, setSelection] = useState<Set<string>>(new Set())

  // Familles uniques triées (id inclus dans la requête familles(id, nom, couleur))
  const familles = Array.from(
    new Map(
      exercices
        .filter(e => e.familles?.id)
        .map(e => [e.familles!.id, e.familles!])
    ).values()
  ).sort((a, b) => a.nom.localeCompare(b.nom))

  const filtres = exercices
    .filter(e => filtresFamille.length === 0 || (e.familles?.id && filtresFamille.includes(e.familles.id)))
    .filter(e =>
      e.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      (e.familles?.nom || '').toLowerCase().includes(recherche.toLowerCase())
    )
    .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))

  function toggleEx(id: string) {
    setSelection(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleConfirm() {
    const choisis = exercices.filter(e => selection.has(e.id))
    if (choisis.length > 0) onConfirm(choisis)
    else onClose()
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 200, alignItems: 'flex-end' }}>
      <div className="modal-box" style={{
        maxWidth: '600px', width: '100%',
        height: '92vh', display: 'flex', flexDirection: 'column',
        borderRadius: '20px 20px 0 0', margin: 0, padding: '0',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: '#2A2A35' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px 10px' }}>
          <div className="modal-title" style={{ flex: 1, marginBottom: 0, fontSize: '17px' }}>Ajouter des exercices</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#A8A8C4', cursor: 'pointer', fontSize: '20px', lineHeight: 1, padding: '4px' }}>✕</button>
        </div>

        {/* Recherche */}
        <div style={{ padding: '0 12px 10px' }}>
          <input
            autoFocus
            value={recherche}
            onChange={e => setRecherche(e.target.value)}
            placeholder="Rechercher par nom..."
            className="input"
            style={{ fontSize: '14px' }}
          />
        </div>

        {/* Corps : sidebar familles + liste exercices */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Sidebar familles (gauche) */}
          <div style={{
            width: '90px', flexShrink: 0,
            overflowY: 'auto', borderRight: '1px solid #22223A',
            display: 'flex', flexDirection: 'column', gap: '2px', padding: '4px 6px',
          }}>
            <button
              onClick={() => setFiltresFamille([])}
              style={{
                padding: '8px 6px', borderRadius: '8px', border: 'none',
                background: filtresFamille.length === 0 ? 'rgba(0,122,255,0.18)' : 'transparent',
                color: filtresFamille.length === 0 ? '#007AFF' : '#555',
                fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                textAlign: 'center', lineHeight: '1.2',
              }}>Tous</button>
            {familles.map(f => {
              const actif = filtresFamille.includes(f.id)
              return (
                <button key={f.id}
                  onClick={() => setFiltresFamille(prev => actif ? prev.filter(id => id !== f.id) : [...prev, f.id])}
                  style={{
                    padding: '8px 6px', borderRadius: '8px', border: 'none',
                    background: actif ? f.couleur + '28' : 'transparent',
                    color: actif ? f.couleur : '#555',
                    fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                    textAlign: 'center', lineHeight: '1.2',
                  }}>{f.nom}</button>
              )
            })}
          </div>

          {/* Liste exercices (droite) */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', padding: '4px 8px' }}>
            {filtres.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <div className="empty-state-text">Aucun exercice trouvé</div>
              </div>
            )}
            {filtres.map(ex => {
              const selected = selection.has(ex.id)
              return (
                <button key={ex.id} onClick={() => toggleEx(ex.id)}
                  style={{
                    display: 'flex', gap: '10px', alignItems: 'center',
                    padding: '9px 10px', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', width: '100%',
                    background: selected ? 'rgba(0,122,255,0.1)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${selected ? 'rgba(0,122,255,0.4)' : '#22223A'}`,
                    transition: 'all 0.15s ease',
                  }}>
                  <VideoThumb url={ex.video_url} size={60} famille={ex.familles} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '700', fontSize: '13px', color: selected ? '#60B8FF' : '#F0F0F8', marginBottom: '2px' }} className="truncate">
                      {ex.nom}
                    </div>
                    {ex.familles && (
                      <span style={{
                        fontSize: '10px', fontWeight: '700',
                        color: ex.familles.couleur,
                      }}>{ex.familles.nom}</span>
                    )}
                  </div>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                    background: selected ? '#007AFF' : 'transparent',
                    border: `2px solid ${selected ? '#007AFF' : '#333'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}>
                    {selected && <span style={{ color: '#FFF', fontSize: '13px', lineHeight: 1 }}>✓</span>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer — bouton Ajouter */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #22223A' }}>
          <button onClick={handleConfirm}
            className="btn btn-primary btn-block btn-lg"
            style={{ borderRadius: '14px' }}>
            {selection.size === 0
              ? 'Fermer'
              : `Ajouter ${selection.size} exercice${selection.size > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  )
}

