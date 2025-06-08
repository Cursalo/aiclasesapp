# System Flow Documentation

## Overview

This document outlines all critical user flows, system processes, and data flows within the LMS platform. Each flow includes detailed steps, decision points, error handling, and success criteria.

## Authentication Flows

### User Registration Flow

```mermaid
graph TD
    A[User visits /register] --> B[Fill registration form]
    B --> C{Form validation}
    C -->|Invalid| D[Show validation errors]
    D --> B
    C -->|Valid| E[Submit to API]
    E --> F{Email exists?}
    F -->|Yes| G[Show error: Email already registered]
    G --> B
    F -->|No| H[Create Supabase auth user]
    H --> I{User created?}
    I -->|No| J[Show error: Registration failed]
    J --> B
    I -->|Yes| K[Create profile record]
    K --> L[Send verification email]
    L --> M[Show success message]
    M --> N[Redirect to email verification page]
```

**Detailed Steps:**

1. **Form Submission**
   - User enters: email, password, full name, username
   - Frontend validation: email format, password strength, username availability
   - Real-time username availability check via API

2. **Backend Processing**
   - Validate input with Zod schema
   - Check email uniqueness in Supabase Auth
   - Create user account with `supabase.auth.signUp()`
   - Create profile record in profiles table
   - Handle any errors (email exists, weak password, etc.)

3. **Email Verification**
   - Supabase sends verification email automatically
   - User clicks verification link
   - Redirects to `/auth/callback` with verification token
   - User is automatically signed in after verification

**Error Handling:**
- Network errors: Show retry option
- Validation errors: Highlight specific fields
- Email already exists: Suggest login or password reset
- Username taken: Suggest alternatives

### User Login Flow

```mermaid
graph TD
    A[User visits /login] --> B[Enter credentials]
    B --> C{Form validation}
    C -->|Invalid| D[Show validation errors]
    D --> B
    C -->|Valid| E[Submit to Supabase Auth]
    E --> F{Credentials valid?}
    F -->|No| G[Show error: Invalid credentials]
    G --> B
    F -->|Yes| H{Email verified?}
    H -->|No| I[Show: Please verify email]
    I --> J[Resend verification option]
    H -->|Yes| K[Fetch user profile]
    K --> L[Update auth store]
    L --> M{Has intended destination?}
    M -->|Yes| N[Redirect to intended page]
    M -->|No| O[Redirect to dashboard]
```

**Detailed Steps:**

1. **Credential Validation**
   - Email format validation
   - Password minimum length check
   - Submit via `supabase.auth.signInWithPassword()`

2. **Post-Login Processing**
   - Fetch user profile from profiles table
   - Update Zustand auth store
   - Set up real-time subscriptions
   - Redirect based on user role and intended destination

**Error Handling:**
- Invalid credentials: Clear form, show error
- Unverified email: Show verification options
- Account locked: Show contact support
- Network issues: Show retry button

### Password Reset Flow

```mermaid
graph TD
    A[User clicks 'Forgot Password'] --> B[Enter email address]
    B --> C[Submit reset request]
    C --> D[Supabase sends reset email]
    D --> E[Show confirmation message]
    E --> F[User clicks email link]
    F --> G[Redirect to reset password page]
    G --> H[Enter new password]
    H --> I{Password valid?}
    I -->|No| J[Show validation errors]
    J --> H
    I -->|Yes| K[Submit new password]
    K --> L[Update password in Supabase]
    L --> M[Show success message]
    M --> N[Redirect to login]
```

## Course Enrollment Flow

### Free Course Enrollment

```mermaid
graph TD
    A[User views course page] --> B{User authenticated?}
    B -->|No| C[Show login prompt]
    C --> D[Redirect to login]
    D --> E[Return to course page]
    E --> A
    B -->|Yes| F{Already enrolled?}
    F -->|Yes| G[Show 'Continue Learning' button]
    G --> H[Redirect to first incomplete lesson]
    F -->|No| I[Show 'Enroll Free' button]
    I --> J[User clicks enroll]
    J --> K[Create enrollment record]
    K --> L[Update course enrollment count]
    L --> M[Show success message]
    M --> N[Enable course access]
    N --> O[Redirect to first lesson]
```

### Premium Course Enrollment

```mermaid
graph TD
    A[User views premium course] --> B{User authenticated?}
    B -->|No| C[Show login prompt]
    B -->|Yes| D{Already enrolled?}
    D -->|Yes| E[Show course content]
    D -->|No| F[Show price and 'Enroll' button]
    F --> G[User clicks enroll]
    G --> H[Redirect to payment page]
    H --> I[Process payment]
    I --> J{Payment successful?}
    J -->|No| K[Show payment error]
    K --> H
    J -->|Yes| L[Create enrollment record]
    L --> M[Send confirmation email]
    M --> N[Grant course access]
    N --> O[Redirect to first lesson]
```

## Lesson Learning Flow

### Lesson Access and Progress

