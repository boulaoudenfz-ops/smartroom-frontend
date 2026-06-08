export interface Equipment {
  id: number
  name: string
  icon?: string
}

export interface Room {
  id: number
  name: string
  slug: string
  description?: string
  capacity: number
  floor?: number
  building?: string
  type: 'meeting' | 'classroom' | 'lab' | 'coworking' | 'conference'
  status: 'available' | 'maintenance' | 'inactive'
  image?: string
  requires_approval: boolean
  equipment: Equipment[]
}

export interface Reservation {
  id: number
  room_id: number
  user_id: number
  title: string
  description?: string
  start_datetime: string
  end_datetime: string
  attendees_count: number
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed'
  qr_code?: string
  checked_in_at?: string
  room?: Room
  user?: User
}

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
  avatar?: string
  department?: string
  phone?: string
  is_active: boolean
}

export interface Notification {
  id: number
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  is_read: boolean
  created_at: string
}