/**
 * CAEA DataStore Module
 * Handles persistent client-side storage & CRUD operations for Activities, People, and Articles.
 */

const STORAGE_KEYS = {
  ACTIVITIES: 'caea_activities_data',
  PEOPLE: 'caea_people_data',
  ARTICLES: 'caea_articles_data',
  OPPORTUNITIES: 'caea_opportunities_data',
  APPLICATIONS: 'caea_applications_data',
  MEDIA: 'caea_media_data'
};

// Seed default data
const SEED_DATA = {
  activities: [
    {
      id: 'act-1',
      title: 'Contested Waters: Rivers, Power and Resistance',
      category: 'WORKSHOP',
      date: '2026-01-23',
      dateFormatted: '23.01.2026',
      location: 'Pakistan',
      description: 'Examines how colonial and modern systems of water control through dams, barrages, and canals have transformed river ecosystems, displaced communities, and disrupted cultural relationships with water.',
      image: 'Assets/media/events/contested-waters/RAY00190.JPG',
      featured: true,
      quote: '“Those least responsible for climate change are worst affected by it”',
      quoteAuthor: 'Waseem Ul Haq'
    },
    {
      id: 'act-2',
      title: 'Climate Justice Gathering & Retreat',
      category: 'RETREAT',
      date: '2026-04-23',
      dateFormatted: '23.04.2026',
      location: 'Pakistan',
      description: 'A 3-day retreat for climate activists and community organizers across Pakistan to reflect, reconnect with nature, and discuss energy, climate stories, burnout, and movement building.',
      image: 'Assets/media/events/retreat/DSCF4154.JPG',
      featured: false,
      quote: '“Reconnecting with land and community to build resilience against climate burnout”',
      quoteAuthor: 'CAEA Movement Gathering'
    },
    {
      id: 'act-3',
      title: 'Kacheri: Manchar Sunvai',
      category: 'COMMUNITY KACHERI',
      date: '2026-05-20',
      dateFormatted: '20.05.2026',
      location: 'Lake Manchhar, Sindh',
      description: 'Discussion on the ecological destruction of Lake Manchhar, changes in water flow, infrastructure development, agricultural wastewater, and community-led resistance.',
      image: 'Assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.18 PM.jpeg',
      featured: false,
      quote: '“Manchhar is a mindful lake, yet it bears the heaviest burden of industrial discharge”',
      quoteAuthor: 'Lake Manchhar Fisherman Community'
    },
    {
      id: 'act-4',
      title: 'Exposure Visit to Tarbela Dam',
      category: 'EXPOSURE VISIT',
      date: '2026-07-28',
      dateFormatted: '28.07.2026',
      location: 'Tarbela Dam',
      description: 'Brought together perspectives from WAPDA and displaced communities to examine Tarbela\'s promises of power vs. its costs on land, livelihoods, culture, and ecosystems.',
      image: 'Assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.56 PM.jpeg',
      featured: false,
      quote: '“Uncovering the true human and ecological costs behind megastructures of power”',
      quoteAuthor: 'Tarbela Exposure Delegation'
    }
  ],

  people: [
    {
      id: 'ppl-1',
      name: 'Sanaa’i Muhammad',
      role: 'Founder & Chief Executive Officer',
      category: 'Executive',
      bio: 'Leads advocacy and movement-building at the intersection of energy transition and climate justice in Pakistan. Work focuses on phasing out fossil gas in power, industry, and households; advancing renewable energy; and examining how colonial infrastructure shapes today\'s crises.',
      image: 'Assets/Team/sanaa-muhammad.jpg'
    },
    {
      id: 'ppl-2',
      name: 'Kamran Aziz',
      role: 'Director Research',
      category: 'Core Team',
      bio: 'Focuses on electricity systems, historical analysis of fuel extraction, and energy policy.',
      image: 'Assets/Team/kamran-aziz.jpg'
    },
    {
      id: 'ppl-3',
      name: 'Asad Juttah',
      role: 'Legal & Policy Lead',
      category: 'Core Team',
      bio: 'Law graduate focused on indigenous stewardship, environmental laws, and community rights.',
      image: 'Assets/Team/asad-juttah.jpg'
    },
    {
      id: 'ppl-4',
      name: 'Hamna Anwaar',
      role: 'Policy & Engineering Associate',
      category: 'Core Team',
      bio: 'Bachelor\'s in engineering, specializing in sustainability, global fast-fashion impacts, and energy research.',
      image: 'Assets/Team/hamna-anwaar.jpg'
    },
    {
      id: 'ppl-5',
      name: 'Guramanis',
      role: 'Research Fellow / PhD Scholar',
      category: 'Fellows',
      bio: 'PhD scholar researching river politics, nationalism, and water governance.',
      image: 'Assets/Team/hina-yousaf.jpg'
    },
    {
      id: 'ppl-6',
      name: 'Muaaz Ahmad Khan',
      role: 'Media & Network Lead',
      category: 'Core Team',
      bio: 'Translates complex policy and research into clear, accessible media content and public campaigns.',
      image: 'Assets/Team/muaaz-khan.jpg'
    },
    {
      id: 'ppl-7',
      name: 'Fizza Aman Bhutto',
      role: 'Research & Advocacy Associate',
      category: 'Core Team',
      bio: 'Focuses on LNG dynamics, indigenous rights, and fossil phaseout.',
      image: 'Assets/Team/grid-1-3-fiza.png'
    },
    {
      id: 'ppl-8',
      name: 'Abid Azeem',
      role: 'Finance & Operations Lead / CPA',
      category: 'Core Team',
      bio: 'Certified Public Accountant overseeing budgeting, cash-flow, and results-oriented financial planning.',
      image: 'Assets/Team/nabeel-ahmad.jpg'
    }
  ],

  articles: [
    {
      id: 'art-1',
      title: 'All Good Things Are Wild And Free',
      subtitle: 'Understanding the Climate Transition Imperative in Pakistan',
      kicker: 'ESTABLISHED 2020',
      author: 'CAEA Policy Research Team',
      date: '2024-04-10',
      dateFormatted: '10.04.2024',
      excerpt: 'Climate Action & Energy Access (CAEA) is a Pakistan-based research and advocacy institute committed to advancing a just, people-centered energy transition.',
      content: 'We work at the intersection of climate justice, energy governance, and public accountability, focusing on how entrenched fossil-fuel interests, inequitable subsidies, and distorted gas and power policies undermine the rights, wellbeing, and economic futures of ordinary people.',
      image: 'Assets/how-water-became-power.jpg'
    },
    {
      id: 'art-2',
      title: 'How Water Became Power',
      subtitle: 'The Political Economy of Freshwater Resources in Sindh',
      kicker: 'CASE STUDY',
      author: 'Waseem Ul Haq',
      date: '2024-03-15',
      dateFormatted: '15.03.2024',
      excerpt: 'An investigation into how large development projects have impacted aquatic ecosystems and fishing livelihoods around Lake Manchhar.',
      content: 'Lake Manchhar is located in Sindh between the Dadu and Khanpur districts. Manchhar comes from the Sindhi words Man meaning mind and Chhar meaning lake or pond. Manchhar translates to "mindful lake". It is the largest natural freshwater lake in Asia.',
      image: 'Assets/how-water-became-power-ai.jpg'
    }
  ],

  opportunities: [
    {
      id: 'opp-1',
      title: 'Climate Justice Junior Associate',
      subtitle: 'FULL TIME · APPLICATIONS OPEN',
      category: 'Core Team & Field Research',
      type: 'Full-Time',
      theme: 'blue',
      description: 'We are looking for someone to work directly with communities on climate and energy issues through field visits, research, and helping people\'s voices reach the right places.',
      status: 'Open',
      image: '',
      gridArea: 'card1'
    },
    {
      id: 'opp-2',
      title: 'KACHERI: Registration Open',
      subtitle: 'UPCOMING',
      category: 'Community Gathering',
      type: 'Event / Gathering',
      theme: 'black',
      description: 'A space for communities to talk openly about the climate justice and energy issues affecting them. Come listen, share, or just be part of the conversation.',
      status: 'Open',
      image: '',
      gridArea: 'card2'
    },
    {
      id: 'opp-3',
      title: 'Volunteer With Us',
      subtitle: 'UPCOMING',
      category: 'Community Outreach & Events',
      type: 'Volunteering',
      theme: 'black',
      description: 'Are you interested in working with CAEA as a volunteer? Help us with events, outreach, and field work on the ground. No experience needed, just time and interest.',
      status: 'Open',
      image: '',
      gridArea: 'card3'
    },
    {
      id: 'opp-4',
      title: 'Intern With Us',
      subtitle: 'UPCOMING',
      category: 'Fellowship & Research',
      type: 'Internship',
      theme: 'blue',
      description: 'We\'re looking for passionate, curious interns looking to be a part of the climate justice movement in Pakistan. Whether your strengths lie in research, storytelling, design, communications, advocacy, or community engagement, there\'s space for you here.',
      status: 'Open',
      image: 'Assets/how-water-became-power.jpg',
      gridArea: 'card4'
    }
  ],

  applications: [
    {
      id: 'app-1',
      fullName: 'Ayesha Tariq',
      email: 'ayesha.tariq@gmail.com',
      phone: '+92 300 1234567',
      city: 'Karachi, Sindh',
      opportunityId: 'opp-1',
      opportunityTitle: 'Climate Justice Junior Associate',
      category: 'Core Team & Field Research',
      commitment: 'Full-Time',
      message: 'Passionate about environmental law and grassroots climate resilience in delta communities. I have led youth climate campaigns and want to contribute full-time to CAEA community research and policy work.',
      experience: 'BS Environmental Sciences from LUMS; 2 years experience organizing grassroot climate awareness workshops in Sindh.',
      status: 'Under Review',
      date: '2024-09-18',
      dateFormatted: '18.09.2024',
      createdAt: '2024-09-18T10:30:00.000Z',
      notes: 'Strong academic profile and fieldwork experience. Schedule first interview round.'
    },
    {
      id: 'app-2',
      fullName: 'Bilal Khan',
      email: 'bilal.khan@gmail.com',
      phone: '+92 333 9876543',
      city: 'Gilgit, Gilgit-Baltistan',
      opportunityId: 'opp-2',
      opportunityTitle: 'KACHERI: Registration Open',
      category: 'Community Gathering',
      commitment: 'Flexible / Event-based',
      message: 'Would love to participate in the upcoming Kacheri discussion session to share insights on mountain community solar microgrids and equitable winter power distribution.',
      experience: 'Local community representative with 3+ years in renewable energy grassroots advocacy.',
      status: 'Shortlisted',
      date: '2024-09-20',
      dateFormatted: '20.09.2024',
      createdAt: '2024-09-20T14:15:00.000Z',
      notes: 'Invited as community panel speaker for northern region dialogue.'
    },
    {
      id: 'app-3',
      fullName: 'Zainab Fatima',
      email: 'zainab.fatima@gmail.com',
      phone: '+92 321 4567890',
      city: 'Lahore, Punjab',
      opportunityId: 'opp-4',
      opportunityTitle: 'Intern With Us',
      category: 'Fellowship & Research',
      commitment: 'Part-Time',
      message: 'Interested in policy analysis on clean energy transition subsidies and public finance accountability in Pakistan.',
      experience: 'Final year Economics & Public Policy student at IBA; published articles on industrial energy transition.',
      status: 'Pending',
      date: '2024-09-21',
      dateFormatted: '21.09.2024',
      createdAt: '2024-09-21T09:00:00.000Z',
      notes: 'Under initial review by Policy Research team.'
    }
  ],

  media: [
    {
      id: 'med-1',
      title: 'Contested Waters Session 1',
      category: 'Events',
      path: 'Assets/media/events/contested-waters/RAY00190.JPG',
      tags: ['workshop', 'rivers', 'contested-waters'],
      date: '2026-01-23'
    },
    {
      id: 'med-2',
      title: 'Contested Waters Session 2',
      category: 'Events',
      path: 'Assets/media/events/contested-waters/RAY00118.JPG',
      tags: ['workshop', 'rivers', 'contested-waters'],
      date: '2026-01-23'
    },
    {
      id: 'med-3',
      title: 'Contested Waters Session 3',
      category: 'Events',
      path: 'Assets/media/events/contested-waters/RAY00059.JPG',
      tags: ['workshop', 'rivers', 'contested-waters'],
      date: '2026-01-23'
    },
    {
      id: 'med-4',
      title: 'Contested Waters Session 4',
      category: 'Events',
      path: 'Assets/media/events/contested-waters/RAY00212.JPG',
      tags: ['workshop', 'rivers', 'contested-waters'],
      date: '2026-01-23'
    },
    {
      id: 'med-5',
      title: 'Climate Justice Retreat 1',
      category: 'Events',
      path: 'Assets/media/events/retreat/DSCF4154.JPG',
      tags: ['retreat', 'climate-justice', 'gathering'],
      date: '2026-04-23'
    },
    {
      id: 'med-6',
      title: 'Climate Justice Retreat 2',
      category: 'Events',
      path: 'Assets/media/events/retreat/DSCF4356.JPG',
      tags: ['retreat', 'climate-justice', 'gathering'],
      date: '2026-04-23'
    },
    {
      id: 'med-7',
      title: 'Climate Justice Retreat 3',
      category: 'Events',
      path: 'Assets/media/events/retreat/DSCF3966.JPG',
      tags: ['retreat', 'climate-justice', 'gathering'],
      date: '2026-04-23'
    },
    {
      id: 'med-8',
      title: 'Climate Justice Retreat 4',
      category: 'Events',
      path: 'Assets/media/events/retreat/DSCF4512.JPG',
      tags: ['retreat', 'climate-justice', 'gathering'],
      date: '2026-04-23'
    },
    {
      id: 'med-9',
      title: 'Manchar Sunvai Kacheri 1',
      category: 'Events',
      path: 'Assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.18 PM.jpeg',
      tags: ['kacheri', 'manchar', 'community'],
      date: '2026-05-20'
    },
    {
      id: 'med-10',
      title: 'Manchar Sunvai Kacheri 2',
      category: 'Events',
      path: 'Assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.18 PM (1).jpeg',
      tags: ['kacheri', 'manchar', 'community'],
      date: '2026-05-20'
    },
    {
      id: 'med-11',
      title: 'Manchar Sunvai Kacheri 3',
      category: 'Events',
      path: 'Assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.28 PM.jpeg',
      tags: ['kacheri', 'manchar', 'community'],
      date: '2026-05-20'
    },
    {
      id: 'med-12',
      title: 'Manchar Sunvai Kacheri 4',
      category: 'Events',
      path: 'Assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.18 PM (2).jpeg',
      tags: ['kacheri', 'manchar', 'community'],
      date: '2026-05-20'
    },
    {
      id: 'med-13',
      title: 'Tarbela Dam Exposure Visit 1',
      category: 'Events',
      path: 'Assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.56 PM.jpeg',
      tags: ['tarbela', 'exposure-visit', 'dam'],
      date: '2026-07-28'
    },
    {
      id: 'med-14',
      title: 'Tarbela Dam Exposure Visit 2',
      category: 'Events',
      path: 'Assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.57 PM (1).jpeg',
      tags: ['tarbela', 'exposure-visit', 'dam'],
      date: '2026-07-28'
    },
    {
      id: 'med-15',
      title: 'Tarbela Dam Exposure Visit 3',
      category: 'Events',
      path: 'Assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.58 PM (2).jpeg',
      tags: ['tarbela', 'exposure-visit', 'dam'],
      date: '2026-07-28'
    },
    {
      id: 'med-16',
      title: 'Tarbela Dam Exposure Visit 4',
      category: 'Events',
      path: 'Assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.59 PM.jpeg',
      tags: ['tarbela', 'exposure-visit', 'dam'],
      date: '2026-07-28'
    },
    {
      id: 'med-17',
      title: 'Sanaa’i Muhammad (CEO)',
      category: 'Team',
      path: 'Assets/Team/sanaa-muhammad.jpg',
      tags: ['team', 'leadership', 'executive'],
      date: '2024-01-01'
    },
    {
      id: 'med-18',
      title: 'Kamran Aziz',
      category: 'Team',
      path: 'Assets/Team/kamran-aziz.jpg',
      tags: ['team', 'operations', 'lead'],
      date: '2024-01-01'
    },
    {
      id: 'med-19',
      title: 'Asad Juttah',
      category: 'Team',
      path: 'Assets/Team/asad-juttah.jpg',
      tags: ['team', 'research'],
      date: '2024-01-01'
    },
    {
      id: 'med-20',
      title: 'Hamna Anwaar',
      category: 'Team',
      path: 'Assets/Team/hamna-anwaar.jpg',
      tags: ['team', 'communications'],
      date: '2024-01-01'
    },
    {
      id: 'med-21',
      title: 'Hina Yousaf',
      category: 'Team',
      path: 'Assets/Team/hina-yousaf.jpg',
      tags: ['team', 'community'],
      date: '2024-01-01'
    },
    {
      id: 'med-22',
      title: 'Muaaz Ahmad Khan',
      category: 'Team',
      path: 'Assets/Team/muaaz-khan.jpg',
      tags: ['team', 'policy'],
      date: '2024-01-01'
    },
    {
      id: 'med-23',
      title: 'Nabeel Ahmad',
      category: 'Team',
      path: 'Assets/Team/nabeel-ahmad.jpg',
      tags: ['team', 'operations'],
      date: '2024-01-01'
    },
    {
      id: 'med-24',
      title: 'Muhammad Saeed',
      category: 'Team',
      path: 'Assets/Team/muhammad-saeed.jpg',
      tags: ['team', 'field'],
      date: '2024-01-01'
    },
    {
      id: 'med-25',
      title: 'Homepage Hero Banner Visual',
      category: 'Graphics',
      path: 'Assets/Hero-image.png',
      tags: ['hero', 'graphics', 'banner'],
      date: '2024-01-01'
    },
    {
      id: 'med-26',
      title: 'Pakistan Project Map',
      category: 'Graphics',
      path: 'Assets/Pak-map.png',
      tags: ['map', 'pakistan', 'projects'],
      date: '2024-01-01'
    },
    {
      id: 'med-27',
      title: 'How Water Became Power - Cover',
      category: 'Articles',
      path: 'Assets/how-water-became-power.jpg',
      tags: ['article', 'publication', 'water'],
      date: '2024-01-01'
    },
    {
      id: 'med-28',
      title: 'CAEA Navbar Logo',
      category: 'Graphics',
      path: 'Assets/CAEA-Navbar-Logo.png',
      tags: ['logo', 'brand', 'navigation'],
      date: '2024-01-01'
    }
  ]
};

