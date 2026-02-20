# MKPRIME Admin Panel Guide

## Admin Access

**Login URL:** `https://marwahzaidmohammedal-helali.github.io/mkprime1/admin/login`

**Credentials:**
- Username: `admin`
- Password: `4444`

## Features

The admin panel allows you to manage:

1. **Careers** - Add, edit, and delete job postings
2. **About Us** - Update company information and description
3. **Services** - Modify service titles and descriptions
4. **Hero Section** - Change homepage hero text

## How to Use

### 1. Login
- Navigate to `/admin/login`
- Enter username: `admin`
- Enter password: `4444`
- Click "Login"

### 2. Manage Content

#### Careers Management
- Click "📋 Careers" in the sidebar
- Click "+ Add New Career" to create a new position
- Fill in:
  - Title (English & Arabic)
  - Job Type (Full-time, Part-time, Contract)
  - Description (English & Arabic)
- Click "🗑️ Delete" to remove a position
- Changes save automatically

#### About Us Management
- Click "ℹ️ About Us" in the sidebar
- Edit:
  - Company description (English & Arabic)
  - Founded year
  - Team size
  - Company type
- Changes save automatically

#### Services Management
- Click "🛠️ Services" in the sidebar
- Edit the 3 service cards:
  - Title (English & Arabic)
  - Description (English & Arabic)
- Changes save automatically

#### Hero Section Management
- Click "🏠 Hero Section" in the sidebar
- Edit:
  - Main title (English & Arabic)
  - Subtitle (English & Arabic)
- Changes save automatically

### 3. View Changes
- Open your website in a new tab
- Refresh the page to see your changes
- Changes appear immediately in both English and Arabic

### 4. Logout
- Click "🚪 Logout" at the bottom of the sidebar
- You'll be redirected to the login page

## Important Notes

- All changes are saved to browser localStorage
- Changes persist across sessions
- Content is bilingual (English & Arabic)
- The website automatically uses your updated content
- No database required - everything is client-side

## Troubleshooting

**Can't login?**
- Make sure you're using the correct credentials
- Clear browser cache and try again

**Changes not showing?**
- Refresh the main website page
- Clear browser cache
- Make sure you saved the changes in admin panel

**Lost access?**
- Clear browser localStorage
- Navigate to `/admin/login` again

## Security

- Login credentials are hardcoded for simplicity
- Authentication uses localStorage
- For production, consider implementing proper backend authentication

## Support

For issues or questions, contact the development team.
