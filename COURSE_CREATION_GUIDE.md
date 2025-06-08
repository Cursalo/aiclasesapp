# Course Creation Guide

This guide will walk you through creating a complete course with lessons in your LMS. You'll need to add data to your Supabase database tables.

## 📋 Prerequisites

Before creating a course, ensure you have:
- Supabase project set up and running
- Database tables created (see database schema)
- Admin/Instructor access to your LMS

## 🗄️ Database Tables Overview

Your course data will be stored in these main tables:
- `courses` - Course metadata
- `lessons` - Individual lesson content
- `course_lessons` - Links lessons to courses with ordering
- `course_enrollments` - User course enrollments
- `lesson_progress` - User lesson progress tracking

## 📚 Step 1: Create a Course

Insert a new course into the `courses` table:

```sql
INSERT INTO courses (
  id,
  title,
  description,
  instructor_id,
  instructor_name,
  category,
  difficulty,
  price,
  currency,
  duration_hours,
  lessons_count,
  rating,
  students_count,
  is_published,
  tags,
  learning_objectives,
  requirements,
  created_at,
  updated_at
) VALUES (
  'course-javascript-basics',
  'JavaScript Fundamentals',
  'Master the core concepts of JavaScript programming from variables to functions, DOM manipulation, and modern ES6+ features. Perfect for beginners starting their web development journey.',
  'instructor-001',
  'John Smith',
  'programming',
  'beginner',
  49.99,
  'USD',
  8,
  12,
  4.8,
  1250,
  true,
  '["javascript", "programming", "web-development", "beginner"]',
  '[
    "Understand JavaScript syntax and core concepts",
    "Work with variables, functions, and objects",
    "Manipulate the DOM and handle events",
    "Use modern ES6+ features like arrow functions and destructuring",
    "Build interactive web applications"
  ]',
  '[
    "Basic understanding of HTML and CSS",
    "A computer with internet access",
    "Code editor (VS Code recommended)"
  ]',
  NOW(),
  NOW()
);
```

## 📖 Step 2: Create Lessons

Insert lessons into the `lessons` table. Here are examples of different lesson types:

### Video Lesson
```sql
INSERT INTO lessons (
  id,
  title,
  description,
  type,
  content,
  duration_minutes,
  is_free,
  created_at,
  updated_at
) VALUES (
  'lesson-js-intro',
  'Introduction to JavaScript',
  'Learn what JavaScript is, its history, and why it\'s essential for web development.',
  'video',
  '{
    "video_url": "https://example.com/videos/js-intro.mp4",
    "transcript": "Welcome to JavaScript Fundamentals! In this lesson, we will explore what JavaScript is and why it has become one of the most popular programming languages in the world...",
    "notes": [
      "JavaScript was created in 1995 by Brendan Eich",
      "Originally designed for web browsers",
      "Now used for servers, mobile apps, and desktop applications"
    ]
  }',
  15,
  true,
  NOW(),
  NOW()
);
```

