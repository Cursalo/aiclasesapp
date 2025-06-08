# JSX Course Creation Guide

This guide shows you how to create courses using our JSX-based lesson system. Lessons are React components that get dynamically rendered by our lesson registry.

## 📋 Prerequisites

- Understanding of React/JSX
- Course metadata in Supabase database
- Lesson components in the `/src/components/lessons/` directory

## 🏗️ Architecture Overview

Our LMS uses a hybrid approach:
- **Course metadata** → Stored in Supabase database
- **Lesson content** → JSX React components
- **Lesson registry** → Maps lesson types to components

## 📚 Step 1: Create Course Metadata

First, create the course in your Supabase database:

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
  'javascript-fundamentals',
  'JavaScript Fundamentals',
  'Master the core concepts of JavaScript programming from variables to functions, DOM manipulation, and modern ES6+ features.',
  'instructor-001',
  'John Smith',
  'programming',
  'beginner',
  49.99,
  'USD',
  8,
  7,
  4.8,
  1250,
  true,
  '["javascript", "programming", "web-development", "beginner"]',
  '[
    "Understand JavaScript syntax and core concepts",
    "Work with variables, functions, and objects",
    "Manipulate the DOM and handle events",
    "Use modern ES6+ features",
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

## 📖 Step 2: Create JSX Lesson Components

Create lesson files in `/src/components/lessons/courses/javascript-fundamentals/`:

### Lesson 1: Video Lesson
**File: `/src/components/lessons/courses/javascript-fundamentals/01-introduction.tsx`**

```tsx
'use client'

import React from 'react'
import { VideoLesson } from '@/components/lessons/video-lesson'
import type { LessonProps } from '@/lib/lessons/types'

const lessonData = {
  id: 'js-intro',
  title: 'Introduction to JavaScript',
  description: 'Learn what JavaScript is, its history, and why it\'s essential for web development.',
  type: 'video' as const,
  content: {
    video_url: 'https://example.com/videos/js-intro.mp4',
    duration: 900, // 15 minutes in seconds
    transcript: `Welcome to JavaScript Fundamentals! 

In this lesson, we will explore what JavaScript is and why it has become one of the most popular programming languages in the world.

JavaScript was created in 1995 by Brendan Eich at Netscape. Originally designed to make web pages interactive, JavaScript has evolved far beyond its humble beginnings.

Today, JavaScript powers:
- Interactive websites
- Server-side applications (Node.js)
- Mobile applications (React Native)
- Desktop applications (Electron)
- Machine learning applications

Let's start our journey into this amazing language!`,
    notes: [
      'JavaScript was created in 1995 by Brendan Eich',
      'Originally designed for web browsers',
      'Now used for servers, mobile apps, and desktop applications',
      'One of the most popular programming languages today'
    ]
  },
  duration_minutes: 15,
  is_free: true
}

export default function IntroductionLesson(props: LessonProps) {
  return <VideoLesson lesson={lessonData} {...props} />
}
```

### Lesson 2: Text Lesson
**File: `/src/components/lessons/courses/javascript-fundamentals/02-variables.tsx`**

```tsx
'use client'

import React from 'react'
import { TextLesson } from '@/components/lessons/text-lesson'
import type { LessonProps } from '@/lib/lessons/types'

