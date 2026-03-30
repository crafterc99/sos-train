import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Session } from '@supabase/supabase-js'
import type { Profile } from '@/types'
import { supabase, supabaseConfigured } from '@/lib/supabase'

interface AuthState {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  initialized: boolean
  initialize: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
  refreshProfile: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      profile: null,
      loading: false,
      initialized: false,

      initialize: async () => {
        try {
          if (!supabaseConfigured) {
            set({ initialized: true })
            return
          }
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()
            set({ user: session.user, session, profile, initialized: true })
          } else {
            set({ initialized: true })
          }

          supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single()
              set({ user: session.user, session, profile })
            } else {
              set({ user: null, session: null, profile: null })
            }
          })
        } catch (error) {
          console.error('Auth initialization error:', error)
          set({ initialized: true })
        }
      },

      signInWithEmail: async (email, password) => {
        set({ loading: true })
        try {
          const { error } = await supabase.auth.signInWithPassword({ email, password })
          if (error) throw error
        } finally {
          set({ loading: false })
        }
      },

      signUpWithEmail: async (email, password) => {
        set({ loading: true })
        try {
          const { error } = await supabase.auth.signUp({ email, password })
          if (error) throw error
        } finally {
          set({ loading: false })
        }
      },

      signInWithGoogle: async () => {
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: `${window.location.origin}/auth/callback` },
        })
      },

      signOut: async () => {
        await supabase.auth.signOut()
        set({ user: null, session: null, profile: null })
      },

      resetPassword: async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        })
        if (error) throw error
      },

      updateProfile: async (updates) => {
        const { user } = get()
        if (!user) throw new Error('Not authenticated')
        const { data, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id)
          .select()
          .single()
        if (error) throw error
        set({ profile: data })
      },

      refreshProfile: async () => {
        const { user } = get()
        if (!user) return
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        if (data) set({ profile: data })
      },
    }),
    {
      name: 'sos-auth',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        profile: state.profile,
      }),
    }
  )
)
