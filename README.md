# AIClases LMS Platform

A modern, scalable Learning Management System built with Next.js 14, React 18, TypeScript, and Supabase. Features JSX-based lesson components, interactive learning experiences, comprehensive progress tracking, and gamification elements.

## Features

### 🎯 Core Features
- **JSX-Based Lesson Components**: Create interactive lessons using React components
- **Real-time Progress Tracking**: Track student progress at granular level
- **Gamification System**: Points, achievements, leaderboards, and streaks
- **Multi-role Support**: Students, Instructors, and Administrators
- **Interactive Components**: Video players, code editors, quizzes, and demos
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### 🛠 Technical Features
- **Modern Stack**: Next.js 14 with App Router, React 18, TypeScript
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth with role-based access control
- **Real-time**: Live progress updates and notifications
- **Performance**: Optimized with code splitting and caching
- **Testing**: Comprehensive test suite with Jest and Playwright

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Supabase CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aiclases-lms
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Setup Supabase**
   ```bash
   # Start local Supabase (requires Docker)
   supabase start
   
   # Apply database migrations
   supabase db reset
   ```

5. **Generate TypeScript types**
   ```bash
   pnpm run db:generate-types
   ```

6. **Start development server**
   ```bash
   pnpm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Development Commands

```bash
# Development
pnpm run dev                    # Start development server
pnpm run build                  # Build for production
pnpm run start                  # Start production server

# Code Quality
pnpm run lint                   # Run ESLint
pnpm run lint:fix              # Fix ESLint issues
pnpm run type-check            # TypeScript type checking

# Testing
pnpm run test                   # Run unit tests
pnpm run test:watch            # Run tests in watch mode
pnpm run test:coverage         # Run tests with coverage
pnpm run test:e2e              # Run E2E tests
pnpm run test:e2e:ui           # Run E2E tests with UI

# Database
pnpm run db:generate-types     # Generate TypeScript types
pnpm run db:reset              # Reset local database
pnpm run db:push               # Push migrations to remote
pnpm run db:diff               # Show schema changes
```

## Project Structure

```
src/
├── app/                       # Next.js 14 App Router
│   ├── (auth)/               # Authentication routes
│   ├── (dashboard)/          # Dashboard routes
│   ├── api/                  # API endpoints
│   ├── courses/              # Course pages
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── ui/                   # Base UI components (Shadcn)
│   ├── lesson/               # Lesson-specific components
│   ├── dashboard/            # Dashboard components
│   ├── course/               # Course management
│   └── gamification/         # Badges, progress, leaderboard
├── lessons/                  # JSX lesson components
│   ├── react-basics/
│   └── advanced-react/
├── lib/                      # Utility libraries
│   ├── supabase/             # Supabase configuration
│   ├── validations.ts        # Zod schemas
│   └── utils.ts              # Utility functions
├── hooks/                    # Custom React hooks
├── stores/                   # Zustand stores
└── types/                    # TypeScript definitions
```

## Architecture

### Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **State Management**: Zustand + TanStack Query
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Radix UI + Shadcn/ui
- **Testing**: Jest + React Testing Library + Playwright
- **Deployment**: Vercel

### Database Schema
The application uses Supabase (PostgreSQL) with the following key tables:
- `profiles` - User information and roles
- `courses` - Course metadata and instructor relationships
- `lessons` - Individual lesson components
- `enrollments` - User-course relationships
- `lesson_progress` - Granular progress tracking
- `quiz_attempts` - Quiz submissions and scoring
- `achievements` - Gamification system
- `user_achievements` - User achievement tracking

## Creating Lesson Components

Lessons are React components that follow a specific structure:

```typescript
// lessons/react-basics/what-is-react/index.tsx
import { LessonLayout, TextSection, VideoSection, Quiz } from '@/components/lesson'
import { LessonProps } from '@/lib/types'
import { metadata } from './metadata'

export default function WhatIsReactLesson({ 
  onProgress, 
  onComplete, 
  onQuizSubmit, 
  userProgress 
}: LessonProps) {
  return (
    <LessonLayout metadata={metadata} userProgress={userProgress}>
      <TextSection 
        id="introduction"
        onView={() => onProgress('introduction', 25)}
      >
        <h2>What is React?</h2>
        <p>React is a JavaScript library...</p>
      </TextSection>

      <VideoSection
        id="overview-video"
        src="/videos/react-overview.mp4"
        onComplete={() => onProgress('overview-video', 50)}
      />

      <Quiz
        id="react-quiz"
        questions={[...]}
        onComplete={(answers, score) => {
          onQuizSubmit(answers, score)
          if (score >= 80) onComplete()
        }}
      />
    </LessonLayout>
  )
}
```

## Available Components

### Lesson Components
- `LessonLayout` - Main wrapper with progress tracking
- `TextSection` - Rich text content with view tracking
- `VideoSection` - Video player with progress controls
- `CodeEditor` - Interactive code editor with syntax highlighting
- `Quiz` - Full quiz system with multiple question types
- `ImageGallery` - Image carousel with captions
- `InteractiveDemo` - Custom interactive experiences

### UI Components
Built on Radix UI and Shadcn/ui:
- Form components (Input, Button, Select, etc.)
- Navigation (Tabs, Accordion, etc.)
- Feedback (Toast, Alert, etc.)
- Overlay (Dialog, Popover, etc.)

## Testing

### Unit Tests
```bash
# Run all tests
pnpm run test

# Watch mode
pnpm run test:watch

# Coverage report
pnpm run test:coverage
```

### E2E Tests
```bash
# Run E2E tests
pnpm run test:e2e

# Run with UI
pnpm run test:e2e:ui
```

## Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

### Manual Deployment
```bash
# Build the application
pnpm run build

# Start production server
pnpm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation in the `docs/` directory
- Review the component examples in the `src/lessons/` directory