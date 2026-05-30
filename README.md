# CourseCraft Client

CourseCraft Client is the Next.js frontend for **CourseCraft**, an AI-assisted learning platform that helps learners and student creators generate, refine, and publish structured courses.

It combines course generation, lesson delivery, practice tools, capstone workflows, and progress tracking in one interface.

## What this application is about

CourseCraft focuses on reducing the friction of building and following a learning plan:

- Generate structured courses from a topic prompt
- Refine content with AI-assisted workflows
- Deliver lessons with quizzes and coding practice
- Track learner progress and milestones
- Publish courses for others to enroll in
- Showcase finished work in capstone galleries

The project started as a thesis-driven, student-first platform and is built around practical course production and learning continuity.

## Core capabilities

- **AI course generation**: Prompt-to-outline course drafting
- **Course authoring workflow**: Edit chapters/lessons and regenerate sections
- **Learning dashboard**: Enrolled courses, generated drafts, and recommendations
- **Adaptive practice**: Integrated code playground experiences
- **Assessment and interaction**: Quiz flow, likes, comments, and engagement features
- **Capstone flow**: Submission tracking and gallery presentation
- **Authentication & protected routes**: Firebase-backed auth with middleware checks
- **Realtime support**: Socket.io connection for live features

## Tech stack

- **Framework**: Next.js (App Router) + React + TypeScript
- **State/data**: TanStack React Query + Context providers
- **Auth**: Firebase Authentication
- **Realtime**: Socket.io Client
- **UI**: Tailwind CSS v4 + Radix UI + Framer Motion
- **Forms/validation**: React Hook Form + Zod
- **Tooling**: Biome (lint/format)
- **Deployment target**: Vercel

## Architecture overview

- Feature-based structure under `src/features/*` with layered organization:
  - `domain/` for schemas and types
  - `application/` for hooks and orchestration
  - `presentation/` for UI components
- API access through `src/server/features/*` and shared request helpers
- Global providers in `src/app/layout.tsx` (theme, query, auth, socket, generation)
- Route protection in `src/middleware.ts` using the `auth-token` cookie
- Next.js rewrites proxy backend API routes (`/api/*`, `/uploads/*`)

## Project structure

```text
src/
  app/                # App Router pages and route groups
    (auth)/           # Public auth pages (signin/signup)
    (protected)/      # Auth-required pages (dashboard, create, learn, etc.)
  components/         # Shared UI and page components
  features/           # Domain features (auth, course, create, lessons, quiz, ...)
  provider/           # Global providers (query, socket, theme)
  server/             # API client layer and feature endpoints
  utils/, hooks/, lib/# Shared helpers and utilities
```

## Getting started

### 1) Prerequisites

- Node.js 20+
- npm 10+
- Running CourseCraft backend API (default: `http://localhost:8080`)
  - This repository contains the client only; get the matching backend service from your team/backend repository and run it before starting the frontend.

### 2) Install dependencies

```bash
npm install
```

### 3) Configure environment

Create `.env.local` in the repository root and set:

```bash
# Backend/API
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### 4) Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available scripts

- `npm run dev` — start local development server (Turbopack)
- `npm run build` — create production build
- `npm run start` — run production server
- `npm run lint` — run Biome checks
- `npm run format` — format code with Biome

## Important notes

- This frontend depends on a separate backend service.

## Status

This repository is the active client application for the CourseCraft platform and continues to evolve with new learning, generation, and recommendation features.
