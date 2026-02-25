<?php
/**
 * Job Application API Endpoint
 * Handles job application submissions with CV upload and sends email notifications
 */

// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Define API access constant
define('API_ACCESS', true);

// Include configuration
require_once __DIR__ . '/config.php';

// Include PHPMailer
require_once __DIR__ . '/PHPMailer/Exception.php';
require_once __DIR__ . '/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

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

// Extract and sanitize form data
$name = isset($_POST['name']) ? sanitize_input($_POST['name']) : '';
$email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
$phone = isset($_POST['phone']) ? sanitize_input($_POST['phone']) : '';
$nationality = isset($_POST['nationality']) ? sanitize_input($_POST['nationality']) : '';
$currentCountry = isset($_POST['currentCountry']) ? sanitize_input($_POST['currentCountry']) : '';
$whyHireYou = isset($_POST['whyHireYou']) ? sanitize_input($_POST['whyHireYou']) : '';
$detectedCountry = isset($_POST['detectedCountry']) ? sanitize_input($_POST['detectedCountry']) : '';
$detectedCountryCode = isset($_POST['detectedCountryCode']) ? sanitize_input($_POST['detectedCountryCode']) : '';

// Validate required fields
if (empty($name)) {
    send_json_response(false, 'Name is required');
}

if (empty($email) || !validate_email($email)) {
    send_json_response(false, 'Valid email is required');
}

if (empty($phone)) {
    send_json_response(false, 'Phone number is required');
}

if (empty($nationality)) {
    send_json_response(false, 'Nationality is required');
}

if (empty($currentCountry)) {
    send_json_response(false, 'Current country is required');
}

if (empty($whyHireYou)) {
    send_json_response(false, 'Please tell us why we should hire you');
}

// Validate CV file upload
if (!isset($_FILES['cv']) || $_FILES['cv']['error'] === UPLOAD_ERR_NO_FILE) {
    send_json_response(false, 'CV file is required');
}

$cvFile = $_FILES['cv'];

// Validate CV file
$validation = validate_file_upload($cvFile, ALLOWED_CV_TYPES, ALLOWED_CV_EXTENSIONS, MAX_FILE_SIZE);
if (!$validation['valid']) {
    send_json_response(false, $validation['error']);
}

// Create timestamp
$timestamp = date('l, F j, Y') . ' • ' . date('g:i A');

// Flag URL
$flagUrl = $detectedCountryCode ? "https://flagcdn.com/80x60/" . strtolower($detectedCountryCode) . ".png" : '';

// Calculate file size in KB
$fileSizeKB = number_format($cvFile['size'] / 1024, 2);

// Create email HTML body
$emailBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #eaeaea;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #eaeaea; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04);">
          
          <!-- Accent Bar -->
          <tr>
            <td style="height: 5px; background: linear-gradient(90deg, #000000 0%, #444444 50%, #000000 100%);"></td>
          </tr>

          <!-- Header with Brand -->
          <tr>
            <td style="padding: 36px 44px 0 44px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                      <tr>
                        <td style="width: 32px; height: 32px; background-color: #000000; border-radius: 8px; text-align: center; vertical-align: middle;">
                          <span style="color: #ffffff; font-size: 14px; font-weight: 800;">M</span>
                        </td>
                        <td style="padding-left: 10px;">
                          <p style="margin: 0; font-size: 16px; font-weight: 800; color: #000000; letter-spacing: 2px;">MKPRIME</p>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 0; font-size: 11px; font-weight: 700; color: #b0b0b0; text-transform: uppercase; letter-spacing: 2.5px;">Job Application Received</p>
                    <h1 style="margin: 10px 0 0 0; font-size: 24px; font-weight: 700; color: #0a0a0a; line-height: 1.3;">New job application ✨</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Timestamp -->
          <tr>
            <td style="padding: 12px 44px 0 44px;">
              <p style="margin: 0; font-size: 12px; color: #b0b0b0;">$timestamp</p>
            </td>
          </tr>

          <!-- Application Details Card -->
          <tr>
            <td style="padding: 24px 44px 0 44px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f9f9f9 0%, #f4f4f4 100%); border-radius: 14px; border-left: 4px solid #000000;">
                <tr>
                  <td style="padding: 28px 30px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p style="margin: 0; font-size: 10px; font-weight: 700; color: #aaaaaa; text-transform: uppercase; letter-spacing: 2px;">Application Details</p>
                        </td>
                        <td align="right">
                          <span style="display: inline-block; padding: 3px 10px; background-color: #e8f5e9; color: #2e7d32; font-size: 10px; font-weight: 700; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">New</span>
                        </td>
                      </tr>
                    </table>
                    <div style="margin-top: 14px; height: 1px; background-color: #e8e8e8;"></div>
                    
                    <!-- Nationality & Current Country -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 18px;">
                      <tr>
                        <td width="48%" valign="top">
                          <p style="margin: 0; font-size: 11px; font-weight: 700; color: #999999; text-transform: uppercase; letter-spacing: 1px;">Nationality</p>
                          <p style="margin: 6px 0 0 0; font-size: 15px; font-weight: 600; color: #1a1a1a;">$nationality</p>
                        </td>
                        <td width="4%"></td>
                        <td width="48%" valign="top">
                          <p style="margin: 0; font-size: 11px; font-weight: 700; color: #999999; text-transform: uppercase; letter-spacing: 1px;">Current Country</p>
                          <p style="margin: 6px 0 0 0; font-size: 15px; font-weight: 600; color: #1a1a1a;">$currentCountry</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Why Hire You -->
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e8e8e8;">
                      <p style="margin: 0; font-size: 11px; font-weight: 700; color: #999999; text-transform: uppercase; letter-spacing: 1px;">Why Should We Hire You?</p>
                      <p style="margin: 10px 0 0 0; font-size: 15px; color: #1a1a1a; line-height: 1.8; white-space: pre-wrap;">$whyHireYou</p>
                    </div>

                    <!-- CV Attachment -->
                    <div style="margin-top: 20px; padding: 14px 18px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e8e8e8;">
                      <p style="margin: 0; font-size: 13px; color: #1a1a1a;">
                        <strong>📎 CV Attached:</strong> {$cvFile['name']} <span style="color: #999999;">($fileSizeKB KB)</span>
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height: 16px;"></td></tr>

          <!-- Applicant Details with Flag -->
          <tr>
            <td style="padding: 0 44px 36px 44px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; border-radius: 14px; border: 1px solid #f0f0f0;">
                <tr>
                  <td style="padding: 22px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <!-- Country Flag -->
                        <td width="56" valign="middle" align="center">
