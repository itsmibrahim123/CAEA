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
            $pdo = null;

            // Attempt MySQL if configured
            if (DB_DRIVER === 'mysql' && DB_PASS !== 'YOUR_DB_PASSWORD_HERE' && DB_PASS !== '<USER_DB_PASSWORD>') {
                try {
                    $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=%s', DB_HOST, DB_PORT, DB_NAME, DB_CHARSET);
                    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false,
                        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
                    ]);
                } catch (PDOException $mySqlEx) {
                    error_log('CAEA: MySQL connection failed (' . $mySqlEx->getMessage() . '). Falling back to SQLite.');
                    $pdo = null;
                }
            }

            // Fallback to SQLite (or if DB_DRIVER is sqlite)
            if ($pdo === null) {
                if (!extension_loaded('pdo_sqlite')) {
                    throw new PDOException('PHP PDO SQLite extension is not enabled on this server.');
                }

                $dir = dirname(SQLITE_FILE);
                if (!is_dir($dir)) {
                    @mkdir($dir, 0755, true);
                }

                $pdo = new PDO('sqlite:' . SQLITE_FILE);
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
                // Enable foreign keys
                $pdo->exec('PRAGMA foreign_keys = ON;');
                // Attempt WAL mode; gracefully fall back to standard journal mode on shared hosting
                try {
                    $pdo->exec('PRAGMA journal_mode = WAL;');
                } catch (Exception $journalEx) {
                    try {
                        $pdo->exec('PRAGMA journal_mode = DELETE;');
                    } catch (Exception $e) {}
                }
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
        $isMySQL = ($pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql');
        $tableEngine = $isMySQL ? " ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" : "";
        $longTextType = $isMySQL ? "LONGTEXT" : "TEXT";
        $dtType = $isMySQL ? "DATETIME DEFAULT CURRENT_TIMESTAMP" : "DATETIME";
        $intType = $isMySQL ? "TINYINT(1)" : "INTEGER";

        // Table: activities
        $pdo->exec("CREATE TABLE IF NOT EXISTS activities (
            id VARCHAR(64) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(64) NOT NULL,
            date DATE NOT NULL,
            dateFormatted VARCHAR(32) NOT NULL,
            location VARCHAR(255) DEFAULT 'Pakistan',
            description {$longTextType},
            image VARCHAR(512),
            images {$longTextType},
            featured {$intType} DEFAULT 0,
            quote {$longTextType},
            quoteAuthor VARCHAR(255),
            sortOrder INTEGER DEFAULT 0,
            createdAt {$dtType},
            updatedAt {$dtType}
        ){$tableEngine};");

        // Table: people
        $pdo->exec("CREATE TABLE IF NOT EXISTS people (
            id VARCHAR(64) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            role VARCHAR(255) NOT NULL,
            category VARCHAR(64) NOT NULL,
            bio {$longTextType},
            image VARCHAR(512),
            email VARCHAR(255),
            sortOrder INTEGER DEFAULT 0,
            showInGrid {$intType} DEFAULT 1,
            createdAt {$dtType},
            updatedAt {$dtType}
        ){$tableEngine};");

        // Table: articles
        $pdo->exec("CREATE TABLE IF NOT EXISTS articles (
            id VARCHAR(64) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            subtitle VARCHAR(255),
            kicker VARCHAR(64) DEFAULT 'CASE STUDY',
            author VARCHAR(255) NOT NULL,
            date DATE NOT NULL,
            dateFormatted VARCHAR(32) NOT NULL,
            excerpt {$longTextType},
            content {$longTextType},
            image VARCHAR(512),
            sortOrder INTEGER DEFAULT 0,
            createdAt {$dtType},
            updatedAt {$dtType}
        ){$tableEngine};");

        // Table: opportunities
        $pdo->exec("CREATE TABLE IF NOT EXISTS opportunities (
            id VARCHAR(64) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            subtitle VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            type VARCHAR(64) NOT NULL,
            theme VARCHAR(32) DEFAULT 'blue',
            description {$longTextType},
            status VARCHAR(32) DEFAULT 'Open',
            image VARCHAR(512),
            gridArea VARCHAR(32),
            sortOrder INTEGER DEFAULT 0,
            createdAt {$dtType},
            updatedAt {$dtType}
        ){$tableEngine};");

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
            message {$longTextType},
            experience {$longTextType},
            status VARCHAR(32) DEFAULT 'Pending',
            date DATE NOT NULL,
            dateFormatted VARCHAR(32) NOT NULL,
            notes {$longTextType},
            createdAt {$dtType},
            updatedAt {$dtType}
        ){$tableEngine};");

        // Table: media
        $pdo->exec("CREATE TABLE IF NOT EXISTS media (
            id VARCHAR(64) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(64) NOT NULL,
            path VARCHAR(512) NOT NULL,
            tags {$longTextType},
            date DATE,
            sortOrder INTEGER DEFAULT 0,
            createdAt {$dtType}
        ){$tableEngine};");

        // Table: map_pins
        $pdo->exec("CREATE TABLE IF NOT EXISTS map_pins (
            id VARCHAR(64) PRIMARY KEY,
            city VARCHAR(255) NOT NULL,
            leftPos VARCHAR(32) NOT NULL,
            topPos VARCHAR(32) NOT NULL,
            badge VARCHAR(255) NOT NULL,
            description {$longTextType},
            sortOrder INTEGER DEFAULT 0,
            createdAt {$dtType},
            updatedAt {$dtType}
        ){$tableEngine};");

        // Table: fossil_article_links
        $pdo->exec("CREATE TABLE IF NOT EXISTS fossil_article_links (
            id VARCHAR(64) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            publisher VARCHAR(255) NOT NULL,
            badge VARCHAR(64) DEFAULT 'ARTICLE',
            category VARCHAR(64) DEFAULT 'articles',
            url {$longTextType} NOT NULL,
            description {$longTextType},
            sortOrder INTEGER DEFAULT 0,
            createdAt {$dtType},
            updatedAt {$dtType}
        ){$tableEngine};");

        // Table: climate_article_links
        $pdo->exec("CREATE TABLE IF NOT EXISTS climate_article_links (
            id VARCHAR(64) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            publisher VARCHAR(255) NOT NULL,
            badge VARCHAR(64) DEFAULT 'THE NEWS',
            category VARCHAR(64) DEFAULT 'articles',
            url {$longTextType} NOT NULL,
            description {$longTextType},
            sortOrder INTEGER DEFAULT 0,
            createdAt {$dtType},
            updatedAt {$dtType}
        ){$tableEngine};");

        // Table: textile_cards (Fast Fashion Article Links & Publications)
        $pdo->exec("CREATE TABLE IF NOT EXISTS textile_cards (
            id VARCHAR(64) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            publisher VARCHAR(255) DEFAULT 'CAEA',
            category VARCHAR(64) DEFAULT 'Research & Reports',
            url {$longTextType},
            description {$longTextType},
            sortOrder INTEGER DEFAULT 0,
            createdAt {$dtType},
            updatedAt {$dtType}
        ){$tableEngine};");

        // Table: climate_reports (Legal Claims, Loss & Damage, Case Studies)
        $pdo->exec("CREATE TABLE IF NOT EXISTS climate_reports (
            id VARCHAR(64) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            subtitle VARCHAR(255),
            category VARCHAR(64) DEFAULT 'Loss and Damage',
            author VARCHAR(255) NOT NULL,
            date DATE,
            dateFormatted VARCHAR(32),
            summary {$longTextType},
            content {$longTextType},
            pdfUrl VARCHAR(512),
            image VARCHAR(512),
            status VARCHAR(32) DEFAULT 'Published',
            sortOrder INTEGER DEFAULT 0,
            createdAt {$dtType},
            updatedAt {$dtType}
        ){$tableEngine};");

        // Table: page_settings
        $pdo->exec("CREATE TABLE IF NOT EXISTS page_settings (
            pageKey VARCHAR(64) PRIMARY KEY,
            settingsJson {$longTextType} NOT NULL,
            updatedAt {$dtType}
        ){$tableEngine};");

        // Ensure sortOrder column exists on existing database tables
        $tablesWithSortOrder = ['activities', 'people', 'articles', 'opportunities', 'media', 'map_pins', 'fossil_article_links', 'climate_article_links', 'textile_cards'];
        foreach ($tablesWithSortOrder as $tbl) {
            try {
                $pdo->exec("ALTER TABLE {$tbl} ADD COLUMN sortOrder INTEGER DEFAULT 0");
            } catch (Exception $e) {
                // Column already exists
            }
        }

        // Ensure category column exists on fossil_article_links and climate_article_links
        try {
            $pdo->exec("ALTER TABLE fossil_article_links ADD COLUMN category VARCHAR(64) DEFAULT 'articles'");
        } catch (Exception $e) {}

        try {
            $pdo->exec("ALTER TABLE climate_article_links ADD COLUMN category VARCHAR(64) DEFAULT 'articles'");
        } catch (Exception $e) {}

        // Ensure publisher and url columns exist on textile_cards
        try {
            $pdo->exec("ALTER TABLE textile_cards ADD COLUMN publisher VARCHAR(255) DEFAULT 'CAEA'");
        } catch (Exception $e) {}

        try {
            $pdo->exec("ALTER TABLE textile_cards ADD COLUMN url TEXT");
        } catch (Exception $e) {}

        // Migrate and backfill existing category tags if missing or default
        try {
            $pdo->exec("UPDATE fossil_article_links SET category = 'research' WHERE badge LIKE '%REPORT%' OR badge LIKE '%PDF%' OR url LIKE '%.pdf%' OR url LIKE '%drive.google%'");
            $pdo->exec("UPDATE fossil_article_links SET category = 'dashboard' WHERE badge LIKE '%DASHBOARD%' OR url LIKE '%dashboard%' OR url LIKE '%analytics%'");
            $pdo->exec("UPDATE fossil_article_links SET category = 'policy' WHERE badge LIKE '%POLICY%' OR title LIKE '%Policy%'");
            $pdo->exec("UPDATE fossil_article_links SET category = 'articles' WHERE category IS NULL OR category = ''");
        } catch (Exception $e) {}

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

        // Ensure new team members (Spogmai, Rohail, Chaandan, Laiba) exist in people table
        try {
            $newPeople = [
                ['ppl-10', 'Spogmai Rabnawaz Maken', 'Creative Director', 'Core Team', 'Spogmai Rabnawaz Maken serves as Creative Director at CAEA, leading visual identity, campaign narratives, grassroots media production, and creative communications at the intersection of climate action and environmental justice.', 'assets/team/grid-2-3-spogmai.png', 'spogmai@climateactionenergyaccess.org', 10, 1],
                ['ppl-11', 'Rohail', 'Office Assistant', 'Core Team', 'Rohail works as an Office Assistant at Climate Action & Energy Access (CAEA), where he supports daily office operations, manages routine administrative tasks, and assists with logistics and office arrangements. He plays an important role in keeping the workplace organized and ensuring smooth day-to-day activities.', 'assets/team/Rohail.jpg', 'rohail@climateactionenergyaccess.org', 11, 1],
                ['ppl-12', 'Chaandan Gadi', 'Software Developer', 'Core Team', "Chaandan Gadi is a Software Developer at Climate Action & Energy Access (CAEA), where he manages and maintains the organization's natural gas and renewable energy dashboard, supporting data accessibility and digital tools for energy research and analysis.", 'assets/team/Chandan.jpg', 'chaandangadi@climateactionenergyaccess.org', 12, 1],
                ['ppl-13', 'Laiba Siddiqi', 'Senior Associate - Textiles', 'Core Team', 'Laiba Siddiqi is a researcher and analyst focusing on energy policy, clean energy transitions, and the experiences of local communities in the midst of climatic upheaval. She graduated from the Lahore University of Management Sciences in 2023 with a Bachelors in Political Science and History. At CAEA, she heads the Climate Justice in Textiles campaign against fast fashion and its contributions to ecological degradation. More broadly, her interest lies in exploring how local and international public institutions and public decision-making can be made accessible to communities on the frontlines of the climate crisis.', 'assets/CAEA-Navbar-Logo.png', 'laibasiddiqi@climateactionenergyaccess.org', 13, 0]
            ];
            $now = date('Y-m-d H:i:s');
            $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM people WHERE id = ?");
            $insertStmt = $pdo->prepare("INSERT INTO people (id, name, role, category, bio, image, email, sortOrder, showInGrid, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($newPeople as $np) {
                $checkStmt->execute([$np[0]]);
                if ((int)$checkStmt->fetchColumn() === 0) {
                    $insertStmt->execute([$np[0], $np[1], $np[2], $np[3], $np[4], $np[5], $np[6], $np[7], $np[8], $now, $now]);
                }
            }
        } catch (Exception $e) {
            // Non-critical seed check
        }

        // Ensure fossil_article_links has default seed data if table is empty
        try {
            $flCount = (int)$pdo->query("SELECT COUNT(*) FROM fossil_article_links")->fetchColumn();
            if ($flCount === 0) {
                $now = date('Y-m-d H:i:s');
                $stmt = $pdo->prepare("INSERT INTO fossil_article_links (id, title, publisher, badge, category, url, description, sortOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $fossilLinks = [
                    ['flink-1', 'RLNG disruption: a bane?', 'Dawn · Opinion & Analysis', 'DAWN', 'articles', 'https://www.dawn.com/news/1997175?utm_source=whatsapp', 'Analysis of LNG contract obligations, supply disruptions, and power sector vulnerabilities in Pakistan.', 1],
                    ['flink-2', 'Our Remarkable Natural Gas Overshoot', 'The News on Sunday · Special Report', 'THE NEWS', 'articles', 'https://www.thenews.pk/tns/detail/1397737-our-remarkable-natural-gas-overshoot', 'An investigative review of Pakistan’s structural natural gas over-reliance and the urgent imperative for industrial phase-out.', 2],
                    ['flink-3', 'Political Economy of Power, Energy, Climate and Justice', 'CAEA Research Publication (PDF)', 'RESEARCH REPORT', 'research', 'https://drive.google.com/file/d/1LuXInnvuC11GMiHBM_NM4HoWxkRP_Fpa/view?usp=drive_link', 'Flagship policy report on power sector subsidies, circular debt, and the political ecology of fossil extraction.', 3],
                    ['flink-4', 'CAEA Climate Action & Energy Access Dashboard', 'Live Interactive Platform', 'DATA DASHBOARD', 'dashboard', '/pages/our-analytics.html', 'Interactive data portal for real-time energy capacity, transmission data, and emissions.', 4],
                    ['flink-5', 'Policy Analysis & Regulatory Briefs', 'CAEA Policy Briefs', 'POLICY ANALYSIS', 'policy', '#', 'Upcoming policy briefs, regulatory submissions to NEPRA, and power sector restructuring proposals.', 5]
                ];
                foreach ($fossilLinks as $link) {
                    $stmt->execute([$link[0], $link[1], $link[2], $link[3], $link[4], $link[5], $link[6], $link[7], $now, $now]);
                }
            }
        } catch (Exception $e) {
            // Non-critical seed fallback
        }

        // Ensure climate_article_links has default seed data if table is empty
        try {
            $clCount = (int)$pdo->query("SELECT COUNT(*) FROM climate_article_links")->fetchColumn();
            if ($clCount === 0) {
                $now = date('Y-m-d H:i:s');
                $stmt = $pdo->prepare("INSERT INTO climate_article_links (id, title, publisher, badge, category, url, description, sortOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $climateLinks = [
                    ['clink-1', 'The hidden cost of development', 'The News on Sunday · Special Report', 'THE NEWS', 'articles', 'https://www.thenews.com.pk/tns/detail/1023422-the-hidden-cost-of-development', 'Investigating the uncalculated social, ecological, and human costs of large-scale infrastructure and extractive projects in Pakistan.', 1],
                    ['clink-2', 'E-11 interchange: boon or bane?', 'The News on Sunday · Urban Ecology', 'THE NEWS', 'articles', 'https://www.thenews.com.pk/tns/detail/1074418-e-11-interchange-boon-or-bane', 'Critical analysis of urban displacement, car-centric road developments, and ecological disruption in Islamabad.', 2],
                    ['clink-3', 'Loss and displacement', 'The News on Sunday · Climate Justice', 'THE NEWS', 'articles', 'https://www.thenews.pk/tns/detail/1390589-loss-and-displacement', 'Frontline field reporting on communities experiencing climate catastrophe, involuntary displacement, and loss of sovereignty.', 3],
                    ['clink-4', 'The development scarcity', 'The News on Sunday · Political Economy', 'THE NEWS', 'articles', 'https://www.thenews.pk/tns/detail/1292148-the-development-scarcity', 'Investigating manufactured resource scarcity, unequal distribution of energy and water, and structural vulnerability.', 4],
                    ['clink-5', 'Living Landscapes & Community Water Rights', 'CAEA Field Research', 'RESEARCH & DOCUMENTATION', 'research', '#', 'Ongoing field investigations documenting the political ecology of the Indus Basin and community water sovereignty.', 5],
                    ['clink-6', 'Legal Frameworks for Climate Loss & Damage in Pakistan', 'CAEA Legal & Policy Team', 'REPORTS', 'reports', '#', 'Policy frameworks evaluating constitutional rights, environmental tribunals, and state accountability for displaced populations.', 6],
                    ['clink-7', 'Voices from the Frontlines: Lake Manchar & Beyond', 'Visual & Audio Storytelling Archive', 'MULTIMEDIA STORIES', 'multimedia', '#', 'Interactive photo essays, community audio testimonies, and visual archives capturing the lived realities of climate-hit ecologies.', 7],
                    ['clink-8', 'Defending Ecologies & Community Sovereignty', 'CAEA Movement Building & Advocacy', 'CAMPAIGNS', 'campaigns', '#', 'Grassroots mobilization campaigns, community kacheris, and participatory climate justice dialogues across Pakistan.', 8]
                ];
                foreach ($climateLinks as $link) {
                    $stmt->execute([$link[0], $link[1], $link[2], $link[3], $link[4], $link[5], $link[6], $link[7], $now, $now]);
                }
            }
        } catch (Exception $e) {
            // Non-critical seed fallback
        }

        // Ensure textile_cards has default seed data if table is empty
        try {
            $tcCount = (int)$pdo->query("SELECT COUNT(*) FROM textile_cards")->fetchColumn();
            if ($tcCount === 0) {
                $now = date('Y-m-d H:i:s');
                $stmt = $pdo->prepare("INSERT INTO textile_cards (id, title, publisher, category, url, description, sortOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $textileCards = [
                    ['tex-1', 'Fashion and Fossil Fuels: Supply Chain Investigation', 'CAEA Research Publication', 'Research & Reports', 'https://drive.google.com/file/d/1LuXInnvuC11GMiHBM_NM4HoWxkRP_Fpa/view?usp=drive_link', 'Tracing synthetic fiber reliance, coal-fired industrial captive power plants, and supply chain accountability across Pakistan\'s textile hubs.', 1],
                    ['tex-2', 'The Carbon Thread: Fast Fashion Exploitation', 'The News on Sunday', 'Article', 'https://www.thenews.pk/tns/detail/1023422-the-hidden-cost-of-development', 'Investigating synthetic fiber reliance, coal-fired industrial captive power plants, and fair wage transitions for garment workers across industrial zones.', 2],
                    ['tex-3', 'Garment Workers & Community Testimonies', 'CAEA Field Briefing', 'Testimonials', '#apply', 'First-hand oral accounts and video recordings from garment workers and fenceline communities living along polluted industrial drainage canals.', 3],
                    ['tex-4', 'Demand Clean Energy & Fair Wages in Pakistan\'s Textile Sector', 'CAEA Public Action', 'Sign Our Petition', '#apply', 'Join our urgent public campaign petition demanding mandatory solarization of textile power, zero liquid discharge, and living wage protections.', 4]
                ];
                foreach ($textileCards as $card) {
                    $stmt->execute([$card[0], $card[1], $card[2], $card[3], $card[4], $card[5], $card[6], $now, $now]);
                }
            }
        } catch (Exception $e) {
            // Non-critical seed fallback
        }

        // Seed data if database is empty
        self::seedDatabaseIfEmpty($pdo);
    }

    private static function seedDatabaseIfEmpty(PDO $pdo): void {
        $now = date('Y-m-d H:i:s');

        // 1. Seed Activities (with image galleries and sort order)
        if ((int)$pdo->query("SELECT COUNT(*) FROM activities")->fetchColumn() === 0) {
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
                'images' => json_encode([
                    'assets/media/events/contested-waters/RAY00190.JPG',
                    'assets/media/events/contested-waters/RAY00059.JPG',
                    'assets/media/events/contested-waters/RAY00118.JPG',
                    'assets/media/events/contested-waters/RAY00212.JPG'
                ]),
                'featured' => 1,
                'quote' => '“Those least responsible for climate change are worst affected by it”',
                'quoteAuthor' => 'Vandana Shiva',
                'sortOrder' => 1
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
                'images' => json_encode([
                    'assets/media/events/retreat/DSCF4154.JPG',
                    'assets/media/events/retreat/DSCF3966.JPG',
                    'assets/media/events/retreat/DSCF4356.JPG',
                    'assets/media/events/retreat/DSCF4512.JPG'
                ]),
                'featured' => 0,
                'quote' => '“Reconnecting with land and community to build resilience against climate burnout”',
                'quoteAuthor' => 'CAEA Movement Gathering',
                'sortOrder' => 2
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
                'images' => json_encode([
                    'assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.18 PM.jpeg',
                    'assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.18 PM (1).jpeg',
                    'assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.18 PM (2).jpeg',
                    'assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.28 PM.jpeg'
                ]),
                'featured' => 0,
                'quote' => '“Manchhar is a mindful lake, yet it bears the heaviest burden of industrial discharge”',
                'quoteAuthor' => 'Lake Manchhar Fisherman Community',
                'sortOrder' => 3
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
                'images' => json_encode([
                    'assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.56 PM.jpeg',
                    'assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.57 PM (1).jpeg',
                    'assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.58 PM (2).jpeg',
                    'assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.59 PM.jpeg'
                ]),
                'featured' => 0,
                'quote' => '“Uncovering the true human and ecological costs behind megastructures of power”',
                'quoteAuthor' => 'Tarbela Exposure Delegation',
                'sortOrder' => 4
            ]
        ];

        $stmt = $pdo->prepare("INSERT INTO activities (id, title, category, date, dateFormatted, location, description, image, images, featured, quote, quoteAuthor, sortOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($activities as $a) {
            $stmt->execute([$a['id'], $a['title'], $a['category'], $a['date'], $a['dateFormatted'], $a['location'], $a['description'], $a['image'], $a['images'], $a['featured'], $a['quote'], $a['quoteAuthor'], $a['sortOrder'], $now, $now]);
        }
    }

    // 2. Seed People (All 10 Team Members with full bios, sortOrder & showInGrid)
    if ((int)$pdo->query("SELECT COUNT(*) FROM people")->fetchColumn() === 0) {
        $people = [
            [
                'id' => 'ppl-1',
                'name' => 'Sanaa’i Muhammad',
                'role' => 'Founder & CEO',
                'category' => 'Executive',
                'bio' => "Sanaa’i Muhammad is the Founder and Chief Executive Officer of the Climate Action & Energy Access Institute (CAEA), where she leads advocacy, and movement-building at the intersection of energy transition and climate justice in Pakistan. Her work focuses on phasing out fossil gas in power, industry, and households; advancing renewable energy pathways; and building public understanding of how colonial infrastructures, financial institutions, and policy choices shape today’s climate and energy crises.\n\nHer work is rooted in a commitment to just transitions, energy equity, and amplifying the experiences of communities most affected by environmental harm. She writes, organizes, and teaches with the belief that climate justice is inseparable from economic democracy, gender justice, and people’s sovereignty over energy and resources.",
                'image' => 'assets/team/grid-1-2-Sanaa.png',
                'email' => 'sanaaimuhammad@climateactionenergyaccess.org',
                'sortOrder' => 1,
                'showInGrid' => 1
            ],
            [
                'id' => 'ppl-2',
                'name' => 'Kamran Aziz',
                'role' => 'Founding Partner & Director Research',
                'category' => 'Core Team',
                'bio' => 'Kamran Aziz is the Director Research and a founding partner, working at the intersection of Pakistan’s electricity and gas systems, with a focus on advancing a just energy transition. His work combines historical analysis, political economy, and the lived experiences of communities directly affected by fossil fuel extraction and its social and environmental harms. His research is grounded in a commitment to center frontline communities, democratize energy governance, and support policy transformations aligned with climate justice.',
                'image' => 'assets/team/grid-2-1-kamran.png',
                'email' => 'kamranaziz@climateactionenergyaccess.org',
                'sortOrder' => 2,
                'showInGrid' => 1
            ],
            [
                'id' => 'ppl-3',
                'name' => 'Muhammad Asad',
                'role' => 'Research Associate',
                'category' => 'Core Team',
                'bio' => 'Asad is a law graduate from IIUI and a committed worker organizing with the oppressed communities. During his last experience as a Research Associate at Alternative Law Collective, his role involved conducting field research and supporting studies related to the land stewardship, and the concerns of communities victims of climate change and the developmental projects. He has been involved in organizing the students and the marches for their cultural and political rights. By engaging directly with communities, he has developed critical understanding of mainstream discourses around development and knowledge systems with a focus on the laws perpetuating inequalities and the local systems of justice. His role involved research and advocacy at Climate Action and Energy Access',
                'image' => 'assets/CAEA-Navbar-Logo.png',
                'email' => 'asadjuttah@climateactionenergyaccess.org',
                'sortOrder' => 3,
                'showInGrid' => 0
            ],
            [
                'id' => 'ppl-4',
                'name' => 'Hamna Anwaar',
                'role' => 'Textile Associate',
                'category' => 'Core Team',
                'bio' => 'Hamna has a bachelors in environmental engineering from NUST and is a passionate environmentalist. Her commitment to addressing critical issues such as climate change, and sustainability has only deepened with her academic journey. She aspires to focus her professional efforts to bring positive change in both our society and environment. As a Textile Associate at CAEA, Hamna focuses on textile-sector emissions and the global fast-fashion supply chain. She works on research, campaigns, and public engagement strategies that highlight the social, environmental, and climate impacts of the industry, and she is committed to advocating for a more equitable and sustainable future for both people and the planet.',
                'image' => 'assets/team/grid-1-1-hamna.png',
                'email' => 'hamnaanwar@climateactionenergyaccess.org',
                'sortOrder' => 4,
                'showInGrid' => 1
            ],
            [
                'id' => 'ppl-5',
                'name' => 'Muhammad Saeed',
                'role' => 'Climate Justice Lead',
                'category' => 'Core Team',
                'bio' => 'Muhammad Saeed is an PHD Scholar whose research focuses on the intricate relationship between water, identity, and politics, specifically exploring "Sindhu and the making of Sindhi nationalism: River Politics during the colonial era. His academic work explores key thematic areas including water governance, floods, river infrastructures, and hydro-power development. His research also contributes to a critical understanding of riverine identity and the historical emergence of riverine movements, with a specific focus on the intersection of water and nationalism. Beyond his scholarship, Saeed is a political activist committed to organizing with oppressed communities, nations and people. He is currently serving as a Climate justice Lead at Climate Action and Energy Access, where his work involves both research and advocacy for equitable climate and energy solutions. His direct engagement with communities and academic study inform a critical perspective on mainstream development narratives and knowledge systems, particularly concerning the policies that impact vulnerable populations and perpetuate inequalities.',
                'image' => 'assets/team/grid-3-2-muhammad.png',
                'email' => 'guramanisaeed98@gmail.com',
                'sortOrder' => 5,
                'showInGrid' => 1
            ],
            [
                'id' => 'ppl-6',
                'name' => 'Muaaz Ahmad Khan',
                'role' => 'Communication Lead',
                'category' => 'Core Team',
                'bio' => 'Muaaz Ahmad Khan is currently pursuing his MPhil in Government and Public Policy. He works as the Communication Lead and Social Media & Networks Coordinator at CAEA. His work focuses on communicating CAEA’s research and campaigns, managing its digital platforms and network groups, and working with partners on joint communication initiatives. He works closely with the research and campaign teams to turn complex ideas and research into clear and engaging content. Through his work, he contributes to CAEA’s efforts to strengthen a people-centered climate justice movement.',
                'image' => 'assets/team/grid-3-3-muaz.png',
                'email' => 'khanmuaaz762@gmail.com',
                'sortOrder' => 6,
                'showInGrid' => 1
            ],
            [
                'id' => 'ppl-7',
                'name' => 'Fizza Aman Bhutto',
                'role' => 'Admin & HR Officer',
                'category' => 'Core Team',
                'bio' => 'Fizza Aman Bhutto is an Administration and HR Officer at the Climate Action and Energy Access (CAEA). She holds a Bachelor’s degree in Development Studies from Bahria University, Islamabad. Her development sector experience spans program coordination, engagement with Indigenous communities, and research on climate-induced disasters, with her undergraduate research focusing on the devastating 2022 floods in Pakistan. At CAEA, she works across administration, human resources, project coordination, and organizational development. She is particularly interested in the intersections of climate justice, development, and organizational development, and in how stronger, people-centered organizations can contribute to a more equitable and sustainable change.',
                'image' => 'assets/team/grid-1-3-fiza.png',
                'email' => 'fizzabhutto9@gmail.com',
                'sortOrder' => 7,
                'showInGrid' => 1
            ],
            [
                'id' => 'ppl-8',
                'name' => 'Manahil Usman',
                'role' => 'Associate Fossil Fuel Phaseout',
                'category' => 'Core Team',
                'bio' => "Manahil Usman is an Associate in Fossil Fuel Phaseout at Climate Action for Energy Access (CAEA), where she focuses on research and data analysis at the intersection of energy policy and climate justice. With a background in Computer Science and an MBA, she brings an analytical foundation shaped by prior work in data management and sector-level analysis to her current focus on Pakistan's gas sector, LNG dynamics, and just transition frameworks. At CAEA, Manahil is committed to building the evidence base needed to advance credible, equitable fossil fuel phaseout policy in Pakistan and beyond.",
                'image' => 'assets/CAEA-Navbar-Logo.png',
                'email' => 'manahilusman2@gmail.com',
                'sortOrder' => 8,
                'showInGrid' => 0
            ],
            [
                'id' => 'ppl-9',
                'name' => 'Abid Azim',
                'role' => 'Finance Officer',
                'category' => 'Core Team',
                'bio' => 'Abid Azim is an experienced finance professional with expertise in financial management, budgeting, financial reporting, taxation, audit, and strategic financial planning. He has been serving as Finance Manager at Climate Action and Energy Access LLP since May 2024, where he oversees financial analysis, budgeting, cash-flow management, financial reporting, and tax compliance. With professional experience spanning finance, audit, accounting, and business management, Abid brings a strong analytical and results-oriented approach to supporting organizational growth and sustainability. He is a Certified Public Accountant (CPA) from England & Wales and a finalist of ICAEW.',
                'image' => 'assets/team/grid-2-2-abid.png',
                'email' => 'abidazeem101@gmail.com',
                'sortOrder' => 9,
                'showInGrid' => 1
            ],
            [
                'id' => 'ppl-10',
                'name' => 'Spogmai Rabnawaz Maken',
                'role' => 'Creative Director',
                'category' => 'Core Team',
                'bio' => 'Spogmai Rabnawaz Maken serves as Creative Director at CAEA, leading visual identity, campaign narratives, grassroots media production, and creative communications at the intersection of climate action and environmental justice.',
                'image' => 'assets/team/grid-2-3-spogmai.png',
                'email' => 'spogmai@climateactionenergyaccess.org',
                'sortOrder' => 10,
                'showInGrid' => 1
            ],
            [
                'id' => 'ppl-11',
                'name' => 'Rohail',
                'role' => 'Office Assistant',
                'category' => 'Core Team',
                'bio' => 'Rohail works as an Office Assistant at Climate Action & Energy Access (CAEA), where he supports daily office operations, manages routine administrative tasks, and assists with logistics and office arrangements. He plays an important role in keeping the workplace organized and ensuring smooth day-to-day activities.',
                'image' => 'assets/team/Rohail.png',
                'email' => 'rohail@climateactionenergyaccess.org',
                'sortOrder' => 11,
                'showInGrid' => 0
            ],
            [
                'id' => 'ppl-12',
                'name' => 'Chaandan Gadi',
                'role' => 'Software Developer',
                'category' => 'Core Team',
                'bio' => "Chaandan Gadi is a Software Developer at Climate Action & Energy Access (CAEA), where he manages and maintains the organization's natural gas and renewable energy dashboard, supporting data accessibility and digital tools for energy research and analysis.",
                'image' => 'assets/team/Chandan.png',
                'email' => 'chaandangadi@climateactionenergyaccess.org',
                'sortOrder' => 12,
                'showInGrid' => 1
            ],
            [
                'id' => 'ppl-13',
                'name' => 'Laiba Siddiqi',
                'role' => 'Senior Associate - Textiles',
                'category' => 'Core Team',
                'bio' => 'Laiba Siddiqi is a researcher and analyst focusing on energy policy, clean energy transitions, and the experiences of local communities in the midst of climatic upheaval. She graduated from the Lahore University of Management Sciences in 2023 with a Bachelors in Political Science and History. At CAEA, she heads the Climate Justice in Textiles campaign against fast fashion and its contributions to ecological degradation. More broadly, her interest lies in exploring how local and international public institutions and public decision-making can be made accessible to communities on the frontlines of the climate crisis.',
                'image' => 'assets/CAEA-Navbar-Logo.png',
                'email' => 'laibasiddiqi@climateactionenergyaccess.org',
                'sortOrder' => 13,
                'showInGrid' => 0
            ]
        ];

        $stmt = $pdo->prepare("INSERT INTO people (id, name, role, category, bio, image, email, sortOrder, showInGrid, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($people as $p) {
            $stmt->execute([$p['id'], $p['name'], $p['role'], $p['category'], $p['bio'], $p['image'], $p['email'], $p['sortOrder'], $p['showInGrid'], $now, $now]);
        }
    }

    // 3. Seed Articles (All 4 Core Articles)
    if ((int)$pdo->query("SELECT COUNT(*) FROM articles")->fetchColumn() === 0) {
        $articles = [
            [
                'id' => 'art-1',
                'title' => 'The Life Story of Manchar Lake',
                'subtitle' => 'A field visit exploring Manchar Lake',
                'kicker' => 'KACHERI',
                'author' => 'Hamna Anwar',
                'date' => '2026-07-28',
                'dateFormatted' => '28.07.2026',
                'excerpt' => 'The kacheri was based on the case of Lake Manchar. The discussion focused on the ecological destruction of the lake, and how large development projects have affected the people, culture, and livelihoods connected to it.',
                'content' => "The kacheri was based on the case of Lake Manchar. The discussion focused on the ecological destruction of the lake, and how large development projects have affected the people, culture, and livelihoods connected to it.\n\nLake Manchar is located in Sindh between the Khirthar mountain range and the River Sindhu. The lake is 360 miles long and 170 miles wide. It is the biggest natural sweet water lake in Asia. The word \"Manchar\" comes from the Sindhi words Meeh meaning rain and Chhar meaning a vast expanse. Together, \"Meeh + Chhar\" means a vast spread of Rain waters.\n\nIndustrial discharge and skewed water management have devastated the livelihood of thousands of fisherfolk families. CAEA continues to mobilize community kacheris to demand immediate ecological remediation and water rights.",
                'image' => 'assets/how-water-became-power.jpg',
                'sortOrder' => 1
            ],
            [
                'id' => 'art-2',
                'title' => 'The Cost of Gas: How Subsidies Shape Pakistan’s Energy Crisis',
                'subtitle' => 'Analysis of circular debt and industrial consumption patterns',
                'kicker' => 'POLICY BRIEF',
                'author' => 'Kamran Aziz & Sanaa’i Muhammad',
                'date' => '2024-02-10',
                'dateFormatted' => '10.02.2024',
                'excerpt' => 'A comprehensive review of Pakistan’s domestic natural gas allocation and its economic burden on working-class households.',
                'content' => "Natural gas has long been treated as an abundant domestic resource in Pakistan. However, decades of preferential allocation and depleting reserves have precipitated a severe energy crisis.\n\nOur research shows that the power sector is the most important place to begin this shift. Imported LNG was meant to bring energy security, but instead it has made electricity more expensive and left Pakistan dependent on unpredictable global markets.",
                'image' => 'assets/Hero-image.png',
                'sortOrder' => 2
            ],
            [
                'id' => 'art-3',
                'title' => 'How Water Became Power',
                'subtitle' => 'The Political Economy of Freshwater Resources in Sindh',
                'kicker' => 'CASE STUDY',
                'author' => 'Waseem Ul Haq',
                'date' => '2024-03-15',
                'dateFormatted' => '15.03.2024',
                'excerpt' => 'An investigation into how large development projects have impacted aquatic ecosystems and fishing livelihoods around Lake Manchhar.',
                'content' => 'Lake Manchhar is located in Sindh between the Dadu and Khanpur districts. Manchhar comes from the Sindhi words Man meaning mind and Chhar meaning lake or pond. Manchhar translates to "mindful lake". It is the largest natural freshwater lake in Asia.',
                'image' => 'assets/how-water-became-power-ai.jpg',
                'sortOrder' => 3
            ],
            [
                'id' => 'art-4',
                'title' => 'All Good Things Are Wild And Free',
                'subtitle' => 'Understanding the Climate Transition Imperative in Pakistan',
                'kicker' => 'FIELD REPORTS',
                'author' => 'CAEA Policy Research Team',
                'date' => '2024-04-10',
                'dateFormatted' => '10.04.2024',
                'excerpt' => 'Climate Action & Energy Access (CAEA) is a Pakistan-based research and advocacy institute committed to advancing a just, people-centered energy transition.',
                'content' => 'We work at the intersection of climate justice, energy governance, and public accountability, focusing on how entrenched fossil-fuel interests, inequitable subsidies, and distorted gas and power policies undermine the rights, wellbeing, and economic futures of ordinary people.',
                'image' => 'assets/how-water-became-power.jpg',
                'sortOrder' => 4
            ]
        ];

        $stmt = $pdo->prepare("INSERT INTO articles (id, title, subtitle, kicker, author, date, dateFormatted, excerpt, content, image, sortOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($articles as $art) {
            $stmt->execute([$art['id'], $art['title'], $art['subtitle'], $art['kicker'], $art['author'], $art['date'], $art['dateFormatted'], $art['excerpt'], $art['content'], $art['image'], $art['sortOrder'], $now, $now]);
        }
    }

    // 4. Seed Opportunities
    if ((int)$pdo->query("SELECT COUNT(*) FROM opportunities")->fetchColumn() === 0) {
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
                'gridArea' => 'card1',
                'sortOrder' => 1
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
                'gridArea' => 'card2',
                'sortOrder' => 2
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
                'gridArea' => 'card3',
                'sortOrder' => 3
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
                'gridArea' => 'card4',
                'sortOrder' => 4
            ]
        ];

        $stmt = $pdo->prepare("INSERT INTO opportunities (id, title, subtitle, category, type, theme, description, status, image, gridArea, sortOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($opportunities as $opp) {
            $stmt->execute([$opp['id'], $opp['title'], $opp['subtitle'], $opp['category'], $opp['type'], $opp['theme'], $opp['description'], $opp['status'], $opp['image'], $opp['gridArea'], $opp['sortOrder'], $now, $now]);
        }
    }

    // 5. Seed Applications
    if ((int)$pdo->query("SELECT COUNT(*) FROM applications")->fetchColumn() === 0) {
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
                'notes' => 'Strong academic profile and fieldwork experience. Schedule first interview round.'
            ],
            [
                'id' => 'app-2',
                'fullName' => 'Bilal Khan',
                'email' => 'bilal.khan@gmail.com',
                'phone' => '+92 333 9876543',
                'city' => 'Gilgit, Gilgit-Baltistan',
                'opportunityId' => 'opp-2',
                'opportunityTitle' => 'KACHERI: Registration Open',
                'category' => 'Community Gathering',
                'commitment' => 'Flexible / Event-based',
                'message' => 'Would love to participate in the upcoming Kacheri discussion session to share insights on mountain community solar microgrids and equitable winter power distribution.',
                'experience' => 'Local community representative with 3+ years in renewable energy grassroots advocacy.',
                'status' => 'Shortlisted',
                'date' => '2024-09-20',
                'dateFormatted' => '20.09.2024',
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
    }

    // 6. Seed Map Pins (Accurate Pakistan Geo Coordinates)
    if ((int)$pdo->query("SELECT COUNT(*) FROM map_pins")->fetchColumn() === 0) {
        $mapPins = [
            [
                'id' => 'pin-hunza',
                'city' => 'HUNZA, GB',
                'leftPos' => '64%',
                'topPos' => '7%',
                'badge' => 'HUNZA, GB',
                'description' => 'Our team comes from diverse backgrounds across Gilgit-Baltistan. Climate Action & Energy Access (CAEA) is committed to empowering mountain communities through renewable energy and local climate resilience.',
                'sortOrder' => 1
            ],
            [
                'id' => 'pin-dhirkot',
                'city' => 'DHIRKOT, AJK',
                'leftPos' => '66%',
                'topPos' => '27.5%',
                'badge' => 'DHIRKOT, AJK',
                'description' => 'In Dhirkot, Azad Kashmir, CAEA works alongside local community organizers on watershed protection, community forestry, and decentralized clean energy solutions for mountain terrains.',
                'sortOrder' => 2
            ],
            [
                'id' => 'pin-tarbela',
                'city' => 'TARBELA, KP',
                'leftPos' => '59%',
                'topPos' => '25%',
                'badge' => 'TARBELA, KP',
                'description' => 'At Tarbela Dam in Khyber Pakhtunkhwa, CAEA brings together community perspectives to examine megastructure energy promises vs. its human and ecological costs on land and riverine ecosystems.',
                'sortOrder' => 3
            ],
            [
                'id' => 'pin-jalalpur',
                'city' => 'JALALPUR, PB',
                'leftPos' => '63.5%',
                'topPos' => '34%',
                'badge' => 'JALALPUR, PB',
                'description' => 'Our team works closely with agrarian communities in Jalalpur advancing decentralized solar irrigation, groundwater conservation, and community energy governance.',
                'sortOrder' => 4
            ],
            [
                'id' => 'pin-khirthar',
                'city' => 'KHIRTHAR, SD',
                'leftPos' => '36%',
                'topPos' => '76%',
                'badge' => 'KHIRTHAR, SD',
                'description' => 'Across the Khirthar Range in Sindh, CAEA investigates the impacts of fossil fuel exploration, industrial wastewater, and climate shocks on indigenous communities and fragile desert ecologies.',
                'sortOrder' => 5
            ]
        ];

        $stmt = $pdo->prepare("INSERT INTO map_pins (id, city, leftPos, topPos, badge, description, sortOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($mapPins as $pin) {
            $stmt->execute([$pin['id'], $pin['city'], $pin['leftPos'], $pin['topPos'], $pin['badge'], $pin['description'], $pin['sortOrder'], $now, $now]);
        }
    }

    // 7. Seed Page Settings
    if ((int)$pdo->query("SELECT COUNT(*) FROM page_settings")->fetchColumn() === 0) {
        $pageSettings = [
            'home' => [
                'heroQuote' => 'The climate crisis is a call to transform the systems that brought us here.',
                'heroQuoteAuthor' => 'Naomi Klein',
                'heroVideoUrl' => 'assets/video/Hero.mov',
                'showLatestSection' => true,
                'latestTitle' => 'BE A PART OF OUR LATEST',
                'latestSubtitle' => 'Watch our latest field updates, community kacheri highlights, and climate documentaries across Pakistan.',
                'showLatestVideo' => true,
                'latestVideoTitle' => 'Community Kacheri & Field Briefing',
                'latestVideoDescription' => 'Experience our frontline grassroots gatherings across Pakistan, exploring public energy ownership and water justice.',
                'latestVideoUrl' => 'assets/video/Hero.mov',
                'latestVideoThumbnail' => 'assets/how-water-became-power.jpg',
                'quotes' => [
                    ['text' => 'The climate crisis is a call to transform the systems that brought us here.', 'author' => 'Naomi Klein'],
                    ['text' => 'What is the use of a house if you haven\'t got a tolerable planet to put it on?', 'author' => 'Vandana Shiva'],
                    ['text' => 'In nature\'s economy, the currency is not money, it is life.', 'author' => 'Wangari Maathai'],
                    ['text' => 'When we plant trees, we plant the seeds of peace and hope.', 'author' => 'Wangari Maathai']
                ]
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
                    'visible' => true,
                    'title' => 'OUR MISSION',
                    'subtitle' => 'Rethinking energy systems for a cleaner, fairer, and climate-resilient future.',
                    'description' => "Our mission is to advance a just energy transition by exposing the structural drivers of Pakistan’s gas and fossil-fuel dependence; challenging subsidies, governance failures, and entrenched industrial interests, especially captive power plants—that distort markets, deepen inequality, and worsen the climate crisis. CAEA works to democratize climate and energy discourse, center community experiences, and advocate for people-centric, rights-based policies across water, energy, and climate systems. Through evidence-based research, public mobilization, and strategic policy engagement, we strengthen national capacity to phase out gas from industrial and domestic sectors, counter fossil-fuel intensity in power and industry, and push for transparent, least-cost, and climate-just pathways that prioritize public health, economic stability, and intergenerational equity.",
                    'joinBtnText' => 'JOIN US',
                    'opportunityTitle' => 'General Volunteer / Open Application',
                    'bannerTitle' => 'FOSSIL FUEL PHASEOUT',
                    'bannerSubtitle' => 'Rethinking energy systems for a cleaner, fairer, and climate-resilient future.',
                    'bannerBtnText' => 'EXPLORE WORK'
                ],
                'textile' => [
                    'visible' => true,
                    'bannerTitle' => 'FAST FASHION',
                    'bannerSubtitle' => 'Supply chain transparency, industrial captive power emissions & fair worker transitions',
                    'bannerBtnText' => 'EXPLORE WORK',
                    'iconStyle' => 'double-blue',
                    'title' => 'FAST FASHION',
                    'subtitle' => 'Supply chain transparency, industrial captive power emissions & fair worker transitions',
                    'description' => 'At CAEA, the Climate Justice in Textiles team aims to tackle structural inequalities embedded in the textiles value chain by targeting the need for stronger regulations around energy, water, and land usage on the international, regional, and local levels. Through policy research and public campaigning, we advocate for stronger corporate accountability in the face of environmental harm and labour rights abuses. Our partnerships with students, youth climate activists, affected communities, and local consumers, help us imagine alternatives to modern-day capitalistic production that center local craft and climate-suitable methods.',
                    'archPattern' => 'white-semicircle',
                    'joinBtnText' => 'JOIN US',
                    'opportunityTitle' => 'Textile Sector Researcher',
                    'sectionHeading' => 'Working towards a future for sustainable textile practices',
                    'sectionIntro' => 'Our efforts are targeted towards creating dialogue and impact thereby. A just energy future starts with you.'
                ],
                'climateJustice' => [
                    'visible' => true,
                    'bannerTitle' => 'CLIMATE JUSTICE',
                    'bannerSubtitle' => "Ecological democracy, gender equity & frontline communities' sovereignty over resources",
                    'bannerBtnText' => 'LEARN MORE',
                    'title' => 'CLIMATE JUSTICE',
                    'subtitle' => "Ecological democracy, gender equity & frontline communities' sovereignty over resources",
                    'description' => "At CAEA, we imagine climate justice beyond merely reducing emissions, compensating losses or making infrastructure resilient. We understand it as the task of refusing the conversion of living landscapes into empty, measurable and extractable space. Every ecology is also a world of knowledge, livelihood, memory, movement and social relations. Justice, therefore, asks who has the power to define a landscape’s problems, whose knowledge is recognised, who receives the benefits of an intervention and who is made to carry its violence. Climate justice means defending diverse ecologies from dispossession and restoring communities’ authority to adapt and steward the worlds that sustain them.\n\nPakistan inhabits different ecological worlds who are victims of the climate crises. Through intentional research, storytelling, and making a dialogic space, CAEA intends to centre the voices of communities victim of the climate crises. Part of this work involves closely examining the social and environmental costs of large infrastructure projects, costs that are often overlooked in official reports and government decisions.\n\nOur goal is to build narrative, shape climate conversations, and support creative reflective spaces to imagine just future that place communities, sustainability, and justice at the center of climate action.",
                    'joinBtnText' => 'JOIN US',
                    'opportunityTitle' => 'Climate Justice Organizer'
                ],
                'sharedGoal' => [
                    'title' => 'Our Shared Goal',
                    'description' => 'Across all three areas, our work is guided by one principle: development that puts people first — solutions that are good for the planet and fair for the people living on it.'
                ],
                'activitiesBanner' => [
                    'bannerTitle' => 'ACTIVITIES & GATHERINGS',
                    'bannerSubtitle' => 'Field retreats, community kacheris, exposure visits & workshops across Pakistan',
                    'bannerBtnText' => 'SEE MORE',
                    'heroQuote' => '“Those least responsible for climate change are worst affected by it”',
                    'heroAuthor' => 'Vandana Shiva',
                    'heroHeading' => 'WORKING TOWARDS CLEAN ENERGY',
                    'heroDescription' => 'The ecological destruction of Lake Manchhar in Sindh highlights how industrial discharge, upstream water diversions, and climate shocks devastate indigenous fishing communities. CAEA works alongside local organizers and environmental advocates to document environmental injustices, foster community dialogue, and advance clean energy accountability across Pakistan.',
                    'showVideo' => true,
                    'videoTitle' => 'More than a retreat (CAEA Community Documentary)',
                    'videoDescription' => 'No experience needed. Just a willingness to show up and act. Reconnecting with nature, exploring movement building, and building resilience against climate burnout.',
                    'videoUrl' => '',
                    'videoThumbnail' => 'assets/how-water-became-power-ai.jpg',
                    'upcomingGathering' => [
                        'visible' => true,
                        'title' => 'CATCH THE UPCOMING GATHERING',
                        'subtitle' => 'No experience needed. Just a willingness to show up and act.',
                        'date' => 'OCTOBER 2026 · REGISTRATION OPEN',
                        'btnText' => 'SEE MORE',
                        'link' => '/pages/get-involved.html',
                        'openModal' => false
                    ]
                ]
            ]
        ];

        $stmt = $pdo->prepare("INSERT INTO page_settings (pageKey, settingsJson, updatedAt) VALUES (?, ?, ?)");
        foreach ($pageSettings as $pageKey => $settings) {
            $stmt->execute([$pageKey, json_encode($settings, JSON_UNESCAPED_UNICODE), $now]);
        }
    }

    // 8. Seed Fossil Article Links
    if ((int)$pdo->query("SELECT COUNT(*) FROM fossil_article_links")->fetchColumn() === 0) {
        $fossilLinks = [
            [
                'id' => 'flink-1',
                'title' => 'RLNG disruption: a bane?',
                'publisher' => 'Dawn · Opinion & Analysis',
                'badge' => 'DAWN',
                'category' => 'articles',
                'url' => 'https://www.dawn.com/news/1997175?utm_source=whatsapp',
                'description' => 'Analysis of LNG contract obligations, supply disruptions, and power sector vulnerabilities in Pakistan.',
                'sortOrder' => 1
            ],
            [
                'id' => 'flink-2',
                'title' => 'Our Remarkable Natural Gas Overshoot',
                'publisher' => 'The News on Sunday · Special Report',
                'badge' => 'THE NEWS',
                'category' => 'articles',
                'url' => 'https://www.thenews.pk/tns/detail/1397737-our-remarkable-natural-gas-overshoot',
                'description' => 'An investigative review of Pakistan’s structural natural gas over-reliance and the urgent imperative for industrial phase-out.',
                'sortOrder' => 2
            ],
            [
                'id' => 'flink-3',
                'title' => 'Political Economy of Power, Energy, Climate and Justice',
                'publisher' => 'CAEA Research Publication (PDF)',
                'badge' => 'RESEARCH REPORT',
                'category' => 'research',
                'url' => 'https://drive.google.com/file/d/1LuXInnvuC11GMiHBM_NM4HoWxkRP_Fpa/view?usp=drive_link',
                'description' => 'Flagship policy report on power sector subsidies, circular debt, and the political ecology of fossil extraction.',
                'sortOrder' => 3
            ],
            [
                'id' => 'flink-4',
                'title' => 'CAEA Climate Action & Energy Access Dashboard',
                'publisher' => 'Live Interactive Platform',
                'badge' => 'DATA DASHBOARD',
                'category' => 'dashboard',
                'url' => '/pages/our-analytics.html',
                'description' => 'Interactive data portal for real-time energy capacity, transmission data, and emissions.',
                'sortOrder' => 4
            ],
            [
                'id' => 'flink-5',
                'title' => 'Policy Analysis & Regulatory Briefs',
                'publisher' => 'CAEA Policy Briefs',
                'badge' => 'POLICY ANALYSIS',
                'category' => 'policy',
                'url' => '#',
                'description' => 'Upcoming policy briefs, regulatory submissions to NEPRA, and power sector restructuring proposals.',
                'sortOrder' => 5
            ]
        ];

        $stmt = $pdo->prepare("INSERT INTO fossil_article_links (id, title, publisher, badge, category, url, description, sortOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($fossilLinks as $link) {
            $stmt->execute([$link['id'], $link['title'], $link['publisher'], $link['badge'], $link['category'], $link['url'], $link['description'], $link['sortOrder'], $now, $now]);
        }
    }

    // 9. Seed Climate Justice Article Links
    if ((int)$pdo->query("SELECT COUNT(*) FROM climate_article_links")->fetchColumn() === 0) {
        $climateLinks = [
            [
                'id' => 'clink-1',
                'title' => 'The hidden cost of development',
                'publisher' => 'The News on Sunday · Special Report',
                'badge' => 'THE NEWS',
                'category' => 'articles',
                'url' => 'https://www.thenews.com.pk/tns/detail/1023422-the-hidden-cost-of-development',
                'description' => 'Investigating the uncalculated social, ecological, and human costs of large-scale infrastructure and extractive projects in Pakistan.',
                'sortOrder' => 1
            ],
            [
                'id' => 'clink-2',
                'title' => 'E-11 interchange: boon or bane?',
                'publisher' => 'The News on Sunday · Urban Ecology',
                'badge' => 'THE NEWS',
                'category' => 'articles',
                'url' => 'https://www.thenews.com.pk/tns/detail/1074418-e-11-interchange-boon-or-bane',
                'description' => 'Critical analysis of urban displacement, car-centric road developments, and ecological disruption in Islamabad.',
                'sortOrder' => 2
            ],
            [
                'id' => 'clink-3',
                'title' => 'Loss and displacement',
                'publisher' => 'The News on Sunday · Climate Justice',
                'badge' => 'THE NEWS',
                'category' => 'articles',
                'url' => 'https://www.thenews.pk/tns/detail/1390589-loss-and-displacement',
                'description' => 'Frontline field reporting on communities experiencing climate catastrophe, involuntary displacement, and loss of sovereignty.',
                'sortOrder' => 3
            ],
            [
                'id' => 'clink-4',
                'title' => 'The development scarcity',
                'publisher' => 'The News on Sunday · Political Economy',
                'badge' => 'THE NEWS',
                'category' => 'articles',
                'url' => 'https://www.thenews.pk/tns/detail/1292148-the-development-scarcity',
                'description' => 'Investigating manufactured resource scarcity, unequal distribution of energy and water, and structural vulnerability.',
                'sortOrder' => 4
            ],
            [
                'id' => 'clink-5',
                'title' => 'Living Landscapes & Community Water Rights',
                'publisher' => 'CAEA Field Research',
                'badge' => 'RESEARCH & DOCUMENTATION',
                'category' => 'research',
                'url' => '#',
                'description' => 'Ongoing field investigations documenting the political ecology of the Indus Basin and community water sovereignty.',
                'sortOrder' => 5
            ],
            [
                'id' => 'clink-6',
                'title' => 'Legal Frameworks for Climate Loss & Damage in Pakistan',
                'publisher' => 'CAEA Legal & Policy Team',
                'badge' => 'REPORTS',
                'category' => 'reports',
                'url' => '#',
                'description' => 'Policy frameworks evaluating constitutional rights, environmental tribunals, and state accountability for displaced populations.',
                'sortOrder' => 6
            ],
            [
                'id' => 'clink-7',
                'title' => 'Voices from the Frontlines: Lake Manchar & Beyond',
                'publisher' => 'Visual & Audio Storytelling Archive',
                'badge' => 'MULTIMEDIA STORIES',
                'category' => 'multimedia',
                'url' => '#',
                'description' => 'Interactive photo essays, community audio testimonies, and visual archives capturing the lived realities of climate-hit ecologies.',
                'sortOrder' => 7
            ],
            [
                'id' => 'clink-8',
                'title' => 'Defending Ecologies & Community Sovereignty',
                'publisher' => 'CAEA Movement Building & Advocacy',
                'badge' => 'CAMPAIGNS',
                'category' => 'campaigns',
                'url' => '#',
                'description' => 'Grassroots mobilization campaigns, community kacheris, and participatory climate justice dialogues across Pakistan.',
                'sortOrder' => 8
            ]
        ];

        $stmt = $pdo->prepare("INSERT INTO climate_article_links (id, title, publisher, badge, category, url, description, sortOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($climateLinks as $link) {
            $stmt->execute([$link['id'], $link['title'], $link['publisher'], $link['badge'], $link['category'], $link['url'], $link['description'], $link['sortOrder'], $now, $now]);
        }
    }

    // 10. Seed Textile & Fast Fashion Article Links
    if ((int)$pdo->query("SELECT COUNT(*) FROM textile_cards")->fetchColumn() === 0) {
        $textileCards = [
            [
                'id' => 'tex-1',
                'title' => 'Fashion and Fossil Fuels: Supply Chain Investigation',
                'publisher' => 'CAEA Research Publication',
                'category' => 'Research & Reports',
                'url' => 'https://drive.google.com/file/d/1LuXInnvuC11GMiHBM_NM4HoWxkRP_Fpa/view?usp=drive_link',
                'description' => "Tracing synthetic fiber reliance, coal-fired industrial captive power plants, and supply chain accountability across Pakistan's textile hubs.",
                'sortOrder' => 1
            ],
            [
                'id' => 'tex-2',
                'title' => 'The Carbon Thread: Fast Fashion Exploitation',
                'publisher' => 'The News on Sunday',
                'category' => 'Article',
                'url' => 'https://www.thenews.pk/tns/detail/1023422-the-hidden-cost-of-development',
                'description' => 'Investigating synthetic fiber reliance, coal-fired industrial captive power plants, and fair wage transitions for garment workers across industrial zones.',
                'sortOrder' => 2
            ],
            [
                'id' => 'tex-3',
                'title' => 'Garment Workers & Community Testimonies',
                'publisher' => 'CAEA Field Briefing',
                'category' => 'Testimonials',
                'url' => '#apply',
                'description' => 'First-hand oral accounts and video recordings from garment workers and fenceline communities living along polluted industrial drainage canals.',
                'sortOrder' => 3
            ],
            [
                'id' => 'tex-4',
                'title' => "Demand Clean Energy & Fair Wages in Pakistan's Textile Sector",
                'publisher' => 'CAEA Public Action',
                'category' => 'Sign Our Petition',
                'url' => '#apply',
                'description' => 'Join our urgent public campaign petition demanding mandatory solarization of textile power, zero liquid discharge, and living wage protections.',
                'sortOrder' => 4
            ]
        ];

        $stmt = $pdo->prepare("INSERT INTO textile_cards (id, title, publisher, category, url, description, sortOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($textileCards as $card) {
            $stmt->execute([$card['id'], $card['title'], $card['publisher'], $card['category'], $card['url'], $card['description'], $card['sortOrder'], $now, $now]);
        }
    }
}
}
