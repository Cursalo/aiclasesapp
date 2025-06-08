'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import type { UserAchievement } from '@/lib/gamification/types'
import { ACHIEVEMENT_DEFINITIONS } from '@/lib/gamification/achievements'

interface AchievementNotificationProps {
  achievement: UserAchievement
  onDismiss: () => void
  className?: string
}

export function AchievementNotification({
  achievement,
  onDismiss,
  className
}: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  const achievementDef = ACHIEVEMENT_DEFINITIONS[achievement.achievement_id as keyof typeof ACHIEVEMENT_DEFINITIONS]

  useEffect(() => {
    // Slide in animation
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(() => {
      onDismiss()
    }, 300)
  }

  if (!achievementDef) return null

  return (
    <div className={cn(
      'fixed top-4 right-4 z-50 transition-all duration-300 ease-out',
      isVisible && !isExiting && 'translate-x-0 opacity-100',
      !isVisible && 'translate-x-full opacity-0',
      isExiting && 'translate-x-full opacity-0',
      className
    )}>
      <Card className="w-80 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Achievement Icon with Animation */}
            <div className="relative">
              <div className="text-3xl animate-bounce">
                {achievementDef.icon}
              </div>
              <div className="absolute -top-1 -right-1">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
            </div>

            {/* Achievement Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-semibold text-yellow-800">
                    Achievement Unlocked!
                  </h3>
                  <h4 className="font-medium text-yellow-700">
                    {achievementDef.title}
                  </h4>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="h-6 w-6 p-0 text-yellow-600 hover:text-yellow-800"
                >
                  <Icons.x className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-yellow-700 mb-3">
                {achievementDef.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icons.star className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-700">
                    +{achievementDef.points} points
                  </span>
                </div>
                <Badge 
                  variant="outline" 
                  className="bg-yellow-100 text-yellow-800 border-yellow-300 capitalize"
                >
                  {achievementDef.rarity}
                </Badge>
              </div>
            </div>
          </div>

          {/* Confetti Effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  'absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping',
                  `animation-delay-${i * 100}`
                )}
                style={{
                  top: `${20 + (i * 10)}%`,
                  left: `${10 + (i * 15)}%`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface AchievementNotificationManagerProps {
  achievements: UserAchievement[]
  onDismissAll: () => void
}

export function AchievementNotificationManager({
  achievements,
  onDismissAll
}: AchievementNotificationManagerProps) {
  const [visibleAchievements, setVisibleAchievements] = useState<UserAchievement[]>([])

  useEffect(() => {
    if (achievements.length > 0) {
      // Show achievements one by one with a delay
      achievements.forEach((achievement, index) => {
        setTimeout(() => {
          setVisibleAchievements(prev => [...prev, achievement])
        }, index * 1000)
      })
    }
  }, [achievements])

  const handleDismiss = (achievementId: string) => {
    setVisibleAchievements(prev => 
      prev.filter(a => a.id !== achievementId)
    )
    
    // If no more achievements are visible, call onDismissAll
    setTimeout(() => {
      setVisibleAchievements(current => {
        if (current.length === 0) {
          onDismissAll()
        }
        return current
      })
    }, 300)
  }

  return (
    <>
      {visibleAchievements.map((achievement, index) => (
        <AchievementNotification
          key={achievement.id}
          achievement={achievement}
          onDismiss={() => handleDismiss(achievement.id)}
          style={{
            top: `${1 + (index * 5)}rem`,
          }}
        />
      ))}
    </>
  )
}