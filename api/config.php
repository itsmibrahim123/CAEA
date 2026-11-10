<?php
/**
 * CAEA Institute - Backend Configuration
 * api/config.php
 */

// Disable direct error output in production (log to file instead)
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

// Timezone
date_default_timezone_set('Asia/Karachi');

// Session configuration
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    session_start();
}

// Optional local override file (never committed to Git or overwritten by zip uploads)
if (file_exists(__DIR__ . '/config.local.php')) {
    require_once __DIR__ . '/config.local.php';
}

// Database Configuration
if (!defined('DB_DRIVER')) define('DB_DRIVER', 'mysql'); // Explicitly set to MySQL for Hostinger

// SQLite Configuration (Fallback)
if (!defined('SQLITE_FILE')) define('SQLITE_FILE', __DIR__ . '/../data/database.sqlite');

// MySQL Configuration (Hostinger MySQL)
if (!defined('DB_HOST')) define('DB_HOST', 'localhost');
if (!defined('DB_PORT')) define('DB_PORT', '3306');
if (!defined('DB_NAME')) define('DB_NAME', 'u139314753_db_ko6NBXr5');
if (!defined('DB_USER')) define('DB_USER', 'u139314753_usr_ko6NBXr5');
if (!defined('DB_PASS')) define('DB_PASS', '<USER_DB_PASSWORD>'); // Enter your MySQL user password
if (!defined('DB_CHARSET')) define('DB_CHARSET', 'utf8mb4');

// Upload Paths
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('UPLOAD_URL_PREFIX', '/uploads/');
define('MAX_UPLOAD_SIZE', 50 * 1024 * 1024); // 50MB for video and high-res photos

// Security & Authentication
// Master password SHA-256 hash: CAEA@Admin#2026!
define('MASTER_PASSWORD_HASH', '0bd52dc00fb3e853b13ee73b111a4d1e7ff453ed865812db6a11a6cee533f221');
define('LEGACY_PASSWORD_HASH', 'f8ce72e90f230559f515ee0420e6a4b1b369c733364f849ecb13bd600fae24be'); // caea2024

// CORS & JSON Response Headers
function sendCorsHeaders() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");
    header("Content-Type: application/json; charset=UTF-8");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// Helper to send standard JSON responses
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

function sendErrorResponse($message, $statusCode = 400, $details = null) {
    http_response_code($statusCode);
    $response = [
        'success' => false,
        'error' => $message
    ];
    if ($details !== null) {
        $response['details'] = $details;
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit();
}
