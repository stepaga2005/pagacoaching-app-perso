'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Joueur, MPRealisation } from '../lib/types'
import { SearchableSelect } from './shared/SearchableSelect'
import { toast } from '../lib/toast'

export function CopierJoursModal({ joursSelectionnes, byDate, joueurCourant, allJoueurs, onDone, onClose }: {
  joursSelectionnes: Set<string>
  byDate: Record<string, MPRealisation[]>
  joueurCourant: Joueur
  allJoueurs: { id: string; nom: string; prenom: string }[]
  onDone: () => void
  onClose: () => void
}) {
  const [mode, setMode] = useState<'joueur' | 'modele'>('joueur')
  const [cibleJoueurId, setCibleJoueurId] = useState('')
  const [dateDebut, setDateDebut] = useState('')
  const [nomModele, setNomModele] = useState('')
  const [loading, setLoading] = useState(false)

  const datesTriees = [...joursSelectionnes].sort()

  function addDays(ds: string, n: number) {
    const d = new Date(ds + 'T12:00:00'); d.setDate(d.getDate() + n)
    return d.toISOString().split('T')[0]
  }
  function daysBetween(d1: string, d2: string) {
    return Math.round((new Date(d2 + 'T12:00:00').getTime() - new Date(d1 + 'T12:00:00').getTime()) / 86400000)
  }

  const totalSessions = datesTriees.reduce((n, d) => n + (byDate[d]?.filter(r => r.seance_id)?.length || 0), 0)

  async function handleCopier() {
    if (mode === 'joueur' && (!cibleJoueurId || !dateDebut)) { toast('Sélectionne un joueur et une date de début', 'info'); return }
    if (mode === 'modele' && !nomModele.trim()) { toast('Entre un nom pour le modèle', 'info'); return }
    setLoading(true)
    const anchor = datesTriees[0]
    try {
      if (mode === 'joueur') {
        const inserts = datesTriees.flatMap(date => {
          const offset = daysBetween(anchor, date)
          const newDate = addDays(dateDebut, offset)
          return (byDate[date] || []).filter(r => r.seance_id).map(r => ({
            joueur_id: cibleJoueurId, seance_id: r.seance_id,
            date_realisation: newDate, completee: false,
          }))
        })
        if (inserts.length > 0) await supabase.from('realisations').insert(inserts)
        toast(`✓ ${inserts.length} séance(s) copiée(s) !`, 'success')
      } else {
        const { data: prog, error: pe } = await supabase.from('programmes').insert({ nom: nomModele.trim() }).select().single()
        if (pe || !prog) { toast(`Erreur : ${pe?.message}`, 'error'); setLoading(false); return }
        for (const date of datesTriees) {
          const offset = daysBetween(anchor, date)
          const weekNum = Math.floor(offset / 7) + 1
          const dow = new Date(date + 'T12:00:00').getDay()
          const jourSemaine = dow === 0 ? 7 : dow
          for (const real of (byDate[date] || []).filter(r => r.seance_id)) {
            const { data: ns } = await supabase.from('seances').insert({
              nom: real.seances?.nom || 'Séance', type: real.seances?.type || 'complete',
              programme_id: prog.id, jour_semaine: jourSemaine, semaine: weekNum, est_template: false,
            }).select().single()
            if (ns && real.seance_id) {
              const { data: exos } = await supabase.from('seance_exercices').select('*').eq('seance_id', real.seance_id).order('ordre')
              if (exos && exos.length > 0) {
                await supabase.from('seance_exercices').insert(exos.map(e => ({
                  seance_id: ns.id, exercice_id: e.exercice_id, ordre: e.ordre,
                  series: e.series, repetitions: e.repetitions, duree_secondes: e.duree_secondes,
                  distance_metres: e.distance_metres, charge_kg: e.charge_kg,
                  recuperation_secondes: e.recuperation_secondes, lien_suivant: e.lien_suivant,
                  uni_podal: e.uni_podal, notes: e.notes, sets_config: e.sets_config,
                })))
              }
            }
          }
        }
        toast(`✓ Modèle "${nomModele}" créé !`, 'success')
      }
      onDone()
    } catch (e: unknown) {
      toast(`Erreur : ${e instanceof Error ? e.message : String(e)}`, 'error')
    } finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 600 }}>
      <div className="modal-box" style={{ maxWidth: '440px', width: '100%' }}>
        <div className="modal-title">Copier {datesTriees.length} jour{datesTriees.length > 1 ? 's' : ''}</div>
        <div style={{ color: '#555', fontSize: '12px', marginBottom: '20px' }}>{totalSessions} séance{totalSessions > 1 ? 's' : ''} sélectionnée{totalSessions > 1 ? 's' : ''}</div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {(['joueur', 'modele'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: '10px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px',
              border: `1px solid ${mode === m ? (m === 'joueur' ? '#007AFF' : '#C9A84C') : '#2C2C44'}`,
              background: mode === m ? (m === 'joueur' ? 'rgba(0,122,255,0.12)' : 'rgba(201,168,76,0.12)') : 'transparent',
              color: mode === m ? (m === 'joueur' ? '#007AFF' : '#C9A84C') : '#666',
            }}>{m === 'joueur' ? '👤 Vers un joueur' : '📋 Créer un modèle'}</button>
          ))}
        </div>

        {mode === 'joueur' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Joueur cible</label>
              <SearchableSelect
                value={cibleJoueurId}
                items={allJoueurs.filter(j => j.id !== joueurCourant.id).map(j => ({ id: j.id, nom: `${j.prenom} ${j.nom}` }))}
                onChange={j => setCibleJoueurId(j.id)}
                placeholder="— Choisir un joueur —"
                triggerStyle={{ width: '100%' }}
                zIndex={650}
              />
            </div>
            <div>
              <label style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                Date de début (= {new Date(datesTriees[0] + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })})
              </label>
              <input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)} className="input" style={{ width: '100%' }} />
            </div>
          </div>
        )}

        {mode === 'modele' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Nom du modèle</label>
              <input value={nomModele} onChange={e => setNomModele(e.target.value)} placeholder="Ex : Semaine type pré-saison" className="input" style={{ width: '100%' }} />
            </div>
            <div style={{ background: '#0E0E18', border: '1px solid #1E1E30', borderRadius: '10px', padding: '12px' }}>
              <div style={{ color: '#444', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Aperçu</div>
              {datesTriees.filter(d => (byDate[d] || []).some(r => r.seance_id)).map(d => {
                const offset = daysBetween(datesTriees[0], d)
                const wk = Math.floor(offset / 7) + 1
                const jourNom = new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'short' })
                return (
                  <div key={d} style={{ display: 'flex', gap: '10px', alignItems: 'baseline', marginBottom: '4px' }}>
                    <span style={{ color: '#C9A84C', fontSize: '10px', fontWeight: '800', width: '48px', flexShrink: 0 }}>S{wk} {jourNom}</span>
                    <span style={{ color: '#666', fontSize: '11px' }}>{(byDate[d] || []).filter(r => r.seance_id).map(r => r.seances?.nom || 'Séance').join(', ')}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          <button onClick={onClose} className="btn btn-ghost" style={{ flex: 1 }}>Annuler</button>
          <button onClick={handleCopier} disabled={loading} className="btn btn-primary" style={{ flex: 2 }}>
            {loading ? 'En cours...' : mode === 'joueur' ? 'Copier vers ce joueur' : 'Créer le modèle'}
          </button>
        </div>
      </div>
    </div>
  )
}