class CAEADataStore {
  constructor() {
    this.init();
  }

  init() {
    const DATA_VERSION_KEY = 'caea_data_version';
    const CURRENT_VERSION = 'v4_media_library';
    const storedVersion = localStorage.getItem(DATA_VERSION_KEY);

    if (storedVersion !== CURRENT_VERSION) {
      // Refresh seed activities, people, and media to the new real dataset
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(SEED_DATA.activities));
      localStorage.setItem(STORAGE_KEYS.PEOPLE, JSON.stringify(SEED_DATA.people));
      localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(SEED_DATA.media));
      if (!localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES)) {
        localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(SEED_DATA.opportunities));
      }
      if (!localStorage.getItem(STORAGE_KEYS.ARTICLES)) {
        localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(SEED_DATA.articles));
      }
      if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(SEED_DATA.applications));
      }
      localStorage.setItem(DATA_VERSION_KEY, CURRENT_VERSION);
    } else {
      if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
        localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(SEED_DATA.activities));
      }
      if (!localStorage.getItem(STORAGE_KEYS.PEOPLE)) {
        localStorage.setItem(STORAGE_KEYS.PEOPLE, JSON.stringify(SEED_DATA.people));
      }
      if (!localStorage.getItem(STORAGE_KEYS.ARTICLES)) {
        localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(SEED_DATA.articles));
      }
      if (!localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES)) {
        localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(SEED_DATA.opportunities));
      }
      if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(SEED_DATA.applications));
      }
      if (!localStorage.getItem(STORAGE_KEYS.MEDIA)) {
        localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(SEED_DATA.media));
      }
    }
  }

  getKey(collection) {
    switch (collection.toLowerCase()) {
      case 'activities': return STORAGE_KEYS.ACTIVITIES;
      case 'people': return STORAGE_KEYS.PEOPLE;
      case 'articles': return STORAGE_KEYS.ARTICLES;
      case 'opportunities':
      case 'get-involved':
      case 'positions': return STORAGE_KEYS.OPPORTUNITIES;
      case 'applications':
      case 'applied':
      case 'applied_fields':
      case 'submissions': return STORAGE_KEYS.APPLICATIONS;
      case 'media':
      case 'assets':
      case 'images': return STORAGE_KEYS.MEDIA;
      default: throw new Error(`Unknown collection: ${collection}`);
    }
  }

  get(collection) {
    const key = this.getKey(collection);
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error(`Error reading ${collection} from DataStore:`, e);
      return [];
    }
  }

  getById(collection, id) {
    const items = this.get(collection);
    return items.find(item => item.id === id) || null;
  }

  add(collection, item) {
    const items = this.get(collection);
    const prefix = collection.toLowerCase().startsWith('app') ? 'app' :
                   collection.toLowerCase().startsWith('opp') ? 'opp' :
                   collection.toLowerCase().startsWith('med') ? 'med' :
                   collection.substring(0, 3);
    const newItem = {
      id: `${prefix}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...item
    };

    // Format date if provided
    if (newItem.date && !newItem.dateFormatted) {
      const d = new Date(newItem.date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      newItem.dateFormatted = `${day}.${month}.${year}`;
    } else if (!newItem.date && !newItem.dateFormatted) {
      const d = new Date();
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      newItem.date = d.toISOString().split('T')[0];
      newItem.dateFormatted = `${day}.${month}.${year}`;
    }

    items.unshift(newItem);
    localStorage.setItem(this.getKey(collection), JSON.stringify(items));
    this.dispatchUpdate(collection);
    return newItem;
  }

  update(collection, id, updatedFields) {
    const items = this.get(collection);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;

    const item = items[index];
    const updatedItem = {
      ...item,
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };

    if (updatedFields.date) {
      const d = new Date(updatedFields.date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      updatedItem.dateFormatted = `${day}.${month}.${year}`;
    }

    items[index] = updatedItem;
    localStorage.setItem(this.getKey(collection), JSON.stringify(items));
    this.dispatchUpdate(collection);
    return updatedItem;
  }

  delete(collection, id) {
    let items = this.get(collection);
    const initialLen = items.length;
    items = items.filter(item => item.id !== id);
    if (items.length !== initialLen) {
      localStorage.setItem(this.getKey(collection), JSON.stringify(items));
      this.dispatchUpdate(collection);
      return true;
    }
    return false;
  }

  reset() {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(SEED_DATA.activities));
    localStorage.setItem(STORAGE_KEYS.PEOPLE, JSON.stringify(SEED_DATA.people));
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(SEED_DATA.articles));
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(SEED_DATA.opportunities));
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(SEED_DATA.applications));
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(SEED_DATA.media));
    this.dispatchUpdate('all');
  }

  exportJSON() {
    return JSON.stringify({
      activities: this.get('activities'),
      people: this.get('people'),
      articles: this.get('articles'),
      opportunities: this.get('opportunities'),
      applications: this.get('applications'),
      media: this.get('media'),
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.activities && Array.isArray(data.activities)) {
        localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(data.activities));
      }
      if (data.people && Array.isArray(data.people)) {
        localStorage.setItem(STORAGE_KEYS.PEOPLE, JSON.stringify(data.people));
      }
      if (data.articles && Array.isArray(data.articles)) {
        localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(data.articles));
      }
      if (data.opportunities && Array.isArray(data.opportunities)) {
        localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(data.opportunities));
      }
      if (data.applications && Array.isArray(data.applications)) {
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(data.applications));
      }
      if (data.media && Array.isArray(data.media)) {
        localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(data.media));
      }
      this.dispatchUpdate('all');
      return true;
    } catch (e) {
      console.error('Failed to import JSON data:', e);
      return false;
    }
  }

  dispatchUpdate(collection) {
    window.dispatchEvent(new CustomEvent('caea-datastore-update', {
      detail: { collection }
    }));
  }
}

// Export single instance globally
window.DataStore = new CAEADataStore();
