// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBwQE9c3c1tr9k4LAiTuNynXekEcmJLY64",
  authDomain: "mkprime-add37.firebaseapp.com",
  projectId: "mkprime-add37",
  storageBucket: "mkprime-add37.firebasestorage.app",
  messagingSenderId: "789214628106",
  appId: "1:789214628106:web:5f93dbb50c4e917c4852f3",
  measurementId: "G-2VWZRB245Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
