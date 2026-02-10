const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Detect visitor's country from their IP address
  let countryCode = 'QA'; // Default to Qatar
  let countryName = 'Qatar'; // Default to Qatar

  try {
    // Get visitor IP
    // For local testing, we might get ::1 or 127.0.0.1
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress;

    // Check for localhost
    if (ip === '::1' || ip === '127.0.0.1' || ip.includes('192.168.')) {
      console.log('Localhost detected, defaulting to Qatar');
    } else {
      // Try to get country from API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

      const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        if (geoData.country_code) {
          countryCode = geoData.country_code;
          countryName = geoData.country_name || 'Qatar';
        }
      }
    }
  } catch (err) {
    console.log('Geolocation skipped/failed:', err.message);
    // Keep defaults (Qatar)
  }

  // Clean phone for WhatsApp
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

  // Pre-written messages
  const waEnglish = encodeURIComponent(`Hi ${name},\n\nThank you for contacting MKPRIME. We received your message and would love to assist you.\n\nWe will get back to you shortly with more details.\n\nBest regards,\nMKPRIME Team`);
  const waArabic = encodeURIComponent(`مرحباً ${name}،\n\nشكراً لتواصلك مع MKPRIME. لقد استلمنا رسالتك ويسعدنا مساعدتك.\n\nسنعود إليك قريباً بمزيد من التفاصيل.\n\nمع أطيب التحيات،\nفريق MKPRIME`);

  // Timestamp
  const now = new Date();
  const timestamp = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + ' • ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Flag image from flagcdn.com
  const flagUrl = countryCode
    ? `https://flagcdn.com/80x60/${countryCode.toLowerCase()}.png`
    : '';
  const displayCountry = countryName || 'Unknown';

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Inquiry from ${name} | MKPRIME`,
    html: `
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
                    <p style="margin: 0; font-size: 12px; color: #b0b0b0;">${timestamp}</p>
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
                          <p style="margin: 18px 0 0 0; font-size: 15px; color: #1a1a1a; line-height: 1.8; white-space: pre-wrap;">${message}</p>
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
                                      <a href="mailto:${email}?subject=Re: Your inquiry to MKPRIME&body=Hi ${name},%0D%0A%0D%0AThank you for reaching out to MKPRIME. We received your message and would love to assist you.%0D%0A%0D%0AWe will get back to you shortly with more details.%0D%0A%0D%0ABest regards,%0D%0AMKPRIME Team" style="display: inline-block; padding: 9px 18px; background-color: #111111; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 700; border-radius: 8px;">English</a>
                                    </td>
                                    <td>
                                      <a href="mailto:${email}?subject=رد: استفسارك لـ MKPRIME&body=مرحباً ${name}،%0D%0A%0D%0Aشكراً لتواصلك مع MKPRIME. لقد استلمنا رسالتك ويسعدنا مساعدتك.%0D%0A%0D%0Aسنعود إليك قريباً بمزيد من التفاصيل.%0D%0A%0D%0Aمع أطيب التحيات،%0D%0Aفريق MKPRIME" style="display: inline-block; padding: 9px 18px; background-color: #ffffff; color: #111111; text-decoration: none; font-size: 12px; font-weight: 700; border-radius: 8px; border: 1.5px solid #d0d0d0;">عربي</a>
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
                                      <a href="https://wa.me/${cleanPhone}?text=${waEnglish}" style="display: inline-block; padding: 9px 18px; background-color: #25D366; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 700; border-radius: 8px;">English</a>
                                    </td>
                                    <td>
                                      <a href="https://wa.me/${cleanPhone}?text=${waArabic}" style="display: inline-block; padding: 9px 18px; background-color: #ffffff; color: #25D366; text-decoration: none; font-size: 12px; font-weight: 700; border-radius: 8px; border: 1.5px solid #c8e6c9;">عربي</a>
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
                                ${countryCode ? `
                                <img src="${flagUrl}" alt="${displayCountry}" width="36" height="27" style="display: block; margin: 0 auto; border-radius: 4px; border: 1px solid #e8e8e8;" />
                                <p style="margin: 5px 0 0 0; font-size: 9px; font-weight: 700; color: #aaaaaa; text-transform: uppercase; letter-spacing: 0.5px; text-align: center; white-space: nowrap;">${displayCountry}</p>
                                ` : `
                                <div style="width: 36px; height: 27px; background-color: #e0e0e0; border-radius: 4px; margin: 0 auto;"></div>
                                <p style="margin: 5px 0 0 0; font-size: 9px; font-weight: 700; color: #cccccc; text-align: center;">N/A</p>
                                `}
                              </td>
                              <!-- Vertical Divider -->
                              <td width="1" valign="middle" style="padding: 0 18px;">
                                <div style="width: 1px; height: 40px; background-color: #e8e8e8;"></div>
                              </td>
                              <!-- Name & Email -->
                              <td valign="middle">
                                <p style="margin: 0; font-size: 16px; font-weight: 700; color: #111111;">${name}</p>
                                <p style="margin: 4px 0 0 0; font-size: 13px; color: #999999;">
                                  <a href="mailto:${email}" style="color: #999999; text-decoration: none;">${email}</a>
                                </p>
                              </td>
                              <!-- Phone Badge -->
                              <td align="right" valign="middle">
                                <table cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; border: 1px solid #eeeeee;">
                                  <tr>
                                    <td style="padding: 10px 16px;">
                                      <p style="margin: 0; font-size: 10px; font-weight: 700; color: #bbbbbb; text-transform: uppercase; letter-spacing: 1px;">Phone</p>
                                      <p style="margin: 3px 0 0 0; font-size: 14px; font-weight: 600; color: #222222;">${phone}</p>
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
    `,
    replyTo: email
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});