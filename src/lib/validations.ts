import { z } from 'zod'

// Authentication schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const updatePasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Profile schemas
export const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  websiteUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
})

// Course schemas
export const createCourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  longDescription: z.string().min(50, 'Long description must be at least 50 characters').max(2000, 'Long description must be less than 2000 characters').optional(),
  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  estimatedDurationHours: z.number().min(1, 'Duration must be at least 1 hour').max(100, 'Duration must be less than 100 hours'),
  price: z.number().min(0, 'Price cannot be negative'),
  isPremium: z.boolean().default(false),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed'),
  prerequisites: z.array(z.string()).max(5, 'Maximum 5 prerequisites allowed'),
  learningOutcomes: z.array(z.string()).min(1, 'At least one learning outcome is required').max(10, 'Maximum 10 learning outcomes allowed'),
})

export const updateCourseSchema = createCourseSchema.partial()

// Lesson schemas
export const createLessonSchema = z.object({
  courseId: z.string().uuid('Invalid course ID'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters').optional(),
  componentPath: z.string().min(1, 'Component path is required'),
  orderIndex: z.number().min(1, 'Order index must be at least 1'),
  estimatedDurationMinutes: z.number().min(1, 'Duration must be at least 1 minute').max(300, 'Duration must be less than 300 minutes'),
  isFree: z.boolean().default(false),
  prerequisites: z.array(z.string().uuid()).max(5, 'Maximum 5 prerequisites allowed'),
  learningObjectives: z.array(z.string()).min(1, 'At least one learning objective is required').max(5, 'Maximum 5 learning objectives allowed'),
})

export const updateLessonSchema = createLessonSchema.partial().omit({ courseId: true })

// Progress tracking schemas
export const updateProgressSchema = z.object({
  lessonId: z.string().uuid('Invalid lesson ID'),
  courseId: z.string().uuid('Invalid course ID'),
  completionPercentage: z.number().min(0, 'Completion percentage cannot be negative').max(100, 'Completion percentage cannot exceed 100'),
  timeSpentSeconds: z.number().min(0, 'Time spent cannot be negative'),
  sectionProgress: z.record(z.number().min(0).max(100)).optional(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
})

// Quiz schemas
export const createQuizSchema = z.object({
  lessonId: z.string().uuid('Invalid lesson ID'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  instructions: z.string().max(1000, 'Instructions must be less than 1000 characters').optional(),
  timeLimitMinutes: z.number().min(1, 'Time limit must be at least 1 minute').max(180, 'Time limit must be less than 180 minutes').optional(),
  maxAttempts: z.number().min(1, 'Max attempts must be at least 1').max(10, 'Max attempts must be less than 10').default(3),
  passingScore: z.number().min(1, 'Passing score must be at least 1').max(100, 'Passing score cannot exceed 100').default(70),
  randomizeQuestions: z.boolean().default(false),
  showCorrectAnswers: z.boolean().default(true),
  isRequired: z.boolean().default(false),
})

export const createQuizQuestionSchema = z.object({
  quizId: z.string().uuid('Invalid quiz ID'),
  questionType: z.enum(['multiple_choice', 'multiple_select', 'true_false', 'fill_blank', 'code_completion']),
  questionText: z.string().min(10, 'Question text must be at least 10 characters').max(500, 'Question text must be less than 500 characters'),
  options: z.array(z.string()).min(2, 'At least 2 options are required').max(6, 'Maximum 6 options allowed'),
  correctAnswers: z.array(z.number()).min(1, 'At least one correct answer is required'),
  explanation: z.string().max(1000, 'Explanation must be less than 1000 characters').optional(),
  points: z.number().min(1, 'Points must be at least 1').max(10, 'Points must be less than 10').default(1),
  orderIndex: z.number().min(1, 'Order index must be at least 1'),
  codeSnippet: z.string().max(2000, 'Code snippet must be less than 2000 characters').optional(),
})

export const submitQuizSchema = z.object({
  quizId: z.string().uuid('Invalid quiz ID'),
  lessonId: z.string().uuid('Invalid lesson ID'),
  answers: z.array(z.object({
    questionId: z.string().uuid('Invalid question ID'),
    selectedAnswers: z.array(z.number()),
    timeTaken: z.number().min(0, 'Time taken cannot be negative').optional(),
  })),
  totalTimeTaken: z.number().min(0, 'Total time taken cannot be negative'),
})

// Review schemas
export const createReviewSchema = z.object({
  courseId: z.string().uuid('Invalid course ID'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  reviewTitle: z.string().min(3, 'Review title must be at least 3 characters').max(100, 'Review title must be less than 100 characters').optional(),
  reviewText: z.string().min(10, 'Review text must be at least 10 characters').max(1000, 'Review text must be less than 1000 characters').optional(),
})

// Discussion schemas
export const createDiscussionSchema = z.object({
  courseId: z.string().uuid('Invalid course ID').optional(),
  lessonId: z.string().uuid('Invalid lesson ID').optional(),
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters').max(5000, 'Content must be less than 5000 characters'),
}).refine((data) => data.courseId || data.lessonId, {
  message: "Either courseId or lessonId must be provided",
})

export const createDiscussionReplySchema = z.object({
  discussionId: z.string().uuid('Invalid discussion ID'),
  content: z.string().min(5, 'Content must be at least 5 characters').max(2000, 'Content must be less than 2000 characters'),
  replyToId: z.string().uuid('Invalid reply ID').optional(),
})

// Learning path schemas
export const createLearningPathSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters').optional(),
  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  estimatedDurationHours: z.number().min(1, 'Duration must be at least 1 hour').max(500, 'Duration must be less than 500 hours'),
})

export const addCourseToPathSchema = z.object({
  learningPathId: z.string().uuid('Invalid learning path ID'),
  courseId: z.string().uuid('Invalid course ID'),
  orderIndex: z.number().min(1, 'Order index must be at least 1'),
  isRequired: z.boolean().default(true),
})

// Notification schemas
export const markNotificationReadSchema = z.object({
  notificationId: z.string().uuid('Invalid notification ID'),
})

// Admin schemas
export const updateUserRoleSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  role: z.enum(['student', 'instructor', 'admin']),
})

