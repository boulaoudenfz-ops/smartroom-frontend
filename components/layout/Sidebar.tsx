'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Building2, CalendarDays, Bell, User, LogOut, ChevronLeft, ChevronRight, Bot } from 'lucide-react'
import { useState, useEffect } from 'react'

const navItems = [
  { label: 'Dashboard',     href: '/dashboard',     icon: LayoutDashboard },
  { label: 'Rooms',         href: '/rooms',          icon: Building2 },
  { label: 'Reservations',  href: '/reservations',   icon: CalendarDays },
  { label: 'Notifications', href: '/notifications',  icon: Bell },
  { label: 'Assistant',     href: '/assistant',      icon: Bot },
  { label: 'Profile',       href: '/profile',        icon: User },
]

export default function Sidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const pathname = usePathname()
  const [user, setUser] = useState<any>({})

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, height: '100vh',
      width: open ? '240px' : '68px',
      background: 'white', borderRight: '1px solid #F0EAE6',
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.25s ease',
      overflow: 'hidden', zIndex: 100,
      boxShadow: '2px 0 16px rgba(78,52,46,0.06)'
    }}>

      {/* Logo row */}
      <div style={{
        height: '60px', display: 'flex', alignItems: 'center',
        padding: '0 0.875rem', borderBottom: '1px solid #F0EAE6',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden', flex: 1 }}>
          <img
            src="/logo.png"
            alt="SmartRoom"
            style={{
              width: '200px', height: '40px', objectFit: 'contain',
              borderRadius: '6px', flexShrink: 0
            }}
          />
          <span style={{
            fontWeight: 700, fontSize: '0.9rem', color: '#4E342E',
            whiteSpace: 'nowrap', overflow: 'hidden',
            maxWidth: open ? '160px' : '0px',
            opacity: open ? 1 : 0,
            marginLeft: open ? '0.625rem' : '0',
            transition: 'max-width 0.25s ease, opacity 0.2s ease, margin-left 0.25s ease'
          }}>
            {/* SmartRoom */}
          </span>
        </div>
        <button onClick={onToggle} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#9E9E9E', display: 'flex', alignItems: 'center',
          padding: '4px', borderRadius: '6px', flexShrink: 0
        }}>
          {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '0.625rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.6rem 0.75rem', borderRadius: '10px',
                background: active ? '#F5EDE8' : 'transparent',
                color: active ? '#6D4C41' : '#6B7280',
                fontWeight: active ? 600 : 400,
                fontSize: '0.875rem', whiteSpace: 'nowrap',
                overflow: 'hidden', transition: 'background 0.15s'
              }}>
                <Icon size={18} color={active ? '#6D4C41' : '#9CA3AF'} style={{ flexShrink: 0 }} />
                {open && label}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div style={{ padding: '0.625rem', borderTop: '1px solid #F0EAE6' }}>
        {open && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.625rem',
            padding: '0.625rem', borderRadius: '10px', background: '#FAF7F5', marginBottom: '0.375rem'
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #C8A97E, #6D4C41)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '0.7rem', fontWeight: 700
            }}>
              {user?.name?.charAt(0) ?? 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4E342E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name ?? 'User'}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#9E9E9E', textTransform: 'capitalize' }}>
                {user?.role ?? 'user'}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => { localStorage.clear(); window.location.href = '/login' }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.6rem 0.75rem', borderRadius: '10px', border: 'none',
            background: 'transparent', color: '#EF4444', cursor: 'pointer',
            fontSize: '0.875rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden'
          }}>
          <LogOut size={17} style={{ flexShrink: 0 }} />
          {open && 'Sign out'}
        </button>
      </div>
    </div>
  )
}