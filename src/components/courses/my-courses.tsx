'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Icons } from '@/components/ui/icons'
import { CourseCard } from './course-card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useCourses } from '@/hooks/useCourses'
import type { CourseWithProgress } from '@/lib/courses/types'

interface MyCoursesProps {
  className?: string
}

export function MyCourses({ className }: MyCoursesProps) {
  const { getEnrolledCourses, isLoading } = useCourses()
  const [courses, setCourses] = useState<CourseWithProgress[]>([])
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      const enrolledCourses = await getEnrolledCourses()
      setCourses(enrolledCourses)
    } catch (error) {
      console.error('Error loading courses:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const getFilteredCourses = () => {
    switch (activeTab) {
      case 'in-progress':
        return courses.filter(course => 
          course.progress && course.progress.progress_percentage > 0 && course.progress.progress_percentage < 100
        )
      case 'completed':
        return courses.filter(course => 
          course.progress && course.progress.progress_percentage >= 100
        )
      case 'not-started':
        return courses.filter(course => 
          !course.progress || course.progress.progress_percentage === 0
        )
      default:
        return courses
    }
  }

  const filteredCourses = getFilteredCourses()

  const stats = {
    total: courses.length,
    inProgress: courses.filter(c => c.progress && c.progress.progress_percentage > 0 && c.progress.progress_percentage < 100).length,
    completed: courses.filter(c => c.progress && c.progress.progress_percentage >= 100).length,
    notStarted: courses.filter(c => !c.progress || c.progress.progress_percentage === 0).length,
    totalTimeSpent: courses.reduce((sum, c) => sum + (c.progress?.time_spent || 0), 0),
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className={className}>
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Icons.graduationCap className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Icons.play className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Icons.checkCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Icons.clock className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{formatTime(stats.totalTimeSpent)}</p>
                <p className="text-sm text-muted-foreground">Time Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All Courses ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({stats.inProgress})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({stats.completed})
          </TabsTrigger>
          <TabsTrigger value="not-started">
            Not Started ({stats.notStarted})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredCourses.length > 0 ? (
            <div className="space-y-6">
              {/* Continue Learning Section */}
              {activeTab === 'all' && stats.inProgress > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Continue Learning</h3>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {courses
                      .filter(course => course.progress && course.progress.progress_percentage > 0 && course.progress.progress_percentage < 100)
                      .slice(0, 3)
                      .map((course) => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          variant="enrolled"
                          showProgress={true}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* All Courses Grid */}
              <div className="space-y-4">
                {activeTab === 'all' && stats.inProgress > 0 && (
                  <h3 className="text-lg font-semibold">All My Courses</h3>
                )}
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      variant="enrolled"
                      showProgress={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <EmptyState tab={activeTab} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmptyState({ tab }: { tab: string }) {
  const getEmptyStateContent = () => {
    switch (tab) {
      case 'in-progress':
        return {
          icon: Icons.play,
          title: 'No courses in progress',
          description: 'Start learning by continuing a course from your library.',
          action: 'Browse All Courses',
        }
      case 'completed':
        return {
          icon: Icons.checkCircle,
          title: 'No completed courses',
          description: 'Complete your first course to see it here.',
          action: 'Continue Learning',
        }
      case 'not-started':
        return {
          icon: Icons.circle,
          title: 'All courses started',
          description: 'Great job! You\'ve started all your enrolled courses.',
          action: 'Find More Courses',
        }
      default:
        return {
          icon: Icons.graduationCap,
          title: 'No courses enrolled',
          description: 'Start your learning journey by enrolling in your first course.',
          action: 'Browse Courses',
        }
    }
  }

  const content = getEmptyStateContent()
  const IconComponent = content.icon

  return (
    <div className="text-center py-12">
      <IconComponent className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">{content.title}</h3>
      <p className="text-muted-foreground mb-6">{content.description}</p>
      <Button asChild>
        <Link href="/courses">{content.action}</Link>
      </Button>
    </div>
  )
}