# System Design Document (SDD)

**Project:** Azani Internet Service Provider Information System
**Prepared by:** Derrick (Developer)
**Date:** March 2026

---

## 1. Introduction

### 1.1 Purpose

This document defines the structure of the database, system workflows, and design decisions for the Azani ISP Information System. It serves as the primary blueprint for development.

### 1.2 Scope

The system manages the full lifecycle of Azani ISP's operations: institution registration, payment processing, infrastructure tracking, bandwidth upgrades, fine enforcement, disconnection/reconnection handling, and report generation. It serves learning institutions including primary schools, junior schools, senior schools, and colleges.

### 1.3 Intended Users

- Azani ISP administrators
- Finance officers
- System support staff

---

## 2. System Objectives

- Register institutions and capture contact person details.
- Capture and track payments (registration, installation, monthly, fines, reconnection).
- Track infrastructure requirements (PCs, LAN nodes, installation status).
- Handle bandwidth upgrades with automatic discount application.
- Enforce business rules (fines, disconnections, reconnection fees).
- Generate comprehensive reports for management decision-making.

---

## 3. System Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Presentation** | HTML5, CSS3, JavaScript, EJS Templates | User interface (forms, reports, dashboard) |
| **Application** | Node.js with Express.js | Business logic, validation, routing |
| **Database** | MySQL 8.0 | Data storage, relationships, integrity |
| **IDE** | Visual Studio Code | Development environment |
| **Deployment** | Local (XAMPP) / Cloud (Vercel) | Hosting |

---

## 4. Entities & ER Diagram

### 4.1 Entity Definitions

#### ContactPerson
| Attribute | Type | Constraint |
|-----------|------|-----------|
| ContactPersonID | INT | PRIMARY KEY, AUTO_INCREMENT |
| FullName | VARCHAR(100) | NOT NULL |
| Phone | VARCHAR(20) | NOT NULL |
| Email | VARCHAR(100) | UNIQUE |

#### BandwidthPackage
| Attribute | Type | Constraint |
|-----------|------|-----------|
| BandwidthID | INT | PRIMARY KEY, AUTO_INCREMENT |
| Speed | VARCHAR(20) | NOT NULL |
| MonthlyCost | DECIMAL(10,2) | NOT NULL |

**Seed Data:**

| Speed | Monthly Cost (KSh) |
|-------|-------------------|
| 4 MBPS | 1,200 |
| 10 MBPS | 2,000 |
| 20 MBPS | 3,500 |
| 25 MBPS | 4,000 |
| 50 MBPS | 7,000 |

#### Institution
| Attribute | Type | Constraint |
|-----------|------|-----------|
| InstitutionID | INT | PRIMARY KEY, AUTO_INCREMENT |
| Name | VARCHAR(100) | NOT NULL |
| Address | VARCHAR(200) | |
| InstitutionType | ENUM('Primary','Junior','Senior','College') | NOT NULL |
| BandwidthID | INT | FOREIGN KEY → BandwidthPackage |
| ContactPersonID | INT | FOREIGN KEY → ContactPerson |
| RegistrationDate | DATE | NOT NULL |
| Status | ENUM('Active','Disconnected','Suspended') | DEFAULT 'Active' |

#### Payment
| Attribute | Type | Constraint |
|-----------|------|-----------|
| PaymentID | INT | PRIMARY KEY, AUTO_INCREMENT |
| InstitutionID | INT | FOREIGN KEY → Institution |
| PaymentType | ENUM('Registration','Installation','Monthly','Fine','Reconnection') | NOT NULL |
| Amount | DECIMAL(10,2) | NOT NULL |
| PaymentDate | DATE | NOT NULL |
| DueDate | DATE | |
| Status | ENUM('Paid','Pending','Overdue') | DEFAULT 'Pending' |

