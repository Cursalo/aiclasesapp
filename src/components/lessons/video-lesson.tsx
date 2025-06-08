'use client'

import React, { useRef, useState, useEffect } from 'react'
import { BaseLesson } from './base-lesson'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import type { LessonComponentProps, VideoLessonContent } from '@/lib/lessons/types'

interface VideoLessonProps extends LessonComponentProps {
  onProgress?: (progress: number, data?: any) => void
  onComplete?: (data?: any) => void
}

export function VideoLesson({ lesson, progress, onProgress, onComplete, readonly, preview }: VideoLessonProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  const [watchProgress, setWatchProgress] = useState(0)

  const content = lesson.content as VideoLessonContent

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)
    const updateProgress = () => {
      const progressPercent = (video.currentTime / video.duration) * 100
      setWatchProgress(progressPercent)
      
      // Auto-progress lesson based on video watch progress
      if (onProgress && progressPercent > 0) {
        onProgress(progressPercent, {
          videoProgress: progressPercent,
          currentTime: video.currentTime,
          duration: video.duration,
        })
      }

      // Auto-complete when video reaches 90%
      if (progressPercent >= 90 && onComplete && !readonly && !preview) {
        onComplete({
          videoProgress: progressPercent,
          currentTime: video.currentTime,
          duration: video.duration,
          completed: true,
        })
      }
    }

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('timeupdate', updateProgress)
    video.addEventListener('loadedmetadata', updateDuration)
    video.addEventListener('play', () => setIsPlaying(true))
    video.addEventListener('pause', () => setIsPlaying(false))

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('timeupdate', updateProgress)
      video.removeEventListener('loadedmetadata', updateDuration)
      video.removeEventListener('play', () => setIsPlaying(true))
      video.removeEventListener('pause', () => setIsPlaying(false))
    }
  }, [onProgress, onComplete, readonly, preview])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newTime = (parseFloat(e.target.value) / 100) * duration
    video.currentTime = newTime
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = parseFloat(e.target.value) / 100
    video.volume = newVolume
    setVolume(newVolume)
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (!isFullscreen) {
      video.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const restartVideo = () => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = 0
    video.play()
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
        {/* Video Player */}
        <Card>
          <CardContent className="p-0">
            <div className="relative bg-black rounded-lg overflow-hidden">
              {/* Video Element */}
              <video
                ref={videoRef}
                src={content.videoUrl}
                poster={content.thumbnailUrl}
                className="w-full aspect-video"
                autoPlay={content.autoplay && !preview}
                controls={false} // We'll use custom controls
                onError={(e) => console.error('Video error:', e)}
              >
                {content.captions && (
                  <track
                    kind="captions"
                    src={content.captions}
                    srcLang="en"
                    default
                  />
                )}
                Your browser does not support the video tag.
              </video>

              {/* Custom Video Controls */}
              {content.controls !== false && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={(currentTime / duration) * 100 || 0}
                      onChange={handleSeek}
                      className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) 100%)`
                      }}
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* Play/Pause */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={togglePlay}
                        className="text-white hover:bg-white/20"
                      >
                        {isPlaying ? (
                          <Icons.pause className="h-4 w-4" />
                        ) : (
                          <Icons.play className="h-4 w-4" />
                        )}
                      </Button>

                      {/* Restart */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={restartVideo}
                        className="text-white hover:bg-white/20"
                      >
                        <Icons.restart className="h-4 w-4" />
                      </Button>

                      {/* Time */}
                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Volume */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleMute}
                        className="text-white hover:bg-white/20"
                      >
                        {isMuted ? (
                          <Icons.volumeOff className="h-4 w-4" />
                        ) : (
                          <Icons.volume className="h-4 w-4" />
                        )}
                      </Button>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={isMuted ? 0 : volume * 100}
                        onChange={handleVolumeChange}
                        className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                      />

                      {/* Fullscreen */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleFullscreen}
                        className="text-white hover:bg-white/20"
                      >
                        {isFullscreen ? (
                          <Icons.exitFullscreen className="h-4 w-4" />
                        ) : (
                          <Icons.fullscreen className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Indicator */}
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-black/50 text-white">
                  {Math.round(watchProgress)}% watched
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Info */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Video Details */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Video Details</h3>
              <div className="space-y-2 text-sm">
                {content.duration && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{formatTime(content.duration)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Progress:</span>
                  <span>{Math.round(watchProgress)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Time:</span>
                  <span>{formatTime(currentTime)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transcript Toggle */}
          {content.transcript && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Transcript</h3>
                <Button
                  variant="outline"
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="w-full"
                >
                  {showTranscript ? 'Hide' : 'Show'} Transcript
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Transcript */}
        {content.transcript && showTranscript && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Video Transcript</h3>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {content.transcript}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </BaseLesson>
  )
}