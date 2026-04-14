'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ChatView } from './ChatView'
import { MsgType } from '../lib/types'

export function Messages({ coachId, onUnreadChange }: { coachId: string | null; onUnreadChange: (n: number) => void }) {
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
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #22223A', flexShrink: 0 }}>
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
              <div style={{ fontSize: '12px', color: '#7878A8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #22223A', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
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
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', color: '#6A6A8A' }}>
      <div style={{ fontSize: '36px' }}>💬</div>
      <div style={{ fontSize: '13px' }}>Sélectionne un joueur</div>
    </div>
  )

  return (
    <div className="page-section">
      {/* ── Desktop : 2 colonnes ── */}
      <div className="msg-desktop" style={{ display: 'flex', height: 'calc(100svh - 130px)', background: '#0E0E18', borderRadius: '16px', overflow: 'hidden', border: '1px solid #22223A' }}>
        <div style={{ width: '260px', borderRight: '1px solid #22223A', flexShrink: 0 }}>
          {listeConversations}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {chatView}
        </div>
      </div>

      {/* ── Mobile : liste OU chat (pas les deux) ── */}
      <div className="msg-mobile" style={{ background: '#0E0E18', borderRadius: '16px', overflow: 'hidden', border: '1px solid #22223A', height: 'calc(100svh - 130px)' }}>
        {showChat ? chatView : listeConversations}
      </div>
    </div>
  )
}

