'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: keyof typeof Icons
  href: string
  color: string
  badge?: string
}

interface QuickActionsProps {
  className?: string
}

export function QuickActions({ className }: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: '1',
      title: 'Browse Courses',
      description: 'Discover new courses to expand your skills',
      icon: 'search',
      href: '/courses',
      color: 'blue',
    },
    {
      id: '2',
      title: 'My Achievements',
      description: 'View your progress and earned badges',
      icon: 'trophy',
      href: '/achievements',
      color: 'yellow',
      badge: 'New'
    },
    {
      id: '3',
      title: 'Leaderboard',
      description: 'See how you rank among other learners',
      icon: 'barChart',
      href: '/leaderboard',
      color: 'green',
    },
    {
      id: '4',
      title: 'Study Notes',
      description: 'Review your saved notes and highlights',
      icon: 'fileText',
      href: '/notes',
      color: 'purple',
    },
    {
      id: '5',
      title: 'Discussion Forum',
      description: 'Connect with other learners and instructors',
      icon: 'messageSquare',
      href: '/discussions',
      color: 'orange',
    },
    {
      id: '6',
      title: 'Learning Path',
      description: 'Follow structured learning pathways',
      icon: 'target',
      href: '/learning-paths',
      color: 'pink',
    },
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icons.zap className="h-5 w-5 text-blue-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => (
            <QuickActionCard key={action.id} action={action} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface QuickActionCardProps {
  action: QuickAction
}

function QuickActionCard({ action }: QuickActionCardProps) {
  const IconComponent = Icons[action.icon]
  
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
      case 'yellow':
        return 'bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100'
      case 'green':
        return 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
      case 'purple':
        return 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100'
      case 'orange':
        return 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100'
      case 'pink':
        return 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100'
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
    }
  }

  return (
    <Button
      variant="outline"
      className={cn(
        'h-auto p-4 justify-start transition-all duration-200 hover:shadow-md relative',
        getColorClasses(action.color)
      )}
      asChild
    >
      <Link href={action.href}>
        <div className="flex items-start gap-3 w-full">
          <div className="flex-shrink-0">
            <IconComponent className="h-5 w-5" />
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-sm">{action.title}</h3>
              {action.badge && (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {action.badge}
                </span>
              )}
            </div>
            <p className="text-xs opacity-80 line-clamp-2">
              {action.description}
            </p>
          </div>
        </div>
      </Link>
    </Button>
  )
}