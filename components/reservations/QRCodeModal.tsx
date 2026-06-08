'use client'
import { X } from 'lucide-react'
import type { Reservation } from '@/types'

export default function QRCodeModal({ reservation, onClose }: { reservation: Reservation; onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(4px)', zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'white', borderRadius: '16px', padding: '2rem',
        width: '100%', maxWidth: '360px', textAlign: 'center',
        boxShadow: '0 8px 40px rgba(78,52,46,0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#4E342E' }}>Check-in QR Code</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9E9E9E' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ background: '#FAF7F5', borderRadius: '12px', padding: '1rem', display: 'inline-block', marginBottom: '1rem' }}>
          <QRFallback value={reservation.qr_code ?? reservation.id.toString()} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontWeight: 500, fontSize: '0.875rem', color: '#4E342E' }}>{reservation.title}</p>
          <p style={{ fontSize: '0.75rem', color: '#9E9E9E', marginTop: '0.25rem' }}>{reservation.room?.name}</p>
          <p style={{ fontSize: '0.72rem', color: '#9E9E9E', marginTop: '0.125rem' }}>
            {new Date(reservation.start_datetime).toLocaleString()}
          </p>
        </div>

        <p style={{
          fontSize: '0.72rem', color: '#6D4C41', background: '#FAF5F2',
          borderRadius: '8px', padding: '0.5rem 0.875rem'
        }}>
          Present this code at the room entrance to check in
        </p>
      </div>
    </div>
  )
}

function QRFallback({ value }: { value: string }) {
  try {
    const { QRCodeSVG } = require('qrcode.react')
    return <QRCodeSVG value={value} size={160} fgColor="#4E342E" level="H" />
  } catch {
    return (
      <div style={{ width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#9E9E9E', wordBreak: 'break-all' }}>
        {value.slice(0, 20)}...
      </div>
    )
  }
}