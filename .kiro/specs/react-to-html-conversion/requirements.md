# Requirements Document

## Introduction

Convert the existing React-based MKPRIME website into a plain HTML, CSS, JavaScript, and PHP implementation. The new version should maintain all functionality including bilingual support (English/Arabic), contact forms, job applications, and email sending capabilities using SendGrid API.

## Glossary

- **System**: The MKPRIME website application
- **User**: Website visitor or potential client/applicant
- **Admin**: Website administrator managing content
- **SendGrid**: Email delivery service API
- **CV**: Curriculum Vitae (resume document)

## Requirements

### Requirement 1: Static HTML Structure

**User Story:** As a developer, I want the website converted to static HTML files, so that it can be deployed on any hosting platform without Node.js dependencies.

#### Acceptance Criteria

1. THE System SHALL create separate HTML files for each page (Home, Services, Careers, Contact, Job Application)
2. THE System SHALL include all navigation elements in each HTML file
3. THE System SHALL maintain the existing visual design and layout
4. THE System SHALL organize files in a folder named "godaddyyes"

### Requirement 2: Bilingual Language Support

**User Story:** As a user, I want to switch between English and Arabic languages, so that I can view content in my preferred language.

#### Acceptance Criteria

1. WHEN a user clicks the language toggle, THE System SHALL switch all content between English and Arabic
2. WHEN Arabic is selected, THE System SHALL apply RTL (right-to-left) text direction
3. THE System SHALL persist language preference using browser localStorage
4. THE System SHALL load content from JavaScript objects containing both language versions

### Requirement 3: Contact Form Functionality

**User Story:** As a user, I want to submit contact inquiries, so that I can communicate with MKPRIME.

#### Acceptance Criteria

1. WHEN a user submits the contact form, THE System SHALL validate all required fields
2. WHEN form validation passes, THE System SHALL send form data to PHP backend via AJAX
3. THE System SHALL include country code selector with flag images
4. WHEN email is sent successfully, THE System SHALL display success message
5. IF email sending fails, THEN THE System SHALL display error message

### Requirement 4: Job Application Form

**User Story:** As a job applicant, I want to submit my application with CV, so that I can apply for positions at MKPRIME.

#### Acceptance Criteria

1. WHEN a user submits the job application form, THE System SHALL validate all required fields including CV file
2. THE System SHALL accept PDF, DOC, and DOCX file formats for CV upload
3. THE System SHALL enforce a maximum file size of 5MB for CV uploads
4. WHEN form validation passes, THE System SHALL send application data and CV to PHP backend
5. WHEN application is submitted successfully, THE System SHALL display success message and redirect to careers page

### Requirement 5: Email Sending via SendGrid

**User Story:** As the system, I want to send emails using SendGrid API, so that form submissions reach the business owner.

#### Acceptance Criteria

1. WHEN contact form is submitted, THE System SHALL send formatted email using SendGrid API
2. WHEN job application is submitted, THE System SHALL send email with CV attachment using SendGrid API
3. THE System SHALL include HTML email templates with branding
4. THE System SHALL include reply-to functionality with applicant/contact email
5. THE System SHALL handle SendGrid API errors gracefully

### Requirement 6: Responsive Navigation

**User Story:** As a mobile user, I want a hamburger menu, so that I can navigate the website on small screens.

#### Acceptance Criteria

1. WHEN viewport width is below 768px, THE System SHALL display hamburger menu icon
2. WHEN hamburger icon is clicked, THE System SHALL open mobile navigation menu
3. WHEN a navigation link is clicked, THE System SHALL close mobile menu and navigate to page
4. THE System SHALL include language toggle in mobile menu

### Requirement 7: Hero Image Slider

**User Story:** As a user, I want to see rotating hero images, so that the homepage is visually engaging.

#### Acceptance Criteria

1. THE System SHALL display hero section with background image slider
2. THE System SHALL automatically transition between images every 5 seconds
3. THE System SHALL include smooth fade transitions between slides
4. THE System SHALL display hero content (title, subtitle, CTA button) over slider

### Requirement 8: Partners Section

**User Story:** As a user, I want to see MKPRIME's partners, so that I can understand their business relationships.

#### Acceptance Criteria

1. THE System SHALL display partner logos in a grid layout
2. THE System SHALL load partner images from public folder
3. THE System SHALL handle missing images gracefully
4. THE System SHALL maintain responsive layout on all screen sizes

### Requirement 9: Scroll Animations

**User Story:** As a user, I want smooth scroll animations, so that the website feels modern and polished.

#### Acceptance Criteria

1. WHEN a section enters viewport, THE System SHALL apply fade-in animation
2. THE System SHALL use Intersection Observer API for scroll detection
3. THE System SHALL apply animations only once per element
4. THE System SHALL not apply animations on admin pages

### Requirement 10: Country Detection

**User Story:** As a user, I want my country to be auto-detected, so that the phone country code is pre-filled.

#### Acceptance Criteria

1. WHEN contact or job application form loads, THE System SHALL detect user's country via IP geolocation API
2. THE System SHALL set country code dropdown to detected country
3. IF detection fails, THEN THE System SHALL default to Qatar (+974)
4. THE System SHALL allow users to manually change country code

### Requirement 11: File Organization

**User Story:** As a developer, I want organized file structure, so that the codebase is maintainable.

#### Acceptance Criteria

1. THE System SHALL organize files in "godaddyyes" folder
2. THE System SHALL create separate folders for CSS, JavaScript, images, and API
3. THE System SHALL include all necessary assets (logos, partner images)
4. THE System SHALL maintain existing PHP API files for email sending
