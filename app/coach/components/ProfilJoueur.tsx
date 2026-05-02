'use client'

import { Fragment, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

import { Joueur, Realisation, MPRealisation, Exercice, Seance, Groupe } from '../lib/types'
import { SearchableSelect } from './shared/SearchableSelect'
import { haptic, getYoutubeId, getVimeoId } from '../lib/utils'
import { toast } from '../lib/toast'
import { WellnessGraphiques } from './WellnessGraphiques'
import { CopierJoursModal } from './CopierJoursModal'
import { MasterPlannerView } from './MasterPlannerView'
import { ChatView } from './ChatView'
import { AttributionModal } from './AttributionModal'
import { DuplicationModal } from './DuplicationModal'
import { EditeurSeance } from './EditeurSeance'

export function ProfilJoueur({ joueur, onBack }: { joueur: Joueur; onBack: () => void }) {
  const today = new Date().toISOString().split('T')[0]
  const [onglet, setOnglet] = useState<'calendrier' | 'favoris' | 'graphiques' | 'messages'>('calendrier')
  const [showMasterPlanner, setShowMasterPlanner] = useState(false)
  const [coachId, setCoachId] = useState<string | null>(null)
  const [joueurAuthId, setJoueurAuthId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => { if (user) setCoachId(user.id) })
    resolveJoueurAuthId()
  }, [joueur.id])

  async function resolveJoueurAuthId() {
    const { data } = await supabase.from('joueurs').select('auth_id, email').eq('id', joueur.id).single()
    if (data?.auth_id) {
      setJoueurAuthId(data.auth_id)
    } else if (data?.email) {
      // auth_id manquant → le résoudre via l'API admin
      const res = await fetch(`/api/joueurs/auth-id?email=${encodeURIComponent(data.email)}`)
      if (res.ok) {
        const json = await res.json()
        if (json.auth_id) setJoueurAuthId(json.auth_id)
      }
    }
  }
  const [realisations, setRealisations] = useState<Realisation[]>([])
  const [exercices, setExercices] = useState<Exercice[]>([])
  const [favoris, setFavoris] = useState<Seance[]>([])
  const [rangeDebut, setRangeDebut] = useState(() => {
    const d = new Date()
    const day = d.getDay()
    d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day))
    return d.toISOString().split('T')[0]
  })
  const [rangeFin, setRangeFin] = useState(() => {
    const d = new Date()
    const day = d.getDay()
    d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day) + 27) // 4 semaines par défaut
    return d.toISOString().split('T')[0]
  })
  const [createDate, setCreateDate] = useState<string | null>(null)
  const [createMode, setCreateMode] = useState<'choisir' | 'creer'>('choisir')
  const [templates, setTemplates] = useState<{ id: string; nom: string; type: string }[]>([])
  const [seanceChoisie, setSeanceChoisie] = useState('')
  const [seanceEdit, setSeanceEdit] = useState<Seance | null>(null)
  const [seanceDetail, setSeanceDetail] = useState<Realisation | null>(null)
  const [sauvegarderFavori, setSauvegarderFavori] = useState(false)
  const [actionMenuDate, setActionMenuDate] = useState<string | null>(null)
  const [wellnessDate, setWellnessDate] = useState<string | null>(null)
  const [wellnessData, setWellnessData] = useState({ fatigue: 5, rpe: 5, courbatures: 5, qualite_sommeil: 5, notes: '' })
  const [videoModal, setVideoModal] = useState<string | null>(null)
  useEffect(() => { loadData() }, [joueur.id])

  useEffect(() => {
    const joueurId = joueur.id
    async function refreshReals() {
      const { data } = await supabase
        .from('realisations')
        .select('id, seance_id, activite_id, duree_minutes, date_realisation, completee, rpe, fatigue, courbatures, qualite_sommeil, notes_joueur, seances(id, nom, type, est_template, seance_exercices(id, ordre, series, repetitions, duree_secondes, distance_metres, charge_kg, recuperation_secondes, lien_suivant, notes, sets_config, exercices(nom, video_url, consignes_execution, familles(nom, couleur)))), activites(nom)')
        .eq('joueur_id', joueurId).order('date_realisation')
      if (data) setRealisations(data as unknown as Realisation[])
    }
    const channel = supabase
      .channel(`profil-reals-${joueurId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'realisations', filter: `joueur_id=eq.${joueurId}` }, refreshReals)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [joueur.id])

  async function loadData() {
    const [realsRes, tmplRes, exsRes, favsRes] = await Promise.allSettled([
      supabase.from('realisations').select('id, seance_id, activite_id, duree_minutes, date_realisation, completee, rpe, fatigue, courbatures, qualite_sommeil, notes_joueur, seances(id, nom, type, est_template, seance_exercices(id, ordre, series, repetitions, duree_secondes, distance_metres, charge_kg, recuperation_secondes, lien_suivant, notes, sets_config, exercices(nom, video_url, consignes_execution, familles(nom, couleur)))), activites(nom)').eq('joueur_id', joueur.id).order('date_realisation'),
      supabase.from('seances').select('id, nom, type').eq('est_template', true).order('nom').limit(2000),
      supabase.from('exercices').select('*, familles(id, nom, couleur)').order('nom').limit(5000),
      supabase.from('seances').select('*, seance_exercices(*, exercices(nom, familles(id, nom, couleur)))').eq('est_template', true).order('nom').limit(2000),
    ])
    if (realsRes.status === 'fulfilled' && realsRes.value.data) setRealisations(realsRes.value.data as unknown as Realisation[])
    if (tmplRes.status === 'fulfilled' && tmplRes.value.data) setTemplates([...tmplRes.value.data].sort((a, b) => a.nom.localeCompare(b.nom, 'fr')))
    if (exsRes.status === 'fulfilled' && exsRes.value.data) setExercices([...exsRes.value.data].sort((a, b) => a.nom.localeCompare(b.nom, 'fr')))
    if (favsRes.status === 'fulfilled' && favsRes.value.data) setFavoris([...favsRes.value.data].sort((a, b) => a.nom.localeCompare(b.nom, 'fr')))
  }

  async function attribuerTemplate() {
    if (!seanceChoisie || !createDate) return
    await supabase.from('realisations').insert({ joueur_id: joueur.id, seance_id: seanceChoisie, date_realisation: createDate, completee: false })
    await loadData()
    setCreateDate(null)
    setSeanceChoisie('')
  }

  async function supprimerRealisation(id: string) {
    try {
      const { error } = await supabase.from('realisations').delete().eq('id', id)
      if (error) throw error
      setSeanceDetail(null)
      await loadData()
    } catch (e: unknown) {
      toast('Erreur suppression : ' + (e instanceof Error ? e.message : String(e)), 'error')
    }
  }

  async function sauvegarderWellness() {
    if (!wellnessDate) return
    try {
      const { error } = await supabase.from('realisations').insert({
        joueur_id: joueur.id,
        seance_id: null,
        date_realisation: wellnessDate,
        completee: false,
        fatigue: wellnessData.fatigue || null,
        rpe: wellnessData.rpe || null,
        courbatures: wellnessData.courbatures || null,
        qualite_sommeil: wellnessData.qualite_sommeil || null,
        notes_joueur: wellnessData.notes || null,
      })
      if (error) throw error
      await loadData()
      setWellnessDate(null)
      setWellnessData({ fatigue: 5, rpe: 5, courbatures: 5, qualite_sommeil: 5, notes: '' })
    } catch (e: unknown) {
      toast('Erreur sauvegarde wellness : ' + (e instanceof Error ? e.message : String(e)), 'error')
    }
  }

  async function toggleCompletee(r: Realisation) {
    await supabase.from('realisations').update({ completee: !r.completee }).eq('id', r.id)
    await loadData()
    setSeanceDetail(prev => prev?.id === r.id ? { ...prev, completee: !r.completee } : prev)
  }

  async function sauvegarderSeance(seanceId: string) {
    await supabase.from('realisations').insert({ joueur_id: joueur.id, seance_id: seanceId, date_realisation: createDate, completee: false })
    await loadData()
    setSeanceEdit(null)
    setCreateDate(null)
    setSauvegarderFavori(false)
  }

  const realsParDate: Record<string, Realisation[]> = {}
  for (const r of realisations) {
    if (!realsParDate[r.date_realisation]) realsParDate[r.date_realisation] = []
    realsParDate[r.date_realisation].push(r)
  }

  const jourNoms = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  // Construire toutes les semaines dans la plage
  function getLundi(ds: string): string {
    const d = new Date(ds + 'T12:00:00')
    const day = d.getDay()
    d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day))
    return d.toISOString().split('T')[0]
  }

  const semaines: string[][] = []
  const curDate = new Date(getLundi(rangeDebut) + 'T12:00:00')
  const finDate = new Date(rangeFin + 'T12:00:00')
  while (curDate <= finDate) {
    semaines.push(Array.from({ length: 7 }, (_, i) => {
      const d = new Date(curDate)
      d.setDate(d.getDate() + i)
      return d.toISOString().split('T')[0]
    }))
    curDate.setDate(curDate.getDate() + 7)
  }

  function decalerRange(deltaJours: number) {
    setRangeDebut(ds => { const d = new Date(ds + 'T12:00:00'); d.setDate(d.getDate() + deltaJours); return d.toISOString().split('T')[0] })
    setRangeFin(ds => { const d = new Date(ds + 'T12:00:00'); d.setDate(d.getDate() + deltaJours); return d.toISOString().split('T')[0] })
  }

  function allerAujourdhui() {
    const d = new Date()
    const day = d.getDay()
    d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day))
    const lundi = d.toISOString().split('T')[0]
    const fin = new Date(d); fin.setDate(fin.getDate() + 27)
    setRangeDebut(lundi)
    setRangeFin(fin.toISOString().split('T')[0])
  }

  if (seanceEdit) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <button onClick={() => { setSeanceEdit(null); setCreateDate(null) }} style={{ background: 'none', border: '1px solid #2C2C44', borderRadius: '8px', padding: '8px 12px', color: '#888', cursor: 'pointer', fontSize: '13px' }}>← Annuler</button>
          <span style={{ color: '#888', fontSize: '13px' }}>
            Nouvelle séance pour <strong style={{ color: '#FFF' }}>{joueur.prenom}</strong> — <span style={{ color: '#C9A84C' }}>{new Date(createDate! + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </span>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', cursor: 'pointer', color: sauvegarderFavori ? '#C9A84C' : '#555', fontSize: '13px' }}>
            <input type="checkbox" checked={sauvegarderFavori} onChange={e => setSauvegarderFavori(e.target.checked)} style={{ accentColor: '#C9A84C' }} />
            Sauvegarder en Favoris
          </label>
        </div>
        <EditeurSeance
          seance={seanceEdit}
          exercices={exercices}
          joueurId={joueur.id}
          dateAttribution={createDate!}
          sauvegarderFavori={sauvegarderFavori}
          onSave={sauvegarderSeance}
          onCancel={() => { setSeanceEdit(null); setCreateDate(null) }}
        />
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: '1px solid #2C2C44', borderRadius: '8px', padding: '8px 12px', color: '#888', cursor: 'pointer', fontSize: '13px' }}>← Retour</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#1A6FFF20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A6FFF', fontWeight: '800', fontSize: '15px' }}>
            {joueur.prenom[0]}{joueur.nom[0]}
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '18px' }}>{joueur.prenom} {joueur.nom}</div>
            <div style={{ color: '#888', fontSize: '12px' }}>
              {joueur.poste && `${joueur.poste} · `}{joueur.club && `${joueur.club} · `}
              <span style={{ color: joueur.actif ? '#2ECC71' : '#FF4757' }}>{joueur.actif ? 'Actif' : 'Suspendu'}</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '4px', background: '#212135', borderRadius: '10px', padding: '4px' }}>
          {(['calendrier', 'graphiques', 'favoris', 'messages'] as const).map(o => (
            <button key={o} onClick={() => setOnglet(o)} style={{
              padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
              background: onglet === o ? '#2C2C44' : 'transparent',
              color: onglet === o ? '#FFF' : '#555',
            }}>{o === 'calendrier' ? 'Calendrier' : o === 'graphiques' ? '📊 Graphiques' : o === 'favoris' ? '⭐ Favoris' : '💬 Messages'}</button>
          ))}
        </div>
      </div>

      {onglet === 'calendrier' && (
        <div>
          {/* Navigation plage */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {/* Ligne 1 : nav + Master Planner */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={allerAujourdhui} style={{ background: '#212135', border: '1px solid #2C2C44', borderRadius: '8px', padding: '7px 12px', color: '#888', cursor: 'pointer', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>Aujourd'hui</button>
              <button onClick={() => decalerRange(-7)} style={{ background: '#212135', border: '1px solid #2C2C44', borderRadius: '8px', padding: '7px 12px', color: '#888', cursor: 'pointer', fontSize: '14px' }}>‹</button>
              <button onClick={() => decalerRange(7)} style={{ background: '#212135', border: '1px solid #2C2C44', borderRadius: '8px', padding: '7px 12px', color: '#888', cursor: 'pointer', fontSize: '14px' }}>›</button>
              <button onClick={() => setShowMasterPlanner(true)} style={{ background: '#1A6FFF20', border: '1px solid #1A6FFF50', borderRadius: '8px', padding: '7px 14px', color: '#1A6FFF', cursor: 'pointer', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap', letterSpacing: '-0.3px' }}>▦ Master Planner</button>
            </div>
            {/* Ligne 2 : plage de dates */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ color: '#9898B8', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>DE</span>
              <input type="date" value={rangeDebut} onChange={e => setRangeDebut(e.target.value)}
                style={{ background: '#212135', border: '1px solid #2C2C44', borderRadius: '8px', padding: '6px 10px', color: '#1A6FFF', fontSize: '13px', fontWeight: '600', outline: 'none', cursor: 'pointer' }} />
              <span style={{ color: '#9898B8', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>À</span>
              <input type="date" value={rangeFin} onChange={e => setRangeFin(e.target.value)}
                style={{ background: '#212135', border: '1px solid #2C2C44', borderRadius: '8px', padding: '6px 10px', color: '#1A6FFF', fontSize: '13px', fontWeight: '600', outline: 'none', cursor: 'pointer' }} />
            </div>
          </div>

          {/* En-têtes jours fixes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '4px' }}>
            {jourNoms.map(j => (
              <div key={j} style={{ textAlign: 'center', color: '#9898B8', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', padding: '4px 0' }}>{j}</div>
            ))}
          </div>

          {/* Semaines empilées */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {semaines.map((semaine, si) => (
              <div key={si} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                {semaine.map((ds, i) => {
                  const realsJour = realsParDate[ds] || []
                  const isToday = ds === today
                  const isPast = ds < today
                  const dateNum = new Date(ds + 'T12:00:00').getDate()
                  return (
                    <div key={ds} style={{
                      minHeight: '100px',
                      background: isToday ? '#1A6FFF08' : '#18182A',
                      borderTop: `2px solid ${isToday ? '#1A6FFF' : isPast ? '#1E1E1E' : '#2C2C44'}`,
                      borderBottom: '1px solid #1E1E30',
                      borderLeft: '1px solid #1E1E30',
                      borderRight: '1px solid #1E1E1E',
                      borderRadius: '8px',
                      display: 'flex', flexDirection: 'column',
                      overflow: 'hidden',
                    }}>
                      {/* Header jour */}
                      <div style={{ padding: '7px 7px 5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #222238' }}>
                        <div style={{ fontSize: '18px', fontWeight: isToday ? '900' : '600', color: isToday ? '#007AFF' : isPast ? '#888' : '#CCC', lineHeight: 1 }}>{dateNum}</div>
                        <button onClick={() => setActionMenuDate(ds)}
                          style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid #2C2C44', background: 'transparent', color: '#9898B8', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, padding: 0 }}>+</button>
                      </div>

                      {/* Cartes séances */}
                      <div style={{ flex: 1, padding: '4px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {realsJour.map(r => {
                          const isActivite = !!r.activite_id && !r.seance_id
                          const isWellness = !r.seances && !isActivite
                          if (isActivite) {
                            return (
                              <div key={r.id} style={{
                                background: '#C9A84C12', border: '1px solid #C9A84C28', borderLeft: '3px solid #C9A84C',
                                borderRadius: '6px', padding: '6px 7px',
                              }}>
                                <div style={{ fontSize: '10px', fontWeight: '800', color: '#C9A84C', marginBottom: '2px', letterSpacing: '0.3px' }}>🏃 Activité</div>
                                <div style={{ fontSize: '11px', fontWeight: '700', color: '#E0C87A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.activites?.nom || '—'}</div>
                                {r.duree_minutes != null && <div style={{ fontSize: '11px', fontWeight: '700', color: '#C9A84C', marginTop: '1px' }}>{r.duree_minutes} min</div>}
                              </div>
                            )
                          }
                          if (isWellness) {
                            // Couleur par valeur: fatigue/rpe/courbatures = vert→rouge, sommeil = rouge→vert
                            const wColor = (v: number, inverted = false) => {
                              const n = inverted ? 11 - v : v
                              if (n <= 3) return '#2ECC71'
                              if (n <= 5) return '#F39C12'
                              if (n <= 7) return '#FF6B35'
                              return '#FF4757'
                            }
                            return (
                              <div key={r.id} onClick={() => setSeanceDetail(r)} style={{
                                background: '#2ECC7112',
                                border: '1px solid #2ECC7128', borderLeft: '3px solid #2ECC71',
                                borderRadius: '6px', padding: '6px 7px', cursor: 'pointer',
                              }}>
                                <div style={{ fontSize: '10px', fontWeight: '800', color: '#2ECC71', marginBottom: '4px', letterSpacing: '0.3px' }}>💚 Wellness</div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 6px' }}>
                                  {r.fatigue != null && <span style={{ fontSize: '11px', fontWeight: '800', color: wColor(r.fatigue) }}>F <span style={{ fontSize: '13px' }}>{r.fatigue}</span></span>}
                                  {r.rpe != null && <span style={{ fontSize: '11px', fontWeight: '800', color: wColor(r.rpe) }}>R <span style={{ fontSize: '13px' }}>{r.rpe}</span></span>}
                                  {r.qualite_sommeil != null && <span style={{ fontSize: '11px', fontWeight: '800', color: wColor(r.qualite_sommeil, true) }}>S <span style={{ fontSize: '13px' }}>{r.qualite_sommeil}</span></span>}
                                  {r.courbatures != null && <span style={{ fontSize: '11px', fontWeight: '800', color: wColor(r.courbatures) }}>C <span style={{ fontSize: '13px' }}>{r.courbatures}</span></span>}
                                </div>
                              </div>
                            )
                          }
                          const couleur = r.completee ? '#2ECC71' : isPast ? '#FF4757' : '#1A6FFF'
                          return (
                            <div key={r.id} onClick={() => setSeanceDetail(r)} style={{
                              background: r.completee ? '#2ECC7112' : isPast ? '#FF475710' : '#1A6FFF0E',
                              border: `1px solid ${couleur}28`,
                              borderLeft: `3px solid ${couleur}`,
                              borderRadius: '6px', padding: '6px 7px',
                              cursor: 'pointer',
                              display: 'flex', alignItems: 'center', gap: '6px',
                              minHeight: '36px',
                            }}>
                              <input type="checkbox" checked={r.completee} onChange={e => { e.stopPropagation(); toggleCompletee(r) }}
                                style={{ accentColor: couleur, flexShrink: 0, cursor: 'pointer', width: '14px', height: '14px' }} />
                              <div style={{ flex: 1, overflow: 'hidden' }}>
                                <div style={{ fontSize: '12px', fontWeight: '700', color: '#E0E0E0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.seances?.nom || 'Séance'}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {onglet === 'graphiques' && (
        <WellnessGraphiques realisations={realisations} />
      )}

      {onglet === 'messages' && (
        <div style={{ background: '#18182A', borderRadius: '16px', overflow: 'hidden', border: '1px solid #2C2C44', height: 'calc(100vh - 260px)' }}>
          {coachId && joueurAuthId ? (
            <>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #1E1E30' }}>
                <span style={{ color: '#9898B8', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Conversation avec {joueur.prenom} {joueur.nom}</span>
              </div>
              <ChatView key={joueurAuthId} myId={coachId} otherId={joueurAuthId} height="calc(100vh - 325px)" />
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9898B8', fontSize: '13px' }}>
              {joueurAuthId ? 'Chargement…' : 'Ce joueur n\'a pas encore de compte actif'}
            </div>
          )}
        </div>
      )}

      {onglet === 'favoris' && (
        <div>
          <p style={{ color: '#888', fontSize: '13px', marginBottom: '16px' }}>Séances sauvegardées — clique sur "Planifier" pour les ajouter au calendrier.</p>
          {favoris.length === 0 ? (
            <div style={{ background: '#18182A', border: '1px solid #2C2C44', borderRadius: '12px', padding: '32px', textAlign: 'center', color: '#9898B8', fontSize: '14px' }}>
              Aucun favori. Coche "Sauvegarder en Favoris" lors de la création d'une séance.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {favoris.map(s => (
                <div key={s.id} style={{ background: '#18182A', border: '1px solid #2C2C44', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>{s.nom}</div>
                    <div style={{ color: '#A8A8C4', fontSize: '12px', marginTop: '2px' }}>{s.seance_exercices?.length || 0} exercices</div>
                  </div>
                  <button onClick={() => { setOnglet('calendrier'); setCreateDate(today); setSeanceChoisie(s.id); setCreateMode('choisir') }} style={{
                    background: '#1A6FFF20', border: '1px solid #1A6FFF40', color: '#1A6FFF',
                    padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600',
                  }}>Planifier →</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal détail séance */}
      {seanceDetail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}
          onClick={() => setSeanceDetail(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#18182A', border: '1px solid #2C2C44', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '480px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ fontWeight: '800', fontSize: '17px' }}>{seanceDetail.seances ? seanceDetail.seances.nom : '💚 Wellness'}</div>
                <div style={{ color: '#C9A84C', fontSize: '13px', marginTop: '3px' }}>
                  {new Date(seanceDetail.date_realisation + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
              </div>
              <button onClick={() => setSeanceDetail(null)} style={{ background: 'none', border: 'none', color: '#9898B8', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            {/* Toggle complétée — seulement pour les vraies séances */}
            {seanceDetail.seances && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '16px', padding: '10px 14px', background: seanceDetail.completee ? '#2ECC7115' : '#212135', borderRadius: '10px', border: `1px solid ${seanceDetail.completee ? '#2ECC7140' : '#2C2C44'}` }}>
                <input type="checkbox" checked={seanceDetail.completee} onChange={() => toggleCompletee(seanceDetail)} style={{ accentColor: '#2ECC71', width: '16px', height: '16px', cursor: 'pointer' }} />
                <span style={{ fontWeight: '600', fontSize: '13px', color: seanceDetail.completee ? '#2ECC71' : '#888' }}>
                  {seanceDetail.completee ? 'Séance réalisée' : 'Marquer comme réalisée'}
                </span>
              </label>
            )}

            {/* Exercices — seulement pour les vraies séances */}
            {(() => {
              if (!seanceDetail.seances) return null
              const exos = [...(seanceDetail.seances?.seance_exercices || [])].sort((a, b) => a.ordre - b.ordre)
              if (exos.length === 0) return <div style={{ color: '#7878A8', fontSize: '13px', marginBottom: '16px', fontStyle: 'italic' }}>Aucun exercice enregistré.</div>
              const blocs: typeof exos[] = []
              let bi = 0
              while (bi < exos.length) {
                const bloc = [exos[bi]]
                while (exos[bi]?.lien_suivant && bi + 1 < exos.length) { bi++; bloc.push(exos[bi]) }
                blocs.push(bloc); bi++
              }
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '16px' }}>
                  {blocs.map((bloc, bIdx) => {
                    const isLastBloc = bIdx === blocs.length - 1
                    const isSuperset = bloc.length > 1
                    const seriesCount = bloc[0].series || 0
                    const lastEx = bloc[bloc.length - 1]
                    const recupEntreBlocsVal = Array.isArray(lastEx.sets_config) && lastEx.sets_config.length > 0
                      ? (lastEx.sets_config[lastEx.sets_config.length - 1].recup ?? lastEx.sets_config[0].recup)
                      : lastEx.recuperation_secondes
                    return (
                      <Fragment key={bIdx}>
                      <div style={{ background: '#0E0E18', border: isSuperset ? '1px solid #1A6FFF25' : '1px solid #1C1C2C', borderRadius: '14px', overflow: 'hidden' }}>
                        {isSuperset && (
                          <div style={{ background: 'linear-gradient(90deg,#1A6FFF18,#1A6FFF08)', borderBottom: '1px solid #1A6FFF20', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '12px' }}>🔗</span>
                            <span style={{ color: '#1A6FFF', fontSize: '10px', fontWeight: '900', letterSpacing: '1.2px' }}>SUPERSET</span>
                            {seriesCount > 0 && <span style={{ color: '#1A6FFF60', fontSize: '12px', fontWeight: '700' }}>· {seriesCount} séries</span>}
                          </div>
                        )}
                        {bloc.map((ex, ei) => {
                          const couleur = ex.exercices?.familles?.couleur || '#555'
                          const nbSeries = isSuperset ? seriesCount : (ex.series || (ex.sets_config?.length ?? 0))
                          const firstSet = ex.sets_config?.[0]
                          const metrique = (firstSet?.reps ?? ex.repetitions) ? `${firstSet?.reps ?? ex.repetitions} reps`
                            : (firstSet?.duree ?? ex.duree_secondes) ? `${firstSet?.duree ?? ex.duree_secondes}s`
                            : (firstSet?.dist ?? ex.distance_metres) ? `${firstSet?.dist ?? ex.distance_metres}m` : null
                          return (
                            <div key={ex.id}>
                              {isSuperset && ei > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0', margin: '0 14px' }}>
                                  <div style={{ width: '2px', height: '12px', background: '#1A6FFF20', marginLeft: '11px' }} />
                                  {ex.recuperation_secondes
                                    ? <span style={{ marginLeft: '8px', color: '#2ECC7170', fontSize: '10px', fontWeight: '700' }}>⏱ Récup {ex.recuperation_secondes}s</span>
                                    : <span style={{ marginLeft: '8px', color: '#1A6FFF35', fontSize: '10px' }}>enchaîner</span>}
                                </div>
                              )}
                              <div style={{ padding: '12px 14px 0', borderTop: ei > 0 && !isSuperset ? '1px solid #1C1C2C' : 'none' }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' }}>
                                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: couleur + '20', border: `1px solid ${couleur}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <span style={{ color: couleur, fontSize: '11px', fontWeight: '900' }}>{ex.ordre}</span>
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    {ex.exercices?.familles && <div style={{ fontSize: '11px', fontWeight: '800', color: couleur, textTransform: 'uppercase' as const, letterSpacing: '0.8px', marginBottom: '2px' }}>{ex.exercices.familles.nom}</div>}
                                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#EEE', letterSpacing: '-0.2px', lineHeight: 1.2 }}>{ex.exercices?.nom}</div>
                                  </div>
                                  {ex.exercices?.video_url && (
                                    <button onClick={() => setVideoModal(ex.exercices!.video_url!)}
                                      style={{ background: '#1A6FFF20', border: '1px solid #1A6FFF40', borderRadius: '8px', padding: '6px 10px', color: '#1A6FFF', cursor: 'pointer', fontSize: '13px', flexShrink: 0 }}>▶</button>
                                  )}
                                </div>
                                {ex.notes && (
                                  <div style={{ marginBottom: '8px' }}>
                                    <span style={{ background: '#C9A84C15', border: '1px solid #C9A84C30', color: '#C9A84C', fontSize: '11px', fontWeight: '800', padding: '3px 10px', borderRadius: '6px' }}>● {ex.notes}</span>
                                  </div>
                                )}
                                {ex.exercices?.consignes_execution && (
                                  <div style={{ background: '#C9A84C08', border: '1px solid #C9A84C18', borderLeft: '3px solid #C9A84C50', borderRadius: '0 8px 8px 0', padding: '8px 10px', marginBottom: '10px' }}>
                                    <div style={{ fontSize: '10px', fontWeight: '900', color: '#C9A84C60', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '4px' }}>Consignes</div>
                                    <div style={{ color: '#C9A84C90', fontSize: '12px', lineHeight: '1.6' }}>{ex.exercices.consignes_execution}</div>
                                  </div>
                                )}
                                {nbSeries > 0 && (
                                  <div style={{ marginBottom: '10px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 1fr 1fr', gap: '2px', padding: '4px 8px', marginBottom: '2px' }}>
                                      {['N°', (firstSet?.reps ?? ex.repetitions) ? 'Reps' : (firstSet?.duree ?? ex.duree_secondes) ? 'Durée' : 'Reps', 'Charge', 'Récup'].map(h => (
                                        <span key={h} style={{ fontSize: '11px', fontWeight: '800', color: '#8888AA', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>{h}</span>
                                      ))}
                                    </div>
                                    {Array.from({ length: nbSeries }, (_, si) => {
                                      const setData = ex.sets_config?.[si]
                                      const rowMetr = setData
                                        ? (setData.reps ? `${setData.reps} reps` : setData.duree ? `${setData.duree}s` : setData.dist ? `${setData.dist}m` : metrique || '—')
                                        : (metrique || '—')
                                      const rowCharge = setData?.charge ?? ex.charge_kg
                                      const rowRecup = setData ? (!isSuperset && si < nbSeries - 1 && setData.recup ? `${setData.recup}s` : '—')
                                        : (!isSuperset && ex.recuperation_secondes && si < nbSeries - 1 ? `${ex.recuperation_secondes}s` : '—')
                                      return (
                                        <div key={si} style={{ display: 'grid', gridTemplateColumns: '36px 1fr 1fr 1fr', gap: '2px', padding: '7px 8px', background: si % 2 === 0 ? '#0A0A0A' : 'transparent', borderRadius: '6px' }}>
                                          <span style={{ fontSize: '12px', fontWeight: '700', color: couleur }}>{si + 1}</span>
                                          <span style={{ fontSize: '13px', fontWeight: '800', color: '#CCC' }}>{rowMetr}</span>
                                          <span style={{ fontSize: '13px', fontWeight: '700', color: rowCharge ? '#C0C0D8' : '#4A4A6A' }}>{rowCharge ? `${rowCharge}kg` : '—'}</span>
                                          <span style={{ fontSize: '12px', fontWeight: '700', color: rowRecup !== '—' ? '#2ECC71' : '#4A4A6A' }}>{rowRecup}</span>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                                {nbSeries === 0 && (ex.repetitions || ex.duree_secondes || ex.distance_metres || ex.charge_kg) && (
                                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' as const, marginBottom: '10px' }}>
                                    {[ex.repetitions && `${ex.repetitions} reps`, ex.duree_secondes && `${ex.duree_secondes}s`, ex.distance_metres && `${ex.distance_metres}m`, ex.charge_kg && `${ex.charge_kg}kg`].filter(Boolean).map((p, pi) => (
                                      <span key={pi} style={{ background: '#1C1C2C', border: '1px solid #1E1E30', borderRadius: '6px', padding: '3px 8px', fontSize: '12px', fontWeight: '700', color: '#A8A8C4' }}>{p}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div style={{ height: '12px' }} />
                            </div>
                          )
                        })}
                      </div>
                      {/* Bulle récup entre exercices */}
                      {!isLastBloc && recupEntreBlocsVal && recupEntreBlocsVal > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 8px' }}>
                          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #2ECC7120)' }} />
                          <div style={{ background: '#0A1A0E', border: '1px solid #2ECC7135', borderRadius: '20px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: '#2ECC7160', fontSize: '12px' }}>⏱</span>
                            <span style={{ color: '#2ECC71', fontWeight: '900', fontSize: '14px', letterSpacing: '-0.3px' }}>{recupEntreBlocsVal}s</span>
                            <span style={{ color: '#2ECC7160', fontSize: '10px', fontWeight: '700' }}>récup</span>
                          </div>
                          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #2ECC7120, transparent)' }} />
                        </div>
                      )}
                      </Fragment>
                    )
                  })}
                </div>
              )
            })()}

            {/* Données renseignées par le joueur */}
            {(seanceDetail.rpe || seanceDetail.fatigue || seanceDetail.courbatures || seanceDetail.qualite_sommeil || seanceDetail.notes_joueur) && (() => {
              const wc = (v: number, inv = false) => {
                const n = inv ? 11 - v : v
                if (n <= 3) return '#2ECC71'
                if (n <= 5) return '#F39C12'
                if (n <= 7) return '#FF6B35'
                return '#FF4757'
              }
              const items = [
                { label: 'Fatigue', val: seanceDetail.fatigue, inv: false },
                { label: 'Courbatures', val: seanceDetail.courbatures, inv: false },
                { label: 'Effort', val: seanceDetail.rpe, inv: false },
                { label: 'Sommeil', val: seanceDetail.qualite_sommeil, inv: true },
              ].filter(x => x.val != null)
              return (
                <div style={{ background: '#0E0E18', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
                  <div style={{ color: '#9898B8', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Ressenti joueur</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: seanceDetail.notes_joueur ? '10px' : '0' }}>
                    {items.map(({ label, val, inv }) => {
                      const c = wc(val!, inv)
                      return (
                        <div key={label} style={{ background: c + '20', border: `1px solid ${c}40`, borderRadius: '10px', padding: '8px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', minWidth: '64px' }}>
                          <span style={{ color: '#888', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>{label}</span>
                          <span style={{ color: c, fontWeight: '900', fontSize: '22px', lineHeight: 1 }}>{val}</span>
                          <span style={{ color: c + '80', fontSize: '11px' }}>/10</span>
                        </div>
                      )
                    })}
                  </div>
                  {seanceDetail.notes_joueur && (
                    <div style={{ color: '#AAA', fontSize: '13px', fontStyle: 'italic', borderTop: '1px solid #1E1E30', paddingTop: '10px' }}>"{seanceDetail.notes_joueur}"</div>
                  )}
                </div>
              )
            })()}

            {/* Supprimer du planning */}
            <button onClick={() => supprimerRealisation(seanceDetail.id)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #FF475730', background: '#FF475710', color: '#FF4757', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
              Retirer du planning
            </button>
          </div>
        </div>
      )}

      {/* Master Planner overlay */}
      {showMasterPlanner && (
        <MasterPlannerView
          joueur={joueur}
          realisations={realisations as unknown as MPRealisation[]}
          exercices={exercices}
          weekStart={rangeDebut}
          onClose={() => setShowMasterPlanner(false)}
          onReload={loadData}
        />
      )}

      {/* Menu action : Session ou Wellness */}
      {actionMenuDate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}
          onClick={() => setActionMenuDate(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#18182A', border: '1px solid #2C2C44', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '320px' }}>
            <div style={{ fontWeight: '800', fontSize: '16px', marginBottom: '4px' }}>Ajouter</div>
            <div style={{ color: '#C9A84C', fontSize: '13px', marginBottom: '20px' }}>
              {new Date(actionMenuDate + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => { setCreateDate(actionMenuDate); setCreateMode('choisir'); setSeanceChoisie(''); setActionMenuDate(null) }}
                style={{ padding: '16px', borderRadius: '14px', border: '1px solid #1A6FFF40', background: '#1A6FFF15', color: '#1A6FFF', cursor: 'pointer', fontSize: '15px', fontWeight: '700', textAlign: 'left' }}>
                📋 Session d'entraînement
              </button>
              <button onClick={() => { setWellnessDate(actionMenuDate); setWellnessData({ fatigue: 5, rpe: 5, courbatures: 5, qualite_sommeil: 5, notes: '' }); setActionMenuDate(null) }}
                style={{ padding: '16px', borderRadius: '14px', border: '1px solid #2ECC7140', background: '#2ECC7115', color: '#2ECC71', cursor: 'pointer', fontSize: '15px', fontWeight: '700', textAlign: 'left' }}>
                💚 Indices Wellness
              </button>
            </div>
            <button onClick={() => setActionMenuDate(null)} style={{ width: '100%', padding: '12px', marginTop: '12px', borderRadius: '12px', border: '1px solid #2C2C44', background: 'transparent', color: '#9898B8', cursor: 'pointer', fontSize: '14px' }}>Annuler</button>
          </div>
        </div>
      )}

      {/* Modal Wellness */}
      {wellnessDate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#18182A', border: '1px solid #2C2C44', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '440px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
              <div style={{ fontWeight: '800', fontSize: '17px' }}>💚 Wellness</div>
              <button onClick={() => setWellnessDate(null)} style={{ background: 'none', border: 'none', color: '#888', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ color: '#C9A84C', fontSize: '13px', marginBottom: '24px' }}>
              {new Date(wellnessDate + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            {([
              { key: 'fatigue', label: 'Fatigue', color: '#FF4757', desc: '1 = reposé · 10 = épuisé' },
              { key: 'rpe', label: 'Effort perçu (RPE)', color: '#1A6FFF', desc: '1 = très facile · 10 = maximal' },
              { key: 'courbatures', label: 'Courbatures', color: '#FF6B35', desc: '1 = aucune · 10 = très douloureux' },
              { key: 'qualite_sommeil', label: 'Qualité du sommeil', color: '#2ECC71', desc: '1 = très mauvais · 10 = excellent' },
            ] as { key: keyof typeof wellnessData; label: string; color: string; desc: string }[]).map(({ key, label, color, desc }) => (
              <div key={key} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px', color }}>{label}</div>
                    <div style={{ color: '#9898B8', fontSize: '11px' }}>{desc}</div>
                  </div>
                  <div style={{ color, fontWeight: '900', fontSize: '28px', minWidth: '40px', textAlign: 'center', lineHeight: 1 }}>
                    {key === 'notes' ? '' : wellnessData[key]}
                  </div>
                </div>
                <input type="range" min="1" max="10" value={wellnessData[key] as number}
                  onChange={e => setWellnessData(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: color, height: '6px', cursor: 'pointer' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6A6A8A', fontSize: '10px', marginTop: '2px' }}>
                  <span>1</span><span>5</span><span>10</span>
                </div>
              </div>
            ))}
            <textarea placeholder="Notes (optionnel)..." value={wellnessData.notes}
              onChange={e => setWellnessData(prev => ({ ...prev, notes: e.target.value }))}
              style={{ width: '100%', background: '#212135', border: '1px solid #2C2C44', borderRadius: '10px', padding: '12px', color: '#FFF', fontSize: '14px', outline: 'none', resize: 'none', minHeight: '80px', marginBottom: '16px', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setWellnessDate(null)} style={{ flex: 1, padding: '13px', borderRadius: '12px', border: '1px solid #2C2C44', background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '14px' }}>Annuler</button>
              <button onClick={sauvegarderWellness} style={{ flex: 2, padding: '13px', borderRadius: '12px', border: 'none', background: '#2ECC71', color: '#FFF', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ajouter une séance */}
      {createDate && !seanceEdit && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#18182A', border: '1px solid #2C2C44', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '440px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontWeight: '800', fontSize: '16px' }}>Ajouter une séance</div>
                <div style={{ color: '#C9A84C', fontSize: '13px', marginTop: '2px' }}>
                  {new Date(createDate + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
              </div>
              <button onClick={() => setCreateDate(null)} style={{ background: 'none', border: 'none', color: '#888', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <button onClick={() => setCreateMode('choisir')} style={{
                flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                border: `1px solid ${createMode === 'choisir' ? '#1A6FFF' : '#2C2C44'}`,
                background: createMode === 'choisir' ? '#1A6FFF15' : 'transparent',
                color: createMode === 'choisir' ? '#1A6FFF' : '#555',
              }}>Choisir un modèle</button>
              <button onClick={() => setCreateMode('creer')} style={{
                flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                border: `1px solid ${createMode === 'creer' ? '#2ECC71' : '#2C2C44'}`,
                background: createMode === 'creer' ? '#2ECC7115' : 'transparent',
                color: createMode === 'creer' ? '#2ECC71' : '#555',
              }}>Créer une séance</button>
            </div>

            {createMode === 'choisir' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <SearchableSelect
                  value={seanceChoisie}
                  items={templates}
                  onChange={t => setSeanceChoisie(t.id)}
                  placeholder="Choisir un modèle..."
                  triggerStyle={{ width: '100%' }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setCreateDate(null)} style={{ flex: 1, padding: '11px', borderRadius: '10px', border: '1px solid #2C2C44', background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '14px' }}>Annuler</button>
                  <button onClick={attribuerTemplate} disabled={!seanceChoisie} style={{
                    flex: 2, padding: '11px', borderRadius: '10px', border: 'none',
                    background: seanceChoisie ? '#1A6FFF' : '#333', color: '#FFF',
                    cursor: seanceChoisie ? 'pointer' : 'not-allowed', fontWeight: '700', fontSize: '14px',
                  }}>Ajouter au calendrier</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: sauvegarderFavori ? '#C9A84C' : '#555', fontSize: '13px' }}>
                  <input type="checkbox" checked={sauvegarderFavori} onChange={e => setSauvegarderFavori(e.target.checked)} style={{ accentColor: '#C9A84C' }} />
                  Sauvegarder aussi en Favoris (réutilisable)
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setCreateDate(null)} style={{ flex: 1, padding: '11px', borderRadius: '10px', border: '1px solid #2C2C44', background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '14px' }}>Annuler</button>
                  <button onClick={() => setSeanceEdit({ id: '', nom: '', type: 'complete', notes: '', est_template: sauvegarderFavori, seance_exercices: [] })} style={{
                    flex: 2, padding: '11px', borderRadius: '10px', border: 'none',
                    background: '#2ECC71', color: '#FFF', cursor: 'pointer', fontWeight: '700', fontSize: '14px',
                  }}>Créer la séance →</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Video popup modal ── */}
      {videoModal && (() => {
        const ytId = getYoutubeId(videoModal)
        const vimeoId = getVimeoId(videoModal)
        const embedSrc = ytId
          ? `https://www.youtube.com/embed/${ytId}?autoplay=1&controls=1`
          : vimeoId
          ? `https://player.vimeo.com/video/${vimeoId}?autoplay=1&controls=1`
          : null
        return (
          <>
            <div onClick={() => setVideoModal(null)} style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }} />
            <div style={{ position: 'fixed', inset: 0, zIndex: 601, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', pointerEvents: 'none' }}>
              <div style={{ width: '100%', maxWidth: '720px', pointerEvents: 'auto' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
                  {embedSrc ? (
                    <iframe src={embedSrc} style={{ width: '100%', height: '100%', border: 'none', display: 'block' }} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
                  ) : (
                    <video src={videoModal} autoPlay controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                  <button onClick={() => setVideoModal(null)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '20px', padding: '8px 24px', color: '#FFF', cursor: 'pointer', fontSize: '13px', fontWeight: '700', backdropFilter: 'blur(8px)' }}>✕ Fermer</button>
                </div>
              </div>
            </div>
          </>
        )
      })()}
    </div>
  )
}