HTML;

if ($detectedCountryCode) {
    $emailBody .= <<<HTML
                          <img src="$flagUrl" alt="$detectedCountry" width="36" height="27" style="display: block; margin: 0 auto; border-radius: 4px; border: 1px solid #e8e8e8;" />
                          <p style="margin: 5px 0 0 0; font-size: 9px; font-weight: 700; color: #aaaaaa; text-transform: uppercase; letter-spacing: 0.5px; text-align: center; white-space: nowrap;">$detectedCountry</p>
HTML;
} else {
    $emailBody .= <<<HTML
                          <div style="width: 36px; height: 27px; background-color: #e0e0e0; border-radius: 4px; margin: 0 auto;"></div>
                          <p style="margin: 5px 0 0 0; font-size: 9px; font-weight: 700; color: #cccccc; text-align: center;">N/A</p>
HTML;
}

$emailBody .= <<<HTML
                        </td>
                        <!-- Vertical Divider -->
                        <td width="1" valign="middle" style="padding: 0 18px;">
                          <div style="width: 1px; height: 40px; background-color: #e8e8e8;"></div>
                        </td>
                        <!-- Name & Email -->
                        <td valign="middle">
                          <p style="margin: 0; font-size: 16px; font-weight: 700; color: #111111;">$name</p>
                          <p style="margin: 4px 0 0 0; font-size: 13px; color: #999999;">
                            <a href="mailto:$email" style="color: #999999; text-decoration: none;">$email</a>
                          </p>
                        </td>
                        <!-- Phone Badge -->
                        <td align="right" valign="middle">
                          <table cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; border: 1px solid #eeeeee;">
                            <tr>
                              <td style="padding: 10px 16px;">
                                <p style="margin: 0; font-size: 10px; font-weight: 700; color: #bbbbbb; text-transform: uppercase; letter-spacing: 1px;">Phone</p>
                                <p style="margin: 3px 0 0 0; font-size: 14px; font-weight: 600; color: #222222;">$phone</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;

// Create PHPMailer instance
$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USERNAME;
    $mail->Password   = SMTP_PASSWORD;
    $mail->SMTPSecure = SMTP_SECURE;
    $mail->Port       = SMTP_PORT;
    $mail->CharSet    = 'UTF-8';

    // Recipients
    $mail->setFrom(SMTP_FROM_EMAIL, SMTP_FROM_NAME);
    $mail->addAddress(SMTP_FROM_EMAIL);
    $mail->addReplyTo($email, $name);

    // Attach CV file
    $mail->addAttachment($cvFile['tmp_name'], $cvFile['name']);

    // Content
    $mail->isHTML(true);
    $mail->Subject = "New Job Application - $name | MKPRIME";
    $mail->Body    = $emailBody;

    // Send email
    $mail->send();
    
    send_json_response(true, 'Application submitted successfully');
    
} catch (Exception $e) {
    log_error("Job application email error: " . $mail->ErrorInfo);
    send_json_response(false, 'Failed to submit application. Please try again later.');
}
