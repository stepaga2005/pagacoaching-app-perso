'use client'

import React, { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { subscribePush, sendPush } from '@/lib/push'
import { useRouter } from 'next/navigation'

type Joueur = { id: string; nom: string; prenom: string; email: string; poste?: string; club?: string; auth_id?: string; coach_id?: string }
type SetConfig = { reps?: number; duree?: number; dist?: number; charge?: number; recup?: number }
type SeanceExercice = {
  id: string; ordre: number; series?: number; repetitions?: number
  duree_secondes?: number; distance_metres?: number; charge_kg?: number
  recuperation_secondes?: number; recuperation_inter_sets?: number; lien_suivant?: boolean; uni_podal?: boolean; notes?: string
  sets_config?: SetConfig[] | null
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

function playBeep() {
  try {
    const ctx = new AudioContext()
    const seq = [880, 1100, 1320]
    seq.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.frequency.value = freq
      const t = ctx.currentTime + i * 0.18
      gain.gain.setValueAtTime(0.25, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15)
      osc.start(t); osc.stop(t + 0.15)
    })
  } catch {}
}

function hapticJ(type: 'tap' | 'done' = 'tap') {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return
  navigator.vibrate(type === 'done' ? [80, 60, 80, 60, 160] : [12])
}

function RecupTimer({ initialSec, onClose }: { initialSec: number; onClose: () => void }) {
  const [total, setTotal] = useState(initialSec)
  const [remaining, setRemaining] = useState(initialSec)
  const [running, setRunning] = useState(true)
  const doneRef = useRef(false)

  useEffect(() => {
    if (!running || remaining <= 0) return
    const t = setTimeout(() => setRemaining(r => r - 1), 1000)
    return () => clearTimeout(t)
  }, [remaining, running])

  useEffect(() => {
    if (remaining === 0 && !doneRef.current) {
      doneRef.current = true
      playBeep()
      hapticJ('done')
      setTimeout(onClose, 2000)
    }
  }, [remaining, onClose])

  const pct = total > 0 ? remaining / total : 0
  const R = 88
  const circumference = 2 * Math.PI * R
  const done = remaining === 0
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const arcColor = done ? '#2ECC71' : pct > 0.5 ? '#1A6FFF' : pct > 0.25 ? '#F39C12' : '#FF4757'
  const presets = [30, 45, 60, 90, 120, 180]

  function reset(s: number) {
    setTotal(s); setRemaining(s)
    doneRef.current = false; setRunning(true)
    hapticJ('tap')
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 600, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }} />
      <div style={{
        position: 'relative', background: '#0D0D12',
        borderRadius: '24px 24px 0 0', padding: '20px 24px 44px',
        animation: 'slideUp 0.35s cubic-bezier(0.22,1,0.36,1)',
        boxShadow: '0 -20px 60px rgba(0,0,0,0.6)',
      }}>
        {/* Handle */}
        <div style={{ width: '36px', height: '4px', background: '#2A2A2A', borderRadius: '2px', margin: '0 auto 20px' }} />

        <div style={{ textAlign: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#6A6A8A' }}>Récupération</span>
        </div>

        {/* Cercle SVG */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', position: 'relative' }}>
          <div style={{ position: 'relative', width: '216px', height: '216px' }}>
            <svg width="216" height="216" style={{ transform: 'rotate(-90deg)', display: 'block' }}>
              <circle cx="108" cy="108" r={R} fill="none" stroke="#18181F" strokeWidth="10" />
              <circle
                cx="108" cy="108" r={R} fill="none"
                stroke={arcColor} strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={`${circumference * (1 - pct)}`}
                style={{ transition: 'stroke-dashoffset 0.95s linear, stroke 0.4s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {done ? (
                <div style={{ fontSize: '52px', animation: 'splashWordIn 0.3s ease' }}>✅</div>
              ) : (
                <>
                  <div style={{ fontSize: mins > 0 ? '48px' : '62px', fontWeight: '900', color: '#FFF', letterSpacing: '-3px', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                    {mins > 0 ? `${mins}:${String(secs).padStart(2, '0')}` : String(secs)}
                  </div>
                  {mins === 0 && <div style={{ fontSize: '11px', color: '#6A6A8A', fontWeight: '700', marginTop: '2px' }}>sec</div>}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Contrôles */}
        {!done && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '20px' }}>
            <button onClick={() => { hapticJ('tap'); setRemaining(r => Math.max(5, r - 15)) }} style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#18181F', border: '1px solid #2A2A2A', color: '#A8A8C4', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>−15s</button>
            <button onClick={() => { hapticJ('tap'); setRunning(r => !r) }} style={{ width: '68px', height: '68px', borderRadius: '50%', background: running ? '#1A6FFF' : '#2A2A2A', border: 'none', color: '#FFF', fontSize: '22px', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {running ? '⏸' : '▶'}
            </button>
            <button onClick={() => { hapticJ('tap'); setRemaining(r => r + 15); setTotal(t => t + 15) }} style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#18181F', border: '1px solid #2A2A2A', color: '#A8A8C4', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>+15s</button>
          </div>
        )}

        {/* Presets */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {presets.map(s => (
            <button key={s} onClick={() => reset(s)} style={{
              padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '700',
              border: `1px solid ${total === s && !done ? '#1A6FFF' : '#1F1F2A'}`,
              background: total === s && !done ? '#1A6FFF18' : '#13131A',
              color: total === s && !done ? '#1A6FFF' : '#444',
              transition: 'all 0.15s',
            }}>
              {s >= 60 ? `${s / 60}min` : `${s}s`}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function RatingChips({ label, value, couleur, onChange }: {
  label: string; value: number | null; couleur: string; onChange: (v: number | null) => void
}) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
        <span style={{ color: '#999', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</span>
        <span style={{ color: value !== null ? couleur : '#333', fontWeight: '900', fontSize: '22px', lineHeight: 1 }}>
          {value !== null ? value : '–'}<span style={{ color: '#6A6A8A', fontSize: '12px', fontWeight: '400' }}>/10</span>
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

function SessionDetail({ realisation, form, setForm, saving, onSave, onComplete, onClose, isMobile }: {
  realisation: Realisation
  form: WellnessForm
  setForm: React.Dispatch<React.SetStateAction<WellnessForm>>
  saving: boolean
  onSave: () => void
  onComplete: () => void
  onClose: () => void
  isMobile: boolean
}) {
  const [chronoSec, setChronoSec] = useState(0)
  const [chronoRunning, setChronoRunning] = useState(false)
  const [videoOpen, setVideoOpen] = useState<string | null>(null)
  const [consignesOpen, setConsignesOpen] = useState<Set<string>>(new Set())
  const [timerSec, setTimerSec] = useState<number | null>(null)

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

      {/* Timer de récupération */}
      {timerSec !== null && (
        <RecupTimer initialSec={timerSec} onClose={() => setTimerSec(null)} />
      )}

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
              <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#6868A0', marginBottom: '16px' }}>Programme</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {blocs.map((bloc, bi) => {
                  const isSuperset = bloc.length > 1
                  const seriesShared = bloc[0].series || 0
                  const lastExo = bloc[bloc.length - 1]
                  // Récup entre les sets (nouveau champ) sur le dernier exercice du bloc
                  const recuperInterSets = lastExo.recuperation_inter_sets ?? 0
                  // Récup après le bloc : pour superset → recuperation_secondes du dernier exo
                  //                       pour solo → dernier recup de sets_config, sinon recuperation_secondes
                  const lastSetRecup = !isSuperset && lastExo.sets_config && lastExo.sets_config.length > 0
                    ? (lastExo.sets_config[lastExo.sets_config.length - 1]?.recup ?? 0)
                    : 0
                  const recuperBloc = lastSetRecup > 0 ? lastSetRecup : (lastExo.recuperation_secondes ?? 0)

                  return (
                    <div key={bi}>

                      {/* ─── Superset : frame + label ─── */}
                      {isSuperset ? (
                        <>
                        <div style={{ border: '2px solid #1A6FFF55', borderRadius: '18px', background: '#060D1E', overflow: 'hidden', boxShadow: '0 0 0 1px #1A6FFF18, inset 0 1px 0 #1A6FFF25' }}>

                          {/* Label superset / circuit */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: 'linear-gradient(90deg, #1A6FFF22, #1A6FFF08)', borderBottom: '1px solid #1A6FFF30' }}>
                            <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: '#1A6FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <span style={{ fontSize: '13px' }}>{bloc.length > 2 ? '🔄' : '🔗'}</span>
                            </div>
                            <span style={{ color: '#6BAAFF', fontSize: '11px', fontWeight: '900', letterSpacing: '1.5px' }}>{bloc.length > 2 ? 'CIRCUIT' : 'SUPERSET'}</span>
                            {seriesShared > 0 && <span style={{ color: '#1A6FFF', fontSize: '13px', fontWeight: '800' }}>{seriesShared} séries</span>}
                            <div style={{ flex: 1 }} />
                            <span style={{ color: '#1A6FFF60', fontSize: '11px', fontWeight: '700' }}>{bloc.length} exercices</span>
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
                              const ssFirstSet = ex.sets_config?.[0]
                              const metrLabel = (ssFirstSet?.reps ?? ex.repetitions) ? 'Reps' : (ssFirstSet?.duree ?? ex.duree_secondes) ? 'Durée' : (ssFirstSet?.dist ?? ex.distance_metres) ? 'Dist.' : 'Reps'
                              const metrVal = (ssFirstSet?.reps ?? ex.repetitions) ? `${ssFirstSet?.reps ?? ex.repetitions}`
                                : (ssFirstSet?.duree ?? ex.duree_secondes) ? `${ssFirstSet?.duree ?? ex.duree_secondes}''`
                                : (ssFirstSet?.dist ?? ex.distance_metres) ? `${ssFirstSet?.dist ?? ex.distance_metres}m` : '—'
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
                              const recupColor = (val: string) => val === '—' ? '#4A4A6A' : !isLastInBloc ? '#6BAAFF' : '#2ECC71'

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
                                        <span style={{ color: couleur, fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{ex.exercices.familles.nom}</span>
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
                                        <span style={{ color: '#C9A84CAA', fontSize: '11px', fontWeight: '700' }}>{showConsignes ? '▲' : '▼'} Consignes</span>
                                      </button>
                                    )}
                                    {showConsignes && ex.exercices?.consignes_execution && (
                                      <div style={{ background: '#C9A84C08', borderLeft: '3px solid #C9A84C40', padding: '10px 12px', borderRadius: '0 8px 8px 0', marginBottom: '12px' }}>
                                        <div style={{ color: '#C9A84CDD', fontSize: '12px', lineHeight: '1.65' }}>{ex.exercices.consignes_execution}</div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Tableau séries — toujours affiché */}
                                  <div style={{ padding: '0 10px 14px', flex: 1 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 1fr', padding: '4px 6px', borderBottom: '1px solid #2A2A3A', marginBottom: '2px' }}>
                                      {['N°', metrLabel, 'Charge', recupHeader].map(h => (
                                        <span key={h} style={{ fontSize: '11px', fontWeight: '900', color: h === recupHeader && !isLastInBloc ? '#6BAAFF' : '#8888AA', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
                                      ))}
                                    </div>
                                    {Array.from({ length: nbSeries }, (_, si) => {
                                      const rv = getRecupSerie(si)
                                      const setData = ex.sets_config?.[si]
                                      const rowMetr = setData
                                        ? (setData.reps ? `${setData.reps}` : setData.duree ? `${setData.duree}''` : setData.dist ? `${setData.dist}m` : metrVal)
                                        : metrVal
                                      const rowCharge = setData?.charge ?? ex.charge_kg
                                      return (
                                        <div key={si} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 1fr', padding: '7px 6px', background: si % 2 === 0 ? '#111828' : 'transparent', borderRadius: '6px' }}>
                                          <span style={{ fontSize: '12px', fontWeight: '800', color: couleur }}>{si + 1}</span>
                                          <span style={{ fontSize: '13px', fontWeight: '900', color: '#FFFFFF' }}>{rowMetr}</span>
                                          <span style={{ fontSize: '13px', fontWeight: '700', color: rowCharge ? '#C0C0D8' : '#4A4A6A' }}>{rowCharge ? `${rowCharge}kg` : '—'}</span>
                                          {rv !== '—' && rv !== 'Direct' ? (
                                            <span onClick={() => { hapticJ('tap'); setTimerSec(parseInt(rv)) }} style={{ fontSize: '13px', fontWeight: '700', color: recupColor(rv), cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted', textDecorationColor: recupColor(rv) + '80' }}>⏱ {rv}</span>
                                          ) : (
                                            <span style={{ fontSize: '13px', fontWeight: '700', color: recupColor(rv) }}>{rv}</span>
                                          )}
                                        </div>
                                      )
                                    })}
                                  </div>

                                  {/* Connecteur mobile entre les exercices du superset */}
                                  {isMobile && !isLastInBloc && (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', gap: '8px' }}>
                                      <div style={{ flex: 1, height: '1px', background: '#1A6FFF20' }} />
                                      <span style={{ color: '#6BAAFF', fontSize: '12px', fontWeight: '700' }}>
                                        {ex.recuperation_secondes ? `⏱ ${ex.recuperation_secondes}s puis →` : '→ Enchaîner'}
                                      </span>
                                      <div style={{ flex: 1, height: '1px', background: '#1A6FFF20' }} />
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>

                          {/* Footer fermeture */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'linear-gradient(90deg, #1A6FFF18, #1A6FFF06)', borderTop: '1px solid #1A6FFF25' }}>
                            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #1A6FFF50, transparent)' }} />
                            <span style={{ fontSize: '11px', fontWeight: '900', color: '#1A6FFF60', letterSpacing: '1.5px', textTransform: 'uppercase' }}>fin du {bloc.length > 2 ? 'circuit' : 'superset'}</span>
                            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #1A6FFF50)' }} />
                          </div>

                        </div>

                        {/* Récup après le superset — centré, hors du frame */}
                        {recuperBloc > 0 && (
                          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: '2px', height: '14px', background: '#1A6FFF30' }} />
                            <button onClick={() => { hapticJ('tap'); setTimerSec(recuperBloc) }} style={{ borderRadius: '14px', padding: isMobile ? '12px 20px' : '14px 32px', width: isMobile ? '100%' : 'auto', background: 'linear-gradient(90deg,#1A6FFF15,#1A6FFF08)', border: '1px solid #1A6FFF40', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', boxSizing: 'border-box', cursor: 'pointer' }}>
                              <div style={{ fontSize: '11px', fontWeight: '900', color: '#1A6FFF80', textTransform: 'uppercase', letterSpacing: '1.5px' }}>⏱ Récup superset — tap pour lancer</div>
                              <div style={{ fontSize: isMobile ? '42px' : '48px', fontWeight: '900', color: '#1A6FFF', letterSpacing: '-3px', lineHeight: 1 }}>{recuperBloc}s</div>
                            </button>
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
                          const firstSet = ex.sets_config?.[0]
                          const metrLabel = (firstSet?.reps ?? ex.repetitions) ? 'Reps' : (firstSet?.duree ?? ex.duree_secondes) ? 'Durée' : (firstSet?.dist ?? ex.distance_metres) ? 'Dist.' : 'Reps'
                          const metrVal = (firstSet?.reps ?? ex.repetitions) ? `${firstSet?.reps ?? ex.repetitions}`
                            : (firstSet?.duree ?? ex.duree_secondes) ? `${firstSet?.duree ?? ex.duree_secondes}''`
                            : (firstSet?.dist ?? ex.distance_metres) ? `${firstSet?.dist ?? ex.distance_metres}m` : '—'
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
                                      <span style={{ color: couleur, fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{ex.exercices.familles.nom}</span>
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
                                      <span style={{ color: '#C9A84CAA', fontSize: '11px', fontWeight: '700' }}>{showConsignes ? '▲' : '▼'} Consignes</span>
                                    </button>
                                  )}
                                  {showConsignes && ex.exercices?.consignes_execution && (
                                    <div style={{ background: '#C9A84C08', borderLeft: '3px solid #C9A84C40', padding: '10px 12px', borderRadius: '0 8px 8px 0', marginBottom: '12px' }}>
                                      <div style={{ color: '#C9A84CDD', fontSize: '12px', lineHeight: '1.65' }}>{ex.exercices.consignes_execution}</div>
                                    </div>
                                  )}
                                </div>

                                {/* Tableau séries */}
                                {nbSeries > 0 && (
                                  <div style={{ padding: '0 10px 14px', flex: 1 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 1fr', padding: '4px 6px', borderBottom: '1px solid #2A2A3A', marginBottom: '2px' }}>
                                      {['N°', metrLabel, 'Charge', 'Récup'].map(h => (
                                        <span key={h} style={{ fontSize: '11px', fontWeight: '900', color: '#8888AA', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
                                      ))}
                                    </div>
                                    {Array.from({ length: nbSeries }, (_, si) => {
                                      const isLast = si === nbSeries - 1
                                      const setData = ex.sets_config?.[si]
                                      const rowMetr = setData
                                        ? (setData.reps ? `${setData.reps}` : setData.duree ? `${setData.duree}''` : setData.dist ? `${setData.dist}m` : '—')
                                        : metrVal
                                      const rowCharge = setData?.charge ?? ex.charge_kg
                                      const rowRecup = setData
                                        ? (!isLast && setData.recup ? `${setData.recup}s` : '—')
                                        : (!isLast && ex.recuperation_secondes ? `${ex.recuperation_secondes}s` : '—')
                                      return (
                                        <div key={si} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 1fr', padding: '7px 6px', background: si % 2 === 0 ? '#111828' : 'transparent', borderRadius: '6px' }}>
                                          <span style={{ fontSize: '12px', fontWeight: '800', color: couleur }}>{si + 1}</span>
                                          <span style={{ fontSize: '13px', fontWeight: '900', color: '#FFFFFF' }}>{rowMetr}</span>
                                          <span style={{ fontSize: '13px', fontWeight: '700', color: rowCharge ? '#C0C0D8' : '#4A4A6A' }}>{rowCharge ? `${rowCharge}kg` : '—'}</span>
                                          {rowRecup !== '—' ? (
                                            <span onClick={() => { hapticJ('tap'); setTimerSec(parseInt(rowRecup)) }} style={{ fontSize: '13px', fontWeight: '700', color: '#2ECC71', cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted', textDecorationColor: '#2ECC7180' }}>⏱ {rowRecup}</span>
                                          ) : (
                                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#4A4A6A' }}>—</span>
                                          )}
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
                                  <button onClick={() => { hapticJ('tap'); setTimerSec(recuperBloc) }} style={{ borderRadius: '14px', padding: isMobile ? '12px 20px' : '14px 32px', width: isMobile ? '100%' : 'auto', background: 'linear-gradient(90deg,#2ECC7115,#2ECC7108)', border: '1px solid #2ECC7140', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', boxSizing: 'border-box', cursor: 'pointer' }}>
                                    <div style={{ fontSize: '11px', fontWeight: '900', color: '#2ECC7175', textTransform: 'uppercase', letterSpacing: '1.5px' }}>⏱ Récupération — tap pour lancer</div>
                                    <div style={{ fontSize: isMobile ? '42px' : '48px', fontWeight: '900', color: '#2ECC71', letterSpacing: '-3px', lineHeight: 1 }}>{recuperBloc}s</div>
                                  </button>
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
            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1.5px', color: '#6868A0', textTransform: 'uppercase' }}>Mon bilan</span>
            <div style={{ flex: 1, height: '1px', background: '#161616' }} />
          </div>

          {/* Bouton séance réalisée */}
          {form.completee ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', padding: '18px 20px', background: '#2ECC7110', borderRadius: '16px', border: '1px solid #2ECC7135' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '10px', background: '#2ECC71', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#FFF', fontSize: '16px', fontWeight: '900' }}>✓</span>
              </div>
              <span style={{ fontWeight: '700', fontSize: '17px', color: '#2ECC71' }}>Séance réalisée !</span>
            </div>
          ) : (
            <button onClick={() => {
              hapticJ('done')
              setChronoRunning(false)
              setForm(f => ({ ...f, completee: true }))
              onComplete()
            }} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '16px',
              marginBottom: '32px', padding: '18px 20px', background: '#0F0F0F',
              borderRadius: '16px', border: '1px solid #1A1A1A', cursor: 'pointer',
              textAlign: 'left',
            }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '10px', background: '#161616', border: '2px solid #2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} />
              <span style={{ fontWeight: '700', fontSize: '17px', color: '#9898B8' }}>J'ai fait cette séance</span>
            </button>
          )}

          <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#6868A0', marginBottom: '24px' }}>Ton état de forme</div>
          <RatingChips label="Fatigue" value={form.fatigue} couleur="#FF4757" onChange={v => setForm(f => ({ ...f, fatigue: v }))} />
          <RatingChips label="Courbatures" value={form.courbatures} couleur="#FF6B35" onChange={v => setForm(f => ({ ...f, courbatures: v }))} />
          <RatingChips label="Effort perçu (RPE)" value={form.rpe} couleur="#1A6FFF" onChange={v => setForm(f => ({ ...f, rpe: v }))} />
          <RatingChips label="Qualité du sommeil" value={form.qualite_sommeil} couleur="#2ECC71" onChange={v => setForm(f => ({ ...f, qualite_sommeil: v }))} />

          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#6868A0', marginBottom: '12px' }}>Sensations / Notes</div>
            <textarea value={form.notes_joueur} onChange={e => setForm(f => ({ ...f, notes_joueur: e.target.value }))}
              placeholder="Comment tu t'es senti pendant la séance..." rows={4}
              style={{ width: '100%', background: '#0F0F0F', border: '1px solid #1A1A1A', borderRadius: '14px', padding: '16px', color: '#CCC', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box', lineHeight: '1.6' }} />
          </div>

          <button onClick={onSave} disabled={saving || !form.completee} style={{
            width: '100%', padding: isMobile ? '18px' : '20px', borderRadius: '18px', border: 'none',
            background: saving ? '#111' : !form.completee ? '#111' : '#1A6FFF',
            color: saving || !form.completee ? '#333' : '#FFF',
            fontWeight: '900', fontSize: '17px', cursor: saving || !form.completee ? 'not-allowed' : 'pointer',
          }}>
            {saving ? 'Enregistrement...' : form.completee ? 'Enregistrer mon état de forme' : 'Marque d\'abord la séance comme réalisée'}
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
    subscribePush()
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
          <div style={{ fontSize: '11px', color: '#7878A8' }}>PAGACOACHING</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px' : '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {msgs.length === 0 && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6868A0', fontSize: '13px' }}>
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
                <div style={{ textAlign: 'center', margin: '12px 0 8px', color: '#6A6A8A', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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

function HistoriqueJoueur({ realisations, isMobile }: { realisations: Realisation[]; isMobile: boolean }) {
  const todayStr = new Date().toISOString().split('T')[0]
  const [nbSemaines, setNbSemaines] = useState(8)

  const debut = (() => {
    const d = new Date(todayStr + 'T12:00:00')
    d.setDate(d.getDate() - nbSemaines * 7)
    return d.toISOString().split('T')[0]
  })()

  const passees = realisations
    .filter(r => r.completee && r.date_realisation <= todayStr && r.date_realisation >= debut && r.seances)
    .sort((a, b) => b.date_realisation.localeCompare(a.date_realisation))

  // Charge hebdo
  function getLundi(ds: string) {
    const d = new Date(ds + 'T12:00:00')
    const day = d.getDay()
    d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day))
    return d.toISOString().split('T')[0]
  }

  const semMap: Record<string, { nb: number; rpes: number[] }> = {}
  for (const r of passees) {
    const lundi = getLundi(r.date_realisation)
    if (!semMap[lundi]) semMap[lundi] = { nb: 0, rpes: [] }
    semMap[lundi].nb++
    if (r.rpe != null) semMap[lundi].rpes.push(r.rpe)
  }

  // Fatigue : séances + bilans wellness (seance_id null)
  const fatigueMap: Record<string, number[]> = {}
  for (const r of realisations) {
    if (r.fatigue != null && r.date_realisation <= todayStr && r.date_realisation >= debut) {
      const lundi = getLundi(r.date_realisation)
      if (!fatigueMap[lundi]) fatigueMap[lundi] = []
      fatigueMap[lundi].push(r.fatigue)
    }
  }

  const semaines: { label: string; nb: number; charge: number; avgRpe: number | null; avgFatigue: number | null }[] = []
  const cur = new Date(getLundi(debut) + 'T12:00:00')
  const finD = new Date(todayStr + 'T12:00:00')
  while (cur <= finD) {
    const lundi = cur.toISOString().split('T')[0]
    const s = semMap[lundi] || { nb: 0, rpes: [] }
    const avgRpe = s.rpes.length ? Math.round(s.rpes.reduce((a: number, b: number) => a + b, 0) / s.rpes.length * 10) / 10 : null
    const charge = s.rpes.length > 0 ? Math.round(s.rpes.reduce((a: number, b: number) => a + b, 0)) : s.nb * 5
    const fats = fatigueMap[lundi] || []
    const avgFatigue = fats.length ? Math.round(fats.reduce((a, b) => a + b, 0) / fats.length * 10) / 10 : null
    semaines.push({ label: new Date(lundi + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }), nb: s.nb, charge, avgRpe, avgFatigue })
    cur.setDate(cur.getDate() + 7)
  }

  const maxCharge = Math.max(...semaines.map(s => s.charge), 1)

  function chargeColor(avgRpe: number | null, charge: number) {
    if (charge === 0) return '#1A1A1A'
    if (avgRpe == null) return '#1A6FFF'
    if (avgRpe >= 8) return '#FF4757'
    if (avgRpe >= 6) return '#FF6B35'
    if (avgRpe >= 4) return '#C9A84C'
    return '#2ECC71'
  }

  function cell(val: number | null | undefined, inverted = false) {
    if (val == null) return <span style={{ color: '#6A6A8A', fontSize: '12px' }}>—</span>
    const n = inverted ? 11 - val : val
    const color = n <= 3 ? '#2ECC71' : n <= 5 ? '#C9A84C' : n <= 7 ? '#FF6B35' : '#FF4757'
    return <span style={{ color, fontSize: '13px', fontWeight: '800' }}>{val}</span>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Sélecteur période */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: '#9898B8', fontWeight: '700' }}>Période :</span>
        {[4, 8, 12].map(n => (
          <button key={n} onClick={() => setNbSemaines(n)} style={{
            padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            fontSize: '12px', fontWeight: '700',
            background: nbSemaines === n ? '#1A6FFF' : '#111',
            color: nbSemaines === n ? '#FFF' : '#555',
          }}>{n} sem.</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#6A6A8A' }}>
          {passees.length} séance{passees.length > 1 ? 's' : ''} complétée{passees.length > 1 ? 's' : ''}
        </span>
      </div>

      {passees.length === 0 ? (
        <div style={{ background: '#0F0F0F', border: '1px solid #1E1E1E', borderRadius: '16px', padding: '48px', textAlign: 'center', color: '#6A6A8A', fontSize: '14px' }}>
          Aucune séance complétée sur cette période.
        </div>
      ) : (
        <>
          {/* Charge hebdo */}
          <div style={{ background: '#0F0F0F', border: '1px solid #1E1E1E', borderRadius: '16px', padding: '18px 16px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>
              Charge par semaine (Σ RPE)
            </div>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '80px' }}>
              {semaines.map((s, i) => {
                const barH = s.charge > 0 ? Math.max(6, (s.charge / maxCharge) * 68) : 0
                return (
                  <div key={i} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', height: '80px' }}>
                    {s.nb > 0 && <span style={{ fontSize: '9px', color: '#9898B8', fontWeight: '700' }}>{s.nb}</span>}
                    <div style={{
                      width: '100%', height: `${barH}px`, minHeight: s.charge > 0 ? '6px' : '2px',
                      background: chargeColor(s.avgRpe, s.charge), borderRadius: '3px 3px 1px 1px',
                      opacity: s.charge > 0 ? 1 : 0.15,
                    }} />
                    <span style={{ fontSize: '9px', color: '#6868A0', textAlign: 'center', lineHeight: 1.2, width: '100%', overflow: 'hidden' }}>{s.label}</span>
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: '14px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #1A1A1A', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: '#9898B8' }}>Total : <strong style={{ color: '#FFF' }}>{passees.length} séances</strong></span>
              <span style={{ fontSize: '11px', color: '#9898B8' }}>Charge : <strong style={{ color: '#C9A84C' }}>{semaines.reduce((a, s) => a + s.charge, 0)}</strong></span>
            </div>
          </div>

          {/* Évolution fatigue */}
          {semaines.some(s => s.avgFatigue !== null) && (
            <div style={{ background: '#0F0F0F', border: '1px solid #1E1E1E', borderRadius: '16px', padding: '18px 16px' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#FF6B35', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>
                Fatigue moyenne par semaine
              </div>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '80px' }}>
                {semaines.map((s, i) => {
                  const f = s.avgFatigue
                  const barH = f !== null ? Math.max(6, (f / 10) * 68) : 0
                  const col = f === null ? '#1A1A1A' : f <= 3 ? '#2ECC71' : f <= 5 ? '#C9A84C' : f <= 7 ? '#FF6B35' : '#FF4757'
                  return (
                    <div key={i} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', height: '80px' }}>
                      {f !== null && <span style={{ fontSize: '9px', color: col, fontWeight: '800' }}>{f}</span>}
                      <div style={{
                        width: '100%', height: `${barH}px`, minHeight: f !== null ? '6px' : '2px',
                        background: col, borderRadius: '3px 3px 1px 1px',
                        opacity: f !== null ? 1 : 0.1,
                      }} />
                      <span style={{ fontSize: '9px', color: '#6868A0', textAlign: 'center', lineHeight: 1.2, width: '100%', overflow: 'hidden' }}>{s.label}</span>
                    </div>
                  )
                })}
              </div>
              <div style={{ display: 'flex', gap: '14px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #1A1A1A', flexWrap: 'wrap' }}>
                {[{ label: '≤ 3 Frais', color: '#2ECC71' }, { label: '4–5 Normal', color: '#C9A84C' }, { label: '6–7 Fatigué', color: '#FF6B35' }, { label: '≥ 8 Épuisé', color: '#FF4757' }].map(({ label, color }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: color }} />
                    <span style={{ fontSize: '10px', color: '#7878A8', fontWeight: '600' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Liste séances */}
          <div style={{ background: '#0F0F0F', border: '1px solid #1E1E1E', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #1A1A1A' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#9898B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Séances réalisées</span>
            </div>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '80px 1fr 36px 36px' : '100px 1fr 44px 44px 44px 44px', gap: '8px', padding: '8px 16px', borderBottom: '1px solid #1A1A1A' }}>
              {(isMobile ? ['Date', 'Séance', 'RPE', 'Fat.'] : ['Date', 'Séance', 'RPE', 'Fat.', 'Cour.', 'Som.']).map(h => (
                <span key={h} style={{ fontSize: '11px', color: '#6868A0', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
              ))}
            </div>
            {passees.map((r, i) => {
              const d = new Date(r.date_realisation + 'T12:00:00')
              const dateStr = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
              return (
                <div key={r.id} style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '80px 1fr 36px 36px' : '100px 1fr 44px 44px 44px 44px',
                  gap: '8px', padding: '10px 16px',
                  borderBottom: i < passees.length - 1 ? '1px solid #111' : 'none',
                  background: i % 2 === 1 ? '#0A0A0A' : 'transparent',
                }}>
                  <span style={{ fontSize: '11px', color: '#7878A8' }}>{dateStr}</span>
                  <span style={{ fontSize: '12px', color: '#CCC', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.seances?.nom || '—'}</span>
                  {cell(r.rpe)}
                  {cell(r.fatigue)}
                  {!isMobile && cell(r.courbatures)}
                  {!isMobile && cell(r.qualite_sommeil, true)}
                </div>
              )
            })}
          </div>
        </>
      )}
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
  const [activeSection, setActiveSection] = useState<'seances' | 'historique' | 'messages'>('seances')
  const [wellnessId, setWellnessId] = useState<string | null>(null)
  const [wellnessForm, setWellnessForm] = useState<{ fatigue: number | null; courbatures: number | null; qualite_sommeil: number | null; notes: string }>({ fatigue: null, courbatures: null, qualite_sommeil: null, notes: '' })
  const [wellnessSaving, setWellnessSaving] = useState(false)
  const [wellnessEditing, setWellnessEditing] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)
  const [syncing, setSyncing] = useState(false)
  const [cacheDate, setCacheDate] = useState<Date | null>(null)
  const [cacheStale, setCacheStale] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)
  const joueurRef = useRef<Joueur | null>(null)
  const loadIdRef = useRef(0)

  useEffect(() => { joueurRef.current = joueur }, [joueur])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    setIsOffline(!navigator.onLine)
    // Refresh pending count on mount
    try {
      const stored = localStorage.getItem('pagacoaching_pending')
      setPendingCount(stored ? JSON.parse(stored).length : 0)
    } catch {}

    const goOffline = () => setIsOffline(true)
    const goOnline = async () => {
      setIsOffline(false)
      const j = joueurRef.current
      if (j) {
        await flushPending(j.id)
        await load(j.id)
      }
    }
    window.addEventListener('offline', goOffline)
    window.addEventListener('online', goOnline)
    return () => {
      window.removeEventListener('offline', goOffline)
      window.removeEventListener('online', goOnline)
    }
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

  useEffect(() => {
    init()
    // Fix 7: détecter expiration token en cours de session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        if (event === 'SIGNED_OUT') router.push('/login')
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const authId = joueur?.auth_id
    const coachId = joueur?.coach_id
    if (!authId || !coachId) return
    const fetchUnread = async () => {
      try {
        const { count } = await supabase.from('messages').select('*', { count: 'exact', head: true })
          .eq('expediteur_id', coachId).eq('destinataire_id', authId).neq('lu', true)
        if (activeSection !== 'messages') setUnreadMessages(count || 0)
      } catch {}
    }
    fetchUnread()
    const channel = supabase
      .channel(`unread-joueur-${authId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `destinataire_id=eq.${authId}` },
        () => { fetchUnread() })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [joueur?.auth_id, joueur?.coach_id, activeSection])

  function readCache(): { joueur: Joueur; reals: Realisation[]; ts?: number } | null {
    try {
      const raw = localStorage.getItem('pagacoaching_joueur')
      if (!raw) return null
      const j = JSON.parse(raw)
      if (!j?.id || !j?.email) return null // validation format
      const realsRaw = localStorage.getItem(`pagacoaching_reals_${j.id}`)
      if (!realsRaw) return { joueur: j, reals: [] }
      const parsed = JSON.parse(realsRaw)
      const reals: Realisation[] = Array.isArray(parsed) ? parsed : (Array.isArray(parsed?.data) ? parsed.data : [])
      const ts: number | undefined = Array.isArray(parsed) ? undefined : parsed?.ts
      return { joueur: j, reals, ts }
    } catch {
      return null
    }
  }

  async function init() {
    try {
      // Offline fallback: restaurer depuis le cache localStorage
      if (!navigator.onLine) {
        const cache = readCache()
        if (cache) {
          setJoueur(cache.joueur)
          setRealisations(cache.reals)
          if (cache.ts) {
            setCacheDate(new Date(cache.ts))
            setCacheStale(Date.now() - cache.ts > 7 * 24 * 60 * 60 * 1000)
          }
          setIsOffline(true)
          setLoading(false)
          return
        }
        setInitError('Pas de connexion réseau et aucun cache disponible.')
        setLoading(false)
        return
      }

      // Fix 1: timeout 10s sur getUser
      const userResult = await Promise.race([
        supabase.auth.getUser(),
        new Promise<never>((_, rej) => setTimeout(() => rej(new Error('timeout')), 10000)),
      ]) as Awaited<ReturnType<typeof supabase.auth.getUser>>

      const user = userResult.data?.user
      if (!user) { router.push('/login'); return }

      // Fix 1: timeout 10s sur la requête joueur
      const joueurResult = await Promise.race([
        supabase.from('joueurs').select('id, nom, prenom, email, poste, club').eq('email', user.email).single(),
        new Promise<never>((_, rej) => setTimeout(() => rej(new Error('timeout')), 10000)),
      ]) as { data: Joueur | null; error: unknown }

      const j = joueurResult.data
      if (!j) { router.push('/login'); return }

      try { localStorage.setItem('pagacoaching_joueur', JSON.stringify(j)) } catch {}
      setJoueur(j)
      await load(j.id)
      setLoading(false)

      // Colonnes messaging — auto-remplissage si null, non-bloquant
      try {
        const { data: jExt } = await supabase.from('joueurs').select('auth_id, coach_id').eq('id', j.id).single()
        let authId = jExt?.auth_id ?? null
        let coachId = jExt?.coach_id ?? null
        if (!authId) {
          authId = user.id
          await supabase.from('joueurs').update({ auth_id: authId }).eq('id', j.id)
        }
        if (!coachId) {
          const res = await fetch('/api/coach-id')
          if (res.ok) { const json = await res.json(); coachId = json.coach_id; if (coachId) await supabase.from('joueurs').update({ coach_id: coachId }).eq('id', j.id) }
        }
        if (authId || coachId) setJoueur(prev => prev ? { ...prev, auth_id: authId ?? undefined, coach_id: coachId ?? undefined } : prev)
        if (authId && coachId) {
          const { count } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('expediteur_id', coachId).eq('destinataire_id', authId).eq('lu', false)
          setUnreadMessages(count || 0)
        }
      } catch { /* messaging columns may not exist yet */ }

    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      // Si timeout ou réseau → essayer le cache
      const cache = readCache()
      if (cache) {
        setJoueur(cache.joueur)
        setRealisations(cache.reals)
        if (cache.ts) { setCacheDate(new Date(cache.ts)); setCacheStale(Date.now() - cache.ts > 7 * 24 * 60 * 60 * 1000) }
        setIsOffline(true)
        setLoading(false)
      } else {
        setInitError(msg === 'timeout' ? 'Serveur injoignable. Vérifie ta connexion.' : 'Erreur de chargement. Réessaie.')
        setLoading(false)
      }
    }
  }

  async function load(joueurId: string) {
    // Fix 4: annuler les appels périmés
    const thisId = ++loadIdRef.current
    try {
      const result = await Promise.race([
        supabase.from('realisations')
          .select('id, seance_id, date_realisation, completee, rpe, fatigue, courbatures, qualite_sommeil, notes_joueur, seances(id, nom, type, seance_exercices(id, ordre, series, repetitions, duree_secondes, distance_metres, charge_kg, recuperation_secondes, recuperation_inter_sets, lien_suivant, uni_podal, notes, sets_config, exercices(nom, video_url, consignes_execution, familles(nom, couleur))))')
          .eq('joueur_id', joueurId).order('date_realisation'),
        new Promise<never>((_, rej) => setTimeout(() => rej(new Error('timeout')), 12000)),
      ]) as { data: Realisation[] | null }
      if (loadIdRef.current !== thisId) return // résultat périmé, ignorer
      if (result.data) {
        setRealisations(result.data)
        try { localStorage.setItem(`pagacoaching_reals_${joueurId}`, JSON.stringify({ data: result.data, ts: Date.now() })) } catch {}
        const todayWellness = result.data.find(r => !r.seance_id && r.date_realisation === new Date().toISOString().split('T')[0])
        if (todayWellness) {
          setWellnessId(todayWellness.id)
          setWellnessForm({ fatigue: todayWellness.fatigue ?? null, courbatures: todayWellness.courbatures ?? null, qualite_sommeil: todayWellness.qualite_sommeil ?? null, notes: todayWellness.notes_joueur ?? '' })
          setWellnessEditing(false)
        }
      }
    } catch {
      if (loadIdRef.current !== thisId) return
      // En cas d'échec réseau, garder les données existantes en mémoire
    }
  }

  function ouvrir(r: Realisation) {
    setSelected(r)
    setForm({ completee: r.completee, fatigue: r.fatigue ?? null, courbatures: r.courbatures ?? null, rpe: r.rpe ?? null, qualite_sommeil: r.qualite_sommeil ?? null, notes_joueur: r.notes_joueur ?? '' })
  }

  type PendingAction = { realisationId: string; patch: Record<string, unknown> }

  function queueAction(realisationId: string, patch: Record<string, unknown>) {
    try {
      const stored = localStorage.getItem('pagacoaching_pending')
      const queue: PendingAction[] = stored ? JSON.parse(stored) : []
      // Merge with existing entry for same réalisation if present
      const idx = queue.findIndex(a => a.realisationId === realisationId)
      if (idx >= 0) queue[idx].patch = { ...queue[idx].patch, ...patch }
      else queue.push({ realisationId, patch })
      localStorage.setItem('pagacoaching_pending', JSON.stringify(queue))
      setPendingCount(queue.length)
    } catch {}
  }

  async function flushPending(joueurId: string) {
    try {
      const stored = localStorage.getItem('pagacoaching_pending')
      if (!stored) return
      const queue: PendingAction[] = JSON.parse(stored)
      if (queue.length === 0) return
      setSyncing(true)
      for (const action of queue) {
        await supabase.from('realisations').update(action.patch).eq('id', action.realisationId)
      }
      localStorage.removeItem('pagacoaching_pending')
      setPendingCount(0)
      setSyncing(false)
    } catch {
      setSyncing(false)
    }
  }

  async function completerSeance() {
    if (!selected || !joueur) return
    if (isOffline) {
      // Optimistic update in cache
      const patch = { completee: true }
      queueAction(selected.id, patch)
      setRealisations(prev => prev.map(r => r.id === selected.id ? { ...r, ...patch } : r))
      setSelected(prev => prev ? { ...prev, ...patch } : prev)
      return
    }
    setSaving(true)
    try {
      const { error } = await supabase.from('realisations').update({ completee: true }).eq('id', selected.id)
      if (error) throw error
      await load(joueur.id)
    } catch {
      // Fallback offline si le réseau a coupé entre temps
      const patch = { completee: true }
      queueAction(selected.id, patch)
      setRealisations(prev => prev.map(r => r.id === selected.id ? { ...r, ...patch } : r))
      setSelected(prev => prev ? { ...prev, ...patch } : prev)
      setIsOffline(true)
    }
    setSaving(false)
    // On reste sur la vue pour que le joueur puisse remplir le wellness
  }

  async function sauvegarder() {
    if (!selected || !joueur) return
    if (isOffline) {
      const patch = { completee: form.completee, fatigue: form.fatigue, courbatures: form.courbatures, rpe: form.rpe, qualite_sommeil: form.qualite_sommeil, notes_joueur: form.notes_joueur || null }
      queueAction(selected.id, patch)
      setRealisations(prev => prev.map(r => r.id === selected.id ? { ...r, ...patch } : r))
      try {
        const key = `pagacoaching_reals_${joueur.id}`
        const stored = localStorage.getItem(key)
        if (stored) {
          const cached = JSON.parse(stored)
          const arr = Array.isArray(cached) ? cached : (cached?.data ?? [])
          const updated = arr.map((r: Realisation) => r.id === selected.id ? { ...r, ...patch } : r)
          localStorage.setItem(key, JSON.stringify({ data: updated, ts: cached?.ts ?? Date.now() }))
        }
      } catch {}
      setSelected(null)
      return
    }
    setSaving(true)
    try {
      const { error } = await supabase.from('realisations').update({
        completee: form.completee, fatigue: form.fatigue, courbatures: form.courbatures,
        rpe: form.rpe, qualite_sommeil: form.qualite_sommeil, notes_joueur: form.notes_joueur || null,
      }).eq('id', selected.id)
      if (error) throw error
      await load(joueur.id)
      setSelected(null)
    } catch {
      // Réseau coupé pendant la sauvegarde → queue offline
      const patch = { completee: form.completee, fatigue: form.fatigue, courbatures: form.courbatures, rpe: form.rpe, qualite_sommeil: form.qualite_sommeil, notes_joueur: form.notes_joueur || null }
      queueAction(selected.id, patch)
      setIsOffline(true)
      setSelected(null)
    }
    setSaving(false)
  }

  async function sauvegarderWellness() {
    if (!joueur) return
    setWellnessSaving(true)
    const patch = { fatigue: wellnessForm.fatigue, courbatures: wellnessForm.courbatures, qualite_sommeil: wellnessForm.qualite_sommeil, notes_joueur: wellnessForm.notes || null }
    if (wellnessId) {
      await supabase.from('realisations').update(patch).eq('id', wellnessId)
    } else {
      const { data } = await supabase.from('realisations')
        .insert({ joueur_id: joueur.id, seance_id: null, date_realisation: today, completee: false, ...patch })
        .select('id').single()
      if (data) setWellnessId(data.id)
    }
    setWellnessEditing(false)
    setWellnessSaving(false)
    await load(joueur.id)
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
      <div style={{ color: '#6A6A8A', fontSize: '14px' }}>Chargement...</div>
    </div>
  )
  if (initError) return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '24px' }}>
      <div style={{ fontSize: '32px' }}>⚠️</div>
      <div style={{ color: '#FFF', fontSize: '16px', fontWeight: '700', textAlign: 'center' }}>{initError}</div>
      <button onClick={() => { setInitError(null); setLoading(true); init() }} style={{
        background: '#1A6FFF', color: '#FFF', border: 'none', borderRadius: '10px',
        padding: '12px 28px', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
      }}>Réessayer</button>
    </div>
  )
  if (!joueur) return null

  const px = isMobile ? '16px' : '40px'

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#FFF', fontFamily: 'system-ui, -apple-system, sans-serif', paddingTop: (isOffline || syncing || pendingCount > 0) ? '37px' : 0 }}>

      {/* Offline / sync banner */}
      {(isOffline || syncing || pendingCount > 0) && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
          background: syncing ? '#2ECC71' : cacheStale ? '#FF4757' : isOffline ? '#C9A84C' : '#1A6FFF',
          color: syncing ? '#000' : isOffline ? '#000' : '#FFF',
          textAlign: 'center', padding: '8px 16px', fontSize: '13px', fontWeight: 600,
          transition: 'background 0.3s',
        }}>
          {syncing
            ? 'Synchronisation en cours...'
            : isOffline && pendingCount > 0
              ? `Hors ligne — ${pendingCount} action${pendingCount > 1 ? 's' : ''} en attente de sync`
              : isOffline && cacheStale
                ? `Données du ${cacheDate?.toLocaleDateString('fr-FR')} — reconnecte-toi pour mettre à jour`
              : isOffline
                ? `Hors ligne — données du ${cacheDate ? cacheDate.toLocaleDateString('fr-FR') : 'cache'}`
                : `${pendingCount} action${pendingCount > 1 ? 's' : ''} synchronisée${pendingCount > 1 ? 's' : ''} ✓`
          }
        </div>
      )}

      {/* SessionDetail overlay */}
      {selected && (
        <SessionDetail
          realisation={selected}
          form={form}
          setForm={setForm}
          saving={saving}
          onSave={sauvegarder}
          onComplete={completerSeance}
          onClose={() => setSelected(null)}
          isMobile={isMobile}
        />
      )}

      {/* Header */}
      <div style={{ padding: `28px ${px} 20px`, background: '#0C0C0C', borderBottom: '1px solid #111' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: '#6868A0', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>PAGACOACHING</div>
            <button onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
              style={{ background: 'none', border: '1px solid #1E1E1E', borderRadius: '8px', padding: '7px 14px', color: '#7878A8', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
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
                  <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#7878A8', marginTop: '3px', fontWeight: '500' }}>
                    {[joueur.poste, joueur.club].filter(Boolean).join(' · ')}
                  </div>
                )}
              </div>
            </div>
            {nbTotal > 0 && (
              <div style={{ background: '#111', borderRadius: '14px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '16px', minWidth: isMobile ? '100%' : '280px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#9898B8', fontWeight: '600' }}>Séances cette semaine</span>
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
          {(['seances', 'historique', 'messages'] as const).map(s => (
            <button key={s} onClick={() => { setActiveSection(s); if (s === 'messages') setUnreadMessages(0) }} style={{
              padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '14px', fontWeight: '700',
              color: activeSection === s ? '#1A6FFF' : '#444',
              borderBottom: `2px solid ${activeSection === s ? '#1A6FFF' : 'transparent'}`,
              transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              {s === 'seances' ? '📅 Séances' : s === 'historique' ? '📊 Historique' : '💬 Messages'}
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
          <div style={{ background: '#0F0F0F', border: '1px solid #1E1E1E', borderRadius: '16px', padding: '48px', textAlign: 'center', color: '#6A6A8A', fontSize: '14px' }}>
            La messagerie sera disponible après connexion avec le coach.
          </div>
        )}

        {activeSection === 'historique' && <HistoriqueJoueur realisations={realisations} isMobile={isMobile} />}

        {activeSection === 'seances' && (<>

        {/* Navigation semaine */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <button onClick={() => aller(-1)} style={{ background: '#111', border: '1px solid #1E1E1E', borderRadius: '10px', width: '40px', height: '40px', color: '#9898B8', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
          <button onClick={() => { const d = new Date(); const day = d.getDay(); d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day)); setLundiSemaine(d.toISOString().split('T')[0]) }}
            style={{ background: '#111', border: '1px solid #1E1E1E', borderRadius: '10px', padding: '0 14px', height: '40px', color: '#9898B8', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>Aujourd'hui</button>
          <div style={{ flex: 1, textAlign: 'center', fontSize: isMobile ? '13px' : '15px', fontWeight: '700', color: '#888' }}>
            {new Date(jours[0] + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: isMobile ? 'short' : 'long' })} – {new Date(jours[6] + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: isMobile ? 'short' : 'long', year: 'numeric' })}
          </div>
          <button onClick={() => aller(1)} style={{ background: '#111', border: '1px solid #1E1E1E', borderRadius: '10px', width: '40px', height: '40px', color: '#9898B8', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
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
                {isToday && <span style={{ background: '#1A6FFF', color: '#FFF', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: '900', letterSpacing: '0.5px' }}>AUJOURD'HUI</span>}
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
                              <span style={{ color: '#6868A0', fontSize: '12px' }}>·</span>
                              <span style={{ color: '#7878A8', fontSize: '12px' }}>{exCount} exercice{exCount > 1 ? 's' : ''}</span>
                            </div>
                          </div>

                          {/* Badge fatigue si renseigné */}
                          {r.completee && r.fatigue != null ? (
                            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', background: `${wellnessItems[0]?.color || '#2ECC71'}18`, border: `1px solid ${wellnessItems[0]?.color || '#2ECC71'}35`, borderRadius: '12px', padding: '5px 10px', minWidth: '46px' }}>
                              <span style={{ fontSize: '10px', fontWeight: '900', color: `${wellnessItems[0]?.color || '#2ECC71'}90`, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fatigue</span>
                              <span style={{ fontSize: '20px', fontWeight: '900', color: wellnessItems[0]?.color || '#2ECC71', lineHeight: 1 }}>{r.fatigue}</span>
                              <span style={{ fontSize: '10px', color: '#6A6A8A' }}>/10</span>
                            </div>
                          ) : (
                            <div style={{ flexShrink: 0, color: '#6868A0', fontSize: '18px' }}>›</div>
                          )}
                        </div>

                        {/* Bande wellness */}
                        {hasWellness && r.completee && (
                          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${wellnessItems.length}, 1fr)`, gap: '10px', paddingTop: '12px', borderTop: '1px solid #161616' }}>
                            {wellnessItems.map(item => (
                              <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <span style={{ fontSize: '11px', fontWeight: '800', color: '#6A6A8A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</span>
                                <div style={{ display: 'flex', gap: '2px' }}>
                                  {Array.from({ length: 10 }, (_, i) => (
                                    <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i < item.val ? item.color : '#1A1A1A' }} />
                                  ))}
                                </div>
                                <span style={{ fontSize: '11px', fontWeight: '900', color: item.color }}>{item.val}<span style={{ color: '#6868A0', fontWeight: '400' }}>/10</span></span>
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
            <div style={{ color: '#6A6A8A', fontSize: isMobile ? '14px' : '16px', fontWeight: '600' }}>Aucune séance prévue cette semaine</div>
            <div style={{ color: '#1E1E1E', fontSize: '13px', marginTop: '8px' }}>Profite du repos !</div>
          </div>
        )}

        {/* ── Bilan wellness du jour ── */}
        {(() => {
          const alreadyDone = wellnessId && !wellnessEditing
          const hasData = wellnessForm.fatigue !== null || wellnessForm.courbatures !== null || wellnessForm.qualite_sommeil !== null
          return (
            <div style={{ marginTop: '32px', paddingTop: '28px', borderTop: '1px solid #161616' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#6868A0', marginBottom: '4px' }}>Bilan du jour</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#9898B8' }}>Comment tu te sens aujourd'hui ?</div>
                </div>
                {alreadyDone && (
                  <button onClick={() => setWellnessEditing(true)} style={{ background: '#1A1A2A', border: '1px solid #2A2A3A', color: '#9898B8', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                    Modifier
                  </button>
                )}
              </div>

              {alreadyDone ? (
                /* Résumé readonly */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {[
                    { label: 'Sommeil', emoji: '😴', val: wellnessForm.qualite_sommeil, color: '#2ECC71' },
                    { label: 'Fatigue', emoji: '⚡', val: wellnessForm.fatigue, color: '#FF4757' },
                    { label: 'Courbatures', emoji: '💪', val: wellnessForm.courbatures, color: '#FF6B35' },
                  ].map(({ label, emoji, val, color }) => (
                    <div key={label} style={{ background: val !== null ? color + '12' : '#0F0F0F', border: `1px solid ${val !== null ? color + '30' : '#1A1A1A'}`, borderRadius: '16px', padding: '16px 12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', marginBottom: '6px' }}>{emoji}</div>
                      <div style={{ fontSize: '26px', fontWeight: '900', color: val !== null ? color : '#333', lineHeight: 1 }}>{val ?? '–'}</div>
                      <div style={{ fontSize: '10px', color: '#6A6A8A', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>{label}</div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Formulaire */
                <div>
                  <RatingChips label="Qualité du sommeil 😴" value={wellnessForm.qualite_sommeil} couleur="#2ECC71" onChange={v => setWellnessForm(f => ({ ...f, qualite_sommeil: v }))} />
                  <RatingChips label="Fatigue générale ⚡" value={wellnessForm.fatigue} couleur="#FF4757" onChange={v => setWellnessForm(f => ({ ...f, fatigue: v }))} />
                  <RatingChips label="Courbatures 💪" value={wellnessForm.courbatures} couleur="#FF6B35" onChange={v => setWellnessForm(f => ({ ...f, courbatures: v }))} />
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#6868A0', marginBottom: '12px' }}>Notes (facultatif)</div>
                    <textarea
                      value={wellnessForm.notes}
                      onChange={e => setWellnessForm(f => ({ ...f, notes: e.target.value }))}
                      placeholder="Douleurs, fatigue mentale, autre..."
                      rows={3}
                      style={{ width: '100%', background: '#0F0F0F', border: '1px solid #1A1A1A', borderRadius: '14px', padding: '14px 16px', color: '#CCC', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const, lineHeight: '1.6' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {wellnessId && (
                      <button onClick={() => setWellnessEditing(false)} style={{ flex: '0 0 auto', padding: '16px 20px', borderRadius: '16px', border: '1px solid #1A1A1A', background: '#0F0F0F', color: '#6A6A8A', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
                        Annuler
                      </button>
                    )}
                    <button
                      onClick={sauvegarderWellness}
                      disabled={wellnessSaving || (!hasData && !wellnessForm.notes)}
                      style={{
                        flex: 1, padding: '16px', borderRadius: '16px', border: 'none',
                        background: wellnessSaving || (!hasData && !wellnessForm.notes) ? '#111' : '#2ECC71',
                        color: wellnessSaving || (!hasData && !wellnessForm.notes) ? '#333' : '#000',
                        fontWeight: '900', fontSize: '16px', cursor: wellnessSaving || (!hasData && !wellnessForm.notes) ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {wellnessSaving ? 'Enregistrement...' : '✓ Enregistrer mon bilan'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })()}

        </>)}
      </div>
    </div>
  )
}
