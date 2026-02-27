# Implementation Plan: Persistent Content Storage

## Overview

This implementation plan migrates the content loading mechanism from localStorage to Firebase, ensuring content consistency across all browsers and sessions. The approach is incremental, with testing at each step to catch errors early.

## Tasks

- [x] 1. Set up testing infrastructure
  - Install fast-check for property-based testing
  - Configure Jest for async testing
  - Create test utilities for mocking Firebase
  - _Requirements: All (testing foundation)_

- [x] 2. Create default content constants
  - [x] 2.1 Extract default content from contentManager.js into constants
    - Create DEFAULT_CAREERS, DEFAULT_SERVICES, DEFAULT_ABOUT, DEFAULT_HERO, DEFAULT_PARTNERS
    - Ensure all default values match current hardcoded values
    - _Requirements: 1.2, 4.1_

  - [ ]* 2.2 Write unit tests for default content structure
    - Test that each default constant has required fields
    - Verify data types match expected schema
    - _Requirements: 1.2_

- [x] 3. Implement Firebase content loading function
  - [x] 3.1 Create loadDynamicContentFromFirebase() function
    - Implement async function to load all content types from Firebase
    - Use Promise.all for parallel loading
    - Handle errors and return defaults on failure
    - Add console logging for errors and warnings
    - _Requirements: 1.1, 1.2, 1.4, 4.1, 4.2, 5.4_

  - [ ]* 3.2 Write property test for Firebase content loading
    - **Property 1: Firebase Content Loading**
    - **Validates: Requirements 1.1, 1.4**

  - [ ]* 3.3 Write property test for fallback behavior
    - **Property 2: Fallback to Defaults with Error Logging**
    - **Validates: Requirements 1.2, 4.1, 4.2**

  - [ ]* 3.4 Write property test for parallel loading
    - **Property 9: Parallel Loading**
    - **Validates: Requirements 5.4**

- [x] 4. Implement content caching mechanism
  - [x] 4.1 Add in-memory cache for loaded content
    - Create cache object to store loaded content
    - Check cache before fetching from Firebase
    - Clear cache on page refresh
    - _Requirements: 5.1_

  - [ ]* 4.2 Write property test for content caching
    - **Property 8: Content Caching**
    - **Validates: Requirements 5.1**

- [x] 5. Refactor getContent() to use Firebase
  - [x] 5.1 Convert getContent() to async function
    - Replace loadDynamicContent() call with loadDynamicContentFromFirebase()
    - Remove all localStorage.getItem() calls
    - Maintain existing content structure and language support
    - _Requirements: 1.1, 1.3, 3.3_

  - [ ]* 5.2 Write property test for no localStorage usage
    - **Property 3: No localStorage Usage**
    - **Validates: Requirements 1.3**

  - [ ]* 5.3 Write property test for data structure compatibility
    - **Property 5: Data Structure Compatibility**
    - **Validates: Requirements 3.3**

- [x] 6. Add error handling and validation
  - [x] 6.1 Implement data validation for Firebase responses
    - Create validation functions for each content type
    - Handle null, undefined, and malformed data
    - Merge partial data with defaults
    - _Requirements: 4.3, 4.4_

  - [ ]* 6.2 Write property test for timeout handling
    - **Property 6: Graceful Timeout Handling**
    - **Validates: Requirements 4.3**

  - [ ]* 6.3 Write property test for invalid data handling
    - **Property 7: Invalid Data Handling**
    - **Validates: Requirements 4.4**

- [x] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Update React components for async content loading
  - [x] 8.1 Update Home.js to handle async getContent
    - Add useState and useEffect for content loading
    - Add loading state
    - Handle errors gracefully
    - _Requirements: 1.1, 3.3_

  - [x] 8.2 Update Careers.js to handle async getContent
    - Add useState and useEffect for content loading
    - Add loading state
    - Handle errors gracefully
    - _Requirements: 1.1, 3.3_

  - [x] 8.3 Update Services.js to handle async getContent
    - Add useState and useEffect for content loading
    - Add loading state
    - Handle errors gracefully
    - _Requirements: 1.1, 3.3_

  - [x] 8.4 Update Partners.js to handle async getContent
    - Add useState and useEffect for content loading
    - Add loading state
    - Handle errors gracefully
    - _Requirements: 1.1, 3.3_

  - [x] 8.5 Update Contact.js to handle async getContent (if needed)
    - Add useState and useEffect for content loading
    - Add loading state
    - Handle errors gracefully
    - _Requirements: 1.1, 3.3_

  - [ ]* 8.6 Write integration tests for component content loading
    - Test each component renders with Firebase content
    - Test loading states
    - Test error states
    - _Requirements: 1.1, 3.3_

- [x] 9. Remove old localStorage code
  - [x] 9.1 Remove loadDynamicContent() function from contentManager.js
    - Delete the function entirely
    - Verify no references remain
    - _Requirements: 3.1_

  - [x] 9.2 Remove any remaining localStorage references for dynamic content
    - Search codebase for localStorage.getItem calls related to content
    - Remove or replace with Firebase calls
    - _Requirements: 1.3, 3.1_

- [x] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Integration testing and verification
  - [x] 11.1 Test admin dashboard save → public site load flow
    - Save content in admin dashboard
    - Verify content appears on public site
    - Test in different browsers
    - _Requirements: 2.3, 6.4_

  - [ ]* 11.2 Write property test for save-load round trip
    - **Property 10: Save-Load Round Trip**
    - **Validates: Requirements 6.4**

  - [ ]* 11.3 Write property test for content updates
    - **Property 4: Content Updates Are Retrievable**
    - **Validates: Requirements 2.3**

- [x] 12. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The migration maintains backward compatibility with existing data structures
- All React components must handle async content loading with proper loading states
