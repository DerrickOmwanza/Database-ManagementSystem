# Database Design Document

**Project:** Azani ISP Database Management System
**Author:** Derrick
**Date:** March 2026

---

## 1. Introduction

This document details the database design for the Azani ISP Database Management System. It defines the Entity-Relationship Diagram (ERD), table schemas with complete SQL definitions, relationships between entities, business rules enforced at the database level, normalization compliance, and sample queries for common operations.

The database is implemented in **MySQL** and manages institutions, contact persons, bandwidth packages, payments, infrastructure, service upgrades, and LAN pricing.

---

## 2. Entity-Relationship Diagram (ERD)

### 2.1 Entities and Attributes

#### ContactPerson
| Attribute        | Data Type         | Constraints                |
|------------------|-------------------|----------------------------|
| contact_id       | INT               | PRIMARY KEY, AUTO_INCREMENT |
| first_name       | VARCHAR(50)       | NOT NULL                   |
| last_name        | VARCHAR(50)       | NOT NULL                   |
| phone            | VARCHAR(20)       | NOT NULL                   |
| email            | VARCHAR(100)      | NOT NULL                   |

#### BandwidthPackage
| Attribute        | Data Type         | Constraints                |
|------------------|-------------------|----------------------------|
| package_id       | INT               | PRIMARY KEY, AUTO_INCREMENT |
| bandwidth_speed  | VARCHAR(20)       | NOT NULL                   |
| monthly_fee      | DECIMAL(10,2)     | NOT NULL                   |

#### Institution
| Attribute        | Data Type         | Constraints                |
|------------------|-------------------|----------------------------|
| institution_id   | INT               | PRIMARY KEY, AUTO_INCREMENT |
| institution_name | VARCHAR(100)      | NOT NULL                   |
| physical_address | VARCHAR(255)      | NOT NULL                   |
| institution_type | VARCHAR(50)       | NOT NULL                   |
| contact_id       | INT               | FOREIGN KEY → ContactPerson |
| package_id       | INT               | FOREIGN KEY → BandwidthPackage |
| registration_date| DATE              | NOT NULL                   |
| status           | ENUM('Active','Disconnected','Suspended') | DEFAULT 'Active' |

#### Payment
| Attribute        | Data Type         | Constraints                |
|------------------|-------------------|----------------------------|
| payment_id       | INT               | PRIMARY KEY, AUTO_INCREMENT |
| institution_id   | INT               | FOREIGN KEY → Institution  |
| payment_date     | DATE              | NOT NULL                   |
| amount           | DECIMAL(10,2)     | NOT NULL                   |
| payment_type     | ENUM('Monthly','Fine','Other') | NOT NULL          |
| payment_status   | ENUM('Paid','Pending','Overdue') | DEFAULT 'Pending' |

#### Infrastructure
| Attribute        | Data Type         | Constraints                |
|------------------|-------------------|----------------------------|
| infrastructure_id| INT               | PRIMARY KEY, AUTO_INCREMENT |
| institution_id   | INT               | FOREIGN KEY → Institution  |
| equipment_type   | VARCHAR(100)      | NOT NULL                   |
| serial_number    | VARCHAR(100)      | UNIQUE                     |
| installation_date| DATE              | NOT NULL                   |
| status           | ENUM('Operational','Faulty','Decommissioned') | DEFAULT 'Operational' |

#### Upgrade
| Attribute        | Data Type         | Constraints                |
|------------------|-------------------|----------------------------|
| upgrade_id       | INT               | PRIMARY KEY, AUTO_INCREMENT |
| institution_id   | INT               | FOREIGN KEY → Institution  |
| old_package_id   | INT               | FOREIGN KEY → BandwidthPackage |
| new_package_id   | INT               | FOREIGN KEY → BandwidthPackage |
| upgrade_date     | DATE              | NOT NULL                   |
| discount_applied | DECIMAL(10,2)     | DEFAULT 0.00               |

#### LANPricing
| Attribute        | Data Type         | Constraints                |
|------------------|-------------------|----------------------------|
| pricing_id       | INT               | PRIMARY KEY, AUTO_INCREMENT |
| min_computers    | INT               | NOT NULL                   |
| max_computers    | INT               | NOT NULL                   |
| lan_fee          | DECIMAL(10,2)     | NOT NULL                   |

### 2.2 ERD Diagram (Text Representation)

