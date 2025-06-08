'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'

interface AuthErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface AuthErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
}

export class AuthErrorBoundary extends React.Component<
  AuthErrorBoundaryProps,
  AuthErrorBoundaryState
> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Auth Error Boundary caught an error:', error, errorInfo)
    
    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo)
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback
      
      if (FallbackComponent) {
        return <FallbackComponent error={this.state.error} retry={this.retry} />
      }

      return <DefaultAuthErrorFallback error={this.state.error} retry={this.retry} />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error: Error
  retry: () => void
}

function DefaultAuthErrorFallback({ error, retry }: ErrorFallbackProps) {
  const isAuthError = error.message.includes('auth') || 
                     error.message.includes('authentication') ||
                     error.message.includes('session') ||
                     error.message.includes('token')

  const getErrorMessage = () => {
    if (error.message.includes('Network')) {
      return 'Network error. Please check your connection and try again.'
    }
    if (error.message.includes('Invalid token') || error.message.includes('expired')) {
      return 'Your session has expired. Please sign in again.'
    }
    if (isAuthError) {
      return 'Authentication error. Please try signing in again.'
    }
    return 'An unexpected error occurred. Please try again.'
  }

  const getErrorTitle = () => {
    if (error.message.includes('Network')) {
      return 'Connection Problem'
    }
    if (error.message.includes('Invalid token') || error.message.includes('expired')) {
      return 'Session Expired'
    }
    if (isAuthError) {
      return 'Authentication Error'
    }
    return 'Something Went Wrong'
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <Icons.warning className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {getErrorTitle()}
          </h1>
          <p className="text-sm text-muted-foreground">
            {getErrorMessage()}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Error Details</CardTitle>
            <CardDescription>
              Technical information about what went wrong
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                {error.message}
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Button onClick={retry} className="w-full">
                <Icons.restart className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/login'}
              >
                <Icons.arrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => window.location.href = '/'}
              >
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            If this problem persists, please {' '}
            <a 
              href="/contact" 
              className="underline underline-offset-4 hover:text-primary"
            >
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

// Hook for handling auth errors in components
export function useAuthErrorHandler() {
  const handleAuthError = (error: Error) => {
    console.error('Auth error:', error)
    
    // Handle specific auth errors
    if (error.message.includes('Invalid token') || error.message.includes('expired')) {
      // Redirect to login for expired sessions
      window.location.href = '/login?error=session_expired'
      return
    }
    
    if (error.message.includes('Unauthorized')) {
      // Redirect to unauthorized page
      window.location.href = '/unauthorized'
      return
    }
    
    // For other auth errors, you might want to show a toast or modal
    throw error // Re-throw to be caught by error boundary
  }

  return { handleAuthError }
}