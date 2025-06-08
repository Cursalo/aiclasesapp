export interface Course {
  id: string
  title: string
  description: string
  instructor_id: string
  instructor_name?: string
  instructor_avatar?: string
  thumbnail_url?: string
  preview_video_url?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
  tags: string[]
  price: number
  currency: string
  is_published: boolean
  is_featured: boolean
  estimated_duration: number // in minutes
  total_lessons: number
  total_students: number
  average_rating: number
  total_ratings: number
  created_at: string
  updated_at: string
  published_at?: string
}

export interface CourseWithProgress extends Course {
  enrollment?: CourseEnrollment
  progress?: CourseProgressInfo
  next_lesson?: LessonInfo
}

export interface CourseEnrollment {
  id: string
  user_id: string
  course_id: string
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  enrolled_at: string
  completed_at?: string
  progress: number
  time_spent: number
}

export interface CourseProgressInfo {
  lessons_completed: number
  total_lessons: number
  progress_percentage: number
  time_spent: number
  last_accessed: string
  current_lesson_id?: string
}

export interface LessonInfo {
  id: string
  title: string
  type: string
  duration: number
  order_index: number
}

export interface CourseCatalogFilters {
  category?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  price?: 'free' | 'paid'
  duration?: 'short' | 'medium' | 'long' // <2h, 2-10h, >10h
  rating?: number
  tags?: string[]
  search?: string
  instructor?: string
}

export interface CourseCatalogSort {
  field: 'title' | 'created_at' | 'price' | 'rating' | 'popularity' | 'difficulty'
  direction: 'asc' | 'desc'
}

export interface CourseCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  course_count: number
}

export interface CourseRating {
  id: string
  user_id: string
  course_id: string
  rating: number
  review?: string
  created_at: string
  updated_at: string
  user_name?: string
  user_avatar?: string
}

export interface CourseStats {
  total_courses: number
  total_students: number
  total_instructors: number
  featured_courses: Course[]
  popular_categories: CourseCategory[]
  recent_courses: Course[]
}