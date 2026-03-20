# Project Plan Document

**Project:** Azani Internet Service Provider Information System
**Prepared by:** Derrick (Developer)
**Date:** March 2026

---

## 1. Project Overview

The Azani ISP Information System is a web-based database management application designed to streamline operations for Azani Internet Service Provider. The system will manage institution registrations, bandwidth subscriptions, payment processing, infrastructure tracking, service upgrades, fine calculations, disconnection/reconnection workflows, and comprehensive reporting.

The project follows a structured Software Development Life Cycle (SDLC) using the Waterfall methodology, ensuring each phase is thoroughly completed before progressing to the next. The system will be built using Node.js with Express.js for the backend, MySQL for database management, and a responsive frontend interface.

---

## 2. Timeline & Milestones

| Month | Phase | Activities | Deliverables |
|-------|-------|------------|--------------|
| **January 2026** | Requirements Analysis | - Conduct stakeholder meetings with Azani ISP management<br>- Gather functional and non-functional requirements<br>- Identify system users and their roles<br>- Document business rules (bandwidth tiers, pricing, fines)<br>- Draft Software Requirements Specification (SRS) | - Stakeholder meeting minutes<br>- Requirements document<br>- Software Requirements Specification (SRS) |
| **February 2026** | System Design | - Design Entity-Relationship Diagram (ERD)<br>- Define database schema and normalization<br>- Design system architecture (client-server model)<br>- Create sitemap and UI wireframes<br>- Draft Software Design Document (SDD) | - Entity-Relationship Diagram (ERD)<br>- Database schema documentation<br>- System architecture diagram<br>- Sitemap and wireframes<br>- Software Design Document (SDD) |
| **March 2026** | Development Phase 1 | - Set up development environment (Node.js, MySQL, VS Code)<br>- Create database tables and relationships<br>- Implement institution registration module<br>- Implement payment processing module (registration fee, installation fee, monthly payments)<br>- Build authentication and session management | - Development environment configured<br>- Database tables created<br>- Registration module (functional)<br>- Payment module (functional)<br>- Authentication system |
| **April 2026** | Development Phase 2 | - Implement infrastructure management module (PCs, LAN nodes)<br>- Implement bandwidth upgrade logic with 10% discount<br>- Implement late payment fine calculation (15%)<br>- Implement disconnection and reconnection workflows<br>- Build reporting and dashboard modules | - Infrastructure module (functional)<br>- Upgrade module with discount logic<br>- Fine calculation system<br>- Reconnection workflow<br>- Reports and dashboard |
| **May 2026** | Testing & Validation | - Conduct unit testing on all modules<br>- Perform integration testing across modules<br>- Execute system testing (end-to-end workflows)<br>- Facilitate User Acceptance Testing (UAT) with client<br>- Document and resolve all identified bugs | - Unit test results<br>- Integration test results<br>- System test report<br>- UAT sign-off document<br>- Bug resolution log |
| **June 2026** | Deployment Preparation | - Install system on client's environment<br>- Configure production database and server<br>- Conduct user training sessions<br>- Prepare user manual and system documentation<br>- Perform final data migration (if applicable) | - System installed on client hardware<br>- Production environment configured<br>- Training completion records<br>- User manual<br>- Deployment checklist |
| **July 2026** | Final Delivery & Maintenance | - Deliver hardcopy documentation (bound project report)<br>- Deliver softcopy (source code, database backups, documents)<br>- Establish maintenance and support contract<br>- Conduct post-deployment review<br>- Begin monthly maintenance cycle | - Hardcopy project report<br>- Softcopy deliverables (USB/cloud)<br>- Signed maintenance contract<br>- Post-deployment review report<br>- Maintenance schedule |

---

## 3. Roles & Responsibilities

### Developer — Derrick
| Responsibility | Details |
|----------------|---------|
| Requirements gathering | Conduct interviews, document requirements, prepare SRS |
| System design | Create ERD, database schema, architecture diagrams, SDD |
| Development | Write all application code (frontend, backend, database) |
| Testing | Perform unit, integration, and system testing |
| Documentation | Prepare all project documents (SRS, SDD, user manual, test reports) |
| Deployment | Install and configure the system on client hardware |
| Training | Train end users on system operation |
| Maintenance | Provide ongoing technical support and bug fixes |

### Client's Sister — Operations Manager (Azani ISP)
| Responsibility | Details |
|----------------|---------|
| Requirements validation | Review and approve documented requirements |
| Domain expertise | Provide business rules, pricing structures, and operational workflows |
| UAT participation | Test the system against real-world scenarios and provide feedback |
| Data provision | Supply existing records for data migration (if applicable) |
| Sign-off | Approve deliverables at each milestone |
| End-user coordination | Coordinate with staff for training sessions |

