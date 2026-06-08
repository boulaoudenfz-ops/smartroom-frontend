'use client'
import { useEffect, useState } from 'react'
import { Search, Users, MapPin, CheckCircle, Clock } from 'lucide-react'
import api from '@/lib/axios'

export default function RoomsPage() {
  const [rooms, setRooms]     = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', type: '', capacity: '' })
  const [selected, setSelected] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Check admin role only on client after mount
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      setIsAdmin(user?.role === 'admin')
    } catch (error) {
      console.error('Failed to parse user:', error)
    }
    setMounted(true)
  }, [])

  const fetchRooms = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (filters.search)   params.search   = filters.search
      if (filters.type)     params.type     = filters.type
      if (filters.capacity) params.capacity = filters.capacity
      const res = await api.get('/rooms', { params })
console.log("ROOMS API RESPONSE:", res.data)
console.log("ROOMS ARRAY:", res.data.data.data)
setRooms(res.data.data.data || [])
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchRooms() }, [filters])
console.log("STATE ROOMS:", rooms)
  const typeColors: Record<string, { bg: string; color: string }> = {
    meeting:    { bg: '#EFF6FF', color: '#2563EB' },
    classroom:  { bg: '#F0FDF4', color: '#16A34A' },
    lab:        { bg: '#FAF5FF', color: '#9333EA' },
    coworking:  { bg: '#FFFBEB', color: '#D97706' },
    conference: { bg: '#FEF2F2', color: '#DC2626' },
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#4E342E' }}>Browse Spaces</h2>
        <p style={{ fontSize: '0.875rem', color: '#9E9E9E', marginTop: '0.25rem' }}>
          Find and reserve your perfect workspace.
        </p>
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
  {mounted && isAdmin && (
    <a href="/rooms/add" style={{
      padding: '0.625rem 1.25rem', borderRadius: '10px', textDecoration: 'none',
      background: 'linear-gradient(135deg, #6D4C41, #4E342E)',
      color: 'white', fontSize: '0.875rem', fontWeight: 500
    }}>+ Add Room</a>
  )}
</div>
      </div>

      {/* Filters */}
      <div style={{
        background: 'white', borderRadius: '14px', padding: '1rem',
        border: '1px solid #F0EAE6', marginBottom: '1.5rem',
        display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9E9E9E' }} />
          <input
            placeholder="Search rooms..."
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            style={{
              width: '100%', padding: '0.625rem 1rem 0.625rem 2.25rem',
              border: '1px solid #E5E0DC', borderRadius: '10px',
              fontSize: '0.875rem', outline: 'none', background: '#FAF7F5',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <select
          value={filters.type}
          onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
          style={{
            padding: '0.625rem 1rem', border: '1px solid #E5E0DC',
            borderRadius: '10px', fontSize: '0.875rem', outline: 'none',
            background: '#FAF7F5', color: '#4E342E', cursor: 'pointer'
          }}
        >
          <option value="">All Types</option>
          <option value="meeting">Meeting</option>
          <option value="classroom">Classroom</option>
          <option value="lab">Lab</option>
          <option value="coworking">Coworking</option>
          <option value="conference">Conference</option>
        </select>
        <select
          value={filters.capacity}
          onChange={e => setFilters(f => ({ ...f, capacity: e.target.value }))}
          style={{
            padding: '0.625rem 1rem', border: '1px solid #E5E0DC',
            borderRadius: '10px', fontSize: '0.875rem', outline: 'none',
            background: '#FAF7F5', color: '#4E342E', cursor: 'pointer'
          }}
        >
          <option value="">Any Capacity</option>
          <option value="5">5+ seats</option>
          <option value="10">10+ seats</option>
          <option value="20">20+ seats</option>
          <option value="50">50+ seats</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ height: '220px', background: '#F0EAE6', borderRadius: '14px', animation: 'pulse 1.5s infinite' }} />
          ))}
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
        </div>
      ) : rooms.length === 0 ? (
        <div style={{
          background: 'white', borderRadius: '14px', padding: '3rem',
          textAlign: 'center', border: '1px solid #F0EAE6', color: '#9E9E9E'
        }}>
          No rooms found.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {rooms.map(room => {
            const tc = typeColors[room.type] ?? { bg: '#F9FAFB', color: '#6B7280' }
            return (
              <div key={room.id} style={{
                background: 'white', borderRadius: '14px', border: '1px solid #F0EAE6',
                overflow: 'hidden', cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(78,52,46,0.05)',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(78,52,46,0.12)'
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(78,52,46,0.05)'
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
                }}
                onClick={() => { setSelected(room); setShowModal(true) }}
              >
                {/* Image area */}
                <div style={{
                  height: '120px', background: 'linear-gradient(135deg, #F5EDE8, #EFEBE9)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
                }}>
                  <span style={{ fontSize: '2.5rem' }}>🏢</span>
                  <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.6rem',
                      borderRadius: '999px', background: tc.bg, color: tc.color, textTransform: 'capitalize'
                    }}>
                      {room.type}
                    </span>
                  </div>
                  <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.6rem',
                      borderRadius: '999px',
                      background: room.status === 'available' ? '#F0FDF4' : '#FEF2F2',
                      color: room.status === 'available' ? '#16A34A' : '#DC2626',
                      display: 'flex', alignItems: 'center', gap: '0.25rem'
                    }}>
                      {room.status === 'available' ? <CheckCircle size={10} /> : <Clock size={10} />}
                      {room.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#4E342E', marginBottom: '0.25rem' }}>
                    {room.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#9E9E9E', marginBottom: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {room.description ?? 'No description'}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.75rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Users size={12} /> {room.capacity} seats
                    </span>
                    {room.building && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={12} /> {room.building}
                      </span>
                    )}
                  </div>
                  {room.equipment?.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                      {room.equipment.slice(0, 3).map((eq: any) => (
                        <span key={eq.id} style={{
                          fontSize: '0.68rem', padding: '0.15rem 0.5rem',
                          background: '#FAF7F5', border: '1px solid #F0EAE6',
                          borderRadius: '999px', color: '#6D4C41'
                        }}>{eq.name}</span>
                      ))}
                    </div>
                  )}
                  <button style={{
                    width: '100%', padding: '0.5rem', borderRadius: '8px', border: 'none',
                    background: 'linear-gradient(135deg, #6D4C41, #4E342E)',
                    color: 'white', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer'
                  }}>
                    Reserve Space
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Reservation Modal */}
      {showModal && selected && (
        <ReservationModal room={selected} onClose={() => { setShowModal(false); setSelected(null) }} />
      )}
    </div>
  )
}

