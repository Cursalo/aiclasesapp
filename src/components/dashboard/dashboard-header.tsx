'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Icons } from '@/components/ui/icons'
import { useAuth } from '@/hooks/useAuth'
import { ProgressDisplay } from '@/components/gamification'
import { cn } from '@/lib/utils'

interface DashboardHeaderProps {
  className?: string
}

export function DashboardHeader({ className }: DashboardHeaderProps) {
  const { user, profile } = useAuth()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const getDisplayName = () => {
    if (profile?.full_name) return profile.full_name.split(' ')[0]
    if (profile?.username) return profile.username
    return 'there'
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {getGreeting()}, {getDisplayName()}! 👋
          </h1>
          <p className="text-muted-foreground">
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/courses">
              <Icons.search className="h-4 w-4 mr-2" />
              Browse Courses
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/profile">
              <Icons.user className="h-4 w-4 mr-2" />
              Profile
            </Link>
          </Button>
        </div>
      </div>

      {/* User Progress Overview */}
      <ProgressDisplay variant="compact" />

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <QuickStatCard
          icon={Icons.clock}
          label="Today's Goal"
          value="30 min"
          subValue="0 min completed"
          progress={0}
          color="blue"
        />
        <QuickStatCard
          icon={Icons.flame}
          label="Learning Streak"
          value={`${profile?.current_streak || 0} days`}
          subValue={profile?.current_streak ? 'Keep it up!' : 'Start today!'}
          progress={Math.min(100, ((profile?.current_streak || 0) / 7) * 100)}
          color="orange"
        />
        <QuickStatCard
          icon={Icons.trophy}
          label="This Week"
          value="3 lessons"
          subValue="2 more to goal"
          progress={60}
          color="green"
        />
        <QuickStatCard
          icon={Icons.star}
          label="Points Earned"
          value={`${profile?.total_points || 0}`}
          subValue="This month"
          progress={75}
          color="purple"
        />
      </div>
    </div>
  )
}

interface QuickStatCardProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  subValue: string
  progress: number
  color: 'blue' | 'orange' | 'green' | 'purple'
}

function QuickStatCard({ icon: Icon, label, value, subValue, progress, color }: QuickStatCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'text-blue-600'
      case 'orange':
        return 'text-orange-600'
      case 'green':
        return 'text-green-600'
      case 'purple':
        return 'text-purple-600'
      default:
        return 'text-blue-600'
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-lg bg-muted', getColorClasses())}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-lg font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{subValue}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}