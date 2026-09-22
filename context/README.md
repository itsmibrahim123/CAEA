# CAEA (Centre for Applied Energy & Advocacy) — Project Context

Welcome to the comprehensive architecture and system documentation for the CAEA website and administrative console.

---

## 1. Project Overview
CAEA is an advocacy, research, and community-led energy justice platform based in Pakistan. The website serves as a public-facing digital portal for community mobilization, field activities, research publication, team bios, interactive climate analytics, and volunteer/fellowship applications, supported by a full-featured administrative console.

---

## 2. Technology Stack & Architecture
- **Frontend Architecture**: Modern semantic HTML5, Vanilla JavaScript (ES6+), and CSS3 with CSS Custom Properties (`var(--...)`).
- **Reactive Client-Side Data Store (`data-store.js`)**:
  - Global `window.DataStore` API managing all dynamic collections (`activities`, `people`, `articles`, `opportunities`, `applications`).
  - Persistent browser storage via `localStorage` with reactive cross-tab event synchronization via `BroadcastChannel` and custom window events (`caea-datastore-update`).
  - Automated seeding mechanism with factory reset and JSON export/import backup utilities.
- **Admin Control Console (`/admin/`)**:
  - Standalone management dashboard with cryptographic SHA-256 authentication (`crypto.subtle.digest`), brute-force lockout protection, and show/hide password toggle.
  - Full CRUD operations with instant client-side file upload (base64 Data URL conversion) and live image previews.
  - Universal hero event switcher to dynamically spotlight any activity in the homepage hero banner.
  - Candidate application workflow review with status transitions (`Pending`, `Under Review`, `Shortlisted`, `Accepted`, `Archived`), private administrative notes, and CSV data export.
- **Universal Application Popup System**:
  - Reusable modal dialog attached to all **"Apply Now"** triggers across the site.
  - Direct integration with `DataStore` to save candidate submissions in real-time.

---

## 3. Directory & File Structure
```
CAEA/
├── index.html                   # Homepage (Hero switcher, Team grid, Causes, Dynamic Activities, Newsletter)
├── styles.css                   # Global responsive design tokens, typography, layout & animations
├── script.js                    # Core frontend controller, hero switcher, dynamic renderers & Apply Modal
├── data-store.js                # Universal reactive DataStore API & seed database
├── Assets/                      # Centralized media and branding repository
│   ├── CAEA-Navbar-Logo.png     # Official navbar brand logo
│   ├── Hero-image.png           # Default hero event background
│   ├── how-water-became-power.jpg # Article cover graphic
│   ├── Team/                    # Standardized team member photos & bios
│   └── media/events/            # Event photos (contested-waters, exposure-visit, manchar, retreat)
├── admin/                       # Administrative Control Console
│   ├── index.html               # Admin console markup & auth gate
│   ├── admin.css                # Admin console layout, stats grid, tables & modal styling
│   └── admin.js                 # Admin panel controller, CRUD workflows, SHA-256 auth & CSV export
├── pages/                       # Multi-page website views
│   ├── activities.html          # Gatherings, workshops, retreats & field research
│   ├── get-involved.html        # Open positions, volunteering & fellowship categories
│   ├── our-story.html           # Narrative, organizational philosophy, core team & fellows
│   └── our-analytics.html       # Interactive energy analytics, charts & indicators
└── context/                     # Persistent architecture, design tokens & system documentation
    ├── README.md                # High-level architecture and system summary (This file)
    ├── home.md                  # Homepage layout rules, grid system & section specs
    ├── pages.md                 # Multi-page specifications (Activities, Get Involved, Story, Analytics)
    ├── admin.md                 # Admin console architecture, security, CRUD & workflows
    ├── data-store.md            # DataStore schema, API methods & reactive event bus
    └── assets.md                # Media inventory, naming conventions & directory mapping
```

---

## 4. Documentation Index
- [`context/home.md`](file:///Users/itsmibrahim/Documents/OAT/Projects/CAEA/context/home.md) — Grid specifications, layout rules, and component breakdowns for `index.html`.
- [`context/pages.md`](file:///Users/itsmibrahim/Documents/OAT/Projects/CAEA/context/pages.md) — Specifications for all secondary views in `pages/`.
- [`context/admin.md`](file:///Users/itsmibrahim/Documents/OAT/Projects/CAEA/context/admin.md) — Security policies, authentication hashing, CRUD modals, and application review workflows.
- [`context/data-store.md`](file:///Users/itsmibrahim/Documents/OAT/Projects/CAEA/context/data-store.md) — Data schemas, API methods, and reactive event listeners.
- [`context/assets.md`](file:///Users/itsmibrahim/Documents/OAT/Projects/CAEA/context/assets.md) — Complete media inventory, image paths, and folder organization.