```
┌─────────────────┐       ┌──────────────────┐
│  ContactPerson  │       │ BandwidthPackage │
│─────────────────│       │──────────────────│
│ PK contact_id   │       │ PK package_id    │
│    first_name   │       │    bandwidth_speed│
│    last_name    │       │    monthly_fee    │
│    phone        │       └────────┬─────────┘
│    email        │                │
└────────┬────────┘                │ 1
         │ 1                       │
         │                         │
         │ 1                       │ ∞
┌────────┴─────────────────────────┴─────────┐
│                Institution                  │
│─────────────────────────────────────────────│
│ PK institution_id                           │
│    institution_name                         │
│    physical_address                         │
│    institution_type                         │
│ FK contact_id → ContactPerson               │
│ FK package_id → BandwidthPackage            │
│    registration_date                        │
│    status                                   │
└──────┬──────────────┬───────────────┬───────┘
       │ 1            │ 1             │ 1
       │              │               │
       │ ∞            │ ∞             │ ∞
┌──────┴──────┐ ┌─────┴──────┐ ┌─────┴─────────┐
│  Payment    │ │Infrastructure│ │   Upgrade     │
│─────────────│ │─────────────│ │───────────────│
│PK payment_id│ │PK infra_id  │ │PK upgrade_id  │
│FK instit_id │ │FK instit_id │ │FK instit_id   │
│  pay_date   │ │  equip_type │ │FK old_pkg_id  │
│  amount     │ │  serial_no  │ │FK new_pkg_id  │
│  pay_type   │ │  install_dt │ │  upgrade_date │
│  pay_status │ │  status     │ │  discount     │
└─────────────┘ └─────────────┘ └───────────────┘

┌─────────────────┐
│   LANPricing    │
│─────────────────│
│ PK pricing_id   │
│    min_computers │
│    max_computers │
│    lan_fee       │
└─────────────────┘
```

---

## 3. Relationships

### 3.1 One-to-One Relationships

| Relationship                    | Description                                                     |
|---------------------------------|-----------------------------------------------------------------|
| Institution → ContactPerson     | Each institution has exactly one contact person. Each contact person is associated with one institution. |

### 3.2 One-to-Many Relationships

| Relationship                        | Description                                                     |
|-------------------------------------|-----------------------------------------------------------------|
| BandwidthPackage → Institution      | One bandwidth package can be assigned to many institutions. Each institution subscribes to one package. |
| Institution → Payment              | One institution can have many payment records over time. Each payment belongs to one institution. |
| Institution → Infrastructure       | One institution can have multiple infrastructure/equipment records. Each infrastructure item belongs to one institution. |
| Institution → Upgrade              | One institution can have multiple upgrade history records. Each upgrade record belongs to one institution. |
| BandwidthPackage → Upgrade (old)   | One bandwidth package can be the source of many upgrades. Each upgrade has one old package. |
| BandwidthPackage → Upgrade (new)   | One bandwidth package can be the target of many upgrades. Each upgrade has one new package. |

---

## 4. Complete Schema SQL

### 4.1 CREATE TABLE Statements