### Text Lesson
```sql
INSERT INTO lessons (
  id,
  title,
  description,
  type,
  content,
  duration_minutes,
  is_free,
  created_at,
  updated_at
) VALUES (
  'lesson-js-variables',
  'Variables and Data Types',
  'Understanding how to declare variables and work with different data types in JavaScript.',
  'text',
  '{
    "markdown": "# Variables and Data Types\n\n## What are Variables?\n\nVariables are containers that store data values. In JavaScript, you can declare variables using `var`, `let`, or `const`.\n\n```javascript\nlet name = \"John\";\nconst age = 25;\nvar isStudent = true;\n```\n\n## Data Types\n\nJavaScript has several primitive data types:\n\n### 1. String\n```javascript\nlet message = \"Hello, World!\";\nlet greeting = \'Welcome to JavaScript\';\n```\n\n### 2. Number\n```javascript\nlet count = 42;\nlet price = 19.99;\n```\n\n### 3. Boolean\n```javascript\nlet isLoggedIn = true;\nlet hasPermission = false;\n```\n\n### 4. Undefined\n```javascript\nlet undefinedVar;\nconsole.log(undefinedVar); // undefined\n```\n\n### 5. Null\n```javascript\nlet emptyValue = null;\n```\n\n## Variable Naming Rules\n\n- Must start with a letter, underscore (_), or dollar sign ($)\n- Cannot start with a number\n- Case sensitive\n- Cannot use reserved keywords\n\n## Best Practices\n\n- Use descriptive names\n- Use camelCase for multi-word variables\n- Use `const` for values that won\'t change\n- Use `let` for values that will change\n- Avoid `var` in modern JavaScript",
    "estimated_reading_time": 8
  }',
  10,
  false,
  NOW(),
  NOW()
);
```

### Code Exercise Lesson
```sql
INSERT INTO lessons (
  id,
  title,
  description,
  type,
  content,
  duration_minutes,
  is_free,
  created_at,
  updated_at
) VALUES (
  'lesson-js-functions-exercise',
  'Functions Practice',
  'Practice creating and calling functions with hands-on coding exercises.',
  'code',
  '{
    "instructions": "Create a function that calculates the area of a rectangle. The function should take width and height as parameters and return the area.",
    "starter_code": "// Create a function called calculateArea\n// It should take two parameters: width and height\n// Return the area (width * height)\n\nfunction calculateArea() {\n  // Your code here\n}\n\n// Test your function\nconsole.log(calculateArea(5, 3)); // Should output: 15",
    "solution": "function calculateArea(width, height) {\n  return width * height;\n}\n\n// Test the function\nconsole.log(calculateArea(5, 3)); // Output: 15\nconsole.log(calculateArea(10, 4)); // Output: 40",
    "language": "javascript",
    "tests": [
      {
        "input": "calculateArea(5, 3)",
        "expected": "15"
      },
      {
        "input": "calculateArea(10, 4)",
        "expected": "40"
      },
      {
        "input": "calculateArea(2, 7)",
        "expected": "14"
      }
    ],
    "hints": [
      "Remember to use the return keyword",
      "Multiply width by height",
      "Make sure your function takes two parameters"
    ]
  }',
  20,
  false,
  NOW(),
  NOW()
);
```

### Quiz Lesson
```sql
INSERT INTO lessons (
  id,
  title,
  description,
  type,
  content,
  duration_minutes,
  is_free,
  created_at,
  updated_at
) VALUES (
  'lesson-js-quiz-basics',
  'JavaScript Basics Quiz',
  'Test your understanding of JavaScript fundamentals with this comprehensive quiz.',
  'quiz',
  '{
    "questions": [
      {
        "id": "q1",
        "type": "multiple-choice",
        "question": "Which keyword is used to declare a constant variable in JavaScript?",
        "options": ["var", "let", "const", "function"],
        "correct_answer": "const",
        "explanation": "The const keyword is used to declare variables that cannot be reassigned after declaration."
      },
      {
        "id": "q2",
        "type": "multiple-choice",
        "question": "What will be the output of: console.log(typeof 42)?",
        "options": ["string", "number", "integer", "undefined"],
        "correct_answer": "number",
        "explanation": "In JavaScript, 42 is a number type, so typeof returns \"number\"."
      },
      {
        "id": "q3",
        "type": "true-false",
        "question": "JavaScript is case-sensitive.",
        "correct_answer": true,
        "explanation": "JavaScript is case-sensitive, meaning variables like \"name\" and \"Name\" are different."
      },
      {
        "id": "q4",
        "type": "fill-in-blank",
        "question": "Complete the function declaration: _______ myFunction() { }",
        "correct_answer": "function",
        "explanation": "The function keyword is used to declare a function in JavaScript."
      }
    ],
    "time_limit": 300,
    "passing_score": 70,
    "randomize_questions": false,
    "show_correct_answers": true
  }',
  15,
  false,
  NOW(),
  NOW()
);
```

### Interactive Lesson
```sql
INSERT INTO lessons (
  id,
  title,
  description,
  type,
  content,
  duration_minutes,
  is_free,
  created_at,
  updated_at
) VALUES (
  'lesson-js-dom-interactive',
  'DOM Manipulation Interactive',
  'Learn DOM manipulation through interactive examples and live coding.',
  'interactive',
  '{
    "components": [
      {
        "type": "live-code",
        "title": "Change Text Content",
        "html": "<h1 id=\"title\">Original Title</h1>\n<button onclick=\"changeTitle()\">Change Title</button>",
        "css": "h1 { color: blue; text-align: center; }\nbutton { padding: 10px; margin: 10px; }",
        "javascript": "function changeTitle() {\n  const title = document.getElementById(\"title\");\n  title.textContent = \"New Title!\";\n  title.style.color = \"red\";\n}",
        "instructions": "Click the button to see how JavaScript can change the content and style of HTML elements."
      },
      {
        "type": "exercise",
        "title": "Add Event Listeners",
        "description": "Practice adding event listeners to make elements interactive.",
        "starter_code": "// Add an event listener to the button\nconst button = document.getElementById(\"myButton\");\n// Your code here",
        "solution": "const button = document.getElementById(\"myButton\");\nbutton.addEventListener(\"click\", function() {\n  alert(\"Button clicked!\");\n});"
      }
    ],
    "learning_goals": [
      "Understand how to select DOM elements",
      "Learn to modify element content and styles",
      "Practice adding event listeners"
    ]
  }',
  25,
  false,
  NOW(),
  NOW()
);
```

### Assignment Lesson
```sql
INSERT INTO lessons (
  id,
  title,
  description,
  type,
  content,
  duration_minutes,
  is_free,
  created_at,
  updated_at
) VALUES (
  'lesson-js-calculator-project',
  'Build a Calculator',
  'Create a functional calculator using HTML, CSS, and JavaScript.',
  'assignment',
  '{
    "title": "JavaScript Calculator Project",
    "description": "Build a working calculator that can perform basic arithmetic operations (addition, subtraction, multiplication, division).",
    "requirements": [
      "Create an HTML structure with buttons for numbers 0-9 and operation buttons (+, -, *, /, =)",
      "Style the calculator using CSS to make it visually appealing",
      "Implement JavaScript functionality to handle calculations",
      "Display should show current number and result",
      "Handle edge cases like division by zero",
      "Add a clear button to reset the calculator"
    ],
    "deliverables": [
      "HTML file with calculator structure",
      "CSS file with calculator styling",
      "JavaScript file with calculator logic",
      "Screenshot of working calculator"
    ],
    "grading_criteria": [
      {
        "criterion": "Functionality",
        "points": 40,
        "description": "Calculator performs all basic operations correctly"
      },
      {
        "criterion": "User Interface",
        "points": 25,
        "description": "Clean, intuitive design that\'s easy to use"
      },
      {
        "criterion": "Code Quality",
        "points": 25,
        "description": "Well-organized, commented code following best practices"
      },
      {
        "criterion": "Error Handling",
        "points": 10,
        "description": "Handles edge cases and displays appropriate error messages"
      }
    ],
    "due_date": "2024-12-31T23:59:59Z",
    "estimated_hours": 3,
    "resources": [
      "MDN JavaScript Documentation",
      "CSS Grid/Flexbox guides",
      "Calculator design inspiration"
    ]
  }',
  30,
  false,
  NOW(),
  NOW()
);
```

### Discussion Lesson
```sql
INSERT INTO lessons (
  id,
  title,
  description,
  type,
  content,
  duration_minutes,
  is_free,
  created_at,
  updated_at
) VALUES (
  'lesson-js-best-practices-discussion',
  'JavaScript Best Practices Discussion',
  'Discuss and share JavaScript coding best practices with fellow learners.',
  'discussion',
  '{
    "topic": "JavaScript Coding Best Practices",
    "description": "Share your experiences and learn from others about writing clean, maintainable JavaScript code.",
    "prompts": [
      "What naming conventions do you follow for variables and functions?",
      "How do you handle error cases in your JavaScript code?",
      "What are your favorite ES6+ features and why?",
      "How do you organize your JavaScript files in larger projects?",
      "What tools do you use for debugging JavaScript?"
    ],
    "guidelines": [
      "Be respectful and constructive in your responses",
      "Share specific examples when possible",
      "Ask follow-up questions to learn more",
      "Help others by sharing resources and tips"
    ],
    "learning_objectives": [
      "Learn different approaches to JavaScript development",
      "Understand industry best practices",
      "Build connections with other learners",
      "Practice explaining technical concepts"
    ]
  }',
  20,
  false,
  NOW(),
  NOW()
);
```

## 🔗 Step 3: Link Lessons to Course

Insert records into the `course_lessons` table to associate lessons with the course:

```sql
-- Link all lessons to the course in order
INSERT INTO course_lessons (course_id, lesson_id, order_index) VALUES
('course-javascript-basics', 'lesson-js-intro', 1),
('course-javascript-basics', 'lesson-js-variables', 2),
('course-javascript-basics', 'lesson-js-functions-exercise', 3),
('course-javascript-basics', 'lesson-js-quiz-basics', 4),
('course-javascript-basics', 'lesson-js-dom-interactive', 5),
('course-javascript-basics', 'lesson-js-calculator-project', 6),
('course-javascript-basics', 'lesson-js-best-practices-discussion', 7);
```

## 👥 Step 4: Create User Enrollment (Optional)

To enroll a user in the course:

```sql
INSERT INTO course_enrollments (
  user_id,
  course_id,
  enrolled_at,
  status
) VALUES (
  'user-123', -- Replace with actual user ID
  'course-javascript-basics',
  NOW(),
  'active'
);
```

## 📊 Step 5: Track Lesson Progress (Automatic)

The lesson progress will be automatically tracked when users complete lessons through the UI. The system will insert records into `lesson_progress` table.

## 🎯 Complete Course Template

Here's a complete SQL script to create a full course:

```sql
-- Create Course
INSERT INTO courses (
  id, title, description, instructor_id, instructor_name, category, difficulty, 
  price, currency, duration_hours, lessons_count, rating, students_count, 
  is_published, tags, learning_objectives, requirements, created_at, updated_at
) VALUES (
  'course-react-fundamentals',
  'React Fundamentals',
  'Learn React from scratch and build modern web applications with components, hooks, and state management.',
  'instructor-002',
  'Sarah Johnson',
  'programming',
  'intermediate',
  79.99,
  'USD',
  12,
  15,
  4.9,
  850,
  true,
  '["react", "javascript", "frontend", "components"]',
  '["Build React components", "Manage application state", "Handle user interactions", "Use React hooks effectively"]',
  '["Solid understanding of JavaScript", "Familiarity with HTML and CSS", "Node.js installed"]',
  NOW(),
  NOW()
);

