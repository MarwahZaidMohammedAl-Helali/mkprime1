<?php
/**
 * Image Upload API Endpoint
 * Handles image uploads for partners and services
 */

// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Define API access constant
define('API_ACCESS', true);

// Include configuration
require_once __DIR__ . '/config.php';

// Handle CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json_response(false, 'Method not allowed');
}

// Check if image file was uploaded
if (!isset($_FILES['image']) || $_FILES['image']['error'] === UPLOAD_ERR_NO_FILE) {
    send_json_response(false, 'No image file provided');
}

$imageFile = $_FILES['image'];

// Validate image file
$validation = validate_file_upload($imageFile, ALLOWED_IMAGE_TYPES, ALLOWED_IMAGE_EXTENSIONS, MAX_FILE_SIZE);
if (!$validation['valid']) {
    send_json_response(false, $validation['error']);
}

// Generate unique filename
$uniqueFilename = generate_unique_filename($imageFile['name']);

// Set upload path (to public_html root)
$uploadPath = UPLOAD_DIR . $uniqueFilename;

// Move uploaded file
if (move_uploaded_file($imageFile['tmp_name'], $uploadPath)) {
    // Set file permissions
    chmod($uploadPath, 0644);
    
    send_json_response(true, 'Image uploaded successfully', ['filename' => $uniqueFilename]);
} else {
    log_error("Failed to move uploaded file: " . $imageFile['name']);
    send_json_response(false, 'Failed to upload image');
}
