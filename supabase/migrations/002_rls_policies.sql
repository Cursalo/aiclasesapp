-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.course_categories enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.course_reviews enable row level security;
alter table public.review_helpfulness enable row level security;
alter table public.discussions enable row level security;
alter table public.discussion_replies enable row level security;
alter table public.learning_streaks enable row level security;
alter table public.notifications enable row level security;
alter table public.learning_paths enable row level security;
alter table public.learning_path_courses enable row level security;
alter table public.learning_path_enrollments enable row level security;

-- Helper function to check if user is admin
create or replace function public.is_admin(user_uuid uuid default auth.uid())
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles 
    where id = user_uuid and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Helper function to check if user is instructor
create or replace function public.is_instructor(user_uuid uuid default auth.uid())
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles 
    where id = user_uuid and role in ('instructor', 'admin')
  );
end;
$$ language plpgsql security definer;

-- Helper function to check if user owns course
create or replace function public.owns_course(course_uuid uuid, user_uuid uuid default auth.uid())
returns boolean as $$
begin
  return exists (
    select 1 from public.courses 
    where id = course_uuid and instructor_id = user_uuid
  );
end;
$$ language plpgsql security definer;

-- Helper function to check if user is enrolled in course
create or replace function public.is_enrolled(course_uuid uuid, user_uuid uuid default auth.uid())
returns boolean as $$
begin
  return exists (
    select 1 from public.enrollments 
    where course_id = course_uuid and user_id = user_uuid
  );
end;
$$ language plpgsql security definer;

-- Profiles policies
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Admins can update any profile" on public.profiles
  for update using (public.is_admin());

create policy "Users cannot delete profiles" on public.profiles
  for delete using (false);

-- Course categories policies
create policy "Categories are viewable by everyone" on public.course_categories
  for select using (is_active = true);

create policy "Only admins can manage categories" on public.course_categories
  for all using (public.is_admin());

-- Courses policies
create policy "Published courses are viewable by everyone" on public.courses
  for select using (
    is_published = true or 
    instructor_id = auth.uid() or 
    public.is_admin()
  );

create policy "Instructors can create courses" on public.courses
  for insert with check (
    public.is_instructor() and 
    instructor_id = auth.uid()
  );

create policy "Instructors can update their own courses" on public.courses
  for update using (
    instructor_id = auth.uid() or 
    public.is_admin()
  );

create policy "Only admins can delete courses" on public.courses
  for delete using (public.is_admin());

-- Lessons policies
create policy "Lessons are viewable if course is accessible" on public.lessons
  for select using (
    exists (
      select 1 from public.courses 
      where courses.id = lessons.course_id 
      and (
        courses.is_published = true or 
        courses.instructor_id = auth.uid() or 
        public.is_admin()
      )
    )
  );

create policy "Course owners can manage lessons" on public.lessons
  for all using (
    public.owns_course(course_id) or 
    public.is_admin()
  );

-- Enrollments policies
create policy "Users can view their own enrollments" on public.enrollments
  for select using (
    user_id = auth.uid() or 
    public.owns_course(course_id) or 
    public.is_admin()
  );

create policy "Users can enroll in published courses" on public.enrollments
  for insert with check (
    user_id = auth.uid() and 
    exists (
      select 1 from public.courses 
      where id = course_id and is_published = true
    )
  );

create policy "Users can update their own enrollments" on public.enrollments
  for update using (user_id = auth.uid());

create policy "Users can unenroll from courses" on public.enrollments
  for delete using (
    user_id = auth.uid() or 
    public.is_admin()
  );

-- Lesson progress policies
create policy "Users can view their own progress" on public.lesson_progress
  for select using (
    user_id = auth.uid() or 
    public.owns_course(course_id) or 
    public.is_admin()
  );

create policy "Users can manage their own progress" on public.lesson_progress
  for all using (user_id = auth.uid());

-- Quiz policies
create policy "Quizzes are viewable with lesson access" on public.quizzes
  for select using (
    exists (
      select 1 from public.lessons l
      join public.courses c on c.id = l.course_id
      where l.id = quizzes.lesson_id
      and (
        c.is_published = true or 
        c.instructor_id = auth.uid() or 
        public.is_admin()
      )
    )
  );

