'use client'

import { AuthErrorBoundary } from './auth-error-boundary'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <AuthErrorBoundary>
      {children}
    </AuthErrorBoundary>
  )
}