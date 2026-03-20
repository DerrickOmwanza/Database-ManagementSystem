# User Manual

**System:** Azani Internet Service Provider Information System  
**Current Build:** Rebuilt Node.js + Express + EJS application

---

## 1. Introduction

The Azani ISP Information System supports:

- institution registration
- monthly billing and settlement
- infrastructure tracking
- bandwidth upgrades
- operational reporting

The system is accessed through a web browser after login.

---

## 2. Login

1. Open the system URL, for example `http://localhost:3000`.
2. Enter your username and password.
3. Click `Log In`.
4. After login, the Dashboard opens.

---

## 3. Dashboard

The Dashboard displays:

- total institutions
- active connections
- pending payments
- disconnected institutions
- recent activity
- quick links to Registration, Payments, Infrastructure, and Reports

---

## 4. Registration

Open `Registration` from the sidebar, then use `Register New Institution`.

Required fields:

- institution name
- town
- county
- institution type
- bandwidth package
- contact person name
- contact phone

Allowed institution types:

- Primary
- Junior
- Senior
- College

Bandwidth options:

| Package | Monthly Cost |
|---------|--------------|
| 4 MBPS | KSh 1,200 |
| 10 MBPS | KSh 2,000 |
| 20 MBPS | KSh 3,500 |
| 25 MBPS | KSh 4,000 |
| 50 MBPS | KSh 7,000 |

On successful registration:

- the institution is created
- the contact person is recorded
- the registration fee of **KSh 8,500** is automatically recorded

---

## 5. Payments & Billing

Open `Payments` from the sidebar.

Available actions:

### Generate Monthly Charge

Use this to create a monthly bill for a selected institution and billing period.

### Settle Monthly Charge

Use this to settle an existing monthly charge.

Billing rules:

- payment after the due date attracts a **15% fine**
- if still unpaid by the **10th of the following month**, the institution is treated as disconnected and reconnection is required

### Record Installation Payment

Use this to capture installation payment records.

Default installation fee:

- **KSh 10,000**

### Process Reconnection

Use this after a disconnected institution clears its dues.

Reconnection fee:

- **KSh 1,000**

---

## 6. Infrastructure

Open `Infrastructure` from the sidebar.

Use this page to record:

- PCs purchased
- LAN nodes installed
- installation status
- installation date

Cost rules:

- PC cost: **KSh 40,000** per unit
- LAN cost tiers:

| Nodes | Cost |
|------|------|
| 2-10 | KSh 10,000 |
| 11-20 | KSh 20,000 |
| 21-40 | KSh 30,000 |
| 41-100 | KSh 40,000 |

Installation fee is included only when status is `Completed`.

Valid installation statuses:

- Pending
- In Progress
- Completed
- Not Eligible

---

## 7. Upgrades

Open `Services` from the sidebar.

Use this page to upgrade an institution to a higher bandwidth package.

Rules:

- the new package must be different
- downgrades are not allowed
- the discounted monthly cost is calculated with a **10% discount**

Example:

- new package rate: KSh 3,500
- discounted monthly cost: KSh 3,150

---

## 8. Reports

Open `Reports` from the sidebar.

Current report sections:

- registered institutions
- defaulters
- disconnections
- infrastructure report
- financial summary
- upgrade history

The page includes:

- a report section selector
- a search box for visible report data
- a print button for the current page view

---

## 9. Troubleshooting

### Login fails

- confirm username and password
- confirm the database has been migrated and seeded
- confirm the admin user exists if using the default setup

### Page loads but no records appear

- this can be normal if no sample data has been entered yet
- create institutions first, then billing and infrastructure records

### Data cannot be saved

- check required fields
- confirm the date is not in the future where date validation applies
- confirm the database connection is available

---

## 10. Support

For project maintenance and technical issues, use the project documentation in `docs/` and the rebuilt implementation under `src/`.
