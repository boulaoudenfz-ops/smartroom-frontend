'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Users, MapPin } from 'lucide-react'
import api from '@/lib/axios'

export default function NewReservationPage() {
  const router = useRouter()
  const [rooms, setRooms]         = useState<any[]>([])
  const [selected, setSelected]   = useState<any>(null)
  const [search, setSearch]       = useState('')
  const [loading, setLoading]     = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState('')
  const [conflict, setConflict]   = useState<any>(null)
  const [success, setSuccess]     = useState(false)
  const [form, setForm] = useState({
    title: '', description: '',
    start_datetime: '', end_datetime: '', attendees_count: 1
  })

  useEffect(() => {
    api.get('/rooms').then(r => setRooms(r.data.data.data ?? [])).finally(() => setLoading(false))
  }, [])

  const filtered = rooms.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.type.toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = async () => {
    if (!selected) { setError('Select a room first'); return }
    if (!form.title) { setError('Title is required'); return }
    if (!form.start_datetime || !form.end_datetime) { setError('Select start and end time'); return }
    setSubmitting(true)
    setError('')
    setConflict(null)
    try {
      await api.post('/reservations', { ...form, room_id: selected.id })
      setSuccess(true)
      setTimeout(() => router.push('/reservations'), 1500)
    } catch (err: any) {
      if (err.response?.status === 409) {
        setConflict(err.response.data.errors?.conflicting_reservation)
      } else {
        setError(err.response?.data?.message ?? 'Failed to create reservation')
      }
    } finally { setSubmitting(false) }
  }

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <button onClick={() => router.back()} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#6D4C41', fontSize: '0.875rem', fontWeight: 500,
          padding: 0, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem'
        }}>← Back</button>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#4E342E' }}>New Reservation</h2>
        <p style={{ fontSize: '0.875rem', color: '#9E9E9E', marginTop: '0.25rem' }}>Select a room and fill in the details.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Left — Room selection */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '1.25rem', border: '1px solid #F0EAE6' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4E342E', marginBottom: '1rem' }}>Select Room</h3>
          <div style={{ position: 'relative', marginBottom: '0.875rem' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9E9E9E' }} />
            <input
              placeholder="Search rooms..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.125rem', border: '1px solid #E5E0DC', borderRadius: '8px', fontSize: '0.8rem', outline: 'none', background: '#FAF7F5', boxSizing: 'border-box' }}
            />
          </div>
          {loading ? (
            <div style={{ color: '#9E9E9E', fontSize: '0.8rem', textAlign: 'center', padding: '1rem' }}>Loading rooms...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto' }}>
              {filtered.map(room => (
                <div key={room.id}
                  onClick={() => setSelected(room)}
                  style={{
                    padding: '0.75rem', borderRadius: '10px', cursor: 'pointer',
                    border: `2px solid ${selected?.id === room.id ? '#6D4C41' : '#F0EAE6'}`,
                    background: selected?.id === room.id ? '#FAF5F2' : 'white',
                    transition: 'all 0.15s'
                  }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#4E342E' }}>{room.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#9E9E9E', marginTop: '0.125rem', textTransform: 'capitalize' }}>{room.type}</div>
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.72rem', color: '#6B7280', marginTop: '0.25rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Users size={10} /> {room.capacity}</span>
                    {room.building && <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><MapPin size={10} /> {room.building}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — Form */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '1.25rem', border: '1px solid #F0EAE6' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4E342E', marginBottom: '1rem' }}>Reservation Details</h3>

          {selected && (
            <div style={{ background: '#FAF5F2', border: '1px solid #E5D5CC', borderRadius: '8px', padding: '0.625rem 0.875rem', marginBottom: '1rem', fontSize: '0.8rem', color: '#6D4C41' }}>
              Selected: <strong>{selected.name}</strong>
            </div>
          )}

          {success && (
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#16A34A', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.8rem' }}>
              Reservation created. Redirecting...
            </div>
          )}
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.8rem' }}>
              {error}
            </div>
          )}
          {conflict && (
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', color: '#D97706', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.8rem' }}>
              Conflict: room booked {new Date(conflict.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(conflict.end_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}

          {[{ label: 'Title', field: 'title', type: 'text', placeholder: 'e.g. Team Meeting' }].map(f => (
            <div key={f.field} style={{ marginBottom: '0.875rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#4E342E', marginBottom: '0.375rem' }}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.field]}
                onChange={e => setForm(p => ({ ...p, [f.field]: e.target.value }))}
                style={{ width: '100%', padding: '0.575rem 0.875rem', border: '1px solid #E5E0DC', borderRadius: '8px', fontSize: '0.8rem', outline: 'none', background: '#FAF7F5', boxSizing: 'border-box' }}
              />
            </div>
          ))}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginBottom: '0.875rem' }}>
            {[{ label: 'Start', field: 'start_datetime' }, { label: 'End', field: 'end_datetime' }].map(f => (
              <div key={f.field}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#4E342E', marginBottom: '0.375rem' }}>{f.label}</label>
                <input type="datetime-local" value={(form as any)[f.field]}
                  onChange={e => setForm(p => ({ ...p, [f.field]: e.target.value }))}
                  style={{ width: '100%', padding: '0.575rem 0.625rem', border: '1px solid #E5E0DC', borderRadius: '8px', fontSize: '0.75rem', outline: 'none', background: '#FAF7F5', boxSizing: 'border-box' }}
                />
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '0.875rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#4E342E', marginBottom: '0.375rem' }}>Attendees</label>
            <input type="number" min={1} max={selected?.capacity ?? 100} value={form.attendees_count}
              onChange={e => setForm(p => ({ ...p, attendees_count: parseInt(e.target.value) }))}
              style={{ width: '100%', padding: '0.575rem 0.875rem', border: '1px solid #E5E0DC', borderRadius: '8px', fontSize: '0.8rem', outline: 'none', background: '#FAF7F5', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#4E342E', marginBottom: '0.375rem' }}>Description (optional)</label>
            <textarea rows={2} value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              style={{ width: '100%', padding: '0.575rem 0.875rem', border: '1px solid #E5E0DC', borderRadius: '8px', fontSize: '0.8rem', outline: 'none', background: '#FAF7F5', resize: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button onClick={handleSubmit} disabled={submitting || success} style={{
            width: '100%', padding: '0.7rem', borderRadius: '10px', border: 'none',
            background: submitting ? '#A1887F' : 'linear-gradient(135deg, #6D4C41, #4E342E)',
            color: 'white', fontSize: '0.875rem', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer'
          }}>
            {submitting ? 'Creating...' : 'Confirm Reservation'}
          </button>
        </div>
      </div>
    </div>
  )
}