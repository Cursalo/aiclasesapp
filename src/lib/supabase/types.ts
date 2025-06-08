export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          badge_color: string | null
          category: string | null
          created_at: string | null
          criteria: Json
          description: string | null
          icon: string
          id: string
          is_active: boolean | null
          is_hidden: boolean | null
          points_value: number | null
          rarity: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          badge_color?: string | null
          category?: string | null
          created_at?: string | null
          criteria: Json
          description?: string | null
          icon: string
          id?: string
          is_active?: boolean | null
          is_hidden?: boolean | null
          points_value?: number | null
          rarity?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          badge_color?: string | null
          category?: string | null
          created_at?: string | null
          criteria?: Json
          description?: string | null
          icon?: string
          id?: string
          is_active?: boolean | null
          is_hidden?: boolean | null
          points_value?: number | null
          rarity?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      course_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          sort_order: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          sort_order?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      course_reviews: {
        Row: {
          course_id: string
          created_at: string | null
          helpful_count: number | null
          id: string
          is_featured: boolean | null
          rating: number
          review_text: string | null
          review_title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_featured?: boolean | null
          rating: number
          review_text?: string | null
          review_title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_featured?: boolean | null
          rating?: number
          review_text?: string | null
          review_title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      courses: {
        Row: {
          average_rating: number | null
          category: string | null
          created_at: string | null
          description: string | null
          difficulty_level: Database["public"]["Enums"]["difficulty_level"] | null
          enrollment_count: number | null
          estimated_duration_hours: number | null
          id: string
          instructor_id: string | null
          is_featured: boolean | null
          is_premium: boolean | null
          is_published: boolean | null
          language: string | null
          last_updated: string | null
          learning_outcomes: string[] | null
          long_description: string | null
          prerequisites: string[] | null
          price: number | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          total_reviews: number | null
          updated_at: string | null
        }
        Insert: {
          average_rating?: number | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: Database["public"]["Enums"]["difficulty_level"] | null
          enrollment_count?: number | null
          estimated_duration_hours?: number | null
          id?: string
          instructor_id?: string | null
          is_featured?: boolean | null
          is_premium?: boolean | null
          is_published?: boolean | null
          language?: string | null
          last_updated?: string | null
          learning_outcomes?: string[] | null
          long_description?: string | null
          prerequisites?: string[] | null
          price?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          total_reviews?: number | null
          updated_at?: string | null
        }
        Update: {
          average_rating?: number | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: Database["public"]["Enums"]["difficulty_level"] | null
          enrollment_count?: number | null
          estimated_duration_hours?: number | null
          id?: string
          instructor_id?: string | null
          is_featured?: boolean | null
          is_premium?: boolean | null
          is_published?: boolean | null
          language?: string | null
          last_updated?: string | null
          learning_outcomes?: string[] | null
          long_description?: string | null
          prerequisites?: string[] | null
          price?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          total_reviews?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      discussion_replies: {
        Row: {
          content: string
          created_at: string | null
          discussion_id: string
          id: string
          is_solution: boolean | null
          reply_to_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          discussion_id: string
          id?: string
          is_solution?: boolean | null
          reply_to_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          discussion_id?: string
          id?: string
          is_solution?: boolean | null
          reply_to_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_replies_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "discussion_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_replies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      discussions: {
        Row: {
          content: string
          course_id: string | null
          created_at: string | null
          id: string
          is_pinned: boolean | null
          is_solved: boolean | null
          last_activity_at: string | null
          lesson_id: string | null
          reply_count: number | null
          title: string
          updated_at: string | null
          user_id: string
          view_count: number | null
        }
        Insert: {
          content: string
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          is_solved?: boolean | null
          last_activity_at?: string | null
          lesson_id?: string | null
          reply_count?: number | null
          title: string
          updated_at?: string | null
          user_id: string
          view_count?: number | null
        }
        Update: {
          content?: string
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          is_solved?: boolean | null
          last_activity_at?: string | null
          lesson_id?: string | null
          reply_count?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "discussions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      enrollments: {
        Row: {
          completed_at: string | null
          completion_certificate_url: string | null
          course_id: string
          enrolled_at: string | null
          id: string
          last_accessed: string | null
          notes: string | null
          progress_percentage: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completion_certificate_url?: string | null
          course_id: string
          enrolled_at?: string | null
          id?: string
          last_accessed?: string | null
          notes?: string | null
          progress_percentage?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completion_certificate_url?: string | null
          course_id?: string
          enrolled_at?: string | null
          id?: string
          last_accessed?: string | null
          notes?: string | null
          progress_percentage?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      learning_path_courses: {
        Row: {
          course_id: string
          id: string
          is_required: boolean | null
          learning_path_id: string
          order_index: number
        }
        Insert: {
          course_id: string
          id?: string
          is_required?: boolean | null
          learning_path_id: string
          order_index: number
        }
        Update: {
          course_id?: string
          id?: string
          is_required?: boolean | null
          learning_path_id?: string
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "learning_path_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_path_courses_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          }
        ]
      }
      learning_path_enrollments: {
        Row: {
          completed_at: string | null
          enrolled_at: string | null
          id: string
          learning_path_id: string
          progress_percentage: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          enrolled_at?: string | null
          id?: string
          learning_path_id: string
          progress_percentage?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          enrolled_at?: string | null
          id?: string
          learning_path_id?: string
          progress_percentage?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_path_enrollments_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_path_enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      learning_paths: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty_level: Database["public"]["Enums"]["difficulty_level"] | null
          estimated_duration_hours: number | null
          id: string
          is_published: boolean | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: Database["public"]["Enums"]["difficulty_level"] | null
          estimated_duration_hours?: number | null
          id?: string
          is_published?: boolean | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: Database["public"]["Enums"]["difficulty_level"] | null
          estimated_duration_hours?: number | null
          id?: string
          is_published?: boolean | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_paths_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      learning_streaks: {
        Row: {
          created_at: string | null
          current_streak: number | null
          id: string
          last_activity_date: string | null
          longest_streak: number | null
          streak_data: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          streak_data?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          streak_data?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      lesson_progress: {
        Row: {
          bookmarks: Json | null
          completed_at: string | null
          completion_percentage: number | null
          course_id: string
          created_at: string | null
          id: string
          last_accessed: string | null
          lesson_id: string
          notes: string | null
          section_progress: Json | null
          time_spent_seconds: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bookmarks?: Json | null
          completed_at?: string | null
          completion_percentage?: number | null
          course_id: string
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          lesson_id: string
          notes?: string | null
          section_progress?: Json | null
          time_spent_seconds?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bookmarks?: Json | null
          completed_at?: string | null
          completion_percentage?: number | null
          course_id?: string
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          lesson_id?: string
          notes?: string | null
          section_progress?: Json | null
          time_spent_seconds?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      lessons: {
        Row: {
          component_path: string
          content_type: string | null
          course_id: string
          created_at: string | null
          description: string | null
          estimated_duration_minutes: number | null
          id: string
          is_free: boolean | null
          learning_objectives: string[] | null
          order_index: number
          prerequisites: string[] | null
          resources: Json | null
          title: string
          transcript: string | null
          updated_at: string | null
          video_duration: number | null
          video_url: string | null
        }
        Insert: {
          component_path: string
          content_type?: string | null
          course_id: string
          created_at?: string | null
          description?: string | null
          estimated_duration_minutes?: number | null
          id?: string
          is_free?: boolean | null
          learning_objectives?: string[] | null
          order_index: number
          prerequisites?: string[] | null
          resources?: Json | null
          title: string
          transcript?: string | null
          updated_at?: string | null
          video_duration?: number | null
          video_url?: string | null
        }
        Update: {
          component_path?: string
          content_type?: string | null
          course_id?: string
          created_at?: string | null
          description?: string | null
          estimated_duration_minutes?: number | null
          id?: string
          is_free?: boolean | null
          learning_objectives?: string[] | null
          order_index?: number
          prerequisites?: string[] | null
          resources?: Json | null
          title?: string
          transcript?: string | null
          updated_at?: string | null
          video_duration?: number | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string
          id: string
          last_active: string | null
          points: number | null
          preferences: Json | null
          role: Database["public"]["Enums"]["user_role"] | null
          social_links: Json | null
          streak_days: number | null
          updated_at: string | null
          username: string
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name: string
          id: string
          last_active?: string | null
          points?: number | null
          preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role"] | null
          social_links?: Json | null
          streak_days?: number | null
          updated_at?: string | null
          username: string
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          last_active?: string | null
          points?: number | null
          preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role"] | null
          social_links?: Json | null
          streak_days?: number | null
          updated_at?: string | null
          username?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      quiz_attempts: {
        Row: {
          answers: Json
          attempt_number: number
          completed_at: string | null
          id: string
          is_passed: boolean | null
          lesson_id: string
          max_score: number
          percentage_score: number | null
          quiz_id: string
          score: number
          time_taken_seconds: number | null
          user_id: string
        }
        Insert: {
          answers: Json
          attempt_number: number
          completed_at?: string | null
          id?: string
          lesson_id: string
          max_score: number
          quiz_id: string
          score: number
          time_taken_seconds?: number | null
          user_id: string
        }
        Update: {
          answers?: Json
          attempt_number?: number
          completed_at?: string | null
          id?: string
          lesson_id?: string
          max_score?: number
          quiz_id?: string
          score?: number
          time_taken_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      quiz_questions: {
        Row: {
          code_snippet: string | null
          correct_answers: Json
          created_at: string | null
          explanation: string | null
          id: string
          image_url: string | null
          options: Json | null
          order_index: number
          points: number | null
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          quiz_id: string
        }
        Insert: {
          code_snippet?: string | null
          correct_answers: Json
          created_at?: string | null
          explanation?: string | null
          id?: string
          image_url?: string | null
          options?: Json | null
          order_index: number
          points?: number | null
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          quiz_id: string
        }
        Update: {
          code_snippet?: string | null
          correct_answers?: Json
          created_at?: string | null
          explanation?: string | null
          id?: string
          image_url?: string | null
          options?: Json | null
          order_index?: number
          points?: number | null
          question_text?: string
          question_type?: Database["public"]["Enums"]["question_type"]
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          }
        ]
      }
      quizzes: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          instructions: string | null
          is_required: boolean | null
          lesson_id: string
          max_attempts: number | null
          passing_score: number | null
          randomize_questions: boolean | null
          show_correct_answers: boolean | null
          time_limit_minutes: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          instructions?: string | null
          is_required?: boolean | null
          lesson_id: string
          max_attempts?: number | null
          passing_score?: number | null
          randomize_questions?: boolean | null
          show_correct_answers?: boolean | null
          time_limit_minutes?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          instructions?: string | null
          is_required?: boolean | null
          lesson_id?: string
          max_attempts?: number | null
          passing_score?: number | null
          randomize_questions?: boolean | null
          show_correct_answers?: boolean | null
          time_limit_minutes?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          }
        ]
      }
      review_helpfulness: {
        Row: {
          created_at: string | null
          id: string
          is_helpful: boolean
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_helpful: boolean
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_helpful?: boolean
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_helpfulness_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "course_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_helpfulness_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string | null
          id: string
          progress_data: Json | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string | null
          id?: string
          progress_data?: Json | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string | null
          id?: string
          progress_data?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_achievements: {
        Args: {
          user_uuid: string
        }
        Returns: undefined
      }
      is_admin: {
        Args: {
          user_uuid?: string
        }
        Returns: boolean
      }
      is_enrolled: {
        Args: {
          course_uuid: string
          user_uuid?: string
        }
        Returns: boolean
      }
      is_instructor: {
        Args: {
          user_uuid?: string
        }
        Returns: boolean
      }
      owns_course: {
        Args: {
          course_uuid: string
          user_uuid?: string
        }
        Returns: boolean
      }
      update_learning_streak: {
        Args: {
          user_uuid: string
        }
        Returns: undefined
      }
    }
    Enums: {
      difficulty_level: "beginner" | "intermediate" | "advanced"
      question_type: "multiple_choice" | "multiple_select" | "true_false" | "fill_blank" | "code_completion"
      user_role: "student" | "instructor" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}