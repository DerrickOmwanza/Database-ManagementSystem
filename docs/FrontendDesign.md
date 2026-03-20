# Frontend Design Document

**Project:** Azani ISP Database Management System
**Author:** Derrick
**Date:** March 2026

---

## 1. Introduction

This document defines the frontend design specifications for the Azani ISP Database Management System. It covers the sitemap structure, color scheme, typography, wireframe descriptions for key pages, UX guidelines, and consistency rules to ensure a unified and professional user interface across all modules.

---

## 2. Sitemap

The application follows a hierarchical navigation structure:

```
Home (Dashboard)
│
├── Registration
│   ├── Add Institution
│   └── View Institutions
│
├── Payments
│   ├── Capture Payment
│   ├── Payment History
│   └── Fines Management
│
├── Infrastructure
│   ├── Add Infrastructure
│   └── View Infrastructure
│
├── Services
│   ├── Upgrade Service
│   └── View Services
│
├── Reports
│   ├── Registered Institutions Report
│   ├── Defaulters Report
│   ├── Disconnections Report
│   ├── Fines Report
│   └── Upgrade Discounts Report
│
└── Settings
    ├── User Management
    └── System Configuration
```

---

## 3. Color Scheme

| Role            | Color Name  | Hex Code    | Usage                                      |
|-----------------|-------------|-------------|---------------------------------------------|
| Primary         | Deep Blue   | `#003366`   | Headers, navigation bar, primary buttons    |
| Secondary       | Orange      | `#FF6600`   | Accent elements, highlights, call-to-action |
| Background      | Light Grey  | `#F5F5F5`   | Page background, content area               |
| Text            | Dark Grey   | `#333333`   | Body text, labels, descriptions             |
| Success         | Green       | `#28A745`   | Success messages, active status indicators  |
| Error           | Red         | `#DC3545`   | Error messages, validation alerts, warnings |
| Info            | Blue        | `#007BFF`   | Informational badges, links, tooltips       |

### Color Usage Guidelines

