export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0A0A0A',
      padding: '24px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <div style={{
          fontSize: '48px',
          fontWeight: '900',
          letterSpacing: '-1px',
          marginBottom: '8px',
        }}>
          <span style={{ color: '#FFFFFF' }}>PAGA</span>
          <span style={{ color: '#1A6FFF' }}>COACHING</span>
        </div>
        <div style={{
          width: '40px',
          height: '3px',
          background: '#C9A84C',
          margin: '0 auto 32px',
          borderRadius: '2px',
        }} />
        <p style={{
          color: '#888888',
          fontSize: '14px',
          marginBottom: '40px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}>
          Plateforme de coaching athlétique
        </p>

        <a href="/login" style={{
          display: 'block',
          background: '#1A6FFF',
          color: '#FFFFFF',
          padding: '16px 32px',
          borderRadius: '12px',
          fontWeight: '700',
          fontSize: '16px',
          textDecoration: 'none',
          letterSpacing: '0.5px',
        }}>
          Accéder à la plateforme
        </a>
      </div>
    </div>
  )
}
