# CAEA DataStore API & Schema Documentation (`data-store.js`)

This document details the universal reactive DataStore engine, collection schemas, public API methods, and real-time cross-tab synchronization.

---

## 1. Architecture Overview
`data-store.js` implements a resilient, client-side data management engine exposed globally on `window.DataStore`.

### 1.1 Key Features
- **Zero-Dependency**: Pure vanilla JavaScript with no external libraries.
- **Persistent Storage**: Stores collections under dedicated keys in `localStorage`:
  - `caea_activities_data`
  - `caea_people_data`
  - `caea_articles_data`
  - `caea_opportunities_data`
  - `caea_applications_data`
- **Automated Seeding**: If `localStorage` is empty, automatically loads comprehensive factory defaults from `SEED_DATA`.
- **Cross-Tab Reactivity**: Dispatches updates through `BroadcastChannel('caea_datastore_channel')` and custom window events (`caea-datastore-update`), ensuring changes in the admin console immediately reflect on open public pages without manual refresh.

---

## 2. Collection Schemas

### 2.1 `activities` Collection
```typescript
interface Activity {
  id: string;              // e.g. "act-1"
  title: string;           // "Contested Waters: Rivers, Dams & Displacements"
  category: string;        // "RETREAT" | "WORKSHOP" | "COMMUNITY KACHERI" | "EXPOSURE VISIT" | "RESEARCH" | "FIELD PROJECT" | "POLICY" | "CASE STUDY"
  date: string;            // ISO date string "2026-01-23"
  dateFormatted?: string;  // Formatted date "23.01.2026"
  location: string;        // "Tarbela & Indus River Basin, KPK"
  description: string;     // Summary of event and highlights
  image: string;           // Path or base64 Data URL (e.g. "assets/media/events/contested-waters/RAY00190.JPG")
  quote?: string;          // Hero spotlight quote
  quoteAuthor?: string;    // Author/speaker for quote
  featured?: boolean;      // True if spotlighted in homepage hero banner
  createdAt?: string;      // ISO timestamp
}
```

### 2.2 `people` Collection (Team & Fellows)
```typescript
interface Person {
  id: string;              // e.g. "peo-1"
  name: string;            // "Sanaa Muhammad"
  role: string;            // "Research Director"
  category: string;        // "Executive" | "Core Team" | "Fellows"
  bio: string;             // Detailed biographical statement
  image: string;           // Path or base64 Data URL (e.g. "assets/team/sanaa-muhammad.jpg")
  createdAt?: string;      // ISO timestamp
}
```

### 2.3 `articles` Collection
```typescript
interface Article {
  id: string;              // e.g. "art-1"
  title: string;           // "Privatization and the Price of Power in Pakistan"
  subtitle?: string;       // "How Independent Power Producers (IPPs) Shaped Circular Debt"
  kicker: string;          // "REPORT" | "CASE STUDY" | "POLICY BRIEF"
  author: string;          // "Hamna Anwaar & Sanaa Muhammad"
  date: string;            // "2024-02-10"
  dateFormatted?: string;  // "10.02.2024"
  excerpt: string;         // Short synopsis
  content: string;         // Full markdown or text body
  image: string;           // Cover graphic path or Data URL
  createdAt?: string;      // ISO timestamp
}
```

### 2.4 `opportunities` Collection (Get Involved Positions)
```typescript
interface Opportunity {
  id: string;              // e.g. "opp-1"
  title: string;           // "Climate Justice Junior Associate"
  subtitle: string;        // "FULL TIME · APPLICATIONS OPEN"
  category: string;        // "Core Team & Field Research"
  type: string;            // "Full-Time" | "Part-Time" | "Volunteering" | "Internship" | "Event / Gathering"
  theme: 'blue' | 'black'; // Blue card (#4D64D8) or Black card (#000000)
  description: string;     // Job/role overview
  status: 'Open' | 'Upcoming' | 'Closed';
  image?: string;          // Optional graphic banner
  gridArea?: string;       // Layout grid placement ("card1", "card2", etc.)
  createdAt?: string;      // ISO timestamp
}
```

### 2.5 `applications` Collection (Submissions)
```typescript
interface Application {
  id: string;              // e.g. "app-1"
  fullName: string;        // "Ayesha Tariq"
  email: string;           // "ayesha.tariq@gmail.com"
  phone: string;           // "+92 300 1234567"
  city: string;            // "Karachi, Sindh"
  opportunityId?: string;  // "opp-1"
  opportunityTitle: string;// "Climate Justice Junior Associate"
  category: string;        // "Core Team & Field Research"
  commitment: string;      // "Full-Time" | "Part-Time" | "Internship" | "Volunteering / Flexible"
  message: string;         // Statement of motivation
  experience?: string;     // Background or portfolio link
  status: 'Pending' | 'Under Review' | 'Shortlisted' | 'Accepted' | 'Archived';
  date: string;            // Submission date "2024-09-18"
  dateFormatted?: string;  // "18.09.2024"
  notes?: string;          // Private internal administrative notes
  createdAt: string;       // ISO timestamp
}
```

