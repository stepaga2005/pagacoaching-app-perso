'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Exercice, Famille } from '../lib/types'
import { getYoutubeId, getVimeoId } from '../lib/utils'
import { toast } from '../lib/toast'
import { MultiCheck } from './shared/MultiCheck'

export function Exercices() {
  const [exercices, setExercices] = useState<Exercice[]>([])
  const [familles, setFamilles] = useState<Famille[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editEx, setEditEx] = useState<Exercice | null>(null)
  const [filtresFamille, setFiltresFamille] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [apercu, setApercu] = useState<Exercice | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    nom: '', famille_id: '', description: '', consignes_execution: '',
    video_url: '', materiel: [] as string[], zone_musculaire: [] as string[], type_effort: '', position: '',
  })

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const [{ data: exs }, { data: fams }] = await Promise.all([
      supabase.from('exercices').select('*, familles(nom, couleur)').order('nom').limit(5000),
      supabase.from('familles').select('*').order('nom'),
    ])
    if (exs) setExercices([...exs].sort((a, b) => a.nom.localeCompare(b.nom, 'fr')))
    if (fams) setFamilles([...fams].sort((a, b) => a.nom.localeCompare(b.nom, 'fr')))
  }

  function openAdd() {
    setEditEx(null)
    setForm({ nom: '', famille_id: '', description: '', consignes_execution: '', video_url: '', materiel: [], zone_musculaire: [], type_effort: '', position: '' })
    setShowForm(true)
  }

  function openEdit(ex: Exercice) {
    setEditEx(ex)
    setForm({
      nom: ex.nom, famille_id: ex.famille_id || '',
      description: ex.description || '', consignes_execution: ex.consignes_execution || '',
      video_url: ex.video_url || '', materiel: ex.materiel || [],
      zone_musculaire: ex.zone_musculaire || [], type_effort: ex.type_effort || '', position: ex.position || '',
    })
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.nom || !form.famille_id) { toast('Nom et famille obligatoires', 'info'); return }
    setSaving(true)
    const payload = { ...form, famille_id: form.famille_id }
    if (editEx) {
      const { error } = await supabase.from('exercices').update(payload).eq('id', editEx.id)
      if (error) { toast('Erreur modification : ' + error.message, 'error'); setSaving(false); return }
    } else {
      const { error } = await supabase.from('exercices').insert(payload).select()
      if (error) { toast('Erreur création : ' + error.message, 'error'); setSaving(false); return }
    }
    await loadData()
    setShowForm(false)
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cet exercice ?')) return
    await supabase.from('exercices').delete().eq('id', id)
    await loadData()
  }

  const filtres = filtresFamille.length > 0
    ? exercices.filter(e => filtresFamille.includes(e.famille_id))
    : exercices
  const affichés = filtres
    .filter(e => e.nom.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))

  const inp = (placeholder: string, key: keyof typeof form, type = 'text') => (
    <input type={type} placeholder={placeholder} value={form[key] as string}
      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
      style={{ width: '100%', background: '#212135', border: '1px solid #2C2C44', borderRadius: '8px', padding: '11px 14px', color: '#FFF', fontSize: '14px', outline: 'none' }}
    />
  )

  const textarea = (placeholder: string, key: keyof typeof form) => (
    <textarea placeholder={placeholder} value={form[key] as string}
      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
      rows={3}
      style={{ width: '100%', background: '#212135', border: '1px solid #2C2C44', borderRadius: '8px', padding: '11px 14px', color: '#FFF', fontSize: '14px', outline: 'none', resize: 'vertical' }}
    />
  )

  // === Vue détail exercice ===
  if (apercu) {
    return (
      <div>
        <button onClick={() => setApercu(null)} style={{
          display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none',
          color: '#1A6FFF', fontSize: '14px', fontWeight: '600', cursor: 'pointer', padding: '0', marginBottom: '20px',
        }}>← Retour aux exercices</button>

        <div style={{ background: '#18182A', border: '1px solid #2C2C44', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800' }}>{apercu.nom}</h2>
              {apercu.familles && (
                <span style={{
                  display: 'inline-block', marginTop: '6px', padding: '4px 12px', borderRadius: '20px',
                  background: apercu.familles.couleur + '20', color: apercu.familles.couleur, fontSize: '12px', fontWeight: '600',
                }}>{apercu.familles.nom}</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { const ex = apercu; setApercu(null); openEdit(ex) }} style={{
                padding: '8px 14px', borderRadius: '8px', border: '1px solid #2C2C44',
                background: 'transparent', color: '#888', fontSize: '12px', cursor: 'pointer',
              }}>Modifier</button>
              <button onClick={() => { handleDelete(apercu.id); setApercu(null) }} style={{
                padding: '8px 14px', borderRadius: '8px', border: '1px solid #FF4757',
                background: 'transparent', color: '#FF4757', fontSize: '12px', cursor: 'pointer',
              }}>Supprimer</button>
            </div>
          </div>

          {apercu.video_url && (() => {
            const ytId = getYoutubeId(apercu.video_url)
            const vimeoId = getVimeoId(apercu.video_url)
            const src = ytId
              ? `https://www.youtube.com/embed/${ytId}`
              : vimeoId
              ? `https://player.vimeo.com/video/${vimeoId}`
              : null
            return src ? (
              <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', background: '#000', aspectRatio: '16/9' }}>
                <iframe src={src} style={{ width: '100%', height: '100%', border: 'none' }} allow="autoplay; fullscreen" allowFullScreen />
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0D1A2E', border: '1px solid #1A6FFF30', borderRadius: '10px', padding: '10px 14px', marginBottom: '20px' }}>
                <span style={{ color: '#1A6FFF', fontSize: '13px' }}>▶</span>
                <span style={{ color: '#888', fontSize: '12px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{apercu.video_url}</span>
                <button onClick={() => navigator.clipboard?.writeText(apercu.video_url!).then(() => toast('Lien copié !', 'success'))} style={{
                  background: '#1A6FFF20', border: '1px solid #1A6FFF40', borderRadius: '6px', padding: '4px 10px', color: '#1A6FFF', cursor: 'pointer', fontSize: '11px', fontWeight: '600',
                }}>Copier</button>
                <button onClick={() => window.open(apercu.video_url!, '_blank')} style={{
                  background: '#1A6FFF', border: 'none', borderRadius: '6px', padding: '4px 10px', color: '#FFF', cursor: 'pointer', fontSize: '11px', fontWeight: '600',
                }}>Ouvrir</button>
              </div>
            )
          })()}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {apercu.description && (
              <div>
                <div style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Description</div>
                <p style={{ color: '#CCC', fontSize: '14px', lineHeight: '1.6' }}>{apercu.description}</p>
              </div>
            )}
            {apercu.consignes_execution && (
              <div>
                <div style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Consignes d'exécution</div>
                <p style={{ color: '#CCC', fontSize: '14px', lineHeight: '1.6' }}>{apercu.consignes_execution}</p>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {apercu.materiel?.length > 0 && (
                <div>
                  <span style={{ color: '#888', fontSize: '12px' }}>Matériel : </span>
                  <span style={{ color: '#FFF', fontSize: '12px' }}>{apercu.materiel.join(', ')}</span>
                </div>
              )}
              {apercu.zone_musculaire?.length > 0 && (
                <div>
                  <span style={{ color: '#888', fontSize: '12px' }}>Zones : </span>
                  <span style={{ color: '#FFF', fontSize: '12px' }}>{apercu.zone_musculaire.join(', ')}</span>
                </div>
              )}
              {apercu.type_effort && <div><span style={{ color: '#888', fontSize: '12px' }}>Effort : </span><span style={{ color: '#FFF', fontSize: '12px' }}>{apercu.type_effort}</span></div>}
              {apercu.position && <div><span style={{ color: '#888', fontSize: '12px' }}>Position : </span><span style={{ color: '#FFF', fontSize: '12px' }}>{apercu.position}</span></div>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // === Vue formulaire ===
  if (showForm) {
    return (
      <div>
        <button onClick={() => setShowForm(false)} style={{
          display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none',
          color: '#1A6FFF', fontSize: '14px', fontWeight: '600', cursor: 'pointer', padding: '0', marginBottom: '20px',
        }}>← Retour aux exercices</button>

        <div style={{ background: '#18182A', border: '1px solid #2C2C44', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>
            {editEx ? 'Modifier l\'exercice' : 'Nouvel exercice'}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {inp('Nom de l\'exercice *', 'nom')}
            <select value={form.famille_id} onChange={e => setForm(f => ({ ...f, famille_id: e.target.value }))}
              style={{ width: '100%', background: '#212135', border: '1px solid #2C2C44', borderRadius: '8px', padding: '11px 14px', color: form.famille_id ? '#FFF' : '#555', fontSize: '14px', outline: 'none' }}>
              <option value="">Famille *</option>
              {familles.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
            </select>
            {inp('URL Vimeo (ex: https://vimeo.com/123456)', 'video_url')}
            {textarea('Description', 'description')}
            {textarea('Consignes d\'exécution', 'consignes_execution')}
            <MultiCheck
              label="Matériel"
              options={['Ab Wheel','Plyo Box','Slider','Step','Slam Ball','Foam Roller','Rings','Corde','Poids libres','Barre traction','Barre','Haltères','EZ Barre','Kettlebell','Medicine Ball','Disque','Sandbag','Trap Bar','Bike','Bosu','Corde à sauter','Traineau','Racks & Bancs','Banc','Chaise Romaine','Mini Band','Elastique','TRX','Cable Machine','Dip Station','Leg Press','Leg Curl','Coussin Proprio','Tapis de course','Tapis de sprint','Rameur','Wattbike','Air Bike','Ballon']}
              selected={form.materiel}
              onChange={vals => setForm(f => ({ ...f, materiel: vals }))}
            />
            <MultiCheck
              label="Zone musculaire"
              options={['Ischio-jambiers','Quadriceps','Mollets','Adducteurs','Abducteurs','Lombaires','Abdominaux','Épaules','Pectoraux','Dorsaux','Biceps','Triceps']}
              selected={form.zone_musculaire}
              onChange={vals => setForm(f => ({ ...f, zone_musculaire: vals }))}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                ['type_effort', 'Type d\'effort', ['Explosif','Endurance','Force max','Vitesse','Mobilité','Récupération','Appuis','Accélération','Décélération','COD','Pliométrie','Proprioception','Isométrie','Excentrique']],
                ['position', 'Position (optionnel)', ['Debout','Au sol','Assis','Avec ballon','À 4 pattes','En mouvement']],
              ].map(([key, label, options]) => (
                <select key={key as string} value={form[key as keyof typeof form] as string}
                  onChange={e => setForm(f => ({ ...f, [key as string]: e.target.value }))}
                  style={{ width: '100%', background: '#212135', border: '1px solid #2C2C44', borderRadius: '8px', padding: '11px 14px', color: form[key as keyof typeof form] ? '#FFF' : '#555', fontSize: '14px', outline: 'none' }}>
                  <option value="">{label as string}</option>
                  {(options as string[]).map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button onClick={() => setShowForm(false)} style={{
              flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #2C2C44',
              background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '14px',
            }}>Annuler</button>
            <button onClick={handleSave} disabled={saving} style={{
              flex: 2, padding: '12px', borderRadius: '10px', border: 'none',
              background: saving ? '#333' : '#1A6FFF', color: '#FFF',
              cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '14px',
            }}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
          </div>
        </div>
      </div>
    )
  }

  // === Vue liste ===
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800' }}>
          Exercices <span style={{ color: '#9898B8', fontSize: '16px', fontWeight: '400' }}>({affichés.length})</span>
        </h1>
        <button onClick={openAdd} style={{
          background: '#1A6FFF', color: '#FFF', padding: '12px 20px',
          borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px',
        }}>+ Nouvel exercice</button>
      </div>

      <input
        placeholder="Rechercher un exercice..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%', background: '#18182A', border: '1px solid #2C2C44',
          borderRadius: '10px', padding: '12px 16px', color: '#FFF', fontSize: '14px',
          outline: 'none', marginBottom: '16px',
        }}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
        {familles.map(f => {
          const actif = filtresFamille.includes(f.id)
          return (
            <button key={f.id} onClick={() => setFiltresFamille(prev =>
              actif ? prev.filter(id => id !== f.id) : [...prev, f.id]
            )} style={{
              padding: '6px 14px', borderRadius: '20px', border: `1px solid ${actif ? f.couleur : '#2C2C44'}`,
              background: actif ? f.couleur + '20' : 'transparent',
              color: actif ? f.couleur : '#666', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
            }}>
              {f.nom}
            </button>
          )
        })}
        {filtresFamille.length > 0 && (
          <button onClick={() => setFiltresFamille([])} style={{
            padding: '6px 14px', borderRadius: '20px', border: '1px solid #FF4757',
            background: 'transparent', color: '#FF4757', fontSize: '12px', cursor: 'pointer',
          }}>✕ Reset</button>
        )}
      </div>

      {affichés.length === 0 ? (
        <div style={{ background: '#18182A', border: '1px solid #2C2C44', borderRadius: '12px', padding: '24px', color: '#9898B8', fontSize: '14px' }}>
          Aucun exercice.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {affichés.map(ex => {
            const fam = ex.familles
            return (
              <div key={ex.id} style={{
                background: '#18182A', border: '1px solid #2C2C44', borderRadius: '12px',
                padding: '16px', cursor: 'pointer', transition: 'border-color 0.15s',
              }}
                onClick={() => setApercu(ex)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', flex: 1 }}>{ex.nom}</div>
                  {fam && (
                    <span style={{
                      padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
                      background: fam.couleur + '20', color: fam.couleur, whiteSpace: 'nowrap', marginLeft: '8px',
                    }}>{fam.nom}</span>
                  )}
                </div>
                {ex.description && (
                  <p style={{ color: '#A8A8C4', fontSize: '12px', lineHeight: '1.5',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>{ex.description}</p>
                )}
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  {ex.video_url && <span style={{ color: '#1A6FFF', fontSize: '11px' }}>▶ Vidéo</span>}
                  {ex.materiel && <span style={{ color: '#888', fontSize: '11px' }}>· {ex.materiel}</span>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
