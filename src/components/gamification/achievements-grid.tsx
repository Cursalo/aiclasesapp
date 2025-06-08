'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { AchievementCard } from './achievement-card'
import { useGamification } from '@/hooks/useGamification'
import { ACHIEVEMENT_DEFINITIONS, checkAchievementProgress } from '@/lib/gamification/achievements'
import type { Achievement, UserAchievement, AchievementCategory } from '@/lib/gamification/types'

interface AchievementsGridProps {
  className?: string
}

export function AchievementsGrid({ className }: AchievementsGridProps) {
  const { getUserAchievements, getGameStats, isLoading } = useGamification()
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [gameStats, setGameStats] = useState<any>(null)
  const [activeCategory, setActiveCategory] = useState<AchievementCategory | 'all'>('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [achievements, stats] = await Promise.all([
        getUserAchievements(),
        getGameStats()
      ])
      setUserAchievements(achievements)
      setGameStats(stats)
    } catch (error) {
      console.error('Error loading achievements:', error)
    }
  }

  // Convert achievement definitions to full achievement objects
  const allAchievements: Achievement[] = Object.entries(ACHIEVEMENT_DEFINITIONS).map(([type, def]) => ({
    id: type,
    ...def,
    created_at: new Date().toISOString()
  }))

  // Group achievements by category
  const categories: (AchievementCategory | 'all')[] = [
    'all',
    'progress',
    'completion',
    'streak',
    'skill',
    'social',
    'engagement',
    'special'
  ]

  const getFilteredAchievements = () => {
    if (activeCategory === 'all') {
      return allAchievements
    }
    return allAchievements.filter(achievement => achievement.category === activeCategory)
  }

  const filteredAchievements = getFilteredAchievements()

  // Get user achievement by type
  const getUserAchievement = (achievementType: string) => {
    return userAchievements.find(ua => ua.achievement_id === achievementType)
  }

  // Get achievement progress
  const getAchievementProgress = (achievement: Achievement) => {
    if (!gameStats) return 0
    const { progress } = checkAchievementProgress(achievement.type, gameStats)
    return progress
  }

  // Calculate stats
  const stats = {
    total: allAchievements.length,
    earned: userAchievements.length,
    percentage: allAchievements.length > 0 ? Math.round((userAchievements.length / allAchievements.length) * 100) : 0,
    totalPoints: userAchievements.reduce((sum, ua) => {
      const achievement = ACHIEVEMENT_DEFINITIONS[ua.achievement_id as keyof typeof ACHIEVEMENT_DEFINITIONS]
      return sum + (achievement?.points || 0)
    }, 0),
    byCategory: categories.slice(1).reduce((acc, category) => {
      const categoryAchievements = allAchievements.filter(a => a.category === category)
      const earnedInCategory = userAchievements.filter(ua => {
        const achievement = allAchievements.find(a => a.id === ua.achievement_id)
        return achievement?.category === category
      })
      acc[category as AchievementCategory] = {
        total: categoryAchievements.length,
        earned: earnedInCategory.length
      }
      return acc
    }, {} as Record<AchievementCategory, { total: number; earned: number }>)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className={className}>
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Icons.trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.earned}</p>
                <p className="text-sm text-muted-foreground">Achievements Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Icons.target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.percentage}%</p>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Icons.star className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalPoints}</p>
                <p className="text-sm text-muted-foreground">Achievement Points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Icons.layers className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as typeof activeCategory)}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="all" className="text-xs">
            All ({stats.total})
          </TabsTrigger>
          {categories.slice(1).map((category) => {
            const categoryStats = stats.byCategory[category as AchievementCategory]
            return (
              <TabsTrigger key={category} value={category} className="text-xs capitalize">
                {category} ({categoryStats?.earned || 0}/{categoryStats?.total || 0})
              </TabsTrigger>
            )
          })}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          {/* Recently Earned Section */}
          {activeCategory === 'all' && userAchievements.length > 0 && (
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Icons.sparkles className="h-5 w-5 text-yellow-500" />
                Recently Earned
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userAchievements
                  .slice(0, 3)
                  .map((userAchievement) => {
                    const achievement = allAchievements.find(a => a.id === userAchievement.achievement_id)
                    if (!achievement) return null
                    return (
                      <AchievementCard
                        key={userAchievement.id}
                        achievement={achievement}
                        userAchievement={userAchievement}
                        variant="earned"
                        size="md"
                      />
                    )
                  })}
              </div>
            </div>
          )}

          {/* All Achievements Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {activeCategory === 'all' ? 'All Achievements' : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Achievements`}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {filteredAchievements.filter(a => getUserAchievement(a.id)).length} earned
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {filteredAchievements.length - filteredAchievements.filter(a => getUserAchievement(a.id)).length} remaining
                </Badge>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAchievements.map((achievement) => {
                const userAchievement = getUserAchievement(achievement.id)
                const progress = getAchievementProgress(achievement)
                
                return (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    userAchievement={userAchievement}
                    progress={progress}
                    variant={userAchievement ? 'earned' : progress > 0 ? 'progress' : 'locked'}
                    size="md"
                  />
                )
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}