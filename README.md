# Salary Management

A Rails JSON API (JWT auth) plus a React frontend for HR salary management.
See [frontend/README.md](frontend/README.md) for the frontend's own setup,
tech choices, and documented assumptions about the API contract.

## Backend (this directory)

- Ruby 3.4.5, Rails 8.0.5 (API-only), SQLite.
- Auth: JWT, issued by `POST /api/v1/auth/login`, verified on every
  `/api/v1/*` request except login via `Api::V1::BaseController`.
- Endpoints live under `app/controllers/api/v1/` and match the contract the
  frontend expects: `auth#login`, `employees` (CRUD + `salary_history` +
  `salary` update + `import`/`export.csv`), and `analytics#summary`.

### Setup

```bash
bundle install
bin/rails db:migrate
bin/rails db:seed          # seeds a demo HR user + 10,000 employees (override with SEED_EMPLOYEE_COUNT=500)
bin/rails server -p 3000
```

Demo login: `hr@example.com` / `password123`.

CORS allows `http://localhost:5173` (the frontend's Vite dev server) by
default; override with `FRONTEND_ORIGIN` if the frontend runs elsewhere.

### Notable fixes made while wiring this up

Two upstream gem incompatibilities on this Ruby/Rails combo needed pinning:

- `json` 3.x dropped the `quirks_mode:` keyword that Rails 8.0.5.1's
  `ActiveSupport::JSON` still passes to `JSON.parse`/`JSON.generate`, causing
  every request with a body to 500. Pinned to `json ~> 2.9`.
- `csv` is no longer bundled with Ruby 3.4+; added it explicitly since the
  employee import/export endpoints need it.

### Running both together

```bash
# terminal 1
bin/rails server -p 3000

# terminal 2
cd frontend && npm install && cp .env.example .env && npm run dev
```

Then open the Vite dev server URL and log in with the demo credentials above.