```sql
-- ============================================
-- Azani ISP Database Management System
-- Database Schema
-- Author: Derrick | March 2026
-- ============================================

CREATE DATABASE IF NOT EXISTS azani_isp;
USE azani_isp;

-- -------------------------------------------
-- Table: ContactPerson
-- -------------------------------------------
CREATE TABLE ContactPerson (
    contact_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- -------------------------------------------
-- Table: BandwidthPackage
-- -------------------------------------------
CREATE TABLE BandwidthPackage (
    package_id INT AUTO_INCREMENT PRIMARY KEY,
    bandwidth_speed VARCHAR(20) NOT NULL,
    monthly_fee DECIMAL(10,2) NOT NULL
) ENGINE=InnoDB;

-- -------------------------------------------
-- Table: Institution
-- -------------------------------------------
CREATE TABLE Institution (
    institution_id INT AUTO_INCREMENT PRIMARY KEY,
    institution_name VARCHAR(100) NOT NULL,
    physical_address VARCHAR(255) NOT NULL,
    institution_type VARCHAR(50) NOT NULL,
    contact_id INT NOT NULL,
    package_id INT NOT NULL,
    registration_date DATE NOT NULL,
    status ENUM('Active', 'Disconnected', 'Suspended') DEFAULT 'Active',
    FOREIGN KEY (contact_id) REFERENCES ContactPerson(contact_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (package_id) REFERENCES BandwidthPackage(package_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- -------------------------------------------
-- Table: Payment
-- -------------------------------------------
CREATE TABLE Payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    institution_id INT NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_type ENUM('Monthly', 'Fine', 'Other') NOT NULL,
    payment_status ENUM('Paid', 'Pending', 'Overdue') DEFAULT 'Pending',
    FOREIGN KEY (institution_id) REFERENCES Institution(institution_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- -------------------------------------------
-- Table: Infrastructure
-- -------------------------------------------
CREATE TABLE Infrastructure (
    infrastructure_id INT AUTO_INCREMENT PRIMARY KEY,
    institution_id INT NOT NULL,
    equipment_type VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) UNIQUE,
    installation_date DATE NOT NULL,
    status ENUM('Operational', 'Faulty', 'Decommissioned') DEFAULT 'Operational',
    FOREIGN KEY (institution_id) REFERENCES Institution(institution_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- -------------------------------------------
-- Table: Upgrade
-- -------------------------------------------
CREATE TABLE Upgrade (
    upgrade_id INT AUTO_INCREMENT PRIMARY KEY,
    institution_id INT NOT NULL,
    old_package_id INT NOT NULL,
    new_package_id INT NOT NULL,
    upgrade_date DATE NOT NULL,
    discount_applied DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (institution_id) REFERENCES Institution(institution_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (old_package_id) REFERENCES BandwidthPackage(package_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (new_package_id) REFERENCES BandwidthPackage(package_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- -------------------------------------------
-- Table: LANPricing
-- -------------------------------------------
CREATE TABLE LANPricing (
    pricing_id INT AUTO_INCREMENT PRIMARY KEY,
    min_computers INT NOT NULL,
    max_computers INT NOT NULL,
    lan_fee DECIMAL(10,2) NOT NULL
) ENGINE=InnoDB;
```

### 4.2 Seed Data

```sql
-- -------------------------------------------
-- Seed Data: BandwidthPackage
-- -------------------------------------------
INSERT INTO BandwidthPackage (bandwidth_speed, monthly_fee) VALUES
    ('4MBPS', 1200.00),
    ('10MBPS', 2000.00),
    ('20MBPS', 3500.00),
    ('25MBPS', 4000.00),
    ('50MBPS', 7000.00);

-- -------------------------------------------
-- Seed Data: LANPricing
-- -------------------------------------------
INSERT INTO LANPricing (min_computers, max_computers, lan_fee) VALUES
    (2, 10, 10000.00),
    (11, 20, 20000.00),
    (21, 40, 30000.00),
    (41, 100, 40000.00);
```

---

## 5. Business Rules at Database Level

### 5.1 Bandwidth Pricing (KSh)

| Package   | Monthly Fee (KSh) |
|-----------|--------------------|
| 4MBPS     | 1,200              |
| 10MBPS    | 2,000              |
| 20MBPS    | 3,500              |
| 25MBPS    | 4,000              |
| 50MBPS    | 7,000              |

### 5.2 LAN Installation Pricing (KSh)

| Number of Computers | LAN Fee (KSh) |
|---------------------|----------------|
| 2 – 10              | 10,000         |
| 11 – 20             | 20,000         |
| 21 – 40             | 30,000         |
| 41 – 100            | 40,000         |

### 5.3 Fine Calculation Rules

- Institutions that fail to pay by the due date incur a **fine of KSh 5,000** per overdue month.
- The fine is recorded as a separate Payment record with `payment_type = 'Fine'`.
- Institutions with payments overdue for **more than 3 months** are subject to **disconnection** (status changed to 'Disconnected').

### 5.4 Upgrade Discount Rules

- Institutions upgrading their bandwidth package receive a **10% discount** on the first month's fee of the new package.
- The discount is calculated as: `new_package_fee * 0.10` and stored in the `discount_applied` field.
- Only one discount is applied per upgrade event.

### 5.5 Data Integrity Rules

- An institution **cannot be deleted** if it has associated payments, infrastructure, or upgrades (enforced via `ON DELETE RESTRICT`).
- A bandwidth package **cannot be deleted** if any institution is currently subscribed to it.
- A contact person **cannot be deleted** if linked to an institution.
- Payment amounts must be **greater than zero** (enforced at application level).
- Each piece of infrastructure must have a **unique serial number**.

---

## 6. Normalization Notes

### 6.1 First Normal Form (1NF) — ✅ Compliant

