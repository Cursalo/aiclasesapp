'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import type { Achievement, UserAchievement } from '@/lib/gamification/types'

interface AchievementCardProps {
  achievement: Achievement
  userAchievement?: UserAchievement
  progress?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'earned' | 'locked' | 'progress'
  className?: string
}

export function AchievementCard({
  achievement,
  userAchievement,
  progress = 0,
  size = 'md',
  variant = 'locked',
  className
}: AchievementCardProps) {
  const isEarned = !!userAchievement
  const isLocked = variant === 'locked' && !isEarned
  const showProgress = variant === 'progress' && !isEarned

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'uncommon':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rare':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'epic':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'legendary':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          card: 'p-3',
          icon: 'text-2xl',
          title: 'text-sm font-medium',
          description: 'text-xs',
          points: 'text-xs'
        }
      case 'lg':
        return {
          card: 'p-6',
          icon: 'text-5xl',
          title: 'text-lg font-semibold',
          description: 'text-sm',
          points: 'text-sm'
        }
      default:
        return {
          card: 'p-4',
          icon: 'text-3xl',
          title: 'text-base font-medium',
          description: 'text-sm',
          points: 'text-sm'
        }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const sizeClasses = getSizeClasses()

  return (
    <Card className={cn(
      'transition-all duration-200 hover:shadow-md',
      isEarned && 'ring-2 ring-primary/20 bg-primary/5',
      isLocked && 'opacity-60',
      className
    )}>
      <CardContent className={sizeClasses.card}>
        <div className="flex items-start gap-3">
          {/* Achievement Icon */}
          <div className={cn(
            'flex-shrink-0 relative',
            isLocked && 'grayscale'
          )}>
            <span className={sizeClasses.icon}>
              {achievement.icon}
            </span>
            {isEarned && (
              <div className="absolute -top-1 -right-1">
                <Icons.checkCircle className="h-4 w-4 text-green-600 bg-white rounded-full" />
              </div>
            )}
          </div>

          {/* Achievement Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <h3 className={cn(
                  sizeClasses.title,
                  isLocked && 'text-muted-foreground'
                )}>
                  {achievement.title}
                </h3>
                <p className={cn(
                  sizeClasses.description,
                  'text-muted-foreground mt-1'
                )}>
                  {achievement.description}
                </p>
              </div>

              {/* Rarity Badge */}
              <Badge
                variant="outline"
                className={cn(
                  'text-xs capitalize flex-shrink-0',
                  getRarityColor(achievement.rarity)
                )}
              >
                {achievement.rarity}
              </Badge>
            </div>

            {/* Points and Progress */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Icons.star className="h-4 w-4 text-yellow-500" />
                <span className={cn(
                  sizeClasses.points,
                  'font-medium text-muted-foreground'
                )}>
                  {achievement.points} points
                </span>
              </div>

              {/* Earned Date */}
              {isEarned && userAchievement && (
                <span className="text-xs text-muted-foreground">
                  Earned {formatDate(userAchievement.earned_at)}
                </span>
              )}
            </div>

            {/* Progress Bar */}
            {showProgress && progress > 0 && (
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Category */}
            {size !== 'sm' && (
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs capitalize">
                  {achievement.category}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}