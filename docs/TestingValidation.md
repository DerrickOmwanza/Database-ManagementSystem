# Testing & Validation

**Project:** Azani Internet Service Provider Information System  
**Current Status:** Rebuilt backend modules with automated coverage

---

## 1. Test Strategy

The active test suite covers the rebuilt implementation under `src/` only.

Test types currently in use:

- service-level unit tests
- route-level integration tests with `supertest`
- authentication-protected flow checks
- browser-level UI smoke tests
- authenticated browser tests backed by a dedicated Playwright MySQL database

Frameworks:

- Jest
- Supertest
- Playwright

---

## 2. Covered Modules

The current automated suite covers:

- backend foundation and health route
- authentication
- institutions / registration
- payments / billing
- infrastructure
- upgrades
- reports
- browser-level smoke coverage for the live web application

Current command:

```bash
npm test
```

Browser command:

```bash
npm run test:ui
```

---

## 3. Current Assertions by Module

### Authentication

- password hashing and verification
- successful login
- invalid login payload rejection
- session-protected route access

### Institutions

- duplicate registration rejection
- successful registration flow
- auth-protected institution routes
- registration fee returned from service

### Payments / Billing

- monthly charge generation
- duplicate billing period rejection
- late payment fine calculation
- disconnection trigger after the 10th of the following month
- reconnection processing
- auth-protected payment routes

### Infrastructure

- PC and LAN cost calculation
- installation fee inclusion on completed installs
- invalid LAN count rejection
- auth-protected infrastructure routes

### Upgrades

- same-tier rejection
- downgrade rejection
- discounted monthly cost calculation
- auth-protected upgrade routes

### Reports

- financial aggregate rollup
- auth-protected reports route

### Browser UI Smoke Coverage

- live web server boot through Playwright `webServer`
- `/health` readiness check
- unauthenticated redirect from `/` to `/auth/login`
- login screen render validation
- narrow viewport login usability check

### Authenticated Browser Coverage

- dedicated Playwright database reset and seed in `azani_isp_playwright`
- real UI login with the seeded admin account
- protected `/auth/me` access verification
- dashboard, institutions, payments, and reports page coverage with seeded operational data
- logout flow and post-logout access rejection

---

## 4. Current Result

At the time of this update:

- Jest suites: **13**
- Jest tests: **32**
- Playwright browser tests: **10**
- result: **passing**

---

## 5. Remaining Validation Work

The following are still desirable next steps:

- acceptance scripts aligned directly to the KCSE documentation set
- manual review of responsive behavior and print layouts
- richer end-to-end browser workflows that submit and verify module forms

--- 

## 6. Active Test Files

Tests now live under:

- `tests/foundation/`
- `tests/auth/`
- `tests/institutions/`
- `tests/payments/`
- `tests/infrastructure/`
- `tests/upgrades/`
- `tests/reports/`
- `tests-ui/`

Legacy test files tied to the discarded root-level implementation are no longer part of the active suite.
