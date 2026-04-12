'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { subscribePush, sendPush } from '@/lib/push'
import { useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'joueurs', label: 'Joueurs', icon: '👥' },
  { id: 'exercices', label: 'Exercices', icon: '⚡' },
  { id: 'modeles', label: 'Modèles', icon: '🗓️' },
  { id: 'programmes', label: 'Séances', icon: '📋' },
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
    <div className="app-shell">

      {/* Backdrop mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 40 }}
        />
      )}

      {/* Sidebar */}
      <div className="sidebar" style={{
        width: '220px',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 12px',
        position: 'fixed',
        height: '100vh',
        zIndex: 50,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{ marginBottom: '24px', paddingLeft: '6px', flexShrink: 0 }}>
          <div className="sidebar-logo">
            <span className="sidebar-logo-paga">PAGA</span>
            <span className="sidebar-logo-coaching">COACHING</span>
          </div>
          <div className="sidebar-accent" />
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => navTo(item.id)}
              className={`nav-item${activeTab === item.id ? ' active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.id === 'messages' && unreadMessages > 0 && (
                <span className="nav-badge">{unreadMessages}</span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ flexShrink: 0, paddingTop: '8px' }}>
          <button onClick={handleLogout} className="btn-logout">
            <span>🚪</span> Déconnexion
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="main-content" style={{ flex: 1, padding: '20px 20px 32px', minWidth: 0 }}>
        {/* Barre top avec hamburger */}
        <div className="topbar">
          <button onClick={() => setSidebarOpen(true)} className="btn-hamburger">
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
          <div className="topbar-title">
            {NAV_ITEMS.find(n => n.id === activeTab)?.icon}{' '}
            {NAV_ITEMS.find(n => n.id === activeTab)?.label}
          </div>
        </div>

        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'joueurs' && <Joueurs />}
        {activeTab === 'exercices' && <Exercices />}
        {activeTab === 'modeles' && <Modeles />}
        {activeTab === 'programmes' && <Programmes />}
        {activeTab === 'messages' && <Messages coachId={coachId} onUnreadChange={setUnreadMessages} />}
      </div>
    </div>
  )
}

function Dashboard() {
  return (
    <div className="page-section">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-0.5px', marginBottom: '6px' }}>
          Bonjour Stéphane 👋
        </h1>
        <p style={{ color: '#666', fontSize: '14px' }}>Voici l'activité de tes joueurs aujourd'hui</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' }}>
        {[
          { label: 'Joueurs actifs',     value: '0', color: '#5599FF', icon: '👥', glow: '#1A6FFF' },
          { label: 'Séances du jour',    value: '0', color: '#D4AF60', icon: '📅', glow: '#C9A84C' },
          { label: 'Séances complétées', value: '0', color: '#3DD68C', icon: '✓',  glow: '#2ECC71' },
        ].map(stat => (
          <div key={stat.label} className="stat-card" style={{ color: stat.color }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ fontSize: '22px', opacity: 0.8 }}>{stat.icon}</div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: stat.glow, boxShadow: `0 0 8px ${stat.glow}` }} />
            </div>
            <div style={{ fontSize: '40px', fontWeight: '900', lineHeight: 1, letterSpacing: '-1px' }}>{stat.value}</div>
            <div style={{ color: '#666', fontSize: '12px', fontWeight: '600', marginTop: '8px', letterSpacing: '0.3px', textTransform: 'uppercase' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ width: '3px', height: '20px', background: 'linear-gradient(180deg, #C9A84C, transparent)', borderRadius: '2px' }} />
          <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#D4AF60', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Activité joueurs — Aujourd'hui
          </h2>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">🏃</div>
          <div className="empty-state-text">Aucun joueur ajouté pour l'instant.<br />Commence par créer ton premier joueur.</div>
        </div>
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
    const [{ data: exs, error: exsError }, { data: fams }] = await Promise.all([
      supabase.from('exercices').select('*, familles(nom, couleur)').order('nom').limit(5000),
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
      const { error } = await supabase.from('exercices').update(payload).eq('id', editEx.id)
      if (error) { alert('Erreur modification : ' + error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from('exercices').insert(payload).select()
      if (error) { alert('Erreur création : ' + error.message); setSaving(false); return }
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
                  <iframe
                    src={src}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                </div>
              ) : null
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

type SetConfig = {
  reps?: number
  duree?: number
  dist?: number
  charge?: number
  recup?: number
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
  sets_config?: SetConfig[]
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

type Programme = {
  id: string
  nom: string
  description?: string
  objectif?: string
}

type SeanceProg = {
  id: string
  nom: string
  type: string
  jour_semaine: number
  semaine: number
  seance_exercices?: { id: string }[]
}

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const JOURS_FULL = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const TYPES_SEANCE = ['complete', 'echauffement', 'corps', 'retour_au_calme']
const LABELS_TYPE: Record<string, string> = {
  complete: 'Complète', echauffement: 'Échauffement',
  corps: 'Corps de séance', retour_au_calme: 'Retour au calme',
}

// ─── COULEURS PAR TYPE ────────────────────────────────────────────
const TYPE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  complete:         { bg: '#1A6FFF18', border: '#1A6FFF50', text: '#6AAEFF' },
  echauffement:     { bg: '#2ECC7118', border: '#2ECC7150', text: '#2ECC71' },
  corps:            { bg: '#C9A84C18', border: '#C9A84C50', text: '#C9A84C' },
  retour_au_calme:  { bg: '#9B59B618', border: '#9B59B650', text: '#C39BD3' },
}

// ─── MODELES COMPONENT ────────────────────────────────────────────
function Modeles() {
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [selectedProg, setSelectedProg] = useState<Programme | null>(null)
  const [seancesProg, setSeancesProg] = useState<SeanceProg[]>([])
  const [templates, setTemplates] = useState<Seance[]>([])
  const [exercices, setExercices] = useState<Exercice[]>([])
  const [nbSemaines, setNbSemaines] = useState(4)
  const [showNewProg, setShowNewProg] = useState(false)
  const [newProgNom, setNewProgNom] = useState('')
  const [newProgObj, setNewProgObj] = useState('')
  const [showPicker, setShowPicker] = useState<{ semaine: number; jour: number } | null>(null)
  const [showAssign, setShowAssign] = useState(false)
  const [editingSeanceProg, setEditingSeanceProg] = useState<SeanceProg | null>(null)
  const [rechercheTemplate, setRechercheTemplate] = useState('')

  useEffect(() => { loadProgrammes() }, [])

  useEffect(() => {
    if (selectedProg) loadSeancesProg(selectedProg.id)
  }, [selectedProg])

  async function loadProgrammes() {
    const { data } = await supabase.from('programmes').select('*').order('nom')
    if (data) {
      setProgrammes(data)
      if (data.length > 0 && !selectedProg) setSelectedProg(data[0])
    }
    const [{ data: tpls }, { data: exs }] = await Promise.all([
      supabase.from('seances').select('*, seance_exercices(id)').eq('est_template', true).order('nom'),
      supabase.from('exercices').select('*, familles(id, nom, couleur)').order('nom'),
    ])
    if (tpls) setTemplates(tpls)
    if (exs) setExercices(exs)
  }

  async function loadSeancesProg(progId: string) {
    const { data } = await supabase
      .from('seances')
      .select('id, nom, type, jour_semaine, semaine, seance_exercices(id)')
      .eq('programme_id', progId)
      .order('semaine').order('jour_semaine')
    if (data) {
      setSeancesProg(data as SeanceProg[])
      // compute nb semaines
      const max = data.reduce((m, s) => Math.max(m, s.semaine || 1), 1)
      setNbSemaines(Math.max(max, 4))
    }
  }

  async function creerProgramme() {
    if (!newProgNom.trim()) return
    const { data, error } = await supabase.from('programmes')
      .insert({ nom: newProgNom.trim(), objectif: newProgObj.trim() || null })
      .select().single()
    setShowNewProg(false)
    setNewProgNom('')
    setNewProgObj('')
    if (error) {
      alert(`Erreur création modèle : ${error.message}\n\nVérifie que la table "programmes" existe dans Supabase (voir DEBUG.md §5).`)
      return
    }
    if (data) {
      await loadProgrammes()
      setSelectedProg(data)
    }
  }

  async function supprimerProgramme(id: string) {
    if (!confirm('Supprimer ce modèle et toutes ses séances ?')) return
    await supabase.from('seances').delete().eq('programme_id', id)
    await supabase.from('programmes').delete().eq('id', id)
    setSelectedProg(null)
    loadProgrammes()
  }

  async function ajouterSessionSlot(semaine: number, jour: number, template: Seance) {
    if (!selectedProg) return
    // Créer une nouvelle séance liée au programme
    const { data: newSeance } = await supabase.from('seances')
      .insert({ nom: template.nom, type: template.type, programme_id: selectedProg.id, jour_semaine: jour, semaine, est_template: false })
      .select().single()
    if (!newSeance) return

    // Copier les exercices du template
    if (template.seance_exercices && template.seance_exercices.length > 0) {
      const { data: exos } = await supabase
        .from('seance_exercices')
        .select('*')
        .eq('seance_id', template.id)
        .order('ordre')
      if (exos && exos.length > 0) {
        await supabase.from('seance_exercices').insert(
          exos.map(e => ({
            seance_id: newSeance.id, exercice_id: e.exercice_id, ordre: e.ordre,
            series: e.series, repetitions: e.repetitions, duree_secondes: e.duree_secondes,
            distance_metres: e.distance_metres, charge_kg: e.charge_kg,
            recuperation_secondes: e.recuperation_secondes, lien_suivant: e.lien_suivant,
            uni_podal: e.uni_podal, notes: e.notes, sets_config: e.sets_config,
          }))
        )
      }
    }
    setShowPicker(null)
    loadSeancesProg(selectedProg.id)
  }

  async function supprimerSessionSlot(seanceId: string) {
    await supabase.from('seances').delete().eq('id', seanceId)
    if (selectedProg) loadSeancesProg(selectedProg.id)
  }

  const templatesFiltres = templates.filter(t =>
    t.nom.toLowerCase().includes(rechercheTemplate.toLowerCase())
  )

  // Organiser sessions par [semaine][jour]
  const grid: Record<number, Record<number, SeanceProg[]>> = {}
  for (let s = 1; s <= nbSemaines; s++) {
    grid[s] = {}
    for (let j = 1; j <= 7; j++) grid[s][j] = []
  }
  for (const s of seancesProg) {
    if (s.semaine && s.jour_semaine) {
      if (!grid[s.semaine]) grid[s.semaine] = {}
      if (!grid[s.semaine][s.jour_semaine]) grid[s.semaine][s.jour_semaine] = []
      grid[s.semaine][s.jour_semaine].push(s)
    }
  }

  if (editingSeanceProg) {
    const seanceFull: Seance = {
      id: editingSeanceProg.id, nom: editingSeanceProg.nom,
      type: editingSeanceProg.type, est_template: false, seance_exercices: [],
    }
    return <EditeurSeance
      seance={seanceFull}
      exercices={exercices}
      onSave={async () => {
        setEditingSeanceProg(null)
        if (selectedProg) loadSeancesProg(selectedProg.id)
      }}
      onCancel={() => setEditingSeanceProg(null)}
    />
  }

  return (
    <div className="page-section">

      {/* ─── Barre du haut : sélecteur + nouveau ─── */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '160px' }}>
          {programmes.length === 0 ? (
            <div style={{ color: '#444', fontSize: '13px' }}>Aucun modèle — crée-en un !</div>
          ) : (
            <select
              value={selectedProg?.id || ''}
              onChange={e => {
                const p = programmes.find(x => x.id === e.target.value)
                if (p) setSelectedProg(p)
              }}
              className="select"
              style={{ width: '100%', fontWeight: '700' }}
            >
              {programmes.map(p => (
                <option key={p.id} value={p.id}>{p.nom}</option>
              ))}
            </select>
          )}
        </div>
        <button onClick={() => setShowNewProg(true)} className="btn btn-primary btn-sm">+ Nouveau</button>
        {selectedProg && (
          <>
            <button onClick={() => setNbSemaines(n => Math.max(1, n - 1))} className="btn btn-ghost btn-sm">−</button>
            <span style={{ color: '#888', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }}>{nbSemaines} sem.</span>
            <button onClick={() => setNbSemaines(n => n + 1)} className="btn btn-ghost btn-sm">+</button>
            <button onClick={() => setShowAssign(true)} className="btn btn-success btn-sm">Attribuer →</button>
            <button onClick={() => supprimerProgramme(selectedProg.id)} className="btn btn-danger btn-sm">✕</button>
          </>
        )}
      </div>

      {/* ─── Grille plein écran ─── */}
      {!selectedProg ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">🗓️</div>
            <div className="empty-state-text">Sélectionne ou crée un modèle</div>
          </div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: 'calc(100svh - 200px)', borderRadius: '12px', border: '1px solid #1A1A22', background: '#0D0D10' }}>
          <table className="data-table" style={{ minWidth: '640px', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '44px', textAlign: 'left' }}>SEM.</th>
                {JOURS_FULL.map(j => (
                  <th key={j} style={{ textAlign: 'center', minWidth: '90px' }}>{j}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: nbSemaines }, (_, si) => {
                const sem = si + 1
                return (
                  <tr key={sem}>
                    <td style={{ verticalAlign: 'top', background: '#0B0B0E', padding: '8px 6px' }}>
                      <div style={{ fontSize: '11px', fontWeight: '900', color: '#3A3A50' }}>S{sem}</div>
                    </td>
                    {Array.from({ length: 7 }, (_, ji) => {
                      const jour = ji + 1
                      const sessions = grid[sem]?.[jour] || []
                      return (
                        <td key={jour} className="cal-cell" style={{ verticalAlign: 'top' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {sessions.map(s => {
                              const tc = TYPE_COLORS[s.type] || TYPE_COLORS.complete
                              return (
                                <div key={s.id} className="cal-session-card"
                                  style={{ background: tc.bg, border: `1px solid ${tc.border}`, display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                                  <div style={{ flex: 1, color: tc.text, fontWeight: '700', lineHeight: 1.3, cursor: 'pointer', fontSize: '11px' }}
                                    onClick={() => setEditingSeanceProg(s)}>
                                    {s.nom}
                                    {s.seance_exercices && s.seance_exercices.length > 0 && (
                                      <div style={{ color: '#555', fontSize: '10px', fontWeight: '400', marginTop: '2px' }}>
                                        {s.seance_exercices.length} exo{s.seance_exercices.length > 1 ? 's' : ''}
                                      </div>
                                    )}
                                  </div>
                                  <button onClick={() => supprimerSessionSlot(s.id)} style={{
                                    background: 'transparent', border: 'none', color: '#2A2A3A',
                                    cursor: 'pointer', fontSize: '11px', padding: '0 1px', lineHeight: 1, flexShrink: 0, transition: 'color 0.15s',
                                  }}
                                  onMouseEnter={e => (e.currentTarget.style.color = '#FF4757')}
                                  onMouseLeave={e => (e.currentTarget.style.color = '#2A2A3A')}
                                  >✕</button>
                                </div>
                              )
                            })}
                            <button className="cal-add-btn" onClick={() => { setShowPicker({ semaine: sem, jour }); setRechercheTemplate('') }}>+</button>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── Modal nouveau programme ─── */}
      {showNewProg && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '420px' }}>
            <div className="modal-title">Nouveau modèle</div>
            <div className="modal-subtitle">Crée un plan type (semaine, mois) à attribuer à tes joueurs</div>
            <input value={newProgNom} onChange={e => setNewProgNom(e.target.value)}
              className="input" placeholder="Nom du modèle (ex: Accompagnement CYCLE 1) *"
              style={{ marginBottom: '10px' }} />
            <input value={newProgObj} onChange={e => setNewProgObj(e.target.value)}
              className="input" placeholder="Objectif (optionnel)"
              style={{ marginBottom: '24px' }} />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowNewProg(false)} className="btn btn-ghost">Annuler</button>
              <button onClick={creerProgramme} className="btn btn-primary">Créer le modèle</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal picker séance template ─── */}
      {showPicker && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '480px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <div className="modal-title" style={{ marginBottom: '2px' }}>Ajouter une séance</div>
                <div style={{ color: '#5599FF', fontSize: '12px', fontWeight: '600' }}>
                  {JOURS_FULL[showPicker.jour - 1]} · Semaine {showPicker.semaine}
                </div>
              </div>
              <button onClick={() => setShowPicker(null)} className="btn btn-ghost btn-sm" style={{ fontSize: '16px', padding: '6px 10px' }}>✕</button>
            </div>
            <input value={rechercheTemplate} onChange={e => setRechercheTemplate(e.target.value)}
              className="input" placeholder="Rechercher une séance..."
              style={{ marginBottom: '12px' }} />
            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {templatesFiltres.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">📋</div>
                  <div className="empty-state-text">Aucune séance template trouvée.<br />Crée-en une dans l'onglet <strong>Séances</strong>.</div>
                </div>
              )}
              {templatesFiltres.map(t => {
                const tc = TYPE_COLORS[t.type] || TYPE_COLORS.complete
                return (
                  <button key={t.id} onClick={() => ajouterSessionSlot(showPicker.semaine, showPicker.jour, t)}
                    className="list-item" style={{ textAlign: 'left', border: '1px solid #1A1A22' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: tc.text, flexShrink: 0, boxShadow: `0 0 6px ${tc.text}60` }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#F0F0F8', fontSize: '13px', fontWeight: '700' }}>{t.nom}</div>
                      <div style={{ color: '#555', fontSize: '11px', marginTop: '2px' }}>
                        {LABELS_TYPE[t.type]} · {t.seance_exercices?.length || 0} exercice{(t.seance_exercices?.length || 0) > 1 ? 's' : ''}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal attribution ─── */}
      {showAssign && selectedProg && (
        <AssignProgrammeModal
          programme={selectedProg}
          seances={seancesProg}
          onClose={() => setShowAssign(false)}
        />
      )}
    </div>
  )
}

function AssignProgrammeModal({ programme, seances, onClose }: {
  programme: Programme
  seances: SeanceProg[]
  onClose: () => void
}) {
  const [joueurs, setJoueurs] = useState<{ id: string; nom: string; prenom: string }[]>([])
  const [selectedJoueurs, setSelectedJoueurs] = useState<Set<string>>(new Set())
  const [dateDebut, setDateDebut] = useState(() => new Date().toISOString().split('T')[0])
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
    if (selectedJoueurs.size === 0) return
    setSaving(true)
    const debut = new Date(dateDebut + 'T12:00:00')

    for (const joueurId of selectedJoueurs) {
      // Créer l'entrée joueur_programme
      await supabase.from('joueur_programmes').insert({
        joueur_id: joueurId, programme_id: programme.id,
        date_debut: dateDebut, actif: true,
      })

      // Créer les réalisations pour chaque séance
      if (seances.length > 0) {
        const rows = seances.map(s => {
          const d = new Date(debut)
          d.setDate(d.getDate() + (s.semaine - 1) * 7 + (s.jour_semaine - 1))
          return {
            joueur_id: joueurId, seance_id: s.id,
            date_realisation: d.toISOString().split('T')[0], completee: false,
          }
        })
        await supabase.from('realisations').insert(rows)
      }
    }

    setSaving(false)
    onClose()
    alert(`✓ Modèle "${programme.nom}" attribué à ${selectedJoueurs.size} joueur${selectedJoueurs.size > 1 ? 's' : ''}`)
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 400 }}>
      <div className="modal-box" style={{ maxWidth: '500px' }}>
        <div className="modal-title">Attribuer le modèle</div>
        <div className="modal-subtitle">{programme.nom} · {seances.length} séance{seances.length > 1 ? 's' : ''}</div>

        {/* Date de début */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#9494A0', fontWeight: '600', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Date de début</label>
          <input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)} className="input" style={{ width: 'auto' }} />
          <div style={{ color: '#444', fontSize: '12px', marginTop: '8px' }}>
            Les séances seront placées selon leur position (semaine × jour) dans le modèle.
          </div>
        </div>

        <hr className="divider" />

        {/* Joueurs */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ color: '#9494A0', fontWeight: '600', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
            Joueurs {selectedJoueurs.size > 0 && <span style={{ color: '#5599FF' }}>— {selectedJoueurs.size} sélectionné{selectedJoueurs.size > 1 ? 's' : ''}</span>}
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '260px', overflowY: 'auto' }}>
            {joueurs.length === 0 && <div style={{ color: '#444', fontSize: '13px' }}>Aucun joueur actif</div>}
            {joueurs.map(j => {
              const sel = selectedJoueurs.has(j.id)
              return (
                <button key={j.id} onClick={() => toggleJoueur(j.id)}
                  className={`list-item${sel ? ' list-item-active' : ''}`}
                  style={{ border: sel ? '1px solid #1A6FFF40' : '1px solid #1A1A22', cursor: 'pointer', textAlign: 'left' }}>
                  <div className={`checkbox-custom${sel ? ' checked' : ''}`}>{sel ? '✓' : ''}</div>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: sel ? '#F0F0F8' : '#9494A0', fontSize: '14px', fontWeight: sel ? '700' : '400' }}>
                      {j.prenom} {j.nom}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-ghost">Annuler</button>
          <button onClick={confirmer} disabled={saving || selectedJoueurs.size === 0}
            className={`btn${selectedJoueurs.size > 0 ? ' btn-success' : ''}`}
            style={selectedJoueurs.size === 0 ? { background: '#1A1A22', color: '#3A3A50', cursor: 'not-allowed', padding: '10px 20px' } : {}}>
            {saving ? 'Attribution...' : `Confirmer l'attribution`}
          </button>
        </div>
      </div>
    </div>
  )
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
      supabase.from('seances').select('*, seance_exercices(*, exercices(nom, familles(id, nom, couleur)))').eq('est_template', true).order('nom'),
      supabase.from('exercices').select('*, familles(id, nom, couleur)').order('nom'),
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
    <div className="page-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">Séances templates</h1>
          <p className="page-subtitle">{templates.length} séance{templates.length > 1 ? 's' : ''} · Sélectionne et attribue à tes joueurs</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {selection.size > 0 && (
            <button onClick={() => setShowAttrib(true)} className="btn btn-success">
              Attribuer ({selection.size}) →
            </button>
          )}
          {selection.size > 0 && (
            <button onClick={() => setSelection(new Set())} className="btn btn-ghost btn-sm">Tout désélectionner</button>
          )}
          <button onClick={nouvelleSeance} className="btn btn-primary">+ Nouvelle séance</button>
        </div>
      </div>

      {selection.size > 0 && (
        <div style={{ background: '#2ECC7110', border: '1px solid #2ECC7125', borderRadius: '10px', padding: '10px 16px', marginBottom: '16px', fontSize: '13px', color: '#3DD68C', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2ECC71', boxShadow: '0 0 6px #2ECC71' }} />
          {selection.size} séance{selection.size > 1 ? 's' : ''} sélectionnée{selection.size > 1 ? 's' : ''} — clique sur "Attribuer" pour les assigner à un joueur
        </div>
      )}

      {templates.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-text">Aucune séance template.<br />Crée ta première séance !</div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {templates.map(s => {
            const selected = selection.has(s.id)
            const tc = TYPE_COLORS[s.type] || TYPE_COLORS.complete
            const exoCount = s.seance_exercices?.length || 0
            return (
              <div key={s.id} className={`card${selected ? ' card-selected' : ''}`}
                style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button onClick={() => toggleSelect(s.id)}
                  className={`checkbox-custom${selected ? ' checked' : ''}`}
                  style={{ borderColor: selected ? '#2ECC71' : undefined, background: selected ? '#2ECC71' : undefined, boxShadow: selected ? '0 0 8px #2ECC7140' : undefined }}>
                  {selected ? '✓' : ''}
                </button>

                <div style={{ width: '3px', height: '36px', borderRadius: '2px', background: tc.text, opacity: 0.7, flexShrink: 0 }} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '3px' }} className="truncate">{s.nom}</div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="badge" style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.border}`, padding: '2px 8px', fontSize: '10px' }}>{LABELS_TYPE[s.type] || s.type}</span>
                    <span style={{ color: '#444', fontSize: '11px' }}>{exoCount} exercice{exoCount > 1 ? 's' : ''}</span>
                    {s.notes && <span style={{ color: '#333', fontSize: '11px' }} className="truncate">· {s.notes.substring(0, 40)}</span>}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button onClick={() => toggleSelect(s.id)} className="btn btn-ghost btn-sm"
                    style={selected ? { borderColor: '#2ECC7140', color: '#3DD68C', background: '#2ECC7110' } : {}}>
                    {selected ? '✓' : 'Sélectionner'}
                  </button>
                  <button onClick={() => editSeance(s)} className="btn btn-ghost btn-sm">Éditer</button>
                  <button onClick={() => deleteSeance(s.id)} className="btn btn-danger btn-sm">✕</button>
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

// ─── Helper : extraire l'ID YouTube d'une URL ──────────────────────
function getYoutubeId(url: string): string | null {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}

// ─── Helper : extraire l'ID Vimeo d'une URL ────────────────────────
function getVimeoId(url: string): string | null {
  if (!url) return null
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return m ? m[1] : null
}

// ─── Emojis par famille ─────────────────────────────────────────────
const FAMILLE_EMOJI: Record<string, string> = {
  'Vitesse': '⚡', 'Accélération': '🏃', 'Décélération': '🛑',
  'Force': '💪', 'Puissance': '🔥', 'Pliométrie': '🦘',
  'Coordination': '🎯', 'Appuis': '👟', 'COD': '↩️',
  'Mobilité': '🔄', 'Stretch': '🧘', 'Prévention': '🛡️',
  'Cardio': '❤️', 'Proprioception': '⚖️',
  'Technique de base': '🎓', 'Technique athlétique': '🏆',
}

// ─── Vignette vidéo ────────────────────────────────────────────────
function VideoThumb({ url, size = 72, famille }: { url?: string | null; size?: number; famille?: Famille }) {
  const [hovered, setHovered] = useState(false)
  const ytId = url ? getYoutubeId(url) : null
  const vimeoId = url ? getVimeoId(url) : null

  // Bouton play réutilisable
  const PlayBtn = ({ small = false }: { small?: boolean }) => (
    <div style={{
      width: small ? 22 : 28, height: small ? 22 : 28, borderRadius: '50%',
      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
    }}>
      <div style={{
        width: 0, height: 0, borderStyle: 'solid',
        borderWidth: small ? '4px 0 4px 7px' : '5px 0 5px 9px',
        borderColor: `transparent transparent transparent #111`,
        marginLeft: small ? '2px' : '2px',
      }} />
    </div>
  )

  // Pas de vidéo → placeholder famille
  if (!url) {
    const color = famille?.couleur || '#6B7280'
    const emoji = famille ? (FAMILLE_EMOJI[famille.nom] || '🏅') : '▷'
    const hex = color.replace('#', '')
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return (
      <div style={{
        width: size, height: size, borderRadius: '10px',
        background: `linear-gradient(135deg, rgba(${r},${g},${b},0.35) 0%, rgba(${r},${g},${b},0.15) 100%)`,
        border: `1.5px solid rgba(${r},${g},${b},0.5)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: size * 0.42, lineHeight: 1 }}>{emoji}</span>
      </div>
    )
  }

  // YouTube
  if (ytId) {
    const thumb = `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
    return (
      <div style={{ position: 'relative', width: size, height: size * 0.56, flexShrink: 0 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {!hovered && (
          <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer' }}>
            <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
              <PlayBtn />
            </div>
          </div>
        )}
        {hovered && (
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&modestbranding=1`}
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px', display: 'block' }}
            allow="autoplay"
          />
        )}
      </div>
    )
  }

  // Vimeo — embed iframe uniquement (pas de <video> direct, Vimeo l'interdit)
  if (vimeoId) {
    return (
      <div style={{ position: 'relative', width: size, height: size * 0.56, flexShrink: 0, borderRadius: '8px', overflow: 'hidden' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {!hovered ? (
          // Placeholder Vimeo avec couleur de la famille
          <div style={{
            width: '100%', height: '100%', cursor: 'pointer',
            background: 'linear-gradient(135deg, #1AB7EA22, #1AB7EA0A)',
            border: '1.5px solid #1AB7EA40',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px',
          }}>
            <PlayBtn small={size < 60} />
            <span style={{ fontSize: '8px', fontWeight: '800', color: '#1AB7EA', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Vimeo</span>
          </div>
        ) : (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&background=1`}
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            allow="autoplay; fullscreen"
          />
        )}
      </div>
    )
  }

  // URL directe (mp4) — uniquement si ce n'est pas Vimeo/YouTube
  return (
    <div style={{ width: size, height: size * 0.56, borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#111' }}>
      <video
        src={url}
        muted
        loop
        playsInline
        preload="metadata"
        onMouseEnter={e => (e.currentTarget as HTMLVideoElement).play().catch(() => {})}
        onMouseLeave={e => { const v = e.currentTarget as HTMLVideoElement; v.pause(); v.currentTime = 0 }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'pointer' }}
      />
    </div>
  )
}

// ─── Picker exercice multi-sélection + filtres familles ───────────
function ExercicePicker({ exercices, onConfirm, onClose }: {
  exercices: Exercice[]
  onConfirm: (exs: Exercice[]) => void
  onClose: () => void
}) {
  const [recherche, setRecherche] = useState('')
  const [filtresFamille, setFiltresFamille] = useState<string[]>([])
  const [selection, setSelection] = useState<Set<string>>(new Set())

  // Familles uniques triées (id inclus dans la requête familles(id, nom, couleur))
  const familles = Array.from(
    new Map(
      exercices
        .filter(e => e.familles?.id)
        .map(e => [e.familles!.id, e.familles!])
    ).values()
  ).sort((a, b) => a.nom.localeCompare(b.nom))

  const filtres = exercices
    .filter(e => filtresFamille.length === 0 || (e.familles?.id && filtresFamille.includes(e.familles.id)))
    .filter(e =>
      e.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      (e.familles?.nom || '').toLowerCase().includes(recherche.toLowerCase())
    )

  function toggleEx(id: string) {
    setSelection(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleConfirm() {
    const choisis = exercices.filter(e => selection.has(e.id))
    if (choisis.length > 0) onConfirm(choisis)
    else onClose()
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 200, alignItems: 'flex-end' }}>
      <div className="modal-box" style={{
        maxWidth: '600px', width: '100%',
        height: '92vh', display: 'flex', flexDirection: 'column',
        borderRadius: '20px 20px 0 0', margin: 0, padding: '0',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: '#2A2A35' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px 10px' }}>
          <div className="modal-title" style={{ flex: 1, marginBottom: 0, fontSize: '17px' }}>Ajouter des exercices</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '20px', lineHeight: 1, padding: '4px' }}>✕</button>
        </div>

        {/* Recherche */}
        <div style={{ padding: '0 12px 10px' }}>
          <input
            autoFocus
            value={recherche}
            onChange={e => setRecherche(e.target.value)}
            placeholder="Rechercher par nom..."
            className="input"
            style={{ fontSize: '14px' }}
          />
        </div>

        {/* Corps : sidebar familles + liste exercices */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Sidebar familles (gauche) */}
          <div style={{
            width: '90px', flexShrink: 0,
            overflowY: 'auto', borderRight: '1px solid #1A1A28',
            display: 'flex', flexDirection: 'column', gap: '2px', padding: '4px 6px',
          }}>
            <button
              onClick={() => setFiltresFamille([])}
              style={{
                padding: '8px 6px', borderRadius: '8px', border: 'none',
                background: filtresFamille.length === 0 ? 'rgba(0,122,255,0.18)' : 'transparent',
                color: filtresFamille.length === 0 ? '#007AFF' : '#555',
                fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                textAlign: 'center', lineHeight: '1.2',
              }}>Tous</button>
            {familles.map(f => {
              const actif = filtresFamille.includes(f.id)
              return (
                <button key={f.id}
                  onClick={() => setFiltresFamille(prev => actif ? prev.filter(id => id !== f.id) : [...prev, f.id])}
                  style={{
                    padding: '8px 6px', borderRadius: '8px', border: 'none',
                    background: actif ? f.couleur + '28' : 'transparent',
                    color: actif ? f.couleur : '#555',
                    fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                    textAlign: 'center', lineHeight: '1.2',
                  }}>{f.nom}</button>
              )
            })}
          </div>

          {/* Liste exercices (droite) */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', padding: '4px 8px' }}>
            {filtres.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <div className="empty-state-text">Aucun exercice trouvé</div>
              </div>
            )}
            {filtres.map(ex => {
              const selected = selection.has(ex.id)
              return (
                <button key={ex.id} onClick={() => toggleEx(ex.id)}
                  style={{
                    display: 'flex', gap: '10px', alignItems: 'center',
                    padding: '9px 10px', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', width: '100%',
                    background: selected ? 'rgba(0,122,255,0.1)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${selected ? 'rgba(0,122,255,0.4)' : '#1A1A28'}`,
                    transition: 'all 0.15s ease',
                  }}>
                  <VideoThumb url={ex.video_url} size={44} famille={ex.familles} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '700', fontSize: '13px', color: selected ? '#60B8FF' : '#F0F0F8', marginBottom: '2px' }} className="truncate">
                      {ex.nom}
                    </div>
                    {ex.familles && (
                      <span style={{
                        fontSize: '10px', fontWeight: '700',
                        color: ex.familles.couleur,
                      }}>{ex.familles.nom}</span>
                    )}
                  </div>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                    background: selected ? '#007AFF' : 'transparent',
                    border: `2px solid ${selected ? '#007AFF' : '#333'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}>
                    {selected && <span style={{ color: '#FFF', fontSize: '13px', lineHeight: 1 }}>✓</span>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer — bouton Ajouter */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #1A1A28' }}>
          <button onClick={handleConfirm}
            className="btn btn-primary btn-block btn-lg"
            style={{ borderRadius: '14px' }}>
            {selection.size === 0
              ? 'Fermer'
              : `Ajouter ${selection.size} exercice${selection.size > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
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


  function ajouterExercices(exs: Exercice[]) {
    setLignes(prev => {
      const base = prev.length
      return [...prev, ...exs.map((ex, i) => ({
        exercice_id: ex.id, ordre: base + i + 1,
        series: undefined, repetitions: undefined, duree_secondes: undefined,
        distance_metres: undefined, charge_kg: undefined, recuperation_secondes: undefined,
        notes: '', sets_config: undefined, exercices: { nom: ex.nom, familles: ex.familles },
      }))]
    })
    setShowPicker(false)
    setRecherche('')
  }

  function updateLigne(idx: number, key: keyof SeanceExercice, val: string) {
    setLignes(prev => prev.map((l, i) => i === idx ? { ...l, [key]: val === '' ? undefined : key === 'notes' ? val : Math.max(0, Number(val)) } : l))
  }

  function handleSeriesChange(idx: number, val: string) {
    const n = val === '' ? undefined : Math.max(1, Number(val))
    setLignes(prev => prev.map((l, i) => {
      if (i !== idx) return l
      if (!n) return { ...l, series: undefined, sets_config: undefined }
      const current = l.sets_config || []
      const s1 = current[0] || { reps: l.repetitions, duree: l.duree_secondes, dist: l.distance_metres, charge: l.charge_kg, recup: l.recuperation_secondes }
      const newSets: SetConfig[] = Array.from({ length: n }, (_, si) => current[si] || { ...s1 })
      return { ...l, series: n, sets_config: newSets }
    }))
  }

  function updateSetField(idx: number, setIdx: number, key: keyof SetConfig, val: string) {
    setLignes(prev => prev.map((l, i) => {
      if (i !== idx || !l.sets_config) return l
      const newSets = l.sets_config.map((s, si) =>
        si === setIdx ? { ...s, [key]: val === '' ? undefined : Math.max(0, Number(val)) } : s
      )
      return { ...l, sets_config: newSets }
    }))
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
    console.log('handleSave — lignes:', lignes.length, lignes.map(l => l.exercice_id))
    setSaving(true)
    let seanceId = seance.id

    if (!seanceId) {
      const estTemplate = joueurId ? (sauvegarderFavori ?? false) : true
      const { data, error } = await supabase.from('seances').insert({ nom, type, notes: notes || null, est_template: estTemplate, programme_id: null }).select().single()
      if (error || !data?.id) {
        alert('Erreur création séance : ' + (error?.message || 'données manquantes'))
        setSaving(false)
        return
      }
      seanceId = data.id
    } else {
      const { error } = await supabase.from('seances').update({ nom, type, notes: notes || null }).eq('id', seanceId)
      if (error) { alert('Erreur modification séance : ' + error.message); setSaving(false); return }
      await supabase.from('seance_exercices').delete().eq('seance_id', seanceId)
    }

    if (lignes.length > 0) {
      const { error: exoError } = await supabase.from('seance_exercices').insert(
        lignes.map((l, i) => ({
          seance_id: seanceId,
          exercice_id: l.exercice_id,
          ordre: i + 1,
          series: l.series || null,
          repetitions: l.sets_config ? null : (l.repetitions || null),
          duree_secondes: l.sets_config ? null : (l.duree_secondes || null),
          distance_metres: l.sets_config ? null : (l.distance_metres || null),
          charge_kg: l.sets_config ? null : (l.charge_kg || null),
          recuperation_secondes: l.sets_config ? null : (l.recuperation_secondes || null),
          recuperation_active: l.recuperation_active || false,
          recuperation_inter_sets: l.recuperation_inter_sets || null,
          lien_suivant: l.lien_suivant || false,
          uni_podal: l.uni_podal || false,
          notes: l.notes || null,
          sets_config: l.sets_config || null,
        }))
      )
      if (exoError) {
        alert('Séance créée mais erreur exercices : ' + exoError.message)
        setSaving(false)
        if (seanceId) onSave(seanceId)
        return
      }
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
    <div className="page-section">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button onClick={onCancel} className="btn btn-ghost">← Retour</button>
        <h1 className="page-title" style={{ flex: 1, fontSize: '20px' }}>
          {seance.id ? 'Éditer la séance' : 'Nouvelle séance'}
        </h1>
        {seance.id && (
          <button onClick={() => setShowDup(true)} className="btn btn-gold">⚡ Dupliquer avec progression</button>
        )}
        <button onClick={handleSave} disabled={saving} className="btn btn-primary"
          style={saving ? { opacity: 0.6, cursor: 'not-allowed' } : {}}>
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>

      {/* Infos séance */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
        <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Nom de la séance *"
          className="input" style={{ flex: 1, fontSize: '15px', fontWeight: '600' }} />
        <select value={type} onChange={e => setType(e.target.value)} className="select">
          {TYPES_SEANCE.map(t => <option key={t} value={t}>{LABELS_TYPE[t]}</option>)}
        </select>
      </div>

      <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes générales de la séance..."
        rows={2} className="textarea" style={{ marginBottom: '24px' }} />

      {/* Exercices */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <h2 style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '-0.2px' }}>Exercices</h2>
          {lignes.length > 0 && <p style={{ color: '#444', fontSize: '11px', marginTop: '2px' }}>Définissez le nombre de séries pour configurer chaque série individuellement</p>}
        </div>
        <button onClick={() => setShowPicker(true)} className="btn btn-ghost btn-sm" style={{ borderColor: '#1A6FFF30', color: '#5599FF' }}>+ Ajouter</button>
      </div>

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

                {/* Ligne exercice dans superset — layout 2 lignes (mobile-friendly) */}
                <div style={{
                  background: '#1A6FFF06',
                  borderTop: debutGroupe ? 'none' : '1px solid #1A6FFF25',
                  borderLeft: '1px solid #1A6FFF50',
                  borderRight: '1px solid #1A6FFF50',
                  padding: '10px 10px 8px',
                }}>
                  {/* Ligne 1 : nom + note + supprimer */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}>
                      <button onClick={() => moveLigne(idx, -1)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '10px', lineHeight: 1 }}>▲</button>
                      <button onClick={() => moveLigne(idx, 1)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '10px', lineHeight: 1 }}>▼</button>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '600', fontSize: '13px' }}>{l.exercices?.nom}</div>
                      <div style={{ display: 'flex', gap: '5px', marginTop: '3px', flexWrap: 'wrap' }}>
                        {fam && <span style={{ fontSize: '10px', color: fam.couleur }}>{fam.nom}</span>}
                        <button onClick={() => setLignes(prev => prev.map((li, i) => i === idx ? { ...li, uni_podal: !li.uni_podal } : li))}
                          style={{ background: l.uni_podal ? '#1A6FFF20' : 'transparent', border: `1px solid ${l.uni_podal ? '#1A6FFF60' : '#2A2A2A'}`, color: l.uni_podal ? '#1A6FFF' : '#444', fontSize: '9px', padding: '1px 6px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700' }}>↔ 2 côtés</button>
                      </div>
                    </div>
                    <input value={l.notes || ''} onChange={e => updateLigne(idx, 'notes', e.target.value)}
                      placeholder="note..."
                      style={{ width: '80px', flexShrink: 0, background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '5px 7px', color: '#FFF', fontSize: '11px', outline: 'none' }} />
                    <button onClick={() => removeLigne(idx)} style={{
                      flexShrink: 0, background: 'transparent', border: '1px solid #FF475730', color: '#FF4757',
                      borderRadius: '6px', padding: '5px 7px', cursor: 'pointer', fontSize: '12px',
                    }}>✕</button>
                  </div>
                  {/* Ligne 2 : Reps, Durée, Dist, Charge */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                    {['Reps', 'Durée(s)', 'Dist(m)', 'Charge(kg)'].map(h => (
                      <div key={h} style={{ color: '#444', fontSize: '10px', textTransform: 'uppercase' as const, textAlign: 'center' as const }}>{h}</div>
                    ))}
                    {paramInput(idx, 'repetitions', '-', '100%')}
                    {paramInput(idx, 'duree_secondes', '-', '100%')}
                    {paramInput(idx, 'distance_metres', '-', '100%')}
                    {paramInput(idx, 'charge_kg', '-', '100%')}
                  </div>
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
          const hasPerSet = l.sets_config && l.sets_config.length > 0
          return (
            <div key={idx} style={{ marginTop: idx > 0 ? '8px' : '0' }}>
              <div style={{
                background: '#111',
                border: '1px solid #2A2A2A',
                borderRadius: hasPerSet ? '10px 10px 0 0' : '10px',
              }}>
                {/* Ligne principale : nom + séries + notes + supprimer */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr auto auto auto',
                  gap: '8px', padding: '10px 8px', alignItems: 'center',
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
                  {/* Séries */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#555', fontSize: '11px', whiteSpace: 'nowrap' }}>Séries</span>
                    <input
                      type="number" placeholder="-"
                      value={l.series ?? ''}
                      onChange={e => handleSeriesChange(idx, e.target.value)}
                      style={{ width: '55px', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '6px 8px', color: '#FFF', fontSize: '13px', outline: 'none', textAlign: 'center' }}
                    />
                  </div>
                  {/* Notes */}
                  <input value={l.notes || ''} onChange={e => updateLigne(idx, 'notes', e.target.value)}
                    placeholder="note..."
                    style={{ width: '110px', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '6px 8px', color: '#FFF', fontSize: '12px', outline: 'none' }} />
                  <button onClick={() => removeLigne(idx)} style={{
                    background: 'transparent', border: '1px solid #FF475730', color: '#FF4757',
                    borderRadius: '6px', padding: '6px', cursor: 'pointer', fontSize: '12px',
                  }}>✕</button>
                </div>

                {/* Lignes par série */}
                {hasPerSet && (
                  <div style={{ borderTop: '1px solid #2A2A2A' }}>
                    {/* Sous-header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '60px 65px 65px 65px 65px 65px', gap: '6px', padding: '5px 12px', background: '#0A0A0A' }}>
                      {['Série', 'Reps', 'Durée(s)', 'Dist(m)', 'Charge(kg)', 'Récup(s)'].map(h => (
                        <div key={h} style={{ color: '#444', fontSize: '10px', letterSpacing: '0.3px', textTransform: 'uppercase', textAlign: 'center' }}>{h}</div>
                      ))}
                    </div>
                    {l.sets_config!.map((s, si) => (
                      <div key={si} style={{
                        display: 'grid', gridTemplateColumns: '60px 65px 65px 65px 65px 65px', gap: '6px',
                        padding: '6px 12px', borderTop: '1px solid #1A1A1A', alignItems: 'center',
                        background: si % 2 === 0 ? '#0D0D0D' : '#111',
                      }}>
                        <div style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', textAlign: 'center' }}>S{si + 1}</div>
                        {(['reps', 'duree', 'dist', 'charge', 'recup'] as (keyof SetConfig)[]).map(key => (
                          <input
                            key={key}
                            type="number"
                            placeholder="-"
                            value={s[key] ?? ''}
                            onChange={e => updateSetField(idx, si, key, e.target.value)}
                            style={{ width: '100%', background: '#1A1A1A', border: '1px solid #222', borderRadius: '5px', padding: '5px 6px', color: '#FFF', fontSize: '12px', outline: 'none', textAlign: 'center' }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {/* Mode simple (pas de sets_config) */}
                {!hasPerSet && (
                  <div style={{ borderTop: '1px solid #1E1E1E' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '65px 65px 65px 65px 65px', gap: '6px', padding: '5px 12px', background: '#0A0A0A' }}>
                      {['Reps', 'Durée(s)', 'Dist(m)', 'Charge(kg)', 'Récup(s)'].map(h => (
                        <div key={h} style={{ color: '#444', fontSize: '10px', textTransform: 'uppercase', textAlign: 'center' }}>{h}</div>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '65px 65px 65px 65px 65px', gap: '6px', padding: '8px 12px' }}>
                      {paramInput(idx, 'repetitions', '-', '100%')}
                      {paramInput(idx, 'duree_secondes', '-', '100%')}
                      {paramInput(idx, 'distance_metres', '-', '100%')}
                      {paramInput(idx, 'charge_kg', '-', '100%')}
                      {paramInput(idx, 'recuperation_secondes', '-', '100%')}
                    </div>
                  </div>
                )}
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
        <ExercicePicker
          exercices={exercices}
          onConfirm={ajouterExercices}
          onClose={() => { setShowPicker(false); setRecherche('') }}
        />
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

type MPSeanceExercice = {
  id: string
  ordre: number
  series?: number
  repetitions?: number
  duree_secondes?: number
  distance_metres?: number
  charge_kg?: number
  recuperation_secondes?: number
  lien_suivant?: boolean
  uni_podal?: boolean
  notes?: string
  sets_config?: SetConfig[]
  exercices?: { nom: string; video_url?: string; consignes_execution?: string; familles?: { nom: string; couleur: string } | null } | null
}

type MPRealisation = {
  id: string
  seance_id: string
  date_realisation: string
  completee: boolean
  rpe?: number | null
  fatigue?: number | null
  courbatures?: number | null
  qualite_sommeil?: number | null
  notes_joueur?: string | null
  seances?: { id: string; nom: string; type: string; est_template: boolean; seance_exercices?: MPSeanceExercice[] } | null
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

function CopierJoursModal({ joursSelectionnes, byDate, joueurCourant, allJoueurs, onDone, onClose }: {
  joursSelectionnes: Set<string>
  byDate: Record<string, MPRealisation[]>
  joueurCourant: Joueur
  allJoueurs: { id: string; nom: string; prenom: string }[]
  onDone: () => void
  onClose: () => void
}) {
  const [mode, setMode] = useState<'joueur' | 'modele'>('joueur')
  const [cibleJoueurId, setCibleJoueurId] = useState('')
  const [dateDebut, setDateDebut] = useState('')
  const [nomModele, setNomModele] = useState('')
  const [loading, setLoading] = useState(false)

  const datesTriees = [...joursSelectionnes].sort()

  function addDays(ds: string, n: number) {
    const d = new Date(ds + 'T12:00:00'); d.setDate(d.getDate() + n)
    return d.toISOString().split('T')[0]
  }
  function daysBetween(d1: string, d2: string) {
    return Math.round((new Date(d2 + 'T12:00:00').getTime() - new Date(d1 + 'T12:00:00').getTime()) / 86400000)
  }

  const totalSessions = datesTriees.reduce((n, d) => n + (byDate[d]?.filter(r => r.seance_id)?.length || 0), 0)

  async function handleCopier() {
    if (mode === 'joueur' && (!cibleJoueurId || !dateDebut)) { alert('Sélectionne un joueur et une date de début'); return }
    if (mode === 'modele' && !nomModele.trim()) { alert('Entre un nom pour le modèle'); return }
    setLoading(true)
    const anchor = datesTriees[0]
    try {
      if (mode === 'joueur') {
        const inserts = datesTriees.flatMap(date => {
          const offset = daysBetween(anchor, date)
          const newDate = addDays(dateDebut, offset)
          return (byDate[date] || []).filter(r => r.seance_id).map(r => ({
            joueur_id: cibleJoueurId, seance_id: r.seance_id,
            date_realisation: newDate, completee: false,
          }))
        })
        if (inserts.length > 0) await supabase.from('realisations').insert(inserts)
        alert(`✓ ${inserts.length} séance(s) copiée(s) !`)
      } else {
        const { data: prog, error: pe } = await supabase.from('programmes').insert({ nom: nomModele.trim() }).select().single()
        if (pe || !prog) { alert(`Erreur : ${pe?.message}`); setLoading(false); return }
        for (const date of datesTriees) {
          const offset = daysBetween(anchor, date)
          const weekNum = Math.floor(offset / 7) + 1
          const dow = new Date(date + 'T12:00:00').getDay()
          const jourSemaine = dow === 0 ? 7 : dow
          for (const real of (byDate[date] || []).filter(r => r.seance_id)) {
            const { data: ns } = await supabase.from('seances').insert({
              nom: real.seances?.nom || 'Séance', type: real.seances?.type || 'complete',
              programme_id: prog.id, jour_semaine: jourSemaine, semaine: weekNum, est_template: false,
            }).select().single()
            if (ns && real.seance_id) {
              const { data: exos } = await supabase.from('seance_exercices').select('*').eq('seance_id', real.seance_id).order('ordre')
              if (exos && exos.length > 0) {
                await supabase.from('seance_exercices').insert(exos.map(e => ({
                  seance_id: ns.id, exercice_id: e.exercice_id, ordre: e.ordre,
                  series: e.series, repetitions: e.repetitions, duree_secondes: e.duree_secondes,
                  distance_metres: e.distance_metres, charge_kg: e.charge_kg,
                  recuperation_secondes: e.recuperation_secondes, lien_suivant: e.lien_suivant,
                  uni_podal: e.uni_podal, notes: e.notes, sets_config: e.sets_config,
                })))
              }
            }
          }
        }
        alert(`✓ Modèle "${nomModele}" créé !`)
      }
      onDone()
    } catch (e: unknown) {
      alert(`Erreur : ${e instanceof Error ? e.message : String(e)}`)
    } finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 600 }}>
      <div className="modal-box" style={{ maxWidth: '440px', width: '100%' }}>
        <div className="modal-title">Copier {datesTriees.length} jour{datesTriees.length > 1 ? 's' : ''}</div>
        <div style={{ color: '#555', fontSize: '12px', marginBottom: '20px' }}>{totalSessions} séance{totalSessions > 1 ? 's' : ''} sélectionnée{totalSessions > 1 ? 's' : ''}</div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {(['joueur', 'modele'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: '10px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px',
              border: `1px solid ${mode === m ? (m === 'joueur' ? '#007AFF' : '#C9A84C') : '#252530'}`,
              background: mode === m ? (m === 'joueur' ? 'rgba(0,122,255,0.12)' : 'rgba(201,168,76,0.12)') : 'transparent',
              color: mode === m ? (m === 'joueur' ? '#007AFF' : '#C9A84C') : '#666',
            }}>{m === 'joueur' ? '👤 Vers un joueur' : '📋 Créer un modèle'}</button>
          ))}
        </div>

        {mode === 'joueur' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Joueur cible</label>
              <select value={cibleJoueurId} onChange={e => setCibleJoueurId(e.target.value)} className="select" style={{ width: '100%' }}>
                <option value="">— Choisir un joueur —</option>
                {allJoueurs.filter(j => j.id !== joueurCourant.id).map(j => (
                  <option key={j.id} value={j.id}>{j.prenom} {j.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                Date de début (= {new Date(datesTriees[0] + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })})
              </label>
              <input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)} className="input" style={{ width: '100%' }} />
            </div>
          </div>
        )}

        {mode === 'modele' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Nom du modèle</label>
              <input value={nomModele} onChange={e => setNomModele(e.target.value)} placeholder="Ex : Semaine type pré-saison" className="input" style={{ width: '100%' }} />
            </div>
            <div style={{ background: '#0D0D0D', border: '1px solid #1E1E1E', borderRadius: '10px', padding: '12px' }}>
              <div style={{ color: '#444', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Aperçu</div>
              {datesTriees.filter(d => (byDate[d] || []).some(r => r.seance_id)).map(d => {
                const offset = daysBetween(datesTriees[0], d)
                const wk = Math.floor(offset / 7) + 1
                const jourNom = new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'short' })
                return (
                  <div key={d} style={{ display: 'flex', gap: '10px', alignItems: 'baseline', marginBottom: '4px' }}>
                    <span style={{ color: '#C9A84C', fontSize: '10px', fontWeight: '800', width: '48px', flexShrink: 0 }}>S{wk} {jourNom}</span>
                    <span style={{ color: '#666', fontSize: '11px' }}>{(byDate[d] || []).filter(r => r.seance_id).map(r => r.seances?.nom || 'Séance').join(', ')}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          <button onClick={onClose} className="btn btn-ghost" style={{ flex: 1 }}>Annuler</button>
          <button onClick={handleCopier} disabled={loading} className="btn btn-primary" style={{ flex: 2 }}>
            {loading ? 'En cours...' : mode === 'joueur' ? 'Copier vers ce joueur' : 'Créer le modèle'}
          </button>
        </div>
      </div>
    </div>
  )
}

function MasterPlannerView({ joueur, realisations: initialReals, exercices, weekStart: initialWeekStart, onClose, onReload }: {
  joueur: Joueur
  realisations: MPRealisation[]
  exercices: Exercice[]
  weekStart: string
  onClose: () => void
  onReload: () => void
}) {
  const today = new Date().toISOString().split('T')[0]
  const [reals, setReals] = useState<MPRealisation[]>(initialReals)
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date(initialWeekStart + 'T12:00:00')
    const day = d.getDay()
    d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day))
    return d.toISOString().split('T')[0]
  })
  const [addExoTo, setAddExoTo] = useState<string | null>(null)
  const [rechercheExo, setRechercheExo] = useState('')
  const [loading, setLoading] = useState(true)
  const [expandedExo, setExpandedExo] = useState<{ rId: string; eId: string } | null>(null)
  const [mpActionDate, setMpActionDate] = useState<string | null>(null)
  const [mpWellnessDate, setMpWellnessDate] = useState<string | null>(null)
  const [mpWellnessData, setMpWellnessData] = useState({ fatigue: 5, rpe: 5, courbatures: 5, qualite_sommeil: 5, notes: '' })
  const [mpTemplates, setMpTemplates] = useState<{ id: string; nom: string }[]>([])
  const [mpSeanceChoisie, setMpSeanceChoisie] = useState('')
  const [modeSelection, setModeSelection] = useState(false)
  const [joursSelectionnes, setJoursSelectionnes] = useState<Set<string>>(new Set())
  const [showCopierModal, setShowCopierModal] = useState(false)
  const [allJoueurs, setAllJoueurs] = useState<{ id: string; nom: string; prenom: string }[]>([])

  useEffect(() => {
    supabase.from('seances').select('id, nom').eq('est_template', true).order('nom')
      .then(({ data }) => { if (data) setMpTemplates(data) })
  }, [])

  useEffect(() => {
    supabase.from('joueurs').select('id, nom, prenom').eq('actif', true).order('nom')
      .then(({ data }) => { if (data) setAllJoueurs(data) })
  }, [])

  async function mpAttribuerSession(ds: string) {
    if (!mpSeanceChoisie) return
    await supabase.from('realisations').insert({ joueur_id: joueur.id, seance_id: mpSeanceChoisie, date_realisation: ds, completee: false })
    const { data } = await supabase.from('realisations')
      .select('id, seance_id, date_realisation, completee, seances(id, nom, type, seance_exercices(id, ordre, series, repetitions, duree_secondes, distance_metres, charge_kg, recuperation_secondes, lien_suivant, uni_podal, notes, sets_config, exercices(nom, video_url, familles(nom, couleur))))')
      .eq('joueur_id', joueur.id).order('date_realisation')
    if (data) setReals(data as unknown as MPRealisation[])
    setMpActionDate(null)
    setMpSeanceChoisie('')
  }

  async function mpSauvegarderWellness() {
    if (!mpWellnessDate) return
    await supabase.from('realisations').insert({
      joueur_id: joueur.id, seance_id: null, date_realisation: mpWellnessDate, completee: false,
      fatigue: mpWellnessData.fatigue || null, rpe: mpWellnessData.rpe || null,
      courbatures: mpWellnessData.courbatures || null, qualite_sommeil: mpWellnessData.qualite_sommeil || null,
      notes_joueur: mpWellnessData.notes || null,
    })
    const { data } = await supabase.from('realisations')
      .select('id, seance_id, date_realisation, completee, seances(id, nom, type, seance_exercices(id, ordre, series, repetitions, duree_secondes, distance_metres, charge_kg, recuperation_secondes, lien_suivant, uni_podal, notes, sets_config, exercices(nom, video_url, familles(nom, couleur))))')
      .eq('joueur_id', joueur.id).order('date_realisation')
    if (data) setReals(data as unknown as MPRealisation[])
    setMpWellnessDate(null)
    setMpWellnessData({ fatigue: 5, rpe: 5, courbatures: 5, qualite_sommeil: 5, notes: '' })
  }

  function toggleJour(ds: string) {
    setJoursSelectionnes(prev => {
      const next = new Set(prev)
      next.has(ds) ? next.delete(ds) : next.add(ds)
      return next
    })
  }

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const nbDays = isMobile ? 3 : 7

  const JOUR_NOMS = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM']

  useEffect(() => {
    setLoading(true)
    supabase
      .from('realisations')
      .select('id, seance_id, date_realisation, completee, seances(id, nom, type, seance_exercices(id, ordre, series, repetitions, duree_secondes, distance_metres, charge_kg, recuperation_secondes, lien_suivant, uni_podal, notes, sets_config, exercices(nom, video_url, familles(nom, couleur))))')
      .eq('joueur_id', joueur.id)
      .order('date_realisation')
      .then(({ data, error }) => {
        if (!error && data) setReals(data as unknown as MPRealisation[])
        else setReals(initialReals) // fallback si colonnes manquantes en DB
        setLoading(false)
      })
  }, [joueur.id])

  const days = Array.from({ length: nbDays }, (_, i) => {
    const d = new Date(weekStart + 'T12:00:00')
    d.setDate(d.getDate() + i)
    return d.toISOString().split('T')[0]
  })

  const byDate = reals.reduce((acc, r) => {
    const d = r.date_realisation
    if (!acc[d]) acc[d] = []
    acc[d].push(r)
    return acc
  }, {} as Record<string, MPRealisation[]>)

  function prevWeek() {
    const d = new Date(weekStart + 'T12:00:00'); d.setDate(d.getDate() - nbDays)
    setWeekStart(d.toISOString().split('T')[0])
  }
  function nextWeek() {
    const d = new Date(weekStart + 'T12:00:00'); d.setDate(d.getDate() + nbDays)
    setWeekStart(d.toISOString().split('T')[0])
  }
  function jumpToDate(ds: string) {
    if (isMobile) {
      setWeekStart(ds)
    } else {
      const d = new Date(ds + 'T12:00:00')
      const day = d.getDay()
      d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day))
      setWeekStart(d.toISOString().split('T')[0])
    }
  }

  function patchExoLocal(realisationId: string, exoId: string, updates: Partial<MPSeanceExercice>) {
    setReals(prev => prev.map(r => {
      if (r.id !== realisationId) return r
      return { ...r, seances: r.seances ? { ...r.seances, seance_exercices: r.seances.seance_exercices?.map(e => e.id === exoId ? { ...e, ...updates } : e) } : r.seances }
    }))
  }

  async function saveExoField(exoId: string, updates: Record<string, unknown>) {
    await supabase.from('seance_exercices').update(updates).eq('id', exoId)
  }

  async function removeExo(realisationId: string, exoId: string) {
    setReals(prev => prev.map(r => {
      if (r.id !== realisationId) return r
      return { ...r, seances: r.seances ? { ...r.seances, seance_exercices: r.seances.seance_exercices?.filter(e => e.id !== exoId) } : r.seances }
    }))
    await supabase.from('seance_exercices').delete().eq('id', exoId)
  }

  function moveExo(realisationId: string, exoId: string, dir: -1 | 1) {
    setReals(prev => prev.map(r => {
      if (r.id !== realisationId) return r
      const exos = [...(r.seances?.seance_exercices || [])].sort((a, b) => a.ordre - b.ordre)
      const idx = exos.findIndex(e => e.id === exoId)
      const swap = idx + dir
      if (swap < 0 || swap >= exos.length) return r
      const swapId = exos[swap].id
      ;[exos[idx], exos[swap]] = [exos[swap], exos[idx]]
      const newExos = exos.map((e, i) => ({ ...e, ordre: i + 1 }))
      supabase.from('seance_exercices').update({ ordre: swap + 1 }).eq('id', exoId)
      supabase.from('seance_exercices').update({ ordre: idx + 1 }).eq('id', swapId)
      return { ...r, seances: { ...r.seances!, seance_exercices: newExos } }
    }))
  }

  async function addSet(realisationId: string, exoId: string, exo: MPSeanceExercice) {
    const current = exo.sets_config || []
    const s1: SetConfig = current[0] || { reps: exo.repetitions, charge: exo.charge_kg, recup: exo.recuperation_secondes }
    const newSets = [...current, { ...s1 }]
    const updates = { sets_config: newSets, series: newSets.length }
    patchExoLocal(realisationId, exoId, updates)
    await saveExoField(exoId, updates)
  }

  async function removeSet(realisationId: string, exoId: string, exo: MPSeanceExercice, si: number) {
    const newSets = (exo.sets_config || []).filter((_, i) => i !== si)
    const updates = { sets_config: newSets.length ? newSets : null, series: newSets.length || null }
    patchExoLocal(realisationId, exoId, updates as Partial<MPSeanceExercice>)
    await saveExoField(exoId, updates)
  }

  function patchSet(realisationId: string, exoId: string, exo: MPSeanceExercice, si: number, key: keyof SetConfig, val: string) {
    const current = exo.sets_config || []
    const newSets = current.map((s, i) => i === si ? { ...s, [key]: val === '' ? undefined : Math.max(0, Number(val)) } : s)
    patchExoLocal(realisationId, exoId, { sets_config: newSets })
  }

  async function flushSets(exoId: string, realisationId: string) {
    const fresh = reals.find(r => r.id === realisationId)?.seances?.seance_exercices?.find(e => e.id === exoId)
    if (fresh?.sets_config) await saveExoField(exoId, { sets_config: fresh.sets_config })
  }

  function patchSimple(realisationId: string, exoId: string, key: string, val: string) {
    const v = val === '' ? undefined : Math.max(0, Number(val))
    patchExoLocal(realisationId, exoId, { [key]: v })
  }

  async function flushSimple(exoId: string, realisationId: string, key: string) {
    const fresh = reals.find(r => r.id === realisationId)?.seances?.seance_exercices?.find(e => e.id === exoId)
    if (fresh) await saveExoField(exoId, { [key]: (fresh as Record<string, unknown>)[key] ?? null })
  }

  async function toggleUniPodal(realisationId: string, exo: MPSeanceExercice) {
    const val = !exo.uni_podal
    patchExoLocal(realisationId, exo.id, { uni_podal: val })
    await saveExoField(exo.id, { uni_podal: val })
  }

  async function toggleLienSuivant(realisationId: string, exo: MPSeanceExercice) {
    const val = !exo.lien_suivant
    patchExoLocal(realisationId, exo.id, { lien_suivant: val })
    await saveExoField(exo.id, { lien_suivant: val })
  }

  async function addExoToSession(realisationId: string, exercice: Exercice) {
    const r = reals.find(rx => rx.id === realisationId)
    if (!r?.seances) return
    const ordre = (r.seances.seance_exercices?.length || 0) + 1
    const { data } = await supabase.from('seance_exercices').insert({ seance_id: r.seance_id, exercice_id: exercice.id, ordre }).select('id').single()
    if (data) {
      const newExo: MPSeanceExercice = { id: data.id, ordre, exercices: { nom: exercice.nom, video_url: exercice.video_url || undefined, familles: exercice.familles } }
      setReals(prev => prev.map(rx => rx.id !== realisationId ? rx : { ...rx, seances: { ...rx.seances!, seance_exercices: [...(rx.seances?.seance_exercices || []), newExo] } }))
    }
    setAddExoTo(null)
    setRechercheExo('')
  }

  const weekLabel = (() => {
    const d = new Date(weekStart + 'T12:00:00')
    const fin = new Date(weekStart + 'T12:00:00'); fin.setDate(fin.getDate() + nbDays - 1)
    return `${d.getDate()} ${d.toLocaleDateString('fr-FR', { month: 'short' })} — ${fin.getDate()} ${fin.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}`
  })()

  const setInput = (style?: React.CSSProperties) => ({
    type: 'number' as const,
    style: { width: '100%', background: '#161616', border: '1px solid #1E1E1E', borderRadius: '3px', padding: '3px 2px', color: '#FFF', fontSize: '10px', outline: 'none', textAlign: 'center' as const, ...style },
  })

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: '#0A0A0A', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #222', background: '#111', flexShrink: 0 }}>
        {/* Ligne 1 : fermer + titre + joueur */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px 6px' }}>
          <button onClick={onClose} style={{ background: '#FF475720', border: '1px solid #FF475740', borderRadius: '8px', padding: '8px 14px', color: '#FF4757', cursor: 'pointer', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap', flexShrink: 0 }}>✕ Fermer</button>
          <div style={{ fontWeight: '900', fontSize: '13px', letterSpacing: '-0.5px', whiteSpace: 'nowrap', flex: 1 }}>
            <span style={{ color: '#1A6FFF' }}>▦</span> <span style={{ color: '#FFF' }}>MASTER PLANNER</span>
          </div>
          {!isMobile && <span style={{ color: '#444', fontSize: '11px' }}>{joueur.prenom} {joueur.nom}</span>}
          <button
            onClick={() => { setModeSelection(v => !v); setJoursSelectionnes(new Set()) }}
            style={{
              background: modeSelection ? 'rgba(46,204,113,0.15)' : '#181820',
              border: `1px solid ${modeSelection ? '#2ECC7150' : '#252530'}`,
              borderRadius: '8px', padding: '6px 12px',
              color: modeSelection ? '#2ECC71' : '#666',
              cursor: 'pointer', fontSize: '12px', fontWeight: '700',
              flexShrink: 0, whiteSpace: 'nowrap',
            }}>
            {modeSelection ? '✕ Annuler' : '📋 Copier'}
          </button>
        </div>
        {/* Ligne 2 : nav semaine + date picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px 10px' }}>
          <button onClick={prevWeek} style={{ background: '#181820', border: '1px solid #252530', borderRadius: '8px', padding: '8px 14px', color: '#888', cursor: 'pointer', fontSize: '16px', minHeight: '36px', minWidth: '36px' }}>‹</button>
          <button onClick={nextWeek} style={{ background: '#181820', border: '1px solid #252530', borderRadius: '8px', padding: '8px 14px', color: '#888', cursor: 'pointer', fontSize: '16px', minHeight: '36px', minWidth: '36px' }}>›</button>
          <span style={{ color: '#666', fontSize: '12px', whiteSpace: 'nowrap', flex: 1, fontWeight: '600' }}>{weekLabel}</span>
          <input type="date" onChange={e => e.target.value && jumpToDate(e.target.value)}
            style={{ background: '#181820', border: '1px solid #252530', borderRadius: '8px', padding: '6px 10px', color: '#007AFF', fontSize: '12px', outline: 'none', cursor: 'pointer', minHeight: '36px' }} />
        </div>
      </div>

      {/* Grid of day columns */}
      {loading && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#1A6FFF', fontSize: '13px', letterSpacing: '2px' }}>CHARGEMENT...</span>
        </div>
      )}
      <div style={{ flex: loading ? 0 : 1, display: 'grid', gridTemplateColumns: `repeat(${nbDays}, 1fr)`, gap: '1px', background: '#1E1E1E', overflow: loading ? 'hidden' : 'hidden' }}>
        {days.map((ds, di) => {
          const isToday = ds === today
          const dateObj = new Date(ds + 'T12:00:00')
          const dateNum = dateObj.getDate()
          const mois = dateObj.toLocaleDateString('fr-FR', { month: 'short' })
          const dayReals = byDate[ds] || []

          const estSelectionne = joursSelectionnes.has(ds)
          return (
            <div key={ds} style={{
              background: estSelectionne ? '#0A1F10' : (isToday ? '#0C0C14' : '#0D0D0D'),
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              outline: estSelectionne ? '2px solid #2ECC7150' : 'none', outlineOffset: '-1px',
            }}>
              {/* Day header */}
              <div style={{ padding: '8px 6px 6px', borderBottom: '1px solid #1A1A1A', background: estSelectionne ? '#0D2015' : (isToday ? '#0C1020' : '#0D0D0D'), flexShrink: 0 }}>
                <div style={{ textAlign: 'center', marginBottom: '4px' }}>
                  <div style={{ color: estSelectionne ? '#2ECC71' : (isToday ? '#5AABFF' : '#555'), fontSize: '10px', fontWeight: '800', letterSpacing: '0.8px', textTransform: 'uppercase' }}>{JOUR_NOMS[di]}</div>
                  <div style={{ color: estSelectionne ? '#2ECC71' : (isToday ? '#007AFF' : '#888'), fontSize: '22px', fontWeight: '900', lineHeight: 1, marginTop: '1px' }}>{dateNum}</div>
                  <div style={{ color: '#444', fontSize: '10px', marginTop: '1px' }}>{mois}</div>
                </div>
                {!modeSelection && (
                  <button onClick={() => { setMpActionDate(ds); setMpSeanceChoisie('') }}
                    style={{ width: '100%', minHeight: '28px', borderRadius: '6px', border: '1px solid #252530', background: 'transparent', color: '#444', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 0' }}>+</button>
                )}
                {modeSelection && (
                  <button onClick={() => toggleJour(ds)} style={{
                    width: '100%', minHeight: '28px', borderRadius: '6px', cursor: 'pointer',
                    border: `1px solid ${estSelectionne ? '#2ECC71' : '#252530'}`,
                    background: estSelectionne ? 'rgba(46,204,113,0.2)' : 'transparent',
                    color: estSelectionne ? '#2ECC71' : '#444',
                    fontSize: estSelectionne ? '16px' : '13px', fontWeight: '700',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 0',
                  }}>{estSelectionne ? '✓' : '+'}</button>
                )}
              </div>

              {/* Sessions scroll area */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {dayReals.map(r => {
                  const exos = [...(r.seances?.seance_exercices || [])].sort((a, b) => a.ordre - b.ordre)
                  const typeLabel = (LABELS_TYPE[r.seances?.type || ''] || 'SÉANCE').toUpperCase()
                  return (
                    <div key={r.id} style={{ background: '#111', border: '1px solid #252525', borderRadius: '8px', overflow: 'hidden' }}>
                      {/* Session header */}
                      <div style={{ padding: '7px 8px', borderBottom: '1px solid #1E1E1E', display: 'flex', alignItems: 'center', gap: '5px', background: '#111' }}>
                        <div style={{ flex: 1, fontWeight: '700', fontSize: '12px', color: '#DDD', lineHeight: 1.3, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.seances?.nom || 'Séance'}</div>
                        <span style={{ fontSize: '9px', fontWeight: '800', color: '#555', background: '#181818', border: '1px solid #242424', borderRadius: '4px', padding: '2px 5px', whiteSpace: 'nowrap', flexShrink: 0 }}>{typeLabel}</span>
                      </div>

                      {/* Exercises — groupés en blocs (superset / circuit) */}
                      {(() => {
                        // Construire les blocs de supersets
                        const blocs: MPSeanceExercice[][] = []
                        let current: MPSeanceExercice[] = []
                        for (const exo of exos) {
                          current.push(exo)
                          if (!exo.lien_suivant) { blocs.push(current); current = [] }
                        }
                        if (current.length > 0) blocs.push(current)

                        return blocs.map((bloc, blocIdx) => {
                          const isGroup = bloc.length > 1
                          const groupLabel = bloc.length > 2 ? 'CIRCUIT' : 'SUPERSET'

                          const renderExo = (exo: MPSeanceExercice, exoIdx: number, insideGroup: boolean) => {
                            const fam = exo.exercices?.familles
                            const couleur = fam?.couleur || '#555'
                            const hasSets = exo.sets_config && exo.sets_config.length > 0
                            const hasVideo = !!exo.exercices?.video_url

                            const seriesSummary = (() => {
                              if (hasSets && exo.sets_config!.length > 0) {
                                const s = exo.sets_config![0]
                                const parts = []
                                if (s.reps) parts.push(`${s.reps}r`)
                                if (s.duree) parts.push(`${s.duree}s`)
                                if (s.dist) parts.push(`${s.dist}m`)
                                if (s.charge) parts.push(`${s.charge}kg`)
                                return `${exo.sets_config!.length}×${parts.join(' ')}`
                              }
                              const parts = []
                              if (exo.repetitions) parts.push(`${exo.repetitions}r`)
                              if (exo.duree_secondes) parts.push(`${exo.duree_secondes}s`)
                              if (exo.distance_metres) parts.push(`${exo.distance_metres}m`)
                              if (exo.charge_kg) parts.push(`${exo.charge_kg}kg`)
                              const base = parts.join(' ')
                              return exo.series ? `${exo.series}×${base || '—'}` : base || '—'
                            })()

                            return (
                              <div key={exo.id}>
                                {insideGroup && exoIdx > 0 && (
                                  <div style={{ display: 'flex', alignItems: 'center', padding: '2px 8px', gap: '6px', background: '#1A6FFF08' }}>
                                    <div style={{ width: '2px', height: '12px', background: '#1A6FFF', marginLeft: '9px', borderRadius: '1px' }} />
                                    {exo.recuperation_secondes
                                      ? <span style={{ color: '#2ECC71', fontSize: '9px', fontWeight: '700' }}>⏱ {exo.recuperation_secondes}s</span>
                                      : <span style={{ color: '#1A6FFF80', fontSize: '8px' }}>enchaîner</span>}
                                  </div>
                                )}

                                {isMobile ? (
                                  /* ── MOBILE : carte compacte tappable ── */
                                  <div onClick={() => setExpandedExo({ rId: r.id, eId: exo.id })}
                                    style={{ padding: '9px 8px', borderTop: !insideGroup && exoIdx > 0 ? '1px solid #1A1A1A' : 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', minHeight: '44px' }}>
                                    <div style={{ width: '24px', height: '24px', background: couleur + '22', border: `1px solid ${couleur}50`, borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                      <span style={{ color: couleur, fontSize: '10px', fontWeight: '900' }}>{exo.ordre}</span>
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ color: '#E0E0E0', fontWeight: '700', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exo.exercices?.nom}</div>
                                      <div style={{ color: '#666', fontSize: '10px', marginTop: '1px' }}>{seriesSummary}</div>
                                    </div>
                                    <span style={{ color: '#444', fontSize: '14px' }}>›</span>
                                  </div>
                                ) : (
                              /* ── DESKTOP : édition inline complète ── */
                              <div style={{ padding: '7px 8px', borderTop: exoIdx > 0 && !insideGroup ? '1px solid #1A1A1A' : 'none', background: 'transparent' }}>
                                {/* Exercise header row */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '5px', marginBottom: '5px' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0', flexShrink: 0, marginTop: '2px' }}>
                                    <button onClick={() => moveExo(r.id, exo.id, -1)} style={{ background: 'none', border: 'none', color: '#2A2A2A', cursor: 'pointer', fontSize: '8px', lineHeight: 1, padding: '1px 2px' }}>▲</button>
                                    <button onClick={() => moveExo(r.id, exo.id, 1)} style={{ background: 'none', border: 'none', color: '#2A2A2A', cursor: 'pointer', fontSize: '8px', lineHeight: 1, padding: '1px 2px' }}>▼</button>
                                  </div>
                                  {hasVideo ? (
                                    <button onClick={() => window.open(exo.exercices!.video_url!.replace('vimeo.com/', 'player.vimeo.com/video/'), '_blank')}
                                      style={{ width: '24px', height: '24px', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '9px', color: '#1A6FFF' }}>▶</button>
                                  ) : (
                                    <div style={{ width: '24px', height: '24px', background: couleur + '18', border: `1px solid ${couleur}30`, borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                      <span style={{ color: couleur, fontSize: '8px', fontWeight: '900' }}>{exo.ordre}</span>
                                    </div>
                                  )}
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    {fam && <div style={{ color: couleur, fontSize: '7px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: 1 }}>{fam.nom}</div>}
                                    <div style={{ color: '#DDD', fontWeight: '700', fontSize: '10px', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exo.exercices?.nom}</div>
                                  </div>
                                  <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                                    <button onClick={() => toggleUniPodal(r.id, exo)}
                                      style={{ background: exo.uni_podal ? '#1A6FFF20' : 'transparent', border: `1px solid ${exo.uni_podal ? '#1A6FFF60' : '#252525'}`, color: exo.uni_podal ? '#1A6FFF' : '#333', fontSize: '7px', padding: '2px 4px', borderRadius: '3px', cursor: 'pointer', fontWeight: '700' }}>↔</button>
                                    <button onClick={() => removeExo(r.id, exo.id)}
                                      style={{ background: 'transparent', border: '1px solid #FF475718', color: '#FF475760', borderRadius: '3px', padding: '2px 4px', cursor: 'pointer', fontSize: '9px' }}>✕</button>
                                  </div>
                                </div>

                                {/* Set table */}
                                <div style={{ marginBottom: '4px' }}>
                                  <div style={{ display: 'grid', gridTemplateColumns: '14px 36px 36px 36px 36px 36px 14px', gap: '2px', padding: '1px 2px', marginBottom: '1px' }}>
                                    {['', 'Reps', 'Dur', 'Dist', 'Kg', 'Réc', ''].map((h, hi) => (
                                      <div key={hi} style={{ color: '#2A2A2A', fontSize: '7px', fontWeight: '700', textTransform: 'uppercase', textAlign: 'center' }}>{h}</div>
                                    ))}
                                  </div>
                                  {hasSets ? (
                                    exo.sets_config!.map((s, si) => (
                                      <div key={si} style={{ display: 'grid', gridTemplateColumns: '14px 36px 36px 36px 36px 36px 14px', gap: '2px', padding: '2px', background: si % 2 === 0 ? '#0A0A0A' : 'transparent', borderRadius: '3px', alignItems: 'center', marginBottom: '1px' }}>
                                        <div style={{ color: '#C9A84C', fontSize: '9px', fontWeight: '700', textAlign: 'center' }}>{si + 1}</div>
                                        {(['reps', 'duree', 'dist', 'charge', 'recup'] as (keyof SetConfig)[]).map(key => (
                                          <input key={key} {...setInput()}
                                            placeholder="-"
                                            value={s[key] ?? ''}
                                            onChange={e => patchSet(r.id, exo.id, exo, si, key, e.target.value)}
                                            onBlur={() => flushSets(exo.id, r.id)}
                                          />
                                        ))}
                                        <button onClick={() => removeSet(r.id, exo.id, exo, si)}
                                          style={{ background: 'transparent', border: 'none', color: '#FF475740', cursor: 'pointer', fontSize: '8px', padding: '0', lineHeight: 1 }}>✕</button>
                                      </div>
                                    ))
                                  ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: '14px 36px 36px 36px 36px 36px 14px', gap: '2px', padding: '2px', alignItems: 'center' }}>
                                      <div style={{ color: '#C9A84C', fontSize: '9px', fontWeight: '700', textAlign: 'center' }}>{exo.series || '—'}</div>
                                      {[
                                        ['repetitions', exo.repetitions],
                                        ['duree_secondes', exo.duree_secondes],
                                        ['distance_metres', exo.distance_metres],
                                        ['charge_kg', exo.charge_kg],
                                        ['recuperation_secondes', exo.recuperation_secondes],
                                      ].map(([key, val]) => (
                                        <input key={key as string} {...setInput()}
                                          placeholder="-"
                                          value={(val as number) ?? ''}
                                          onChange={e => patchSimple(r.id, exo.id, key as string, e.target.value)}
                                          onBlur={() => flushSimple(exo.id, r.id, key as string)}
                                        />
                                      ))}
                                      <div />
                                    </div>
                                  )}
                                </div>

                                {/* Footer: + Série + count + superset */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <button onClick={() => addSet(r.id, exo.id, exo)}
                                    style={{ background: '#161616', border: '1px solid #222', borderRadius: '4px', padding: '2px 7px', color: '#666', cursor: 'pointer', fontSize: '8px', fontWeight: '600', whiteSpace: 'nowrap' }}>+ Série</button>
                                  <input type="number" placeholder="×" value={exo.series ?? ''}
                                    onChange={async e => {
                                      const val = e.target.value === '' ? undefined : Math.max(1, Number(e.target.value))
                                      patchExoLocal(r.id, exo.id, { series: val })
                                      await saveExoField(exo.id, { series: val ?? null })
                                    }}
                                    style={{ width: '28px', background: '#161616', border: '1px solid #222', borderRadius: '4px', padding: '2px 3px', color: '#888', fontSize: '9px', outline: 'none', textAlign: 'center' }}
                                  />
                                  <div style={{ flex: 1 }} />
                                  <button onClick={() => toggleLienSuivant(r.id, exo)}
                                    title={exo.lien_suivant ? 'Délier' : 'Lier en superset'}
                                    style={{ background: exo.lien_suivant ? '#1A6FFF20' : 'transparent', border: `1px solid ${exo.lien_suivant ? '#1A6FFF50' : '#222'}`, borderRadius: '4px', padding: '2px 6px', color: exo.lien_suivant ? '#1A6FFF' : '#333', cursor: 'pointer', fontSize: '10px' }}>⇌</button>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                          } // fin renderExo

                          return (
                            <div key={`bloc-${blocIdx}`} style={isGroup ? {
                              borderLeft: '4px solid #1A6FFF',
                              background: '#1A6FFF12',
                              margin: '4px 0',
                              borderRadius: '0 6px 6px 0',
                            } : { marginTop: blocIdx > 0 ? '1px' : '0' }}>
                              {isGroup && (
                                <div style={{ padding: '4px 8px', background: '#1A6FFF30', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <span style={{ color: '#6AAEFF', fontSize: '9px', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>⇌ {groupLabel}</span>
                                </div>
                              )}
                              {bloc.map((exo, ei) => renderExo(exo, ei, isGroup))}
                            </div>
                          )
                        }) // fin blocs.map
                      })()}

                      <div style={{ padding: '5px' }}>
                        <button onClick={() => { setAddExoTo(r.id); setRechercheExo('') }}
                          style={{ width: '100%', background: '#0A0A0A', border: '1px dashed #252525', borderRadius: '6px', padding: '8px 4px', color: '#444', cursor: 'pointer', fontSize: '11px', fontWeight: '600', minHeight: '36px' }}>
                          + exercice
                        </button>
                      </div>
                    </div>
                  )
                })}
                {dayReals.length === 0 && (
                  <div style={{ color: '#1A1A1A', fontSize: '12px', textAlign: 'center', paddingTop: '24px' }}>—</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* MP — Menu action + / Wellness */}
      {mpActionDate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400 }}
          onClick={() => setMpActionDate(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#111', border: '1px solid #2A2A2A', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '340px' }}>
            <div style={{ fontWeight: '800', fontSize: '16px', marginBottom: '4px' }}>Ajouter</div>
            <div style={{ color: '#C9A84C', fontSize: '13px', marginBottom: '20px' }}>
              {new Date(mpActionDate + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '14px', borderRadius: '14px', border: '1px solid #1A6FFF40', background: '#1A6FFF10' }}>
                <div style={{ color: '#1A6FFF', fontWeight: '700', fontSize: '14px' }}>📋 Session d'entraînement</div>
                <select value={mpSeanceChoisie} onChange={e => setMpSeanceChoisie(e.target.value)}
                  style={{ background: '#0D0D0D', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '8px 10px', color: mpSeanceChoisie ? '#FFF' : '#555', fontSize: '13px', outline: 'none' }}>
                  <option value="">Choisir un modèle...</option>
                  {mpTemplates.map(t => <option key={t.id} value={t.id}>{t.nom}</option>)}
                </select>
                <button onClick={() => mpAttribuerSession(mpActionDate)} disabled={!mpSeanceChoisie}
                  style={{ padding: '10px', borderRadius: '10px', border: 'none', background: mpSeanceChoisie ? '#1A6FFF' : '#333', color: '#FFF', cursor: mpSeanceChoisie ? 'pointer' : 'not-allowed', fontWeight: '700', fontSize: '14px' }}>
                  Ajouter au planning
                </button>
              </div>
              <button onClick={() => { setMpWellnessDate(mpActionDate); setMpWellnessData({ fatigue: 5, rpe: 5, courbatures: 5, qualite_sommeil: 5, notes: '' }); setMpActionDate(null) }}
                style={{ padding: '16px', borderRadius: '14px', border: '1px solid #2ECC7140', background: '#2ECC7115', color: '#2ECC71', cursor: 'pointer', fontSize: '15px', fontWeight: '700', textAlign: 'left' }}>
                💚 Indices Wellness
              </button>
            </div>
            <button onClick={() => setMpActionDate(null)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #2A2A2A', background: 'transparent', color: '#555', cursor: 'pointer', fontSize: '14px' }}>Annuler</button>
          </div>
        </div>
      )}

      {/* MP — Modal Wellness */}
      {mpWellnessDate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400 }}>
          <div style={{ background: '#111', border: '1px solid #2A2A2A', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '440px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
              <div style={{ fontWeight: '800', fontSize: '17px' }}>💚 Wellness</div>
              <button onClick={() => setMpWellnessDate(null)} style={{ background: 'none', border: 'none', color: '#888', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ color: '#C9A84C', fontSize: '13px', marginBottom: '24px' }}>
              {new Date(mpWellnessDate + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            {([
              { key: 'fatigue', label: 'Fatigue', color: '#FF4757', desc: '1 = reposé · 10 = épuisé' },
              { key: 'rpe', label: 'Effort perçu (RPE)', color: '#1A6FFF', desc: '1 = très facile · 10 = maximal' },
              { key: 'courbatures', label: 'Courbatures', color: '#FF6B35', desc: '1 = aucune · 10 = très douloureux' },
              { key: 'qualite_sommeil', label: 'Qualité du sommeil', color: '#2ECC71', desc: '1 = très mauvais · 10 = excellent' },
            ] as { key: keyof typeof mpWellnessData; label: string; color: string; desc: string }[]).map(({ key, label, color, desc }) => (
              <div key={key} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px', color }}>{label}</div>
                    <div style={{ color: '#555', fontSize: '11px' }}>{desc}</div>
                  </div>
                  <div style={{ color, fontWeight: '900', fontSize: '28px', minWidth: '40px', textAlign: 'center', lineHeight: 1 }}>
                    {key !== 'notes' && mpWellnessData[key]}
                  </div>
                </div>
                <input type="range" min="1" max="10" value={mpWellnessData[key] as number}
                  onChange={e => setMpWellnessData(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: color, height: '6px', cursor: 'pointer' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#333', fontSize: '10px', marginTop: '2px' }}>
                  <span>1</span><span>5</span><span>10</span>
                </div>
              </div>
            ))}
            <textarea placeholder="Notes (optionnel)..." value={mpWellnessData.notes}
              onChange={e => setMpWellnessData(prev => ({ ...prev, notes: e.target.value }))}
              style={{ width: '100%', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '10px', padding: '12px', color: '#FFF', fontSize: '14px', outline: 'none', resize: 'none', minHeight: '80px', marginBottom: '16px', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setMpWellnessDate(null)} style={{ flex: 1, padding: '13px', borderRadius: '12px', border: '1px solid #2A2A2A', background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '14px' }}>Annuler</button>
              <button onClick={mpSauvegarderWellness} style={{ flex: 2, padding: '13px', borderRadius: '12px', border: 'none', background: '#2ECC71', color: '#FFF', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {addExoTo && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400 }}>
          <div style={{ background: '#111', border: '1px solid #2A2A2A', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '440px', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700' }}>Ajouter un exercice</h3>
              <button onClick={() => setAddExoTo(null)} style={{ background: 'none', border: 'none', color: '#888', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <input value={rechercheExo} onChange={e => setRechercheExo(e.target.value)} placeholder="Rechercher..."
              autoFocus
              style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '10px 14px', color: '#FFF', fontSize: '14px', outline: 'none', marginBottom: '10px' }} />
            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {exercices.filter(e => e.nom.toLowerCase().includes(rechercheExo.toLowerCase())).map(ex => (
                <button key={ex.id} onClick={() => addExoToSession(addExoTo, ex)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '10px 14px', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ color: '#FFF', fontSize: '13px', fontWeight: '600' }}>{ex.nom}</span>
                  {ex.familles && <span style={{ fontSize: '10px', color: ex.familles.couleur, background: ex.familles.couleur + '20', padding: '2px 8px', borderRadius: '8px' }}>{ex.familles.nom}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE BOTTOM SHEET : édition exercice ── */}
      {isMobile && expandedExo && (() => {
        const r = reals.find(r => r.id === expandedExo.rId)
        const exo = r?.seances?.seance_exercices?.find(e => e.id === expandedExo.eId)
        if (!r || !exo) return null
        const fam = exo.exercices?.familles
        const couleur = fam?.couleur || '#555'
        const hasSets = exo.sets_config && exo.sets_config.length > 0
        const inputLg: React.CSSProperties = { background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '10px', color: '#FFF', fontSize: '16px', outline: 'none', textAlign: 'center', width: '100%', boxSizing: 'border-box' as const }
        return (
          <>
            {/* Backdrop */}
            <div onClick={() => setExpandedExo(null)} style={{ position: 'fixed', inset: 0, zIndex: 400, background: '#00000080' }} />
            {/* Sheet */}
            <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 401, background: '#131313', borderRadius: '16px 16px 0 0', border: '1px solid #252525', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
              {/* Handle */}
              <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
                <div style={{ width: '36px', height: '4px', background: '#333', borderRadius: '2px' }} />
              </div>
              {/* Header */}
              <div style={{ padding: '8px 16px 12px', borderBottom: '1px solid #1E1E1E', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', background: couleur + '20', border: `1px solid ${couleur}40`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: couleur, fontSize: '12px', fontWeight: '900' }}>{exo.ordre}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {fam && <div style={{ color: couleur, fontSize: '10px', fontWeight: '800', textTransform: 'uppercase' }}>{fam.nom}</div>}
                  <div style={{ color: '#FFF', fontWeight: '800', fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exo.exercices?.nom}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => { moveExo(r.id, exo.id, -1) }} style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '8px 12px', color: '#888', cursor: 'pointer', fontSize: '14px' }}>▲</button>
                  <button onClick={() => { moveExo(r.id, exo.id, 1) }} style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '8px 12px', color: '#888', cursor: 'pointer', fontSize: '14px' }}>▼</button>
                  <button onClick={() => { removeExo(r.id, exo.id); setExpandedExo(null) }} style={{ background: '#FF475710', border: '1px solid #FF475730', borderRadius: '8px', padding: '8px 12px', color: '#FF4757', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                </div>
              </div>
              {/* Body scrollable */}
              <div style={{ overflowY: 'auto', flex: 1, padding: '16px' }}>
                {/* Nb séries */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ color: '#555', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Séries</span>
                  <input type="number" placeholder="—" value={exo.series ?? ''}
                    onChange={async e => {
                      const val = e.target.value === '' ? undefined : Math.max(1, Number(e.target.value))
                      patchExoLocal(r.id, exo.id, { series: val })
                      await saveExoField(exo.id, { series: val ?? null })
                    }}
                    style={{ ...inputLg, width: '80px' }} />
                  <button onClick={() => addSet(r.id, exo.id, exo)}
                    style={{ background: '#1A6FFF20', border: '1px solid #1A6FFF40', borderRadius: '10px', padding: '10px 18px', color: '#1A6FFF', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}>+ Série</button>
                  <div style={{ flex: 1 }} />
                  <button onClick={() => toggleLienSuivant(r.id, exo)}
                    style={{ background: exo.lien_suivant ? '#1A6FFF20' : '#1A1A1A', border: `1px solid ${exo.lien_suivant ? '#1A6FFF50' : '#2A2A2A'}`, borderRadius: '10px', padding: '10px 14px', color: exo.lien_suivant ? '#1A6FFF' : '#555', cursor: 'pointer', fontSize: '14px' }}>⇌</button>
                </div>

                {/* Table sets */}
                {hasSets ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* Headers */}
                    <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 1fr 1fr 1fr 28px', gap: '6px', padding: '0 2px' }}>
                      {['', 'Reps', 'Dur', 'Dist', 'Kg', 'Réc', ''].map((h, hi) => (
                        <div key={hi} style={{ color: '#555', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', textAlign: 'center' }}>{h}</div>
                      ))}
                    </div>
                    {exo.sets_config!.map((s, si) => (
                      <div key={si} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 1fr 1fr 1fr 28px', gap: '6px', alignItems: 'center' }}>
                        <div style={{ color: '#C9A84C', fontSize: '13px', fontWeight: '800', textAlign: 'center' }}>{si + 1}</div>
                        {(['reps', 'duree', 'dist', 'charge', 'recup'] as (keyof SetConfig)[]).map(key => (
                          <input key={key} type="number" placeholder="-" min="0"
                            value={s[key] ?? ''}
                            onChange={e => patchSet(r.id, exo.id, exo, si, key, e.target.value)}
                            onBlur={() => flushSets(exo.id, r.id)}
                            style={inputLg} />
                        ))}
                        <button onClick={() => removeSet(r.id, exo.id, exo, si)}
                          style={{ background: 'transparent', border: 'none', color: '#FF475760', cursor: 'pointer', fontSize: '16px', padding: '0' }}>✕</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '8px' }}>
                    {[
                      ['Reps', 'repetitions', exo.repetitions],
                      ['Dur (s)', 'duree_secondes', exo.duree_secondes],
                      ['Dist (m)', 'distance_metres', exo.distance_metres],
                      ['Kg', 'charge_kg', exo.charge_kg],
                      ['Réc (s)', 'recuperation_secondes', exo.recuperation_secondes],
                    ].map(([label, key, val]) => (
                      <div key={key as string} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ color: '#555', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', textAlign: 'center' }}>{label as string}</div>
                        <input type="number" placeholder="-" min="0"
                          value={(val as number) ?? ''}
                          onChange={e => patchSimple(r.id, exo.id, key as string, e.target.value)}
                          onBlur={() => flushSimple(exo.id, r.id, key as string)}
                          style={inputLg} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Footer */}
              <div style={{ padding: '12px 16px', borderTop: '1px solid #1E1E1E' }}>
                <button onClick={() => setExpandedExo(null)}
                  style={{ width: '100%', padding: '14px', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '12px', color: '#888', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}>Fermer</button>
              </div>
            </div>
          </>
        )
      })()}

      {/* Barre flottante mode sélection */}
      {modeSelection && joursSelectionnes.size > 0 && (
        <div style={{
          position: 'absolute', bottom: '16px', left: '12px', right: '12px', zIndex: 20,
          background: '#0A1A0F', border: '1px solid #2ECC7140', borderRadius: '16px',
          padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px',
          boxShadow: '0 8px 32px rgba(46,204,113,0.15)',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#2ECC71', fontWeight: '800', fontSize: '14px' }}>
              {joursSelectionnes.size} jour{joursSelectionnes.size > 1 ? 's' : ''} sélectionné{joursSelectionnes.size > 1 ? 's' : ''}
            </div>
            <div style={{ color: '#555', fontSize: '11px' }}>
              {[...joursSelectionnes].reduce((n, d) => n + ((byDate[d] || []).filter(r => r.seance_id).length), 0)} séance(s)
            </div>
          </div>
          <button onClick={() => setJoursSelectionnes(new Set())} style={{ background: 'none', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '6px 10px', color: '#555', cursor: 'pointer', fontSize: '11px' }}>Effacer</button>
          <button onClick={() => setShowCopierModal(true)} style={{
            background: '#2ECC71', border: 'none', borderRadius: '10px',
            padding: '10px 20px', color: '#000', cursor: 'pointer',
            fontSize: '13px', fontWeight: '800', whiteSpace: 'nowrap',
          }}>Copier →</button>
        </div>
      )}

      {/* Modal copie */}
      {showCopierModal && (
        <CopierJoursModal
          joursSelectionnes={joursSelectionnes}
          byDate={byDate}
          joueurCourant={joueur}
          allJoueurs={allJoueurs}
          onDone={() => { setShowCopierModal(false); setModeSelection(false); setJoursSelectionnes(new Set()) }}
          onClose={() => setShowCopierModal(false)}
        />
      )}
    </div>
  )
}

function ProfilJoueur({ joueur, onBack }: { joueur: Joueur; onBack: () => void }) {
  const today = new Date().toISOString().split('T')[0]
  const [onglet, setOnglet] = useState<'calendrier' | 'favoris' | 'graphiques' | 'messages'>('calendrier')
  const [showMasterPlanner, setShowMasterPlanner] = useState(false)
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
  const [actionMenuDate, setActionMenuDate] = useState<string | null>(null)
  const [wellnessDate, setWellnessDate] = useState<string | null>(null)
  const [wellnessData, setWellnessData] = useState({ fatigue: 5, rpe: 5, courbatures: 5, qualite_sommeil: 5, notes: '' })
  useEffect(() => { loadData() }, [joueur.id])

  async function loadData() {
    const [{ data: reals }, { data: tmpl }, { data: exs }, { data: favs }] = await Promise.all([
      supabase.from('realisations').select('id, seance_id, date_realisation, completee, rpe, fatigue, courbatures, qualite_sommeil, notes_joueur, seances(id, nom, type, est_template, seance_exercices(id, ordre, series, repetitions, duree_secondes, distance_metres, charge_kg, recuperation_secondes, lien_suivant, notes, exercices(nom, consignes_execution, familles(nom, couleur))))').eq('joueur_id', joueur.id).order('date_realisation'),
      supabase.from('seances').select('id, nom, type').eq('est_template', true).order('nom'),
      supabase.from('exercices').select('*, familles(id, nom, couleur)').order('nom'),
      supabase.from('seances').select('*, seance_exercices(*, exercices(nom, familles(id, nom, couleur)))').eq('est_template', true).order('nom'),
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

  async function sauvegarderWellness() {
    if (!wellnessDate) return
    await supabase.from('realisations').insert({
      joueur_id: joueur.id,
      seance_id: null,
      date_realisation: wellnessDate,
      completee: false,
      fatigue: wellnessData.fatigue || null,
      rpe: wellnessData.rpe || null,
      courbatures: wellnessData.courbatures || null,
      qualite_sommeil: wellnessData.qualite_sommeil || null,
      notes_joueur: wellnessData.notes || null,
    })
    await loadData()
    setWellnessDate(null)
    setWellnessData({ fatigue: 5, rpe: 5, courbatures: 5, qualite_sommeil: 5, notes: '' })
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {/* Ligne 1 : nav + Master Planner */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={allerAujourdhui} style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '7px 12px', color: '#888', cursor: 'pointer', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>Aujourd'hui</button>
              <button onClick={() => decalerRange(-7)} style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '7px 12px', color: '#888', cursor: 'pointer', fontSize: '14px' }}>‹</button>
              <button onClick={() => decalerRange(7)} style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '7px 12px', color: '#888', cursor: 'pointer', fontSize: '14px' }}>›</button>
              <button onClick={() => setShowMasterPlanner(true)} style={{ background: '#1A6FFF20', border: '1px solid #1A6FFF50', borderRadius: '8px', padding: '7px 14px', color: '#1A6FFF', cursor: 'pointer', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap', letterSpacing: '-0.3px' }}>▦ Master Planner</button>
            </div>
            {/* Ligne 2 : plage de dates */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
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
                      <div style={{ padding: '7px 7px 5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1A1A1A' }}>
                        <div style={{ fontSize: '18px', fontWeight: isToday ? '900' : '600', color: isToday ? '#007AFF' : isPast ? '#444' : '#CCC', lineHeight: 1 }}>{dateNum}</div>
                        <button onClick={() => setActionMenuDate(ds)}
                          style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid #252525', background: 'transparent', color: '#555', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, padding: 0 }}>+</button>
                      </div>

                      {/* Cartes séances */}
                      <div style={{ flex: 1, padding: '4px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {realsJour.map(r => {
                          const isWellness = !r.seances
                          if (isWellness) {
                            // Couleur par valeur: fatigue/rpe/courbatures = vert→rouge, sommeil = rouge→vert
                            const wColor = (v: number, inverted = false) => {
                              const n = inverted ? 11 - v : v
                              if (n <= 3) return '#2ECC71'
                              if (n <= 5) return '#F39C12'
                              if (n <= 7) return '#FF6B35'
                              return '#FF4757'
                            }
                            return (
                              <div key={r.id} onClick={() => setSeanceDetail(r)} style={{
                                background: '#2ECC7112',
                                border: '1px solid #2ECC7128', borderLeft: '3px solid #2ECC71',
                                borderRadius: '6px', padding: '6px 7px', cursor: 'pointer',
                              }}>
                                <div style={{ fontSize: '10px', fontWeight: '800', color: '#2ECC71', marginBottom: '4px', letterSpacing: '0.3px' }}>💚 Wellness</div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 6px' }}>
                                  {r.fatigue != null && <span style={{ fontSize: '11px', fontWeight: '800', color: wColor(r.fatigue) }}>F <span style={{ fontSize: '13px' }}>{r.fatigue}</span></span>}
                                  {r.rpe != null && <span style={{ fontSize: '11px', fontWeight: '800', color: wColor(r.rpe) }}>R <span style={{ fontSize: '13px' }}>{r.rpe}</span></span>}
                                  {r.qualite_sommeil != null && <span style={{ fontSize: '11px', fontWeight: '800', color: wColor(r.qualite_sommeil, true) }}>S <span style={{ fontSize: '13px' }}>{r.qualite_sommeil}</span></span>}
                                  {r.courbatures != null && <span style={{ fontSize: '11px', fontWeight: '800', color: wColor(r.courbatures) }}>C <span style={{ fontSize: '13px' }}>{r.courbatures}</span></span>}
                                </div>
                              </div>
                            )
                          }
                          const couleur = r.completee ? '#2ECC71' : isPast ? '#FF4757' : '#1A6FFF'
                          return (
                            <div key={r.id} onClick={() => setSeanceDetail(r)} style={{
                              background: r.completee ? '#2ECC7112' : isPast ? '#FF475710' : '#1A6FFF0E',
                              border: `1px solid ${couleur}28`,
                              borderLeft: `3px solid ${couleur}`,
                              borderRadius: '6px', padding: '6px 7px',
                              cursor: 'pointer',
                              display: 'flex', alignItems: 'center', gap: '6px',
                              minHeight: '36px',
                            }}>
                              <input type="checkbox" checked={r.completee} onChange={e => { e.stopPropagation(); toggleCompletee(r) }}
                                style={{ accentColor: couleur, flexShrink: 0, cursor: 'pointer', width: '14px', height: '14px' }} />
                              <div style={{ flex: 1, overflow: 'hidden' }}>
                                <div style={{ fontSize: '12px', fontWeight: '700', color: '#E0E0E0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.seances?.nom || 'Séance'}</div>
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
                <div style={{ fontWeight: '800', fontSize: '17px' }}>{seanceDetail.seances ? seanceDetail.seances.nom : '💚 Wellness'}</div>
                <div style={{ color: '#C9A84C', fontSize: '13px', marginTop: '3px' }}>
                  {new Date(seanceDetail.date_realisation + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
              </div>
              <button onClick={() => setSeanceDetail(null)} style={{ background: 'none', border: 'none', color: '#555', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            {/* Toggle complétée — seulement pour les vraies séances */}
            {seanceDetail.seances && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '16px', padding: '10px 14px', background: seanceDetail.completee ? '#2ECC7115' : '#1A1A1A', borderRadius: '10px', border: `1px solid ${seanceDetail.completee ? '#2ECC7140' : '#2A2A2A'}` }}>
                <input type="checkbox" checked={seanceDetail.completee} onChange={() => toggleCompletee(seanceDetail)} style={{ accentColor: '#2ECC71', width: '16px', height: '16px', cursor: 'pointer' }} />
                <span style={{ fontWeight: '600', fontSize: '13px', color: seanceDetail.completee ? '#2ECC71' : '#888' }}>
                  {seanceDetail.completee ? 'Séance réalisée' : 'Marquer comme réalisée'}
                </span>
              </label>
            )}

            {/* Exercices — seulement pour les vraies séances */}
            {(() => {
              if (!seanceDetail.seances) return null
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
            {(seanceDetail.rpe || seanceDetail.fatigue || seanceDetail.courbatures || seanceDetail.qualite_sommeil || seanceDetail.notes_joueur) && (() => {
              const wc = (v: number, inv = false) => {
                const n = inv ? 11 - v : v
                if (n <= 3) return '#2ECC71'
                if (n <= 5) return '#F39C12'
                if (n <= 7) return '#FF6B35'
                return '#FF4757'
              }
              const items = [
                { label: 'Fatigue', val: seanceDetail.fatigue, inv: false },
                { label: 'Courbatures', val: seanceDetail.courbatures, inv: false },
                { label: 'Effort', val: seanceDetail.rpe, inv: false },
                { label: 'Sommeil', val: seanceDetail.qualite_sommeil, inv: true },
              ].filter(x => x.val != null)
              return (
                <div style={{ background: '#0D0D0D', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
                  <div style={{ color: '#555', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Ressenti joueur</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: seanceDetail.notes_joueur ? '10px' : '0' }}>
                    {items.map(({ label, val, inv }) => {
                      const c = wc(val!, inv)
                      return (
                        <div key={label} style={{ background: c + '20', border: `1px solid ${c}40`, borderRadius: '10px', padding: '8px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', minWidth: '64px' }}>
                          <span style={{ color: '#888', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>{label}</span>
                          <span style={{ color: c, fontWeight: '900', fontSize: '22px', lineHeight: 1 }}>{val}</span>
                          <span style={{ color: c + '80', fontSize: '9px' }}>/10</span>
                        </div>
                      )
                    })}
                  </div>
                  {seanceDetail.notes_joueur && (
                    <div style={{ color: '#AAA', fontSize: '13px', fontStyle: 'italic', borderTop: '1px solid #1E1E1E', paddingTop: '10px' }}>"{seanceDetail.notes_joueur}"</div>
                  )}
                </div>
              )
            })()}

            {/* Supprimer du planning */}
            <button onClick={() => supprimerRealisation(seanceDetail.id)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #FF475730', background: '#FF475710', color: '#FF4757', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
              Retirer du planning
            </button>
          </div>
        </div>
      )}

      {/* Master Planner overlay */}
      {showMasterPlanner && (
        <MasterPlannerView
          joueur={joueur}
          realisations={realisations as unknown as MPRealisation[]}
          exercices={exercices}
          weekStart={rangeDebut}
          onClose={() => setShowMasterPlanner(false)}
          onReload={loadData}
        />
      )}

      {/* Menu action : Session ou Wellness */}
      {actionMenuDate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}
          onClick={() => setActionMenuDate(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#111', border: '1px solid #2A2A2A', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '320px' }}>
            <div style={{ fontWeight: '800', fontSize: '16px', marginBottom: '4px' }}>Ajouter</div>
            <div style={{ color: '#C9A84C', fontSize: '13px', marginBottom: '20px' }}>
              {new Date(actionMenuDate + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => { setCreateDate(actionMenuDate); setCreateMode('choisir'); setSeanceChoisie(''); setActionMenuDate(null) }}
                style={{ padding: '16px', borderRadius: '14px', border: '1px solid #1A6FFF40', background: '#1A6FFF15', color: '#1A6FFF', cursor: 'pointer', fontSize: '15px', fontWeight: '700', textAlign: 'left' }}>
                📋 Session d'entraînement
              </button>
              <button onClick={() => { setWellnessDate(actionMenuDate); setWellnessData({ fatigue: 5, rpe: 5, courbatures: 5, qualite_sommeil: 5, notes: '' }); setActionMenuDate(null) }}
                style={{ padding: '16px', borderRadius: '14px', border: '1px solid #2ECC7140', background: '#2ECC7115', color: '#2ECC71', cursor: 'pointer', fontSize: '15px', fontWeight: '700', textAlign: 'left' }}>
                💚 Indices Wellness
              </button>
            </div>
            <button onClick={() => setActionMenuDate(null)} style={{ width: '100%', padding: '12px', marginTop: '12px', borderRadius: '12px', border: '1px solid #2A2A2A', background: 'transparent', color: '#555', cursor: 'pointer', fontSize: '14px' }}>Annuler</button>
          </div>
        </div>
      )}

      {/* Modal Wellness */}
      {wellnessDate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#111', border: '1px solid #2A2A2A', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '440px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
              <div style={{ fontWeight: '800', fontSize: '17px' }}>💚 Wellness</div>
              <button onClick={() => setWellnessDate(null)} style={{ background: 'none', border: 'none', color: '#888', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ color: '#C9A84C', fontSize: '13px', marginBottom: '24px' }}>
              {new Date(wellnessDate + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            {([
              { key: 'fatigue', label: 'Fatigue', color: '#FF4757', desc: '1 = reposé · 10 = épuisé' },
              { key: 'rpe', label: 'Effort perçu (RPE)', color: '#1A6FFF', desc: '1 = très facile · 10 = maximal' },
              { key: 'courbatures', label: 'Courbatures', color: '#FF6B35', desc: '1 = aucune · 10 = très douloureux' },
              { key: 'qualite_sommeil', label: 'Qualité du sommeil', color: '#2ECC71', desc: '1 = très mauvais · 10 = excellent' },
            ] as { key: keyof typeof wellnessData; label: string; color: string; desc: string }[]).map(({ key, label, color, desc }) => (
              <div key={key} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px', color }}>{label}</div>
                    <div style={{ color: '#555', fontSize: '11px' }}>{desc}</div>
                  </div>
                  <div style={{ color, fontWeight: '900', fontSize: '28px', minWidth: '40px', textAlign: 'center', lineHeight: 1 }}>
                    {key === 'notes' ? '' : wellnessData[key]}
                  </div>
                </div>
                <input type="range" min="1" max="10" value={wellnessData[key] as number}
                  onChange={e => setWellnessData(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: color, height: '6px', cursor: 'pointer' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#333', fontSize: '10px', marginTop: '2px' }}>
                  <span>1</span><span>5</span><span>10</span>
                </div>
              </div>
            ))}
            <textarea placeholder="Notes (optionnel)..." value={wellnessData.notes}
              onChange={e => setWellnessData(prev => ({ ...prev, notes: e.target.value }))}
              style={{ width: '100%', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '10px', padding: '12px', color: '#FFF', fontSize: '14px', outline: 'none', resize: 'none', minHeight: '80px', marginBottom: '16px', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setWellnessDate(null)} style={{ flex: 1, padding: '13px', borderRadius: '12px', border: '1px solid #2A2A2A', background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '14px' }}>Annuler</button>
              <button onClick={sauvegarderWellness} style={{ flex: 2, padding: '13px', borderRadius: '12px', border: 'none', background: '#2ECC71', color: '#FFF', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>Enregistrer</button>
            </div>
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
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '520px' }}>
        <div className="modal-title">Attribuer des séances</div>
        <div className="modal-subtitle">{seances.length} séance{seances.length > 1 ? 's' : ''} sélectionnée{seances.length > 1 ? 's' : ''}</div>

        {/* Date + intervalle */}
        <div style={{ marginBottom: '16px' }}>
          <label className="section-label" style={{ display: 'block', marginBottom: '8px' }}>Planification</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)}
              className="input" style={{ width: 'auto' }} />
            {seances.length > 1 && (
              <>
                <span style={{ color: '#555', fontSize: '13px' }}>tous les</span>
                <input type="number" min={1} value={intervalJours} onChange={e => setIntervalJours(Number(e.target.value))}
                  className="input" style={{ width: '56px', textAlign: 'center' }} />
                <span style={{ color: '#555', fontSize: '13px' }}>jours</span>
              </>
            )}
          </div>
        </div>

        {/* Liste séances + dates */}
        <div style={{ background: '#08080A', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px', border: '1px solid #1A1A22' }}>
          {seances.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: i < seances.length - 1 ? '1px solid #141418' : 'none' }}>
              <span style={{ color: '#D0D0E0', fontSize: '13px', fontWeight: '600' }}>{s.nom}</span>
              <span style={{ color: '#D4AF60', fontSize: '12px', fontWeight: '700', background: '#C9A84C10', padding: '3px 8px', borderRadius: '6px' }}>
                {new Date(dates[i] + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
            </div>
          ))}
        </div>

        {/* Joueurs */}
        <div style={{ marginBottom: '24px' }}>
          <label className="section-label" style={{ display: 'block', marginBottom: '10px' }}>
            Joueurs {selectedJoueurs.size > 0 && <span style={{ color: '#5599FF', textTransform: 'none', letterSpacing: 0 }}>— {selectedJoueurs.size} sélectionné{selectedJoueurs.size > 1 ? 's' : ''}</span>}
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '220px', overflowY: 'auto' }}>
            {joueurs.length === 0 && <span style={{ color: '#444', fontSize: '13px' }}>Aucun joueur actif</span>}
            {joueurs.map(j => {
              const sel = selectedJoueurs.has(j.id)
              return (
                <button key={j.id} onClick={() => toggleJoueur(j.id)}
                  className={`list-item${sel ? ' list-item-active' : ''}`}
                  style={{ border: sel ? '1px solid #1A6FFF40' : '1px solid #1A1A22', cursor: 'pointer', textAlign: 'left' }}>
                  <div className={`checkbox-custom${sel ? ' checked' : ''}`}>{sel ? '✓' : ''}</div>
                  <span style={{ color: sel ? '#F0F0F8' : '#888', fontSize: '14px', fontWeight: sel ? '700' : '400' }}>{j.prenom} {j.nom}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} className="btn btn-ghost" style={{ flex: 1 }}>Annuler</button>
          <button onClick={confirmer} disabled={saving || selectedJoueurs.size === 0}
            className={`btn${selectedJoueurs.size > 0 && !saving ? ' btn-success' : ''}`}
            style={{ flex: 2, justifyContent: 'center', padding: '12px', ...(selectedJoueurs.size === 0 || saving ? { background: '#1A1A22', color: '#3A3A50', cursor: 'not-allowed' } : {}) }}>
            {saving ? 'Attribution...' : `Attribuer à ${selectedJoueurs.size || '...'} joueur${selectedJoueurs.size > 1 ? 's' : ''}`}
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

  // Sur mobile : si une conversation est ouverte, afficher plein écran
  const showChat = selectedJoueur && coachId && selectedJoueur.auth_id

  function selectJoueur(j: JoueurMsg) {
    if (!j.auth_id) return
    setSelectedId(j.id)
    setUnread(prev => { const u = { ...prev }; delete u[j.auth_id!]; return u })
    onUnreadChange(Math.max(0, Object.values({ ...unread, [j.auth_id!]: 0 }).reduce((a, b) => a + b, 0)))
  }

  const listeConversations = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #1A1A22', flexShrink: 0 }}>
        <div className="section-label">Conversations</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {joueurs.length === 0 && (
          <div className="empty-state"><div className="empty-state-text">Aucun joueur actif</div></div>
        )}
        {joueursSorted.map(j => {
          const last = j.auth_id ? lastMsgs[j.auth_id] : undefined
          const nbUnread = j.auth_id ? (unread[j.auth_id] || 0) : 0
          const isSelected = selectedId === j.id
          const hasAccount = !!j.auth_id
          return (
            <div key={j.id} onClick={() => selectJoueur(j)} style={{
              padding: '13px 16px', cursor: hasAccount ? 'pointer' : 'default',
              borderBottom: '1px solid #111115',
              background: isSelected ? '#1A6FFF0C' : 'transparent',
              borderLeft: `3px solid ${isSelected ? '#1A6FFF' : 'transparent'}`,
              opacity: hasAccount ? 1 : 0.35,
              transition: 'all 0.15s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                <div style={{ fontWeight: '700', fontSize: '14px', color: isSelected ? '#5599FF' : '#DDD' }}>{j.prenom} {j.nom}</div>
                {nbUnread > 0 && <span className="nav-badge">{nbUnread}</span>}
              </div>
              <div style={{ fontSize: '12px', color: '#444', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {!hasAccount ? 'Pas encore connecté' : last ? `${last.expediteur_id === coachId ? 'Vous : ' : ''}${fmtLast(last)}` : 'Démarrer la conversation'}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const chatView = showChat ? (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #1A1A22', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        {/* Bouton retour — visible uniquement sur mobile */}
        <button onClick={() => setSelectedId(null)} className="btn btn-ghost btn-sm msg-back-btn">← Retour</button>
        <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#1A6FFF20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '13px', color: '#5599FF', flexShrink: 0 }}>
          {selectedJoueur.prenom[0]}{selectedJoueur.nom[0]}
        </div>
        <div style={{ fontWeight: '700', fontSize: '15px' }}>{selectedJoueur.prenom} {selectedJoueur.nom}</div>
      </div>
      <ChatView key={selectedJoueur.auth_id!} myId={coachId!} otherId={selectedJoueur.auth_id!} height="calc(100svh - 220px)" />
    </div>
  ) : (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', color: '#333' }}>
      <div style={{ fontSize: '36px' }}>💬</div>
      <div style={{ fontSize: '13px' }}>Sélectionne un joueur</div>
    </div>
  )

  return (
    <div className="page-section">
      {/* ── Desktop : 2 colonnes ── */}
      <div className="msg-desktop" style={{ display: 'flex', height: 'calc(100svh - 130px)', background: '#0D0D10', borderRadius: '16px', overflow: 'hidden', border: '1px solid #1A1A22' }}>
        <div style={{ width: '260px', borderRight: '1px solid #1A1A22', flexShrink: 0 }}>
          {listeConversations}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {chatView}
        </div>
      </div>

      {/* ── Mobile : liste OU chat (pas les deux) ── */}
      <div className="msg-mobile" style={{ background: '#0D0D10', borderRadius: '16px', overflow: 'hidden', border: '1px solid #1A1A22', height: 'calc(100svh - 130px)' }}>
        {showChat ? chatView : listeConversations}
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