const lessonData = {
  id: 'js-variables',
  title: 'Variables and Data Types',
  description: 'Understanding how to declare variables and work with different data types in JavaScript.',
  type: 'text' as const,
  content: {
    markdown: `# Variables and Data Types

## What are Variables?

Variables are containers that store data values. In JavaScript, you can declare variables using \`var\`, \`let\`, or \`const\`.

\`\`\`javascript
let name = "John";
const age = 25;
var isStudent = true;
\`\`\`

## Data Types

JavaScript has several primitive data types:

### 1. String
Strings represent text data:
\`\`\`javascript
let message = "Hello, World!";
let greeting = 'Welcome to JavaScript';
let template = \`Hello, \${name}!\`; // Template literal
\`\`\`

### 2. Number
JavaScript has one number type for integers and decimals:
\`\`\`javascript
let count = 42;
let price = 19.99;
let negative = -10;
\`\`\`

### 3. Boolean
Represents true or false values:
\`\`\`javascript
let isLoggedIn = true;
let hasPermission = false;
\`\`\`

### 4. Undefined
A variable that has been declared but not assigned a value:
\`\`\`javascript
let undefinedVar;
console.log(undefinedVar); // undefined
\`\`\`

### 5. Null
Represents an intentional absence of value:
\`\`\`javascript
let emptyValue = null;
\`\`\`

## Variable Declaration Keywords

### \`let\`
- Block-scoped
- Can be reassigned
- Cannot be redeclared in same scope

\`\`\`javascript
let counter = 0;
counter = 1; // ✅ Valid
\`\`\`

### \`const\`
- Block-scoped
- Cannot be reassigned
- Must be initialized at declaration

\`\`\`javascript
const PI = 3.14159;
// PI = 3.14; // ❌ Error: Assignment to constant variable
\`\`\`

### \`var\` (Avoid in modern JavaScript)
- Function-scoped
- Can be redeclared and reassigned
- Hoisted to top of function

## Variable Naming Rules

- Must start with a letter, underscore (_), or dollar sign ($)
- Cannot start with a number
- Case sensitive
- Cannot use reserved keywords

\`\`\`javascript
// ✅ Valid names
let userName = "john";
let user_age = 25;
let $element = document.getElementById("myId");
let _private = "secret";

// ❌ Invalid names
let 2names = "invalid";
let user-name = "invalid";
let class = "reserved keyword";
\`\`\`

## Best Practices

1. **Use descriptive names**: \`userName\` instead of \`u\`
2. **Use camelCase**: \`firstName\` not \`first_name\`
3. **Use \`const\` by default**: Only use \`let\` when you need to reassign
4. **Avoid \`var\`**: Use \`let\` or \`const\` instead
5. **Initialize variables**: Don't leave variables undefined unnecessarily

## Type Checking

Use the \`typeof\` operator to check variable types:

\`\`\`javascript
console.log(typeof "Hello");     // "string"
console.log(typeof 42);          // "number"
console.log(typeof true);        // "boolean"
console.log(typeof undefined);   // "undefined"
console.log(typeof null);        // "object" (this is a known quirk!)
\`\`\`

## Practice Exercise

Try declaring variables of different types:

\`\`\`javascript
// Your turn: Create variables for a user profile
const firstName = ""; // String
const lastName = "";  // String
let age = 0;         // Number
let isActive = true; // Boolean
let lastLogin = null; // Null (no login yet)
\`\`\``,
    estimated_reading_time: 12
  },
  duration_minutes: 15,
  is_free: false
}

export default function VariablesLesson(props: LessonProps) {
  return <TextLesson lesson={lessonData} {...props} />
}
```

### Lesson 3: Code Exercise
**File: `/src/components/lessons/courses/javascript-fundamentals/03-functions-exercise.tsx`**

```tsx
'use client'

import React from 'react'
import { CodeLesson } from '@/components/lessons/code-lesson'
import type { LessonProps } from '@/lib/lessons/types'

