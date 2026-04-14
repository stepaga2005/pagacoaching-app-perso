'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Seance, SemaineConfig, SetConfig, SeanceExercice } from '../lib/types'
import { SearchableSelect } from './shared/SearchableSelect'
import { toast } from '../lib/toast'

export function DuplicationModal({ seance, onClose, onDuplique }: {
  seance: Seance
  onClose: () => void
  onDuplique: () => void
}) {
  const [nbSemaines, setNbSemaines] = useState(1)
  const [semaines, setSemaines] = useState<SemaineConfig[]>([{ pct: 10, remplacements: {} }])
  const [deltaReps, setDeltaReps] = useState(2)
  const [deltaSeries, setDeltaSeries] = useState(1)
  const [saving, setSaving] = useState(false)
  const [picker, setPicker] = useState<{ exoIdx: number; semIdx: number } | null>(null)
  const [recherche, setRecherche] = useState('')
  const [exercicesBanque, setExercicesBanque] = useState<{ id: string; nom: string; familles?: { nom: string; couleur: string } | null }[]>([])

  const lignes = seance.seance_exercices || []

  useEffect(() => {
    supabase.from('exercices').select('*, familles(nom, couleur)').order('nom').then(({ data }) => {
      if (data) setExercicesBanque(data)
    })
  }, [])

  useEffect(() => {
    setSemaines(prev => {
      if (nbSemaines > prev.length)
        return [...prev, ...Array.from({ length: nbSemaines - prev.length }, (_, i) => ({ pct: prev[prev.length - 1]?.pct ?? 10, remplacements: {} }))]
      return prev.slice(0, nbSemaines)
    })
  }, [nbSemaines])

  function appliquer(ligne: SeanceExercice, pct: number) {
    const p = (v?: number, sens: 'up' | 'down' = 'up') => v == null ? v : Math.round(v * (sens === 'up' ? 1 + pct / 100 : 1 - pct / 100) * 10) / 10
    return {
      ...ligne,
      charge_kg: p(ligne.charge_kg, 'up'),
      recuperation_secondes: p(ligne.recuperation_secondes, 'down'),
      series: ligne.series == null ? ligne.series : Math.max(1, ligne.series + deltaSeries),
      repetitions: ligne.repetitions == null ? ligne.repetitions : Math.max(1, ligne.repetitions + deltaReps),
    }
  }

  async function confirmer() {
    setSaving(true)
    try {
      let currentLignes = [...lignes]
      for (let s = 0; s < nbSemaines; s++) {
        const { pct, remplacements } = semaines[s]
        const newLignes = currentLignes.map(l => appliquer(l, pct))
        const { data: ns, error } = await supabase.from('seances')
          .insert({ nom: `${seance.nom} — S+${s + 1}`, type: seance.type, notes: seance.notes, est_template: true, programme_id: null })
          .select().single()
        if (error) throw error
        if (ns) {
          const { error: exoErr } = await supabase.from('seance_exercices').insert(
            newLignes.map((l, i) => ({
              seance_id: ns.id,
              exercice_id: remplacements[i]?.id ?? l.exercice_id,
              ordre: i + 1,
              series: l.series ? Math.round(l.series) : null,
              repetitions: l.repetitions ? Math.round(l.repetitions) : null,
              duree_secondes: l.duree_secondes ?? null,
              distance_metres: l.distance_metres ?? null,
              charge_kg: l.charge_kg ?? null,
              recuperation_secondes: l.recuperation_secondes ? Math.round(l.recuperation_secondes) : null,
              recuperation_inter_sets: l.recuperation_inter_sets || null,
              lien_suivant: l.lien_suivant || false,
              uni_podal: l.uni_podal || false,
              notes: l.notes ?? null,
            }))
          )
          if (exoErr) throw exoErr
        }
        currentLignes = newLignes
      }
      onDuplique()
      onClose()
    } catch (e: unknown) {
      toast('Erreur duplication : ' + (e instanceof Error ? e.message : String(e)), 'error')
    } finally {
      setSaving(false)
    }
  }

  const exosFiltres = exercicesBanque.filter(ex => ex.nom.toLowerCase().includes(recherche.toLowerCase()))

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
      <div style={{ background: '#18182A', border: '1px solid #2C2C44', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px' }}>Dupliquer avec progression</h2>

        {/* 1 — Nombre de semaines */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span style={{ color: '#888', fontSize: '13px', minWidth: '50px' }}>Créer</span>
          {[1, 2, 3, 4].map(n => (
            <button key={n} onClick={() => setNbSemaines(n)} style={{
              width: '38px', height: '38px', borderRadius: '8px',
              border: `1px solid ${nbSemaines === n ? '#C9A84C' : '#2C2C44'}`,
              background: nbSemaines === n ? '#C9A84C20' : 'transparent',
              color: nbSemaines === n ? '#C9A84C' : '#555',
              cursor: 'pointer', fontWeight: '700', fontSize: '15px',
            }}>{n}</button>
          ))}
          <span style={{ color: '#C9A84C', fontSize: '13px', fontWeight: '600' }}>
            {Array.from({ length: nbSemaines }, (_, i) => `S+${i + 1}`).join(' · ')}
          </span>
        </div>

        {/* 2 — Volume global */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', padding: '12px 14px', background: '#212135', borderRadius: '10px' }}>
          <span style={{ color: '#1A6FFF', fontWeight: '700', fontSize: '13px' }}>+/semaine</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#888', fontSize: '12px' }}>Séries</span>
            <input type="number" value={deltaSeries} onChange={e => setDeltaSeries(Number(e.target.value))}
              style={{ width: '44px', background: '#18182A', border: '1px solid #2C2C44', borderRadius: '6px', padding: '5px 6px', color: '#FFF', fontSize: '13px', outline: 'none', textAlign: 'center' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#888', fontSize: '12px' }}>Reps</span>
            <input type="number" value={deltaReps} onChange={e => setDeltaReps(Number(e.target.value))}
              style={{ width: '44px', background: '#18182A', border: '1px solid #2C2C44', borderRadius: '6px', padding: '5px 6px', color: '#FFF', fontSize: '13px', outline: 'none', textAlign: 'center' }} />
          </div>
          <span style={{ color: '#7878A8', fontSize: '11px' }}>(négatif = réduction)</span>
        </div>

        {/* 3 — Tableau : exercices × semaines */}
        <div style={{ background: '#0B0B14', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: `1fr ${Array(nbSemaines).fill('80px').join(' ')}`, background: '#212135', padding: '8px 12px', gap: '8px' }}>
            <span style={{ color: '#9898B8', fontSize: '11px', textTransform: 'uppercase' }}>Exercice</span>
            {semaines.map((s, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                <span style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700' }}>S+{i + 1}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <input type="number" min={0} max={50} value={s.pct}
                    onChange={e => setSemaines(prev => prev.map((x, j) => j === i ? { ...x, pct: Number(e.target.value) } : x))}
                    style={{ width: '40px', background: '#18182A', border: '1px solid #C9A84C50', borderRadius: '4px', padding: '3px 4px', color: '#C9A84C', fontSize: '12px', fontWeight: '700', outline: 'none', textAlign: 'center' }} />
                  <span style={{ color: '#9898B8', fontSize: '10px' }}>%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Lignes exercices */}
          {lignes.map((l, exoIdx) => (
            <div key={exoIdx} style={{ display: 'grid', gridTemplateColumns: `1fr ${Array(nbSemaines).fill('80px').join(' ')}`, padding: '10px 12px', gap: '8px', borderTop: '1px solid #222238', alignItems: 'center' }}>
              <span style={{ color: '#FFF', fontSize: '13px', fontWeight: '600' }}>{l.exercices?.nom}</span>
              {semaines.map((s, semIdx) => {
                const remp = s.remplacements[exoIdx]
                return (
                  <div key={semIdx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <button onClick={() => { setPicker({ exoIdx, semIdx }); setRecherche('') }} style={{
                      background: remp ? '#2ECC7115' : '#212135',
                      border: `1px solid ${remp ? '#2ECC71' : '#333'}`,
                      borderRadius: '6px', padding: '4px 6px', cursor: 'pointer',
                      fontSize: '10px', color: remp ? '#2ECC71' : '#555',
                      textAlign: 'center', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {remp ? remp.nom.split(' ')[0] + '…' : '🔄 Changer'}
                    </button>
                    {remp && (
                      <button onClick={() => setSemaines(prev => prev.map((x, j) => {
                        if (j !== semIdx) return x
                        const r = { ...x.remplacements }; delete r[exoIdx]; return { ...x, remplacements: r }
                      }))} style={{ background: 'none', border: 'none', color: '#9898B8', fontSize: '10px', cursor: 'pointer' }}>annuler</button>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #2C2C44', background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '14px' }}>
            Annuler
          </button>
          <button onClick={confirmer} disabled={saving} style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: saving ? '#333' : '#1A6FFF', color: '#FFF', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '14px' }}>
            {saving ? 'Création...' : `Créer ${nbSemaines} séance${nbSemaines > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>

      {/* Picker exercice */}
      {picker !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400 }}>
          <div style={{ background: '#18182A', border: '1px solid #2C2C44', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '420px', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px' }}>Remplacer pour S+{picker.semIdx + 1}</div>
                <div style={{ color: '#888', fontSize: '12px' }}>{lignes[picker.exoIdx]?.exercices?.nom}</div>
              </div>
              <button onClick={() => setPicker(null)} style={{ background: 'none', border: 'none', color: '#888', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <input value={recherche} onChange={e => setRecherche(e.target.value)} placeholder="Rechercher..." autoFocus
              style={{ background: '#212135', border: '1px solid #2C2C44', borderRadius: '8px', padding: '10px 14px', color: '#FFF', fontSize: '14px', outline: 'none', marginBottom: '10px' }} />
            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {exosFiltres.map(ex => (
                <button key={ex.id} onClick={() => {
                  setSemaines(prev => prev.map((s, j) => j !== picker.semIdx ? s : {
                    ...s, remplacements: { ...s.remplacements, [picker.exoIdx]: { id: ex.id, nom: ex.nom, familles: ex.familles } }
                  }))
                  setPicker(null)
                }} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: '#212135', border: '1px solid #2C2C44', borderRadius: '8px',
                  padding: '10px 14px', cursor: 'pointer', textAlign: 'left',
                }}>
                  <span style={{ color: '#FFF', fontSize: '13px', fontWeight: '600' }}>{ex.nom}</span>
                  {ex.familles && (
                    <span style={{ fontSize: '11px', color: ex.familles.couleur, background: ex.familles.couleur + '20', padding: '2px 8px', borderRadius: '10px' }}>
                      {ex.familles.nom}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

type MsgType = {
  id: string; expediteur_id: string; destinataire_id: string
  contenu: string | null; media_url: string | null; media_type: string | null
  lu: boolean; created_at: string
}

