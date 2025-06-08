'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'student' | 'instructor' | 'admin'
  fallbackPath?: string
}

export function ProtectedRoute({ 
  children, 
  requiredRole,
  fallbackPath = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isInitialized, profile, hasRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Wait for auth to initialize
    if (!isInitialized) return

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      const currentPath = window.location.pathname
      const loginUrl = `${fallbackPath}${currentPath !== '/' ? `?redirectTo=${currentPath}` : ''}`
      router.push(loginUrl)
      return
    }

    // If role is required and user doesn't have it, redirect to unauthorized
    if (requiredRole && !hasRole(requiredRole)) {
      router.push('/unauthorized')
      return
    }
  }, [isAuthenticated, isInitialized, requiredRole, hasRole, router, fallbackPath])

  // Show loading while initializing
  if (!isInitialized || isLoading) {
    return <LoadingSpinner />
  }

  // Show loading if redirecting
  if (!isAuthenticated || (requiredRole && !hasRole(requiredRole))) {
    return <LoadingSpinner />
  }

  return <>{children}</>
}

// Higher-order component for protecting pages
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: 'student' | 'instructor' | 'admin'
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute requiredRole={requiredRole}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}

// Specific role-based protection components
export function StudentRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requiredRole="student">{children}</ProtectedRoute>
}

export function InstructorRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requiredRole="instructor">{children}</ProtectedRoute>
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>
}