const lessonData = {
  id: 'js-functions-exercise',
  title: 'Functions Practice',
  description: 'Practice creating and calling functions with hands-on coding exercises.',
  type: 'code' as const,
  content: {
    instructions: `# Functions Exercise

Create a function called \`calculateArea\` that:
1. Takes two parameters: \`width\` and \`height\`
2. Returns the area (width × height)
3. Test your function with different values

## Bonus Challenge
Create a second function called \`calculatePerimeter\` that calculates the perimeter of a rectangle.`,
    
    starter_code: `// Exercise 1: Create a function called calculateArea
// It should take two parameters: width and height
// Return the area (width * height)

function calculateArea() {
  // Your code here
}

// Exercise 2: Create a function called calculatePerimeter
// It should take two parameters: width and height
// Return the perimeter (2 * (width + height))

function calculatePerimeter() {
  // Your code here
}

// Test your functions
console.log("Area of 5x3 rectangle:", calculateArea(5, 3));
console.log("Perimeter of 5x3 rectangle:", calculatePerimeter(5, 3));`,

    solution: `// Solution for Exercise 1
function calculateArea(width, height) {
  return width * height;
}

// Solution for Exercise 2
function calculatePerimeter(width, height) {
  return 2 * (width + height);
}

// Test the functions
console.log("Area of 5x3 rectangle:", calculateArea(5, 3)); // 15
console.log("Perimeter of 5x3 rectangle:", calculatePerimeter(5, 3)); // 16

// Additional tests
console.log("Area of 10x4 rectangle:", calculateArea(10, 4)); // 40
console.log("Perimeter of 10x4 rectangle:", calculatePerimeter(10, 4)); // 28`,

    language: 'javascript',
    
    tests: [
      {
        name: 'calculateArea function exists',
        code: 'typeof calculateArea === "function"',
        expected: true
      },
      {
        name: 'calculateArea(5, 3) returns 15',
        code: 'calculateArea(5, 3)',
        expected: 15
      },
      {
        name: 'calculateArea(10, 4) returns 40',
        code: 'calculateArea(10, 4)',
        expected: 40
      },
      {
        name: 'calculatePerimeter function exists',
        code: 'typeof calculatePerimeter === "function"',
        expected: true
      },
      {
        name: 'calculatePerimeter(5, 3) returns 16',
        code: 'calculatePerimeter(5, 3)',
        expected: 16
      }
    ],
    
    hints: [
      'Remember to use the `return` keyword to return a value',
      'Functions need parameters in parentheses: `function name(param1, param2)`',
      'For area: multiply width by height',
      'For perimeter: add all four sides (or use the formula 2 * (width + height))'
    ]
  },
  duration_minutes: 25,
  is_free: false
}

export default function FunctionsExerciseLesson(props: LessonProps) {
  return <CodeLesson lesson={lessonData} {...props} />
}
```

### Lesson 4: Quiz Lesson
**File: `/src/components/lessons/courses/javascript-fundamentals/04-basics-quiz.tsx`**

```tsx
'use client'

import React from 'react'
import { QuizLesson } from '@/components/lessons/quiz-lesson'
import type { LessonProps } from '@/lib/lessons/types'

const lessonData = {
  id: 'js-basics-quiz',
  title: 'JavaScript Basics Quiz',
  description: 'Test your understanding of JavaScript fundamentals.',
  type: 'quiz' as const,
  content: {
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'Which keyword is used to declare a constant variable in JavaScript?',
        options: ['var', 'let', 'const', 'function'],
        correct_answer: 'const',
        explanation: 'The `const` keyword is used to declare variables that cannot be reassigned after declaration.'
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: 'What will be the output of: `console.log(typeof 42)`?',
        options: ['string', 'number', 'integer', 'undefined'],
        correct_answer: 'number',
        explanation: 'In JavaScript, 42 is a number type, so typeof returns "number".'
      },
      {
        id: 'q3',
        type: 'true-false',
        question: 'JavaScript is case-sensitive.',
        correct_answer: true,
        explanation: 'JavaScript is case-sensitive, meaning variables like "name" and "Name" are different.'
      },
      {
        id: 'q4',
        type: 'fill-in-blank',
        question: 'Complete the function declaration: _______ myFunction() { }',
        correct_answer: 'function',
        explanation: 'The `function` keyword is used to declare a function in JavaScript.'
      },
      {
        id: 'q5',
        type: 'multiple-choice',
        question: 'Which of these is NOT a primitive data type in JavaScript?',
        options: ['string', 'number', 'boolean', 'array'],
        correct_answer: 'array',
        explanation: 'Array is an object type, not a primitive data type. Primitive types include string, number, boolean, undefined, null, and symbol.'
      }
    ],
    time_limit: 300, // 5 minutes
    passing_score: 70,
    randomize_questions: false,
    show_correct_answers: true
  },
  duration_minutes: 10,
  is_free: false
}

export default function BasicsQuizLesson(props: LessonProps) {
  return <QuizLesson lesson={lessonData} {...props} />
}
```

### Lesson 5: Interactive Lesson
**File: `/src/components/lessons/courses/javascript-fundamentals/05-dom-interactive.tsx`**

```tsx
'use client'

