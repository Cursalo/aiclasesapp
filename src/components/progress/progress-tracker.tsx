'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { useProgress } from '@/hooks/useProgress'
import type { UserStats } from '@/lib/progress/types'

interface ProgressTrackerProps {
  userId?: string
  showDetailed?: boolean
  className?: string
}

export function ProgressTracker({ userId, showDetailed = false, className }: ProgressTrackerProps) {
  const { getUserStats } = useProgress()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [userId])

  const loadStats = async () => {
    try {
      setIsLoading(true)
      const userStats = await getUserStats()
      setStats(userStats)
    } catch (error) {
      console.error('Error loading user stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className={className}>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="space-y-2">
                <div className="h-2 bg-muted rounded" />
                <div className="h-2 bg-muted rounded w-3/4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className={className}>
      {showDetailed ? (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Icons.trophy className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalPoints}</p>
                    <p className="text-sm text-muted-foreground">Total Points</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Icons.flame className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.currentStreak}</p>
                    <p className="text-sm text-muted-foreground">Day Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Icons.graduationCap className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.coursesCompleted}</p>
                    <p className="text-sm text-muted-foreground">Courses Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Icons.clock className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{formatTime(stats.timeSpent)}</p>
                    <p className="text-sm text-muted-foreground">Time Spent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Achievements */}
          {stats.achievements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.award className="h-5 w-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.achievements.slice(0, 5).map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{achievement.points} pts</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(achievement.earned_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          {stats.recentActivity.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.trendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        {activity.status === 'completed' ? (
                          <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <Icons.check className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <Icons.play className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">Lesson Progress</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={activity.progress} className="flex-1 h-2" />
                          <span className="text-sm text-muted-foreground">
                            {Math.round(activity.progress)}%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={activity.status === 'completed' ? 'default' : 'outline'}
                          className={activity.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                        >
                          {activity.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(activity.updated_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        /* Compact View */
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Learning Progress</h3>
                <Badge variant="outline">{stats.totalPoints} pts</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Streak</p>
                  <div className="flex items-center gap-1">
                    <Icons.flame className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">{stats.currentStreak} days</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground">Courses</p>
                  <div className="flex items-center gap-1">
                    <Icons.graduationCap className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{stats.coursesCompleted} completed</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground">Lessons</p>
                  <div className="flex items-center gap-1">
                    <Icons.bookOpen className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{stats.lessonsCompleted} completed</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground">Time Spent</p>
                  <div className="flex items-center gap-1">
                    <Icons.clock className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">{formatTime(stats.timeSpent)}</span>
                  </div>
                </div>
              </div>

              {stats.achievements.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Latest Achievement</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{stats.achievements[0].icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{stats.achievements[0].title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(stats.achievements[0].earned_at)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}