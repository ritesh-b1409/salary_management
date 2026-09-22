# Salary Management UI

A React frontend for an HR Salary Management System, built for an HR Manager
managing salary data across a ~10,000-employee organization. It talks to a
Rails JSON API over JWT auth.

## Status

This was originally built against an **assumed** API contract, because the
Rails app in the parent directory started as an empty skeleton with no
models, controllers, or auth. A matching Rails API now exists in the parent
directory (`../app/controllers/api/v1/`) implementing that same contract —
see the root [README.md](../README.md) for how to run it. Every assumption
made about the contract while building this UI is listed below; the backend
was built to match them, so this section also doubles as a description of
what the real API actually does.

## Setup

```bash
npm install
cp .env.example .env   # then set VITE_API_BASE_URL to your Rails API
npm run dev
```

Other scripts:

```bash
npm run build       # type-check + production build
npm run test         # run the test suite once
npm run test:watch   # run tests in watch mode
npm run lint         # oxlint
```

## Tech choices

- **MUI** for the component library (chosen over shadcn/ui — better fit for a
  dense, data-heavy internal admin tool with a lot of tables/forms out of the box).
  Pinned to the stable **v7** line; the newly-released v9 removed the classic
  system-prop shorthand (`fontWeight`, `alignItems`, etc. as direct props) that
  most current MUI code and docs still assume, so v9 was avoided for stability.
- **TanStack Query** for all server state — pagination, caching, and mutations.
  There is no separate global store; the only React Context is `AuthContext`,
  which exists purely to expose the current user/logout to the nav.
- **React Hook Form + Zod** for form state and validation.
- **Recharts** for the analytics charts, styled per the project's dataviz
  guidelines (single-hue bars for single-series magnitude charts, no dual axes,
  recessive gridlines, tooltips on every chart).
- **MSW** to mock the Rails API in tests, so the suite never touches a real
  server.

## Assumptions about the API contract

The brief's contract was taken as a starting point and adjusted only where it
was ambiguous or incomplete:

1. **Auth**: `POST /api/v1/auth/login` returns `{ token, user }`. The JWT is
   attached via an axios request interceptor (`Authorization: Bearer <token>`)
   and a response interceptor clears auth and redirects to `/login` on any
   `401`. The token is kept in memory and mirrored to `localStorage` so a page
   reload doesn't force a re-login.
2. **Pagination**: list responses are `{ data, meta: { total, page, per_page, total_pages } }`.
   The employee list always requests a specific `page`/`per_page` — the UI
   never fetches the full 10k rows client-side.
3. **Employment status** is assumed to be an enum:
   `active | on_leave | inactive | terminated`. The filter and edit form use
   this fixed set since no endpoint was described for fetching valid values.
4. **Department / country filters** are implemented as free-text (debounced)
   inputs rather than dropdowns, since the contract didn't describe an
   endpoint for distinct department/country values. If the real API exposes
   one, these are easy to swap for `<Select>`s.
5. **Salary distribution histogram**: the brief asks for a histogram of
   salaries org-wide, but the described `analytics/summary` response only
   returns aggregates (`avg`, `median`, `by_department`, `by_country`) — no
   raw or bucketed salary data. Shipping all 10k raw salaries to the browser
   just to bucket them client-side would undermine the "handle 10k employees
   well" requirement, so **`AnalyticsSummary` is assumed to also include a
   `salary_distribution: [{ bucket_start, bucket_end, count }]` array**,
   pre-bucketed server-side. This is the one place the assumed contract
   deliberately extends the brief's literal shape — see
   `src/types/index.ts`.
6. **Analytics currency**: the summary endpoint's aggregate figures
   (`avg_salary`, `median_salary`, `total_payroll`) are assumed to already be
   normalized to a single reporting currency by the API (displayed as USD in
   the UI), since employees can be paid in different currencies and summing
   mixed currencies without conversion isn't meaningful.
7. **CSV export** (`GET /employees/export.csv`) is assumed to accept the same
   filter/sort/search query params as the list endpoint, so "export the
   current filtered view" downloads exactly what's on screen.
8. **Errors**: `{ errors: [{ field, message }] }` is surfaced as both a
   top-level alert and per-field `TextField` helper text when the field name
   matches a known form field.

## What's deliberately out of scope

- **No role-based permissions.** The brief describes a single HR Manager
  persona; there's one authenticated role and no permission checks beyond
  "logged in or not."
- **No dark mode / theme toggle.** Not requested by the brief; the MUI theme
  is a single light palette.
- **No offline/optimistic UI** for mutations — forms wait for the server
  response before closing, favoring correctness (and surfacing server-side
  validation errors) over perceived speed.
- **No live browser verification in this environment.** This sandbox's
  browser tooling can't reach a `localhost` dev server started from its own
  shell, so verification here is via `tsc --noEmit`, the Vitest suite, and a
  production `vite build` rather than a manual click-through. Run `npm run
  dev` locally and click through the golden path (login → list → detail →
  edit salary → analytics → import/export) before treating this as done.
- **No role-based backend authorization beyond a single user table** — the
  Rails API has one `User` model with no roles/permissions, matching the
  single HR-manager persona above.

## Folder structure

```
src/
  api/            # axios instance + one module per resource (auth, employees, analytics)
  components/     # shared UI: AppLayout, StatTile, Pagination/StateViews, ProtectedRoute
  features/
    auth/         # AuthContext, auth storage, login schema
    employees/    # list toolbar/table, forms, salary history, TanStack Query hooks
    analytics/    # filters bar, charts, TanStack Query hooks
  pages/          # route-level components
  hooks/          # formatters, useDebouncedValue
  types/          # shared TS types + the API contract shape
  mocks/          # MSW handlers used by tests
  test/           # test setup + render-with-providers helper
```

## Testing

- `src/hooks/formatters.test.ts` — currency/date formatting and % change math.
- `src/features/employees/EmployeeList.test.tsx` — renders rows from a mocked
  API, verifies the debounced search actually narrows results, and checks the
  empty state.
- `src/features/employees/EmployeeForm.test.tsx` — blocks submission with a
  non-positive salary and shows the validation message; submits with valid data.

All tests run against MSW-mocked endpoints (`src/mocks/handlers.ts`), never a
real server.
