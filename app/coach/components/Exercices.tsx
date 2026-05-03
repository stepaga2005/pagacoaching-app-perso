'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Exercice, Famille } from '../lib/types'
import { getYoutubeId, getVimeoId } from '../lib/utils'
import { toast } from '../lib/toast'
import { MultiCheck } from './shared/MultiCheck'
import { VideoThumb } from './shared/VideoThumb'

const PAGE = 60
const TC_URL_PATTERN = '%/storage/v1/object/public/videos/tc/%'
const TC_ZONES = ['Pectoraux', 'Dos', 'Biceps', 'Triceps', 'Abdominaux', 'Lombaires', 'Quadriceps', 'Ischios', 'Fessiers', 'Mollets']

export function Exercices() {
  const [exercices, setExercices] = useState<Exercice[]>([])
  const [familles, setFamilles] = useState<Famille[]>([])
  const [famillesCount, setFamillesCount] = useState<Record<string, number>>({})
  const [showForm, setShowForm] = useState(false)
  const [editEx, setEditEx] = useState<Exercice | null>(null)
  const [filtresFamille, setFiltresFamille] = useState<string[]>([])
  const [filtresZone, setFiltresZone] = useState<string[]>([])
  const [zonesCount, setZonesCount] = useState<Record<string, number>>({})
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sourceTab, setSourceTab] = useState<'mes' | 'tc'>('mes')
  const [apercu, setApercu] = useState<Exercice | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const scrollRef = useRef(0)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [form, setForm] = useState({
    nom: '', famille_id: '', description: '', consignes_execution: '',
    video_url: '', materiel: [] as string[], zone_musculaire: [] as string[], type_effort: '', position: '',
  })

  // Charge les familles une seule fois
  useEffect(() => {
    supabase.from('familles').select('*').order('nom').then(({ data }) => {
      if (data) setFamilles([...data].sort((a, b) => a.nom.localeCompare(b.nom, 'fr')))
    })
  }, [])

  // Compte les exercices par famille et par zone pour l'onglet actif
  useEffect(() => {
    if (sourceTab === 'tc') {
      supabase.from('exercices').select('famille_id, zone_musculaire').ilike('video_url', TC_URL_PATTERN).then(({ data }) => {
        if (!data) return
        const fCounts: Record<string, number> = {}
        const zCounts: Record<string, number> = {}
        data.forEach(e => {
          if (e.famille_id) fCounts[e.famille_id] = (fCounts[e.famille_id] || 0) + 1
          e.zone_musculaire?.forEach((z: string) => { zCounts[z] = (zCounts[z] || 0) + 1 })
        })
        setFamillesCount(fCounts)
        setZonesCount(zCounts)
      })
    } else {
      supabase.from('exercices').select('famille_id').or(`video_url.is.null,video_url.not.ilike.${TC_URL_PATTERN}`).then(({ data }) => {
        if (!data) return
        const counts: Record<string, number> = {}
        data.forEach(e => { if (e.famille_id) counts[e.famille_id] = (counts[e.famille_id] || 0) + 1 })
        setFamillesCount(counts)
        setZonesCount({})
      })
    }
  }, [sourceTab])

  // Recharge quand les filtres changent
  useEffect(() => {
    setOffset(0)
    setExercices([])
    loadExercices(0, true)
  }, [sourceTab, filtresFamille, filtresZone, search])

  const loadExercices = useCallback(async (off: number, reset = false) => {
    setLoading(true)
    let q = supabase
      .from('exercices')
      .select('*, familles(nom, couleur)')
      .order('nom')
      .range(off, off + PAGE - 1)

    // Filtre source au niveau DB
    if (sourceTab === 'tc') {
      q = q.ilike('video_url', TC_URL_PATTERN)
    } else {
      // Exclut les exercices TC (url supabase storage), garde les null et les autres urls
      q = q.or(`video_url.is.null,video_url.not.ilike.${TC_URL_PATTERN}`)
    }

    // Filtre famille
    if (filtresFamille.length > 0) {
      q = q.in('famille_id', filtresFamille)
    }

    // Filtre zone musculaire (TC uniquement)
    if (filtresZone.length > 0) {
      q = q.overlaps('zone_musculaire', filtresZone)
    }

    // Filtre recherche
    if (search.trim()) {
      q = q.ilike('nom', `%${search.trim()}%`)
    }

    const { data } = await q
    if (data) {
      setExercices(prev => reset ? data : [...prev, ...data])
      setHasMore(data.length === PAGE)
      setOffset(off + data.length)
    }
    setLoading(false)
  }, [sourceTab, filtresFamille, filtresZone, search])

  function handleSearchInput(val: string) {
    setSearchInput(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setSearch(val), 350)
  }

  function openAdd() {
    scrollRef.current = window.scrollY
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

  function closeForm() {
    setShowForm(false)
    requestAnimationFrame(() => window.scrollTo({ top: scrollRef.current, behavior: 'instant' }))
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
    setOffset(0); setExercices([]); loadExercices(0, true)
    closeForm()
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cet exercice ?')) return
    await supabase.from('exercices').delete().eq('id', id)
    setOffset(0); setExercices([]); loadExercices(0, true)
  }

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
        <button onClick={() => { setApercu(null); requestAnimationFrame(() => window.scrollTo({ top: scrollRef.current, behavior: 'instant' })) }} style={{
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
              <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', background: '#000', aspectRatio: '16/9' }}>
                <video src={apercu.video_url!} controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
        <button onClick={closeForm} style={{
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
            <button onClick={closeForm} style={{
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
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'linear-gradient(to bottom, #0A0A14 85%, transparent)',
        paddingBottom: '12px', marginBottom: '12px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Exercices</h1>
        {sourceTab === 'mes' && (
          <button onClick={openAdd} style={{
            background: '#1A6FFF', color: '#FFF', padding: '12px 20px',
            borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px',
          }}>+ Nouvel exercice</button>
        )}
      </div>

      {/* Onglets source */}
      <div style={{ display: 'flex', marginBottom: '16px', background: '#18182A', borderRadius: '10px', border: '1px solid #2C2C44', padding: '4px' }}>
        {(['mes', 'TotalCoaching'] as const).map((tab, i) => {
          const id = i === 0 ? 'mes' : 'tc'
          const active = sourceTab === id
          return (
            <button key={id} onClick={() => { setSourceTab(id as 'mes' | 'tc'); setFiltresFamille([]); setFiltresZone([]); setSearchInput(''); setSearch('') }} style={{
              flex: 1, padding: '9px 12px', borderRadius: '7px', border: 'none',
              background: active ? (id === 'tc' ? '#2962FF' : '#2C2C44') : 'transparent',
              color: active ? '#FFF' : '#666',
              fontSize: '13px', fontWeight: active ? '700' : '400', cursor: 'pointer',
              transition: 'all 0.15s',
            }}>{tab === 'mes' ? 'Mes exercices' : 'TotalCoaching'}</button>
          )
        })}
      </div>

      <input
        placeholder="Rechercher un exercice..."
        value={searchInput}
        onChange={e => handleSearchInput(e.target.value)}
        style={{
          width: '100%', background: '#18182A', border: '1px solid #2C2C44',
          borderRadius: '10px', padding: '12px 16px', color: '#FFF', fontSize: '14px',
          outline: 'none', marginBottom: '16px',
        }}
      />

      {/* Filtres famille */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: sourceTab === 'tc' ? '10px' : '24px' }}>
        {familles.filter(f => (famillesCount[f.id] || 0) > 0).map(f => {
          const actif = filtresFamille.includes(f.id)
          const count = famillesCount[f.id] || 0
          return (
            <button key={f.id} onClick={() => setFiltresFamille(prev =>
              actif ? prev.filter(id => id !== f.id) : [...prev, f.id]
            )} style={{
              padding: '6px 14px', borderRadius: '20px', border: `1px solid ${actif ? f.couleur : '#2C2C44'}`,
              background: actif ? f.couleur + '20' : 'transparent',
              color: actif ? f.couleur : '#666', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              {f.nom}
              <span style={{ fontSize: '10px', opacity: 0.7 }}>{count}</span>
            </button>
          )
        })}
        {filtresFamille.length > 0 && (
          <button onClick={() => setFiltresFamille([])} style={{
            padding: '6px 14px', borderRadius: '20px', border: '1px solid #FF4757',
            background: 'transparent', color: '#FF4757', fontSize: '12px', cursor: 'pointer',
          }}>✕</button>
        )}
      </div>

      {/* Filtres zone musculaire (TC uniquement) */}
      {sourceTab === 'tc' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
          {TC_ZONES.filter(z => (zonesCount[z] || 0) > 0).map(z => {
            const actif = filtresZone.includes(z)
            const count = zonesCount[z] || 0
            return (
              <button key={z} onClick={() => setFiltresZone(prev =>
                actif ? prev.filter(x => x !== z) : [...prev, z]
              )} style={{
                padding: '5px 12px', borderRadius: '20px',
                border: `1px solid ${actif ? '#B89968' : '#2C2C44'}`,
                background: actif ? '#B8996820' : 'transparent',
                color: actif ? '#B89968' : '#666', fontSize: '11px', fontWeight: '600', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '5px',
              }}>
                {z}
                <span style={{ fontSize: '9px', opacity: 0.7 }}>{count}</span>
              </button>
            )
          })}
          {filtresZone.length > 0 && (
            <button onClick={() => setFiltresZone([])} style={{
              padding: '5px 12px', borderRadius: '20px', border: '1px solid #FF4757',
              background: 'transparent', color: '#FF4757', fontSize: '11px', cursor: 'pointer',
            }}>✕</button>
          )}
        </div>
      )}

      {loading && exercices.length === 0 ? (
        <div style={{ color: '#9898B8', fontSize: '14px', padding: '24px', textAlign: 'center' }}>Chargement...</div>
      ) : exercices.length === 0 ? (
        <div style={{ background: '#18182A', border: '1px solid #2C2C44', borderRadius: '12px', padding: '24px', color: '#9898B8', fontSize: '14px' }}>
          Aucun exercice.
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {exercices.map(ex => {
              const fam = ex.familles
              return (
                <div key={ex.id} style={{
                  background: '#18182A', border: '1px solid #2C2C44', borderRadius: '12px',
                  cursor: 'pointer', transition: 'border-color 0.15s', overflow: 'hidden',
                }}
                  onClick={() => { scrollRef.current = window.scrollY; setApercu(ex) }}
                >
                  <VideoThumb url={ex.video_url} famille={fam} fullWidth />
                  <div style={{ padding: '10px 14px 12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <div style={{ fontWeight: '700', fontSize: '13px', flex: 1 }}>{ex.nom}</div>
                      {fam && (
                        <span style={{
                          padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '600',
                          background: fam.couleur + '20', color: fam.couleur, whiteSpace: 'nowrap', marginLeft: '8px', flexShrink: 0,
                        }}>{fam.nom}</span>
                      )}
                    </div>
                    {ex.description && (
                      <p style={{ color: '#A8A8C4', fontSize: '11px', lineHeight: '1.4', margin: 0,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>{ex.description}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {hasMore && (
            <button
              onClick={() => loadExercices(offset)}
              disabled={loading}
              style={{
                display: 'block', width: '100%', marginTop: '20px', padding: '14px',
                borderRadius: '10px', border: '1px solid #2C2C44',
                background: 'transparent', color: loading ? '#555' : '#9898B8',
                fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >{loading ? 'Chargement...' : `Charger plus (${exercices.length} affichés)`}</button>
          )}
        </>
      )}
    </div>
  )
}
