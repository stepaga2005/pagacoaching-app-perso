'use client'

import { useState, useEffect } from 'react'
import { Exercice } from '../lib/types'
import { VideoThumb } from './shared/VideoThumb'
import { getYoutubeId, getVimeoId } from '../lib/utils'

const TC_URL = '/storage/v1/object/public/videos/tc/'
const isTc = (ex: Exercice) => !!(ex.video_url?.includes(TC_URL))

export function ExercicePicker({ exercices, onConfirm, onClose }: {
  exercices: Exercice[]
  onConfirm: (exs: Exercice[]) => void
  onClose: () => void
}) {
  const [recherche, setRecherche] = useState('')
  const [filtresFamille, setFiltresFamille] = useState<string[]>([])
  const [selection, setSelection] = useState<Set<string>>(new Set())
  const [source, setSource] = useState<'all' | 'mes' | 'tc'>('all')
  const [preview, setPreview] = useState<PreviewExercice | null>(null)

  // Familles uniques triées
  const familles = Array.from(
    new Map(
      exercices
        .filter(e => e.familles?.id && (source === 'all' || (source === 'tc' ? isTc(e) : !isTc(e))))
        .map(e => [e.familles!.id, e.familles!])
    ).values()
  ).sort((a, b) => a.nom.localeCompare(b.nom))

  const filtres = exercices
    .filter(e => source === 'all' || (source === 'tc' ? isTc(e) : !isTc(e)))
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

  // Fermer la preview (Escape) sans fermer le picker
  useEffect(() => {
    if (!preview) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setPreview(null) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [preview])

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px 8px' }}>
          <div className="modal-title" style={{ flex: 1, marginBottom: 0, fontSize: '17px' }}>Ajouter des exercices</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#A8A8C4', cursor: 'pointer', fontSize: '20px', lineHeight: 1, padding: '4px' }}>✕</button>
        </div>

        {/* Source tabs */}
        <div style={{ display: 'flex', margin: '0 12px 8px', background: '#18182A', borderRadius: '10px', border: '1px solid #2C2C44', padding: '3px', gap: '2px' }}>
          {([['all', 'Tous'], ['mes', 'Mes exercices'], ['tc', 'TotalCoaching']] as const).map(([id, label]) => (
            <button key={id} onClick={() => { setSource(id); setFiltresFamille([]) }}
              style={{
                flex: 1, padding: '7px 4px', borderRadius: '8px', border: 'none',
                background: source === id ? '#007AFF' : 'transparent',
                color: source === id ? '#FFF' : '#666',
                fontSize: '11px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s',
              }}>{label}</button>
          ))}
        </div>

        {/* Recherche */}
        <div style={{ padding: '0 12px 8px' }}>
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
                <div key={ex.id}
                  style={{
                    display: 'flex', gap: '10px', alignItems: 'center',
                    padding: '9px 10px', borderRadius: '12px', textAlign: 'left', width: '100%',
                    background: selected ? 'rgba(0,122,255,0.1)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${selected ? 'rgba(0,122,255,0.4)' : '#22223A'}`,
                    transition: 'all 0.15s ease',
                  }}>
                  {/* Miniature — tap = preview, ne sélectionne pas */}
                  <div
                    onClick={() => setPreview(ex)}
                    style={{ flexShrink: 0, position: 'relative', cursor: 'pointer', borderRadius: '8px', overflow: 'hidden' }}
                  >
                    <VideoThumb url={ex.video_url} size={60} famille={ex.familles} />
                    {ex.video_url && (
                      <div style={{
                        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(0,0,0,0.28)',
                      }}>
                        <span style={{ fontSize: '16px', color: '#FFF', lineHeight: 1, textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>▶</span>
                      </div>
                    )}
                  </div>

                  {/* Nom + famille — tap = sélectionner */}
                  <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => toggleEx(ex.id)}>
                    <div style={{ fontWeight: '700', fontSize: '13px', color: selected ? '#60B8FF' : '#F0F0F8', marginBottom: '2px' }} className="truncate">
                      {ex.nom}
                    </div>
                    {ex.familles && (
                      <span style={{ fontSize: '10px', fontWeight: '700', color: ex.familles.couleur }}>{ex.familles.nom}</span>
                    )}
                  </div>

                  {/* Checkbox */}
                  <div
                    onClick={() => toggleEx(ex.id)}
                    style={{
                      width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0, cursor: 'pointer',
                      background: selected ? '#007AFF' : 'transparent',
                      border: `2px solid ${selected ? '#007AFF' : '#333'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s ease',
                    }}>
                    {selected && <span style={{ color: '#FFF', fontSize: '13px', lineHeight: 1 }}>✓</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
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

      {/* Modal prévisualisation vidéo */}
      {preview && <PreviewModal ex={preview} onClose={() => setPreview(null)} />}
    </div>
  )
}

export type PreviewExercice = { nom: string; video_url?: string | null; familles?: { nom: string; couleur: string } | null; description?: string | null }

export function PreviewModal({ ex, onClose }: { ex: PreviewExercice; onClose: () => void }) {
  const ytId = ex.video_url ? getYoutubeId(ex.video_url) : null
  const vimeoId = ex.video_url ? getVimeoId(ex.video_url) : null
  const isTcVideo = ex.video_url?.includes(TC_URL)

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.97)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <button
        onClick={e => { e.stopPropagation(); onClose() }}
        style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '50%', width: 44, height: 44, color: '#FFF', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >✕</button>

      <div style={{ width: '100%', maxWidth: 560, padding: '0 16px', boxSizing: 'border-box' }} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: '800', fontSize: '17px', color: '#FFF', marginBottom: '6px', lineHeight: 1.3 }}>{ex.nom}</div>
        {ex.familles && (
          <span style={{ fontSize: '11px', fontWeight: '700', color: ex.familles.couleur, display: 'block', marginBottom: '14px' }}>{ex.familles.nom}</span>
        )}

        <div style={{ aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
          {ytId && (
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=0`}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          )}
          {vimeoId && (
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          )}
          {isTcVideo && (
            <video
              src={ex.video_url!}
              controls
              autoPlay
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
            />
          )}
          {!ex.video_url && (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '14px' }}>
              Pas de vidéo disponible
            </div>
          )}
        </div>

        {ex.description && (
          <p style={{ color: '#C0C0D8', fontSize: '13px', lineHeight: '1.6', marginTop: '14px' }}>{ex.description}</p>
        )}
      </div>
    </div>
  )
}
