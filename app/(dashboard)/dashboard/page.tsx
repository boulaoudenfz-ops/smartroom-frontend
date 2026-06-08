'use client'
import { useEffect, useState } from 'react'
import { CalendarDays, Clock, CheckCircle, AlertCircle, Building2 } from 'lucide-react'
import api from '@/lib/axios'

export default function DashboardPage() {
  const [user, setUser]   = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
    api.get('/analytics/personal')
      .then(r => setStats(r.data.data))
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    { label: 'Total Reservations', value: stats?.total ?? 0,     color: '#6D4C41', bg: '#F5EDE8', icon: CalendarDays },
    { label: 'Upcoming',           value: stats?.upcoming ?? 0,  color: '#C8A97E', bg: '#FDF6EC', icon: Clock },
    { label: 'Completed',          value: stats?.completed ?? 0, color: '#16A34A', bg: '#F0FDF4', icon: CheckCircle },
    { label: 'Pending Approval',   value: stats?.pending ?? 0,   color: '#D97706', bg: '#FFFBEB', icon: AlertCircle },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#4E342E' }}>
          Good morning, {user?.name?.split(' ')[0]} 👋
        </h2>
        <p style={{ color: '#9E9E9E', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Here is your workspace overview for today.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '1rem' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ height: '90px', background: '#F0EAE6', borderRadius: '14px', animation: 'pulse 1.5s infinite' }} />
          ))}
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '1rem' }}>
          {statCards.map(({ label, value, color, bg, icon: Icon }) => (
            <div key={label} style={{
              background: 'white', borderRadius: '14px', padding: '1.25rem',
              border: '1px solid #F0EAE6', boxShadow: '0 1px 4px rgba(78,52,46,0.06)',
              display: 'flex', alignItems: 'flex-start', gap: '0.875rem'
            }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} color={color} />
              </div>
              <div>
                <div style={{ fontSize: '1.625rem', fontWeight: 700, color: '#4E342E', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '0.72rem', color: '#9E9E9E', marginTop: '0.3rem' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {[
          { label: '+ New Reservation', href: '/rooms',        primary: true },
          { label: 'My Reservations',   href: '/reservations', primary: false },
          { label: 'Notifications',     href: '/notifications',primary: false },
        ].map(a => (
          <a key={a.href} href={a.href} style={{
            padding: '0.6rem 1.25rem', borderRadius: '10px', textDecoration: 'none',
            fontSize: '0.875rem', fontWeight: 500,
            background: a.primary ? 'linear-gradient(135deg,#6D4C41,#4E342E)' : 'white',
            color: a.primary ? 'white' : '#6D4C41',
            border: a.primary ? 'none' : '1px solid #E5E0DC'
          }}>{a.label}</a>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '14px', padding: '1.25rem', border: '1px solid #F0EAE6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4E342E' }}>Upcoming Reservations</h3>
          <a href="/reservations" style={{ fontSize: '0.75rem', color: '#6D4C41', textDecoration: 'none', fontWeight: 500 }}>View all →</a>
        </div>
        {!stats?.upcomingList?.length ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#9E9E9E' }}>
            <Building2 size={28} color="#D7CCC8" style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ fontSize: '0.875rem' }}>No upcoming reservations</div>
            <a href="/rooms" style={{ color: '#6D4C41', fontSize: '0.8rem', fontWeight: 500 }}>Browse rooms →</a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {stats.upcomingList.map((res: any) => (
              <div key={res.id} style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '0.75rem', borderRadius: '10px', background: '#FAF7F5', border: '1px solid #F0EAE6'
              }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#F5EDE8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Building2 size={16} color="#6D4C41" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4E342E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{res.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9E9E9E' }}>{res.room?.name}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#4E342E' }}>
                    {new Date(res.start_datetime).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#9E9E9E' }}>
                    {new Date(res.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <span style={{
                  fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '999px', fontWeight: 600, flexShrink: 0,
                  background: res.status === 'approved' ? '#F0FDF4' : '#FFFBEB',
                  color: res.status === 'approved' ? '#16A34A' : '#D97706'
                }}>{res.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}