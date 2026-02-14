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
- Admin panel: overview, users, plans, subscriptions, payments, usage, costs, logs, safety queue, config
- Subscription system with quotas, budget guard, rate limits, and manual/Stripe payment adapters
- Netflix-style profile picker (no PIN)

## Subscription Plans (Monthly)
### پلن پایه — 249,000 تومان
- Max children: 1
- dailyMessagesPerChild: 60
- dailyTokensPerChild: 25,000
- monthlyTokenCap: 600,000

### پلن حرفه‌ای — 399,000 تومان
- Max children: 3
- dailyMessagesPerChild: 200
- dailyTokensPerChild: 80,000
- monthlyTokenCap: 2,000,000
- Features: گزارش پیشرفت, داستان‌سازی هوشمند

### پلن خانواده پلاس — 599,000 تومان
- Max children: 5
- dailyMessagesPerChild: 300
- dailyTokensShared: 200,000 (shared across all children)
- monthlyTokenCap: 4,000,000
- Features: گزارش PDF, اولویت پاسخ, داستان‌سازی هوشمند

Plan quotas and rate limits are stored in `Plan.quotasJson` and editable via `/admin/plans`.

## Rate Limits
Applied per plan (Redis):
- Per IP on auth
- Per parent (global chat RPM)
- Per child (chat RPM + concurrency)
Global multipliers live in `AppConfig` key `rate.limits`, and per-user overrides live in `ParentProfile.preferences`.

## Budget Guard & Token Cost
Each AI response logs:
- input/output/total tokens
- estimated cost (Toman)
Token cost is calculated from `ModelPricing` (admin-editable in `/admin/config`).
Hard stop: daily/monthly token caps.
Soft warning: 80% usage (surfaced on parent dashboard).

## Costs & Financial Health
Add cost entries in `/admin/costs` (SERVER / PAYMENT / MARKETING / OTHER).
Financial health check:
```
Total Revenue > (Token Cost + Server + Payment + Marketing + Other)
```
Admin layout shows live status banner (green/amber/red).

## Netflix-style profiles
- Parents create kid profiles and land on `/profiles`.
- Selecting a profile enters `/kid/chat` directly (no PIN).
- Switch profile anytime by returning to `/profiles`.

## Kid Mode Security
We use **Option 1: Kid Mode signs out parent**. When a profile is selected, the app creates a kid device session and the parent session is signed out in the same browser. Parent routes require re-login.

## Notes
- Safety prompts and keyword blocklists can be edited in `/admin/config`.
- Streaming is delivered via SSE and post-checked before display.

## Admin Pages
- `/admin` overview + financial health
- `/admin/users` + `/admin/users/[id]`
- `/admin/plans`
- `/admin/subscriptions`
- `/admin/payments`
- `/admin/usage`
- `/admin/costs`
- `/admin/limits`
- `/admin/logs`
- `/admin/config`

## How to test locally
1. Login as parent.
2. Go to `/profiles` and select a kid profile.
3. You should land on `/kid/chat` and can switch profile via topbar.
