'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'

export default function UnauthorizedPage() {
  const { profile, signOut } = useAuth()

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
              "Access is earned through dedication and commitment to learning."
            </p>
            <footer className="text-sm">Security Team, AIClases</footer>
          </blockquote>
        </div>
      </div>
      
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <Icons.warning className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Access Denied
            </h1>
            <p className="text-sm text-muted-foreground">
              You don't have permission to access this resource
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Insufficient Permissions</CardTitle>
              <CardDescription>
                This page requires elevated permissions that your current account doesn't have.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <div className="text-sm">
                  <span className="text-muted-foreground">Current role:</span>
                  <span className="ml-2 font-medium capitalize">{profile?.role || 'Unknown'}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Account:</span>
                  <span className="ml-2 font-medium">{profile?.username || 'Unknown'}</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Here are some things you can try:
                </p>
                
                <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
                  <li>Contact your administrator to request access</li>
                  <li>Check if you're signed in with the correct account</li>
                  <li>Return to your dashboard to access available features</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/dashboard">
                    <Icons.arrowLeft className="mr-2 h-4 w-4" />
                    Go to Dashboard
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full" onClick={() => signOut()}>
                  <Icons.logout className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Need help? {' '}
              <Link 
                href="/contact" 
                className="underline underline-offset-4 hover:text-primary"
              >
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}