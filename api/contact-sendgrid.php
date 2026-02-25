<?php
/**
 * Contact Form API Endpoint - SendGrid Version
 * Handles contact form submissions and sends email via SendGrid
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

// Get JSON input
$json_input = file_get_contents('php://input');
$data = json_decode($json_input, true);

// Validate input
if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
    exit;
}

// Extract and sanitize form data
$name = isset($data['name']) ? htmlspecialchars(trim($data['name'])) : '';
$email = isset($data['email']) ? htmlspecialchars(trim($data['email'])) : '';
$phone = isset($data['phone']) ? htmlspecialchars(trim($data['phone'])) : '';
$message = isset($data['message']) ? htmlspecialchars(trim($data['message'])) : '';
$visitorCountry = isset($data['visitorCountry']) ? htmlspecialchars(trim($data['visitorCountry'])) : 'Qatar';
$visitorCountryCode = isset($data['visitorCountryCode']) ? htmlspecialchars(trim($data['visitorCountryCode'])) : 'QA';

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

if (empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Message is required']);
    exit;
}

// Clean phone for WhatsApp
$cleanPhone = preg_replace('/[\s\-\(\)]/', '', $phone);

// Pre-written WhatsApp messages
$waEnglish = rawurlencode("Hi $name,\n\nThank you for contacting MKPRIME. We received your message and would love to assist you.\n\nWe will get back to you shortly with more details.\n\nBest regards,\nMKPRIME Team");
$waArabic = rawurlencode("مرحباً $name،\n\nشكراً لتواصلك مع MKPRIME. لقد استلمنا رسالتك ويسعدنا مساعدتك.\n\nسنعود إليك قريباً بمزيد من التفاصيل.\n\nمع أطيب التحيات،\nفريق MKPRIME");

// Create timestamp
$timestamp = date('l, F j, Y') . ' • ' . date('g:i A');

// Flag URL
$flagUrl = $visitorCountryCode ? "https://flagcdn.com/80x60/" . strtolower($visitorCountryCode) . ".png" : '';
$displayCountry = $visitorCountry ?: 'Unknown';

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
                    <p style="margin: 0; font-size: 11px; font-weight: 700; color: #b0b0b0; text-transform: uppercase; letter-spacing: 2.5px;">New Message Received</p>
                    <h1 style="margin: 10px 0 0 0; font-size: 24px; font-weight: 700; color: #0a0a0a;">You've got a new inquiry ✨</h1>
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

          <!-- Message Card -->
          <tr>
            <td style="padding: 24px 44px 36px 44px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f9f9f9 0%, #f4f4f4 100%); border-radius: 14px; border-left: 4px solid #000000;">
                <tr>
                  <td style="padding: 28px 30px;">
                    <p style="margin: 0; font-size: 10px; font-weight: 700; color: #aaaaaa; text-transform: uppercase; letter-spacing: 2px;">Message</p>
                    <div style="margin-top: 14px; height: 1px; background-color: #e8e8e8;"></div>
                    <p style="margin: 18px 0 0 0; font-size: 15px; color: #1a1a1a; line-height: 1.8; white-space: pre-wrap;">$message</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Reply Actions -->
          <tr>
            <td style="padding: 0 44px 12px 44px;">
              <!-- Email Reply -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; border-radius: 12px; margin-bottom: 10px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="36" valign="middle">
                          <div style="width: 34px; height: 34px; background-color: #111111; border-radius: 8px; text-align: center; line-height: 34px;">
                            <span style="font-size: 14px;">✉️</span>
                          </div>
                        </td>
                        <td style="padding-left: 12px;" valign="middle">
                          <p style="margin: 0; font-size: 13px; font-weight: 700; color: #222222;">Reply via Email</p>
                        </td>
                        <td align="right" valign="middle">
                          <a href="mailto:$email" style="display: inline-block; padding: 9px 18px; background-color: #111111; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 700; border-radius: 8px;">Reply</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- WhatsApp Reply -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; border-radius: 12px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="36" valign="middle">
                          <div style="width: 34px; height: 34px; background-color: #25D366; border-radius: 8px; text-align: center; line-height: 34px;">
                            <span style="font-size: 14px;">💬</span>
                          </div>
                        </td>
                        <td style="padding-left: 12px;" valign="middle">
                          <p style="margin: 0; font-size: 13px; font-weight: 700; color: #222222;">Reply via WhatsApp</p>
                        </td>
                        <td align="right" valign="middle">
                          <a href="https://wa.me/$cleanPhone?text=$waEnglish" style="display: inline-block; padding: 9px 18px; background-color: #25D366; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 700; border-radius: 8px;">WhatsApp</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sender Details -->
          <tr>
            <td style="padding: 16px 44px 36px 44px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; border-radius: 14px; border: 1px solid #f0f0f0;">
                <tr>
                  <td style="padding: 22px 24px;">
                    <p style="margin: 0; font-size: 16px; font-weight: 700; color: #111111;">$name</p>
                    <p style="margin: 4px 0 0 0; font-size: 13px; color: #999999;">$email</p>
                    <p style="margin: 8px 0 0 0; font-size: 14px; font-weight: 600; color: #222222;">📱 $phone</p>
                    <p style="margin: 8px 0 0 0; font-size: 12px; color: #666666;">🌍 $displayCountry</p>
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
            'subject' => "New Inquiry from $name | MKPRIME"
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
    echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
} else {
    error_log("SendGrid Error: HTTP $httpCode - $response");
    echo json_encode(['success' => false, 'message' => 'Failed to send email. Please try again later.']);
}
