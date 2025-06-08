'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { 
  ACHIEVEMENT_DEFINITIONS, 
  POINTS_SYSTEM, 
  calculateUserLevel, 
  checkAchievementProgress,
  STREAK_MILESTONES 
} from '@/lib/gamification/achievements'
import type { 
  Achievement, 
  UserAchievement, 
  GameStats, 
  Leaderboard, 
  LeaderboardPeriod,
  PointsTransaction,
  StreakInfo,
  AchievementType 
} from '@/lib/gamification/types'

export function useGamification() {
  const { user } = useAuth()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)

  // Award points for various actions
  const awardPoints = async (
    reason: string,
    points: number,
    description: string,
    metadata?: Record<string, any>
  ): Promise<PointsTransaction | null> => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('points_transactions')
        .insert({
          user_id: user.id,
          points,
          reason,
          description,
          metadata,
        })
        .select()
        .single()

      if (error) throw error

      // Update user's total points
      await supabase.rpc('update_user_points', {
        user_id: user.id,
        points_to_add: points
      })

      return data
    } catch (error) {
      console.error('Error awarding points:', error)
      return null
    }
  }

  // Check and award achievements
  const checkAchievements = async (userStats: GameStats): Promise<UserAchievement[]> => {
    if (!user) return []

    const newAchievements: UserAchievement[] = []

    try {
      // Get user's current achievements
      const { data: currentAchievements } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', user.id)

      const earnedAchievementIds = new Set(
        currentAchievements?.map(a => a.achievement_id) || []
      )

      // Check each achievement definition
      for (const [type, definition] of Object.entries(ACHIEVEMENT_DEFINITIONS)) {
        const achievementType = type as AchievementType
        
        // Skip if already earned
        if (earnedAchievementIds.has(achievementType)) continue

        const { earned } = checkAchievementProgress(achievementType, userStats)

        if (earned) {
          // Award the achievement
          const { data: newAchievement, error } = await supabase
            .from('user_achievements')
            .insert({
              user_id: user.id,
              achievement_id: achievementType,
              earned_at: new Date().toISOString(),
            })
            .select()
            .single()

          if (!error && newAchievement) {
            newAchievements.push(newAchievement)

            // Award points for the achievement
            await awardPoints(
              'achievement_earned',
              definition.points,
              `Earned achievement: ${definition.title}`,
              { achievement_type: achievementType }
            )
          }
        }
      }

      return newAchievements
    } catch (error) {
      console.error('Error checking achievements:', error)
      return []
    }
  }

  // Get user's game statistics
  const getGameStats = async (): Promise<GameStats | null> => {
    if (!user) return null

    try {
      const [
        { data: profile },
        { data: courseProgress },
        { data: lessonProgress },
        { data: achievements },
        { data: streak },
        { data: quizResults }
      ] = await Promise.all([
        supabase.from('profiles').select('total_points').eq('id', user.id).single(),
        supabase.from('course_progress').select('*').eq('user_id', user.id),
        supabase.from('lesson_progress').select('*').eq('user_id', user.id),
        supabase.from('user_achievements').select('*').eq('user_id', user.id),
        supabase.from('learning_streaks').select('*').eq('user_id', user.id).single(),
        supabase.from('quiz_attempts').select('*').eq('user_id', user.id)
      ])

      const totalPoints = profile?.total_points || 0
      const currentLevel = calculateUserLevel(totalPoints)
      
      const completedCourses = courseProgress?.filter(cp => cp.status === 'completed').length || 0
      const completedLessons = lessonProgress?.filter(lp => lp.status === 'completed').length || 0
      const perfectQuizzes = quizResults?.filter(qr => qr.score >= 100).length || 0
      const totalTimeStudied = courseProgress?.reduce((sum, cp) => sum + (cp.time_spent || 0), 0) || 0

      return {
        total_points: totalPoints,
        current_level: currentLevel.level,
        current_streak: streak?.current_streak || 0,
        longest_streak: streak?.longest_streak || 0,
        achievements_earned: achievements?.length || 0,
        total_achievements: Object.keys(ACHIEVEMENT_DEFINITIONS).length,
        lessons_completed: completedLessons,
        courses_completed: completedCourses,
        perfect_quizzes: perfectQuizzes,
        time_studied: totalTimeStudied,
      }
    } catch (error) {
      console.error('Error getting game stats:', error)
      return null
    }
  }

  // Get user's achievements
  const getUserAchievements = async (): Promise<UserAchievement[]> => {
    if (!user) return []

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false })

      if (error) throw error

      return data?.map(ua => ({
        ...ua,
        achievement: ACHIEVEMENT_DEFINITIONS[ua.achievement_id as AchievementType]
      })) || []
    } catch (error) {
      console.error('Error getting user achievements:', error)
      return []
    }
  }

  // Get leaderboard
  const getLeaderboard = async (
    period: LeaderboardPeriod = 'all-time',
    limit = 100
  ): Promise<Leaderboard | null> => {
    try {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          username,
          full_name,
          total_points,
          avatar_url
        `)
        .order('total_points', { ascending: false })
        .limit(limit)

      // For period-based leaderboards, we'd need additional logic
      // This is a simplified version using total points

      const { data: profiles, error } = await query

      if (error) throw error

      const entries = profiles?.map((profile, index) => ({
        rank: index + 1,
        user_id: profile.id,
        username: profile.username || 'Anonymous',
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        points: profile.total_points || 0,
        level: calculateUserLevel(profile.total_points || 0).level,
        streak: 0, // Would need to join with learning_streaks
        achievements_count: 0, // Would need to join with user_achievements
      })) || []

      // Find user's rank
      const userRank = user ? entries.findIndex(e => e.user_id === user.id) + 1 : undefined

      return {
        period,
        entries,
        user_rank: userRank || undefined,
        total_participants: entries.length,
      }
    } catch (error) {
      console.error('Error getting leaderboard:', error)
      return null
    }
  }

  // Get streak information
  const getStreakInfo = async (): Promise<StreakInfo | null> => {
    if (!user) return null

    try {
      const { data: streak, error } = await supabase
        .from('learning_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      const currentStreak = streak?.current_streak || 0
      const longestStreak = streak?.longest_streak || 0
      const lastActivityDate = streak?.last_activity_date || ''

      const streakMilestones = STREAK_MILESTONES.map(milestone => ({
        ...milestone,
        achieved: currentStreak >= milestone.days,
      }))

      return {
        current_streak: currentStreak,
        longest_streak: longestStreak,
        last_activity_date: lastActivityDate,
        streak_milestones: streakMilestones,
      }
    } catch (error) {
      console.error('Error getting streak info:', error)
      return null
    }
  }

  // Award lesson completion points and check achievements
  const handleLessonCompletion = async (lessonId: string, metadata?: Record<string, any>) => {
    if (!user) return

    try {
      // Award points for lesson completion
      await awardPoints(
        'lesson_completed',
        POINTS_SYSTEM.LESSON_COMPLETED,
        'Completed a lesson',
        { lesson_id: lessonId, ...metadata }
      )

      // Get updated stats and check for achievements
      const stats = await getGameStats()
      if (stats) {
        const newAchievements = await checkAchievements(stats)
        return { achievements: newAchievements, stats }
      }
    } catch (error) {
      console.error('Error handling lesson completion:', error)
    }
  }

  // Award course completion points and check achievements
  const handleCourseCompletion = async (courseId: string) => {
    if (!user) return

    try {
      // Award points for course completion
      await awardPoints(
        'course_completed',
        POINTS_SYSTEM.COURSE_COMPLETED,
        'Completed a course',
        { course_id: courseId }
      )

      // Get updated stats and check for achievements
      const stats = await getGameStats()
      if (stats) {
        const newAchievements = await checkAchievements(stats)
        return { achievements: newAchievements, stats }
      }
    } catch (error) {
      console.error('Error handling course completion:', error)
    }
  }

  // Award quiz completion points
  const handleQuizCompletion = async (
    quizId: string, 
    score: number, 
    perfect: boolean = false
  ) => {
    if (!user) return

    try {
      const points = perfect ? POINTS_SYSTEM.QUIZ_PERFECT : POINTS_SYSTEM.QUIZ_PASSED
      const description = perfect ? 'Perfect quiz score!' : 'Passed quiz'

      await awardPoints(
        perfect ? 'quiz_perfect' : 'quiz_passed',
        points,
        description,
        { quiz_id: quizId, score }
      )

      // Check achievements if perfect score
      if (perfect) {
        const stats = await getGameStats()
        if (stats) {
          const newAchievements = await checkAchievements(stats)
          return { achievements: newAchievements, stats }
        }
      }
    } catch (error) {
      console.error('Error handling quiz completion:', error)
    }
  }

  // Award daily login points
  const handleDailyLogin = async () => {
    if (!user) return

    try {
      const today = new Date().toISOString().split('T')[0]
      
      // Check if already awarded points today
      const { data: existingTransaction } = await supabase
        .from('points_transactions')
        .select('id')
        .eq('user_id', user.id)
        .eq('reason', 'daily_login')
        .gte('created_at', today)
        .single()

      if (!existingTransaction) {
        await awardPoints(
          'daily_login',
          POINTS_SYSTEM.DAILY_LOGIN,
          'Daily login bonus'
        )
      }
    } catch (error) {
      console.error('Error handling daily login:', error)
    }
  }

  return {
    isLoading,
    awardPoints,
    checkAchievements,
    getGameStats,
    getUserAchievements,
    getLeaderboard,
    getStreakInfo,
    handleLessonCompletion,
    handleCourseCompletion,
    handleQuizCompletion,
    handleDailyLogin,
  }
}