# SendGrid Email Configuration

This project uses SendGrid for sending emails from the contact form and job application form.

## Setup Instructions

### 1. Environment Variables

Add the following environment variables to your hosting platform (Vercel, etc.):

```
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=mkprime667@gmail.com
TO_EMAIL=mkprime667@gmail.com
```

### 2. SendGrid API Key

Use your SendGrid API Key from your SendGrid account dashboard.

### 3. Verified Sender

Make sure `mkprime667@gmail.com` is verified in your SendGrid account.

### 4. Vercel Configuration

In your Vercel project settings:
1. Go to Settings → Environment Variables
2. Add the three variables above
3. Redeploy your project

## Files

- `api/contact-sendgrid.php` - Handles contact form submissions
- `api/job-application-sendgrid.php` - Handles job applications with CV attachments

## Features

- Beautiful HTML email templates
- Reply buttons for email and WhatsApp
- CV attachment support for job applications
- Country detection for visitor information
- Error handling and validation
