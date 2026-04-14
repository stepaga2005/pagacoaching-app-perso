'use client'

import { useState } from 'react'
import { Realisation } from '../lib/types'

export function WellnessGraphiques({ realisations }: { realisations: Realisation[] }) {
  const todayStr = new Date().toISOString().split('T')[0]

  // Période sélectionnable — défaut : 28 derniers jours
  const [nbJours, setNbJours] = useState(28)
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

  const metrics = [
    { key: 'fatigue' as const, label: 'Fatigue', color: '#FF4757' },
    { key: 'rpe' as const, label: 'Effort (RPE)', color: '#1A6FFF' },
    { key: 'courbatures' as const, label: 'Courbatures', color: '#FF6B35' },
    { key: 'qualite_sommeil' as const, label: 'Sommeil', color: '#2ECC71' },
  ]

  // Point par jour (moyenne si plusieurs séances ce jour)
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

  // Moyennes sur la période visible
  const moyennes = metrics.map(m => {
    const vals = historique.filter(h => h !== null).map(h => h![m.key]).filter(v => v != null) as number[]
    return { ...m, moy: vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 10) / 10 : null, nb: vals.length }
  })

  const hasDonnees = historique.some(h => h !== null)

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

    // Segments continus
    const segments: string[] = []
    let seg = ''
    for (let i = 0; i < points.length; i++) {
      if (points[i].y != null) {
        const x = toX(i), y = toY(points[i].y!)
        seg += seg === '' ? `M${x},${y}` : ` L${x},${y}`
      } else if (seg !== '') { segments.push(seg); seg = '' }
    }
    if (seg) segments.push(seg)

    // Aire sous la courbe (premier segment)
    const areaPoints = filled.map(p => `${toX(p.i)},${toY(p.y!)}`)
    const areaPath = areaPoints.length > 1
      ? `M${toX(filled[0].i)},${H} L${areaPoints.join(' L')} L${toX(filled[filled.length - 1].i)},${H} Z`
      : ''

    return (
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
        {/* Grilles horizontales */}
        {[2, 4, 6, 8, 10].map(v => (
          <line key={v} x1={PADX} y1={toY(v)} x2={W - PADX} y2={toY(v)} stroke="#1C1C2C" strokeWidth="1" />
        ))}
        {/* Zone rouge danger (8-10) */}
        <rect x={PADX} y={toY(10)} width={W - PADX * 2} height={toY(8) - toY(10)} fill={color + '08'} />
        {/* Aire */}
        {areaPath && <path d={areaPath} fill={color + '15'} />}
        {/* Ligne */}
        {segments.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {/* Points */}
        {filled.map(p => (
          <circle key={p.i} cx={toX(p.i)} cy={toY(p.y!)} r={n <= 14 ? 4 : 3} fill={color} stroke="#0C0C0C" strokeWidth="1.5" />
        ))}
        {/* Valeurs sur les points si peu de points */}
        {n <= 14 && filled.map(p => (
          <text key={`lbl-${p.i}`} x={toX(p.i)} y={toY(p.y!) - 7} textAnchor="middle" fontSize="9" fill={color} fontWeight="700">{p.y}</text>
        ))}
      </svg>
    )
  }

  // Labels axe X — afficher ~5 dates régulièrement
  const xLabels = (() => {
    const step = Math.max(1, Math.floor(days.length / 5))
    const idxs: number[] = []
    for (let i = 0; i < days.length; i += step) idxs.push(i)
    if (idxs[idxs.length - 1] !== days.length - 1) idxs.push(days.length - 1)
    return idxs
  })()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Sélecteur de période */}
      <div style={{ background: '#18182A', border: '1px solid #222238', borderRadius: '14px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* Raccourcis */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[7, 14, 28, 56].map(n => (
            <button key={n} onClick={() => { setNbJours(n); setFin(todayStr) }} style={{
              padding: '5px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '700',
              background: nbJours === n && fin === todayStr ? '#1A6FFF' : '#212135',
              color: nbJours === n && fin === todayStr ? '#FFF' : '#555',
            }}>{n === 7 ? '7j' : n === 14 ? '14j' : n === 28 ? '1 mois' : '2 mois'}</button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => decaler(-1)} style={{ background: '#212135', border: '1px solid #2C2C44', borderRadius: '8px', padding: '5px 10px', color: '#888', cursor: 'pointer', fontSize: '13px' }}>‹</button>
          <span style={{ fontSize: '12px', color: '#666', fontWeight: '600', minWidth: '160px', textAlign: 'center' }}>
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
          <div style={{ color: '#444', fontSize: '14px' }}>Aucune donnée sur cette période</div>
        </div>
      ) : (
        <>
          {/* Résumé de la période */}
          <div style={{ background: '#18182A', border: '1px solid #222238', borderRadius: '16px', padding: '18px 20px' }}>
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#333', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '14px' }}>
              Moyenne sur la période · {moyennes[0].nb} séance{moyennes[0].nb > 1 ? 's' : ''} renseignée{moyennes[0].nb > 1 ? 's' : ''}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {moyennes.map(m => (
                <div key={m.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#0E0E18', borderRadius: '12px', padding: '12px 8px', border: `1px solid ${m.color}20` }}>
                  <span style={{ fontSize: '9px', fontWeight: '700', color: '#444', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', textAlign: 'center' }}>{m.label}</span>
                  {m.moy != null ? (
                    <>
                      <span style={{ fontSize: '26px', fontWeight: '900', color: m.color, lineHeight: 1 }}>{m.moy}</span>
                      <span style={{ fontSize: '9px', color: '#333', marginTop: '2px' }}>/10</span>
                      <div style={{ width: '100%', height: '3px', background: '#212135', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                        <div style={{ width: `${m.moy * 10}%`, height: '100%', background: m.color, borderRadius: '2px' }} />
                      </div>
                    </>
                  ) : <span style={{ fontSize: '20px', color: '#2C2C44' }}>—</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Graphiques quotidiens */}
          {metrics.map(m => (
            <div key={m.key} style={{ background: '#18182A', border: '1px solid #222238', borderRadius: '16px', padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: m.color }}>{m.label}</span>
                {moyennes.find(x => x.key === m.key)?.moy != null && (
                  <span style={{ fontSize: '11px', color: '#444', fontWeight: '600' }}>
                    moy. <span style={{ color: m.color, fontWeight: '900' }}>{moyennes.find(x => x.key === m.key)?.moy}</span>/10
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0' }}>
                {/* Axe Y */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingRight: '8px', height: '120px', flexShrink: 0 }}>
                  {[10, 8, 6, 4, 2].map(v => <span key={v} style={{ fontSize: '9px', color: '#2C2C44', lineHeight: 1 }}>{v}</span>)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Chart metricKey={m.key} color={m.color} />
                  {/* Axe X */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    {xLabels.map(i => (
                      <span key={i} style={{ fontSize: '9px', color: '#333' }}>
                        {new Date(days[i] + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