```mermaid
graph TD
    A[User clicks lesson] --> B{User enrolled in course?}
    B -->|No| C[Show enrollment prompt]
    C --> D[Redirect to course page]
    B -->|Yes| E{Lesson prerequisites met?}
    E -->|No| F[Show prerequisites message]
    F --> G[Suggest required lessons]
    E -->|Yes| H[Load lesson component]
    H --> I[Track lesson start time]
    I --> J[Initialize progress tracking]
    J --> K[Render lesson content]
    K --> L[User interacts with content]
    L --> M[Update section progress]
    M --> N{Section completed?}
    N -->|Yes| O[Mark section as complete]
    O --> P{All sections complete?}
    P -->|Yes| Q[Mark lesson as complete]
    Q --> R[Update course progress]
    R --> S[Check for achievements]
    S --> T[Award points/badges]
    T --> U[Show completion notification]
    P -->|No| V[Continue to next section]
    V --> L
```

**Detailed Progress Tracking:**

1. **Section-Level Tracking**
   - Text sections: Viewed for 3+ seconds
   - Video sections: Watched 90%+ of duration
   - Code sections: Code executed successfully
   - Quiz sections: Completed with passing score

2. **Lesson-Level Completion**
   - All sections marked complete
   - Minimum time threshold met
   - All quizzes passed (if required)

3. **Real-time Updates**
   - Progress saved every 30 seconds
   - Immediate updates on section completion
   - Sync across multiple browser tabs

### Video Playback Flow

```mermaid
graph TD
    A[Video section loads] --> B[Initialize video player]
    B --> C[Load video metadata]
    C --> D[Show play button]
    D --> E[User clicks play]
    E --> F[Start playback]
    F --> G[Track viewing time]
    G --> H{User pauses/seeks?}
    H -->|Yes| I[Update watch time]
    I --> G
    H -->|No| J{90% watched?}
    J -->|No| G
    J -->|Yes| K[Mark video complete]
    K --> L[Update lesson progress]
    L --> M[Award points]
    M --> N[Continue to next section]
```

**Video Progress Features:**
- Resume from last position
- Playback speed control
- Automatic quality adjustment
- Captions/subtitles support
- Download for offline viewing (premium)

### Quiz Submission Flow

```mermaid
graph TD
    A[User starts quiz] --> B[Load quiz questions]
    B --> C[Display first question]
    C --> D[User selects answer]
    D --> E{More questions?}
    E -->|Yes| F[Next question]
    F --> C
    E -->|No| G[Show review screen]
    G --> H[User submits quiz]
    H --> I[Calculate score]
    I --> J[Store quiz attempt]
    J --> K{Score >= passing?}
    K -->|No| L[Show retry option]
    L --> M{Retries remaining?}
    M -->|Yes| A
    M -->|No| N[Show failed message]
    K -->|Yes| O[Mark quiz passed]
    O --> P[Update lesson progress]
    P --> Q[Award points]
    Q --> R[Show success message]
    R --> S[Continue to next section]
```

**Quiz Features:**
- Multiple question types (multiple choice, multiple select, true/false)
- Immediate feedback (optional)
- Question randomization
- Time limits (optional)
- Multiple attempts with decreasing points
- Detailed explanations for incorrect answers

## Dashboard and Analytics Flow

### Student Dashboard Flow

```mermaid
graph TD
    A[User accesses dashboard] --> B[Fetch user data]
    B --> C[Load enrolled courses]
    C --> D[Calculate progress stats]
    D --> E[Fetch recent activity]
    E --> F[Load achievements]
    F --> G[Get leaderboard position]
    G --> H[Render dashboard]
    H --> I[User interacts with elements]
    I --> J{Action type?}
    J -->|Continue course| K[Redirect to next lesson]
    J -->|View progress| L[Show detailed progress]
    J -->|Browse courses| M[Redirect to course catalog]
    J -->|View achievements| N[Show achievements modal]
```

**Dashboard Components:**
- Progress overview (courses, lessons, time spent)
- Continue learning section (incomplete courses)
- Recent achievements and badges
- Learning streak counter
- Upcoming deadlines (if applicable)
- Recommended courses
- Quick stats (total points, rank, courses completed)

### Admin Analytics Flow

```mermaid
graph TD
    A[Admin accesses analytics] --> B{Admin permissions?}
    B -->|No| C[Show access denied]
    B -->|Yes| D[Load platform stats]
    D --> E[Fetch user metrics]
    E --> F[Get course performance]
    F --> G[Calculate engagement metrics]
    G --> H[Load financial data]
    H --> I[Render admin dashboard]
    I --> J[User selects time range]
    J --> K[Update all metrics]
    K --> L[Refresh visualizations]
    L --> M{Export requested?}
    M -->|Yes| N[Generate report]
    N --> O[Download file]
    M -->|No| P[Continue monitoring]
```

**Analytics Metrics:**
- User acquisition and retention
- Course completion rates
- Average time per lesson
- Revenue metrics (premium courses)
- Popular content and drop-off points
- Geographic distribution
- Device and browser analytics

