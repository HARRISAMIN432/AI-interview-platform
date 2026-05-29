@AGENTS.md

# AI Resume Analyzer - Project Progress

## Phase 1: Foundation & Infrastructure (Completed)

### Module 1: Project scaffold & configuration (Completed)
- Initialized Next.js App Router with strict TypeScript
- Configured TailwindCSS + shadcn/ui
- Set up complete `src/` folder architecture
- Configured absolute path aliases
- Created `src/config/env.ts` with Zod-validated environment variables for Clerk, Gemini, AWS S3, and PostgreSQL

### Module 2: Database schema & Prisma setup (Completed)
- Designed complete PostgreSQL schema using Prisma
- Created models: User, Resume, JobDescription, Interview, InterviewQuestion, InterviewAnswer, ATSScore, Feedback
- Implemented relationships, indexes, and enums
- Created `src/lib/db/prisma.ts` as a singleton Prisma client

### Module 3: Clerk authentication & webhooks (Completed)
- Integrated Clerk authentication
- Created `src/middleware.ts` to protect `/dashboard`, `/resume`, `/interview`, `/analytics`, and `/feedback` routes
- Built customized `/sign-in` and `/sign-up` pages matching the app's dark mode theme
- Implemented `/api/webhooks/clerk` endpoint with Svix signature verification to automatically sync users to PostgreSQL
- Created `src/lib/auth/get-user.ts` server utility to seamlessly fetch authenticated Prisma user records

## Next Steps
- Module 4: App shell & layout system
- Phase 2: Resume Upload & ATS Scoring