import React from 'react'
import { InteractiveLesson } from '@/components/lessons/interactive-lesson'
import type { LessonProps } from '@/lib/lessons/types'

const lessonData = {
  id: 'js-dom-interactive',
  title: 'DOM Manipulation Interactive',
  description: 'Learn DOM manipulation through interactive examples and live coding.',
  type: 'interactive' as const,
  content: {
    components: [
      {
        type: 'explanation',
        title: 'What is the DOM?',
        content: `The Document Object Model (DOM) is a programming interface for HTML documents. It represents the page structure as a tree of objects that JavaScript can interact with.

Key concepts:
- **Elements**: HTML tags like <div>, <p>, <button>
- **Attributes**: Properties like id, class, src
- **Events**: User interactions like clicks, key presses
- **Methods**: Ways to find and modify elements`
      },
      {
        type: 'live-demo',
        title: 'Selecting Elements',
        html: `<div id="demo-container">
  <h2 id="title">Original Title</h2>
  <p class="description">This is a paragraph.</p>
  <button id="change-btn">Change Title</button>
  <button id="style-btn">Change Style</button>
</div>`,
        css: `#demo-container {
  padding: 20px;
  border: 2px solid #ccc;
  border-radius: 8px;
  margin: 10px 0;
}

#title {
  color: #333;
  text-align: center;
}

.description {
  color: #666;
  font-style: italic;
}

button {
  margin: 5px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}`,
        javascript: `// Get elements by ID
const title = document.getElementById('title');
const changeBtn = document.getElementById('change-btn');
const styleBtn = document.getElementById('style-btn');

// Add event listeners
changeBtn.addEventListener('click', function() {
  title.textContent = 'Title Changed!';
});

styleBtn.addEventListener('click', function() {
  title.style.color = 'red';
  title.style.fontSize = '2em';
});`,
        explanation: 'Click the buttons to see how JavaScript can select and modify HTML elements.'
      },
      {
        type: 'exercise',
        title: 'Practice: Add More Interactivity',
        instructions: `Add functionality to make the paragraph text change when clicked.

Your tasks:
1. Select the paragraph element with class "description"
2. Add a click event listener to it
3. Change its text to "Paragraph clicked!" when clicked`,
        starter_code: `// Select the paragraph element
const paragraph = document.querySelector('.description');

// Add your event listener here
// Your code goes here`,
        solution: `// Select the paragraph element
const paragraph = document.querySelector('.description');

// Add click event listener
paragraph.addEventListener('click', function() {
  paragraph.textContent = 'Paragraph clicked!';
  paragraph.style.color = 'green';
});`
      },
      {
        type: 'challenge',
        title: 'Challenge: Create a Counter',
        instructions: `Create a counter that increases when a button is clicked.

Requirements:
1. Display the current count
2. Button to increment the counter
3. Button to reset the counter to 0`,
        starter_html: `<div id="counter-app">
  <h3>Counter: <span id="count">0</span></h3>
  <button id="increment">+1</button>
  <button id="reset">Reset</button>
</div>`,
        starter_code: `let count = 0;
const countDisplay = document.getElementById('count');
const incrementBtn = document.getElementById('increment');
const resetBtn = document.getElementById('reset');

// Add your event listeners here`,
        solution: `let count = 0;
const countDisplay = document.getElementById('count');
const incrementBtn = document.getElementById('increment');
const resetBtn = document.getElementById('reset');

incrementBtn.addEventListener('click', function() {
  count++;
  countDisplay.textContent = count;
});

resetBtn.addEventListener('click', function() {
  count = 0;
  countDisplay.textContent = count;
});`
      }
    ],
    learning_goals: [
      'Understand how to select DOM elements',
      'Learn to modify element content and styles',
      'Practice adding event listeners',
      'Build interactive user interfaces'
    ]
  },
  duration_minutes: 30,
  is_free: false
}

