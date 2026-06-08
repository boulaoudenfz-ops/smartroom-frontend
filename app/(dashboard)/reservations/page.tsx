'use client'
import { useEffect, useState } from 'react'
import { Building2, X } from 'lucide-react'
import api from '@/lib/axios'

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState<number | null>(null)

  useEffect(() => {
    api.get('/reservations')
      .then(r => setReservations(r.data.data?.data ?? r.data.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  const handleCancel = async (id: number) => {
    if (!confirm('Cancel this reservation?')) return
    setCancelling(id)
    try {
      await api.patch(`/reservations/${id}/cancel`)
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r))
    } catch {}
    finally { setCancelling(null) }
  }

  const statusStyle = (status: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      approved:  { bg: '#F0FDF4', color: '#16A34A' },
      pending:   { bg: '#FFFBEB', color: '#D97706' },
      rejected:  { bg: '#FEF2F2', color: '#DC2626' },
      cancelled: { bg: '#F9FAFB', color: '#6B7280' },
      completed: { bg: '#EFF6FF', color: '#2563EB' },
    }
    return map[status] ?? { bg: '#F9FAFB', color: '#6B7280' }
  }

  if (loading) return <div style={{ padding: '2rem', color: '#9E9E9E' }}>Loading...</div>

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#4E342E' }}>My Reservations</h2>
          <p style={{ fontSize: '0.875rem', color: '#9E9E9E', marginTop: '0.25rem' }}>{reservations.length} total</p>
        </div>
        <a href=" /reservations/new" style={{
          padding: '0.625rem 1.25rem', borderRadius: '10px',
          background: 'linear-gradient(135deg, #6D4C41, #4E342E)',
          color: 'white', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none'
        }}>
          + New Reservation
        </a>
      </div>

      {reservations.length === 0 ? (
        <div style={{
          background: 'white', borderRadius: '14px', padding: '3rem',
          textAlign: 'center', border: '1px solid #F0EAE6'
        }}>
          <Building2 size={40} color="#D7CCC8" style={{ marginBottom: '1rem' }} />
          <div style={{ color: '#9E9E9E', marginBottom: '1rem' }}>No reservations yet.</div>
          <a href="/rooms" style={{ color: '#6D4C41', fontWeight: 500, fontSize: '0.875rem' }}>Browse rooms</a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {reservations.map(res => {
            const s = statusStyle(res.status)
            return (
              <div key={res.id} style={{
                background: 'white', borderRadius: '14px', padding: '1.25rem',
                border: '1px solid #F0EAE6', boxShadow: '0 1px 4px rgba(78,52,46,0.05)',
                display: 'flex', gap: '1rem', alignItems: 'center'
              }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: '#F5EDE8', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Building2 size={20} color="#6D4C41" />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#4E342E' }}>{res.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#9E9E9E', marginTop: '0.125rem' }}>{res.room?.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9E9E9E', marginTop: '0.25rem' }}>
                    {new Date(res.start_datetime).toLocaleString()} →{' '}
                    {new Date(res.end_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                  <span style={{
                    fontSize: '0.72rem', padding: '0.25rem 0.625rem', borderRadius: '999px',
                    fontWeight: 600, background: s.bg, color: s.color, textTransform: 'capitalize'
                  }}>
                    {res.status}
                  </span>

                  {['pending', 'approved'].includes(res.status) && (
                    <button
                      onClick={() => handleCancel(res.id)}
                      disabled={cancelling === res.id}
                      style={{
                        width: '30px', height: '30px', borderRadius: '8px', border: '1px solid #FECACA',
                        background: '#FEF2F2', color: '#DC2626', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}