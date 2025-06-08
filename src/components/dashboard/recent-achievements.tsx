'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { AchievementCard } from '@/components/gamification'
import { useGamification } from '@/hooks/useGamification'
import { ACHIEVEMENT_DEFINITIONS } from '@/lib/gamification/achievements'
import type { UserAchievement } from '@/lib/gamification/types'

interface RecentAchievementsProps {
  className?: string
}

export function RecentAchievements({ className }: RecentAchievementsProps) {
  const { getUserAchievements, isLoading } = useGamification()
  const [recentAchievements, setRecentAchievements] = useState<UserAchievement[]>([])

  useEffect(() => {
    loadRecentAchievements()
  }, [])

  const loadRecentAchievements = async () => {
    try {
      const achievements = await getUserAchievements()
      // Get the 3 most recent achievements
      setRecentAchievements(achievements.slice(0, 3))
    } catch (error) {
      console.error('Error loading recent achievements:', error)
    }
  }

  // Convert achievement definitions to full achievement objects for display
  const getAchievementDetails = (achievementId: string) => {
    const def = ACHIEVEMENT_DEFINITIONS[achievementId as keyof typeof ACHIEVEMENT_DEFINITIONS]
    if (!def) return null
    
    return {
      id: achievementId,
      ...def,
      created_at: new Date().toISOString()
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.trophy className="h-5 w-5 text-yellow-500" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  if (recentAchievements.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.trophy className="h-5 w-5 text-yellow-500" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Icons.award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No achievements yet</h3>
            <p className="text-muted-foreground mb-6">
              Complete lessons and courses to start earning achievements!
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild>
                <Link href="/achievements">View All Achievements</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/courses">Start Learning</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icons.trophy className="h-5 w-5 text-yellow-500" />
            Recent Achievements
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/achievements">
              View All
              <Icons.arrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentAchievements.map((userAchievement) => {
          const achievement = getAchievementDetails(userAchievement.achievement_id)
          if (!achievement) return null

          return (
            <AchievementCard
              key={userAchievement.id}
              achievement={achievement}
              userAchievement={userAchievement}
              variant="earned"
              size="sm"
            />
          )
        })}

        {/* Motivational Message */}
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="text-2xl">✨</div>
            <div>
              <h4 className="font-medium text-yellow-800">Keep up the great work!</h4>
              <p className="text-sm text-yellow-700">
                You're making excellent progress. Complete more lessons to unlock new achievements.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}