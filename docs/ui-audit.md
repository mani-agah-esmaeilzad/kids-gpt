# Route Inventory & UI Audit

## Public / Marketing
- [ ] `/` (Landing) - `src/app/(marketing)/page.tsx` - [Marketing Layout]
- [ ] `/login` - `src/app/login/page.tsx` - [Auth Layout?]
- [ ] `/signup` - `src/app/signup/page.tsx` - [Auth Layout?]
- [ ] `/pricing` - `src/app/pricing/page.tsx` - [Marketing Layout]
- [ ] `/safety` - `src/app/safety/page.tsx` - [Marketing Layout]
- [ ] `/faq` - `src/app/faq/page.tsx` - [Marketing Layout]
- [ ] `/privacy` - `src/app/privacy/page.tsx` - [Marketing Layout]
- [ ] `/terms` - `src/app/terms/page.tsx` - [Marketing Layout]
- [ ] `/schools` - `src/app/schools/page.tsx` - [Marketing Layout]

## Profiles (Netflix-style)
- [ ] `/profiles` (Picker) - `src/app/profiles/page.tsx` (Need to verify/create)
- [ ] `/profiles/manage` (Parent Control) - `src/app/profiles/manage/page.tsx` (Need to verify/create)
- [ ] `/profiles/new` (Add Child) - `src/app/profiles/new/page.tsx` (Need to verify/create)

## Kid Experience
- [ ] `/child/[childId]/chat` - `src/app/child/[childId]/chat` (Wait, `src/app/child` was deleted? Need to check new structure)
- [ ] `/kid/dashboard` - `src/app/kid/dashboard/page.tsx` (Verify existence)

## Parent Dashboard
- [ ] `/parent` (Overview) - `src/app/(app)/parent/page.tsx` - [App Layout]
- [ ] `/parent/reports` - `src/app/(app)/parent/reports/page.tsx` - [App Layout]
- [ ] `/parent/billing` - `src/app/(app)/parent/billing/page.tsx` - [App Layout]
- [ ] `/parent/children` - `src/app/(app)/parent/children/page.tsx` - [App Layout] (Redirects to `/profiles/manage`?)
- [ ] `/parents` - `src/app/parents/page.tsx` (Legacy?)

## Admin Panel
- [ ] `/admin` (Dashboard) - `src/app/admin/page.tsx` - [Admin Layout]
- [ ] `/admin/users` - `src/app/admin/users/page.tsx` - [Admin Layout]

## System
- [ ] `/not-found` - `src/app/not-found.tsx`
- [ ] `error` - `src/app/error.tsx` (Global)

**Notes:**
- Need to investigate the deletion of `src/app/child`.
- Need to consolidate `src/app/parents` and `src/app/(app)/parent`.
- Need to determine the new location for Kid Experience routes.
