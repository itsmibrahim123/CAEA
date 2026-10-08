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
  MEDIA: 'caea_media_data',
  PAGE_SETTINGS: 'caea_page_settings',
  MAP_PINS: 'caea_map_pins_data',
  TEXTILE_CARDS: 'caea_textile_cards_data',
  CLIMATE_REPORTS: 'caea_climate_reports_data'
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
      images: [
        'Assets/media/events/contested-waters/RAY00190.JPG',
        'Assets/media/events/contested-waters/RAY00059.JPG',
        'Assets/media/events/contested-waters/RAY00118.JPG',
        'Assets/media/events/contested-waters/RAY00212.JPG'
      ],
      featured: true,
      quote: '“Those least responsible for climate change are worst affected by it”',
      quoteAuthor: 'Vandana Shiva',
      sortOrder: 1
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
      images: [
        'Assets/media/events/retreat/DSCF4154.JPG',
        'Assets/media/events/retreat/DSCF3966.JPG',
        'Assets/media/events/retreat/DSCF4356.JPG',
        'Assets/media/events/retreat/DSCF4512.JPG'
      ],
      featured: false,
      quote: '“Reconnecting with land and community to build resilience against climate burnout”',
      quoteAuthor: 'CAEA Movement Gathering',
      sortOrder: 2
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
      images: [
        'Assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.18 PM.jpeg',
        'Assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.18 PM (1).jpeg',
        'Assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.18 PM (2).jpeg',
        'Assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.28 PM.jpeg'
      ],
      featured: false,
      quote: '“Manchhar is a mindful lake, yet it bears the heaviest burden of industrial discharge”',
      quoteAuthor: 'Lake Manchhar Fisherman Community',
      sortOrder: 3
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
      images: [
        'Assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.56 PM.jpeg',
        'Assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.57 PM (1).jpeg',
        'Assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.58 PM (2).jpeg',
        'Assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.59 PM.jpeg'
      ],
      featured: false,
      quote: '“Uncovering the true human and ecological costs behind megastructures of power”',
      quoteAuthor: 'Tarbela Exposure Delegation',
      sortOrder: 4
    }
  ],

  people: [
    {
      id: 'ppl-1',
      name: 'Sanaa’i Muhammad',
      role: 'Founder & CEO',
      category: 'Executive',
      bio: 'Sanaa’i Muhammad is the Founder and Chief Executive Officer of the Climate Action & Energy Access Institute (CAEA), where she leads advocacy, and movement-building at the intersection of energy transition and climate justice in Pakistan. Her work focuses on phasing out fossil gas in power, industry, and households; advancing renewable energy pathways; and building public understanding of how colonial infrastructures, financial institutions, and policy choices shape today’s climate and energy crises.\n\nHer work is rooted in a commitment to just transitions, energy equity, and amplifying the experiences of communities most affected by environmental harm. She writes, organizes, and teaches with the belief that climate justice is inseparable from economic democracy, gender justice, and people’s sovereignty over energy and resources.',
      image: 'Assets/Team/grid-1-2-Sanaa.png',
      email: 'sanaaimuhammad@climateactionenergyaccess.org',
      sortOrder: 1
    },
    {
      id: 'ppl-2',
      name: 'Kamran Aziz',
      role: 'Founding Partner & Director Research',
      category: 'Core Team',
      bio: 'Kamran Aziz is the Director Research and a founding partner, working at the intersection of Pakistan’s electricity and gas systems, with a focus on advancing a just energy transition. His work combines historical analysis, political economy, and the lived experiences of communities directly affected by fossil fuel extraction and its social and environmental harms. His research is grounded in a commitment to center frontline communities, democratize energy governance, and support policy transformations aligned with climate justice.',
      image: 'Assets/Team/grid-2-1-kamran.png',
      email: 'kamranaziz@climateactionenergyaccess.org',
      sortOrder: 2
    },
    {
      id: 'ppl-3',
      name: 'Muhammad Asad',
      role: 'Research Associate',
      category: 'Core Team',
      bio: 'Asad is a law graduate from IIUI and a committed worker organizing with the oppressed communities. During his last experience as a Research Associate at Alternative Law Collective, his role involved conducting field research and supporting studies related to the land stewardship, and the concerns of communities victims of climate change and the developmental projects. He has been involved in organizing the students and the marches for their cultural and political rights. By engaging directly with communities, he has developed critical understanding of mainstream discourses around development and knowledge systems with a focus on the laws perpetuating inequalities and the local systems of justice. His role involved research and advocacy at Climate Action and Energy Access',
      image: 'Assets/Team/grid-3-2-muhammad.png',
      email: 'asadjuttah@climateactionenergyaccess.org',
      sortOrder: 3
    },
    {
      id: 'ppl-4',
      name: 'Hamna Anwaar',
      role: 'Textile Associate',
      category: 'Core Team',
      bio: 'Hamna has a bachelors in environmental engineering from NUST and is a passionate environmentalist. Her commitment to addressing critical issues such as climate change, and sustainability has only deepened with her academic journey. She aspires to focus her professional efforts to bring positive change in both our society and environment. As a Textile Associate at CAEA, Hamna focuses on textile-sector emissions and the global fast-fashion supply chain. She works on research, campaigns, and public engagement strategies that highlight the social, environmental, and climate impacts of the industry, and she is committed to advocating for a more equitable and sustainable future for both people and the planet.',
      image: 'Assets/Team/grid-1-1-hamna.png',
      email: 'hamnaanwar@climateactionenergyaccess.org',
      sortOrder: 4
    },
    {
      id: 'ppl-5',
      name: 'Muhammad Saeed',
      role: 'Climate Justice Lead',
      category: 'Core Team',
      bio: 'Muhammad Saeed is an PHD Scholar whose research focuses on the intricate relationship between water, identity, and politics, specifically exploring "Sindhu and the making of Sindhi nationalism: River Politics during the colonial era. His academic work explores key thematic areas including water governance, floods, river infrastructures, and hydro-power development. His research also contributes to a critical understanding of riverine identity and the historical emergence of riverine movements, with a specific focus on the intersection of water and nationalism. Beyond his scholarship, Saeed is a political activist committed to organizing with oppressed communities, nations and people. He is currently serving as a Climate justice Lead at Climate Action and Energy Access, where his work involves both research and advocacy for equitable climate and energy solutions. His direct engagement with communities and academic study inform a critical perspective on mainstream development narratives and knowledge systems, particularly concerning the policies that impact vulnerable populations and perpetuate inequalities.',
      image: 'Assets/Team/grid-3-2-muhammad.png',
      email: 'guramanisaeed98@gmail.com',
      sortOrder: 5
    },
    {
      id: 'ppl-6',
      name: 'Muaaz Ahmad Khan',
      role: 'Communication Lead',
      category: 'Core Team',
      bio: 'Muaaz Ahmad Khan is currently pursuing his MPhil in Government and Public Policy. He works as the Communication Lead and Social Media & Networks Coordinator at CAEA. His work focuses on communicating CAEA’s research and campaigns, managing its digital platforms and network groups, and working with partners on joint communication initiatives. He works closely with the research and campaign teams to turn complex ideas and research into clear and engaging content. Through his work, he contributes to CAEA’s efforts to strengthen a people-centered climate justice movement.',
      image: 'Assets/Team/grid-3-3-muaz.png',
      email: 'khanmuaaz762@gmail.com',
      sortOrder: 6
    },
    {
      id: 'ppl-7',
      name: 'Fizza Aman Bhutto',
      role: 'Admin & HR Officer',
      category: 'Core Team',
      bio: 'Fizza Aman Bhutto is an Administration and HR Officer at the Climate Action and Energy Access (CAEA). She holds a Bachelor’s degree in Development Studies from Bahria University, Islamabad. Her development sector experience spans program coordination, engagement with Indigenous communities, and research on climate-induced disasters, with her undergraduate research focusing on the devastating 2022 floods in Pakistan. At CAEA, she works across administration, human resources, project coordination, and organizational development. She is particularly interested in the intersections of climate justice, development, and organizational development, and in how stronger, people-centered organizations can contribute to a more equitable and sustainable change.',
      image: 'Assets/Team/grid-1-3-fiza.png',
      email: 'fizzabhutto9@gmail.com',
      sortOrder: 7
    },
    {
      id: 'ppl-8',
      name: 'Manahil Usman',
      role: 'Associate Fossil Fuel Phaseout',
      category: 'Core Team',
      bio: 'Manahil Usman is an Associate in Fossil Fuel Phaseout at Climate Action for Energy Access (CAEA), where she focuses on research and data analysis at the intersection of energy policy and climate justice. With a background in Computer Science and an MBA, she brings an analytical foundation shaped by prior work in data management and sector-level analysis to her current focus on Pakistan\'s gas sector, LNG dynamics, and just transition frameworks. At CAEA, Manahil is committed to building the evidence base needed to advance credible, equitable fossil fuel phaseout policy in Pakistan and beyond.',
      image: 'Assets/Team/grid-2-3-spogmai.png',
      email: 'manahilusman2@gmail.com',
      sortOrder: 8
    },
    {
      id: 'ppl-9',
      name: 'Abid Azim',
      role: 'Finance Officer',
      category: 'Core Team',
      bio: 'Abid Azim is an experienced finance professional with expertise in financial management, budgeting, financial reporting, taxation, audit, and strategic financial planning. He has been serving as Finance Manager at Climate Action and Energy Access LLP since May 2024, where he oversees financial analysis, budgeting, cash-flow management, financial reporting, and tax compliance. With professional experience spanning finance, audit, accounting, and business management, Abid brings a strong analytical and results-oriented approach to supporting organizational growth and sustainability. He is a Certified Public Accountant (CPA) from England & Wales and a finalist of ICAEW.',
      image: 'Assets/Team/grid-2-2-abid.png',
      email: 'abidazeem101@gmail.com',
      sortOrder: 9
    }
  ],

  articles: [
    {
      id: 'art-1',
      title: 'The Life Story of Manchar Lake',
      subtitle: 'A field visit exploring Manchar Lake',
      kicker: 'KACHERI',
      author: 'Hamna Anwar',
      date: '2026-07-28',
      dateFormatted: '28.07.2026',
      excerpt: 'The kacheri was based on the case of Lake Manchar. The discussion focused on the ecological destruction of the lake, and how large development projects have affected the people, culture, and livelihoods connected to it.',
      content: 'The kacheri was based on the case of Lake Manchar. The discussion focused on the ecological destruction of the lake, and how large development projects have affected the people, culture, and livelihoods connected to it.\n\nLake Manchar is located in Sindh between the Khirthar mountain range and the River Sindhu. The lake is 360 miles long and 170 miles wide. It is the biggest natural sweet water lake in Asia. The word "Manchar" comes from the Sindhi words Meeh meaning rain and Chhar meaning a vast expanse. Together, "Meeh + Chhar" means a vast spread of Rain waters.\n\nIndustrial discharge and skewed water management have devastated the livelihood of thousands of fisherfolk families. CAEA continues to mobilize community kacheris to demand immediate ecological remediation and water rights.',
      image: 'Assets/how-water-became-power.jpg',
      sortOrder: 1
    },
    {
      id: 'art-2',
      title: 'The Cost of Gas: How Subsidies Shape Pakistan’s Energy Crisis',
      subtitle: 'Analysis of circular debt and industrial consumption patterns',
      kicker: 'POLICY BRIEF',
      author: 'Kamran Aziz & Sanaa’i Muhammad',
      date: '2024-02-10',
      dateFormatted: '10.02.2024',
      excerpt: 'A comprehensive review of Pakistan’s domestic natural gas allocation and its economic burden on working-class households.',
      content: 'Natural gas has long been treated as an abundant domestic resource in Pakistan. However, decades of preferential allocation and depleting reserves have precipitated a severe energy crisis.\n\nOur research shows that the power sector is the most important place to begin this shift. Imported LNG was meant to bring energy security, but instead it has made electricity more expensive and left Pakistan dependent on unpredictable global markets.',
      image: 'Assets/Hero-image.png',
      sortOrder: 2
    },
    {
      id: 'art-3',
      title: 'How Water Became Power',
      subtitle: 'The Political Economy of Freshwater Resources in Sindh',
      kicker: 'CASE STUDY',
      author: 'Waseem Ul Haq',
      date: '2024-03-15',
      dateFormatted: '15.03.2024',
      excerpt: 'An investigation into how large development projects have impacted aquatic ecosystems and fishing livelihoods around Lake Manchhar.',
      content: 'Lake Manchhar is located in Sindh between the Dadu and Khanpur districts. Manchhar comes from the Sindhi words Man meaning mind and Chhar meaning lake or pond. Manchhar translates to "mindful lake". It is the largest natural freshwater lake in Asia.',
      image: 'Assets/how-water-became-power-ai.jpg',
      sortOrder: 3
    },
    {
      id: 'art-4',
      title: 'All Good Things Are Wild And Free',
      subtitle: 'Understanding the Climate Transition Imperative in Pakistan',
      kicker: 'FIELD REPORTS',
      author: 'CAEA Policy Research Team',
      date: '2024-04-10',
      dateFormatted: '10.04.2024',
      excerpt: 'Climate Action & Energy Access (CAEA) is a Pakistan-based research and advocacy institute committed to advancing a just, people-centered energy transition.',
      content: 'We work at the intersection of climate justice, energy governance, and public accountability, focusing on how entrenched fossil-fuel interests, inequitable subsidies, and distorted gas and power policies undermine the rights, wellbeing, and economic futures of ordinary people.',
      image: 'Assets/how-water-became-power.jpg',
      sortOrder: 4
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
      gridArea: 'card1',
      sortOrder: 1
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
      gridArea: 'card2',
      sortOrder: 2
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
      gridArea: 'card3',
      sortOrder: 3
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
      gridArea: 'card4',
      sortOrder: 4
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
      path: 'Assets/Team/grid-1-2-Sanaa.png',
      tags: ['team', 'leadership', 'executive'],
      date: '2024-01-01'
    },
    {
      id: 'med-18',
      title: 'Kamran Aziz',
      category: 'Team',
      path: 'Assets/Team/grid-2-1-kamran.png',
      tags: ['team', 'operations', 'lead'],
      date: '2024-01-01'
    },
    {
      id: 'med-19',
      title: 'Muhammad Asad',
      category: 'Team',
      path: 'Assets/Team/grid-3-2-muhammad.png',
      tags: ['team', 'research'],
      date: '2024-01-01'
    },
    {
      id: 'med-20',
      title: 'Hamna Anwaar',
      category: 'Team',
      path: 'Assets/Team/grid-1-1-hamna.png',
      tags: ['team', 'textile', 'associate'],
      date: '2024-01-01'
    },
    {
      id: 'med-21',
      title: 'Fizza Aman Bhutto',
      category: 'Team',
      path: 'Assets/Team/grid-1-3-fiza.png',
      tags: ['team', 'admin', 'hr'],
      date: '2024-01-01'
    },
    {
      id: 'med-22',
      title: 'Muaaz Ahmad Khan',
      category: 'Team',
      path: 'Assets/Team/grid-3-3-muaz.png',
      tags: ['team', 'communications', 'lead'],
      date: '2024-01-01'
    },
    {
      id: 'med-23',
      title: 'Manahil Usman',
      category: 'Team',
      path: 'Assets/Team/grid-2-3-spogmai.png',
      tags: ['team', 'fossil-fuel'],
      date: '2024-01-01'
    },
    {
      id: 'med-24',
      title: 'Abid Azim',
      category: 'Team',
      path: 'Assets/Team/grid-2-2-abid.png',
      tags: ['team', 'finance'],
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
  ],

  mapPins: [
    {
      id: 'pin-hunza',
      city: 'HUNZA, GB',
      left: '64%',
      top: '6%',
      badge: 'HUNZA, GB',
      description: 'Our team comes from diverse backgrounds across Gilgit-Baltistan. Climate Action & Energy Access (CAEA) is committed to empowering mountain communities through renewable energy and local climate resilience.',
      sortOrder: 1
    },
    {
      id: 'pin-dhirkot',
      city: 'DHIRKOT, AJK',
      left: '70%',
      top: '18%',
      badge: 'DHIRKOT, AJK',
      description: 'In Dhirkot, Azad Kashmir, CAEA works alongside local community organizers on watershed protection, community forestry, and decentralized clean energy solutions for mountain terrains.',
      sortOrder: 2
    },
    {
      id: 'pin-tarbela',
      city: 'TARBELA, KP',
      left: '56%',
      top: '20%',
      badge: 'TARBELA, KP',
      description: 'At Tarbela Dam in Khyber Pakhtunkhwa, CAEA brings together community perspectives to examine megastructure energy promises vs. its human and ecological costs on land and riverine ecosystems.',
      sortOrder: 3
    },
    {
      id: 'pin-jalalpur',
      city: 'JALALPUR, PB',
      left: '66%',
      top: '34%',
      badge: 'JALALPUR, PB',
      description: 'Our team works closely with agrarian communities in Jalalpur advancing decentralized solar irrigation, groundwater conservation, and community energy governance.',
      sortOrder: 4
    },
    {
      id: 'pin-khirthar',
      city: 'KHIRTHAR, SD',
      left: '42%',
      top: '68%',
      badge: 'KHIRTHAR, SD',
      description: 'Across the Khirthar Range in Sindh, CAEA investigates the impacts of fossil fuel exploration, industrial wastewater, and climate shocks on indigenous communities and fragile desert ecologies.',
      sortOrder: 5
    }
  ],

  textileCards: [
    {
      id: 'tex-1',
      title: 'Fashion and Fossil Fuels',
      description: 'Climate Action & Energy Access (CAEA) is a Pakistan-based research and advocacy institute committed to transparent supply chain accountability.',
      tag: 'water',
      btnText: 'WATCH NOW',
      targetOpportunity: 'Textile Watch',
      videoUrl: '',
      image: 'Assets/Hero-image.png',
      orderIndex: 1,
      sortOrder: 1,
      active: true
    },
    {
      id: 'tex-2',
      title: 'Fashion and Fossil Fuels',
      description: 'Investigating synthetic fiber reliance, coal-fired industrial captive power plants, and fair wage transitions for garment workers across industrial zones.',
      tag: 'land',
      btnText: 'WATCH NOW',
      targetOpportunity: 'Textile Watch',
      videoUrl: '',
      image: 'Assets/how-water-became-power.jpg',
      orderIndex: 2,
      sortOrder: 2,
      active: true
    },
    {
      id: 'tex-3',
      title: 'Fashion and Fossil Fuels',
      description: "Advocating for clean industrial energy microgrids, zero liquid discharge standards, and community-led environmental auditing in textile hubs.",
      tag: 'hydropower',
      btnText: 'WATCH NOW',
      targetOpportunity: 'Textile Watch',
      videoUrl: '',
      image: 'Assets/how-water-became-power-ai.jpg',
      orderIndex: 3,
      sortOrder: 3,
      active: true
    }
  ],

  climateReports: [
    {
      id: 'rep-1',
      title: 'Loss and Damage in the Indus Basin: Legal Rights & Climate Reparations',
      subtitle: 'Policy brief on post-2022 flood reconstruction financing',
      category: 'loss-and-damage',
      author: 'Muhammad Saeed & Legal Collective',
      date: '2026-06-12',
      dateFormatted: '12.06.2026',
      summary: 'Examines international climate finance mechanisms and domestic litigation frameworks to establish legal liability and community-centered restitution.',
      pdfUrl: '',
      image: 'Assets/how-water-became-power.jpg',
      status: 'Published',
      sortOrder: 1
    },
    {
      id: 'rep-2',
      title: 'Sovereignty Over Water & Energy in Frontline Delta Communities',
      subtitle: 'Field investigation of saline intrusion and displaced fisherfolk livelihoods',
      category: 'community-rights',
      author: 'CAEA Research Wing',
      date: '2026-04-18',
      dateFormatted: '18.04.2026',
      summary: 'Documentation of community resistance against mega-dam diversions and unequal water allocation across lower Sindh.',
      pdfUrl: '',
      image: 'Assets/how-water-became-power-ai.jpg',
      status: 'Published',
      sortOrder: 2
    }
  ],

  pageSettings: {
    home: {
      heroQuote: 'The climate crisis is a call to transform the systems that brought us here.',
      heroQuoteAuthor: 'Naomi Klein',
      heroVideoUrl: 'Assets/Video/Hero.mov',
      showLatestSection: true,
      latestTitle: 'BE A PART OF OUR LATEST',
      latestSubtitle: 'Watch our latest field updates, community kacheri highlights, and climate documentaries across Pakistan.',
      showLatestVideo: true,
      latestVideoTitle: 'Community Kacheri & Field Briefing',
      latestVideoDescription: 'Experience our frontline grassroots gatherings across Pakistan, exploring public energy ownership and water justice.',
      latestVideoUrl: 'Assets/Video/Hero.mov',
      latestVideoThumbnail: 'Assets/how-water-became-power.jpg',
      quotes: [
        { text: "The climate crisis is a call to transform the systems that brought us here.", author: "Naomi Klein" },
        { text: "What is the use of a house if you haven't got a tolerable planet to put it on?", author: "Vandana Shiva" },
        { text: "In nature's economy, the currency is not money, it is life.", author: "Wangari Maathai" },
        { text: "When we plant trees, we plant the seeds of peace and hope.", author: "Wangari Maathai" }
      ]
    },
    activities: {
      showVideo: true,
      videoTitle: 'More than a retreat (CAEA Community Documentary)',
      videoDescription: 'No experience needed. Just a willingness to show up and act. Reconnecting with nature, exploring movement building, and building resilience against climate burnout.',
      videoUrl: '', // Video URL or uploaded data URI / file path
      videoThumbnail: 'Assets/how-water-became-power-ai.jpg',
      autoplayImages: true,
      imageCycleInterval: 5000 // In milliseconds
    },
    ourStory: {
      teamHeaderTitle: 'The People Who Make It Happen',
      quoteText: 'What we cannot imagine cannot come into being.',
      quoteAuthor: 'Hellen Keller'
    },
    ourWork: {
      fossilFuel: {
        visible: true,
        title: 'OUR MISSION',
        subtitle: 'Rethinking energy systems for a cleaner, fairer, and climate-resilient future.',
        description: "For CAEA, phasing out gas is not a distant policy idea — it is an urgent necessity. Pakistan's growing reliance on natural gas and imported LNG (liquefied natural gas) has trapped the country in a costly system, leading to wasted resources, financial losses, and long-term debts that burden the public for years.\n\nThis is not only an economic problem. Producing and transporting gas releases methane, a gas that heats the planet even faster than carbon dioxide, and the communities living closest to gas fields, pipelines, and power plants bear the greatest damage.\n\nOur research shows that the power sector is the most important place to begin this shift. Imported LNG was meant to bring energy security, but instead it has made.",
        joinBtnText: 'JOIN US',
        opportunityTitle: 'General Volunteer / Open Application',
        bannerTitle: 'FOSSIL FUEL',
        bannerSubtitle: 'Rethinking energy systems for a cleaner, fairer, and climate-resilient future.',
        bannerBtnText: 'EXPLORE WORK'
      },
      textile: {
        visible: true,
        bannerTitle: 'TEXTILE & FAST FASHION',
        bannerSubtitle: 'Supply chain transparency, industrial captive power emissions & fair worker transitions',
        bannerBtnText: 'EXPLORE WORK',
        iconStyle: 'double-blue',
        title: 'TEXTILE & FAST FASHION',
        subtitle: 'Rethinking energy systems for a cleaner, fairer, and climate-resilient future.',
        description: "The fashion industry today is built on deep-rooted injustice. What was once rooted in craft and creativity has become a system driven by fast, cheap consumption — and someone always pays the price.\n\nFast fashion runs on a global chain of exploitation. To meet demand from wealthier countries, factories in places like Pakistan push workers to their limits under poor and unsafe conditions. This exploitation also plays out locally: resources and labor move from less-developed regions to more industrialized ones, often with little fair compensation. Raw materials drawn from these regions rarely benefit the communities they come from.\n\nOur work traces this entire supply chain — from where raw materials are extracted, to where garments are made, to where they are sold — to expose these hidden patterns of extraction and inequality. By sharing the stories of the people and places usually left out of the conversation, we aim to build momentum for a fairer, more equitable alternative to the current system.",
        archPattern: 'white-semicircle',
        joinBtnText: 'JOIN US',
        opportunityTitle: 'Textile Sector Researcher',
        sectionHeading: 'Working towards a future for sustainable textile practices',
        sectionIntro: 'Our efforts are targeted towards creating dialogue and impact thereby. A just energy future starts with you.'
      },
      climateJustice: {
        visible: true,
        bannerTitle: 'CLIMATE JUSTICE',
        bannerSubtitle: "Ecological democracy, gender equity & frontline communities' sovereignty over resources",
        bannerBtnText: 'LEARN MORE',
        title: 'CLIMATE JUSTICE',
        subtitle: 'Rethinking energy systems for a cleaner, fairer, and climate-resilient future.',
        description: "At CAEA, we imagine climate justice beyond merely reducing emissions, compensating losses or making infrastructure resilient. We understand it as the task of refusing the conversion of living landscapes into empty, measurable and extractable space. Every ecology is also a world of knowledge, livelihood, memory, movement and social relations. Justice, therefore, asks who has the power to define a landscape’s problems, whose knowledge is recognised, who receives the benefits of an intervention and who is made to carry its violence. Climate justice means defending diverse ecologies from dispossession and restoring communities’ authority to adapt and steward the worlds that sustain them.\n\nPakistan inhabits different ecological worlds who are victims of the climate crises. Through intentional research, storytelling, and making a dialogic space, CAEA intends to centre the voices of communities victim of the climate crises. Part of this work involves closely examining the social and environmental costs of large infrastructure projects, costs that are often overlooked in official reports and government decisions.\n\nOur goal is to build narrative, shape climate conversations, and support creative reflective spaces to imagine just future that place communities, sustainability, and justice at the center of climate action.",
        joinBtnText: 'JOIN US',
        opportunityTitle: 'Climate Justice Organizer'
      },
      activitiesBanner: {
        bannerTitle: 'ACTIVITIES & GATHERINGS',
        bannerSubtitle: 'Field retreats, community kacheris, exposure visits & workshops across Pakistan',
        bannerBtnText: 'SEE MORE',
        heroQuote: '“Those least responsible for climate change are worst affected by it”',
        heroAuthor: 'Vandana Shiva',
        heroHeading: 'WORKING TOWARDS CLEAN ENERGY',
        heroDescription: 'The ecological destruction of Lake Manchhar in Sindh highlights how industrial discharge, upstream water diversions, and climate shocks devastate indigenous fishing communities. CAEA works alongside local organizers and environmental advocates to document environmental injustices, foster community dialogue, and advance clean energy accountability across Pakistan.',
        showVideo: true,
        videoTitle: 'More than a retreat (CAEA Community Documentary)',
        videoDescription: 'No experience needed. Just a willingness to show up and act. Reconnecting with nature, exploring movement building, and building resilience against climate burnout.',
        videoUrl: '',
        videoThumbnail: 'Assets/how-water-became-power-ai.jpg',
        upcomingGathering: {
          title: 'Sindh Delta Climate Gathering 2026',
          subtitle: 'Registration open for activists and grassroots organizers',
          date: 'OCTOBER 2026',
          link: '#apply'
        }
      }
    }
  }
};

