'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LessonRenderer } from '@/lib/lessons/registry'
import { LessonNavigationBar } from '@/components/navigation/lesson-navigation-bar'
import { useProgress } from '@/hooks/useProgress'
import { useLessonNavigation } from '@/hooks/useLessonNavigation'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'
import type { LessonComponent, LessonProgress } from '@/lib/lessons/types'

interface LessonWithProgressProps {
  lesson: LessonComponent
  courseId: string
  readonly?: boolean
  preview?: boolean
  showNavigation?: boolean
  className?: string
}

export function LessonWithProgress({
  lesson,
  courseId,
  readonly = false,
  preview = false,
  showNavigation = true,
  className,
}: LessonWithProgressProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { updateLessonProgress, completeLesson, getLessonProgress } = useProgress()
  const { navigateToNext, navigationState } = useLessonNavigation(courseId, lesson.id)
  
  const [progress, setProgress] = useState<LessonProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user && lesson.id) {
      loadProgress()
    }
  }, [user, lesson.id])

  const loadProgress = async () => {
    try {
      setIsLoading(true)
      const lessonProgress = await getLessonProgress(lesson.id)
      setProgress(lessonProgress)
    } catch (error) {
      console.error('Error loading lesson progress:', error)
      setError('Failed to load progress')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProgress = async (progressValue: number, data?: any) => {
    if (!user || readonly || preview) return

    try {
      const updatedProgress = await updateLessonProgress(
        lesson.id,
        courseId,
        progressValue,
        data
      )
      setProgress(updatedProgress)
    } catch (error) {
      console.error('Error updating progress:', error)
      setError('Failed to update progress')
    }
  }

  const handleComplete = async (data?: any) => {
    if (!user || readonly || preview) return

    try {
      const completedProgress = await completeLesson(lesson.id, courseId, data)
      setProgress(completedProgress)
      
      // Show completion notification
      // You could implement a toast notification here
      console.log('Lesson completed!', completedProgress)
      
    } catch (error) {
      console.error('Error completing lesson:', error)
      setError('Failed to complete lesson')
    }
  }

  const handleNext = () => {
    if (navigationState?.hasNext) {
      navigateToNext()
    } else {
      // Course completed - navigate to course completion page
      router.push(`/courses/${courseId}/complete`)
    }
  }

  const handlePrevious = () => {
    // This will be handled by the navigation bar component
  }

  // Create a default progress object if none exists
  const currentProgress: LessonProgress = progress || {
    id: '',
    user_id: user?.id || '',
    lesson_id: lesson.id,
    course_id: courseId,
    status: 'not-started',
    progress: 0,
    time_spent: 0,
    data: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Alert variant="destructive">
          <Icons.warning className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Navigation Bar */}
      {showNavigation && !preview && (
        <LessonNavigationBar
          courseId={courseId}
          currentLessonId={lesson.id}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onComplete={handleComplete}
        />
      )}

      {/* Lesson Content */}
      <div className="container max-w-4xl mx-auto py-8">
        <LessonRenderer
          lesson={lesson}
          progress={currentProgress}
          onProgress={handleProgress}
          onComplete={handleComplete}
          readonly={readonly}
          preview={preview}
        />
      </div>

      {/* Preview Mode Notice */}
      {preview && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert className="border-blue-200 dark:border-blue-800">
            <Icons.eye className="h-4 w-4" />
            <AlertDescription>
              Preview mode - Progress is not saved
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 left-4 z-50">
          <Alert variant="destructive">
            <Icons.warning className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}