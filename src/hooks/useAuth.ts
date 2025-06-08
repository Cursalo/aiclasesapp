'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  const router = useRouter()
  const supabase = createClient()
  const {
    user,
    session,
    profile,
    isLoading,
    isInitialized,
    setAuth,
    setProfile,
    setLoading,
    setInitialized,
    signOut: storeSignOut,
  } = useAuthStore()

  // Initialize auth state
  useEffect(() => {
    let mounted = true

    async function initializeAuth() {
      try {
        setLoading(true)
        
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          return
        }

        if (mounted) {
          setAuth(initialSession?.user ?? null, initialSession)
          
          // If we have a user, fetch their profile
          if (initialSession?.user) {
            await fetchProfile(initialSession.user.id)
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        if (mounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        console.log('Auth state changed:', event, session?.user?.id)

        setAuth(session?.user ?? null, session)

        if (session?.user) {
          // Fetch profile when user signs in
          await fetchProfile(session.user.id)
        } else {
          // Clear profile when user signs out
          setProfile(null)
        }

        setLoading(false)

        // Handle specific auth events
        switch (event) {
          case 'SIGNED_IN':
            router.refresh()
            break
          case 'SIGNED_OUT':
            router.push('/')
            router.refresh()
            break
          case 'TOKEN_REFRESHED':
            router.refresh()
            break
        }
      }
    )

    // Initialize only if not already initialized
    if (!isInitialized) {
      initializeAuth()
    }

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase, setAuth, setProfile, setLoading, setInitialized, isInitialized, router])

  // Fetch user profile
  async function fetchProfile(userId: string) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      setProfile(profile)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  // Sign in with email and password
  async function signIn(email: string, password: string) {
    setLoading(true)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      throw error
    }

    return data
  }

  // Sign up with email and password
  async function signUp(email: string, password: string, fullName: string, username: string) {
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username: username,
        },
      },
    })

    setLoading(false)

    if (error) {
      throw error
    }

    return data
  }

  // Sign out
  async function signOut() {
    setLoading(true)
    
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      setLoading(false)
      throw error
    }

    storeSignOut()
  }

  // Reset password
  async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      throw error
    }
  }

  // Update password
  async function updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      throw error
    }
  }

  // Update profile
  async function updateProfile(updates: Partial<Omit<typeof profile, 'id' | 'created_at' | 'updated_at'>>) {
    if (!user) {
      throw new Error('No authenticated user')
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    setProfile(data)
    return data
  }

  // Check if user has specific role
  function hasRole(role: 'student' | 'instructor' | 'admin'): boolean {
    return profile?.role === role
  }

  // Check if user has at least instructor role
  function isInstructor(): boolean {
    return profile?.role === 'instructor' || profile?.role === 'admin'
  }

  // Check if user is admin
  function isAdmin(): boolean {
    return profile?.role === 'admin'
  }

  // Check if user is authenticated
  function isAuthenticated(): boolean {
    return !!user && !!session
  }

  return {
    user,
    session,
    profile,
    isLoading,
    isInitialized,
    isAuthenticated: isAuthenticated(),
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    hasRole,
    isInstructor: isInstructor(),
    isAdmin: isAdmin(),
    fetchProfile,
  }
}