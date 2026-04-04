# Firebase Setup Guide for MKPRIME

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `mkprime-website` (or any name you prefer)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Set up Firestore Database

1. In your Firebase project, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (we'll secure it later)
4. Select a location (choose closest to your users)
5. Click "Done"

## Step 3: Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon `</>`
5. Enter app nickname: `mkprime-web`
6. Click "Register app"
7. Copy the `firebaseConfig` object

## Step 4: Update Firebase Configuration

1. Open `src/firebase.js` in your project
2. Replace the placeholder config with your actual config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id"
};
```

## Step 5: Set up Firestore Security Rules (Optional but Recommended)

1. In Firebase Console, go to "Firestore Database"
2. Click "Rules" tab
3. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to content for everyone
    match /content/{document} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users can write
    }
  }
}
```

## Step 6: Test the Setup

1. Save your changes
2. Run `npm start`
3. Check browser console for any Firebase errors
4. Go to admin panel and make changes
5. Check if changes appear on other devices/browsers

## Step 7: Set up Authentication (Optional)

If you want to secure the admin panel:

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password"
5. Go to "Users" tab
6. Click "Add user"
7. Enter your admin email and password

## Troubleshooting

### Common Issues:

1. **"Firebase not initialized"**: Check if your config is correct in `src/firebase.js`
2. **Permission denied**: Check Firestore security rules
3. **Network errors**: Check if Firestore is enabled and accessible

### Environment Variables (Optional)

For security, you can use environment variables:

1. Create `.env` file in project root:
```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your-app-id
```

2. Update `src/firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};
```

## Next Steps

After setup:
1. Test admin panel changes on multiple devices
2. Set up proper authentication for admin panel
3. Configure Firestore security rules for production
4. Set up Firebase hosting (optional)