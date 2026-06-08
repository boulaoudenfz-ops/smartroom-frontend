import Link from 'next/link'

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #EFEBE9, #F5F5DC)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{
  width: '300px',
  height: '80px',
  margin: '0 auto 1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}}>
  <img
    src="/logo.png"
    alt="SmartRoom Logo"
    style={{
      width: '150%',
      height: '200%',
      objectFit: 'contain'
    }}
  />
</div>
        
        <p style={{ color: '#6D4C41', marginBottom: '2rem', fontSize: '0.9rem' , alignItems: 'center',}}>
          Intelligent Workspace Reservation Platform
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/login" style={{
            background: '#6D4C41', color: 'white', padding: '0.75rem 2rem',
            borderRadius: '12px', textDecoration: 'none', fontWeight: 500
          }}>
            Sign In
          </Link>
          <Link href="/register" style={{
            background: 'transparent', color: '#6D4C41', padding: '0.75rem 2rem',
            borderRadius: '12px', textDecoration: 'none', fontWeight: 500,
            border: '1px solid #6D4C41'
          }}>
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}