-- Create Lessons
INSERT INTO lessons (id, title, description, type, content, duration_minutes, is_free, created_at, updated_at) VALUES
-- Introduction Video
('lesson-react-intro', 'What is React?', 'Introduction to React and its core concepts', 'video', 
 '{"video_url": "https://example.com/react-intro.mp4", "transcript": "React is a JavaScript library..."}', 
 20, true, NOW(), NOW()),

-- Components Lesson
('lesson-react-components', 'React Components', 'Learn how to create and use React components', 'text',
 '{"markdown": "# React Components\\n\\nComponents are the building blocks of React applications..."}',
 15, false, NOW(), NOW()),

-- JSX Exercise
('lesson-react-jsx', 'JSX Practice', 'Practice writing JSX syntax', 'code',
 '{"instructions": "Create a component that renders a welcome message", "starter_code": "function Welcome() {\\n  // Your code here\\n}", "language": "javascript"}',
 25, false, NOW(), NOW()),

-- Hooks Quiz
('lesson-react-hooks-quiz', 'React Hooks Quiz', 'Test your knowledge of React hooks', 'quiz',
 '{"questions": [{"type": "multiple-choice", "question": "Which hook is used for state management?", "options": ["useEffect", "useState", "useContext"], "correct_answer": "useState"}]}',
 10, false, NOW(), NOW()),

