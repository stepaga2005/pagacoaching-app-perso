'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Joueur, Groupe, GROUPE_COLORS } from '../lib/types'
import { ProfilJoueur } from './ProfilJoueur'

export function Joueurs() {
  const [joueurs, setJoueurs] = useState<Joueur[]>([])
  const [groupes, setGroupes] = useState<Groupe[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editJoueur, setEditJoueur] = useState<Joueur | null>(null)
  const [profilJoueur, setProfilJoueur] = useState<Joueur | null>(null)
  const [saving, setSaving] = useState(false)
  const [coachId, setCoachId] = useState<string | null>(null)
  const [filtreGroupeId, setFiltreGroupeId] = useState<string | null>(null)
  const [showGroupesModal, setShowGroupesModal] = useState(false)
  const [newGroupeNom, setNewGroupeNom] = useState('')
  const [newGroupeCouleur, setNewGroupeCouleur] = useState(GROUPE_COLORS[0])
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', password: '',
    poste: '', niveau: '', club: '',
    acces_debut: '', acces_fin: '',
    groupe_id: '',
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => { if (user) setCoachId(user.id) })
  }, [])

  useEffect(() => {
    loadJoueurs()
    loadGroupes()
  }, [])

  async function loadJoueurs() {
    const { data } = await supabase.from('joueurs').select('*').order('nom')
    if (data) setJoueurs([...data].sort((a, b) => a.nom.localeCompare(b.nom, 'fr')))
  }

  async function loadGroupes() {
    const { data, error } = await supabase.from('groupes').select('*').order('nom')
    if (error) console.error('loadGroupes error:', error.message)
    if (data) setGroupes(data)
  }

  async function createGroupe() {
    if (!newGroupeNom.trim()) return
    const { error } = await supabase.from('groupes').insert({ nom: newGroupeNom.trim(), couleur: newGroupeCouleur })
    if (error) { console.error('createGroupe error:', error.message); return }
    setNewGroupeNom('')
    setNewGroupeCouleur(GROUPE_COLORS[0])
    await loadGroupes()
  }

  async function deleteGroupe(id: string) {
    await supabase.from('joueurs').update({ groupe_id: null }).eq('groupe_id', id)
    await supabase.from('groupes').delete().eq('id', id)
    await loadGroupes()
    await loadJoueurs()
  }

  function openAdd() {
    setEditJoueur(null)
    setForm({ nom: '', prenom: '', email: '', password: '', poste: '', niveau: '', club: '', acces_debut: '', acces_fin: '', groupe_id: '' })
    setShowForm(true)
  }

  function openEdit(j: Joueur) {
    setEditJoueur(j)
    setForm({
      nom: j.nom, prenom: j.prenom, email: j.email, password: '',
      poste: j.poste || '', niveau: j.niveau || '', club: j.club || '',
      acces_debut: j.acces_debut || '', acces_fin: j.acces_fin || '',
      groupe_id: j.groupe_id || '',
    })
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    if (editJoueur) {
      await supabase.from('joueurs').update({
        nom: form.nom, prenom: form.prenom,
        poste: form.poste, niveau: form.niveau, club: form.club,
        acces_debut: form.acces_debut || null,
        acces_fin: form.acces_fin || null,
        groupe_id: form.groupe_id || null,
      }).eq('id', editJoueur.id)
    } else {
      const res = await fetch('/api/joueurs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, coach_id: coachId }),
      })
      if (!res.ok) {
        const err = await res.json()
        alert('Erreur : ' + err.error)
        setSaving(false)
        return
      }
      const result = await res.json()
      if (result.reactivated) {
        alert('Compte réactivé — les séances et données du joueur sont conservées.')
      }
    }
    await loadJoueurs()
    setShowForm(false)
    setSaving(false)
  }

  async function toggleActif(j: Joueur) {
    await supabase.from('joueurs').update({ actif: !j.actif }).eq('id', j.id)
    await loadJoueurs()
  }

  const input = (placeholder: string, key: keyof typeof form, type = 'text') => (
    <input
      type={type}
      placeholder={placeholder}
      value={form[key]}
      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
      style={{
        width: '100%', background: '#212135', border: '1px solid #2C2C44',
        borderRadius: '8px', padding: '12px 14px', color: '#FFF', fontSize: '14px', outline: 'none',
      }}
    />
  )

  if (profilJoueur) {
    return <ProfilJoueur joueur={profilJoueur} onBack={() => setProfilJoueur(null)} />
  }

  const joueursFiltres = filtreGroupeId ? joueurs.filter(j => j.groupe_id === filtreGroupeId) : joueurs

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Joueurs</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowGroupesModal(true)} style={{
            background: 'transparent', color: '#888', padding: '10px 16px',
            borderRadius: '10px', border: '1px solid #2C2C44', cursor: 'pointer', fontWeight: '600', fontSize: '13px',
          }}>🏷️ Groupes</button>
          <button onClick={openAdd} style={{
            background: '#1A6FFF', color: '#FFF', padding: '10px 18px',
            borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px',
          }}>+ Ajouter</button>
        </div>
      </div>

      {/* Modal groupes */}
      {showGroupesModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#18182A', border: '1px solid #2C2C44', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '420px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800' }}>Gérer les groupes</h2>
              <button onClick={() => setShowGroupesModal(false)} style={{ background: 'transparent', border: 'none', color: '#888', fontSize: '22px', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {groupes.length === 0 && (
                <div style={{ color: '#555', fontSize: '13px', textAlign: 'center', padding: '16px' }}>Aucun groupe créé</div>
              )}
              {groupes.map(g => (
                <div key={g.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#212135', borderRadius: '10px', padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: g.couleur, flexShrink: 0 }} />
                    <span style={{ fontWeight: '600', fontSize: '14px' }}>{g.nom}</span>
                    <span style={{ color: '#555', fontSize: '12px' }}>{joueurs.filter(j => j.groupe_id === g.id).length} joueur(s)</span>
                  </div>
                  <button onClick={() => deleteGroupe(g.id)} style={{ background: '#FF475710', border: '1px solid #FF475730', color: '#FF4757', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer' }}>
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #2C2C44', paddingTop: '20px' }}>
              <div style={{ color: '#888', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Nouveau groupe</div>
              <input
                placeholder="Nom du groupe..."
                value={newGroupeNom}
                onChange={e => setNewGroupeNom(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createGroupe()}
                style={{ width: '100%', background: '#212135', border: '1px solid #2C2C44', borderRadius: '8px', padding: '12px 14px', color: '#FFF', fontSize: '14px', outline: 'none', marginBottom: '12px', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {GROUPE_COLORS.map(c => (
                  <button key={c} onClick={() => setNewGroupeCouleur(c)} style={{
                    width: '30px', height: '30px', borderRadius: '50%', background: c, border: 'none',
                    cursor: 'pointer', outline: newGroupeCouleur === c ? `3px solid ${c}` : '3px solid transparent',
                    outlineOffset: '2px', transition: 'outline 0.15s',
                  }} />
                ))}
              </div>
              <button onClick={createGroupe} style={{
                width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
                background: newGroupeNom.trim() ? newGroupeCouleur : '#2C2C44',
                color: newGroupeNom.trim() ? '#FFF' : '#555',
                cursor: newGroupeNom.trim() ? 'pointer' : 'not-allowed', fontWeight: '700', fontSize: '14px',
              }}>
                Créer le groupe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal formulaire joueur */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500 }}>
          <div style={{ background: '#18182A', border: '1px solid #2C2C44', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>
              {editJoueur ? 'Modifier le joueur' : 'Ajouter un joueur'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {input('Prénom', 'prenom')}
                {input('Nom', 'nom')}
              </div>
              {input('Email', 'email', 'email')}
              {!editJoueur && input('Mot de passe', 'password', 'password')}
              {input('Poste (ex: Ailier droit)', 'poste')}
              {input('Niveau (ex: N2, CFA)', 'niveau')}
              {input('Club', 'club')}
              {groupes.length > 0 && (
                <div>
                  <label style={{ color: '#888', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Groupe</label>
                  <select
                    value={form.groupe_id}
                    onChange={e => setForm(f => ({ ...f, groupe_id: e.target.value }))}
                    style={{ width: '100%', background: '#212135', border: '1px solid #2C2C44', borderRadius: '8px', padding: '12px 14px', color: form.groupe_id ? '#FFF' : '#666', fontSize: '14px', outline: 'none' }}
                  >
                    <option value="">— Aucun groupe —</option>
                    {groupes.map(g => (
                      <option key={g.id} value={g.id}>{g.nom}</option>
                    ))}
                  </select>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                <div>
                  <label style={{ color: '#888', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Accès début</label>
                  {input('', 'acces_debut', 'date')}
                </div>
                <div>
                  <label style={{ color: '#888', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Accès fin</label>
                  {input('', 'acces_fin', 'date')}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #2C2C44', background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '14px' }}>
                Annuler
              </button>
              <button onClick={handleSave} disabled={saving} style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: saving ? '#333' : '#1A6FFF', color: '#FFF', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '14px' }}>
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtres par groupe */}
      {groupes.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button onClick={() => setFiltreGroupeId(null)} style={{
            padding: '7px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer',
            background: filtreGroupeId === null ? '#1A6FFF' : '#212135',
            color: filtreGroupeId === null ? '#FFF' : '#888', fontSize: '13px', fontWeight: '600',
          }}>Tous ({joueurs.length})</button>
          {groupes.map(g => (
            <button key={g.id} onClick={() => setFiltreGroupeId(g.id)} style={{
              padding: '7px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
              border: `1px solid ${filtreGroupeId === g.id ? g.couleur : 'transparent'}`,
              background: filtreGroupeId === g.id ? g.couleur + '25' : '#212135',
              color: filtreGroupeId === g.id ? g.couleur : '#888',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: g.couleur, display: 'inline-block', flexShrink: 0 }} />
              {g.nom} ({joueurs.filter(j => j.groupe_id === g.id).length})
            </button>
          ))}
        </div>
      )}

      {/* Liste joueurs */}
      {joueursFiltres.length === 0 ? (
        <div style={{ background: '#18182A', border: '1px solid #2C2C44', borderRadius: '12px', padding: '24px', color: '#555', fontSize: '14px' }}>
          Aucun joueur pour l'instant.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {joueursFiltres.map(j => {
            const groupe = groupes.find(g => g.id === j.groupe_id)
            return (
              <div key={j.id} onClick={() => setProfilJoueur(j)} style={{
                background: '#18182A', border: '1px solid #2C2C44', borderRadius: '12px',
                display: 'flex', alignItems: 'stretch', overflow: 'hidden',
                cursor: 'pointer', transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#3A3A3A')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#2C2C44')}
              >
                <div style={{ width: '4px', flexShrink: 0, background: groupe ? groupe.couleur : 'transparent', borderRadius: '12px 0 0 12px' }} />
                <div style={{ flex: 1, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                      background: groupe ? groupe.couleur + '20' : (j.actif ? '#1A6FFF20' : '#33333350'),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: groupe ? groupe.couleur : (j.actif ? '#1A6FFF' : '#555'),
                      fontWeight: '700', fontSize: '14px',
                    }}>
                      {j.prenom[0]}{j.nom[0]}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: '700', fontSize: '15px' }}>{j.prenom} {j.nom}</div>
                      <div style={{ color: '#888', fontSize: '12px', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {j.poste && `${j.poste} · `}{j.club && `${j.club} · `}{j.email}
                      </div>
                      {j.acces_fin && (
                        <div style={{ color: '#C9A84C', fontSize: '11px', marginTop: '2px' }}>
                          Accès jusqu'au {new Date(j.acces_fin).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: '12px' }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => toggleActif(j)} style={{
                      padding: '5px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                      background: j.actif ? '#2ECC7120' : '#FF475720',
                      color: j.actif ? '#2ECC71' : '#FF4757', fontSize: '11px', fontWeight: '600',
                    }}>{j.actif ? 'Actif' : 'Suspendu'}</button>
                    <button onClick={() => openEdit(j)} style={{
                      padding: '5px 12px', borderRadius: '8px', border: '1px solid #2C2C44',
                      background: 'transparent', color: '#888', fontSize: '11px', cursor: 'pointer',
                    }}>Modifier</button>
                    <span style={{ color: '#444', fontSize: '12px' }}>→</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
