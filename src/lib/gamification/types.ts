export interface Achievement {
  id: string
  type: AchievementType
  title: string
  description: string
  icon: string
  category: AchievementCategory
  points: number
  rarity: AchievementRarity
  requirements: AchievementRequirement[]
  is_hidden: boolean
  created_at: string
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  earned_at: string
  progress?: number
  metadata?: Record<string, any>
  achievement?: Achievement
}

export type AchievementType = 
  | 'first_lesson'
  | 'first_course'
  | 'streak_milestone'
  | 'lesson_count'
  | 'course_completion'
  | 'perfect_quiz'
  | 'speed_learner'
  | 'night_owl'
  | 'early_bird'
  | 'social_learner'
  | 'code_master'
  | 'quiz_champion'
  | 'dedication'
  | 'explorer'
  | 'mentor'

export type AchievementCategory = 
  | 'progress'
  | 'engagement'
  | 'skill'
  | 'social'
  | 'streak'
  | 'completion'
  | 'special'

export type AchievementRarity = 
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'

export interface AchievementRequirement {
  type: RequirementType
  value: number | string
  operator: 'eq' | 'gte' | 'lte' | 'gt' | 'lt'
}

export type RequirementType =
  | 'lessons_completed'
  | 'courses_completed'
  | 'streak_days'
  | 'total_points'
  | 'quiz_perfect_score'
  | 'lesson_time'
  | 'consecutive_days'
  | 'course_category'
  | 'lesson_type'

export interface Leaderboard {
  period: LeaderboardPeriod
  entries: LeaderboardEntry[]
  user_rank?: number
  total_participants: number
}

export interface LeaderboardEntry {
  rank: number
  user_id: string
  username: string
  full_name?: string
  avatar_url?: string
  points: number
  level: number
  streak: number
  achievements_count: number
}

export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'all-time'

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  requirements: BadgeRequirement[]
}

export interface BadgeRequirement {
  type: 'achievement_count' | 'specific_achievements' | 'points' | 'streak'
  value: number | string[]
}

export interface UserLevel {
  level: number
  title: string
  points_required: number
  points_to_next: number
  benefits: string[]
  icon: string
  color: string
}

export interface PointsTransaction {
  id: string
  user_id: string
  points: number
  reason: PointsReason
  description: string
  metadata?: Record<string, any>
  created_at: string
}

export type PointsReason =
  | 'lesson_completed'
  | 'course_completed'
  | 'quiz_perfect'
  | 'streak_milestone'
  | 'achievement_earned'
  | 'daily_login'
  | 'first_time_bonus'
  | 'referral_bonus'

export interface GameStats {
  total_points: number
  current_level: number
  current_streak: number
  longest_streak: number
  achievements_earned: number
  total_achievements: number
  lessons_completed: number
  courses_completed: number
  perfect_quizzes: number
  time_studied: number // in seconds
  rank_position?: number
  rank_percentile?: number
}

export interface StreakInfo {
  current_streak: number
  longest_streak: number
  last_activity_date: string
  streak_milestones: StreakMilestone[]
}

export interface StreakMilestone {
  days: number
  title: string
  icon: string
  points: number
  achieved: boolean
}