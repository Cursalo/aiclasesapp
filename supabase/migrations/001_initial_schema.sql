-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Create custom types
create type user_role as enum ('student', 'instructor', 'admin');
create type difficulty_level as enum ('beginner', 'intermediate', 'advanced');
create type question_type as enum ('multiple_choice', 'multiple_select', 'true_false', 'fill_blank', 'code_completion');

-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  full_name text not null,
  avatar_url text,
  role user_role default 'student',
  points integer default 0 check (points >= 0),
  streak_days integer default 0 check (streak_days >= 0),
  last_active timestamp with time zone default now(),
  bio text,
  website_url text,
  social_links jsonb default '{}',
  preferences jsonb default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  constraint username_length check (char_length(username) >= 3),
  constraint username_format check (username ~ '^[a-zA-Z0-9_-]+$')
);

-- Courses table
create table public.courses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  long_description text,
  thumbnail_url text,
  instructor_id uuid references public.profiles(id) on delete set null,
  difficulty_level difficulty_level default 'beginner',
  estimated_duration_hours integer check (estimated_duration_hours > 0),
  price decimal(10,2) default 0 check (price >= 0),
  is_premium boolean default false,
  is_published boolean default false,
  is_featured boolean default false,
  tags text[] default '{}',
  category text,
  prerequisites text[] default '{}',
  learning_outcomes text[] default '{}',
  enrollment_count integer default 0 check (enrollment_count >= 0),
  average_rating decimal(3,2) default 0 check (average_rating >= 0 and average_rating <= 5),
  total_reviews integer default 0 check (total_reviews >= 0),
  language text default 'en',
  last_updated timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Lessons table
create table public.lessons (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  description text,
  component_path text not null,
  order_index integer not null,
  estimated_duration_minutes integer check (estimated_duration_minutes > 0),
  is_free boolean default false,
  prerequisites uuid[] default '{}',
  learning_objectives text[] default '{}',
  content_type text default 'mixed',
  video_url text,
  video_duration integer,
  transcript text,
  resources jsonb default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  unique(course_id, order_index),
  constraint valid_component_path check (component_path ~ '^[a-zA-Z0-9\-_/]+$')
);

-- Course categories table
create table public.course_categories (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  description text,
  icon text,
  color text default '#3b82f6',
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Enrollments table
create table public.enrollments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  enrolled_at timestamp with time zone default now(),
  completed_at timestamp with time zone,
  progress_percentage integer default 0 check (progress_percentage >= 0 and progress_percentage <= 100),
  last_accessed timestamp with time zone,
  completion_certificate_url text,
  notes text,
  
  unique(user_id, course_id)
);

-- Lesson progress table
create table public.lesson_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  completion_percentage integer default 0 check (completion_percentage >= 0 and completion_percentage <= 100),
  time_spent_seconds integer default 0 check (time_spent_seconds >= 0),
  completed_at timestamp with time zone,
  last_accessed timestamp with time zone default now(),
  section_progress jsonb default '{}',
  notes text,
  bookmarks jsonb default '[]',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  unique(user_id, lesson_id)
);

-- Quiz definitions table
create table public.quizzes (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  title text not null,
  description text,
  instructions text,
  time_limit_minutes integer,
  max_attempts integer default 3,
  passing_score integer default 70 check (passing_score >= 0 and passing_score <= 100),
  randomize_questions boolean default false,
  show_correct_answers boolean default true,
  is_required boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Quiz questions table
create table public.quiz_questions (
  id uuid primary key default uuid_generate_v4(),
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  question_type question_type not null,
  question_text text not null,
  options jsonb default '[]',
  correct_answers jsonb not null,
  explanation text,
  points integer default 1 check (points > 0),
  order_index integer not null,
  code_snippet text,
  image_url text,
  created_at timestamp with time zone default now(),
  
  unique(quiz_id, order_index)
);

-- Quiz attempts table
create table public.quiz_attempts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  score integer not null check (score >= 0),
  max_score integer not null check (max_score > 0),
  percentage_score integer generated always as (round((score::decimal / max_score) * 100)) stored,
  answers jsonb not null,
  time_taken_seconds integer check (time_taken_seconds >= 0),
  is_passed boolean generated always as (round((score::decimal / max_score) * 100) >= 70) stored,
  attempt_number integer not null,
  completed_at timestamp with time zone default now(),
  
  unique(user_id, quiz_id, attempt_number)
);

