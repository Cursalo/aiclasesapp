export interface LessonProgress {
  id: string
  user_id: string
  lesson_id: string
  course_id: string
  status: 'not-started' | 'in-progress' | 'completed'
  progress: number // 0-100
  time_spent: number // in seconds
  data: Record<string, any> // lesson-specific progress data
  started_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface CourseProgress {
  id: string
  user_id: string
  course_id: string
  status: 'not-started' | 'in-progress' | 'completed'
  progress: number // 0-100
  lessons_completed: number
  total_lessons: number
  time_spent: number // in seconds
  current_lesson_id?: string
  started_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface LearningStreak {
  id: string
  user_id: string
  current_streak: number
  longest_streak: number
  last_activity_date: string
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: string
  user_id: string
  achievement_type: string
  title: string
  description: string
  icon: string
  points: number
  earned_at: string
  course_id?: string
  lesson_id?: string
}

export interface UserStats {
  totalPoints: number
  currentStreak: number
  longestStreak: number
  coursesCompleted: number
  lessonsCompleted: number
  timeSpent: number // in seconds
  achievements: Achievement[]
  recentActivity: LessonProgress[]
}

export interface NavigationState {
  courseId: string
  currentLessonId: string
  lessons: LessonNavigationItem[]
  hasNext: boolean
  hasPrevious: boolean
  nextLessonId?: string
  previousLessonId?: string
}

export interface LessonNavigationItem {
  id: string
  title: string
  type: string
  order_index: number
  is_preview: boolean
  estimated_duration: number
  progress: LessonProgress | null
}