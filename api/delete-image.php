<?php
/**
 * Image Delete API Endpoint
 * Handles image deletion for partners and services
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
header('Access-Control-Allow-Methods: POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Allow POST or DELETE methods
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    send_json_response(false, 'Method not allowed');
}

// Get JSON input
$json_input = file_get_contents('php://input');
$data = json_decode($json_input, true);

// Validate input
if (!$data || !isset($data['filename'])) {
    send_json_response(false, 'Filename is required');
}

// Sanitize filename to prevent directory traversal
$filename = sanitize_filename($data['filename']);

if (empty($filename)) {
    send_json_response(false, 'Invalid filename');
}

// Construct file path
$filePath = UPLOAD_DIR . $filename;

// Check if file exists
if (!file_exists($filePath)) {
    http_response_code(404);
    send_json_response(false, 'Image file not found');
}

// Verify file is within upload directory (security check)
$realPath = realpath($filePath);
$uploadDir = realpath(UPLOAD_DIR);

if (strpos($realPath, $uploadDir) !== 0) {
    log_error("Directory traversal attempt: " . $filename);
    send_json_response(false, 'Invalid file path');
}

// Delete the file
if (unlink($filePath)) {
    send_json_response(true, 'Image deleted successfully');
} else {
    log_error("Failed to delete file: " . $filename);
    send_json_response(false, 'Failed to delete image');
}
