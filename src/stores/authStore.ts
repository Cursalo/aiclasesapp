import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import type { User, Session } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthState {
  user: User | null
  session: Session | null
  profile: Profile | null
  isLoading: boolean
  isInitialized: boolean
}

interface AuthActions {
  setAuth: (user: User | null, session: Session | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  signOut: () => void
  updateProfile: (updates: Partial<Profile>) => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        session: null,
        profile: null,
        isLoading: true,
        isInitialized: false,

        // Actions
        setAuth: (user, session) => {
          set({ user, session }, false, 'setAuth')
        },

        setProfile: (profile) => {
          set({ profile }, false, 'setProfile')
        },

        setLoading: (isLoading) => {
          set({ isLoading }, false, 'setLoading')
        },

        setInitialized: (isInitialized) => {
          set({ isInitialized }, false, 'setInitialized')
        },

        signOut: () => {
          set({
            user: null,
            session: null,
            profile: null,
            isLoading: false,
          }, false, 'signOut')
        },

        updateProfile: (updates) => {
          const currentProfile = get().profile
          if (currentProfile) {
            set({
              profile: { ...currentProfile, ...updates }
            }, false, 'updateProfile')
          }
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          session: state.session,
          profile: state.profile,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
)