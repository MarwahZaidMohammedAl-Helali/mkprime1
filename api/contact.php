<?php
/**
 * Contact Form API Endpoint
 * Handles contact form submissions and sends email notifications
 */

// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors to users
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

// Get JSON input
$json_input = file_get_contents('php://input');
$data = json_decode($json_input, true);

// Validate input
if (!$data) {
    send_json_response(false, 'Invalid JSON data');
}

// Extract and sanitize form data
$name = isset($data['name']) ? sanitize_input($data['name']) : '';
$email = isset($data['email']) ? sanitize_input($data['email']) : '';
$phone = isset($data['phone']) ? sanitize_input($data['phone']) : '';
$message = isset($data['message']) ? sanitize_input($data['message']) : '';
$visitorCountry = isset($data['visitorCountry']) ? sanitize_input($data['visitorCountry']) : 'Qatar';
$visitorCountryCode = isset($data['visitorCountryCode']) ? sanitize_input($data['visitorCountryCode']) : 'QA';

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

if (empty($message)) {
    send_json_response(false, 'Message is required');
}

// Use country from frontend (more reliable than server-side detection)
$countryCode = $visitorCountryCode;
$countryName = $visitorCountry;

// Clean phone for WhatsApp
$cleanPhone = preg_replace('/[\s\-\(\)]/', '', $phone);

// Pre-written WhatsApp messages
$waEnglish = rawurlencode("Hi $name,\n\nThank you for contacting MKPRIME. We received your message and would love to assist you.\n\nWe will get back to you shortly with more details.\n\nBest regards,\nMKPRIME Team");
$waArabic = rawurlencode("مرحباً $name،\n\nشكراً لتواصلك مع MKPRIME. لقد استلمنا رسالتك ويسعدنا مساعدتك.\n\nسنعود إليك قريباً بمزيد من التفاصيل.\n\nمع أطيب التحيات،\nفريق MKPRIME");

// Create timestamp
$timestamp = date('l, F j, Y') . ' • ' . date('g:i A');

// Flag URL
$flagUrl = $countryCode ? "https://flagcdn.com/80x60/" . strtolower($countryCode) . ".png" : '';
$displayCountry = $countryName ?: 'Unknown';

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
                    <p style="margin: 0; font-size: 11px; font-weight: 700; color: #b0b0b0; text-transform: uppercase; letter-spacing: 2.5px;">New Message Received</p>
                    <h1 style="margin: 10px 0 0 0; font-size: 24px; font-weight: 700; color: #0a0a0a; line-height: 1.3;">You've got a new inquiry ✨</h1>
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
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p style="margin: 0; font-size: 10px; font-weight: 700; color: #aaaaaa; text-transform: uppercase; letter-spacing: 2px;">Message</p>
                        </td>
                        <td align="right">
                          <span style="display: inline-block; padding: 3px 10px; background-color: #e8f5e9; color: #2e7d32; font-size: 10px; font-weight: 700; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">New</span>
                        </td>
                      </tr>
                    </table>
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
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding-right: 8px;">
                                <a href="mailto:$email?subject=Re: Your inquiry to MKPRIME&body=Hi $name,%0D%0A%0D%0AThank you for reaching out to MKPRIME. We received your message and would love to assist you.%0D%0A%0D%0AWe will get back to you shortly with more details.%0D%0A%0D%0ABest regards,%0D%0AMKPRIME Team" style="display: inline-block; padding: 9px 18px; background-color: #111111; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 700; border-radius: 8px;">English</a>
                              </td>
                              <td>
                                <a href="mailto:$email?subject=رد: استفسارك لـ MKPRIME&body=مرحباً $name،%0D%0A%0D%0Aشكراً لتواصلك مع MKPRIME. لقد استلمنا رسالتك ويسعدنا مساعدتك.%0D%0A%0D%0Aسنعود إليك قريباً بمزيد من التفاصيل.%0D%0A%0D%0Aمع أطيب التحيات،%0D%0Aفريق MKPRIME" style="display: inline-block; padding: 9px 18px; background-color: #ffffff; color: #111111; text-decoration: none; font-size: 12px; font-weight: 700; border-radius: 8px; border: 1.5px solid #d0d0d0;">عربي</a>
                              </td>
                            </tr>
                          </table>
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
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding-right: 8px;">
                                <a href="https://wa.me/$cleanPhone?text=$waEnglish" style="display: inline-block; padding: 9px 18px; background-color: #25D366; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 700; border-radius: 8px;">English</a>
                              </td>
                              <td>
                                <a href="https://wa.me/$cleanPhone?text=$waArabic" style="display: inline-block; padding: 9px 18px; background-color: #ffffff; color: #25D366; text-decoration: none; font-size: 12px; font-weight: 700; border-radius: 8px; border: 1.5px solid #c8e6c9;">عربي</a>
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

          <!-- Spacer -->
          <tr><td style="height: 16px;"></td></tr>

          <!-- Sender Details with Flag -->
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

if ($countryCode) {
    $emailBody .= <<<HTML
                          <img src="$flagUrl" alt="$displayCountry" width="36" height="27" style="display: block; margin: 0 auto; border-radius: 4px; border: 1px solid #e8e8e8;" />
                          <p style="margin: 5px 0 0 0; font-size: 9px; font-weight: 700; color: #aaaaaa; text-transform: uppercase; letter-spacing: 0.5px; text-align: center; white-space: nowrap;">$displayCountry</p>
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
    $mail->addAddress(SMTP_FROM_EMAIL); // Send to same email
    $mail->addReplyTo($email, $name);

    // Content
    $mail->isHTML(true);
    $mail->Subject = "New Inquiry from $name | MKPRIME";
    $mail->Body    = $emailBody;

    // Send email
    $mail->send();
    
    send_json_response(true, 'Email sent successfully');
    
} catch (Exception $e) {
    log_error("Contact form email error: " . $mail->ErrorInfo);
    send_json_response(false, 'Failed to send email. Please try again later.');
}
