# Design Document

## Overview

This design outlines the conversion of the MKPRIME React application into a plain HTML, CSS, JavaScript, and PHP implementation. The new version will maintain all existing functionality while eliminating React dependencies, making it suitable for deployment on standard web hosting platforms like GoDaddy.

## Architecture

### High-Level Structure

```
godaddyyes/
├── index.html              # Home page
├── services.html           # Services page
├── careers.html            # Careers page
├── contact.html            # Contact page
├── job-application.html    # Job application form
├── css/
│   ├── main.css           # Main stylesheet
│   ├── animations.css     # Scroll animations
│   └── responsive.css     # Media queries
├── js/
│   ├── app.js             # Main application logic
│   ├── content.js         # Bilingual content data
│   ├── navigation.js      # Navigation and routing
│   ├── forms.js           # Form handling
│   └── animations.js      # Scroll animations
├── api/
│   ├── contact-sendgrid.php        # Contact form handler
│   └── job-application-sendgrid.php # Job application handler
├── images/
│   ├── logo.png
│   ├── partner-1.jpeg
│   ├── partner-2.png
│   ├── partner-3.jpeg
│   └── partner-4.jpeg
└── .htaccess              # URL rewriting rules
```

### Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: PHP 7.4+
- **Email Service**: SendGrid API
- **APIs**: IP Geolocation (ipapi.co, ipwho.is)
- **Storage**: Browser localStorage for language preference

## Components and Interfaces

### 1. HTML Pages

Each HTML page will follow this structure:

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MKPRIME - Page Title</title>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/animations.css">
    <link rel="stylesheet" href="css/responsive.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar" id="navbar"></nav>
    
    <!-- Page Content -->
    <main id="main-content"></main>
    
    <!-- Footer -->
    <footer class="footer" id="footer"></footer>
    
    <!-- Scripts -->
    <script src="js/content.js"></script>
    <script src="js/navigation.js"></script>
    <script src="js/animations.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
```

### 2. JavaScript Modules

#### content.js
Stores all bilingual content in JavaScript objects:

```javascript
const content = {
    en: {
        nav: { home: 'Home', services: 'Services', ... },
        hero: { title: '...', subtitle: '...', cta: '...' },
        // ... all English content
    },
    ar: {
        nav: { home: 'الرئيسية', services: 'خدماتنا', ... },
        hero: { title: '...', subtitle: '...', cta: '...' },
        // ... all Arabic content
    }
};

const countries = [
    { code: '+93', name: 'Afghanistan', nameAr: 'أفغانستان', flag: '🇦🇫', iso: 'AF' },
    // ... all countries
];
```

#### navigation.js
Handles navigation rendering and mobile menu:

```javascript
class Navigation {
    constructor() {
        this.language = localStorage.getItem('language') || 'en';
        this.isMobileMenuOpen = false;
    }
    
    render() {
        // Render navbar with current language
    }
    
    toggleLanguage() {
        // Switch between en/ar
        // Update localStorage
        // Update document direction
        // Re-render all content
    }
    
    toggleMobileMenu() {
        // Open/close mobile menu
    }
}
```

#### forms.js
Handles form submissions:

```javascript
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }
    
    async submit(formData) {
        // Validate form
        // Send AJAX request to PHP
        // Handle response
    }
    
    async detectCountry() {
        // Call IP geolocation API
        // Set country code dropdown
    }
}

class JobApplicationForm {
    constructor() {
        this.form = document.getElementById('job-application-form');
        this.init();
    }
    
    async submit(formData) {
        // Validate form including CV file
        // Send FormData to PHP
        // Handle response
    }
    
    validateFile(file) {
        // Check file type (PDF, DOC, DOCX)
        // Check file size (max 5MB)
    }
}
```

#### animations.js
Handles scroll animations:

```javascript
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }
    
    init() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        this.observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px' }
        );
        
        document.querySelectorAll('.scroll-animate').forEach(el => {
            this.observer.observe(el);
        });
    }
}
```

#### app.js
Main application initialization:

```javascript
class App {
    constructor() {
        this.language = localStorage.getItem('language') || 'en';
        this.navigation = new Navigation();
        this.animations = new ScrollAnimations();
        this.init();
    }
    