export default function DOMInteractiveLesson(props: LessonProps) {
  return <InteractiveLesson lesson={lessonData} {...props} />
}
```

### Lesson 6: Assignment Lesson
**File: `/src/components/lessons/courses/javascript-fundamentals/06-calculator-project.tsx`**

```tsx
'use client'

import React from 'react'
import { AssignmentLesson } from '@/components/lessons/assignment-lesson'
import type { LessonProps } from '@/lib/lessons/types'

const lessonData = {
  id: 'js-calculator-project',
  title: 'Build a Calculator',
  description: 'Create a functional calculator using HTML, CSS, and JavaScript.',
  type: 'assignment' as const,
  content: {
    title: 'JavaScript Calculator Project',
    description: `Build a working calculator that can perform basic arithmetic operations. This project will test your understanding of HTML structure, CSS styling, JavaScript functions, and DOM manipulation.`,
    
    objectives: [
      'Create a functional calculator interface',
      'Implement basic arithmetic operations',
      'Handle user input and display results',
      'Practice event handling and DOM manipulation',
      'Write clean, organized code'
    ],
    
    requirements: [
      {
        title: 'HTML Structure',
        items: [
          'Create an HTML file with a calculator layout',
          'Include a display area for numbers and results',
          'Add buttons for numbers 0-9',
          'Add buttons for operations (+, -, *, /, =)',
          'Include a clear (C) button to reset',
          'Add a decimal point (.) button'
        ]
      },
      {
        title: 'CSS Styling',
        items: [
          'Style the calculator to look professional',
          'Use CSS Grid or Flexbox for button layout',
          'Add hover effects for buttons',
          'Make the display clear and readable',
          'Ensure responsive design'
        ]
      },
      {
        title: 'JavaScript Functionality',
        items: [
          'Handle number input and display',
          'Implement all basic operations (+, -, *, /)',
          'Calculate and display results when = is pressed',
          'Clear calculator when C is pressed',
          'Handle decimal numbers',
          'Prevent invalid operations (like division by zero)'
        ]
      }
    ],
    
    deliverables: [
      {
        name: 'HTML File',
        description: 'calculator.html with complete structure',
        points: 20
      },
      {
        name: 'CSS File',
        description: 'styles.css with calculator styling',
        points: 20
      },
      {
        name: 'JavaScript File',
        description: 'script.js with calculator logic',
        points: 40
      },
      {
        name: 'Documentation',
        description: 'README.md explaining how to use the calculator',
        points: 10
      },
      {
        name: 'Demo',
        description: 'Screenshot or video showing working calculator',
        points: 10
      }
    ],
    
    grading_criteria: [
      {
        criterion: 'Functionality (40 points)',
        description: 'Calculator performs all basic operations correctly',
        details: [
          'All number buttons work (10 pts)',
          'All operation buttons work (+, -, *, /) (15 pts)',
          'Equals button calculates correctly (10 pts)',
          'Clear button resets calculator (5 pts)'
        ]
      },
      {
        criterion: 'User Interface (25 points)',
        description: 'Clean, intuitive design that\'s easy to use',
        details: [
          'Professional appearance (10 pts)',
          'Clear button layout (8 pts)',
          'Readable display (7 pts)'
        ]
      },
      {
        criterion: 'Code Quality (25 points)',
        description: 'Well-organized, commented code following best practices',
        details: [
          'Clean, readable code (10 pts)',
          'Proper function organization (8 pts)',
          'Comments explaining logic (7 pts)'
        ]
      },
      {
        criterion: 'Error Handling (10 points)',
        description: 'Handles edge cases and displays appropriate messages',
        details: [
          'Division by zero handling (5 pts)',
          'Invalid input prevention (5 pts)'
        ]
      }
    ],
    
    starter_code: `<!-- HTML Template -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JavaScript Calculator</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="calculator">
        <div class="display">
            <input type="text" id="display" readonly>
        </div>
        <div class="buttons">
            <!-- Add your calculator buttons here -->
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>

/* CSS Template */
.calculator {
    /* Add your styles here */
}

// JavaScript Template
class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.currentInput = '0';
        this.operator = null;
        this.previousInput = null;
    }
    
    // Add your methods here
}

const calculator = new Calculator();`,
    
    resources: [
      {
        title: 'MDN JavaScript Documentation',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
        description: 'Complete reference for JavaScript'
      },
      {
        title: 'CSS Grid Guide',
        url: 'https://css-tricks.com/snippets/css/complete-guide-grid/',
        description: 'Learn CSS Grid for layout'
      },
      {
        title: 'Calculator Design Inspiration',
        url: 'https://dribbble.com/search/calculator',
        description: 'UI design ideas for calculators'
      }
    ],
    
    tips: [
      'Start with the HTML structure before styling',
      'Test each operation individually',
      'Use console.log() to debug your calculations',
      'Consider edge cases like multiple decimal points',
      'Keep your code organized with clear function names'
    ],
    
    due_date: '2024-12-31T23:59:59Z',
    estimated_hours: 4
  },
  duration_minutes: 45,
  is_free: false
}