-- Project Assignment
('lesson-react-todo-app', 'Todo App Project', 'Build a complete todo application', 'assignment',
 '{"title": "Todo App", "description": "Create a todo app with add, delete, and mark complete functionality"}',
 60, false, NOW(), NOW());

-- Link Lessons to Course
INSERT INTO course_lessons (course_id, lesson_id, order_index) VALUES
('course-react-fundamentals', 'lesson-react-intro', 1),
('course-react-fundamentals', 'lesson-react-components', 2),
('course-react-fundamentals', 'lesson-react-jsx', 3),
('course-react-fundamentals', 'lesson-react-hooks-quiz', 4),
('course-react-fundamentals', 'lesson-react-todo-app', 5);
```

## 🚀 Testing Your Course

After creating the course:

1. **Access the course**: Navigate to `/courses/course-javascript-basics` in your LMS
2. **Enroll in the course**: Use the enrollment button
3. **Start learning**: Begin with the first lesson
4. **Test all lesson types**: Ensure video, text, code, quiz, interactive, assignment, and discussion lessons work properly
5. **Check progress tracking**: Verify that progress is saved as you complete lessons

## 📝 Notes

- Replace example URLs with actual video/resource URLs
- Adjust content based on your specific needs
- Update user IDs and instructor IDs to match your database
- Make sure all referenced files and resources are accessible
- Test each lesson type thoroughly before publishing

## 🎨 Customization Tips

- **Video Lessons**: Use your preferred video hosting service (Vimeo, YouTube, AWS S3)
- **Code Exercises**: Integrate with online code execution services if needed
- **Quizzes**: Add more question types as needed
- **Interactive Content**: Extend with your own custom components
- **Assignments**: Add file upload capabilities for project submissions

Your course is now ready to use! Students can enroll, progress through lessons, and track their learning journey with the built-in gamification system.