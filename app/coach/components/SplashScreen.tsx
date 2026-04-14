'use client'

import { useEffect } from 'react'

export function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
      animation: 'splashFadeOut 0.5s ease 2.1s both',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '44px', fontWeight: '900', letterSpacing: '-2.5px', lineHeight: 1, display: 'flex', alignItems: 'baseline', gap: '0px', justifyContent: 'center' }}>
          <span style={{
            color: '#FFFFFF',
            display: 'inline-block',
            animation: 'splashWordIn 0.65s cubic-bezier(0.22,1,0.36,1) 0.15s both',
          }}>PAGA</span>
          <span style={{
            background: 'linear-gradient(135deg, #1A6FFF 0%, #6BAAFF 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            display: 'inline-block',
            animation: 'splashWordIn 0.65s cubic-bezier(0.22,1,0.36,1) 0.32s both',
          }}>COACHING</span>
        </div>

        <div style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #1A6FFF 30%, #6BAAFF 70%, transparent)',
          marginTop: '14px',
          transformOrigin: 'center',
          animation: 'splashLineIn 0.55s cubic-bezier(0.22,1,0.36,1) 0.7s both',
        }} />

        <div style={{
          color: '#444',
          fontSize: '10px',
          textTransform: 'uppercase',
          marginTop: '14px',
          fontWeight: '700',
          animation: 'splashSubIn 0.6s ease 1s both',
        }}>
          Performance Coaching
        </div>
      </div>
    </div>
  )
}