-- Achievements table
create table public.achievements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  icon text not null,
  badge_color text default 'blue',
  category text default 'general',
  points_value integer default 0 check (points_value >= 0),
  criteria jsonb not null,
  is_active boolean default true,
  is_hidden boolean default false,
  rarity text default 'common' check (rarity in ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- User achievements table
create table public.user_achievements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  achievement_id uuid references public.achievements(id) on delete cascade not null,
  earned_at timestamp with time zone default now(),
  progress_data jsonb default '{}',
  
  unique(user_id, achievement_id)
);

-- Course ratings and reviews table
create table public.course_reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  review_title text,
  review_text text,
  is_featured boolean default false,
  helpful_count integer default 0 check (helpful_count >= 0),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  unique(user_id, course_id)
);

-- Review helpfulness tracking
create table public.review_helpfulness (
  id uuid primary key default uuid_generate_v4(),
  review_id uuid references public.course_reviews(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  is_helpful boolean not null,
  created_at timestamp with time zone default now(),
  
  unique(review_id, user_id)
);

-- Discussion forums table
create table public.discussions (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references public.courses(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  is_pinned boolean default false,
  is_solved boolean default false,
  view_count integer default 0 check (view_count >= 0),
  reply_count integer default 0 check (reply_count >= 0),
  last_activity_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  constraint discussion_scope check (
    (course_id is not null and lesson_id is null) or
    (course_id is null and lesson_id is not null) or
    (course_id is not null and lesson_id is not null)
  )
);

-- Discussion replies table
create table public.discussion_replies (
  id uuid primary key default uuid_generate_v4(),
  discussion_id uuid references public.discussions(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  is_solution boolean default false,
  reply_to_id uuid references public.discussion_replies(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- User learning streaks table
create table public.learning_streaks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  current_streak integer default 0 check (current_streak >= 0),
  longest_streak integer default 0 check (longest_streak >= 0),
  last_activity_date date default current_date,
  streak_data jsonb default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  unique(user_id)
);

-- Notifications table
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null,
  title text not null,
  message text not null,
  data jsonb default '{}',
  is_read boolean default false,
  read_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Learning paths table (for structured course sequences)
create table public.learning_paths (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  thumbnail_url text,
  difficulty_level difficulty_level default 'beginner',
  estimated_duration_hours integer check (estimated_duration_hours > 0),
  is_published boolean default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Learning path courses junction table
create table public.learning_path_courses (
  id uuid primary key default uuid_generate_v4(),
  learning_path_id uuid references public.learning_paths(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  order_index integer not null,
  is_required boolean default true,
  
  unique(learning_path_id, course_id),
  unique(learning_path_id, order_index)
);

-- User learning path enrollments
create table public.learning_path_enrollments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  learning_path_id uuid references public.learning_paths(id) on delete cascade not null,
  enrolled_at timestamp with time zone default now(),
  completed_at timestamp with time zone,
  progress_percentage integer default 0 check (progress_percentage >= 0 and progress_percentage <= 100),
  
  unique(user_id, learning_path_id)
);

-- Create indexes for performance
create index idx_profiles_username on public.profiles(username);
create index idx_profiles_role on public.profiles(role);
create index idx_courses_published on public.courses(is_published) where is_published = true;
create index idx_courses_category on public.courses(category) where is_published = true;
create index idx_courses_instructor on public.courses(instructor_id);
create index idx_courses_featured on public.courses(is_featured) where is_featured = true;
create index idx_lessons_course_order on public.lessons(course_id, order_index);
create index idx_enrollments_user on public.enrollments(user_id);
create index idx_enrollments_course on public.enrollments(course_id);
create index idx_lesson_progress_user_course on public.lesson_progress(user_id, course_id);
create index idx_lesson_progress_lesson on public.lesson_progress(lesson_id);
create index idx_quiz_attempts_user on public.quiz_attempts(user_id);
create index idx_quiz_attempts_quiz on public.quiz_attempts(quiz_id);
create index idx_achievements_active on public.achievements(is_active) where is_active = true;
create index idx_user_achievements_user on public.user_achievements(user_id);
create index idx_course_reviews_course on public.course_reviews(course_id);
create index idx_course_reviews_user on public.course_reviews(user_id);
create index idx_discussions_course on public.discussions(course_id);
create index idx_discussions_lesson on public.discussions(lesson_id);
create index idx_notifications_user_unread on public.notifications(user_id, is_read) where is_read = false;