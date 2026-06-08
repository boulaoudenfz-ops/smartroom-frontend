'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    setLoading(true)
    setError('')
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required')
      setLoading(false)
      return
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        password_confirmation: confirmPassword,
      })
      
      // The backend is returning the response with a PHP comment, so we need to clean it
      let data = res.data
      if (typeof data === 'string') {
        // Remove the "// routes/api.php" comment if present
        const cleanData = data.replace(/^\/\/\s*[\w\/\.]+\s*\n?/, '')
        data = JSON.parse(cleanData)
      }
      
      console.log('Registration response:', data)
      
      // Handle the response structure
      const responseData = data.data || data
      const token = responseData?.token
      const user = responseData?.user
      
      if (!token) {
        console.error('No token found in response:', data)
        setError('Registration successful but no token received')
        return
      }
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      console.log('Account created and logged in, redirecting to dashboard...')
      window.location.href = '/dashboard'
    } catch (err: any) {
      console.error('Registration error:', err.response?.status, err.response?.data, err.message)
      setError(err.response?.data?.message ?? err.message ?? 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #EFEBE9, #F5F5DC)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.8)',
        borderRadius: '1.5rem',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 8px 32px rgba(78,52,46,0.12)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '80px',
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
                width: '350%',
                height: '150%',
                objectFit: 'contain'
              }}
            />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4E342E' }}>Create account</h1>
          <p style={{ color: '#8D6E63', fontSize: '0.875rem', marginTop: '0.25rem' }}>Join SmartRoom today</p>
        </div>

        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA',
            color: '#DC2626', padding: '0.75rem 1rem',
            borderRadius: '0.75rem', marginBottom: '1rem', fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6D4C41', display: 'block', marginBottom: '0.5rem' }}>
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="John Doe"
            style={{
              width: '100%', padding: '0.625rem 1rem',
              border: '1px solid #D7CCC8', borderRadius: '0.75rem',
              fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.7)'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6D4C41', display: 'block', marginBottom: '0.5rem' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={{
              width: '100%', padding: '0.625rem 1rem',
              border: '1px solid #D7CCC8', borderRadius: '0.75rem',
              fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.7)'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6D4C41', display: 'block', marginBottom: '0.5rem' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: '100%', padding: '0.625rem 1rem',
              border: '1px solid #D7CCC8', borderRadius: '0.75rem',
              fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.7)'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6D4C41', display: 'block', marginBottom: '0.5rem' }}>
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleRegister()}
            style={{
              width: '100%', padding: '0.625rem 1rem',
              border: '1px solid #D7CCC8', borderRadius: '0.75rem',
              fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.7)'
            }}
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            width: '100%', padding: '0.75rem',
            background: loading ? '#A1887F' : '#6D4C41',
            color: 'white', border: 'none', borderRadius: '0.75rem',
            fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer'
          }}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#8D6E63' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#6D4C41', fontWeight: 500 }}>Sign in</a>
        </p>
      </div>
    </div>
  )
}
