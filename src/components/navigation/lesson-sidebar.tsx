'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { useLessonNavigation } from '@/hooks/useLessonNavigation'
import { getLessonConfig } from '@/lib/lessons/registry'

interface LessonSidebarProps {
  courseId: string
  currentLessonId?: string
  className?: string
}

export function LessonSidebar({ courseId, currentLessonId, className }: LessonSidebarProps) {
  const {
    navigationState,
    isLoading,
    navigateToLesson,
    navigateToCourse,
    getCourseProgress,
    getEstimatedTimeRemaining,
    isLessonAccessible,
    shouldShowLessonLock,
  } = useLessonNavigation(courseId, currentLessonId)

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!navigationState) {
    return null
  }

  const courseProgress = getCourseProgress()
  const timeRemaining = getEstimatedTimeRemaining()

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  const getStatusIcon = (lesson: any) => {
    if (lesson.progress?.status === 'completed') {
      return <Icons.checkCircle className="h-4 w-4 text-green-600" />
    }
    if (lesson.progress?.status === 'in-progress') {
      return <Icons.play className="h-4 w-4 text-blue-600" />
    }
    if (shouldShowLessonLock(lesson.id)) {
      return <Icons.lock className="h-4 w-4 text-muted-foreground" />
    }
    return <Icons.circle className="h-4 w-4 text-muted-foreground" />
  }

  const getLessonIcon = (type: string) => {
    try {
      const config = getLessonConfig(type as any)
      const IconComponent = config.icon
      return <IconComponent className="h-4 w-4" />
    } catch {
      return <Icons.fileText className="h-4 w-4" />
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Course Progress Overview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Course Progress</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={navigateToCourse}
            >
              <Icons.arrowLeft className="h-4 w-4 mr-1" />
              Course
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{Math.round(courseProgress.percentage)}%</span>
            </div>
            <Progress value={courseProgress.percentage} className="w-full" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{courseProgress.completed} of {courseProgress.total} lessons</span>
              {timeRemaining > 0 && (
                <span>{formatTime(timeRemaining)} remaining</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lesson List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Lessons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 p-3">
          {navigationState.lessons.map((lesson, index) => {
            const isCurrentLesson = lesson.id === currentLessonId
            const isAccessible = isLessonAccessible(lesson.id)
            const isLocked = shouldShowLessonLock(lesson.id)

            return (
              <div
                key={lesson.id}
                className={cn(
                  'group relative rounded-lg border p-3 transition-all',
                  isCurrentLesson && 'border-primary bg-primary/5',
                  !isCurrentLesson && 'border-border hover:border-primary/50',
                  !isAccessible && 'opacity-60'
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Lesson Number */}
                  <div className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                    isCurrentLesson ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}>
                    {lesson.order_index + 1}
                  </div>

                  {/* Lesson Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getLessonIcon(lesson.type)}
                      <h4 className={cn(
                        'text-sm font-medium truncate',
                        isCurrentLesson && 'text-primary'
                      )}>
                        {lesson.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatTime(lesson.estimated_duration)}</span>
                      {lesson.is_preview && (
                        <Badge variant="outline" className="text-xs">
                          Preview
                        </Badge>
                      )}
                    </div>

                    {/* Progress Bar for Current Lesson */}
                    {lesson.progress && lesson.progress.progress > 0 && lesson.progress.status !== 'completed' && (
                      <div className="mt-2">
                        <Progress value={lesson.progress.progress} className="h-1" />
                      </div>
                    )}
                  </div>

                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {getStatusIcon(lesson)}
                  </div>
                </div>

                {/* Click Overlay */}
                {isAccessible && !isLocked && (
                  <button
                    onClick={() => navigateToLesson(lesson.id)}
                    className="absolute inset-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label={`Go to ${lesson.title}`}
                  />
                )}

                {/* Lock Overlay */}
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                    <div className="text-center">
                      <Icons.lock className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground">Locked</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-3">
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                // Reset progress (you might want to add a confirmation dialog)
                console.log('Reset progress')
              }}
            >
              <Icons.restart className="h-4 w-4 mr-2" />
              Reset Progress
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                // Download certificate
                console.log('Download certificate')
              }}
              disabled={courseProgress.percentage < 100}
            >
              <Icons.download className="h-4 w-4 mr-2" />
              Download Certificate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}