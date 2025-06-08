'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { useLessonNavigation } from '@/hooks/useLessonNavigation'

interface LessonNavigationBarProps {
  courseId: string
  currentLessonId: string
  onNext?: () => void
  onPrevious?: () => void
  onComplete?: () => void
  className?: string
}

export function LessonNavigationBar({
  courseId,
  currentLessonId,
  onNext,
  onPrevious,
  onComplete,
  className,
}: LessonNavigationBarProps) {
  const {
    navigationState,
    navigateToNext,
    navigateToPrevious,
    navigateToCourse,
    getCurrentLessonIndex,
    getCourseProgress,
  } = useLessonNavigation(courseId, currentLessonId)

  if (!navigationState) {
    return null
  }

  const currentIndex = getCurrentLessonIndex()
  const currentLesson = navigationState.lessons[currentIndex]
  const courseProgress = getCourseProgress()

  const handleNext = () => {
    if (onNext) {
      onNext()
    } else {
      navigateToNext()
    }
  }

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious()
    } else {
      navigateToPrevious()
    }
  }

  const isCompleted = currentLesson?.progress?.status === 'completed'

  return (
    <div className={cn(
      'sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      className
    )}>
      <div className="container flex h-14 items-center justify-between">
        {/* Left Section - Course Navigation */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateToCourse}
            className="gap-2"
          >
            <Icons.arrowLeft className="h-4 w-4" />
            Course
          </Button>

          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <span>Lesson {currentIndex + 1} of {navigationState.lessons.length}</span>
            {currentLesson && (
              <>
                <span>•</span>
                <span className="font-medium">{currentLesson.title}</span>
              </>
            )}
          </div>
        </div>

        {/* Center Section - Progress */}
        <div className="hidden lg:flex items-center gap-4 flex-1 max-w-md mx-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Course Progress</span>
              <span className="font-medium">{Math.round(courseProgress.percentage)}%</span>
            </div>
            <Progress value={courseProgress.percentage} className="h-2" />
          </div>
        </div>

        {/* Right Section - Navigation Controls */}
        <div className="flex items-center gap-2">
          {/* Lesson Status */}
          {isCompleted && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <Icons.check className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={!navigationState.hasPrevious}
              className="gap-1"
            >
              <Icons.chevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            {navigationState.hasNext ? (
              <Button
                size="sm"
                onClick={handleNext}
                className="gap-1"
              >
                <span className="hidden sm:inline">Next</span>
                <Icons.chevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={onComplete || (() => navigateToCourse())}
                className="gap-1"
              >
                <Icons.check className="h-4 w-4" />
                <span className="hidden sm:inline">Complete Course</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="lg:hidden px-4 pb-2">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted-foreground">
            Lesson {currentIndex + 1} of {navigationState.lessons.length}
          </span>
          <span className="font-medium">{Math.round(courseProgress.percentage)}%</span>
        </div>
        <Progress value={courseProgress.percentage} className="h-1" />
      </div>
    </div>
  )
}