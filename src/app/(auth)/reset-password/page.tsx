'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/hooks/useAuth'
import { resetPasswordSchema, updatePasswordSchema, type ResetPasswordData, type UpdatePasswordData } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { resetPassword, updatePassword, isLoading } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [step, setStep] = useState<'request' | 'update'>('request')

  // Check if we have a recovery token in the URL
  const accessToken = searchParams.get('access_token')
  const refreshToken = searchParams.get('refresh_token')
  const type = searchParams.get('type')

  // If we have tokens and type is recovery, show update password form
  React.useEffect(() => {
    if (accessToken && refreshToken && type === 'recovery') {
      setStep('update')
    }
  }, [accessToken, refreshToken, type])

  const requestForm = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const updateForm = useForm<UpdatePasswordData>({
    resolver: zodResolver(updatePasswordSchema),
  })

  async function onRequestSubmit(data: ResetPasswordData) {
    try {
      setError(null)
      setSuccess(null)
      
      await resetPassword(data.email)
      setSuccess(
        'Password reset email sent! Please check your email for a link to reset your password.'
      )
    } catch (error: any) {
      console.error('Password reset error:', error)
      setError(error.message || 'An error occurred while sending the reset email')
    }
  }

  async function onUpdateSubmit(data: UpdatePasswordData) {
    try {
      setError(null)
      setSuccess(null)
      
      await updatePassword(data.password)
      setSuccess('Password updated successfully! You can now sign in with your new password.')
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error: any) {
      console.error('Password update error:', error)
      setError(error.message || 'An error occurred while updating your password')
    }
  }

  if (step === 'update') {
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
                "Security is paramount in our learning platform. Your new password will keep your progress and achievements safe."
              </p>
              <footer className="text-sm">Security Team, AIClases</footer>
            </blockquote>
          </div>
        </div>
        
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Update Password
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your new password below
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>New Password</CardTitle>
                <CardDescription>
                  Choose a strong password for your account
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert>
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your new password"
                      {...updateForm.register('password')}
                      disabled={updateForm.formState.isSubmitting || isLoading}
                    />
                    {updateForm.formState.errors.password && (
                      <p className="text-sm text-destructive">
                        {updateForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your new password"
                      {...updateForm.register('confirmPassword')}
                      disabled={updateForm.formState.isSubmitting || isLoading}
                    />
                    {updateForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {updateForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={updateForm.formState.isSubmitting || isLoading || !!success}
                  >
                    {updateForm.formState.isSubmitting || isLoading ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Updating password...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
              "Don't worry, it happens to the best of us. We'll help you get back to learning in no time."
            </p>
            <footer className="text-sm">Support Team, AIClases</footer>
          </blockquote>
        </div>
      </div>
      
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Reset Password
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email address and we'll send you a reset link
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Forgot Password</CardTitle>
              <CardDescription>
                Remember your password?{' '}
                <Link 
                  href="/login"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Sign in here
                </Link>
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={requestForm.handleSubmit(onRequestSubmit)}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    {...requestForm.register('email')}
                    disabled={requestForm.formState.isSubmitting || isLoading}
                  />
                  {requestForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {requestForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </CardContent>

              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={requestForm.formState.isSubmitting || isLoading || !!success}
                >
                  {requestForm.formState.isSubmitting || isLoading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Sending reset link...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}