# CAEA Media Assets Inventory & Guidelines (`assets/`)

This document catalogs the reorganized media repository, image paths, aspect ratio guidelines, and standardized directory conventions across the CAEA codebase.

---

## 1. Directory Structure

```
assets/
├── CAEA-Navbar-Logo.png               # Official brand logo (Header & Footers)
├── Hero-image.png                     # Default uncropped hero background
├── how-water-became-power.jpg         # Article cover graphic 1
├── how-water-became-power-ai.jpg      # Article cover graphic 2
├── Home_Catch_up.png                  # Community catch-up section banner
├── Pak-map.png                        # Pakistan territory map graphic
├── Map-leaf.png                       # Environmental leaf icon
├── Navbar-link.png                    # Navbar decorative asset
│
├── Team/                              # Standardized Team Photography
│   ├── sanaa-muhammad.jpg             # Sanaa Muhammad (Research Director)
│   ├── hamna-anwaar.jpg               # Hamna Anwaar (Policy Lead)
│   ├── asad-juttah.jpg                # Asad Juttah (Field Operations Lead)
│   ├── muaaz-khan.jpg                 # Muaaz Khan (Energy Analyst)
│   ├── hina-yousaf.jpg                # Hina Yousaf (Community Organizer)
│   ├── muhammad-saeed.jpg             # Muhammad Saeed (Environmental Researcher)
│   ├── nabeel-ahmad.jpg               # Nabeel Ahmad (Advocacy Specialist)
│   ├── kamran-aziz.jpg                # Kamran Aziz (Research Fellow)
│   └── grid-1-1-hamna.png ...         # Legacy grid icon assets
│
├── Allies/                            # Partner Organization Graphics
│   ├── Aleternative-Law-Collective.png # Alternative Law Collective (ALC)
│   ├── Alliance-for-climate-justice-&-Clean-Energy.PNG # ACJCE
│   ├── Climate-Action-Center.png      # Climate Action Center (CAC)
│   ├── PRIED.JPG                      # Policy Research Institute for Equitable Development (PRIED)
│   └── Verrha-Research.png            # Verrha Research
│
└── media/events/                      # Categorized Event Photography
    ├── contested-waters/              # Contested Waters: Rivers, Dams & Displacements
    │   ├── RAY00059.JPG
    │   ├── RAY00118.JPG
    │   ├── RAY00190.JPG
    │   └── RAY00212.JPG
    │
    ├── exposure-visit/                # Community Exposure Visits
    │   ├── WhatsApp Image 2026-08-27 at 12.16.56 PM.jpeg
    │   ├── WhatsApp Image 2026-08-27 at 12.16.57 PM (1).jpeg
    │   ├── WhatsApp Image 2026-08-27 at 12.16.58 PM (2).jpeg
    │   └── WhatsApp Image 2026-08-27 at 12.16.59 PM.jpeg
    │
    ├── manchar/                       # Lake Manchhar Aquatic Livelihoods
    │   ├── WhatsApp Image 2026-08-27 at 12.08.18 PM (1).jpeg
    │   ├── WhatsApp Image 2026-08-27 at 12.08.18 PM (2).jpeg
    │   └── WhatsApp Image 2026-08-27 at 12.08.28 PM.jpeg
    │
    └── retreat/                       # Strategic Planning & Movement Retreat
        ├── DSCF3966.JPG
        ├── DSCF4154.JPG
        └── DSCF4156.JPG
```

---

## 2. Image Path Resolution Strategy

To support deployment across root domains (`/`), subdirectory paths (`/CAEA/`), and the administrative console (`/admin/`), all image tags use resilient path resolution:

- **Public Frontend (`script.js`)**:
  ```javascript
  function resolveImagePath(img) {
    if (!img) return '/assets/Hero-image.png';
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:') || img.startsWith('/')) return img;
    if (img.startsWith('../assets/')) return img.replace('../assets/', '/assets/');
    if (img.startsWith('assets/')) return '/' + img;
    return '/' + img;
  }
  ```

- **Admin Console (`admin/admin.js`)**:
  ```javascript
  function resolveAdminImg(path, fallback = 'assets/CAEA-Navbar-Logo.png') {
    if (!path) return '../' + fallback;
    if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
      return path;
    }
    if (path.startsWith('../')) return path;
    if (path.startsWith('/')) return '..' + path;
    return '../' + path;
  }
  ```

- **Fallback Safeguards**: All rendered `<img>` elements feature `onerror="this.src='...Fallback.png'"` to prevent broken image icons if a local asset is renamed or missing.
