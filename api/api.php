<?php
/**
 * CAEA Institute - Universal REST API Controller
 * api/api.php
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

sendCorsHeaders();

$pdo = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Parse incoming payload (JSON or Form POST)
$rawInput = file_get_contents('php://input');
$inputData = json_decode($rawInput, true) ?? [];
if (empty($inputData) && !empty($_POST)) {
    $inputData = $_POST;
}

$action = $_GET['action'] ?? $inputData['action'] ?? null;
$collection = $_GET['collection'] ?? $inputData['collection'] ?? null;
$id = $_GET['id'] ?? $inputData['id'] ?? null;

// Handle special bulk / maintenance actions
if ($action === 'status') {
    $counts = [];
    $tables = ['activities', 'people', 'articles', 'fossil_article_links', 'climate_article_links', 'textile_cards', 'opportunities', 'applications', 'media', 'map_pins', 'page_settings'];
    foreach ($tables as $t) {
        $counts[$t] = (int)$pdo->query("SELECT COUNT(*) FROM $t")->fetchColumn();
    }
    sendJsonResponse([
        'success' => true,
        'status' => 'online',
        'driver' => DB_DRIVER,
        'counts' => $counts,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}

if ($action === 'export') {
    $export = [];
    $tables = ['activities', 'people', 'articles', 'fossil_article_links', 'climate_article_links', 'textile_cards', 'opportunities', 'applications', 'media', 'map_pins'];
    foreach ($tables as $t) {
        $rows = $pdo->query("SELECT * FROM $t")->fetchAll();
        if ($t === 'map_pins') {
            foreach ($rows as &$r) {
                $r['left'] = $r['leftPos'] ?? ($r['left'] ?? '50%');
                $r['top'] = $r['topPos'] ?? ($r['top'] ?? '50%');
            }
        }
        if ($t === 'activities') {
            foreach ($rows as &$r) {
                if (!empty($r['images']) && is_string($r['images'])) {
                    $decoded = json_decode($r['images'], true);
                    $r['images'] = is_array($decoded) ? $decoded : [$r['image'] ?? 'assets/Hero-image.png'];
                }
                $r['featured'] = (bool)($r['featured'] ?? false);
            }
        }
        if ($t === 'people') {
            foreach ($rows as &$r) {
                $r['showInGrid'] = (bool)($r['showInGrid'] ?? true);
            }
        }
        $export[$t] = $rows;
    }
    
    // Unpack page_settings
    $pageSettingsRows = $pdo->query("SELECT * FROM page_settings")->fetchAll();
    $pageSettings = [];
    foreach ($pageSettingsRows as $row) {
        $pageSettings[$row['pageKey']] = json_decode($row['settingsJson'], true) ?? [];
    }
    $export['page_settings'] = $pageSettings;
    
    sendJsonResponse([
        'success' => true,
        'version' => '1.0',
        'exportedAt' => date('Y-m-d H:i:s'),
        'data' => $export
    ]);
}

if ($action === 'import' && ($method === 'POST' || $method === 'PUT')) {
    $payload = $inputData['data'] ?? $inputData;
    if (!is_array($payload)) {
        sendErrorResponse('Invalid import payload');
    }

    $pdo->beginTransaction();
    try {
        $tables = ['activities', 'people', 'articles', 'fossil_article_links', 'climate_article_links', 'textile_cards', 'opportunities', 'applications', 'media', 'map_pins', 'page_settings'];
        foreach ($tables as $t) {
            $pdo->exec("DELETE FROM $t");
        }

        $now = date('Y-m-d H:i:s');

        // Insert standard tables
        foreach (['activities', 'people', 'articles', 'fossil_article_links', 'climate_article_links', 'textile_cards', 'opportunities', 'applications', 'media', 'map_pins'] as $tbl) {
            if (!empty($payload[$tbl]) && is_array($payload[$tbl])) {
                foreach ($payload[$tbl] as $row) {
                    $keys = array_keys($row);
                    $cols = implode(', ', $keys);
                    $placeholders = implode(', ', array_fill(0, count($keys), '?'));
                    $stmt = $pdo->prepare("INSERT INTO $tbl ($cols) VALUES ($placeholders)");
                    $stmt->execute(array_values($row));
                }
            }
        }

        // Insert page settings
        if (!empty($payload['page_settings']) && is_array($payload['page_settings'])) {
            $stmt = $pdo->prepare("INSERT INTO page_settings (pageKey, settingsJson, updatedAt) VALUES (?, ?, ?)");
            foreach ($payload['page_settings'] as $key => $val) {
                $stmt->execute([$key, is_string($val) ? $val : json_encode($val, JSON_UNESCAPED_UNICODE), $now]);
            }
        }

        $pdo->commit();
        sendJsonResponse(['success' => true, 'message' => 'Database imported successfully']);
    } catch (Exception $e) {
        $pdo->rollBack();
        sendErrorResponse('Import failed: ' . $e->getMessage(), 500);
    }
}

if ($action === 'reset' && $method === 'POST') {
    try {
        $tables = ['activities', 'people', 'articles', 'fossil_article_links', 'climate_article_links', 'textile_cards', 'opportunities', 'applications', 'media', 'map_pins', 'page_settings'];
        foreach ($tables as $t) {
            $pdo->exec("DELETE FROM $t");
        }
        // Call seed logic
        $reflection = new ReflectionClass('Database');
        $seedMethod = $reflection->getMethod('seedDatabaseIfEmpty');
        $seedMethod->setAccessible(true);
        $seedMethod->invoke(null, $pdo);

        sendJsonResponse(['success' => true, 'message' => 'Database successfully reset to initial seed data']);
    } catch (Exception $e) {
        sendErrorResponse('Reset failed: ' . $e->getMessage(), 500);
    }
}

// Map collection names to tables
$validTables = [
    'activities' => 'activities',
    'people' => 'people',
    'articles' => 'articles',
    'fossil_article_links' => 'fossil_article_links',
    'fossilarticlelinks' => 'fossil_article_links',
    'fossillinks' => 'fossil_article_links',
    'climate_article_links' => 'climate_article_links',
    'climatearticlelinks' => 'climate_article_links',
    'climatelinks' => 'climate_article_links',
    'textile_cards' => 'textile_cards',
    'textilecards' => 'textile_cards',
    'textile' => 'textile_cards',
    'fast_fashion_cards' => 'textile_cards',
    'fastfashioncards' => 'textile_cards',
    'fastfashion' => 'textile_cards',
    'opportunities' => 'opportunities',
    'applications' => 'applications',
    'media' => 'media',
    'map_pins' => 'map_pins',
    'page_settings' => 'page_settings',
    'settings' => 'page_settings'
];

if (!$collection || !isset($validTables[$collection])) {
    sendErrorResponse('Invalid or missing collection parameter. Valid collections: ' . implode(', ', array_keys($validTables)), 400);
}

$tableName = $validTables[$collection];

// ==========================================
// SPECIAL HANDLING FOR PAGE SETTINGS
// ==========================================
if ($tableName === 'page_settings') {
    if ($method === 'GET') {
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM page_settings WHERE pageKey = ?");
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            if ($row) {
                $decoded = json_decode($row['settingsJson'], true);
                sendJsonResponse(['success' => true, 'pageKey' => $row['pageKey'], 'data' => $decoded, 'updatedAt' => $row['updatedAt']]);
            } else {
                sendJsonResponse(['success' => true, 'pageKey' => $id, 'data' => null]);
            }
        } else {
            $stmt = $pdo->query("SELECT * FROM page_settings");
            $rows = $stmt->fetchAll();
            $result = [];
            foreach ($rows as $r) {
                $result[$r['pageKey']] = json_decode($r['settingsJson'], true) ?? [];
            }
            sendJsonResponse(['success' => true, 'data' => $result]);
        }
    }

    if ($method === 'POST' || $method === 'PUT') {
        $pageKey = $id ?? $inputData['pageKey'] ?? null;
        $settings = $inputData['data'] ?? $inputData['settings'] ?? $inputData;
        
        // Remove helper keys if passed inside settings
        unset($settings['action'], $settings['collection'], $settings['pageKey'], $settings['id']);

        if (!$pageKey) {
            sendErrorResponse('Missing pageKey for page settings');
        }

        $now = date('Y-m-d H:i:s');
        $jsonStr = json_encode($settings, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        $stmt = $pdo->prepare("INSERT INTO page_settings (pageKey, settingsJson, updatedAt) VALUES (?, ?, ?)
            ON CONFLICT(pageKey) DO UPDATE SET settingsJson = excluded.settingsJson, updatedAt = excluded.updatedAt");
        
        // SQLite / MySQL compatibility
        if (DB_DRIVER === 'mysql') {
            $stmt = $pdo->prepare("INSERT INTO page_settings (pageKey, settingsJson, updatedAt) VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE settingsJson = VALUES(settingsJson), updatedAt = VALUES(updatedAt)");
        }

        $stmt->execute([$pageKey, $jsonStr, $now]);
        sendJsonResponse(['success' => true, 'pageKey' => $pageKey, 'data' => $settings, 'updatedAt' => $now]);
    }
}

// ==========================================
// STANDARD CRUD ROUTING
// ==========================================

// 1. READ (GET)
if ($method === 'GET') {
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM $tableName WHERE id = ?");
        $stmt->execute([$id]);
        $record = $stmt->fetch();
        if (!$record) {
            sendErrorResponse("Record not found in $collection with ID $id", 404);
        }
        sendJsonResponse(['success' => true, 'data' => $record]);
    } else {
        // Support optional query filters (e.g. ?category=WORKSHOP or ?status=Open)
        $whereClauses = [];
        $params = [];
        foreach ($_GET as $k => $v) {
            if (in_array($k, ['collection', 'action', 'id', 'limit', 'offset', 'sort', 'order'])) continue;
            $whereClauses[] = "`$k` = ?";
            $params[] = $v;
        }

        $sql = "SELECT * FROM $tableName";
        if (!empty($whereClauses)) {
            $sql .= " WHERE " . implode(" AND ", $whereClauses);
        }

        $sort = $_GET['sort'] ?? null;
        $order = strtoupper($_GET['order'] ?? 'ASC') === 'DESC' ? 'DESC' : 'ASC';
        
        if ($sort) {
            $sql .= " ORDER BY `$sort` $order";
        } else {
            if (in_array($tableName, ['people', 'activities', 'articles', 'opportunities', 'media', 'map_pins', 'fossil_article_links', 'climate_article_links', 'textile_cards'])) {
                $sql .= " ORDER BY sortOrder ASC, createdAt DESC";
            } else {
                $sql .= " ORDER BY createdAt DESC";
            }
        }

        if (isset($_GET['limit'])) {
            $limit = (int)$_GET['limit'];
            $offset = (int)($_GET['offset'] ?? 0);
            $sql .= " LIMIT $limit OFFSET $offset";
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $records = $stmt->fetchAll();

        // Normalize map_pins fields
        if ($tableName === 'map_pins') {
            foreach ($records as &$r) {
                $r['left'] = $r['leftPos'] ?? ($r['left'] ?? '50%');
                $r['top'] = $r['topPos'] ?? ($r['top'] ?? '50%');
            }
        }

        // Unpack activities images array
        if ($tableName === 'activities') {
            foreach ($records as &$r) {
                if (!empty($r['images']) && is_string($r['images'])) {
                    $decoded = json_decode($r['images'], true);
                    if (is_array($decoded)) {
                        $r['images'] = $decoded;
                    }
                }
            }
        }

        sendJsonResponse(['success' => true, 'data' => $records, 'count' => count($records)]);
    }
}

// 2. CREATE (POST)
if ($method === 'POST' && $action !== 'delete' && $action !== 'update') {
    $record = $inputData['data'] ?? $inputData;
    unset($record['collection'], $record['action']);

    if (empty($record['id'])) {
        $prefix = substr($tableName, 0, 3);
        $record['id'] = $prefix . '-' . time() . '-' . rand(100, 999);
    }

    $now = date('Y-m-d H:i:s');
    $record['createdAt'] = $record['createdAt'] ?? $now;
    $record['updatedAt'] = $now;

    // Convert boolean to integer for sqlite
    if (isset($record['featured'])) {
        $record['featured'] = $record['featured'] ? 1 : 0;
    }
    if (isset($record['showInGrid'])) {
        $record['showInGrid'] = ($record['showInGrid'] && $record['showInGrid'] !== '0' && $record['showInGrid'] !== 'false') ? 1 : 0;
    }

    // Serialize activities images array to JSON string
    if ($tableName === 'activities' && isset($record['images'])) {
        if (is_array($record['images'])) {
            $record['images'] = json_encode($record['images'], JSON_UNESCAPED_UNICODE);
        }
    }
    unset($record['orderIndex']);

    // Normalize map_pins fields
    if ($tableName === 'map_pins') {
        if (isset($record['left']) && !isset($record['leftPos'])) {
            $record['leftPos'] = $record['left'];
        }
        if (isset($record['top']) && !isset($record['topPos'])) {
            $record['topPos'] = $record['top'];
        }
        unset($record['left'], $record['top']);
    }

    $columns = array_keys($record);
    $placeholders = array_fill(0, count($columns), '?');

    $sql = sprintf(
        "INSERT INTO %s (%s) VALUES (%s)",
        $tableName,
        implode(', ', $columns),
        implode(', ', $placeholders)
    );

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array_values($record));
        sendJsonResponse(['success' => true, 'message' => 'Record created', 'data' => $record], 201);
    } catch (PDOException $e) {
        sendErrorResponse('Failed to create record: ' . $e->getMessage(), 500);
    }
}

// 3. UPDATE (PUT or POST with action=update)
if ($method === 'PUT' || ($method === 'POST' && ($action === 'update' || !empty($id)))) {
    $targetId = $id ?? $inputData['id'] ?? null;
    if (!$targetId) {
        sendErrorResponse('ID required for update operation');
    }

    $record = $inputData['data'] ?? $inputData;
    unset($record['collection'], $record['action'], $record['id'], $record['createdAt']);

    $record['updatedAt'] = date('Y-m-d H:i:s');
    if (isset($record['featured'])) {
        $record['featured'] = $record['featured'] ? 1 : 0;
    }
    if (isset($record['showInGrid'])) {
        $record['showInGrid'] = ($record['showInGrid'] && $record['showInGrid'] !== '0' && $record['showInGrid'] !== 'false') ? 1 : 0;
    }

    // Serialize activities images array to JSON string
    if ($tableName === 'activities' && isset($record['images'])) {
        if (is_array($record['images'])) {
            $record['images'] = json_encode($record['images'], JSON_UNESCAPED_UNICODE);
        }
    }
    unset($record['orderIndex']);

    // Normalize map_pins fields
    if ($tableName === 'map_pins') {
        if (isset($record['left']) && !isset($record['leftPos'])) {
            $record['leftPos'] = $record['left'];
        }
        if (isset($record['top']) && !isset($record['topPos'])) {
            $record['topPos'] = $record['top'];
        }
        unset($record['left'], $record['top']);
    }

    $setClauses = [];
    $values = [];
    foreach ($record as $col => $val) {
        $setClauses[] = "$col = ?";
        $values[] = $val;
    }
    $values[] = $targetId;

    $sql = sprintf("UPDATE %s SET %s WHERE id = ?", $tableName, implode(', ', $setClauses));

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);

        // Return updated record
        $fetchStmt = $pdo->prepare("SELECT * FROM $tableName WHERE id = ?");
        $fetchStmt->execute([$targetId]);
        $updatedRecord = $fetchStmt->fetch();

        if ($tableName === 'map_pins' && $updatedRecord) {
            $updatedRecord['left'] = $updatedRecord['leftPos'] ?? '50%';
            $updatedRecord['top'] = $updatedRecord['topPos'] ?? '50%';
        }

        sendJsonResponse(['success' => true, 'message' => 'Record updated', 'data' => $updatedRecord]);
    } catch (PDOException $e) {
        sendErrorResponse('Failed to update record: ' . $e->getMessage(), 500);
    }
}

// 4. DELETE (DELETE or POST with action=delete)
if ($method === 'DELETE' || ($method === 'POST' && $action === 'delete')) {
    $targetId = $id ?? $inputData['id'] ?? null;
    if (!$targetId) {
        sendErrorResponse('ID required for delete operation');
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM $tableName WHERE id = ?");
        $stmt->execute([$targetId]);
        sendJsonResponse(['success' => true, 'message' => "Record $targetId deleted from $collection"]);
    } catch (PDOException $e) {
        sendErrorResponse('Failed to delete record: ' . $e->getMessage(), 500);
    }
}

sendErrorResponse('Unsupported request method or action', 405);