#### Infrastructure
| Attribute | Type | Constraint |
|-----------|------|-----------|
| InfraID | INT | PRIMARY KEY, AUTO_INCREMENT |
| InstitutionID | INT | FOREIGN KEY → Institution |
| PCsRequired | INT | DEFAULT 0 |
| PCsPurchased | INT | DEFAULT 0 |
| LANNodes | INT | DEFAULT 0 |
| LANNodesCost | DECIMAL(10,2) | DEFAULT 0.00 |
| InstallationStatus | ENUM('Pending','Installed','Not Required') | DEFAULT 'Pending' |
| InstallationDate | DATE | |

#### Upgrade
| Attribute | Type | Constraint |
|-----------|------|-----------|
| UpgradeID | INT | PRIMARY KEY, AUTO_INCREMENT |
| InstitutionID | INT | FOREIGN KEY → Institution |
| OldBandwidthID | INT | FOREIGN KEY → BandwidthPackage |
| NewBandwidthID | INT | FOREIGN KEY → BandwidthPackage |
| DiscountPercent | DECIMAL(5,2) | DEFAULT 10.00 |
| NewMonthlyCost | DECIMAL(10,2) | NOT NULL |
| UpgradeDate | DATE | NOT NULL |

#### LANPricing
| Attribute | Type | Constraint |
|-----------|------|-----------|
| LANPricingID | INT | PRIMARY KEY, AUTO_INCREMENT |
| MinNodes | INT | NOT NULL |
| MaxNodes | INT | NOT NULL |
| Cost | DECIMAL(10,2) | NOT NULL |

**Seed Data:**

| Nodes Range | Cost (KSh) |
|------------|-----------|
| 2 – 10 | 10,000 |
| 11 – 20 | 20,000 |
| 21 – 40 | 30,000 |
| 41 – 100 | 40,000 |

### 4.2 Relationships

```
ContactPerson (1) ──── (1) Institution
BandwidthPackage (1) ──── (N) Institution
Institution (1) ──── (N) Payment
Institution (1) ──── (1) Infrastructure
Institution (1) ──── (N) Upgrade
BandwidthPackage (1) ──── (N) Upgrade (Old & New)
```

- One ContactPerson belongs to one Institution.
- One BandwidthPackage serves many Institutions.
- One Institution has many Payments.
- One Institution has one Infrastructure record.
- One Institution can have multiple Upgrades over time.

---

## 5. Database Schema

### 5.1 ContactPerson Table

```sql
CREATE TABLE ContactPerson (
    ContactPersonID INT PRIMARY KEY AUTO_INCREMENT,
    FullName VARCHAR(100) NOT NULL,
    Phone VARCHAR(20) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5.2 BandwidthPackage Table

```sql
CREATE TABLE BandwidthPackage (
    BandwidthID INT PRIMARY KEY AUTO_INCREMENT,
    Speed VARCHAR(20) NOT NULL,
    MonthlyCost DECIMAL(10,2) NOT NULL
);

-- Seed Data
INSERT INTO BandwidthPackage (Speed, MonthlyCost) VALUES
('4 MBPS', 1200.00),
('10 MBPS', 2000.00),
('20 MBPS', 3500.00),
('25 MBPS', 4000.00),
('50 MBPS', 7000.00);
```

### 5.3 LANPricing Table

```sql
CREATE TABLE LANPricing (
    LANPricingID INT PRIMARY KEY AUTO_INCREMENT,
    MinNodes INT NOT NULL,
    MaxNodes INT NOT NULL,
    Cost DECIMAL(10,2) NOT NULL
);

