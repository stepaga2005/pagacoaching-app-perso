'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from '../lib/toast'
import { AttributionModal } from './AttributionModal'
import { ExercicePicker } from './ExercicePicker'
import { type Seance, type Exercice } from '../lib/types'
import {
  genererSeance,
  type GenParams, type SeanceGeneree,
  type Poste, type Objectif, type ATR, type Env, type MD, type Ressenti, type Douleur,
} from '../lib/exercises'

// ─── Types éditables ──────────────────────────────────────────────────────────

type ExoEdit = {
  n: string
  d: string
  c?: string
  series?: number
  repetitions?: number
  charge_kg?: number
  recuperation_secondes?: number
  duree_secondes?: number
  distance_metres?: number
}

type PhaseEdit = {
  nom: string
  desc: string
  duree: string
  rpe: number
  exos: ExoEdit[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseDosage(d: string): Partial<ExoEdit> {
  const r: Partial<ExoEdit> = {}
  const s = d.match(/(\d+)\s*(?:tours?|s[eé]ries?)/i)
  if (s) r.series = +s[1]
  const a = d.match(/(\d+)\s*(?:actions?|reps?|répétitions?|têtes?|frappes?|plongeons?|sauts?|contacts?)/i)
  if (a) r.repetitions = +a[1]
  const rs = d.match(/(\d+)s\s*(?:entre|par|de\s*récup)/i)
  if (rs) r.recuperation_secondes = +rs[1]
  const rm = d.match(/(\d+)\s*min\s*(?:entre|de\s*récup)/i)
  if (rm) r.recuperation_secondes = +rm[1] * 60
  if (!r.repetitions) {
    const ds = d.match(/·\s*(\d+)s(?:\s*·|\s*à|\s*$)/i)
    if (ds) r.duree_secondes = +ds[1]
  }
  const dm = d.match(/(\d+)m(?:\s*·|\s*$|\s)/i)
  if (dm && +dm[1] <= 500) r.distance_metres = +dm[1]
  return r
}

function toPhaseEdits(result: SeanceGeneree): PhaseEdit[] {
  return result.phases.map(phase => ({
    ...phase,
    exos: phase.exos.map(exo => ({ ...exo, ...parseDosage(exo.d) })),
  }))
}

// ─── Composants UI ───────────────────────────────────────────────────────────

const PHASE_COLORS = ['#1565C0', '#0F6E56', '#C62828', '#4527A0', '#2E7D32']

function NumInput({ label, value, onChange }: { label: string; value?: number; onChange: (v: number | undefined) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: '56px' }}>
      <span style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#7878A8' }}>{label}</span>
      <input
        type="number"
        min={0}
        value={value ?? ''}
        onChange={e => onChange(e.target.value === '' ? undefined : +e.target.value)}
        style={{
          width: '100%', background: '#0D0D18', border: '1px solid #2A2A3A', borderRadius: '6px',
          color: '#E0E0E0', fontSize: '13px', fontWeight: '700', padding: '5px 8px',
          outline: 'none', textAlign: 'center',
        }}
      />
    </div>
  )
}

