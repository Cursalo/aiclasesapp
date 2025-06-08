-- Seed data for development
-- Insert course categories
insert into public.course_categories (id, name, description, icon, color, sort_order) values
  (gen_random_uuid(), 'Web Development', 'Frontend and backend web technologies', 'Code', '#3b82f6', 1),
  (gen_random_uuid(), 'Mobile Development', 'iOS, Android, and cross-platform development', 'Smartphone', '#10b981', 2),
  (gen_random_uuid(), 'Data Science', 'Analytics, machine learning, and AI', 'BarChart', '#8b5cf6', 3),
  (gen_random_uuid(), 'DevOps', 'Infrastructure, deployment, and automation', 'Server', '#f59e0b', 4),
  (gen_random_uuid(), 'Design', 'UI/UX design and graphics', 'Palette', '#ec4899', 5),
  (gen_random_uuid(), 'Business', 'Entrepreneurship and business skills', 'Briefcase', '#64748b', 6);

-- Create sample admin user profile (will need actual auth user first)
-- This would typically be done after user registration
/*
insert into public.profiles (id, username, full_name, role, bio) values
  ('00000000-0000-0000-0000-000000000001', 'admin', 'System Administrator', 'admin', 'Platform administrator');
*/

-- Insert sample achievements
insert into public.achievements (id, title, description, icon, badge_color, category, points_value, criteria, rarity) values
  (gen_random_uuid(), 'First Steps', 'Complete your first lesson', 'Star', 'blue', 'learning', 10, '{"type": "lessons_completed", "value": 1}', 'common'),
  (gen_random_uuid(), 'Getting Started', 'Complete your first course', 'Award', 'green', 'learning', 50, '{"type": "course_completion", "value": 1}', 'common'),
  (gen_random_uuid(), 'Dedicated Learner', 'Complete 5 courses', 'Trophy', 'purple', 'learning', 200, '{"type": "course_completion", "value": 5}', 'uncommon'),
  (gen_random_uuid(), 'Scholar', 'Complete 10 courses', 'GraduationCap', 'gold', 'learning', 500, '{"type": "course_completion", "value": 10}', 'rare'),
  (gen_random_uuid(), 'Quiz Master', 'Pass 10 quizzes', 'CheckCircle', 'blue', 'assessment', 100, '{"type": "quiz_master", "value": 10}', 'common'),
  (gen_random_uuid(), 'Perfect Score', 'Get a perfect score on a quiz', 'Target', 'gold', 'assessment', 25, '{"type": "perfect_quiz", "value": 1}', 'uncommon'),
  (gen_random_uuid(), 'Perfectionist', 'Get 5 perfect quiz scores', 'Zap', 'purple', 'assessment', 150, '{"type": "perfect_quiz", "value": 5}', 'rare'),
  (gen_random_uuid(), 'Streak Starter', 'Maintain a 3-day learning streak', 'Flame', 'orange', 'consistency', 30, '{"type": "streak_current", "value": 3}', 'common'),
  (gen_random_uuid(), 'Week Warrior', 'Maintain a 7-day learning streak', 'Calendar', 'red', 'consistency', 75, '{"type": "streak_current", "value": 7}', 'uncommon'),
  (gen_random_uuid(), 'Month Master', 'Maintain a 30-day learning streak', 'Crown', 'gold', 'consistency', 300, '{"type": "streak_current", "value": 30}', 'epic'),
  (gen_random_uuid(), 'Point Collector', 'Earn 1000 points', 'Coins', 'yellow', 'points', 0, '{"type": "points_total", "value": 1000}', 'common'),
  (gen_random_uuid(), 'High Achiever', 'Earn 5000 points', 'TrendingUp', 'purple', 'points', 0, '{"type": "points_total", "value": 5000}', 'rare'),
  (gen_random_uuid(), 'Legend', 'Earn 10000 points', 'Sparkles', 'gold', 'points', 0, '{"type": "points_total", "value": 10000}', 'legendary');

-- Insert sample course (instructor will be set when real users are created)
insert into public.courses (
  id, 
  title, 
  description, 
  long_description,
  difficulty_level, 
  estimated_duration_hours,
  is_published,
  is_featured,
  tags,
  category,
  prerequisites,
  learning_outcomes
) values (
  gen_random_uuid(),
  'React Fundamentals',
  'Learn the basics of React, the popular JavaScript library for building user interfaces.',
  'This comprehensive course covers everything you need to know to get started with React. You''ll learn about components, props, state, event handling, and much more. By the end of this course, you''ll be able to build interactive web applications using React.',
  'beginner',
  8,
  true,
  true,
  array['react', 'javascript', 'frontend', 'web development'],
  'Web Development',
  array['Basic JavaScript knowledge', 'HTML and CSS familiarity'],
  array[
    'Understand React components and JSX',
    'Manage component state effectively',
    'Handle user events and interactions',
    'Build reusable UI components',
    'Create a complete React application'
  ]
);

