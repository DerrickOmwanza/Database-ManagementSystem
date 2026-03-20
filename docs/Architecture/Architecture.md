# System Architecture Document

**Project:** Azani ISP Information System
**Author:** Derrick
**Date:** March 2026
**Version:** 1.0

---

## 1. Introduction

This document describes the system architecture of the Azani ISP Information System. It outlines the key components, their interactions, the technologies used, and the overall design decisions that guide the system's structure. The architecture is designed to support efficient management of ISP operations including institution registration, payment processing, bandwidth management, infrastructure tracking, and report generation.

---

## 2. Architecture Style — Three-Tier Architecture

The Azani ISP Information System follows a **Three-Tier Architecture**, separating concerns into three distinct layers:

| Layer | Role | Technologies |
|-------|------|--------------|
| **Presentation Layer** (Frontend) | User interface for data entry, navigation, and viewing reports | HTML5, CSS3, JavaScript, EJS |
| **Application Layer** (Backend) | Business logic, validation rules, computations, and API routing | Node.js, Express.js |
| **Data Layer** (Database) | Persistent storage of all system data | MySQL 8.0 |

This separation ensures modularity, maintainability, and the ability to modify or scale each layer independently.

---

## 3. Component Details

### 3A. Presentation Layer (Frontend)

**Technologies:** HTML5, CSS3, JavaScript, EJS Templating Engine

**Features:**
- Responsive web pages for data entry and management
- Dynamic form rendering for institution registration, payments, and upgrades
- EJS templates for server-side rendering of views
- Client-side validation for immediate user feedback
- Dashboard views for administrators with summary statistics
- Report display pages with tabular and formatted output
- Navigation menus for intuitive access to all system modules
- Alert and notification messages for user actions (success, error, warning)

### 3B. Application Layer (Backend)

**Technologies:** Node.js, Express.js

**Features:**
- RESTful route handling for all CRUD operations
- Business logic enforcement (e.g., fine calculations, discount rules)
- Middleware for authentication and session management
- Input validation and sanitization before database operations
- Controller functions organized by module (institutions, payments, bandwidth, infrastructure)
- Error handling middleware for consistent error responses
- Database connection pooling for efficient resource usage
- Environment-based configuration for development and production

### 3C. Data Layer (Database)

**Technologies:** MySQL 8.0

**Features:**
- Relational schema with normalized tables for institutions, payments, bandwidth plans, and infrastructure
- Foreign key constraints to maintain referential integrity
- Stored procedures and triggers for automated business logic (e.g., fine application)
- Indexes on frequently queried columns for performance optimization
- Support for transactions to ensure data consistency
- Backup and restore capabilities for data protection
- Views for commonly used report queries
- Audit fields (`created_at`, `updated_at`) on all tables for traceability

---

## 4. Data Flow

The following steps describe the typical data flow through the system:

1. **User Action** — The user (Institution or Admin) interacts with the frontend by filling a form or clicking a button.
2. **HTTP Request** — The browser sends an HTTP request (GET, POST, PUT, DELETE) to the Express.js backend server.
3. **Route Handling** — Express routes the request to the appropriate controller based on the URL and HTTP method.
4. **Business Logic** — The controller applies business rules, validates input, and performs any necessary computations (e.g., calculating fines, applying discounts).
5. **Database Query** — The controller executes SQL queries against the MySQL database to read or write data.
6. **Database Response** — MySQL returns the query results (rows, confirmation, or error) to the controller.
7. **Response Rendering** — The controller passes the data to an EJS template, which renders the HTML page.
8. **HTTP Response** — The rendered HTML is sent back to the browser as an HTTP response.
9. **Display** — The browser displays the updated page to the user with the relevant data or confirmation message.

---

## 5. Security Considerations

| Area | Implementation |
|------|----------------|
| **Authentication** | Session-based authentication with secure login/logout functionality |
| **Role-Based Access Control (RBAC)** | Different access levels for Admins and Institutions, restricting actions based on role |
| **Input Validation** | Server-side validation of all user inputs to prevent malformed or malicious data |
| **SQL Injection Prevention** | Use of parameterized queries and prepared statements for all database operations |
| **Environment Variables** | Sensitive configuration (database credentials, session secrets) stored in `.env` files, excluded from version control |
| **Data Backups** | Regular database backups to prevent data loss in case of failure |
| **Session Security** | Secure session cookies with appropriate expiration and HTTP-only flags |

