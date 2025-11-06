import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Use the provided Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9W1EQnfTx1qcdMH9aaw5Sse6DYVUb1Ac",
  authDomain: "studio-945841177-665ee.firebaseapp.com",
  databaseURL: "https://studio-945841177-665ee-default-rtdb.firebaseio.com",
  projectId: "studio-945841177-665ee",
  storageBucket: "studio-945841177-665ee.firebasestorage.app",
  messagingSenderId: "466253670945",
  appId: "1:466253670945:web:a948a9a8115ae62a1c1160"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
