'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { useCourses } from '@/hooks/useCourses'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import type { Course } from '@/lib/courses/types'

interface CourseDetailProps {
  courseId: string
  className?: string
}

export function CourseDetail({ courseId, className }: CourseDetailProps) {
  const { user } = useAuth()
  const { getCourse, enrollInCourse, isEnrolledInCourse } = useCourses()
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCourse()
    if (user) {
      checkEnrollment()
    }
  }, [courseId, user])

  const loadCourse = async () => {
    try {
      setIsLoading(true)
      const courseData = await getCourse(courseId)
      setCourse(courseData)
    } catch (error) {
      console.error('Error loading course:', error)
      setError('Failed to load course')
    } finally {
      setIsLoading(false)
    }
  }

  const checkEnrollment = async () => {
    try {
      const enrolled = await isEnrolledInCourse(courseId)
      setIsEnrolled(enrolled)
    } catch (error) {
      console.error('Error checking enrollment:', error)
    }
  }

  const handleEnroll = async () => {
    if (!user) {
      // Redirect to login
      window.location.href = `/login?redirectTo=/courses/${courseId}`
      return
    }

    try {
      setIsEnrolling(true)
      await enrollInCourse(courseId)
      setIsEnrolled(true)
    } catch (error: any) {
      console.error('Error enrolling:', error)
      setError(error.message || 'Failed to enroll in course')
    } finally {
      setIsEnrolling(false)
    }
  }

  const formatPrice = (price: number, currency = 'USD') => {
    if (price === 0) return 'Free'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price)
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    
    if (remainingMinutes === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`
    }
    return `${hours}h ${remainingMinutes}m`
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

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className={className}>
        <Alert variant="destructive">
          <Icons.warning className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!course) {
    return (
      <div className={className}>
        <Alert>
          <Icons.warning className="h-4 w-4" />
          <AlertDescription>Course not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-12">
        <div className="container max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Course Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(course.difficulty)}>
                    {course.difficulty}
                  </Badge>
                  <Badge variant="outline">{course.category}</Badge>
                </div>
                
                <h1 className="text-4xl font-bold">{course.title}</h1>
                
                <p className="text-lg text-muted-foreground">
                  {course.description}
                </p>

                <div className="flex items-center gap-6">
                  {/* Rating */}
                  {course.average_rating > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {renderStars(course.average_rating)}
                      </div>
                      <span className="font-medium">{course.average_rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">
                        ({course.total_ratings} review{course.total_ratings !== 1 ? 's' : ''})
                      </span>
                    </div>
                  )}

                  {/* Students */}
                  <div className="flex items-center gap-1">
                    <Icons.users className="h-4 w-4" />
                    <span>{course.total_students} student{course.total_students !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {course.instructor_name?.charAt(0).toUpperCase() || 'I'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Created by {course.instructor_name || 'Instructor'}</p>
                    <p className="text-sm text-muted-foreground">Course Instructor</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Preview */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-0">
                  {/* Video Preview */}
                  <div className="relative aspect-video">
                    {course.thumbnail_url ? (
                      <Image
                        src={course.thumbnail_url}
                        alt={course.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center rounded-t-lg">
                        <Icons.graduationCap className="h-16 w-16 text-primary/40" />
                      </div>
                    )}
                    
                    {course.preview_video_url && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/50 rounded-full p-4">
                          <Icons.play className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Price */}
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        {formatPrice(course.price, course.currency)}
                      </div>
                      {course.price > 0 && (
                        <p className="text-sm text-muted-foreground">
                          One-time payment • Lifetime access
                        </p>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="space-y-2">
                      {isEnrolled ? (
                        <Button asChild className="w-full" size="lg">
                          <Link href={`/courses/${course.id}/lessons`}>
                            <Icons.play className="h-4 w-4 mr-2" />
                            Continue Learning
                          </Link>
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleEnroll}
                          disabled={isEnrolling}
                          className="w-full"
                          size="lg"
                        >
                          {isEnrolling ? (
                            <>
                              <Icons.spinner className="h-4 w-4 mr-2 animate-spin" />
                              Enrolling...
                            </>
                          ) : (
                            <>
                              {course.price === 0 ? 'Enroll for Free' : 'Buy Now'}
                            </>
                          )}
                        </Button>
                      )}
                      
                      {!isEnrolled && (
                        <Button variant="outline" className="w-full">
                          <Icons.heart className="h-4 w-4 mr-2" />
                          Add to Wishlist
                        </Button>
                      )}
                    </div>

                    {/* Course Stats */}
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span>{formatDuration(course.estimated_duration)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Lessons:</span>
                        <span>{course.total_lessons}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Level:</span>
                        <span className="capitalize">{course.difficulty}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Language:</span>
                        <span>English</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <Icons.check className="h-4 w-4 text-green-600" />
                        <span>Lifetime access</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Icons.check className="h-4 w-4 text-green-600" />
                        <span>Mobile and TV access</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Icons.check className="h-4 w-4 text-green-600" />
                        <span>Certificate of completion</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container max-w-6xl py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What you'll learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2 md:grid-cols-2">
                      {[
                        'Master the fundamentals',
                        'Build real-world projects',
                        'Best practices and patterns',
                        'Advanced techniques',
                        'Industry-standard tools',
                        'Professional workflows',
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Icons.check className="h-4 w-4 text-green-600" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Course Description</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none">
                    <p>{course.description}</p>
                    <p>
                      This comprehensive course will take you from beginner to advanced level,
                      covering all the essential concepts and practical skills you need to succeed.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>• Basic computer skills</li>
                      <li>• Internet connection</li>
                      <li>• Willingness to learn</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Curriculum</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {course.total_lessons} lessons • {formatDuration(course.estimated_duration)}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Array.from({ length: course.total_lessons }, (_, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Icons.play className="h-4 w-4 text-muted-foreground" />
                            <span>Lesson {i + 1}: Introduction to Topic {i + 1}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">10 min</span>
                            {i === 0 && (
                              <Badge variant="outline" className="text-xs">Preview</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instructor">
                <Card>
                  <CardHeader>
                    <CardTitle>About the Instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-lg">
                          {course.instructor_name?.charAt(0).toUpperCase() || 'I'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{course.instructor_name}</h3>
                        <p className="text-muted-foreground">
                          Expert instructor with years of industry experience.
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Icons.star className="h-4 w-4 text-yellow-400" />
                            <span>4.9 instructor rating</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icons.users className="h-4 w-4" />
                            <span>10,000+ students</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Reviews</CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{course.average_rating.toFixed(1)}</span>
                        <div className="flex">
                          {renderStars(course.average_rating)}
                        </div>
                      </div>
                      <span className="text-muted-foreground">
                        {course.total_ratings} review{course.total_ratings !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-sm w-4">{star}</span>
                          <Icons.star className="h-4 w-4 text-yellow-400" />
                          <Progress value={star === 5 ? 80 : star === 4 ? 15 : 5} className="flex-1" />
                          <span className="text-sm text-muted-foreground w-8">
                            {star === 5 ? '80%' : star === 4 ? '15%' : '5%'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Courses */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Related Courses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="aspect-video bg-muted rounded-lg"></div>
                    <h4 className="font-medium">Related Course {i + 1}</h4>
                    <p className="text-sm text-muted-foreground">Brief description</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">$29</span>
                      <div className="flex">
                        {renderStars(4.5)}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}