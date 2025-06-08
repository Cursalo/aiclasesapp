import React from 'react'
import { Icons } from '@/components/ui/icons'
import type { LessonComponentConfig, LessonType } from './types'

// Import lesson components
import { VideoLesson } from '@/components/lessons/video-lesson'
import { TextLesson } from '@/components/lessons/text-lesson'
import { CodeLesson } from '@/components/lessons/code-lesson'
import { QuizLesson } from '@/components/lessons/quiz-lesson'
import { InteractiveLesson } from '@/components/lessons/interactive-lesson'
import { AssignmentLesson } from '@/components/lessons/assignment-lesson'
import { DiscussionLesson } from '@/components/lessons/discussion-lesson'

// Lesson component registry
export const lessonRegistry: Record<LessonType, LessonComponentConfig> = {
  video: {
    type: 'video',
    component: VideoLesson,
    icon: Icons.play,
    label: 'Video Lesson',
    description: 'Video content with player controls and transcripts',
    defaultContent: {
      videoUrl: '',
      controls: true,
      autoplay: false,
    },
  },
  
  text: {
    type: 'text',
    component: TextLesson,
    icon: Icons.fileText,
    label: 'Text Lesson',
    description: 'Rich text content with markdown support',
    defaultContent: {
      markdown: '# Lesson Title\n\nYour lesson content goes here...',
      images: [],
      downloadableResources: [],
    },
  },
  
  code: {
    type: 'code',
    component: CodeLesson,
    icon: Icons.code,
    label: 'Code Exercise',
    description: 'Interactive coding environment with tests',
    defaultContent: {
      language: 'javascript',
      initialCode: '// Write your code here\n',
      instructions: 'Complete the coding exercise below.',
      tests: [],
      hints: [],
    },
  },
  
  quiz: {
    type: 'quiz',
    component: QuizLesson,
    icon: Icons.help,
    label: 'Quiz',
    description: 'Interactive quiz with multiple question types',
    defaultContent: {
      questions: [],
      passingScore: 70,
      shuffleQuestions: false,
      allowRetake: true,
      showCorrectAnswers: true,
    },
  },
  
  interactive: {
    type: 'interactive',
    component: InteractiveLesson,
    icon: Icons.zap,
    label: 'Interactive Component',
    description: 'Custom interactive learning component',
    defaultContent: {
      componentType: 'demo',
      props: {},
      instructions: 'Interact with the component below.',
    },
  },
  
  assignment: {
    type: 'assignment',
    component: AssignmentLesson,
    icon: Icons.briefcase,
    label: 'Assignment',
    description: 'Project assignment with deliverables',
    defaultContent: {
      instructions: 'Complete the assignment following the instructions below.',
      deliverables: [],
    },
  },
  
  discussion: {
    type: 'discussion',
    component: DiscussionLesson,
    icon: Icons.messageSquare,
    label: 'Discussion',
    description: 'Discussion forum for student interaction',
    defaultContent: {
      prompt: 'Share your thoughts and engage with fellow learners.',
      guidelines: [
        'Be respectful and constructive',
        'Stay on topic',
        'Provide evidence for your claims',
      ],
      minimumPosts: 1,
      enableReplies: true,
    },
  },
}

// Helper functions
export function getLessonComponent(type: LessonType) {
  const config = lessonRegistry[type]
  if (!config) {
    throw new Error(`Unknown lesson type: ${type}`)
  }
  return config.component
}

export function getLessonConfig(type: LessonType): LessonComponentConfig {
  const config = lessonRegistry[type]
  if (!config) {
    throw new Error(`Unknown lesson type: ${type}`)
  }
  return config
}

export function getAllLessonTypes(): LessonType[] {
  return Object.keys(lessonRegistry) as LessonType[]
}

export function createDefaultLessonContent(type: LessonType) {
  const config = getLessonConfig(type)
  return config.defaultContent
}

// Lesson component renderer
interface LessonRendererProps {
  lesson: any // LessonComponent from types
  progress: any // LessonProgress from types
  onProgress: (progress: number, data?: any) => void
  onComplete: (data?: any) => void
  readonly?: boolean
  preview?: boolean
}

export function LessonRenderer({ 
  lesson, 
  progress, 
  onProgress, 
  onComplete, 
  readonly = false,
  preview = false 
}: LessonRendererProps) {
  const Component = getLessonComponent(lesson.type)
  
  return (
    <Component
      lesson={lesson}
      progress={progress}
      onProgress={onProgress}
      onComplete={onComplete}
      readonly={readonly}
      preview={preview}
    />
  )
}