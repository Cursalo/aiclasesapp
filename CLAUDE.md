# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI-powered Learning Management System (LMS) designed for technical education, specifically targeting developers and technical professionals. The platform enables the creation of interactive educational content using JSX components while providing students with gamified learning experiences.

**Key Differentiator**: Developer-friendly course creation using JSX components instead of traditional content management interfaces.

## Tech Stack

### Frontend
- **Next.js 14+** with App Router architecture
- **React 18+** with TypeScript 5+
- **Tailwind CSS 3+** with Shadcn/ui components
- **Zustand** for global state management
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation

### Backend & Database
- **Supabase** for backend-as-a-service (PostgreSQL + Auth + Storage + Real-time)
- **Next.js API Routes** for custom backend logic
- **Row Level Security (RLS)** for data protection
- **PostgreSQL** with advanced indexing and triggers

### Interactive Components
- **Video.js** for video playback with progress tracking
- **Monaco Editor** for code editing experiences
- **Custom JSX components** for lesson content

## Development Commands

### Setup and Installation
```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Setup local Supabase
supabase start
supabase db reset

# Start development server
pnpm run dev
```

### Common Development Tasks
```bash
# Type checking
pnpm run type-check

# Linting
pnpm run lint
pnpm run lint:fix

# Testing
pnpm run test
pnpm run test:watch
pnpm run test:coverage

# Database operations
supabase db reset                    # Reset local database
supabase db diff                     # Show schema changes
supabase db push                     # Push migrations to remote
supabase gen types typescript --local > lib/supabase/types.ts

# Build and deployment
pnpm run build
pnpm run start
```

## Architecture Overview

### Directory Structure
```
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes group
│   ├── (dashboard)/              # Protected dashboard routes
│   ├── api/                      # API endpoints
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # Reusable UI components
│   ├── ui/                       # Base UI components (Shadcn)
│   ├── lessons/                  # Lesson-specific components
│   └── forms/                    # Form components
├── lib/                          # Utility libraries
│   ├── supabase/                 # Supabase client configuration
│   ├── validations/              # Zod schemas
│   └── utils.ts                  # Utility functions
├── hooks/                        # Custom React hooks
├── stores/                       # Zustand stores
├── types/                        # TypeScript type definitions
└── lesson-components/            # Dynamic lesson components
```

### Database Schema Key Tables
- **profiles**: User information and roles
- **courses**: Course metadata and instructor relationships
- **lessons**: Individual lesson components and ordering
- **enrollments**: User-course relationships
- **lesson_progress**: Granular progress tracking
- **quiz_attempts**: Quiz submissions and scoring
- **achievements**: Gamification system
- **user_achievements**: User achievement tracking

## Key Development Patterns

### Component Development
- All components must be TypeScript functional components
- Use explicit Props interfaces
- Implement proper error boundaries for lesson components
- Follow mobile-first responsive design
- Ensure WCAG 2.1 AA accessibility compliance

### State Management
- Use Zustand for global state (auth, UI state)
- Use TanStack Query for server state and caching
- Implement optimistic updates for better UX
- Cache frequently accessed data (courses list, user progress)

### API Design
- Follow RESTful conventions
- Use Zod schemas for request/response validation
- Implement proper error handling with standard HTTP codes
- Apply rate limiting (1000/hour general, 10/minute uploads)
- Use Row Level Security for data access control

### Database Operations
- Use prepared statements and parameterized queries
- Implement proper indexing on foreign keys and query columns
- Use database functions for complex business logic
- Apply RLS policies for all user-accessible tables

## Lesson Component System

### Creating New Lesson Components
1. Create JSX component in `lesson-components/` directory
2. Add metadata file with learning objectives and duration
3. Register component in lesson registry
4. Test component in isolation
5. Integrate with course structure

### Component Requirements
- Must accept standard lesson props interface
- Implement progress tracking callbacks
- Handle loading and error states
- Support responsive design
- Include accessibility features

