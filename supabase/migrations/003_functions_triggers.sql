-- Function to handle user profile creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'username', new.email),
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  
  -- Initialize learning streak
  insert into public.learning_streaks (user_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user profile creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update course enrollment count
create or replace function public.update_course_enrollment_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.courses 
    set enrollment_count = enrollment_count + 1 
    where id = NEW.course_id;
    return NEW;
  elsif TG_OP = 'DELETE' then
    update public.courses 
    set enrollment_count = enrollment_count - 1 
    where id = OLD.course_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer;

-- Trigger for enrollment count
create trigger enrollment_count_trigger
  after insert or delete on public.enrollments
  for each row execute function public.update_course_enrollment_count();

-- Function to update course average rating
create or replace function public.update_course_rating()
returns trigger as $$
declare
  course_uuid uuid;
  avg_rating decimal(3,2);
  review_count integer;
begin
  -- Get course ID from NEW or OLD record
  course_uuid := coalesce(NEW.course_id, OLD.course_id);
  
  -- Calculate new average rating and count
  select 
    coalesce(avg(rating), 0),
    count(*)
  into avg_rating, review_count
  from public.course_reviews 
  where course_id = course_uuid;
  
  -- Update course with new rating and count
  update public.courses 
  set 
    average_rating = avg_rating,
    total_reviews = review_count,
    updated_at = now()
  where id = course_uuid;
  
  return coalesce(NEW, OLD);
end;
$$ language plpgsql security definer;

-- Trigger for course rating updates
create trigger course_rating_trigger
  after insert or update or delete on public.course_reviews
  for each row execute function public.update_course_rating();

-- Function to update enrollment progress based on lesson progress
create or replace function public.update_enrollment_progress()
returns trigger as $$
declare
  total_lessons integer;
  completed_lessons integer;
  progress_percentage integer;
begin
  -- Count total lessons in the course
  select count(*) into total_lessons
  from public.lessons
  where course_id = NEW.course_id;
  
  -- Count completed lessons for this user
  select count(*) into completed_lessons
  from public.lesson_progress
  where user_id = NEW.user_id 
    and course_id = NEW.course_id 
    and completion_percentage = 100;
  
  -- Calculate progress percentage
  if total_lessons > 0 then
    progress_percentage := (completed_lessons * 100) / total_lessons;
  else
    progress_percentage := 0;
  end if;
  
  -- Update enrollment progress
  update public.enrollments
  set 
    progress_percentage = progress_percentage,
    completed_at = case 
      when progress_percentage = 100 then now() 
      else null 
    end,
    updated_at = now()
  where user_id = NEW.user_id and course_id = NEW.course_id;
  
  return NEW;
end;
$$ language plpgsql security definer;

-- Trigger for enrollment progress updates
create trigger update_enrollment_progress_trigger
  after insert or update on public.lesson_progress
  for each row execute function public.update_enrollment_progress();

-- Function to check and award achievements
create or replace function public.check_achievements(user_uuid uuid)
returns void as $$
declare
  achievement_record record;
  user_stats record;
  criteria_type text;
  required_value integer;
  current_value integer;
begin
  -- Get comprehensive user statistics
  select 
    (select count(*) from public.enrollments where user_id = user_uuid and completed_at is not null) as completed_courses,
    (select count(*) from public.quiz_attempts where user_id = user_uuid and is_passed = true) as passed_quizzes,
    (select count(*) from public.quiz_attempts where user_id = user_uuid and percentage_score = 100) as perfect_quizzes,
    (select current_streak from public.learning_streaks where user_id = user_uuid) as current_streak,
    (select longest_streak from public.learning_streaks where user_id = user_uuid) as longest_streak,
    (select points from public.profiles where id = user_uuid) as total_points,
    (select count(*) from public.lesson_progress where user_id = user_uuid and completion_percentage = 100) as completed_lessons
  into user_stats;

  -- Check each active achievement
  for achievement_record in 
    select * from public.achievements where is_active = true
  loop
    -- Skip if user already has this achievement
    if exists (
      select 1 from public.user_achievements 
      where user_id = user_uuid and achievement_id = achievement_record.id
    ) then
      continue;
    end if;
    
    -- Parse achievement criteria
    criteria_type := achievement_record.criteria->>'type';
    required_value := (achievement_record.criteria->>'value')::integer;
    
    -- Check different achievement types
    case criteria_type
      when 'course_completion' then
        current_value := user_stats.completed_courses;
      when 'quiz_master' then
        current_value := user_stats.passed_quizzes;
      when 'perfect_quiz' then
        current_value := user_stats.perfect_quizzes;
      when 'streak_current' then
        current_value := user_stats.current_streak;
      when 'streak_longest' then
        current_value := user_stats.longest_streak;
      when 'points_total' then
        current_value := user_stats.total_points;
      when 'lessons_completed' then
        current_value := user_stats.completed_lessons;
      else
        continue; -- Skip unknown criteria types
    end case;
    
    -- Award achievement if criteria met
    if current_value >= required_value then
      insert into public.user_achievements (user_id, achievement_id) 
      values (user_uuid, achievement_record.id);
      
      -- Update user points
      update public.profiles 
      set 
        points = points + achievement_record.points_value,
        updated_at = now()
      where id = user_uuid;
      
      -- Create notification
      insert into public.notifications (user_id, type, title, message, data)
      values (
        user_uuid,
        'achievement_earned',
        'Achievement Unlocked!',
        'You earned the "' || achievement_record.title || '" achievement!',
        jsonb_build_object(
          'achievement_id', achievement_record.id,
          'achievement_title', achievement_record.title,
          'points_earned', achievement_record.points_value
        )
      );
    end if;
  end loop;
end;
$$ language plpgsql security definer;

-- Function to update learning streaks
create or replace function public.update_learning_streak(user_uuid uuid)
returns void as $$
declare
  streak_record record;
  today date := current_date;
  yesterday date := current_date - interval '1 day';
  has_activity_today boolean;
  has_activity_yesterday boolean;
begin
  -- Check if user has learning activity today
  select exists (
    select 1 from public.lesson_progress 
    where user_id = user_uuid 
      and date(updated_at) = today
      and completion_percentage > 0
  ) into has_activity_today;
  
  -- Check if user had activity yesterday
  select exists (
    select 1 from public.lesson_progress 
    where user_id = user_uuid 
      and date(updated_at) = yesterday
      and completion_percentage > 0
  ) into has_activity_yesterday;
  
  -- Get current streak data
  select * into streak_record
  from public.learning_streaks
  where user_id = user_uuid;
  
  if not found then
    -- Create streak record if it doesn't exist
    insert into public.learning_streaks (user_id, current_streak, longest_streak, last_activity_date)
    values (user_uuid, 0, 0, today);
    return;
  end if;
  
  -- Update streak based on activity
  if has_activity_today then
    if streak_record.last_activity_date = yesterday or streak_record.last_activity_date = today then
      -- Continue or maintain streak
      if streak_record.last_activity_date = yesterday then
        update public.learning_streaks
        set 
          current_streak = current_streak + 1,
          longest_streak = greatest(longest_streak, current_streak + 1),
          last_activity_date = today,
          updated_at = now()
        where user_id = user_uuid;
      end if;
    else
      -- Reset streak (gap in activity)
      update public.learning_streaks
      set 
        current_streak = 1,
        last_activity_date = today,
        updated_at = now()
      where user_id = user_uuid;
    end if;
    
    -- Update profile streak_days
    update public.profiles
    set 
      streak_days = (select current_streak from public.learning_streaks where user_id = user_uuid),
      updated_at = now()
    where id = user_uuid;
  elsif streak_record.last_activity_date < yesterday then
    -- Break streak (no activity yesterday or today)
    update public.learning_streaks
    set 
      current_streak = 0,
      updated_at = now()
    where user_id = user_uuid;
    
    update public.profiles
    set 
      streak_days = 0,
      updated_at = now()
    where id = user_uuid;
  end if;
end;
$$ language plpgsql security definer;

-- Function to award points for activities
create or replace function public.award_points()
returns trigger as $$
declare
  points_to_award integer := 0;
  difficulty_multiplier decimal := 1.0;
  course_difficulty text;
begin
  -- Get course difficulty for multiplier
  select difficulty_level into course_difficulty
  from public.courses c
  join public.lessons l on l.course_id = c.id
  where l.id = NEW.lesson_id;
  
  -- Set difficulty multiplier
  case course_difficulty
    when 'beginner' then difficulty_multiplier := 1.0;
    when 'intermediate' then difficulty_multiplier := 1.5;
    when 'advanced' then difficulty_multiplier := 2.0;
    else difficulty_multiplier := 1.0;
  end case;
  
  -- Award points based on completion
  if TG_TABLE_NAME = 'lesson_progress' then
    if OLD.completion_percentage < 100 and NEW.completion_percentage = 100 then
      points_to_award := round(10 * difficulty_multiplier);
    end if;
  elsif TG_TABLE_NAME = 'quiz_attempts' then
    if NEW.is_passed then
      points_to_award := round(20 * difficulty_multiplier);
      -- Bonus for perfect score
      if NEW.percentage_score = 100 then
        points_to_award := points_to_award + 10;
      end if;
    end if;
  end if;
  
  -- Update user points
  if points_to_award > 0 then
    update public.profiles
    set 
      points = points + points_to_award,
      updated_at = now()
    where id = NEW.user_id;
  end if;
  
  return NEW;
end;
$$ language plpgsql security definer;

-- Triggers for point awarding
create trigger award_lesson_points_trigger
  after update on public.lesson_progress
  for each row execute function public.award_points();

create trigger award_quiz_points_trigger
  after insert on public.quiz_attempts
  for each row execute function public.award_points();

-- Function to update discussion counts
create or replace function public.update_discussion_counts()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.discussions
    set 
      reply_count = reply_count + 1,
      last_activity_at = now()
    where id = NEW.discussion_id;
    return NEW;
  elsif TG_OP = 'DELETE' then
    update public.discussions
    set reply_count = reply_count - 1
    where id = OLD.discussion_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer;

-- Trigger for discussion reply counts
create trigger discussion_reply_count_trigger
  after insert or delete on public.discussion_replies
  for each row execute function public.update_discussion_counts();

-- Function to update review helpfulness counts
create or replace function public.update_review_helpfulness_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    if NEW.is_helpful then
      update public.course_reviews
      set helpful_count = helpful_count + 1
      where id = NEW.review_id;
    end if;
    return NEW;
  elsif TG_OP = 'UPDATE' then
    if OLD.is_helpful and not NEW.is_helpful then
      update public.course_reviews
      set helpful_count = helpful_count - 1
      where id = NEW.review_id;
    elsif not OLD.is_helpful and NEW.is_helpful then
      update public.course_reviews
      set helpful_count = helpful_count + 1
      where id = NEW.review_id;
    end if;
    return NEW;
  elsif TG_OP = 'DELETE' then
    if OLD.is_helpful then
      update public.course_reviews
      set helpful_count = helpful_count - 1
      where id = OLD.review_id;
    end if;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer;

-- Trigger for review helpfulness counts
create trigger review_helpfulness_count_trigger
  after insert or update or delete on public.review_helpfulness
  for each row execute function public.update_review_helpfulness_count();

-- Function to update timestamps
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language plpgsql;

-- Triggers for updating timestamps
create trigger update_profiles_updated_at before update on public.profiles
  for each row execute function public.update_updated_at_column();

create trigger update_courses_updated_at before update on public.courses
  for each row execute function public.update_updated_at_column();

create trigger update_lessons_updated_at before update on public.lessons
  for each row execute function public.update_updated_at_column();

create trigger update_lesson_progress_updated_at before update on public.lesson_progress
  for each row execute function public.update_updated_at_column();

create trigger update_quizzes_updated_at before update on public.quizzes
  for each row execute function public.update_updated_at_column();

create trigger update_achievements_updated_at before update on public.achievements
  for each row execute function public.update_updated_at_column();

create trigger update_course_reviews_updated_at before update on public.course_reviews
  for each row execute function public.update_updated_at_column();

create trigger update_discussions_updated_at before update on public.discussions
  for each row execute function public.update_updated_at_column();

create trigger update_discussion_replies_updated_at before update on public.discussion_replies
  for each row execute function public.update_updated_at_column();

create trigger update_learning_streaks_updated_at before update on public.learning_streaks
  for each row execute function public.update_updated_at_column();

create trigger update_learning_paths_updated_at before update on public.learning_paths
  for each row execute function public.update_updated_at_column();