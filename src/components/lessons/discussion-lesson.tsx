'use client'

import React, { useState } from 'react'
import { BaseLesson } from './base-lesson'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar } from '@/components/ui/avatar'
import { Icons } from '@/components/ui/icons'
import { useAuth } from '@/hooks/useAuth'
import type { LessonComponentProps, DiscussionLessonContent } from '@/lib/lessons/types'

interface DiscussionLessonProps extends LessonComponentProps {
  onProgress?: (progress: number, data?: any) => void
  onComplete?: (data?: any) => void
}

interface DiscussionPost {
  id: string
  userId: string
  userName: string
  content: string
  createdAt: string
  replies: DiscussionReply[]
}

interface DiscussionReply {
  id: string
  userId: string
  userName: string
  content: string
  createdAt: string
}

export function DiscussionLesson({ lesson, progress, onProgress, onComplete, readonly, preview }: DiscussionLessonProps) {
  const { profile } = useAuth()
  const [posts, setPosts] = useState<DiscussionPost[]>([])
  const [newPost, setNewPost] = useState('')
  const [replyContent, setReplyContent] = useState<Record<string, string>>({})
  const [showReplyForm, setShowReplyForm] = useState<Record<string, boolean>>({})

  const content = lesson.content as DiscussionLessonContent

  const handlePostSubmit = () => {
    if (!newPost.trim() || !profile) return

    const post: DiscussionPost = {
      id: Date.now().toString(),
      userId: profile.id,
      userName: profile.full_name || profile.username || 'Anonymous',
      content: newPost.trim(),
      createdAt: new Date().toISOString(),
      replies: [],
    }

    setPosts(prev => [post, ...prev])
    setNewPost('')

    // Update progress based on participation
    const userPosts = [...posts, post].filter(p => p.userId === profile.id)
    const userReplies = posts.reduce((count, p) => 
      count + p.replies.filter(r => r.userId === profile.id).length, 0
    )
    
    const totalParticipation = userPosts.length + userReplies
    const minimumPosts = content.minimumPosts || 1
    const progressPercent = Math.min(100, (totalParticipation / minimumPosts) * 100)

    if (onProgress) {
      onProgress(progressPercent, {
        posts: userPosts.length,
        replies: userReplies,
        totalParticipation,
      })
    }

    // Auto-complete if minimum participation is met
    if (totalParticipation >= minimumPosts && onComplete && !readonly && !preview) {
      onComplete({
        posts: userPosts.length,
        replies: userReplies,
        totalParticipation,
        completed: true,
      })
    }
  }

  const handleReplySubmit = (postId: string) => {
    const reply = replyContent[postId]
    if (!reply?.trim() || !profile) return

    const newReply: DiscussionReply = {
      id: Date.now().toString(),
      userId: profile.id,
      userName: profile.full_name || profile.username || 'Anonymous',
      content: reply.trim(),
      createdAt: new Date().toISOString(),
    }

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, replies: [...post.replies, newReply] }
        : post
    ))

    setReplyContent(prev => ({ ...prev, [postId]: '' }))
    setShowReplyForm(prev => ({ ...prev, [postId]: false }))

    // Update progress (replies count as participation)
    const userPosts = posts.filter(p => p.userId === profile.id)
    const userReplies = posts.reduce((count, p) => 
      count + p.replies.filter(r => r.userId === profile.id).length, 0
    ) + 1 // +1 for the new reply

    const totalParticipation = userPosts.length + userReplies
    const minimumPosts = content.minimumPosts || 1
    const progressPercent = Math.min(100, (totalParticipation / minimumPosts) * 100)

    if (onProgress) {
      onProgress(progressPercent, {
        posts: userPosts.length,
        replies: userReplies,
        totalParticipation,
      })
    }

    if (totalParticipation >= minimumPosts && onComplete && !readonly && !preview) {
      onComplete({
        posts: userPosts.length,
        replies: userReplies,
        totalParticipation,
        completed: true,
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getUserParticipation = () => {
    if (!profile) return { posts: 0, replies: 0 }
    
    const userPosts = posts.filter(p => p.userId === profile.id).length
    const userReplies = posts.reduce((count, p) => 
      count + p.replies.filter(r => r.userId === profile.id).length, 0
    )
    
    return { posts: userPosts, replies: userReplies }
  }

  const participation = getUserParticipation()
  const totalParticipation = participation.posts + participation.replies
  const minimumPosts = content.minimumPosts || 1

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
        {/* Discussion Prompt */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.messageSquare className="h-5 w-5" />
              Discussion Topic
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <p>{content.prompt}</p>
            </div>

            {/* Guidelines */}
            {content.guidelines && content.guidelines.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Discussion Guidelines:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {content.guidelines.map((guideline, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Icons.check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {guideline}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Participation Requirements */}
            <Alert>
              <Icons.target className="h-4 w-4" />
              <AlertDescription>
                <strong>Participation Required:</strong> You need at least {minimumPosts} post{minimumPosts !== 1 ? 's' : ''} or replies to complete this lesson.
                {content.enableReplies && ' Replies to other students count towards your participation.'}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Participation Status */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Your Participation</p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>Posts: {participation.posts}</span>
                  <span>Replies: {participation.replies}</span>
                  <span>Total: {totalParticipation}</span>
                </div>
              </div>
              <div className="text-right">
                {totalParticipation >= minimumPosts ? (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    ✓ Requirements Met
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    {minimumPosts - totalParticipation} more needed
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Post Form */}
        {!readonly && !preview && (
          <Card>
            <CardHeader>
              <CardTitle>Share Your Thoughts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What are your thoughts on this topic? Share your insights..."
                className="min-h-[100px]"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  {newPost.length} characters
                </p>
                <Button
                  onClick={handlePostSubmit}
                  disabled={!newPost.trim()}
                >
                  <Icons.messageSquare className="h-4 w-4 mr-2" />
                  Post
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Discussion Posts */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Icons.messageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No posts yet. Be the first to start the discussion!
                </p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  {/* Post Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="w-10 h-10 bg-primary text-primary-foreground">
                      {getUserInitials(post.userName)}
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{post.userName}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(post.createdAt)}
                        </span>
                        {post.userId === profile?.id && (
                          <Badge variant="outline" className="text-xs">You</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="prose prose-sm max-w-none mb-4">
                    <p className="whitespace-pre-wrap">{post.content}</p>
                  </div>

                  {/* Post Actions */}
                  {content.enableReplies && !readonly && !preview && (
                    <div className="flex items-center gap-2 mb-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowReplyForm(prev => ({
                          ...prev,
                          [post.id]: !prev[post.id]
                        }))}
                      >
                        <Icons.messageSquare className="h-4 w-4 mr-1" />
                        Reply ({post.replies.length})
                      </Button>
                    </div>
                  )}

                  {/* Reply Form */}
                  {showReplyForm[post.id] && (
                    <div className="space-y-3 p-3 bg-muted rounded-lg">
                      <Textarea
                        value={replyContent[post.id] || ''}
                        onChange={(e) => setReplyContent(prev => ({
                          ...prev,
                          [post.id]: e.target.value
                        }))}
                        placeholder="Write a reply..."
                        className="min-h-[80px]"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowReplyForm(prev => ({
                            ...prev,
                            [post.id]: false
                          }))}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleReplySubmit(post.id)}
                          disabled={!replyContent[post.id]?.trim()}
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {post.replies.length > 0 && (
                    <div className="space-y-3 mt-4 pl-6 border-l-2 border-muted">
                      {post.replies.map((reply) => (
                        <div key={reply.id} className="space-y-2">
                          <div className="flex items-start gap-2">
                            <Avatar className="w-8 h-8 bg-secondary text-secondary-foreground">
                              {getUserInitials(reply.userName)}
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{reply.userName}</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(reply.createdAt)}
                                </span>
                                {reply.userId === profile?.id && (
                                  <Badge variant="outline" className="text-xs">You</Badge>
                                )}
                              </div>
                              <p className="text-sm mt-1 whitespace-pre-wrap">{reply.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </BaseLesson>
  )
}