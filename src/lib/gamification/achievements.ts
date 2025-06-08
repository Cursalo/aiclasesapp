import type { Achievement, AchievementType } from './types'

export const ACHIEVEMENT_DEFINITIONS: Record<AchievementType, Omit<Achievement, 'id' | 'created_at'>> = {
  first_lesson: {
    type: 'first_lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    category: 'progress',
    points: 10,
    rarity: 'common',
    requirements: [
      { type: 'lessons_completed', value: 1, operator: 'gte' }
    ],
    is_hidden: false,
  },

  first_course: {
    type: 'first_course',
    title: 'Course Champion',
    description: 'Complete your first course',
    icon: '🏆',
    category: 'completion',
    points: 100,
    rarity: 'uncommon',
    requirements: [
      { type: 'courses_completed', value: 1, operator: 'gte' }
    ],
    is_hidden: false,
  },

  streak_milestone: {
    type: 'streak_milestone',
    title: 'Streak Master',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    category: 'streak',
    points: 50,
    rarity: 'uncommon',
    requirements: [
      { type: 'streak_days', value: 7, operator: 'gte' }
    ],
    is_hidden: false,
  },

  lesson_count: {
    type: 'lesson_count',
    title: 'Learning Machine',
    description: 'Complete 50 lessons',
    icon: '📚',
    category: 'progress',
    points: 200,
    rarity: 'rare',
    requirements: [
      { type: 'lessons_completed', value: 50, operator: 'gte' }
    ],
    is_hidden: false,
  },

  course_completion: {
    type: 'course_completion',
    title: 'Graduation Day',
    description: 'Complete 5 courses',
    icon: '🎓',
    category: 'completion',
    points: 500,
    rarity: 'rare',
    requirements: [
      { type: 'courses_completed', value: 5, operator: 'gte' }
    ],
    is_hidden: false,
  },

  perfect_quiz: {
    type: 'perfect_quiz',
    title: 'Perfect Score',
    description: 'Get 100% on a quiz',
    icon: '💯',
    category: 'skill',
    points: 25,
    rarity: 'common',
    requirements: [
      { type: 'quiz_perfect_score', value: 1, operator: 'gte' }
    ],
    is_hidden: false,
  },

  speed_learner: {
    type: 'speed_learner',
    title: 'Speed Demon',
    description: 'Complete a lesson in under 5 minutes',
    icon: '⚡',
    category: 'engagement',
    points: 15,
    rarity: 'common',
    requirements: [
      { type: 'lesson_time', value: 300, operator: 'lte' }
    ],
    is_hidden: false,
  },

  night_owl: {
    type: 'night_owl',
    title: 'Night Owl',
    description: 'Complete a lesson after 10 PM',
    icon: '🦉',
    category: 'special',
    points: 20,
    rarity: 'uncommon',
    requirements: [],
    is_hidden: false,
  },

  early_bird: {
    type: 'early_bird',
    title: 'Early Bird',
    description: 'Complete a lesson before 6 AM',
    icon: '🐦',
    category: 'special',
    points: 20,
    rarity: 'uncommon',
    requirements: [],
    is_hidden: false,
  },

  social_learner: {
    type: 'social_learner',
    title: 'Social Butterfly',
    description: 'Participate in 10 discussions',
    icon: '💬',
    category: 'social',
    points: 75,
    rarity: 'uncommon',
    requirements: [],
    is_hidden: false,
  },

  code_master: {
    type: 'code_master',
    title: 'Code Master',
    description: 'Complete 25 coding exercises',
    icon: '💻',
    category: 'skill',
    points: 150,
    rarity: 'rare',
    requirements: [
      { type: 'lesson_type', value: 'code', operator: 'eq' }
    ],
    is_hidden: false,
  },

  quiz_champion: {
    type: 'quiz_champion',
    title: 'Quiz Champion',
    description: 'Get perfect scores on 10 quizzes',
    icon: '🧠',
    category: 'skill',
    points: 250,
    rarity: 'rare',
    requirements: [
      { type: 'quiz_perfect_score', value: 10, operator: 'gte' }
    ],
    is_hidden: false,
  },

  dedication: {
    type: 'dedication',
    title: 'Dedicated Learner',
    description: 'Maintain a 30-day streak',
    icon: '💪',
    category: 'streak',
    points: 300,
    rarity: 'epic',
    requirements: [
      { type: 'streak_days', value: 30, operator: 'gte' }
    ],
    is_hidden: false,
  },

  explorer: {
    type: 'explorer',
    title: 'Explorer',
    description: 'Complete courses in 5 different categories',
    icon: '🗺️',
    category: 'progress',
    points: 400,
    rarity: 'epic',
    requirements: [],
    is_hidden: false,
  },

  mentor: {
    type: 'mentor',
    title: 'Mentor',
    description: 'Help others by answering 50 questions',
    icon: '👨‍🏫',
    category: 'social',
    points: 500,
    rarity: 'legendary',
    requirements: [],
    is_hidden: true,
  },
}