-- Seed Data
INSERT INTO LANPricing (MinNodes, MaxNodes, Cost) VALUES
(2, 10, 10000.00),
(11, 20, 20000.00),
(21, 40, 30000.00),
(41, 100, 40000.00);
```

### 5.4 Institution Table

```sql
CREATE TABLE Institution (
    InstitutionID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Address VARCHAR(200),
    InstitutionType ENUM('Primary', 'Junior', 'Senior', 'College') NOT NULL,
    BandwidthID INT,
    ContactPersonID INT,
    RegistrationDate DATE NOT NULL,
    Status ENUM('Active', 'Disconnected', 'Suspended') DEFAULT 'Active',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (BandwidthID) REFERENCES BandwidthPackage(BandwidthID),
    FOREIGN KEY (ContactPersonID) REFERENCES ContactPerson(ContactPersonID)
);
```

### 5.5 Payment Table

```sql
CREATE TABLE Payment (
    PaymentID INT PRIMARY KEY AUTO_INCREMENT,
    InstitutionID INT NOT NULL,
    PaymentType ENUM('Registration', 'Installation', 'Monthly', 'Fine', 'Reconnection') NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    PaymentDate DATE NOT NULL,
    DueDate DATE,
    Status ENUM('Paid', 'Pending', 'Overdue') DEFAULT 'Pending',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (InstitutionID) REFERENCES Institution(InstitutionID)
);
```

### 5.6 Infrastructure Table

```sql
CREATE TABLE Infrastructure (
    InfraID INT PRIMARY KEY AUTO_INCREMENT,
    InstitutionID INT NOT NULL,
    PCsRequired INT DEFAULT 0,
    PCsPurchased INT DEFAULT 0,
    LANNodes INT DEFAULT 0,
    LANNodesCost DECIMAL(10,2) DEFAULT 0.00,
    InstallationStatus ENUM('Pending', 'Installed', 'Not Required') DEFAULT 'Pending',
    InstallationDate DATE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (InstitutionID) REFERENCES Institution(InstitutionID)
);
```

### 5.7 Upgrade Table

```sql
CREATE TABLE Upgrade (
    UpgradeID INT PRIMARY KEY AUTO_INCREMENT,
    InstitutionID INT NOT NULL,
    OldBandwidthID INT NOT NULL,
    NewBandwidthID INT NOT NULL,
    DiscountPercent DECIMAL(5,2) DEFAULT 10.00,
    NewMonthlyCost DECIMAL(10,2) NOT NULL,
    UpgradeDate DATE NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (InstitutionID) REFERENCES Institution(InstitutionID),
    FOREIGN KEY (OldBandwidthID) REFERENCES BandwidthPackage(BandwidthID),
    FOREIGN KEY (NewBandwidthID) REFERENCES BandwidthPackage(BandwidthID)
);
```

---

## 6. Data Flow Diagrams

### 6.1 Level 0 — Context Diagram

```
                    Registration Details
  Institution ──────────────────────────────► ┌─────────────────────┐
                    Payment Details           │                     │
  Institution ──────────────────────────────► │   Azani ISP         │
                                              │   Information       │ ────► Reports
  Admin ──────── Report Requests ───────────► │   System            │ ────► Financial Summaries
                                              │                     │ ────► Lists
                                              └─────────────────────┘
```

### 6.2 Level 1 — Detailed Processes

1. **Registration Process:** Institution submits details → System validates → Stores in Institution + ContactPerson tables → Generates registration payment record.

2. **Payment Process:** Institution makes payment → System identifies type → Validates amount → Checks due date → Applies fine if late (15%) → Records in Payment table → Updates institution status.

3. **Infrastructure Process:** Admin enters infrastructure details → System records PCs and LAN nodes → Calculates costs (PCs × 40,000 + LAN tier pricing) → Updates installation status.

4. **Reporting Process:** Admin requests report → System queries database → Aggregates data → Generates formatted report → Displays or exports.

---

## 7. System Sitemap

```
Home (Dashboard)
├── Registration
│   ├── Add Institution
│   ├── View All Institutions
│   └── Edit Institution
├── Payments
│   ├── Capture Payment
│   ├── Payment History
│   └── Manage Fines & Reconnections
├── Infrastructure
│   ├── Add Infrastructure Details
│   ├── View Infrastructure Status
│   └── Update Installation Status
├── Services
│   ├── Upgrade Bandwidth
│   ├── View Current Packages
│   └── Bandwidth Pricing
├── Reports
│   ├── Registered Institutions
│   ├── Defaulters List
│   ├── Disconnections List
│   ├── Infrastructure Details
│   └── Financial Summary
└── Settings
    ├── User Management
    └── System Configuration
