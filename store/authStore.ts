import { create } from 'zustand'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
  avatar?: string
  department?: string
}

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    localStorage.setItem('token', token)
    set({ user, token })
  },
  clearAuth: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },
  isAdmin: () => get().user?.role === 'admin',
}))