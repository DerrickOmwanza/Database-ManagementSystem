# Deployment Guide

**Project:** Azani Internet Service Provider Information System  
**Current Architecture:** Node.js + Express + EJS + MySQL

---

## 1. Prerequisites

- Node.js 18+
- npm 9+
- MySQL 8.0+
- XAMPP or standalone MySQL

---

## 2. Environment Setup

Create a `.env` file from `.env.example`.

Required values:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=azani_isp
DB_PORT=3306
PORT=3000
SESSION_SECRET=change-this-secret
NODE_ENV=development
```

---

## 3. Database Setup

Run the rebuilt database scripts from the project root:

```bash
npm run db:migrate
npm run db:seed
```

This will:

- create the `azani_isp` database if needed
- apply schema in `src/database/migrations/`
- seed reference data in `src/database/seeds/`
- create/update the default admin account

---

## 4. Start the Application

Development:

```bash
npm run dev
```

Standard start:

```bash
npm start
```

Application URL:

```text
http://localhost:3000
```

---

## 5. Default Login

- Username: `admin`
- Password: `admin123`

The seeded password is hashed before storage.

---

## 6. Active Application Paths

The live implementation is now under:

- `src/app.js`
- `src/modules/`
- `src/views/`
- `src/database/`

Legacy root-level controllers, routes, models, and views are no longer part of the active runtime.

---

## 7. Verification Checklist

After startup, confirm:

1. `/health` returns HTTP 200
2. `/auth/login` loads
3. login succeeds with the admin account
4. dashboard loads after login
5. institutions, payments, infrastructure, upgrades, and reports pages render

---

## 8. Automated Verification

Run:

```bash
npm test
```

This validates the rebuilt foundation, auth flow, institutions, payments, infrastructure, upgrades, and reports modules.
