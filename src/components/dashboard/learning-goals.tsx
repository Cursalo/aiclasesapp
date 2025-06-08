'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'

interface LearningGoal {
  id: string
  title: string
  description: string
  target: number
  current: number
  unit: string
  period: 'daily' | 'weekly' | 'monthly'
  icon: keyof typeof Icons
  color: string
  deadline?: string
}

interface LearningGoalsProps {
  className?: string
}

export function LearningGoals({ className }: LearningGoalsProps) {
  const [goals] = useState<LearningGoal[]>([
    {
      id: '1',
      title: 'Daily Learning',
      description: 'Study for 30 minutes every day',
      target: 30,
      current: 0,
      unit: 'minutes',
      period: 'daily',
      icon: 'clock',
      color: 'blue',
    },
    {
      id: '2',
      title: 'Weekly Lessons',
      description: 'Complete 5 lessons this week',
      target: 5,
      current: 2,
      unit: 'lessons',
      period: 'weekly',
      icon: 'bookOpen',
      color: 'green',
    },
    {
      id: '3',
      title: 'Monthly Streak',
      description: 'Maintain a 21-day learning streak',
      target: 21,
      current: 3,
      unit: 'days',
      period: 'monthly',
      icon: 'flame',
      color: 'orange',
    },
  ])

  const getProgressPercentage = (goal: LearningGoal) => {
    return Math.min(100, (goal.current / goal.target) * 100)
  }

  const getStatusColor = (goal: LearningGoal) => {
    const progress = getProgressPercentage(goal)
    if (progress >= 100) return 'text-green-600'
    if (progress >= 75) return 'text-blue-600'
    if (progress >= 50) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const getStatusText = (goal: LearningGoal) => {
    const progress = getProgressPercentage(goal)
    if (progress >= 100) return 'Completed!'
    if (progress >= 75) return 'Almost there!'
    if (progress >= 50) return 'Good progress'
    return 'Just started'
  }

  const getRemainingTime = (period: LearningGoal['period']) => {
    const now = new Date()
    
    switch (period) {
      case 'daily':
        const endOfDay = new Date(now)
        endOfDay.setHours(23, 59, 59, 999)
        const hoursLeft = Math.ceil((endOfDay.getTime() - now.getTime()) / (1000 * 60 * 60))
        return `${hoursLeft}h left today`
      
      case 'weekly':
        const endOfWeek = new Date(now)
        const daysUntilSunday = 7 - now.getDay()
        endOfWeek.setDate(now.getDate() + daysUntilSunday)
        endOfWeek.setHours(23, 59, 59, 999)
        const daysLeft = Math.ceil((endOfWeek.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return `${daysLeft} days left this week`
      
      case 'monthly':
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
        const monthDaysLeft = Math.ceil((endOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return `${monthDaysLeft} days left this month`
      
      default:
        return ''
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icons.target className="h-5 w-5 text-blue-600" />
            Learning Goals
          </div>
          <Button variant="ghost" size="sm">
            <Icons.settings className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {goals.map((goal) => {
          const IconComponent = Icons[goal.icon]
          const progress = getProgressPercentage(goal)
          const isCompleted = progress >= 100

          return (
            <div key={goal.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'p-2 rounded-lg',
                    goal.color === 'blue' && 'bg-blue-100 text-blue-600',
                    goal.color === 'green' && 'bg-green-100 text-green-600',
                    goal.color === 'orange' && 'bg-orange-100 text-orange-600'
                  )}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">{goal.title}</h3>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  </div>
                </div>
                <Badge
                  variant={isCompleted ? "default" : "secondary"}
                  className={cn(
                    "text-xs",
                    isCompleted && "bg-green-600 hover:bg-green-700"
                  )}
                >
                  {goal.current}/{goal.target} {goal.unit}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={getStatusColor(goal)}>
                    {getStatusText(goal)}
                  </span>
                  <span className="text-muted-foreground">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress 
                  value={progress} 
                  className={cn(
                    "h-2",
                    isCompleted && "bg-green-100"
                  )}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {goal.target - goal.current > 0 
                      ? `${goal.target - goal.current} ${goal.unit} to go`
                      : 'Goal achieved!'
                    }
                  </span>
                  <span>{getRemainingTime(goal.period)}</span>
                </div>
              </div>

              {/* Goal Actions */}
              {!isCompleted && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs h-8">
                    <Icons.play className="h-3 w-3 mr-1" />
                    Continue Learning
                  </Button>
                  {goal.period === 'daily' && (
                    <Button size="sm" variant="ghost" className="text-xs h-8">
                      <Icons.checkCircle className="h-3 w-3 mr-1" />
                      Mark as Done
                    </Button>
                  )}
                </div>
              )}

              {/* Completion Celebration */}
              {isCompleted && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <Icons.checkCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Goal completed! 🎉</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Add New Goal */}
        <Button variant="outline" className="w-full" size="sm">
          <Icons.add className="h-4 w-4 mr-2" />
          Add New Goal
        </Button>
      </CardContent>
    </Card>
  )
}