create policy "Course owners can manage quizzes" on public.quizzes
  for all using (
    exists (
      select 1 from public.lessons l
      where l.id = quizzes.lesson_id
      and (public.owns_course(l.course_id) or public.is_admin())
    )
  );

-- Quiz questions policies
create policy "Quiz questions are viewable with quiz access" on public.quiz_questions
  for select using (
    exists (
      select 1 from public.quizzes q
      join public.lessons l on l.id = q.lesson_id
      join public.courses c on c.id = l.course_id
      where q.id = quiz_questions.quiz_id
      and (
        c.is_published = true or 
        c.instructor_id = auth.uid() or 
        public.is_admin()
      )
    )
  );

create policy "Course owners can manage quiz questions" on public.quiz_questions
  for all using (
    exists (
      select 1 from public.quizzes q
      join public.lessons l on l.id = q.lesson_id
      where q.id = quiz_questions.quiz_id
      and (public.owns_course(l.course_id) or public.is_admin())
    )
  );

-- Quiz attempts policies
create policy "Users can view their own quiz attempts" on public.quiz_attempts
  for select using (
    user_id = auth.uid() or 
    exists (
      select 1 from public.lessons l
      where l.id = quiz_attempts.lesson_id
      and (public.owns_course(l.course_id) or public.is_admin())
    )
  );

create policy "Users can create their own quiz attempts" on public.quiz_attempts
  for insert with check (user_id = auth.uid());

create policy "Users cannot update quiz attempts" on public.quiz_attempts
  for update using (false);

create policy "Users cannot delete quiz attempts" on public.quiz_attempts
  for delete using (false);

-- Achievements policies
create policy "Active achievements are viewable by everyone" on public.achievements
  for select using (is_active = true);

create policy "Only admins can manage achievements" on public.achievements
  for all using (public.is_admin());

-- User achievements policies
create policy "Users can view their own achievements" on public.user_achievements
  for select using (
    user_id = auth.uid() or 
    public.is_admin()
  );

create policy "System can award achievements" on public.user_achievements
  for insert with check (true);

create policy "Users cannot update achievements" on public.user_achievements
  for update using (false);

create policy "Users cannot delete achievements" on public.user_achievements
  for delete using (public.is_admin());

-- Course reviews policies
create policy "Course reviews are viewable by everyone" on public.course_reviews
  for select using (true);

create policy "Users can create reviews for enrolled courses" on public.course_reviews
  for insert with check (
    user_id = auth.uid() and 
    public.is_enrolled(course_id)
  );

create policy "Users can update their own reviews" on public.course_reviews
  for update using (user_id = auth.uid());

create policy "Users can delete their own reviews" on public.course_reviews
  for delete using (
    user_id = auth.uid() or 
    public.is_admin()
  );

-- Review helpfulness policies
create policy "Review helpfulness is viewable by everyone" on public.review_helpfulness
  for select using (true);

create policy "Users can mark reviews as helpful" on public.review_helpfulness
  for all using (user_id = auth.uid());

-- Discussions policies
create policy "Discussions are viewable by enrolled users" on public.discussions
  for select using (
    (course_id is not null and public.is_enrolled(course_id)) or
    (lesson_id is not null and exists (
      select 1 from public.lessons l
      where l.id = discussions.lesson_id
      and public.is_enrolled(l.course_id)
    )) or
    user_id = auth.uid() or
    public.is_admin()
  );

create policy "Enrolled users can create discussions" on public.discussions
  for insert with check (
    user_id = auth.uid() and (
      (course_id is not null and public.is_enrolled(course_id)) or
      (lesson_id is not null and exists (
        select 1 from public.lessons l
        where l.id = discussions.lesson_id
        and public.is_enrolled(l.course_id)
      ))
    )
  );

create policy "Users can update their own discussions" on public.discussions
  for update using (
    user_id = auth.uid() or 
    public.is_admin()
  );