function ReservationModal({ room, onClose }: { room: any; onClose: () => void }) {
  const [form, setForm] = useState({
    title: '', description: '', start_datetime: '', end_datetime: '', attendees_count: 1
  })
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [conflict, setConflict] = useState<any>(null)
  const [success, setSuccess]   = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setConflict(null)
    try {
      await api.post('/reservations', { ...form, room_id: room.id })
      setSuccess(true)
      setTimeout(() => { onClose() }, 1500)
    } catch (err: any) {
      if (err.response?.status === 409) {
        setConflict(err.response.data.errors?.conflicting_reservation)
      } else {
        setError(err.response?.data?.message ?? 'Failed to create reservation')
      }
    } finally { setLoading(false) }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200, padding: '1rem'
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'white', borderRadius: '16px', padding: '1.5rem',
        width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#4E342E' }}>Reserve {room.name}</div>
            <div style={{ fontSize: '0.78rem', color: '#9E9E9E', marginTop: '0.125rem' }}>
              Capacity: {room.capacity} seats
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9E9E9E', fontSize: '1.25rem' }}>✕</button>
        </div>

        {success && (
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#16A34A', padding: '0.75rem', borderRadius: '10px', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>
            Reservation created successfully!
          </div>
        )}

        {conflict && (
          <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', color: '#D97706', padding: '0.75rem', borderRadius: '10px', marginBottom: '1rem', fontSize: '0.8rem' }}>
            Time conflict: room already booked from{' '}
            {new Date(conflict.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to{' '}
            {new Date(conflict.end_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '0.75rem', borderRadius: '10px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {[
          { label: 'Meeting Title', field: 'title', type: 'text', placeholder: 'e.g. Team Sprint Planning' },
        ].map(({ label, field, type, placeholder }) => (
          <div key={field} style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#4E342E', marginBottom: '0.375rem' }}>{label}</label>
            <input
              type={type} placeholder={placeholder}
              value={(form as any)[field]}
              onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
              style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #E5E0DC', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', background: '#FAF7F5', boxSizing: 'border-box' }}
            />
          </div>
        ))}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#4E342E', marginBottom: '0.375rem' }}>Start</label>
            <input type="datetime-local" value={form.start_datetime}
              onChange={e => setForm(f => ({ ...f, start_datetime: e.target.value }))}
              style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #E5E0DC', borderRadius: '8px', fontSize: '0.8rem', outline: 'none', background: '#FAF7F5', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#4E342E', marginBottom: '0.375rem' }}>End</label>
            <input type="datetime-local" value={form.end_datetime}
              onChange={e => setForm(f => ({ ...f, end_datetime: e.target.value }))}
              style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #E5E0DC', borderRadius: '8px', fontSize: '0.8rem', outline: 'none', background: '#FAF7F5', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#4E342E', marginBottom: '0.375rem' }}>Attendees</label>
          <input type="number" min={1} max={room.capacity} value={form.attendees_count}
            onChange={e => setForm(f => ({ ...f, attendees_count: parseInt(e.target.value) }))}
            style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #E5E0DC', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', background: '#FAF7F5', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#4E342E', marginBottom: '0.375rem' }}>Description (optional)</label>
          <textarea rows={2} value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #E5E0DC', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', background: '#FAF7F5', resize: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <button onClick={handleSubmit} disabled={loading || success} style={{
          width: '100%', padding: '0.75rem', borderRadius: '10px', border: 'none',
          background: loading ? '#A1887F' : 'linear-gradient(135deg, #6D4C41, #4E342E)',
          color: 'white', fontSize: '0.875rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer'
        }}>
          {loading ? 'Creating...' : 'Confirm Reservation'}
        </button>
      </div>
    </div>
  )
}