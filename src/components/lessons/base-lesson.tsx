'use client'

import React, { useEffect, useState } from 'react'
import { LessonLayout } from './lesson-layout'
import type { LessonComponentProps } from '@/lib/lessons/types'

interface BaseLessonProps extends LessonComponentProps {
  children: React.ReactNode
  autoMarkComplete?: boolean
  completionDelay?: number
}

export function BaseLesson({
  lesson,
  progress,
  onProgress,
  onComplete,
  children,
  readonly = false,
  preview = false,
  autoMarkComplete = false,
  completionDelay = 0,
}: BaseLessonProps) {
  const [timeSpent, setTimeSpent] = useState(0)
  const [startTime] = useState(Date.now())
  
  // Track time spent on lesson
  useEffect(() => {
    if (readonly || preview) return

    const interval = setInterval(() => {
      const currentTime = Date.now()
      const elapsed = Math.floor((currentTime - startTime) / 1000)
      setTimeSpent(elapsed)
    }, 1000)

    return () => clearInterval(interval)
  }, [readonly, preview, startTime])

  // Auto-complete after delay if specified
  useEffect(() => {
    if (autoMarkComplete && completionDelay > 0 && !readonly && !preview) {
      const timer = setTimeout(() => {
        handleComplete()
      }, completionDelay * 1000)

      return () => clearTimeout(timer)
    }
  }, [autoMarkComplete, completionDelay, readonly, preview])

  const handleProgress = (progressValue: number, data?: any) => {
    if (readonly || preview) return
    
    onProgress(progressValue, {
      timeSpent,
      ...data,
    })
  }

  const handleComplete = (data?: any) => {
    if (readonly || preview) return
    
    handleProgress(100, data)
    onComplete({
      timeSpent,
      completedAt: new Date().toISOString(),
      ...data,
    })
  }

  return (
    <LessonLayout
      lesson={lesson}
      progress={progress}
      readonly={readonly}
      onComplete={() => handleComplete()}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            onProgress: handleProgress,
            onComplete: handleComplete,
            readonly,
            preview,
          } as any)
        }
        return child
      })}
    </LessonLayout>
  )
}