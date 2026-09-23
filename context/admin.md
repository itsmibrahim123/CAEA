# CAEA Admin Dashboard Documentation (`/admin/`)

This document details the administrative console architecture, cryptographic authentication system, security policies, CRUD data management, direct file uploading, and candidate submission workflows.

---

## 1. Authentication & Security Policy

### 1.1 Cryptographic Password Verification
- **Algorithm**: Client-side **SHA-256** cryptographic hash computed via the Web Crypto API (`crypto.subtle.digest('SHA-256', ...)`).
- **Master Password**: `CAEA@Admin#2026!`
- **Master SHA-256 Hash**: `0bd52dc00fb3e853b13ee73b111a4d1e7ff453ed865812db6a11a6cee533f221`
- **Legacy Fallback Hash**: `f8ce72e90f230559f515ee0420e6a4b1b369c733364f849ecb13bd600fae24be` (`caea2024`)
- **No Plaintext Passwords**: Passwords are never stored or compared in raw plaintext.
- **Privacy Assurance**: The passcode input field does not leak the password in placeholders (uses `placeholder="Enter administrative passcode"`).

### 1.2 Brute-Force Lockout Protection
- **Failed Attempt Threshold**: 5 consecutive failed login attempts.
- **Lockout Cooldown Period**: 60 seconds.
- **State Enforcement**: Tracks attempts in `sessionStorage` (`caea_auth_failed_attempts`, `caea_auth_lockout_until`).
- **Interactive UI Feedback**: Disables the submit button, locks the password field, and displays a live real-time countdown timer in `#auth-error`.

### 1.3 Password Visibility Toggle
- Includes an interactive `#btn-toggle-pwd` with dynamic SVG eye icons (`.eye-open`, `.eye-closed`) to show/hide the password in real-time.

---

## 2. Admin Navigation & Tab Architecture

The navigation bar (`.admin-tab-nav`) is designed with a sleek, compact gap (`6px`) and contains 7 core operational panels ordered by applied forms first, followed by website page flow:

1. **Applied Forms / Submissions** (`#panel-applications`):
   - Review all candidate submissions submitted via the public "Apply Now" modal dialog.
   - Status transitions: `Pending`, `Under Review`, `Shortlisted`, `Accepted`, `Archived`.
   - Private administrative notes field for interview tracking and candidate vetting.
   - One-click **CSV Export** (`caea-applications-YYYY-MM-DD.csv`).
2. **Home Page (Map Pins & Latest Videos)** (`#panel-home`):
   - **Pakistan Map Location Pins**: Full CRUD for interactive map markers on `index.html` (City, Left%/Top% coordinates, Badge label, Story popup description).
   - **"Catch Up on Our Latest" Video Section**: Toggle video player card on homepage, set custom heading, subtitle, upload MP4/WebM video or link YouTube/Vimeo, and set thumbnail cover.
   - **Homepage Hero Quote**: Configure homepage banner quote and attribution.
3. **Our Story & Team** (`#panel-people`):
   - Manage Executive Leadership, Core Team, and Research Fellows (`/pages/our-story.html`).
   - Edit full names, roles, team categories, biographical summaries, and photos.
4. **Our Work & Activities** (`#panel-activities`):
   - Manage field projects, workshops, retreats, and research expeditions (`/pages/activities.html`).
   - **Main Hero Event Spotlight**: Includes a dedicated star action (`setActivityAsHero(id)`) to toggle which event appears in the hero banner of the live homepage.
   - Edit custom hero banner quotes and speaker attributions per activity.
5. **Articles & Publications** (`#panel-articles`):
   - Manage articles, case studies, policy briefs, and reports (`/pages/our-analytics.html`).
   - Edit titles, kickers, authors, dates, excerpts, full body content, and cover imagery.
6. **Get Involved Positions** (`#panel-opportunities`):
   - Manage the public position structure on `/pages/get-involved.html` (Blue Card vs Black Card theme, status, categories, role types).
7. **Page Settings & Media** (`#panel-settings`):
   - **Video Section Management**: Toggle video section visibility on `pages/activities.html`, set video documentary title, description, and source (direct URL or MP4/WebM file upload), plus cover thumbnail.
   - **Slideshow Controls**: Enable/disable automated image & general info cycling for the activities hero gallery, and configure rotation speed (seconds).
   - **Our Story Customization**: Configure team section heading and philosophical quotes.

---

## 3. Direct File Uploading System

### 3.1 Client-Side File Upload
- Every CRUD modal dialog (*Activities*, *People*, *Articles*, *Get Involved Positions*) includes a dedicated file upload dropzone (`#modal-image-dropzone`).
- **Capabilities**:
  - Click to browse or Drag & Drop image files (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.svg`).
  - Automatically reads the file using `FileReader.readAsDataURL` and generates a base64 Data URL.
  - Updates the preview container (`#form-image-preview`) in real-time.
  - Displays the uploaded file name in `#upload-filename-badge`.
  - Includes a dedicated **Clear** button (`#btn-clear-form-image`) to reset or remove the image.
  - Supports optional direct URL/path text input (`#form-image-url`) for existing server assets or external URLs.

---

## 4. Universal CRUD Modal System (`#admin-modal-dialog`)
- Universal modal dialog dynamically injected by `openEditModal(collection, id)`.
- Replaces repetitive modal boilerplate with dynamic form schemas for `activities`, `people`, `articles`, and `opportunities`.
- Form submissions validate inputs, format timestamps, and dispatch reactive updates across open browser tabs.

---

## 5. Candidate Application Review Dialog (`#admin-app-detail-dialog`)
- Comprehensive inspector modal displaying full applicant contact information (Name, Email, WhatsApp, City), selected opportunity, time commitment, motivation statement, and portfolio links.
- Form controls to update application status and save internal private notes.
- One-click deletion with confirmation dialog.

---

## 6. System Backup & Utilities (`.admin-tools-bar`)
- **Export Backup (JSON)**: Downloads full snapshot of all active collections as formatted JSON (`caea-database-backup-YYYY-MM-DD.json`).
- **Import JSON**: Validates and restores a previously exported database snapshot into `localStorage`.
- **Reset Seed Data**: Overwrites local modifications and restores the factory seed dataset.
