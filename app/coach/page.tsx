'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { NAV_ITEMS } from './lib/types'
import { haptic } from './lib/utils'
import { SplashScreen } from './components/SplashScreen'
import { Dashboard } from './components/Dashboard'
import { Joueurs } from './components/Joueurs'
import { Exercices } from './components/Exercices'
import { Modeles } from './components/Modeles'
import { Programmes } from './components/Programmes'
import { Messages } from './components/Messages'

export default function CoachPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [coachId, setCoachId] = useState<string | null>(null)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [displayTab, setDisplayTab] = useState('dashboard')
  const [tabVisible, setTabVisible] = useState(true)
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === 'undefined') return false
    return !sessionStorage.getItem('splash_shown')
  })

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
    <div style={{ minHeight: '100vh', background: '#000' }} />
  )

  function navTo(id: string) {
    haptic('light')
    if (id === activeTab) { setSidebarOpen(false); return }
    setActiveTab(id)
    if (id === 'messages') setUnreadMessages(0)
    setSidebarOpen(false)
    setTabVisible(false)
    setTimeout(() => {
      setDisplayTab(id)
      setTabVisible(true)
    }, 140)
  }

  return (
    <div className="app-shell">

      {showSplash && (
        <SplashScreen onDone={() => {
          sessionStorage.setItem('splash_shown', '1')
          setShowSplash(false)
        }} />
      )}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 40 }}
        />
      )}

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

      <div className="main-content" style={{ flex: 1, padding: '20px 20px 32px', minWidth: 0 }}>
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

        <div style={{
          opacity: tabVisible ? 1 : 0,
          ...(tabVisible ? {} : { transform: 'translateY(10px)' }),
          transition: tabVisible ? 'opacity 0.25s ease, transform 0.25s cubic-bezier(0.22,1,0.36,1)' : 'opacity 0.12s ease, transform 0.12s ease',
        }}>
          {displayTab === 'dashboard' && <Dashboard coachId={coachId} onNavTo={navTo} />}
          {displayTab === 'joueurs' && <Joueurs />}
          {displayTab === 'exercices' && <Exercices />}
          {displayTab === 'modeles' && <Modeles />}
          {displayTab === 'programmes' && <Programmes />}
          {displayTab === 'messages' && <Messages coachId={coachId} onUnreadChange={setUnreadMessages} />}
        </div>
      </div>
    </div>
  )
}