- **Primary Deep Blue (#003366):** Used consistently for the top navigation bar, sidebar headers, and primary action buttons (e.g., "Save", "Submit").
- **Secondary Orange (#FF6600):** Applied sparingly for attention-grabbing elements such as notification badges, important links, and hover states on secondary buttons.
- **Background Light Grey (#F5F5F5):** The default background for all pages to reduce eye strain and provide contrast against white content cards.
- **Text Dark Grey (#333333):** All body text, form labels, and table content use this color for readability.
- **Success Green (#28A745):** Displayed in toast notifications for successful operations, active/connected status badges, and confirmation messages.
- **Error Red (#DC3545):** Used for form validation errors, failed operation alerts, overdue payment indicators, and disconnection status badges.
- **Info Blue (#007BFF):** Applied to hyperlinks, informational tooltips, and neutral status indicators.

---

## 4. Typography

### Font Family

- **Primary Font:** Roboto
- **Fallback Font:** Open Sans, sans-serif

### Heading Sizes

| Element | Font Size | Font Weight | Usage                          |
|---------|-----------|-------------|--------------------------------|
| H1      | 32px      | 700 (Bold)  | Page titles                    |
| H2      | 26px      | 600         | Section headings               |
| H3      | 22px      | 600         | Subsection headings            |
| H4      | 18px      | 500         | Card titles, widget headers    |
| H5      | 16px      | 500         | Minor headings, labels         |

### Body Text

| Element      | Font Size | Font Weight | Line Height | Usage                    |
|--------------|-----------|-------------|-------------|--------------------------|
| Body         | 14px      | 400         | 1.6         | General content          |
| Small Text   | 12px      | 400         | 1.4         | Captions, helper text    |
| Button Text  | 14px      | 600         | 1.0         | Button labels            |
| Table Text   | 13px      | 400         | 1.5         | Table cell content       |
| Input Text   | 14px      | 400         | 1.4         | Form input values        |

---

## 5. Wireframe Descriptions

### 5.1 Dashboard

The Dashboard is the landing page after login. It provides a high-level overview of the system status.

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER                                                      │
│  [Logo: Azani ISP]         [Search Bar]   [User Icon ▼]      │
├────────────┬─────────────────────────────────────────────────┤
│            │                                                  │
│  SIDEBAR   │  STATS CARDS ROW                                 │
│  NAV       │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────────┐│
│            │  │ Total   │ │ Active  │ │ Pending │ │ Over-  ││
│  Dashboard │  │ Instit. │ │ Payments│ │ Fines   │ │ due    ││
│  Registr.  │  │  [count]│ │  [count]│ │  [count]│ │ [count]││
│  Payments  │  └─────────┘ └─────────┘ └─────────┘ └────────┘│
│  Infra.    │                                                  │
│  Services  │  RECENT ACTIVITY TABLE                           │
│  Reports   │  ┌──────────────────────────────────────────────┐│
│  Settings  │  │ Date   │ Institution │ Action    │ Status    ││
│            │  │--------|-------------|-----------|───────────││
│            │  │ row 1  │ ...         │ ...       │ ...       ││
│            │  │ row 2  │ ...         │ ...       │ ...       ││
│            │  │ row 3  │ ...         │ ...       │ ...       ││
│            │  └──────────────────────────────────────────────┘│
│            │                                                  │
│            │  ACTION BUTTONS                                  │
│            │  [+ Register Institution] [Capture Payment]      │
│            │  [Generate Report]        [View Infrastructure]  │
│            │                                                  │
└────────────┴─────────────────────────────────────────────────┘
```

**Components:**

- **Header:** Contains the Azani ISP logo (left), a global search bar (center), and a user profile dropdown (right) showing the logged-in user's name and role.
- **Sidebar Navigation:** Vertical navigation with icons and labels for each module. The active page is highlighted with the Primary Deep Blue background and white text.
- **Stats Cards:** Four summary cards displayed in a row, each showing a metric label and its numeric count. Cards have a white background with a subtle shadow, and a colored left border corresponding to the metric category.
- **Recent Activity Table:** A table listing the most recent system activities (registrations, payments, status changes) with columns for Date, Institution, Action, and Status.
- **Action Buttons:** Quick-access buttons styled with the Primary Deep Blue background and white text, allowing users to jump directly to common tasks.

### 5.2 Registration Form

The Registration Form is used to add new institutions to the system.

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER                                                      │
├────────────┬─────────────────────────────────────────────────┤
│  SIDEBAR   │  PAGE TITLE: Register New Institution            │
│  NAV       │  ─────────────────────────────────────────────── │
│            │                                                  │
│            │  FORM SECTION                                    │
│            │  ┌──────────────────────────────────────────────┐│
│            │  │ Institution Name:    [___________________]   ││
│            │  │ Physical Address:    [___________________]   ││
│            │  │ Institution Type:    [___________________]   ││
│            │  │                                              ││
│            │  │ Contact Person Name: [___________________]   ││
│            │  │ Phone Number:        [___________________]   ││
│            │  │ Email Address:       [___________________]   ││
│            │  │                                              ││
│            │  │ Bandwidth Package:   [▼ Select Package   ]   ││
│            │  │                                              ││
│            │  │ Monthly Fee:         KSh [auto-calculated]   ││
│            │  │                      (read-only, auto-fills  ││
│            │  │                       based on package)       ││
│            │  │                                              ││
│            │  │        [Save Institution]  [Cancel]           ││
│            │  └──────────────────────────────────────────────┘│
│            │                                                  │
└────────────┴─────────────────────────────────────────────────┘
```

**Fields:**

- **Institution Name:** Text input, required, max 100 characters.
- **Physical Address:** Text input, required, max 255 characters.
- **Institution Type:** Text input for the type/category of institution.
- **Contact Person Name:** Text input, required, max 100 characters.
- **Phone Number:** Text input with phone format validation.
- **Email Address:** Text input with email format validation.
- **Bandwidth Package:** Dropdown menu populated from the BandwidthPackage table (4MBPS, 10MBPS, 20MBPS, 25MBPS, 50MBPS).
- **Monthly Fee:** Read-only field that auto-calculates and displays the fee (in KSh) based on the selected bandwidth package.
- **Save Button:** Primary Deep Blue button that validates and submits the form.
- **Cancel Button:** Secondary outlined button that clears the form and returns to the institution list.

### 5.3 Payment Form

The Payment Form captures payment transactions for registered institutions.

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER                                                      │
├────────────┬─────────────────────────────────────────────────┤
│  SIDEBAR   │  PAGE TITLE: Capture Payment                     │
│  NAV       │  ─────────────────────────────────────────────── │
│            │                                                  │
│            │  FORM SECTION                                    │
│            │  ┌──────────────────────────────────────────────┐│
│            │  │ Institution:     [▼ Select Institution   ]   ││
│            │  │                                              ││
│            │  │ Payment Type:    [▼ Select Type           ]   ││
│            │  │                  (Monthly / Fine / Other)     ││
│            │  │                                              ││
│            │  │ Amount (KSh):    [___________________]       ││
│            │  │                                              ││
│            │  │ Payment Date:    [📅 _______________]        ││
│            │  │                                              ││
│            │  │ Payment Status:  [▼ Select Status        ]   ││
│            │  │                  (Paid / Pending / Overdue)   ││
│            │  │                                              ││
│            │  │          [Save Payment]  [Cancel]             ││
│            │  └──────────────────────────────────────────────┘│
│            │                                                  │
└────────────┴─────────────────────────────────────────────────┘
```

**Fields:**

- **Institution:** Dropdown populated from the Institution table, displaying institution names with IDs.
- **Payment Type:** Dropdown with options: Monthly, Fine, Other.
- **Amount (KSh):** Numeric input field for the payment amount in Kenyan Shillings.
- **Payment Date:** Date picker defaulting to the current date.
- **Payment Status:** Dropdown with options: Paid, Pending, Overdue.
- **Save Button:** Primary Deep Blue button that validates and records the payment.
- **Cancel Button:** Secondary outlined button that clears the form and returns to payment history.

### 5.4 Report Page

The Report Page provides filtered views of system data with export capabilities.

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER                                                      │
├────────────┬─────────────────────────────────────────────────┤
│  SIDEBAR   │  PAGE TITLE: Reports                             │
│  NAV       │  ─────────────────────────────────────────────── │
│            │                                                  │
│            │  FILTERS SECTION                                 │
│            │  ┌──────────────────────────────────────────────┐│
│            │  │ Report Type:  [▼ Select Report Type       ]  ││
│            │  │   (Registered / Defaulters / Disconnections   ││
│            │  │    / Fines / Upgrade Discounts)               ││
│            │  │                                              ││
│            │  │ Date From:    [📅 ________]                  ││
│            │  │ Date To:      [📅 ________]                  ││
│            │  │                                              ││
│            │  │ Institution:  [▼ All Institutions         ]  ││
│            │  │                                              ││
│            │  │              [Generate Report]                ││
│            │  └──────────────────────────────────────────────┘│
│            │                                                  │
│            │  RESULTS TABLE                                   │
│            │  ┌──────────────────────────────────────────────┐│
│            │  │ #  │ Institution │ Details    │ Amount │ ... ││
│            │  │----|-------------|------------|--------|─────││
│            │  │ 1  │ ...         │ ...        │ ...    │ ... ││
│            │  │ 2  │ ...         │ ...        │ ...    │ ... ││
│            │  │ 3  │ ...         │ ...        │ ...    │ ... ││
│            │  │    │             │            │ Total: │ ... ││
│            │  └──────────────────────────────────────────────┘│
│            │                                                  │
│            │  EXPORT BUTTONS                                  │
│            │  [📄 Export PDF]  [📊 Export Excel]  [🖨 Print]  │
│            │                                                  │
└────────────┴─────────────────────────────────────────────────┘
```

**Components:**

- **Filters Section:** A card containing filter controls to narrow report results.
  - **Report Type:** Dropdown to select the type of report (Registered Institutions, Defaulters, Disconnections, Fines, Upgrade Discounts).
  - **Date Range:** Two date pickers (From and To) to define the reporting period.
  - **Institution:** Dropdown to filter by a specific institution or view all.
  - **Generate Report Button:** Orange secondary button that triggers the report query.
- **Results Table:** A dynamic data table that displays the report results. Columns adjust based on the selected report type. Includes pagination for large datasets and a totals row where applicable.
- **Export Buttons:** Three export options displayed as icon buttons below the results table.
  - **Export PDF:** Generates a downloadable PDF document of the report.
  - **Export Excel:** Generates a downloadable Excel spreadsheet (.xlsx) of the report data.
  - **Print:** Opens the browser print dialog with a print-optimized view of the report.

---

## 6. UX Guidelines

### 6.1 Responsiveness

- The layout must be responsive across desktop (1200px+), tablet (768px–1199px), and mobile (below 768px) viewports.
- On mobile, the sidebar collapses into a hamburger menu.
- Cards stack vertically on smaller screens.

### 6.2 Feedback & Notifications

- All form submissions must display a success or error toast notification in the top-right corner.
- Form validation errors must appear inline below the respective input field in Error Red (#DC3545).
- Loading states must use a spinner or skeleton screen to indicate data is being fetched.

### 6.3 Accessibility

- All interactive elements must be keyboard-navigable.
- Color contrast ratios must meet WCAG 2.1 AA standards (minimum 4.5:1 for text).
- Form inputs must have associated `<label>` elements.
- Images and icons must have meaningful `alt` text or `aria-label` attributes.

### 6.4 Navigation

- The active page must be clearly highlighted in the sidebar navigation.
- Breadcrumbs should be displayed on inner pages (e.g., Home > Payments > Capture Payment).
- All destructive actions (delete, disconnect) must require a confirmation dialog.

### 6.5 Data Tables

- Tables must support sorting by clicking column headers.
- Tables with more than 10 rows must include pagination.
- A search/filter input should be available above data tables for quick lookups.

---

## 7. Consistency Rules

### 7.1 Shared Layout Components

- **Header:** The same header component (logo, search bar, user menu) must appear on every page. The header uses a Deep Blue (#003366) background with white text.
- **Footer:** A shared footer must appear at the bottom of every page displaying "© 2026 Azani ISP. All rights reserved." centered in Dark Grey (#333333) on a Light Grey (#F5F5F5) background.
- **Sidebar Navigation:** The same vertical sidebar must appear on all authenticated pages with identical menu items, icons, and ordering.

### 7.2 Color Consistency

- The same color must always represent the same meaning across all pages (e.g., Green always means success/active, Red always means error/overdue).
- Primary action buttons are always Deep Blue (#003366).
- Secondary/accent action buttons are always Orange (#FF6600).
- Destructive action buttons are always Error Red (#DC3545).

### 7.3 Button Styles

| Button Type  | Background  | Text Color | Border          | Usage                    |
|--------------|-------------|------------|-----------------|--------------------------|
| Primary      | `#003366`   | `#FFFFFF`  | None            | Save, Submit, Confirm    |
| Secondary    | `#FF6600`   | `#FFFFFF`  | None            | Generate, Filter, Action |
| Outline      | Transparent | `#003366`  | 1px `#003366`   | Cancel, Back, Reset      |
| Danger       | `#DC3545`   | `#FFFFFF`  | None            | Delete, Disconnect       |
| Disabled     | `#CCCCCC`   | `#666666`  | None            | Inactive/unavailable     |

### 7.4 Form Styling

- All form inputs must use the same height (38px), border radius (4px), and border color (#CCCCCC).
- Focused inputs must have a blue border (#007BFF) with a subtle box shadow.
- Required fields must display a red asterisk (*) next to the label.
- Error states must change the input border to Error Red (#DC3545) with an error message below.

### 7.5 Card Styling

- All content cards must use a white background, border radius of 8px, and a subtle box shadow (`0 2px 4px rgba(0,0,0,0.1)`).
- Card headers must use a bottom border separator in Light Grey (#E0E0E0).
- Consistent padding of 20px inside all cards.

---

*End of Frontend Design Document*
