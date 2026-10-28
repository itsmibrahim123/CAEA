-- ============================================================
-- CAEA Institute - Complete Production SQL Schema & Seed Dump
-- Optimized for Hostinger MySQL (phpMyAdmin), MariaDB & SQLite
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- ------------------------------------------------------------
-- 1. Table: activities
-- ------------------------------------------------------------
DROP TABLE IF EXISTS activities;
CREATE TABLE activities (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    date DATE NOT NULL,
    dateFormatted VARCHAR(32) NOT NULL,
    location VARCHAR(255) DEFAULT 'Pakistan',
    description TEXT,
    image VARCHAR(512),
    images TEXT,
    featured INTEGER DEFAULT 0,
    quote TEXT,
    quoteAuthor VARCHAR(255),
    sortOrder INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. Table: people
-- ------------------------------------------------------------
DROP TABLE IF EXISTS people;
CREATE TABLE people (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    bio TEXT,
    image VARCHAR(512),
    email VARCHAR(255),
    sortOrder INTEGER DEFAULT 0,
    showInGrid INTEGER DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3. Table: articles
-- ------------------------------------------------------------
DROP TABLE IF EXISTS articles;
CREATE TABLE articles (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    kicker VARCHAR(64) DEFAULT 'CASE STUDY',
    author VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    dateFormatted VARCHAR(32) NOT NULL,
    excerpt TEXT,
    content LONGTEXT,
    image VARCHAR(512),
    sortOrder INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 4. Table: opportunities
-- ------------------------------------------------------------
DROP TABLE IF EXISTS opportunities;
CREATE TABLE opportunities (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    type VARCHAR(64) NOT NULL,
    theme VARCHAR(32) DEFAULT 'blue',
    description TEXT,
    status VARCHAR(32) DEFAULT 'Open',
    image VARCHAR(512),
    gridArea VARCHAR(32),
    sortOrder INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 5. Table: applications
-- ------------------------------------------------------------
DROP TABLE IF EXISTS applications;
CREATE TABLE applications (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
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
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 6. Table: media
-- ------------------------------------------------------------
DROP TABLE IF EXISTS media;
CREATE TABLE media (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    path VARCHAR(512) NOT NULL,
    tags TEXT,
    date DATE,
    sortOrder INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 7. Table: map_pins
-- ------------------------------------------------------------
DROP TABLE IF EXISTS map_pins;
CREATE TABLE map_pins (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    city VARCHAR(255) NOT NULL,
    leftPos VARCHAR(32) NOT NULL,
    topPos VARCHAR(32) NOT NULL,
    badge VARCHAR(255) NOT NULL,
    description TEXT,
    sortOrder INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 8. Table: page_settings
-- ------------------------------------------------------------
DROP TABLE IF EXISTS page_settings;
CREATE TABLE page_settings (
    pageKey VARCHAR(64) NOT NULL PRIMARY KEY,
    settingsJson LONGTEXT NOT NULL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 9. Table: fossil_article_links
-- ------------------------------------------------------------
DROP TABLE IF EXISTS fossil_article_links;
CREATE TABLE fossil_article_links (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publisher VARCHAR(255) NOT NULL,
    badge VARCHAR(64) DEFAULT 'ARTICLE',
    category VARCHAR(64) DEFAULT 'articles',
    url TEXT NOT NULL,
    description TEXT,
    sortOrder INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 10. Table: climate_article_links
-- ------------------------------------------------------------
DROP TABLE IF EXISTS climate_article_links;
CREATE TABLE climate_article_links (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publisher VARCHAR(255) NOT NULL,
    badge VARCHAR(64) DEFAULT 'THE NEWS',
    category VARCHAR(64) DEFAULT 'articles',
    url TEXT NOT NULL,
    description TEXT,
    sortOrder INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 11. Table: textile_cards
-- ------------------------------------------------------------
DROP TABLE IF EXISTS textile_cards;
CREATE TABLE textile_cards (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publisher VARCHAR(255) DEFAULT 'CAEA',
    category VARCHAR(64) DEFAULT 'Research & Reports',
    url TEXT,
    description TEXT,
    sortOrder INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- DATA INSERTIONS
-- ============================================================

-- ------------------------------------------------------------
-- 1. Activities
-- ------------------------------------------------------------
INSERT INTO activities (id, title, category, date, dateFormatted, location, description, image, images, featured, quote, quoteAuthor, sortOrder, createdAt, updatedAt) VALUES
('act-1', 'Contested Waters: Rivers, Power and Resistance', 'WORKSHOP', '2026-01-23', '23.01.2026', 'Pakistan', 'Examines how colonial and modern systems of water control through dams, barrages, and canals have transformed river ecosystems, displaced communities, and disrupted cultural relationships with water.', 'assets/media/events/contested-waters/RAY00190.JPG', '[\"assets/media/events/contested-waters/RAY00190.JPG\",\"assets/media/events/contested-waters/RAY00059.JPG\",\"assets/media/events/contested-waters/RAY00118.JPG\",\"assets/media/events/contested-waters/RAY00212.JPG\"]', 1, '“Those least responsible for climate change are worst affected by it”', 'Vandana Shiva', 1, NOW(), NOW()),
('act-2', 'Climate Justice Gathering & Retreat', 'RETREAT', '2026-04-23', '23.04.2026', 'Pakistan', 'A 3-day retreat for climate activists and community organizers across Pakistan to reflect, reconnect with nature, and discuss energy, climate stories, burnout, and movement building.', 'assets/media/events/retreat/DSCF4154.JPG', '[\"assets/media/events/retreat/DSCF4154.JPG\",\"assets/media/events/retreat/DSCF3966.JPG\",\"assets/media/events/retreat/DSCF4356.JPG\",\"assets/media/events/retreat/DSCF4512.JPG\"]', 0, '“Reconnecting with land and community to build resilience against climate burnout”', 'CAEA Movement Gathering', 2, NOW(), NOW()),
('act-3', 'Kacheri: Manchar Sunvai', 'COMMUNITY KACHERI', '2026-05-20', '20.05.2026', 'Lake Manchhar, Sindh', 'Discussion on the ecological destruction of Lake Manchhar, changes in water flow, infrastructure development, agricultural wastewater, and community-led resistance.', 'assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.18 PM.jpeg', '[\"assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.18 PM.jpeg\",\"assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.18 PM (1).jpeg\",\"assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.18 PM (2).jpeg\",\"assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.28 PM.jpeg\"]', 0, '“Manchhar is a mindful lake, yet it bears the heaviest burden of industrial discharge”', 'Lake Manchhar Fisherman Community', 3, NOW(), NOW()),
('act-4', 'Exposure Visit to Tarbela Dam', 'EXPOSURE VISIT', '2026-07-28', '28.07.2026', 'Tarbela Dam', 'Brought together perspectives from WAPDA and displaced communities to examine Tarbela''s promises of power vs. its costs on land, livelihoods, culture, and ecosystems.', 'assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.56 PM.jpeg', '[\"assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.56 PM.jpeg\",\"assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.57 PM (1).jpeg\",\"assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.58 PM (2).jpeg\",\"assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.59 PM.jpeg\"]', 0, '“Uncovering the true human and ecological costs behind megastructures of power”', 'Tarbela Exposure Delegation', 4, NOW(), NOW());

-- ------------------------------------------------------------
-- 2. People & Leadership
-- ------------------------------------------------------------
INSERT INTO people (id, name, role, category, bio, image, email, sortOrder, showInGrid, createdAt, updatedAt) VALUES
('ppl-1', 'Sanaa’i Muhammad', 'Founder & CEO', 'Executive', 'Sanaa’i Muhammad is the Founder and Chief Executive Officer of the Climate Action & Energy Access Institute (CAEA), where she leads advocacy, and movement-building at the intersection of energy transition and climate justice in Pakistan. Her work focuses on phasing out fossil gas in power, industry, and households; advancing renewable energy pathways; and building public understanding of how colonial infrastructures, financial institutions, and policy choices shape today’s climate and energy crises.\n\nHer work is rooted in a commitment to just transitions, energy equity, and amplifying the experiences of communities most affected by environmental harm. She writes, organizes, and teaches with the belief that climate justice is inseparable from economic democracy, gender justice, and people’s sovereignty over energy and resources.', 'assets/team/grid-1-2-Sanaa.png', 'sanaaimuhammad@climateactionenergyaccess.org', 1, 1, NOW(), NOW()),
('ppl-2', 'Kamran Aziz', 'Founding Partner & Director Research', 'Core Team', 'Kamran Aziz is the Director Research and a founding partner, working at the intersection of Pakistan’s electricity and gas systems, with a focus on advancing a just energy transition. His work combines historical analysis, political economy, and the lived experiences of communities directly affected by fossil fuel extraction and its social and environmental harms. His research is grounded in a commitment to center frontline communities, democratize energy governance, and support policy transformations aligned with climate justice.', 'assets/team/grid-2-1-kamran.png', 'kamranaziz@climateactionenergyaccess.org', 2, 1, NOW(), NOW()),
('ppl-3', 'Muhammad Asad', 'Research Associate', 'Core Team', 'Asad is a law graduate from IIUI and a committed worker organizing with the oppressed communities.', 'assets/team/grid-3-2-muhammad.png', 'asadjuttah@climateactionenergyaccess.org', 3, 1, NOW(), NOW()),
('ppl-4', 'Hamna Anwaar', 'Textile Associate', 'Core Team', 'Hamna has a bachelors in environmental engineering from NUST and is a passionate environmentalist. Her commitment to addressing critical issues such as climate change, and sustainability has only deepened with her academic journey.', 'assets/team/grid-1-1-hamna.png', 'hamnaanwar@climateactionenergyaccess.org', 4, 1, NOW(), NOW()),
('ppl-5', 'Muhammad Saeed', 'Climate Justice Lead', 'Core Team', 'Muhammad Saeed is an PHD Scholar whose research focuses on the intricate relationship between water, identity, and politics, specifically exploring "Sindhu and the making of Sindhi nationalism: River Politics during the colonial era.', 'assets/team/grid-3-2-muhammad.png', 'guramanisaeed98@gmail.com', 5, 1, NOW(), NOW()),
('ppl-6', 'Muaaz Ahmad Khan', 'Communication Lead', 'Core Team', 'Muaaz Ahmad Khan is currently pursuing his MPhil in Government and Public Policy. He works as the Communication Lead and Social Media & Networks Coordinator at CAEA.', 'assets/team/grid-3-3-muaz.png', 'khanmuaaz762@gmail.com', 6, 1, NOW(), NOW()),
('ppl-7', 'Fizza Aman Bhutto', 'Admin & HR Officer', 'Core Team', 'Fizza Aman Bhutto is an Administration and HR Officer at the Climate Action and Energy Access (CAEA). She holds a Bachelor’s degree in Development Studies from Bahria University, Islamabad. Her development sector experience spans program coordination, engagement with Indigenous communities, and research on climate-induced disasters, with her undergraduate research focusing on the devastating 2022 floods in Pakistan. At CAEA, she works across administration, human resources, project coordination, and organizational development. She is particularly interested in the intersections of climate justice, development, and organizational development, and in how stronger, people-centered organizations can contribute to a more equitable and sustainable change.', 'assets/team/grid-1-3-fiza.png', 'fizzabhutto9@gmail.com', 7, 1, NOW(), NOW()),
('ppl-8', 'Manahil Usman', 'Associate Fossil Fuel Phaseout', 'Core Team', 'Manahil Usman is an Associate in Fossil Fuel Phaseout at Climate Action for Energy Access (CAEA), where she focuses on research and data analysis at the intersection of energy policy and climate justice. With a background in Computer Science and an MBA, she brings an analytical foundation shaped by prior work in data management and sector-level analysis to her current focus on Pakistan''s gas sector, LNG dynamics, and just transition frameworks. At CAEA, Manahil is committed to building the evidence base needed to advance credible, equitable fossil fuel phaseout policy in Pakistan and beyond.', 'assets/CAEA-Navbar-Logo.png', 'manahilusman2@gmail.com', 8, 1, NOW(), NOW()),
('ppl-9', 'Abid Azim', 'Finance Officer', 'Core Team', 'Abid Azim is an experienced finance professional with expertise in financial management, budgeting, financial reporting, taxation, audit, and strategic financial planning. He has been serving as Finance Manager at Climate Action and Energy Access LLP since May 2024, where he oversees financial analysis, budgeting, cash-flow management, financial reporting, and tax compliance. With professional experience spanning finance, audit, accounting, and business management, Abid brings a strong analytical and results-oriented approach to supporting organizational growth and sustainability. He is a Certified Public Accountant (CPA) from England & Wales and a finalist of ICAEW.', 'assets/team/grid-2-2-abid.png', 'abidazeem101@gmail.com', 9, 1, NOW(), NOW());

-- ------------------------------------------------------------
-- 3. Articles & Publications
-- ------------------------------------------------------------
INSERT INTO articles (id, title, subtitle, kicker, author, date, dateFormatted, excerpt, content, image, sortOrder, createdAt, updatedAt) VALUES
('art-1', 'The Cost of Gas: How Subsidies Shape Pakistan’s Energy Crisis', 'Analysis of circular debt and industrial consumption patterns', 'POLICY BRIEF', 'Kamran Aziz & Sanaa’i Muhammad', '2024-02-10', '10.02.2024', 'A comprehensive review of Pakistan’s domestic natural gas allocation and its economic burden on working-class households.', 'Natural gas has long been treated as an abundant domestic resource in Pakistan. However, decades of preferential allocation and depleting reserves have precipitated a severe energy crisis. This paper unpacks the structural dependencies and policy lock-ins that sustain fossil reliance at the expense of equitable public energy transition.', 'assets/Hero-image.png', 1, NOW(), NOW()),
('art-2', 'How Water Became Power', 'The Political Economy of Freshwater Resources in Sindh', 'CASE STUDY', 'Waseem Ul Haq', '2024-03-15', '15.03.2024', 'An investigation into how large development projects have impacted aquatic ecosystems and fishing livelihoods around Lake Manchhar.', 'Lake Manchhar is located in Sindh between the Dadu and Khanpur districts. Manchhar comes from the Sindhi words Man meaning mind and Chhar meaning lake or pond. Manchhar translates to "mindful lake". It is the largest natural freshwater lake in Asia. This case study details the socio-ecological disruptions inflicted by industrial runoff and upstream water diversion.', 'assets/how-water-became-power-ai.jpg', 2, NOW(), NOW());

-- ------------------------------------------------------------
-- 4. Opportunities (Get Involved)
-- ------------------------------------------------------------
INSERT INTO opportunities (id, title, subtitle, category, type, theme, description, status, image, gridArea, sortOrder, createdAt, updatedAt) VALUES
('opp-1', 'Climate Justice Junior Associate', 'FULL TIME · APPLICATIONS OPEN', 'Core Team & Field Research', 'Full-Time', 'blue', 'We are looking for someone to work directly with communities on climate and energy issues through field visits, research, and helping people''s voices reach the right places.', 'Open', '', 'card1', 1, NOW(), NOW()),
('opp-2', 'KACHERI: Registration Open', 'UPCOMING', 'Community Gathering', 'Event / Gathering', 'black', 'A space for communities to talk openly about the climate justice and energy issues affecting them. Come listen, share, or just be part of the conversation.', 'Open', '', 'card2', 2, NOW(), NOW()),
('opp-3', 'Volunteer With Us', 'UPCOMING', 'Community Outreach & Events', 'Volunteering', 'black', 'Are you interested in working with CAEA as a volunteer? Help us with events, outreach, and field work on the ground. No experience needed, just time and interest.', 'Open', '', 'card3', 3, NOW(), NOW()),
('opp-4', 'Intern With Us', 'UPCOMING', 'Fellowship & Research', 'Internship', 'blue', 'We''re looking for passionate, curious interns looking to be a part of the climate justice movement in Pakistan. Whether your strengths lie in research, storytelling, design, communications, advocacy, or community engagement, there''s space for you here.', 'Open', 'assets/how-water-became-power.jpg', 'card4', 4, NOW(), NOW());

-- ------------------------------------------------------------
-- 5. Applications (Candidate Submissions)
-- ------------------------------------------------------------
INSERT INTO applications (id, fullName, email, phone, city, opportunityId, opportunityTitle, category, commitment, message, experience, status, date, dateFormatted, notes, createdAt, updatedAt) VALUES
('app-1', 'Ayesha Tariq', 'ayesha.tariq@gmail.com', '+92 300 1234567', 'Karachi, Sindh', 'opp-1', 'Climate Justice Junior Associate', 'Core Team & Field Research', 'Full-Time', 'Passionate about environmental law and grassroots climate resilience in delta communities. I have led youth climate campaigns and want to contribute full-time to CAEA community research and policy work.', 'BS Environmental Sciences from LUMS; 2 years experience organizing grassroot climate awareness workshops in Sindh.', 'Under Review', '2024-09-18', '18.09.2024', 'Strong academic profile and fieldwork experience. Schedule first interview round.', NOW(), NOW()),
('app-2', 'Bilal Khan', 'bilal.khan@gmail.com', '+92 333 9876543', 'Gilgit, Gilgit-Baltistan', 'opp-2', 'KACHERI: Registration Open', 'Community Gathering', 'Flexible / Event-based', 'Would love to participate in the upcoming Kacheri discussion session to share insights on mountain community solar microgrids and equitable winter power distribution.', 'Local community representative with 3+ years in renewable energy grassroots advocacy.', 'Accepted', '2024-09-20', '20.09.2024', 'Invited as community panel speaker for northern region dialogue.', NOW(), NOW()),
('app-3', 'Zainab Fatima', 'zainab.fatima@gmail.com', '+92 321 4567890', 'Lahore, Punjab', 'opp-4', 'Intern With Us', 'Fellowship & Research', 'Part-Time', 'Interested in policy analysis on clean energy transition subsidies and public finance accountability in Pakistan.', 'Final year Economics & Public Policy student at IBA; published articles on industrial energy transition.', 'Pending', '2024-09-21', '21.09.2024', 'Under initial review by Policy Research team.', NOW(), NOW());

-- ------------------------------------------------------------
-- 6. Media Library
-- ------------------------------------------------------------
INSERT INTO media (id, title, category, path, tags, date, sortOrder, createdAt) VALUES
('med-1', 'Contested Waters Session 1', 'Events', 'assets/media/events/contested-waters/RAY00190.JPG', '[\"workshop\",\"rivers\",\"contested-waters\"]', '2026-01-23', 1, NOW()),
('med-2', 'Contested Waters Session 2', 'Events', 'assets/media/events/contested-waters/RAY00118.JPG', '[\"workshop\",\"rivers\",\"contested-waters\"]', '2026-01-23', 2, NOW()),
('med-3', 'Contested Waters Session 3', 'Events', 'assets/media/events/contested-waters/RAY00059.JPG', '[\"workshop\",\"rivers\",\"contested-waters\"]', '2026-01-23', 3, NOW()),
('med-4', 'Contested Waters Session 4', 'Events', 'assets/media/events/contested-waters/RAY00212.JPG', '[\"workshop\",\"rivers\",\"contested-waters\"]', '2026-01-23', 4, NOW()),
('med-5', 'Climate Justice Retreat 1', 'Events', 'assets/media/events/retreat/DSCF4154.JPG', '[\"retreat\",\"climate-justice\",\"gathering\"]', '2026-04-23', 5, NOW()),
('med-6', 'Climate Justice Retreat 2', 'Events', 'assets/media/events/retreat/DSCF4356.JPG', '[\"retreat\",\"climate-justice\",\"gathering\"]', '2026-04-23', 6, NOW()),
('med-7', 'Climate Justice Retreat 3', 'Events', 'assets/media/events/retreat/DSCF3966.JPG', '[\"retreat\",\"climate-justice\",\"gathering\"]', '2026-04-23', 7, NOW()),
('med-8', 'Climate Justice Retreat 4', 'Events', 'assets/media/events/retreat/DSCF4512.JPG', '[\"retreat\",\"climate-justice\",\"gathering\"]', '2026-04-23', 8, NOW()),
('med-9', 'Manchar Sunvai Kacheri 1', 'Events', 'assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.18 PM.jpeg', '[\"kacheri\",\"manchar\",\"community\"]', '2026-05-20', 9, NOW()),
('med-10', 'Manchar Sunvai Kacheri 2', 'Events', 'assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.18 PM (1).jpeg', '[\"kacheri\",\"manchar\",\"community\"]', '2026-05-20', 10, NOW()),
('med-11', 'Manchar Sunvai Kacheri 3', 'Events', 'assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.28 PM.jpeg', '[\"kacheri\",\"manchar\",\"community\"]', '2026-05-20', 11, NOW()),
('med-12', 'Manchar Sunvai Kacheri 4', 'Events', 'assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.18 PM (2).jpeg', '[\"kacheri\",\"manchar\",\"community\"]', '2026-05-20', 12, NOW()),
('med-13', 'Tarbela Dam Exposure Visit 1', 'Events', 'assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.56 PM.jpeg', '[\"tarbela\",\"exposure-visit\",\"dam\"]', '2026-07-28', 13, NOW()),
('med-14', 'Tarbela Dam Exposure Visit 2', 'Events', 'assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.57 PM (1).jpeg', '[\"tarbela\",\"exposure-visit\",\"dam\"]', '2026-07-28', 14, NOW()),
('med-15', 'Tarbela Dam Exposure Visit 3', 'Events', 'assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.58 PM (2).jpeg', '[\"tarbela\",\"exposure-visit\",\"dam\"]', '2026-07-28', 15, NOW()),
('med-16', 'Tarbela Dam Exposure Visit 4', 'Events', 'assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.59 PM.jpeg', '[\"tarbela\",\"exposure-visit\",\"dam\"]', '2026-07-28', 16, NOW()),
('med-17', 'Sanaa’i Muhammad (CEO)', 'Team', 'assets/team/grid-1-2-Sanaa.png', '[\"team\",\"leadership\",\"executive\"]', '2024-01-01', 17, NOW()),
('med-18', 'Kamran Aziz', 'Team', 'assets/team/grid-2-1-kamran.png', '[\"team\",\"operations\",\"lead\"]', '2024-01-01', 18, NOW()),
('med-19', 'Muhammad Asad', 'Team', 'assets/team/grid-3-2-muhammad.png', '[\"team\",\"research\"]', '2024-01-01', 19, NOW()),
('med-20', 'Hamna Anwaar', 'Team', 'assets/team/grid-1-1-hamna.png', '[\"team\",\"textile\",\"associate\"]', '2024-01-01', 20, NOW()),
('med-21', 'Fizza Aman Bhutto', 'Team', 'assets/team/grid-1-3-fiza.png', '[\"team\",\"admin\",\"hr\"]', '2024-01-01', 21, NOW()),
('med-22', 'Muaaz Ahmad Khan', 'Team', 'assets/team/grid-3-3-muaz.png', '[\"team\",\"communications\",\"lead\"]', '2024-01-01', 22, NOW()),
('med-23', 'Manahil Usman', 'Team', 'assets/team/grid-2-3-spogmai.png', '[\"team\",\"fossil-fuel\"]', '2024-01-01', 23, NOW()),
('med-24', 'Abid Azim', 'Team', 'assets/team/grid-2-2-abid.png', '[\"team\",\"finance\"]', '2024-01-01', 24, NOW()),
('med-25', 'Homepage Hero Banner Visual', 'Graphics', 'assets/Hero-image.png', '[\"hero\",\"graphics\",\"banner\"]', '2024-01-01', 25, NOW()),
('med-26', 'Pakistan Project Map', 'Graphics', 'assets/Pak-map.png', '[\"map\",\"pakistan\",\"projects\"]', '2024-01-01', 26, NOW()),
('med-27', 'How Water Became Power - Cover', 'Articles', 'assets/how-water-became-power.jpg', '[\"article\",\"publication\",\"water\"]', '2024-01-01', 27, NOW()),
('med-28', 'CAEA Navbar Logo', 'Graphics', 'assets/CAEA-Navbar-Logo.png', '[\"logo\",\"brand\",\"navigation\"]', '2024-01-01', 28, NOW());

-- ------------------------------------------------------------
-- 7. Map Pins (Pakistan Interactive Map)
-- ------------------------------------------------------------
INSERT INTO map_pins (id, city, leftPos, topPos, badge, description, sortOrder, createdAt, updatedAt) VALUES
('pin-hunza', 'HUNZA, GB', '64%', '7%', 'HUNZA, GB', 'Our team comes from diverse backgrounds across Gilgit-Baltistan. Climate Action & Energy Access (CAEA) is committed to empowering mountain communities through renewable energy and local climate resilience.', 1, NOW(), NOW()),
('pin-dhirkot', 'DHIRKOT, AJK', '66%', '27.5%', 'DHIRKOT, AJK', 'In Dhirkot, Azad Kashmir, CAEA works alongside local community organizers on watershed protection, community forestry, and decentralized clean energy solutions for mountain terrains.', 2, NOW(), NOW()),
('pin-tarbela', 'TARBELA, KP', '59%', '25%', 'TARBELA, KP', 'At Tarbela Dam in Khyber Pakhtunkhwa, CAEA brings together community perspectives to examine megastructure energy promises vs. its human and ecological costs on land and riverine ecosystems.', 3, NOW(), NOW()),
('pin-jalalpur', 'JALALPUR, PB', '63.5%', '34%', 'JALALPUR, PB', 'Our team works closely with agrarian communities in Jalalpur advancing decentralized solar irrigation, groundwater conservation, and community energy governance.', 4, NOW(), NOW()),
('pin-khirthar', 'KHIRTHAR, SD', '36%', '76%', 'KHIRTHAR, SD', 'Across the Khirthar Range in Sindh, CAEA investigates the impacts of fossil fuel exploration, industrial wastewater, and climate shocks on indigenous communities and fragile desert ecologies.', 5, NOW(), NOW());

-- ------------------------------------------------------------
-- 8. Page Settings & Visual Configurations
-- ------------------------------------------------------------
INSERT INTO page_settings (pageKey, settingsJson, updatedAt) VALUES
('home', '{\n  \"heroQuote\": \"The climate crisis is a call to transform the systems that brought us here.\",\n  \"heroQuoteAuthor\": \"Naomi Klein\",\n  \"quotes\": [\n    {\"text\": \"The climate crisis is a call to transform the systems that brought us here.\", \"author\": \"Naomi Klein\"},\n    {\"text\": \"What is the use of a house if you haven''t got a tolerable planet to put it on?\", \"author\": \"Vandana Shiva\"},\n    {\"text\": \"In nature''s economy, the currency is not money, it is life.\", \"author\": \"Wangari Maathai\"},\n    {\"text\": \"When we plant trees, we plant the seeds of peace and hope.\", \"author\": \"Wangari Maathai\"}\n  ],\n  \"showLatestSection\": true,\n  \"latestTitle\": \"BE A PART OF OUR LATEST\",\n  \"latestSubtitle\": \"Watch our latest field updates, community kacheri highlights, and climate documentaries across Pakistan.\",\n  \"showLatestVideo\": true,\n  \"latestVideoTitle\": \"Community Kacheri & Field Briefing\",\n  \"latestVideoDescription\": \"Experience our frontline grassroots gatherings across Pakistan, exploring public energy ownership and water justice.\",\n  \"latestVideoUrl\": \"\",\n  \"latestVideoThumbnail\": \"assets/how-water-became-power.jpg\"\n}', NOW()),
('activities', '{\n  \"showVideo\": true,\n  \"videoTitle\": \"More than a retreat (CAEA Community Documentary)\",\n  \"videoDescription\": \"No experience needed. Just a willingness to show up and act. Reconnecting with nature, exploring movement building, and building resilience against climate burnout.\",\n  \"videoUrl\": \"\",\n  \"videoThumbnail\": \"assets/how-water-became-power-ai.jpg\",\n  \"autoplayImages\": true,\n  \"imageCycleInterval\": 5000\n}', NOW()),
('ourStory', '{\n  \"teamHeaderTitle\": \"The People Who Make It Happen\",\n  \"quoteText\": \"What we cannot imagine cannot come into being.\",\n  \"quoteAuthor\": \"Hellen Keller\"\n}', NOW()),
('ourWork', '{\n  \"fossilFuel\": {\n    \"title\": \"OUR MISSION\",\n    \"subtitle\": \"Rethinking energy systems for a cleaner, fairer, and climate-resilient future.\",\n    \"description\": \"For CAEA, phasing out gas is not a distant policy idea — it is an urgent necessity. Pakistan''s growing reliance on natural gas and imported LNG (liquefied natural gas) has trapped the country in a costly system, leading to wasted resources, financial losses, and long-term debts that burden the public for years.\\n\\nThis is not only an economic problem. Producing and transporting gas releases methane, a gas that heats the planet even faster than carbon dioxide, and the communities living closest to gas fields, pipelines, and power plants bear the greatest damage.\\n\\nOur research shows that the power sector is the most important place to begin this shift. Imported LNG was meant to bring energy security, but instead it has made.\",\n    \"joinBtnText\": \"JOIN US\",\n    \"opportunityTitle\": \"General Volunteer / Open Application\",\n    \"bannerTitle\": \"FOSSIL FUEL PHASEOUT\",\n    \"bannerSubtitle\": \"Rethinking energy systems for a cleaner, fairer, and climate-resilient future.\",\n    \"bannerBtnText\": \"EXPLORE WORK\"\n  },\n  \"textile\": {\n    \"bannerTitle\": \"TEXTILE & FAST FASHION\",\n    \"bannerSubtitle\": \"Supply chain transparency, industrial captive power emissions & fair worker transitions\",\n    \"title\": \"TEXTILE & FAST FASHION\",\n    \"subtitle\": \"Rethinking energy systems for a cleaner, fairer, and climate-resilient future.\",\n    \"description\": \"At CAEA, the Climate Justice in Textiles team aims to tackle structural inequalities embedded in the textiles value chain by targeting the need for stronger regulations around energy, water, and land usage on the international, regional, and local levels. Through policy research and public campaigning, we advocate for stronger corporate accountability in the face of environmental harm and labour rights abuses. Our partnerships with students, youth climate activists, affected communities, and local consumers, help us imagine alternatives to modern-day capitalistic production that center local craft and climate-suitable methods.\",\n    \"joinBtnText\": \"JOIN US\",\n    \"opportunityTitle\": \"Textile Supply Chain Campaigner\"\n  },\n  \"climateJustice\": {\n    \"bannerTitle\": \"CLIMATE JUSTICE\",\n    \"bannerSubtitle\": \"Ecological democracy, gender equity & frontline communities'' sovereignty over resources\",\n    \"title\": \"CLIMATE JUSTICE\",\n    \"subtitle\": \"Rethinking energy systems for a cleaner, fairer, and climate-resilient future.\",\n    \"description\": \"At CAEA, we imagine climate justice beyond merely reducing emissions, compensating losses or making infrastructure resilient. We understand it as the task of refusing the conversion of living landscapes into empty, measurable and extractable space. Every ecology is also a world of knowledge, livelihood, memory, movement and social relations. Justice, therefore, asks who has the power to define a landscape’s problems, whose knowledge is recognised, who receives the benefits of an intervention and who is made to carry its violence. Climate justice means defending diverse ecologies from dispossession and restoring communities’ authority to adapt and steward the worlds that sustain them.\\n\\nPakistan inhabits different ecological worlds who are victims of the climate crises. Through intentional research, storytelling, and making a dialogic space, CAEA intends to centre the voices of communities victim of the climate crises. Part of this work involves closely examining the social and environmental costs of large infrastructure projects, costs that are often overlooked in official reports and government decisions.\\n\\nOur goal is to build narrative, shape climate conversations, and support creative reflective spaces to imagine just future that place communities, sustainability, and justice at the center of climate action.\",\n    \"joinBtnText\": \"JOIN US\",\n    \"opportunityTitle\": \"Climate Justice Organizer\"\n  },\n  \"activitiesBanner\": {\n    \"bannerTitle\": \"ACTIVITIES & GATHERINGS\",\n    \"bannerSubtitle\": \"Field retreats, community kacheris, exposure visits & workshops across Pakistan\"\n  }\n}', NOW());

-- ------------------------------------------------------------
-- 9. Fossil Article Links (Our Work)
-- ------------------------------------------------------------
INSERT INTO fossil_article_links (id, title, publisher, badge, category, url, description, sortOrder, createdAt, updatedAt) VALUES
('fl-1', 'RLNG disruption: a bane?', 'Dawn · Opinion & Analysis', 'DAWN', 'articles', 'https://www.dawn.com/news/1997175?utm_source=whatsapp', 'Published in Dawn · Investigative policy piece exploring Pakistan’s LNG disruptions.', 1, NOW(), NOW()),
('fl-2', 'Our Remarkable Natural Gas Overshoot', 'The News on Sunday · Special Report', 'THE NEWS', 'articles', 'https://www.thenews.pk/tns/detail/1397737-our-remarkable-natural-gas-overshoot', 'Published in The News on Sunday · In-depth breakdown of gas oversupply and stranded assets.', 2, NOW(), NOW()),
('fl-3', 'Political Economy of Power, Energy, Climate and Justice', 'CAEA Research Publication (PDF)', 'RESEARCH REPORT', 'research', 'https://drive.google.com/file/d/1LuXInnvuC11GMiHBM_NM4HoWxkRP_Fpa/view?usp=drive_link', 'Comprehensive research publication interrogating gas as a system of power in Pakistan.', 3, NOW(), NOW()),
('fl-4', 'CAEA Climate Action & Energy Access Dashboard', 'Live Interactive Platform', 'DATA DASHBOARD', 'dashboard', '/pages/our-analytics.html', 'Interactive data portal for real-time energy capacity, transmission data, and emissions.', 4, NOW(), NOW()),
('fl-5', 'Policy Analysis & Regulatory Briefs', 'CAEA Policy Briefs', 'POLICY ANALYSIS', 'policy', '#', 'Upcoming policy briefs, regulatory submissions to NEPRA, and power sector restructuring proposals.', 5, NOW(), NOW());

-- ------------------------------------------------------------
-- 10. Climate Justice Article Links (Our Work)
-- ------------------------------------------------------------
INSERT INTO climate_article_links (id, title, publisher, badge, category, url, description, sortOrder, createdAt, updatedAt) VALUES
('cl-1', 'The hidden cost of development', 'The News on Sunday · Special Report', 'THE NEWS', 'articles', 'https://www.thenews.com.pk/tns/detail/1023422-the-hidden-cost-of-development', 'A critical look at the social and ecological costs behind infrastructure development.', 1, NOW(), NOW()),
('cl-2', 'E-11 interchange: boon or bane?', 'The News on Sunday · Urban Ecology', 'THE NEWS', 'articles', 'https://www.thenews.com.pk/tns/detail/1074418-e-11-interchange-boon-or-bane', 'Interrogating urban infrastructure, displacement, and environmental degradation.', 2, NOW(), NOW()),
('cl-3', 'Loss and displacement', 'The News on Sunday · Climate Justice', 'THE NEWS', 'articles', 'https://www.thenews.pk/tns/detail/1390589-loss-and-displacement', 'Stories and research on frontline communities facing climate displacement.', 3, NOW(), NOW()),
('cl-4', 'The development scarcity', 'The News on Sunday · Political Economy', 'THE NEWS', 'articles', 'https://www.thenews.pk/tns/detail/1292148-the-development-scarcity', 'Unpacking the structural inequities in Pakistan’s development paradigms.', 4, NOW(), NOW()),
('cl-5', 'Living Landscapes & Community Water Rights', 'CAEA Field Research', 'RESEARCH & DOCUMENTATION', 'research', '#', 'Ongoing field investigations documenting the political ecology of the Indus Basin and community water sovereignty.', 5, NOW(), NOW()),
('cl-6', 'Legal Frameworks for Climate Loss & Damage in Pakistan', 'CAEA Legal & Policy Team', 'REPORTS', 'reports', '#', 'Policy frameworks evaluating constitutional rights, environmental tribunals, and state accountability for displaced populations.', 6, NOW(), NOW()),
('cl-7', 'Voices from the Frontlines: Lake Manchar & Beyond', 'Visual & Audio Storytelling Archive', 'MULTIMEDIA STORIES', 'multimedia', '#', 'Interactive photo essays, community audio testimonies, and visual archives capturing the lived realities of climate-hit ecologies.', 7, NOW(), NOW()),
('cl-8', 'Defending Ecologies & Community Sovereignty', 'CAEA Movement Building & Advocacy', 'CAMPAIGNS', 'campaigns', '#', 'Grassroots mobilization campaigns, community kacheris, and participatory climate justice dialogues across Pakistan.', 8, NOW(), NOW());

-- ------------------------------------------------------------
-- 11. Textile & Fast Fashion Cards (Our Work)
-- ------------------------------------------------------------
INSERT INTO textile_cards (id, title, publisher, category, url, description, sortOrder, createdAt, updatedAt) VALUES
('tex-1', 'Fashion and Fossil Fuels: Supply Chain Investigation', 'CAEA Research Publication', 'Research & Reports', 'https://drive.google.com/file/d/1LuXInnvuC11GMiHBM_NM4HoWxkRP_Fpa/view?usp=drive_link', 'Tracing synthetic fiber reliance, coal-fired industrial captive power plants, and supply chain accountability across Pakistan''s textile hubs.', 1, NOW(), NOW()),
('tex-2', 'The Carbon Thread: Fast Fashion Exploitation', 'The News on Sunday', 'Article', 'https://www.thenews.pk/tns/detail/1023422-the-hidden-cost-of-development', 'Investigating synthetic fiber reliance, coal-fired industrial captive power plants, and fair wage transitions for garment workers across industrial zones.', 2, NOW(), NOW()),
('tex-3', 'Garment Workers & Community Testimonies', 'CAEA Field Briefing', 'Testimonials', '#apply', 'First-hand oral accounts and video recordings from garment workers and fenceline communities living along polluted industrial drainage canals.', 3, NOW(), NOW()),
('tex-4', 'Demand Clean Energy & Fair Wages in Pakistan''s Textile Sector', 'CAEA Public Action', 'Sign Our Petition', '#apply', 'Join our urgent public campaign petition demanding mandatory solarization of textile power, zero liquid discharge, and living wage protections.', 4, NOW(), NOW());

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- END OF SCRIPT
-- ============================================================