## Gamification System Flow

### Achievement System Flow

```mermaid
graph TD
    A[User completes action] --> B[Trigger achievement check]
    B --> C[Get user statistics]
    C --> D[Check all achievement criteria]
    D --> E{Achievement earned?}
    E -->|No| F[Continue normal flow]
    E -->|Yes| G[Create achievement record]
    G --> H[Award points]
    H --> I[Update user stats]
    I --> J[Send notification]
    J --> K[Show achievement popup]
    K --> L[Update leaderboard]
    L --> M[Share achievement option]
```

**Achievement Types:**
- Course completion badges
- Streak achievements (daily login, weekly study)
- Quiz master (high scores)
- Early bird (first to complete new course)
- Perfectionist (100% lesson completion)
- Social achievements (referrals, reviews)

### Points and Leaderboard Flow

```mermaid
graph TD
    A[User earns points] --> B[Update user points]
    B --> C[Recalculate rank]
    C --> D[Update leaderboard cache]
    D --> E[Broadcast rank change]
    E --> F{Rank milestone?}
    F -->|Yes| G[Award rank badge]
    G --> H[Show rank notification]
    F -->|No| I[Continue normal flow]
    H --> I
```

**Point System:**
- Lesson completion: 10-50 points (based on difficulty)
- Quiz completion: 20-100 points (based on score)
- Course completion: 100-500 points
- Daily login: 5 points
- Streak bonuses: 2x multiplier
- Perfect quiz: Bonus 50 points

## Error Handling and Recovery

### Network Error Recovery

```mermaid
graph TD
    A[Network request fails] --> B[Check error type]
    B --> C{Temporary error?}
    C -->|Yes| D[Show retry button]
    D --> E[User clicks retry]
    E --> F[Attempt request again]
    F --> G{Success?}
    G -->|No| H{Max retries reached?}
    H -->|No| D
    H -->|Yes| I[Show persistent error]
    G -->|Yes| J[Continue normal flow]
    C -->|No| K[Show specific error]
    K --> L[Provide resolution steps]
```

### Data Sync and Offline Support

```mermaid
graph TD
    A[User goes offline] --> B[Cache current progress]
    B --> C[Continue lesson locally]
    C --> D[Store actions in queue]
    D --> E[User comes online]
    E --> F[Sync queued actions]
    F --> G{Conflicts detected?}
    G -->|Yes| H[Resolve conflicts]
    H --> I[Merge changes]
    G -->|No| I
    I --> J[Update remote state]
    J --> K[Clear local queue]
    K --> L[Resume normal operation]
```

## Content Management Flow

### Course Creation Flow (Instructor)

```mermaid
graph TD
    A[Instructor creates course] --> B[Fill course details]
    B --> C[Upload thumbnail]
    C --> D[Set pricing/access]
    D --> E[Create first lesson]
    E --> F[Add lesson content]
    F --> G[Configure quiz (if any)]
    G --> H[Preview lesson]
    H --> I{Content satisfactory?}
    I -->|No| J[Edit content]
    J --> F
    I -->|Yes| K[Add more lessons]
    K --> L{Course complete?}
    L -->|No| E
    L -->|Yes| M[Review entire course]
    M --> N[Submit for approval]
    N --> O[Admin reviews course]
    O --> P{Approved?}
    P -->|No| Q[Request changes]
    Q --> J
    P -->|Yes| R[Publish course]
    R --> S[Notify instructor]
    S --> T[Course available to students]
```

### Lesson Component Deployment

```mermaid
graph TD
    A[Developer creates lesson] --> B[Write JSX component]
    B --> C[Add metadata file]
    C --> D[Create assets]
    D --> E[Register in lesson registry]
    E --> F[Write unit tests]
    F --> G[Run local tests]
    G --> H{Tests pass?}
    H -->|No| I[Fix issues]
    I --> B
    H -->|Yes| J[Commit to repository]
    J --> K[CI/CD pipeline runs]
    K --> L[Deploy to staging]
    L --> M[Run E2E tests]
    M --> N{Tests pass?}
    N -->|No| O[Investigate failures]
    O --> I
    N -->|Yes| P[Deploy to production]
    P --> Q[Update lesson registry]
    Q --> R[Lesson available to users]
```

## Performance and Monitoring

### Real-time Performance Monitoring

```mermaid
graph TD
    A[User action triggers event] --> B[Measure performance metrics]
    B --> C[Log to analytics service]
    C --> D{Performance threshold exceeded?}
    D -->|No| E[Continue monitoring]
    D -->|Yes| F[Alert development team]
    F --> G[Investigate issue]
    G --> H[Deploy fix]
    H --> I[Verify performance improvement]
    I --> E
```

**Monitored Metrics:**
- Page load times
- API response times
- Video buffering events
- Quiz submission delays
- Database query performance
- Error rates and types

This comprehensive flow documentation ensures all team members understand the system's behavior and can implement features consistently with proper error handling and user experience considerations.