'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { subscribePush, sendPush } from '@/lib/push'
import { useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'joueurs', label: 'Joueurs', icon: '👥' },
  { id: 'exercices', label: 'Exercices', icon: '⚡' },
  { id: 'programmes', label: 'Programmes', icon: '📋' },
  { id: 'messages', label: 'Messages', icon: '💬' },
]

export default function CoachPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [coachId, setCoachId] = useState<string | null>(null)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
      } else {
        setLoading(false)
        setCoachId(session.user.id)
      }
    })
  }, [router])

  useEffect(() => {
    if (!coachId) return
    loadUnread(coachId)
    const interval = setInterval(() => loadUnread(coachId), 3000)
    return () => clearInterval(interval)
  }, [coachId])

  async function loadUnread(cId: string) {
    const { count } = await supabase.from('messages').select('*', { count: 'exact', head: true })
      .eq('destinataire_id', cId).neq('lu', true)
    setUnreadMessages(count || 0)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#1A6FFF', fontSize: '14px', letterSpacing: '2px' }}>CHARGEMENT...</div>
    </div>
  )

  function navTo(id: string) {
    setActiveTab(id)
    if (id === 'messages') setUnreadMessages(0)
    setSidebarOpen(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex' }}>

      {/* Backdrop mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            zIndex: 40, display: 'block',
          }}
        />
      )}

      {/* Sidebar */}
      <div style={{
        width: '220px',
        background: '#111',
        borderRight: '1px solid #2A2A2A',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        position: 'fixed',
        height: '100vh',
        zIndex: 50,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease',
      }}>
        <div style={{ marginBottom: '40px', paddingLeft: '8px' }}>
          <div style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '-0.5px' }}>
            <span style={{ color: '#FFF' }}>PAGA</span>
            <span style={{ color: '#1A6FFF' }}>COACHING</span>
          </div>
          <div style={{ width: '24px', height: '2px', background: '#C9A84C', marginTop: '6px', borderRadius: '1px' }} />
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => navTo(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 12px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                background: activeTab === item.id ? '#1A6FFF20' : 'transparent',
                color: activeTab === item.id ? '#1A6FFF' : '#888',
                fontSize: '14px',
                fontWeight: activeTab === item.id ? '600' : '400',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <span>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.id === 'messages' && unreadMessages > 0 && (
                <span style={{ background: '#FF4757', color: '#FFF', borderRadius: '10px', fontSize: '10px', fontWeight: '800', padding: '2px 7px', lineHeight: 1.4 }}>{unreadMessages}</span>
              )}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          style={{
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid #2A2A2A',
            background: 'transparent',
            color: '#888',
            fontSize: '14px',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span>🚪</span> Déconnexion
        </button>
      </div>

      {/* Contenu principal */}
      <div style={{ flex: 1, padding: '20px 20px 32px' }}>
        {/* Barre top avec hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: '#111', border: '1px solid #2A2A2A', borderRadius: '10px',
              padding: '10px 12px', cursor: 'pointer', display: 'flex', flexDirection: 'column',
              gap: '5px', flexShrink: 0,
            }}
          >
            <span style={{ display: 'block', width: '20px', height: '2px', background: '#FFF', borderRadius: '1px' }} />
            <span style={{ display: 'block', width: '20px', height: '2px', background: '#FFF', borderRadius: '1px' }} />
            <span style={{ display: 'block', width: '20px', height: '2px', background: '#FFF', borderRadius: '1px' }} />
          </button>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#FFF' }}>
            {NAV_ITEMS.find(n => n.id === activeTab)?.icon} {NAV_ITEMS.find(n => n.id === activeTab)?.label}
          </div>
        </div>

        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'joueurs' && <Joueurs />}
        {activeTab === 'exercices' && <Exercices />}
        {activeTab === 'programmes' && <Programmes />}
        {activeTab === 'messages' && <Messages coachId={coachId} onUnreadChange={setUnreadMessages} />}
      </div>
    </div>
  )
}

function Dashboard() {
  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Bonjour Stéphane 👋</h1>
      <p style={{ color: '#888', marginBottom: '32px' }}>Voici l'activité de tes joueurs aujourd'hui</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Joueurs actifs', value: '0', color: '#1A6FFF' },
          { label: 'Séances du jour', value: '0', color: '#C9A84C' },
          { label: 'Séances complétées', value: '0', color: '#2ECC71' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#111',
            border: '1px solid #2A2A2A',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <div style={{ fontSize: '36px', fontWeight: '900', color: stat.color }}>{stat.value}</div>
            <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: '#111',
        border: '1px solid #2A2A2A',
        borderRadius: '12px',
        padding: '24px',
      }}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#C9A84C' }}>
          Activité joueurs — Aujourd'hui
        </h2>
        <p style={{ color: '#555', fontSize: '14px' }}>Aucun joueur ajouté pour l'instant.</p>
      </div>
    </div>
  )
}

type Joueur = {
  id: string
  nom: string
  prenom: string
  email: string
  poste: string
  niveau: string
  club: string
  actif: boolean
  acces_debut: string
  acces_fin: string
}

function Joueurs() {
  const [joueurs, setJoueurs] = useState<Joueur[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editJoueur, setEditJoueur] = useState<Joueur | null>(null)
  const [profilJoueur, setProfilJoueur] = useState<Joueur | null>(null)
  const [saving, setSaving] = useState(false)
  const [coachId, setCoachId] = useState<string | null>(null)
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', password: '',
    poste: '', niveau: '', club: '',
    acces_debut: '', acces_fin: '',
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => { if (user) setCoachId(user.id) })
  }, [])

  useEffect(() => {
    loadJoueurs()
  }, [])

  async function loadJoueurs() {
    const { data } = await supabase.from('joueurs').select('*').order('nom')
    if (data) setJoueurs(data)
  }

  function openAdd() {
    setEditJoueur(null)
    setForm({ nom: '', prenom: '', email: '', password: '', poste: '', niveau: '', club: '', acces_debut: '', acces_fin: '' })
    setShowForm(true)
  }

  function openEdit(j: Joueur) {
    setEditJoueur(j)
    setForm({
      nom: j.nom, prenom: j.prenom, email: j.email, password: '',
      poste: j.poste || '', niveau: j.niveau || '', club: j.club || '',
      acces_debut: j.acces_debut || '', acces_fin: j.acces_fin || '',
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
      }).eq('id', editJoueur.id)
    } else {
      // Crée le compte auth Supabase
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
        width: '100%', background: '#1A1A1A', border: '1px solid #2A2A2A',
        borderRadius: '8px', padding: '12px 14px', color: '#FFF', fontSize: '14px', outline: 'none',
      }}
    />
  )

  if (profilJoueur) {
    return <ProfilJoueur joueur={profilJoueur} onBack={() => setProfilJoueur(null)} />
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Joueurs</h1>
        <button onClick={openAdd} style={{
          background: '#1A6FFF', color: '#FFF', padding: '12px 20px',
          borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px',
        }}>
          + Ajouter un joueur
        </button>
      </div>

      {/* Modal formulaire */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }}>
          <div style={{
            background: '#111', border: '1px solid #2A2A2A', borderRadius: '16px',
            padding: '32px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto',
          }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                <div>
                  <label style={{ color: '#888', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Accès début
                  </label>
                  {input('', 'acces_debut', 'date')}
                </div>
                <div>
                  <label style={{ color: '#888', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Accès fin
                  </label>
                  {input('', 'acces_fin', 'date')}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => setShowForm(false)} style={{
                flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #2A2A2A',
                background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '14px',
              }}>
                Annuler
              </button>
              <button onClick={handleSave} disabled={saving} style={{
                flex: 2, padding: '12px', borderRadius: '10px', border: 'none',
                background: saving ? '#333' : '#1A6FFF', color: '#FFF',
                cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '14px',
              }}>
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste joueurs */}
      {joueurs.length === 0 ? (
        <div style={{ background: '#111', border: '1px solid #2A2A2A', borderRadius: '12px', padding: '24px', color: '#555', fontSize: '14px' }}>
          Aucun joueur pour l'instant.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {joueurs.map(j => (
            <div key={j.id} onClick={() => setProfilJoueur(j)} style={{
              background: '#111', border: '1px solid #2A2A2A', borderRadius: '12px',
              padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer', transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#3A3A3A')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#2A2A2A')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: j.actif ? '#1A6FFF20' : '#33333350',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: j.actif ? '#1A6FFF' : '#555', fontWeight: '700', fontSize: '14px',
                }}>
                  {j.prenom[0]}{j.nom[0]}
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '15px' }}>{j.prenom} {j.nom}</div>
                  <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>
                    {j.poste && `${j.poste} · `}{j.club && `${j.club} · `}{j.email}
                  </div>
                  {j.acces_fin && (
                    <div style={{ color: '#C9A84C', fontSize: '11px', marginTop: '2px' }}>
                      Accès jusqu'au {new Date(j.acces_fin).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} onClick={e => e.stopPropagation()}>
                <button onClick={() => toggleActif(j)} style={{
                  padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                  background: j.actif ? '#2ECC7120' : '#FF475720',
                  color: j.actif ? '#2ECC71' : '#FF4757', fontSize: '12px', fontWeight: '600',
                }}>{j.actif ? 'Actif' : 'Suspendu'}</button>
                <button onClick={() => openEdit(j)} style={{
                  padding: '6px 14px', borderRadius: '8px', border: '1px solid #2A2A2A',
                  background: 'transparent', color: '#888', fontSize: '12px', cursor: 'pointer',
                }}>Modifier</button>
                <span style={{ color: '#444', fontSize: '12px' }}>→</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

type Famille = { id: string; nom: string; couleur: string }
type Exercice = {
  id: string; nom: string; famille_id: string;
  description: string; consignes_execution: string; video_url: string;
  materiel: string[]; zone_musculaire: string[]; type_effort: string; position: string;
  familles?: Famille
}

function Exercices() {
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

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const [{ data: exs }, { data: fams }] = await Promise.all([
      supabase.from('exercices').select('*, familles(nom, couleur)').order('nom'),
      supabase.from('familles').select('*').order('nom'),
    ])
    if (exs) setExercices(exs)
    if (fams) setFamilles(fams)
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
    if (!form.nom || !form.famille_id) { alert('Nom et famille obligatoires'); return }
    setSaving(true)
    const payload = { ...form, famille_id: form.famille_id }
    if (editEx) {
      await supabase.from('exercices').update(payload).eq('id', editEx.id)
    } else {
      await supabase.from('exercices').insert(payload)
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
  const affichés = filtres.filter(e => e.nom.toLowerCase().includes(search.toLowerCase()))

  const inp = (placeholder: string, key: keyof typeof form, type = 'text') => (
    <input type={type} placeholder={placeholder} value={form[key]}
      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
      style={{ width: '100%', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '11px 14px', color: '#FFF', fontSize: '14px', outline: 'none' }}
    />
  )

  const textarea = (placeholder: string, key: keyof typeof form) => (
    <textarea placeholder={placeholder} value={form[key]}
      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
      rows={3}
      style={{ width: '100%', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '11px 14px', color: '#FFF', fontSize: '14px', outline: 'none', resize: 'vertical' }}
    />
  )

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800' }}>
          Exercices <span style={{ color: '#555', fontSize: '16px', fontWeight: '400' }}>({affichés.length})</span>
        </h1>
        <button onClick={openAdd} style={{
          background: '#1A6FFF', color: '#FFF', padding: '12px 20px',
          borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px',
        }}>+ Nouvel exercice</button>
      </div>

      {/* Recherche */}
      <input
        placeholder="Rechercher un exercice..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%', background: '#111', border: '1px solid #2A2A2A',
          borderRadius: '10px', padding: '12px 16px', color: '#FFF', fontSize: '14px',
          outline: 'none', marginBottom: '16px',
        }}
      />

      {/* Filtres familles */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
        {familles.map(f => {
          const actif = filtresFamille.includes(f.id)
          return (
            <button key={f.id} onClick={() => setFiltresFamille(prev =>
              actif ? prev.filter(id => id !== f.id) : [...prev, f.id]
            )} style={{
              padding: '6px 14px', borderRadius: '20px', border: `1px solid ${actif ? f.couleur : '#2A2A2A'}`,
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

      {/* Liste */}
      {affichés.length === 0 ? (
        <div style={{ background: '#111', border: '1px solid #2A2A2A', borderRadius: '12px', padding: '24px', color: '#555', fontSize: '14px' }}>
          Aucun exercice.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {affichés.map(ex => {
            const fam = ex.familles
            return (
              <div key={ex.id} style={{
                background: '#111', border: '1px solid #2A2A2A', borderRadius: '12px',
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
                  <p style={{ color: '#666', fontSize: '12px', lineHeight: '1.5',
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

      {/* Aperçu */}
      {apercu && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }} onClick={() => setApercu(null)}>
          <div style={{
            background: '#111', border: '1px solid #2A2A2A', borderRadius: '16px',
            padding: '32px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
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
                <button onClick={() => { setApercu(null); openEdit(apercu) }} style={{
                  padding: '8px 14px', borderRadius: '8px', border: '1px solid #2A2A2A',
                  background: 'transparent', color: '#888', fontSize: '12px', cursor: 'pointer',
                }}>Modifier</button>
                <button onClick={() => { handleDelete(apercu.id); setApercu(null) }} style={{
                  padding: '8px 14px', borderRadius: '8px', border: '1px solid #FF4757',
                  background: 'transparent', color: '#FF4757', fontSize: '12px', cursor: 'pointer',
                }}>Supprimer</button>
              </div>
            </div>

            {apercu.video_url && (
              <div style={{ marginBottom: '20px', borderRadius: '10px', overflow: 'hidden', background: '#000', aspectRatio: '16/9' }}>
                <iframe
                  src={apercu.video_url.replace('vimeo.com/', 'player.vimeo.com/video/')}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="fullscreen"
                />
              </div>
            )}

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

            <button onClick={() => setApercu(null)} style={{
              marginTop: '24px', width: '100%', padding: '12px', borderRadius: '10px',
              border: '1px solid #2A2A2A', background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '14px',
            }}>Fermer</button>
          </div>
        </div>
      )}

      {/* Formulaire */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }}>
          <div style={{
            background: '#111', border: '1px solid #2A2A2A', borderRadius: '16px',
            padding: '32px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>
              {editEx ? 'Modifier l\'exercice' : 'Nouvel exercice'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {inp('Nom de l\'exercice *', 'nom')}

              <select value={form.famille_id} onChange={e => setForm(f => ({ ...f, famille_id: e.target.value }))}
                style={{ width: '100%', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '11px 14px', color: form.famille_id ? '#FFF' : '#555', fontSize: '14px', outline: 'none' }}>
                <option value="">Famille *</option>
                {familles.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
              </select>

              {inp('URL Vimeo (ex: https://vimeo.com/123456)', 'video_url')}
              {textarea('Description', 'description')}
              {textarea('Consignes d\'exécution', 'consignes_execution')}

              {/* Matériel — multi-select */}
              <MultiCheck
                label="Matériel"
                options={['Ab Wheel','Plyo Box','Slider','Step','Slam Ball','Foam Roller','Rings','Corde','Poids libres','Barre traction','Barre','Haltères','EZ Barre','Kettlebell','Medicine Ball','Disque','Sandbag','Trap Bar','Bike','Bosu','Corde à sauter','Traineau','Racks & Bancs','Banc','Chaise Romaine','Mini Band','Elastique','TRX','Cable Machine','Dip Station','Leg Press','Leg Curl','Coussin Proprio','Tapis de course','Tapis de sprint','Rameur','Wattbike','Air Bike','Ballon']}
                selected={form.materiel}
                onChange={vals => setForm(f => ({ ...f, materiel: vals }))}
              />

              {/* Zone musculaire — multi-select */}
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
                    style={{ width: '100%', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '11px 14px', color: form[key as keyof typeof form] ? '#FFF' : '#555', fontSize: '14px', outline: 'none' }}>
                    <option value="">{label as string}</option>
                    {(options as string[]).map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => setShowForm(false)} style={{
                flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #2A2A2A',
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
      )}
    </div>
  )
}

type SeanceExercice = {
  id?: string
  exercice_id: string
  ordre: number
  series?: number
  repetitions?: number
  duree_secondes?: number
  distance_metres?: number
  charge_kg?: number
  recuperation_secondes?: number
  recuperation_inter_sets?: number
  recuperation_active?: boolean
  lien_suivant?: boolean
  uni_podal?: boolean
  notes?: string
  exercices?: { nom: string; familles?: { nom: string; couleur: string } }
}

type Seance = {
  id: string
  nom: string
  type: string
  notes?: string
  est_template: boolean
  seance_exercices?: SeanceExercice[]
}

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const TYPES_SEANCE = ['complete', 'echauffement', 'corps', 'retour_au_calme']
const LABELS_TYPE: Record<string, string> = {
  complete: 'Complète', echauffement: 'Échauffement',
  corps: 'Corps de séance', retour_au_calme: 'Retour au calme',
}

function Programmes() {
  const [vue, setVue] = useState<'templates' | 'editeur'>('templates')
  const [templates, setTemplates] = useState<Seance[]>([])
  const [seanceEdit, setSeanceEdit] = useState<Seance | null>(null)
  const [exercices, setExercices] = useState<Exercice[]>([])
  const [selection, setSelection] = useState<Set<string>>(new Set())
  const [showAttrib, setShowAttrib] = useState(false)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const [{ data: seances }, { data: exs }] = await Promise.all([
      supabase.from('seances').select('*, seance_exercices(*, exercices(nom, familles(nom, couleur)))').eq('est_template', true).order('nom'),
      supabase.from('exercices').select('*, familles(nom, couleur)').order('nom'),
    ])
    if (seances) setTemplates(seances)
    if (exs) setExercices(exs)
  }

  function toggleSelect(id: string) {
    setSelection(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  function nouvelleSeance() {
    setSeanceEdit({ id: '', nom: '', type: 'complete', notes: '', est_template: true, seance_exercices: [] })
    setVue('editeur')
  }

  function editSeance(s: Seance) {
    setSeanceEdit({ ...s, seance_exercices: s.seance_exercices || [] })
    setVue('editeur')
  }

  async function deleteSeance(id: string) {
    if (!confirm('Supprimer cette séance ?')) return
    await supabase.from('seances').delete().eq('id', id)
    await loadData()
  }

  if (vue === 'editeur' && seanceEdit) {
    return <EditeurSeance
      seance={seanceEdit}
      exercices={exercices}
      onSave={async () => { await loadData(); setVue('templates') }}
      onCancel={() => setVue('templates')}

    />
  }

  const seancesSelectionnees = templates.filter(s => selection.has(s.id))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800' }}>
          Séances templates <span style={{ color: '#555', fontSize: '16px', fontWeight: '400' }}>({templates.length})</span>
        </h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {selection.size > 0 && (
            <button onClick={() => setShowAttrib(true)} style={{
              background: '#2ECC71', color: '#FFF', padding: '12px 20px',
              borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '14px',
            }}>
              Attribuer ({selection.size}) →
            </button>
          )}
          {selection.size > 0 && (
            <button onClick={() => setSelection(new Set())} style={{
              background: 'transparent', color: '#555', padding: '12px 14px',
              borderRadius: '10px', border: '1px solid #2A2A2A', cursor: 'pointer', fontSize: '13px',
            }}>Tout déselectionner</button>
          )}
          <button onClick={nouvelleSeance} style={{
            background: '#1A6FFF', color: '#FFF', padding: '12px 20px',
            borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px',
          }}>+ Nouvelle séance</button>
        </div>
      </div>

      {selection.size > 0 && (
        <div style={{ background: '#2ECC7110', border: '1px solid #2ECC7130', borderRadius: '10px', padding: '10px 16px', marginBottom: '16px', fontSize: '13px', color: '#2ECC71' }}>
          {selection.size} séance{selection.size > 1 ? 's' : ''} sélectionnée{selection.size > 1 ? 's' : ''} — clique sur "Attribuer" pour les assigner à un joueur
        </div>
      )}

      {templates.length === 0 ? (
        <div style={{ background: '#111', border: '1px solid #2A2A2A', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
          <p style={{ color: '#555', fontSize: '14px', marginBottom: '16px' }}>Aucune séance template.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {templates.map(s => {
            const selected = selection.has(s.id)
            return (
              <div key={s.id} style={{
                background: selected ? '#2ECC7108' : '#111',
                border: `1px solid ${selected ? '#2ECC7150' : '#2A2A2A'}`,
                borderRadius: '12px', padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: '14px',
              }}>
                {/* Checkbox */}
                <button onClick={() => toggleSelect(s.id)} style={{
                  width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                  border: `2px solid ${selected ? '#2ECC71' : '#333'}`,
                  background: selected ? '#2ECC71' : 'transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', color: '#FFF',
                }}>{selected ? '✓' : ''}</button>

                <span style={{
                  padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700',
                  background: '#1A6FFF20', color: '#1A6FFF', flexShrink: 0,
                }}>{LABELS_TYPE[s.type] || s.type}</span>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '15px' }}>{s.nom}</div>
                  <div style={{ color: '#666', fontSize: '12px', marginTop: '2px' }}>
                    {s.seance_exercices?.length || 0} exercice{(s.seance_exercices?.length || 0) > 1 ? 's' : ''}
                    {s.notes && ` · ${s.notes.substring(0, 50)}`}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => { toggleSelect(s.id); }} style={{
                    padding: '7px 12px', borderRadius: '8px',
                    border: `1px solid ${selected ? '#2ECC71' : '#2A2A2A'}`,
                    background: selected ? '#2ECC7115' : 'transparent',
                    color: selected ? '#2ECC71' : '#888', fontSize: '12px', cursor: 'pointer',
                  }}>{selected ? '✓ Sélectionnée' : 'Sélectionner'}</button>
                  <button onClick={() => editSeance(s)} style={{
                    padding: '7px 12px', borderRadius: '8px', border: '1px solid #2A2A2A',
                    background: 'transparent', color: '#888', fontSize: '12px', cursor: 'pointer',
                  }}>Éditer</button>
                  <button onClick={() => deleteSeance(s.id)} style={{
                    padding: '7px 12px', borderRadius: '8px', border: '1px solid #FF475740',
                    background: 'transparent', color: '#FF4757', fontSize: '12px', cursor: 'pointer',
                  }}>✕</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showAttrib && (
        <AttributionModal
          seances={seancesSelectionnees}
          onClose={() => { setShowAttrib(false); setSelection(new Set()) }}
        />
      )}
    </div>
  )
}

function EditeurSeance({ seance, exercices, onSave, onCancel, joueurId, dateAttribution, sauvegarderFavori }: {
  seance: Seance
  exercices: Exercice[]
  onSave: (seanceId: string) => void
  onCancel: () => void
  joueurId?: string
  dateAttribution?: string
  sauvegarderFavori?: boolean
}) {
  const [nom, setNom] = useState(seance.nom)
  const [type, setType] = useState(seance.type)
  const [notes, setNotes] = useState(seance.notes || '')
  const [lignes, setLignes] = useState<SeanceExercice[]>(seance.seance_exercices || [])
  const [recherche, setRecherche] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showDup, setShowDup] = useState(false)

  const exsFiltres = exercices.filter(e =>
    e.nom.toLowerCase().includes(recherche.toLowerCase()) ||
    (e.familles?.nom || '').toLowerCase().includes(recherche.toLowerCase())
  )

  function ajouterExercice(ex: Exercice) {
    setLignes(prev => [...prev, {
      exercice_id: ex.id, ordre: prev.length + 1,
      series: undefined, repetitions: undefined, duree_secondes: undefined,
      distance_metres: undefined, charge_kg: undefined, recuperation_secondes: undefined,
      notes: '', exercices: { nom: ex.nom, familles: ex.familles },
    }])
    setShowPicker(false)
    setRecherche('')
  }

  function updateLigne(idx: number, key: keyof SeanceExercice, val: string) {
    setLignes(prev => prev.map((l, i) => i === idx ? { ...l, [key]: val === '' ? undefined : key === 'notes' ? val : Number(val) } : l))
  }

  function removeLigne(idx: number) {
    setLignes(prev => prev.filter((_, i) => i !== idx).map((l, i) => ({ ...l, ordre: i + 1 })))
  }

  function moveLigne(idx: number, dir: -1 | 1) {
    const next = [...lignes]
    const swap = idx + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    setLignes(next.map((l, i) => ({ ...l, ordre: i + 1 })))
  }

  async function handleSave() {
    if (!nom) { alert('Nom obligatoire'); return }
    setSaving(true)
    let seanceId = seance.id

    if (!seanceId) {
      const estTemplate = joueurId ? (sauvegarderFavori ?? false) : true
      const { data } = await supabase.from('seances').insert({ nom, type, notes: notes || null, est_template: estTemplate, programme_id: null }).select().single()
      seanceId = data?.id
    } else {
      await supabase.from('seances').update({ nom, type, notes: notes || null }).eq('id', seanceId)
      await supabase.from('seance_exercices').delete().eq('seance_id', seanceId)
    }

    if (lignes.length > 0) {
      await supabase.from('seance_exercices').insert(
        lignes.map((l, i) => ({
          seance_id: seanceId,
          exercice_id: l.exercice_id,
          ordre: i + 1,
          series: l.series || null,
          repetitions: l.repetitions || null,
          duree_secondes: l.duree_secondes || null,
          distance_metres: l.distance_metres || null,
          charge_kg: l.charge_kg || null,
          recuperation_secondes: l.recuperation_secondes || null,
          recuperation_active: l.recuperation_active || false,
          recuperation_inter_sets: l.recuperation_inter_sets || null,
          lien_suivant: l.lien_suivant || false,
          uni_podal: l.uni_podal || false,
          notes: l.notes || null,
        }))
      )
    }
    setSaving(false)
    if (seanceId) onSave(seanceId)
  }

  const paramInput = (idx: number, key: keyof SeanceExercice, placeholder: string, width = '70px') => (
    <input
      type="number" placeholder={placeholder}
      value={(lignes[idx][key] as number) ?? ''}
      onChange={e => updateLigne(idx, key, e.target.value)}
      style={{
        width, background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '6px',
        padding: '6px 8px', color: '#FFF', fontSize: '13px', outline: 'none', textAlign: 'center',
      }}
    />
  )

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={onCancel} style={{
          background: 'transparent', border: '1px solid #2A2A2A', color: '#888',
          padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
        }}>← Retour</button>
        <h1 style={{ fontSize: '22px', fontWeight: '800', flex: 1 }}>
          {seance.id ? 'Éditer la séance' : 'Nouvelle séance'}
        </h1>
        {seance.id && (
          <button onClick={() => setShowDup(true)} style={{
            background: '#C9A84C20', border: '1px solid #C9A84C40', color: '#C9A84C',
            padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
          }}>⚡ Dupliquer avec progression</button>
        )}
        <button onClick={handleSave} disabled={saving} style={{
          background: saving ? '#333' : '#1A6FFF', color: '#FFF',
          padding: '10px 20px', borderRadius: '10px', border: 'none',
          cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '14px',
        }}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
      </div>

      {/* Infos séance */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Nom de la séance *"
          style={{ flex: 1, background: '#111', border: '1px solid #2A2A2A', borderRadius: '10px', padding: '12px 16px', color: '#FFF', fontSize: '15px', outline: 'none', fontWeight: '600' }} />
        <select value={type} onChange={e => setType(e.target.value)}
          style={{ background: '#111', border: '1px solid #2A2A2A', borderRadius: '10px', padding: '12px 16px', color: '#FFF', fontSize: '14px', outline: 'none' }}>
          {TYPES_SEANCE.map(t => <option key={t} value={t}>{LABELS_TYPE[t]}</option>)}
        </select>
      </div>

      <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes générales de la séance..."
        rows={2} style={{ width: '100%', background: '#111', border: '1px solid #2A2A2A', borderRadius: '10px', padding: '12px 16px', color: '#FFF', fontSize: '14px', outline: 'none', resize: 'vertical', marginBottom: '24px' }} />

      {/* Exercices */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '700' }}>Exercices ({lignes.length})</h2>
        <button onClick={() => setShowPicker(true)} style={{
          background: '#1A6FFF20', color: '#1A6FFF', border: '1px solid #1A6FFF40',
          padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
        }}>+ Ajouter un exercice</button>
      </div>

      {/* En-têtes paramètres */}
      {lignes.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 65px 65px 65px 65px 65px 65px 80px 40px', gap: '8px', padding: '0 8px 8px', marginBottom: '4px' }}>
          {['Exercice', 'Séries', 'Reps', 'Durée(s)', 'Dist(m)', 'Charge(kg)', 'Récup(s)', 'Notes', ''].map(h => (
            <div key={h} style={{ color: '#555', fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
        {lignes.map((l, idx) => {
          const fam = l.exercices?.familles
          const prevLie = idx > 0 && lignes[idx - 1].lien_suivant
          const nextLie = l.lien_suivant && idx < lignes.length - 1
          const dansSuperset = prevLie || nextLie
          const debutGroupe = dansSuperset && !prevLie
          const finGroupe = dansSuperset && !nextLie

          // Compter les exercices dans le groupe (depuis debutGroupe)
          const groupSize = (() => {
            let start = idx
            while (start > 0 && lignes[start - 1].lien_suivant) start--
            let count = 1, i = start
            while (lignes[i].lien_suivant && i < lignes.length - 1) { i++; count++ }
            return count
          })()
          const labelGroupe = groupSize >= 3 ? 'CIRCUIT' : 'SUPERSET'

          const syncSeries = (val: string) => {
            setLignes(prev => {
              const newLignes = [...prev]
              let start = idx
              while (start > 0 && newLignes[start - 1].lien_suivant) start--
              let i = start
              while (true) {
                newLignes[i] = { ...newLignes[i], series: val === '' ? undefined : Number(val) }
                if (!newLignes[i].lien_suivant || i >= newLignes.length - 1) break
                i++
              }
              return newLignes
            })
          }

          const delierId = () => setLignes(prev => {
            const newLignes = [...prev]
            let i = idx
            while (i >= 0 && (i === idx || newLignes[i].lien_suivant)) {
              newLignes[i] = { ...newLignes[i], lien_suivant: false }
              if (i < idx) break
              i--
            }
            return newLignes
          })

          if (dansSuperset) {
            return (
              <div key={idx} style={{ marginTop: debutGroupe && idx > 0 ? '8px' : '0' }}>

                {/* Header superset : séries partagées */}
                {debutGroupe && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    background: '#1A6FFF18',
                    borderTop: '1px solid #1A6FFF50',
                    borderBottom: '1px solid #1A6FFF25',
                    borderLeft: '1px solid #1A6FFF50',
                    borderRight: '1px solid #1A6FFF50',
                    borderRadius: '10px 10px 0 0',
                    padding: '8px 14px',
                  }}>
                    <span style={{ fontSize: '13px' }}>🔗</span>
                    <span style={{ color: '#1A6FFF', fontWeight: '700', fontSize: '12px', letterSpacing: '1px' }}>{labelGroupe}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                      <span style={{ color: '#888', fontSize: '12px' }}>Séries :</span>
                      <input
                        type="number" placeholder="-"
                        value={l.series ?? ''}
                        onChange={e => syncSeries(e.target.value)}
                        style={{ width: '55px', background: '#1A1A1A', border: '1px solid #1A6FFF40', borderRadius: '6px', padding: '5px 8px', color: '#FFF', fontSize: '13px', outline: 'none', textAlign: 'center' }}
                      />
                    </div>
                  </div>
                )}

                {/* Ligne exercice — même grid 9 colonnes que les headers */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 65px 65px 65px 65px 65px 65px 80px 40px',
                  gap: '8px',
                  background: '#1A6FFF06',
                  borderTop: debutGroupe ? 'none' : '1px solid #1A6FFF25',
                  borderBottom: 'none',
                  borderLeft: '1px solid #1A6FFF50',
                  borderRight: '1px solid #1A6FFF50',
                  borderRadius: '0',
                  padding: '10px 8px', alignItems: 'center',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <button onClick={() => moveLigne(idx, -1)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '10px', lineHeight: 1 }}>▲</button>
                      <button onClick={() => moveLigne(idx, 1)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '10px', lineHeight: 1 }}>▼</button>
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '13px' }}>{l.exercices?.nom}</div>
                      <div style={{ display: 'flex', gap: '5px', marginTop: '3px', flexWrap: 'wrap' }}>
                        {fam && <span style={{ fontSize: '10px', color: fam.couleur }}>{fam.nom}</span>}
                        <button onClick={() => setLignes(prev => prev.map((li, i) => i === idx ? { ...li, uni_podal: !li.uni_podal } : li))}
                          style={{ background: l.uni_podal ? '#1A6FFF20' : 'transparent', border: `1px solid ${l.uni_podal ? '#1A6FFF60' : '#2A2A2A'}`, color: l.uni_podal ? '#1A6FFF' : '#444', fontSize: '9px', padding: '1px 6px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700' }}>↔ 2 côtés</button>
                      </div>
                    </div>
                  </div>
                  {/* Colonne Séries : vide (partagée dans le header) */}
                  <div />
                  {paramInput(idx, 'repetitions', '-')}
                  {paramInput(idx, 'duree_secondes', '-')}
                  {paramInput(idx, 'distance_metres', '-')}
                  {paramInput(idx, 'charge_kg', '-')}
                  {/* Colonne Récup : vide (gérée en transition ou footer) */}
                  <div />
                  <input value={l.notes || ''} onChange={e => updateLigne(idx, 'notes', e.target.value)}
                    placeholder="note..."
                    style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '6px 8px', color: '#FFF', fontSize: '12px', outline: 'none' }} />
                  <button onClick={() => removeLigne(idx)} style={{
                    background: 'transparent', border: '1px solid #FF475730', color: '#FF4757',
                    borderRadius: '6px', padding: '6px', cursor: 'pointer', fontSize: '12px',
                  }}>✕</button>
                </div>

                {/* Récup de transition entre exercices */}
                {nextLie && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: '#1A6FFF04',
                    borderTop: 'none',
                    borderBottom: 'none',
                    borderLeft: '1px solid #1A6FFF50',
                    borderRight: '1px solid #1A6FFF50',
                    padding: '5px 14px',
                  }}>
                    <span style={{ color: '#444', fontSize: '11px' }}>↓ Récup avant exo suivant :</span>
                    <input
                      type="number" placeholder="0"
                      value={l.recuperation_secondes ?? ''}
                      onChange={e => updateLigne(idx, 'recuperation_secondes', e.target.value)}
                      style={{ width: '50px', background: '#1A1A1A', border: '1px solid #333', borderRadius: '6px', padding: '4px 6px', color: '#FFF', fontSize: '12px', outline: 'none', textAlign: 'center' }}
                    />
                    <span style={{ color: '#444', fontSize: '11px' }}>s</span>
                  </div>
                )}

                {/* Footer : récup après le superset complet + Délier */}
                {finGroupe && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    background: '#1A6FFF10',
                    borderTop: 'none',
                    borderBottom: '1px solid #1A6FFF50',
                    borderLeft: '1px solid #1A6FFF50',
                    borderRight: '1px solid #1A6FFF50',
                    borderRadius: '0 0 10px 10px',
                    padding: '8px 14px',
                  }}>
                    <span style={{ color: '#2ECC71AA', fontSize: '12px' }}>⟳ Entre les sets :</span>
                    <input
                      type="number" placeholder="0"
                      value={l.recuperation_inter_sets ?? ''}
                      onChange={e => setLignes(prev => prev.map((li, i) => i === idx ? { ...li, recuperation_inter_sets: e.target.value === '' ? undefined : Number(e.target.value) } : li))}
                      style={{ width: '56px', background: '#1A1A1A', border: '1px solid #2ECC7140', borderRadius: '6px', padding: '5px 8px', color: '#2ECC71', fontSize: '13px', outline: 'none', textAlign: 'center' }}
                    />
                    <span style={{ color: '#888', fontSize: '12px' }}>s</span>
                    <span style={{ color: '#888', fontSize: '12px', marginLeft: '12px' }}>↦ Après le superset :</span>
                    <input
                      type="number" placeholder="0"
                      value={l.recuperation_secondes ?? ''}
                      onChange={e => updateLigne(idx, 'recuperation_secondes', e.target.value)}
                      style={{ width: '56px', background: '#1A1A1A', border: '1px solid #1A6FFF40', borderRadius: '6px', padding: '5px 8px', color: '#1A6FFF', fontSize: '13px', outline: 'none', textAlign: 'center' }}
                    />
                    <span style={{ color: '#888', fontSize: '12px' }}>s</span>
                    <button onClick={delierId} style={{
                      marginLeft: 'auto', padding: '4px 10px', borderRadius: '6px',
                      border: '1px solid #FF475730', background: 'transparent',
                      color: '#FF4757', fontSize: '11px', cursor: 'pointer',
                    }}>Délier</button>
                  </div>
                )}
              </div>
            )
          }

          // Exercice standard (hors superset)
          return (
            <div key={idx} style={{ marginTop: idx > 0 ? '8px' : '0' }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 65px 65px 65px 65px 65px 65px 80px 40px',
                gap: '8px',
                background: '#111',
                borderTop: '1px solid #2A2A2A',
                borderBottom: '1px solid #2A2A2A',
                borderLeft: '1px solid #2A2A2A',
                borderRight: '1px solid #2A2A2A',
                borderRadius: '10px',
                padding: '10px 8px', alignItems: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <button onClick={() => moveLigne(idx, -1)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '10px', lineHeight: 1 }}>▲</button>
                    <button onClick={() => moveLigne(idx, 1)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '10px', lineHeight: 1 }}>▼</button>
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '13px' }}>{l.exercices?.nom}</div>
                    <div style={{ display: 'flex', gap: '5px', marginTop: '3px', flexWrap: 'wrap' }}>
                      {fam && <span style={{ fontSize: '10px', color: fam.couleur }}>{fam.nom}</span>}
                      <button onClick={() => setLignes(prev => prev.map((li, i) => i === idx ? { ...li, uni_podal: !li.uni_podal } : li))}
                        style={{ background: l.uni_podal ? '#1A6FFF20' : 'transparent', border: `1px solid ${l.uni_podal ? '#1A6FFF60' : '#2A2A2A'}`, color: l.uni_podal ? '#1A6FFF' : '#444', fontSize: '9px', padding: '1px 6px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700' }}>↔ 2 côtés</button>
                    </div>
                  </div>
                </div>
                {paramInput(idx, 'series', '-')}
                {paramInput(idx, 'repetitions', '-')}
                {paramInput(idx, 'duree_secondes', '-')}
                {paramInput(idx, 'distance_metres', '-')}
                {paramInput(idx, 'charge_kg', '-')}
                {paramInput(idx, 'recuperation_secondes', '-')}
                <input value={l.notes || ''} onChange={e => updateLigne(idx, 'notes', e.target.value)}
                  placeholder="note..."
                  style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '6px 8px', color: '#FFF', fontSize: '12px', outline: 'none' }} />
                <button onClick={() => removeLigne(idx)} style={{
                  background: 'transparent', border: '1px solid #FF475730', color: '#FF4757',
                  borderRadius: '6px', padding: '6px', cursor: 'pointer', fontSize: '12px',
                }}>✕</button>
              </div>

              {/* Bouton Lier en superset */}
              {idx < lignes.length - 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
                  <button onClick={() => setLignes(prev => prev.map((li, i) => i === idx ? { ...li, lien_suivant: true } : li))}
                    style={{
                      background: '#1A1A1A', border: '1px solid #2A2A2A',
                      borderRadius: '20px', padding: '3px 14px', cursor: 'pointer',
                      fontSize: '12px', color: '#555', display: 'flex', alignItems: 'center', gap: '6px',
                    }}>
                    🔗 <span>Lier en superset</span>
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {lignes.length === 0 && (
        <div style={{ background: '#111', border: '1px solid #2A2A2A', borderRadius: '12px', padding: '32px', textAlign: 'center', color: '#555', fontSize: '14px' }}>
          Aucun exercice. Clique sur "+ Ajouter un exercice".
        </div>
      )}

      {/* Picker exercice */}
      {showPicker && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#111', border: '1px solid #2A2A2A', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '480px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Choisir un exercice</h3>
              <button onClick={() => setShowPicker(false)} style={{ background: 'none', border: 'none', color: '#888', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <input value={recherche} onChange={e => setRecherche(e.target.value)} placeholder="Rechercher..."
              style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '10px 14px', color: '#FFF', fontSize: '14px', outline: 'none', marginBottom: '12px' }} />
            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {exsFiltres.map(ex => (
                <button key={ex.id} onClick={() => ajouterExercice(ex)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px',
                  padding: '10px 14px', cursor: 'pointer', textAlign: 'left',
                }}>
                  <span style={{ color: '#FFF', fontSize: '13px', fontWeight: '600' }}>{ex.nom}</span>
                  {ex.familles && (
                    <span style={{ fontSize: '11px', color: ex.familles.couleur, background: ex.familles.couleur + '20', padding: '2px 8px', borderRadius: '10px' }}>
                      {ex.familles.nom}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal duplication avec progression */}
      {showDup && (
        <DuplicationModal seance={{ ...seance, nom, seance_exercices: lignes }} onClose={() => setShowDup(false)} onDuplique={() => onSave('')} />
      )}
    </div>
  )
}

type Realisation = {
  id: string
  seance_id: string
  date_realisation: string
  completee: boolean
  rpe?: number | null
  fatigue?: number | null
  courbatures?: number | null
  qualite_sommeil?: number | null
  notes_joueur?: string | null
  seances?: {
    id: string; nom: string; type: string; est_template: boolean
    seance_exercices?: {
      id: string; ordre: number; series?: number; repetitions?: number
      duree_secondes?: number; distance_metres?: number; charge_kg?: number
      recuperation_secondes?: number; lien_suivant?: boolean; notes?: string
      exercices?: { nom: string; consignes_execution?: string; familles?: { nom: string; couleur: string } | null } | null
    }[]
  } | null
}

function WellnessGraphiques({ realisations }: { realisations: Realisation[] }) {
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
        <span style={{ color: '#2A2A2A', fontSize: '11px' }}>Aucune donnée sur cette période</span>
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
          <line key={v} x1={PADX} y1={toY(v)} x2={W - PADX} y2={toY(v)} stroke="#161616" strokeWidth="1" />
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
      <div style={{ background: '#111', border: '1px solid #1A1A1A', borderRadius: '14px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* Raccourcis */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[7, 14, 28, 56].map(n => (
            <button key={n} onClick={() => { setNbJours(n); setFin(todayStr) }} style={{
              padding: '5px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '700',
              background: nbJours === n && fin === todayStr ? '#1A6FFF' : '#1A1A1A',
              color: nbJours === n && fin === todayStr ? '#FFF' : '#555',
            }}>{n === 7 ? '7j' : n === 14 ? '14j' : n === 28 ? '1 mois' : '2 mois'}</button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => decaler(-1)} style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '5px 10px', color: '#888', cursor: 'pointer', fontSize: '13px' }}>‹</button>
          <span style={{ fontSize: '12px', color: '#666', fontWeight: '600', minWidth: '160px', textAlign: 'center' }}>
            {new Date(debut + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
            {' — '}
            {new Date(fin + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <button onClick={() => decaler(1)} disabled={fin >= todayStr} style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '5px 10px', color: fin >= todayStr ? '#2A2A2A' : '#888', cursor: fin >= todayStr ? 'default' : 'pointer', fontSize: '13px' }}>›</button>
        </div>
      </div>

      {!hasDonnees ? (
        <div style={{ background: '#111', border: '1px solid #1A1A1A', borderRadius: '16px', padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📊</div>
          <div style={{ color: '#444', fontSize: '14px' }}>Aucune donnée sur cette période</div>
        </div>
      ) : (
        <>
          {/* Résumé de la période */}
          <div style={{ background: '#111', border: '1px solid #1A1A1A', borderRadius: '16px', padding: '18px 20px' }}>
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#333', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '14px' }}>
              Moyenne sur la période · {moyennes[0].nb} séance{moyennes[0].nb > 1 ? 's' : ''} renseignée{moyennes[0].nb > 1 ? 's' : ''}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {moyennes.map(m => (
                <div key={m.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#0C0C0C', borderRadius: '12px', padding: '12px 8px', border: `1px solid ${m.color}20` }}>
                  <span style={{ fontSize: '9px', fontWeight: '700', color: '#444', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', textAlign: 'center' }}>{m.label}</span>
                  {m.moy != null ? (
                    <>
                      <span style={{ fontSize: '26px', fontWeight: '900', color: m.color, lineHeight: 1 }}>{m.moy}</span>
                      <span style={{ fontSize: '9px', color: '#333', marginTop: '2px' }}>/10</span>
                      <div style={{ width: '100%', height: '3px', background: '#1A1A1A', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                        <div style={{ width: `${m.moy * 10}%`, height: '100%', background: m.color, borderRadius: '2px' }} />
                      </div>
                    </>
                  ) : <span style={{ fontSize: '20px', color: '#2A2A2A' }}>—</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Graphiques quotidiens */}
          {metrics.map(m => (
            <div key={m.key} style={{ background: '#111', border: '1px solid #1A1A1A', borderRadius: '16px', padding: '16px 20px' }}>
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
                  {[10, 8, 6, 4, 2].map(v => <span key={v} style={{ fontSize: '9px', color: '#2A2A2A', lineHeight: 1 }}>{v}</span>)}
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

function ProfilJoueur({ joueur, onBack }: { joueur: Joueur; onBack: () => void }) {
  const today = new Date().toISOString().split('T')[0]
  const [onglet, setOnglet] = useState<'calendrier' | 'favoris' | 'graphiques' | 'messages'>('calendrier')
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
  useEffect(() => { loadData() }, [joueur.id])

  async function loadData() {
    const [{ data: reals }, { data: tmpl }, { data: exs }, { data: favs }] = await Promise.all([
      supabase.from('realisations').select('id, seance_id, date_realisation, completee, rpe, fatigue, courbatures, qualite_sommeil, notes_joueur, seances(id, nom, type, est_template, seance_exercices(id, ordre, series, repetitions, duree_secondes, distance_metres, charge_kg, recuperation_secondes, lien_suivant, notes, exercices(nom, consignes_execution, familles(nom, couleur))))').eq('joueur_id', joueur.id).order('date_realisation'),
      supabase.from('seances').select('id, nom, type').eq('est_template', true).order('nom'),
      supabase.from('exercices').select('*, familles(nom, couleur)').order('nom'),
      supabase.from('seances').select('*, seance_exercices(*, exercices(nom, familles(nom, couleur)))').eq('est_template', true).order('nom'),
    ])
    if (reals) setRealisations(reals as unknown as Realisation[])
    if (tmpl) setTemplates(tmpl)
    if (exs) setExercices(exs)
    if (favs) setFavoris(favs)
  }

  async function attribuerTemplate() {
    if (!seanceChoisie || !createDate) return
    await supabase.from('realisations').insert({ joueur_id: joueur.id, seance_id: seanceChoisie, date_realisation: createDate, completee: false })
    await loadData()
    setCreateDate(null)
    setSeanceChoisie('')
  }

  async function supprimerRealisation(id: string) {
    await supabase.from('realisations').delete().eq('id', id)
    setSeanceDetail(null)
    await loadData()
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
          <button onClick={() => { setSeanceEdit(null); setCreateDate(null) }} style={{ background: 'none', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '8px 12px', color: '#888', cursor: 'pointer', fontSize: '13px' }}>← Annuler</button>
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
        <button onClick={onBack} style={{ background: 'none', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '8px 12px', color: '#888', cursor: 'pointer', fontSize: '13px' }}>← Retour</button>
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
        <div style={{ display: 'flex', gap: '4px', background: '#1A1A1A', borderRadius: '10px', padding: '4px' }}>
          {(['calendrier', 'graphiques', 'favoris', 'messages'] as const).map(o => (
            <button key={o} onClick={() => setOnglet(o)} style={{
              padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
              background: onglet === o ? '#2A2A2A' : 'transparent',
              color: onglet === o ? '#FFF' : '#555',
            }}>{o === 'calendrier' ? 'Calendrier' : o === 'graphiques' ? '📊 Graphiques' : o === 'favoris' ? '⭐ Favoris' : '💬 Messages'}</button>
          ))}
        </div>
      </div>

      {onglet === 'calendrier' && (
        <div>
          {/* Navigation plage */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <button onClick={allerAujourdhui} style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '7px 12px', color: '#888', cursor: 'pointer', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>Aujourd'hui</button>
            <button onClick={() => decalerRange(-7)} style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '7px 12px', color: '#888', cursor: 'pointer', fontSize: '14px' }}>‹</button>
            <button onClick={() => decalerRange(7)} style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '7px 12px', color: '#888', cursor: 'pointer', fontSize: '14px' }}>›</button>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#555', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>DE</span>
              <input type="date" value={rangeDebut} onChange={e => setRangeDebut(e.target.value)}
                style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '6px 10px', color: '#1A6FFF', fontSize: '13px', fontWeight: '600', outline: 'none', cursor: 'pointer' }} />
              <span style={{ color: '#555', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>À</span>
              <input type="date" value={rangeFin} onChange={e => setRangeFin(e.target.value)}
                style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '6px 10px', color: '#1A6FFF', fontSize: '13px', fontWeight: '600', outline: 'none', cursor: 'pointer' }} />
            </div>
          </div>

          {/* En-têtes jours fixes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '4px' }}>
            {jourNoms.map(j => (
              <div key={j} style={{ textAlign: 'center', color: '#555', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', padding: '4px 0' }}>{j}</div>
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
                      background: isToday ? '#1A6FFF08' : '#111',
                      borderTop: `2px solid ${isToday ? '#1A6FFF' : isPast ? '#1E1E1E' : '#2A2A2A'}`,
                      borderBottom: '1px solid #1E1E1E',
                      borderLeft: '1px solid #1E1E1E',
                      borderRight: '1px solid #1E1E1E',
                      borderRadius: '8px',
                      display: 'flex', flexDirection: 'column',
                      overflow: 'hidden',
                    }}>
                      {/* Header jour */}
                      <div style={{ padding: '6px 8px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1E1E1E' }}>
                        <div style={{ fontSize: '16px', fontWeight: isToday ? '900' : '600', color: isToday ? '#1A6FFF' : isPast ? '#444' : '#DDD', lineHeight: 1 }}>{dateNum}</div>
                        <button onClick={() => { setCreateDate(ds); setCreateMode('choisir'); setSeanceChoisie('') }}
                          style={{ width: '20px', height: '20px', borderRadius: '5px', border: '1px solid #2A2A2A', background: 'transparent', color: '#555', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, padding: 0 }}>+</button>
                      </div>

                      {/* Cartes séances */}
                      <div style={{ flex: 1, padding: '4px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {realsJour.map(r => {
                          const couleur = r.completee ? '#2ECC71' : isPast ? '#FF4757' : '#1A6FFF'
                          return (
                            <div key={r.id} onClick={() => setSeanceDetail(r)} style={{
                              background: r.completee ? '#2ECC7112' : isPast ? '#FF475710' : '#1A6FFF10',
                              borderTop: `1px solid ${couleur}30`,
                              borderBottom: `1px solid ${couleur}30`,
                              borderRight: `1px solid ${couleur}30`,
                              borderLeft: `3px solid ${couleur}`,
                              borderRadius: '4px', padding: '4px 6px',
                              cursor: 'pointer',
                              display: 'flex', alignItems: 'flex-start', gap: '5px',
                            }}>
                              <input type="checkbox" checked={r.completee} onChange={e => { e.stopPropagation(); toggleCompletee(r) }}
                                style={{ marginTop: '1px', accentColor: couleur, flexShrink: 0, cursor: 'pointer' }} />
                              <div style={{ flex: 1, overflow: 'hidden' }}>
                                <div style={{ fontSize: '11px', fontWeight: '600', color: '#DDD', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.seances?.nom || 'Séance'}</div>
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
        <div style={{ background: '#111', borderRadius: '16px', overflow: 'hidden', border: '1px solid #2A2A2A', height: 'calc(100vh - 260px)' }}>
          {coachId && joueurAuthId ? (
            <>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #1E1E1E' }}>
                <span style={{ color: '#555', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Conversation avec {joueur.prenom} {joueur.nom}</span>
              </div>
              <ChatView key={joueurAuthId} myId={coachId} otherId={joueurAuthId} height="calc(100vh - 325px)" />
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#555', fontSize: '13px' }}>
              {joueurAuthId ? 'Chargement…' : 'Ce joueur n\'a pas encore de compte actif'}
            </div>
          )}
        </div>
      )}

      {onglet === 'favoris' && (
        <div>
          <p style={{ color: '#888', fontSize: '13px', marginBottom: '16px' }}>Séances sauvegardées — clique sur "Planifier" pour les ajouter au calendrier.</p>
          {favoris.length === 0 ? (
            <div style={{ background: '#111', border: '1px solid #2A2A2A', borderRadius: '12px', padding: '32px', textAlign: 'center', color: '#555', fontSize: '14px' }}>
              Aucun favori. Coche "Sauvegarder en Favoris" lors de la création d'une séance.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {favoris.map(s => (
                <div key={s.id} style={{ background: '#111', border: '1px solid #2A2A2A', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>{s.nom}</div>
                    <div style={{ color: '#666', fontSize: '12px', marginTop: '2px' }}>{s.seance_exercices?.length || 0} exercices</div>
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
          <div onClick={e => e.stopPropagation()} style={{ background: '#111', border: '1px solid #2A2A2A', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '480px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ fontWeight: '800', fontSize: '17px' }}>{seanceDetail.seances?.nom || 'Séance'}</div>
                <div style={{ color: '#C9A84C', fontSize: '13px', marginTop: '3px' }}>
                  {new Date(seanceDetail.date_realisation + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
              </div>
              <button onClick={() => setSeanceDetail(null)} style={{ background: 'none', border: 'none', color: '#555', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            {/* Toggle complétée */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '16px', padding: '10px 14px', background: seanceDetail.completee ? '#2ECC7115' : '#1A1A1A', borderRadius: '10px', border: `1px solid ${seanceDetail.completee ? '#2ECC7140' : '#2A2A2A'}` }}>
              <input type="checkbox" checked={seanceDetail.completee} onChange={() => toggleCompletee(seanceDetail)} style={{ accentColor: '#2ECC71', width: '16px', height: '16px', cursor: 'pointer' }} />
              <span style={{ fontWeight: '600', fontSize: '13px', color: seanceDetail.completee ? '#2ECC71' : '#888' }}>
                {seanceDetail.completee ? 'Séance réalisée' : 'Marquer comme réalisée'}
              </span>
            </label>

            {/* Exercices — rendu complet avec supersets */}
            {(() => {
              const exos = [...(seanceDetail.seances?.seance_exercices || [])].sort((a, b) => a.ordre - b.ordre)
              if (exos.length === 0) return <div style={{ color: '#444', fontSize: '13px', marginBottom: '16px', fontStyle: 'italic' }}>Aucun exercice enregistré.</div>
              const blocs: typeof exos[] = []
              let bi = 0
              while (bi < exos.length) {
                const bloc = [exos[bi]]
                while (exos[bi]?.lien_suivant && bi + 1 < exos.length) { bi++; bloc.push(exos[bi]) }
                blocs.push(bloc); bi++
              }
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {blocs.map((bloc, bIdx) => {
                    const isSuperset = bloc.length > 1
                    const seriesCount = bloc[0].series || 0
                    return (
                      <div key={bIdx} style={{ background: '#0C0C0C', border: isSuperset ? '1px solid #1A6FFF25' : '1px solid #161616', borderRadius: '14px', overflow: 'hidden' }}>
                        {isSuperset && (
                          <div style={{ background: 'linear-gradient(90deg,#1A6FFF18,#1A6FFF08)', borderBottom: '1px solid #1A6FFF20', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '12px' }}>🔗</span>
                            <span style={{ color: '#1A6FFF', fontSize: '10px', fontWeight: '900', letterSpacing: '1.2px' }}>SUPERSET</span>
                            {seriesCount > 0 && <span style={{ color: '#1A6FFF60', fontSize: '12px', fontWeight: '700' }}>· {seriesCount} séries</span>}
                          </div>
                        )}
                        {bloc.map((ex, ei) => {
                          const couleur = ex.exercices?.familles?.couleur || '#555'
                          const nbSeries = isSuperset ? seriesCount : (ex.series || 0)
                          const metrique = ex.repetitions ? `${ex.repetitions} reps`
                            : ex.duree_secondes ? `${ex.duree_secondes}s`
                            : ex.distance_metres ? `${ex.distance_metres}m` : null
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
                              <div style={{ padding: '12px 14px 0', borderTop: ei > 0 && !isSuperset ? '1px solid #161616' : 'none' }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' }}>
                                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: couleur + '20', border: `1px solid ${couleur}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <span style={{ color: couleur, fontSize: '11px', fontWeight: '900' }}>{ex.ordre}</span>
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    {ex.exercices?.familles && <div style={{ fontSize: '9px', fontWeight: '800', color: couleur, textTransform: 'uppercase' as const, letterSpacing: '0.8px', marginBottom: '2px' }}>{ex.exercices.familles.nom}</div>}
                                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#EEE', letterSpacing: '-0.2px', lineHeight: 1.2 }}>{ex.exercices?.nom}</div>
                                  </div>
                                </div>
                                {ex.notes && (
                                  <div style={{ marginBottom: '8px' }}>
                                    <span style={{ background: '#C9A84C15', border: '1px solid #C9A84C30', color: '#C9A84C', fontSize: '11px', fontWeight: '800', padding: '3px 10px', borderRadius: '6px' }}>● {ex.notes}</span>
                                  </div>
                                )}
                                {ex.exercices?.consignes_execution && (
                                  <div style={{ background: '#C9A84C08', border: '1px solid #C9A84C18', borderLeft: '3px solid #C9A84C50', borderRadius: '0 8px 8px 0', padding: '8px 10px', marginBottom: '10px' }}>
                                    <div style={{ fontSize: '8px', fontWeight: '900', color: '#C9A84C60', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '4px' }}>Consignes</div>
                                    <div style={{ color: '#C9A84C90', fontSize: '12px', lineHeight: '1.6' }}>{ex.exercices.consignes_execution}</div>
                                  </div>
                                )}
                                {nbSeries > 0 && (
                                  <div style={{ marginBottom: '10px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 1fr 1fr', gap: '2px', padding: '4px 8px', marginBottom: '2px' }}>
                                      {['N°', ex.repetitions ? 'Reps' : ex.duree_secondes ? 'Durée' : 'Reps', 'Charge', 'Récup'].map(h => (
                                        <span key={h} style={{ fontSize: '9px', fontWeight: '800', color: '#252525', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>{h}</span>
                                      ))}
                                    </div>
                                    {Array.from({ length: nbSeries }, (_, si) => (
                                      <div key={si} style={{ display: 'grid', gridTemplateColumns: '36px 1fr 1fr 1fr', gap: '2px', padding: '7px 8px', background: si % 2 === 0 ? '#0A0A0A' : 'transparent', borderRadius: '6px' }}>
                                        <span style={{ fontSize: '12px', fontWeight: '700', color: couleur }}>{si + 1}</span>
                                        <span style={{ fontSize: '13px', fontWeight: '800', color: '#CCC' }}>{metrique || '—'}</span>
                                        <span style={{ fontSize: '13px', fontWeight: '700', color: ex.charge_kg ? '#777' : '#252525' }}>{ex.charge_kg ? `${ex.charge_kg}kg` : '—'}</span>
                                        <span style={{ fontSize: '12px', fontWeight: '700', color: !isSuperset && ex.recuperation_secondes && si < nbSeries - 1 ? '#2ECC7170' : '#252525' }}>
                                          {!isSuperset && ex.recuperation_secondes && si < nbSeries - 1 ? `${ex.recuperation_secondes}s` : '—'}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {nbSeries === 0 && (ex.repetitions || ex.duree_secondes || ex.distance_metres || ex.charge_kg) && (
                                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' as const, marginBottom: '10px' }}>
                                    {[ex.repetitions && `${ex.repetitions} reps`, ex.duree_secondes && `${ex.duree_secondes}s`, ex.distance_metres && `${ex.distance_metres}m`, ex.charge_kg && `${ex.charge_kg}kg`].filter(Boolean).map((p, pi) => (
                                      <span key={pi} style={{ background: '#161616', border: '1px solid #1E1E1E', borderRadius: '6px', padding: '3px 8px', fontSize: '12px', fontWeight: '700', color: '#666' }}>{p}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div style={{ height: '12px' }} />
                            </div>
                          )
                        })}
                        {(bloc[bloc.length - 1].recuperation_secondes ?? 0) > 0 && (
                          <div style={{ borderTop: '1px solid #161616', padding: '10px 14px', background: '#080808', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '7px', background: '#2ECC7115', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⏱</div>
                            <div>
                              <div style={{ fontSize: '9px', fontWeight: '800', color: '#2ECC7150', textTransform: 'uppercase' as const, letterSpacing: '1px' }}>{isSuperset ? 'Récup après le superset' : 'Récupération'}</div>
                              <div style={{ fontSize: '16px', fontWeight: '900', color: '#2ECC71' }}>{bloc[bloc.length - 1].recuperation_secondes}s</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })()}

            {/* Données renseignées par le joueur */}
            {(seanceDetail.rpe || seanceDetail.fatigue || seanceDetail.courbatures || seanceDetail.qualite_sommeil || seanceDetail.notes_joueur) && (
              <div style={{ background: '#0D0D0D', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
                <div style={{ color: '#555', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Ressenti joueur</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: seanceDetail.notes_joueur ? '10px' : '0' }}>
                  {seanceDetail.fatigue != null && (
                    <div style={{ background: '#FF475720', borderRadius: '8px', padding: '6px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                      <span style={{ color: '#888', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>Fatigue</span>
                      <span style={{ color: '#FF4757', fontWeight: '800', fontSize: '18px' }}>{seanceDetail.fatigue}</span>
                      <span style={{ color: '#555', fontSize: '9px' }}>/10</span>
                    </div>
                  )}
                  {seanceDetail.courbatures != null && (
                    <div style={{ background: '#FF6B3520', borderRadius: '8px', padding: '6px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                      <span style={{ color: '#888', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>Courbatures</span>
                      <span style={{ color: '#FF6B35', fontWeight: '800', fontSize: '18px' }}>{seanceDetail.courbatures}</span>
                      <span style={{ color: '#555', fontSize: '9px' }}>/10</span>
                    </div>
                  )}
                  {seanceDetail.rpe != null && (
                    <div style={{ background: '#1A6FFF20', borderRadius: '8px', padding: '6px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                      <span style={{ color: '#888', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>Effort</span>
                      <span style={{ color: '#1A6FFF', fontWeight: '800', fontSize: '18px' }}>{seanceDetail.rpe}</span>
                      <span style={{ color: '#555', fontSize: '9px' }}>/10</span>
                    </div>
                  )}
                  {seanceDetail.qualite_sommeil != null && (
                    <div style={{ background: '#2ECC7120', borderRadius: '8px', padding: '6px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                      <span style={{ color: '#888', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>Sommeil</span>
                      <span style={{ color: '#2ECC71', fontWeight: '800', fontSize: '18px' }}>{seanceDetail.qualite_sommeil}</span>
                      <span style={{ color: '#555', fontSize: '9px' }}>/10</span>
                    </div>
                  )}
                </div>
                {seanceDetail.notes_joueur && (
                  <div style={{ color: '#AAA', fontSize: '13px', fontStyle: 'italic', borderTop: '1px solid #1E1E1E', paddingTop: '10px' }}>"{seanceDetail.notes_joueur}"</div>
                )}
              </div>
            )}

            {/* Supprimer du planning */}
            <button onClick={() => supprimerRealisation(seanceDetail.id)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #FF475730', background: '#FF475710', color: '#FF4757', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
              Retirer du planning
            </button>
          </div>
        </div>
      )}

      {/* Modal ajouter une séance */}
      {createDate && !seanceEdit && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#111', border: '1px solid #2A2A2A', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '440px' }}>
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
                border: `1px solid ${createMode === 'choisir' ? '#1A6FFF' : '#2A2A2A'}`,
                background: createMode === 'choisir' ? '#1A6FFF15' : 'transparent',
                color: createMode === 'choisir' ? '#1A6FFF' : '#555',
              }}>Choisir un modèle</button>
              <button onClick={() => setCreateMode('creer')} style={{
                flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                border: `1px solid ${createMode === 'creer' ? '#2ECC71' : '#2A2A2A'}`,
                background: createMode === 'creer' ? '#2ECC7115' : 'transparent',
                color: createMode === 'creer' ? '#2ECC71' : '#555',
              }}>Créer une séance</button>
            </div>

            {createMode === 'choisir' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <select value={seanceChoisie} onChange={e => setSeanceChoisie(e.target.value)}
                  style={{ width: '100%', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '10px 14px', color: seanceChoisie ? '#FFF' : '#555', fontSize: '14px', outline: 'none' }}>
                  <option value="">Choisir un modèle...</option>
                  {templates.map(t => <option key={t.id} value={t.id}>{t.nom}</option>)}
                </select>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setCreateDate(null)} style={{ flex: 1, padding: '11px', borderRadius: '10px', border: '1px solid #2A2A2A', background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '14px' }}>Annuler</button>
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
                  <button onClick={() => setCreateDate(null)} style={{ flex: 1, padding: '11px', borderRadius: '10px', border: '1px solid #2A2A2A', background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '14px' }}>Annuler</button>
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
    </div>
  )
}

function AttributionModal({ seances, onClose }: {
  seances: Seance[]
  onClose: () => void
}) {
  const [joueurs, setJoueurs] = useState<{ id: string; nom: string; prenom: string; actif: boolean }[]>([])
  const [selectedJoueurs, setSelectedJoueurs] = useState<Set<string>>(new Set())
  const [dateDebut, setDateDebut] = useState(() => new Date().toISOString().split('T')[0])
  const [intervalJours, setIntervalJours] = useState(7)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('joueurs').select('id, nom, prenom, actif').eq('actif', true).order('nom').then(({ data }) => {
      if (data) setJoueurs(data)
    })
  }, [])

  function toggleJoueur(id: string) {
    setSelectedJoueurs(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  // Calcule les dates pour chaque séance
  function datesPrevues() {
    return seances.map((_, i) => {
      const d = new Date(dateDebut)
      d.setDate(d.getDate() + i * intervalJours)
      return d.toISOString().split('T')[0]
    })
  }

  async function confirmer() {
    if (selectedJoueurs.size === 0) return
    setSaving(true)
    const dates = datesPrevues()
    const rows: { joueur_id: string; seance_id: string; date_realisation: string; completee: boolean }[] = []
    for (const joueurId of selectedJoueurs) {
      for (let i = 0; i < seances.length; i++) {
        rows.push({ joueur_id: joueurId, seance_id: seances[i].id, date_realisation: dates[i], completee: false })
      }
    }
    await supabase.from('realisations').insert(rows)
    setSaving(false)
    onClose()
    alert(`✓ ${seances.length} séance${seances.length > 1 ? 's' : ''} attribuée${seances.length > 1 ? 's' : ''} à ${selectedJoueurs.size} joueur${selectedJoueurs.size > 1 ? 's' : ''}`)
  }

  const dates = datesPrevues()

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
      <div style={{ background: '#111', border: '1px solid #2A2A2A', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '6px' }}>Attribuer des séances</h2>
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '24px' }}>{seances.length} séance{seances.length > 1 ? 's' : ''} sélectionnée{seances.length > 1 ? 's' : ''}</p>

        {/* Séances + dates */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <span style={{ color: '#FFF', fontWeight: '600', fontSize: '13px' }}>Date de début</span>
            <input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)}
              style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '7px 12px', color: '#FFF', fontSize: '13px', outline: 'none' }} />
            {seances.length > 1 && (
              <>
                <span style={{ color: '#888', fontSize: '13px' }}>tous les</span>
                <input type="number" min={1} value={intervalJours} onChange={e => setIntervalJours(Number(e.target.value))}
                  style={{ width: '50px', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '7px 8px', color: '#FFF', fontSize: '13px', outline: 'none', textAlign: 'center' }} />
                <span style={{ color: '#888', fontSize: '13px' }}>jours</span>
              </>
            )}
          </div>

          {/* Liste des séances avec leur date */}
          <div style={{ background: '#0A0A0A', borderRadius: '10px', overflow: 'hidden' }}>
            {seances.map((s, i) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: i < seances.length - 1 ? '1px solid #1A1A1A' : 'none' }}>
                <span style={{ color: '#FFF', fontSize: '13px', fontWeight: '600' }}>{s.nom}</span>
                <span style={{ color: '#C9A84C', fontSize: '12px', fontWeight: '600' }}>
                  {new Date(dates[i] + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Joueurs */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '10px', color: '#FFF' }}>
            Attribuer à {selectedJoueurs.size > 0 ? `${selectedJoueurs.size} joueur${selectedJoueurs.size > 1 ? 's' : ''}` : '...'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '220px', overflowY: 'auto' }}>
            {joueurs.length === 0 && <span style={{ color: '#555', fontSize: '13px' }}>Aucun joueur actif</span>}
            {joueurs.map(j => {
              const sel = selectedJoueurs.has(j.id)
              return (
                <button key={j.id} onClick={() => toggleJoueur(j.id)} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  background: sel ? '#1A6FFF12' : '#1A1A1A',
                  border: `1px solid ${sel ? '#1A6FFF' : '#2A2A2A'}`,
                  borderRadius: '10px', padding: '12px 14px', cursor: 'pointer', textAlign: 'left',
                }}>
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '5px', flexShrink: 0,
                    border: `2px solid ${sel ? '#1A6FFF' : '#333'}`,
                    background: sel ? '#1A6FFF' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', color: '#FFF',
                  }}>{sel ? '✓' : ''}</div>
                  <span style={{ color: '#FFF', fontWeight: '600', fontSize: '14px' }}>{j.prenom} {j.nom}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #2A2A2A', background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '14px' }}>
            Annuler
          </button>
          <button onClick={confirmer} disabled={saving || selectedJoueurs.size === 0} style={{
            flex: 2, padding: '12px', borderRadius: '10px', border: 'none',
            background: saving || selectedJoueurs.size === 0 ? '#333' : '#2ECC71',
            color: '#FFF', cursor: saving || selectedJoueurs.size === 0 ? 'not-allowed' : 'pointer',
            fontWeight: '700', fontSize: '14px',
          }}>
            {saving ? 'Attribution...' : `Attribuer à ${selectedJoueurs.size} joueur${selectedJoueurs.size > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  )
}

type SemaineConfig = {
  pct: number
  remplacements: Record<number, { id: string; nom: string; familles?: { nom: string; couleur: string } | null }>
}

function DuplicationModal({ seance, onClose, onDuplique }: {
  seance: Seance
  onClose: () => void
  onDuplique: () => void
}) {
  const [nbSemaines, setNbSemaines] = useState(1)
  const [semaines, setSemaines] = useState<SemaineConfig[]>([{ pct: 10, remplacements: {} }])
  const [deltaReps, setDeltaReps] = useState(2)
  const [deltaSeries, setDeltaSeries] = useState(1)
  const [saving, setSaving] = useState(false)
  const [picker, setPicker] = useState<{ exoIdx: number; semIdx: number } | null>(null)
  const [recherche, setRecherche] = useState('')
  const [exercicesBanque, setExercicesBanque] = useState<{ id: string; nom: string; familles?: { nom: string; couleur: string } | null }[]>([])

  const lignes = seance.seance_exercices || []

  useEffect(() => {
    supabase.from('exercices').select('*, familles(nom, couleur)').order('nom').then(({ data }) => {
      if (data) setExercicesBanque(data)
    })
  }, [])

  useEffect(() => {
    setSemaines(prev => {
      if (nbSemaines > prev.length)
        return [...prev, ...Array.from({ length: nbSemaines - prev.length }, (_, i) => ({ pct: prev[prev.length - 1]?.pct ?? 10, remplacements: {} }))]
      return prev.slice(0, nbSemaines)
    })
  }, [nbSemaines])

  function appliquer(ligne: SeanceExercice, pct: number) {
    const p = (v?: number, sens: 'up' | 'down' = 'up') => v == null ? v : Math.round(v * (sens === 'up' ? 1 + pct / 100 : 1 - pct / 100) * 10) / 10
    return {
      ...ligne,
      charge_kg: p(ligne.charge_kg, 'up'),
      recuperation_secondes: p(ligne.recuperation_secondes, 'down'),
      series: ligne.series == null ? ligne.series : Math.max(1, ligne.series + deltaSeries),
      repetitions: ligne.repetitions == null ? ligne.repetitions : Math.max(1, ligne.repetitions + deltaReps),
    }
  }

  async function confirmer() {
    setSaving(true)
    let currentLignes = [...lignes]
    for (let s = 0; s < nbSemaines; s++) {
      const { pct, remplacements } = semaines[s]
      const newLignes = currentLignes.map(l => appliquer(l, pct))
      const { data: ns } = await supabase.from('seances')
        .insert({ nom: `${seance.nom} — S+${s + 1}`, type: seance.type, notes: seance.notes, est_template: true, programme_id: null })
        .select().single()
      if (ns) {
        await supabase.from('seance_exercices').insert(
          newLignes.map((l, i) => ({
            seance_id: ns.id,
            exercice_id: remplacements[i]?.id ?? l.exercice_id,
            ordre: i + 1,
            series: l.series ? Math.round(l.series) : null,
            repetitions: l.repetitions ? Math.round(l.repetitions) : null,
            duree_secondes: l.duree_secondes ?? null,
            distance_metres: l.distance_metres ?? null,
            charge_kg: l.charge_kg ?? null,
            recuperation_secondes: l.recuperation_secondes ? Math.round(l.recuperation_secondes) : null,
            recuperation_inter_sets: l.recuperation_inter_sets || null,
            lien_suivant: l.lien_suivant || false,
            uni_podal: l.uni_podal || false,
            notes: l.notes ?? null,
          }))
        )
      }
      currentLignes = newLignes
    }
    setSaving(false)
    onDuplique()
    onClose()
  }

  const exosFiltres = exercicesBanque.filter(ex => ex.nom.toLowerCase().includes(recherche.toLowerCase()))

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
      <div style={{ background: '#111', border: '1px solid #2A2A2A', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px' }}>Dupliquer avec progression</h2>

        {/* 1 — Nombre de semaines */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span style={{ color: '#888', fontSize: '13px', minWidth: '50px' }}>Créer</span>
          {[1, 2, 3, 4].map(n => (
            <button key={n} onClick={() => setNbSemaines(n)} style={{
              width: '38px', height: '38px', borderRadius: '8px',
              border: `1px solid ${nbSemaines === n ? '#C9A84C' : '#2A2A2A'}`,
              background: nbSemaines === n ? '#C9A84C20' : 'transparent',
              color: nbSemaines === n ? '#C9A84C' : '#555',
              cursor: 'pointer', fontWeight: '700', fontSize: '15px',
            }}>{n}</button>
          ))}
          <span style={{ color: '#C9A84C', fontSize: '13px', fontWeight: '600' }}>
            {Array.from({ length: nbSemaines }, (_, i) => `S+${i + 1}`).join(' · ')}
          </span>
        </div>

        {/* 2 — Volume global */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', padding: '12px 14px', background: '#1A1A1A', borderRadius: '10px' }}>
          <span style={{ color: '#1A6FFF', fontWeight: '700', fontSize: '13px' }}>+/semaine</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#888', fontSize: '12px' }}>Séries</span>
            <input type="number" value={deltaSeries} onChange={e => setDeltaSeries(Number(e.target.value))}
              style={{ width: '44px', background: '#111', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '5px 6px', color: '#FFF', fontSize: '13px', outline: 'none', textAlign: 'center' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#888', fontSize: '12px' }}>Reps</span>
            <input type="number" value={deltaReps} onChange={e => setDeltaReps(Number(e.target.value))}
              style={{ width: '44px', background: '#111', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '5px 6px', color: '#FFF', fontSize: '13px', outline: 'none', textAlign: 'center' }} />
          </div>
          <span style={{ color: '#444', fontSize: '11px' }}>(négatif = réduction)</span>
        </div>

        {/* 3 — Tableau : exercices × semaines */}
        <div style={{ background: '#0A0A0A', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: `1fr ${Array(nbSemaines).fill('80px').join(' ')}`, background: '#1A1A1A', padding: '8px 12px', gap: '8px' }}>
            <span style={{ color: '#555', fontSize: '11px', textTransform: 'uppercase' }}>Exercice</span>
            {semaines.map((s, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                <span style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700' }}>S+{i + 1}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <input type="number" min={0} max={50} value={s.pct}
                    onChange={e => setSemaines(prev => prev.map((x, j) => j === i ? { ...x, pct: Number(e.target.value) } : x))}
                    style={{ width: '40px', background: '#111', border: '1px solid #C9A84C50', borderRadius: '4px', padding: '3px 4px', color: '#C9A84C', fontSize: '12px', fontWeight: '700', outline: 'none', textAlign: 'center' }} />
                  <span style={{ color: '#555', fontSize: '10px' }}>%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Lignes exercices */}
          {lignes.map((l, exoIdx) => (
            <div key={exoIdx} style={{ display: 'grid', gridTemplateColumns: `1fr ${Array(nbSemaines).fill('80px').join(' ')}`, padding: '10px 12px', gap: '8px', borderTop: '1px solid #1A1A1A', alignItems: 'center' }}>
              <span style={{ color: '#FFF', fontSize: '13px', fontWeight: '600' }}>{l.exercices?.nom}</span>
              {semaines.map((s, semIdx) => {
                const remp = s.remplacements[exoIdx]
                return (
                  <div key={semIdx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <button onClick={() => { setPicker({ exoIdx, semIdx }); setRecherche('') }} style={{
                      background: remp ? '#2ECC7115' : '#1A1A1A',
                      border: `1px solid ${remp ? '#2ECC71' : '#333'}`,
                      borderRadius: '6px', padding: '4px 6px', cursor: 'pointer',
                      fontSize: '10px', color: remp ? '#2ECC71' : '#555',
                      textAlign: 'center', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {remp ? remp.nom.split(' ')[0] + '…' : '🔄 Changer'}
                    </button>
                    {remp && (
                      <button onClick={() => setSemaines(prev => prev.map((x, j) => {
                        if (j !== semIdx) return x
                        const r = { ...x.remplacements }; delete r[exoIdx]; return { ...x, remplacements: r }
                      }))} style={{ background: 'none', border: 'none', color: '#555', fontSize: '10px', cursor: 'pointer' }}>annuler</button>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #2A2A2A', background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '14px' }}>
            Annuler
          </button>
          <button onClick={confirmer} disabled={saving} style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: saving ? '#333' : '#1A6FFF', color: '#FFF', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '14px' }}>
            {saving ? 'Création...' : `Créer ${nbSemaines} séance${nbSemaines > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>

      {/* Picker exercice */}
      {picker !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400 }}>
          <div style={{ background: '#111', border: '1px solid #2A2A2A', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '420px', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px' }}>Remplacer pour S+{picker.semIdx + 1}</div>
                <div style={{ color: '#888', fontSize: '12px' }}>{lignes[picker.exoIdx]?.exercices?.nom}</div>
              </div>
              <button onClick={() => setPicker(null)} style={{ background: 'none', border: 'none', color: '#888', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <input value={recherche} onChange={e => setRecherche(e.target.value)} placeholder="Rechercher..." autoFocus
              style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '10px 14px', color: '#FFF', fontSize: '14px', outline: 'none', marginBottom: '10px' }} />
            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {exosFiltres.map(ex => (
                <button key={ex.id} onClick={() => {
                  setSemaines(prev => prev.map((s, j) => j !== picker.semIdx ? s : {
                    ...s, remplacements: { ...s.remplacements, [picker.exoIdx]: { id: ex.id, nom: ex.nom, familles: ex.familles } }
                  }))
                  setPicker(null)
                }} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px',
                  padding: '10px 14px', cursor: 'pointer', textAlign: 'left',
                }}>
                  <span style={{ color: '#FFF', fontSize: '13px', fontWeight: '600' }}>{ex.nom}</span>
                  {ex.familles && (
                    <span style={{ fontSize: '11px', color: ex.familles.couleur, background: ex.familles.couleur + '20', padding: '2px 8px', borderRadius: '10px' }}>
                      {ex.familles.nom}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

type MsgType = {
  id: string; expediteur_id: string; destinataire_id: string
  contenu: string | null; media_url: string | null; media_type: string | null
  lu: boolean; created_at: string
}

function ChatView({ myId, otherId, height = 'calc(100vh - 220px)' }: { myId: string; otherId: string; height?: string }) {
  const [msgs, setMsgs] = useState<MsgType[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [uploading, setUploading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    load()
    markRead()
    subscribePush(myId)
    const interval = setInterval(() => { load(); markRead() }, 3000)
    return () => clearInterval(interval)
  }, [myId, otherId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  async function load() {
    const { data } = await supabase.from('messages').select('*')
      .or(`expediteur_id.eq.${myId},destinataire_id.eq.${myId}`)
      .order('created_at')
    if (data) {
      setMsgs(data.filter(m =>
        (m.expediteur_id === myId && m.destinataire_id === otherId) ||
        (m.expediteur_id === otherId && m.destinataire_id === myId)
      ))
    }
  }

  async function markRead() {
    await supabase.from('messages').update({ lu: true })
      .eq('expediteur_id', otherId).eq('destinataire_id', myId).neq('lu', true)
  }

  async function send() {
    const t = text.trim()
    if (!t || sending) return
    setSending(true)
    setText('')
    const { data: newMsg } = await supabase.from('messages')
      .insert({ expediteur_id: myId, destinataire_id: otherId, contenu: t })
      .select().single()
    if (newMsg) {
      setMsgs(prev => prev.find(m => m.id === newMsg.id) ? prev : [...prev, newMsg])
      sendPush(otherId, 'Message de votre coach', t, '/joueur')
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
      await supabase.from('messages').insert({ expediteur_id: myId, destinataire_id: otherId, media_url: publicUrl, media_type: type })
      await load()
    }
    setUploading(false)
  }

  const fmtTime = (d: string) => new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })

  let lastDate = ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height }}>
      <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display: 'none' }}
        onChange={e => { if (e.target.files?.[0]) uploadMedia(e.target.files[0]); e.target.value = '' }} />

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {msgs.length === 0 && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '13px' }}>
            Aucun message — commencez la conversation
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
                  maxWidth: '72%',
                  background: isMe ? '#1A6FFF' : '#1E1E1E',
                  borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  padding: m.media_url ? '6px' : '10px 14px',
                  position: 'relative',
                }}>
                  {m.media_url && m.media_type === 'image' && (
                    <img src={m.media_url} alt="" style={{ maxWidth: '260px', maxHeight: '300px', borderRadius: '12px', display: 'block', objectFit: 'cover' }} />
                  )}
                  {m.media_url && m.media_type === 'video' && (
                    <video src={m.media_url} controls style={{ maxWidth: '260px', borderRadius: '12px', display: 'block' }} />
                  )}
                  {m.contenu && (
                    <div style={{ fontSize: '14px', color: '#FFF', lineHeight: 1.5, wordBreak: 'break-word' }}>{m.contenu}</div>
                  )}
                  <div style={{ fontSize: '10px', color: isMe ? '#FFFFFF80' : '#555', marginTop: m.media_url ? '4px' : '3px', textAlign: isMe ? 'right' : 'left', paddingTop: m.media_url ? '2px' : 0 }}>
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
      <div style={{ padding: '12px 16px', borderTop: '1px solid #1E1E1E', display: 'flex', gap: '8px', alignItems: 'flex-end', background: '#0F0F0F' }}>
        <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{
          flexShrink: 0, width: '40px', height: '40px', borderRadius: '12px',
          background: '#1A1A1A', border: '1px solid #2A2A2A', color: uploading ? '#333' : '#888',
          cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {uploading ? '⏳' : '📎'}
        </button>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => { setText(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px' }}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="Message..."
          rows={1}
          style={{
            flex: 1, background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '14px',
            padding: '10px 14px', color: '#FFF', fontSize: '14px', outline: 'none',
            resize: 'none', maxHeight: '120px', lineHeight: 1.5, fontFamily: 'inherit',
          }}
        />
        <button onClick={send} disabled={sending || !text.trim()} style={{
          flexShrink: 0, width: '40px', height: '40px', borderRadius: '12px',
          background: text.trim() ? '#1A6FFF' : '#111', border: 'none',
          color: text.trim() ? '#FFF' : '#333', cursor: text.trim() ? 'pointer' : 'default', fontSize: '18px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
        }}>
          ↑
        </button>
      </div>
    </div>
  )
}

function Messages({ coachId, onUnreadChange }: { coachId: string | null; onUnreadChange: (n: number) => void }) {
  type JoueurMsg = { id: string; nom: string; prenom: string; email: string; auth_id: string | null }
  const [joueurs, setJoueurs] = useState<JoueurMsg[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [lastMsgs, setLastMsgs] = useState<Record<string, MsgType>>({})
  const [unread, setUnread] = useState<Record<string, number>>({})

  useEffect(() => {
    loadJoueurs()
  }, [])

  useEffect(() => {
    if (!coachId) return
    supabase.from('joueurs').update({ coach_id: coachId }).is('coach_id', null)
    loadConversations(coachId)
    const interval = setInterval(() => loadConversations(coachId), 3000)
    return () => clearInterval(interval)
  }, [coachId])

  async function loadJoueurs() {
    const { data } = await supabase.from('joueurs').select('*').eq('actif', true).order('nom')
    if (!data) return
    const mapped = data.map(j => ({ id: j.id, nom: j.nom, prenom: j.prenom, email: j.email as string, auth_id: (j.auth_id ?? null) as string | null }))
    setJoueurs(mapped)
    // Résoudre les auth_id manquants via l'API admin
    const manquants = mapped.filter(j => !j.auth_id && j.email)
    for (const j of manquants) {
      fetch(`/api/joueurs/auth-id?email=${encodeURIComponent(j.email)}`)
        .then(r => r.ok ? r.json() : null)
        .then(json => {
          if (json?.auth_id) {
            setJoueurs(prev => prev.map(p => p.id === j.id ? { ...p, auth_id: json.auth_id } : p))
          }
        })
    }
  }

  async function loadConversations(cId: string) {
    const { data } = await supabase.from('messages').select('*')
      .or(`expediteur_id.eq.${cId},destinataire_id.eq.${cId}`)
      .order('created_at', { ascending: false })
    if (!data || !Array.isArray(data)) return

    const last: Record<string, MsgType> = {}
    const unreadCounts: Record<string, number> = {}
    for (const m of data) {
      const otherId = m.expediteur_id === cId ? m.destinataire_id : m.expediteur_id
      if (!last[otherId]) last[otherId] = m
      if (m.lu !== true && m.destinataire_id === cId) {
        unreadCounts[otherId] = (unreadCounts[otherId] || 0) + 1
      }
    }
    setLastMsgs(last)
    setUnread(unreadCounts)
    const total = Object.values(unreadCounts).reduce((a, b) => a + b, 0)
    onUnreadChange(total)
  }

  const selectedJoueur = joueurs.find(j => j.id === selectedId)
  const fmtLast = (m: MsgType) => {
    if (m.media_type === 'image') return '📷 Photo'
    if (m.media_type === 'video') return '🎥 Vidéo'
    return m.contenu ? (m.contenu.length > 40 ? m.contenu.slice(0, 40) + '…' : m.contenu) : ''
  }

  // Joueurs avec ou sans auth_id — tous affichés, ceux sans sont grisés
  const joueursSorted = [...joueurs].sort((a, b) => {
    const aHas = a.auth_id ? lastMsgs[a.auth_id] ? 1 : 0.5 : 0
    const bHas = b.auth_id ? lastMsgs[b.auth_id] ? 1 : 0.5 : 0
    return bHas - aHas
  })

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>Messages</h1>
      <div style={{ display: 'flex', gap: '16px', height: 'calc(100vh - 140px)', background: '#111', borderRadius: '16px', overflow: 'hidden', border: '1px solid #2A2A2A' }}>

        {/* Liste conversations */}
        <div style={{ width: '260px', borderRight: '1px solid #1E1E1E', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #1E1E1E' }}>
            <div style={{ color: '#555', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Conversations</div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {joueurs.length === 0 && (
              <div style={{ padding: '24px 16px', color: '#333', fontSize: '13px' }}>Aucun joueur actif</div>
            )}
            {joueursSorted.map(j => {
              const last = j.auth_id ? lastMsgs[j.auth_id] : undefined
              const nbUnread = j.auth_id ? (unread[j.auth_id] || 0) : 0
              const isSelected = selectedId === j.id
              const hasAccount = !!j.auth_id
              return (
                <div key={j.id} onClick={() => {
                  if (!hasAccount) return
                  setSelectedId(j.id)
                  if (j.auth_id) {
                    setUnread(prev => { const u = { ...prev }; delete u[j.auth_id!]; return u })
                    onUnreadChange(Math.max(0, Object.values({ ...unread, [j.auth_id!]: 0 }).reduce((a, b) => a + b, 0)))
                  }
                }} style={{
                  padding: '14px 16px', cursor: hasAccount ? 'pointer' : 'default',
                  borderBottom: '1px solid #161616',
                  background: isSelected ? '#1A6FFF12' : 'transparent',
                  borderLeft: `3px solid ${isSelected ? '#1A6FFF' : 'transparent'}`,
                  opacity: hasAccount ? 1 : 0.4,
                  transition: 'all 0.1s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: isSelected ? '#1A6FFF' : '#DDD' }}>{j.prenom} {j.nom}</div>
                    {nbUnread > 0 && (
                      <span style={{ background: '#FF4757', color: '#FFF', borderRadius: '10px', fontSize: '10px', fontWeight: '800', padding: '2px 7px' }}>{nbUnread}</span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#444', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {!hasAccount ? 'Pas encore connecté' : last ? `${last.expediteur_id === coachId ? 'Vous : ' : ''}${fmtLast(last)}` : 'Démarrer la conversation'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Zone chat */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {selectedJoueur && coachId && selectedJoueur.auth_id ? (
            <>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #1E1E1E', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#1A6FFF25', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', color: '#1A6FFF' }}>
                  {selectedJoueur.prenom[0]}{selectedJoueur.nom[0]}
                </div>
                <div style={{ fontWeight: '700', fontSize: '15px' }}>{selectedJoueur.prenom} {selectedJoueur.nom}</div>
              </div>
              <ChatView key={selectedJoueur.auth_id} myId={coachId} otherId={selectedJoueur.auth_id} height="calc(100vh - 225px)" />
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', color: '#333' }}>
              <div style={{ fontSize: '32px' }}>💬</div>
              <div style={{ fontSize: '14px' }}>Sélectionne un joueur</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MultiCheck({ label, options, selected, onChange }: {
  label: string
  options: string[]
  selected: string[]
  onChange: (vals: string[]) => void
}) {
  const [open, setOpen] = useState(false)

  function toggle(val: string) {
    if (selected.includes(val)) {
      onChange(selected.filter(v => v !== val))
    } else {
      onChange([...selected, val])
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <button type="button" onClick={() => setOpen(o => !o)} style={{
        width: '100%', background: '#1A1A1A', border: '1px solid #2A2A2A',
        borderRadius: '8px', padding: '11px 14px', color: selected.length ? '#FFF' : '#555',
        fontSize: '14px', outline: 'none', cursor: 'pointer', textAlign: 'left',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span>{selected.length ? selected.join(', ') : label}</span>
        <span style={{ color: '#555', fontSize: '12px' }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200,
          background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px',
          maxHeight: '220px', overflowY: 'auto', marginTop: '4px',
        }}>
          {options.map(opt => (
            <label key={opt} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px', cursor: 'pointer',
              background: selected.includes(opt) ? '#1A6FFF15' : 'transparent',
            }}>
              <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)}
                style={{ accentColor: '#1A6FFF', width: '14px', height: '14px' }} />
              <span style={{ color: selected.includes(opt) ? '#1A6FFF' : '#CCC', fontSize: '13px' }}>{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
