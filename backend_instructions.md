# Backend Implementation Guide

## Supabase Setup & Configuration

### Initial Setup
```bash
# Install Supabase CLI
npm install -g @supabase/cli

# Initialize Supabase project
supabase init

# Start local development
supabase start

# Link to remote project
supabase link --project-ref YOUR_PROJECT_REF
```

### Environment Variables
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Database Schema Implementation

### Core Tables Migration
```sql
-- migrations/001_initial_schema.sql

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  full_name text not null,
  avatar_url text,
  role text check (role in ('student', 'instructor', 'admin')) default 'student',
  points integer default 0,
  streak_days integer default 0,
  last_active timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  constraint username_length check (char_length(username) >= 3)
);

-- Courses table
create table courses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  thumbnail_url text,
  instructor_id uuid references profiles(id) on delete set null,
  difficulty_level text check (difficulty_level in ('beginner', 'intermediate', 'advanced')) default 'beginner',
  estimated_duration_hours integer check (estimated_duration_hours > 0),
  price decimal(10,2) default 0 check (price >= 0),
  is_premium boolean default false,
  is_published boolean default false,
  tags text[],
  category text,
  enrollment_count integer default 0,
  average_rating decimal(3,2) default 0 check (average_rating >= 0 and average_rating <= 5),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Lessons table
create table lessons (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references courses(id) on delete cascade not null,
  title text not null,
  description text,
  component_path text not null,
  order_index integer not null,
  estimated_duration_minutes integer check (estimated_duration_minutes > 0),
  is_free boolean default false,
  prerequisites uuid[], -- Array of lesson IDs
  learning_objectives text[],
  created_at timestamp with time zone default now(),
  
  unique(course_id, order_index),
  constraint valid_component_path check (component_path ~ '^[a-zA-Z0-9\-_/]+$')
);

-- Enrollments table
create table enrollments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  course_id uuid references courses(id) on delete cascade not null,
  enrolled_at timestamp with time zone default now(),
  completed_at timestamp with time zone,
  progress_percentage integer default 0 check (progress_percentage >= 0 and progress_percentage <= 100),
  
  unique(user_id, course_id)
);

-- Lesson progress table
create table lesson_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  lesson_id uuid references lessons(id) on delete cascade not null,
  course_id uuid references courses(id) on delete cascade not null,
  completion_percentage integer default 0 check (completion_percentage >= 0 and completion_percentage <= 100),
  time_spent_seconds integer default 0 check (time_spent_seconds >= 0),
  completed_at timestamp with time zone,
  last_accessed timestamp with time zone default now(),
  section_progress jsonb default '{}', -- Track progress of individual sections
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  unique(user_id, lesson_id)
);

-- Quiz attempts table
create table quiz_attempts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  lesson_id uuid references lessons(id) on delete cascade not null,
  score integer not null check (score >= 0),
  max_score integer not null check (max_score > 0),
  answers jsonb not null,
  time_taken_seconds integer check (time_taken_seconds >= 0),
  is_passed boolean generated always as (score::decimal / max_score >= 0.7) stored,
  completed_at timestamp with time zone default now()
);

-- Achievements table
create table achievements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  icon text not null,
  badge_color text default 'blue',
  points_value integer default 0 check (points_value >= 0),
  criteria jsonb not null,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- User achievements table
create table user_achievements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  achievement_id uuid references achievements(id) on delete cascade not null,
  earned_at timestamp with time zone default now(),
  
  unique(user_id, achievement_id)
);

-- Course ratings table
create table course_ratings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  course_id uuid references courses(id) on delete cascade not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  review text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  unique(user_id, course_id)
);
```

### Row Level Security Policies
```sql
-- migrations/002_rls_policies.sql

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table courses enable row level security;
alter table lessons enable row level security;
alter table enrollments enable row level security;
alter table lesson_progress enable row level security;
alter table quiz_attempts enable row level security;
alter table achievements enable row level security;
alter table user_achievements enable row level security;
alter table course_ratings enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone" on profiles
  for select using (true);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- Courses policies
create policy "Published courses are viewable by everyone" on courses
  for select using (is_published = true or instructor_id = auth.uid());

create policy "Instructors can manage their courses" on courses
  for all using (instructor_id = auth.uid());

create policy "Admins can manage all courses" on courses
  for all using (
    exists (
      select 1 from profiles 
      where profiles.id = auth.uid() 
      and profiles.role = 'admin'
    )
  );

-- Lessons policies
create policy "Lessons viewable if course is accessible" on lessons
  for select using (
    exists (
      select 1 from courses 
      where courses.id = lessons.course_id 
      and (courses.is_published = true or courses.instructor_id = auth.uid())
    )
  );

-- Enrollments policies
create policy "Users can view their enrollments" on enrollments
  for select using (user_id = auth.uid());

create policy "Users can enroll in courses" on enrollments
  for insert with check (user_id = auth.uid());

-- Progress policies
create policy "Users can view their progress" on lesson_progress
  for select using (user_id = auth.uid());

create policy "Users can update their progress" on lesson_progress
  for all using (user_id = auth.uid());

-- Quiz attempts policies
create policy "Users can view their quiz attempts" on quiz_attempts
  for select using (user_id = auth.uid());

create policy "Users can create quiz attempts" on quiz_attempts
  for insert with check (user_id = auth.uid());

-- Achievements policies
create policy "Achievements are viewable by everyone" on achievements
  for select using (is_active = true);

create policy "User achievements viewable by owner" on user_achievements
  for select using (user_id = auth.uid());

-- Course ratings policies
create policy "Course ratings are viewable by everyone" on course_ratings
  for select using (true);

create policy "Users can manage their ratings" on course_ratings
  for all using (user_id = auth.uid());
```

