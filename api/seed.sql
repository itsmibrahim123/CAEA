-- ============================================================
-- CAEA Institute - SQL Schema & Seed Dump
-- Compatible with MySQL 5.7+, MySQL 8.0+, MariaDB, and SQLite
-- ============================================================

-- 1. Table: activities
CREATE TABLE IF NOT EXISTS activities (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    date DATE NOT NULL,
    dateFormatted VARCHAR(32) NOT NULL,
    location VARCHAR(255) DEFAULT 'Pakistan',
    description TEXT,
    image VARCHAR(512),
    featured INTEGER DEFAULT 0,
    quote TEXT,
    quoteAuthor VARCHAR(255),
    createdAt DATETIME,
    updatedAt DATETIME
);

-- 2. Table: people
CREATE TABLE IF NOT EXISTS people (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    bio TEXT,
    image VARCHAR(512),
    email VARCHAR(255),
    createdAt DATETIME,
    updatedAt DATETIME
);

-- 3. Table: articles
CREATE TABLE IF NOT EXISTS articles (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    kicker VARCHAR(64) DEFAULT 'CASE STUDY',
    author VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    dateFormatted VARCHAR(32) NOT NULL,
    excerpt TEXT,
    content TEXT,
    image VARCHAR(512),
    createdAt DATETIME,
    updatedAt DATETIME
);

-- 4. Table: opportunities
CREATE TABLE IF NOT EXISTS opportunities (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    type VARCHAR(64) NOT NULL,
    theme VARCHAR(32) DEFAULT 'blue',
    description TEXT,
    status VARCHAR(32) DEFAULT 'Open',
    image VARCHAR(512),
    gridArea VARCHAR(32),
    createdAt DATETIME,
    updatedAt DATETIME
);

-- 5. Table: applications
CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(64) PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(64) NOT NULL,
    city VARCHAR(255) NOT NULL,
    opportunityId VARCHAR(64),
    opportunityTitle VARCHAR(255),
    category VARCHAR(255),
    commitment VARCHAR(64),
    message TEXT,
    experience TEXT,
    status VARCHAR(32) DEFAULT 'Pending',
    date DATE NOT NULL,
    dateFormatted VARCHAR(32) NOT NULL,
    notes TEXT,
    createdAt DATETIME,
    updatedAt DATETIME
);

-- 6. Table: media
CREATE TABLE IF NOT EXISTS media (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    path VARCHAR(512) NOT NULL,
    tags TEXT,
    date DATE,
    createdAt DATETIME
);

-- 7. Table: map_pins
CREATE TABLE IF NOT EXISTS map_pins (
    id VARCHAR(64) PRIMARY KEY,
    city VARCHAR(255) NOT NULL,
    leftPos VARCHAR(32) NOT NULL,
    topPos VARCHAR(32) NOT NULL,
    badge VARCHAR(255) NOT NULL,
    description TEXT,
    createdAt DATETIME,
    updatedAt DATETIME
);

-- 8. Table: page_settings
CREATE TABLE IF NOT EXISTS page_settings (
    pageKey VARCHAR(64) PRIMARY KEY,
    settingsJson TEXT NOT NULL,
    updatedAt DATETIME
);

-- 9. Table: fossil_article_links
CREATE TABLE IF NOT EXISTS fossil_article_links (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publisher VARCHAR(255) NOT NULL,
    badge VARCHAR(64) DEFAULT 'ARTICLE',
    category VARCHAR(64) DEFAULT 'articles',
    url VARCHAR(512) NOT NULL,
    description TEXT,
    sortOrder INTEGER DEFAULT 0,
    createdAt DATETIME,
    updatedAt DATETIME
);

-- 10. Table: climate_article_links
CREATE TABLE IF NOT EXISTS climate_article_links (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publisher VARCHAR(255) NOT NULL,
    badge VARCHAR(64) DEFAULT 'THE NEWS',
    category VARCHAR(64) DEFAULT 'articles',
    url VARCHAR(512) NOT NULL,
    description TEXT,
    sortOrder INTEGER DEFAULT 0,
    createdAt DATETIME,
    updatedAt DATETIME
);

