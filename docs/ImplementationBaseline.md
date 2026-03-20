# Implementation Baseline

**Project:** Azani Internet Service Provider Information System  
**Purpose:** Single implementation baseline for the rebuild

---

## 1. Source of Truth Order

Implementation decisions must follow this document in combination with the core project documents below, in this order:

1. `docs/SRS/SRS.md`
2. `docs/Design/SystemDesign.md`
3. `docs/Architecture/Architecture.md`
4. `docs/DatabaseDesign.md`

If a secondary document conflicts with the documents above, this baseline takes precedence until the secondary document is corrected.

---

## 2. Agreed Technology Stack

- **Backend:** Node.js with Express.js
- **Database:** MySQL 8.0
- **Frontend:** Server-rendered EJS templates with HTML/CSS/JavaScript
- **Runtime entrypoint:** Node.js application
- **Primary deployment target:** Local XAMPP environment with MySQL

Notes:

- The SRS references PHP in one architecture section, but the architecture, design, developer notes, deployment guide, package manifest, and current implementation all point to Node.js/Express. The rebuild will therefore use Node.js/Express as the authoritative application layer.

---

## 3. Canonical Business Rules

### 3.1 Institution Types

Allowed institution types:

- Primary
- Junior
- Senior
- College

### 3.2 Fixed Fees

- Registration fee: **KSh 8,500**
- Installation fee: **KSh 10,000**
- PC unit cost: **KSh 40,000**
- Reconnection fee: **KSh 1,000**

### 3.3 Bandwidth Packages

The canonical bandwidth package table is:

| Speed | Monthly Cost (KSh) |
|-------|--------------------|
| 4 MBPS | 1,200 |
| 10 MBPS | 2,000 |
| 20 MBPS | 3,500 |
| 25 MBPS | 4,000 |
| 50 MBPS | 7,000 |

Notes:

- `README.md` and `TestingValidation.md` currently contain conflicting package values and extra tiers such as 8 MBPS and 40 MBPS.
- The rebuild will follow the SRS, System Design, schema, and constants above.

### 3.4 LAN Pricing

The canonical LAN pricing table is:

| Node Range | Cost (KSh) |
|-----------|------------|
| 2 – 10 | 10,000 |
| 11 – 20 | 20,000 |
| 21 – 40 | 30,000 |
| 41 – 100 | 40,000 |

### 3.5 Upgrade Rule

- Upgrades are allowed only to a higher bandwidth tier.
- Upgrade discount: **10%**
- Formula: `discounted monthly charge = new package rate * 0.90`

### 3.6 Fine and Disconnection Rule

- Late payment fine: **15% of monthly charge**
- Fine applies when payment is not received by the last day of the billing month.
- Institution is flagged for disconnection if payment plus applicable fine remains unpaid by the **10th day of the following month**.
- Reconnection requires settlement of outstanding bill, fine, and reconnection fee.

Notes:

- `docs/DatabaseDesign.md` currently includes a conflicting flat fine of KSh 5,000 per overdue month. That is not authoritative for implementation.

---

## 4. Canonical Functional Modules

The rebuild will implement the system in this order:

1. Backend foundation
2. Authentication
3. Institution registration
4. Payments and billing rules
5. Infrastructure management
6. Bandwidth upgrades
7. Reports
8. Frontend completion and polish

---

## 5. Backend Structure for Rebuild

The rebuild will use a `src/`-based structure:

```text
src/
  app.js
  config/
  database/
  modules/
    auth/
    institutions/
    payments/
    infrastructure/
    upgrades/
    reports/
  shared/
    errors/
    middleware/
    utils/
```

Legacy root-level folders such as `controllers/`, `models/`, `routes/`, and `views/` will be treated as transitional and replaced module by module.

---

## 6. Non-Functional Baseline

- Use environment variables for configuration.
- Use parameterized queries for database access.
- Use hashed passwords for system users.
- Use centralized error handling.
- Keep business rules in explicit shared constants/configuration.
- Add tests for each module before considering the module complete.

---

## 7. Acceptance Rule

A module is only considered complete when all of the following are true:

- backend logic is implemented
- database behavior is verified
- tests for the module pass in a valid local environment
- UI flow for the module is present where applicable
- documentation affected by that module is aligned