    init() {
        // Initialize navigation
        // Initialize page-specific components
        // Set up event listeners
        // Apply language
    }
    
    updateLanguage(lang) {
        this.language = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        // Re-render all content
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
```

### 3. PHP API Endpoints

#### contact-sendgrid.php
```php
<?php
// Handle CORS
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
// Sanitize data
// Prepare SendGrid API request
// Send email
// Return JSON response
?>
```

#### job-application-sendgrid.php
```php
<?php
// Handle CORS
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Get form data and file
$data = $_POST;
$cvFile = $_FILES['cv'];

// Validate input
// Validate file (type, size)
// Encode CV as base64
// Prepare SendGrid API request with attachment
// Send email
// Return JSON response
?>
```

## Data Models

### Language Content Structure
```javascript
{
    nav: {
        home: string,
        services: string,
        careers: string,
        contact: string
    },
    hero: {
        title: string,
        subtitle: string,
        cta: string
    },
    about: {
        title: string,
        description: string,
        founded: string,
        team: string,
        type: string
    },
    services: {
        title: string,
        service1: { title: string, desc: string },
        service2: { title: string, desc: string },
        service3: { title: string, desc: string }
    },
    careers: {
        title: string,
        intro: string,
        jobs: Array<{
            title: string,
            type: string,
            description: string
        }>,
        apply: string
    },
    partners: {
        title: string,
        intro: string
    },
    contact: {
        title: string,
        subtitle: string,
        name: string,
        email: string,
        phone: string,
        message: string,
        send: string,
        follow_title: string,
        facebook: string,
        instagram: string
    },
    footer: {
        tagline: string,
        rights: string
    }
}
```

### Country Data Structure
```javascript
{
    code: string,      // e.g., '+974'
    name: string,      // e.g., 'Qatar'
    nameAr: string,    // e.g., 'قطر'
    flag: string,      // e.g., '🇶🇦'
    iso: string        // e.g., 'QA'
}
```

### Form Data Structures

**Contact Form:**
```javascript
{
    name: string,
    email: string,
    countryCode: string,
    phone: string,
    message: string,
    visitorCountry: string,
    visitorCountryCode: string
}
```

**Job Application Form:**
```javascript
{
    name: string,
    email: string,
    countryCode: string,
    phone: string,
    nationality: string,
    currentCountry: string,
    whyHireYou: string,
    jobPosition: string,
    cv: File,
    detectedCountry: string,
    detectedCountryCode: string
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Language Toggle Consistency
*For any* page in the application, when the language toggle is clicked, all text content should switch to the selected language and the document direction should match the language (LTR for English, RTL for Arabic).

**Validates: Requirements 2.1, 2.2**

### Property 2: Form Validation Completeness
*For any* form submission (contact or job application), if any required field is empty or invalid, the form should not be submitted and an appropriate error message should be displayed.

**Validates: Requirements 3.1, 4.1**

### Property 3: File Upload Validation
*For any* CV file upload, if the file type is not PDF/DOC/DOCX or the file size exceeds 5MB, the upload should be rejected with an appropriate error message.

**Validates: Requirements 4.2, 4.3**

### Property 4: Email Sending Round Trip
*For any* successful form submission, the PHP backend should return a success response, and the frontend should display a success message to the user.

**Validates: Requirements 3.4, 4.5, 5.1, 5.2**

### Property 5: Mobile Menu State Consistency
*For any* viewport width below 768px, when the hamburger menu is clicked, the mobile menu should toggle between open and closed states, and clicking a navigation link should close the menu.

**Validates: Requirements 6.1, 6.2, 6.3**

### Property 6: Hero Slider Progression
*For any* hero slider instance, images should automatically transition every 5 seconds in sequential order, looping back to the first image after the last.

**Validates: Requirements 7.2, 7.3**

### Property 7: Scroll Animation Idempotence
*For any* element with scroll animation, the animation should trigger exactly once when the element enters the viewport and should not re-trigger on subsequent scrolls.

**Validates: Requirements 9.1, 9.3**

### Property 8: Country Detection Fallback
*For any* form load, if country detection fails or times out, the country code should default to Qatar (+974) and the form should remain functional.

**Validates: Requirements 10.2, 10.3**

### Property 9: Language Persistence
*For any* user session, the selected language preference should be stored in localStorage and should persist across page navigations and browser sessions.

**Validates: Requirements 2.3**

### Property 10: SendGrid API Error Handling
*For any* SendGrid API call that returns an error status code (not 2xx), the system should return a JSON error response to the frontend with an appropriate error message.

**Validates: Requirements 5.5**

## Error Handling

### Frontend Error Handling

1. **Form Validation Errors**
   - Display inline error messages for invalid fields
   - Prevent form submission until all errors are resolved
   - Use red color and error icons for visual feedback

2. **Network Errors**
   - Display user-friendly error messages for failed API calls
   - Provide retry options for transient failures
   - Log errors to console for debugging

3. **File Upload Errors**
   - Validate file type and size before upload
   - Display specific error messages (e.g., "File too large", "Invalid file type")
   - Clear file input on error

4. **Country Detection Errors**
   - Silently fall back to default country (Qatar)
   - Log detection failures to console
   - Allow manual country selection

### Backend Error Handling

1. **Input Validation**
   - Validate and sanitize all input data
   - Return 400 Bad Request for invalid input
   - Include specific error messages in JSON response

2. **File Upload Validation**
   - Check file type using MIME type detection
   - Enforce file size limits
   - Return specific error messages for validation failures

3. **SendGrid API Errors**
   - Handle API authentication errors
   - Handle rate limiting errors
   - Return descriptive error messages to frontend
   - Log full error details for debugging

4. **PHP Errors**
   - Disable display_errors in production
   - Enable error logging to file
   - Return generic error messages to frontend
   - Log detailed errors for debugging

## Testing Strategy

### Manual Testing

1. **Cross-Browser Testing**
   - Test on Chrome, Firefox, Safari, Edge
   - Verify all functionality works consistently
   - Test on mobile browsers (iOS Safari, Chrome Mobile)

2. **Responsive Design Testing**
   - Test on various screen sizes (mobile, tablet, desktop)
   - Verify mobile menu functionality
   - Check layout and readability on all devices

3. **Language Switching Testing**
   - Verify all content switches correctly
   - Check RTL layout for Arabic
   - Test language persistence across pages

4. **Form Submission Testing**
   - Test contact form with valid and invalid data
   - Test job application form with various file types
   - Verify email delivery and formatting
   - Test error handling scenarios

5. **Animation Testing**
   - Verify scroll animations trigger correctly
   - Check hero slider transitions
   - Test animation performance

### Integration Testing

1. **SendGrid API Integration**
   - Test email sending with valid API key
   - Test error handling for invalid API key
   - Verify email formatting and attachments

2. **IP Geolocation Integration**
   - Test country detection with various IPs
   - Verify fallback behavior
   - Test with API failures

3. **File Upload Integration**
   - Test CV upload with various file types
   - Test file size validation
   - Verify base64 encoding for SendGrid

### User Acceptance Testing

1. **End-to-End Workflows**
   - Complete contact form submission workflow
   - Complete job application workflow
   - Navigate through all pages
   - Switch languages and verify content

2. **Performance Testing**
   - Measure page load times
   - Check image optimization
   - Verify smooth animations

3. **Accessibility Testing**
   - Test keyboard navigation
   - Verify form labels and ARIA attributes
   - Check color contrast ratios
