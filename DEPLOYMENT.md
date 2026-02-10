# MKPRIME Website - GoDaddy Deployment Guide

## ✅ Your website is now ready for GoDaddy shared hosting!

The Node.js backend has been replaced with PHP, which works perfectly on GoDaddy shared hosting.

---

## 📦 What You Need to Deploy

### 1. Build the React App
```bash
npm run build
```
This creates a `build` folder with all your website files.

### 2. Files to Upload to GoDaddy

Upload these to your GoDaddy `public_html` folder:
- Everything from the `build` folder (index.html, static folder, etc.)
- The `api` folder (contains contact.php)
- The `.htaccess` file (from public folder)

---

## 🚀 Step-by-Step Deployment

### Step 1: Build Your Website
1. Open terminal in your project folder
2. Run: `npm run build`
3. Wait for build to complete

### Step 2: Upload to GoDaddy
1. Log in to GoDaddy cPanel
2. Open **File Manager**
3. Navigate to `public_html` folder
4. Delete any existing files (if this is a new site)
5. Upload ALL files from your `build` folder
6. Upload the `api` folder
7. Make sure `.htaccess` is in the root

### Step 3: Set File Permissions
1. Right-click on `api/contact.php`
2. Change permissions to `644`

### Step 4: Test Your Website
1. Visit your domain: `https://yourdomain.com`
2. Fill out the contact form
3. Check if email arrives at: mkptime667@gmail.com

---

## 📧 Email Configuration

The PHP script uses GoDaddy's built-in mail() function. 

**Current settings:**
- Recipient: mkptime667@gmail.com
- Sender: noreply@yourdomain.com

**To change the recipient email:**
1. Edit `api/contact.php`
2. Find line: `$to = 'mkptime667@gmail.com';`
3. Change to your desired email
4. Re-upload the file

---

## 🔧 Troubleshooting

### Emails not sending?
1. Check GoDaddy email settings in cPanel
2. Make sure your domain has email configured
3. Check spam folder
4. Contact GoDaddy support to enable mail() function

### 404 errors on page refresh?
- Make sure `.htaccess` file is uploaded
- Check if mod_rewrite is enabled in cPanel

### Contact form not working?
1. Check browser console for errors (F12)
2. Verify `api/contact.php` file exists
3. Check file permissions (should be 644)

---

## 📁 Folder Structure on GoDaddy

```
public_html/
├── index.html
├── .htaccess
├── static/
│   ├── css/
│   ├── js/
│   └── media/
├── api/
│   └── contact.php
└── logo.png
```

---

## 🎉 You're Done!

Your website will now:
- ✅ Work on GoDaddy shared hosting
- ✅ Send unlimited emails
- ✅ Have smooth animations
- ✅ Support Arabic and English
- ✅ Be fully responsive

---

## 💡 Tips

1. **Always test locally first**: Run `npm start` before deploying
2. **Keep backups**: Download your files before making changes
3. **Update regularly**: Keep your React dependencies updated
4. **Monitor emails**: Check if contact form emails are arriving

---

## 📞 Need Help?

If you encounter issues:
1. Check GoDaddy's PHP error logs in cPanel
2. Contact GoDaddy support for server-specific issues
3. Test the contact form with different browsers

---

**Note**: You no longer need Node.js or the server.js file. Everything runs on PHP now!