---

## 6. Deployment Model

### Local Development
- **XAMPP** provides the local MySQL database server
- **Node.js** runs the Express application on `localhost`
- Suitable for development, testing, and demonstration

### Cloud Deployment
- **Vercel** — Frontend and serverless API deployment
- **Railway** — Backend Node.js application and MySQL database hosting
- Environment variables configured per deployment environment

### Scalability
- The three-tier architecture allows each layer to be scaled independently
- Database can be migrated to managed cloud services (e.g., AWS RDS, PlanetScale) for higher availability
- Backend can be horizontally scaled behind a load balancer
- Static assets can be served via CDN for improved performance

---

## 7. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    AZANI ISP INFORMATION SYSTEM                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              PRESENTATION LAYER (Frontend)                │  │
│  │                                                           │  │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │  │
│  │   │  HTML5/CSS3  │  │ JavaScript  │  │  EJS Templates  │  │  │
│  │   └─────────────┘  └─────────────┘  └─────────────────┘  │  │
│  │                                                           │  │
│  │   Pages: Dashboard | Registration | Payments | Reports    │  │
│  └───────────────────────────┬───────────────────────────────┘  │
│                              │ HTTP Requests / Responses        │
│                              ▼                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              APPLICATION LAYER (Backend)                  │  │
│  │                                                           │  │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │  │
│  │   │   Node.js    │  │  Express.js │  │   Middleware     │  │  │
│  │   └─────────────┘  └─────────────┘  └─────────────────┘  │  │
│  │                                                           │  │
│  │   Modules: Auth | Institutions | Payments | Bandwidth     │  │
│  │            Infrastructure | Reports | Fines               │  │
│  └───────────────────────────┬───────────────────────────────┘  │
│                              │ SQL Queries / Results            │
│                              ▼                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                 DATA LAYER (Database)                      │  │
│  │                                                           │  │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │  │
│  │   │  MySQL 8.0  │  │   Tables    │  │  Views/Triggers │  │  │
│  │   └─────────────┘  └─────────────┘  └─────────────────┘  │  │
│  │                                                           │  │
│  │   Tables: institutions | payments | bandwidth_plans       │  │
│  │           infrastructure | users | audit_logs             │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Data Flow Diagrams

### Level 0 — Context Diagram

```
                    ┌──────────────────┐
                    │                  │
 ┌──────────────┐   │   Azani ISP      │   ┌──────────────────┐
 │  Institution │──▶│   Information    │──▶│     Reports      │
 │              │◀──│   System         │   │  (PDF / Screen)  │
 └──────────────┘   │                  │   └──────────────────┘
                    └──────────────────┘
                             ▲
                             │
                    ┌──────────────────┐
                    │      Admin       │
                    └──────────────────┘
```

### Level 1 — Major Processes

```
                        ┌───────────────────┐
                        │   D1: Institutions │
                        │       Database     │
                        └───────┬───────────┘
                                │
     ┌──────────────────────────┼──────────────────────────┐
     │                          │                          │
     ▼                          ▼                          ▼
┌─────────────┐          ┌─────────────┐          ┌──────────────┐
│ P1:         │          │ P2:         │          │ P3:          │
│ Registration│          │ Payment     │          │ Infrastructure│
│ Process     │          │ Processing  │          │ Management   │
└─────────────┘          └──────┬──────┘          └──────────────┘
                                │
                                ▼
                         ┌─────────────┐
                         │ P4:         │
                         │ Reporting   │
                         │ Process     │
                         └─────────────┘
                                │
                                ▼
                        ┌───────────────┐
                        │    Reports    │
                        └───────────────┘
```

- **P1: Registration Process** — Handles new institution registration, data validation, and record creation.
- **P2: Payment Processing** — Manages payment recording, fine calculation (15% late fee), and disconnection/reconnection fees (KES 1,000).
- **P3: Infrastructure Management** — Tracks network equipment, connections, and maintenance records.
- **P4: Reporting Process** — Generates financial, operational, and institutional reports.

