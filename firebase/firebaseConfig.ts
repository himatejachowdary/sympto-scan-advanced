import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Prefer Vite env variables (VITE_FIREBASE_...) for configuration so secrets
// are not hard-coded. Fallback to the existing values if env vars are not set.
// Ensure you have a `.env` with VITE_FIREBASE_* keys in your project root.
const _env = (import.meta as any).env || {};

// Load firebase config exclusively from Vite env vars. Remove hard-coded
// values so the app depends on the `.env` provided at build/runtime.
const firebaseConfig = {
  apiKey: _env.VITE_FIREBASE_API_KEY,
  authDomain: _env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: _env.VITE_FIREBASE_DATABASE_URL,
  projectId: _env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: _env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: _env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: _env.VITE_FIREBASE_APP_ID
};

// Warn if any required env var is missing to help debugging in development.
const requiredKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_DATABASE_URL',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];
const missing = requiredKeys.filter((k) => !_env[k]);
if (missing.length) {
  console.warn('Missing Firebase environment variables:', missing.join(', '), '\nMake sure these are set in your .env file.');
}


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
