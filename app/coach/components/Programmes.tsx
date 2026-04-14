'use client'

import { Fragment, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Seance, SeanceExercice, Joueur, Exercice, TYPES_SEANCE, LABELS_TYPE, TYPE_COLORS } from '../lib/types'
import { SearchableSelect } from './shared/SearchableSelect'
import { EditeurSeance } from './EditeurSeance'
import { AssignProgrammeModal } from './Modeles'
import { DuplicationModal } from './DuplicationModal'
import { AttributionModal } from './AttributionModal'
import { toast } from '../lib/toast'

export function Programmes() {
  const [vue, setVue] = useState<'templates' | 'editeur'>('templates')
  const [templates, setTemplates] = useState<Seance[]>([])
  const [seanceEdit, setSeanceEdit] = useState<Seance | null>(null)
  const [exercices, setExercices] = useState<Exercice[]>([])
  const [selection, setSelection] = useState<Set<string>>(new Set())
  const [showAttrib, setShowAttrib] = useState(false)
  const [search, setSearch] = useState('')
  const [filtreType, setFiltreType] = useState('')
  const [loadingEdit, setLoadingEdit] = useState(false)
  const [apercu, setApercu] = useState<Seance | null>(null)
  const [loadingApercu, setLoadingApercu] = useState(false)

  useEffect(() => { loadList() }, [])

  // Chargement léger : juste noms + type + count d'exos
  async function loadList() {
    const { data } = await supabase
      .from('seances')
      .select('id, nom, type, notes, est_template, seance_exercices(id)')
      .eq('est_template', true)
      .order('nom')
      .limit(2000)
    if (data) setTemplates([...(data as unknown as Seance[])].sort((a, b) => a.nom.localeCompare(b.nom, 'fr')))
  }

  // Exercices mis en cache après le 1er chargement
  async function getExercices(): Promise<Exercice[]> {
    if (exercices.length > 0) return exercices
    const { data } = await supabase.from('exercices').select('*, familles(id, nom, couleur)').order('nom').limit(5000)
    const exs = [...((data || []) as Exercice[])].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
    setExercices(exs)
    return exs
  }

  function toggleSelect(id: string) {
    setSelection(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  async function nouvelleSeance() {
    setLoadingEdit(true)
    const exs = await getExercices()
    setExercices(exs)
    setSeanceEdit({ id: '', nom: '', type: 'complete', notes: '', est_template: true, seance_exercices: [] })
    setLoadingEdit(false)
    setVue('editeur')
  }

  async function editSeance(s: Seance) {
    setLoadingEdit(true)
    const [{ data: full }, exs] = await Promise.all([
      supabase.from('seances').select('*, seance_exercices(*, exercices(nom, familles(id, nom, couleur)))').eq('id', s.id).single(),
      getExercices(),
    ])
    setExercices(exs)
    setSeanceEdit(full ? { ...full, seance_exercices: (full as Seance).seance_exercices || [] } : { ...s, seance_exercices: [] })
    setLoadingEdit(false)
    setVue('editeur')
  }

  async function deleteSeance(id: string) {
    if (!confirm('Supprimer cette séance ?')) return
    try {
      const { error } = await supabase.from('seances').delete().eq('id', id)
      if (error) throw error
      loadList()
    } catch (e: unknown) {
      toast('Erreur suppression : ' + (e instanceof Error ? e.message : String(e)), 'error')
    }
  }

  async function ouvrirApercu(s: Seance) {
    setApercu({ ...s, seance_exercices: [] })
    setLoadingApercu(true)
    const { data } = await supabase
      .from('seances')
      .select('id, nom, type, notes, seance_exercices(id, ordre, series, repetitions, duree_secondes, distance_metres, charge_kg, notes, lien_suivant, exercices(nom, familles(id, nom, couleur)))')
      .eq('id', s.id)
      .single()
    if (data) setApercu(data as unknown as Seance)
    setLoadingApercu(false)
  }

  if (loadingEdit) {
    return (
      <div className="page-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
        <span style={{ color: '#1A6FFF', fontSize: '13px', letterSpacing: '2px' }}>CHARGEMENT...</span>
      </div>
    )
  }

  if (vue === 'editeur' && seanceEdit) {
    return <EditeurSeance
      seance={seanceEdit}
      exercices={exercices}
      onSave={async () => { await loadList(); setVue('templates') }}
      onCancel={() => setVue('templates')}
    />
  }

  // Filtrage instantané (tout en mémoire)
  const typesDisponibles = [...new Set(templates.map(s => s.type))].filter(Boolean).sort()
  const filtrés = templates
    .filter(s => !filtreType || s.type === filtreType)
    .filter(s => !search || s.nom.toLowerCase().includes(search.toLowerCase()))
  const seancesSelectionnees = templates.filter(s => selection.has(s.id))

  return (
    <div className="page-section">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '12px' }}>
        <div>
          <h1 className="page-title">Séances</h1>
          <p className="page-subtitle">
            {search || filtreType ? `${filtrés.length} / ${templates.length}` : templates.length} séance{templates.length > 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
          {selection.size > 0 && (
            <button onClick={() => setShowAttrib(true)} className="btn btn-success btn-sm">Attribuer ({selection.size}) →</button>
          )}
          <button onClick={nouvelleSeance} className="btn btn-primary btn-sm">+ Nouvelle</button>
        </div>
      </div>

      {/* Barre recherche */}
      <div style={{ marginBottom: '12px' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Rechercher parmi ${templates.length} séances...`}
          className="input"
          style={{ fontSize: '15px', width: '100%' }}
        />
      </div>

      {/* Filtres par type */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <button onClick={() => setFiltreType('')} style={{
          padding: '5px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: '700', cursor: 'pointer',
          border: `1px solid ${!filtreType ? '#007AFF' : '#2C2C44'}`,
          background: !filtreType ? 'rgba(0,122,255,0.15)' : 'transparent',
          color: !filtreType ? '#007AFF' : '#555',
        }}>Tous</button>
        {typesDisponibles.map(t => {
          const tc = TYPE_COLORS[t] || TYPE_COLORS.complete
          const actif = filtreType === t
          return (
            <button key={t} onClick={() => setFiltreType(actif ? '' : t)} style={{
              padding: '5px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: '700', cursor: 'pointer',
              border: `1px solid ${actif ? tc.text : '#2C2C44'}`,
              background: actif ? tc.bg : 'transparent',
              color: actif ? tc.text : '#555',
            }}>{LABELS_TYPE[t] || t}</button>
          )
        })}
      </div>

      {/* Sélection active */}
      {selection.size > 0 && (
        <div style={{ background: '#2ECC7110', border: '1px solid #2ECC7125', borderRadius: '10px', padding: '10px 16px', marginBottom: '12px', fontSize: '13px', color: '#3DD68C', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2ECC71', boxShadow: '0 0 6px #2ECC71' }} />
          <span style={{ flex: 1 }}>{selection.size} séance{selection.size > 1 ? 's' : ''} sélectionnée{selection.size > 1 ? 's' : ''}</span>
          <button onClick={() => setSelection(new Set())} style={{ background: 'none', border: 'none', color: '#9898B8', cursor: 'pointer', fontSize: '11px' }}>Tout désélectionner</button>
        </div>
      )}

      {/* Liste */}
      {templates.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-text">Aucune séance.<br />Crée ta première séance !</div>
          </div>
        </div>
      ) : filtrés.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-text">Aucun résultat pour "{search}"</div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {filtrés.map(s => {
            const selected = selection.has(s.id)
            const tc = TYPE_COLORS[s.type] || TYPE_COLORS.complete
            const exoCount = s.seance_exercices?.length || 0
            return (
              <div key={s.id}
                onClick={() => ouvrirApercu(s)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px', borderRadius: '12px', cursor: 'pointer',
                  background: selected ? 'rgba(46,204,113,0.06)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${selected ? '#2ECC7130' : '#22223A'}`,
                  transition: 'background 0.1s',
                }}>
                <button onClick={e => { e.stopPropagation(); toggleSelect(s.id) }}
                  className={`checkbox-custom${selected ? ' checked' : ''}`}
                  style={{ borderColor: selected ? '#2ECC71' : undefined, background: selected ? '#2ECC71' : undefined, flexShrink: 0 }}>
                  {selected ? '✓' : ''}
                </button>
                <div style={{ width: '3px', alignSelf: 'stretch', borderRadius: '2px', background: tc.text, opacity: 0.6, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '2px' }} className="truncate">{s.nom}</div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', fontWeight: '700', color: tc.text }}>{LABELS_TYPE[s.type] || s.type}</span>
                    <span style={{ color: '#7878A8', fontSize: '11px' }}>{exoCount} exo{exoCount > 1 ? 's' : ''}</span>
                    {s.notes && <span style={{ color: '#6A6A8A', fontSize: '11px' }} className="truncate">· {s.notes.substring(0, 50)}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button onClick={e => { e.stopPropagation(); editSeance(s) }} className="btn btn-ghost btn-sm">Éditer</button>
                  <button onClick={e => { e.stopPropagation(); deleteSeance(s.id) }} className="btn btn-danger btn-sm">✕</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showAttrib && (
        <AttributionModal
          seances={seancesSelectionnees}
          onClose={() => { setShowAttrib(false); setSelection(new Set()) }}
        />
      )}

      {/* ── Aperçu séance ── */}
      {apercu && (
        <div
          onClick={() => setApercu(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.75)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#141420', borderRadius: '20px 20px 0 0', maxHeight: '85vh', display: 'flex', flexDirection: 'column', border: '1px solid #22223A' }}>

            {/* Handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
              <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: '#2A2A35' }} />
            </div>

            {/* Header séance */}
            <div style={{ padding: '14px 20px 12px', borderBottom: '1px solid #22223A' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '900', fontSize: '18px', letterSpacing: '-0.3px', marginBottom: '6px' }}>{apercu.nom}</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {(() => { const tc = TYPE_COLORS[apercu.type] || TYPE_COLORS.complete; return (
                      <span style={{ fontSize: '11px', fontWeight: '700', color: tc.text, background: tc.bg, border: `1px solid ${tc.border}`, padding: '3px 10px', borderRadius: '99px' }}>{LABELS_TYPE[apercu.type] || apercu.type}</span>
                    )})()}
                    <span style={{ color: '#7878A8', fontSize: '12px' }}>
                      {loadingApercu ? '...' : `${apercu.seance_exercices?.length || 0} exercice${(apercu.seance_exercices?.length || 0) > 1 ? 's' : ''}`}
                    </span>
                  </div>
                  {apercu.notes && <div style={{ color: '#9898B8', fontSize: '12px', marginTop: '8px', fontStyle: 'italic' }}>{apercu.notes}</div>}
                </div>
              </div>
            </div>

            {/* Corps : liste exercices */}
            <div style={{ overflowY: 'auto', flex: 1, padding: '12px 16px' }}>
              {loadingApercu ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#1A6FFF', fontSize: '13px', letterSpacing: '2px' }}>CHARGEMENT...</div>
              ) : !apercu.seance_exercices || apercu.seance_exercices.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#7878A8', fontSize: '13px' }}>Aucun exercice dans cette séance</div>
              ) : (() => {
                // Grouper en blocs superset
                const exos = [...apercu.seance_exercices].sort((a, b) => (a.ordre || 0) - (b.ordre || 0))
                const blocs: (typeof exos)[] = []
                let cur: typeof exos = []
                for (const e of exos) { cur.push(e); if (!e.lien_suivant) { blocs.push(cur); cur = [] } }
                if (cur.length) blocs.push(cur)

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {blocs.map((bloc, bi) => {
                      const isGroupe = bloc.length > 1
                      const label = bloc.length > 2 ? 'CIRCUIT' : 'SUPERSET'
                      return (
                        <div key={bi} style={{
                          borderRadius: '10px', overflow: 'hidden',
                          border: isGroupe ? '1px solid #1A6FFF30' : '1px solid #22223A',
                          background: isGroupe ? '#1A6FFF08' : '#18182A',
                        }}>
                          {isGroupe && (
                            <div style={{ padding: '5px 12px', background: '#1A6FFF18', borderBottom: '1px solid #1A6FFF25', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '10px', fontWeight: '900', color: '#1A6FFF', letterSpacing: '1px' }}>🔗 {label}</span>
                            </div>
                          )}
                          {bloc.map((exo, ei) => {
                            const fam = (exo as unknown as { exercices?: { nom: string; familles?: { nom: string; couleur: string } | null } }).exercices
                            const couleur = fam?.familles?.couleur || '#555'
                            // Résumé params
                            const params: string[] = []
                            if ((exo as SeanceExercice).series) params.push(`${(exo as SeanceExercice).series} sér.`)
                            if ((exo as SeanceExercice).repetitions) params.push(`${(exo as SeanceExercice).repetitions} rép.`)
                            if ((exo as SeanceExercice).duree_secondes) params.push(`${(exo as SeanceExercice).duree_secondes}s`)
                            if ((exo as SeanceExercice).distance_metres) params.push(`${(exo as SeanceExercice).distance_metres}m`)
                            if ((exo as SeanceExercice).charge_kg) params.push(`${(exo as SeanceExercice).charge_kg}kg`)
                            return (
                              <div key={exo.id} style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '10px 12px',
                                borderTop: ei > 0 ? '1px solid #22223A' : 'none',
                              }}>
                                <div style={{ width: '3px', alignSelf: 'stretch', borderRadius: '2px', background: couleur, flexShrink: 0 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '2px' }} className="truncate">{fam?.nom || '—'}</div>
                                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                                    {fam?.familles && <span style={{ fontSize: '10px', fontWeight: '700', color: couleur }}>{fam.familles.nom}</span>}
                                    {params.length > 0 && <span style={{ fontSize: '11px', color: '#9898B8' }}>{params.join(' · ')}</span>}
                                    {(exo as SeanceExercice).notes && <span style={{ fontSize: '10px', color: '#3A3A50', fontStyle: 'italic' }} className="truncate">{(exo as SeanceExercice).notes}</span>}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                )
              })()}
            </div>

            {/* Footer */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid #22223A', display: 'flex', gap: '10px' }}>
              <button onClick={() => setApercu(null)} className="btn btn-ghost" style={{ flex: 1 }}>Fermer</button>
              <button onClick={() => { toggleSelect(apercu.id); setApercu(null) }}
                className="btn btn-ghost" style={{ flex: 1, borderColor: selection.has(apercu.id) ? '#2ECC7140' : undefined, color: selection.has(apercu.id) ? '#2ECC71' : undefined }}>
                {selection.has(apercu.id) ? '✓ Sélectionné' : 'Sélectionner'}
              </button>
              <button onClick={() => { setApercu(null); editSeance(apercu) }} className="btn btn-primary" style={{ flex: 1 }}>Éditer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Helper : extraire l'ID YouTube d'une URL ──────────────────────
