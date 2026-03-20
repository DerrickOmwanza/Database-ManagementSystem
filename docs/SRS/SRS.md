# Software Requirements Specification (SRS)

**Project:** Azani Internet Service Provider Information System  
**Prepared by:** Derrick (Developer)  
**Date:** March 2026  
**Version:** 1.0  
**Status:** Final Draft  

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [External Interfaces](#5-external-interfaces)
6. [Data Requirements](#6-data-requirements)
7. [Acceptance Criteria](#7-acceptance-criteria)
8. [Appendices](#8-appendices)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document defines the complete set of functional and non-functional requirements for the **Azani Internet Service Provider Information System**. The system is developed as part of the **KCSE 2026 Computer Studies Paper 3 Project** and serves as the authoritative reference for design, development, testing, and acceptance of the delivered solution.

The document is intended to:

- Establish a clear, unambiguous description of what the system shall do.
- Serve as the basis for agreement between the developer and the examining body.
- Provide the foundation for system design, implementation, and validation.
- Act as a reference for ongoing maintenance and future enhancements.

### 1.2 Scope

The Azani Internet Service Provider Information System is a centralized database management system designed to support the day-to-day operations of **Azani ISP**, a company that provides internet connectivity and related infrastructure services to learning institutions across Kenya.

The system manages the following core business areas:

- **Institution Registration** — Capturing and maintaining details of client institutions (primary schools, junior schools, senior schools, and colleges).
- **Payment Processing** — Recording registration fees, installation fees, monthly bandwidth charges, fines, and reconnection fees.
- **Infrastructure Management** — Tracking personal computers (PCs) purchased by institutions and Local Area Network (LAN) node installations.
- **Service Upgrades** — Handling bandwidth upgrade requests with applicable discounts.
- **Disconnections & Reconnections** — Enforcing payment deadlines, applying fines for late payments, processing disconnections for non-payment, and recording reconnection fees.
- **Reporting** — Generating comprehensive reports on registered institutions, defaulters, disconnections, infrastructure details, and financial summaries.

**Out of Scope:**  
The system does not handle external billing gateway integrations, real-time network monitoring, or end-user (student/staff) account management at client institutions.

### 1.3 Intended Users

| User Role | Description |
|-----------|-------------|
| **System Administrator** | Manages system configuration, user accounts, and overall system maintenance. |
| **Azani ISP Staff (Data Entry)** | Registers institutions, captures payments, records infrastructure details, and processes upgrades. |
| **Finance Officer** | Reviews payment records, generates financial reports, monitors defaulters, and reconciles accounts. |
| **Management** | Views summary reports, monitors business performance, and makes strategic decisions. |
| **Institutions (Clients)** | May view their own registration status, payment history, and service details (read-only access). |

All users are assumed to have basic computer literacy and familiarity with web-based applications.

### 1.4 Deliverables

The following deliverables shall be produced and submitted:

| # | Deliverable | Format |
|---|-------------|--------|
| 1 | Complete Database System (functional application) | Soft copy on flash disk |
| 2 | Source code and database files | Soft copy on flash disk |
| 3 | Software Requirements Specification (this document) | Hard copy + Soft copy |
| 4 | System Design Document | Hard copy + Soft copy |
| 5 | User Manual / Documentation | Hard copy + Soft copy |
| 6 | Test Plan and Test Results | Hard copy + Soft copy |
| 7 | Sample output reports | Hard copy + Soft copy |
| 8 | Flash disk containing all system files | Physical media |

### 1.5 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| ISP | Internet Service Provider |
| DBMS | Database Management System |
| LAN | Local Area Network |
| MBPS | Megabits Per Second |
| KSh | Kenya Shillings |
| SRS | Software Requirements Specification |
| FR | Functional Requirement |
| NFR | Non-Functional Requirement |

### 1.6 References

- KCSE 2026 Computer Studies Paper 3 Project Brief
- Azani ISP Business Rules and Pricing Schedule
- Kenya Data Protection Act, 2019

---

## 2. Overall Description

### 2.1 System Perspective

The Azani ISP Information System is a **centralized database management system** with a **web-based frontend** interface. It operates as a standalone application within the Azani ISP office environment and is not part of a larger enterprise system.

**Architecture Overview:**

```
┌─────────────────────────────────────────────────────┐
│                   Web Browser                       │
│              (User Interface Layer)                 │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP Requests
┌──────────────────────▼──────────────────────────────┐
│               Web Server (Apache/XAMPP)              │
│              (Application Logic Layer)               │
│         PHP scripts handling business rules          │
└──────────────────────┬──────────────────────────────┘
                       │ SQL Queries
┌──────────────────────▼──────────────────────────────┐
│              Database Server (MySQL)                 │
│               (Data Storage Layer)                   │
│       Tables, views, stored procedures, triggers     │
└─────────────────────────────────────────────────────┘
```

The system follows a **three-tier architecture**:

1. **Presentation Tier** — Web browser rendering HTML/CSS pages for user interaction.
2. **Application Tier** — Server-side scripts (PHP) implementing business logic and validation.
3. **Data Tier** — MySQL relational database storing all persistent data.

### 2.2 System Functions

The system provides the following major functional areas:

1. **Institution Registration** — Register new client institutions with complete contact and classification details.
2. **Payment Capture** — Record registration fees, installation fees, and recurring monthly bandwidth payments.
3. **Infrastructure Management** — Track PCs purchased and LAN node installations per institution.
4. **Bandwidth Package Management** — Assign and manage bandwidth packages with defined pricing tiers.
5. **Service Upgrades** — Process bandwidth upgrade requests and apply the 10% loyalty discount.
6. **Fine & Penalty Management** — Automatically identify late payments and apply the 15% penalty.
7. **Disconnection & Reconnection** — Track disconnected institutions and apply the KSh 1,000 reconnection fee.
8. **Report Generation** — Produce detailed and summary reports across all business areas.

### 2.3 User Characteristics

| Characteristic | Detail |
|---------------|--------|
| **Computer Literacy** | Basic to intermediate — users can navigate web browsers, fill forms, and interpret tabular data. |
| **Domain Knowledge** | Users understand ISP operations, billing cycles, and institutional client management. |
| **Training Required** | Minimal — the system shall provide intuitive navigation and clear labels. A user manual will be provided. |
| **Frequency of Use** | Daily for data entry staff; weekly/monthly for management reporting. |

### 2.4 Constraints

| Constraint | Description |
|-----------|-------------|
| **Technology** | The system must be implemented using a recognized Database Management System (DBMS). |
| **Deliverable Format** | All documentation must be submitted in both hard copy (printed) and soft copy (digital) formats. |
| **Storage Medium** | System files must be delivered on a flash disk. |
| **Business Rules** | All pricing, fines, discounts, and fee structures defined by Azani ISP must be strictly enforced by the system. |
| **Standalone Operation** | The system must operate without requiring internet connectivity (local server deployment). |
| **Data Integrity** | Referential integrity must be maintained across all related tables. |
| **Examination Requirements** | The system must satisfy all requirements specified in the KCSE 2026 Computer Studies Paper 3 project brief. |

### 2.5 Assumptions and Dependencies

- The system will be deployed on a machine running XAMPP (Apache + MySQL + PHP).
- A modern web browser (Chrome, Firefox, or Edge) will be available for accessing the system.
- All monetary values are in Kenya Shillings (KSh).
- The billing cycle follows the standard calendar month.
- Institution types are fixed: Primary School, Junior School, Senior School, and College.
- Bandwidth packages and pricing are as defined by Azani ISP and do not change without system update.

---

## 3. Functional Requirements

### 3.1 Institution Registration

| ID | Requirement | Priority |
|----|------------|----------|
| **FR1** | The system shall allow registration of institutions with the following details: institution name, postal address, town/city, county, and institution type (Primary School, Junior School, Senior School, or College). | High |
| **FR2** | The system shall capture contact person details for each institution, including: full name, phone number, and email address. | High |
| **FR3** | The system shall allow selection of a bandwidth package from the available packages (4 MBPS, 10 MBPS, 20 MBPS, 25 MBPS, or 50 MBPS) during registration. | High |

### 3.2 Fee and Payment Capture

| ID | Requirement | Priority |
|----|------------|----------|
| **FR4** | The system shall record a one-time registration fee of **KSh 8,500** for each newly registered institution. | High |
| **FR5** | The system shall record an installation fee of **KSh 10,000** for each institution that meets the installation requirements. The installation status must be verified before the fee is captured. | High |
| **FR6** | The system shall capture monthly bandwidth payments based on the institution's subscribed package according to the following pricing schedule: | High |

**Bandwidth Pricing Table:**

| Package | Bandwidth | Monthly Charge (KSh) |
|---------|-----------|---------------------|
| Package 1 | 4 MBPS | 1,200 |
| Package 2 | 10 MBPS | 2,000 |
| Package 3 | 20 MBPS | 3,500 |
| Package 4 | 25 MBPS | 4,000 |
| Package 5 | 50 MBPS | 7,000 |

### 3.3 Fines and Penalties

| ID | Requirement | Priority |
|----|------------|----------|
| **FR7** | The system shall apply a **15% fine** on the monthly bandwidth charge for any institution that fails to make payment by the last day of the billing month. The fine is calculated as: `Fine = Monthly Charge × 0.15`. | High |
| **FR8** | The system shall track and flag institutions for **disconnection** if payment (including any applicable fine) remains unpaid by the **10th day of the following month**. | High |
| **FR9** | The system shall apply a **reconnection fee of KSh 1,000** when a previously disconnected institution requests service restoration and settles all outstanding dues. | High |

### 3.4 Infrastructure Management

| ID | Requirement | Priority |
|----|------------|----------|
| **FR10** | The system shall record the number of personal computers (PCs) purchased by each institution through Azani ISP at a cost of **KSh 40,000 per unit**. | High |
| **FR11** | The system shall record the number of LAN nodes installed at each institution and calculate the cost based on the following tiered pricing: | High |

**LAN Node Pricing Table:**

| Tier | Number of Nodes | Cost (KSh) |
|------|----------------|------------|
| Tier 1 | 2 – 10 nodes | 10,000 |
| Tier 2 | 11 – 20 nodes | 20,000 |
| Tier 3 | 21 – 40 nodes | 30,000 |
| Tier 4 | 41 – 100 nodes | 40,000 |

| ID | Requirement | Priority |
|----|------------|----------|
| **FR12** | The system shall record and display the installation status of each institution. Valid statuses are: **Pending**, **In Progress**, **Completed**, and **Not Eligible**. | Medium |

### 3.5 Bandwidth Upgrades

| ID | Requirement | Priority |
|----|------------|----------|
| **FR13** | The system shall allow institutions to upgrade their bandwidth package to a higher tier. A **10% discount** shall be applied to the new monthly charge for upgraded services. The discount is calculated as: `Discounted Monthly Charge = New Package Rate × 0.90`. | High |

### 3.6 Reports and Queries

| ID | Requirement | Priority |
|----|------------|----------|
| **FR14** | The system shall generate a **list of all registered institutions** showing institution name, type, town, contact person, and subscribed bandwidth package. | High |
| **FR15** | The system shall generate a **list of defaulters** — institutions that have not paid their monthly charges by the due date — showing institution name, type, amount due, fine applied, and total outstanding. | High |
| **FR16** | The system shall generate a **list of disconnected institutions** showing institution name, type, date of disconnection, outstanding balance, and reconnection status. | High |
| **FR17** | The system shall generate **infrastructure details per institution** showing the number of PCs purchased, number of LAN nodes installed, LAN tier, and associated costs. | High |

### 3.7 Computations

| ID | Requirement | Priority |
|----|------------|----------|
| **FR18** | The system shall compute the **total installation cost per institution** as: `Total Installation Cost = Installation Fee (KSh 10,000) + LAN Cost + (Number of PCs × KSh 40,000)`. | High |
| **FR19** | The system shall compute and display the **cost of PCs and LAN services** per institution, showing itemized breakdown and totals. | High |
| **FR20** | The system shall compute the **monthly charges for upgraded services** applying the 10% discount: `Upgraded Monthly Charge = New Package Rate × 0.90`. | High |
| **FR21** | The system shall compute **monthly charges with fines and reconnection fees**, grouped by institution type (Primary, Junior, Senior, College), showing: base charge, fine amount (if applicable), reconnection fee (if applicable), and total amount due. | High |
| **FR22** | The system shall compute the **aggregate amount per service** (registration fees, installation fees, monthly charges, fines, reconnection fees, PC sales, LAN services) sorted by institution name. | Medium |
| **FR23** | The system shall generate **comprehensive reports** combining registration details, payment history, infrastructure records, and financial summaries in printable format. | High |

### 3.8 Functional Requirements Traceability Matrix

| Business Area | Functional Requirements |
|--------------|------------------------|
| Registration | FR1, FR2, FR3 |
| Fees & Payments | FR4, FR5, FR6 |
| Fines & Penalties | FR7, FR8, FR9 |
| Infrastructure | FR10, FR11, FR12 |
| Upgrades | FR13 |
| Reports | FR14, FR15, FR16, FR17 |
| Computations | FR18, FR19, FR20, FR21, FR22, FR23 |

---

## 4. Non-Functional Requirements

### 4.1 Performance

| ID | Requirement |
|----|------------|
| NFR1 | The system shall load any page within **3 seconds** under normal operating conditions. |
| NFR2 | Database queries shall return results within **2 seconds** for datasets of up to 1,000 institution records. |
| NFR3 | Report generation shall complete within **5 seconds** for standard reports. |
| NFR4 | The system shall support at least **5 concurrent users** without performance degradation. |

### 4.2 Usability

| ID | Requirement |
|----|------------|
| NFR5 | The user interface shall be intuitive and navigable without prior training for users with basic computer literacy. |
| NFR6 | All forms shall provide clear field labels, input validation messages, and confirmation dialogs for critical actions (e.g., deletion, disconnection). |
| NFR7 | The system shall use consistent layout, color scheme, and typography across all pages. |
| NFR8 | Error messages shall be displayed in plain language, describing the problem and suggesting corrective action. |
| NFR9 | The system shall provide a navigation menu accessible from every page. |

### 4.3 Reliability

| ID | Requirement |
|----|------------|
| NFR10 | The system shall maintain **99% uptime** during business hours (8:00 AM – 5:00 PM, Monday – Friday). |
| NFR11 | The database shall enforce referential integrity constraints to prevent orphaned or inconsistent records. |
| NFR12 | The system shall prevent duplicate institution registrations based on institution name and location. |
| NFR13 | All financial calculations shall be accurate to **two decimal places**. |

### 4.4 Security

| ID | Requirement |
|----|------------|
| NFR14 | The system shall require **username and password authentication** for all users. |
| NFR15 | Passwords shall be stored in **hashed format** (not plain text) in the database. |
| NFR16 | The system shall implement **role-based access control** to restrict functionality based on user roles. |
| NFR17 | User sessions shall **expire after 30 minutes** of inactivity. |
| NFR18 | All form inputs shall be **validated and sanitized** to prevent SQL injection and cross-site scripting (XSS) attacks. |
| NFR19 | The system shall maintain an **audit log** of critical operations (registration, payment, disconnection, reconnection). |

### 4.5 Maintainability

| ID | Requirement |
|----|------------|
| NFR20 | The system code shall be **well-structured and commented** to facilitate future maintenance. |
| NFR21 | The database schema shall be **documented** with entity-relationship diagrams and data dictionaries. |
| NFR22 | Configuration settings (database credentials, system parameters) shall be stored in a **separate configuration file**, not hardcoded. |
| NFR23 | The system shall use **modular design** to allow individual components to be updated independently. |

### 4.6 Portability

| ID | Requirement |
|----|------------|
| NFR24 | The system shall run on **any machine** with XAMPP (Apache, MySQL, PHP) installed, regardless of operating system (Windows, Linux, macOS). |
| NFR25 | The system shall be accessible from any **modern web browser** (Chrome, Firefox, Edge, Safari). |
| NFR26 | The system shall be **self-contained** — all required files shall be included on the delivery flash disk with no external dependencies. |

---

## 5. External Interfaces

### 5.1 User Interface

The system shall provide a **web-based graphical user interface** accessible through a standard web browser. The interface shall include:

| Component | Description |
|-----------|-------------|
| **Login Page** | Secure authentication form with username and password fields. |
| **Dashboard** | Overview of key metrics — total institutions, active subscriptions, defaulters count, revenue summary. |
| **Registration Form** | Multi-section form for capturing institution details, contact person, and bandwidth selection. |
| **Payment Entry Form** | Form for recording registration fees, installation fees, and monthly payments. |
| **Infrastructure Form** | Form for recording PC purchases and LAN node installations. |
| **Upgrade Form** | Form for processing bandwidth upgrades with automatic discount calculation. |
| **Reports Module** | Interface for selecting, generating, viewing, and printing reports. |
| **Search & Filter** | Ability to search institutions by name, type, status, or location. |

**UI Design Principles:**

- Responsive layout adaptable to different screen sizes.
- Clear visual hierarchy with headings, sections, and whitespace.
- Color-coded status indicators (green = active, red = disconnected, amber = defaulting).
- Print-friendly report layouts.

### 5.2 Database Interface

The system shall interface with a **MySQL relational database** through the following mechanisms:

| Interface | Description |
|-----------|-------------|
| **Connection** | PHP Data Objects (PDO) or MySQLi extension for database connectivity. |
| **Queries** | Structured Query Language (SQL) for all data operations (SELECT, INSERT, UPDATE, DELETE). |
| **Stored Procedures** | Pre-compiled SQL routines for complex computations (e.g., fine calculations, aggregate reports). |
| **Views** | Predefined database views for commonly accessed report data. |
| **Triggers** | Automatic actions on data events (e.g., updating disconnection status based on payment dates). |

### 5.3 Hardware Interface

| Component | Minimum Specification |
|-----------|----------------------|
| **Processor** | Intel Core i3 or equivalent (2.0 GHz+) |
| **RAM** | 4 GB minimum |
| **Storage** | 500 MB free disk space for application and database |
| **Display** | 1024 × 768 minimum resolution |
| **Input Devices** | Keyboard and mouse |
| **Network** | Not required (standalone deployment); LAN optional for multi-user access |
| **Printer** | Any standard printer for hard-copy reports |
| **Flash Disk** | USB 2.0 or higher for system delivery |

---

## 6. Data Requirements

### 6.1 Data Entities

The system shall store and manage the following primary data entities:

| Entity | Description | Key Attributes |
|--------|-------------|----------------|
| **Institution** | Client learning institution | ID, Name, Address, Town, County, Type, Registration Date, Status |
| **Contact Person** | Primary contact at institution | ID, Institution ID, Full Name, Phone, Email |
| **Bandwidth Package** | Available internet packages | ID, Speed (MBPS), Monthly Charge |
| **Subscription** | Institution's bandwidth subscription | ID, Institution ID, Package ID, Start Date, Status, Upgraded Flag |
| **Payment** | Financial transactions | ID, Institution ID, Payment Type, Amount, Date, Month/Year, Status |
| **Fine** | Late payment penalties | ID, Payment ID, Institution ID, Fine Amount, Date Applied |
| **Disconnection** | Service disconnection records | ID, Institution ID, Disconnection Date, Reason, Reconnection Date, Reconnection Fee |
| **PC Purchase** | Computers bought through Azani | ID, Institution ID, Quantity, Unit Price, Total Cost, Purchase Date |
| **LAN Installation** | Network node installations | ID, Institution ID, Number of Nodes, Tier, Cost, Installation Date |
| **User** | System users (staff) | ID, Username, Password Hash, Role, Full Name, Status |

### 6.2 Pricing Data

#### 6.2.1 Bandwidth Package Pricing

| Package ID | Speed | Monthly Charge (KSh) | Upgraded Charge (10% Discount) (KSh) |
|-----------|-------|----------------------|---------------------------------------|
| PKG-01 | 4 MBPS | 1,200 | 1,080 |
| PKG-02 | 10 MBPS | 2,000 | 1,800 |
| PKG-03 | 20 MBPS | 3,500 | 3,150 |
| PKG-04 | 25 MBPS | 4,000 | 3,600 |
| PKG-05 | 50 MBPS | 7,000 | 6,300 |

#### 6.2.2 LAN Node Installation Pricing

| Tier | Node Range | Cost (KSh) |
|------|-----------|------------|
| Tier 1 | 2 – 10 | 10,000 |
| Tier 2 | 11 – 20 | 20,000 |
| Tier 3 | 21 – 40 | 30,000 |
| Tier 4 | 41 – 100 | 40,000 |

#### 6.2.3 Fixed Fees

| Fee Type | Amount (KSh) | When Applied |
|----------|-------------|--------------|
| Registration Fee | 8,500 | Once, at registration |
| Installation Fee | 10,000 | Once, when installation requirements are met |
| PC Unit Price | 40,000 | Per unit purchased |
| Reconnection Fee | 1,000 | Each time a disconnected institution is reconnected |
| Late Payment Fine | 15% of monthly charge | When payment is not received by end of billing month |

### 6.3 Data Retention

- All transaction records shall be retained for a minimum of **5 years**.
- Deleted institution records shall be **soft-deleted** (marked as inactive) rather than permanently removed.
- Audit logs shall be retained for the lifetime of the system.

### 6.4 Data Integrity Rules

| Rule | Description |
|------|-------------|
| **Referential Integrity** | Foreign key constraints shall be enforced between all related tables. |
| **Mandatory Fields** | Institution name, type, contact person name, and phone number are required. |
| **Unique Constraints** | No two institutions shall have the same name in the same town. |
| **Valid Ranges** | LAN nodes must be between 2 and 100. PC quantity must be a positive integer. |
| **Date Validation** | Payment dates cannot be in the future. Registration date defaults to current date. |
| **Enumerated Values** | Institution type must be one of: Primary School, Junior School, Senior School, College. |

---

## 7. Acceptance Criteria

The system shall be considered acceptable for delivery when the following criteria are met:

### 7.1 Functional Acceptance

| # | Criterion | Verification Method |
|---|-----------|-------------------|
| AC1 | A new institution can be registered with all required details and assigned a bandwidth package. | Demonstration |
| AC2 | Registration fee (KSh 8,500) and installation fee (KSh 10,000) are correctly recorded. | Demonstration |
| AC3 | Monthly payments are correctly captured based on the subscribed bandwidth package. | Demonstration |
| AC4 | A 15% fine is correctly calculated and applied for late payments. | Calculation verification |
| AC5 | Institutions unpaid by the 10th of the following month are flagged for disconnection. | Demonstration |
| AC6 | Reconnection fee (KSh 1,000) is applied when reconnecting a disconnected institution. | Demonstration |
| AC7 | PC purchases are recorded at KSh 40,000 per unit with correct total calculation. | Calculation verification |
| AC8 | LAN node installations are recorded with correct tier-based pricing. | Calculation verification |
| AC9 | Bandwidth upgrades apply a 10% discount to the new monthly charge. | Calculation verification |
| AC10 | All specified reports (FR14–FR23) are generated with accurate data. | Report review |

### 7.2 Non-Functional Acceptance

| # | Criterion | Verification Method |
|---|-----------|-------------------|
| AC11 | Pages load within 3 seconds. | Observation |
| AC12 | The system requires authentication to access. | Test login |
| AC13 | Input validation prevents invalid data entry. | Boundary testing |
| AC14 | The system runs on a standard XAMPP installation. | Deployment test |
| AC15 | Reports can be printed in a readable format. | Print test |

### 7.3 Documentation Acceptance

| # | Criterion | Verification Method |
|---|-----------|-------------------|
| AC16 | SRS document is complete and covers all requirements. | Document review |
| AC17 | User manual provides clear instructions for all system functions. | Document review |
| AC18 | Database design is documented with ER diagrams and data dictionary. | Document review |
| AC19 | All deliverables are provided in both hard copy and soft copy. | Physical verification |

---

## 8. Appendices

### 8.1 Business Rules Summary

| Rule # | Business Rule | System Enforcement |
|--------|--------------|-------------------|
| BR1 | Every institution must pay a registration fee of KSh 8,500. | Mandatory payment record at registration. |
| BR2 | Installation fee of KSh 10,000 is charged only if the institution meets installation requirements. | Installation status must be verified before fee is applied. |
| BR3 | Monthly charges are based on the subscribed bandwidth package. | System looks up package rate from pricing table. |
| BR4 | A 15% fine is applied if monthly payment is not made by the last day of the billing month. | System checks payment date against month-end deadline. |
| BR5 | If payment (plus fine) is not settled by the 10th of the following month, the institution is disconnected. | System flags institution as disconnected after the 10th. |
| BR6 | A reconnection fee of KSh 1,000 is charged to restore service after disconnection. | Reconnection record created with fee. |
| BR7 | PCs are sold at KSh 40,000 each. | Fixed unit price in system. |
| BR8 | LAN node pricing is tiered based on the number of nodes installed. | System determines tier from node count and applies corresponding cost. |
| BR9 | Institutions upgrading bandwidth receive a 10% discount on the new monthly charge. | System calculates discounted rate: `New Rate × 0.90`. |
| BR10 | Institution types are limited to: Primary School, Junior School, Senior School, and College. | Dropdown selection; no free-text entry. |

### 8.2 Glossary

| Term | Definition |
|------|------------|
| **Bandwidth** | The maximum rate of data transfer across a network, measured in megabits per second (MBPS). |
| **DBMS** | Database Management System — software for creating, managing, and querying structured data stored in databases. |
| **Defaulter** | An institution that has failed to make its monthly payment by the due date. |
| **Disconnection** | The suspension of internet service to an institution due to non-payment. |
| **Installation** | The physical setup of network equipment, cabling, and connectivity at a client institution. |
| **ISP** | Internet Service Provider — a company that provides internet access and related services. |
| **LAN** | Local Area Network — a computer network that connects devices within a limited area such as a school building. |
| **MBPS** | Megabits Per Second — a unit of measurement for data transfer speed. |
| **Node** | A connection point in a LAN where a device (computer, printer, etc.) connects to the network. |
| **Package** | A predefined bandwidth tier offered by Azani ISP at a fixed monthly rate. |
| **Reconnection** | The restoration of internet service to a previously disconnected institution after payment of outstanding dues and the reconnection fee. |
| **Soft Delete** | Marking a record as inactive or deleted without physically removing it from the database, preserving historical data. |
| **Tier** | A pricing level based on a range of values (e.g., number of LAN nodes). |
| **Upgrade** | The process of moving an institution from a lower bandwidth package to a higher one. |

### 8.3 Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | March 2026 | Derrick | Initial SRS document — complete specification. |

---

*End of Software Requirements Specification*