### Support Team
| Responsibility | Details |
|----------------|---------|
| Hardware setup | Assist with PC and network infrastructure installation |
| Network configuration | Set up LAN nodes and connectivity |
| Data entry | Assist with initial data population |
| Issue reporting | Report bugs and usability issues during UAT |
| Ongoing operations | Use the system for daily ISP management tasks |

---

## 4. Deliverables

### Documentation Deliverables
| # | Document | Description | Delivery Phase |
|---|----------|-------------|----------------|
| 1 | Software Requirements Specification (SRS) | Detailed functional and non-functional requirements | January 2026 |
| 2 | Entity-Relationship Diagram (ERD) | Visual representation of database entities and relationships | February 2026 |
| 3 | Database Schema Documentation | Table structures, data types, constraints, and relationships | February 2026 |
| 4 | Software Design Document (SDD) | System architecture, module design, and interface specifications | February 2026 |
| 5 | Sitemap & Wireframes | Navigation structure and UI layout designs | February 2026 |
| 6 | Testing & Validation Report | Test cases, results, and bug resolution documentation | May 2026 |
| 7 | User Manual | Step-by-step guide for system operation | June 2026 |
| 8 | Project Plan | Timeline, milestones, and resource allocation (this document) | March 2026 |
| 9 | Quotation Document | Cost breakdown and payment terms | March 2026 |
| 10 | Final Project Report | Comprehensive bound report covering the entire project | July 2026 |

### System Components
| # | Component | Description |
|---|-----------|-------------|
| 1 | Institution Registration Module | Register, view, edit, and manage subscriber institutions |
| 2 | Payment Processing Module | Handle registration fees, installation fees, and monthly payments |
| 3 | Infrastructure Management Module | Track PC purchases and LAN node installations |
| 4 | Bandwidth Upgrade Module | Process upgrades with automatic 10% discount calculation |
| 5 | Fine & Disconnection Module | Calculate 15% late payment fines and manage disconnections |
| 6 | Reconnection Module | Process reconnections (outstanding bill + fine + KSh 1,000) |
| 7 | Reporting & Dashboard | Generate operational, financial, and defaulter reports |
| 8 | Authentication System | Secure login and session management |
| 9 | MySQL Database | Fully normalized relational database with all required tables |
| 10 | Source Code Package | Complete application source code with documentation |

---

## 5. Risk Management

| # | Risk | Likelihood | Impact | Mitigation Strategy |
|---|------|------------|--------|---------------------|
| 1 | **Project delays due to scope creep** | Medium | High | - Define clear requirements in SRS and obtain sign-off<br>- Use change request process for any new features<br>- Maintain strict milestone deadlines |
| 2 | **Budget overrun** | Low | Medium | - Provide detailed quotation upfront<br>- Define payment milestones tied to deliverables<br>- Avoid unplanned feature additions |
| 3 | **Late client payments** | Medium | High | - Require 50% deposit before development begins<br>- Tie remaining payments to deliverable milestones<br>- Include payment terms in signed contract |
| 4 | **Hardware/infrastructure unavailability** | Low | Medium | - Identify infrastructure requirements early<br>- Provide optional infrastructure quotation<br>- Develop system to run on standard hardware |
| 5 | **Data loss during development** | Low | High | - Maintain regular code backups (Git version control)<br>- Use database backup scripts<br>- Store copies in cloud storage |
| 6 | **Client unavailability for UAT** | Medium | Medium | - Schedule UAT sessions in advance<br>- Provide UAT test scripts for independent testing<br>- Allow remote testing option |
| 7 | **Technical challenges (integration issues)** | Low | Medium | - Use proven technology stack (Node.js, MySQL)<br>- Follow modular development approach<br>- Allocate buffer time in development phases |

---

## 6. Maintenance Plan

### Monthly Support (KSh 5,000/month)
| Service | Description |
|---------|-------------|
| Bug fixes | Resolve any software bugs or errors reported by users |
| Minor updates | Implement small enhancements or adjustments |
| Database maintenance | Perform routine database optimization and cleanup |
| Technical support | Provide phone/email support for system-related issues |
| Backup verification | Verify that automated backups are running correctly |

### Annual Maintenance Audit (KSh 30,000/year)
| Service | Description |
|---------|-------------|
| System health check | Comprehensive review of system performance and stability |
| Security audit | Review and update security configurations |
| Database optimization | Full database analysis, indexing review, and optimization |
| Feature review | Assess need for system updates or new features |
| Documentation update | Update user manual and technical documentation as needed |
| Backup & recovery test | Test backup restoration procedures |
| Performance tuning | Optimize queries, server configuration, and response times |

### Maintenance Schedule
| Activity | Frequency | Responsible |
|----------|-----------|-------------|
| System backup | Daily (automated) | System |
| Bug fix response | Within 48 hours | Developer |
| Monthly maintenance check | 1st week of each month | Developer |
| Quarterly performance review | Every 3 months | Developer |
| Annual comprehensive audit | January each year | Developer |
| Emergency support | As needed (24-hour response) | Developer |
