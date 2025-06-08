'use client'

import React, { useState } from 'react'
import { BaseLesson } from './base-lesson'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'
import type { LessonComponentProps, InteractiveLessonContent } from '@/lib/lessons/types'

interface InteractiveLessonProps extends LessonComponentProps {
  onProgress?: (progress: number, data?: any) => void
  onComplete?: (data?: any) => void
}

export function InteractiveLesson({ lesson, progress, onProgress, onComplete, readonly, preview }: InteractiveLessonProps) {
  const [interactionCount, setInteractionCount] = useState(0)
  const [completed, setCompleted] = useState(false)

  const content = lesson.content as InteractiveLessonContent

  const handleInteraction = () => {
    const newCount = interactionCount + 1
    setInteractionCount(newCount)

    // Update progress based on interactions
    const progressPercent = Math.min(100, (newCount / 10) * 100) // Complete after 10 interactions
    
    if (onProgress) {
      onProgress(progressPercent, {
        interactionCount: newCount,
        componentType: content.componentType,
      })
    }

    // Auto-complete after enough interactions
    if (newCount >= 10 && !completed && onComplete && !readonly && !preview) {
      setCompleted(true)
      onComplete({
        interactionCount: newCount,
        componentType: content.componentType,
        completed: true,
      })
    }
  }

  const renderInteractiveComponent = () => {
    // This is a placeholder - in a real implementation, you would have
    // a registry of interactive components based on componentType
    switch (content.componentType) {
      case 'demo':
        return (
          <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
            <h3 className="text-lg font-semibold">Interactive Demo</h3>
            <p className="text-muted-foreground">
              This is a placeholder for an interactive component. Click the button to interact!
            </p>
            <Button onClick={handleInteraction} disabled={readonly}>
              <Icons.zap className="h-4 w-4 mr-2" />
              Interact ({interactionCount})
            </Button>
            <div className="text-sm text-muted-foreground">
              Progress: {Math.min(100, (interactionCount / 10) * 100).toFixed(0)}%
            </div>
          </div>
        )
      
      case 'simulation':
        return (
          <div className="space-y-4 p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg">
            <h3 className="text-lg font-semibold">Simulation Component</h3>
            <p className="text-muted-foreground">
              This would be a simulation or interactive exercise.
            </p>
            <Button onClick={handleInteraction} disabled={readonly}>
              Run Simulation
            </Button>
          </div>
        )
      
      default:
        return (
          <div className="space-y-4 p-6 bg-muted rounded-lg">
            <h3 className="text-lg font-semibold">Custom Interactive Component</h3>
            <p className="text-muted-foreground">
              Component type: {content.componentType}
            </p>
            <Alert>
              <Icons.warning className="h-4 w-4" />
              <AlertDescription>
                This interactive component type is not yet implemented.
              </AlertDescription>
            </Alert>
          </div>
        )
    }
  }

  return (
    <BaseLesson
      lesson={lesson}
      progress={progress}
      onProgress={onProgress}
      onComplete={onComplete}
      readonly={readonly}
      preview={preview}
    >
      <div className="space-y-6">
        {/* Instructions */}
        {content.instructions && (
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{content.instructions}</p>
            </CardContent>
          </Card>
        )}

        {/* Interactive Component */}
        <Card>
          <CardContent className="p-6">
            {renderInteractiveComponent()}
          </CardContent>
        </Card>

        {/* Completion Criteria */}
        {content.completionCriteria && (
          <Card>
            <CardHeader>
              <CardTitle>Completion Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Type: {content.completionCriteria.type}
              </p>
              {content.completionCriteria.type === 'interaction' && (
                <p className="text-sm">
                  Required interactions: {content.completionCriteria.value}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </BaseLesson>
  )
}