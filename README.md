# PDN - Problem Discovery Network

Copy-first solution templates for common problems. No sign-up required.

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment

```bash
cp .env.example .env
# Edit .env with your PostgreSQL connection string
```

### 3. Set up database

```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:seed       # Seed initial data
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                          # Redirects to /problems
│   ├── layout.tsx                        # Root layout
│   ├── globals.css                       # Global styles
│   ├── problems/
│   │   ├── page.tsx                      # Problem list page
│   │   └── [slug]/
│   │       └── page.tsx                  # Problem detail page
│   └── api/
│       ├── problems/
│       │   └── route.ts                  # GET /api/problems
│       └── solutions/
│           └── [id]/
│               ├── copy/
│               │   └── route.ts          # POST - increment copyCount
│               └── feedback/
│                   └── route.ts          # POST - submit feedback
├── components/
│   └── pdn/
│       ├── problems/
│       │   └── ProblemsListView.tsx      # Problem list UI
│       └── problem-detail/
│           ├── ProblemDetail.tsx         # Container (state, handlers)
│           ├── ProblemDetailView.tsx     # View (props only)
│           └── SolutionCardView.tsx      # Solution card with feedback
├── hooks/
│   ├── useClipboard.ts                   # Copy to clipboard + API
│   └── useFeedback.ts                    # Feedback with localStorage dedup
└── lib/
    ├── prisma.ts                         # Prisma client singleton
    └── pdn/
        ├── queries.ts                    # Database queries & mutations
        └── types.ts                      # TypeScript types
```

## Features

- **Copy-first UX**: Users copy templates instantly, no sign-up required
- **Feedback tracking**: Tried / Client replied / No change / Need shorter
- **localStorage deduplication**: One feedback per solution per day
- **Dark mode**: Automatic based on system preference

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/problems | List published problems with totals |
| POST | /api/solutions/[id]/copy | Increment copy count |
| POST | /api/solutions/[id]/feedback | Submit feedback (tried/worked/noChange/needShorter) |

## Database Commands

```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema changes
npm run db:seed       # Seed data
npm run db:studio     # Open Prisma Studio
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL + Prisma 7
- **Runtime**: React 19