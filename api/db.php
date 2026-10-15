<?php
/**
 * CAEA Institute - Database Connector & Schema Migration
 * api/db.php
 */

require_once __DIR__ . '/config.php';

class Database {
    private static ?PDO $pdoInstance = null;

    public static function getConnection(): PDO {
        if (self::$pdoInstance !== null) {
            return self::$pdoInstance;
        }

        try {
            if (DB_DRIVER === 'sqlite') {
                $dir = dirname(SQLITE_FILE);
                if (!is_dir($dir)) {
                    mkdir($dir, 0755, true);
                }

                $pdo = new PDO('sqlite:' . SQLITE_FILE);
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
                // Enable foreign keys and WAL mode for high concurrency
                $pdo->exec('PRAGMA foreign_keys = ON;');
                $pdo->exec('PRAGMA journal_mode = WAL;');
            } else {
                $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=%s', DB_HOST, DB_PORT, DB_NAME, DB_CHARSET);
                $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]);
            }

            self::$pdoInstance = $pdo;
            self::initializeSchema($pdo);
            return self::$pdoInstance;
        } catch (PDOException $e) {
            sendErrorResponse('Database connection failed: ' . $e->getMessage(), 500);
            exit();
        }
    }

    private static function initializeSchema(PDO $pdo): void {
        // Table: activities
        $pdo->exec("CREATE TABLE IF NOT EXISTS activities (
            id VARCHAR(64) PRIMARY KEY,
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
            createdAt DATETIME,
            updatedAt DATETIME
        );");

        // Table: people
        $pdo->exec("CREATE TABLE IF NOT EXISTS people (
            id VARCHAR(64) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            role VARCHAR(255) NOT NULL,
            category VARCHAR(64) NOT NULL,
            bio TEXT,
            image VARCHAR(512),
            email VARCHAR(255),
            sortOrder INTEGER DEFAULT 0,
            showInGrid INTEGER DEFAULT 1,
            createdAt DATETIME,
            updatedAt DATETIME
        );");

        // Table: articles
        $pdo->exec("CREATE TABLE IF NOT EXISTS articles (
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
            sortOrder INTEGER DEFAULT 0,
            createdAt DATETIME,
            updatedAt DATETIME
        );");

        // Table: opportunities
        $pdo->exec("CREATE TABLE IF NOT EXISTS opportunities (
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
            sortOrder INTEGER DEFAULT 0,
            createdAt DATETIME,
            updatedAt DATETIME
        );");

        // Table: applications
        $pdo->exec("CREATE TABLE IF NOT EXISTS applications (
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
        );");

        // Table: media
        $pdo->exec("CREATE TABLE IF NOT EXISTS media (
            id VARCHAR(64) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(64) NOT NULL,
            path VARCHAR(512) NOT NULL,
            tags TEXT,
            date DATE,
            sortOrder INTEGER DEFAULT 0,
            createdAt DATETIME
        );");

        // Table: map_pins
        $pdo->exec("CREATE TABLE IF NOT EXISTS map_pins (
            id VARCHAR(64) PRIMARY KEY,
            city VARCHAR(255) NOT NULL,
            leftPos VARCHAR(32) NOT NULL,
            topPos VARCHAR(32) NOT NULL,
            badge VARCHAR(255) NOT NULL,
            description TEXT,
            sortOrder INTEGER DEFAULT 0,
            createdAt DATETIME,
            updatedAt DATETIME
        );");

        // Table: fossil_article_links
        $pdo->exec("CREATE TABLE IF NOT EXISTS fossil_article_links (
            id VARCHAR(64) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            publisher VARCHAR(255) NOT NULL,
            badge VARCHAR(64) DEFAULT 'ARTICLE',
            url TEXT NOT NULL,
            description TEXT,
            sortOrder INTEGER DEFAULT 0,
            createdAt DATETIME,
            updatedAt DATETIME
        );");

        // Table: page_settings
        $pdo->exec("CREATE TABLE IF NOT EXISTS page_settings (
            pageKey VARCHAR(64) PRIMARY KEY,
            settingsJson TEXT NOT NULL,
            updatedAt DATETIME
        );");

        // Ensure sortOrder column exists on existing database tables
        $tablesWithSortOrder = ['activities', 'people', 'articles', 'opportunities', 'media', 'map_pins', 'fossil_article_links'];
        foreach ($tablesWithSortOrder as $tbl) {
            try {
                $pdo->exec("ALTER TABLE {$tbl} ADD COLUMN sortOrder INTEGER DEFAULT 0");
            } catch (Exception $e) {
                // Column already exists
            }
        }

        // Ensure images column exists for activities gallery slideshow
        try {
            $pdo->exec("ALTER TABLE activities ADD COLUMN images TEXT");
        } catch (Exception $e) {
            // Column already exists
        }

        // Ensure showInGrid column exists for people table
        try {
            $pdo->exec("ALTER TABLE people ADD COLUMN showInGrid INTEGER DEFAULT 1");
        } catch (Exception $e) {
            // Column already exists
        }

        // Seed data if database is empty
        self::seedDatabaseIfEmpty($pdo);
    }

    private static function seedDatabaseIfEmpty(PDO $pdo): void {
        $count = $pdo->query("SELECT COUNT(*) FROM activities")->fetchColumn();
        if ($count > 0) {
            return; // Already seeded
        }

        $now = date('Y-m-d H:i:s');

        // 1. Seed Activities
        $activities = [
            [
                'id' => 'act-1',
                'title' => 'Contested Waters: Rivers, Power and Resistance',
                'category' => 'WORKSHOP',
                'date' => '2026-01-23',
                'dateFormatted' => '23.01.2026',
                'location' => 'Pakistan',
                'description' => 'Examines how colonial and modern systems of water control through dams, barrages, and canals have transformed river ecosystems, displaced communities, and disrupted cultural relationships with water.',
                'image' => 'assets/media/events/contested-waters/RAY00190.JPG',
                'featured' => 1,
                'quote' => '“Those least responsible for climate change are worst affected by it”',
                'quoteAuthor' => 'Vandana Shiva'
            ],
            [
                'id' => 'act-2',
                'title' => 'Climate Justice Gathering & Retreat',
                'category' => 'RETREAT',
                'date' => '2026-04-23',
                'dateFormatted' => '23.04.2026',
                'location' => 'Pakistan',
                'description' => 'A 3-day retreat for climate activists and community organizers across Pakistan to reflect, reconnect with nature, and discuss energy, climate stories, burnout, and movement building.',
                'image' => 'assets/media/events/retreat/DSCF4154.JPG',
                'featured' => 0,
                'quote' => '“Reconnecting with land and community to build resilience against climate burnout”',
                'quoteAuthor' => 'CAEA Movement Gathering'
            ],
            [
                'id' => 'act-3',
                'title' => 'Kacheri: Manchar Sunvai',
                'category' => 'COMMUNITY KACHERI',
                'date' => '2026-05-20',
                'dateFormatted' => '20.05.2026',
                'location' => 'Lake Manchhar, Sindh',
                'description' => 'Discussion on the ecological destruction of Lake Manchhar, changes in water flow, infrastructure development, agricultural wastewater, and community-led resistance.',
                'image' => 'assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.18 PM.jpeg',
                'featured' => 0,
                'quote' => '“Manchhar is a mindful lake, yet it bears the heaviest burden of industrial discharge”',
                'quoteAuthor' => 'Lake Manchhar Fisherman Community'
            ],
            [
                'id' => 'act-4',
                'title' => 'Exposure Visit to Tarbela Dam',
                'category' => 'EXPOSURE VISIT',
                'date' => '2026-07-28',
                'dateFormatted' => '28.07.2026',
                'location' => 'Tarbela Dam',
                'description' => 'Brought together perspectives from WAPDA and displaced communities to examine Tarbela\'s promises of power vs. its costs on land, livelihoods, culture, and ecosystems.',
                'image' => 'assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.56 PM.jpeg',
                'featured' => 0,
                'quote' => '“Uncovering the true human and ecological costs behind megastructures of power”',
                'quoteAuthor' => 'Tarbela Exposure Delegation'
            ]
        ];

        $stmt = $pdo->prepare("INSERT INTO activities (id, title, category, date, dateFormatted, location, description, image, featured, quote, quoteAuthor, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($activities as $a) {
            $stmt->execute([$a['id'], $a['title'], $a['category'], $a['date'], $a['dateFormatted'], $a['location'], $a['description'], $a['image'], $a['featured'], $a['quote'], $a['quoteAuthor'], $now, $now]);
        }

        // 2. Seed People
        $people = [
            [
                'id' => 'ppl-1',
                'name' => 'Sanaa’i Muhammad',
                'role' => 'Founder & CEO',
                'category' => 'Executive',
                'bio' => "Sanaa’i Muhammad is the Founder and Chief Executive Officer of the Climate Action & Energy Access Institute (CAEA), where she leads advocacy, and movement-building at the intersection of energy transition and climate justice in Pakistan. Her work focuses on phasing out fossil gas in power, industry, and households; advancing renewable energy pathways; and building public understanding of how colonial infrastructures, financial institutions, and policy choices shape today’s climate and energy crises.\n\nHer work is rooted in a commitment to just transitions, energy equity, and amplifying the experiences of communities most affected by environmental harm. She writes, organizes, and teaches with the belief that climate justice is inseparable from economic democracy, gender justice, and people’s sovereignty over energy and resources.",
                'image' => 'assets/team/grid-1-2-Sanaa.png',
                'email' => 'sanaaimuhammad@climateactionenergyaccess.org'
            ],
            [
                'id' => 'ppl-2',
                'name' => 'Kamran Aziz',
                'role' => 'Founding Partner & Director Research',
                'category' => 'Core Team',
                'bio' => 'Kamran Aziz is the Director Research and a founding partner, working at the intersection of Pakistan’s electricity and gas systems, with a focus on advancing a just energy transition. His work combines historical analysis, political economy, and the lived experiences of communities directly affected by fossil fuel extraction and its social and environmental harms. His research is grounded in a commitment to center frontline communities, democratize energy governance, and support policy transformations aligned with climate justice.',
                'image' => 'assets/team/grid-2-1-kamran.png',
                'email' => 'kamranaziz@climateactionenergyaccess.org'
            ],
            [
                'id' => 'ppl-3',
                'name' => 'Muhammad Asad',
                'role' => 'Research Associate',
                'category' => 'Core Team',
                'bio' => 'Asad is a law graduate from IIUI and a committed worker organizing with the oppressed communities. During his last experience as a Research Associate at Alternative Law Collective, his role involved conducting field research and supporting studies related to the land stewardship, and the concerns of communities victims of climate change and the developmental projects. He has been involved in organizing the students and the marches for their cultural and political rights. By engaging directly with communities, he has developed critical understanding of mainstream discourses around development and knowledge systems with a focus on the laws perpetuating inequalities and the local systems of justice. His role involved research and advocacy at Climate Action and Energy Access',
                'image' => 'assets/CAEA-Navbar-Logo.png',
                'email' => 'asadjuttah@climateactionenergyaccess.org'
            ],
            [
                'id' => 'ppl-4',
                'name' => 'Hamna Anwaar',
                'role' => 'Textile Associate',
                'category' => 'Core Team',
                'bio' => 'Hamna has a bachelors in environmental engineering from NUST and is a passionate environmentalist. Her commitment to addressing critical issues such as climate change, and sustainability has only deepened with her academic journey. She aspires to focus her professional efforts to bring positive change in both our society and environment. As a Textile Associate at CAEA, Hamna focuses on textile-sector emissions and the global fast-fashion supply chain. She works on research, campaigns, and public engagement strategies that highlight the social, environmental, and climate impacts of the industry, and she is committed to advocating for a more equitable and sustainable future for both people and the planet.',
                'image' => 'assets/team/grid-1-1-hamna.png',
                'email' => 'hamnaanwar@climateactionenergyaccess.org'
            ],
            [
                'id' => 'ppl-5',
                'name' => 'Muhammad Saeed',
                'role' => 'Climate Justice Lead',
                'category' => 'Core Team',
                'bio' => 'Muhammad Saeed is an PHD Scholar whose research focuses on the intricate relationship between water, identity, and politics, specifically exploring "Sindhu and the making of Sindhi nationalism: River Politics during the colonial era. His academic work explores key thematic areas including water governance, floods, river infrastructures, and hydro-power development. His research also contributes to a critical understanding of riverine identity and the historical emergence of riverine movements, with a specific focus on the intersection of water and nationalism. Beyond his scholarship, Saeed is a political activist committed to organizing with oppressed communities, nations and people. He is currently serving as a Climate justice Lead at Climate Action and Energy Access, where his work involves both research and advocacy for equitable climate and energy solutions. His direct engagement with communities and academic study inform a critical perspective on mainstream development narratives and knowledge systems, particularly concerning the policies that impact vulnerable populations and perpetuate inequalities.',
                'image' => 'assets/team/grid-3-2-muhammad.png',
                'email' => 'guramanisaeed98@gmail.com'
            ],
            [
                'id' => 'ppl-6',
                'name' => 'Muaaz Ahmad Khan',
                'role' => 'Communication Lead',
                'category' => 'Core Team',
                'bio' => 'Muaaz Ahmad Khan is currently pursuing his MPhil in Government and Public Policy. He works as the Communication Lead and Social Media & Networks Coordinator at CAEA. His work focuses on communicating CAEA’s research and campaigns, managing its digital platforms and network groups, and working with partners on joint communication initiatives. He works closely with the research and campaign teams to turn complex ideas and research into clear and engaging content. Through his work, he contributes to CAEA’s efforts to strengthen a people-centered climate justice movement.',
                'image' => 'assets/team/grid-3-3-muaz.png',
                'email' => 'khanmuaaz762@gmail.com'
            ],
            [
                'id' => 'ppl-7',
                'name' => 'Fizza Aman Bhutto',
                'role' => 'Admin & HR Officer',
                'category' => 'Core Team',
                'bio' => 'Fizza Aman Bhutto is an Administration and HR Officer at the Climate Action and Energy Access (CAEA). She holds a Bachelor’s degree in Development Studies from Bahria University, Islamabad. Her development sector experience spans program coordination, engagement with Indigenous communities, and research on climate-induced disasters, with her undergraduate research focusing on the devastating 2022 floods in Pakistan. At CAEA, she works across administration, human resources, project coordination, and organizational development. She is particularly interested in the intersections of climate justice, development, and organizational development, and in how stronger, people-centered organizations can contribute to a more equitable and sustainable change.',
                'image' => 'assets/team/grid-1-3-fiza.png',
                'email' => 'fizzabhutto9@gmail.com'
            ],
            [
                'id' => 'ppl-8',
                'name' => 'Manahil Usman',
                'role' => 'Associate Fossil Fuel Phaseout',
                'category' => 'Core Team',
                'bio' => "Manahil Usman is an Associate in Fossil Fuel Phaseout at Climate Action for Energy Access (CAEA), where she focuses on research and data analysis at the intersection of energy policy and climate justice. With a background in Computer Science and an MBA, she brings an analytical foundation shaped by prior work in data management and sector-level analysis to her current focus on Pakistan's gas sector, LNG dynamics, and just transition frameworks. At CAEA, Manahil is committed to building the evidence base needed to advance credible, equitable fossil fuel phaseout policy in Pakistan and beyond.",
                'image' => 'assets/CAEA-Navbar-Logo.png',
                'email' => 'manahilusman2@gmail.com'
            ],
            [
                'id' => 'ppl-9',
                'name' => 'Abid Azim',
                'role' => 'Finance Officer',
                'category' => 'Core Team',
                'bio' => 'Abid Azim is an experienced finance professional with expertise in financial management, budgeting, financial reporting, taxation, audit, and strategic financial planning. He has been serving as Finance Manager at Climate Action and Energy Access LLP since May 2024, where he oversees financial analysis, budgeting, cash-flow management, financial reporting, and tax compliance. With professional experience spanning finance, audit, accounting, and business management, Abid brings a strong analytical and results-oriented approach to supporting organizational growth and sustainability. He is a Certified Public Accountant (CPA) from England & Wales and a finalist of ICAEW.',
                'image' => 'assets/team/grid-2-2-abid.png',
                'email' => 'abidazeem101@gmail.com'
            ]
        ];

        $stmt = $pdo->prepare("INSERT INTO people (id, name, role, category, bio, image, email, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($people as $p) {
            $stmt->execute([$p['id'], $p['name'], $p['role'], $p['category'], $p['bio'], $p['image'], $p['email'], $now, $now]);
        }

        // 3. Seed Articles
        $articles = [
            [
                'id' => 'art-1',
                'title' => 'The Cost of Gas: How Subsidies Shape Pakistan’s Energy Crisis',
                'subtitle' => 'Analysis of circular debt and industrial consumption patterns',
                'kicker' => 'POLICY BRIEF',
                'author' => 'Kamran Aziz & Sanaa’i Muhammad',
                'date' => '2024-02-10',
                'dateFormatted' => '10.02.2024',
                'excerpt' => 'A comprehensive review of Pakistan’s domestic natural gas allocation and its economic burden on working-class households.',
                'content' => 'Natural gas has long been treated as an abundant domestic resource in Pakistan. However, decades of preferential allocation and depleting reserves have precipitated a severe energy crisis.',
                'image' => 'assets/Hero-image.png'
            ],
            [
                'id' => 'art-2',
                'title' => 'How Water Became Power',
                'subtitle' => 'The Political Economy of Freshwater Resources in Sindh',
                'kicker' => 'CASE STUDY',
                'author' => 'Waseem Ul Haq',
                'date' => '2024-03-15',
                'dateFormatted' => '15.03.2024',
                'excerpt' => 'An investigation into how large development projects have impacted aquatic ecosystems and fishing livelihoods around Lake Manchhar.',
                'content' => 'Lake Manchhar is located in Sindh between the Dadu and Khanpur districts. Manchhar comes from the Sindhi words Man meaning mind and Chhar meaning lake or pond. Manchhar translates to "mindful lake". It is the largest natural freshwater lake in Asia.',
                'image' => 'assets/how-water-became-power-ai.jpg'
            ]
        ];

        $stmt = $pdo->prepare("INSERT INTO articles (id, title, subtitle, kicker, author, date, dateFormatted, excerpt, content, image, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($articles as $art) {
            $stmt->execute([$art['id'], $art['title'], $art['subtitle'], $art['kicker'], $art['author'], $art['date'], $art['dateFormatted'], $art['excerpt'], $art['content'], $art['image'], $now, $now]);
        }

        // 4. Seed Opportunities
        $opportunities = [
            [
                'id' => 'opp-1',
                'title' => 'Climate Justice Junior Associate',
                'subtitle' => 'FULL TIME · APPLICATIONS OPEN',
                'category' => 'Core Team & Field Research',
                'type' => 'Full-Time',
                'theme' => 'blue',
                'description' => 'We are looking for someone to work directly with communities on climate and energy issues through field visits, research, and helping people\'s voices reach the right places.',
                'status' => 'Open',
                'image' => '',
                'gridArea' => 'card1'
            ],
            [
                'id' => 'opp-2',
                'title' => 'KACHERI: Registration Open',
                'subtitle' => 'UPCOMING',
                'category' => 'Community Gathering',
                'type' => 'Event / Gathering',
                'theme' => 'black',
                'description' => 'A space for communities to talk openly about the climate justice and energy issues affecting them. Come listen, share, or just be part of the conversation.',
                'status' => 'Open',
                'image' => '',
                'gridArea' => 'card2'
            ],
            [
                'id' => 'opp-3',
                'title' => 'Volunteer With Us',
                'subtitle' => 'UPCOMING',
                'category' => 'Community Outreach & Events',
                'type' => 'Volunteering',
                'theme' => 'black',
                'description' => 'Are you interested in working with CAEA as a volunteer? Help us with events, outreach, and field work on the ground. No experience needed, just time and interest.',
                'status' => 'Open',
                'image' => '',
                'gridArea' => 'card3'
            ],
            [
                'id' => 'opp-4',
                'title' => 'Intern With Us',
                'subtitle' => 'UPCOMING',
                'category' => 'Fellowship & Research',
                'type' => 'Internship',
                'theme' => 'blue',
                'description' => 'We\'re looking for passionate, curious interns looking to be a part of the climate justice movement in Pakistan. Whether your strengths lie in research, storytelling, design, communications, advocacy, or community engagement, there\'s space for you here.',
                'status' => 'Open',
                'image' => 'assets/how-water-became-power.jpg',
                'gridArea' => 'card4'
            ]
        ];

        $stmt = $pdo->prepare("INSERT INTO opportunities (id, title, subtitle, category, type, theme, description, status, image, gridArea, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($opportunities as $opp) {
            $stmt->execute([$opp['id'], $opp['title'], $opp['subtitle'], $opp['category'], $opp['type'], $opp['theme'], $opp['description'], $opp['status'], $opp['image'], $opp['gridArea'], $now, $now]);
        }

        // 5. Seed Applications
        $applications = [
            [
                'id' => 'app-1',
                'fullName' => 'Ayesha Tariq',
                'email' => 'ayesha.tariq@gmail.com',
                'phone' => '+92 300 1234567',
                'city' => 'Karachi, Sindh',
                'opportunityId' => 'opp-1',
                'opportunityTitle' => 'Climate Justice Junior Associate',
                'category' => 'Core Team & Field Research',
                'commitment' => 'Full-Time',
                'message' => 'Passionate about environmental law and grassroots climate resilience in delta communities. I have led youth climate campaigns and want to contribute full-time to CAEA community research and policy work.',
                'experience' => 'BS Environmental Sciences from LUMS; 2 years experience organizing grassroot climate awareness workshops in Sindh.',
                'status' => 'Under Review',
                'date' => '2024-09-18',
                'dateFormatted' => '18.09.2024',
                'notes' => 'Strong background in grassroots workshop facilitation. Scheduled for second-round discussion.'
            ],
            [
                'id' => 'app-2',
                'fullName' => 'Bilal Hassan',
                'email' => 'bilal.hassan@gmail.com',
                'phone' => '+92 333 9876543',
                'city' => 'Gilgit, Gilgit-Baltistan',
                'opportunityId' => 'opp-2',
                'opportunityTitle' => 'KACHERI: Registration Open',
                'category' => 'Community Gathering',
                'commitment' => 'Flexible',
                'message' => 'Want to contribute community narratives from high mountain valleys experiencing glacier melt and flash floods.',
                'experience' => 'Community leader and mountain guide with direct experience in disaster recovery and local climate adaptation.',
                'status' => 'Accepted',
                'date' => '2024-09-19',
                'dateFormatted' => '19.09.2024',
                'notes' => 'Invited as community panel speaker for northern region dialogue.'
            ],
            [
                'id' => 'app-3',
                'fullName' => 'Zainab Fatima',
                'email' => 'zainab.fatima@gmail.com',
                'phone' => '+92 321 4567890',
                'city' => 'Lahore, Punjab',
                'opportunityId' => 'opp-4',
                'opportunityTitle' => 'Intern With Us',
                'category' => 'Fellowship & Research',
                'commitment' => 'Part-Time',
                'message' => 'Interested in policy analysis on clean energy transition subsidies and public finance accountability in Pakistan.',
                'experience' => 'Final year Economics & Public Policy student at IBA; published articles on industrial energy transition.',
                'status' => 'Pending',
                'date' => '2024-09-21',
                'dateFormatted' => '21.09.2024',
                'notes' => 'Under initial review by Policy Research team.'
            ]
        ];

        $stmt = $pdo->prepare("INSERT INTO applications (id, fullName, email, phone, city, opportunityId, opportunityTitle, category, commitment, message, experience, status, date, dateFormatted, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($applications as $app) {
            $stmt->execute([$app['id'], $app['fullName'], $app['email'], $app['phone'], $app['city'], $app['opportunityId'], $app['opportunityTitle'], $app['category'], $app['commitment'], $app['message'], $app['experience'], $app['status'], $app['date'], $app['dateFormatted'], $app['notes'], $now, $now]);
        }

        // 6. Seed Map Pins
        $mapPins = [
            [
                'id' => 'pin-hunza',
                'city' => 'HUNZA, GB',
                'leftPos' => '64%',
                'topPos' => '6%',
                'badge' => 'HUNZA, GB',
                'description' => 'Our team comes from diverse backgrounds across Gilgit-Baltistan. Climate Action & Energy Access (CAEA) is committed to empowering mountain communities through renewable energy and local climate resilience.'
            ],
            [
                'id' => 'pin-dhirkot',
                'city' => 'DHIRKOT, AJK',
                'leftPos' => '70%',
                'topPos' => '18%',
                'badge' => 'DHIRKOT, AJK',
                'description' => 'In Dhirkot, Azad Kashmir, CAEA works alongside local community organizers on watershed protection, community forestry, and decentralized clean energy solutions for mountain terrains.'
            ],
            [
                'id' => 'pin-tarbela',
                'city' => 'TARBELA, KP',
                'leftPos' => '56%',
                'topPos' => '20%',
                'badge' => 'TARBELA, KP',
                'description' => 'At Tarbela Dam in Khyber Pakhtunkhwa, CAEA brings together community perspectives to examine megastructure energy promises vs. its human and ecological costs on land and riverine ecosystems.'
            ],
            [
                'id' => 'pin-jalalpur',
                'city' => 'JALALPUR, PB',
                'leftPos' => '66%',
                'topPos' => '34%',
                'badge' => 'JALALPUR, PB',
                'description' => 'Our team works closely with agrarian communities in Jalalpur advancing decentralized solar irrigation, groundwater conservation, and community energy governance.'
            ],
            [
                'id' => 'pin-khirthar',
                'city' => 'KHIRTHAR, SD',
                'leftPos' => '42%',
                'topPos' => '68%',
                'badge' => 'KHIRTHAR, SD',
                'description' => 'Across the Khirthar Range in Sindh, CAEA investigates the impacts of fossil fuel exploration, industrial wastewater, and climate shocks on indigenous communities and fragile desert ecologies.'
            ]
        ];

        $stmt = $pdo->prepare("INSERT INTO map_pins (id, city, leftPos, topPos, badge, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($mapPins as $pin) {
            $stmt->execute([$pin['id'], $pin['city'], $pin['leftPos'], $pin['topPos'], $pin['badge'], $pin['description'], $now, $now]);
        }

        // 7. Seed Page Settings
        $pageSettings = [
            'home' => [
                'heroQuote' => 'The climate crisis is a call to transform the systems that brought us here.',
                'heroQuoteAuthor' => 'Naomi Klein',
                'quotes' => [
                    ['text' => 'The climate crisis is a call to transform the systems that brought us here.', 'author' => 'Naomi Klein'],
                    ['text' => 'What is the use of a house if you haven\'t got a tolerable planet to put it on?', 'author' => 'Vandana Shiva'],
                    ['text' => 'In nature\'s economy, the currency is not money, it is life.', 'author' => 'Wangari Maathai'],
                    ['text' => 'When we plant trees, we plant the seeds of peace and hope.', 'author' => 'Wangari Maathai']
                ],
                'showLatestSection' => true,
                'latestTitle' => 'BE A PART OF OUR LATEST',
                'latestSubtitle' => 'Watch our latest field updates, community kacheri highlights, and climate documentaries across Pakistan.',
                'showLatestVideo' => true,
                'latestVideoTitle' => 'Community Kacheri & Field Briefing',
                'latestVideoDescription' => 'Experience our frontline grassroots gatherings across Pakistan, exploring public energy ownership and water justice.',
                'latestVideoUrl' => '',
                'latestVideoThumbnail' => 'assets/how-water-became-power.jpg'
            ],
            'activities' => [
                'showVideo' => true,
                'videoTitle' => 'More than a retreat (CAEA Community Documentary)',
                'videoDescription' => 'No experience needed. Just a willingness to show up and act. Reconnecting with nature, exploring movement building, and building resilience against climate burnout.',
                'videoUrl' => '',
                'videoThumbnail' => 'assets/how-water-became-power-ai.jpg',
                'autoplayImages' => true,
                'imageCycleInterval' => 5000
            ],
            'ourStory' => [
                'teamHeaderTitle' => 'The People Who Make It Happen',
                'quoteText' => 'What we cannot imagine cannot come into being.',
                'quoteAuthor' => 'Hellen Keller'
            ],
            'ourWork' => [
                'fossilFuel' => [
                    'title' => 'OUR MISSION',
                    'subtitle' => 'Rethinking energy systems for a cleaner, fairer, and climate-resilient future.',
                    'description' => "For CAEA, phasing out gas is not a distant policy idea — it is an urgent necessity. Pakistan's growing reliance on natural gas and imported LNG (liquefied natural gas) has trapped the country in a costly system, leading to wasted resources, financial losses, and long-term debts that burden the public for years.\n\nThis is not only an economic problem. Producing and transporting gas releases methane, a gas that heats the planet even faster than carbon dioxide, and the communities living closest to gas fields, pipelines, and power plants bear the greatest damage.\n\nOur research shows that the power sector is the most important place to begin this shift. Imported LNG was meant to bring energy security, but instead it has made.",
                    'joinBtnText' => 'JOIN US',
                    'opportunityTitle' => 'General Volunteer / Open Application',
                    'bannerTitle' => 'FOSSIL FUEL',
                    'bannerSubtitle' => 'Rethinking energy systems for a cleaner, fairer, and climate-resilient future.',
                    'bannerBtnText' => 'EXPLORE WORK'
                ],
                'textile' => [
                    'bannerTitle' => 'TEXTILE & FAST FASHION',
                    'bannerSubtitle' => 'Supply chain transparency, industrial captive power emissions & fair worker transitions',
                    'title' => 'TEXTILE & FAST FASHION',
                    'subtitle' => 'Rethinking energy systems for a cleaner, fairer, and climate-resilient future.',
                    'description' => "The fashion industry today is built on deep-rooted injustice. What was once rooted in craft and creativity has become a system driven by fast, cheap consumption — and someone always pays the price.\n\nFast fashion runs on a global chain of exploitation. To meet demand from wealthier countries, factories in places like Pakistan push workers to their limits under poor and unsafe conditions. This exploitation also plays out locally: resources and labor move from less-developed regions to more industrialized ones, often with little fair compensation. Raw materials drawn from these regions rarely benefit the communities they come from.\n\nOur work traces this entire supply chain — from where raw materials are extracted, to where garments are made, to where they are sold — to expose these hidden patterns of extraction and inequality. By sharing the stories of the people and places usually left out of the conversation, we aim to build momentum for a fairer, more equitable alternative to the current system.",
                    'joinBtnText' => 'JOIN US',
                    'opportunityTitle' => 'Textile Sector Researcher',
                    'sectionHeading' => 'Working towards a future for sustainable textile practices',
                    'sectionIntro' => 'Our efforts are targeted towards creating dialogue and impact thereby. A just energy future starts with you.',
                    'cards' => [
                        [
                            'id' => 'tex-1',
                            'title' => 'Fashion and Fossil Fuels',
                            'description' => 'Climate Action & Energy Access (CAEA) is a Pakistan-based research and advocacy institute committed to transparent supply chain accountability.',
                            'btnText' => 'WATCH NOW',
                            'targetOpportunity' => 'Textile Watch',
                            'videoUrl' => ''
                        ],
                        [
                            'id' => 'tex-2',
                            'title' => 'Fashion and Fossil Fuels',
                            'description' => 'Investigating synthetic fiber reliance, coal-fired industrial captive power plants, and fair wage transitions for garment workers.',
                            'btnText' => 'WATCH NOW',
                            'targetOpportunity' => 'Textile Watch',
                            'videoUrl' => ''
                        ],
                        [
                            'id' => 'tex-3',
                            'title' => 'Fashion and Fossil Fuels',
                            'description' => 'Advocating for clean industrial energy microgrids and community-led environmental auditing across Pakistan\'s textile hubs.',
                            'btnText' => 'WATCH NOW',
                            'targetOpportunity' => 'Textile Watch',
                            'videoUrl' => ''
                        ]
                    ]
                ],
                'climateJustice' => [
                    'bannerTitle' => 'CLIMATE JUSTICE',
                    'bannerSubtitle' => "Ecological democracy, gender equity & frontline communities' sovereignty over resources",
                    'title' => 'CLIMATE JUSTICE',
                    'subtitle' => 'Rethinking energy systems for a cleaner, fairer, and climate-resilient future.',
                    'description' => "At CAEA, we imagine climate justice beyond merely reducing emissions, compensating losses or making infrastructure resilient. We understand it as the task of refusing the conversion of living landscapes into empty, measurable and extractable space. Every ecology is also a world of knowledge, livelihood, memory, movement and social relations. Justice, therefore, asks who has the power to define a landscape’s problems, whose knowledge is recognised, who receives the benefits of an intervention and who is made to carry its violence. Climate justice means defending diverse ecologies from dispossession and restoring communities’ authority to adapt and steward the worlds that sustain them.\n\nPakistan inhabits different ecological worlds who are victims of the climate crises. Through intentional research, storytelling, and making a dialogic space, CAEA intends to centre the voices of communities victim of the climate crises. Part of this work involves closely examining the social and environmental costs of large infrastructure projects, costs that are often overlooked in official reports and government decisions.\n\nOur goal is to build narrative, shape climate conversations, and support creative reflective spaces to imagine just future that place communities, sustainability, and justice at the center of climate action.",
                    'joinBtnText' => 'JOIN US',
                    'opportunityTitle' => 'Climate Justice Organizer'
                ],
                'activitiesBanner' => [
                    'bannerTitle' => 'ACTIVITIES & GATHERINGS',
                    'bannerSubtitle' => 'Field retreats, community kacheris, exposure visits & workshops across Pakistan'
                ]
            ]
        ];

        $stmt = $pdo->prepare("INSERT INTO page_settings (pageKey, settingsJson, updatedAt) VALUES (?, ?, ?)");
        foreach ($pageSettings as $pageKey => $settings) {
            $stmt->execute([$pageKey, json_encode($settings, JSON_UNESCAPED_UNICODE), $now]);
        }

        // 8. Seed Fossil Article Links
        $fossilLinks = [
            [
                'id' => 'fl-1',
                'title' => 'RLNG disruption: a bane?',
                'publisher' => 'Dawn',
                'badge' => 'ARTICLE',
                'url' => 'https://www.dawn.com/news/1997175?utm_source=whatsapp',
                'description' => 'Published in Dawn · Investigative policy piece exploring Pakistan’s LNG disruptions.',
                'sortOrder' => 1
            ],
            [
                'id' => 'fl-2',
                'title' => 'Our Remarkable Natural Gas Overshoot',
                'publisher' => 'The News on Sunday',
                'badge' => 'ARTICLE',
                'url' => 'https://www.thenews.pk/tns/detail/1397737-our-remarkable-natural-gas-overshoot',
                'description' => 'Published in The News on Sunday · In-depth breakdown of gas oversupply and stranded assets.',
                'sortOrder' => 2
            ],
            [
                'id' => 'fl-3',
                'title' => 'Political Economy of Power, Energy, Climate and Justice',
                'publisher' => 'CAEA Research Report',
                'badge' => 'RESEARCH REPORT',
                'url' => 'https://drive.google.com/file/d/1LuXInnvuC11GMiHBM_NM4HoWxkRP_Fpa/view?usp=drive_link',
                'description' => 'Comprehensive research publication interrogating gas as a system of power in Pakistan.',
                'sortOrder' => 3
            ],
            [
                'id' => 'fl-4',
                'title' => 'CAEA Climate Action & Energy Access Dashboard',
                'publisher' => 'Live Interactive Platform',
                'badge' => 'DASHBOARD',
                'url' => 'https://dashboard.climateactionenergyaccess.org/',
                'description' => 'Interactive data portal for real-time energy capacity, transmission data, and emissions.',
                'sortOrder' => 4
            ]
        ];

        $stmt = $pdo->prepare("INSERT INTO fossil_article_links (id, title, publisher, badge, url, description, sortOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($fossilLinks as $link) {
            $stmt->execute([$link['id'], $link['title'], $link['publisher'], $link['badge'], $link['url'], $link['description'], $link['sortOrder'], $now, $now]);
        }
    }
}
