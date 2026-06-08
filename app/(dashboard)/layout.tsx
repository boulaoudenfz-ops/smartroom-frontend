'use client'
import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAF7F5' }}>
      <Sidebar open={open} onToggle={() => setOpen(o => !o)} />
      <main style={{
        flex: 1,
        marginLeft: open ? '240px' : '68px',
        transition: 'margin-left 0.25s ease',
        padding: '2rem',
        minHeight: '100vh',
      }}>
        {children}
      </main>
    </div>
  )
}