export default function CalculatorProjectLesson(props: LessonProps) {
  return <AssignmentLesson lesson={lessonData} {...props} />
}
```

### Lesson 7: Discussion Lesson
**File: `/src/components/lessons/courses/javascript-fundamentals/07-best-practices-discussion.tsx`**

```tsx
'use client'

import React from 'react'
import { DiscussionLesson } from '@/components/lessons/discussion-lesson'
import type { LessonProps } from '@/lib/lessons/types'

const lessonData = {
  id: 'js-best-practices-discussion',
  title: 'JavaScript Best Practices Discussion',
  description: 'Discuss and share JavaScript coding best practices with fellow learners.',
  type: 'discussion' as const,
  content: {
    topic: 'JavaScript Coding Best Practices',
    description: `Share your experiences and learn from others about writing clean, maintainable JavaScript code. This discussion will help you understand different approaches to JavaScript development and industry best practices.`,
    
    prompts: [
      {
        title: 'Naming Conventions',
        question: 'What naming conventions do you follow for variables and functions? Do you prefer camelCase, snake_case, or something else?',
        context: 'Good naming is crucial for readable code. Share examples of good and bad variable names you\'ve encountered.'
      },
      {
        title: 'Error Handling',
        question: 'How do you handle error cases in your JavaScript code? Do you use try-catch blocks, validation functions, or other approaches?',
        context: 'Error handling prevents apps from crashing and provides better user experience.'
      },
      {
        title: 'ES6+ Features',
        question: 'What are your favorite ES6+ features and why? How have they improved your coding experience?',
        context: 'Modern JavaScript has many powerful features like arrow functions, destructuring, and async/await.'
      },
      {
        title: 'Code Organization',
        question: 'How do you organize your JavaScript files in larger projects? Do you use modules, classes, or other patterns?',
        context: 'As projects grow, organization becomes crucial for maintainability.'
      },
      {
        title: 'Debugging Techniques',
        question: 'What tools and techniques do you use for debugging JavaScript? Console.log, browser DevTools, or other methods?',
        context: 'Effective debugging skills can save hours of development time.'
      }
    ],
    
    guidelines: [
      'Be respectful and constructive in your responses',
      'Share specific examples when possible',
      'Ask follow-up questions to learn more',
      'Help others by sharing resources and tips',
      'Stay on topic and focus on JavaScript best practices',
      'Cite sources when sharing information from external resources'
    ],
    
    learning_objectives: [
      'Learn different approaches to JavaScript development',
      'Understand industry best practices and conventions',
      'Build connections with other learners',
      'Practice explaining technical concepts clearly',
      'Discover new tools and techniques from peers'
    ],
    
    starter_posts: [
      {
        author: 'Instructor',
        content: `Welcome to our JavaScript Best Practices discussion! 

I'll start us off with a few thoughts on naming conventions:

**Variables**: I prefer camelCase for variables and functions:
\`\`\`javascript
const userName = "john_doe";
const calculateTotalPrice = (items) => { ... };
\`\`\`

**Constants**: I use UPPER_SNAKE_CASE for constants:
\`\`\`javascript
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = "https://api.example.com";
\`\`\`

**Boolean variables**: I like to use "is", "has", or "can" prefixes:
\`\`\`javascript
const isLoggedIn = true;
const hasPermission = false;
const canEdit = user.role === 'admin';
\`\`\`

What conventions do you prefer? Share your examples!`
      }
    ],
    
    discussion_rules: [
      'No spam or off-topic content',
      'No sharing of harmful or malicious code',
      'Respect different skill levels and approaches',
      'Provide constructive feedback only',
      'Use code blocks for code examples'
    ]
  },
  duration_minutes: 30,
  is_free: false
}

