# Azani ISP Information System

Web-based operations system for Azani ISP, rebuilt on a single active implementation path using **Node.js**, **Express**, **EJS**, and **MySQL**.

## Current State

The rebuilt application now lives under [`src/`](c:/Users/ADMIN/Desktop/XAMPP%202025/htdocs/ISP-DatabaseManagement-System/src) and includes:

- authentication
- dashboard
- institution registration
- payments and billing
- infrastructure
- bandwidth upgrades
- reports

Legacy root-level controllers, models, routes, and views have been removed so the project has one active runtime path.

## Tech Stack

- Node.js 18+
- Express.js
- EJS
- MySQL 8.0
- Session-based authentication
- Jest + Supertest
- Playwright

## Project Structure

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
  views/
public/
tests/
tests-ui/
docs/
server.js
```

## Core Business Rules

- Registration fee: **KSh 8,500**
- Installation fee: **KSh 10,000**
- PC unit cost: **KSh 40,000**
- Reconnection fee: **KSh 1,000**
- Upgrade discount: **10%**
- Late payment fine: **15%**
- Disconnection threshold: unpaid by the **10th of the following month**

### Bandwidth Packages

| Package | Monthly Cost |
|---------|--------------|
| 4 MBPS | KSh 1,200 |
| 10 MBPS | KSh 2,000 |
| 20 MBPS | KSh 3,500 |
| 25 MBPS | KSh 4,000 |
| 50 MBPS | KSh 7,000 |

### LAN Pricing

| Node Range | Cost |
|-----------|------|
| 2-10 | KSh 10,000 |
| 11-20 | KSh 20,000 |
| 21-40 | KSh 30,000 |
| 41-100 | KSh 40,000 |

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and set database credentials.

3. Run migrations:

```bash
npm run db:migrate
```

4. Seed reference data and the default admin account:

```bash
npm run db:seed
```

5. Start the app:

```bash
npm start
```

## Scripts

- `npm start` - start the application
- `npm run dev` - start with nodemon
- `npm run db:migrate` - create/update schema
- `npm run db:seed` - seed packages, LAN tiers, and admin user
- `npm test` - run the current automated test suite
- `npm run test:ui` - run browser-level UI smoke tests plus MySQL-backed authenticated page tests
- `npm run test:ui:headed` - run browser UI tests in headed mode

## Default Login

- Username: `admin`
- Password: `admin123`

The password is stored as a hashed value by the seed script.

## Documentation

Core documentation is in [`docs/`](c:/Users/ADMIN/Desktop/XAMPP%202025/htdocs/ISP-DatabaseManagement-System/docs), with the implementation baseline in [docs/ImplementationBaseline.md](c:/Users/ADMIN/Desktop/XAMPP%202025/htdocs/ISP-DatabaseManagement-System/docs/ImplementationBaseline.md).
# Database-ManagementSystem
# Database-ManagementSystem
