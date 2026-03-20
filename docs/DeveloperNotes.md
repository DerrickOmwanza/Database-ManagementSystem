# Developer Notes

**Project:** Azani Internet Service Provider Information System  
**Current Codebase Status:** Rebuilt application under `src/`

---

## 1. Active Architecture

The active implementation now follows this layout:

```text
src/
  app.js
  config/
  database/
    migrations/
    scripts/
    seeds/
  modules/
    auth/
    dashboard/
    institutions/
    payments/
    infrastructure/
    upgrades/
    reports/
  shared/
    errors/
    middleware/
    utils/
    validation/
  views/
    auth/
    dashboard/
    institutions/
    infrastructure/
    payments/
    reports/
    upgrades/
    partials/
public/
  css/
  js/
tests/
tests-ui/
```

Legacy root-level controllers, models, routes, and views are no longer part of the active runtime.

---

## 2. Module Pattern

Each feature module should follow the rebuilt pattern:

- `repository` for SQL access
- `service` for business rules
- `validators` for module input rules
- `controller` for HTTP/view orchestration
- `routes` for route registration

Shared cross-cutting code belongs in `src/shared/`.

---

## 3. Database Conventions

The canonical schema is now defined by:

- `src/database/migrations/001_initial_schema.sql`
- `src/database/seeds/001_reference_data.sql`

Scripts:

- `npm run db:migrate`
- `npm run db:seed`

The database uses:

- snake_case table names
- snake_case column names
- foreign key constraints
- timestamps where appropriate

---

## 4. Authentication Notes

- authentication is session-based
- the default admin account is seeded through the seed script
- passwords are hashed using Node.js `crypto.scrypt`
- protected modules use `requireAuth`

---

## 5. Shared Validation

Common validators live in:

- `src/shared/validation/commonValidators.js`
- `src/shared/validation/validate.js`

These are the baseline for:

- required fields
- positive numbers
- Kenyan phone validation
- email validation
- no-future-date validation

---

## 6. Frontend Notes

The active frontend uses:

- server-rendered EJS views
- shared layout partials in `src/views/partials/`
- stylesheet in `public/css/style.css`
- lightweight client-side refinement in `public/js/app.js`

Implemented UX refinements include:

- shared authenticated layout
- dashboard shell
- table search inputs
- report section filter
- print trigger for reports
- responsive card and table layout

---

## 7. Testing Notes

Automated tests live under:

- `tests/foundation/`
- `tests/auth/`
- `tests/institutions/`
- `tests/payments/`
- `tests/infrastructure/`
- `tests/upgrades/`
- `tests/reports/`

Run all current tests with:

```bash
npm test
```

Run browser smoke tests with:

```bash
npm run test:ui
```

Current suite type:

- Jest unit/service tests
- Supertest route tests
- Playwright browser smoke and MySQL-backed authenticated tests using the locally installed Chrome channel

The Playwright suite currently:

- resets a dedicated `azani_isp_playwright` database in global setup
- applies schema and reference seeds before the browser run
- seeds a real admin login and sample operational records
- authenticates through the actual `/auth/login` form

---

## 8. Business Rule Baseline

Implementation must follow `docs/ImplementationBaseline.md`.

Canonical values:

- registration fee: KSh 8,500
- installation fee: KSh 10,000
- PC unit cost: KSh 40,000
- reconnection fee: KSh 1,000
- late fine: 15%
- upgrade discount: 10%

---

## 9. Next Maintenance Guidance

If more work continues, recommended next priorities are:

1. add richer end-to-end browser workflows that submit and verify module forms
2. add report export support if required by final scope
3. add role-based permissions beyond the current authenticated baseline
4. add test database automation around migration and seed scripts