```

---

## 8. Business Rules

| Rule | Description | Amount / Rate |
|------|------------|--------------|
| Registration Fee | One-time fee per institution | KSh 8,500 |
| Installation Fee | Charged if institution meets readiness requirements | KSh 10,000 |
| PC Purchase | Cost per personal computer | KSh 40,000 each |
| LAN Nodes (2–10) | Network setup cost | KSh 10,000 |
| LAN Nodes (11–20) | Network setup cost | KSh 20,000 |
| LAN Nodes (21–40) | Network setup cost | KSh 30,000 |
| LAN Nodes (41–100) | Network setup cost | KSh 40,000 |
| Upgrade Discount | Discount on new bandwidth cost when upgrading | 10% |
| Late Payment Fine | Surcharge if not paid by end of month | 15% of amount due |
| Disconnection | Service cut if unpaid by 10th of next month | — |
| Reconnection Fee | Fee to restore service after disconnection | KSh 1,000 |

---

## 9. Reports

| Report | Description | Data Source |
|--------|------------|------------|
| Registered Institutions | Complete list of all registered institutions with details | Institution + ContactPerson tables |
| Defaulters List | Institutions with overdue payments | Payment table (Status = 'Overdue') |
| Disconnections List | Institutions with disconnected services | Institution table (Status = 'Disconnected') |
| Infrastructure Details | PCs, LAN nodes, installation status per institution | Infrastructure table |
| Financial Summary | Total payments, fines, and fees per institution | Payment table (aggregated) |
| Installation Cost Report | Total installation cost breakdown per institution | Infrastructure + Payment tables |
| Upgrade History | Bandwidth upgrade records with discounts applied | Upgrade table |

---

## 10. Computation Logic

### (a) Total Installation Cost per Institution

```
Total Installation Cost = Installation Fee + (PCs Purchased × 40,000) + LAN Nodes Cost

Example: 
  Installation Fee = 10,000
  PCs = 3 × 40,000 = 120,000
  LAN Nodes (15 nodes) = 20,000
  Total = 10,000 + 120,000 + 20,000 = KSh 150,000
```

### (b) Cost of Personal Computers and LAN Services

```
PC Cost = Number of PCs × 40,000
LAN Cost = Determined by node tier:
  2–10 nodes  → 10,000
  11–20 nodes → 20,000
  21–40 nodes → 30,000
  41–100 nodes → 40,000
Total = PC Cost + LAN Cost

Example:
  5 PCs = 5 × 40,000 = 200,000
  25 LAN nodes = 30,000
  Total = KSh 230,000
```

### (c) Monthly Charges for Upgraded Internet Services

```
New Monthly Cost = New Bandwidth Cost − (New Bandwidth Cost × 10%)
               = New Bandwidth Cost × 0.90

Example:
  Upgrade from 10 MBPS (2,000) to 20 MBPS (3,500):
  New Monthly Cost = 3,500 × 0.90 = KSh 3,150
```

### (d) Monthly Charges with Fines and Reconnection Fees

```
If paid on time:
  Monthly Charge = Bandwidth Monthly Cost

If late (after end of month):
  Monthly Charge = Bandwidth Cost + (Bandwidth Cost × 15%)

If disconnected (after 10th of next month) and reconnecting:
  Monthly Charge = Bandwidth Cost + Fine (15%) + Reconnection Fee (1,000)

Example:
  Bandwidth Cost = 3,500 (20 MBPS)
  Late: 3,500 + (3,500 × 0.15) = 3,500 + 525 = KSh 4,025
  Reconnection: 3,500 + 525 + 1,000 = KSh 5,025
```

### (e) Aggregate Amount per Service Sorted by Institution

```
Aggregate = Registration Fee + Installation Fee + PC Cost + LAN Cost 
          + Sum of Monthly Payments + Sum of Fines + Sum of Reconnection Fees

Results are sorted alphabetically by institution name.
Categorized by institution type (Primary, Junior, Senior, College).
```

---

## 11. Summary

This System Design Document provides the complete blueprint for the Azani ISP Information System. It defines all entities, relationships, database schema, business rules, computation logic, and report requirements. Developers should refer to this document alongside the SRS and Architecture documents during implementation.

---

*Document Version: 1.0*
*Last Updated: March 2026*
