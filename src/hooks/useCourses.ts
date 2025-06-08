'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import type { 
  Course, 
  CourseWithProgress, 
  CourseCatalogFilters, 
  CourseCatalogSort,
  CourseEnrollment,
  CourseStats 
} from '@/lib/courses/types'

export function useCourses() {
  const { user } = useAuth()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)

  // Get all courses with optional filters
  const getCourses = async (
    filters?: CourseCatalogFilters,
    sort?: CourseCatalogSort,
    limit?: number,
    offset?: number
  ): Promise<{ courses: Course[], total: number }> => {
    setIsLoading(true)
    try {
      let query = supabase
        .from('courses')
        .select(`
          *,
          profiles!courses_instructor_id_fkey(full_name, username)
        `, { count: 'exact' })
        .eq('is_published', true)

      // Apply filters
      if (filters) {
        if (filters.category) {
          query = query.eq('category', filters.category)
        }
        if (filters.difficulty) {
          query = query.eq('difficulty', filters.difficulty)
        }
        if (filters.price === 'free') {
          query = query.eq('price', 0)
        } else if (filters.price === 'paid') {
          query = query.gt('price', 0)
        }
        if (filters.search) {
          query = query.or(`title.ilike.%${filters.search}%, description.ilike.%${filters.search}%`)
        }
        if (filters.tags && filters.tags.length > 0) {
          query = query.overlaps('tags', filters.tags)
        }
        if (filters.rating) {
          query = query.gte('average_rating', filters.rating)
        }
        if (filters.instructor) {
          query = query.eq('instructor_id', filters.instructor)
        }
      }

      // Apply sorting
      if (sort) {
        query = query.order(sort.field, { ascending: sort.direction === 'asc' })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      // Apply pagination
      if (limit) {
        query = query.limit(limit)
      }
      if (offset) {
        query = query.range(offset, offset + (limit || 10) - 1)
      }

      const { data, error, count } = await query

      if (error) throw error

      const courses = data?.map(course => ({
        ...course,
        instructor_name: course.profiles?.full_name || course.profiles?.username,
      })) || []

      return { courses, total: count || 0 }
    } catch (error) {
      console.error('Error fetching courses:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Get course by ID
  const getCourse = async (courseId: string): Promise<Course | null> => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles!courses_instructor_id_fkey(full_name, username, bio),
          lessons(id, title, order_index, estimated_duration)
        `)
        .eq('id', courseId)
        .single()

      if (error) throw error

      return {
        ...data,
        instructor_name: data.profiles?.full_name || data.profiles?.username,
        total_lessons: data.lessons?.length || 0,
      }
    } catch (error) {
      console.error('Error fetching course:', error)
      return null
    }
  }

  // Get user's enrolled courses
  const getEnrolledCourses = async (): Promise<CourseWithProgress[]> => {
    if (!user) return []

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses(*,
            profiles!courses_instructor_id_fkey(full_name, username)
          ),
          course_progress(*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('enrolled_at', { ascending: false })

      if (error) throw error

      return data?.map(enrollment => ({
        ...enrollment.courses,
        instructor_name: enrollment.courses.profiles?.full_name || enrollment.courses.profiles?.username,
        enrollment: {
          id: enrollment.id,
          user_id: enrollment.user_id,
          course_id: enrollment.course_id,
          status: enrollment.status,
          enrolled_at: enrollment.enrolled_at,
          completed_at: enrollment.completed_at,
          progress: enrollment.course_progress?.[0]?.progress || 0,
          time_spent: enrollment.course_progress?.[0]?.time_spent || 0,
        },
        progress: enrollment.course_progress?.[0] ? {
          lessons_completed: enrollment.course_progress[0].lessons_completed,
          total_lessons: enrollment.course_progress[0].total_lessons,
          progress_percentage: enrollment.course_progress[0].progress,
          time_spent: enrollment.course_progress[0].time_spent,
          last_accessed: enrollment.course_progress[0].updated_at,
          current_lesson_id: enrollment.course_progress[0].current_lesson_id,
        } : undefined,
      })) || []
    } catch (error) {
      console.error('Error fetching enrolled courses:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Enroll in a course
  const enrollInCourse = async (courseId: string): Promise<CourseEnrollment> => {
    if (!user) throw new Error('User not authenticated')

    try {
      // Check if already enrolled
      const { data: existing } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single()

      if (existing) {
        throw new Error('Already enrolled in this course')
      }

      // Create enrollment
      const { data, error } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          status: 'active',
          enrolled_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Error enrolling in course:', error)
      throw error
    }
  }

  // Check if user is enrolled in a course
  const isEnrolledInCourse = async (courseId: string): Promise<boolean> => {
    if (!user) return false

    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('status', 'active')
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return !!data
    } catch (error) {
      console.error('Error checking enrollment:', error)
      return false
    }
  }

  // Get course stats
  const getCourseStats = async (): Promise<CourseStats> => {
    try {
      const [
        { count: totalCourses },
        { count: totalStudents },
        { count: totalInstructors },
        { data: featuredCourses },
        { data: recentCourses }
      ] = await Promise.all([
        supabase.from('courses').select('*', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('course_enrollments').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'instructor'),
        supabase.from('courses').select('*').eq('is_featured', true).eq('is_published', true).limit(6),
        supabase.from('courses').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(6)
      ])

      return {
        total_courses: totalCourses || 0,
        total_students: totalStudents || 0,
        total_instructors: totalInstructors || 0,
        featured_courses: featuredCourses || [],
        popular_categories: [], // Would need a categories table
        recent_courses: recentCourses || [],
      }
    } catch (error) {
      console.error('Error fetching course stats:', error)
      throw error
    }
  }

  // Search courses
  const searchCourses = async (query: string, limit = 10): Promise<Course[]> => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles!courses_instructor_id_fkey(full_name, username)
        `)
        .eq('is_published', true)
        .or(`title.ilike.%${query}%, description.ilike.%${query}%, tags.cs.{${query}}`)
        .limit(limit)

      if (error) throw error

      return data?.map(course => ({
        ...course,
        instructor_name: course.profiles?.full_name || course.profiles?.username,
      })) || []
    } catch (error) {
      console.error('Error searching courses:', error)
      throw error
    }
  }

  // Get course recommendations
  const getRecommendedCourses = async (limit = 6): Promise<Course[]> => {
    try {
      // This is a simple recommendation - in production you'd want more sophisticated logic
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles!courses_instructor_id_fkey(full_name, username)
        `)
        .eq('is_published', true)
        .order('average_rating', { ascending: false })
        .order('total_students', { ascending: false })
        .limit(limit)

      if (error) throw error

      return data?.map(course => ({
        ...course,
        instructor_name: course.profiles?.full_name || course.profiles?.username,
      })) || []
    } catch (error) {
      console.error('Error fetching recommended courses:', error)
      throw error
    }
  }

  return {
    isLoading,
    getCourses,
    getCourse,
    getEnrolledCourses,
    enrollInCourse,
    isEnrolledInCourse,
    getCourseStats,
    searchCourses,
    getRecommendedCourses,
  }
}