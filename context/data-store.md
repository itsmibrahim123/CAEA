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
  image: string;           // Path or base64 Data URL (e.g. "Assets/media/events/contested-waters/RAY00190.JPG")
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
  image: string;           // Path or base64 Data URL (e.g. "Assets/Team/sanaa-muhammad.jpg")
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

---

## 3. Public DataStore API Methods

| Method | Parameters | Returns | Description |
| :--- | :--- | :--- | :--- |
| `DataStore.get(collection)` | `collection: string` | `Array<Object>` | Retrieves all items in the specified collection. |
| `DataStore.getById(collection, id)` | `collection: string, id: string` | `Object \| null` | Finds a record by unique ID. |
| `DataStore.add(collection, itemData)` | `collection: string, itemData: Object` | `Object` | Creates and persists a new item with an auto-generated unique ID and timestamps. |
| `DataStore.update(collection, id, updates)`| `collection: string, id: string, updates: Object` | `Object \| null` | Merges updates into an existing item and persists changes. |
| `DataStore.delete(collection, id)` | `collection: string, id: string` | `boolean` | Permanently deletes a record by ID. |
| `DataStore.reset()` | *None* | `void` | Resets all collections in `localStorage` back to factory seed defaults. |
| `DataStore.exportJSON()` | *None* | `string` | Serializes the complete database snapshot into a JSON string. |
| `DataStore.importJSON(jsonString)` | `jsonString: string` | `boolean` | Validates and restores a JSON database backup. |
| `DataStore.dispatchUpdate(collection)` | `collection?: string` | `void` | Triggers reactive events to sync open browser tabs. |
