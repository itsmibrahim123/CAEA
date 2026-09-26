<?php
/**
 * CAEA Institute - Media & File Upload Controller
 * api/upload.php
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

sendCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendErrorResponse('Upload endpoint only accepts POST requests', 405);
}

// Check if uploads folder exists, create if not
if (!is_dir(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}

$fileKey = null;
if (isset($_FILES['file']) && $_FILES['file']['error'] !== UPLOAD_ERR_NO_FILE) {
    $fileKey = 'file';
} elseif (isset($_FILES['media']) && $_FILES['media']['error'] !== UPLOAD_ERR_NO_FILE) {
    $fileKey = 'media';
} elseif (isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
    $fileKey = 'image';
} elseif (isset($_FILES['video']) && $_FILES['video']['error'] !== UPLOAD_ERR_NO_FILE) {
    $fileKey = 'video';
}

if (!$fileKey) {
    sendErrorResponse('No file uploaded or file exceeds server upload_max_filesize directive');
}

$file = $_FILES[$fileKey];

// Check upload error
if ($file['error'] !== UPLOAD_ERR_OK) {
    $errors = [
        UPLOAD_ERR_INI_SIZE   => 'The uploaded file exceeds upload_max_filesize in php.ini',
        UPLOAD_ERR_FORM_SIZE  => 'The uploaded file exceeds MAX_FILE_SIZE specified in the HTML form',
        UPLOAD_ERR_PARTIAL    => 'The uploaded file was only partially uploaded',
        UPLOAD_ERR_NO_FILE    => 'No file was uploaded',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing a temporary folder on server',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
        UPLOAD_ERR_EXTENSION  => 'A PHP extension stopped the file upload'
    ];
    sendErrorResponse($errors[$file['error']] ?? 'Unknown upload error');
}

// Check file size
if ($file['size'] > MAX_UPLOAD_SIZE) {
    sendErrorResponse('File size (' . round($file['size'] / 1024 / 1024, 2) . 'MB) exceeds maximum allowed limit of 50MB');
}

// Allowed MIME types and extensions
$allowedTypes = [
    // Images
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif',
    'image/svg+xml' => 'svg',
    'image/avif' => 'avif',
    // Videos
    'video/mp4'  => 'mp4',
    'video/webm' => 'webm',
    'video/ogg'  => 'ogv',
    'video/quicktime' => 'mov',
    // Documents
    'application/pdf' => 'pdf'
];

$finfo = new finfo(FILEINFO_MIME_TYPE);
$detectedMime = $finfo->file($file['tmp_name']);

$originalName = basename($file['name']);
$originalExt = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

// Fallback extension matching
$validExt = false;
$targetExt = $allowedTypes[$detectedMime] ?? null;

if ($targetExt || in_array($originalExt, ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif', 'mp4', 'webm', 'mov', 'pdf'])) {
    $validExt = true;
    if (!$targetExt) {
        $targetExt = ($originalExt === 'jpeg') ? 'jpg' : $originalExt;
    }
}

if (!$validExt) {
    sendErrorResponse("Unsupported file type: $detectedMime (extension: $originalExt). Allowed: images, mp4/webm videos, PDF");
}

// Generate clean, collision-free filename
$cleanName = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($originalName, PATHINFO_FILENAME));
$cleanName = substr($cleanName, 0, 40);
$uniqueFilename = $cleanName . '_' . date('Ymd_His') . '_' . substr(uniqid(), -4) . '.' . $targetExt;
$destinationPath = UPLOAD_DIR . $uniqueFilename;

// Move file
if (!move_uploaded_file($file['tmp_name'], $destinationPath)) {
    sendErrorResponse('Failed to move uploaded file to destination directory', 500);
}

// Set file permissions
chmod($destinationPath, 0644);

$publicUrl = 'uploads/' . $uniqueFilename;
$mediaId = 'med-' . time() . '-' . rand(100, 999);
$category = (strpos($detectedMime, 'video/') === 0) ? 'Video' : ((strpos($detectedMime, 'image/') === 0) ? 'Image' : 'Document');
$title = $_POST['title'] ?? pathinfo($originalName, PATHINFO_FILENAME);
$tags = $_POST['tags'] ?? ($category === 'Video' ? 'video, featured' : 'upload, gallery');

// Insert into media database table
try {
    $pdo = Database::getConnection();
    $stmt = $pdo->prepare("INSERT INTO media (id, title, category, path, tags, date, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $now = date('Y-m-d H:i:s');
    $stmt->execute([
        $mediaId,
        $title,
        $category,
        $publicUrl,
        $tags,
        date('Y-m-d'),
        $now
    ]);
} catch (Exception $e) {
    // Database record creation failure shouldn't fail the upload return
    error_log("Failed to insert media row: " . $e->getMessage());
}

sendJsonResponse([
    'success' => true,
    'message' => 'File uploaded successfully',
    'file' => [
        'id' => $mediaId,
        'name' => $uniqueFilename,
        'originalName' => $originalName,
        'path' => $publicUrl,
        'url' => '/' . $publicUrl,
        'relativeUrl' => $publicUrl,
        'mime' => $detectedMime,
        'size' => $file['size'],
        'category' => $category,
        'title' => $title
    ]
], 201);
