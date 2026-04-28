'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
      return
    }

    // Détermine le rôle côté serveur via le token (session pas encore en cookie)
    const token = data.session?.access_token ?? ''
    const headers = { 'Authorization': `Bearer ${token}` }

    const roleRes = await fetch('/api/me/role', { headers })
    const { role } = await roleRes.json()
    if (role === 'coach') {
      router.push('/coach')
      return
    }

    // Vérifie l'accès du joueur via API (service role)
    const res = await fetch(`/api/joueurs/check-access?email=${encodeURIComponent(data.user?.email ?? '')}`, { headers })
    const access = await res.json()

    if (!access.allowed) {
      await supabase.auth.signOut()
      if (access.reason === 'expired') setError('Ton accès a expiré. Contacte ton coach.')
      else if (access.reason === 'not_yet') setError("Ton accès n'est pas encore actif.")
      else setError('Accès suspendu. Contacte ton coach.')
      setLoading(false)
      return
    }

    router.push('/joueur')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0A0A0A',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-1px' }}>
            <span style={{ color: '#FFFFFF' }}>PAGA</span>
            <span style={{ color: '#1A6FFF' }}>COACHING</span>
          </div>
          <div style={{
            width: '32px', height: '3px',
            background: '#C9A84C',
            margin: '8px auto 0',
            borderRadius: '2px',
          }} />
        </div>

        {/* Formulaire */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ color: '#888', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="ton@email.com"
              style={{
                width: '100%',
                background: '#111',
                border: '1px solid #2A2A2A',
                borderRadius: '10px',
                padding: '14px 16px',
                color: '#FFF',
                fontSize: '16px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ color: '#888', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                background: '#111',
                border: '1px solid #2A2A2A',
                borderRadius: '10px',
                padding: '14px 16px',
                color: '#FFF',
                fontSize: '16px',
                outline: 'none',
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#FF4757',
              color: '#FFF',
              padding: '12px 16px',
              borderRadius: '10px',
              fontSize: '14px',
              textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#333' : '#1A6FFF',
              color: '#FFF',
              padding: '16px',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '16px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '8px',
              letterSpacing: '0.5px',
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