---

## 9. Sequence Diagrams

### 9A. Institution Registration

```
 Institution        Frontend           Backend            Database
     │                  │                  │                  │
     │  Fill Form       │                  │                  │
     │─────────────────▶│                  │                  │
     │                  │  POST /register  │                  │
     │                  │─────────────────▶│                  │
     │                  │                  │  Validate Input  │
     │                  │                  │─────────┐        │
     │                  │                  │◀────────┘        │
     │                  │                  │                  │
     │                  │                  │  INSERT INTO     │
     │                  │                  │  institutions    │
     │                  │                  │─────────────────▶│
     │                  │                  │                  │
     │                  │                  │  Success / ID    │
     │                  │                  │◀─────────────────│
     │                  │                  │                  │
     │                  │  Render Success  │                  │
     │                  │◀─────────────────│                  │
     │                  │                  │                  │
     │  Confirmation    │                  │                  │
     │◀─────────────────│                  │                  │
     │                  │                  │                  │
```

### 9B. Payment Processing (with Fine Calculation)

```
 Institution        Frontend           Backend            Database
     │                  │                  │                  │
     │  Submit Payment  │                  │                  │
     │─────────────────▶│                  │                  │
     │                  │  POST /payment   │                  │
     │                  │─────────────────▶│                  │
     │                  │                  │                  │
     │                  │                  │  Check Due Date  │
     │                  │                  │─────────┐        │
     │                  │                  │◀────────┘        │
     │                  │                  │                  │
     │                  │                  │  Late Payment?   │
     │                  │                  │─────────┐        │
     │                  │                  │  YES:   │        │
     │                  │                  │  Add 15%│Fine    │
     │                  │                  │◀────────┘        │
     │                  │                  │                  │
     │                  │                  │  Check           │
     │                  │                  │  Disconnection   │
     │                  │                  │─────────┐        │
     │                  │                  │  If YES:│        │
     │                  │                  │  +1000  │Reconn. │
     │                  │                  │◀────────┘        │
     │                  │                  │                  │
     │                  │                  │  INSERT payment  │
     │                  │                  │─────────────────▶│
     │                  │                  │                  │
     │                  │                  │  Confirmation    │
     │                  │                  │◀─────────────────│
     │                  │                  │                  │
     │                  │  Render Receipt  │                  │
     │                  │◀─────────────────│                  │
     │                  │                  │                  │
     │  Payment Receipt │                  │                  │
     │◀─────────────────│                  │                  │
     │                  │                  │                  │
```

### 9C. Report Generation

```
 Admin              Frontend           Backend            Database
     │                  │                  │                  │
     │  Request Report  │                  │                  │
     │─────────────────▶│                  │                  │
     │                  │  GET /reports    │                  │
     │                  │─────────────────▶│                  │
     │                  │                  │                  │
     │                  │                  │  SELECT query    │
     │                  │                  │  (with filters)  │
     │                  │                  │─────────────────▶│
     │                  │                  │                  │
     │                  │                  │  Result Set      │
     │                  │                  │◀─────────────────│
     │                  │                  │                  │
     │                  │                  │  Format Data     │
     │                  │                  │─────────┐        │
     │                  │                  │◀────────┘        │
     │                  │                  │                  │
     │                  │  Render Report   │                  │
     │                  │◀─────────────────│                  │
     │                  │                  │                  │
     │  Display Report  │                  │                  │
     │◀─────────────────│                  │                  │
     │                  │                  │                  │
```

---

## 10. Flowcharts

### 10A. Payment Processing Flowchart

