'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from '../lib/toast'

type Activite = { id: string; nom: string; created_at: string }
type JoueurLight = { id: string; nom: string; prenom: string }
type Attribution = {
  id: string
  date_realisation: string
  completee: boolean
  joueur_id: string
  joueurs?: { nom: string; prenom: string } | null
  activites?: { nom: string } | null
}

export function ActivitesView({ coachId }: { coachId: string | null }) {
  const [activites, setActivites] = useState<Activite[]>([])
  const [selection, setSelection] = useState<Set<string>>(new Set())
  const [newNom, setNewNom] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [attributions, setAttributions] = useState<Attribution[]>([])

  useEffect(() => { if (coachId) load(coachId) }, [coachId])

  async function load(cId: string) {
    const [{ data: acts }, { data: attrs }] = await Promise.all([
      supabase.from('activites').select('id, nom, created_at').eq('coach_id', cId).order('created_at', { ascending: false }),
      supabase.from('realisations')
        .select('id, date_realisation, completee, joueur_id, joueurs(nom, prenom), activites(nom)')
        .not('activite_id', 'is', null)
        .order('date_realisation', { ascending: false })
        .limit(50),
    ])
    if (acts) setActivites(acts)
    if (attrs) setAttributions(attrs as unknown as Attribution[])
  }

  async function creerActivite() {
    if (!newNom.trim()) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); toast('Session expirée, reconnectez-vous', 'error'); return }
    const { error } = await supabase.from('activites').insert({ coach_id: user.id, nom: newNom.trim() })
    setSaving(false)
    if (error) { toast('Erreur : ' + error.message, 'error'); return }
    setNewNom('')
    setShowInput(false)
    load(user.id)
    toast('Activité créée', 'success')
  }

  async function supprimerActivite(id: string) {
    if (!confirm('Supprimer cette activité ?')) return
    const { error } = await supabase.from('activites').delete().eq('id', id)
    if (error) { toast('Erreur : ' + error.message, 'error'); return }
    setSelection(prev => { const n = new Set(prev); n.delete(id); return n })
    if (coachId) load(coachId)
    toast('Activité supprimée', 'success')
  }

  function toggle(id: string) {
    setSelection(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  const selectedActivites = activites.filter(a => selection.has(a.id))

  return (
    <div className="page-section" style={{ maxWidth: '700px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <div style={{ color: '#F0F0F8', fontWeight: 800, fontSize: '20px', letterSpacing: '-0.5px' }}>Activités</div>
          <div style={{ color: '#9898B8', fontSize: '13px', marginTop: '3px' }}>Stage, match, entraînement club…</div>
        </div>
        <button
          onClick={() => { setShowInput(true); setNewNom('') }}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px' }}
        >
          <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> Nouvelle
        </button>
      </div>

      {/* Inline creation input */}
      {showInput && (
        <div style={{ background: '#0E0E1C', border: '1px solid #2A2A4A', borderRadius: '12px', padding: '16px', marginBottom: '16px', display: 'flex', gap: '10px' }}>
          <input
            autoFocus
            className="input"
            style={{ flex: 1 }}
            placeholder="Nom de l'activité (ex: Stage, Match, Entraînement club…)"
            value={newNom}
            onChange={e => setNewNom(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') creerActivite(); if (e.key === 'Escape') setShowInput(false) }}
          />
          <button onClick={creerActivite} disabled={saving || !newNom.trim()} className="btn btn-primary" style={{ padding: '10px 18px' }}>
            {saving ? '…' : 'Créer'}
          </button>
          <button onClick={() => setShowInput(false)} className="btn btn-ghost" style={{ padding: '10px 14px' }}>✕</button>
        </div>
      )}

      {/* Liste des activités */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '24px' }}>
        {activites.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7878A8', fontSize: '14px' }}>
            Aucune activité — créez-en une avec le bouton <strong style={{ color: '#9898B8' }}>+ Nouvelle</strong>
          </div>
        )}
        {activites.map(a => {
          const sel = selection.has(a.id)
          return (
            <div
              key={a.id}
              onClick={() => toggle(a.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 16px', borderRadius: '12px', cursor: 'pointer',
                background: sel ? '#0D1A2E' : '#0A0A14',
                border: sel ? '1px solid #1A6FFF50' : '1px solid #22223A',
                transition: 'all 0.15s ease',
              }}
            >
              <div className={`checkbox-custom${sel ? ' checked' : ''}`} style={{ flexShrink: 0 }}>
                {sel ? '✓' : ''}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: sel ? '#F0F0F8' : '#C0C0D8', fontWeight: sel ? 700 : 500, fontSize: '15px' }}>{a.nom}</div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); supprimerActivite(a.id) }}
                style={{ background: 'none', border: 'none', color: '#4A4A6A', cursor: 'pointer', fontSize: '16px', padding: '4px 8px', borderRadius: '6px' }}
                title="Supprimer"
              >
                🗑
              </button>
            </div>
          )
        })}
      </div>

      {/* Barre d'action flottante quand sélection */}
      {selection.size > 0 && (
        <div style={{
          position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          background: '#13132A', border: '1px solid #2A2A4A', borderRadius: '16px',
          padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '14px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)', zIndex: 30,
        }}>
          <span style={{ color: '#9898B8', fontSize: '14px' }}>
            {selection.size} activité{selection.size > 1 ? 's' : ''} sélectionnée{selection.size > 1 ? 's' : ''}
          </span>
          <button onClick={() => setSelection(new Set())} className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: '13px' }}>
            Effacer
          </button>
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '10px 20px' }}>
            Attribuer →
          </button>
        </div>
      )}

      {/* Historique des attributions récentes */}
      {attributions.length > 0 && (
        <div>
          <div style={{ color: '#9898B8', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
            Attributions récentes
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {attributions.slice(0, 20).map(attr => (
              <div key={attr.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: '10px',
                background: '#0A0A14', border: '1px solid #1A1A2A',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#D4AF60', fontSize: '13px', fontWeight: 700, background: '#C9A84C12', padding: '2px 8px', borderRadius: '6px' }}>
                    {attr.activites?.nom ?? '—'}
                  </span>
                  <span style={{ color: '#C0C0D8', fontSize: '13px' }}>
                    {(attr.joueurs as unknown as {prenom: string; nom: string} | undefined)?.prenom} {(attr.joueurs as unknown as {prenom: string; nom: string} | undefined)?.nom}
                  </span>
                </div>
                <span style={{ color: '#9898B8', fontSize: '12px' }}>
                  {new Date(attr.date_realisation + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal attribution */}
      {showModal && (
        <AttributionActiviteModal
          activites={selectedActivites}
          onClose={() => {
            setShowModal(false)
            setSelection(new Set())
            if (coachId) load(coachId)
          }}
        />
      )}
    </div>
  )
}

function CalendrierMultiDate({ selected, onChange }: { selected: string[]; onChange: (dates: string[]) => void }) {
  const todayStr = new Date().toISOString().split('T')[0]
  const todayDate = new Date()
  const [viewYear, setViewYear] = useState(todayDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(todayDate.getMonth())

  const MOIS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
  const JOURS_L = ['L','M','M','J','V','S','D']

  const firstDow = (() => { const d = new Date(viewYear, viewMonth, 1).getDay(); return d === 0 ? 6 : d - 1 })()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells: (string | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const d = i + 1
      return `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    }),
  ]

  function toggle(ds: string) {
    onChange(selected.includes(ds) ? selected.filter(d => d !== ds) : [...selected, ds].sort())
  }
  function prevMonth() { viewMonth === 0 ? (setViewYear(y => y-1), setViewMonth(11)) : setViewMonth(m => m-1) }
  function nextMonth() { viewMonth === 11 ? (setViewYear(y => y+1), setViewMonth(0)) : setViewMonth(m => m+1) }

  return (
    <div style={{ background: '#0A0A14', borderRadius: '12px', padding: '14px', border: '1px solid #22223A' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <button onClick={prevMonth} style={{ background: 'none', border: 'none', color: '#9898B8', cursor: 'pointer', fontSize: '20px', lineHeight: 1, padding: '2px 8px' }}>‹</button>
        <span style={{ color: '#F0F0F8', fontWeight: 700, fontSize: '14px' }}>{MOIS[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} style={{ background: 'none', border: 'none', color: '#9898B8', cursor: 'pointer', fontSize: '20px', lineHeight: 1, padding: '2px 8px' }}>›</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px', marginBottom: '4px' }}>
        {JOURS_L.map((l, i) => <div key={i} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#6868A0', padding: '2px 0' }}>{l}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
        {cells.map((ds, i) => {
          if (!ds) return <div key={`e${i}`} />
          const isSel = selected.includes(ds)
          const isToday = ds === todayStr
          return (
            <button key={ds} onClick={() => toggle(ds)} style={{
              aspectRatio: '1', borderRadius: '8px', border: isToday && !isSel ? '1px solid #1A6FFF60' : '1px solid transparent',
              background: isSel ? '#1A6FFF' : 'transparent',
              color: isSel ? '#FFF' : isToday ? '#6AAEFF' : '#C0C0D8',
              fontWeight: isSel ? 700 : 400, fontSize: '13px', cursor: 'pointer',
            }}>
              {new Date(ds + 'T12:00:00').getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function AttributionActiviteModal({ activites, onClose }: { activites: Activite[]; onClose: () => void }) {
  const [joueurs, setJoueurs] = useState<JoueurLight[]>([])
  const [selectedJoueurs, setSelectedJoueurs] = useState<Set<string>>(new Set())
  const [selectedDates, setSelectedDates] = useState<string[]>([])
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
    if (selectedJoueurs.size === 0 || selectedDates.length === 0) return
    setSaving(true)
    const rows: { joueur_id: string; activite_id: string; date_realisation: string; completee: boolean }[] = []
    for (const joueurId of selectedJoueurs) {
      for (const act of activites) {
        for (const date of selectedDates) {
          rows.push({ joueur_id: joueurId, activite_id: act.id, date_realisation: date, completee: false })
        }
      }
    }
    const { error } = await supabase.from('realisations').insert(rows)
    setSaving(false)
    if (error) { toast('Erreur : ' + error.message, 'error'); return }
    const total = selectedDates.length * selectedJoueurs.size
    toast(`✓ ${total} attribution${total > 1 ? 's' : ''} créée${total > 1 ? 's' : ''}`, 'success')
    onClose()
  }

  const canConfirm = selectedJoueurs.size > 0 && selectedDates.length > 0 && !saving

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-title">Attribuer des activités</div>
        <div className="modal-subtitle">{activites.map(a => a.nom).join(', ')}</div>

        {/* Calendrier multi-dates */}
        <div style={{ marginBottom: '16px' }}>
          <label className="section-label" style={{ display: 'block', marginBottom: '8px' }}>
            Dates{selectedDates.length > 0 && <span style={{ color: '#5599FF', textTransform: 'none', letterSpacing: 0 }}> — {selectedDates.length} sélectionnée{selectedDates.length > 1 ? 's' : ''}</span>}
          </label>
          <CalendrierMultiDate selected={selectedDates} onChange={setSelectedDates} />
          {selectedDates.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
              {selectedDates.map(ds => (
                <span key={ds} onClick={() => setSelectedDates(prev => prev.filter(d => d !== ds))}
                  style={{ background: '#1A6FFF20', border: '1px solid #1A6FFF50', borderRadius: '20px', padding: '3px 10px', fontSize: '12px', color: '#6AAEFF', cursor: 'pointer', fontWeight: 600 }}>
                  {new Date(ds + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })} ✕
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Joueurs */}
        <div style={{ marginBottom: '20px' }}>
          <label className="section-label" style={{ display: 'block', marginBottom: '10px' }}>
            Joueurs{selectedJoueurs.size > 0 && <span style={{ color: '#5599FF', textTransform: 'none', letterSpacing: 0 }}> — {selectedJoueurs.size} sélectionné{selectedJoueurs.size > 1 ? 's' : ''}</span>}
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '180px', overflowY: 'auto' }}>
            {joueurs.length === 0 && <span style={{ color: '#7878A8', fontSize: '13px' }}>Aucun joueur actif</span>}
            {joueurs.map(j => {
              const sel = selectedJoueurs.has(j.id)
              return (
                <button key={j.id} onClick={() => toggleJoueur(j.id)}
                  className={`list-item${sel ? ' list-item-active' : ''}`}
                  style={{ border: sel ? '1px solid #1A6FFF40' : '1px solid #22223A', cursor: 'pointer', textAlign: 'left' }}>
                  <div className={`checkbox-custom${sel ? ' checked' : ''}`}>{sel ? '✓' : ''}</div>
                  <span style={{ color: sel ? '#F0F0F8' : '#888', fontSize: '14px', fontWeight: sel ? 700 : 400 }}>{j.prenom} {j.nom}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} className="btn btn-ghost" style={{ flex: 1 }}>Annuler</button>
          <button
            onClick={confirmer}
            disabled={!canConfirm}
            className={`btn${canConfirm ? ' btn-success' : ''}`}
            style={{ flex: 2, justifyContent: 'center', padding: '12px', ...(!canConfirm ? { background: '#22223A', color: '#3A3A50', cursor: 'not-allowed' } : {}) }}
          >
            {saving ? 'Attribution…' : canConfirm ? `Attribuer (${selectedDates.length}j × ${selectedJoueurs.size} joueur${selectedJoueurs.size > 1 ? 's' : ''})` : 'Choisir dates + joueurs'}
          </button>
        </div>
      </div>
    </div>
  )
}
