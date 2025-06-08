'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import type { LessonComponent, LessonProgress, LessonMetadata } from '@/lib/lessons/types'

interface LessonLayoutProps {
  lesson: LessonComponent
  progress: LessonProgress
  children: React.ReactNode
  showHeader?: boolean
  showProgress?: boolean
  showMetadata?: boolean
  onComplete?: () => void
  onNext?: () => void
  onPrevious?: () => void
  hasNext?: boolean
  hasPrevious?: boolean
  readonly?: boolean
  className?: string
}

export function LessonLayout({
  lesson,
  progress,
  children,
  showHeader = true,
  showProgress = true,
  showMetadata = true,
  onComplete,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
  readonly = false,
  className,
}: LessonLayoutProps) {
  const metadata = lesson.metadata

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
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

  return (
    <div className={cn('w-full max-w-4xl mx-auto space-y-6', className)}>
      {/* Lesson Header */}
      {showHeader && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <CardTitle className="text-2xl">{lesson.title}</CardTitle>
                {lesson.description && (
                  <CardDescription className="text-base">
                    {lesson.description}
                  </CardDescription>
                )}
              </div>
              
              {/* Lesson Type Badge */}
              <Badge variant="secondary" className="ml-4 capitalize">
                {lesson.type}
              </Badge>
            </div>

            {/* Progress Bar */}
            {showProgress && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{Math.round(progress.progress)}%</span>
                </div>
                <Progress value={progress.progress} className="w-full" />
              </div>
            )}

            {/* Metadata */}
            {showMetadata && metadata && (
              <div className="flex flex-wrap gap-2 pt-2">
                {metadata.estimatedTime && (
                  <Badge variant="outline" className="text-xs">
                    <Icons.clock className="w-3 h-3 mr-1" />
                    {formatTime(metadata.estimatedTime)}
                  </Badge>
                )}
                
                {metadata.difficulty && (
                  <Badge 
                    variant="outline" 
                    className={cn('text-xs', getDifficultyColor(metadata.difficulty))}
                  >
                    <Icons.target className="w-3 h-3 mr-1" />
                    {metadata.difficulty}
                  </Badge>
                )}
                
                {metadata.tags?.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Learning Objectives */}
            {metadata?.learningObjectives && metadata.learningObjectives.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-sm font-medium">Learning Objectives:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {metadata.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Icons.check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardHeader>
        </Card>
      )}

      {/* Lesson Content */}
      <Card>
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>

      {/* Navigation */}
      {!readonly && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {hasPrevious && onPrevious && (
                  <Button variant="outline" onClick={onPrevious}>
                    <Icons.chevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                {progress.status !== 'completed' && onComplete && (
                  <Button onClick={onComplete}>
                    <Icons.check className="w-4 h-4 mr-1" />
                    Mark Complete
                  </Button>
                )}
                
                {hasNext && onNext && (
                  <Button onClick={onNext}>
                    Next
                    <Icons.chevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}