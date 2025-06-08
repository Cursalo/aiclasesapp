# Technology Stack Specification

## Architecture Overview

### System Architecture Pattern
**Jamstack Architecture** with modern full-stack capabilities

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (Browser/Mobile)                  │
├─────────────────────────────────────────────────────────────┤
│                     CDN (Cloudflare)                       │
├─────────────────────────────────────────────────────────────┤
│                 Frontend (Next.js on Vercel)               │
├─────────────────────────────────────────────────────────────┤
│               Backend API (Next.js API Routes)             │
├─────────────────────────────────────────────────────────────┤
│                Database & Auth (Supabase)                  │
├─────────────────────────────────────────────────────────────┤
│              File Storage (Supabase Storage)               │
└─────────────────────────────────────────────────────────────┘
```

### Core Design Principles
- **Developer Experience First**: Tools chosen for productivity and maintainability
- **Type Safety**: TypeScript throughout the entire stack
- **Performance**: Optimized for speed and scalability
- **Modern Standards**: Latest versions and best practices
- **Monorepo Simplicity**: Single repository for easier maintenance

## Frontend Technology Stack

### Core Framework and Language

#### Next.js 14+
**Role**: Full-stack React framework  
**Version**: 14.0+ (App Router)  
**Why Chosen**: 
- Built-in SSR/SSG capabilities for SEO and performance
- API routes for backend functionality
- Automatic code splitting and optimization
- Excellent developer experience with hot reloading
- Strong TypeScript support
- Vercel deployment optimization

**Key Features Used**:
```typescript
// App Router structure
app/
├── (auth)/          // Route groups
├── (dashboard)/     // Protected routes
├── api/            // API endpoints
├── globals.css     // Global styles
├── layout.tsx      // Root layout
└── page.tsx        // Home page

// Advanced features
- Server Components for performance
- Client Components for interactivity
- Streaming and Suspense
- Parallel routing
- Intercepting routes
```

#### React 18+
**Role**: UI library  
**Version**: 18.2+  
**Why Chosen**:
- Industry standard for interactive UIs
- Concurrent features for better performance
- Excellent ecosystem and community
- Perfect for educational interactive content

**Key Features Used**:
```typescript
// Modern React patterns
- Functional components with hooks
- Suspense for loading states
- Error boundaries for fault tolerance
- React.memo for performance optimization
- useTransition for better UX
- Custom hooks for reusable logic
```

#### TypeScript 5+
**Role**: Programming language  
**Version**: 5.0+  
**Why Chosen**:
- Type safety reduces bugs significantly
- Better IDE support and autocomplete
- Easier refactoring and maintenance
- Excellent integration with React and Next.js

**Configuration**:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Styling and UI Framework

#### Tailwind CSS 3+
**Role**: CSS framework  
**Version**: 3.4+  
**Why Chosen**:
- Utility-first approach for rapid development
- Excellent responsive design capabilities
- Built-in design system and consistency
- Small bundle size with purging
- Great developer experience

**Configuration**:
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom LMS color palette
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        // Course difficulty colors
        beginner: '#10b981',
        intermediate: '#f59e0b',
        advanced: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}
```

#### Shadcn/ui
**Role**: Component library foundation  
**Why Chosen**:
- High-quality, accessible components
- Built on Radix UI primitives
- Full TypeScript support
- Customizable with Tailwind CSS
- Copy-paste approach (no dependencies)

**Core Components**:
```typescript
// Key components used
- Button, Input, Card, Dialog
- Dropdown, Select, Checkbox, Radio
- Progress, Badge, Avatar
- Sheet, Popover, Tooltip
- Command, Calendar, Form
```

### State Management

#### Zustand
**Role**: Global state management  
**Version**: 4.4+  
**Why Chosen**:
- Minimal boilerplate compared to Redux
- Excellent TypeScript support
- Small bundle size
- Simple mental model
- Perfect for medium-complexity apps

