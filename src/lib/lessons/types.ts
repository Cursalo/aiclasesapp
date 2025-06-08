export interface LessonComponent {
  id: string
  type: LessonType
  title: string
  description?: string
  content: any
  metadata?: LessonMetadata
}

export type LessonType = 
  | 'video'
  | 'text'
  | 'code'
  | 'quiz'
  | 'interactive'
  | 'assignment'
  | 'discussion'

export interface LessonMetadata {
  estimatedTime?: number // in minutes
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  tags?: string[]
  prerequisites?: string[]
  learningObjectives?: string[]
}

export interface VideoLessonContent {
  videoUrl: string
  transcript?: string
  captions?: string
  thumbnailUrl?: string
  duration?: number
  autoplay?: boolean
  controls?: boolean
}

export interface TextLessonContent {
  markdown: string
  images?: {
    url: string
    alt: string
    caption?: string
  }[]
  downloadableResources?: {
    title: string
    url: string
    type: 'pdf' | 'doc' | 'zip' | 'other'
  }[]
}

export interface CodeLessonContent {
  language: string
  initialCode: string
  solution?: string
  tests?: {
    input: any
    expected: any
    description: string
  }[]
  instructions: string
  hints?: string[]
  libraries?: string[]
}

export interface QuizLessonContent {
  questions: QuizQuestion[]
  passingScore?: number
  shuffleQuestions?: boolean
  timeLimit?: number // in minutes
  allowRetake?: boolean
  showCorrectAnswers?: boolean
}

export interface QuizQuestion {
  id: string
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'code'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation?: string
  points?: number
}

export interface InteractiveLessonContent {
  componentType: string
  props: Record<string, any>
  instructions?: string
  completionCriteria?: {
    type: 'interaction' | 'time' | 'custom'
    value: any
  }
}

export interface AssignmentLessonContent {
  instructions: string
  deliverables: {
    title: string
    description: string
    type: 'file' | 'text' | 'url'
    required: boolean
  }[]
  rubric?: {
    criteria: string
    points: number
    description: string
  }[]
  dueDate?: string
  allowLateSubmission?: boolean
}

export interface DiscussionLessonContent {
  prompt: string
  guidelines?: string[]
  minimumPosts?: number
  enableReplies?: boolean
  moderationEnabled?: boolean
}

// Lesson progress and completion
export interface LessonProgress {
  lessonId: string
  userId: string
  status: 'not-started' | 'in-progress' | 'completed'
  progress: number // 0-100
  timeSpent: number // in seconds
  startedAt?: string
  completedAt?: string
  data?: Record<string, any> // lesson-specific progress data
}

// Lesson registry types
export interface LessonComponentConfig {
  type: LessonType
  component: React.ComponentType<LessonComponentProps>
  icon: React.ComponentType<any>
  label: string
  description: string
  defaultContent: any
}

export interface LessonComponentProps {
  lesson: LessonComponent
  progress: LessonProgress
  onProgress: (progress: number, data?: any) => void
  onComplete: (data?: any) => void
  readonly?: boolean
  preview?: boolean
}

// Course and lesson structure
export interface Course {
  id: string
  title: string
  description: string
  instructor_id: string
  thumbnail_url?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
  tags: string[]
  is_published: boolean
  estimated_duration: number
  price?: number
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  description?: string
  content: LessonComponent[]
  order_index: number
  is_preview: boolean
  estimated_duration: number
  created_at: string
  updated_at: string
}