```
                    ┌─────────────┐
                    │    START    │
                    └──────┬──────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  Make Payment   │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  Check Payment  │
                  │     Type        │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  Check Due Date │
                  └────────┬────────┘
                           │
                           ▼
                   ┌───────────────┐
                   │   Is Late?    │
                   └───┬───────┬───┘
                   YES │       │ NO
                       ▼       │
              ┌────────────────┐│
              │  Add 15% Fine  ││
              └────────┬───────┘│
                       │        │
                       ▼        ▼
                  ┌─────────────────┐
                  │    Check        │
                  │  Disconnection  │
                  │    Status       │
                  └────────┬────────┘
                           │
                           ▼
                   ┌───────────────┐
                   │  Reconnect?   │
                   └───┬───────┬───┘
                   YES │       │ NO
                       ▼       │
              ┌────────────────┐│
              │  Add KES 1,000 ││
              │  Reconnection  ││
              │  Fee           ││
              └────────┬───────┘│
                       │        │
                       ▼        ▼
                  ┌─────────────────┐
                  │  Calculate      │
                  │  Total Amount   │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  Save Payment   │
                  └────────┬────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │     END     │
                    └─────────────┘
```

### 10B. Bandwidth Upgrade Flowchart

```
                    ┌─────────────┐
                    │    START    │
                    └──────┬──────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Request Upgrade │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Select New      │
                  │ Bandwidth Plan  │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Apply 10%       │
                  │ Upgrade Discount│
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Update Monthly  │
                  │ Cost            │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Save Changes    │
                  │ to Database     │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Confirm Upgrade │
                  │ to Institution  │
                  └────────┬────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │     END     │
                    └─────────────┘
```

---

## 11. Use Case Diagram

```
    ┌──────────────────────────────────────────────────────────┐
    │               Azani ISP Information System               │
    │                                                          │
    │   ┌──────────────────────────────────────────────────┐   │
    │   │                  USE CASES                       │   │
    │   │                                                  │   │
    │   │   ┌─────────────────────────────────────┐        │   │
    │   │   │  UC1: Register Institution          │◀───┐   │   │
    │   │   └─────────────────────────────────────┘    │   │   │
    │   │                                              │   │   │
    │   │   ┌─────────────────────────────────────┐    │   │   │
    │   │   │  UC2: Make Payment                  │◀───┤   │   │
    │   │   └─────────────────────────────────────┘    │   │   │
    │   │                                              │   │   │
    │   │   ┌─────────────────────────────────────┐    │   │   │
    │   │   │  UC3: Request Bandwidth Upgrade     │◀───┤   │   │
    │   │   └─────────────────────────────────────┘    │   │   │
    │   │                                              │   │   │
    │   │   ┌─────────────────────────────────────┐    │   │   │
    │   │   │  UC4: Generate Reports              │◀───┼───┤   │
    │   │   └─────────────────────────────────────┘    │   │   │
    │   │                                              │   │   │
    │   │   ┌─────────────────────────────────────┐    │   │   │
    │   │   │  UC5: Manage Infrastructure         │◀───┼───┘   │
    │   │   └─────────────────────────────────────┘    │       │
    │   │                                              │       │
    │   └──────────────────────────────────────────────┘       │
    │                                                          │
    └──────────────────────────────────────────────────────────┘
                    │                          │
                    ▼                          ▼
           ┌───────────────┐          ┌───────────────┐
           │               │          │               │
           │  Institution  │          │     Admin     │
           │   (Actor)     │          │    (Actor)    │
           │               │          │               │
           └───────────────┘          └───────────────┘

    Actor-Use Case Mapping:
    ─────────────────────────────────────────────────
    Institution ──▶ UC1: Register Institution
    Institution ──▶ UC2: Make Payment
    Institution ──▶ UC3: Request Bandwidth Upgrade
    Admin       ──▶ UC4: Generate Reports
    Admin       ──▶ UC5: Manage Infrastructure
    Admin       ──▶ UC1: Register Institution (on behalf)
    Admin       ──▶ UC2: Make Payment (record/verify)
```

---

## 12. Benefits of the Architecture

| Benefit | Description |
|---------|-------------|
| **Modular** | Each tier can be developed, tested, and updated independently without affecting others. |
| **Secure** | Multiple layers of security including authentication, RBAC, input validation, and parameterized queries. |
| **Scalable** | The system can grow from a local XAMPP deployment to cloud-hosted infrastructure as demand increases. |
| **Reliable** | Database transactions, foreign key constraints, and backup mechanisms ensure data integrity and availability. |
| **Maintainable** | Clear separation of concerns with organized code structure makes it easy to debug, extend, and onboard new developers. |

---

*End of System Architecture Document*