### 2.6 `mapPins` Collection (Pakistan Map Locations)
```typescript
interface MapPin {
  id: string;              // e.g. "pin-hunza"
  city: string;            // "HUNZA", "JALALPUR", "MANCHHAR", "THAR", "BALOCHISTAN"
  left: string;            // CSS position percentage e.g. "53%"
  top: string;             // CSS position percentage e.g. "19%"
  badge: string;           // Popup header badge label e.g. "HUNZA"
  description: string;     // Narrative background and community story
}
```

### 2.7 `pageSettings` Structure (`caea_page_settings`)
```typescript
interface PageSettings {
  home: {
    heroQuote: string;           // Homepage banner quote
    heroQuoteAuthor: string;     // Quote attribution
    showLatestSection: boolean;  // Toggle latest section visibility
    latestTitle: string;         // "BE A PART OF OUR LATEST"
    latestSubtitle: string;      // Subtitle / overview
    showLatestVideo: boolean;    // Toggle video preview card
    latestVideoTitle: string;    // "Community Kacheri & Field Briefing"
    latestVideoDescription: string; // Summary of video
    latestVideoUrl: string;      // Video URL or uploaded Data URI / MP4
    latestVideoThumbnail: string;// Video thumbnail cover image
  };
  activities: {
    showVideo: boolean;          // Toggle documentary section on activities page
    videoTitle: string;          // "More than a retreat (CAEA Community Documentary)"
    videoDescription: string;    // Caption / overview
    videoUrl: string;            // Direct video link or uploaded Data URI / MP4
    videoThumbnail: string;      // Cover image path or Data URL
    autoplayImages: boolean;     // Enable auto-cycling hero slideshow
    imageCycleInterval: number;  // Interval in milliseconds (e.g. 5000)
  };
  ourStory: {
    teamHeaderTitle: string;     // Heading text for team section
    quoteText: string;           // Featured quote
    quoteAuthor: string;         // Attribution
  };
}
```

---

## 3. Public DataStore API Methods

| Method | Parameters | Returns | Description |
| :--- | :--- | :--- | :--- |
| `DataStore.get(collection)` | `collection: string` | `Array<Object>` | Retrieves all items in the specified collection. |
| `DataStore.getById(collection, id)` | `collection: string, id: string` | `Object \| null` | Finds a record by unique ID. |
| `DataStore.add(collection, itemData)` | `collection: string, itemData: Object` | `Object` | Creates and persists a new item, and background-syncs to PHP REST API. |
| `DataStore.update(collection, id, updates)`| `collection: string, id: string, updates: Object` | `Object \| null` | Merges updates into an existing item and syncs with PHP SQLite database. |
| `DataStore.delete(collection, id)` | `collection: string, id: string` | `boolean` | Permanently deletes a record locally and on the PHP server. |
| `DataStore.getPageSettings(page?)` | `page?: string` | `Object` | Retrieves page-level configuration (e.g. `'activities'`, `'home'`). |
| `DataStore.savePageSettings(page, settings)` | `page: string, settings: Object` | `Object` | Updates and persists page settings to local cache and PHP database. |
| `DataStore.uploadMedia(file, metadata)` | `file: File, metadata?: Object` | `Promise<Object>` | Uploads image or video file directly to PHP server `/uploads/` directory. |
| `DataStore.syncWithServer()` | *None* | `Promise<boolean>` | Pulls latest database snapshot from PHP `/api/api.php` into local cache. |
| `DataStore.login(passcode, passhash)` | `passcode: string, passhash?: string` | `Promise<Object>` | Authenticates with PHP session backend via `/api/auth.php`. |
| `DataStore.logout()` | *None* | `Promise<Object>` | Destroys PHP session via `/api/auth.php`. |
| `DataStore.checkAuth()` | *None* | `Promise<Object>` | Verifies active PHP admin session status. |
| `DataStore.reset()` | *None* | `void` | Resets all collections in `localStorage` and SQLite database to factory defaults. |
| `DataStore.exportJSON()` | *None* | `string` | Serializes the complete database snapshot into a JSON string. |
| `DataStore.importJSON(jsonString)` | `jsonString: string` | `boolean` | Validates and restores a JSON database backup locally and on server. |
| `DataStore.dispatchUpdate(collection)` | `collection?: string` | `void` | Triggers reactive events to sync open browser tabs. |