### Database Functions
```sql
-- migrations/003_functions.sql

-- Function to update course enrollment count
create or replace function update_course_enrollment_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update courses 
    set enrollment_count = enrollment_count + 1 
    where id = NEW.course_id;
    return NEW;
  elsif TG_OP = 'DELETE' then
    update courses 
    set enrollment_count = enrollment_count - 1 
    where id = OLD.course_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql;

-- Trigger for enrollment count
create trigger enrollment_count_trigger
  after insert or delete on enrollments
  for each row execute function update_course_enrollment_count();

-- Function to update course average rating
create or replace function update_course_rating()
returns trigger as $$
begin
  update courses 
  set average_rating = (
    select coalesce(avg(rating), 0) 
    from course_ratings 
    where course_id = COALESCE(NEW.course_id, OLD.course_id)
  )
  where id = COALESCE(NEW.course_id, OLD.course_id);
  
  return COALESCE(NEW, OLD);
end;
$$ language plpgsql;

-- Trigger for course rating
create trigger course_rating_trigger
  after insert or update or delete on course_ratings
  for each row execute function update_course_rating();

-- Function to check and award achievements
create or replace function check_achievements(user_uuid uuid)
returns void as $$
declare
  achievement_record record;
  user_stats record;
begin
  -- Get user statistics
  select 
    (select count(*) from enrollments where user_id = user_uuid and completed_at is not null) as completed_courses,
    (select count(*) from quiz_attempts where user_id = user_uuid and is_passed = true) as passed_quizzes,
    (select streak_days from profiles where id = user_uuid) as current_streak,
    (select points from profiles where id = user_uuid) as total_points
  into user_stats;

  -- Check each achievement
  for achievement_record in 
    select * from achievements where is_active = true
  loop
    -- Check if user already has this achievement
    if not exists (
      select 1 from user_achievements 
      where user_id = user_uuid and achievement_id = achievement_record.id
    ) then
      -- Check achievement criteria (simplified example)
      if (achievement_record.criteria->>'type' = 'course_completion' and 
          user_stats.completed_courses >= (achievement_record.criteria->>'required_count')::integer) or
         (achievement_record.criteria->>'type' = 'quiz_master' and 
          user_stats.passed_quizzes >= (achievement_record.criteria->>'required_count')::integer) or
         (achievement_record.criteria->>'type' = 'streak' and 
          user_stats.current_streak >= (achievement_record.criteria->>'required_days')::integer) then
        
        -- Award achievement
        insert into user_achievements (user_id, achievement_id) 
        values (user_uuid, achievement_record.id);
        
        -- Update user points
        update profiles 
        set points = points + achievement_record.points_value 
        where id = user_uuid;
      end if;
    end if;
  end loop;
end;
$$ language plpgsql;
```

## Supabase Client Configuration

### Client Setup
```typescript
// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from './types'

export const createClient = () => createClientComponentClient<Database>()

// lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from './types'

export const createServerClient = () => 
  createServerComponentClient<Database>({ cookies })

// lib/supabase/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session?.user?.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
}
```

### TypeScript Types Generation
```bash
# Generate types from database
supabase gen types typescript --local > lib/supabase/types.ts
```

## API Route Implementation

### Authentication Routes
```typescript
// app/api/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(requestUrl.origin)
}

// app/api/auth/register/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { registerSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, fullName, username } = registerSchema.parse(body)

    const supabase = createRouteHandlerClient({ cookies })
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username: username,
        },
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ user: data.user })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
```

### Course Management Routes
```typescript
// app/api/courses/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { courseSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { searchParams } = new URL(request.url)
  
  const category = searchParams.get('category')
  const difficulty = searchParams.get('difficulty')
  const search = searchParams.get('search')
  
  let query = supabase
    .from('courses')
    .select(`
      *,
      instructor:profiles(id, full_name, avatar_url),
      lessons(id)
    `)
    .eq('is_published', true)

  if (category) query = query.eq('category', category)
  if (difficulty) query = query.eq('difficulty_level', difficulty)
  if (search) query = query.ilike('title', `%${search}%`)

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ courses: data })
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const courseData = courseSchema.parse(body)

    const { data, error } = await supabase
      .from('courses')
      .insert({
        ...courseData,
        instructor_id: user.id,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ course: data })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
```

