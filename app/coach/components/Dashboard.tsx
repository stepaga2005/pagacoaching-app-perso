'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type DJoueur = { id: string; nom: string; prenom: string; poste?: string }
type DReal = { id: string; joueur_id: string; date_realisation: string; completee: boolean; fatigue?: number | null; rpe?: number | null; seance_id?: string | null; seances?: { nom: string; type: string } | null }
type Alerte = { joueur: DJoueur; type: 'fatigue' | 'manques'; val: number }

export function Dashboard({ coachId, onNavTo }: { coachId: string | null; onNavTo: (tab: string) => void }) {
  const today = new Date().toISOString().split('T')[0]

  const lundi = (() => {
    const d = new Date(); const day = d.getDay()
    d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day))
    return d.toISOString().split('T')[0]
  })()
  const dimanche = (() => {
    const d = new Date(lundi + 'T12:00:00'); d.setDate(d.getDate() + 6)
    return d.toISOString().split('T')[0]
  })()
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(lundi + 'T12:00:00'); d.setDate(d.getDate() + i)
    return d.toISOString().split('T')[0]
  })
  const dayLetters = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

  const [joueurs, setJoueurs] = useState<DJoueur[]>([])
  const [realsToday, setRealsToday] = useState<DReal[]>([])
  const [realsWeek, setRealsWeek] = useState<DReal[]>([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const [
      { data: jData },
      { data: todayData },
      { data: weekData },
    ] = await Promise.all([
      supabase.from('joueurs').select('id, nom, prenom, poste').eq('actif', true).order('nom'),
      supabase.from('realisations').select('id, joueur_id, completee, fatigue, rpe, seance_id, seances(nom, type)').eq('date_realisation', today),
      supabase.from('realisations').select('id, joueur_id, date_realisation, completee, fatigue, rpe, seance_id').gte('date_realisation', lundi).lte('date_realisation', dimanche),
    ])
    if (jData) setJoueurs(jData)
    if (todayData) setRealsToday(todayData as unknown as DReal[])
    if (weekData) setRealsWeek(weekData)
    if (coachId) {
      const { count } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('destinataire_id', coachId).neq('lu', true)
      setUnread(count || 0)
    }
    setLoading(false)
  }

  const joueurMap: Record<string, DJoueur> = {}
  for (const j of joueurs) joueurMap[j.id] = j

  const seancesJour = realsToday.filter(r => r.seance_id)
  const nbTerminees = seancesJour.filter(r => r.completee).length

  const byPlayer: Record<string, DReal[]> = {}
  for (const r of realsWeek) {
    if (!byPlayer[r.joueur_id]) byPlayer[r.joueur_id] = []
    byPlayer[r.joueur_id].push(r)
  }
  const joueursAvecSeances = joueurs.filter(j => (byPlayer[j.id] || []).some(r => r.seance_id))

  const alertes: Alerte[] = []
  for (const j of joueurs) {
    const jReals = (byPlayer[j.id] || []).filter(r => r.completee && r.fatigue != null)
    if (jReals.length > 0) {
      const derniere = [...jReals].sort((a, b) => b.date_realisation.localeCompare(a.date_realisation))[0]
      if ((derniere.fatigue ?? 0) >= 7) alertes.push({ joueur: j, type: 'fatigue', val: derniere.fatigue! })
    }
    const manques = (byPlayer[j.id] || []).filter(r => !r.completee && r.seance_id && r.date_realisation < today)
    if (manques.length >= 2) alertes.push({ joueur: j, type: 'manques', val: manques.length })
  }

  if (loading) return (
    <div className="page-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
      <span style={{ color: '#1A6FFF', fontSize: '13px', letterSpacing: '2px' }}>CHARGEMENT...</span>
    </div>
  )

  return (
    <div className="page-section">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-0.5px', marginBottom: '4px' }}>Situation</h1>
        <p style={{ color: '#444', fontSize: '13px' }}>
          {new Date(today + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '28px' }}>
        {[
          { label: 'Joueurs actifs', value: joueurs.length, color: '#1A6FFF', icon: '👥' },
          { label: 'Séances aujourd\'hui', value: seancesJour.length, color: '#1A6FFF', icon: '📅' },
          { label: 'Réalisées', value: nbTerminees, color: '#2ECC71', icon: '✓', sub: seancesJour.length > 0 ? `/ ${seancesJour.length}` : undefined },
          { label: 'Messages', value: unread, color: unread > 0 ? '#FF4757' : '#333', icon: '💬', onClick: () => onNavTo('messages') },
        ].map(s => (
          <div key={s.label} onClick={s.onClick} style={{
            background: '#141420', border: `1px solid ${s.value > 0 && s.label === 'Messages' ? '#FF475730' : '#212135'}`,
            borderRadius: '14px', padding: '16px 14px', cursor: s.onClick ? 'pointer' : 'default',
          }}>
            <div style={{ fontSize: '18px', marginBottom: '10px' }}>{s.icon}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '32px', fontWeight: '900', color: s.color, lineHeight: 1 }}>{s.value}</span>
              {s.sub && <span style={{ fontSize: '14px', color: '#333', fontWeight: '600' }}>{s.sub}</span>}
            </div>
            <div style={{ fontSize: '11px', color: '#444', fontWeight: '600', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Séances du jour ── */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{ width: '3px', height: '18px', background: '#1A6FFF', borderRadius: '2px' }} />
          <h2 style={{ fontSize: '13px', fontWeight: '800', color: '#1A6FFF', letterSpacing: '1px', textTransform: 'uppercase' }}>Séances du jour</h2>
        </div>
        {seancesJour.length === 0 ? (
          <div style={{ background: '#141420', border: '1px solid #222238', borderRadius: '14px', padding: '28px', textAlign: 'center', color: '#333', fontSize: '14px' }}>
            Aucune séance prévue aujourd'hui
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {seancesJour.map(r => {
              const j = joueurMap[r.joueur_id]
              if (!j) return null
              const statusColor = r.completee ? '#2ECC71' : '#1A6FFF'
              const fatigueColor = !r.fatigue ? null : r.fatigue <= 3 ? '#2ECC71' : r.fatigue <= 5 ? '#F39C12' : r.fatigue <= 7 ? '#FF6B35' : '#FF4757'
              return (
                <div key={r.id} style={{ background: '#141420', border: '1px solid #222238', borderRadius: '14px', display: 'flex', overflow: 'hidden' }}>
                  <div style={{ width: '4px', background: statusColor, flexShrink: 0 }} />
                  <div style={{ flex: 1, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#1A6FFF20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: '#1A6FFF', fontWeight: '900', fontSize: '13px' }}>{j.prenom[0]}{j.nom[0]}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '800', fontSize: '15px', color: '#F0F0F0' }}>{j.prenom} {j.nom}</div>
                      <div style={{ fontSize: '12px', color: '#555', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {(r.seances as { nom: string; type: string } | null)?.nom || 'Séance'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      {r.completee && fatigueColor && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: fatigueColor + '18', border: `1px solid ${fatigueColor}35`, borderRadius: '10px', padding: '4px 10px' }}>
                          <span style={{ fontSize: '8px', color: fatigueColor + '90', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fatigue</span>
                          <span style={{ fontSize: '18px', fontWeight: '900', color: fatigueColor, lineHeight: 1 }}>{r.fatigue}</span>
                        </div>
                      )}
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: statusColor + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: statusColor }}>
                        {r.completee ? '✓' : '▶'}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Alertes ── */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{ width: '3px', height: '18px', background: alertes.length > 0 ? '#FF4757' : '#2ECC71', borderRadius: '2px' }} />
          <h2 style={{ fontSize: '13px', fontWeight: '800', color: alertes.length > 0 ? '#FF4757' : '#2ECC71', letterSpacing: '1px', textTransform: 'uppercase' }}>
            {alertes.length > 0 ? `${alertes.length} alerte${alertes.length > 1 ? 's' : ''}` : 'Alertes'}
          </h2>
        </div>
        {alertes.length === 0 ? (
          <div style={{ background: '#0F1A12', border: '1px solid #2ECC7130', borderRadius: '14px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>✓</span>
            <span style={{ color: '#2ECC71', fontWeight: '700', fontSize: '14px' }}>Tout va bien cette semaine</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {alertes.map((a, i) => (
              <div key={i} style={{ background: '#120A0A', border: '1px solid #FF475730', borderRadius: '14px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FF475718', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '16px' }}>{a.type === 'fatigue' ? '⚡' : '✗'}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '800', fontSize: '14px', color: '#F0F0F0' }}>{a.joueur.prenom} {a.joueur.nom}</div>
                  <div style={{ fontSize: '12px', color: '#FF475790', marginTop: '2px' }}>
                    {a.type === 'fatigue' ? `Fatigue élevée : ${a.val}/10 lors de la dernière séance` : `${a.val} séances manquées cette semaine`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Charge hebdomadaire ── */}
      {(() => {
        const loadByDay = weekDays.map((d, i) => ({
          d, letter: dayLetters[i],
          count: realsWeek.filter(r => r.date_realisation === d && r.completee && r.seance_id).length,
          planned: realsWeek.filter(r => r.date_realisation === d && r.seance_id).length,
        }))
        const maxCount = Math.max(...loadByDay.map(d => d.planned), 1)
        const totalWeek = loadByDay.reduce((s, d) => s + d.count, 0)
        const totalPlanned = loadByDay.reduce((s, d) => s + d.planned, 0)
        const pct = totalPlanned > 0 ? Math.round((totalWeek / totalPlanned) * 100) : 0
        return (
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '3px', height: '18px', background: '#1A6FFF', borderRadius: '2px' }} />
                <h2 style={{ fontSize: '13px', fontWeight: '800', color: '#1A6FFF', letterSpacing: '1px', textTransform: 'uppercase' }}>Charge semaine</h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: '#444', fontWeight: '700' }}>{totalWeek}/{totalPlanned} séances</span>
                <span style={{
                  fontSize: '12px', fontWeight: '800', padding: '3px 10px', borderRadius: '20px',
                  background: pct >= 80 ? '#2ECC7120' : pct >= 50 ? '#F39C1220' : '#FF475720',
                  color: pct >= 80 ? '#2ECC71' : pct >= 50 ? '#F39C12' : '#FF4757',
                }}>{pct}%</span>
              </div>
            </div>
            <div style={{ background: '#141420', border: '1px solid #222238', borderRadius: '16px', padding: '20px 16px' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '72px' }}>
                {loadByDay.map((d) => {
                  const isToday = d.d === today
                  const isPast = d.d < today
                  const fillH = d.planned === 0 ? 0 : Math.max(4, (d.count / maxCount) * 56)
                  const bgH = d.planned === 0 ? 0 : Math.max(4, (d.planned / maxCount) * 56)
                  const col = isToday ? '#1A6FFF' : isPast ? '#2ECC71' : '#2A2A3A'
                  return (
                    <div key={d.d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                      <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                        {d.planned > 0 && <div style={{ position: 'absolute', bottom: 0, left: '10%', right: '10%', height: `${bgH}px`, borderRadius: '4px 4px 0 0', background: '#212135' }} />}
                        {d.count > 0 && <div style={{ position: 'relative', left: '10%', right: '10%', width: '80%', height: `${fillH}px`, borderRadius: '4px 4px 0 0', background: col, transition: 'height 0.4s cubic-bezier(0.22,1,0.36,1)' }} />}
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: '800', color: isToday ? '#1A6FFF' : '#444', textTransform: 'uppercase' }}>{d.letter}</span>
                    </div>
                  )
                })}
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #1C1C2C' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#2ECC71' }} />
                  <span style={{ fontSize: '10px', color: '#444', fontWeight: '600' }}>Réalisé</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#212135', border: '1px solid #333' }} />
                  <span style={{ fontSize: '10px', color: '#444', fontWeight: '600' }}>Planifié</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#1A6FFF' }} />
                  <span style={{ fontSize: '10px', color: '#444', fontWeight: '600' }}>Aujourd'hui</span>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── État de forme ── */}
      {joueurs.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '3px', height: '18px', background: '#2ECC71', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '13px', fontWeight: '800', color: '#2ECC71', letterSpacing: '1px', textTransform: 'uppercase' }}>État de forme</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {joueurs.map(j => {
              const jReals = (byPlayer[j.id] || []).filter(r => r.completee && r.fatigue != null)
              const lastFatigue = jReals.length > 0
                ? [...jReals].sort((a, b) => b.date_realisation.localeCompare(a.date_realisation))[0].fatigue ?? null
                : null
              const completedWeek = (byPlayer[j.id] || []).filter(r => r.completee && r.seance_id).length
              const plannedWeek = (byPlayer[j.id] || []).filter(r => r.seance_id).length
              const { label, color, bg } = lastFatigue === null
                ? { label: 'Aucune donnée', color: '#444', bg: '#212135' }
                : lastFatigue <= 3 ? { label: '🟢 Frais', color: '#2ECC71', bg: '#2ECC7110' }
                : lastFatigue <= 5 ? { label: '🟡 Normal', color: '#F39C12', bg: '#F39C1210' }
                : lastFatigue <= 7 ? { label: '🟠 Fatigué', color: '#FF6B35', bg: '#FF6B3510' }
                : { label: '🔴 Surchargé', color: '#FF4757', bg: '#FF475710' }
              return (
                <div key={j.id} style={{ background: '#141420', border: '1px solid #222238', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#2ECC7115', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '12px', fontWeight: '900', color: '#2ECC71' }}>{j.prenom[0]}{j.nom[0]}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>{j.prenom} {j.nom}</div>
                    <div style={{ fontSize: '11px', color: '#444', marginTop: '2px' }}>
                      {plannedWeek > 0 ? `${completedWeek}/${plannedWeek} séances cette semaine` : 'Aucune séance planifiée'}
                    </div>
                  </div>
                  <div style={{ padding: '4px 12px', borderRadius: '20px', background: bg, flexShrink: 0 }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color }}>{label}</span>
                  </div>
                  {lastFatigue !== null && (
                    <div style={{ fontWeight: '900', fontSize: '20px', color, flexShrink: 0, minWidth: '28px', textAlign: 'center' }}>{lastFatigue}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Planning semaine ── */}
      {joueursAvecSeances.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '3px', height: '18px', background: '#1A6FFF', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '13px', fontWeight: '800', color: '#1A6FFF', letterSpacing: '1px', textTransform: 'uppercase' }}>Planning semaine</h2>
          </div>
          <div style={{ background: '#141420', border: '1px solid #222238', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr repeat(7, 36px)', gap: '4px', padding: '10px 14px', borderBottom: '1px solid #1C1C2C', alignItems: 'center' }}>
              <div />
              {weekDays.map((ds, i) => (
                <div key={ds} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', fontWeight: '800', color: ds === today ? '#1A6FFF' : '#333', textTransform: 'uppercase' }}>{dayLetters[i]}</div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: ds === today ? '#1A6FFF' : '#444' }}>{new Date(ds + 'T12:00:00').getDate()}</div>
                </div>
              ))}
            </div>
            {joueursAvecSeances.map((j, ji) => {
              const jReals = byPlayer[j.id] || []
              return (
                <div key={j.id} style={{ display: 'grid', gridTemplateColumns: '1fr repeat(7, 36px)', gap: '4px', padding: '10px 14px', alignItems: 'center', borderTop: ji > 0 ? '1px solid #111' : 'none' }}>
                  <div style={{ fontWeight: '700', fontSize: '13px', color: '#CCC', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '8px' }}>
                    {j.prenom} {j.nom}
                  </div>
                  {weekDays.map(ds => {
                    const dayReals = jReals.filter(r => r.date_realisation === ds && r.seance_id)
                    const isToday = ds === today
                    const isPast = ds < today
                    if (dayReals.length === 0) return <div key={ds} style={{ width: '28px', height: '28px', margin: '0 auto' }} />
                    const allDone = dayReals.every(r => r.completee)
                    const someDone = dayReals.some(r => r.completee)
                    const color = allDone ? '#2ECC71' : someDone ? '#F39C12' : isPast ? '#FF4757' : '#1A6FFF'
                    return (
                      <div key={ds} style={{ width: '28px', height: '28px', borderRadius: '50%', margin: '0 auto', background: color + (isToday ? 'FF' : '25'), border: `2px solid ${color}${isToday ? 'FF' : '80'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '10px', fontWeight: '900', color: isToday ? '#FFF' : color }}>{allDone ? '✓' : dayReals.length}</span>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
