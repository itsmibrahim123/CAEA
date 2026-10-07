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

-- ============================================================
-- INITIAL SEED DATA
-- ============================================================

INSERT INTO activities (id, title, category, date, dateFormatted, location, description, image, featured, quote, quoteAuthor, createdAt, updatedAt) VALUES
('act-1', 'Contested Waters: Rivers, Power and Resistance', 'WORKSHOP', '2026-01-23', '23.01.2026', 'Pakistan', 'Examines how colonial and modern systems of water control through dams, barrages, and canals have transformed river ecosystems, displaced communities, and disrupted cultural relationships with water.', 'Assets/media/events/contested-waters/RAY00190.JPG', 1, '“Those least responsible for climate change are worst affected by it”', 'Vandana Shiva', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('act-2', 'Climate Justice Gathering & Retreat', 'RETREAT', '2026-04-23', '23.04.2026', 'Pakistan', 'A 3-day retreat for climate activists and community organizers across Pakistan to reflect, reconnect with nature, and discuss energy, climate stories, burnout, and movement building.', 'Assets/media/events/retreat/DSCF4154.JPG', 0, '“Reconnecting with land and community to build resilience against climate burnout”', 'CAEA Movement Gathering', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('act-3', 'Kacheri: Manchar Sunvai', 'COMMUNITY KACHERI', '2026-05-20', '20.05.2026', 'Lake Manchhar, Sindh', 'Discussion on the ecological destruction of Lake Manchhar, changes in water flow, infrastructure development, agricultural wastewater, and community-led resistance.', 'Assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.18 PM.jpeg', 0, '“Manchhar is a mindful lake, yet it bears the heaviest burden of industrial discharge”', 'Lake Manchhar Fisherman Community', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('act-4', 'Exposure Visit to Tarbela Dam', 'EXPOSURE VISIT', '2026-07-28', '28.07.2026', 'Tarbela Dam', 'Brought together perspectives from WAPDA and displaced communities to examine Tarbela''s promises of power vs. its costs on land, livelihoods, culture, and ecosystems.', 'Assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.56 PM.jpeg', 0, '“Uncovering the true human and ecological costs behind megastructures of power”', 'Tarbela Exposure Delegation', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO people (id, name, role, category, bio, image, email, createdAt, updatedAt) VALUES
('ppl-1', 'Sanaa’i Muhammad', 'Founder & CEO', 'Executive', 'Sanaa’i Muhammad is the Founder and Chief Executive Officer of the Climate Action & Energy Access Institute (CAEA), where she leads advocacy, and movement-building at the intersection of energy transition and climate justice in Pakistan.', 'Assets/Team/grid-1-2-Sanaa.png', 'sanaaimuhammad@climateactionenergyaccess.org', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ppl-2', 'Kamran Aziz', 'Founding Partner & Director Research', 'Core Team', 'Kamran Aziz is the Director Research and a founding partner, working at the intersection of Pakistan’s electricity and gas systems, with a focus on advancing a just energy transition.', 'Assets/Team/grid-2-1-kamran.png', 'kamranaziz@climateactionenergyaccess.org', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ppl-3', 'Muhammad Asad', 'Research Associate', 'Core Team', 'Asad is a law graduate from IIUI and a committed worker organizing with the oppressed communities.', 'Assets/Team/grid-3-2-muhammad.png', 'asadjuttah@climateactionenergyaccess.org', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ppl-4', 'Hamna Anwaar', 'Textile Associate', 'Core Team', 'Hamna has a bachelors in environmental engineering from NUST and is a passionate environmentalist. Her commitment to addressing critical issues such as climate change, and sustainability has only deepened with her academic journey.', 'Assets/Team/grid-1-1-hamna.png', 'hamnaanwar@climateactionenergyaccess.org', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ppl-5', 'Muhammad Saeed', 'Climate Justice Lead', 'Core Team', 'Muhammad Saeed is an PHD Scholar whose research focuses on the intricate relationship between water, identity, and politics, specifically exploring "Sindhu and the making of Sindhi nationalism: River Politics during the colonial era.', 'Assets/Team/grid-3-2-muhammad.png', 'guramanisaeed98@gmail.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ppl-6', 'Muaaz Ahmad Khan', 'Communication Lead', 'Core Team', 'Muaaz Ahmad Khan is currently pursuing his MPhil in Government and Public Policy. He works as the Communication Lead and Social Media & Networks Coordinator at CAEA.', 'Assets/Team/grid-3-3-muaz.png', 'khanmuaaz762@gmail.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ppl-7', 'Fizza Aman Bhutto', 'Admin & HR Officer', 'Core Team', 'Fizza Aman Bhutto is an Administration and HR Officer at the Climate Action and Energy Access (CAEA). She holds a Bachelor’s degree in Development Studies from Bahria University, Islamabad.', 'Assets/Team/grid-1-3-fiza.png', 'fizzabhutto9@gmail.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ppl-8', 'Manahil Usman', 'Associate Fossil Fuel Phaseout', 'Core Team', 'Manahil Usman is an Associate in Fossil Fuel Phaseout at Climate Action for Energy Access (CAEA), where she focuses on research and data analysis at the intersection of energy policy and climate justice.', 'Assets/Team/grid-2-3-spogmai.png', 'manahilusman2@gmail.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ppl-9', 'Abid Azim', 'Finance Officer', 'Core Team', 'Abid Azim is an experienced finance professional with expertise in financial management, budgeting, financial reporting, taxation, audit, and strategic financial planning.', 'Assets/Team/grid-2-2-abid.png', 'abidazeem101@gmail.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO map_pins (id, city, leftPos, topPos, badge, description, createdAt, updatedAt) VALUES
('pin-hunza', 'HUNZA', '64%', '6%', 'HUNZA', 'Our team comes from diverse backgrounds across Gilgit-Baltistan. Climate Action & Energy Access (CAEA) is a Pakistan-based research and advocacy institute committed to empowering mountain communities through renewable energy.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pin-jalalpur', 'JALALPUR', '69%', '30%', 'JALALPUR', 'Our team works closely with agrarian communities in Jalalpur advancing decentralized solar irrigation, groundwater conservation, and community energy governance.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pin-manchhar', 'MANCHHAR', '45%', '60%', 'MANCHHAR', 'Our team works directly with freshwater fishing communities around Lake Manchhar. CAEA focuses on resilient water-energy solutions and ecological preservation.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pin-thar', 'THAR', '49%', '86%', 'THAR', 'In the Thar desert, CAEA is leading research into off-grid solar microgrids and clean drinking water access for rural and indigenous desert settlements.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pin-balochistan', 'BALOCHISTAN', '22%', '50%', 'BALOCHISTAN', 'Our upcoming project initiative exploring distributed solar and wind energy potential across western and pastoral regions.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
