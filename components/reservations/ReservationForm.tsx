'use client'
import { useState } from 'react'
import { AlertTriangle, Loader2, CalendarDays, Users } from 'lucide-react'
import api from '@/lib/axios'
import type { Room } from '@/types'

export default function ReservationForm({ room, onSuccess }: { room: Room; onSuccess: () => void }) {
  const [conflict, setConflict] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    title: '', description: '', start_datetime: '', end_datetime: '', attendees_count: 1
  })

  const validate = () => {
    const e: Record<string, string> = {}
    if (form.title.length < 3) e.title = 'Title required (min 3 chars)'
    if (!form.start_datetime) e.start_datetime = 'Start time required'
    if (!form.end_datetime) e.end_datetime = 'End time required'
    if (form.end_datetime && form.start_datetime && new Date(form.end_datetime) <= new Date(form.start_datetime))
      e.end_datetime = 'End must be after start'
    if (form.attendees_count < 1) e.attendees_count = 'Min 1 attendee'
    return e
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setConflict(null)
    setSubmitting(true)
    try {
      await api.post('/reservations', { ...form, room_id: room.id })
      onSuccess()
    } catch (err: any) {
      if (err.response?.status === 409) {
        setConflict(err.response.data.errors?.conflicting_reservation)
      }
    } finally { setSubmitting(false) }
  }

  const field = (label: string, key: keyof typeof form, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: '0.875rem' }}>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#4E342E', marginBottom: '0.375rem' }}>
        {label}
      </label>
      <input
        type={type} placeholder={placeholder}
        value={form[key] as string}
        onChange={e => setForm(p => ({ ...p, [key]: type === 'number' ? parseInt(e.target.value) : e.target.value }))}
        style={{ width: '100%', padding: '0.625rem 0.875rem', border: `1px solid ${errors[key] ? '#FECACA' : '#E5E0DC'}`, borderRadius: '8px', fontSize: '0.875rem', outline: 'none', background: '#FAF7F5', boxSizing: 'border-box' }}
      />
      {errors[key] && <p style={{ fontSize: '0.72rem', color: '#DC2626', marginTop: '0.25rem' }}>{errors[key]}</p>}
    </div>
  )

  return (
    <form onSubmit={onSubmit}>
      {conflict && (
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '0.75rem', marginBottom: '1rem', display: 'flex', gap: '0.625rem' }}>
          <AlertTriangle size={16} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ fontSize: '0.8rem', fontWeight: 500, color: '#92400E' }}>Time slot conflict</p>
            <p style={{ fontSize: '0.72rem', color: '#B45309', marginTop: '0.125rem' }}>
              Already booked {new Date(conflict.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(conflict.end_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      )}

      {field('Meeting Title', 'title', 'text', 'e.g. Team Sprint Planning')}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.875rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#4E342E', marginBottom: '0.375rem' }}>Start</label>
          <input type="datetime-local" value={form.start_datetime}
            onChange={e => setForm(p => ({ ...p, start_datetime: e.target.value }))}
            style={{ width: '100%', padding: '0.625rem', border: `1px solid ${errors.start_datetime ? '#FECACA' : '#E5E0DC'}`, borderRadius: '8px', fontSize: '0.8rem', outline: 'none', background: '#FAF7F5', boxSizing: 'border-box' }}
          />
          {errors.start_datetime && <p style={{ fontSize: '0.72rem', color: '#DC2626', marginTop: '0.25rem' }}>{errors.start_datetime}</p>}
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#4E342E', marginBottom: '0.375rem' }}>End</label>
          <input type="datetime-local" value={form.end_datetime}
            onChange={e => setForm(p => ({ ...p, end_datetime: e.target.value }))}
            style={{ width: '100%', padding: '0.625rem', border: `1px solid ${errors.end_datetime ? '#FECACA' : '#E5E0DC'}`, borderRadius: '8px', fontSize: '0.8rem', outline: 'none', background: '#FAF7F5', boxSizing: 'border-box' }}
          />
          {errors.end_datetime && <p style={{ fontSize: '0.72rem', color: '#DC2626', marginTop: '0.25rem' }}>{errors.end_datetime}</p>}
        </div>
      </div>

      <div style={{ marginBottom: '0.875rem' }}>
        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#4E342E', marginBottom: '0.375rem' }}>
          Attendees (max {room.capacity})
        </label>
        <input type="number" min={1} max={room.capacity} value={form.attendees_count}
          onChange={e => setForm(p => ({ ...p, attendees_count: parseInt(e.target.value) }))}
          style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #E5E0DC', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', background: '#FAF7F5', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#4E342E', marginBottom: '0.375rem' }}>Description (optional)</label>
        <textarea rows={3} value={form.description}
          onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
          placeholder="Meeting agenda or notes..."
          style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #E5E0DC', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', background: '#FAF7F5', resize: 'none', boxSizing: 'border-box' }}
        />
      </div>

      <button type="submit" disabled={submitting} style={{
        width: '100%', padding: '0.75rem', borderRadius: '10px', border: 'none',
        background: submitting ? '#A1887F' : 'linear-gradient(135deg, #6D4C41, #4E342E)',
        color: 'white', fontSize: '0.875rem', fontWeight: 600,
        cursor: submitting ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
      }}>
        {submitting && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
        {submitting ? 'Creating...' : 'Confirm Reservation'}
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </button>
    </form>
  )
}