### Interactive Component Types
- **TextSection**: Rich text content with view tracking
- **VideoSection**: Video player with progress tracking
- **CodeSection**: Interactive code editor with execution
- **QuizSection**: Various question types with immediate feedback
- **InteractiveDemo**: Custom interactive experiences

## Authentication & Authorization

### User Roles
- **Student**: Course enrollment, progress tracking, quiz submission
- **Instructor**: Course creation, student progress monitoring
- **Admin**: Full platform management, user administration

### Session Management
- JWT tokens via Supabase Auth
- 24-hour session duration with automatic refresh
- Multiple concurrent sessions allowed
- Secure cookie configuration (httpOnly, secure, sameSite)

## Testing Strategy

### Unit Testing (Jest + React Testing Library)
- Target 90% code coverage
- Test all business logic functions
- Test component rendering and interactions
- Mock external dependencies (Supabase, APIs)

### Integration Testing
- Test API endpoints with test database
- Test authentication flows
- Test database operations and RLS policies

### E2E Testing (Playwright)
- Test critical user journeys
- Test course enrollment and lesson completion
- Test quiz submission and progress tracking

## Performance Considerations

### Frontend Optimization
- Implement code splitting for lesson components
- Use Next.js Image component for image optimization
- Lazy load heavy assets and non-critical components
- Target <250KB initial bundle size
- Achieve Core Web Vitals targets (LCP <2.5s, FID <100ms, CLS <0.1)

### Backend Optimization
- Database query optimization with proper indexes
- Implement caching for frequently accessed data
- Use connection pooling for database connections
- Monitor and optimize API response times (<500ms target)

### Real-time Features
- Use Supabase Realtime for progress updates
- Implement optimistic updates for better UX
- Handle offline scenarios with queued updates

## Security Implementation

### Data Protection
- TLS 1.3 for all communications
- AES-256 encryption for sensitive data at rest
- Input validation on all API endpoints
- SQL injection prevention through parameterized queries

### Authentication Security
- Strong password requirements (8+ chars, mixed case, numbers, symbols)
- Account lockout after 5 failed attempts
- Email verification required for account activation
- Password reset via secure email flow

### Authorization
- Row Level Security (RLS) for all database operations
- Role-based access control (RBAC)
- API endpoint permission checking
- User data isolation and privacy protection

## Deployment & Infrastructure

### Development Environment
- Local Next.js development server
- Local Supabase instance via CLI
- Environment variable management
- Hot reloading for rapid development

### Staging Environment
- Vercel preview deployments
- Staging Supabase project
- CI/CD pipeline with automated testing

### Production Environment
- Vercel production deployment
- Production Supabase project
- CDN via Cloudflare
- Monitoring with Sentry and Vercel Analytics

## Monitoring & Analytics

### Error Tracking
- Sentry for production error monitoring
- Structured logging for debugging
- Performance monitoring and alerting

### Business Analytics
- User engagement tracking
- Course completion rates
- Learning progress analytics
- Instructor performance metrics

## Development Guidelines

### Code Quality
- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- Husky pre-commit hooks for quality checks
- Code review requirements for all changes

### Git Workflow
- Feature branch development
- Pull request reviews required
- Automated testing in CI pipeline
- Semantic commit messages

### Documentation
- Inline code documentation for complex logic
- API documentation with OpenAPI specs
- Component documentation with Storybook (if implemented)
- Database schema documentation

## Common Issues & Solutions

### Database Performance
- If queries are slow, check for missing indexes on frequently queried columns
- Use `EXPLAIN ANALYZE` to optimize complex queries
- Consider materialized views for heavy analytics

### Authentication Issues
- Ensure RLS policies are properly configured
- Check that user roles are correctly assigned
- Verify JWT token expiration and refresh logic

### Component Loading
- Implement proper error boundaries for lesson components
- Use React Suspense for loading states
- Handle component registration and dynamic imports correctly

### Progress Tracking
- Ensure progress updates are debounced to avoid excessive API calls
- Implement offline support with sync when connection restored
- Handle race conditions in progress updates

This guide should help you understand the project structure and development patterns. The codebase follows modern React/Next.js patterns with a focus on type safety, performance, and maintainable architecture.