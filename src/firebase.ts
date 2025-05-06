// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDRQT-8VxArJF3aoYwBJdBFNXoFI4b9L4",
  authDomain: "sims-2c563.firebaseapp.com",
  projectId: "sims-2c563",
  storageBucket: "sims-2c563.firebasestorage.app",
  messagingSenderId: "38506610828",
  appId: "1:38506610828:web:f15e367f5d416cafb97ba9",
  measurementId: "G-KVXK1WJDN6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Authentication
const auth = getAuth(app);

// Initialize Storage
const storage = getStorage(app);

export { app, analytics, db, auth, storage };
