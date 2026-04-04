import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB75YFJBJ185VeHloN7Q-ERvH3QJfjYuJM",
  authDomain: "mkprime-website.firebaseapp.com",
  projectId: "mkprime-website",
  storageBucket: "mkprime-website.firebasestorage.app",
  messagingSenderId: "186933738659",
  appId: "1:186933738659:web:778e8472ddda6508bcd316",
  measurementId: "G-S1S00KKTCR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;