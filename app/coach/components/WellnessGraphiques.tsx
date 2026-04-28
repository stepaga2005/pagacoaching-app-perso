'use client'

import { useState } from 'react'
import { Realisation } from '../lib/types'
import { computeAcwr, computeAcwrHistory, ACWR_ZONES } from '../lib/acwr'

export function WellnessGraphiques({ realisations }: { realisations: Realisation[] }) {
  const todayStr = new Date().toISOString().split('T')[0]
  const [nbJours, setNbJours] = useState(56)
  const [fin, setFin] = useState(todayStr)

  const finDate = new Date(fin + 'T12:00:00')
  const debutDate = new Date(finDate)
  debutDate.setDate(debutDate.getDate() - nbJours + 1)
  const debut = debutDate.toISOString().split('T')[0]

  function decaler(delta: number) {
    const d = new Date(fin + 'T12:00:00')
    d.setDate(d.getDate() + delta * nbJours)
    setFin(d.toISOString().split('T')[0])
  }

  const days = Array.from({ length: nbJours }, (_, i) => {
    const d = new Date(debutDate)
    d.setDate(d.getDate() + i)
    return d.toISOString().split('T')[0]
  })

  const realsMap: Record<string, Realisation[]> = {}
  for (const r of realisations) {
    if (!realsMap[r.date_realisation]) realsMap[r.date_realisation] = []
    realsMap[r.date_realisation].push(r)
  }

  // ─── Points par jour (moyenne si plusieurs) ──────────────────────────────
  type HistPoint = { date: string; fatigue: number | null; rpe: number | null; courbatures: number | null; qualite_sommeil: number | null }
  const historique: (HistPoint | null)[] = days.map(d => {
    const rs = (realsMap[d] || []).filter(r => r.fatigue != null || r.rpe != null || r.courbatures != null || r.qualite_sommeil != null)
    if (rs.length === 0) return null
    const avg = (key: keyof Realisation) => {
      const vals = rs.map(r => r[key] as number | null).filter(v => v != null) as number[]
      return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 10) / 10 : null
    }
    return { date: d, fatigue: avg('fatigue'), rpe: avg('rpe'), courbatures: avg('courbatures'), qualite_sommeil: avg('qualite_sommeil') }
  })

  const metrics = [
    { key: 'fatigue' as const, label: 'Fatigue', color: '#FF4757' },
    { key: 'rpe' as const, label: 'Effort (RPE)', color: '#1A6FFF' },
    { key: 'courbatures' as const, label: 'Courbatures', color: '#FF6B35' },
    { key: 'qualite_sommeil' as const, label: 'Sommeil', color: '#2ECC71' },
  ]

  const moyennes = metrics.map(m => {
    const vals = historique.filter(h => h !== null).map(h => h![m.key]).filter(v => v != null) as number[]
    const prev = historique.slice(0, Math.floor(historique.length / 2)).filter(h => h !== null).map(h => h![m.key]).filter(v => v != null) as number[]
    const curr = historique.slice(Math.floor(historique.length / 2)).filter(h => h !== null).map(h => h![m.key]).filter(v => v != null) as number[]
    const moy = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 10) / 10 : null
    const prevMoy = prev.length ? prev.reduce((a, b) => a + b, 0) / prev.length : null
    const currMoy = curr.length ? curr.reduce((a, b) => a + b, 0) / curr.length : null
    const trend = prevMoy != null && currMoy != null
      ? currMoy - prevMoy > 0.5 ? 'up' : currMoy - prevMoy < -0.5 ? 'down' : 'stable'
      : null
    return { ...m, moy, nb: vals.length, trend }
  })

  // ─── Charge hebdomadaire ──────────────────────────────────────────────────
  // Regroupe les jours par semaine (lundi → dimanche)
  function getLundi(ds: string) {
    const d = new Date(ds + 'T12:00:00')
    const day = d.getDay()
    d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day))
    return d.toISOString().split('T')[0]
  }

  const semMap: Record<string, { completees: Realisation[]; rpeVals: number[] }> = {}
  for (const r of realisations) {
    if (r.date_realisation < debut || r.date_realisation > fin) continue
    const lundi = getLundi(r.date_realisation)
    if (!semMap[lundi]) semMap[lundi] = { completees: [], rpeVals: [] }
    if (r.completee) {
      semMap[lundi].completees.push(r)
      if (r.rpe != null) semMap[lundi].rpeVals.push(r.rpe)
    }
  }

  // Construire la liste ordonnée de semaines dans la période
  const semaines: { lundi: string; label: string; nbSessions: number; chargeTotal: number; avgRpe: number | null }[] = []
  const cur = new Date(getLundi(debut) + 'T12:00:00')
  const finD = new Date(fin + 'T12:00:00')
  while (cur <= finD) {
    const lundi = cur.toISOString().split('T')[0]
    const s = semMap[lundi] || { completees: [], rpeVals: [] }
    const avgRpe = s.rpeVals.length ? Math.round(s.rpeVals.reduce((a, b) => a + b, 0) / s.rpeVals.length * 10) / 10 : null
    const chargeTotal = s.rpeVals.length > 0 ? Math.round(s.rpeVals.reduce((a, b) => a + b, 0)) : s.completees.length * 5 // fallback: 5 par séance sans RPE
    const label = new Date(lundi + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    semaines.push({ lundi, label, nbSessions: s.completees.length, chargeTotal, avgRpe })
    cur.setDate(cur.getDate() + 7)
  }

  const maxCharge = Math.max(...semaines.map(s => s.chargeTotal), 1)

  function chargeColor(avgRpe: number | null, charge: number) {
    if (charge === 0) return '#222238'
    if (avgRpe == null) return '#1A6FFF'
    if (avgRpe >= 8) return '#FF4757'
    if (avgRpe >= 6) return '#FF6B35'
    if (avgRpe >= 4) return '#C9A84C'
    return '#2ECC71'
  }

  function trendIcon(trend: string | null, key: string) {
    if (!trend || trend === 'stable') return <span style={{ color: '#7878A8', fontSize: '11px' }}>→</span>
    // Pour sommeil: up = bon, pour le reste: up = mauvais
    const isBad = key !== 'qualite_sommeil' ? trend === 'up' : trend === 'down'
    return <span style={{ color: isBad ? '#FF4757' : '#2ECC71', fontSize: '11px' }}>{trend === 'up' ? '↑' : '↓'}</span>
  }

  const hasDonnees = historique.some(h => h !== null) || semaines.some(s => s.nbSessions > 0)

  const W = 600, H = 120, PADY = 12, PADX = 6

  function Chart({ metricKey, color }: { metricKey: keyof HistPoint, color: string }) {
    const points = historique.map((h, i) => ({ i, y: h ? (h[metricKey] as number | null) : null, date: days[i] }))
    const filled = points.filter(p => p.y != null)
    if (filled.length < 1) return (
      <div style={{ height: `${H}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#2C2C44', fontSize: '11px' }}>Aucune donnée sur cette période</span>
      </div>
    )
    const n = points.length
    const toX = (i: number) => PADX + (i / Math.max(n - 1, 1)) * (W - PADX * 2)
    const toY = (v: number) => PADY + (H - PADY * 2) * (1 - (v - 1) / 9)
    const segments: string[] = []
    let seg = ''
    for (let i = 0; i < points.length; i++) {
      if (points[i].y != null) {
        const x = toX(i), y = toY(points[i].y!)
        seg += seg === '' ? `M${x},${y}` : ` L${x},${y}`
      } else if (seg !== '') { segments.push(seg); seg = '' }
    }
    if (seg) segments.push(seg)
    const areaPoints = filled.map(p => `${toX(p.i)},${toY(p.y!)}`)
    const areaPath = areaPoints.length > 1
      ? `M${toX(filled[0].i)},${H} L${areaPoints.join(' L')} L${toX(filled[filled.length - 1].i)},${H} Z`
      : ''
    return (
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
        {[2, 4, 6, 8, 10].map(v => (
          <line key={v} x1={PADX} y1={toY(v)} x2={W - PADX} y2={toY(v)} stroke="#1C1C2C" strokeWidth="1" />
        ))}
        <rect x={PADX} y={toY(10)} width={W - PADX * 2} height={toY(8) - toY(10)} fill={color + '08'} />
        {areaPath && <path d={areaPath} fill={color + '15'} />}
        {segments.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {filled.map(p => (
          <circle key={p.i} cx={toX(p.i)} cy={toY(p.y!)} r={n <= 14 ? 4 : 3} fill={color} stroke="#0C0C0C" strokeWidth="1.5" />
        ))}
        {n <= 14 && filled.map(p => (
          <text key={`lbl-${p.i}`} x={toX(p.i)} y={toY(p.y!) - 7} textAnchor="middle" fontSize="9" fill={color} fontWeight="700">{p.y}</text>
        ))}
      </svg>
    )
  }

  const xLabels = (() => {
    const step = Math.max(1, Math.floor(days.length / 5))
    const idxs: number[] = []
    for (let i = 0; i < days.length; i += step) idxs.push(i)
    if (idxs[idxs.length - 1] !== days.length - 1) idxs.push(days.length - 1)
    return idxs
  })()

  // ─── ACWR ────────────────────────────────────────────────────────────────
  const acwrNow = computeAcwr(realisations)

  // Historique ACWR : un point par semaine (dimanche) sur la période affichée
  const acwrWeekEnds: string[] = []
  const acwrCur = new Date(fin + 'T12:00:00')
  // Aligner sur le dimanche le plus proche ≤ fin
  while (acwrCur.getDay() !== 0) acwrCur.setDate(acwrCur.getDate() - 1)
  while (acwrCur.toISOString().split('T')[0] >= debut) {
    acwrWeekEnds.unshift(acwrCur.toISOString().split('T')[0])
    acwrCur.setDate(acwrCur.getDate() - 7)
  }
  const acwrHistory = computeAcwrHistory(realisations, acwrWeekEnds)
  const acwrZone = ACWR_ZONES[acwrNow.zone]

  // ─── Séances complétées triées par date desc ──────────────────────────────
  const seancesPassees = realisations
    .filter(r => r.completee && r.date_realisation <= todayStr && r.date_realisation >= debut && r.seances)
    .sort((a, b) => b.date_realisation.localeCompare(a.date_realisation))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* ─── ACWR Score actuel ─── */}
      <div style={{ background: '#18182A', border: `1px solid ${acwrZone.color}30`, borderRadius: '16px', padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#9898B8', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>
              ACWR — Ratio Charge Aiguë / Chronique
            </div>
            <div style={{ fontSize: '11px', color: '#7878A8' }}>
              Charge 7j : <strong style={{ color: '#FFF' }}>{acwrNow.acute}</strong>
              {' · '}
              Charge chronique moy. : <strong style={{ color: '#FFF' }}>{Math.round(acwrNow.chronic)}</strong>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', fontWeight: '900', color: acwrZone.color, lineHeight: 1 }}>
                {acwrNow.ratio ?? '—'}
              </div>
              <div style={{ padding: '3px 10px', borderRadius: '20px', background: acwrZone.bg, marginTop: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: acwrZone.color }}>{acwrZone.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Zones ACWR visuelles */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
          {[
            { label: '< 0.8', sublabel: 'Sous-charge', color: '#9898B8', flex: 1 },
            { label: '0.8–1.3', sublabel: 'Optimal', color: '#2ECC71', flex: 2 },
            { label: '1.3–1.5', sublabel: 'Risque', color: '#FF6B35', flex: 1 },
            { label: '> 1.5', sublabel: 'Danger', color: '#FF4757', flex: 1 },
          ].map(z => (
            <div key={z.label} style={{ flex: z.flex, background: z.color + '18', border: `1px solid ${z.color}30`, borderRadius: '6px', padding: '5px 4px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: z.color }}>{z.label}</div>
              <div style={{ fontSize: '10px', color: z.color + '80', marginTop: '1px' }}>{z.sublabel}</div>
            </div>
          ))}
        </div>

        {/* Indicateur position sur la barre */}
        {acwrNow.ratio != null && (() => {
          // Position en % : 0 = 0.0, 100% = 2.0
          const pct = Math.min(Math.max((acwrNow.ratio / 2) * 100, 2), 98)
          return (
            <div style={{ position: 'relative', height: '6px', background: '#0E0E18', borderRadius: '3px', marginTop: '4px' }}>
              <div style={{
                position: 'absolute', left: `${pct}%`, top: '-4px',
                transform: 'translateX(-50%)',
                width: '14px', height: '14px', borderRadius: '50%',
                background: acwrZone.color, border: '2px solid #18182A',
                boxShadow: `0 0 6px ${acwrZone.color}80`,
              }} />
            </div>
          )
        })()}

        {/* Historique ACWR hebdo */}
        {acwrHistory.filter(w => w.ratio != null).length >= 2 && (
          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #1E1E30' }}>
            <div style={{ fontSize: '10px', color: '#9898B8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Évolution hebdomadaire</div>
            <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-end', height: '60px' }}>
              {acwrHistory.map((w, i) => {
                const z = ACWR_ZONES[w.zone]
                const barH = w.ratio != null ? Math.max(4, Math.min((w.ratio / 2) * 52, 52)) : 2
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '60px', gap: '3px' }}>
                    {w.ratio != null && <span style={{ fontSize: '10px', color: z.color, fontWeight: '800' }}>{w.ratio}</span>}
                    <div style={{ width: '100%', height: `${barH}px`, background: z.color, borderRadius: '3px 3px 1px 1px', opacity: w.ratio != null ? 1 : 0.15 }} />
                    <span style={{ fontSize: '10px', color: '#9898B8' }}>
                      {new Date(w.date + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                )
              })}
            </div>
            {/* Ligne de référence 1.3 */}
            <div style={{ fontSize: '11px', color: '#9898B8', marginTop: '4px', textAlign: 'right' }}>
              Zone optimale : 0.8 – 1.3
            </div>
          </div>
        )}
      </div>

      {/* Sélecteur de période */}
      <div style={{ background: '#18182A', border: '1px solid #222238', borderRadius: '14px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[14, 28, 56].map(n => (
            <button key={n} onClick={() => { setNbJours(n); setFin(todayStr) }} style={{
              padding: '5px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '700',
              background: nbJours === n && fin === todayStr ? '#1A6FFF' : '#212135',
              color: nbJours === n && fin === todayStr ? '#FFF' : '#888',
            }}>{n === 14 ? '2 sem.' : n === 28 ? '4 sem.' : '8 sem.'}</button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => decaler(-1)} style={{ background: '#212135', border: '1px solid #2C2C44', borderRadius: '8px', padding: '5px 10px', color: '#888', cursor: 'pointer', fontSize: '13px' }}>‹</button>
          <span style={{ fontSize: '12px', color: '#A8A8C4', fontWeight: '600', minWidth: '160px', textAlign: 'center' }}>
            {new Date(debut + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
            {' — '}
            {new Date(fin + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <button onClick={() => decaler(1)} disabled={fin >= todayStr} style={{ background: '#212135', border: '1px solid #2C2C44', borderRadius: '8px', padding: '5px 10px', color: fin >= todayStr ? '#2C2C44' : '#888', cursor: fin >= todayStr ? 'default' : 'pointer', fontSize: '13px' }}>›</button>
        </div>
      </div>

      {!hasDonnees ? (
        <div style={{ background: '#18182A', border: '1px solid #222238', borderRadius: '16px', padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📊</div>
          <div style={{ color: '#7878A8', fontSize: '14px' }}>Aucune donnée sur cette période</div>
        </div>
      ) : (
        <>
          {/* ─── Charge hebdomadaire ───────────────────────────────────────── */}
          <div style={{ background: '#18182A', border: '1px solid #222238', borderRadius: '16px', padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#C9A84C' }}>Charge par semaine</span>
              <div style={{ display: 'flex', gap: '12px', fontSize: '10px', color: '#9898B8' }}>
                <span><span style={{ color: '#2ECC71' }}>■</span> RPE ≤ 4</span>
                <span><span style={{ color: '#C9A84C' }}>■</span> RPE 4–6</span>
                <span><span style={{ color: '#FF6B35' }}>■</span> RPE 6–8</span>
                <span><span style={{ color: '#FF4757' }}>■</span> RPE &gt; 8</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '100px' }}>
              {semaines.map((s, i) => {
                const barH = s.chargeTotal > 0 ? Math.max(8, (s.chargeTotal / maxCharge) * 84) : 0
                const color = chargeColor(s.avgRpe, s.chargeTotal)
                return (
                  <div key={i} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', height: '100px' }}>
                    {s.nbSessions > 0 && (
                      <span style={{ fontSize: '11px', color: '#9898B8', fontWeight: '700' }}>{s.nbSessions}</span>
                    )}
                    <div title={`Semaine du ${s.label} — ${s.nbSessions} séance${s.nbSessions > 1 ? 's' : ''} · charge ${s.chargeTotal}${s.avgRpe != null ? ` · RPE moy. ${s.avgRpe}` : ''}`} style={{
                      width: '100%', height: `${barH}px`,
                      background: color,
                      borderRadius: '4px 4px 2px 2px',
                      transition: 'height 0.3s',
                      minHeight: s.chargeTotal > 0 ? '8px' : '2px',
                      opacity: s.chargeTotal > 0 ? 1 : 0.2,
                    }} />
                    <span style={{ fontSize: '10px', color: '#9898B8', textAlign: 'center', lineHeight: 1.2, width: '100%', overflow: 'hidden' }}>{s.label}</span>
                  </div>
                )
              })}
            </div>
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #1E1E30', display: 'flex', gap: '20px', fontSize: '11px', color: '#9898B8', flexWrap: 'wrap' }}>
              <span>Total séances : <strong style={{ color: '#FFF' }}>{semaines.reduce((a, s) => a + s.nbSessions, 0)}</strong></span>
              <span>Charge totale (Σ RPE) : <strong style={{ color: '#C9A84C' }}>{semaines.reduce((a, s) => a + s.chargeTotal, 0)}</strong></span>
              {moyennes.find(m => m.key === 'rpe')?.moy != null && (
                <span>RPE moyen : <strong style={{ color: '#1A6FFF' }}>{moyennes.find(m => m.key === 'rpe')!.moy}/10</strong></span>
              )}
            </div>
          </div>

          {/* ─── Résumé de la période ──────────────────────────────────────── */}
          <div style={{ background: '#18182A', border: '1px solid #222238', borderRadius: '16px', padding: '18px 20px' }}>
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#9898B8', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '14px' }}>
              Wellness moyen · {moyennes[0].nb} entrée{moyennes[0].nb > 1 ? 's' : ''} renseignée{moyennes[0].nb > 1 ? 's' : ''}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {moyennes.map(m => (
                <div key={m.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#0E0E18', borderRadius: '12px', padding: '12px 8px', border: `1px solid ${m.color}20` }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#7878A8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', textAlign: 'center' }}>{m.label}</span>
                  {m.moy != null ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '26px', fontWeight: '900', color: m.color, lineHeight: 1 }}>{m.moy}</span>
                        {trendIcon(m.trend, m.key)}
                      </div>
                      <span style={{ fontSize: '11px', color: '#9898B8', marginTop: '2px' }}>/10</span>
                      <div style={{ width: '100%', height: '3px', background: '#212135', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                        <div style={{ width: `${m.moy * 10}%`, height: '100%', background: m.color, borderRadius: '2px' }} />
                      </div>
                    </>
                  ) : <span style={{ fontSize: '20px', color: '#2C2C44' }}>—</span>}
                </div>
              ))}
            </div>
          </div>

          {/* ─── Graphiques quotidiens ──────────────────────────────────────── */}
          {metrics.map(m => (
            <div key={m.key} style={{ background: '#18182A', border: '1px solid #222238', borderRadius: '16px', padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: m.color }}>{m.label}</span>
                {moyennes.find(x => x.key === m.key)?.moy != null && (
                  <span style={{ fontSize: '11px', color: '#7878A8', fontWeight: '600' }}>
                    moy. <span style={{ color: m.color, fontWeight: '900' }}>{moyennes.find(x => x.key === m.key)?.moy}</span>/10
                    {' '}{trendIcon(moyennes.find(x => x.key === m.key)?.trend ?? null, m.key)}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingRight: '8px', height: '120px', flexShrink: 0 }}>
                  {[10, 8, 6, 4, 2].map(v => <span key={v} style={{ fontSize: '11px', color: '#6A6A8A', lineHeight: 1 }}>{v}</span>)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Chart metricKey={m.key} color={m.color} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    {xLabels.map(i => (
                      <span key={i} style={{ fontSize: '11px', color: '#9898B8' }}>
                        {new Date(days[i] + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* ─── Historique des séances complétées ─────────────────────────── */}
          {seancesPassees.length > 0 && (
            <div style={{ background: '#18182A', border: '1px solid #222238', borderRadius: '16px', padding: '18px 20px' }}>
              <div style={{ fontSize: '10px', fontWeight: '800', color: '#9898B8', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '14px' }}>
                Séances complétées sur la période ({seancesPassees.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {/* Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 48px 48px 48px 48px', gap: '8px', padding: '6px 10px', borderBottom: '1px solid #1E1E30' }}>
                  {['Date', 'Séance', 'RPE', 'Fat.', 'Cour.', 'Som.'].map(h => (
                    <span key={h} style={{ fontSize: '11px', color: '#9898B8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
                  ))}
                </div>
                {seancesPassees.map((r, i) => {
                  const d = new Date(r.date_realisation + 'T12:00:00')
                  const dateStr = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
                  function cell(val: number | null | undefined, inverted = false) {
                    if (val == null) return <span style={{ color: '#9898B8', fontSize: '12px' }}>—</span>
                    const n = inverted ? 11 - val : val
                    const color = n <= 3 ? '#2ECC71' : n <= 5 ? '#C9A84C' : n <= 7 ? '#FF6B35' : '#FF4757'
                    return <span style={{ color, fontSize: '12px', fontWeight: '700' }}>{val}</span>
                  }
                  return (
                    <div key={r.id} style={{
                      display: 'grid', gridTemplateColumns: '90px 1fr 48px 48px 48px 48px',
                      gap: '8px', padding: '8px 10px',
                      background: i % 2 === 0 ? 'transparent' : '#0E0E1800',
                      borderBottom: '1px solid #1a1a28',
                    }}>
                      <span style={{ fontSize: '11px', color: '#9898B8' }}>{dateStr}</span>
                      <span style={{ fontSize: '12px', color: '#CCC', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.seances?.nom || '—'}</span>
                      {cell(r.rpe)}
                      {cell(r.fatigue)}
                      {cell(r.courbatures)}
                      {cell(r.qualite_sommeil, true)}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
