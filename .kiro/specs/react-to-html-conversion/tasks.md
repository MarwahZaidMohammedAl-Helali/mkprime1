# Implementation Plan: React to HTML Conversion

## Overview

Convert the MKPRIME React application to plain HTML, CSS, JavaScript, and PHP. Create all files in a new "godaddyyes" folder with organized structure for easy deployment.

## Tasks

- [x] 1. Set up project structure and copy assets
  - Create "godaddyyes" folder in project root
  - Create subfolders: css/, js/, api/, images/
  - Copy logo.png and partner images from public/ to images/
  - Copy existing PHP files from godaddy-upload/mkprime/api/ to api/
  - _Requirements: 1.4, 11.1, 11.2, 11.3_

- [x] 2. Create CSS stylesheets
  - [x] 2.1 Create main.css with core styles
    - Port styles from App.css including navbar, hero, sections, forms, footer
    - Include color scheme, typography, and layout styles
    - Add styles for language toggle and mobile menu
    - _Requirements: 1.3, 6.1_
  
  - [x] 2.2 Create animations.css
    - Port scroll animation styles from animations.css
    - Include fade-in, slide-up animations
    - Add hero slider transition styles
    - _Requirements: 7.3, 9.1_
  
  - [x] 2.3 Create responsive.css
    - Add media queries for mobile, tablet, desktop
    - Include mobile menu styles
    - Add responsive grid layouts
    - _Requirements: 6.1, 8.4_

- [x] 3. Create JavaScript content module
  - [x] 3.1 Create js/content.js with bilingual content
    - Port content structure from contentManager.js
    - Include all English and Arabic translations
    - Add countries array with flags and codes
    - Export content and countries objects
    - _Requirements: 2.4, 10.4_

- [x] 4. Create JavaScript navigation module
  - [x] 4.1 Create js/navigation.js
    - Implement Navigation class with render() method
    - Add toggleLanguage() method to switch between en/ar
    - Add toggleMobileMenu() method for mobile navigation
    - Update document direction (LTR/RTL) on language change
    - Store language preference in localStorage
    - _Requirements: 2.1, 2.2, 2.3, 6.2, 6.3, 6.4_

- [x] 5. Create JavaScript forms module
  - [x] 5.1 Create js/forms.js with ContactForm class
    - Implement form validation for all required fields
    - Add country code dropdown with search functionality
    - Implement detectCountry() using IP geolocation APIs
    - Add submit() method with AJAX call to PHP
    - Display success/error messages
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 10.1, 10.2, 10.3_
  
  - [x] 5.2 Add JobApplicationForm class to forms.js
    - Implement form validation including CV file
    - Add validateFile() method for file type and size checks
    - Implement submit() method with FormData and AJAX
    - Display success message and redirect on success
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 6. Create JavaScript animations module
  - [x] 6.1 Create js/animations.js
    - Implement ScrollAnimations class using Intersection Observer
    - Add hero slider with auto-transition every 5 seconds
    - Ensure animations trigger only once per element
    - _Requirements: 7.1, 7.2, 7.3, 9.1, 9.2, 9.3_

- [x] 7. Create JavaScript app initialization
  - [x] 7.1 Create js/app.js
    - Implement App class to initialize all modules
    - Set up language detection and application
    - Initialize navigation, animations, and forms
    - Add DOMContentLoaded event listener
    - _Requirements: 2.3, 2.4_

- [x] 8. Create HTML pages
  - [x] 8.1 Create index.html (Home page)
    - Add HTML structure with nav, hero, about, partners, footer
    - Include hero slider with 3 background images
    - Add about section with stats
    - Add partners grid with 4 partner logos
    - Link all CSS and JS files
    - _Requirements: 1.1, 1.2, 1.3, 7.1, 7.4, 8.1, 8.2, 8.3_
  
  - [x] 8.2 Create services.html
    - Add HTML structure with nav, services section, footer
    - Include 3 service cards with icons
    - Link all CSS and JS files
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [x] 8.3 Create careers.html
    - Add HTML structure with nav, careers section, footer
    - Include job cards grid with "Apply Now" buttons
    - Link all CSS and JS files
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [x] 8.4 Create contact.html
    - Add HTML structure with nav, contact form, footer
    - Include contact form with country code dropdown
    - Add social media links (Facebook, Instagram)
    - Link all CSS and JS files
    - _Requirements: 1.1, 1.2, 1.3, 3.3_
  
  - [x] 8.5 Create job-application.html
    - Add HTML structure with nav, application form, footer
    - Include all form fields (name, email, phone, nationality, country, CV, why hire you)
    - Add file upload input for CV
    - Link all CSS and JS files
    - _Requirements: 1.1, 1.2, 1.3, 4.2_

- [x] 9. Update PHP API endpoints
  - [x] 9.1 Verify contact-sendgrid.php
    - Ensure CORS headers are correct
    - Verify input validation and sanitization
    - Test SendGrid API integration
    - Verify error handling
    - _Requirements: 5.1, 5.3, 5.4, 5.5_
  
  - [x] 9.2 Verify job-application-sendgrid.php
    - Ensure CORS headers are correct
    - Verify file upload validation (type, size)
    - Test SendGrid API with attachment
    - Verify error handling
    - _Requirements: 5.2, 5.3, 5.4, 5.5_

- [x] 10. Create .htaccess file
  - Add URL rewriting rules if needed
  - Configure error pages
  - Set up proper MIME types
  - _Requirements: 11.4_

- [ ] 11. Final integration and testing
  - Test all pages in multiple browsers
  - Verify language switching on all pages
  - Test contact form submission end-to-end
  - Test job application form with CV upload
  - Verify mobile responsiveness
  - Test all animations and transitions
  - Verify email delivery with SendGrid
  - _Requirements: All_

## Notes

- All files should be created in the "godaddyyes" folder
- Maintain existing email templates and SendGrid integration
- Use vanilla JavaScript (no frameworks or libraries)
- Ensure all functionality from React app is preserved
- Test thoroughly before deployment