-- Get the course ID for lesson insertion
-- Note: In a real scenario, you'd use the actual course ID
with course_data as (
  select id as course_id from public.courses where title = 'React Fundamentals' limit 1
)
insert into public.lessons (
  course_id,
  title,
  description,
  component_path,
  order_index,
  estimated_duration_minutes,
  is_free,
  learning_objectives
)
select 
  course_data.course_id,
  lesson_title,
  lesson_description,
  lesson_path,
  lesson_order,
  lesson_duration,
  lesson_free,
  lesson_objectives
from course_data,
(values
  ('What is React?', 'Introduction to React and its core concepts', 'react-fundamentals/what-is-react', 1, 30, true, array['Understand what React is', 'Learn why React is popular']),
  ('Setting Up Your Environment', 'Setting up a React development environment', 'react-fundamentals/setup-environment', 2, 25, true, array['Install Node.js and npm', 'Create a React application']),
  ('JSX Syntax', 'Understanding JSX and how to use it', 'react-fundamentals/jsx-syntax', 3, 35, false, array['Write JSX syntax', 'Understand JSX expressions']),
  ('Components and Props', 'Creating reusable components with props', 'react-fundamentals/components-props', 4, 45, false, array['Create functional components', 'Pass data with props']),
  ('State and Events', 'Managing component state and handling events', 'react-fundamentals/state-events', 5, 50, false, array['Use useState hook', 'Handle user events']),
  ('Building Your First App', 'Putting it all together in a complete application', 'react-fundamentals/first-app', 6, 60, false, array['Build a complete React app', 'Apply learned concepts'])
) as lessons(lesson_title, lesson_description, lesson_path, lesson_order, lesson_duration, lesson_free, lesson_objectives);

-- Insert sample quiz for the first lesson
with lesson_data as (
  select l.id as lesson_id 
  from public.lessons l 
  join public.courses c on c.id = l.course_id 
  where c.title = 'React Fundamentals' and l.title = 'What is React?' 
  limit 1
)
insert into public.quizzes (
  lesson_id,
  title,
  description,
  instructions,
  max_attempts,
  passing_score,
  show_correct_answers
)
select 
  lesson_data.lesson_id,
  'React Basics Quiz',
  'Test your understanding of React fundamentals',
  'Answer all questions to the best of your ability. You have 3 attempts to pass.',
  3,
  70,
  true
from lesson_data;

-- Insert sample quiz questions
with quiz_data as (
  select q.id as quiz_id
  from public.quizzes q
  join public.lessons l on l.id = q.lesson_id
  join public.courses c on c.id = l.course_id
  where c.title = 'React Fundamentals' and l.title = 'What is React?'
  limit 1
)
insert into public.quiz_questions (
  quiz_id,
  question_type,
  question_text,
  options,
  correct_answers,
  explanation,
  points,
  order_index
)
select 
  quiz_data.quiz_id,
  question_type::question_type,
  question_text,
  options::jsonb,
  correct_answers::jsonb,
  explanation,
  points,
  order_index
from quiz_data,
(values
  ('multiple_choice', 'What is React primarily used for?', '["Building user interfaces", "Database management", "Server administration", "Mobile app deployment"]', '[0]', 'React is a JavaScript library specifically designed for building user interfaces.', 1, 1),
  ('multiple_choice', 'React was created by which company?', '["Google", "Microsoft", "Facebook", "Apple"]', '[2]', 'React was created and is maintained by Facebook (now Meta).', 1, 2),
  ('true_false', 'React components must always return a single element.', '["True", "False"]', '[0]', 'React components must return a single root element, though this can contain multiple children.', 1, 3),
  ('multiple_select', 'Which of the following are benefits of using React?', '["Component reusability", "Virtual DOM", "Large bundle size", "Steep learning curve", "Declarative programming"]', '[0, 1, 4]', 'React offers component reusability, virtual DOM for performance, and declarative programming. Large bundle size and steep learning curve are potential drawbacks.', 2, 4)
) as questions(question_type, question_text, options, correct_answers, explanation, points, order_index);

-- Note: Additional sample data like user profiles, enrollments, and progress
-- would typically be created through the application interface or separate
-- scripts after authentication is set up, as they require actual user IDs.