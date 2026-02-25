<?php
/**
 * Job Application API Endpoint - SendGrid Version
 * Handles job application submissions and sends email via SendGrid
 */

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Handle CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// SendGrid API Configuration
define('SENDGRID_API_KEY', getenv('SENDGRID_API_KEY') ?: '');
define('FROM_EMAIL', getenv('FROM_EMAIL') ?: 'mkprime667@gmail.com');
define('FROM_NAME', 'MKPRIME');
define('TO_EMAIL', getenv('TO_EMAIL') ?: 'mkprime667@gmail.com');

// Get form data
$name = isset($_POST['name']) ? htmlspecialchars(trim($_POST['name'])) : '';
$nationality = isset($_POST['nationality']) ? htmlspecialchars(trim($_POST['nationality'])) : '';
$currentCountry = isset($_POST['currentCountry']) ? htmlspecialchars(trim($_POST['currentCountry'])) : '';
$phone = isset($_POST['phone']) ? htmlspecialchars(trim($_POST['phone'])) : '';
$email = isset($_POST['email']) ? htmlspecialchars(trim($_POST['email'])) : '';
$whyHireYou = isset($_POST['whyHireYou']) ? htmlspecialchars(trim($_POST['whyHireYou'])) : '';
$jobPosition = isset($_POST['jobPosition']) ? htmlspecialchars(trim($_POST['jobPosition'])) : 'General Application';

// Validate required fields
if (empty($name)) {
    echo json_encode(['success' => false, 'message' => 'Name is required']);
    exit;
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Valid email is required']);
    exit;
}

if (empty($phone)) {
    echo json_encode(['success' => false, 'message' => 'Phone number is required']);
    exit;
}

// Handle CV file upload
$cvAttachment = null;
if (isset($_FILES['cv']) && $_FILES['cv']['error'] === UPLOAD_ERR_OK) {
    $cvContent = file_get_contents($_FILES['cv']['tmp_name']);
    $cvBase64 = base64_encode($cvContent);
    $cvFilename = $_FILES['cv']['name'];
    $cvType = $_FILES['cv']['type'];
    
    $cvAttachment = [
        'content' => $cvBase64,
        'filename' => $cvFilename,
        'type' => $cvType,
        'disposition' => 'attachment'
    ];
}

// Create timestamp
$timestamp = date('l, F j, Y') . ' • ' . date('g:i A');

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
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 40px rgba(0,0,0,0.08);">
          
          <!-- Accent Bar -->
          <tr>
            <td style="height: 5px; background: linear-gradient(90deg, #000000 0%, #444444 50%, #000000 100%);"></td>
          </tr>

          <!-- Header -->
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
                    <p style="margin: 0; font-size: 11px; font-weight: 700; color: #b0b0b0; text-transform: uppercase; letter-spacing: 2.5px;">New Job Application</p>
                    <h1 style="margin: 10px 0 0 0; font-size: 24px; font-weight: 700; color: #0a0a0a;">New Application Received 🎯</h1>
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

          <!-- Position Badge -->
          <tr>
            <td style="padding: 20px 44px;">
              <table cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #000000 0%, #333333 100%); border-radius: 12px;">
                <tr>
                  <td style="padding: 16px 24px;">
                    <p style="margin: 0; font-size: 11px; font-weight: 700; color: #999999; text-transform: uppercase; letter-spacing: 1.5px;">Position Applied For</p>
                    <p style="margin: 6px 0 0 0; font-size: 18px; font-weight: 700; color: #ffffff;">$jobPosition</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Applicant Details -->
          <tr>
            <td style="padding: 0 44px 24px 44px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; border-radius: 14px; border: 1px solid #f0f0f0;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0; font-size: 10px; font-weight: 700; color: #aaaaaa; text-transform: uppercase; letter-spacing: 2px;">Applicant Information</p>
                    <div style="margin-top: 16px; height: 1px; background-color: #e8e8e8;"></div>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px;">
                      <tr>
                        <td style="padding: 8px 0;">
                          <p style="margin: 0; font-size: 11px; color: #999999;">Full Name</p>
                          <p style="margin: 4px 0 0 0; font-size: 15px; font-weight: 600; color: #111111;">$name</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <p style="margin: 0; font-size: 11px; color: #999999;">Email</p>
                          <p style="margin: 4px 0 0 0; font-size: 14px; color: #111111;">$email</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <p style="margin: 0; font-size: 11px; color: #999999;">Phone</p>
                          <p style="margin: 4px 0 0 0; font-size: 14px; color: #111111;">$phone</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <p style="margin: 0; font-size: 11px; color: #999999;">Nationality</p>
                          <p style="margin: 4px 0 0 0; font-size: 14px; color: #111111;">$nationality</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <p style="margin: 0; font-size: 11px; color: #999999;">Current Country</p>
                          <p style="margin: 4px 0 0 0; font-size: 14px; color: #111111;">$currentCountry</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Why Hire You -->
          <tr>
            <td style="padding: 0 44px 36px 44px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f9f9f9 0%, #f4f4f4 100%); border-radius: 14px; border-left: 4px solid #000000;">
                <tr>
                  <td style="padding: 24px 28px;">
                    <p style="margin: 0; font-size: 10px; font-weight: 700; color: #aaaaaa; text-transform: uppercase; letter-spacing: 2px;">Why Should We Hire You?</p>
                    <div style="margin-top: 12px; height: 1px; background-color: #e8e8e8;"></div>
                    <p style="margin: 16px 0 0 0; font-size: 14px; color: #1a1a1a; line-height: 1.7; white-space: pre-wrap;">$whyHireYou</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CV Attachment Note -->
          <tr>
            <td style="padding: 0 44px 36px 44px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #e8f5e9; border-radius: 12px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0; font-size: 13px; color: #2e7d32;">📎 CV/Resume attached to this email</p>
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

// Prepare SendGrid API request
$sendgridData = [
    'personalizations' => [
        [
            'to' => [
                ['email' => TO_EMAIL]
            ],
            'subject' => "New Job Application: $jobPosition - $name | MKPRIME"
        ]
    ],
    'from' => [
        'email' => FROM_EMAIL,
        'name' => FROM_NAME
    ],
    'reply_to' => [
        'email' => $email,
        'name' => $name
    ],
    'content' => [
        [
            'type' => 'text/html',
            'value' => $emailBody
        ]
    ]
];

// Add CV attachment if present
if ($cvAttachment) {
    $sendgridData['attachments'] = [$cvAttachment];
}

// Send email via SendGrid API
$ch = curl_init('https://api.sendgrid.com/v3/mail/send');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($sendgridData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . SENDGRID_API_KEY,
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Check if email was sent successfully
if ($httpCode >= 200 && $httpCode < 300) {
    echo json_encode(['success' => true, 'message' => 'Application submitted successfully']);
} else {
    error_log("SendGrid Error: HTTP $httpCode - $response");
    echo json_encode(['success' => false, 'message' => 'Failed to submit application. Please try again later.']);
}
