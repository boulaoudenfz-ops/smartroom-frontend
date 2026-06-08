'use client'
import { useState } from 'react'
import { Send, Bot, User } from 'lucide-react'

type Message = { role: 'user' | 'assistant'; content: string }

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I can help you find rooms, check availability, or answer questions about SmartRoom.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)

    try {
      // Call local API route instead of Anthropic directly (avoids CORS)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated.map(m => ({ role: m.role, content: m.content }))
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to get response')
      }

      const data = await res.json()
      const reply = data.message ?? 'Sorry, I could not process that.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection error. Please try again.'
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${errorMessage}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '720px', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#4E342E' }}>AI Assistant</h2>
        <p style={{ fontSize: '0.875rem', color: '#9E9E9E', marginTop: '0.25rem' }}>Ask about rooms, reservations, or availability.</p>
      </div>

      <div style={{ flex: 1, background: 'white', borderRadius: '14px', border: '1px solid #F0EAE6', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                background: m.role === 'user' ? 'linear-gradient(135deg, #6D4C41, #4E342E)' : '#F5EDE8',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {m.role === 'user' ? <User size={15} color="white" /> : <Bot size={15} color="#6D4C41" />}
              </div>
              <div style={{
                maxWidth: '80%', padding: '0.75rem 1rem', borderRadius: '12px',
                background: m.role === 'user' ? 'linear-gradient(135deg, #6D4C41, #4E342E)' : '#FAF7F5',
                color: m.role === 'user' ? 'white' : '#4E342E',
                fontSize: '0.875rem', lineHeight: 1.6
              }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F5EDE8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={15} color="#6D4C41" />
              </div>
              <div style={{ padding: '0.75rem 1rem', borderRadius: '12px', background: '#FAF7F5', display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6D4C41', animation: `bounce 1s infinite ${i * 0.15}s` }} />
                ))}
                <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}`}</style>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '1rem', borderTop: '1px solid #F0EAE6', display: 'flex', gap: '0.75rem' }}>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Ask about rooms or reservations..."
            style={{ flex: 1, padding: '0.7rem 1rem', border: '1px solid #E5E0DC', borderRadius: '10px', fontSize: '0.875rem', outline: 'none', background: '#FAF7F5' }}
          />
          <button onClick={send} disabled={loading || !input.trim()} style={{
            width: '40px', height: '40px', borderRadius: '10px', border: 'none',
            background: loading || !input.trim() ? '#E5E0DC' : 'linear-gradient(135deg, #6D4C41, #4E342E)',
            color: 'white', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}