# CAEA Secondary Pages Documentation

This document specifies the purpose, structure, data bindings, and interactive features of all multi-page views located inside the `pages/` directory.

---

## 1. Our Work & Activities (`pages/our-work.html`)

### 1.1 Overview
The Activities page serves as the public repository and journal of CAEA's field retreats, community kacheris, workshops, research expeditions, and exposure visits.

### 1.2 Interactive Features
- **Dynamic Activity Feed**:
  - Populates directly from `window.DataStore.get('activities')`.
  - Filterable by category tag (`RETREAT`, `WORKSHOP`, `COMMUNITY KACHERI`, `EXPOSURE VISIT`, `RESEARCH`, `FIELD PROJECT`, `POLICY`, `CASE STUDY`).
- **Hero Feature Switcher & Auto-Cycling Slideshow**:
  - Each activity card includes a **"Show in Hero"** interactive button.
  - Clicking spotlights the event on the main hero banner across the site and saves the preference to `DataStore`.
  - Configurable automated hero slideshow rotates featured events smoothly and pauses on hover.
- **Dynamic Video Documentary System**:
  - Fully manageable video documentary card (`#activities-video-section`) powered by `DataStore.getPageSettings('activities')`.
  - Supports custom video URLs (YouTube, Vimeo, MP4) and uploaded video files with interactive playback modal (`#caea-video-modal-overlay`).
- **Direct Application Triggers**:
  - Community gatherings and open workshop sessions link to the **Universal Apply Modal** (`#caea-apply-modal-overlay`), pre-filling the activity category.
- **Media Assets**:
  - Standardized media galleries under `Assets/media/events/` (`contested-waters/`, `exposure-visit/`, `manchar/`, `retreat/`).

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
    - **Sanaa’i Muhammad** — Founder & CEO (`Assets/Team/sanaa-muhammad.jpg`)
    - **Kamran Aziz** — Founding Partner & Director Research (`Assets/Team/kamran-aziz.jpg`)
    - **Muhammad Asad** — Research Associate (`Assets/Team/asad-juttah.jpg`)
    - **Hamna Anwaar** — Textile Associate (`Assets/Team/hamna-anwaar.jpg`)
    - **Muhammad Saeed** — Climate Justice Lead (`Assets/Team/muhammad-saeed.jpg`)
    - **Muaaz Ahmad Khan** — Communication Lead (`Assets/Team/muaaz-khan.jpg`)
    - **Fizza Aman Bhutto** — Admin & HR Officer (`Assets/Team/grid-1-3-fiza.png`)
    - **Manahil Usman** — Associate Fossil Fuel Phaseout (`Assets/Team/hina-yousaf.jpg`)
    - **Abid Azim** — Finance Officer / CPA (`Assets/Team/nabeel-ahmad.jpg`)
- **Allies & Partners Section**:
  - Showcases civil society alliances and grassroots coalitions (e.g., *Alternative Law Collective*).

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