### Progress Tracking Routes
```typescript
// app/api/progress/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { progressSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { lessonId, courseId, completionPercentage, timeSpent, sectionProgress } = 
      progressSchema.parse(body)

    const { data, error } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        course_id: courseId,
        completion_percentage: completionPercentage,
        time_spent_seconds: timeSpent,
        section_progress: sectionProgress,
        completed_at: completionPercentage === 100 ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Update course enrollment progress
    await updateCourseProgress(supabase, user.id, courseId)

    // Check for achievements
    await supabase.rpc('check_achievements', { user_uuid: user.id })

    return NextResponse.json({ progress: data })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

async function updateCourseProgress(supabase: any, userId: string, courseId: string) {
  // Get total lessons and completed lessons
  const { data: lessonCounts } = await supabase
    .rpc('get_course_progress', { 
      user_uuid: userId, 
      course_uuid: courseId 
    })

  if (lessonCounts) {
    const progressPercentage = Math.round(
      (lessonCounts.completed_lessons / lessonCounts.total_lessons) * 100
    )

    await supabase
      .from('enrollments')
      .update({
        progress_percentage: progressPercentage,
        completed_at: progressPercentage === 100 ? new Date().toISOString() : null,
      })
      .eq('user_id', userId)
      .eq('course_id', courseId)
  }
}
```

## Edge Functions

### Real-time Notifications
```typescript
// supabase/functions/send-notification/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { type, userId, data } = await req.json()

    // Handle different notification types
    switch (type) {
      case 'achievement_earned':
        await supabase
          .from('notifications')
          .insert({
            user_id: userId,
            type: 'achievement',
            title: 'Achievement Unlocked!',
            message: `You earned the "${data.achievementTitle}" badge`,
            data: data,
          })
        break

      case 'course_completed':
        await supabase
          .from('notifications')
          .insert({
            user_id: userId,
            type: 'course_completion',
            title: 'Course Completed!',
            message: `Congratulations on completing "${data.courseTitle}"`,
            data: data,
          })
        break
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
```

## Storage Configuration

### File Upload Policies
```sql
-- Storage bucket for course content
insert into storage.buckets (id, name, public) values ('course-content', 'course-content', true);

-- Storage policies
create policy "Public course content" on storage.objects
  for select using (bucket_id = 'course-content');

create policy "Instructors can upload course content" on storage.objects
  for insert with check (
    bucket_id = 'course-content' and
    exists (
      select 1 from profiles 
      where profiles.id = auth.uid() 
      and profiles.role in ('instructor', 'admin')
    )
  );
```

### File Upload Utility
```typescript
// lib/upload.ts
import { createClient } from './supabase/client'

export async function uploadFile(file: File, path: string) {
  const supabase = createClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${path}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('course-content')
    .upload(filePath, file)

  if (uploadError) {
    throw uploadError
  }

  const { data } = supabase.storage
    .from('course-content')
    .getPublicUrl(filePath)

  return data.publicUrl
}
```

## Error Handling & Monitoring

### Error Tracking Setup
```typescript
// lib/error-handler.ts
import * as Sentry from '@sentry/nextjs'

export function handleApiError(error: any, context?: string) {
  console.error(`API Error ${context ? `in ${context}` : ''}:`, error)
  
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      tags: { context: context || 'api' },
    })
  }
}

export function createErrorResponse(message: string, status: number = 500) {
  return new Response(
    JSON.stringify({ error: message }),
    { 
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}
```

## Performance Optimization

### Database Indexing
```sql
-- Performance indexes
create index idx_courses_published on courses(is_published) where is_published = true;
create index idx_courses_category on courses(category) where is_published = true;
create index idx_lessons_course_order on lessons(course_id, order_index);
create index idx_progress_user_course on lesson_progress(user_id, course_id);
create index idx_quiz_attempts_user on quiz_attempts(user_id, lesson_id);
create index idx_enrollments_user on enrollments(user_id);
create index idx_achievements_active on achievements(is_active) where is_active = true;
```

### Caching Strategy
```typescript
// lib/cache.ts
import { unstable_cache } from 'next/cache'

export const getCachedCourses = unstable_cache(
  async () => {
    // Fetch courses logic
  },
  ['courses'],
  { revalidate: 300 } // 5 minutes
)

export const getCachedLeaderboard = unstable_cache(
  async () => {
    // Fetch leaderboard logic
  },
  ['leaderboard'],
  { revalidate: 60 } // 1 minute
)
```