'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Icons } from '@/components/ui/icons'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useCourses } from '@/hooks/useCourses'
import { cn } from '@/lib/utils'
import type { CourseWithProgress } from '@/lib/courses/types'

interface ContinueLearningProps {
  className?: string
}

export function ContinueLearning({ className }: ContinueLearningProps) {
  const { getEnrolledCourses, isLoading } = useCourses()
  const [inProgressCourses, setInProgressCourses] = useState<CourseWithProgress[]>([])

  useEffect(() => {
    loadInProgressCourses()
  }, [])

  const loadInProgressCourses = async () => {
    try {
      const courses = await getEnrolledCourses()
      const filtered = courses.filter(course => 
        course.progress && 
        course.progress.progress_percentage > 0 && 
        course.progress.progress_percentage < 100
      ).slice(0, 3) // Show top 3 in-progress courses
      setInProgressCourses(filtered)
    } catch (error) {
      console.error('Error loading in-progress courses:', error)
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.play className="h-5 w-5" />
            Continue Learning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  if (inProgressCourses.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.play className="h-5 w-5" />
            Continue Learning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Icons.bookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses in progress</h3>
            <p className="text-muted-foreground mb-6">
              Start learning by enrolling in a course or continue where you left off.
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/my-courses">My Courses</Link>
              </Button>
            </div>
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
            <Icons.play className="h-5 w-5" />
            Continue Learning
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/my-courses">
              View All
              <Icons.arrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {inProgressCourses.map((course) => (
          <ContinueLearningCard key={course.id} course={course} />
        ))}
      </CardContent>
    </Card>
  )
}

interface ContinueLearningCardProps {
  course: CourseWithProgress
}

function ContinueLearningCard({ course }: ContinueLearningCardProps) {
  const progress = course.progress?.progress_percentage || 0
  const timeSpent = course.progress?.time_spent || 0
  const lastAccessed = course.progress?.last_accessed_at

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const formatLastAccessed = (dateString?: string) => {
    if (!dateString) return 'Never'
    
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} days ago`
  }

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
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
              {course.instructor_name} • {formatLastAccessed(lastAccessed)}
            </p>
          </div>
          <Badge variant="outline" className="text-xs flex-shrink-0">
            {course.difficulty}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(timeSpent)} spent</span>
            <span>{course.lessons_count || 0} lessons</span>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <Button size="sm" asChild>
        <Link href={`/courses/${course.id}/learn`}>
          Continue
          <Icons.play className="h-4 w-4 ml-1" />
        </Link>
      </Button>
    </div>
  )
}