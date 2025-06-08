'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import type { LessonProgress, CourseProgress, UserStats } from '@/lib/progress/types'

export function useProgress() {
  const { user } = useAuth()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)

  // Update lesson progress
  const updateLessonProgress = async (
    lessonId: string,
    courseId: string,
    progress: number,
    data?: Record<string, any>
  ) => {
    if (!user) throw new Error('User not authenticated')

    setIsLoading(true)
    try {
      const progressData = {
        user_id: user.id,
        lesson_id: lessonId,
        course_id: courseId,
        progress: Math.min(100, Math.max(0, progress)),
        status: progress >= 100 ? 'completed' : progress > 0 ? 'in-progress' : 'not-started',
        data: data || {},
        updated_at: new Date().toISOString(),
      }

      // Check if progress already exists
      const { data: existing } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .single()

      let result
      if (existing) {
        // Update existing progress
        const updateData = {
          ...progressData,
          time_spent: (existing.time_spent || 0) + (data?.timeSpent || 0),
        }

        if (progress >= 100 && !existing.completed_at) {
          updateData.completed_at = new Date().toISOString()
        }

        result = await supabase
          .from('lesson_progress')
          .update(updateData)
          .eq('id', existing.id)
          .select()
          .single()
      } else {
        // Create new progress
        const insertData = {
          ...progressData,
          time_spent: data?.timeSpent || 0,
          started_at: new Date().toISOString(),
          completed_at: progress >= 100 ? new Date().toISOString() : null,
        }

        result = await supabase
          .from('lesson_progress')
          .insert(insertData)
          .select()
          .single()
      }

      if (result.error) throw result.error

      // Update course progress
      await updateCourseProgress(courseId)

      return result.data
    } catch (error) {
      console.error('Error updating lesson progress:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Complete lesson
  const completeLesson = async (
    lessonId: string,
    courseId: string,
    data?: Record<string, any>
  ) => {
    return updateLessonProgress(lessonId, courseId, 100, data)
  }

  // Update course progress
  const updateCourseProgress = async (courseId: string) => {
    if (!user) throw new Error('User not authenticated')

    try {
      // Get all lessons in the course
      const { data: lessons } = await supabase
        .from('lessons')
        .select('id')
        .eq('course_id', courseId)
        .order('order_index')

      if (!lessons || lessons.length === 0) return

      // Get progress for all lessons
      const { data: progressData } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)

      const completedLessons = progressData?.filter(p => p.status === 'completed') || []
      const totalTimeSpent = progressData?.reduce((sum, p) => sum + (p.time_spent || 0), 0) || 0
      const overallProgress = (completedLessons.length / lessons.length) * 100

      const courseProgressData = {
        user_id: user.id,
        course_id: courseId,
        progress: overallProgress,
        lessons_completed: completedLessons.length,
        total_lessons: lessons.length,
        time_spent: totalTimeSpent,
        status: overallProgress >= 100 ? 'completed' : overallProgress > 0 ? 'in-progress' : 'not-started',
        updated_at: new Date().toISOString(),
      }

      // Check if course progress exists
      const { data: existing } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single()

      if (existing) {
        const updateData = {
          ...courseProgressData,
          completed_at: overallProgress >= 100 && !existing.completed_at 
            ? new Date().toISOString() 
            : existing.completed_at,
        }

        await supabase
          .from('course_progress')
          .update(updateData)
          .eq('id', existing.id)
      } else {
        const insertData = {
          ...courseProgressData,
          started_at: new Date().toISOString(),
          completed_at: overallProgress >= 100 ? new Date().toISOString() : null,
        }

        await supabase
          .from('course_progress')
          .insert(insertData)
      }

      // Update learning streak
      await updateLearningStreak()

    } catch (error) {
      console.error('Error updating course progress:', error)
      throw error
    }
  }

  // Update learning streak
  const updateLearningStreak = async () => {
    if (!user) return

    try {
      const today = new Date().toISOString().split('T')[0]
      
      const { data: streak } = await supabase
        .from('learning_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (streak) {
        const lastActivityDate = streak.last_activity_date
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]

        let newStreak = streak.current_streak
        
        if (lastActivityDate === yesterday.toISOString().split('T')[0]) {
          // Consecutive day
          newStreak += 1
        } else if (lastActivityDate !== today) {
          // Streak broken
          newStreak = 1
        }

        await supabase
          .from('learning_streaks')
          .update({
            current_streak: newStreak,
            longest_streak: Math.max(streak.longest_streak, newStreak),
            last_activity_date: today,
            updated_at: new Date().toISOString(),
          })
          .eq('id', streak.id)
      } else {
        // Create new streak
        await supabase
          .from('learning_streaks')
          .insert({
            user_id: user.id,
            current_streak: 1,
            longest_streak: 1,
            last_activity_date: today,
          })
      }
    } catch (error) {
      console.error('Error updating learning streak:', error)
    }
  }

  // Get lesson progress
  const getLessonProgress = async (lessonId: string): Promise<LessonProgress | null> => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data || null
    } catch (error) {
      console.error('Error getting lesson progress:', error)
      return null
    }
  }

  // Get course progress
  const getCourseProgress = async (courseId: string): Promise<CourseProgress | null> => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data || null
    } catch (error) {
      console.error('Error getting course progress:', error)
      return null
    }
  }

  // Get user stats
  const getUserStats = async (): Promise<UserStats | null> => {
    if (!user) return null

    try {
      const [
        { data: profile },
        { data: courseProgress },
        { data: lessonProgress },
        { data: streak },
        { data: achievements }
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('course_progress').select('*').eq('user_id', user.id),
        supabase.from('lesson_progress').select('*').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(10),
        supabase.from('learning_streaks').select('*').eq('user_id', user.id).single(),
        supabase.from('achievements').select('*').eq('user_id', user.id).order('earned_at', { ascending: false })
      ])

      const stats: UserStats = {
        totalPoints: profile?.total_points || 0,
        currentStreak: streak?.current_streak || 0,
        longestStreak: streak?.longest_streak || 0,
        coursesCompleted: courseProgress?.filter(cp => cp.status === 'completed').length || 0,
        lessonsCompleted: lessonProgress?.filter(lp => lp.status === 'completed').length || 0,
        timeSpent: courseProgress?.reduce((sum, cp) => sum + (cp.time_spent || 0), 0) || 0,
        achievements: achievements || [],
        recentActivity: lessonProgress || [],
      }

      return stats
    } catch (error) {
      console.error('Error getting user stats:', error)
      return null
    }
  }

  return {
    isLoading,
    updateLessonProgress,
    completeLesson,
    updateCourseProgress,
    getLessonProgress,
    getCourseProgress,
    getUserStats,
  }
}