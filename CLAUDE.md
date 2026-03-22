<!-- vance-managed -->
# SOS Train

Fitness coaching platform with React 18, Vite, TypeScript, Supabase and Stripe

## Stack
- **Framework**: vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **StateManagement**: Zustand
- **Key Dependencies**: @heroicons/react, @mux/mux-player-react, @sentry/react, @stripe/stripe-js, @supabase/supabase-js, @tanstack/react-query, framer-motion, react, react-dom, react-hook-form, react-router-dom, @types/react, @types/react-dom, @vitejs/plugin-react, eslint-plugin-react-hooks, eslint-plugin-react-refresh

## Commands
- **dev**: `npm run dev`
- **build**: `npm run build`
- **lint**: `npm run lint`

## Architecture
```
├── public/
├── scripts/
│   └── setup.sh
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── brand/
│   │   ├── coaching/
│   │   ├── community/
│   │   ├── layout/
│   │   ├── locker/
│   │   ├── tracking/
│   │   ├── training/
│   │   └── ui/
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── usePrograms.ts
│   │   └── useSubscription.ts
│   ├── lib/
│   │   ├── mux.ts
│   │   ├── sentry.ts
│   │   ├── stripe.ts
│   │   └── supabase.ts
│   ├── pages/
│   │   ├── Account/
│   │   ├── Admin/
│   │   ├── Auth/
│   │   ├── Brand/
│   │   ├── Challenges/
│   │   ├── Coaching/
│   │   ├── Community/
│   │   ├── Dashboard/
│   │   ├── Events/
│   │   ├── Exclusive/
│   │   ├── Leaderboard/
│   │   ├── LockerRoom/
│   │   ├── Messages/
│   │   ├── Pricing/
│   │   ├── Tracking/
│   │   ├── Training/
│   │   └── placeholder.tsx
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   └── uiStore.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── formatDate.ts
│   │   ├── formatNumber.ts
│   │   ├── imageCompressor.ts
│   │   └── validators.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── supabase/
│   ├── functions/
│   │   ├── create-checkout-session/
... (truncated)
```

## Key Files
- `src/main.tsx`
- `src/App.tsx`
- `src/app.tsx`
- `vite.config.ts`
- `tsconfig.json`

## Conventions
- **linting**: ESLint

## Recent Activity
- 49f85b1 Phase 1F: Add admin content management panel
- f0b8c35 Phase 1E: Add training content module with video streaming
- b1934ad Phase 1D: Add Stripe subscription billing and access gating
- c402b68 Phase 1C: Add complete database schema and RLS policies
- 84256ee Phase 1B: Add authentication and onboarding flow
- 7028dc8 Phase 1A: Initialize SOS Train project scaffold

## Rules
- Work autonomously. Commit frequently. Do NOT push unless told to.
- Read files before editing. Run tests after changes.
- npm cache has permissions issues — use `--cache ./.npm-cache` flag when installing.
