'use client'
import { Users, MapPin, CheckCircle, Clock } from 'lucide-react'

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  meeting:    { bg: '#EFF6FF', color: '#2563EB' },
  classroom:  { bg: '#F0FDF4', color: '#16A34A' },
  lab:        { bg: '#FAF5FF', color: '#9333EA' },
  coworking:  { bg: '#FFFBEB', color: '#D97706' },
  conference: { bg: '#FEF2F2', color: '#DC2626' },
}

export default function RoomCard({ room, onClick }: { room: any; onClick?: () => void }) {
  const tc = TYPE_COLORS[room.type] ?? { bg: '#F9FAFB', color: '#6B7280' }

  return (
    <div
      onClick={onClick}
      style={{
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
    >
      <div style={{
        height: '110px', background: 'linear-gradient(135deg, #F5EDE8, #EFEBE9)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
      }}>
        {room.image
          ? <img src={room.image} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: '2.25rem' }}>🏢</span>
        }
        <span style={{
          position: 'absolute', top: '0.625rem', left: '0.625rem',
          fontSize: '0.68rem', fontWeight: 600, padding: '0.2rem 0.5rem',
          borderRadius: '999px', background: tc.bg, color: tc.color, textTransform: 'capitalize'
        }}>{room.type}</span>
        <span style={{
          position: 'absolute', top: '0.625rem', right: '0.625rem',
          fontSize: '0.68rem', fontWeight: 600, padding: '0.2rem 0.5rem',
          borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '0.2rem',
          background: room.status === 'available' ? '#F0FDF4' : '#FEF2F2',
          color: room.status === 'available' ? '#16A34A' : '#DC2626',
        }}>
          {room.status === 'available' ? <CheckCircle size={9} /> : <Clock size={9} />}
          {room.status}
        </span>
      </div>

      <div style={{ padding: '0.875rem' }}>
        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#4E342E', marginBottom: '0.2rem' }}>
          {room.name}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#9E9E9E', marginBottom: '0.625rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {room.description ?? 'No description'}
        </div>
        <div style={{ display: 'flex', gap: '0.875rem', fontSize: '0.72rem', color: '#6B7280', marginBottom: '0.625rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <Users size={11} /> {room.capacity} seats
          </span>
          {room.building && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <MapPin size={11} /> {room.building}
            </span>
          )}
        </div>
        {room.equipment?.length > 0 && (
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.625rem' }}>
            {room.equipment.slice(0, 3).map((eq: any) => (
              <span key={eq.id} style={{
                fontSize: '0.65rem', padding: '0.15rem 0.4rem',
                background: '#FAF7F5', border: '1px solid #F0EAE6',
                borderRadius: '999px', color: '#6D4C41'
              }}>{eq.name}</span>
            ))}
          </div>
        )}
        <button style={{
          width: '100%', padding: '0.5rem', borderRadius: '8px', border: 'none',
          background: 'linear-gradient(135deg, #6D4C41, #4E342E)',
          color: 'white', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer'
        }}>
          Reserve Space
        </button>
      </div>
    </div>
  )
}