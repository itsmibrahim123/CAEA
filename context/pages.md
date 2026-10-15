# CAEA Secondary Pages Documentation

This document specifies the purpose, structure, data bindings, and interactive features of all multi-page views located inside the `pages/` directory.

---

## 1. Our Work (`pages/our-work.html`)

### 1.1 Overview
The Our Work page presents CAEA's 4 core strategic pillars, starting directly with the **Fossil Fuel Phaseout** section followed by expandable banners for subsequent pillars:
1. **Fossil Fuel Phaseout** (Primary Top Section) — Directly displayed written narrative, policy analysis, methane emissions, LNG dependence, and an interactive articles repository & reader.
2. **Textile & Fast Fashion** (Green Expandable Banner) — Industrial emissions, captive power, supply chain accountability, and labor justice.
3. **Climate Justice** (Dark Charcoal Expandable Banner) — Ecological democracy, gender equity, water rights, and frontline community sovereignty.
4. **Activities & Gatherings** (Cobalt Blue Expandable Banner) — Field retreats, community kacheris, exposure visits, dynamic photo slideshows, and documentary video features.

### 1.2 Interactive Features
- **Direct Top Section & Expandable Pillars**:
  - **Fossil Fuel Phaseout** is permanently visible and accessible at the top of the page.
  - The subsequent pillars (**Textile & Fast Fashion**, **Climate Justice**, **Activities & Gatherings**) feature high-contrast expandable banners with `/assets/Tab-scroll.png` and smooth accordions.
- **Dynamic Articles Filter & In-Page Reader**:
  - Filterable by topic tags with real-time text search and an inline reader modal for comprehensive research documents.
- **Activities Slideshow & Video Documentary**:
  - Integrated field activities feed from `DataStore` with auto-cycling photo galleries and documentary video playback.
- **Direct Opportunity Applications**:
  - Embedded "JOIN US" and "Apply" actions link seamlessly to the universal application modal.
  - Standardized media galleries under `assets/media/events/` (`contested-waters/`, `exposure-visit/`, `manchar/`, `retreat/`).

---

## 2. Get Involved & Opportunities (`pages/get-involved.html`)

### 2.1 Overview
The Get Involved portal provides a transparent gateway for activists, researchers, students, and community members to join CAEA through full-time roles, internships, fellowships, or volunteer positions.

### 2.2 Interactive Features
- **Dynamic Positions Grid**:
  - Synchronized with `window.DataStore.get('opportunities')`.
  - Displays styled cards in High-Contrast Blue (`#4D64D8`) and Deep Black (`#000000`).
  - Displays role type (`Full-Time`, `Part-Time`, `Volunteering`, `Internship`, `Event / Gathering`), availability status (`Open`, `Upcoming`, `Closed`), and full job descriptions.
- **Interactive "APPLY NOW >" Action**:
  - Every position card includes an **APPLY NOW** action button with data attributes:
    `data-apply-btn`, `data-opportunity-id`, `data-opportunity-title`, `data-category`.
  - Automatically pops up the **Universal Apply Modal** with the selected role pre-selected in the form dropdown.
- **Submission Real-Time Sync**:
  - Candidate submissions instantly appear in the administrative console under **Applied Fields / Submissions**.

---

## 3. Our Story & People (`pages/our-story.html`)

### 3.1 Overview
The Our Story page details CAEA's history, theoretical foundation, community-first research methodology, and profiles the complete leadership, research team, and fellows.

### 3.2 Structure & Components
- **Organizational Narrative**:
  - Traces the history of energy privatization, water rights in Sindh, and community mobilization in Pakistan.
- **Leadership & Team Bios Grid**:
  - Comprehensive bio profiles and photography for:
    - **Sanaa’i Muhammad** — Founder & CEO (`assets/team/sanaa-muhammad.jpg`)
    - **Kamran Aziz** — Founding Partner & Director Research (`assets/team/kamran-aziz.jpg`)
    - **Muhammad Asad** — Research Associate (`assets/team/asad-juttah.jpg`)
    - **Hamna Anwaar** — Textile Associate (`assets/team/hamna-anwaar.jpg`)
    - **Muhammad Saeed** — Climate Justice Lead (`assets/team/muhammad-saeed.jpg`)
    - **Muaaz Ahmad Khan** — Communication Lead (`assets/team/muaaz-khan.jpg`)
    - **Fizza Aman Bhutto** — Admin & HR Officer (`assets/team/grid-1-3-fiza.png`)
    - **Manahil Usman** — Associate Fossil Fuel Phaseout (`assets/team/hina-yousaf.jpg`)
    - **Abid Azim** — Finance Officer / CPA (`assets/team/nabeel-ahmad.jpg`)
- **Allies & Partners Section**:
  - Showcases civil society alliances and grassroots coalitions (*Alternative Law Collective*, *Alliance for Climate Justice & Clean Energy*, *Climate Action Center*, *PRIED*, and *Verrha Research*).

---

## 4. Our Analytics & Data Explorer (`pages/our-analytics.html`)

### 4.1 Overview
The Our Analytics page provides interactive data visualizations, sector indicators, and research charts on Pakistan's energy mix, circular debt, renewable potential, and provincial water distribution.

### 4.2 Features
- **Searchable Analytics Index**:
  - Real-time search filter (`#analytics-search`) for charts, sectors, and policy metrics.
- **Interactive Metric Panels**:
  - Grid parity comparisons, seasonal hydropower variations, thermal dependency metrics, and regional climate vulnerability indices.
- **Open Data Access**:
  - Clear citation links, methodology notes, and open datasets for researchers and journalists.
