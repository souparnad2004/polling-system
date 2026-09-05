# Pollly

Pollly is a full-stack polling application. Users can create polls, publish
them, collect votes, and view results through a Next.js frontend backed by a
TypeScript/Express API and PostgreSQL database.

## What Is Implemented

### Authentication and users

- User registration, login, logout, and current-user lookup
- Cookie-based sessions using an `httpOnly` session cookie
- Password hashing with Argon2
- Rate-limited login attempts
- Protected routes and ownership checks
- Profile display and profile updates

### Polls

- Create polls with a title, description, and 2-10 options
- Configure whether anonymous voting is allowed
- Poll lifecycle: `draft` -> `published` -> `closed`
- Owner-only poll management actions
- Draft visibility rules that hide private drafts from other users
- Poll lists, search, empty states, loading states, and error states
- Trending poll ordering by vote count, creation date, and poll ID

### Voting and results

- Authenticated voting
- Anonymous voting through a `voterToken` cookie when enabled
- One vote per poll and identity enforced by database constraints
- Change and remove vote endpoints
- Results with vote counts and visual result bars
- Poll analytics and recent voting activity
- Live result updates over WebSockets after vote changes

### Frontend experience

- Landing page with responsive navigation and security information
- Login and registration pages
- Protected dashboard, polls, profile, and analytics pages
- Public poll route for shared poll access
- React Query cache management for server state
- Responsive UI built with Next.js, React, Tailwind CSS, and reusable UI components

## Technology Stack

### Backend

- Node.js and TypeScript
- Express 5
- PostgreSQL
- Drizzle ORM
- Zod request and environment validation
- Argon2 password hashing
- WebSocket server using `ws`

### Frontend

- Next.js 16 App Router
- React 19 and TypeScript
- TanStack React Query
- React Hook Form and Zod
- Tailwind CSS
- Reusable components based on Base UI and shadcn-style patterns

## Project Structure

```text
polling-system/
├── backend/              Express API, database access, auth, polls, votes, stats
├── frontend/             Next.js application and feature-based UI
├── docs/                 API, architecture, flow, decisions, and roadmap notes
├── docker-compose.yml    Local PostgreSQL service
└── .env                  Backend development environment variables
```

The backend is organized by feature under `backend/src/modules`. Each module
keeps its routes, controllers, services, repositories, and schemas close
together. The frontend uses feature folders under `frontend/src/features`.

## Local Setup

### Requirements

- Node.js
- pnpm
- Docker and Docker Compose

### 1. Install dependencies

```bash
cd backend
pnpm install

cd ../frontend
pnpm install
```

### 2. Start PostgreSQL

From the project root:

```bash
docker compose up -d postgres
```

The included development environment uses:

```text
DATABASE_URL=postgres://postgres:postgres@localhost:5432/polling_system
```

Run the database migrations from `backend`:

```bash
pnpm db:migrate
```

### 3. Configure the frontend

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4000/ws
```

### 4. Start the applications

In one terminal:

```bash
cd backend
pnpm dev
```

In another terminal:

```bash
cd frontend
pnpm dev
```

Open the frontend at [http://localhost:3000](http://localhost:3000). The API
health check is available at [http://localhost:4000/health](http://localhost:4000/health).

## Useful Commands

### Backend

```bash
pnpm dev          # Start the API in watch mode
pnpm build        # Compile TypeScript
pnpm typecheck    # Check types without emitting files
pnpm db:generate  # Generate a Drizzle migration
pnpm db:migrate   # Apply migrations
pnpm db:studio    # Open Drizzle Studio
```

### Frontend

```bash
pnpm dev          # Start Next.js in development mode
pnpm build        # Create a production build
pnpm start        # Run the production build
pnpm lint         # Run ESLint
```

## Main Routes

### Frontend pages

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/login` | Login |
| `/register` | Registration |
| `/dashboard` | Authenticated dashboard |
| `/polls` | Discover trending polls |
| `/polls/mine` | Current user's polls |
| `/polls/create` | Create a poll |
| `/polls/[pollId]` | Protected poll details and voting |
| `/polls/[pollId]/analytics` | Poll analytics |
| `/poll/[pollId]` | Public shared poll view |
| `/profile` | User profile |

### API groups

- `GET /health`
- `/api/auth` for registration, login, and logout
- `/api/users` for the current user profile
- `/api/polls` for poll management, voting, and results
- `/api/stats` for dashboard statistics

See [docs/endpoints.md](docs/endpoints.md) for request bodies, cookies,
responses, and error formats.

## Current Status

The core MVP flow is implemented: a user can register, log in, create and
manage polls, vote, and see live results. The repository is still under active
development. Remaining work includes completing the edit-draft experience,
polishing public voting state and sharing UX, expanding automated test coverage,
and completing final mobile and error-state polish.

Architecture decisions and the detailed implementation roadmap are documented
in [docs/decisions.md](docs/decisions.md) and [docs/roadmap.md](docs/roadmap.md).
