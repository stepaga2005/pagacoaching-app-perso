'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Seance, Joueur } from '../lib/types'

export function AttributionModal({ seances, onClose }: {
  seances: Seance[]
  onClose: () => void
}) {
  const [joueurs, setJoueurs] = useState<{ id: string; nom: string; prenom: string; actif: boolean }[]>([])
  const [selectedJoueurs, setSelectedJoueurs] = useState<Set<string>>(new Set())
  const [dateDebut, setDateDebut] = useState(() => new Date().toISOString().split('T')[0])
  const [intervalJours, setIntervalJours] = useState(7)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('joueurs').select('id, nom, prenom, actif').eq('actif', true).order('nom').then(({ data }) => {
      if (data) setJoueurs(data)
    })
  }, [])

  function toggleJoueur(id: string) {
    setSelectedJoueurs(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  // Calcule les dates pour chaque séance
  function datesPrevues() {
    return seances.map((_, i) => {
      const d = new Date(dateDebut)
      d.setDate(d.getDate() + i * intervalJours)
      return d.toISOString().split('T')[0]
    })
  }

  async function confirmer() {
    if (selectedJoueurs.size === 0) return
    setSaving(true)
    const dates = datesPrevues()
    const rows: { joueur_id: string; seance_id: string; date_realisation: string; completee: boolean }[] = []
    for (const joueurId of selectedJoueurs) {
      for (let i = 0; i < seances.length; i++) {
        rows.push({ joueur_id: joueurId, seance_id: seances[i].id, date_realisation: dates[i], completee: false })
      }
    }
    await supabase.from('realisations').insert(rows)
    setSaving(false)
    onClose()
    alert(`✓ ${seances.length} séance${seances.length > 1 ? 's' : ''} attribuée${seances.length > 1 ? 's' : ''} à ${selectedJoueurs.size} joueur${selectedJoueurs.size > 1 ? 's' : ''}`)
  }

  const dates = datesPrevues()

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '520px' }}>
        <div className="modal-title">Attribuer des séances</div>
        <div className="modal-subtitle">{seances.length} séance{seances.length > 1 ? 's' : ''} sélectionnée{seances.length > 1 ? 's' : ''}</div>

        {/* Date + intervalle */}
        <div style={{ marginBottom: '16px' }}>
          <label className="section-label" style={{ display: 'block', marginBottom: '8px' }}>Planification</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)}
              className="input" style={{ width: 'auto' }} />
            {seances.length > 1 && (
              <>
                <span style={{ color: '#555', fontSize: '13px' }}>tous les</span>
                <input type="number" min={1} value={intervalJours} onChange={e => setIntervalJours(Number(e.target.value))}
                  className="input" style={{ width: '56px', textAlign: 'center' }} />
                <span style={{ color: '#555', fontSize: '13px' }}>jours</span>
              </>
            )}
          </div>
        </div>

        {/* Liste séances + dates */}
        <div style={{ background: '#0A0A14', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px', border: '1px solid #22223A' }}>
          {seances.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: i < seances.length - 1 ? '1px solid #141418' : 'none' }}>
              <span style={{ color: '#D0D0E0', fontSize: '13px', fontWeight: '600' }}>{s.nom}</span>
              <span style={{ color: '#D4AF60', fontSize: '12px', fontWeight: '700', background: '#C9A84C10', padding: '3px 8px', borderRadius: '6px' }}>
                {new Date(dates[i] + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
            </div>
          ))}
        </div>

        {/* Joueurs */}
        <div style={{ marginBottom: '24px' }}>
          <label className="section-label" style={{ display: 'block', marginBottom: '10px' }}>
            Joueurs {selectedJoueurs.size > 0 && <span style={{ color: '#5599FF', textTransform: 'none', letterSpacing: 0 }}>— {selectedJoueurs.size} sélectionné{selectedJoueurs.size > 1 ? 's' : ''}</span>}
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '220px', overflowY: 'auto' }}>
            {joueurs.length === 0 && <span style={{ color: '#444', fontSize: '13px' }}>Aucun joueur actif</span>}
            {joueurs.map(j => {
              const sel = selectedJoueurs.has(j.id)
              return (
                <button key={j.id} onClick={() => toggleJoueur(j.id)}
                  className={`list-item${sel ? ' list-item-active' : ''}`}
                  style={{ border: sel ? '1px solid #1A6FFF40' : '1px solid #22223A', cursor: 'pointer', textAlign: 'left' }}>
                  <div className={`checkbox-custom${sel ? ' checked' : ''}`}>{sel ? '✓' : ''}</div>
                  <span style={{ color: sel ? '#F0F0F8' : '#888', fontSize: '14px', fontWeight: sel ? '700' : '400' }}>{j.prenom} {j.nom}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} className="btn btn-ghost" style={{ flex: 1 }}>Annuler</button>
          <button onClick={confirmer} disabled={saving || selectedJoueurs.size === 0}
            className={`btn${selectedJoueurs.size > 0 && !saving ? ' btn-success' : ''}`}
            style={{ flex: 2, justifyContent: 'center', padding: '12px', ...(selectedJoueurs.size === 0 || saving ? { background: '#22223A', color: '#3A3A50', cursor: 'not-allowed' } : {}) }}>
            {saving ? 'Attribution...' : `Attribuer à ${selectedJoueurs.size || '...'} joueur${selectedJoueurs.size > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  )
}

type SemaineConfig = {
  pct: number
  remplacements: Record<number, { id: string; nom: string; familles?: { nom: string; couleur: string } | null }>
}

