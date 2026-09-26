<?php
/**
 * CAEA Institute - Authentication & Session API
 * api/auth.php
 */

require_once __DIR__ . '/config.php';

sendCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$rawInput = file_get_contents('php://input');
$inputData = json_decode($rawInput, true) ?? [];
if (empty($inputData) && !empty($_POST)) {
    $inputData = $_POST;
}

$action = $_GET['action'] ?? $inputData['action'] ?? 'check';

// Rate limiting state
if (!isset($_SESSION['auth_attempts'])) {
    $_SESSION['auth_attempts'] = 0;
}
if (!isset($_SESSION['auth_lockout_until'])) {
    $_SESSION['auth_lockout_until'] = 0;
}

// 1. Check current session status
if ($action === 'check') {
    $isAuthenticated = !empty($_SESSION['caea_admin_authenticated']) && $_SESSION['caea_admin_authenticated'] === true;
    sendJsonResponse([
        'success' => true,
        'authenticated' => $isAuthenticated,
        'loginTime' => $_SESSION['caea_admin_login_time'] ?? null
    ]);
}

// 2. Login
if ($action === 'login' && $method === 'POST') {
    $currentTime = time();
    if ($_SESSION['auth_lockout_until'] > $currentTime) {
        $remainingSeconds = $_SESSION['auth_lockout_until'] - $currentTime;
        sendErrorResponse("Too many failed attempts. Console locked for $remainingSeconds seconds.", 429, ['lockoutRemaining' => $remainingSeconds]);
    }

    $passcode = trim($inputData['passcode'] ?? '');
    $passhash = trim($inputData['passhash'] ?? '');

    if (!$passcode && !$passhash) {
        sendErrorResponse('Passcode or hash is required');
    }

    $calculatedHash = $passhash ? $passhash : hash('sha256', $passcode);

    // Verify against hashes
    $isValid = false;
    if ($calculatedHash === MASTER_PASSWORD_HASH || $calculatedHash === LEGACY_PASSWORD_HASH) {
        $isValid = true;
    }

    if ($isValid) {
        $_SESSION['caea_admin_authenticated'] = true;
        $_SESSION['caea_admin_login_time'] = date('Y-m-d H:i:s');
        $_SESSION['auth_attempts'] = 0;
        $_SESSION['auth_lockout_until'] = 0;

        sendJsonResponse([
            'success' => true,
            'message' => 'Authenticated successfully',
            'authenticated' => true
        ]);
    } else {
        $_SESSION['auth_attempts'] += 1;
        if ($_SESSION['auth_attempts'] >= 5) {
            $_SESSION['auth_lockout_until'] = time() + 60; // 60s lockout
            sendErrorResponse('Too many failed attempts. Console locked for 60 seconds.', 429, ['lockout' => 60]);
        }

        $remaining = 5 - $_SESSION['auth_attempts'];
        sendErrorResponse("Invalid administrative passcode. ($remaining attempts remaining)", 401, ['remainingAttempts' => $remaining]);
    }
}

// 3. Logout
if ($action === 'logout') {
    $_SESSION['caea_admin_authenticated'] = false;
    unset($_SESSION['caea_admin_authenticated']);
    unset($_SESSION['caea_admin_login_time']);
    session_destroy();

    sendJsonResponse([
        'success' => true,
        'message' => 'Logged out successfully',
        'authenticated' => false
    ]);
}

sendErrorResponse('Invalid authentication action', 400);
