'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Programme, SeanceProg, Seance, Joueur, Exercice, JOURS, JOURS_FULL, TYPES_SEANCE, LABELS_TYPE, TYPE_COLORS } from '../lib/types'
import { SearchableSelect } from './shared/SearchableSelect'
import { toast } from '../lib/toast'
import { EditeurSeance } from './EditeurSeance'

export function Modeles() {
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [selectedProg, setSelectedProg] = useState<Programme | null>(null)
  const [seancesProg, setSeancesProg] = useState<SeanceProg[]>([])
  const [templates, setTemplates] = useState<Seance[]>([])
  const [exercices, setExercices] = useState<Exercice[]>([])
  const [nbSemaines, setNbSemaines] = useState(4)
  const [showNewProg, setShowNewProg] = useState(false)
  const [newProgNom, setNewProgNom] = useState('')
  const [newProgObj, setNewProgObj] = useState('')
  const [showPicker, setShowPicker] = useState<{ semaine: number; jour: number } | null>(null)
  const [showAssign, setShowAssign] = useState(false)
  const [editingSeanceProg, setEditingSeanceProg] = useState<SeanceProg | null>(null)
  const [creatingSlot, setCreatingSlot] = useState<{ semaine: number; jour: number } | null>(null)
  const [rechercheTemplate, setRechercheTemplate] = useState('')

  useEffect(() => { loadProgrammes() }, [])

  useEffect(() => {
    if (selectedProg) loadSeancesProg(selectedProg.id)
  }, [selectedProg])

  async function loadProgrammes() {
    const { data } = await supabase.from('programmes').select('*').order('nom')
    if (data) {
      const sorted = [...data].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
      setProgrammes(sorted)
      if (sorted.length > 0 && !selectedProg) setSelectedProg(sorted[0])
    }
    const [{ data: tpls }, { data: exs }] = await Promise.all([
      supabase.from('seances').select('*, seance_exercices(id)').eq('est_template', true).order('nom').limit(2000),
      supabase.from('exercices').select('*, familles(id, nom, couleur)').order('nom').limit(5000),
    ])
    if (tpls) setTemplates([...tpls].sort((a, b) => a.nom.localeCompare(b.nom, 'fr')))
    if (exs) setExercices([...exs].sort((a, b) => a.nom.localeCompare(b.nom, 'fr')))
  }

  async function loadSeancesProg(progId: string) {
    const { data } = await supabase
      .from('seances')
      .select('id, nom, type, jour_semaine, semaine, seance_exercices(id)')
      .eq('programme_id', progId)
      .order('semaine').order('jour_semaine')
    if (data) {
      setSeancesProg(data as SeanceProg[])
      // compute nb semaines
      const max = data.reduce((m, s) => Math.max(m, s.semaine || 1), 1)
      setNbSemaines(Math.max(max, 4))
    }
  }

  async function creerProgramme() {
    if (!newProgNom.trim()) return
    const { data, error } = await supabase.from('programmes')
      .insert({ nom: newProgNom.trim(), objectif: newProgObj.trim() || null })
      .select().single()
    setShowNewProg(false)
    setNewProgNom('')
    setNewProgObj('')
    if (error) {
      toast(`Erreur création modèle : ${error.message}`, 'error')
      return
    }
    if (data) {
      await loadProgrammes()
      setSelectedProg(data)
    }
  }

  async function supprimerProgramme(id: string) {
    if (!confirm('Supprimer ce modèle et toutes ses séances ?')) return
    try {
      const { error: e1 } = await supabase.from('seances').delete().eq('programme_id', id)
      if (e1) throw e1
      const { error: e2 } = await supabase.from('programmes').delete().eq('id', id)
      if (e2) throw e2
      setSelectedProg(null)
      loadProgrammes()
    } catch (e: unknown) {
      toast('Erreur suppression : ' + (e instanceof Error ? e.message : String(e)), 'error')
    }
  }

  async function ajouterSessionSlot(semaine: number, jour: number, template: Seance) {
    if (!selectedProg) return
    // Créer une nouvelle séance liée au programme
    const { data: newSeance } = await supabase.from('seances')
      .insert({ nom: template.nom, type: template.type, programme_id: selectedProg.id, jour_semaine: jour, semaine, est_template: false })
      .select().single()
    if (!newSeance) return

    // Copier les exercices du template
    if (template.seance_exercices && template.seance_exercices.length > 0) {
      const { data: exos } = await supabase
        .from('seance_exercices')
        .select('*')
        .eq('seance_id', template.id)
        .order('ordre')
      if (exos && exos.length > 0) {
        await supabase.from('seance_exercices').insert(
          exos.map(e => ({
            seance_id: newSeance.id, exercice_id: e.exercice_id, ordre: e.ordre,
            series: e.series, repetitions: e.repetitions, duree_secondes: e.duree_secondes,
            distance_metres: e.distance_metres, charge_kg: e.charge_kg,
            recuperation_secondes: e.recuperation_secondes, lien_suivant: e.lien_suivant,
            uni_podal: e.uni_podal, notes: e.notes, sets_config: e.sets_config,
          }))
        )
      }
    }
    setShowPicker(null)
    loadSeancesProg(selectedProg.id)
  }

  async function supprimerSessionSlot(seanceId: string) {
    try {
      const { error } = await supabase.from('seances').delete().eq('id', seanceId)
      if (error) throw error
      if (selectedProg) loadSeancesProg(selectedProg.id)
    } catch (e: unknown) {
      toast('Erreur suppression séance : ' + (e instanceof Error ? e.message : String(e)), 'error')
    }
  }

  const templatesFiltres = templates.filter(t =>
    t.nom.toLowerCase().includes(rechercheTemplate.toLowerCase())
  )

  // Organiser sessions par [semaine][jour]
  const grid: Record<number, Record<number, SeanceProg[]>> = {}
  for (let s = 1; s <= nbSemaines; s++) {
    grid[s] = {}
    for (let j = 1; j <= 7; j++) grid[s][j] = []
  }
  for (const s of seancesProg) {
    if (s.semaine && s.jour_semaine) {
      if (!grid[s.semaine]) grid[s.semaine] = {}
      if (!grid[s.semaine][s.jour_semaine]) grid[s.semaine][s.jour_semaine] = []
      grid[s.semaine][s.jour_semaine].push(s)
    }
  }

  if (creatingSlot && selectedProg) {
    const nouvelleSeance: Seance = { id: '', nom: '', type: 'complete', est_template: false, seance_exercices: [] }
    return <EditeurSeance
      seance={nouvelleSeance}
      exercices={exercices}
      onSave={async (seanceId) => {
        await supabase.from('seances').update({
          programme_id: selectedProg.id,
          jour_semaine: creatingSlot.jour,
          semaine: creatingSlot.semaine,
          est_template: false,
        }).eq('id', seanceId)
        setCreatingSlot(null)
        loadSeancesProg(selectedProg.id)
      }}
      onCancel={() => setCreatingSlot(null)}
    />
  }

  if (editingSeanceProg) {
    const seanceFull: Seance = {
      id: editingSeanceProg.id, nom: editingSeanceProg.nom,
      type: editingSeanceProg.type, est_template: false, seance_exercices: [],
    }
    return <EditeurSeance
      seance={seanceFull}
      exercices={exercices}
      onSave={async () => {
        setEditingSeanceProg(null)
        if (selectedProg) loadSeancesProg(selectedProg.id)
      }}
      onCancel={() => setEditingSeanceProg(null)}
    />
  }

  return (
    <div className="page-section">

      {/* ─── Barre du haut : sélecteur + nouveau ─── */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '160px' }}>
          {programmes.length === 0 ? (
            <div style={{ color: '#444', fontSize: '13px' }}>Aucun modèle — crée-en un !</div>
          ) : (
            <SearchableSelect
              value={selectedProg?.id || ''}
              items={programmes}
              onChange={p => { const found = programmes.find(x => x.id === p.id); if (found) setSelectedProg(found) }}
              placeholder="Choisir un modèle..."
              triggerStyle={{ width: '100%', fontWeight: '700' }}
            />
          )}
        </div>
        <button onClick={() => setShowNewProg(true)} className="btn btn-primary btn-sm">+ Nouveau</button>
        {selectedProg && (
          <>
            <button onClick={() => setNbSemaines(n => Math.max(1, n - 1))} className="btn btn-ghost btn-sm">−</button>
            <span style={{ color: '#888', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }}>{nbSemaines} sem.</span>
            <button onClick={() => setNbSemaines(n => n + 1)} className="btn btn-ghost btn-sm">+</button>
            <button onClick={() => setShowAssign(true)} className="btn btn-success btn-sm">Attribuer →</button>
            <button onClick={() => supprimerProgramme(selectedProg.id)} className="btn btn-danger btn-sm">✕</button>
          </>
        )}
      </div>

      {/* ─── Grille plein écran ─── */}
      {!selectedProg ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">🗓️</div>
            <div className="empty-state-text">Sélectionne ou crée un modèle</div>
          </div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: 'calc(100svh - 200px)', borderRadius: '12px', border: '1px solid #22223A', background: '#0E0E18' }}>
          <table className="data-table" style={{ minWidth: '640px', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '44px', textAlign: 'left' }}>SEM.</th>
                {JOURS_FULL.map(j => (
                  <th key={j} style={{ textAlign: 'center', minWidth: '90px' }}>{j}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: nbSemaines }, (_, si) => {
                const sem = si + 1
                return (
                  <tr key={sem}>
                    <td style={{ verticalAlign: 'top', background: '#0B0B14', padding: '8px 6px' }}>
                      <div style={{ fontSize: '11px', fontWeight: '900', color: '#3A3A50' }}>S{sem}</div>
                    </td>
                    {Array.from({ length: 7 }, (_, ji) => {
                      const jour = ji + 1
                      const sessions = grid[sem]?.[jour] || []
                      return (
                        <td key={jour} className="cal-cell" style={{ verticalAlign: 'top' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {sessions.map(s => {
                              const tc = TYPE_COLORS[s.type] || TYPE_COLORS.complete
                              return (
                                <div key={s.id} className="cal-session-card"
                                  style={{ background: tc.bg, border: `1px solid ${tc.border}`, display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                                  <div style={{ flex: 1, color: tc.text, fontWeight: '700', lineHeight: 1.3, cursor: 'pointer', fontSize: '11px' }}
                                    onClick={() => setEditingSeanceProg(s)}>
                                    {s.nom}
                                    {s.seance_exercices && s.seance_exercices.length > 0 && (
                                      <div style={{ color: '#555', fontSize: '10px', fontWeight: '400', marginTop: '2px' }}>
                                        {s.seance_exercices.length} exo{s.seance_exercices.length > 1 ? 's' : ''}
                                      </div>
                                    )}
                                  </div>
                                  <button onClick={() => supprimerSessionSlot(s.id)} style={{
                                    background: 'transparent', border: 'none', color: '#2A2A3A',
                                    cursor: 'pointer', fontSize: '11px', padding: '0 1px', lineHeight: 1, flexShrink: 0, transition: 'color 0.15s',
                                  }}
                                  onMouseEnter={e => (e.currentTarget.style.color = '#FF4757')}
                                  onMouseLeave={e => (e.currentTarget.style.color = '#2A2A3A')}
                                  >✕</button>
                                </div>
                              )
                            })}
                            <button className="cal-add-btn" onClick={() => { setShowPicker({ semaine: sem, jour }); setRechercheTemplate('') }}>+</button>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── Modal nouveau programme ─── */}
      {showNewProg && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '420px' }}>
            <div className="modal-title">Nouveau modèle</div>
            <div className="modal-subtitle">Crée un plan type (semaine, mois) à attribuer à tes joueurs</div>
            <input value={newProgNom} onChange={e => setNewProgNom(e.target.value)}
              className="input" placeholder="Nom du modèle (ex: Accompagnement CYCLE 1) *"
              style={{ marginBottom: '10px' }} />
            <input value={newProgObj} onChange={e => setNewProgObj(e.target.value)}
              className="input" placeholder="Objectif (optionnel)"
              style={{ marginBottom: '24px' }} />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowNewProg(false)} className="btn btn-ghost">Annuler</button>
              <button onClick={creerProgramme} className="btn btn-primary">Créer le modèle</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal picker séance template ─── */}
      {showPicker && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '480px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <div className="modal-title" style={{ marginBottom: '2px' }}>Ajouter une séance</div>
                <div style={{ color: '#5599FF', fontSize: '12px', fontWeight: '600' }}>
                  {JOURS_FULL[showPicker.jour - 1]} · Semaine {showPicker.semaine}
                </div>
              </div>
              <button onClick={() => setShowPicker(null)} className="btn btn-ghost btn-sm" style={{ fontSize: '16px', padding: '6px 10px' }}>✕</button>
            </div>
            <button
              onClick={() => { setCreatingSlot(showPicker); setShowPicker(null) }}
              className="btn btn-primary"
              style={{ marginBottom: '12px', width: '100%', justifyContent: 'center' }}
            >
              + Créer une nouvelle séance
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: '#22223A' }} />
              <span style={{ color: '#444', fontSize: '11px', whiteSpace: 'nowrap' }}>ou importer un favori</span>
              <div style={{ flex: 1, height: '1px', background: '#22223A' }} />
            </div>
            <input value={rechercheTemplate} onChange={e => setRechercheTemplate(e.target.value)}
              className="input" placeholder="Rechercher une séance..."
              style={{ marginBottom: '12px' }} />
            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {templatesFiltres.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">📋</div>
                  <div className="empty-state-text">Aucune séance template trouvée.</div>
                </div>
              )}
              {templatesFiltres.map(t => {
                const tc = TYPE_COLORS[t.type] || TYPE_COLORS.complete
                return (
                  <button key={t.id} onClick={() => ajouterSessionSlot(showPicker.semaine, showPicker.jour, t)}
                    className="list-item" style={{ textAlign: 'left', border: '1px solid #22223A' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: tc.text, flexShrink: 0, boxShadow: `0 0 6px ${tc.text}60` }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#F0F0F8', fontSize: '13px', fontWeight: '700' }}>{t.nom}</div>
                      <div style={{ color: '#555', fontSize: '11px', marginTop: '2px' }}>
                        {LABELS_TYPE[t.type]} · {t.seance_exercices?.length || 0} exercice{(t.seance_exercices?.length || 0) > 1 ? 's' : ''}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal attribution ─── */}
      {showAssign && selectedProg && (
        <AssignProgrammeModal
          programme={selectedProg}
          seances={seancesProg}
          onClose={() => setShowAssign(false)}
        />
      )}
    </div>
  )
}

export function AssignProgrammeModal({ programme, seances, onClose }: {
  programme: Programme
  seances: SeanceProg[]
  onClose: () => void
}) {
  const [joueurs, setJoueurs] = useState<{ id: string; nom: string; prenom: string }[]>([])
  const [selectedJoueurs, setSelectedJoueurs] = useState<Set<string>>(new Set())
  const [dateDebut, setDateDebut] = useState(() => new Date().toISOString().split('T')[0])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('joueurs').select('id, nom, prenom').eq('actif', true).order('nom').then(({ data }) => {
      if (data) setJoueurs(data)
    })
  }, [])

  function toggleJoueur(id: string) {
    setSelectedJoueurs(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  async function confirmer() {
    if (selectedJoueurs.size === 0) return
    setSaving(true)
    const debut = new Date(dateDebut + 'T12:00:00')

    for (const joueurId of selectedJoueurs) {
      // Créer l'entrée joueur_programme
      await supabase.from('joueur_programmes').insert({
        joueur_id: joueurId, programme_id: programme.id,
        date_debut: dateDebut, actif: true,
      })

      // Créer les réalisations pour chaque séance
      if (seances.length > 0) {
        const rows = seances.map(s => {
          const d = new Date(debut)
          d.setDate(d.getDate() + (s.semaine - 1) * 7 + (s.jour_semaine - 1))
          return {
            joueur_id: joueurId, seance_id: s.id,
            date_realisation: d.toISOString().split('T')[0], completee: false,
          }
        })
        await supabase.from('realisations').insert(rows)
      }
    }

    setSaving(false)
    onClose()
    toast(`✓ Modèle "${programme.nom}" attribué à ${selectedJoueurs.size} joueur${selectedJoueurs.size > 1 ? 's' : ''}`, 'success')
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 400 }}>
      <div className="modal-box" style={{ maxWidth: '500px' }}>
        <div className="modal-title">Attribuer le modèle</div>
        <div className="modal-subtitle">{programme.nom} · {seances.length} séance{seances.length > 1 ? 's' : ''}</div>

        {/* Date de début */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#9494A0', fontWeight: '600', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Date de début</label>
          <input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)} className="input" style={{ width: 'auto' }} />
          <div style={{ color: '#444', fontSize: '12px', marginTop: '8px' }}>
            Les séances seront placées selon leur position (semaine × jour) dans le modèle.
          </div>
        </div>

        <hr className="divider" />

        {/* Joueurs */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ color: '#9494A0', fontWeight: '600', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
            Joueurs {selectedJoueurs.size > 0 && <span style={{ color: '#5599FF' }}>— {selectedJoueurs.size} sélectionné{selectedJoueurs.size > 1 ? 's' : ''}</span>}
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '260px', overflowY: 'auto' }}>
            {joueurs.length === 0 && <div style={{ color: '#444', fontSize: '13px' }}>Aucun joueur actif</div>}
            {joueurs.map(j => {
              const sel = selectedJoueurs.has(j.id)
              return (
                <button key={j.id} onClick={() => toggleJoueur(j.id)}
                  className={`list-item${sel ? ' list-item-active' : ''}`}
                  style={{ border: sel ? '1px solid #1A6FFF40' : '1px solid #22223A', cursor: 'pointer', textAlign: 'left' }}>
                  <div className={`checkbox-custom${sel ? ' checked' : ''}`}>{sel ? '✓' : ''}</div>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: sel ? '#F0F0F8' : '#9494A0', fontSize: '14px', fontWeight: sel ? '700' : '400' }}>
                      {j.prenom} {j.nom}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-ghost">Annuler</button>
          <button onClick={confirmer} disabled={saving || selectedJoueurs.size === 0}
            className={`btn${selectedJoueurs.size > 0 ? ' btn-success' : ''}`}
            style={selectedJoueurs.size === 0 ? { background: '#22223A', color: '#3A3A50', cursor: 'not-allowed', padding: '10px 20px' } : {}}>
            {saving ? 'Attribution...' : `Confirmer l'attribution`}
          </button>
        </div>
      </div>
    </div>
  )
}