**Implementation**:
```typescript
// stores/auth-store.ts
interface AuthState {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  signIn: (credentials: LoginCredentials) => Promise<void>
  signOut: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        profile: null,
        isLoading: false,
        signIn: async (credentials) => {
          // Implementation
        },
        signOut: () => set({ user: null, profile: null }),
      }),
      { name: 'auth-storage' }
    )
  )
)
```

#### TanStack Query (React Query)
**Role**: Server state management  
**Version**: 5.0+  
**Why Chosen**:
- Excellent caching and synchronization
- Background updates and refetching
- Optimistic updates
- Error handling and retry logic
- Perfect for data-heavy applications

**Usage**:
```typescript
// hooks/use-courses.ts
export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: () => api.courses.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useUpdateProgress() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.progress.update,
    onSuccess: () => {
      queryClient.invalidateQueries(['progress'])
    },
  })
}
```

### Forms and Validation

#### React Hook Form
**Role**: Form management  
**Version**: 7.45+  
**Why Chosen**:
- Excellent performance with minimal re-renders
- Built-in validation support
- Great TypeScript integration
- Easy integration with UI libraries

#### Zod
**Role**: Schema validation  
**Version**: 3.22+  
**Why Chosen**:
- TypeScript-first validation
- Excellent type inference
- Composable schemas
- Works seamlessly with React Hook Form

**Implementation**:
```typescript
// lib/validations.ts
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  fullName: z.string().min(2, 'Full name is required'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
})

export type RegisterFormData = z.infer<typeof registerSchema>

// components/auth/register-form.tsx
export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    // Handle submission
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

## Backend Technology Stack

### Database and Backend Service

#### Supabase
**Role**: Backend-as-a-Service  
**Version**: Latest  
**Why Chosen**:
- PostgreSQL database with real-time capabilities
- Built-in authentication and authorization
- Row Level Security for data protection
- File storage with CDN
- Serverless functions
- Excellent developer experience

**Services Used**:
```typescript
// Database: PostgreSQL 15+
- ACID compliance and reliability
- Advanced indexing and performance
- JSON/JSONB support for flexible data
- Full-text search capabilities
- Materialized views for analytics

// Authentication: Supabase Auth
- JWT-based authentication
- Social login providers
- Email verification
- Password reset flows
- Multi-factor authentication (optional)

// Storage: Supabase Storage
- S3-compatible object storage
- Image optimization and transformation
- CDN for global distribution
- Automatic backup and versioning

// Real-time: Supabase Realtime
- WebSocket connections for live updates
- Row-level subscriptions
- Presence tracking
- Broadcast messaging
```

#### Database Architecture
```sql
-- Core tables with relationships
profiles (1) ←→ (∞) courses (instructor relationship)
courses (1) ←→ (∞) lessons
courses (1) ←→ (∞) enrollments ←→ (1) profiles
lessons (1) ←→ (∞) lesson_progress ←→ (1) profiles
lessons (1) ←→ (∞) quiz_attempts ←→ (1) profiles
achievements (1) ←→ (∞) user_achievements ←→ (1) profiles

-- Performance optimizations
- Proper indexing on all foreign keys
- Composite indexes for common queries
- Materialized views for analytics
- Partitioning for large tables
```

### API Design

#### Next.js API Routes
**Role**: Backend API  
**Why Chosen**:
- Seamless integration with frontend
- Serverless deployment on Vercel
- TypeScript support throughout
- Easy testing and development

**Structure**:
```typescript
// app/api structure
api/
├── auth/
│   ├── register/route.ts
│   ├── login/route.ts
│   └── callback/route.ts
├── courses/
│   ├── route.ts
│   ├── [id]/route.ts
│   └── [id]/lessons/route.ts
├── progress/
│   ├── route.ts
│   └── [userId]/route.ts
├── quiz/
│   ├── submit/route.ts
│   └── attempts/route.ts
└── admin/
    ├── users/route.ts
    ├── courses/route.ts
    └── analytics/route.ts
```

**API Standards**:
```typescript
// Consistent response format
interface APIResponse<T> {
  data?: T
  error?: string
  message?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
  }
}

// Error handling
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

