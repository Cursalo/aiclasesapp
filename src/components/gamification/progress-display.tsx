'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useGamification } from '@/hooks/useGamification'
import { calculateUserLevel } from '@/lib/gamification/achievements'
import { cn } from '@/lib/utils'
import type { GameStats, StreakInfo } from '@/lib/gamification/types'

interface ProgressDisplayProps {
  className?: string
  variant?: 'full' | 'compact'
}

export function ProgressDisplay({ className, variant = 'full' }: ProgressDisplayProps) {
  const { getGameStats, getStreakInfo, isLoading } = useGamification()
  const [gameStats, setGameStats] = useState<GameStats | null>(null)
  const [streakInfo, setStreakInfo] = useState<StreakInfo | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [stats, streak] = await Promise.all([
        getGameStats(),
        getStreakInfo()
      ])
      setGameStats(stats)
      setStreakInfo(streak)
    } catch (error) {
      console.error('Error loading progress data:', error)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!gameStats) {
    return null
  }

  const userLevel = calculateUserLevel(gameStats.total_points)

  if (variant === 'compact') {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{userLevel.icon}</div>
              <div>
                <div className="font-medium text-sm">{userLevel.title}</div>
                <div className="text-xs text-muted-foreground">Level {userLevel.level}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-sm">{gameStats.total_points} pts</div>
              {streakInfo && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Icons.flame className="h-3 w-3" />
                  {streakInfo.current_streak} day streak
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{userLevel.icon}</span>
            Level Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{userLevel.title}</h3>
              <p className="text-sm text-muted-foreground">Level {userLevel.level}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{gameStats.total_points}</div>
              <div className="text-sm text-muted-foreground">total points</div>
            </div>
          </div>

          {userLevel.points_to_next > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Level {userLevel.level + 1}</span>
                <span>{gameStats.total_points} / {gameStats.total_points + userLevel.points_to_next}</span>
              </div>
              <Progress 
                value={((gameStats.total_points) / (gameStats.total_points + userLevel.points_to_next)) * 100} 
                className="h-3"
              />
              <p className="text-xs text-muted-foreground">
                {userLevel.points_to_next} points to next level
              </p>
            </div>
          )}

          {/* Level Benefits */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Your Benefits</h4>
            <div className="space-y-1">
              {userLevel.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icons.checkCircle className="h-4 w-4 text-green-600" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Icons.bookOpen className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{gameStats.lessons_completed}</p>
                <p className="text-sm text-muted-foreground">Lessons Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Icons.graduationCap className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{gameStats.courses_completed}</p>
                <p className="text-sm text-muted-foreground">Courses Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Icons.brain className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{gameStats.perfect_quizzes}</p>
                <p className="text-sm text-muted-foreground">Perfect Quizzes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Icons.clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{Math.round(gameStats.time_studied / 3600)}h</p>
                <p className="text-sm text-muted-foreground">Time Studied</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Streak Information */}
      {streakInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.flame className="h-5 w-5 text-orange-500" />
              Learning Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-3xl font-bold text-orange-600">{streakInfo.current_streak}</div>
                <div className="text-sm text-muted-foreground">Current Streak</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-3xl font-bold text-orange-600">{streakInfo.longest_streak}</div>
                <div className="text-sm text-muted-foreground">Longest Streak</div>
              </div>
            </div>

            {/* Streak Milestones */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Streak Milestones</h4>
              <div className="grid gap-2 md:grid-cols-2">
                {streakInfo.streak_milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg border',
                      milestone.achieved 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : 'bg-muted/50 border-muted'
                    )}
                  >
                    <span className="text-lg">{milestone.icon}</span>
                    <div className="flex-1">
                      <div className={cn(
                        'text-sm font-medium',
                        milestone.achieved ? 'text-green-800' : 'text-muted-foreground'
                      )}>
                        {milestone.title}
                      </div>
                      <div className={cn(
                        'text-xs',
                        milestone.achieved ? 'text-green-600' : 'text-muted-foreground'
                      )}>
                        {milestone.days} days • {milestone.points} points
                      </div>
                    </div>
                    {milestone.achieved && (
                      <Icons.checkCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievement Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.trophy className="h-5 w-5 text-yellow-500" />
            Achievement Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold">{gameStats.achievements_earned}</div>
              <div className="text-sm text-muted-foreground">of {gameStats.total_achievements} achievements</div>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {Math.round((gameStats.achievements_earned / gameStats.total_achievements) * 100)}%
            </Badge>
          </div>
          <Progress 
            value={(gameStats.achievements_earned / gameStats.total_achievements) * 100} 
            className="h-3"
          />
        </CardContent>
      </Card>
    </div>
  )
}