-- 11. Table: textile_cards
CREATE TABLE IF NOT EXISTS textile_cards (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publisher VARCHAR(255) DEFAULT 'CAEA',
    category VARCHAR(64) DEFAULT 'Research & Reports',
    url TEXT,
    description TEXT,
    sortOrder INTEGER DEFAULT 0,
    createdAt DATETIME,
    updatedAt DATETIME
);

-- ============================================================
-- INITIAL SEED DATA
-- ============================================================

INSERT INTO activities (id, title, category, date, dateFormatted, location, description, image, featured, quote, quoteAuthor, createdAt, updatedAt) VALUES
('act-1', 'Contested Waters: Rivers, Power and Resistance', 'WORKSHOP', '2026-01-23', '23.01.2026', 'Pakistan', 'Examines how colonial and modern systems of water control through dams, barrages, and canals have transformed river ecosystems, displaced communities, and disrupted cultural relationships with water.', 'assets/media/events/contested-waters/RAY00190.JPG', 1, '“Those least responsible for climate change are worst affected by it”', 'Vandana Shiva', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('act-2', 'Climate Justice Gathering & Retreat', 'RETREAT', '2026-04-23', '23.04.2026', 'Pakistan', 'A 3-day retreat for climate activists and community organizers across Pakistan to reflect, reconnect with nature, and discuss energy, climate stories, burnout, and movement building.', 'assets/media/events/retreat/DSCF4154.JPG', 0, '“Reconnecting with land and community to build resilience against climate burnout”', 'CAEA Movement Gathering', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('act-3', 'Kacheri: Manchar Sunvai', 'COMMUNITY KACHERI', '2026-05-20', '20.05.2026', 'Lake Manchhar, Sindh', 'Discussion on the ecological destruction of Lake Manchhar, changes in water flow, infrastructure development, agricultural wastewater, and community-led resistance.', 'assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.18 PM.jpeg', 0, '“Manchhar is a mindful lake, yet it bears the heaviest burden of industrial discharge”', 'Lake Manchhar Fisherman Community', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('act-4', 'Exposure Visit to Tarbela Dam', 'EXPOSURE VISIT', '2026-07-28', '28.07.2026', 'Tarbela Dam', 'Brought together perspectives from WAPDA and displaced communities to examine Tarbela''s promises of power vs. its costs on land, livelihoods, culture, and ecosystems.', 'assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.56 PM.jpeg', 0, '“Uncovering the true human and ecological costs behind megastructures of power”', 'Tarbela Exposure Delegation', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO people (id, name, role, category, bio, image, email, createdAt, updatedAt) VALUES
('ppl-1', 'Sanaa’i Muhammad', 'Founder & CEO', 'Executive', 'Sanaa’i Muhammad is the Founder and Chief Executive Officer of the Climate Action & Energy Access Institute (CAEA), where she leads advocacy, and movement-building at the intersection of energy transition and climate justice in Pakistan.', 'assets/team/grid-1-2-Sanaa.png', 'sanaaimuhammad@climateactionenergyaccess.org', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ppl-2', 'Kamran Aziz', 'Founding Partner & Director Research', 'Core Team', 'Kamran Aziz is the Director Research and a founding partner, working at the intersection of Pakistan’s electricity and gas systems, with a focus on advancing a just energy transition.', 'assets/team/grid-2-1-kamran.png', 'kamranaziz@climateactionenergyaccess.org', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ppl-3', 'Muhammad Asad', 'Research Associate', 'Core Team', 'Asad is a law graduate from IIUI and a committed worker organizing with the oppressed communities.', 'assets/CAEA-Navbar-Logo.png', 'asadjuttah@climateactionenergyaccess.org', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ppl-4', 'Hamna Anwaar', 'Textile Associate', 'Core Team', 'Hamna has a bachelors in environmental engineering from NUST and is a passionate environmentalist. Her commitment to addressing critical issues such as climate change, and sustainability has only deepened with her academic journey.', 'assets/team/grid-1-1-hamna.png', 'hamnaanwar@climateactionenergyaccess.org', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ppl-5', 'Muhammad Saeed', 'Climate Justice Lead', 'Core Team', 'Muhammad Saeed is an PHD Scholar whose research focuses on the intricate relationship between water, identity, and politics, specifically exploring "Sindhu and the making of Sindhi nationalism: River Politics during the colonial era.', 'assets/team/grid-3-2-muhammad.png', 'guramanisaeed98@gmail.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ppl-6', 'Muaaz Ahmad Khan', 'Communication Lead', 'Core Team', 'Muaaz Ahmad Khan is currently pursuing his MPhil in Government and Public Policy. He works as the Communication Lead and Social Media & Networks Coordinator at CAEA.', 'assets/team/grid-3-3-muaz.png', 'khanmuaaz762@gmail.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ppl-7', 'Fizza Aman Bhutto', 'Admin & HR Officer', 'Core Team', 'Fizza Aman Bhutto is an Administration and HR Officer at the Climate Action and Energy Access (CAEA). She holds a Bachelor’s degree in Development Studies from Bahria University, Islamabad.', 'assets/team/grid-1-3-fiza.png', 'fizzabhutto9@gmail.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ppl-8', 'Manahil Usman', 'Associate Fossil Fuel Phaseout', 'Core Team', 'Manahil Usman is an Associate in Fossil Fuel Phaseout at Climate Action for Energy Access (CAEA), where she focuses on research and data analysis at the intersection of energy policy and climate justice.', 'assets/CAEA-Navbar-Logo.png', 'manahilusman2@gmail.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ppl-9', 'Abid Azim', 'Finance Officer', 'Core Team', 'Abid Azim is an experienced finance professional with expertise in financial management, budgeting, financial reporting, taxation, audit, and strategic financial planning.', 'assets/team/grid-2-2-abid.png', 'abidazeem101@gmail.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO map_pins (id, city, leftPos, topPos, badge, description, createdAt, updatedAt) VALUES
('pin-hunza', 'HUNZA, GB', '64%', '6%', 'HUNZA, GB', 'Our team comes from diverse backgrounds across Gilgit-Baltistan. Climate Action & Energy Access (CAEA) is committed to empowering mountain communities through renewable energy and local climate resilience.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pin-dhirkot', 'DHIRKOT, AJK', '70%', '18%', 'DHIRKOT, AJK', 'In Dhirkot, Azad Kashmir, CAEA works alongside local community organizers on watershed protection, community forestry, and decentralized clean energy solutions for mountain terrains.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pin-tarbela', 'TARBELA, KP', '56%', '20%', 'TARBELA, KP', 'At Tarbela Dam in Khyber Pakhtunkhwa, CAEA brings together community perspectives to examine megastructure energy promises vs. its human and ecological costs on land and riverine ecosystems.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pin-jalalpur', 'JALALPUR, PB', '66%', '34%', 'JALALPUR, PB', 'Our team works closely with agrarian communities in Jalalpur advancing decentralized solar irrigation, groundwater conservation, and community energy governance.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pin-khirthar', 'KHIRTHAR, SD', '42%', '68%', 'KHIRTHAR, SD', 'Across the Khirthar Range in Sindh, CAEA investigates the impacts of fossil fuel exploration, industrial wastewater, and climate shocks on indigenous communities and fragile desert ecologies.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO fossil_article_links (id, title, publisher, badge, category, url, description, sortOrder, createdAt, updatedAt) VALUES
('fl-1', 'RLNG disruption: a bane?', 'Dawn · Opinion & Analysis', 'DAWN', 'articles', 'https://www.dawn.com/news/1997175?utm_source=whatsapp', 'Published in Dawn · Investigative policy piece exploring Pakistan’s LNG disruptions.', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('fl-2', 'Our Remarkable Natural Gas Overshoot', 'The News on Sunday · Special Report', 'THE NEWS', 'articles', 'https://www.thenews.pk/tns/detail/1397737-our-remarkable-natural-gas-overshoot', 'Published in The News on Sunday · In-depth breakdown of gas oversupply and stranded assets.', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('fl-3', 'Political Economy of Power, Energy, Climate and Justice', 'CAEA Research Publication (PDF)', 'RESEARCH REPORT', 'research', 'https://drive.google.com/file/d/1LuXInnvuC11GMiHBM_NM4HoWxkRP_Fpa/view?usp=drive_link', 'Comprehensive research publication interrogating gas as a system of power in Pakistan.', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('fl-4', 'CAEA Climate Action & Energy Access Dashboard', 'Live Interactive Platform', 'DATA DASHBOARD', 'dashboard', '/pages/our-analytics.html', 'Interactive data portal for real-time energy capacity, transmission data, and emissions.', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('fl-5', 'Policy Analysis & Regulatory Briefs', 'CAEA Policy Briefs', 'POLICY ANALYSIS', 'policy', '#', 'Upcoming policy briefs, regulatory submissions to NEPRA, and power sector restructuring proposals.', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO climate_article_links (id, title, publisher, badge, category, url, description, sortOrder, createdAt, updatedAt) VALUES
('cl-1', 'The hidden cost of development', 'The News on Sunday · Special Report', 'THE NEWS', 'articles', 'https://www.thenews.com.pk/tns/detail/1023422-the-hidden-cost-of-development', 'A critical look at the social and ecological costs behind infrastructure development.', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cl-2', 'E-11 interchange: boon or bane?', 'The News on Sunday · Urban Ecology', 'THE NEWS', 'articles', 'https://www.thenews.com.pk/tns/detail/1074418-e-11-interchange-boon-or-bane', 'Interrogating urban infrastructure, displacement, and environmental degradation.', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cl-3', 'Loss and displacement', 'The News on Sunday · Climate Justice', 'THE NEWS', 'articles', 'https://www.thenews.pk/tns/detail/1390589-loss-and-displacement', 'Stories and research on frontline communities facing climate displacement.', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cl-4', 'The development scarcity', 'The News on Sunday · Political Economy', 'THE NEWS', 'articles', 'https://www.thenews.pk/tns/detail/1292148-the-development-scarcity', 'Unpacking the structural inequities in Pakistan’s development paradigms.', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cl-5', 'Living Landscapes & Community Water Rights', 'CAEA Field Research', 'RESEARCH & DOCUMENTATION', 'research', '#', 'Ongoing field investigations documenting the political ecology of the Indus Basin and community water sovereignty.', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cl-6', 'Legal Frameworks for Climate Loss & Damage in Pakistan', 'CAEA Legal & Policy Team', 'REPORTS', 'reports', '#', 'Policy frameworks evaluating constitutional rights, environmental tribunals, and state accountability for displaced populations.', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cl-7', 'Voices from the Frontlines: Lake Manchar & Beyond', 'Visual & Audio Storytelling Archive', 'MULTIMEDIA STORIES', 'multimedia', '#', 'Interactive photo essays, community audio testimonies, and visual archives capturing the lived realities of climate-hit ecologies.', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cl-8', 'Defending Ecologies & Community Sovereignty', 'CAEA Movement Building & Advocacy', 'CAMPAIGNS', 'campaigns', '#', 'Grassroots mobilization campaigns, community kacheris, and participatory climate justice dialogues across Pakistan.', 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO textile_cards (id, title, publisher, category, url, description, sortOrder, createdAt, updatedAt) VALUES
('tex-1', 'Fashion and Fossil Fuels: Supply Chain Investigation', 'CAEA Research Publication', 'Research & Reports', 'https://drive.google.com/file/d/1LuXInnvuC11GMiHBM_NM4HoWxkRP_Fpa/view?usp=drive_link', 'Tracing synthetic fiber reliance, coal-fired industrial captive power plants, and supply chain accountability across Pakistan''s textile hubs.', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('tex-2', 'The Carbon Thread: Fast Fashion Exploitation', 'The News on Sunday', 'Article', 'https://www.thenews.pk/tns/detail/1023422-the-hidden-cost-of-development', 'Investigating synthetic fiber reliance, coal-fired industrial captive power plants, and fair wage transitions for garment workers across industrial zones.', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('tex-3', 'Garment Workers & Community Testimonies', 'CAEA Field Briefing', 'Testimonials', '#apply', 'First-hand oral accounts and video recordings from garment workers and fenceline communities living along polluted industrial drainage canals.', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('tex-4', 'Demand Clean Energy & Fair Wages in Pakistan''s Textile Sector', 'CAEA Public Action', 'Sign Our Petition', '#apply', 'Join our urgent public campaign petition demanding mandatory solarization of textile power, zero liquid discharge, and living wage protections.', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
