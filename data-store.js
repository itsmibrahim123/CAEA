/**
 * CAEA DataStore Module
 * Handles persistent client-side storage & CRUD operations for Activities, People, and Articles.
 */

const STORAGE_KEYS = {
  ACTIVITIES: 'caea_activities_data',
  PEOPLE: 'caea_people_data',
  ARTICLES: 'caea_articles_data'
};

// Seed default data
const SEED_DATA = {
  activities: [
    {
      id: 'act-1',
      title: 'Climate Justice Gathering & Retreat',
      category: 'RETREAT',
      date: '2024-05-01',
      dateFormatted: '01.05.2024',
      location: 'Lake Manchhar, Sindh',
      description: 'The lake has been impacted by the reservoir\'s Lake Manchhar. The discussion focused on the ecological destruction of the lake, severe loss from large development projects have affected the aquatic culture and livelihoods connected to it.',
      image: 'Assets/Hero-image.png'
    },
    {
      id: 'act-2',
      title: 'Contested Waters',
      category: 'WORKSHOP',
      date: '2024-05-01',
      dateFormatted: '01.05.2024',
      location: 'Dadu & Khanpur',
      description: 'In-depth community discussion on water rights, river systems, and environmental preservation around the freshwater fishing communities of Manchhar.',
      image: 'Assets/how-water-became-power.jpg'
    },
    {
      id: 'act-3',
      title: 'Working towards clean energy transition',
      category: 'RESEARCH',
      date: '2024-09-21',
      dateFormatted: '21.09.2024',
      location: 'Gilgit-Baltistan',
      description: 'Evaluating off-grid solar microgrids and equitable renewable energy policies for mountain communities.',
      image: 'Assets/Hero-image.png'
    },
    {
      id: 'act-4',
      title: 'Working towards clean energy transition',
      category: 'RETREAT',
      date: '2025-05-01',
      dateFormatted: '01.05.2025',
      location: 'Thar Desert',
      description: 'Community-led study on clean drinking water access and distributed solar power in desert settlements.',
      image: 'Assets/how-water-became-power-ai.jpg'
    },
    {
      id: 'act-5',
      title: 'Climate Justice Gathering & Retreat',
      category: 'RETREAT',
      date: '2025-05-01',
      dateFormatted: '01.05.2025',
      location: 'Hunza & Nagar',
      description: 'Bringing together youth leaders, researchers, and local representatives to advocate for equitable climate finance.',
      image: 'Assets/Hero-image.png'
    }
  ],

  people: [
    {
      id: 'ppl-1',
      name: 'Sanaa’i Muhammad',
      role: 'Founder & Chief Executive Officer',
      category: 'Executive',
      bio: 'Sanaa’i Muhammad is the Founder and CEO of the Climate Action & Energy Access Institute (CAEA), leading advocacy and movement-building at the intersection of energy transition and climate justice in Pakistan.',
      image: 'Assets/Team/grid-1-2-Sanaa.png'
    },
    {
      id: 'ppl-2',
      name: 'Hamna Amir',
      role: 'Head of Policy Research',
      category: 'Core Team',
      bio: 'Specializing in energy economics, public subsidies, and fossil fuel transition accountability.',
      image: 'Assets/Team/grid-1-1-hamna.png'
    },
    {
      id: 'ppl-3',
      name: 'Fiza Batool',
      role: 'Climate Justice Lead',
      category: 'Core Team',
      bio: 'Focusing on community engagement, indigenist ecology, and freshwater protection advocacy.',
      image: 'Assets/Team/grid-1-3-fiza.png'
    },
    {
      id: 'ppl-4',
      name: 'Kamran Ali',
      role: 'Senior Data Analyst',
      category: 'Core Team',
      bio: 'Managing spatial mapping, district gas analytics, and energy consumption modeling.',
      image: 'Assets/Team/grid-2-1-kamran.png'
    },
    {
      id: 'ppl-5',
      name: 'Abid Shah',
      role: 'Community Outreach Officer',
      category: 'Core Team',
      bio: 'Directing field research in Thar desert settlements and Lake Manchhar fishing communities.',
      image: 'Assets/Team/grid-2-2-abid.png'
    },
    {
      id: 'ppl-6',
      name: 'Spogmai Khattak',
      role: 'Policy Associate',
      category: 'Core Team',
      bio: 'Researching renewable energy tariffs and equitable solar microgrid distribution.',
      image: 'Assets/Team/grid-2-3-spogmai.png'
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
  ]
};

class CAEADataStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(SEED_DATA.activities));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PEOPLE)) {
      localStorage.setItem(STORAGE_KEYS.PEOPLE, JSON.stringify(SEED_DATA.people));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ARTICLES)) {
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(SEED_DATA.articles));
    }
  }

  getKey(collection) {
    switch (collection.toLowerCase()) {
      case 'activities': return STORAGE_KEYS.ACTIVITIES;
      case 'people': return STORAGE_KEYS.PEOPLE;
      case 'articles': return STORAGE_KEYS.ARTICLES;
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
    const newItem = {
      id: `${collection.substring(0, 3)}-${Date.now()}`,
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
    this.dispatchUpdate('all');
  }

  exportJSON() {
    return JSON.stringify({
      activities: this.get('activities'),
      people: this.get('people'),
      articles: this.get('articles'),
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