create policy "Users can delete their own discussions" on public.discussions
  for delete using (
    user_id = auth.uid() or 
    public.is_admin()
  );

-- Discussion replies policies
create policy "Discussion replies are viewable with discussion access" on public.discussion_replies
  for select using (
    exists (
      select 1 from public.discussions d
      where d.id = discussion_replies.discussion_id
      and (
        (d.course_id is not null and public.is_enrolled(d.course_id)) or
        (d.lesson_id is not null and exists (
          select 1 from public.lessons l
          where l.id = d.lesson_id
          and public.is_enrolled(l.course_id)
        )) or
        d.user_id = auth.uid() or
        public.is_admin()
      )
    )
  );

create policy "Users can create replies in accessible discussions" on public.discussion_replies
  for insert with check (
    user_id = auth.uid() and 
    exists (
      select 1 from public.discussions d
      where d.id = discussion_replies.discussion_id
      and (
        (d.course_id is not null and public.is_enrolled(d.course_id)) or
        (d.lesson_id is not null and exists (
          select 1 from public.lessons l
          where l.id = d.lesson_id
          and public.is_enrolled(l.course_id)
        ))
      )
    )
  );

create policy "Users can update their own replies" on public.discussion_replies
  for update using (
    user_id = auth.uid() or 
    public.is_admin()
  );

create policy "Users can delete their own replies" on public.discussion_replies
  for delete using (
    user_id = auth.uid() or 
    public.is_admin()
  );

-- Learning streaks policies
create policy "Users can view their own streaks" on public.learning_streaks
  for select using (
    user_id = auth.uid() or 
    public.is_admin()
  );

create policy "Users can manage their own streaks" on public.learning_streaks
  for all using (user_id = auth.uid());

-- Notifications policies
create policy "Users can view their own notifications" on public.notifications
  for select using (user_id = auth.uid());

create policy "System can create notifications" on public.notifications
  for insert with check (true);

create policy "Users can update their own notifications" on public.notifications
  for update using (user_id = auth.uid());

create policy "Users can delete their own notifications" on public.notifications
  for delete using (user_id = auth.uid());

-- Learning paths policies
create policy "Published learning paths are viewable by everyone" on public.learning_paths
  for select using (
    is_published = true or 
    created_by = auth.uid() or 
    public.is_admin()
  );

create policy "Instructors can create learning paths" on public.learning_paths
  for insert with check (
    public.is_instructor() and 
    created_by = auth.uid()
  );

create policy "Creators can update their own learning paths" on public.learning_paths
  for update using (
    created_by = auth.uid() or 
    public.is_admin()
  );

create policy "Only admins can delete learning paths" on public.learning_paths
  for delete using (public.is_admin());

-- Learning path courses policies
create policy "Learning path courses are viewable with path access" on public.learning_path_courses
  for select using (
    exists (
      select 1 from public.learning_paths lp
      where lp.id = learning_path_courses.learning_path_id
      and (
        lp.is_published = true or 
        lp.created_by = auth.uid() or 
        public.is_admin()
      )
    )
  );

create policy "Path creators can manage path courses" on public.learning_path_courses
  for all using (
    exists (
      select 1 from public.learning_paths lp
      where lp.id = learning_path_courses.learning_path_id
      and (lp.created_by = auth.uid() or public.is_admin())
    )
  );

-- Learning path enrollments policies
create policy "Users can view their own path enrollments" on public.learning_path_enrollments
  for select using (
    user_id = auth.uid() or 
    public.is_admin()
  );

create policy "Users can enroll in published learning paths" on public.learning_path_enrollments
  for insert with check (
    user_id = auth.uid() and 
    exists (
      select 1 from public.learning_paths lp
      where lp.id = learning_path_id and lp.is_published = true
    )
  );

create policy "Users can update their own path enrollments" on public.learning_path_enrollments
  for update using (user_id = auth.uid());

create policy "Users can unenroll from learning paths" on public.learning_path_enrollments
  for delete using (
    user_id = auth.uid() or 
    public.is_admin()
  );