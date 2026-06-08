'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'

export default function AddRoomPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const [form, setForm] = useState({
    name: '', description: '', capacity: 1, floor: '',
    building: '', type: 'meeting', status: 'available',
    requires_approval: false
  })

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const u = JSON.parse(stored)
      setUser(u)
      if (u.role !== 'admin') router.replace('/dashboard')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await api.post('/admin/rooms', { ...form, capacity: Number(form.capacity), floor: form.floor ? Number(form.floor) : null })
      router.push('/rooms')
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to create room')
    } finally { setSubmitting(false) }
  }

  const F = ({ label, field, type = 'text', placeholder = '', options }: { label: string; field: keyof typeof form; type?: string; placeholder?: string; options?: { value: string; label: string }[] }) => (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#4E342E', marginBottom: '0.375rem' }}>{label}</label>
      {options ? (
        <select value={form[field] as string} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
          style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #E5E0DC', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', background: '#FAF7F5', boxSizing: 'border-box' }}>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input type={type} placeholder={placeholder} value={form[field] as string}
          onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
          style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #E5E0DC', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', background: '#FAF7F5', boxSizing: 'border-box' }}
        />
      )}
    </div>
  )

  return (
    <div style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6D4C41', fontSize: '0.875rem', fontWeight: 500, padding: 0, marginBottom: '0.75rem' }}>← Back</button>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#4E342E' }}>Add New Room</h2>
      </div>

      <div style={{ background: 'white', borderRadius: '14px', padding: '1.5rem', border: '1px solid #F0EAE6' }}>
        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <F label="Room Name" field="name" placeholder="e.g. Innovation Lab" />
          <F label="Description" field="description" placeholder="Brief description" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <F label="Capacity" field="capacity" type="number" placeholder="10" />
            <F label="Floor" field="floor" type="number" placeholder="1" />
          </div>
          <F label="Building" field="building" placeholder="Building A" />
          <F label="Type" field="type" options={[
            { value: 'meeting', label: 'Meeting Room' },
            { value: 'classroom', label: 'Classroom' },
            { value: 'lab', label: 'Lab' },
            { value: 'coworking', label: 'Coworking Space' },
            { value: 'conference', label: 'Conference Hall' },
          ]} />
          <F label="Status" field="status" options={[
            { value: 'available', label: 'Available' },
            { value: 'maintenance', label: 'Under Maintenance' },
            { value: 'inactive', label: 'Inactive' },
          ]} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
            <input type="checkbox" id="approval" checked={form.requires_approval}
              onChange={e => setForm(p => ({ ...p, requires_approval: e.target.checked }))}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="approval" style={{ fontSize: '0.8rem', color: '#4E342E', cursor: 'pointer' }}>Requires admin approval</label>
          </div>
          <button type="submit" disabled={submitting} style={{
            width: '100%', padding: '0.75rem', borderRadius: '10px', border: 'none',
            background: submitting ? '#A1887F' : 'linear-gradient(135deg, #6D4C41, #4E342E)',
            color: 'white', fontSize: '0.875rem', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer'
          }}>
            {submitting ? 'Creating...' : 'Create Room'}
          </button>
        </form>
      </div>
    </div>
  )
}