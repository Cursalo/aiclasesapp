'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'

export default function ConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState<string>('')
  const supabase = createClient()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const token_hash = searchParams.get('token_hash')
        const type = searchParams.get('type')
        const next = searchParams.get('next') ?? '/dashboard'

        // Check if we have the required parameters
        if (!token_hash || !type) {
          setStatus('error')
          setMessage('Invalid confirmation link. Please check your email and try again.')
          return
        }

        // Verify the email confirmation
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any,
        })

        if (error) {
          console.error('Email confirmation error:', error)
          setStatus('error')
          
          // Provide user-friendly error messages
          switch (error.message) {
            case 'Token has expired':
              setMessage('This confirmation link has expired. Please request a new one.')
              break
            case 'Invalid token':
              setMessage('This confirmation link is invalid. Please check your email and try again.')
              break
            default:
              setMessage(error.message || 'Failed to confirm email. Please try again.')
          }
          return
        }

        if (data.user) {
          setStatus('success')
          setMessage('Email confirmed successfully! Redirecting to your dashboard...')
          
          // Redirect after a short delay
          setTimeout(() => {
            router.push(next)
          }, 2000)
        } else {
          setStatus('error')
          setMessage('Email confirmation failed. Please try again.')
        }
      } catch (error: any) {
        console.error('Unexpected error during confirmation:', error)
        setStatus('error')
        setMessage('An unexpected error occurred. Please try again.')
      }
    }

    confirmEmail()
  }, [searchParams, router, supabase])

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Icons.logo className="mr-2 h-6 w-6" />
          AIClases LMS
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Welcome to AIClases! We're excited to have you join our community of learners."
            </p>
            <footer className="text-sm">Welcome Team, AIClases</footer>
          </blockquote>
        </div>
      </div>
      
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Email Confirmation
            </h1>
            <p className="text-sm text-muted-foreground">
              {status === 'loading' && 'Confirming your email address...'}
              {status === 'success' && 'Your email has been confirmed!'}
              {status === 'error' && 'Email confirmation failed'}
            </p>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                {status === 'loading' && (
                  <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
                )}
                {status === 'success' && (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                    <Icons.checkCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                )}
                {status === 'error' && (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                    <Icons.warning className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                )}
              </div>
              
              <CardTitle>
                {status === 'loading' && 'Processing...'}
                {status === 'success' && 'Confirmation Successful!'}
                {status === 'error' && 'Confirmation Failed'}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4 text-center">
              {status === 'loading' && (
                <CardDescription>
                  Please wait while we confirm your email address. This should only take a moment.
                </CardDescription>
              )}

              {status === 'success' && (
                <>
                  <Alert>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Your account is now active and you can start exploring our courses.
                    </p>
                    <Button asChild className="w-full">
                      <Link href="/dashboard">
                        Go to Dashboard
                      </Link>
                    </Button>
                  </div>
                </>
              )}

              {status === 'error' && (
                <>
                  <Alert variant="destructive">
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Don't worry, you can try the following options:
                    </p>
                    <div className="space-y-2">
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/register">
                          Request New Confirmation Email
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/login">
                          Try Signing In
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" className="w-full">
                        <Link href="/">
                          Back to Home
                        </Link>
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {status !== 'loading' && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Having trouble? {' '}
                <Link 
                  href="/contact" 
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Contact support
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}