'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { CourseCard } from '@/components/courses'
import { useCourses } from '@/hooks/useCourses'
import type { Course } from '@/lib/courses/types'

interface RecommendedCoursesProps {
  className?: string
}

export function RecommendedCourses({ className }: RecommendedCoursesProps) {
  const { getCourses, isLoading } = useCourses()
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])

  useEffect(() => {
    loadRecommendedCourses()
  }, [])

  const loadRecommendedCourses = async () => {
    try {
      // For now, we'll get courses and filter them
      // In a real app, this would use ML recommendations
      const courses = await getCourses({
        limit: 6,
        category: undefined,
        difficulty: undefined,
        search: ''
      })
      
      // Simple recommendation logic: popular courses in different categories
      const recommended = courses
        .filter(course => course.rating && course.rating >= 4.0)
        .slice(0, 3)
      
      setRecommendedCourses(recommended)
    } catch (error) {
      console.error('Error loading recommended courses:', error)
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.star className="h-5 w-5 text-yellow-500" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  if (recommendedCourses.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.star className="h-5 w-5 text-yellow-500" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Icons.lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Building recommendations</h3>
            <p className="text-muted-foreground mb-6">
              Complete a few lessons to get personalized course recommendations.
            </p>
            <Button asChild>
              <Link href="/courses">Browse All Courses</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icons.star className="h-5 w-5 text-yellow-500" />
            Recommended for You
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/courses">
              View All
              <Icons.arrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendedCourses.map((course) => (
            <RecommendedCourseCard key={course.id} course={course} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface RecommendedCourseCardProps {
  course: Course
}

function RecommendedCourseCard({ course }: RecommendedCourseCardProps) {
  const getRecommendationReason = () => {
    // Simple recommendation reasons - in a real app, this would be more sophisticated
    const reasons = [
      'Popular in your skill level',
      'Based on your interests',
      'Trending this week',
      'Highly rated',
      'Complete your learning path'
    ]
    return reasons[Math.floor(Math.random() * reasons.length)]
  }

  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      {/* Course Image */}
      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center flex-shrink-0">
        <Icons.graduationCap className="h-8 w-8 text-primary" />
      </div>

      {/* Course Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="font-medium truncate">{course.title}</h3>
            <p className="text-sm text-muted-foreground">
              {course.instructor_name}
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground flex-shrink-0">
            <Icons.star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{course.rating?.toFixed(1) || 'N/A'}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {course.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {course.difficulty}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {course.lessons_count} lessons
            </span>
          </div>
          <div className="text-xs text-blue-600 font-medium">
            {getRecommendationReason()}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Button size="sm" asChild>
        <Link href={`/courses/${course.id}`}>
          View Course
        </Link>
      </Button>
    </div>
  )
}