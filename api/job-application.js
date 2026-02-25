// Vercel Serverless Function for Job Application Form
const sgMail = require('@sendgrid/mail');
const formidable = require('formidable');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Get SendGrid API key from environment variables
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const FROM_EMAIL = process.env.FROM_EMAIL || 'mkprime667@gmail.com';
    const TO_EMAIL = process.env.TO_EMAIL || 'mkprime667@gmail.com';

    if (!SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY is not set');
      return res.status(500).json({ success: false, message: 'Server configuration error' });
    }

    sgMail.setApiKey(SENDGRID_API_KEY);

    // Parse form data with file upload
    const form = formidable({ multiples: false, maxFileSize: 5 * 1024 * 1024 }); // 5MB max

    const parseForm = () => {
      return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });
    };

    const { fields, files } = await parseForm();

    // Extract form data
    const name = fields.name?.[0] || fields.name || '';
    const nationality = fields.nationality?.[0] || fields.nationality || '';
    const currentCountry = fields.currentCountry?.[0] || fields.currentCountry || '';
    const phone = fields.phone?.[0] || fields.phone || '';
    const email = fields.email?.[0] || fields.email || '';
    const whyHireYou = fields.whyHireYou?.[0] || fields.whyHireYou || '';
    const jobPosition = fields.jobPosition?.[0] || fields.jobPosition || 'General Application';

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Required fields are missing' });
    }

    // Handle CV file
    let cvAttachment = null;
    const cvFile = files.cv?.[0] || files.cv;
    
    if (cvFile) {
      const fs = require('fs');
      const cvContent = fs.readFileSync(cvFile.filepath);
      const cvBase64 = cvContent.toString('base64');
      
      cvAttachment = {
        content: cvBase64,
        filename: cvFile.originalFilename || cvFile.newFilename,
        type: cvFile.mimetype || 'application/pdf',
        disposition: 'attachment'
      };
    }

    // Create timestamp
    const timestamp = new Date().toLocaleString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });

    // Create email HTML body
    const emailBody = `
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
              <p style="margin: 0; font-size: 12px; color: #b0b0b0;">${timestamp}</p>
            </td>
          </tr>

          <!-- Position Badge -->
          <tr>
            <td style="padding: 20px 44px;">
              <table cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #000000 0%, #333333 100%); border-radius: 12px;">
                <tr>
                  <td style="padding: 16px 24px;">
                    <p style="margin: 0; font-size: 11px; font-weight: 700; color: #999999; text-transform: uppercase; letter-spacing: 1.5px;">Position Applied For</p>
                    <p style="margin: 6px 0 0 0; font-size: 18px; font-weight: 700; color: #ffffff;">${jobPosition}</p>
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
                          <p style="margin: 4px 0 0 0; font-size: 15px; font-weight: 600; color: #111111;">${name}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <p style="margin: 0; font-size: 11px; color: #999999;">Email</p>
                          <p style="margin: 4px 0 0 0; font-size: 14px; color: #111111;">${email}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <p style="margin: 0; font-size: 11px; color: #999999;">Phone</p>
                          <p style="margin: 4px 0 0 0; font-size: 14px; color: #111111;">${phone}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <p style="margin: 0; font-size: 11px; color: #999999;">Nationality</p>
                          <p style="margin: 4px 0 0 0; font-size: 14px; color: #111111;">${nationality}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <p style="margin: 0; font-size: 11px; color: #999999;">Current Country</p>
                          <p style="margin: 4px 0 0 0; font-size: 14px; color: #111111;">${currentCountry}</p>
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
                    <p style="margin: 16px 0 0 0; font-size: 14px; color: #1a1a1a; line-height: 1.7; white-space: pre-wrap;">${whyHireYou}</p>
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
</html>`;

    // Prepare email message
    const msg = {
      to: TO_EMAIL,
      from: FROM_EMAIL,
      replyTo: {
        email: email,
        name: name
      },
      subject: `New Job Application: ${jobPosition} - ${name} | MKPRIME`,
      html: emailBody,
    };

    // Add CV attachment if present
    if (cvAttachment) {
      msg.attachments = [cvAttachment];
    }

    // Send email via SendGrid
    await sgMail.send(msg);

    return res.status(200).json({ success: true, message: 'Application submitted successfully' });

  } catch (error) {
    console.error('SendGrid Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to submit application. Please try again later.',
      error: error.message 
    });
  }
}
