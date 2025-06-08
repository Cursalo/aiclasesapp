'use client'

import React, { useState, useEffect } from 'react'
import { BaseLesson } from './base-lesson'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Icons } from '@/components/ui/icons'
import type { LessonComponentProps, TextLessonContent } from '@/lib/lessons/types'

interface TextLessonProps extends LessonComponentProps {
  onProgress?: (progress: number, data?: any) => void
  onComplete?: (data?: any) => void
}

export function TextLesson({ lesson, progress, onProgress, onComplete, readonly, preview }: TextLessonProps) {
  const [readingProgress, setReadingProgress] = useState(0)
  const [estimatedReadTime, setEstimatedReadTime] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

  const content = lesson.content as TextLessonContent

  // Calculate estimated reading time (average 200 words per minute)
  useEffect(() => {
    const wordCount = content.markdown.split(/\s+/).length
    const readTime = Math.ceil(wordCount / 200)
    setEstimatedReadTime(readTime)
  }, [content.markdown])

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('text-lesson-content')
      if (!element) return

      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementHeight = rect.height
      const scrollTop = Math.max(0, -rect.top)
      const visibleHeight = Math.min(windowHeight, rect.bottom) - Math.max(0, rect.top)
      
      // Calculate reading progress based on scroll position
      const progress = Math.min(100, (scrollTop / (elementHeight - windowHeight + 100)) * 100)
      setScrollProgress(Math.max(0, progress))
      setReadingProgress(Math.max(0, progress))

      // Update lesson progress
      if (onProgress && progress > 0) {
        onProgress(progress, {
          scrollProgress: progress,
          estimatedReadTime,
        })
      }

      // Auto-complete when user scrolls through 85% of content
      if (progress >= 85 && onComplete && !readonly && !preview) {
        onComplete({
          readingProgress: progress,
          estimatedReadTime,
          completed: true,
        })
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [onProgress, onComplete, readonly, preview, estimatedReadTime])

  const downloadResource = (resource: any) => {
    // Create download link
    const link = document.createElement('a')
    link.href = resource.url
    link.download = resource.title
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <Icons.fileText className="h-4 w-4" />
      case 'doc':
        return <Icons.fileText className="h-4 w-4" />
      case 'zip':
        return <Icons.download className="h-4 w-4" />
      default:
        return <Icons.download className="h-4 w-4" />
    }
  }

  const renderMarkdown = (markdown: string) => {
    // Simple markdown parser for basic formatting
    // In a real implementation, you'd use a library like react-markdown
    return markdown
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-medium mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>')
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
        {/* Reading Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Reading Progress</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(readingProgress)}% complete
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${readingProgress}%` }}
              />
            </div>
            {estimatedReadTime > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Estimated reading time: {estimatedReadTime} minute{estimatedReadTime !== 1 ? 's' : ''}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card>
          <CardContent className="p-6">
            <div 
              id="text-lesson-content"
              className="prose prose-gray dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: `<p class="mb-4">${renderMarkdown(content.markdown)}</p>` 
              }}
            />
          </CardContent>
        </Card>

        {/* Images */}
        {content.images && content.images.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Images & Diagrams</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.images.map((image, index) => (
                <div key={index} className="space-y-2">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full rounded-lg border"
                  />
                  {image.caption && (
                    <p className="text-sm text-muted-foreground text-center">
                      {image.caption}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Downloadable Resources */}
        {content.downloadableResources && content.downloadableResources.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Downloadable Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {content.downloadableResources.map((resource, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getFileIcon(resource.type)}
                    <div>
                      <p className="font-medium">{resource.title}</p>
                      <Badge variant="outline" className="text-xs">
                        {resource.type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadResource(resource)}
                  >
                    <Icons.download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Reading Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Keep reading to complete this lesson
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <Icons.arrowUp className="h-4 w-4 mr-1" />
                  Back to Top
                </Button>
                {scrollProgress >= 85 && (
                  <Button
                    size="sm"
                    onClick={() => onComplete?.({ 
                      readingProgress: scrollProgress,
                      completed: true 
                    })}
                  >
                    <Icons.check className="h-4 w-4 mr-1" />
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </BaseLesson>
  )
}