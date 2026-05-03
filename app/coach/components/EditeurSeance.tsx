'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { SeanceExercice, Exercice, SetConfig, Seance, TYPES_SEANCE, LABELS_TYPE, TYPE_COLORS } from '../lib/types'
import { VideoThumb } from './shared/VideoThumb'
import { SearchableSelect } from './shared/SearchableSelect'
import { ExercicePicker } from './ExercicePicker'
import { DuplicationModal } from './DuplicationModal'
import { toast } from '../lib/toast'

export function EditeurSeance({ seance, exercices, onSave, onCancel, joueurId, dateAttribution, sauvegarderFavori }: {
  seance: Seance
  exercices: Exercice[]
  onSave: (seanceId: string) => void
  onCancel: () => void
  joueurId?: string
  dateAttribution?: string
  sauvegarderFavori?: boolean
}) {
  const [nom, setNom] = useState(seance.nom)
  const [type, setType] = useState(seance.type)
  const [notes, setNotes] = useState(seance.notes || '')
  const [lignes, setLignes] = useState<SeanceExercice[]>(
    (seance.seance_exercices || []).map(l => ({
      ...l,
      sets_config: Array.isArray(l.sets_config) ? l.sets_config
        : typeof l.sets_config === 'string' ? (() => { try { return JSON.parse(l.sets_config as unknown as string) } catch { return undefined } })()
        : undefined,
    }))
  )
  const [recherche, setRecherche] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showDup, setShowDup] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [dragBlockIdx, setDragBlockIdx] = useState<number | null>(null)
  const [dropBlockIdx, setDropBlockIdx] = useState<number | null>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])


  function ajouterExercices(exs: Exercice[]) {
    setLignes(prev => {
      const base = prev.length
      return [...prev, ...exs.map((ex, i) => ({
        exercice_id: ex.id, ordre: base + i + 1,
        series: undefined, repetitions: undefined, duree_secondes: undefined,
        distance_metres: undefined, charge_kg: undefined, recuperation_secondes: undefined,
        notes: '', sets_config: undefined, exercices: { nom: ex.nom, video_url: ex.video_url, familles: ex.familles },
      }))]
    })
    setShowPicker(false)
    setRecherche('')
  }

  function updateLigne(idx: number, key: keyof SeanceExercice, val: string) {
    setLignes(prev => prev.map((l, i) => i === idx ? { ...l, [key]: val === '' ? undefined : key === 'notes' ? val : Math.max(0, Number(val)) } : l))
  }

  function handleSeriesChange(idx: number, val: string) {
    const n = val === '' ? undefined : Math.max(1, Number(val))
    setLignes(prev => prev.map((l, i) => {
      if (i !== idx) return l
      if (!n) return { ...l, series: undefined, sets_config: undefined }
      const current = l.sets_config || []
      const s1 = current[0] || { reps: l.repetitions, duree: l.duree_secondes, dist: l.distance_metres, charge: l.charge_kg, recup: l.recuperation_secondes }
      const newSets: SetConfig[] = Array.from({ length: n }, (_, si) => current[si] || { ...s1 })
      return { ...l, series: n, sets_config: newSets }
    }))
  }

  function updateSetField(idx: number, setIdx: number, key: keyof SetConfig, val: string) {
    setLignes(prev => prev.map((l, i) => {
      if (i !== idx || !l.sets_config) return l
      const newSets = l.sets_config.map((s, si) =>
        si === setIdx ? { ...s, [key]: val === '' ? undefined : Math.max(0, Number(val)) } : s
      )
      return { ...l, sets_config: newSets }
    }))
  }

  function removeLigne(idx: number) {
    setLignes(prev => prev.filter((_, i) => i !== idx).map((l, i) => ({ ...l, ordre: i + 1 })))
  }

  function moveBlock(idx: number, dir: -1 | 1) {
    // Trouver le début et la fin du bloc contenant idx
    let blockStart = idx
    while (blockStart > 0 && lignes[blockStart - 1].lien_suivant) blockStart--
    let blockEnd = idx
    while (lignes[blockEnd].lien_suivant && blockEnd < lignes.length - 1) blockEnd++

    const next = [...lignes]
    if (dir === -1) {
      if (blockStart === 0) return
      // Trouver le bloc précédent
      let prevEnd = blockStart - 1
      let prevStart = prevEnd
      while (prevStart > 0 && next[prevStart - 1].lien_suivant) prevStart--
      const b1 = next.slice(prevStart, prevEnd + 1)
      const b2 = next.slice(blockStart, blockEnd + 1)
      next.splice(prevStart, b1.length + b2.length, ...b2, ...b1)
    } else {
      if (blockEnd === lignes.length - 1) return
      // Trouver le bloc suivant
      let nextStart = blockEnd + 1
      let nextEnd = nextStart
      while (next[nextEnd].lien_suivant && nextEnd < next.length - 1) nextEnd++
      const b1 = next.slice(blockStart, blockEnd + 1)
      const b2 = next.slice(nextStart, nextEnd + 1)
      next.splice(blockStart, b1.length + b2.length, ...b2, ...b1)
    }
    setLignes(next.map((l, i) => ({ ...l, ordre: i + 1 })))
  }

  function handleBlockDrop(targetBlockIdx: number, blocks: SeanceExercice[][]) {
    if (dragBlockIdx === null || dragBlockIdx === targetBlockIdx) {
      setDragBlockIdx(null); setDropBlockIdx(null); return
    }
    const nb = [...blocks]
    const [moved] = nb.splice(dragBlockIdx, 1)
    nb.splice(targetBlockIdx, 0, moved)
    setLignes(nb.flat().map((l, i) => ({ ...l, ordre: i + 1 })))
    setDragBlockIdx(null); setDropBlockIdx(null)
  }

  async function handleSave() {
    if (!nom) { toast('Nom obligatoire', 'info'); return }
    console.log('handleSave — lignes:', lignes.length, lignes.map(l => l.exercice_id))
    setSaving(true)
    let seanceId = seance.id

    if (!seanceId) {
      const estTemplate = joueurId ? (sauvegarderFavori ?? false) : true
      const { data, error } = await supabase.from('seances').insert({ nom, type, notes: notes || null, est_template: estTemplate, programme_id: null }).select().single()
      if (error || !data?.id) {
        toast('Erreur création séance : ' + (error?.message || 'données manquantes'), 'error')
        setSaving(false)
        return
      }
      seanceId = data.id
    } else {
      const { error } = await supabase.from('seances').update({ nom, type, notes: notes || null }).eq('id', seanceId)
      if (error) { toast('Erreur modification séance : ' + error.message, 'error'); setSaving(false); return }
      await supabase.from('seance_exercices').delete().eq('seance_id', seanceId)
    }

    if (lignes.length > 0) {
      const { error: exoError } = await supabase.from('seance_exercices').insert(
        lignes.map((l, i) => ({
          seance_id: seanceId,
          exercice_id: l.exercice_id,
          ordre: i + 1,
          series: l.series || null,
          repetitions: l.sets_config ? null : (l.repetitions || null),
          duree_secondes: l.sets_config ? null : (l.duree_secondes || null),
          distance_metres: l.sets_config ? null : (l.distance_metres || null),
          charge_kg: l.sets_config ? null : (l.charge_kg || null),
          recuperation_secondes: l.sets_config ? null : (l.recuperation_secondes || null),
          recuperation_active: l.recuperation_active || false,
          recuperation_inter_sets: l.recuperation_inter_sets || null,
          lien_suivant: l.lien_suivant || false,
          uni_podal: l.uni_podal || false,
          notes: l.notes || null,
          sets_config: l.sets_config || null,
        }))
      )
      if (exoError) {
        toast('Séance créée mais erreur exercices : ' + exoError.message, 'error')
        setSaving(false)
        if (seanceId) onSave(seanceId)
        return
      }
    }
    setSaving(false)
    if (seanceId) onSave(seanceId)
  }

  const paramInput = (idx: number, key: keyof SeanceExercice, placeholder: string, width = '70px') => (
    <input
      type="number" placeholder={placeholder}
      value={(lignes[idx][key] as number) ?? ''}
      onChange={e => updateLigne(idx, key, e.target.value)}
      style={{
        width, background: '#212135', border: '1px solid #2C2C44', borderRadius: '6px',
        padding: '6px 8px', color: '#FFF', fontSize: '13px', outline: 'none', textAlign: 'center',
      }}
    />
  )

  return (
    <div className="page-section">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: seance.id && isMobile ? '8px' : '24px' }}>
        <button onClick={onCancel} className="btn btn-ghost btn-sm">← Retour</button>
        <h1 className="page-title" style={{ flex: 1, minWidth: 0, fontSize: isMobile ? '16px' : '20px' }}>
          {seance.id ? 'Éditer la séance' : 'Nouvelle séance'}
        </h1>
        {seance.id && !isMobile && (
          <button onClick={() => setShowDup(true)} className="btn btn-gold">⚡ Dupliquer avec progression</button>
        )}
        <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-sm"
          style={saving ? { opacity: 0.6, cursor: 'not-allowed' } : {}}>
          {saving ? '...' : 'Enregistrer'}
        </button>
      </div>
      {seance.id && isMobile && (
        <button onClick={() => setShowDup(true)} className="btn btn-gold" style={{ width: '100%', marginBottom: '16px' }}>⚡ Dupliquer avec progression</button>
      )}

      {/* Infos séance */}
      <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Nom de la séance *"
        className="input" style={{ width: '100%', fontSize: '18px', fontWeight: '700', marginBottom: '10px', padding: '14px 16px', letterSpacing: '-0.3px' }} />
      <select value={type} onChange={e => setType(e.target.value)} className="select" style={{ marginBottom: '12px' }}>
        {TYPES_SEANCE.map(t => <option key={t} value={t}>{LABELS_TYPE[t]}</option>)}
      </select>

      <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes générales de la séance..."
        rows={2} className="textarea" style={{ marginBottom: '24px' }} />

      {/* Exercices */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <h2 style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '-0.2px' }}>Exercices</h2>
          {lignes.length > 0 && <p style={{ color: '#7878A8', fontSize: '11px', marginTop: '2px' }}>Définissez le nombre de séries pour configurer chaque série individuellement</p>}
        </div>
        <button onClick={() => setShowPicker(true)} className="btn btn-ghost btn-sm" style={{ borderColor: '#1A6FFF30', color: '#5599FF' }}>+ Ajouter</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
        {(() => {
          const blocks: SeanceExercice[][] = []
          let bi = 0
          while (bi < lignes.length) {
            const block: SeanceExercice[] = []
            while (true) { block.push(lignes[bi]); if (!lignes[bi].lien_suivant || bi >= lignes.length - 1) break; bi++ }
            blocks.push(block); bi++
          }
          return blocks.map((block, blockIdx) => {
            const startIdx = blocks.slice(0, blockIdx).reduce((s, b) => s + b.length, 0)
            const isDragging = dragBlockIdx === blockIdx
            const isDropTarget = dropBlockIdx === blockIdx && dragBlockIdx !== null && !isDragging
            return (
              <div
                key={startIdx}
                style={{ position: 'relative', marginBottom: isDragging ? '0' : undefined }}
              >
                {/* Ligne d'insertion bleue au-dessus de la cible */}
                {isDropTarget && (
                  <div style={{ position: 'absolute', top: -4, left: 8, right: 8, height: 3, background: '#1A6FFF', borderRadius: 2, zIndex: 20, boxShadow: '0 0 8px #1A6FFF80' }} />
                )}
                <div
                  draggable={true}
                  onDragStart={e => { const t = (e.target as HTMLElement).tagName; if (['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'].includes(t)) { e.preventDefault(); return }; e.dataTransfer.effectAllowed = 'move'; setDragBlockIdx(blockIdx) }}
                  onDragOver={e => { e.preventDefault(); if (dropBlockIdx !== blockIdx) setDropBlockIdx(blockIdx) }}
                  onDrop={e => { e.preventDefault(); handleBlockDrop(blockIdx, blocks) }}
                  onDragEnd={() => { setDragBlockIdx(null); setDropBlockIdx(null) }}
                  style={{
                    opacity: isDragging ? 0.25 : 1,
                    transform: isDragging ? 'scale(0.98)' : 'scale(1)',
                    boxShadow: isDragging ? '0 12px 32px rgba(0,0,0,0.6)' : 'none',
                    borderRadius: '12px',
                    transition: 'opacity 0.15s, transform 0.15s, box-shadow 0.15s',
                    cursor: isDragging ? 'grabbing' : 'grab',
                  }}
                >
              {block.map((l, li) => {
                const idx = startIdx + li
                const fam = l.exercices?.familles
                const prevLie = idx > 0 && lignes[idx - 1].lien_suivant
                const nextLie = l.lien_suivant && idx < lignes.length - 1
                const dansSuperset = prevLie || nextLie
                const debutGroupe = dansSuperset && !prevLie
                const finGroupe = dansSuperset && !nextLie

                const groupSize = (() => {
                  let start = idx
                  while (start > 0 && lignes[start - 1].lien_suivant) start--
                  let count = 1, i = start
                  while (lignes[i].lien_suivant && i < lignes.length - 1) { i++; count++ }
                  return count
                })()
                const labelGroupe = groupSize >= 3 ? 'CIRCUIT' : 'SUPERSET'

                const syncSeries = (val: string) => {
                  setLignes(prev => {
                    const newLignes = [...prev]
                    let start = idx
                    while (start > 0 && newLignes[start - 1].lien_suivant) start--
                    let i = start
                    while (true) {
                      newLignes[i] = { ...newLignes[i], series: val === '' ? undefined : Number(val) }
                      if (!newLignes[i].lien_suivant || i >= newLignes.length - 1) break
                      i++
                    }
                    return newLignes
                  })
                }

                const delierId = () => setLignes(prev => {
                  const newLignes = [...prev]
                  let i = idx
                  while (i >= 0 && (i === idx || newLignes[i].lien_suivant)) {
                    newLignes[i] = { ...newLignes[i], lien_suivant: false }
                    if (i < idx) break
                    i--
                  }
                  return newLignes
                })

                if (dansSuperset) {
                  return (
                    <div key={idx} style={{ marginTop: debutGroupe && idx > 0 ? '8px' : '0' }}>
                      {debutGroupe && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#1A6FFF18', borderTop: '1px solid #1A6FFF50', borderBottom: '1px solid #1A6FFF25', borderLeft: '1px solid #1A6FFF50', borderRight: '1px solid #1A6FFF50', borderRadius: '10px 10px 0 0', padding: '8px 14px' }}>
                          <span style={{ fontSize: '13px' }}>🔗</span>
                          <span style={{ color: '#1A6FFF', fontWeight: '700', fontSize: '12px', letterSpacing: '1px' }}>{labelGroupe}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                            <span style={{ color: '#888', fontSize: '12px' }}>Séries :</span>
                            <input type="number" placeholder="-" value={l.series ?? ''} onChange={e => syncSeries(e.target.value)}
                              style={{ width: '55px', background: '#212135', border: '1px solid #1A6FFF40', borderRadius: '6px', padding: '5px 8px', color: '#FFF', fontSize: '13px', outline: 'none', textAlign: 'center' }} />
                          </div>
                        </div>
                      )}
                      <div style={{ background: '#1A6FFF06', borderTop: debutGroupe ? 'none' : '1px solid #1A6FFF25', borderLeft: '1px solid #1A6FFF50', borderRight: '1px solid #1A6FFF50', padding: '10px 10px 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}>
                            <button onClick={() => moveBlock(idx, -1)} style={{ background: 'none', border: 'none', color: '#9898B8', cursor: 'pointer', fontSize: '10px', lineHeight: 1 }}>▲</button>
                            <button onClick={() => moveBlock(idx, 1)} style={{ background: 'none', border: 'none', color: '#9898B8', cursor: 'pointer', fontSize: '10px', lineHeight: 1 }}>▼</button>
                          </div>
                          <VideoThumb url={l.exercices?.video_url} size={60} famille={fam} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: '600', fontSize: '13px' }}>{l.exercices?.nom}</div>
                            <div style={{ display: 'flex', gap: '5px', marginTop: '3px', flexWrap: 'wrap' }}>
                              {fam && <span style={{ fontSize: '10px', color: fam.couleur }}>{fam.nom}</span>}
                              <button onClick={() => setLignes(prev => prev.map((li, i) => i === idx ? { ...li, uni_podal: !li.uni_podal } : li))}
                                style={{ background: l.uni_podal ? '#1A6FFF20' : 'transparent', border: `1px solid ${l.uni_podal ? '#1A6FFF60' : '#2C2C44'}`, color: l.uni_podal ? '#1A6FFF' : '#444', fontSize: '11px', padding: '1px 6px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700' }}>↔ 2 côtés</button>
                            </div>
                          </div>
                          <input value={l.notes || ''} onChange={e => updateLigne(idx, 'notes', e.target.value)} placeholder="note..."
                            style={{ width: '80px', flexShrink: 0, background: '#212135', border: '1px solid #2C2C44', borderRadius: '6px', padding: '5px 7px', color: '#FFF', fontSize: '11px', outline: 'none' }} />
                          <button onClick={() => removeLigne(idx)} style={{ flexShrink: 0, background: 'transparent', border: '1px solid #FF475730', color: '#FF4757', borderRadius: '6px', padding: '5px 7px', cursor: 'pointer', fontSize: '12px' }}>✕</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                          {['Reps', 'Durée(s)', 'Dist(m)', 'Charge(kg)'].map(h => (
                            <div key={h} style={{ color: '#7878A8', fontSize: '10px', textTransform: 'uppercase' as const, textAlign: 'center' as const }}>{h}</div>
                          ))}
                          {paramInput(idx, 'repetitions', '-', '100%')}
                          {paramInput(idx, 'duree_secondes', '-', '100%')}
                          {paramInput(idx, 'distance_metres', '-', '100%')}
                          {paramInput(idx, 'charge_kg', '-', '100%')}
                        </div>
                      </div>
                      {nextLie && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1A6FFF04', borderTop: 'none', borderBottom: 'none', borderLeft: '1px solid #1A6FFF50', borderRight: '1px solid #1A6FFF50', padding: '5px 14px' }}>
                          <span style={{ color: '#7878A8', fontSize: '11px' }}>↓ Récup avant exo suivant :</span>
                          <input type="number" placeholder="0" value={l.recuperation_secondes ?? ''} onChange={e => updateLigne(idx, 'recuperation_secondes', e.target.value)}
                            style={{ width: '50px', background: '#212135', border: '1px solid #333', borderRadius: '6px', padding: '4px 6px', color: '#FFF', fontSize: '12px', outline: 'none', textAlign: 'center' }} />
                          <span style={{ color: '#7878A8', fontSize: '11px' }}>s</span>
                        </div>
                      )}
                      {finGroupe && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', background: '#1A6FFF10', borderBottom: '1px solid #1A6FFF50', borderLeft: '1px solid #1A6FFF50', borderRight: '1px solid #1A6FFF50', borderRadius: '0 0 10px 10px', padding: '8px 14px' }}>
                          <span style={{ color: '#2ECC71AA', fontSize: '12px', whiteSpace: 'nowrap' }}>⟳ Entre sets :</span>
                          <input type="number" placeholder="0" value={l.recuperation_inter_sets ?? ''} onChange={e => setLignes(prev => prev.map((li, i) => i === idx ? { ...li, recuperation_inter_sets: e.target.value === '' ? undefined : Number(e.target.value) } : li))}
                            style={{ width: '52px', background: '#212135', border: '1px solid #2ECC7140', borderRadius: '6px', padding: '5px 8px', color: '#2ECC71', fontSize: '13px', outline: 'none', textAlign: 'center' }} />
                          <span style={{ color: '#888', fontSize: '12px' }}>s</span>
                          <span style={{ color: '#888', fontSize: '12px' }}>↦ Après superset :</span>
                          <input type="number" placeholder="0" value={l.recuperation_secondes ?? ''} onChange={e => updateLigne(idx, 'recuperation_secondes', e.target.value)}
                            style={{ width: '52px', background: '#212135', border: '1px solid #1A6FFF40', borderRadius: '6px', padding: '5px 8px', color: '#1A6FFF', fontSize: '13px', outline: 'none', textAlign: 'center' }} />
                          <span style={{ color: '#888', fontSize: '12px' }}>s</span>
                          <button onClick={delierId} style={{ marginLeft: 'auto', padding: '4px 10px', borderRadius: '6px', border: '1px solid #FF475730', background: 'transparent', color: '#FF4757', fontSize: '11px', cursor: 'pointer' }}>Délier</button>
                        </div>
                      )}
                    </div>
                  )
                }

                const hasPerSet = Array.isArray(l.sets_config) && l.sets_config.length > 0
                return (
                  <div key={idx} style={{ marginTop: idx > 0 ? '8px' : '0' }}>
                    <div style={{ background: '#18182A', border: '1px solid #2C2C44', borderRadius: hasPerSet ? '10px 10px 0 0' : '10px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '8px', padding: '10px 8px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}>
                            <button onClick={() => moveBlock(idx, -1)} style={{ background: 'none', border: 'none', color: '#9898B8', cursor: 'pointer', fontSize: '10px', lineHeight: 1 }}>▲</button>
                            <button onClick={() => moveBlock(idx, 1)} style={{ background: 'none', border: 'none', color: '#9898B8', cursor: 'pointer', fontSize: '10px', lineHeight: 1 }}>▼</button>
                          </div>
                          <VideoThumb url={l.exercices?.video_url} size={isMobile ? 48 : 80} famille={fam} />
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontWeight: '600', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.exercices?.nom}</div>
                            <div style={{ display: 'flex', gap: '5px', marginTop: '3px', flexWrap: 'wrap' }}>
                              {fam && <span style={{ fontSize: '10px', color: fam.couleur }}>{fam.nom}</span>}
                              <button onClick={() => setLignes(prev => prev.map((li, i) => i === idx ? { ...li, uni_podal: !li.uni_podal } : li))}
                                style={{ background: l.uni_podal ? '#1A6FFF20' : 'transparent', border: `1px solid ${l.uni_podal ? '#1A6FFF60' : '#2C2C44'}`, color: l.uni_podal ? '#1A6FFF' : '#444', fontSize: '11px', padding: '1px 6px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700' }}>↔ 2 côtés</button>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {!isMobile && <span style={{ color: '#9898B8', fontSize: '11px', whiteSpace: 'nowrap' }}>Séries</span>}
                          <input type="number" placeholder={isMobile ? 'S' : '-'} value={l.series ?? ''} onChange={e => handleSeriesChange(idx, e.target.value)}
                            style={{ width: isMobile ? '44px' : '55px', background: '#212135', border: '1px solid #2C2C44', borderRadius: '6px', padding: '6px 6px', color: '#FFF', fontSize: '13px', outline: 'none', textAlign: 'center' }} />
                        </div>
                        <input value={l.notes || ''} onChange={e => updateLigne(idx, 'notes', e.target.value)} placeholder="note..."
                          style={{ width: isMobile ? '72px' : '110px', background: '#212135', border: '1px solid #2C2C44', borderRadius: '6px', padding: '6px 8px', color: '#FFF', fontSize: '12px', outline: 'none' }} />
                        <button onClick={() => removeLigne(idx)} style={{ background: 'transparent', border: '1px solid #FF475730', color: '#FF4757', borderRadius: '6px', padding: '6px', cursor: 'pointer', fontSize: '12px' }}>✕</button>
                      </div>
                      {hasPerSet && (
                        <div style={{ borderTop: '1px solid #2A2A2A' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'auto repeat(5, minmax(0, 1fr))', gap: '6px', padding: '5px 12px', background: '#0B0B14' }}>
                            {['Sér.', 'Reps', 'Durée(s)', 'Dist(m)', 'Charge(kg)', 'Récup(s)'].map(h => (
                              <div key={h} style={{ color: '#7878A8', fontSize: '10px', letterSpacing: '0.3px', textTransform: 'uppercase', textAlign: 'center' }}>{h}</div>
                            ))}
                          </div>
                          {l.sets_config!.map((s, si) => (
                            <div key={si} style={{ display: 'grid', gridTemplateColumns: 'auto repeat(5, minmax(0, 1fr))', gap: '6px', padding: '6px 12px', borderTop: '1px solid #222238', alignItems: 'center', background: si % 2 === 0 ? '#0E0E18' : '#18182A' }}>
                              <div style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', textAlign: 'center' }}>S{si + 1}</div>
                              {(['reps', 'duree', 'dist', 'charge', 'recup'] as (keyof SetConfig)[]).map(key => (
                                <input key={key} type="number" placeholder="-" value={s[key] ?? ''} onChange={e => updateSetField(idx, si, key, e.target.value)}
                                  style={{ width: '100%', background: '#212135', border: '1px solid #2C2C44', borderRadius: '5px', padding: '5px 6px', color: '#FFF', fontSize: '12px', outline: 'none', textAlign: 'center' }} />
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                      {!hasPerSet && (
                        <div style={{ borderTop: '1px solid #1E1E30' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '6px', padding: '5px 12px', background: '#0B0B14' }}>
                            {['Reps', 'Durée(s)', 'Dist(m)', 'Charge(kg)', 'Récup(s)'].map(h => (
                              <div key={h} style={{ color: '#7878A8', fontSize: '10px', textTransform: 'uppercase', textAlign: 'center' }}>{h}</div>
                            ))}
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '6px', padding: '8px 12px' }}>
                            {paramInput(idx, 'repetitions', '-', '100%')}
                            {paramInput(idx, 'duree_secondes', '-', '100%')}
                            {paramInput(idx, 'distance_metres', '-', '100%')}
                            {paramInput(idx, 'charge_kg', '-', '100%')}
                            {paramInput(idx, 'recuperation_secondes', '-', '100%')}
                          </div>
                        </div>
                      )}
                    </div>
                    {idx < lignes.length - 1 && (
                      <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
                        <button onClick={() => setLignes(prev => prev.map((li, i) => i === idx ? { ...li, lien_suivant: true } : li))}
                          style={{ background: '#212135', border: '1px solid #2C2C44', borderRadius: '20px', padding: '3px 14px', cursor: 'pointer', fontSize: '12px', color: '#9898B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          🔗 <span>Lier en superset</span>
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
                </div>
              </div>
            )
          })
        })()}
      </div>

      {lignes.length === 0 && (
        <div style={{ background: '#18182A', border: '1px solid #2C2C44', borderRadius: '12px', padding: '32px', textAlign: 'center', color: '#9898B8', fontSize: '14px' }}>
          Aucun exercice. Clique sur "+ Ajouter un exercice".
        </div>
      )}

      {/* Picker exercice */}
      {showPicker && (
        <ExercicePicker
          exercices={exercices}
          onConfirm={ajouterExercices}
          onClose={() => { setShowPicker(false); setRecherche('') }}
        />
      )}

      {/* Modal duplication avec progression */}
      {showDup && (
        <DuplicationModal seance={{ ...seance, nom, seance_exercices: lignes }} onClose={() => setShowDup(false)} onDuplique={() => onSave('')} />
      )}
    </div>
  )
}
