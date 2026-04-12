'use client'

import React, { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { subscribePush, sendPush } from '@/lib/push'
import { useRouter } from 'next/navigation'

type Joueur = { id: string; nom: string; prenom: string; email: string; poste?: string; club?: string; auth_id?: string; coach_id?: string }
type SeanceExercice = {
  id: string; ordre: number; series?: number; repetitions?: number
  duree_secondes?: number; distance_metres?: number; charge_kg?: number
  recuperation_secondes?: number; recuperation_inter_sets?: number; lien_suivant?: boolean; uni_podal?: boolean; notes?: string
  exercices?: {
    nom: string; video_url?: string; consignes_execution?: string
    familles?: { nom: string; couleur: string } | null
  } | null
}
type Realisation = {
  id: string; seance_id: string; date_realisation: string; completee: boolean
  rpe?: number | null; fatigue?: number | null; courbatures?: number | null
  qualite_sommeil?: number | null; notes_joueur?: string | null
  seances?: { id: string; nom: string; type: string; seance_exercices?: SeanceExercice[] }
}
type WellnessForm = {
  completee: boolean; fatigue: number | null; courbatures: number | null
  rpe: number | null; qualite_sommeil: number | null; notes_joueur: string
}

function RatingChips({ label, value, couleur, onChange }: {
  label: string; value: number | null; couleur: string; onChange: (v: number | null) => void
}) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
        <span style={{ color: '#999', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</span>
        <span style={{ color: value !== null ? couleur : '#333', fontWeight: '900', fontSize: '22px', lineHeight: 1 }}>
          {value !== null ? value : '–'}<span style={{ color: '#333', fontSize: '12px', fontWeight: '400' }}>/10</span>
        </span>
      </div>
      <div style={{ display: 'flex', gap: '4px', height: '40px' }}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
          <button key={n} onClick={() => onChange(value === n ? null : n)} style={{
            flex: 1, height: '100%', borderRadius: '8px', border: 'none', cursor: 'pointer',
            fontSize: '12px', fontWeight: '800',
            background: value !== null && n <= value ? (n === value ? couleur : couleur + '55') : '#161616',
            color: value !== null && n <= value ? '#FFF' : '#333',
            transition: 'all 0.1s',
          }}>{n}</button>
        ))}
      </div>
    </div>
  )
}

