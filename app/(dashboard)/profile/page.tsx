'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/axios'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [form, setForm] = useState({ name: '', phone: '', department: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const u = JSON.parse(stored)
      setUser(u)
      setForm({ name: u.name ?? '', phone: u.phone ?? '', department: u.department ?? '' })
    }
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put(`/admin/users/${user.id}`, form)
      const updated = { ...user, ...form }
      localStorage.setItem('user', JSON.stringify(updated))
      setUser(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {}
    finally { setSaving(false) }
  }

  if (!user) return <div style={{ padding: '2rem', color: '#9E9E9E' }}>Loading...</div>

  const Field = ({ label, field, type = 'text' }: { label: string; field: keyof typeof form; type?: string }) => (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#4E342E', marginBottom: '0.5rem' }}>
        {label}
      </label>
      <input
        type={type}
        value={form[field]}
        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
        style={{
          width: '100%', padding: '0.7rem 1rem', borderRadius: '10px',
          border: '1px solid #E5E0DC', fontSize: '0.875rem', outline: 'none',
          background: '#FAF7F5', boxSizing: 'border-box'
        }}
      />
    </div>
  )

  return (
    <div style={{ maxWidth: '560px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#4E342E' }}>Profile</h2>
        <p style={{ fontSize: '0.875rem', color: '#9E9E9E', marginTop: '0.25rem' }}>Manage your account details</p>
      </div>

      {/* Avatar */}
      <div style={{
        background: 'white', borderRadius: '14px', padding: '1.5rem',
        border: '1px solid #F0EAE6', marginBottom: '1rem',
        display: 'flex', alignItems: 'center', gap: '1rem'
      }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #C8A97E, #6D4C41)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: '1.25rem', fontWeight: 700
        }}>
          {user.name?.charAt(0)}
        </div>
        <div>
          <div style={{ fontWeight: 600, color: '#4E342E' }}>{user.name}</div>
          <div style={{ fontSize: '0.8rem', color: '#9E9E9E' }}>{user.email}</div>
          <span style={{
            fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '999px',
            background: user.role === 'admin' ? '#F5EDE8' : '#F0F9FF',
            color: user.role === 'admin' ? '#6D4C41' : '#0369A1',
            fontWeight: 600, textTransform: 'capitalize', marginTop: '0.25rem', display: 'inline-block'
          }}>{user.role}</span>
        </div>
      </div>

      {/* Form */}
      <div style={{
        background: 'white', borderRadius: '14px', padding: '1.5rem',
        border: '1px solid #F0EAE6'
      }}>
        <Field label="Full Name"   field="name" />
        <Field label="Phone"       field="phone" />
        <Field label="Department"  field="department" />

        {saved && (
          <div style={{
            background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#16A34A',
            padding: '0.625rem 1rem', borderRadius: '8px', fontSize: '0.8rem',
            marginBottom: '1rem'
          }}>
            Profile saved successfully.
          </div>
        )}

        <button onClick={handleSave} disabled={saving} style={{
          padding: '0.7rem 1.5rem', borderRadius: '10px', border: 'none',
          background: saving ? '#A1887F' : 'linear-gradient(135deg, #6D4C41, #4E342E)',
          color: 'white', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer'
        }}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}