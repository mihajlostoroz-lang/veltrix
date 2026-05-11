# Veltrix Mobile Detailing

A full-stack landing page and booking system for Veltrix Mobile Detailing — a mobile car detailing service in Union County, NJ. Customers can book appointments online; the owner manages them through a PIN-protected admin dashboard.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind (artifacts/veltrix)
- API: Express 5 (artifacts/api-server)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/veltrix/src/pages/LandingPage.tsx` — main landing page (all sections)
- `artifacts/veltrix/src/components/BookingScheduler.tsx` — 4-step booking flow
- `artifacts/veltrix/src/pages/AdminPage.tsx` — admin dashboard entry
- `artifacts/veltrix/src/components/admin/` — dashboard components (StatsBar, DayView, BookingList, BookingCard)
- `artifacts/api-server/src/routes/bookings.ts` — availability + create booking
- `artifacts/api-server/src/routes/admin.ts` — list bookings, update status, stats
- `lib/db/src/schema/bookings.ts` — bookings table schema
- `lib/api-spec/openapi.yaml` — source of truth for API contracts

## Architecture decisions

- Contract-first API design: OpenAPI spec → Orval codegen → typed React Query hooks
- Admin dashboard uses simple PIN auth (sessionStorage) — no backend auth needed for MVP
- Bookings store date as `DATE` string (YYYY-MM-DD) and timeSlot as `VARCHAR` (HH:MM 24hr)
- Availability endpoint excludes `cancelled` bookings from conflict checks (only `pending` counts)
- All admin routes share the same `/api` prefix — no separate admin API server

## Product

- **Landing page**: Hero, stats, services, pricing, before/after gallery, reviews, service area, contact/booking
- **Booking scheduler**: 4-step flow — pick service → pick date → pick time slot (live availability) → enter details → confirmation
- **Admin dashboard** at `/admin` (PIN: `veltrix2024`): stats overview, day-by-day schedule view, all-bookings list with confirm/cancel/restore actions

## User preferences

- Keep all styling as inline styles matching the original Veltrix brand (blue #2563eb, Syne + DM Sans fonts)
- Admin PIN is `veltrix2024` — stored in AdminLogin.tsx

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after editing `openapi.yaml`
- The OpenAPI spec cannot have duplicate path keys — combine GET + POST under one `/bookings:` path
- `pnpm --filter @workspace/db run push` must be run after schema changes before the API server will work
- Availability check only blocks on `status = 'pending'` bookings — cancelled slots free up automatically
