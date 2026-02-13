# GPTKids (gptkids.ir)

A child-safe Persian AI chatbot with parent controls, subscriptions, and a premium admin panel.

## Stack
- Next.js App Router + TypeScript
- TailwindCSS + shadcn/ui + lucide-react
- PostgreSQL + Prisma
- Redis (rate limits/quotas)
- NextAuth (credentials)
- Zod
- Recharts
- Vitest + Playwright
- Docker Compose

## Setup

### 1) Install
```bash
npm install
```

### 2) Environment
Create `.env.local`:
```bash
AVALAI_API_KEY=your_key
AVALAI_BASE_URL=https://api.avalai.ir
AVALAI_DEFAULT_MODEL=gpt-4o-mini
AVALAI_SAFETY_MODEL=gpt-4o-mini
DATABASE_URL=postgresql://gptkids:gptkids@localhost:5432/gptkids
REDIS_URL=redis://localhost:6379
NEXTAUTH_SECRET=dev-secret
NEXTAUTH_URL=http://localhost:3000
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### 3) Database
```bash
npx prisma migrate dev --name init
npm run prisma:seed
```

### 4) Run
```bash
npm run dev
```

## Docker Compose
```bash
docker compose up --build
```

## Seed Accounts
- Admin: `admin@example.com` / `Admin123!`
- Parent: `parent@example.com` / `Parent123!`
- Demo Child: `demo-child` (nickname: آوا)

## Tests
```bash
npm test
npm run test:e2e
```

## Features
- Child-safe chat with two-layer safety checks and refusal/redirection
- Parent dashboard: children, reports, settings, billing
- Admin panel: overview, users, plans, usage, safety queue, config
- Subscription system with coupons, quotas, and manual/Stripe payment adapters
- Netflix-style profile picker (no PIN)

## Netflix-style profiles
- Parents create kid profiles and land on `/profiles`.
- Selecting a profile enters `/kid/chat` directly (no PIN).
- Switch profile anytime by returning to `/profiles`.

## Kid Mode Security
We use **Option 1: Kid Mode signs out parent**. When a profile is selected, the app creates a kid device session and the parent session is signed out in the same browser. Parent routes require re-login.

## Notes
- Safety prompts and keyword blocklists can be edited in `/admin/config`.
- Streaming is delivered via SSE and post-checked before display.

## How to test locally
1. Login as parent.
2. Go to `/profiles` and select a kid profile.
3. You should land on `/kid/chat` and can switch profile via topbar.
