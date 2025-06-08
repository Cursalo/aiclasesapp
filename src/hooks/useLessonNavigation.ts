'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import type { NavigationState, LessonNavigationItem } from '@/lib/progress/types'

export function useLessonNavigation(courseId: string, currentLessonId?: string) {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [navigationState, setNavigationState] = useState<NavigationState | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (courseId) {
      loadNavigationState()
    }
  }, [courseId, currentLessonId, user])

  const loadNavigationState = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      // Get all lessons in the course
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select(`
          id,
          title,
          order_index,
          is_preview,
          estimated_duration,
          content
        `)
        .eq('course_id', courseId)
        .order('order_index')

      if (lessonsError) throw lessonsError

      // Get progress for all lessons
      const { data: progressData } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)

      // Create navigation items
      const navigationItems: LessonNavigationItem[] = lessons?.map(lesson => {
        const progress = progressData?.find(p => p.lesson_id === lesson.id) || null
        
        // Extract lesson type from content
        let lessonType = 'text'
        if (lesson.content && Array.isArray(lesson.content) && lesson.content.length > 0) {
          lessonType = lesson.content[0].type || 'text'
        }

        return {
          id: lesson.id,
          title: lesson.title,
          type: lessonType,
          order_index: lesson.order_index,
          is_preview: lesson.is_preview,
          estimated_duration: lesson.estimated_duration,
          progress,
        }
      }) || []

      // Find current lesson index
      const currentIndex = navigationItems.findIndex(item => item.id === currentLessonId)
      
      // Determine next and previous lessons
      const hasNext = currentIndex >= 0 && currentIndex < navigationItems.length - 1
      const hasPrevious = currentIndex > 0
      const nextLessonId = hasNext ? navigationItems[currentIndex + 1].id : undefined
      const previousLessonId = hasPrevious ? navigationItems[currentIndex - 1].id : undefined

      setNavigationState({
        courseId,
        currentLessonId: currentLessonId || '',
        lessons: navigationItems,
        hasNext,
        hasPrevious,
        nextLessonId,
        previousLessonId,
      })

    } catch (error) {
      console.error('Error loading navigation state:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const navigateToLesson = (lessonId: string) => {
    router.push(`/courses/${courseId}/lessons/${lessonId}`)
  }

  const navigateToNext = () => {
    if (navigationState?.hasNext && navigationState.nextLessonId) {
      navigateToLesson(navigationState.nextLessonId)
    }
  }

  const navigateToPrevious = () => {
    if (navigationState?.hasPrevious && navigationState.previousLessonId) {
      navigateToLesson(navigationState.previousLessonId)
    }
  }

  const navigateToCourse = () => {
    router.push(`/courses/${courseId}`)
  }

  const getNextAvailableLesson = () => {
    if (!navigationState) return null

    // Find the first uncompleted lesson
    const uncompletedLesson = navigationState.lessons.find(lesson => 
      !lesson.progress || lesson.progress.status !== 'completed'
    )

    return uncompletedLesson || navigationState.lessons[0]
  }

  const getLessonById = (lessonId: string) => {
    return navigationState?.lessons.find(lesson => lesson.id === lessonId) || null
  }

  const getCurrentLessonIndex = () => {
    if (!navigationState || !navigationState.currentLessonId) return -1
    return navigationState.lessons.findIndex(lesson => lesson.id === navigationState.currentLessonId)
  }

  const getCourseProgress = () => {
    if (!navigationState) return { completed: 0, total: 0, percentage: 0 }

    const completed = navigationState.lessons.filter(lesson => 
      lesson.progress?.status === 'completed'
    ).length
    const total = navigationState.lessons.length
    const percentage = total > 0 ? (completed / total) * 100 : 0

    return { completed, total, percentage }
  }

  const getEstimatedTimeRemaining = () => {
    if (!navigationState) return 0

    const incompleteLessons = navigationState.lessons.filter(lesson => 
      !lesson.progress || lesson.progress.status !== 'completed'
    )

    return incompleteLessons.reduce((sum, lesson) => sum + lesson.estimated_duration, 0)
  }

  const isLessonAccessible = (lessonId: string) => {
    if (!navigationState) return false

    const lesson = getLessonById(lessonId)
    if (!lesson) return false

    // Preview lessons are always accessible
    if (lesson.is_preview) return true

    // Check if user is enrolled in the course
    // This would typically be checked against enrollment data
    // For now, we'll assume all lessons are accessible to authenticated users
    return !!user
  }

  const shouldShowLessonLock = (lessonId: string) => {
    const lesson = getLessonById(lessonId)
    if (!lesson) return false

    // Show lock if lesson is not accessible and not a preview
    return !isLessonAccessible(lessonId) && !lesson.is_preview
  }

  return {
    navigationState,
    isLoading,
    navigateToLesson,
    navigateToNext,
    navigateToPrevious,
    navigateToCourse,
    getNextAvailableLesson,
    getLessonById,
    getCurrentLessonIndex,
    getCourseProgress,
    getEstimatedTimeRemaining,
    isLessonAccessible,
    shouldShowLessonLock,
    refreshNavigation: loadNavigationState,
  }
}