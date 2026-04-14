'use client'

import { Component, ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean; message: string }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', background: '#0B0B14', display: 'flex',
          alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '32px',
        }}>
          <div style={{ fontSize: '48px' }}>⚠️</div>
          <div style={{ color: '#FFF', fontWeight: '700', fontSize: '20px' }}>Une erreur est survenue</div>
          <div style={{ color: '#888', fontSize: '13px', textAlign: 'center', maxWidth: '400px' }}>{this.state.message}</div>
          <button
            onClick={() => { this.setState({ hasError: false, message: '' }); window.location.reload() }}
            style={{ marginTop: '8px', padding: '12px 28px', borderRadius: '10px', background: '#1A6FFF', border: 'none', color: '#FFF', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
          >
            Recharger l'application
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
