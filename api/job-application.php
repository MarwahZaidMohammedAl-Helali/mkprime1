<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Load environment variables from .env file
$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($key, $value) = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
    }
}

// Get form data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$nationality = isset($_POST['nationality']) ? trim($_POST['nationality']) : '';
$currentCountry = isset($_POST['currentCountry']) ? trim($_POST['currentCountry']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$whyHireYou = isset($_POST['whyHireYou']) ? trim($_POST['whyHireYou']) : '';
$detectedCountry = isset($_POST['detectedCountry']) ? trim($_POST['detectedCountry']) : 'Unknown';
$detectedCountryCode = isset($_POST['detectedCountryCode']) ? trim($_POST['detectedCountryCode']) : '';
$position = 'General Position'; // Default position

// Validate required fields
if (empty($name) || empty($nationality) || empty($currentCountry) || empty($phone) || empty($email) || empty($whyHireYou)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit();
}

// Handle file upload
if (!isset($_FILES['cv']) || $_FILES['cv']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'CV file is required']);
    exit();
}

$cvFile = $_FILES['cv'];
$cvFileName = $cvFile['name'];
$cvFileSize = $cvFile['size'];
$cvFileTmpPath = $cvFile['tmp_name'];

// Validate file size (max 5MB)
if ($cvFileSize > 5 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'File size exceeds 5MB limit']);
    exit();
}

// Validate file type
$allowedExtensions = ['pdf', 'doc', 'docx'];
$fileExtension = strtolower(pathinfo($cvFileName, PATHINFO_EXTENSION));
if (!in_array($fileExtension, $allowedExtensions)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Only PDF, DOC, and DOCX files are allowed']);
    exit();
}

// Read file content for email attachment
$cvFileContent = file_get_contents($cvFileTmpPath);
$cvFileBase64 = base64_encode($cvFileContent);

// Get MIME type
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$cvMimeType = finfo_file($finfo, $cvFileTmpPath);
finfo_close($finfo);

// Timestamp
$timestamp = date('l, F j, Y') . ' • ' . date('g:i A');

// Flag URL
$flagUrl = '';
if (!empty($detectedCountryCode)) {
    $flagUrl = 'https://flagcdn.com/80x60/' . strtolower($detectedCountryCode) . '.png';
}

// Email configuration
$to = isset($_ENV['EMAIL_USER']) ? $_ENV['EMAIL_USER'] : 'mkptime667@gmail.com';
$subject = "New Job Application - $name | MKPRIME";
$boundary = md5(time());

// Email headers
$headers = "From: $to\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

// Email body (HTML)
$htmlBody = <<<HTML
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
            <td style="height: 5px; background: linear-gradient(90deg, #1a73e8 0%, #34a853 50%, #fbbc04 100%);"></td>
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
                        <strong>📎 CV Attached:</strong> $cvFileName <span style="color: #999999;">(" . number_format($cvFileSize / 1024, 2) . " KB)</span>
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
HTML;

// Add flag if available
if (!empty($flagUrl)) {
    $htmlBody .= <<<HTML
                        <!-- Country Flag -->
                        <td width="56" valign="middle" align="center">
                          <img src="$flagUrl" alt="$detectedCountry" width="36" height="27" style="display: block; margin: 0 auto; border-radius: 4px; border: 1px solid #e8e8e8;" />
                          <p style="margin: 5px 0 0 0; font-size: 9px; font-weight: 700; color: #aaaaaa; text-transform: uppercase; letter-spacing: 0.5px; text-align: center; white-space: nowrap;">$detectedCountry</p>
                        </td>
HTML;
} else {
    $htmlBody .= <<<HTML
                        <td width="56" valign="middle" align="center">
                          <div style="width: 36px; height: 27px; background-color: #e0e0e0; border-radius: 4px; margin: 0 auto;"></div>
                          <p style="margin: 5px 0 0 0; font-size: 9px; font-weight: 700; color: #cccccc; text-align: center;">N/A</p>
                        </td>
HTML;
}

$htmlBody .= <<<HTML
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

// Construct multipart email message
$message = "--$boundary\r\n";
$message .= "Content-Type: text/html; charset=UTF-8\r\n";
$message .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
$message .= $htmlBody . "\r\n\r\n";

// Attach CV file
$message .= "--$boundary\r\n";
$message .= "Content-Type: $cvMimeType; name=\"$cvFileName\"\r\n";
$message .= "Content-Transfer-Encoding: base64\r\n";
$message .= "Content-Disposition: attachment; filename=\"$cvFileName\"\r\n\r\n";
$message .= chunk_split($cvFileBase64) . "\r\n";
$message .= "--$boundary--";

// Send email
$mailSent = mail($to, $subject, $message, $headers);

if ($mailSent) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Application submitted successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send application email']);
}
?>