class CAEADataStore {
  constructor() {
    this.apiBase = this.detectApiBase();
    this.isServerConnected = false;
    this.init();
    if (this.apiBase) {
      this.syncWithServer();
    }
  }

  detectApiBase() {
    if (typeof window === 'undefined') return null;
    if (window.CAEA_API_BASE) return window.CAEA_API_BASE.replace(/\/$/, '');
    if (window.location.protocol === 'file:') return null;
    
    // Determine relative API path based on directory structure
    const path = window.location.pathname;
    if (path.includes('/admin/') || path.includes('/pages/')) {
      return '../api';
    }
    return 'api';
  }

  getApiUrl(endpoint = 'api.php') {
    if (!this.apiBase) return null;
    return `${this.apiBase}/${endpoint}`;
  }

  async syncWithServer() {
    const url = this.getApiUrl('api.php?action=export');
    if (!url) return false;

    try {
      const resp = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        credentials: 'same-origin'
      });

      if (!resp.ok) return false;
      const json = await resp.json();
      if (json.success && json.data) {
        this.isServerConnected = true;
        const d = json.data;
        if (d.activities) localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(d.activities));
        if (d.people) localStorage.setItem(STORAGE_KEYS.PEOPLE, JSON.stringify(d.people));
        if (d.articles) localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(d.articles));
        if (d.opportunities) localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(d.opportunities));
        if (d.applications) localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(d.applications));
        if (d.media) localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(d.media));
        if (d.map_pins) localStorage.setItem(STORAGE_KEYS.MAP_PINS, JSON.stringify(d.map_pins));
        if (d.page_settings) localStorage.setItem(STORAGE_KEYS.PAGE_SETTINGS, JSON.stringify(d.page_settings));

        this.dispatchUpdate('all');
        return true;
      }
    } catch (e) {
      console.warn('CAEA DataStore: PHP Backend offline or unreachable. Using local storage fallback.', e);
      this.isServerConnected = false;
    }
    return false;
  }

  async sendApiMutation(endpoint, method, body) {
    const url = this.getApiUrl(endpoint);
    if (!url) return null;
    try {
      const resp = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'same-origin',
        body: body ? JSON.stringify(body) : undefined
      });
      return await resp.json();
    } catch (e) {
      console.warn('API mutation background dispatch failed:', e);
      return null;
    }
  }

  async uploadMedia(file, metadata = {}) {
    const url = this.getApiUrl('upload.php');
    if (!url) {
      throw new Error('Upload API unavailable on static file protocol');
    }

    const formData = new FormData();
    formData.append('file', file);
    if (metadata.title) formData.append('title', metadata.title);
    if (metadata.category) formData.append('category', metadata.category);
    if (metadata.tags) formData.append('tags', metadata.tags);

    const resp = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'same-origin'
    });

    const json = await resp.json();
    if (!resp.ok || !json.success) {
      throw new Error(json.error || 'Media upload failed');
    }

    // Refresh media cache
    if (json.file) {
      const mediaList = this.get('media');
      mediaList.unshift(json.file);
      localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(mediaList));
      this.dispatchUpdate('media');
    }

    return json.file;
  }

  async login(passcode, passhash = null) {
    const url = this.getApiUrl('auth.php?action=login');
    if (!url) return { success: false, error: 'Auth API unavailable' };

    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ passcode, passhash })
      });
      return await resp.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async logout() {
    const url = this.getApiUrl('auth.php?action=logout');
    if (!url) return { success: true };
    try {
      const resp = await fetch(url, { method: 'POST', credentials: 'same-origin' });
      return await resp.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async checkAuth() {
    const url = this.getApiUrl('auth.php?action=check');
    if (!url) return { success: true, authenticated: false };
    try {
      const resp = await fetch(url, { method: 'GET', credentials: 'same-origin' });
      return await resp.json();
    } catch (e) {
      return { success: false, authenticated: false };
    }
  }

  init() {
    const DATA_VERSION_KEY = 'caea_data_version';
    const CURRENT_VERSION = 'v18_map_pins_province_initials';
    const storedVersion = localStorage.getItem(DATA_VERSION_KEY);

    if (storedVersion !== CURRENT_VERSION) {
      // Refresh seed activities, people, media, mapPins, textileCards, climateReports, and pageSettings
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(SEED_DATA.activities));
      localStorage.setItem(STORAGE_KEYS.PEOPLE, JSON.stringify(SEED_DATA.people));
      localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(SEED_DATA.media));
      localStorage.setItem(STORAGE_KEYS.MAP_PINS, JSON.stringify(SEED_DATA.mapPins));
      localStorage.setItem(STORAGE_KEYS.TEXTILE_CARDS, JSON.stringify(SEED_DATA.textileCards));
      localStorage.setItem(STORAGE_KEYS.CLIMATE_REPORTS, JSON.stringify(SEED_DATA.climateReports));
      if (!localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES)) {
        localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(SEED_DATA.opportunities));
      }
      if (!localStorage.getItem(STORAGE_KEYS.ARTICLES)) {
        localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(SEED_DATA.articles));
      }
      if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(SEED_DATA.applications));
      }
      localStorage.setItem(STORAGE_KEYS.PAGE_SETTINGS, JSON.stringify(SEED_DATA.pageSettings));
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
      if (!localStorage.getItem(STORAGE_KEYS.MAP_PINS)) {
        localStorage.setItem(STORAGE_KEYS.MAP_PINS, JSON.stringify(SEED_DATA.mapPins));
      }
      if (!localStorage.getItem(STORAGE_KEYS.TEXTILE_CARDS)) {
        localStorage.setItem(STORAGE_KEYS.TEXTILE_CARDS, JSON.stringify(SEED_DATA.textileCards));
      }
      if (!localStorage.getItem(STORAGE_KEYS.CLIMATE_REPORTS)) {
        localStorage.setItem(STORAGE_KEYS.CLIMATE_REPORTS, JSON.stringify(SEED_DATA.climateReports));
      }
      if (!localStorage.getItem(STORAGE_KEYS.PAGE_SETTINGS)) {
        localStorage.setItem(STORAGE_KEYS.PAGE_SETTINGS, JSON.stringify(SEED_DATA.pageSettings));
      }
    }
  }

  getKey(collection) {
    switch (collection.toLowerCase()) {
      case 'activities': return STORAGE_KEYS.ACTIVITIES;
      case 'people': return STORAGE_KEYS.PEOPLE;
      case 'articles':
      case 'fossilfuelarticles':
      case 'fossil_articles': return STORAGE_KEYS.ARTICLES;
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
      case 'mappins':
      case 'map_pins':
      case 'pins':
      case 'map': return STORAGE_KEYS.MAP_PINS;
      case 'textilecards':
      case 'textile_cards':
      case 'textile': return STORAGE_KEYS.TEXTILE_CARDS;
      case 'climatereports':
      case 'climate_reports':
      case 'climatereport': return STORAGE_KEYS.CLIMATE_REPORTS;
      case 'page_settings':
      case 'pagesettings':
      case 'settings': return STORAGE_KEYS.PAGE_SETTINGS;
      default: throw new Error(`Unknown collection: ${collection}`);
    }
  }

  getApiCollectionName(collection) {
    const c = collection.toLowerCase();
    if (c === 'mappins' || c === 'pins' || c === 'map') return 'map_pins';
    if (c === 'get-involved' || c === 'positions') return 'opportunities';
    if (c === 'applied' || c === 'applied_fields' || c === 'submissions') return 'applications';
    if (c === 'assets' || c === 'images') return 'media';
    if (c === 'settings' || c === 'pagesettings') return 'page_settings';
    return c;
  }

  get(collection) {
    const key = this.getKey(collection);
    try {
      const data = localStorage.getItem(key);
      let items = data ? JSON.parse(data) : [];

      if ((!items || items.length === 0) && collection === 'textileCards') {
        const settings = this.getPageSettings('ourWork');
        items = settings?.textile?.cards || SEED_DATA.textileCards || [];
      } else if ((!items || items.length === 0) && collection === 'climateReports') {
        const settings = this.getPageSettings('ourWork');
        items = settings?.climateJustice?.reports || SEED_DATA.climateReports || [];
      }

      if (Array.isArray(items)) {
        return items.sort((a, b) => {
          const orderA = (a && a.sortOrder !== undefined && a.sortOrder !== null && a.sortOrder !== '') ? Number(a.sortOrder) : 
                         (a && a.orderIndex !== undefined ? Number(a.orderIndex) : 999);
          const orderB = (b && b.sortOrder !== undefined && b.sortOrder !== null && b.sortOrder !== '') ? Number(b.sortOrder) : 
                         (b && b.orderIndex !== undefined ? Number(b.orderIndex) : 999);
          return orderA - orderB;
        });
      }
      return items;
    } catch (e) {
      console.error(`Error reading ${collection} from DataStore:`, e);
      return [];
    }
  }

  set(collection, items) {
    if (!Array.isArray(items)) return;
    localStorage.setItem(this.getKey(collection), JSON.stringify(items));
    this.dispatchUpdate(collection);
  }

  getById(collection, id) {
    const items = this.get(collection);
    return items.find(item => item.id === id) || null;
  }

  getPageSettings(page = null) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PAGE_SETTINGS);
      const parsed = data ? JSON.parse(data) : JSON.parse(JSON.stringify(SEED_DATA.pageSettings));
      const defaults = SEED_DATA.pageSettings;
      
      const merged = {
        home: { ...defaults.home, ...(parsed.home || {}) },
        activities: { ...defaults.activities, ...(parsed.activities || {}) },
        ourStory: { ...defaults.ourStory, ...(parsed.ourStory || {}) },
        ourWork: { ...defaults.ourWork, ...(parsed.ourWork || {}) }
      };

      if (page) {
        return merged[page] || null;
      }
      return merged;
    } catch (e) {
      console.error('Error reading pageSettings from DataStore:', e);
      return page ? (SEED_DATA.pageSettings[page] || null) : SEED_DATA.pageSettings;
    }
  }

  savePageSettings(page, settings) {
    try {
      const current = this.getPageSettings();
      if (page && typeof settings === 'object') {
        current[page] = {
          ...(current[page] || {}),
          ...settings,
          updatedAt: new Date().toISOString()
        };
      } else if (!page && typeof settings === 'object') {
        Object.assign(current, settings);
      }
      localStorage.setItem(STORAGE_KEYS.PAGE_SETTINGS, JSON.stringify(current));
      this.dispatchUpdate('page_settings');

      // Sync to PHP database
      if (page) {
        this.sendApiMutation(`api.php?collection=page_settings&id=${page}`, 'POST', {
          pageKey: page,
          settings: current[page]
        });
      } else {
        Object.keys(current).forEach(pKey => {
          this.sendApiMutation(`api.php?collection=page_settings&id=${pKey}`, 'POST', {
            pageKey: pKey,
            settings: current[pKey]
          });
        });
      }

      return page ? current[page] : current;
    } catch (e) {
      console.error('Error saving pageSettings to DataStore:', e);
      return null;
    }
  }

  getOurWorkData(pillar = null) {
    const settings = this.getPageSettings('ourWork') || {};
    const fossilArticles = this.get('articles');
    const textileCards = this.get('textileCards');
    const climateReports = this.get('climateReports');
    const activities = this.get('activities');

    const fullData = {
      fossilFuel: {
        ...(settings.fossilFuel || {}),
        articles: fossilArticles
      },
      textile: {
        ...(settings.textile || {}),
        investigations: textileCards,
        cards: textileCards
      },
      climateJustice: {
        ...(settings.climateJustice || {}),
        reports: climateReports
      },
      activities: {
        ...(settings.activitiesBanner || settings.activities || {}),
        items: activities
      }
    };

    if (pillar) {
      return fullData[pillar] || null;
    }
    return fullData;
  }

  saveOurWorkPillar(pillarKey, updates) {
    const currentSettings = this.getPageSettings();
    const currentOurWork = currentSettings.ourWork || {};
    currentOurWork[pillarKey] = {
      ...(currentOurWork[pillarKey] || {}),
      ...updates
    };
    return this.savePageSettings('ourWork', currentOurWork);
  }

  add(collection, item) {
    const items = this.get(collection);
    const prefix = collection.toLowerCase().startsWith('app') ? 'app' :
                   collection.toLowerCase().startsWith('opp') ? 'opp' :
                   collection.toLowerCase().startsWith('med') ? 'med' :
                   collection.toLowerCase().startsWith('map') || collection.toLowerCase().startsWith('pin') ? 'pin' :
                   collection.substring(0, 3);
    const defaultSortOrder = (item.sortOrder !== undefined && item.sortOrder !== null && item.sortOrder !== '') ? parseInt(item.sortOrder, 10) : (items.length + 1);
    const newItem = {
      id: `${prefix}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...item,
      sortOrder: defaultSortOrder
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

    items.push(newItem);
    localStorage.setItem(this.getKey(collection), JSON.stringify(items));
    this.dispatchUpdate(collection);

    // Sync with PHP REST API
    const apiCol = this.getApiCollectionName(collection);
    this.sendApiMutation(`api.php?collection=${apiCol}`, 'POST', newItem);

    return newItem;
  }

  update(collection, id, updatedFields) {
    const items = this.get(collection);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;

    const item = items[index];
    const updatedSortOrder = (updatedFields.sortOrder !== undefined && updatedFields.sortOrder !== null && updatedFields.sortOrder !== '') ? parseInt(updatedFields.sortOrder, 10) : (item.sortOrder !== undefined ? item.sortOrder : index + 1);
    const updatedItem = {
      ...item,
      ...updatedFields,
      sortOrder: updatedSortOrder,
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

    // Sync with PHP REST API
    const apiCol = this.getApiCollectionName(collection);
    this.sendApiMutation(`api.php?collection=${apiCol}&id=${id}`, 'POST', {
      action: 'update',
      id: id,
      ...updatedFields,
      sortOrder: updatedSortOrder
    });

    return updatedItem;
  }

  delete(collection, id) {
    let items = this.get(collection);
    const initialLen = items.length;
    items = items.filter(item => item.id !== id);
    if (items.length !== initialLen) {
      localStorage.setItem(this.getKey(collection), JSON.stringify(items));
      this.dispatchUpdate(collection);

      // Sync with PHP REST API
      const apiCol = this.getApiCollectionName(collection);
      this.sendApiMutation(`api.php?collection=${apiCol}&id=${id}`, 'POST', {
        action: 'delete',
        id: id
      });

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
    localStorage.setItem(STORAGE_KEYS.MAP_PINS, JSON.stringify(SEED_DATA.mapPins));
    localStorage.setItem(STORAGE_KEYS.PAGE_SETTINGS, JSON.stringify(SEED_DATA.pageSettings));
    this.dispatchUpdate('all');

    // Sync reset to PHP API
    this.sendApiMutation('api.php?action=reset', 'POST', {});
  }

  exportJSON() {
    return JSON.stringify({
      activities: this.get('activities'),
      people: this.get('people'),
      articles: this.get('articles'),
      opportunities: this.get('opportunities'),
      applications: this.get('applications'),
      media: this.get('media'),
      mapPins: this.get('mapPins'),
      pageSettings: this.getPageSettings(),
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
      if (data.mapPins && Array.isArray(data.mapPins)) {
        localStorage.setItem(STORAGE_KEYS.MAP_PINS, JSON.stringify(data.mapPins));
      }
      if (data.pageSettings && typeof data.pageSettings === 'object') {
        localStorage.setItem(STORAGE_KEYS.PAGE_SETTINGS, JSON.stringify(data.pageSettings));
      }
      this.dispatchUpdate('all');

      // Sync import payload to PHP backend
      this.sendApiMutation('api.php?action=import', 'POST', {
        data: {
          activities: data.activities || [],
          people: data.people || [],
          articles: data.articles || [],
          opportunities: data.opportunities || [],
          applications: data.applications || [],
          media: data.media || [],
          map_pins: data.mapPins || data.map_pins || [],
          page_settings: data.pageSettings || data.page_settings || {}
        }
      });

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