export const LEVEL_DEFINITIONS = [
  { level: 1, title: 'Novice', points_required: 0, icon: '🌱', color: '#10b981' },
  { level: 2, title: 'Learner', points_required: 100, icon: '📖', color: '#3b82f6' },
  { level: 3, title: 'Student', points_required: 250, icon: '🎒', color: '#6366f1' },
  { level: 4, title: 'Scholar', points_required: 500, icon: '🎓', color: '#8b5cf6' },
  { level: 5, title: 'Expert', points_required: 1000, icon: '⭐', color: '#f59e0b' },
  { level: 6, title: 'Master', points_required: 2000, icon: '👑', color: '#ef4444' },
  { level: 7, title: 'Guru', points_required: 5000, icon: '🔮', color: '#ec4899' },
  { level: 8, title: 'Legend', points_required: 10000, icon: '🌟', color: '#f97316' },
]

export const STREAK_MILESTONES = [
  { days: 3, title: 'Getting Started', icon: '🔥', points: 15 },
  { days: 7, title: 'Week Warrior', icon: '🏃', points: 50 },
  { days: 14, title: 'Two Week Trek', icon: '🏔️', points: 100 },
  { days: 30, title: 'Month Master', icon: '🗓️', points: 300 },
  { days: 60, title: 'Consistency King', icon: '👑', points: 600 },
  { days: 100, title: 'Century Celebration', icon: '💯', points: 1000 },
  { days: 365, title: 'Year of Learning', icon: '🎊', points: 3650 },
]

export const POINTS_SYSTEM = {
  LESSON_COMPLETED: 10,
  COURSE_COMPLETED: 100,
  QUIZ_PERFECT: 25,
  QUIZ_PASSED: 15,
  DAILY_LOGIN: 5,
  STREAK_BONUS: 2, // per day in streak
  DISCUSSION_POST: 5,
  DISCUSSION_REPLY: 3,
  CODE_EXERCISE: 15,
  ASSIGNMENT_SUBMITTED: 20,
  FIRST_TIME_BONUS: 50,
}

export function calculateUserLevel(totalPoints: number) {
  const levels = LEVEL_DEFINITIONS
  let currentLevel = levels[0]
  
  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalPoints >= levels[i].points_required) {
      currentLevel = levels[i]
      break
    }
  }
  
  // Calculate points to next level
  const nextLevelIndex = levels.findIndex(l => l.level === currentLevel.level + 1)
  const nextLevel = nextLevelIndex >= 0 ? levels[nextLevelIndex] : null
  const pointsToNext = nextLevel ? nextLevel.points_required - totalPoints : 0
  
  return {
    ...currentLevel,
    points_to_next: Math.max(0, pointsToNext),
    benefits: [
      'Access to course materials',
      'Community discussions',
      currentLevel.level >= 3 ? 'Priority support' : null,
      currentLevel.level >= 5 ? 'Advanced courses' : null,
      currentLevel.level >= 7 ? 'Exclusive content' : null,
    ].filter(Boolean) as string[],
  }
}

export function checkAchievementProgress(
  achievementType: AchievementType,
  userStats: any
): { earned: boolean; progress: number } {
  const achievement = ACHIEVEMENT_DEFINITIONS[achievementType]
  
  if (!achievement.requirements.length) {
    // Special achievements that need custom logic
    return { earned: false, progress: 0 }
  }
  
  const requirement = achievement.requirements[0] // For simplicity, check first requirement
  let currentValue = 0
  let targetValue = Number(requirement.value)
  
  switch (requirement.type) {
    case 'lessons_completed':
      currentValue = userStats.lessons_completed || 0
      break
    case 'courses_completed':
      currentValue = userStats.courses_completed || 0
      break
    case 'streak_days':
      currentValue = userStats.current_streak || 0
      break
    case 'total_points':
      currentValue = userStats.total_points || 0
      break
    case 'quiz_perfect_score':
      currentValue = userStats.perfect_quizzes || 0
      break
    default:
      currentValue = 0
  }
  
  const progress = Math.min(100, (currentValue / targetValue) * 100)
  const earned = evaluateRequirement(currentValue, requirement.operator, targetValue)
  
  return { earned, progress }
}

function evaluateRequirement(current: number, operator: string, target: number): boolean {
  switch (operator) {
    case 'eq': return current === target
    case 'gte': return current >= target
    case 'lte': return current <= target
    case 'gt': return current > target
    case 'lt': return current < target
    default: return false
  }
}