function PhaseBlock({
  phase, index, defaultOpen,
  onDelete, onUpdate, onReplace,
}: {
  phase: PhaseEdit
  index: number
  defaultOpen: boolean
  onDelete: (ei: number) => void
  onUpdate: (ei: number, changes: Partial<ExoEdit>) => void
  onReplace: (ei: number) => void
}) {
  const [open, setOpen] = useState(defaultOpen)
  const [editingEi, setEditingEi] = useState<number | null>(null)
  const col = PHASE_COLORS[index] || '#1A6FFF'

  return (
    <div style={{ borderBottom: '1px solid #1C1C2C' }}>
      {/* En-tête phase */}
      <div
        onClick={() => setOpen(!open)}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', cursor: 'pointer' }}
      >
        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: col, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: '#fff', flexShrink: 0 }}>
          {index + 1}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#E0E0E0' }}>{phase.nom}</div>
          <div style={{ fontSize: '11px', color: '#9898B8', marginTop: '1px' }}>{phase.desc}</div>
        </div>
        <div style={{ fontSize: '11px', color: '#7878A8', marginRight: '6px', whiteSpace: 'nowrap' }}>{phase.duree} · RPE {phase.rpe}</div>
        <span style={{ color: '#7878A8', fontSize: '14px', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
      </div>

      {open && (
        <div style={{ paddingBottom: '8px' }}>
          {phase.exos.length === 0 && (
            <div style={{ padding: '12px 50px', fontSize: '12px', color: '#555', fontStyle: 'italic' }}>Phase vide</div>
          )}
          {phase.exos.map((ex, ei) => {
            const editing = editingEi === ei
            return (
              <div key={ei} style={{ borderTop: ei > 0 ? '1px solid #161620' : 'none', padding: '10px 16px 10px 50px' }}>
                {/* Ligne principale */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#C9A84C', marginTop: '7px', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#E0E0E0' }}>{ex.n}</div>
                    <div style={{ fontSize: '11px', color: '#9898B8', marginTop: '2px', lineHeight: '1.4' }}>{ex.d}</div>
                    {ex.c && <div style={{ fontSize: '11px', color: '#C9A84C', marginTop: '3px', fontStyle: 'italic' }}>"{ex.c}"</div>}
                  </div>
                  {/* Boutons édition/suppression */}
                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0, marginTop: '1px' }}>
                    <button
                      onClick={e => { e.stopPropagation(); setEditingEi(editing ? null : ei) }}
                      title="Modifier les paramètres"
                      style={{
                        width: '26px', height: '26px', borderRadius: '6px', border: `1px solid ${editing ? '#1A6FFF' : '#2A2A3A'}`,
                        background: editing ? '#1A6FFF20' : 'transparent', color: editing ? '#1A6FFF' : '#555',
                        cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >✎</button>
                    <button
                      onClick={e => { e.stopPropagation(); onDelete(ei) }}
                      title="Supprimer cet exercice"
                      style={{
                        width: '26px', height: '26px', borderRadius: '6px', border: '1px solid #2A2A3A',
                        background: 'transparent', color: '#FF4757', cursor: 'pointer',
                        fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >✕</button>
                  </div>
                </div>

                {/* Panneau d'édition inline */}
                {editing && (
                  <div style={{ marginTop: '10px', marginLeft: '13px', background: '#0D0D1A', border: '1px solid #1A2040', borderRadius: '10px', padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      <NumInput label="Séries" value={ex.series} onChange={v => onUpdate(ei, { series: v })} />
                      <NumInput label="Reps" value={ex.repetitions} onChange={v => onUpdate(ei, { repetitions: v })} />
                      <NumInput label="Durée s" value={ex.duree_secondes} onChange={v => onUpdate(ei, { duree_secondes: v })} />
                      <NumInput label="Charge kg" value={ex.charge_kg} onChange={v => onUpdate(ei, { charge_kg: v })} />
                      <NumInput label="Récup s" value={ex.recuperation_secondes} onChange={v => onUpdate(ei, { recuperation_secondes: v })} />
                      <NumInput label="Distance m" value={ex.distance_metres} onChange={v => onUpdate(ei, { distance_metres: v })} />
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); onReplace(ei) }}
                      style={{
                        width: '100%', background: 'transparent', border: '1px solid #2A2A3A',
                        color: '#9898B8', borderRadius: '7px', padding: '7px 12px',
                        fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                      }}
                    >
                      ⇄ Remplacer par un autre exercice
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ChipGroup<T extends string>({ label, options, value, onChange, colors }: {
  label: string; options: { v: T; l: string }[]; value: T; onChange: (v: T) => void; colors?: Record<string, string>
}) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9898B8', marginBottom: '8px' }}>{label}</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {options.map(o => {
          const active = value === o.v
          const col = colors?.[o.v] || '#1A6FFF'
          return (
            <button key={o.v} onClick={() => onChange(o.v)} style={{
              padding: '5px 13px', borderRadius: '20px', border: `1px solid ${active ? col : '#2A2A3A'}`,
              background: active ? col + '25' : '#1A1A2A', color: active ? col : '#555',
              fontSize: '12px', fontWeight: active ? '700' : '500', cursor: 'pointer', transition: 'all 0.15s',
            }}>{o.l}</button>
          )
        })}
      </div>
    </div>
  )
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { v: string; l: string }[]
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9898B8' }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        background: '#1A1A2A', border: '1px solid #2A2A3A', borderRadius: '8px',
        color: '#E0E0E0', fontSize: '13px', padding: '8px 10px', outline: 'none', width: '100%',
      }}>
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  )
}

// ─── Composant principal ──────────────────────────────────────────────────────

export function GenerateurSeance() {
  const [poste, setPoste]       = useState<Poste>('milieu')
  const [niv, setNiv]           = useState('Semi-pro')
  const [md, setMd]             = useState<MD>('MD-4')
  const [obj, setObj]           = useState<Objectif>('vitesse')
  const [atr, setAtr]           = useState<ATR>('ACC')
  const [env, setEnv]           = useState<Env>('terrain')
  const [tps, setTps]           = useState(45)
  const [sem, setSem]           = useState(1)
  const [ressenti, setRessenti] = useState<Ressenti>('Frais')
  const [douleur, setDouleur]   = useState<Douleur>('Aucune')
  const [demande, setDemande]   = useState('')

  const [result, setResult]             = useState<SeanceGeneree | null>(null)
  const [editablePhases, setEditablePhases] = useState<PhaseEdit[]>([])
  const [saving, setSaving]             = useState(false)
  const [savedSeance, setSavedSeance]   = useState<Seance | null>(null)
  const [showAttrib, setShowAttrib]     = useState(false)

  // Picker de remplacement
  const [pickerFor, setPickerFor]       = useState<{ pi: number; ei: number } | null>(null)
  const [dbExercices, setDbExercices]   = useState<Exercice[]>([])

  // ── Helpers état phases ──────────────────────────────────────────────────────

  function deleteExo(pi: number, ei: number) {
    setEditablePhases(prev => prev.map((ph, i) =>
      i !== pi ? ph : { ...ph, exos: ph.exos.filter((_, j) => j !== ei) }
    ))
  }

  function updateExo(pi: number, ei: number, changes: Partial<ExoEdit>) {
    setEditablePhases(prev => prev.map((ph, i) =>
      i !== pi ? ph : { ...ph, exos: ph.exos.map((ex, j) => j !== ei ? ex : { ...ex, ...changes }) }
    ))
  }

  async function openPicker(pi: number, ei: number) {
    if (dbExercices.length === 0) {
      const { data } = await supabase.from('exercices').select('*, familles(id, nom, couleur)').order('nom').limit(5000)
      if (data) setDbExercices(data)
    }
    setPickerFor({ pi, ei })
  }

  function replaceExo(pi: number, ei: number, dbExo: Exercice) {
    const current = editablePhases[pi]?.exos[ei]
    const updated: ExoEdit = {
      n: dbExo.nom,
      d: dbExo.description || '',
      c: dbExo.consignes_execution || undefined,
      series: current?.series,
      repetitions: current?.repetitions,
      charge_kg: current?.charge_kg,
      recuperation_secondes: current?.recuperation_secondes,
      duree_secondes: current?.duree_secondes,
      distance_metres: current?.distance_metres,
    }
    setEditablePhases(prev => prev.map((ph, i) =>
      i !== pi ? ph : { ...ph, exos: ph.exos.map((ex, j) => j !== ei ? ex : updated) }
    ))
  }

  // ── Sauvegarde ───────────────────────────────────────────────────────────────

  async function sauvegarder(estTemplate: boolean): Promise<Seance | null> {
    if (!result) return null
    setSaving(true)
    try {
      // Famille "Générateur IA" — crée si absente
      let familleId: string
      const { data: famExist } = await supabase.from('familles').select('id').eq('nom', 'Générateur IA').maybeSingle()
      if (famExist) {
        familleId = famExist.id
      } else {
        const { data: newFam } = await supabase.from('familles').insert({ nom: 'Générateur IA', couleur: '#7878A8' }).select('id').single()
        familleId = newFam!.id
      }

      // Upsert exercices par nom (si pas déjà en DB)
      const exoIds = new Map<string, string>()
      for (const phase of editablePhases) {
        for (const exo of phase.exos) {
          if (exoIds.has(exo.n)) continue
          const { data: ex } = await supabase.from('exercices').select('id').eq('nom', exo.n).maybeSingle()
          if (ex) {
            exoIds.set(exo.n, ex.id)
          } else {
            const { data: newEx } = await supabase.from('exercices').insert({
              nom: exo.n, famille_id: familleId,
              description: exo.d, consignes_execution: exo.c || '',
            }).select('id').single()
            if (newEx) exoIds.set(exo.n, newEx.id)
          }
        }
      }

      // Créer la séance
      const { data: seance } = await supabase.from('seances').insert({
        nom: result.titre, type: 'complete', est_template: estTemplate,
        notes: result.meta + '\n\n' + result.msgFin + ' — ' + result.msgAtr,
      }).select('id, nom, type, notes, est_template').single()
      if (!seance) throw new Error('Échec création séance')

      // Créer seance_exercices avec les valeurs éditées
      let ordre = 1
      for (const phase of editablePhases) {
        for (const exo of phase.exos) {
          const exerciceId = exoIds.get(exo.n)
          if (!exerciceId) continue
          await supabase.from('seance_exercices').insert({
            seance_id: seance.id, exercice_id: exerciceId, ordre: ordre++,
            notes: phase.nom + (exo.c ? ' · ' + exo.c : ''),
            series: exo.series,
            repetitions: exo.repetitions,
            charge_kg: exo.charge_kg,
            recuperation_secondes: exo.recuperation_secondes,
            duree_secondes: exo.duree_secondes,
            distance_metres: exo.distance_metres,
          })
        }
      }
      return seance as Seance
    } catch {
      toast('Erreur lors de la sauvegarde', 'error')
      return null
    } finally {
      setSaving(false)
    }
  }

  async function enregistrerFavoris() {
    const seance = await sauvegarder(true)
    if (seance) toast('Séance enregistrée dans les favoris', 'success')
  }

  async function attribuer() {
    const seance = await sauvegarder(false)
    if (seance) { setSavedSeance(seance); setShowAttrib(true) }
  }

  // ── Génération ───────────────────────────────────────────────────────────────

  function generer() {
    const params: GenParams = { poste, niv, md, obj, atr, env, tps, sem, ressenti, douleur, demande }
    const generated = genererSeance(params)
    setResult(generated)
    setEditablePhases(toPhaseEdits(generated))
    setSavedSeance(null)
    setTimeout(() => {
      document.getElementById('gen-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  // ── Couleurs ─────────────────────────────────────────────────────────────────

  const ressentiColors: Record<Ressenti, string> = {
    'Frais': '#2ECC71', 'Normal': '#1A6FFF', 'Fatigué': '#FF6B35', 'Très fatigué': '#FF4757',
  }
  const douleurColors: Record<Douleur, string> = {
    'Aucune': '#2ECC71', 'Genou': '#FF4757', 'Ischios': '#FF4757',
    'Cheville': '#FF6B35', 'Adducteurs': '#FF6B35', 'Dos': '#FF6B35',
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="page-section">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-0.5px', marginBottom: '4px' }}>Générateur de séance</h1>
        <p style={{ color: '#7878A8', fontSize: '13px' }}>Compose une séance personnalisée depuis ta bibliothèque d'exercices</p>
      </div>

      {/* ── Profil joueur ── */}
      <div style={{ background: '#141420', border: '1px solid #222238', borderRadius: '16px', padding: '20px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{ width: '3px', height: '16px', background: '#1A6FFF', borderRadius: '2px' }} />
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#1A6FFF', letterSpacing: '1px', textTransform: 'uppercase' }}>Joueur</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <SelectField label="Poste" value={poste} onChange={v => setPoste(v as Poste)} options={[
            { v: 'attaquant', l: 'Attaquant de pointe' }, { v: 'ailier', l: 'Ailier' },
            { v: 'milieu', l: 'Milieu de terrain' }, { v: 'lateral', l: 'Latéral' },
            { v: 'defenseur', l: 'Défenseur central' }, { v: 'gardien', l: 'Gardien de but' },
          ]} />
          <SelectField label="Niveau" value={niv} onChange={setNiv} options={[
            { v: 'U12', l: 'U12' }, { v: 'U15', l: 'U15' }, { v: 'U17', l: 'U17' },
            { v: 'U19', l: 'U19' }, { v: 'Amateur', l: 'Amateur' },
            { v: 'Semi-pro', l: 'Semi-pro' }, { v: 'Pro', l: 'Pro' },
          ]} />
        </div>
      </div>

      {/* ── Paramètres séance ── */}
      <div style={{ background: '#141420', border: '1px solid #222238', borderRadius: '16px', padding: '20px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{ width: '3px', height: '16px', background: '#C9A84C', borderRadius: '2px' }} />
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#C9A84C', letterSpacing: '1px', textTransform: 'uppercase' }}>Séance</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '14px' }}>
          <SelectField label="Jour MD" value={md} onChange={v => setMd(v as MD)} options={[
            { v: 'MD+3', l: 'MD+3' }, { v: 'MD+2', l: 'MD+2' }, { v: 'MD-4', l: 'MD-4' },
            { v: 'MD-2', l: 'MD-2' }, { v: 'MD-1', l: 'MD-1 Veille' }, { v: 'MD', l: 'MD Match' },
          ]} />
          <SelectField label="Phase ATR" value={atr} onChange={v => setAtr(v as ATR)} options={[
            { v: 'ACC', l: 'Accumulation' }, { v: 'TRA', l: 'Transmutation' },
            { v: 'REA', l: 'Réalisation' }, { v: 'DEC', l: 'Décharge' },
          ]} />
          <SelectField label="Semaine" value={String(sem)} onChange={v => setSem(Number(v))} options={
            Array.from({ length: 8 }, (_, i) => ({ v: String(i + 1), l: `S${i + 1}` }))
          } />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <SelectField label="Objectif" value={obj} onChange={v => setObj(v as Objectif)} options={[
            { v: 'vitesse', l: 'Vitesse / Explosivité' }, { v: 'force', l: 'Force bas du corps' },
            { v: 'prevention', l: 'Prévention / Ischios' }, { v: 'endurance', l: 'Endurance / Conditioning' },
            { v: 'cod', l: 'COD / Vivacité' }, { v: 'technique', l: 'Technique de course' },
            { v: 'frappe', l: 'Frappe de balle' }, { v: 'detente', l: 'Détente / Jeu de tête' },
          ]} />
          <SelectField label="Environnement" value={env} onChange={v => setEnv(v as Env)} options={[
            { v: 'terrain', l: 'Terrain' }, { v: 'salle', l: 'Salle' }, { v: 'maison', l: 'Maison / PDC' },
          ]} />
          <SelectField label="Durée" value={String(tps)} onChange={v => setTps(Number(v))} options={[
            { v: '20', l: '20 min' }, { v: '45', l: '45 min' }, { v: '60', l: '60 min' },
          ]} />
        </div>
      </div>

      {/* ── État du joueur ── */}
      <div style={{ background: '#141420', border: '1px solid #222238', borderRadius: '16px', padding: '20px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{ width: '3px', height: '16px', background: '#2ECC71', borderRadius: '2px' }} />
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#2ECC71', letterSpacing: '1px', textTransform: 'uppercase' }}>État du joueur</span>
        </div>
        <ChipGroup<Ressenti> label="Ressenti" value={ressenti} onChange={setRessenti} colors={ressentiColors} options={[
          { v: 'Frais', l: 'Frais' }, { v: 'Normal', l: 'Normal' },
          { v: 'Fatigué', l: 'Fatigué' }, { v: 'Très fatigué', l: 'Très fatigué' },
        ]} />
        <ChipGroup<Douleur> label="Douleur / zone à protéger" value={douleur} onChange={setDouleur} colors={douleurColors} options={[
          { v: 'Aucune', l: 'Aucune' }, { v: 'Genou', l: 'Genou' }, { v: 'Ischios', l: 'Ischios' },
          { v: 'Cheville', l: 'Cheville' }, { v: 'Adducteurs', l: 'Adducteurs' }, { v: 'Dos', l: 'Dos' },
        ]} />
        <div>
          <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9898B8', marginBottom: '6px' }}>Demande spécifique (optionnel)</div>
          <textarea value={demande} onChange={e => setDemande(e.target.value)}
            placeholder="Ex : il veut progresser sur ses accélérations après dribbles, il a raté ses centres samedi..."
            rows={2} style={{
              width: '100%', background: '#1A1A2A', border: '1px solid #2A2A3A', borderRadius: '8px',
              color: '#E0E0E0', fontSize: '13px', padding: '10px 12px', outline: 'none', resize: 'vertical', fontFamily: 'inherit',
            }} />
        </div>
      </div>

      {/* ── Bouton générer ── */}
      <button onClick={generer} style={{
        width: '100%', background: '#1A6FFF', color: '#fff', border: 'none', borderRadius: '12px',
        padding: '14px', fontSize: '15px', fontWeight: '800', letterSpacing: '2px',
        textTransform: 'uppercase', cursor: 'pointer', marginBottom: '28px',
      }}>
        Générer la séance
      </button>

      {/* ── Résultat éditable ── */}
      {result && (
        <div id="gen-result" style={{ background: '#141420', border: '1px solid #222238', borderRadius: '16px', overflow: 'hidden', marginBottom: '14px' }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #0D1B2A, #1A3060)', padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '18px', fontWeight: '900', color: '#C9A84C', letterSpacing: '0.5px', marginBottom: '4px' }}>{result.titre}</div>
            <div style={{ fontSize: '10px', color: '#90AAD4', letterSpacing: '1px', textTransform: 'uppercase' }}>{result.meta}</div>
          </div>
          {/* Barre couleur phases */}
          <div style={{ display: 'flex', height: '4px' }}>
            {editablePhases.map((_, i) => (
              <div key={i} style={{ flex: i === 2 ? 2 : 1, background: PHASE_COLORS[i] }} />
            ))}
          </div>
          {/* Phases éditables */}
          {editablePhases.map((phase, pi) => (
            <PhaseBlock
              key={pi} phase={phase} index={pi} defaultOpen={pi === 2}
              onDelete={ei => deleteExo(pi, ei)}
              onUpdate={(ei, changes) => updateExo(pi, ei, changes)}
              onReplace={ei => openPicker(pi, ei)}
            />
          ))}
          {/* Message coach */}
          <div style={{ background: '#0D1B2A', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '14px 20px', fontSize: '13px', color: '#90AAD4', fontStyle: 'italic', lineHeight: '1.6' }}>
            <strong style={{ color: '#C9A84C', fontStyle: 'normal' }}>Stéphane : </strong>
            {result.msgFin} — {result.msgAtr}
          </div>
          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px', margin: '12px 16px' }}>
            <button onClick={generer} style={{
              flex: 1, background: '#1A1A2A', border: '1px solid #1A6FFF50',
              color: '#1A6FFF', borderRadius: '8px', padding: '10px 12px',
              fontSize: '12px', fontWeight: '700', cursor: 'pointer',
            }}>🔄 Autre</button>
            <button onClick={enregistrerFavoris} disabled={saving} style={{
              flex: 1, background: '#1A1A2A', border: '1px solid #C9A84C50',
              color: saving ? '#555' : '#C9A84C', borderRadius: '8px', padding: '10px 12px',
              fontSize: '12px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer',
            }}>{saving ? '...' : '★ Favoris'}</button>
            <button onClick={attribuer} disabled={saving} style={{
              flex: 2, background: saving ? '#1A1A2A' : '#1A6FFF', border: 'none',
              color: saving ? '#555' : '#fff', borderRadius: '8px', padding: '10px 16px',
              fontSize: '12px', fontWeight: '800', cursor: saving ? 'not-allowed' : 'pointer',
            }}>{saving ? 'Enregistrement...' : '→ Attribuer à un joueur'}</button>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {showAttrib && savedSeance && (
        <AttributionModal
          seances={[savedSeance]}
          onClose={() => { setShowAttrib(false); setSavedSeance(null) }}
        />
      )}

      {pickerFor && (
        <ExercicePicker
          exercices={dbExercices}
          onConfirm={exs => {
            replaceExo(pickerFor.pi, pickerFor.ei, exs[0])
            setPickerFor(null)
          }}
          onClose={() => setPickerFor(null)}
        />
      )}
    </div>
  )
}