// Search and filter schemas
export const courseFilterSchema = z.object({
  category: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  price: z.enum(['free', 'paid']).optional(),
  rating: z.number().min(1).max(5).optional(),
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
  instructor: z.string().uuid().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(12),
  sortBy: z.enum(['created_at', 'title', 'rating', 'enrollment_count', 'updated_at']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Export types
export type RegisterData = z.infer<typeof registerSchema>
export type LoginData = z.infer<typeof loginSchema>
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>
export type UpdatePasswordData = z.infer<typeof updatePasswordSchema>
export type UpdateProfileData = z.infer<typeof updateProfileSchema>
export type CreateCourseData = z.infer<typeof createCourseSchema>
export type UpdateCourseData = z.infer<typeof updateCourseSchema>
export type CreateLessonData = z.infer<typeof createLessonSchema>
export type UpdateLessonData = z.infer<typeof updateLessonSchema>
export type UpdateProgressData = z.infer<typeof updateProgressSchema>
export type CreateQuizData = z.infer<typeof createQuizSchema>
export type CreateQuizQuestionData = z.infer<typeof createQuizQuestionSchema>
export type SubmitQuizData = z.infer<typeof submitQuizSchema>
export type CreateReviewData = z.infer<typeof createReviewSchema>
export type CreateDiscussionData = z.infer<typeof createDiscussionSchema>
export type CreateDiscussionReplyData = z.infer<typeof createDiscussionReplySchema>
export type CreateLearningPathData = z.infer<typeof createLearningPathSchema>
export type AddCourseToPathData = z.infer<typeof addCourseToPathSchema>
export type MarkNotificationReadData = z.infer<typeof markNotificationReadSchema>
export type UpdateUserRoleData = z.infer<typeof updateUserRoleSchema>
export type CourseFilterData = z.infer<typeof courseFilterSchema>