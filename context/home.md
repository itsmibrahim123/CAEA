# Home Page Documentation (`index.html`)

This document specifies the layout geometry, component architecture, dynamic data bindings, and interaction states for the CAEA Homepage (`index.html`).

---

## 1. Global Grid & Layout System
- **Base Canvas Reference Width**: 1440px
- **Outer Page Margins**: `52/1440` (`calc((52 / 1440) * 100vw)` ~ 3.61vw / 52px at 1440px)
- **Column Gutters**: `20/1440` (`calc((20 / 1440) * 100vw)` ~ 1.38vw / 20px at 1440px)
- **Primary Design Tokens**:
  - Background Dark: `#000000` / `#08090b`
  - Accent Green: `#a3d88d`
  - Accent Blue: `#4D64D8` / `#798dff`
  - Text Primary: `#FFFFFF`
  - Text Secondary: `#9da5b4` / `#E5E5E7`
  - Typography: `Playfair Display` (Headings/Quotes), `Plus Jakarta Sans` (Body & UI), `Roboto` (Capsule Pills)

---

## 2. Page Sections & Component Breakdown

### 2.1 Header / Navigation Bar (`.site-header`)
- **Background**: Solid black (`#000000`)
- **Container**: Max width 1440px with `52/1440` side margins.
- **Brand Column (Left)**:
  - CAEA Logo (`Assets/CAEA-Navbar-Logo.png`) linking to `index.html`.
- **Navigation Capsule Pill Group (Center)**:
  - Floating capsule container with backdrop blur (`backdrop-filter: blur(12px)`).
  - Navigation links:
    - **ACTIVITIES**: Links to `pages/activities.html`
    - **GET INVOLVED**: Links to `pages/get-involved.html`
    - **OUR STORY**: Links to `pages/our-story.html`
    - **OUR ANALYTICS**: Links to `pages/our-analytics.html`
    - **ADMIN CONSOLE**: Links to `admin/index.html` (or `/admin/`)
- **Badge / Action Column (Right)**:
  - `CD` Community Action indicator badge.

---

### 2.2 Interactive Hero Section (`.hero-section`)
- **Layout**: Full-width edge-to-edge container flush beneath the navbar.
- **Dynamic Event Switcher Binding**:
  - Controlled by `script.js` via `window.DataStore.get('activities')`.
  - Automatically loads the activity flagged with `featured: true` (or the default seed event).
- **Hero Background Image (`#hero-main-img`)**:
  - Dynamically updates to `item.image` (e.g. `Assets/media/events/contested-waters/RAY00190.JPG` or uploaded base64 Data URL).
- **Hero Event Tag Pill (`#hero-event-tag-pill`)**:
  - Displays category tag (e.g., `WORKSHOP`, `RETREAT`, `COMMUNITY KACHERI`).
- **Hero Quote Block (`#hero-quote-text` & `#hero-quote-author`)**:
  - Displays dynamic quote and speaker attribution set via the Admin Panel or activity dataset.
  - Fallback quote:
    > "Not only must we be good, but we must also be good for something."
- **Hero Event Detail Badge (`#hero-active-event-badge`)**:
  - Floating bottom bar displaying event date, title, location, and quick switch indicator (`Showing featured event 1 of X`).

---

### 2.3 Community Quotes & Philosophy Section (`.quote-section`)
- Typography-focused quote presentation in `Playfair Display`.
- Emphasizes grassroots accountability, public energy ownership, and regional water justice.

---

### 2.4 Team & Leadership Grid (`.team-section`)
- 3x3 Responsive Grid showcasing real CAEA core leadership and researchers:
  - **Sanaa Muhammad**: Research Director (`Assets/Team/sanaa-muhammad.jpg`)
  - **Hamna Anwaar**: Policy Lead (`Assets/Team/hamna-anwaar.jpg`)
  - **Asad Juttah**: Field Operations Lead (`Assets/Team/asad-juttah.jpg`)
  - **Muaaz Khan**: Energy Analyst (`Assets/Team/muaaz-khan.jpg`)
  - **Hina Yousaf**: Community Organizer (`Assets/Team/hina-yousaf.jpg`)
  - **Muhammad Saeed**: Environmental Researcher (`Assets/Team/muhammad-saeed.jpg`)
  - **Nabeel Ahmad**: Advocacy Specialist (`Assets/Team/nabeel-ahmad.jpg`)
  - **Kamran Aziz**: Research Fellow (`Assets/Team/kamran-aziz.jpg`)

---

### 2.5 Dynamic Get Involved / Opportunities Grid (`.cause-grid`)
- Rendered dynamically from `window.DataStore.get('opportunities')`.
- Styled as high-contrast blue (`#4D64D8`) and black (`#000000`) cause cards.
- Each card features an **"APPLY NOW >"** button equipped with `data-apply-btn`, `data-opportunity-id`, `data-opportunity-title`, and `data-category`.

---

### 2.6 Dynamic Activities Feed (`.activities-list`)
- Rendered dynamically from `window.DataStore.get('activities')`.
- Each activity card includes:
  - Activity media thumbnail with fallback handler.
  - Title, date, location badge, and description.
  - **"Show in Hero" button (`.btn-feature-hero`)**:
    - Clicking updates the main homepage hero banner to spotlight this event and smooth-scrolls to the top.
    - Synchronizes state with `DataStore`.

---

### 2.7 Universal Apply Now Modal Dialog (`#caea-apply-modal-overlay`)
- Embedded modal created dynamically or loaded on trigger.
- **Fields**:
  - Opportunity Category dropdown (`#apply-opportunity`)
  - Full Name: `placeholder="e.g. Jane Doe"`
  - Email Address: `placeholder="e.g. name@gmail.com"`
  - Phone / WhatsApp: `placeholder="e.g. +92 300 0000000"`
  - City / Region: `placeholder="e.g. Karachi, Sindh"`
  - Time Commitment: `Full-Time`, `Part-Time`, `Internship`, `Volunteering`
  - Statement of Interest / Motivation
  - Relevant Background & Portfolio Links
- **Submission**:
  - Saves new record to `window.DataStore.add('applications', ...)`
  - Broadcasts update to all tabs and displays instant confirmation alert.

---

### 2.8 Global Footer
- Newsletter subscription input (`placeholder="Enter your email (e.g. name@gmail.com)"`).
- Navigational sitemap, copyright notices, and social links.