- All tables have a defined primary key.
- All columns contain atomic (indivisible) values.
- There are no repeating groups or arrays in any column.
- Each row is uniquely identifiable by its primary key.

### 6.2 Second Normal Form (2NF) — ✅ Compliant

- The database is in 1NF.
- All non-key attributes are **fully functionally dependent** on the entire primary key.
- Since all tables use a single-column primary key (AUTO_INCREMENT), there are no partial dependencies.

### 6.3 Third Normal Form (3NF) — ✅ Compliant

- The database is in 2NF.
- There are no **transitive dependencies** — no non-key attribute depends on another non-key attribute.
- Contact person details are separated into the `ContactPerson` table (not stored directly in `Institution`).
- Bandwidth pricing is separated into the `BandwidthPackage` table (not duplicated in each institution record).
- LAN pricing is maintained in a separate `LANPricing` lookup table.
- Upgrade history references package IDs rather than duplicating package details.

---

## 7. Sample Queries

### 7.1 List All Registered Institutions

```sql
-- List all registered institutions with their contact person
-- and bandwidth package details
SELECT
    i.institution_id,
    i.institution_name,
    i.physical_address,
    i.institution_type,
    CONCAT(c.first_name, ' ', c.last_name) AS contact_person,
    c.phone,
    c.email,
    b.bandwidth_speed,
    b.monthly_fee,
    i.registration_date,
    i.status
FROM Institution i
JOIN ContactPerson c ON i.contact_id = c.contact_id
JOIN BandwidthPackage b ON i.package_id = b.package_id
ORDER BY i.institution_name;
```

### 7.2 List Defaulters (Institutions with Overdue Payments)

```sql
-- List institutions with overdue payments
SELECT
    i.institution_id,
    i.institution_name,
    c.phone,
    c.email,
    p.payment_date,
    p.amount,
    p.payment_status,
    DATEDIFF(CURDATE(), p.payment_date) AS days_overdue
FROM Institution i
JOIN ContactPerson c ON i.contact_id = c.contact_id
JOIN Payment p ON i.institution_id = p.institution_id
WHERE p.payment_status = 'Overdue'
ORDER BY days_overdue DESC;
```

### 7.3 List Disconnections

```sql
-- List all disconnected institutions
SELECT
    i.institution_id,
    i.institution_name,
    i.physical_address,
    CONCAT(c.first_name, ' ', c.last_name) AS contact_person,
    c.phone,
    b.bandwidth_speed,
    i.status
FROM Institution i
JOIN ContactPerson c ON i.contact_id = c.contact_id
JOIN BandwidthPackage b ON i.package_id = b.package_id
WHERE i.status = 'Disconnected'
ORDER BY i.institution_name;
```

### 7.4 Calculate Fines for Overdue Payments

```sql
-- Calculate fines (KSh 5,000 per overdue month) for each defaulting institution
SELECT
    i.institution_id,
    i.institution_name,
    p.payment_date,
    p.amount AS original_amount,
    TIMESTAMPDIFF(MONTH, p.payment_date, CURDATE()) AS months_overdue,
    (TIMESTAMPDIFF(MONTH, p.payment_date, CURDATE()) * 5000.00) AS total_fine
FROM Institution i
JOIN Payment p ON i.institution_id = p.institution_id
WHERE p.payment_status = 'Overdue'
    AND TIMESTAMPDIFF(MONTH, p.payment_date, CURDATE()) > 0
ORDER BY months_overdue DESC;
```

### 7.5 Calculate Upgrade Discounts

```sql
-- Calculate the 10% discount applied on bandwidth upgrades
SELECT
    u.upgrade_id,
    i.institution_name,
    old_pkg.bandwidth_speed AS old_package,
    old_pkg.monthly_fee AS old_fee,
    new_pkg.bandwidth_speed AS new_package,
    new_pkg.monthly_fee AS new_fee,
    (new_pkg.monthly_fee * 0.10) AS calculated_discount,
    u.discount_applied,
    (new_pkg.monthly_fee - u.discount_applied) AS first_month_fee,
    u.upgrade_date
FROM Upgrade u
JOIN Institution i ON u.institution_id = i.institution_id
JOIN BandwidthPackage old_pkg ON u.old_package_id = old_pkg.package_id
JOIN BandwidthPackage new_pkg ON u.new_package_id = new_pkg.package_id
ORDER BY u.upgrade_date DESC;
```

---

*End of Database Design Document*
