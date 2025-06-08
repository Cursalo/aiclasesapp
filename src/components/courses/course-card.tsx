'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import type { Course, CourseWithProgress } from '@/lib/courses/types'

interface CourseCardProps {
  course: Course | CourseWithProgress
  variant?: 'default' | 'enrolled' | 'featured'
  showProgress?: boolean
  className?: string
}

export function CourseCard({ 
  course, 
  variant = 'default', 
  showProgress = false,
  className 
}: CourseCardProps) {
  const isEnrolled = 'enrollment' in course && course.enrollment
  const progress = 'progress' in course ? course.progress : undefined

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  const formatPrice = (price: number, currency = 'USD') => {
    if (price === 0) return 'Free'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icons.star
        key={i}
        className={cn(
          'h-4 w-4',
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-muted-foreground'
        )}
      />
    ))
  }

  return (
    <Card className={cn(
      'group overflow-hidden transition-all duration-200 hover:shadow-lg',
      variant === 'featured' && 'ring-2 ring-primary/20',
      className
    )}>
      {/* Course Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {course.thumbnail_url ? (
          <Image
            src={course.thumbnail_url}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <Icons.graduationCap className="h-12 w-12 text-primary/40" />
          </div>
        )}

        {/* Overlay Badges */}
        <div className="absolute top-2 left-2 space-y-1">
          {variant === 'featured' && (
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              <Icons.star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          {course.is_featured && variant !== 'featured' && (
            <Badge variant="secondary">Featured</Badge>
          )}
        </div>

        <div className="absolute top-2 right-2">
          <Badge className={getDifficultyColor(course.difficulty)}>
            {course.difficulty}
          </Badge>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2">
          <Badge variant="secondary" className="bg-black/50 text-white">
            {formatDuration(course.estimated_duration)}
          </Badge>
        </div>

        {/* Play Button Overlay */}
        {course.preview_video_url && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-black/50 rounded-full p-3">
              <Icons.play className="h-6 w-6 text-white" />
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Course Title */}
        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        {/* Course Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>

        {/* Instructor */}
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {course.instructor_name?.charAt(0).toUpperCase() || 'I'}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {course.instructor_name || 'Instructor'}
          </span>
        </div>

        {/* Course Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            {/* Rating */}
            {course.average_rating > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex">
                  {renderStars(course.average_rating)}
                </div>
                <span className="text-muted-foreground">
                  {course.average_rating.toFixed(1)}
                </span>
                <span className="text-muted-foreground">
                  ({course.total_ratings})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar (for enrolled courses) */}
        {showProgress && progress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progress.progress_percentage)}%</span>
            </div>
            <Progress value={progress.progress_percentage} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{progress.lessons_completed} of {progress.total_lessons} lessons</span>
              <span>{formatDuration(Math.floor(progress.time_spent / 60))} spent</span>
            </div>
          </div>
        )}

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {course.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {course.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{course.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 space-y-3">
        {/* Price and Student Count */}
        <div className="flex items-center justify-between w-full">
          <div className="space-y-1">
            <div className="font-semibold text-lg">
              {formatPrice(course.price, course.currency)}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Icons.users className="h-4 w-4" />
              <span>{course.total_students} students</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex gap-2">
            {isEnrolled ? (
              <Button asChild>
                <Link href={`/courses/${course.id}/lessons`}>
                  <Icons.play className="h-4 w-4 mr-2" />
                  Continue
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline">
                <Link href={`/courses/${course.id}`}>
                  View Course
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}