// Rate limiting
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    await rateLimit(request, { max: 10, window: '1m' })
    // Handle request
  } catch (error) {
    return new Response('Rate limit exceeded', { status: 429 })
  }
}
```

## Interactive Component Technologies

### Video Player

#### Video.js
**Role**: Video playback  
**Version**: 8.0+  
**Why Chosen**:
- HTML5 video with fallbacks
- Extensive plugin ecosystem
- Accessibility support
- Custom player controls
- Analytics integration

**Implementation**:
```typescript
// components/video-player.tsx
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

interface VideoPlayerProps {
  src: string
  onProgress: (currentTime: number, duration: number) => void
  onComplete: () => void
}

export function VideoPlayer({ src, onProgress, onComplete }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<videojs.Player | null>(null)

  useEffect(() => {
    if (videoRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        responsive: true,
        fluid: true,
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        plugins: {
          hotkeys: true,
        },
      })

      playerRef.current.on('timeupdate', () => {
        const currentTime = playerRef.current?.currentTime() || 0
        const duration = playerRef.current?.duration() || 0
        onProgress(currentTime, duration)
      })

      playerRef.current.on('ended', onComplete)
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose()
      }
    }
  }, [src, onProgress, onComplete])

  return (
    <video
      ref={videoRef}
      className="video-js vjs-default-skin"
      data-setup="{}"
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}
```

### Code Editor

#### Monaco Editor
**Role**: Code editing and execution  
**Version**: Latest  
**Why Chosen**:
- VS Code's editor engine
- Syntax highlighting for all languages
- IntelliSense and autocomplete
- Error detection and linting
- Customizable themes

**Implementation**:
```typescript
// components/code-editor.tsx
import { Editor } from '@monaco-editor/react'

interface CodeEditorProps {
  language: string
  value: string
  onChange: (value: string) => void
  onRun?: (code: string) => void
  theme?: 'light' | 'dark'
}

export function CodeEditor({
  language,
  value,
  onChange,
  onRun,
  theme = 'light'
}: CodeEditorProps) {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '')
  }

  const executeCode = () => {
    if (onRun) {
      onRun(value)
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-2 bg-muted">
        <span className="text-sm font-medium">{language}</span>
        {onRun && (
          <Button size="sm" onClick={executeCode}>
            <Play className="h-4 w-4 mr-1" />
            Run
          </Button>
        )}
      </div>
      <Editor
        height="300px"
        language={language}
        value={value}
        onChange={handleEditorChange}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          wordWrap: 'on',
        }}
      />
    </div>
  )
}
```

## Development Tools and Infrastructure

### Development Environment

#### Package Manager: pnpm
**Version**: 8.0+  
**Why Chosen**:
- Faster installation than npm/yarn
- Efficient disk space usage
- Strict dependency management
- Monorepo support

#### Version Control: Git + GitHub
**Features Used**:
- Branch protection rules
- Pull request templates
- Issue templates
- GitHub Actions for CI/CD
- Dependabot for dependency updates

**Workflow**:
```yaml
# .github/workflows/ci.yml
name: CI/CD
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm run type-check
      - run: pnpm run lint
      - run: pnpm run test
      - run: pnpm run build
```

### Code Quality and Testing

#### ESLint + Prettier
**Role**: Code quality and formatting  
**Configuration**:
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    '@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
  },
}

// .prettierrc
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false
}
```

#### Testing Framework
```typescript
// Jest configuration
import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}

export default config
```

#### Testing Libraries
- **Jest**: JavaScript testing framework
- **React Testing Library**: React component testing
- **Playwright**: End-to-end testing
- **MSW**: API mocking for tests

### Deployment and Hosting

#### Vercel
**Role**: Frontend hosting and deployment  
**Why Chosen**:
- Optimized for Next.js applications
- Automatic deployments from Git
- Edge network for global performance
- Serverless functions support
- Built-in analytics and monitoring

