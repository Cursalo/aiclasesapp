'use client'

import React, { useState } from 'react'
import { BaseLesson } from './base-lesson'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'
import type { LessonComponentProps, AssignmentLessonContent } from '@/lib/lessons/types'

interface AssignmentLessonProps extends LessonComponentProps {
  onProgress?: (progress: number, data?: any) => void
  onComplete?: (data?: any) => void
}

interface Submission {
  deliverableId: string
  content: string
  type: 'file' | 'text' | 'url'
  fileName?: string
}

export function AssignmentLesson({ lesson, progress, onProgress, onComplete, readonly, preview }: AssignmentLessonProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [submitted, setSubmitted] = useState(false)

  const content = lesson.content as AssignmentLessonContent

  const handleSubmission = (deliverableId: string, submissionContent: string, type: 'file' | 'text' | 'url', fileName?: string) => {
    setSubmissions(prev => {
      const existing = prev.find(s => s.deliverableId === deliverableId)
      if (existing) {
        return prev.map(s => 
          s.deliverableId === deliverableId 
            ? { ...s, content: submissionContent, fileName } 
            : s
        )
      }
      return [...prev, { deliverableId, content: submissionContent, type, fileName }]
    })
  }

  const getSubmission = (deliverableId: string) => {
    return submissions.find(s => s.deliverableId === deliverableId)
  }

  const isRequiredDeliverableComplete = (deliverable: any) => {
    if (!deliverable.required) return true
    const submission = getSubmission(deliverable.title)
    return submission && submission.content.trim() !== ''
  }

  const allRequiredDeliverablesComplete = () => {
    return content.deliverables.every(d => isRequiredDeliverableComplete(d))
  }

  const handleFileUpload = (deliverableId: string, file: File) => {
    // In a real implementation, you would upload the file to your storage service
    // For now, we'll just store the file name
    handleSubmission(deliverableId, `file:${file.name}`, 'file', file.name)
  }

  const submitAssignment = () => {
    if (!allRequiredDeliverablesComplete()) return

    setSubmitted(true)

    // Calculate progress based on completed deliverables
    const completedDeliverables = content.deliverables.filter(d => 
      getSubmission(d.title)?.content.trim() !== ''
    )
    const progressPercent = (completedDeliverables.length / content.deliverables.length) * 100

    if (onProgress) {
      onProgress(progressPercent, {
        submissions,
        submittedAt: new Date().toISOString(),
      })
    }

    if (onComplete && !readonly && !preview) {
      onComplete({
        submissions,
        submittedAt: new Date().toISOString(),
        completed: true,
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isDueSoon = () => {
    if (!content.dueDate) return false
    const dueDate = new Date(content.dueDate)
    const now = new Date()
    const timeDiff = dueDate.getTime() - now.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
    return daysDiff <= 3 && daysDiff >= 0
  }

  const isOverdue = () => {
    if (!content.dueDate) return false
    return new Date(content.dueDate) < new Date()
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
        {/* Assignment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.briefcase className="h-5 w-5" />
              Assignment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <p>{content.instructions}</p>
            </div>

            {/* Due Date */}
            {content.dueDate && (
              <div className="flex items-center gap-2">
                <Icons.calendar className="h-4 w-4" />
                <span className="text-sm">Due: {formatDate(content.dueDate)}</span>
                {isDueSoon() && (
                  <Badge variant="destructive">Due Soon</Badge>
                )}
                {isOverdue() && (
                  <Badge variant="destructive">Overdue</Badge>
                )}
              </div>
            )}

            {/* Late Submission Policy */}
            {content.allowLateSubmission !== undefined && (
              <Alert>
                <Icons.clock className="h-4 w-4" />
                <AlertDescription>
                  Late submissions are {content.allowLateSubmission ? 'allowed' : 'not allowed'}.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Deliverables */}
        <Card>
          <CardHeader>
            <CardTitle>Deliverables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {content.deliverables.map((deliverable, index) => (
              <div key={index} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium flex items-center gap-2">
                      {deliverable.title}
                      {deliverable.required && (
                        <Badge variant="outline" className="text-xs">Required</Badge>
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {deliverable.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Type: {deliverable.type}
                    </p>
                  </div>
                  {getSubmission(deliverable.title) && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      ✓ Submitted
                    </Badge>
                  )}
                </div>

                {!submitted && !readonly && (
                  <div className="space-y-2">
                    {deliverable.type === 'text' && (
                      <div className="space-y-2">
                        <Label htmlFor={`deliverable-${index}`}>Your Response</Label>
                        <Textarea
                          id={`deliverable-${index}`}
                          value={getSubmission(deliverable.title)?.content || ''}
                          onChange={(e) => handleSubmission(deliverable.title, e.target.value, 'text')}
                          placeholder="Enter your response here..."
                          className="min-h-[100px]"
                        />
                      </div>
                    )}

                    {deliverable.type === 'url' && (
                      <div className="space-y-2">
                        <Label htmlFor={`deliverable-${index}`}>URL</Label>
                        <Input
                          id={`deliverable-${index}`}
                          type="url"
                          value={getSubmission(deliverable.title)?.content || ''}
                          onChange={(e) => handleSubmission(deliverable.title, e.target.value, 'url')}
                          placeholder="https://example.com"
                        />
                      </div>
                    )}

                    {deliverable.type === 'file' && (
                      <div className="space-y-2">
                        <Label htmlFor={`deliverable-${index}`}>Upload File</Label>
                        <Input
                          id={`deliverable-${index}`}
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleFileUpload(deliverable.title, file)
                            }
                          }}
                          className="cursor-pointer"
                        />
                        {getSubmission(deliverable.title)?.fileName && (
                          <p className="text-sm text-muted-foreground">
                            Selected: {getSubmission(deliverable.title)?.fileName}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {submitted && getSubmission(deliverable.title) && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Your Submission:</p>
                    <p className="text-sm text-muted-foreground">
                      {deliverable.type === 'file' 
                        ? `File: ${getSubmission(deliverable.title)?.fileName}`
                        : getSubmission(deliverable.title)?.content
                      }
                    </p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Rubric */}
        {content.rubric && content.rubric.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Grading Rubric</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {content.rubric.map((criterion, index) => (
                  <div key={index} className="flex justify-between items-start p-3 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">{criterion.criteria}</h4>
                      <p className="text-sm text-muted-foreground">
                        {criterion.description}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {criterion.points} pts
                    </Badge>
                  </div>
                ))}
                <div className="text-right">
                  <p className="text-sm font-medium">
                    Total: {content.rubric.reduce((sum, r) => sum + r.points, 0)} points
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submission */}
        {!submitted && !readonly && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {content.deliverables.filter(d => getSubmission(d.title)?.content.trim() !== '').length} of {content.deliverables.length} deliverables completed
                  </p>
                  {!allRequiredDeliverablesComplete() && (
                    <p className="text-xs text-red-600">
                      Please complete all required deliverables before submitting.
                    </p>
                  )}
                </div>
                <Button
                  onClick={submitAssignment}
                  disabled={!allRequiredDeliverablesComplete() || (isOverdue() && !content.allowLateSubmission)}
                >
                  <Icons.check className="h-4 w-4 mr-2" />
                  Submit Assignment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submitted Confirmation */}
        {submitted && (
          <Alert>
            <Icons.checkCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Assignment submitted successfully!</strong> You will receive feedback once your instructor has reviewed your work.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </BaseLesson>
  )
}