export default function BestPracticesDiscussionLesson(props: LessonProps) {
  return <DiscussionLesson lesson={lessonData} {...props} />
}
```

## 🔗 Step 3: Register Lessons in Database

Create lesson metadata in Supabase:

```sql
-- Create lesson records
INSERT INTO lessons (id, title, description, type, duration_minutes, is_free, course_id, order_index) VALUES
('js-intro', 'Introduction to JavaScript', 'Learn what JavaScript is and its importance', 'video', 15, true, 'javascript-fundamentals', 1),
('js-variables', 'Variables and Data Types', 'Understanding variables and data types', 'text', 15, false, 'javascript-fundamentals', 2),
('js-functions-exercise', 'Functions Practice', 'Practice creating and calling functions', 'code', 25, false, 'javascript-fundamentals', 3),
('js-basics-quiz', 'JavaScript Basics Quiz', 'Test your JavaScript fundamentals', 'quiz', 10, false, 'javascript-fundamentals', 4),
('js-dom-interactive', 'DOM Manipulation Interactive', 'Learn DOM manipulation interactively', 'interactive', 30, false, 'javascript-fundamentals', 5),
('js-calculator-project', 'Build a Calculator', 'Create a functional calculator project', 'assignment', 45, false, 'javascript-fundamentals', 6),
('js-best-practices-discussion', 'Best Practices Discussion', 'Discuss JavaScript best practices', 'discussion', 30, false, 'javascript-fundamentals', 7);
```

## 📁 File Structure

Your lesson files should be organized like this:

```
src/
├── components/
│   └── lessons/
│       └── courses/
│           └── javascript-fundamentals/
│               ├── 01-introduction.tsx
│               ├── 02-variables.tsx
│               ├── 03-functions-exercise.tsx
│               ├── 04-basics-quiz.tsx
│               ├── 05-dom-interactive.tsx
│               ├── 06-calculator-project.tsx
│               └── 07-best-practices-discussion.tsx
```

## 🎯 How It Works

1. **Course Navigation**: When users access `/courses/javascript-fundamentals/learn`, the system:
   - Loads course metadata from Supabase
   - Loads lesson metadata from Supabase
   - Dynamically imports the JSX lesson component based on lesson type
   - Renders the appropriate lesson component using our lesson registry

2. **Lesson Components**: Each lesson is a React component that:
   - Receives lesson data as props
   - Uses the appropriate lesson type component (VideoLesson, TextLesson, etc.)
   - Handles progress tracking automatically
   - Integrates with the gamification system

3. **Progress Tracking**: The system automatically:
   - Marks lessons as started when opened
   - Tracks completion based on lesson type requirements
   - Awards points and checks for achievements
   - Updates user progress in the database

## 🚀 Quick Start Template

Copy this template to create new courses quickly:

```tsx
// Template for any lesson type
'use client'

import React from 'react'
import { [LessonTypeComponent] } from '@/components/lessons/[lesson-type]'
import type { LessonProps } from '@/lib/lessons/types'

const lessonData = {
  id: 'unique-lesson-id',
  title: 'Lesson Title',
  description: 'Lesson description',
  type: 'lesson-type' as const, // video, text, code, quiz, interactive, assignment, discussion
  content: {
    // Content specific to lesson type
  },
  duration_minutes: 15,
  is_free: false
}

export default function LessonName(props: LessonProps) {
  return <[LessonTypeComponent] lesson={lessonData} {...props} />
}
```

Now you have a complete JSX-based course! The system will automatically handle navigation, progress tracking, and gamification for all your lessons. 🎉