**Configuration**:
```json
// vercel.json
{
  "buildCommand": "pnpm run build",
  "devCommand": "pnpm run dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["iad1", "sfo1", "fra1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

#### Cloudflare
**Role**: CDN and performance optimization  
**Services Used**:
- Global CDN for static assets
- Image optimization and resizing
- DDoS protection
- Web Application Firewall
- Analytics and performance monitoring

### Monitoring and Analytics

#### Sentry
**Role**: Error tracking and performance monitoring  
**Configuration**:
```typescript
// sentry.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  beforeSend(event) {
    if (event.exception) {
      const error = event.exception.values?.[0]
      if (error?.value?.includes('ResizeObserver loop limit exceeded')) {
        return null // Filter out known harmless errors
      }
    }
    return event
  },
})
```

#### Vercel Analytics
**Role**: Web analytics and performance monitoring  
**Features**:
- Core Web Vitals tracking
- Page view analytics
- Performance monitoring
- Real User Monitoring (RUM)

## External Services and Integrations

### Communication Services

#### SendGrid
**Role**: Email delivery  
**Usage**:
- User registration confirmation
- Password reset emails
- Course completion notifications
- Marketing emails (optional)

#### Slack/Discord (Optional)
**Role**: Community integration  
**Usage**:
- Course discussion channels
- Instructor notifications
- Community building

### Payment Processing (Future)

#### Stripe
**Role**: Payment processing  
**Features**:
- One-time payments for courses
- Subscription management
- Invoice generation
- Tax handling
- Strong Customer Authentication (SCA)

### Content Delivery

#### Video Hosting Options
1. **Supabase Storage** (Phase 1)
   - Direct upload and streaming
   - Cost-effective for start
   - Basic video optimization

2. **Vimeo Pro** (Phase 2)
   - Better video quality and streaming
   - Advanced analytics
   - Customizable player

3. **AWS S3 + CloudFront** (Phase 3)
   - Ultimate scalability
   - Advanced CDN features
   - Cost optimization for large scale

## Development Workflow

### Local Development Setup
```bash
# Prerequisites
node --version  # v18+
pnpm --version  # v8+
git --version   # Latest

# Project setup
git clone <repository>
cd lms-platform
pnpm install

# Environment setup
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Database setup
supabase start
supabase db reset

# Start development
pnpm run dev
```

### Production Deployment Process
```bash
# 1. Code review and testing
git checkout -b feature/new-feature
# Make changes
git commit -m "feat: add new feature"
git push origin feature/new-feature
# Create pull request

# 2. Automated testing
# GitHub Actions runs:
# - TypeScript type checking
# - ESLint code quality
# - Jest unit tests
# - Playwright E2E tests
# - Build verification

# 3. Deployment
# Merge to main triggers:
# - Automatic deployment to Vercel
# - Database migration (if needed)
# - Cache invalidation
# - Monitoring alerts
```

## Performance and Optimization

### Frontend Optimizations
- **Code Splitting**: Route-based and component-based
- **Image Optimization**: Next.js Image component with WebP
- **Font Optimization**: Self-hosted fonts with font-display: swap
- **Bundle Analysis**: Regular bundle size monitoring
- **Caching Strategy**: Aggressive caching for static assets

### Backend Optimizations
- **Database Indexing**: Optimized indexes for all queries
- **Connection Pooling**: Supabase handles automatically
- **Query Optimization**: Using EXPLAIN ANALYZE for optimization
- **Caching**: Redis for session data and frequently accessed content
- **Rate Limiting**: Prevent abuse and ensure fair usage

### Monitoring Setup
```typescript
// lib/monitoring.ts
export const performanceMonitor = {
  // Core Web Vitals
  trackCWV: () => {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log)
      getFID(console.log)
      getFCP(console.log)
      getLCP(console.log)
      getTTFB(console.log)
    })
  },

  // Custom metrics
  trackLessonProgress: (lessonId: string, progress: number) => {
    // Send to analytics
  },

  trackVideoPlayback: (videoId: string, duration: number) => {
    // Send to analytics
  },
}
```

This comprehensive technology stack provides a solid foundation for building a modern, scalable, and maintainable Learning Management System with excellent developer experience and user performance.