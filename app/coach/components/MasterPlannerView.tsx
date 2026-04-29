'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Joueur, MPRealisation, MPSeanceExercice, Exercice, Seance, SetConfig, JOURS, JOURS_FULL, LABELS_TYPE, TYPE_COLORS } from '../lib/types'
import { haptic } from '../lib/utils'
import { toast } from '../lib/toast'
import { EditeurSeance } from './EditeurSeance'
import { ExercicePicker } from './ExercicePicker'
import { SearchableSelect } from './shared/SearchableSelect'
import { CopierJoursModal } from './CopierJoursModal'

export function MasterPlannerView({ joueur, realisations: initialReals, exercices, weekStart: initialWeekStart, onClose, onReload }: {
  joueur: Joueur
  realisations: MPRealisation[]
  exercices: Exercice[]
  weekStart: string
  onClose: () => void
  onReload: () => void
}) {
  const today = new Date().toISOString().split('T')[0]
  const [reals, setReals] = useState<MPRealisation[]>(initialReals)
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date(initialWeekStart + 'T12:00:00')
    const day = d.getDay()
    d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day))
    return d.toISOString().split('T')[0]
  })
  const [addExoTo, setAddExoTo] = useState<string | null>(null)
  const [rechercheExo, setRechercheExo] = useState('')
  const [loading, setLoading] = useState(true)
  const [expandedExo, setExpandedExo] = useState<{ rId: string; eId: string } | null>(null)
  const [mpActionDate, setMpActionDate] = useState<string | null>(null)
  const [mpWellnessDate, setMpWellnessDate] = useState<string | null>(null)
  const [mpWellnessData, setMpWellnessData] = useState({ fatigue: 5, rpe: 5, courbatures: 5, qualite_sommeil: 5, notes: '' })
  const [mpTemplates, setMpTemplates] = useState<{ id: string; nom: string }[]>([])
  const [mpSeanceChoisie, setMpSeanceChoisie] = useState('')
  const [mpNouvelleSeanceDate, setMpNouvelleSeanceDate] = useState<string | null>(null)
  const [mpSessionMenu, setMpSessionMenu] = useState<{ id: string; seanceId: string; date: string; nom: string } | null>(null)
  const [mpMovingSession, setMpMovingSession] = useState<{ id: string; seanceId: string; fromDate: string; nom: string } | null>(null)
  const [mpDupModal, setMpDupModal] = useState<{ seanceId: string; nom: string } | null>(null)
  const [mpDupDate, setMpDupDate] = useState('')
  const [mpDupJoueurId, setMpDupJoueurId] = useState('')
  const [mpCopiedExo, setMpCopiedExo] = useState<Partial<MPSeanceExercice> | null>(null)
  const [mpCopyExoModal, setMpCopyExoModal] = useState<{ fromExo: MPSeanceExercice; realisationId: string } | null>(null)
  const [mpCopyExoTargets, setMpCopyExoTargets] = useState<Set<string>>(new Set())
  const [modeSelection, setModeSelection] = useState(false)
  const [joursSelectionnes, setJoursSelectionnes] = useState<Set<string>>(new Set())
  const [showCopierModal, setShowCopierModal] = useState(false)
  const [allJoueurs, setAllJoueurs] = useState<{ id: string; nom: string; prenom: string }[]>([])

  useEffect(() => {
    supabase.from('seances').select('id, nom').eq('est_template', true).order('nom').limit(2000)
      .then(({ data }) => { if (data) setMpTemplates([...data].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))) })
  }, [])

  useEffect(() => {
    supabase.from('joueurs').select('id, nom, prenom').eq('actif', true).order('nom')
      .then(({ data }) => { if (data) setAllJoueurs([...data].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))) })
  }, [])

  async function mpAttribuerSessionId(ds: string, seanceId: string) {
    await supabase.from('realisations').insert({ joueur_id: joueur.id, seance_id: seanceId, date_realisation: ds, completee: false })
    const { data } = await supabase.from('realisations')
      .select('id, seance_id, activite_id, date_realisation, completee, seances(id, nom, type, seance_exercices(id, ordre, series, repetitions, duree_secondes, distance_metres, charge_kg, recuperation_secondes, lien_suivant, uni_podal, notes, sets_config, exercices(nom, video_url, familles(nom, couleur)))), activites(nom)')
      .eq('joueur_id', joueur.id).order('date_realisation')
    if (data) setReals(data as unknown as MPRealisation[])
  }

  const mpReload = async () => {
    const { data } = await supabase.from('realisations')
      .select('id, seance_id, activite_id, date_realisation, completee, seances(id, nom, type, seance_exercices(id, ordre, series, repetitions, duree_secondes, distance_metres, charge_kg, recuperation_secondes, lien_suivant, uni_podal, notes, sets_config, exercices(nom, video_url, familles(nom, couleur)))), activites(nom)')
      .eq('joueur_id', joueur.id).order('date_realisation')
    if (data) setReals(data as unknown as MPRealisation[])
  }

  async function mpDeleteRealisation(id: string) {
    try {
      const { error } = await supabase.from('realisations').delete().eq('id', id)
      if (error) throw error
      setReals(prev => prev.filter(r => r.id !== id))
      setMpSessionMenu(null)
    } catch (e: unknown) {
      toast('Erreur suppression : ' + (e instanceof Error ? e.message : String(e)), 'error')
    }
  }

  async function mpMoveSession(toDate: string) {
    if (!mpMovingSession) return
    await supabase.from('realisations').update({ date_realisation: toDate }).eq('id', mpMovingSession.id)
    await mpReload()
    setMpMovingSession(null)
  }

  async function mpDupSession() {
    if (!mpDupModal || !mpDupDate) return
    const jId = mpDupJoueurId || joueur.id
    await supabase.from('realisations').insert({ joueur_id: jId, seance_id: mpDupModal.seanceId, date_realisation: mpDupDate, completee: false })
    if (jId === joueur.id) await mpReload()
    setMpDupModal(null); setMpDupDate(''); setMpDupJoueurId('')
  }

  async function mpPasteExo(realisationId: string, exoId: string) {
    if (!mpCopiedExo) return
    const upd: Record<string, unknown> = {
      series: mpCopiedExo.series ?? null,
      sets_config: mpCopiedExo.sets_config ?? null,
      repetitions: mpCopiedExo.sets_config ? null : (mpCopiedExo.repetitions ?? null),
      duree_secondes: mpCopiedExo.sets_config ? null : (mpCopiedExo.duree_secondes ?? null),
      distance_metres: mpCopiedExo.sets_config ? null : (mpCopiedExo.distance_metres ?? null),
      charge_kg: mpCopiedExo.sets_config ? null : (mpCopiedExo.charge_kg ?? null),
      recuperation_secondes: mpCopiedExo.sets_config ? null : (mpCopiedExo.recuperation_secondes ?? null),
    }
    await supabase.from('seance_exercices').update(upd).eq('id', exoId)
    patchExoLocal(realisationId, exoId, {
      series: mpCopiedExo.series, sets_config: mpCopiedExo.sets_config,
      repetitions: upd.repetitions as number, duree_secondes: upd.duree_secondes as number,
      distance_metres: upd.distance_metres as number, charge_kg: upd.charge_kg as number,
      recuperation_secondes: upd.recuperation_secondes as number,
    })
    setMpCopiedExo(null)
  }

  async function mpCopyExoToTargets() {
    if (!mpCopyExoModal || mpCopyExoTargets.size === 0) return
    const src = mpCopyExoModal.fromExo
    const upd: Record<string, unknown> = {
      series: src.series ?? null,
      sets_config: src.sets_config ?? null,
      repetitions: src.sets_config ? null : (src.repetitions ?? null),
      duree_secondes: src.sets_config ? null : (src.duree_secondes ?? null),
      distance_metres: src.sets_config ? null : (src.distance_metres ?? null),
      charge_kg: src.sets_config ? null : (src.charge_kg ?? null),
      recuperation_secondes: src.sets_config ? null : (src.recuperation_secondes ?? null),
    }
    await Promise.all([...mpCopyExoTargets].map(exoId =>
      supabase.from('seance_exercices').update(upd).eq('id', exoId)
    ))
    for (const exoId of mpCopyExoTargets) {
      patchExoLocal(mpCopyExoModal.realisationId, exoId, {
        series: src.series, sets_config: src.sets_config,
        repetitions: upd.repetitions as number, duree_secondes: upd.duree_secondes as number,
        distance_metres: upd.distance_metres as number, charge_kg: upd.charge_kg as number,
        recuperation_secondes: upd.recuperation_secondes as number,
      })
    }
    setMpCopyExoModal(null)
    setMpCopyExoTargets(new Set())
  }

  async function mpAttribuerSession(ds: string) {
    if (!mpSeanceChoisie) return
    await supabase.from('realisations').insert({ joueur_id: joueur.id, seance_id: mpSeanceChoisie, date_realisation: ds, completee: false })
    const { data } = await supabase.from('realisations')
      .select('id, seance_id, activite_id, date_realisation, completee, seances(id, nom, type, seance_exercices(id, ordre, series, repetitions, duree_secondes, distance_metres, charge_kg, recuperation_secondes, lien_suivant, uni_podal, notes, sets_config, exercices(nom, video_url, familles(nom, couleur)))), activites(nom)')
      .eq('joueur_id', joueur.id).order('date_realisation')
    if (data) setReals(data as unknown as MPRealisation[])
    setMpActionDate(null)
    setMpSeanceChoisie('')
  }

  async function mpSauvegarderWellness() {
    if (!mpWellnessDate) return
    await supabase.from('realisations').insert({
      joueur_id: joueur.id, seance_id: null, date_realisation: mpWellnessDate, completee: false,
      fatigue: mpWellnessData.fatigue || null, rpe: mpWellnessData.rpe || null,
      courbatures: mpWellnessData.courbatures || null, qualite_sommeil: mpWellnessData.qualite_sommeil || null,
      notes_joueur: mpWellnessData.notes || null,
    })
    const { data } = await supabase.from('realisations')
      .select('id, seance_id, activite_id, date_realisation, completee, seances(id, nom, type, seance_exercices(id, ordre, series, repetitions, duree_secondes, distance_metres, charge_kg, recuperation_secondes, lien_suivant, uni_podal, notes, sets_config, exercices(nom, video_url, familles(nom, couleur)))), activites(nom)')
      .eq('joueur_id', joueur.id).order('date_realisation')
    if (data) setReals(data as unknown as MPRealisation[])
    setMpWellnessDate(null)
    setMpWellnessData({ fatigue: 5, rpe: 5, courbatures: 5, qualite_sommeil: 5, notes: '' })
  }

  function toggleJour(ds: string) {
    setJoursSelectionnes(prev => {
      const next = new Set(prev)
      next.has(ds) ? next.delete(ds) : next.add(ds)
      return next
    })
  }

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const nbDays = 7
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set())
  function toggleExpandSession(id: string) {
    setExpandedSessions(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  const JOUR_NOMS = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM']

  useEffect(() => {
    setLoading(true)
    supabase
      .from('realisations')
      .select('id, seance_id, activite_id, date_realisation, completee, seances(id, nom, type, seance_exercices(id, ordre, series, repetitions, duree_secondes, distance_metres, charge_kg, recuperation_secondes, lien_suivant, uni_podal, notes, sets_config, exercices(nom, video_url, familles(nom, couleur)))), activites(nom)')
      .eq('joueur_id', joueur.id)
      .order('date_realisation')
      .then(({ data, error }) => {
        if (!error && data) setReals(data as unknown as MPRealisation[])
        else setReals(initialReals) // fallback si colonnes manquantes en DB
        setLoading(false)
      })
  }, [joueur.id])

  const days = Array.from({ length: nbDays }, (_, i) => {
    const d = new Date(weekStart + 'T12:00:00')
    d.setDate(d.getDate() + i)
    return d.toISOString().split('T')[0]
  })

  const byDate = reals.reduce((acc, r) => {
    const d = r.date_realisation
    if (!acc[d]) acc[d] = []
    acc[d].push(r)
    return acc
  }, {} as Record<string, MPRealisation[]>)

  function prevWeek() {
    const d = new Date(weekStart + 'T12:00:00'); d.setDate(d.getDate() - nbDays)
    setWeekStart(d.toISOString().split('T')[0])
  }
  function nextWeek() {
    const d = new Date(weekStart + 'T12:00:00'); d.setDate(d.getDate() + nbDays)
    setWeekStart(d.toISOString().split('T')[0])
  }
  function jumpToDate(ds: string) {
    if (isMobile) {
      setWeekStart(ds)
    } else {
      const d = new Date(ds + 'T12:00:00')
      const day = d.getDay()
      d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day))
      setWeekStart(d.toISOString().split('T')[0])
    }
  }

  function patchExoLocal(realisationId: string, exoId: string, updates: Partial<MPSeanceExercice>) {
    setReals(prev => prev.map(r => {
      if (r.id !== realisationId) return r
      return { ...r, seances: r.seances ? { ...r.seances, seance_exercices: r.seances.seance_exercices?.map(e => e.id === exoId ? { ...e, ...updates } : e) } : r.seances }
    }))
  }

  async function saveExoField(exoId: string, updates: Record<string, unknown>) {
    await supabase.from('seance_exercices').update(updates).eq('id', exoId)
  }

  async function removeExo(realisationId: string, exoId: string) {
    setReals(prev => prev.map(r => {
      if (r.id !== realisationId) return r
      return { ...r, seances: r.seances ? { ...r.seances, seance_exercices: r.seances.seance_exercices?.filter(e => e.id !== exoId) } : r.seances }
    }))
    await supabase.from('seance_exercices').delete().eq('id', exoId)
  }

  function moveExo(realisationId: string, exoId: string, dir: -1 | 1) {
    setReals(prev => prev.map(r => {
      if (r.id !== realisationId) return r
      const exos = [...(r.seances?.seance_exercices || [])].sort((a, b) => a.ordre - b.ordre)
      const idx = exos.findIndex(e => e.id === exoId)
      const swap = idx + dir
      if (swap < 0 || swap >= exos.length) return r
      const swapId = exos[swap].id
      ;[exos[idx], exos[swap]] = [exos[swap], exos[idx]]
      const newExos = exos.map((e, i) => ({ ...e, ordre: i + 1 }))
      supabase.from('seance_exercices').update({ ordre: swap + 1 }).eq('id', exoId)
      supabase.from('seance_exercices').update({ ordre: idx + 1 }).eq('id', swapId)
      return { ...r, seances: { ...r.seances!, seance_exercices: newExos } }
    }))
  }

  async function addSet(realisationId: string, exoId: string, exo: MPSeanceExercice) {
    const current = exo.sets_config || []
    const s1: SetConfig = current[0] || { reps: exo.repetitions, charge: exo.charge_kg, recup: exo.recuperation_secondes }
    const newSets = [...current, { ...s1 }]
    const updates = { sets_config: newSets, series: newSets.length }
    patchExoLocal(realisationId, exoId, updates)
    await saveExoField(exoId, updates)
  }

  async function removeSet(realisationId: string, exoId: string, exo: MPSeanceExercice, si: number) {
    const newSets = (exo.sets_config || []).filter((_, i) => i !== si)
    const updates = { sets_config: newSets.length ? newSets : null, series: newSets.length || null }
    patchExoLocal(realisationId, exoId, updates as Partial<MPSeanceExercice>)
    await saveExoField(exoId, updates)
  }

  function patchSet(realisationId: string, exoId: string, exo: MPSeanceExercice, si: number, key: keyof SetConfig, val: string) {
    const current = exo.sets_config || []
    const newSets = current.map((s, i) => i === si ? { ...s, [key]: val === '' ? undefined : Math.max(0, Number(val)) } : s)
    patchExoLocal(realisationId, exoId, { sets_config: newSets })
  }

  async function flushSets(exoId: string, realisationId: string) {
    const fresh = reals.find(r => r.id === realisationId)?.seances?.seance_exercices?.find(e => e.id === exoId)
    if (fresh?.sets_config) await saveExoField(exoId, { sets_config: fresh.sets_config })
  }

  function patchSimple(realisationId: string, exoId: string, key: string, val: string) {
    const v = val === '' ? undefined : Math.max(0, Number(val))
    patchExoLocal(realisationId, exoId, { [key]: v })
  }

  async function flushSimple(exoId: string, realisationId: string, key: string) {
    const fresh = reals.find(r => r.id === realisationId)?.seances?.seance_exercices?.find(e => e.id === exoId)
    if (fresh) await saveExoField(exoId, { [key]: (fresh as Record<string, unknown>)[key] ?? null })
  }

  async function toggleUniPodal(realisationId: string, exo: MPSeanceExercice) {
    const val = !exo.uni_podal
    patchExoLocal(realisationId, exo.id, { uni_podal: val })
    await saveExoField(exo.id, { uni_podal: val })
  }

  async function toggleLienSuivant(realisationId: string, exo: MPSeanceExercice) {
    const val = !exo.lien_suivant
    patchExoLocal(realisationId, exo.id, { lien_suivant: val })
    await saveExoField(exo.id, { lien_suivant: val })
  }

  async function addExoToSession(realisationId: string, exercice: Exercice) {
    const r = reals.find(rx => rx.id === realisationId)
    if (!r?.seances) return
    const ordre = (r.seances.seance_exercices?.length || 0) + 1
    const { data } = await supabase.from('seance_exercices').insert({ seance_id: r.seance_id, exercice_id: exercice.id, ordre }).select('id').single()
    if (data) {
      const newExo: MPSeanceExercice = { id: data.id, ordre, exercices: { nom: exercice.nom, video_url: exercice.video_url || undefined, familles: exercice.familles } }
      setReals(prev => prev.map(rx => rx.id !== realisationId ? rx : { ...rx, seances: { ...rx.seances!, seance_exercices: [...(rx.seances?.seance_exercices || []), newExo] } }))
    }
    setAddExoTo(null)
    setRechercheExo('')
  }

  const weekLabel = (() => {
    const d = new Date(weekStart + 'T12:00:00')
    const fin = new Date(weekStart + 'T12:00:00'); fin.setDate(fin.getDate() + nbDays - 1)
    return `${d.getDate()} ${d.toLocaleDateString('fr-FR', { month: 'short' })} — ${fin.getDate()} ${fin.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}`
  })()

  const setInput = (style?: React.CSSProperties) => ({
    type: 'number' as const,
    style: { width: '100%', background: '#1C1C2C', border: '1px solid #1E1E30', borderRadius: '3px', padding: '3px 2px', color: '#FFF', fontSize: '10px', outline: 'none', textAlign: 'center' as const, ...style },
  })

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: '#0B0B14', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #2C2C44', background: '#18182A', flexShrink: 0 }}>
        {/* Ligne 1 : fermer + titre + joueur */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px 6px' }}>
          <button onClick={onClose} style={{ background: '#FF475720', border: '1px solid #FF475740', borderRadius: '8px', padding: '8px 14px', color: '#FF4757', cursor: 'pointer', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap', flexShrink: 0 }}>✕ Fermer</button>
          <div style={{ fontWeight: '900', fontSize: '13px', letterSpacing: '-0.5px', whiteSpace: 'nowrap', flex: 1 }}>
            <span style={{ color: '#1A6FFF' }}>▦</span> <span style={{ color: '#FFF' }}>MASTER PLANNER</span>
          </div>
          {!isMobile && <span style={{ color: '#7878A8', fontSize: '11px' }}>{joueur.prenom} {joueur.nom}</span>}
          <button
            onClick={() => { setModeSelection(v => !v); setJoursSelectionnes(new Set()) }}
            style={{
              background: modeSelection ? 'rgba(46,204,113,0.15)' : '#181820',
              border: `1px solid ${modeSelection ? '#2ECC7150' : '#2C2C44'}`,
              borderRadius: '8px', padding: '6px 12px',
              color: modeSelection ? '#2ECC71' : '#666',
              cursor: 'pointer', fontSize: '12px', fontWeight: '700',
              flexShrink: 0, whiteSpace: 'nowrap',
            }}>
            {modeSelection ? '✕ Annuler' : '📋 Copier'}
          </button>
        </div>
        {/* Ligne 2 : nav semaine + date picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px 10px' }}>
          <button onClick={prevWeek} style={{ background: '#1C1C2C', border: '1px solid #2C2C44', borderRadius: '8px', padding: '8px 14px', color: '#888', cursor: 'pointer', fontSize: '16px', minHeight: '36px', minWidth: '36px' }}>‹</button>
          <button onClick={nextWeek} style={{ background: '#1C1C2C', border: '1px solid #2C2C44', borderRadius: '8px', padding: '8px 14px', color: '#888', cursor: 'pointer', fontSize: '16px', minHeight: '36px', minWidth: '36px' }}>›</button>
          <span style={{ color: '#A8A8C4', fontSize: '12px', whiteSpace: 'nowrap', flex: 1, fontWeight: '600' }}>{weekLabel}</span>
          <input type="date" onChange={e => e.target.value && jumpToDate(e.target.value)}
            style={{ background: '#1C1C2C', border: '1px solid #2C2C44', borderRadius: '8px', padding: '6px 10px', color: '#007AFF', fontSize: '12px', outline: 'none', cursor: 'pointer', minHeight: '36px' }} />
        </div>
      </div>

      {/* Bannière mode déplacement */}
      {mpMovingSession && (
        <div style={{ padding: '8px 12px', background: '#1A6FFF15', borderBottom: '1px solid #1A6FFF30', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <span style={{ color: '#1A6FFF', fontSize: '14px' }}>↔</span>
          <span style={{ color: '#AAC8FF', fontWeight: '700', fontSize: '12px', flex: 1 }}>Déplacer : <span style={{ color: '#FFF' }}>{mpMovingSession.nom}</span></span>
          <button onClick={() => setMpMovingSession(null)} style={{ background: 'transparent', border: '1px solid #1A6FFF40', borderRadius: '6px', padding: '4px 10px', color: '#1A6FFF', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}>✕ Annuler</button>
        </div>
      )}

      {/* Chargement */}
      {loading && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#1A6FFF', fontSize: '13px', letterSpacing: '2px' }}>CHARGEMENT...</span>
        </div>
      )}

      {/* ══ MOBILE : vue liste verticale style TotalCoaching ══ */}
      {!loading && isMobile && (
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>

          {/* Strip 7 jours */}
          <div style={{ display: 'flex', gap: '4px', padding: '12px 14px 0', flexShrink: 0, position: 'sticky', top: 0, background: '#0B0B14', zIndex: 10 }}>
            {days.map((ds, i) => {
              const dayReals = byDate[ds] || []
              const isToday = ds === today
              const isPast = ds < today
              const hasSessions = dayReals.length > 0
              const allDone = hasSessions && dayReals.every(r => r.completee)
              const someMissed = hasSessions && !allDone && isPast
              const estSel = joursSelectionnes.has(ds)
              const letters = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
              return (
                <div key={ds} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: isToday ? '#1A6FFF' : '#888' }}>{letters[i]}</span>
                  <div style={{
                    width: '100%', aspectRatio: '1', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: estSel ? '#2ECC71' : isToday ? '#1A6FFF' : allDone ? '#2ECC7122' : hasSessions ? '#1A6FFF18' : 'transparent',
                    border: `2px solid ${estSel ? '#2ECC71' : isToday ? '#1A6FFF' : allDone ? '#2ECC7160' : someMissed ? '#FF475760' : hasSessions ? '#1A6FFF50' : '#212135'}`,
                    cursor: hasSessions ? 'pointer' : 'default',
                  }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: estSel || isToday || allDone ? '#FFF' : hasSessions ? (isPast ? '#FF4757' : '#1A6FFF') : '#666' }}>
                      {allDone && !estSel ? '✓' : new Date(ds + 'T12:00:00').getDate()}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Liste des jours */}
          <div style={{ padding: '16px 14px 80px' }}>
            {days.map(ds => {
              const dayReals = byDate[ds] || []
              const isToday = ds === today
              const isPast = ds < today
              const estSel = joursSelectionnes.has(ds)
              const dateLabel = new Date(ds + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase()

              return (
                <div key={ds} style={{ marginBottom: '20px' }}>
                  {/* En-tête de jour */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px', color: isToday ? '#1A6FFF' : estSel ? '#2ECC71' : '#AAAACC' }}>{dateLabel}</span>
                    {mpMovingSession ? (
                      <button onClick={() => mpMoveSession(ds)}
                        style={{ background: ds === mpMovingSession.fromDate ? '#FF475710' : '#1A6FFF15', border: `1px solid ${ds === mpMovingSession.fromDate ? '#FF475740' : '#1A6FFF60'}`, borderRadius: '8px', padding: '6px 12px', color: ds === mpMovingSession.fromDate ? '#FF4757' : '#1A6FFF', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>
                        {ds === mpMovingSession.fromDate ? '✕ Annuler' : '↓ Déposer'}
                      </button>
                    ) : !modeSelection ? (
                      <button onClick={() => { setMpActionDate(ds); setMpSeanceChoisie('') }}
                        style={{ background: '#1C1C2C', border: '1px solid #2C2C44', borderRadius: '8px', width: '32px', height: '32px', color: '#9898B8', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                    ) : (
                      <button onClick={() => toggleJour(ds)} style={{
                        background: estSel ? 'rgba(46,204,113,0.2)' : '#161620',
                        border: `1px solid ${estSel ? '#2ECC71' : '#2C2C44'}`,
                        borderRadius: '8px', width: '32px', height: '32px',
                        color: estSel ? '#2ECC71' : '#555', cursor: 'pointer',
                        fontSize: estSel ? '16px' : '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>{estSel ? '✓' : '○'}</button>
                    )}
                  </div>

                  {/* Séances du jour */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {dayReals.map(r => {
                      if (r.activite_id && !r.seance_id) {
                        return (
                          <div key={r.id} style={{ background: '#C9A84C10', border: '1px solid #C9A84C30', borderLeft: '4px solid #C9A84C', borderRadius: '14px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '18px' }}>🏃</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: '800', fontSize: '14px', color: '#E0C87A' }}>{r.activites?.nom || 'Activité'}</div>
                              <div style={{ fontSize: '11px', color: '#9898B8', marginTop: '2px' }}>Activité planifiée</div>
                            </div>
                            <button onClick={() => { if (confirm('Supprimer cette activité ?')) mpDeleteRealisation(r.id) }}
                              style={{ background: 'transparent', border: 'none', color: '#C9A84C60', cursor: 'pointer', fontSize: '16px', padding: '4px' }}>🗑</button>
                          </div>
                        )
                      }
                      const exos = [...(r.seances?.seance_exercices || [])].sort((a, b) => a.ordre - b.ordre)
                      const isExpanded = expandedSessions.has(r.id)
                      const statusColor = r.completee ? '#2ECC71' : isPast ? '#FF4757' : '#1A6FFF'
                      const typeLabel = LABELS_TYPE[r.seances?.type || ''] || r.seances?.type || ''

                      return (
                        <div key={r.id} style={{ background: '#141420', border: '1px solid #222238', borderRadius: '14px', display: 'flex' }}>
                          {/* Barre colorée */}
                          <div style={{ width: '4px', background: statusColor, flexShrink: 0, borderRadius: '14px 0 0 14px' }} />

                          <div style={{ flex: 1 }}>
                            {/* Header séance */}
                            <div style={{ display: 'flex', alignItems: 'center', padding: '10px 10px 10px 14px', gap: '8px' }}>
                              <button onClick={() => toggleExpandSession(r.id)} style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', padding: 0, minWidth: 0 }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${statusColor}18`, border: `1px solid ${statusColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <span style={{ color: statusColor, fontSize: '18px' }}>{r.completee ? '✓' : isPast ? '✗' : '▶'}</span>
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontWeight: '800', fontSize: '15px', color: '#F0F0F0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.seances?.nom || 'Séance'}</div>
                                  <div style={{ fontSize: '12px', color: '#7878A8', marginTop: '2px' }}>
                                    {exos.length} exercice{exos.length > 1 ? 's' : ''}{typeLabel ? ` · ${typeLabel}` : ''}
                                  </div>
                                </div>
                                <span style={{ color: '#6A6A8A', fontSize: '14px', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}>▼</span>
                              </button>
                              {/* Bouton ⋮ → bottom sheet actions session */}
                              <button onClick={e => { e.stopPropagation(); setMpSessionMenu({ id: r.id, seanceId: r.seance_id!, date: ds, nom: r.seances?.nom || '' }) }}
                                style={{ background: '#1A2A1A', border: '1px solid #2ECC7135', borderRadius: '8px', color: '#2ECC71', cursor: 'pointer', fontSize: '16px', padding: '6px 10px', lineHeight: 1, flexShrink: 0 }}>⋮</button>
                            </div>

                            {/* Liste exercices dépliée */}
                            {isExpanded && (
                              <div style={{ borderTop: '1px solid #1C1C2C', padding: '8px 0 4px' }}>
                                {exos.map((exo, ei) => {
                                  const fam = exo.exercices?.familles
                                  const couleur = fam?.couleur || '#555'
                                  const hasSets = exo.sets_config && exo.sets_config.length > 0
                                  const seriesSummary = (() => {
                                    if (hasSets) {
                                      const s = exo.sets_config![0]
                                      const p = [s.reps && `${s.reps}r`, s.duree && `${s.duree}s`, s.dist && `${s.dist}m`, s.charge && `${s.charge}kg`].filter(Boolean)
                                      return `${exo.sets_config!.length}×${p.join(' ') || '—'}`
                                    }
                                    const p = [exo.repetitions && `${exo.repetitions}r`, exo.duree_secondes && `${exo.duree_secondes}s`, exo.distance_metres && `${exo.distance_metres}m`, exo.charge_kg && `${exo.charge_kg}kg`].filter(Boolean)
                                    return exo.series ? `${exo.series}×${p.join(' ') || '—'}` : p.join(' ') || '—'
                                  })()
                                  return (
                                    <div key={exo.id}>
                                      {exo.lien_suivant === false && ei > 0 && (
                                        <div style={{ height: '1px', background: '#1C1C2C', margin: '0 14px' }} />
                                      )}
                                      <button onClick={() => setExpandedExo({ rId: r.id, eId: exo.id })}
                                        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left', minHeight: '44px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: couleur, flexShrink: 0 }} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                          <span style={{ color: '#CCC', fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{exo.exercices?.nom}</span>
                                          {exo.lien_suivant && <span style={{ fontSize: '10px', color: '#1A6FFF60' }}>⇌ superset</span>}
                                        </div>
                                        <span style={{ color: '#9898B8', fontSize: '11px', fontWeight: '600', flexShrink: 0 }}>{seriesSummary}</span>
                                        <span style={{ color: '#2C2C44', fontSize: '14px', flexShrink: 0 }}>›</span>
                                      </button>
                                    </div>
                                  )
                                })}
                                <div style={{ padding: '6px 14px 10px' }}>
                                  <button onClick={() => { setAddExoTo(r.id); setRechercheExo('') }}
                                    style={{ width: '100%', background: 'transparent', border: '1px dashed #2C2C44', borderRadius: '10px', padding: '10px', color: '#7878A8', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                                    + Ajouter un exercice
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}

                    {dayReals.length === 0 && (
                      <div style={{ color: '#2E2E50', fontSize: '11px', fontWeight: '600', paddingLeft: '2px' }}>Aucune séance</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ══ DESKTOP : grille de colonnes ══ */}
      {!loading && !isMobile && (
      <div onClick={() => mpSessionMenu && setMpSessionMenu(null)} style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: `repeat(${nbDays}, 1fr)`, gap: '1px', background: '#1E1E30', overflow: 'hidden' }}>
        {days.map((ds, di) => {
          const isToday = ds === today
          const dateObj = new Date(ds + 'T12:00:00')
          const dateNum = dateObj.getDate()
          const mois = dateObj.toLocaleDateString('fr-FR', { month: 'short' })
          const dayReals = byDate[ds] || []
          const estSelectionne = joursSelectionnes.has(ds)
          return (
            <div key={ds} style={{
              minHeight: 0,
              background: estSelectionne ? '#0A1F10' : (isToday ? '#0D0D1C' : '#0E0E18'),
              overflowY: 'auto', overflowX: 'hidden',
              outline: estSelectionne ? '2px solid #2ECC7150' : 'none', outlineOffset: '-1px',
            } as React.CSSProperties}>
              {/* Day header — sticky */}
              <div style={{ position: 'sticky', top: 0, zIndex: 2, padding: '8px 6px 6px', borderBottom: '1px solid #222238', background: estSelectionne ? '#0D2015' : (isToday ? '#0C1020' : '#0E0E18') }}>
                <div style={{ textAlign: 'center', marginBottom: '4px' }}>
                  <div style={{ color: estSelectionne ? '#2ECC71' : (isToday ? '#5AABFF' : '#555'), fontSize: '10px', fontWeight: '800', letterSpacing: '0.8px', textTransform: 'uppercase' }}>{JOUR_NOMS[di]}</div>
                  <div style={{ color: estSelectionne ? '#2ECC71' : (isToday ? '#007AFF' : '#888'), fontSize: '22px', fontWeight: '900', lineHeight: 1, marginTop: '1px' }}>{dateNum}</div>
                  <div style={{ color: '#7878A8', fontSize: '10px', marginTop: '1px' }}>{mois}</div>
                </div>
                {!modeSelection && !mpMovingSession && (
                  <button onClick={() => { setMpActionDate(ds); setMpSeanceChoisie('') }}
                    style={{ width: '100%', minHeight: '28px', borderRadius: '6px', border: '1px solid #2C2C44', background: 'transparent', color: '#7878A8', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 0' }}>+</button>
                )}
                {mpMovingSession && (
                  <button onClick={() => mpMoveSession(ds)}
                    style={{ width: '100%', minHeight: '28px', borderRadius: '6px', border: `1px solid ${ds === mpMovingSession.fromDate ? '#FF475740' : '#1A6FFF60'}`, background: ds === mpMovingSession.fromDate ? '#FF475710' : '#1A6FFF15', color: ds === mpMovingSession.fromDate ? '#FF4757' : '#1A6FFF', cursor: 'pointer', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 0' }}>
                    {ds === mpMovingSession.fromDate ? '✕ Annuler' : '↓ Déposer'}
                  </button>
                )}
                {modeSelection && (
                  <button onClick={() => toggleJour(ds)} style={{
                    width: '100%', minHeight: '28px', borderRadius: '6px', cursor: 'pointer',
                    border: `1px solid ${estSelectionne ? '#2ECC71' : '#2C2C44'}`,
                    background: estSelectionne ? 'rgba(46,204,113,0.2)' : 'transparent',
                    color: estSelectionne ? '#2ECC71' : '#444',
                    fontSize: estSelectionne ? '16px' : '13px', fontWeight: '700',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 0',
                  }}>{estSelectionne ? '✓' : '+'}</button>
                )}
              </div>
              {/* Sessions */}
              <div style={{ padding: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {dayReals.map(r => {
                  if (r.activite_id && !r.seance_id) {
                    return (
                      <div key={r.id} style={{ background: '#C9A84C10', border: '1px solid #C9A84C30', borderLeft: '3px solid #C9A84C', borderRadius: '8px', padding: '7px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '14px' }}>🏃</span>
                        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '700', fontSize: '12px', color: '#E0C87A' }}>{r.activites?.nom || 'Activité'}</div>
                        <button onClick={() => { if (confirm('Supprimer cette activité ?')) mpDeleteRealisation(r.id) }}
                          style={{ background: 'transparent', border: 'none', color: '#C9A84C60', cursor: 'pointer', fontSize: '14px', padding: '2px 4px', lineHeight: 1, flexShrink: 0 }}>🗑</button>
                      </div>
                    )
                  }
                  const exos = [...(r.seances?.seance_exercices || [])].sort((a, b) => a.ordre - b.ordre)
                  const typeLabel = (LABELS_TYPE[r.seances?.type || ''] || 'SÉANCE').toUpperCase()
                  return (
                    <div key={r.id} style={{ background: '#18182A', border: '1px solid #2C2C44', borderRadius: '8px', overflow: 'hidden' }}>
                      <div style={{ padding: '7px 8px', borderBottom: '1px solid #1E1E30', display: 'flex', alignItems: 'center', gap: '5px', background: '#18182A', position: 'relative' }}>
                        <div style={{ flex: 1, fontWeight: '700', fontSize: '12px', color: '#DDD', lineHeight: 1.3, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.seances?.nom || 'Séance'}</div>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#9898B8', background: '#18182A', border: '1px solid #282840', borderRadius: '4px', padding: '2px 5px', whiteSpace: 'nowrap', flexShrink: 0 }}>{typeLabel}</span>
                        <button onClick={e => { e.stopPropagation(); setMpSessionMenu(mpSessionMenu?.id === r.id ? null : { id: r.id, seanceId: r.seance_id!, date: ds, nom: r.seances?.nom || '' }) }}
                          style={{ background: '#1A2A1A', border: '1px solid #2ECC7135', borderRadius: '5px', color: '#2ECC71', cursor: 'pointer', fontSize: '13px', padding: '2px 6px', lineHeight: 1, flexShrink: 0 }}>⋮</button>
                        {mpSessionMenu?.id === r.id && (
                          <div style={{ position: 'absolute', top: '100%', right: 0, zIndex: 50, background: '#212135', border: '1px solid #2C2C44', borderRadius: '10px', padding: '6px', minWidth: '180px', boxShadow: '0 8px 24px #000A' }}>
                            <button onClick={() => { setMpDupModal({ seanceId: r.seance_id!, nom: r.seances?.nom || '' }); setMpDupDate(ds); setMpSessionMenu(null) }}
                              style={{ width: '100%', background: 'transparent', border: 'none', color: '#DDD', cursor: 'pointer', padding: '8px 10px', fontSize: '12px', fontWeight: '600', textAlign: 'left', borderRadius: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}>📋 Dupliquer</button>
                            <button onClick={() => { setMpMovingSession({ id: r.id, seanceId: r.seance_id!, fromDate: ds, nom: r.seances?.nom || '' }); setMpSessionMenu(null) }}
                              style={{ width: '100%', background: 'transparent', border: 'none', color: '#1A6FFF', cursor: 'pointer', padding: '8px 10px', fontSize: '12px', fontWeight: '600', textAlign: 'left', borderRadius: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}>↔ Déplacer</button>
                            <div style={{ height: '1px', background: '#2C2C44', margin: '4px 0' }} />
                            <button onClick={() => { if (confirm('Supprimer cette séance ?')) mpDeleteRealisation(r.id) }}
                              style={{ width: '100%', background: 'transparent', border: 'none', color: '#FF4757', cursor: 'pointer', padding: '8px 10px', fontSize: '12px', fontWeight: '600', textAlign: 'left', borderRadius: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}>🗑 Supprimer</button>
                          </div>
                        )}
                      </div>
                      {(() => {
                        const blocs: MPSeanceExercice[][] = []
                        let current: MPSeanceExercice[] = []
                        for (const exo of exos) {
                          current.push(exo)
                          if (!exo.lien_suivant) { blocs.push(current); current = [] }
                        }
                        if (current.length > 0) blocs.push(current)
                        return blocs.map((bloc, blocIdx) => {
                          const isGroup = bloc.length > 1
                          const groupLabel = bloc.length > 2 ? 'CIRCUIT' : 'SUPERSET'
                          const renderExo = (exo: MPSeanceExercice, exoIdx: number, insideGroup: boolean, isLastInGroup = false) => {
                            const fam = exo.exercices?.familles
                            const couleur = fam?.couleur || '#555'
                            const hasSets = exo.sets_config && exo.sets_config.length > 0
                            const hasVideo = !!exo.exercices?.video_url
                            const seriesSummary = (() => {
                              if (hasSets && exo.sets_config!.length > 0) {
                                const s = exo.sets_config![0]
                                const parts = []
                                if (s.reps) parts.push(`${s.reps}r`)
                                if (s.duree) parts.push(`${s.duree}s`)
                                if (s.dist) parts.push(`${s.dist}m`)
                                if (s.charge) parts.push(`${s.charge}kg`)
                                return `${exo.sets_config!.length}×${parts.join(' ')}`
                              }
                              const parts = []
                              if (exo.repetitions) parts.push(`${exo.repetitions}r`)
                              if (exo.duree_secondes) parts.push(`${exo.duree_secondes}s`)
                              if (exo.distance_metres) parts.push(`${exo.distance_metres}m`)
                              if (exo.charge_kg) parts.push(`${exo.charge_kg}kg`)
                              const base = parts.join(' ')
                              return exo.series ? `${exo.series}×${base || '—'}` : base || '—'
                            })()
                            return (
                              <div key={exo.id}>
                                {insideGroup && exoIdx > 0 && (
                                  <div style={{ display: 'flex', alignItems: 'center', padding: '3px 8px 3px 18px', gap: '5px', background: '#1A6FFF08' }}>
                                    <span style={{ color: '#1A6FFF50', fontSize: '10px', flexShrink: 0 }}>⏱</span>
                                    <input
                                      type="number"
                                      placeholder="0"
                                      value={exo.recuperation_secondes ?? ''}
                                      onChange={e => patchSimple(r.id, exo.id, 'recuperation_secondes', e.target.value)}
                                      onBlur={() => flushSimple(exo.id, r.id, 'recuperation_secondes')}
                                      style={{ width: '42px', background: exo.recuperation_secondes ? '#1A6FFF20' : 'transparent', border: `1px solid ${exo.recuperation_secondes ? '#1A6FFF50' : '#1A6FFF25'}`, borderRadius: '4px', padding: '2px 4px', color: '#6AAEFF', fontSize: '10px', fontWeight: '700', outline: 'none', textAlign: 'center' }}
                                    />
                                    <span style={{ color: '#1A6FFF40', fontSize: '10px' }}>s avant cet exo</span>
                                  </div>
                                )}
                                <div style={{ padding: '7px 8px', borderTop: exoIdx > 0 && !insideGroup ? '1px solid #1A1A1A' : 'none', background: 'transparent' }}>
                                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '5px', marginBottom: '5px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', flexShrink: 0, marginTop: '2px' }}>
                                      <button onClick={() => moveExo(r.id, exo.id, -1)} style={{ background: 'none', border: 'none', color: '#2C2C44', cursor: 'pointer', fontSize: '10px', lineHeight: 1, padding: '1px 2px' }}>▲</button>
                                      <button onClick={() => moveExo(r.id, exo.id, 1)} style={{ background: 'none', border: 'none', color: '#2C2C44', cursor: 'pointer', fontSize: '10px', lineHeight: 1, padding: '1px 2px' }}>▼</button>
                                    </div>
                                    {hasVideo ? (
                                      <button onClick={() => window.open(exo.exercices!.video_url!.replace('vimeo.com/', 'player.vimeo.com/video/'), '_blank')}
                                        style={{ width: '24px', height: '24px', background: '#212135', border: '1px solid #2C2C44', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '11px', color: '#1A6FFF' }}>▶</button>
                                    ) : (
                                      <div style={{ width: '24px', height: '24px', background: couleur + '18', border: `1px solid ${couleur}30`, borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <span style={{ color: couleur, fontSize: '10px', fontWeight: '900' }}>{exo.ordre}</span>
                                      </div>
                                    )}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      {fam && <div style={{ color: couleur, fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: 1 }}>{fam.nom}</div>}
                                      <div style={{ color: '#DDD', fontWeight: '700', fontSize: '10px', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exo.exercices?.nom}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                                      <button onClick={() => toggleUniPodal(r.id, exo)} style={{ background: exo.uni_podal ? '#1A6FFF20' : 'transparent', border: `1px solid ${exo.uni_podal ? '#1A6FFF60' : '#252525'}`, color: exo.uni_podal ? '#1A6FFF' : '#333', fontSize: '10px', padding: '2px 4px', borderRadius: '3px', cursor: 'pointer', fontWeight: '700' }}>↔</button>
                                      <button onClick={() => removeExo(r.id, exo.id)} style={{ background: 'transparent', border: '1px solid #FF475718', color: '#FF475760', borderRadius: '3px', padding: '2px 4px', cursor: 'pointer', fontSize: '11px' }}>✕</button>
                                    </div>
                                  </div>
                                  <div style={{ marginBottom: '4px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '14px 36px 36px 36px 36px 36px 14px', gap: '2px', padding: '1px 2px', marginBottom: '1px' }}>
                                      {['', 'Reps', 'Dur', 'Dist', 'Kg', isLastInGroup ? 'Réc↺' : 'Réc', ''].map((h, hi) => (
                                        <div key={hi} style={{ color: hi === 5 && isLastInGroup ? '#2ECC7180' : '#2C2C44', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', textAlign: 'center' }}>{h}</div>
                                      ))}
                                    </div>
                                    {hasSets ? (
                                      exo.sets_config!.map((s, si) => (
                                        <div key={si} style={{ display: 'grid', gridTemplateColumns: '14px 36px 36px 36px 36px 36px 14px', gap: '2px', padding: '2px', background: si % 2 === 0 ? '#0A0A0A' : 'transparent', borderRadius: '3px', alignItems: 'center', marginBottom: '1px' }}>
                                          <div style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', textAlign: 'center' }}>{si + 1}</div>
                                          {(['reps', 'duree', 'dist', 'charge', 'recup'] as (keyof SetConfig)[]).map(key => (
                                            <input key={key} {...setInput()} placeholder="-" value={s[key] ?? ''} onChange={e => patchSet(r.id, exo.id, exo, si, key, e.target.value)} onBlur={() => flushSets(exo.id, r.id)} />
                                          ))}
                                          <button onClick={() => removeSet(r.id, exo.id, exo, si)} style={{ background: 'transparent', border: 'none', color: '#FF475740', cursor: 'pointer', fontSize: '10px', padding: '0', lineHeight: 1 }}>✕</button>
                                        </div>
                                      ))
                                    ) : (
                                      <div style={{ display: 'grid', gridTemplateColumns: '14px 36px 36px 36px 36px 36px 14px', gap: '2px', padding: '2px', alignItems: 'center' }}>
                                        <div style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', textAlign: 'center' }}>{exo.series || '—'}</div>
                                        {[
                                          ['repetitions', exo.repetitions],
                                          ['duree_secondes', exo.duree_secondes],
                                          ['distance_metres', exo.distance_metres],
                                          ['charge_kg', exo.charge_kg],
                                          [isLastInGroup ? 'recuperation_inter_sets' : 'recuperation_secondes', isLastInGroup ? exo.recuperation_inter_sets : exo.recuperation_secondes],
                                        ].map(([key, val]) => (
                                          <input key={key as string} {...setInput(isLastInGroup && key === 'recuperation_inter_sets' ? { border: '1px solid #2ECC7130' } : {})} placeholder="-" value={(val as number) ?? ''} onChange={e => patchSimple(r.id, exo.id, key as string, e.target.value)} onBlur={() => flushSimple(exo.id, r.id, key as string)} />
                                        ))}
                                        <div />
                                      </div>
                                    )}
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <button onClick={() => addSet(r.id, exo.id, exo)} style={{ background: '#1C1C2C', border: '1px solid #2C2C44', borderRadius: '4px', padding: '2px 7px', color: '#A8A8C4', cursor: 'pointer', fontSize: '10px', fontWeight: '600', whiteSpace: 'nowrap' }}>+ Série</button>
                                    <input type="number" placeholder="×" value={exo.series ?? ''} onChange={async e => {
                                      const val = e.target.value === '' ? undefined : Math.max(1, Number(e.target.value))
                                      if (!val) return
                                      const current = exo.sets_config || []
                                      if (current.length > 0) {
                                        let newSets: SetConfig[]
                                        if (val > current.length) {
                                          const last = current[current.length - 1] || {}
                                          newSets = [...current, ...Array.from({ length: val - current.length }, () => ({ ...last }))]
                                        } else {
                                          newSets = current.slice(0, val)
                                        }
                                        const updates = { sets_config: newSets, series: newSets.length }
                                        patchExoLocal(r.id, exo.id, updates)
                                        await saveExoField(exo.id, updates)
                                      } else {
                                        patchExoLocal(r.id, exo.id, { series: val })
                                        await saveExoField(exo.id, { series: val })
                                      }
                                    }} style={{ width: '28px', background: '#1C1C2C', border: '1px solid #2C2C44', borderRadius: '4px', padding: '2px 3px', color: '#888', fontSize: '11px', outline: 'none', textAlign: 'center' }} />
                                    <div style={{ flex: 1 }} />
                                    {exos.length > 1 && (
                                      <button onClick={() => { setMpCopyExoModal({ fromExo: exo, realisationId: r.id }); setMpCopyExoTargets(new Set()) }} title="Dupliquer les données vers d'autres exercices" style={{ background: '#1A2A1A', border: '1px solid #2ECC7135', borderRadius: '4px', padding: '2px 7px', color: '#2ECC71', cursor: 'pointer', fontSize: '10px', fontWeight: '700', whiteSpace: 'nowrap' }}>⊕ copier</button>
                                    )}
                                    <button onClick={() => toggleLienSuivant(r.id, exo)} title={exo.lien_suivant ? 'Délier' : 'Lier en superset'} style={{ background: exo.lien_suivant ? '#1A6FFF20' : 'transparent', border: `1px solid ${exo.lien_suivant ? '#1A6FFF50' : '#2C2C44'}`, borderRadius: '4px', padding: '2px 6px', color: exo.lien_suivant ? '#1A6FFF' : '#333', cursor: 'pointer', fontSize: '10px' }}>⇌</button>
                                  </div>
                                </div>
                              </div>
                            )
                          }
                          return (
                            <div key={`bloc-${blocIdx}`} style={isGroup ? { borderLeft: '4px solid #1A6FFF', background: '#1A6FFF12', margin: '4px 0', borderRadius: '0 6px 6px 0' } : { marginTop: blocIdx > 0 ? '1px' : '0' }}>
                              {isGroup && (
                                <div style={{ padding: '4px 8px', background: '#1A6FFF30', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <span style={{ color: '#6AAEFF', fontSize: '11px', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>⇌ {groupLabel}</span>
                                </div>
                              )}
                              {bloc.map((exo, ei) => renderExo(exo, ei, isGroup, ei === bloc.length - 1))}
                              {isGroup && (() => {
                                const lastExo = bloc[bloc.length - 1]
                                return (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 8px 6px', borderTop: '1px solid #1A6FFF20', background: '#1A6FFF08' }}>
                                    <span style={{ color: '#2ECC7180', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Récup après</span>
                                    <input
                                      type="number"
                                      placeholder="0"
                                      value={lastExo.recuperation_secondes ?? ''}
                                      onChange={e => patchSimple(r.id, lastExo.id, 'recuperation_secondes', e.target.value)}
                                      onBlur={() => flushSimple(lastExo.id, r.id, 'recuperation_secondes')}
                                      style={{ width: '44px', background: lastExo.recuperation_secondes ? '#2ECC7115' : 'transparent', border: `1px solid ${lastExo.recuperation_secondes ? '#2ECC7150' : '#2C2C44'}`, borderRadius: '4px', padding: '3px 4px', color: '#2ECC71', fontSize: '11px', fontWeight: '700', outline: 'none', textAlign: 'center' }}
                                    />
                                    <span style={{ color: '#2ECC7150', fontSize: '10px' }}>s</span>
                                  </div>
                                )
                              })()}
                            </div>
                          )
                        })
                      })()}
                      <div style={{ padding: '5px' }}>
                        <button onClick={() => { setAddExoTo(r.id); setRechercheExo('') }} style={{ width: '100%', background: '#0B0B14', border: '1px dashed #2C2C44', borderRadius: '6px', padding: '8px 4px', color: '#7878A8', cursor: 'pointer', fontSize: '11px', fontWeight: '600', minHeight: '36px' }}>+ exercice</button>
                      </div>
                    </div>
                  )
                })}
                {dayReals.length === 0 && <div style={{ color: '#212135', fontSize: '12px', textAlign: 'center', paddingTop: '24px' }}>—</div>}
              </div>
            </div>
          )
        })}
      </div>
      )}

      {/* MP — Modal Copier données exercice vers autres exercices */}
      {mpCopyExoModal && (() => {
        const r = reals.find(rx => rx.id === mpCopyExoModal.realisationId)
        const allExos = [...(r?.seances?.seance_exercices || [])].sort((a, b) => a.ordre - b.ordre)
        const otherExos = allExos.filter(e => e.id !== mpCopyExoModal.fromExo.id)
        return (
          <>
            <div onClick={() => { setMpCopyExoModal(null); setMpCopyExoTargets(new Set()) }}
              style={{ position: 'fixed', inset: 0, zIndex: 450, background: 'rgba(0,0,0,0.7)' }} />
            <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 451, background: '#18182A', borderRadius: '16px 16px 0 0', border: '1px solid #2C2C44', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
                <div style={{ width: '36px', height: '4px', background: '#3A3A55', borderRadius: '2px' }} />
              </div>
              <div style={{ padding: '8px 16px 12px', borderBottom: '1px solid #1E1E30' }}>
                <div style={{ fontWeight: '800', fontSize: '16px', marginBottom: '4px' }}>⊕ Copier les données</div>
                <div style={{ color: '#888', fontSize: '13px' }}>
                  Depuis <span style={{ color: '#FFF', fontWeight: '700' }}>{mpCopyExoModal.fromExo.exercices?.nom}</span> vers :
                </div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {otherExos.map(exo => {
                  const fam = exo.exercices?.familles
                  const couleur = fam?.couleur || '#555'
                  const isSelected = mpCopyExoTargets.has(exo.id)
                  const hasSets = exo.sets_config && exo.sets_config.length > 0
                  const summary = hasSets
                    ? `${exo.sets_config!.length} séries configurées`
                    : [exo.series ? `${exo.series}×` : '', exo.repetitions ? `${exo.repetitions}r` : '', exo.charge_kg ? `${exo.charge_kg}kg` : ''].filter(Boolean).join(' ') || '—'
                  return (
                    <div key={exo.id} onClick={() => setMpCopyExoTargets(prev => { const next = new Set(prev); isSelected ? next.delete(exo.id) : next.add(exo.id); return next })}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: isSelected ? '#1A6FFF15' : '#181818', border: `1px solid ${isSelected ? '#1A6FFF50' : '#252525'}`, borderRadius: '12px', cursor: 'pointer' }}>
                      <div style={{ width: '32px', height: '32px', background: couleur + '20', border: `1px solid ${couleur}40`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: couleur, fontSize: '11px', fontWeight: '900' }}>{exo.ordre}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {fam && <div style={{ color: couleur, fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>{fam.nom}</div>}
                        <div style={{ color: isSelected ? '#FFF' : '#CCC', fontWeight: '700', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exo.exercices?.nom}</div>
                        <div style={{ color: '#9898B8', fontSize: '11px' }}>{summary}</div>
                      </div>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `2px solid ${isSelected ? '#1A6FFF' : '#333'}`, background: isSelected ? '#1A6FFF' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {isSelected && <span style={{ color: '#FFF', fontSize: '12px', fontWeight: '900' }}>✓</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div style={{ padding: '12px 16px 32px', borderTop: '1px solid #1E1E30', display: 'flex', gap: '10px' }}>
                <button onClick={() => { setMpCopyExoModal(null); setMpCopyExoTargets(new Set()) }}
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #2C2C44', background: 'transparent', color: '#9898B8', cursor: 'pointer', fontSize: '14px' }}>Annuler</button>
                <button onClick={mpCopyExoToTargets} disabled={mpCopyExoTargets.size === 0}
                  style={{ flex: 2, padding: '14px', borderRadius: '12px', border: 'none', background: mpCopyExoTargets.size > 0 ? '#1A6FFF' : '#333', color: '#FFF', cursor: mpCopyExoTargets.size > 0 ? 'pointer' : 'not-allowed', fontWeight: '700', fontSize: '14px' }}>
                  Copier vers {mpCopyExoTargets.size > 0 ? `${mpCopyExoTargets.size} exercice${mpCopyExoTargets.size > 1 ? 's' : ''}` : '…'}
                </button>
              </div>
            </div>
          </>
        )
      })()}

      {/* MP — Bottom sheet actions session (⋮) */}
      {mpSessionMenu && !mpDupModal && (
        <>
          <div onClick={() => setMpSessionMenu(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 450, background: 'rgba(0,0,0,0.6)' }} />
          <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 451, background: '#18182A', borderRadius: '16px 16px 0 0', border: '1px solid #2C2C44', padding: '16px 16px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <div style={{ width: '36px', height: '4px', background: '#3A3A55', borderRadius: '2px' }} />
            </div>
            <div style={{ color: '#888', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mpSessionMenu.nom}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button onClick={() => { setMpDupModal({ seanceId: mpSessionMenu.seanceId, nom: mpSessionMenu.nom }); setMpDupDate(''); setMpDupJoueurId(''); setMpSessionMenu(null) }}
                style={{ width: '100%', background: '#212135', border: '1px solid #2C2C44', borderRadius: '12px', padding: '14px 16px', color: '#FFF', cursor: 'pointer', fontSize: '15px', fontWeight: '600', textAlign: 'left', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '20px' }}>📋</span> Dupliquer la séance
              </button>
              <button onClick={() => { setMpMovingSession({ id: mpSessionMenu.id, seanceId: mpSessionMenu.seanceId, fromDate: mpSessionMenu.date, nom: mpSessionMenu.nom }); setMpSessionMenu(null) }}
                style={{ width: '100%', background: '#212135', border: '1px solid #2C2C44', borderRadius: '12px', padding: '14px 16px', color: '#FFF', cursor: 'pointer', fontSize: '15px', fontWeight: '600', textAlign: 'left', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '20px' }}>↔</span> Déplacer la séance
              </button>
              <button onClick={() => setMpSessionMenu(null)}
                style={{ width: '100%', background: 'transparent', border: '1px solid #2C2C44', borderRadius: '12px', padding: '14px', color: '#9898B8', cursor: 'pointer', fontSize: '15px', marginTop: '4px' }}>Annuler</button>
            </div>
          </div>
        </>
      )}

      {/* MP — Modal Dupliquer session (bottom sheet) */}
      {mpDupModal && (
        <>
          <div onClick={() => { setMpDupModal(null); setMpDupDate(''); setMpDupJoueurId('') }}
            style={{ position: 'fixed', inset: 0, zIndex: 450, background: 'rgba(0,0,0,0.7)' }} />
          <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 451, background: '#18182A', borderRadius: '16px 16px 0 0', border: '1px solid #2C2C44', padding: '20px 16px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <div style={{ width: '36px', height: '4px', background: '#3A3A55', borderRadius: '2px' }} />
            </div>
            <div style={{ fontWeight: '800', fontSize: '16px', marginBottom: '4px' }}>📋 Dupliquer la séance</div>
            <div style={{ color: '#888', fontSize: '13px', marginBottom: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mpDupModal.nom}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div>
                <div style={{ color: '#9898B8', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Date cible</div>
                <input type="date" value={mpDupDate} onChange={e => setMpDupDate(e.target.value)}
                  style={{ width: '100%', background: '#212135', border: '1px solid #2C2C44', borderRadius: '10px', padding: '10px 12px', color: '#FFF', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const }} />
              </div>
              <div>
                <div style={{ color: '#9898B8', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Joueur (optionnel)</div>
                <select value={mpDupJoueurId} onChange={e => setMpDupJoueurId(e.target.value)}
                  style={{ width: '100%', background: '#212135', border: '1px solid #2C2C44', borderRadius: '10px', padding: '10px 12px', color: mpDupJoueurId ? '#FFF' : '#555', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const }}>
                  <option value="">— Même joueur ({joueur.prenom} {joueur.nom}) —</option>
                  {allJoueurs.filter(j => j.id !== joueur.id).map(j => (
                    <option key={j.id} value={j.id}>{j.nom} {j.prenom}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => { setMpDupModal(null); setMpDupDate(''); setMpDupJoueurId('') }}
                style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #2C2C44', background: 'transparent', color: '#9898B8', cursor: 'pointer', fontSize: '14px' }}>Annuler</button>
              <button onClick={mpDupSession} disabled={!mpDupDate}
                style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: mpDupDate ? '#1A6FFF' : '#333', color: '#FFF', cursor: mpDupDate ? 'pointer' : 'not-allowed', fontWeight: '700', fontSize: '14px' }}>Dupliquer</button>
            </div>
          </div>
        </>
      )}

      {/* MP — Menu action + / Wellness */}
      {mpActionDate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400 }}
          onClick={() => setMpActionDate(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#18182A', border: '1px solid #2C2C44', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '340px' }}>
            <div style={{ fontWeight: '800', fontSize: '16px', marginBottom: '4px' }}>Ajouter</div>
            <div style={{ color: '#C9A84C', fontSize: '13px', marginBottom: '20px' }}>
              {new Date(mpActionDate + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '14px', borderRadius: '14px', border: '1px solid #1A6FFF40', background: '#1A6FFF10' }}>
                <div style={{ color: '#1A6FFF', fontWeight: '700', fontSize: '14px' }}>📋 Session d'entraînement</div>
                <SearchableSelect
                  value={mpSeanceChoisie}
                  items={mpTemplates}
                  onChange={t => setMpSeanceChoisie(t.id)}
                  placeholder="Choisir un modèle..."
                  triggerStyle={{ width: '100%', fontSize: '13px' }}
                  zIndex={450}
                />
                <button onClick={() => mpAttribuerSession(mpActionDate!)} disabled={!mpSeanceChoisie}
                  style={{ padding: '10px', borderRadius: '10px', border: 'none', background: mpSeanceChoisie ? '#1A6FFF' : '#333', color: '#FFF', cursor: mpSeanceChoisie ? 'pointer' : 'not-allowed', fontWeight: '700', fontSize: '14px' }}>
                  Ajouter au planning
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '2px 0' }}>
                  <div style={{ flex: 1, height: '1px', background: '#1A6FFF20' }} />
                  <span style={{ color: '#1A6FFF40', fontSize: '11px', fontWeight: '700' }}>OU</span>
                  <div style={{ flex: 1, height: '1px', background: '#1A6FFF20' }} />
                </div>
                <button onClick={() => { setMpNouvelleSeanceDate(mpActionDate); setMpActionDate(null) }}
                  style={{ padding: '10px', borderRadius: '10px', border: '1px solid #1A6FFF40', background: 'transparent', color: '#5599FF', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                  + Créer une nouvelle séance
                </button>
              </div>
              <button onClick={() => { setMpWellnessDate(mpActionDate); setMpWellnessData({ fatigue: 5, rpe: 5, courbatures: 5, qualite_sommeil: 5, notes: '' }); setMpActionDate(null) }}
                style={{ padding: '16px', borderRadius: '14px', border: '1px solid #2ECC7140', background: '#2ECC7115', color: '#2ECC71', cursor: 'pointer', fontSize: '15px', fontWeight: '700', textAlign: 'left' }}>
                💚 Indices Wellness
              </button>
            </div>
            <button onClick={() => setMpActionDate(null)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #2C2C44', background: 'transparent', color: '#9898B8', cursor: 'pointer', fontSize: '14px' }}>Annuler</button>
          </div>
        </div>
      )}

      {/* MP — Modal Wellness */}
      {mpWellnessDate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400 }}>
          <div style={{ background: '#18182A', border: '1px solid #2C2C44', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '440px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
              <div style={{ fontWeight: '800', fontSize: '17px' }}>💚 Wellness</div>
              <button onClick={() => setMpWellnessDate(null)} style={{ background: 'none', border: 'none', color: '#888', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ color: '#C9A84C', fontSize: '13px', marginBottom: '24px' }}>
              {new Date(mpWellnessDate + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            {([
              { key: 'fatigue', label: 'Fatigue', color: '#FF4757', desc: '1 = reposé · 10 = épuisé' },
              { key: 'rpe', label: 'Effort perçu (RPE)', color: '#1A6FFF', desc: '1 = très facile · 10 = maximal' },
              { key: 'courbatures', label: 'Courbatures', color: '#FF6B35', desc: '1 = aucune · 10 = très douloureux' },
              { key: 'qualite_sommeil', label: 'Qualité du sommeil', color: '#2ECC71', desc: '1 = très mauvais · 10 = excellent' },
            ] as { key: keyof typeof mpWellnessData; label: string; color: string; desc: string }[]).map(({ key, label, color, desc }) => (
              <div key={key} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px', color }}>{label}</div>
                    <div style={{ color: '#9898B8', fontSize: '11px' }}>{desc}</div>
                  </div>
                  <div style={{ color, fontWeight: '900', fontSize: '28px', minWidth: '40px', textAlign: 'center', lineHeight: 1 }}>
                    {key !== 'notes' && mpWellnessData[key]}
                  </div>
                </div>
                <input type="range" min="1" max="10" value={mpWellnessData[key] as number}
                  onChange={e => setMpWellnessData(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: color, height: '6px', cursor: 'pointer' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6A6A8A', fontSize: '10px', marginTop: '2px' }}>
                  <span>1</span><span>5</span><span>10</span>
                </div>
              </div>
            ))}
            <textarea placeholder="Notes (optionnel)..." value={mpWellnessData.notes}
              onChange={e => setMpWellnessData(prev => ({ ...prev, notes: e.target.value }))}
              style={{ width: '100%', background: '#212135', border: '1px solid #2C2C44', borderRadius: '10px', padding: '12px', color: '#FFF', fontSize: '14px', outline: 'none', resize: 'none', minHeight: '80px', marginBottom: '16px', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setMpWellnessDate(null)} style={{ flex: 1, padding: '13px', borderRadius: '12px', border: '1px solid #2C2C44', background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '14px' }}>Annuler</button>
              <button onClick={mpSauvegarderWellness} style={{ flex: 2, padding: '13px', borderRadius: '12px', border: 'none', background: '#2ECC71', color: '#FFF', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {addExoTo && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400 }}>
          <div style={{ background: '#18182A', border: '1px solid #2C2C44', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '440px', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700' }}>Ajouter un exercice</h3>
              <button onClick={() => setAddExoTo(null)} style={{ background: 'none', border: 'none', color: '#888', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <input value={rechercheExo} onChange={e => setRechercheExo(e.target.value)} placeholder="Rechercher..."
              autoFocus
              style={{ background: '#212135', border: '1px solid #2C2C44', borderRadius: '8px', padding: '10px 14px', color: '#FFF', fontSize: '14px', outline: 'none', marginBottom: '10px' }} />
            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {exercices.filter(e => e.nom.toLowerCase().includes(rechercheExo.toLowerCase())).map(ex => (
                <button key={ex.id} onClick={() => addExoToSession(addExoTo, ex)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#212135', border: '1px solid #2C2C44', borderRadius: '8px', padding: '10px 14px', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ color: '#FFF', fontSize: '13px', fontWeight: '600' }}>{ex.nom}</span>
                  {ex.familles && <span style={{ fontSize: '10px', color: ex.familles.couleur, background: ex.familles.couleur + '20', padding: '2px 8px', borderRadius: '8px' }}>{ex.familles.nom}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MP — Créer une nouvelle séance */}
      {mpNouvelleSeanceDate && (
        <div style={{ position: 'fixed', inset: 0, background: '#0B0B14', zIndex: 500, overflowY: 'auto' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', padding: '24px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <button onClick={() => setMpNouvelleSeanceDate(null)}
                style={{ background: 'none', border: '1px solid #2C2C44', borderRadius: '8px', padding: '8px 12px', color: '#888', cursor: 'pointer', fontSize: '13px' }}>← Annuler</button>
              <div>
                <div style={{ fontWeight: '800', fontSize: '16px' }}>Nouvelle séance</div>
                <div style={{ color: '#C9A84C', fontSize: '12px' }}>
                  {new Date(mpNouvelleSeanceDate + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} — {joueur.prenom} {joueur.nom}
                </div>
              </div>
            </div>
            <EditeurSeance
              seance={{ id: '', nom: '', type: 'complete', notes: '', est_template: false, seance_exercices: [] }}
              exercices={exercices}
              joueurId={joueur.id}
              dateAttribution={mpNouvelleSeanceDate}
              sauvegarderFavori={false}
              onSave={async (seanceId) => {
                if (seanceId) await mpAttribuerSessionId(mpNouvelleSeanceDate, seanceId)
                setMpNouvelleSeanceDate(null)
              }}
              onCancel={() => setMpNouvelleSeanceDate(null)}
            />
          </div>
        </div>
      )}

      {/* ── MOBILE BOTTOM SHEET : édition exercice ── */}
      {isMobile && expandedExo && (() => {
        const r = reals.find(r => r.id === expandedExo.rId)
        const exo = r?.seances?.seance_exercices?.find(e => e.id === expandedExo.eId)
        if (!r || !exo) return null
        const fam = exo.exercices?.familles
        const couleur = fam?.couleur || '#555'
        const hasSets = exo.sets_config && exo.sets_config.length > 0
        const inputLg: React.CSSProperties = { background: '#212135', border: '1px solid #2C2C44', borderRadius: '8px', padding: '10px', color: '#FFF', fontSize: '16px', outline: 'none', textAlign: 'center', width: '100%', boxSizing: 'border-box' as const }
        return (
          <>
            {/* Backdrop */}
            <div onClick={() => setExpandedExo(null)} style={{ position: 'fixed', inset: 0, zIndex: 400, background: '#00000080' }} />
            {/* Sheet */}
            <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 401, background: '#18182A', borderRadius: '16px 16px 0 0', border: '1px solid #2C2C44', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
              {/* Handle */}
              <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
                <div style={{ width: '36px', height: '4px', background: '#3A3A55', borderRadius: '2px' }} />
              </div>
              {/* Header */}
              <div style={{ padding: '8px 16px 12px', borderBottom: '1px solid #1E1E30' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: exo.exercices?.video_url ? '10px' : '0' }}>
                  <div style={{ width: '32px', height: '32px', background: couleur + '20', border: `1px solid ${couleur}40`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: couleur, fontSize: '12px', fontWeight: '900' }}>{exo.ordre}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {fam && <div style={{ color: couleur, fontSize: '10px', fontWeight: '800', textTransform: 'uppercase' }}>{fam.nom}</div>}
                    <div style={{ color: '#FFF', fontWeight: '800', fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exo.exercices?.nom}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => { moveExo(r.id, exo.id, -1) }} style={{ background: '#212135', border: '1px solid #2C2C44', borderRadius: '8px', padding: '8px 12px', color: '#888', cursor: 'pointer', fontSize: '14px' }}>▲</button>
                    <button onClick={() => { moveExo(r.id, exo.id, 1) }} style={{ background: '#212135', border: '1px solid #2C2C44', borderRadius: '8px', padding: '8px 12px', color: '#888', cursor: 'pointer', fontSize: '14px' }}>▼</button>
                    <button onClick={() => { removeExo(r.id, exo.id); setExpandedExo(null) }} style={{ background: '#FF475710', border: '1px solid #FF475730', borderRadius: '8px', padding: '8px 12px', color: '#FF4757', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                  </div>
                </div>
                {exo.exercices?.video_url && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0D1A2E', border: '1px solid #1A6FFF30', borderRadius: '10px', padding: '8px 12px' }}>
                    <span style={{ color: '#1A6FFF', fontSize: '13px' }}>▶</span>
                    <span style={{ color: '#888', fontSize: '11px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exo.exercices.video_url}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(exo.exercices!.video_url!).then(() => toast('Lien copié !', 'success'))}
                      style={{ background: '#1A6FFF20', border: '1px solid #1A6FFF40', borderRadius: '7px', padding: '5px 10px', color: '#1A6FFF', cursor: 'pointer', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>
                      Copier
                    </button>
                    <button
                      onClick={() => window.open(exo.exercices!.video_url!, '_blank')}
                      style={{ background: '#1A6FFF', border: 'none', borderRadius: '7px', padding: '5px 10px', color: '#FFF', cursor: 'pointer', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>
                      Ouvrir
                    </button>
                  </div>
                )}
              </div>
              {/* Body scrollable */}
              <div style={{ overflowY: 'auto', flex: 1, padding: '16px' }}>
                {/* Nb séries */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ color: '#9898B8', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Séries</span>
                  <input type="number" placeholder="—" value={exo.series ?? ''}
                    onChange={async e => {
                      const val = e.target.value === '' ? undefined : Math.max(1, Number(e.target.value))
                      patchExoLocal(r.id, exo.id, { series: val })
                      await saveExoField(exo.id, { series: val ?? null })
                    }}
                    style={{ ...inputLg, width: '80px' }} />
                  <button onClick={() => addSet(r.id, exo.id, exo)}
                    style={{ background: '#1A6FFF20', border: '1px solid #1A6FFF40', borderRadius: '10px', padding: '10px 18px', color: '#1A6FFF', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}>+ Série</button>
                  <div style={{ flex: 1 }} />
                  <button onClick={() => toggleLienSuivant(r.id, exo)}
                    style={{ background: exo.lien_suivant ? '#1A6FFF20' : '#212135', border: `1px solid ${exo.lien_suivant ? '#1A6FFF50' : '#2C2C44'}`, borderRadius: '10px', padding: '10px 14px', color: exo.lien_suivant ? '#1A6FFF' : '#555', cursor: 'pointer', fontSize: '14px' }}>⇌</button>
                </div>

                {/* Table sets */}
                {hasSets ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* Headers */}
                    <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 1fr 1fr 1fr 28px', gap: '6px', padding: '0 2px' }}>
                      {['', 'Reps', 'Dur', 'Dist', 'Kg', 'Réc', ''].map((h, hi) => (
                        <div key={hi} style={{ color: '#9898B8', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', textAlign: 'center' }}>{h}</div>
                      ))}
                    </div>
                    {exo.sets_config!.map((s, si) => (
                      <div key={si} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 1fr 1fr 1fr 28px', gap: '6px', alignItems: 'center' }}>
                        <div style={{ color: '#C9A84C', fontSize: '13px', fontWeight: '800', textAlign: 'center' }}>{si + 1}</div>
                        {(['reps', 'duree', 'dist', 'charge', 'recup'] as (keyof SetConfig)[]).map(key => (
                          <input key={key} type="number" placeholder="-" min="0"
                            value={s[key] ?? ''}
                            onChange={e => patchSet(r.id, exo.id, exo, si, key, e.target.value)}
                            onBlur={() => flushSets(exo.id, r.id)}
                            style={inputLg} />
                        ))}
                        <button onClick={() => removeSet(r.id, exo.id, exo, si)}
                          style={{ background: 'transparent', border: 'none', color: '#FF475760', cursor: 'pointer', fontSize: '16px', padding: '0' }}>✕</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '8px' }}>
                    {[
                      ['Reps', 'repetitions', exo.repetitions],
                      ['Dur (s)', 'duree_secondes', exo.duree_secondes],
                      ['Dist (m)', 'distance_metres', exo.distance_metres],
                      ['Kg', 'charge_kg', exo.charge_kg],
                      ['Réc (s)', 'recuperation_secondes', exo.recuperation_secondes],
                    ].map(([label, key, val]) => (
                      <div key={key as string} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ color: '#9898B8', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', textAlign: 'center' }}>{label as string}</div>
                        <input type="number" placeholder="-" min="0"
                          value={(val as number) ?? ''}
                          onChange={e => patchSimple(r.id, exo.id, key as string, e.target.value)}
                          onBlur={() => flushSimple(exo.id, r.id, key as string)}
                          style={inputLg} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Footer */}
              <div style={{ padding: '12px 16px', borderTop: '1px solid #1E1E30', display: 'flex', gap: '8px' }}>
                {(() => {
                  const allExos = r?.seances?.seance_exercices || []
                  return allExos.length > 1 ? (
                    <button onClick={() => { setMpCopyExoModal({ fromExo: exo, realisationId: r.id }); setMpCopyExoTargets(new Set()); setExpandedExo(null) }}
                      style={{ flex: 1, padding: '14px', background: '#1A2A1A', border: '1px solid #2ECC7135', borderRadius: '12px', color: '#2ECC71', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}>⊕ Copier données</button>
                  ) : null
                })()}
                <button onClick={() => setExpandedExo(null)}
                  style={{ flex: 1, padding: '14px', background: '#212135', border: '1px solid #2C2C44', borderRadius: '12px', color: '#888', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}>Fermer</button>
              </div>
            </div>
          </>
        )
      })()}

      {/* Barre flottante mode sélection */}
      {modeSelection && joursSelectionnes.size > 0 && (
        <div style={{
          position: 'absolute', bottom: '16px', left: '12px', right: '12px', zIndex: 20,
          background: '#0A1A0F', border: '1px solid #2ECC7140', borderRadius: '16px',
          padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px',
          boxShadow: '0 8px 32px rgba(46,204,113,0.15)',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#2ECC71', fontWeight: '800', fontSize: '14px' }}>
              {joursSelectionnes.size} jour{joursSelectionnes.size > 1 ? 's' : ''} sélectionné{joursSelectionnes.size > 1 ? 's' : ''}
            </div>
            <div style={{ color: '#9898B8', fontSize: '11px' }}>
              {[...joursSelectionnes].reduce((n, d) => n + ((byDate[d] || []).filter(r => r.seance_id).length), 0)} séance(s)
            </div>
          </div>
          <button onClick={() => setJoursSelectionnes(new Set())} style={{ background: 'none', border: '1px solid #2C2C44', borderRadius: '8px', padding: '6px 10px', color: '#9898B8', cursor: 'pointer', fontSize: '11px' }}>Effacer</button>
          <button onClick={() => setShowCopierModal(true)} style={{
            background: '#2ECC71', border: 'none', borderRadius: '10px',
            padding: '10px 20px', color: '#000', cursor: 'pointer',
            fontSize: '13px', fontWeight: '800', whiteSpace: 'nowrap',
          }}>Copier →</button>
        </div>
      )}

      {/* Modal copie */}
      {showCopierModal && (
        <CopierJoursModal
          joursSelectionnes={joursSelectionnes}
          byDate={byDate}
          joueurCourant={joueur}
          allJoueurs={allJoueurs}
          onDone={() => { setShowCopierModal(false); setModeSelection(false); setJoursSelectionnes(new Set()) }}
          onClose={() => setShowCopierModal(false)}
        />
      )}
    </div>
  )
}

