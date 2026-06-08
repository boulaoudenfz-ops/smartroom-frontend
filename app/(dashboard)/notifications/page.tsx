'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/axios'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/notifications')
      .then(r => setNotifications(r.data.data?.data ?? r.data.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  const markRead = async (id: number) => {
    await api.patch(`/notifications/${id}/read`)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  const markAllRead = async () => {
    await api.patch('/notifications/read-all')
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  if (loading) return <div style={{ padding: '2rem', color: '#9E9E9E' }}>Loading...</div>

  return (
    <div style={{ maxWidth: '700px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#4E342E' }}>Notifications</h2>
          <p style={{ fontSize: '0.875rem', color: '#9E9E9E', marginTop: '0.25rem' }}>
            {notifications.filter(n => !n.is_read).length} unread
          </p>
        </div>
        {notifications.some(n => !n.is_read) && (
          <button onClick={markAllRead} style={{
            padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #E5E0DC',
            background: 'white', color: '#6D4C41', fontSize: '0.8rem',
            fontWeight: 500, cursor: 'pointer'
          }}>
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div style={{
          background: 'white', borderRadius: '14px', padding: '3rem',
          textAlign: 'center', border: '1px solid #F0EAE6', color: '#9E9E9E'
        }}>
          No notifications yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {notifications.map(n => (
            <div key={n.id} onClick={() => !n.is_read && markRead(n.id)} style={{
              background: n.is_read ? 'white' : '#FAF5F2',
              border: `1px solid ${n.is_read ? '#F0EAE6' : '#E5D5CC'}`,
              borderRadius: '12px', padding: '1rem 1.25rem',
              cursor: n.is_read ? 'default' : 'pointer',
              display: 'flex', gap: '1rem', alignItems: 'flex-start'
            }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%', marginTop: '6px', flexShrink: 0,
                background: n.is_read ? '#D7CCC8' : (
                  n.type === 'success' ? '#16A34A' :
                  n.type === 'error'   ? '#DC2626' :
                  n.type === 'warning' ? '#D97706' : '#6D4C41'
                )
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4E342E' }}>{n.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '0.25rem' }}>{n.message}</div>
                <div style={{ fontSize: '0.7rem', color: '#9E9E9E', marginTop: '0.375rem' }}>
                  {new Date(n.created_at).toLocaleString()}
                </div>
              </div>
              {!n.is_read && (
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: '#6D4C41', flexShrink: 0, marginTop: '6px'
                }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}