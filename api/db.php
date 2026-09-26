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
            featured INTEGER DEFAULT 0,
            quote TEXT,
            quoteAuthor VARCHAR(255),
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
            createdAt DATETIME,
            updatedAt DATETIME
        );");

        // Table: page_settings
        $pdo->exec("CREATE TABLE IF NOT EXISTS page_settings (
            pageKey VARCHAR(64) PRIMARY KEY,
            settingsJson TEXT NOT NULL,
            updatedAt DATETIME
        );");

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
                'image' => 'Assets/media/events/contested-waters/RAY00190.JPG',
                'featured' => 1,
                'quote' => '“Those least responsible for climate change are worst affected by it”',
                'quoteAuthor' => 'Waseem Ul Haq'
            ],
            [
                'id' => 'act-2',
                'title' => 'Climate Justice Gathering & Retreat',
                'category' => 'RETREAT',
                'date' => '2026-04-23',
                'dateFormatted' => '23.04.2026',
                'location' => 'Pakistan',
                'description' => 'A 3-day retreat for climate activists and community organizers across Pakistan to reflect, reconnect with nature, and discuss energy, climate stories, burnout, and movement building.',
                'image' => 'Assets/media/events/retreat/DSCF4154.JPG',
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
                'image' => 'Assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.18 PM.jpeg',
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
                'image' => 'Assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.56 PM.jpeg',
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
                'image' => 'Assets/Team/sanaa-muhammad.jpg',
                'email' => 'sanaaimuhammad@climateactionenergyaccess.org'
            ],
            [
                'id' => 'ppl-2',
                'name' => 'Kamran Aziz',
                'role' => 'Founding Partner & Director Research',
                'category' => 'Core Team',
                'bio' => 'Kamran Aziz is the Director Research and a founding partner, working at the intersection of Pakistan’s electricity and gas systems, with a focus on advancing a just energy transition. His work combines historical analysis, political economy, and the lived experiences of communities directly affected by fossil fuel extraction and its social and environmental harms. His research is grounded in a commitment to center frontline communities, democratize energy governance, and support policy transformations aligned with climate justice.',
                'image' => 'Assets/Team/kamran-aziz.jpg',
                'email' => 'kamranaziz@climateactionenergyaccess.org'
            ],
            [
                'id' => 'ppl-3',
                'name' => 'Muhammad Asad',
                'role' => 'Research Associate',
                'category' => 'Core Team',
                'bio' => 'Asad is a law graduate from IIUI and a committed worker organizing with the oppressed communities. During his last experience as a Research Associate at Alternative Law Collective, his role involved conducting field research and supporting studies related to the land stewardship, and the concerns of communities victims of climate change and the developmental projects. He has been involved in organizing the students and the marches for their cultural and political rights. By engaging directly with communities, he has developed critical understanding of mainstream discourses around development and knowledge systems with a focus on the laws perpetuating inequalities and the local systems of justice. His role involved research and advocacy at Climate Action and Energy Access',
                'image' => 'Assets/Team/asad-juttah.jpg',
                'email' => 'asadjuttah@climateactionenergyaccess.org'
            ],
            [
                'id' => 'ppl-4',
                'name' => 'Hamna Anwaar',
                'role' => 'Creative & Communications Lead',
                'category' => 'Core Team',
                'bio' => 'Hamna is a visual storyteller and communications strategist who works on translating complex energy policy into accessible narratives for local organizing.',
                'image' => 'Assets/Team/hamna-anwaar.jpg',
                'email' => 'hamna.anwaar@climateactionenergyaccess.org'
            ],
            [
                'id' => 'ppl-5',
                'name' => 'Hina Yousaf',
                'role' => 'Community Engagement Lead',
                'category' => 'Core Team',
                'bio' => 'Hina coordinates regional community dialogues and youth workshops, connecting grassroots organizers with national transition campaigns.',
                'image' => 'Assets/Team/hina-yousaf.jpg',
                'email' => 'hina.yousaf@climateactionenergyaccess.org'
            ],
            [
                'id' => 'ppl-6',
                'name' => 'Muaaz Ahmad Khan',
                'role' => 'Policy & Energy Analyst',
                'category' => 'Core Team',
                'bio' => 'Muaaz focuses on power sector modeling, circular debt dynamics, and analyzing clean energy subsidy schemes.',
                'image' => 'Assets/Team/muaaz-khan.jpg',
                'email' => 'muaaz.khan@climateactionenergyaccess.org'
            ],
            [
                'id' => 'ppl-7',
                'name' => 'Nabeel Ahmad',
                'role' => 'Operations & Field Coordinator',
                'category' => 'Core Team',
                'bio' => 'Nabeel manages field logistics, research delegations, and on-ground partner relationships across Sindh and Punjab.',
                'image' => 'Assets/Team/nabeel-ahmad.jpg',
                'email' => 'nabeel.ahmad@climateactionenergyaccess.org'
            ],
            [
                'id' => 'ppl-8',
                'name' => 'Muhammad Saeed',
                'role' => 'Research Fellow',
                'category' => 'Fellows',
                'bio' => 'Saeed conducts field studies on groundwater contamination and socio-environmental impacts of large-scale infrastructure projects.',
                'image' => 'Assets/Team/muhammad-saeed.jpg',
                'email' => 'muhammad.saeed@climateactionenergyaccess.org'
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
                'image' => 'Assets/Hero-image.png'
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
                'image' => 'Assets/how-water-became-power-ai.jpg'
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
                'image' => 'Assets/how-water-became-power.jpg',
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
                'city' => 'HUNZA',
                'leftPos' => '53%',
                'topPos' => '19%',
                'badge' => 'HUNZA',
                'description' => 'Our team comes from diverse backgrounds across Gilgit-Baltistan. Climate Action & Energy Access (CAEA) is a Pakistan-based research and advocacy institute committed to empowering mountain communities through renewable energy.'
            ],
            [
                'id' => 'pin-jalalpur',
                'city' => 'JALALPUR',
                'leftPos' => '62%',
                'topPos' => '41%',
                'badge' => 'JALALPUR',
                'description' => 'Our team works closely with agrarian communities in Jalalpur advancing decentralized solar irrigation, groundwater conservation, and community energy governance.'
            ],
            [
                'id' => 'pin-manchhar',
                'city' => 'MANCHHAR',
                'leftPos' => '45%',
                'topPos' => '60%',
                'badge' => 'MANCHHAR',
                'description' => 'Our team works directly with freshwater fishing communities around Lake Manchhar. CAEA focuses on resilient water-energy solutions and ecological preservation.'
            ],
            [
                'id' => 'pin-thar',
                'city' => 'THAR',
                'leftPos' => '33%',
                'topPos' => '78%',
                'badge' => 'THAR',
                'description' => 'In the Thar desert, CAEA is leading research into off-grid solar microgrids and clean drinking water access for rural and indigenous desert settlements.'
            ],
            [
                'id' => 'pin-balochistan',
                'city' => 'BALOCHISTAN',
                'leftPos' => '22%',
                'topPos' => '50%',
                'badge' => 'BALOCHISTAN',
                'description' => 'Our upcoming project initiative exploring distributed solar and wind energy potential across western and pastoral regions.'
            ]
        ];

        $stmt = $pdo->prepare("INSERT INTO map_pins (id, city, leftPos, topPos, badge, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($mapPins as $pin) {
            $stmt->execute([$pin['id'], $pin['city'], $pin['leftPos'], $pin['topPos'], $pin['badge'], $pin['description'], $now, $now]);
        }

        // 7. Seed Page Settings
        $pageSettings = [
            'home' => [
                'heroQuote' => 'Not only must we be good, but we must also be good for something.',
                'heroQuoteAuthor' => '',
                'showLatestSection' => true,
                'latestTitle' => 'BE A PART OF OUR LATEST',
                'latestSubtitle' => 'Watch our latest field updates, community kacheri highlights, and climate documentaries across Pakistan.',
                'showLatestVideo' => true,
                'latestVideoTitle' => 'Community Kacheri & Field Briefing',
                'latestVideoDescription' => 'Experience our frontline grassroots gatherings across Pakistan, exploring public energy ownership and water justice.',
                'latestVideoUrl' => '',
                'latestVideoThumbnail' => 'Assets/how-water-became-power.jpg'
            ],
            'activities' => [
                'showVideo' => true,
                'videoTitle' => 'More than a retreat (CAEA Community Documentary)',
                'videoDescription' => 'No experience needed. Just a willingness to show up and act. Reconnecting with nature, exploring movement building, and building resilience against climate burnout.',
                'videoUrl' => '',
                'videoThumbnail' => 'Assets/how-water-became-power-ai.jpg',
                'autoplayImages' => true,
                'imageCycleInterval' => 5000
            ],
            'ourStory' => [
                'teamHeaderTitle' => 'The People Who Make It Happen',
                'quoteText' => 'What we cannot imagine cannot come into being.',
                'quoteAuthor' => 'Hellen Keller'
            ]
        ];

        $stmt = $pdo->prepare("INSERT INTO page_settings (pageKey, settingsJson, updatedAt) VALUES (?, ?, ?)");
        foreach ($pageSettings as $pageKey => $settings) {
            $stmt->execute([$pageKey, json_encode($settings, JSON_UNESCAPED_UNICODE), $now]);
        }
    }
}