function SessionDetail({ realisation, form, setForm, saving, onSave, onClose, isMobile }: {
  realisation: Realisation
  form: WellnessForm
  setForm: React.Dispatch<React.SetStateAction<WellnessForm>>
  saving: boolean
  onSave: () => void
  onClose: () => void
  isMobile: boolean
}) {
  const [chronoSec, setChronoSec] = useState(0)
  const [chronoRunning, setChronoRunning] = useState(false)
  const [videoOpen, setVideoOpen] = useState<string | null>(null)
  const [consignesOpen, setConsignesOpen] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!chronoRunning) return
    const id = setInterval(() => setChronoSec(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [chronoRunning])

  const fmtChrono = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return h > 0
      ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
      : `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const exercices = [...(realisation.seances?.seance_exercices || [])].sort((a, b) => a.ordre - b.ordre)

  const LABELS_TYPE: Record<string, string> = {
    complete: 'Complète', echauffement: 'Échauffement',
    corps: 'Corps de séance', retour_au_calme: 'Retour au calme',
  }

  // Grouper en blocs (superset ou solo)
  const blocs: SeanceExercice[][] = []
  let i = 0
  while (i < exercices.length) {
    const bloc: SeanceExercice[] = [exercices[i]]
    while (exercices[i]?.lien_suivant && i + 1 < exercices.length) {
      i++
      bloc.push(exercices[i])
    }
    blocs.push(bloc)
    i++
  }

  function vimeoEmbed(url: string) {
    return url.replace('vimeo.com/', 'player.vimeo.com/video/')
  }
  function vimeoThumb(url: string) {
    const m = url.match(/vimeo\.com\/(\d+)/)
    return m ? `https://vumbnail.com/${m[1]}.jpg` : ''
  }
  function toggleConsignes(id: string) {
    setConsignesOpen(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  const dateLabel = new Date(realisation.date_realisation + 'T12:00:00')
    .toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  const typeLbl = LABELS_TYPE[realisation.seances?.type || ''] || realisation.seances?.type || ''

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#080808', color: '#FFF', fontFamily: 'system-ui, -apple-system, sans-serif', zIndex: 500, display: 'flex', flexDirection: 'column' }}>

      {/* Header gradient — style Everfit */}
      <div style={{ background: 'linear-gradient(160deg, #1A40C8 0%, #0D1F6B 60%, #080C2A 100%)', flexShrink: 0, padding: isMobile ? `0 16px calc(24px + env(safe-area-inset-top, 0px))` : '0 24px 28px', paddingTop: `max(16px, env(safe-area-inset-top, 16px))` }}>

        {/* Barre retour + chrono */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', height: isMobile ? '52px' : '60px' }}>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '12px', width: '40px', height: '40px', color: '#FFF', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backdropFilter: 'blur(8px)' }}>←</button>
          <div style={{ flex: 1 }} />
          {/* Chrono compact */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {(chronoRunning || chronoSec > 0) && (
              <span style={{ fontFamily: 'monospace', fontSize: '15px', fontWeight: '900', letterSpacing: '1px', color: chronoRunning ? '#FFF' : 'rgba(255,255,255,0.4)', minWidth: '44px', textAlign: 'right' }}>
                {fmtChrono(chronoSec)}
              </span>
            )}
            {chronoSec > 0 && !chronoRunning && (
              <button onClick={() => setChronoSec(0)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', width: '32px', height: '32px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↺</button>
            )}
          </div>
        </div>

        {/* Date */}
        <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>
          {dateLabel}
        </div>

        {/* Nom de la séance */}
        <div style={{ fontWeight: '900', fontSize: isMobile ? '22px' : '26px', color: '#FFF', letterSpacing: '-0.4px', lineHeight: 1.2, marginBottom: '6px' }}>
          {realisation.seances?.nom}
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {typeLbl && <span style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', backdropFilter: 'blur(8px)' }}>{typeLbl}</span>}
          <span style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', backdropFilter: 'blur(8px)' }}>{exercices.length} exercice{exercices.length > 1 ? 's' : ''}</span>
          {realisation.completee && <span style={{ background: 'rgba(46,204,113,0.2)', color: '#2ECC71', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(46,204,113,0.3)' }}>✓ Réalisée</span>}
        </div>

        {/* CTA Commencer */}
        <button
          onClick={() => setChronoRunning(r => !r)}
          style={{
            width: '100%', padding: '15px', borderRadius: '14px', border: 'none', cursor: 'pointer',
            background: chronoRunning ? '#FF4757' : realisation.completee ? 'rgba(255,255,255,0.08)' : '#FFF',
            color: chronoRunning ? '#FFF' : realisation.completee ? 'rgba(255,255,255,0.4)' : '#0D1F6B',
            fontWeight: '900', fontSize: '16px', letterSpacing: '-0.2px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            backdropFilter: 'blur(8px)',
          }}
        >
          {chronoRunning ? '⏸  Pause' : chronoSec > 0 ? `▶  Reprendre · ${fmtChrono(chronoSec)}` : realisation.completee ? '✓  Séance terminée' : '▶  Commencer l\'entraînement'}
        </button>
      </div>

      {/* Contenu scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: isMobile ? `20px 14px calc(100px + env(safe-area-inset-bottom))` : '28px 20px 80px' }}>

          {/* Liste des exercices */}
          {blocs.length > 0 && (
            <div style={{ marginBottom: '48px' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#2A2A2A', marginBottom: '16px' }}>Programme</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {blocs.map((bloc, bi) => {
                  const isSuperset = bloc.length > 1
                  const seriesShared = bloc[0].series || 0
                  // Récup entre les sets (nouveau champ) sur le dernier exercice du bloc
                  const recuperInterSets = bloc[bloc.length - 1].recuperation_inter_sets ?? 0
                  // Récup après le superset entier (avant l'exercice suivant)
                  const recuperBloc = bloc[bloc.length - 1].recuperation_secondes ?? 0

                  return (
                    <div key={bi}>

                      {/* ─── Superset : frame + label ─── */}
                      {isSuperset ? (
                        <>
                        <div style={{ border: '1px solid #1A6FFF25', borderRadius: '18px', background: '#0A0D14', overflow: 'hidden' }}>

                          {/* Label superset / circuit */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderBottom: '1px solid #1A6FFF15' }}>
                            <span style={{ fontSize: '13px' }}>{bloc.length > 2 ? '🔄' : '🔗'}</span>
                            <span style={{ color: '#1A6FFF', fontSize: '11px', fontWeight: '900', letterSpacing: '1.5px' }}>{bloc.length > 2 ? 'CIRCUIT' : 'SUPERSET'}</span>
                            {bloc.map((_, i) => i + 1).join(' → ') && <span style={{ color: '#1A6FFF40', fontSize: '11px', fontWeight: '700' }}>{bloc.map((_, i) => i + 1).join(' → ')}</span>}
                            {seriesShared > 0 && <span style={{ color: '#1A6FFF', fontSize: '14px', fontWeight: '800' }}>· {seriesShared} séries</span>}
                          </div>

                          {/* Exercices : grille 2 colonnes max desktop, colonne mobile */}
                          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)' }}>
                            {bloc.map((ex, ei) => {
                              const isLastInBloc = ei === bloc.length - 1
                              const couleur = ex.exercices?.familles?.couleur || '#555'
                              const hasVideo = !!ex.exercices?.video_url
                              const isVideoOpen = videoOpen === ex.id
                              // Séries : shared si défini, sinon propre à l'exercice
                              const nbSeries = seriesShared > 0 ? seriesShared : (ex.series || 1)
                              const metrLabel = ex.repetitions ? 'Reps' : ex.duree_secondes ? 'Durée' : ex.distance_metres ? 'Dist.' : 'Reps'
                              const metrVal = ex.repetitions ? `${ex.repetitions}`
                                : ex.duree_secondes ? `${ex.duree_secondes}''`
                                : ex.distance_metres ? `${ex.distance_metres}m` : '—'
                              const thumbUrl = hasVideo ? vimeoThumb(ex.exercices!.video_url!) : ''
                              const showConsignes = consignesOpen.has(ex.id)
                              // Recovery column:
                              // Non-last ex in superset: "→ Suiv." header, show transition recovery on ALL rows
                              // Last ex in superset: "Récup" header, show inter-set recovery except last row
                              const recupHeader = !isLastInBloc ? '→ Suiv.' : 'Récup'
                              const getRecupSerie = (si: number) => {
                                if (!isLastInBloc) {
                                  // Ex1 : transition vers Ex2 (intra-set)
                                  return ex.recuperation_secondes ? `${ex.recuperation_secondes}s` : 'Direct'
                                } else {
                                  // Ex2 : récup entre les sets (sauf dernier set)
                                  const isLastSet = si === nbSeries - 1
                                  return !isLastSet && recuperInterSets ? `${recuperInterSets}s` : '—'
                                }
                              }
                              const recupColor = (val: string) => val === '—' ? '#252525' : !isLastInBloc ? '#1A6FFF80' : '#2ECC7170'

                              // Bordures entre cellules du grid
                              const isRightCol = ei % 2 === 0 && ei < bloc.length - 1
                              const isBottomRow = ei < bloc.length - 2 || (bloc.length % 2 !== 0 && ei === bloc.length - 2)

                              return (
                                <div key={ex.id} style={{
                                  background: 'transparent',
                                  borderRight: !isMobile && isRightCol ? '1px solid #1A6FFF15' : 'none',
                                  borderBottom: (isMobile && !isLastInBloc) || (!isMobile && isBottomRow) ? '1px solid #1A6FFF15' : 'none',
                                  display: 'flex', flexDirection: 'column'
                                }}>

                                  {/* Photo / Thumbnail */}
                                  <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: couleur + '10', overflow: 'hidden', cursor: hasVideo ? 'pointer' : 'default' }}
                                    onClick={() => hasVideo && setVideoOpen(isVideoOpen ? null : ex.id)}>
                                    {hasVideo && thumbUrl && !isVideoOpen && (
                                      <img src={thumbUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                    )}
                                    {hasVideo && isVideoOpen ? (
                                      <iframe
                                        src={vimeoEmbed(ex.exercices!.video_url!)}
                                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                                        allow="autoplay; fullscreen; picture-in-picture" allowFullScreen
                                      />
                                    ) : (
                                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                        {!thumbUrl && (
                                          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: couleur + '25', border: `2px solid ${couleur}50`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ color: couleur, fontSize: '20px' }}>▶</span>
                                          </div>
                                        )}
                                        {thumbUrl && (
                                          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(0,0,0,0.55)', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                                            <span style={{ color: '#FFF', fontSize: '20px', marginLeft: '3px' }}>▶</span>
                                          </div>
                                        )}
                                        {!hasVideo && <span style={{ color: couleur + '40', fontSize: '11px', fontWeight: '700' }}>Pas de vidéo</span>}
                                      </div>
                                    )}
                                    {/* Badge numéro */}
                                    <div style={{ position: 'absolute', top: '10px', left: '10px', width: '28px', height: '28px', borderRadius: '8px', background: couleur, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <span style={{ color: '#000', fontSize: '12px', fontWeight: '900' }}>{ex.ordre}</span>
                                    </div>
                                    {/* Badge famille */}
                                    {ex.exercices?.familles && (
                                      <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', borderRadius: '6px', padding: '3px 8px' }}>
                                        <span style={{ color: couleur, fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{ex.exercices.familles.nom}</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Nom + Note */}
                                  <div style={{ padding: '14px 14px 0' }}>
                                    <div style={{ fontWeight: '900', fontSize: '15px', letterSpacing: '-0.3px', lineHeight: 1.25, color: '#F0F0F0', marginBottom: '8px' }}>{ex.exercices?.nom}</div>
                                    {ex.uni_podal && (
                                      <div style={{ marginBottom: '8px' }}>
                                        <span style={{ background: '#1A6FFF18', border: '1px solid #1A6FFF40', color: '#1A6FFF', fontSize: '11px', fontWeight: '900', padding: '3px 10px', borderRadius: '6px', letterSpacing: '0.3px' }}>↔ Même travail côté opposé</span>
                                      </div>
                                    )}
                                    {ex.notes && (
                                      <div style={{ marginBottom: '10px' }}>
                                        <span style={{ background: '#C9A84C18', border: '1px solid #C9A84C35', color: '#C9A84C', fontSize: '11px', fontWeight: '800', padding: '3px 10px', borderRadius: '6px' }}>● {ex.notes}</span>
                                      </div>
                                    )}
                                    {ex.exercices?.consignes_execution && (
                                      <button onClick={() => toggleConsignes(ex.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <span style={{ color: '#C9A84C60', fontSize: '11px', fontWeight: '700' }}>{showConsignes ? '▲' : '▼'} Consignes</span>
                                      </button>
                                    )}
                                    {showConsignes && ex.exercices?.consignes_execution && (
                                      <div style={{ background: '#C9A84C08', borderLeft: '3px solid #C9A84C40', padding: '10px 12px', borderRadius: '0 8px 8px 0', marginBottom: '12px' }}>
                                        <div style={{ color: '#C9A84CAA', fontSize: '12px', lineHeight: '1.65' }}>{ex.exercices.consignes_execution}</div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Tableau séries — toujours affiché */}
                                  <div style={{ padding: '0 10px 14px', flex: 1 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 1fr', padding: '4px 6px', borderBottom: '1px solid #161616', marginBottom: '2px' }}>
                                      {['N°', metrLabel, 'Charge', recupHeader].map(h => (
                                        <span key={h} style={{ fontSize: '9px', fontWeight: '900', color: h === recupHeader && !isLastInBloc ? '#1A6FFF50' : '#333', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
                                      ))}
                                    </div>
                                    {Array.from({ length: nbSeries }, (_, si) => {
                                      const rv = getRecupSerie(si)
                                      return (
                                        <div key={si} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 1fr', padding: '7px 6px', background: si % 2 === 0 ? '#0A0A0A' : 'transparent', borderRadius: '6px' }}>
                                          <span style={{ fontSize: '12px', fontWeight: '800', color: couleur }}>{si + 1}</span>
                                          <span style={{ fontSize: '13px', fontWeight: '900', color: '#DDD' }}>{metrVal}</span>
                                          <span style={{ fontSize: '13px', fontWeight: '700', color: ex.charge_kg ? '#777' : '#252525' }}>{ex.charge_kg ? `${ex.charge_kg}kg` : '—'}</span>
                                          <span style={{ fontSize: '13px', fontWeight: '700', color: recupColor(rv) }}>{rv}</span>
                                        </div>
                                      )
                                    })}
                                  </div>

                                  {/* Connecteur mobile entre les exercices du superset */}
                                  {isMobile && !isLastInBloc && (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', gap: '8px' }}>
                                      <div style={{ flex: 1, height: '1px', background: '#1A6FFF20' }} />
                                      <span style={{ color: '#1A6FFF60', fontSize: '12px', fontWeight: '700' }}>
                                        {ex.recuperation_secondes ? `⏱ ${ex.recuperation_secondes}s puis →` : '→ Enchaîner'}
                                      </span>
                                      <div style={{ flex: 1, height: '1px', background: '#1A6FFF20' }} />
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>

                        </div>

                        {/* Récup après le superset — centré, hors du frame */}
                        {recuperBloc > 0 && (
                          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: '2px', height: '14px', background: '#1A6FFF30' }} />
                            <div style={{ borderRadius: '14px', padding: isMobile ? '12px 20px' : '14px 32px', width: isMobile ? '100%' : 'auto', background: 'linear-gradient(90deg,#1A6FFF10,#1A6FFF06)', border: '1px solid #1A6FFF25', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', boxSizing: 'border-box' }}>
                              <div style={{ fontSize: '9px', fontWeight: '900', color: '#1A6FFF60', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Récup après le superset</div>
                              <div style={{ fontSize: isMobile ? '42px' : '48px', fontWeight: '900', color: '#1A6FFF', letterSpacing: '-3px', lineHeight: 1 }}>{recuperBloc}s</div>
                            </div>
                            <div style={{ width: '2px', height: '14px', background: '#1A6FFF30' }} />
                          </div>
                        )}
                        </>

                      ) : (
                        /* ─── Solo exercise ─── */
                        (() => {
                          const ex = bloc[0]
                          const couleur = ex.exercices?.familles?.couleur || '#555'
                          const hasVideo = !!ex.exercices?.video_url
                          const isVideoOpen = videoOpen === ex.id
                          const nbSeries = ex.series || 0
                          const metrLabel = ex.repetitions ? 'Reps' : ex.duree_secondes ? 'Durée' : ex.distance_metres ? 'Dist.' : 'Reps'
                          const metrVal = ex.repetitions ? `${ex.repetitions}`
                            : ex.duree_secondes ? `${ex.duree_secondes}''`
                            : ex.distance_metres ? `${ex.distance_metres}m` : '—'
                          const thumbUrl = hasVideo ? vimeoThumb(ex.exercices!.video_url!) : ''
                          const showConsignes = consignesOpen.has(ex.id)

                          return (
                            <div>
                              <div style={{ background: '#0C0C0C', border: `1px solid ${couleur}20`, borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                                {/* Photo / Thumbnail */}
                                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: couleur + '10', overflow: 'hidden', cursor: hasVideo ? 'pointer' : 'default' }}
                                  onClick={() => hasVideo && setVideoOpen(isVideoOpen ? null : ex.id)}>
                                  {hasVideo && thumbUrl && !isVideoOpen && (
                                    <img src={thumbUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                  )}
                                  {hasVideo && isVideoOpen ? (
                                    <iframe
                                      src={vimeoEmbed(ex.exercices!.video_url!)}
                                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                                      allow="autoplay; fullscreen; picture-in-picture" allowFullScreen
                                    />
                                  ) : (
                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                      {!thumbUrl && (
                                        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: couleur + '25', border: `2px solid ${couleur}50`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                          <span style={{ color: couleur, fontSize: '20px' }}>▶</span>
                                        </div>
                                      )}
                                      {thumbUrl && (
                                        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(0,0,0,0.55)', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                                          <span style={{ color: '#FFF', fontSize: '20px', marginLeft: '3px' }}>▶</span>
                                        </div>
                                      )}
                                      {!hasVideo && <span style={{ color: couleur + '40', fontSize: '11px', fontWeight: '700' }}>Pas de vidéo</span>}
                                    </div>
                                  )}
                                  <div style={{ position: 'absolute', top: '10px', left: '10px', width: '28px', height: '28px', borderRadius: '8px', background: couleur, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ color: '#000', fontSize: '12px', fontWeight: '900' }}>{ex.ordre}</span>
                                  </div>
                                  {ex.exercices?.familles && (
                                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', borderRadius: '6px', padding: '3px 8px' }}>
                                      <span style={{ color: couleur, fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{ex.exercices.familles.nom}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Nom + Note + Consignes */}
                                <div style={{ padding: '14px 14px 0' }}>
                                  <div style={{ fontWeight: '900', fontSize: '15px', letterSpacing: '-0.3px', lineHeight: 1.25, color: '#F0F0F0', marginBottom: '8px' }}>{ex.exercices?.nom}</div>
                                  {ex.uni_podal && (
                                    <div style={{ marginBottom: '8px' }}>
                                      <span style={{ background: '#1A6FFF18', border: '1px solid #1A6FFF40', color: '#1A6FFF', fontSize: '11px', fontWeight: '900', padding: '3px 10px', borderRadius: '6px', letterSpacing: '0.3px' }}>↔ Même travail côté opposé</span>
                                    </div>
                                  )}
                                  {ex.notes && (
                                    <div style={{ marginBottom: '10px' }}>
                                      <span style={{ background: '#C9A84C18', border: '1px solid #C9A84C35', color: '#C9A84C', fontSize: '11px', fontWeight: '800', padding: '3px 10px', borderRadius: '6px' }}>● {ex.notes}</span>
                                    </div>
                                  )}
                                  {ex.exercices?.consignes_execution && (
                                    <button onClick={() => toggleConsignes(ex.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                      <span style={{ color: '#C9A84C60', fontSize: '11px', fontWeight: '700' }}>{showConsignes ? '▲' : '▼'} Consignes</span>
                                    </button>
                                  )}
                                  {showConsignes && ex.exercices?.consignes_execution && (
                                    <div style={{ background: '#C9A84C08', borderLeft: '3px solid #C9A84C40', padding: '10px 12px', borderRadius: '0 8px 8px 0', marginBottom: '12px' }}>
                                      <div style={{ color: '#C9A84CAA', fontSize: '12px', lineHeight: '1.65' }}>{ex.exercices.consignes_execution}</div>
                                    </div>
                                  )}
                                </div>

                                {/* Tableau séries */}
                                {nbSeries > 0 && (
                                  <div style={{ padding: '0 10px 14px', flex: 1 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 1fr', padding: '4px 6px', borderBottom: '1px solid #161616', marginBottom: '2px' }}>
                                      {['N°', metrLabel, 'Charge', 'Récup'].map(h => (
                                        <span key={h} style={{ fontSize: '9px', fontWeight: '900', color: '#333', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
                                      ))}
                                    </div>
                                    {Array.from({ length: nbSeries }, (_, si) => {
                                      const isLast = si === nbSeries - 1
                                      const rv = !isLast && ex.recuperation_secondes ? `${ex.recuperation_secondes}s` : '—'
                                      return (
                                        <div key={si} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 1fr', padding: '7px 6px', background: si % 2 === 0 ? '#0A0A0A' : 'transparent', borderRadius: '6px' }}>
                                          <span style={{ fontSize: '12px', fontWeight: '800', color: couleur }}>{si + 1}</span>
                                          <span style={{ fontSize: '13px', fontWeight: '900', color: '#DDD' }}>{metrVal}</span>
                                          <span style={{ fontSize: '13px', fontWeight: '700', color: ex.charge_kg ? '#777' : '#252525' }}>{ex.charge_kg ? `${ex.charge_kg}kg` : '—'}</span>
                                          <span style={{ fontSize: '13px', fontWeight: '700', color: rv !== '—' ? '#2ECC7170' : '#252525' }}>{rv}</span>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>

                              {/* Récup après un exercice solo */}
                              {recuperBloc > 0 && (
                                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                  <div style={{ width: '2px', height: '14px', background: '#2ECC7130' }} />
                                  <div style={{ borderRadius: '14px', padding: isMobile ? '12px 20px' : '14px 32px', width: isMobile ? '100%' : 'auto', background: 'linear-gradient(90deg,#2ECC7112,#2ECC7108)', border: '1px solid #2ECC7130', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', boxSizing: 'border-box' }}>
                                    <div style={{ fontSize: '9px', fontWeight: '900', color: '#2ECC7155', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Récupération</div>
                                    <div style={{ fontSize: isMobile ? '42px' : '48px', fontWeight: '900', color: '#2ECC71', letterSpacing: '-3px', lineHeight: 1 }}>{recuperBloc}s</div>
                                  </div>
                                  <div style={{ width: '2px', height: '14px', background: '#2ECC7130' }} />
                                </div>
                              )}
                            </div>
                          )
                        })()
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Séparateur */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{ flex: 1, height: '1px', background: '#161616' }} />
            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1.5px', color: '#2A2A2A', textTransform: 'uppercase' }}>Mon bilan</span>
            <div style={{ flex: 1, height: '1px', background: '#161616' }} />
          </div>

          {/* Checkbox séance réalisée */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', marginBottom: '32px', padding: '18px 20px', background: form.completee ? '#2ECC7110' : '#0F0F0F', borderRadius: '16px', border: `1px solid ${form.completee ? '#2ECC7135' : '#1A1A1A'}` }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '10px', background: form.completee ? '#2ECC71' : '#161616', border: `2px solid ${form.completee ? '#2ECC71' : '#2A2A2A'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {form.completee && <span style={{ color: '#FFF', fontSize: '16px', fontWeight: '900' }}>✓</span>}
            </div>
            <input type="checkbox" checked={form.completee} onChange={e => setForm(f => ({ ...f, completee: e.target.checked }))} style={{ display: 'none' }} />
            <span style={{ fontWeight: '700', fontSize: '17px', color: form.completee ? '#2ECC71' : '#555' }}>
              {form.completee ? 'Séance réalisée !' : "J'ai fait cette séance"}
            </span>
          </label>

          <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#2A2A2A', marginBottom: '24px' }}>Ton état de forme</div>
          <RatingChips label="Fatigue" value={form.fatigue} couleur="#FF4757" onChange={v => setForm(f => ({ ...f, fatigue: v }))} />
          <RatingChips label="Courbatures" value={form.courbatures} couleur="#FF6B35" onChange={v => setForm(f => ({ ...f, courbatures: v }))} />
          <RatingChips label="Effort perçu (RPE)" value={form.rpe} couleur="#1A6FFF" onChange={v => setForm(f => ({ ...f, rpe: v }))} />
          <RatingChips label="Qualité du sommeil" value={form.qualite_sommeil} couleur="#2ECC71" onChange={v => setForm(f => ({ ...f, qualite_sommeil: v }))} />

          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#2A2A2A', marginBottom: '12px' }}>Sensations / Notes</div>
            <textarea value={form.notes_joueur} onChange={e => setForm(f => ({ ...f, notes_joueur: e.target.value }))}
              placeholder="Comment tu t'es senti pendant la séance..." rows={4}
              style={{ width: '100%', background: '#0F0F0F', border: '1px solid #1A1A1A', borderRadius: '14px', padding: '16px', color: '#CCC', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box', lineHeight: '1.6' }} />
          </div>

          <button onClick={onSave} disabled={saving} style={{
            width: '100%', padding: isMobile ? '18px' : '20px', borderRadius: '18px', border: 'none',
            background: saving ? '#111' : '#1A6FFF', color: saving ? '#333' : '#FFF',
            fontWeight: '900', fontSize: '17px', cursor: saving ? 'not-allowed' : 'pointer',
          }}>
            {saving ? 'Enregistrement...' : realisation.completee ? 'Mettre à jour le bilan' : 'Enregistrer le bilan'}
          </button>
        </div>
      </div>
    </div>
  )
}

function JoueurMessages({ myId, coachId, isMobile }: { myId: string; coachId: string; isMobile: boolean }) {
  type MsgType = {
    id: string; expediteur_id: string; destinataire_id: string
    contenu: string | null; media_url: string | null; media_type: string | null
    lu: boolean; created_at: string
  }
  const [msgs, setMsgs] = useState<MsgType[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [uploading, setUploading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    load()
    markRead()
    subscribePush(myId)
    const interval = setInterval(() => { load(); markRead() }, 3000)
    return () => clearInterval(interval)
  }, [myId, coachId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  async function load() {
    const { data } = await supabase.from('messages').select('*')
      .or(`expediteur_id.eq.${myId},destinataire_id.eq.${myId}`)
      .order('created_at')
    if (data) {
      setMsgs(data.filter(m =>
        (m.expediteur_id === myId && m.destinataire_id === coachId) ||
        (m.expediteur_id === coachId && m.destinataire_id === myId)
      ))
    }
  }

  async function markRead() {
    await supabase.from('messages').update({ lu: true })
      .eq('expediteur_id', coachId).eq('destinataire_id', myId).neq('lu', true)
  }

  async function send() {
    const t = text.trim()
    if (!t || sending) return
    setSending(true)
    setText('')
    const { data: newMsg } = await supabase.from('messages')
      .insert({ expediteur_id: myId, destinataire_id: coachId, contenu: t })
      .select().single()
    if (newMsg) {
      setMsgs(prev => prev.find(m => m.id === newMsg.id) ? prev : [...prev, newMsg])
      sendPush(coachId, 'Nouveau message', t, '/coach')
    }
    setSending(false)
  }

  async function uploadMedia(file: File) {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${myId}/${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('messages').upload(path, file)
    if (!error && data) {
      const { data: { publicUrl } } = supabase.storage.from('messages').getPublicUrl(path)
      const type: 'image' | 'video' = file.type.startsWith('image/') ? 'image' : 'video'
      await supabase.from('messages').insert({ expediteur_id: myId, destinataire_id: coachId, media_url: publicUrl, media_type: type })
      await load()
    }
    setUploading(false)
  }

  const fmtTime = (d: string) => new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
  let lastDate = ''
  const h = isMobile ? 'calc(100vh - 220px)' : 'calc(100vh - 240px)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: h, background: '#0F0F0F', borderRadius: '20px', overflow: 'hidden', border: '1px solid #161616' }}>
      <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display: 'none' }}
        onChange={e => { if (e.target.files?.[0]) uploadMedia(e.target.files[0]); e.target.value = '' }} />

      {/* Header */}
      <div style={{ padding: isMobile ? '14px 16px' : '16px 20px', borderBottom: '1px solid #161616', display: 'flex', alignItems: 'center', gap: '12px', background: '#0C0C0C' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#C9A84C20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🏋️</div>
        <div>
          <div style={{ fontWeight: '700', fontSize: '14px', color: '#FFF' }}>Coach</div>
          <div style={{ fontSize: '11px', color: '#444' }}>PAGACOACHING</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px' : '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {msgs.length === 0 && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2A2A2A', fontSize: '13px' }}>
            Aucun message — le coach peut te contacter ici
          </div>
        )}
        {msgs.map(m => {
          const isMe = m.expediteur_id === myId
          const d = m.created_at.split('T')[0]
          const showDate = d !== lastDate
          lastDate = d
          return (
            <div key={m.id}>
              {showDate && (
                <div style={{ textAlign: 'center', margin: '12px 0 8px', color: '#333', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {fmtDate(m.created_at)}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: '2px' }}>
                <div style={{
                  maxWidth: '75%',
                  background: isMe ? '#1A6FFF' : '#1A1A1A',
                  borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  padding: m.media_url ? '6px' : '10px 14px',
                }}>
                  {m.media_url && m.media_type === 'image' && (
                    <img src={m.media_url} alt="" style={{ maxWidth: isMobile ? '200px' : '260px', maxHeight: '300px', borderRadius: '12px', display: 'block', objectFit: 'cover' }} />
                  )}
                  {m.media_url && m.media_type === 'video' && (
                    <video src={m.media_url} controls style={{ maxWidth: isMobile ? '200px' : '260px', borderRadius: '12px', display: 'block' }} />
                  )}
                  {m.contenu && (
                    <div style={{ fontSize: isMobile ? '15px' : '14px', color: '#FFF', lineHeight: 1.5, wordBreak: 'break-word' }}>{m.contenu}</div>
                  )}
                  <div style={{ fontSize: '10px', color: isMe ? '#FFFFFF70' : '#444', marginTop: m.media_url ? '4px' : '3px', textAlign: isMe ? 'right' : 'left' }}>
                    {fmtTime(m.created_at)}{isMe && (m.lu ? ' ✓✓' : ' ✓')}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
<div style={{ padding: isMobile ? `12px 12px calc(12px + env(safe-area-inset-bottom))` : '12px 16px', borderTop: '1px solid #161616', display: 'flex', gap: '8px', alignItems: 'flex-end', background: '#0C0C0C' }}>
        <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{
          flexShrink: 0, width: '44px', height: '44px', borderRadius: '14px',
          background: '#161616', border: '1px solid #1E1E1E', color: uploading ? '#2A2A2A' : '#666',
          cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {uploading ? '⏳' : '📎'}
        </button>
        <textarea
          value={text}
          onChange={e => { setText(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px' }}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="Message au coach..."
          rows={1}
          style={{
            flex: 1, background: '#161616', border: '1px solid #1E1E1E', borderRadius: '16px',
            padding: '12px 16px', color: '#FFF', fontSize: isMobile ? '16px' : '14px', outline: 'none',
            resize: 'none', maxHeight: '120px', lineHeight: 1.5, fontFamily: 'inherit',
          }}
        />
        <button onClick={send} disabled={sending || !text.trim()} style={{
          flexShrink: 0, width: '44px', height: '44px', borderRadius: '14px',
          background: text.trim() ? '#1A6FFF' : '#161616', border: 'none',
          color: text.trim() ? '#FFF' : '#2A2A2A', cursor: text.trim() ? 'pointer' : 'default',
          fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
        }}>
          ↑
        </button>
      </div>
    </div>
  )
}

export default function JoueurPage() {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]
  const [joueur, setJoueur] = useState<Joueur | null>(null)
  const [realisations, setRealisations] = useState<Realisation[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Realisation | null>(null)
  const [form, setForm] = useState<WellnessForm>({ completee: false, fatigue: null, courbatures: null, rpe: null, qualite_sommeil: null, notes_joueur: '' })
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState<'seances' | 'messages'>('seances')
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const [lundiSemaine, setLundiSemaine] = useState(() => {
    const d = new Date(); const day = d.getDay()
    d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day))
    return d.toISOString().split('T')[0]
  })

  const jours = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(lundiSemaine + 'T12:00:00'); d.setDate(d.getDate() + i)
    return d.toISOString().split('T')[0]
  })

  function aller(delta: number) {
    const d = new Date(lundiSemaine + 'T12:00:00'); d.setDate(d.getDate() + delta * 7)
    setLundiSemaine(d.toISOString().split('T')[0])
  }

  useEffect(() => { init() }, [])

  useEffect(() => {
    const authId = joueur?.auth_id
    const coachId = joueur?.coach_id
    if (!authId || !coachId) return
    const checkUnread = async () => {
      const { count } = await supabase.from('messages').select('*', { count: 'exact', head: true })
        .eq('expediteur_id', coachId).eq('destinataire_id', authId).neq('lu', true)
      if (activeSection !== 'messages') setUnreadMessages(count || 0)
    }
    checkUnread()
    const interval = setInterval(checkUnread, 3000)
    return () => clearInterval(interval)
  }, [joueur?.auth_id, joueur?.coach_id, activeSection])

  async function init() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    // Requête de base — critique pour le login
    const { data: j } = await supabase.from('joueurs')
      .select('id, nom, prenom, email, poste, club')
      .eq('email', user.email).single()
    if (!j) { router.push('/login'); return }

    setJoueur(j)
    await load(j.id)
    setLoading(false)

    // Colonnes messaging — auto-remplissage si null, non-bloquant
    try {
      const { data: jExt } = await supabase.from('joueurs')
        .select('auth_id, coach_id')
        .eq('id', j.id).single()

      let authId = jExt?.auth_id ?? null
      let coachId = jExt?.coach_id ?? null

      // Auto-set auth_id si manquant
      if (!authId) {
        authId = user.id
        await supabase.from('joueurs').update({ auth_id: authId }).eq('id', j.id)
      }

      // Auto-set coach_id si manquant
      if (!coachId) {
        const res = await fetch('/api/coach-id')
        if (res.ok) {
          const json = await res.json()
          coachId = json.coach_id
          if (coachId) await supabase.from('joueurs').update({ coach_id: coachId }).eq('id', j.id)
        }
      }

      if (authId || coachId) {
        setJoueur(prev => prev ? { ...prev, auth_id: authId ?? undefined, coach_id: coachId ?? undefined } : prev)
      }

      if (authId && coachId) {
        const { count } = await supabase.from('messages').select('*', { count: 'exact', head: true })
          .eq('expediteur_id', coachId).eq('destinataire_id', authId).eq('lu', false)
        setUnreadMessages(count || 0)
      }
    } catch {
      // colonnes ou table messages pas encore disponibles
    }
  }

  async function load(joueurId: string) {
    const { data } = await supabase
      .from('realisations')
      .select('id, seance_id, date_realisation, completee, rpe, fatigue, courbatures, qualite_sommeil, notes_joueur, seances(id, nom, type, seance_exercices(id, ordre, series, repetitions, duree_secondes, distance_metres, charge_kg, recuperation_secondes, recuperation_inter_sets, lien_suivant, uni_podal, notes, exercices(nom, video_url, consignes_execution, familles(nom, couleur))))')
      .eq('joueur_id', joueurId).order('date_realisation')
    if (data) setRealisations(data as unknown as Realisation[])
  }

  function ouvrir(r: Realisation) {
    setSelected(r)
    setForm({ completee: r.completee, fatigue: r.fatigue ?? null, courbatures: r.courbatures ?? null, rpe: r.rpe ?? null, qualite_sommeil: r.qualite_sommeil ?? null, notes_joueur: r.notes_joueur ?? '' })
  }

  async function sauvegarder() {
    if (!selected || !joueur) return
    setSaving(true)
    await supabase.from('realisations').update({ completee: form.completee, fatigue: form.fatigue, courbatures: form.courbatures, rpe: form.rpe, qualite_sommeil: form.qualite_sommeil, notes_joueur: form.notes_joueur || null }).eq('id', selected.id)
    await load(joueur.id)
    setSaving(false)
    setSelected(null)
  }

  const realsParDate: Record<string, Realisation[]> = {}
  for (const r of realisations) {
    if (!realsParDate[r.date_realisation]) realsParDate[r.date_realisation] = []
    realsParDate[r.date_realisation].push(r)
  }

  const realsSemanine = jours.flatMap(d => realsParDate[d] || [])
  const nbTotal = realsSemanine.length
  const nbDone = realsSemanine.filter(r => r.completee).length

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#333', fontSize: '14px' }}>Chargement...</div>
    </div>
  )
  if (!joueur) return null

  const px = isMobile ? '16px' : '40px'

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#FFF', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* SessionDetail overlay */}
      {selected && (
        <SessionDetail
          realisation={selected}
          form={form}
          setForm={setForm}
          saving={saving}
          onSave={sauvegarder}
          onClose={() => setSelected(null)}
          isMobile={isMobile}
        />
      )}

      {/* Header */}
      <div style={{ padding: `28px ${px} 20px`, background: '#0C0C0C', borderBottom: '1px solid #111' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: '#2A2A2A', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>PAGACOACHING</div>
            <button onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
              style={{ background: 'none', border: '1px solid #1E1E1E', borderRadius: '8px', padding: '7px 14px', color: '#444', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
              Déconnexion
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: isMobile ? '52px' : '64px', height: isMobile ? '52px' : '64px', borderRadius: '18px', background: 'linear-gradient(135deg, #1A6FFF30, #1A6FFF60)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: isMobile ? '18px' : '22px', color: '#1A6FFF', flexShrink: 0 }}>
                {joueur.prenom[0]}{joueur.nom[0]}
              </div>
              <div>
                <div style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '900', letterSpacing: '-0.5px' }}>Bonjour, {joueur.prenom}</div>
                {(joueur.poste || joueur.club) && (
                  <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#444', marginTop: '3px', fontWeight: '500' }}>
                    {[joueur.poste, joueur.club].filter(Boolean).join(' · ')}
                  </div>
                )}
              </div>
            </div>
            {nbTotal > 0 && (
              <div style={{ background: '#111', borderRadius: '14px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '16px', minWidth: isMobile ? '100%' : '280px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#555', fontWeight: '600' }}>Séances cette semaine</span>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: nbDone === nbTotal ? '#2ECC71' : '#FFF' }}>{nbDone}/{nbTotal}</span>
                  </div>
                  <div style={{ height: '5px', background: '#1E1E1E', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${nbTotal ? (nbDone / nbTotal) * 100 : 0}%`, background: nbDone === nbTotal ? '#2ECC71' : '#1A6FFF', borderRadius: '3px' }} />
                  </div>
                </div>
                <div style={{ fontSize: '28px', fontWeight: '900', color: nbDone === nbTotal && nbTotal > 0 ? '#2ECC71' : '#1A6FFF' }}>
                  {nbDone === nbTotal && nbTotal > 0 ? '🏆' : `${Math.round(nbTotal ? (nbDone / nbTotal) * 100 : 0)}%`}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ background: '#0C0C0C', borderBottom: '1px solid #111', padding: `0 ${px}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '0' }}>
          {(['seances', 'messages'] as const).map(s => (
            <button key={s} onClick={() => { setActiveSection(s); if (s === 'messages') setUnreadMessages(0) }} style={{
              padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '14px', fontWeight: '700',
              color: activeSection === s ? '#1A6FFF' : '#444',
              borderBottom: `2px solid ${activeSection === s ? '#1A6FFF' : 'transparent'}`,
              transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              {s === 'seances' ? '📅 Séances' : '💬 Messages'}
              {s === 'messages' && unreadMessages > 0 && (
                <span style={{ background: '#FF4757', color: '#FFF', borderRadius: '10px', fontSize: '10px', fontWeight: '800', padding: '2px 7px' }}>{unreadMessages}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: `24px ${px}` }}>

        {/* Messages */}
        {activeSection === 'messages' && joueur?.auth_id && joueur?.coach_id && (
          <JoueurMessages myId={joueur.auth_id} coachId={joueur.coach_id} isMobile={isMobile} />
        )}
        {activeSection === 'messages' && !(joueur?.auth_id && joueur?.coach_id) && (
          <div style={{ background: '#0F0F0F', border: '1px solid #1E1E1E', borderRadius: '16px', padding: '48px', textAlign: 'center', color: '#333', fontSize: '14px' }}>
            La messagerie sera disponible après connexion avec le coach.
          </div>
        )}

        {activeSection === 'seances' && (<>

        {/* Navigation semaine */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <button onClick={() => aller(-1)} style={{ background: '#111', border: '1px solid #1E1E1E', borderRadius: '10px', width: '40px', height: '40px', color: '#555', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
          <button onClick={() => { const d = new Date(); const day = d.getDay(); d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day)); setLundiSemaine(d.toISOString().split('T')[0]) }}
            style={{ background: '#111', border: '1px solid #1E1E1E', borderRadius: '10px', padding: '0 14px', height: '40px', color: '#555', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>Aujourd'hui</button>
          <div style={{ flex: 1, textAlign: 'center', fontSize: isMobile ? '13px' : '15px', fontWeight: '700', color: '#888' }}>
            {new Date(jours[0] + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: isMobile ? 'short' : 'long' })} – {new Date(jours[6] + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: isMobile ? 'short' : 'long', year: 'numeric' })}
          </div>
          <button onClick={() => aller(1)} style={{ background: '#111', border: '1px solid #1E1E1E', borderRadius: '10px', width: '40px', height: '40px', color: '#555', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
        </div>

        {/* Strip jours — style Everfit */}
        <div style={{ display: 'flex', gap: isMobile ? '5px' : '8px', marginBottom: '28px' }}>
          {jours.map((ds, i) => {
            const reals = realsParDate[ds] || []
            const isToday = ds === today
            const isPast = ds < today
            const hasSessions = reals.length > 0
            const allDone = hasSessions && reals.every(r => r.completee)
            const someMissed = hasSessions && !allDone && isPast
            const dayLetters = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
            const circleColor = isToday ? '#1A6FFF' : allDone ? '#2ECC71' : someMissed ? '#FF4757' : hasSessions ? '#1A6FFF' : 'transparent'
            const circleOpacity = isToday || allDone || someMissed ? 1 : hasSessions ? 0.25 : 0
            return (
              <div key={ds} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: isToday ? '#1A6FFF' : '#333', letterSpacing: '0.3px' }}>
                  {dayLetters[i]}
                </span>
                <div style={{
                  width: '100%', aspectRatio: '1', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isToday ? '#1A6FFF' : allDone ? '#2ECC71' : `${circleColor}${hasSessions && !isToday ? '22' : '00'}`,
                  border: `2px solid ${isToday ? '#1A6FFF' : allDone ? '#2ECC71' : someMissed ? '#FF4757' : hasSessions ? '#1A6FFF55' : '#1A1A1A'}`,
                }}>
                  <span style={{ fontSize: isMobile ? '13px' : '15px', fontWeight: '800', color: isToday ? '#FFF' : allDone ? '#FFF' : hasSessions ? (isPast ? '#FF4757' : '#1A6FFF') : '#2A2A2A' }}>
                    {allDone ? '✓' : new Date(ds + 'T12:00:00').getDate()}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Séances par jour — style TotalCoaching */}
        {jours.map(ds => {
          const reals = realsParDate[ds] || []
          if (reals.length === 0) return null
          const isToday = ds === today
          const isPast = ds < today
          const dateLabel = new Date(ds + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
          return (
            <div key={ds} style={{ marginBottom: '28px' }}>
              {/* En-tête de jour */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', paddingLeft: '2px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: isToday ? '#1A6FFF' : '#333', textTransform: 'uppercase', letterSpacing: '1.2px' }}>{dateLabel}</span>
                {isToday && <span style={{ background: '#1A6FFF', color: '#FFF', fontSize: '9px', padding: '2px 8px', borderRadius: '20px', fontWeight: '900', letterSpacing: '0.5px' }}>AUJOURD'HUI</span>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {reals.map(r => {
                  const hasWellness = r.fatigue != null || r.rpe != null || r.courbatures != null || r.qualite_sommeil != null
                  const exCount = r.seances?.seance_exercices?.length || 0
                  const statusColor = r.completee ? '#2ECC71' : isPast ? '#FF4757' : '#1A6FFF'
                  const statusLabel = r.completee ? 'Terminé' : isPast ? 'Manqué' : isToday ? 'Prévu aujourd\'hui' : 'À venir'
                  const wellnessItems = [
                    r.fatigue != null ? { label: 'Fatigue', val: r.fatigue, color: r.fatigue <= 3 ? '#2ECC71' : r.fatigue <= 5 ? '#F39C12' : r.fatigue <= 7 ? '#FF6B35' : '#FF4757' } : null,
                    r.rpe != null ? { label: 'Effort', val: r.rpe, color: '#1A6FFF' } : null,
                    r.courbatures != null ? { label: 'Courbatures', val: r.courbatures, color: '#FF6B35' } : null,
                    r.qualite_sommeil != null ? { label: 'Sommeil', val: r.qualite_sommeil, color: '#2ECC71' } : null,
                  ].filter(Boolean) as { label: string; val: number; color: string }[]

                  return (
                    <div key={r.id} onClick={() => ouvrir(r)} style={{
                      background: '#0F0F0F',
                      border: '1px solid #1A1A1A',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      display: 'flex',
                    }}>
                      {/* Barre colorée gauche */}
                      <div style={{ width: '4px', background: statusColor, flexShrink: 0 }} />

                      {/* Contenu */}
                      <div style={{ flex: 1, padding: isMobile ? '14px 14px 14px 16px' : '16px 20px' }}>

                        {/* Ligne principale */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: hasWellness && r.completee ? '12px' : '0' }}>

                          {/* Icône statut */}
                          <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: `${statusColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${statusColor}30` }}>
                            <span style={{ fontSize: '20px', color: statusColor, lineHeight: 1 }}>
                              {r.completee ? '✓' : isPast ? '✗' : '▶'}
                            </span>
                          </div>

                          {/* Texte */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: '800', fontSize: isMobile ? '15px' : '16px', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#F0F0F0' }}>
                              {r.seances?.nom}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '12px', fontWeight: '700', color: statusColor }}>{statusLabel}</span>
                              <span style={{ color: '#2A2A2A', fontSize: '12px' }}>·</span>
                              <span style={{ color: '#444', fontSize: '12px' }}>{exCount} exercice{exCount > 1 ? 's' : ''}</span>
                            </div>
                          </div>

                          {/* Badge fatigue si renseigné */}
                          {r.completee && r.fatigue != null ? (
                            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', background: `${wellnessItems[0]?.color || '#2ECC71'}18`, border: `1px solid ${wellnessItems[0]?.color || '#2ECC71'}35`, borderRadius: '12px', padding: '5px 10px', minWidth: '46px' }}>
                              <span style={{ fontSize: '8px', fontWeight: '900', color: `${wellnessItems[0]?.color || '#2ECC71'}90`, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fatigue</span>
                              <span style={{ fontSize: '20px', fontWeight: '900', color: wellnessItems[0]?.color || '#2ECC71', lineHeight: 1 }}>{r.fatigue}</span>
                              <span style={{ fontSize: '8px', color: '#333' }}>/10</span>
                            </div>
                          ) : (
                            <div style={{ flexShrink: 0, color: '#2A2A2A', fontSize: '18px' }}>›</div>
                          )}
                        </div>

                        {/* Bande wellness */}
                        {hasWellness && r.completee && (
                          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${wellnessItems.length}, 1fr)`, gap: '10px', paddingTop: '12px', borderTop: '1px solid #161616' }}>
                            {wellnessItems.map(item => (
                              <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <span style={{ fontSize: '9px', fontWeight: '800', color: '#333', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</span>
                                <div style={{ display: 'flex', gap: '2px' }}>
                                  {Array.from({ length: 10 }, (_, i) => (
                                    <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i < item.val ? item.color : '#1A1A1A' }} />
                                  ))}
                                </div>
                                <span style={{ fontSize: '11px', fontWeight: '900', color: item.color }}>{item.val}<span style={{ color: '#2A2A2A', fontWeight: '400' }}>/10</span></span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Invite bilan */}
                        {r.completee && !hasWellness && (
                          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #161616', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '13px' }}>⚡</span>
                            <span style={{ fontSize: '12px', color: '#F39C12', fontWeight: '700' }}>Renseigne ton bilan de séance →</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {jours.every(ds => (realsParDate[ds] || []).length === 0) && (
          <div style={{ background: '#0F0F0F', border: '1px solid #161616', borderRadius: '20px', padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>😴</div>
            <div style={{ color: '#333', fontSize: isMobile ? '14px' : '16px', fontWeight: '600' }}>Aucune séance prévue cette semaine</div>
            <div style={{ color: '#1E1E1E', fontSize: '13px', marginTop: '8px' }}>Profite du repos !</div>
          </div>
        )}

        </>)}
      </div>
    </div>
  )
}
