import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDZjm2WQ4sCghLxxOqHiI8PFOFUdglPeXg",
  authDomain: "anax-inventions.firebaseapp.com",
  projectId: "anax-inventions",
  storageBucket: "anax-inventions.firebasestorage.app",
  messagingSenderId: "472212450901",
  appId: "1:472212450901:web:3e2732963e99a358e7aedc",
  measurementId: "G-TP2LL74012"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Google Sign-In Function
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return {
      fullName: result.user.displayName,
      email: result.user.email,
      googleId: result.user.uid,
      avatar: result.user.photoURL,
    };
  } catch (error) {
    console.error('Google Sign-In Error:', error.message);
    throw error;
  }
};