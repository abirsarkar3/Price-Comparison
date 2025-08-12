// lib/firebase.ts - Firebase configuration with improved error handling
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, Firestore } from "firebase/firestore";
import { getDatabase, Database, connectDatabaseEmulator } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAtLH8W3637tYcbMADk8VS7leWiL7x5pQM",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "comparison-application.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://comparison-application-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "comparison-application",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "comparison-application.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "269616461467",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:269616461467:web:d835d0fedd8eeef315b83e",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-MQV33QTTXW"
};

// Initialize Firebase only if not already initialized
let app: FirebaseApp;
try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
} catch (error) {
  console.error("Failed to initialize Firebase app:", error);
  throw error;
}

// Initialize Auth
export const auth: Auth = getAuth(app);

// Initialize Realtime Database
export const realtimeDb: Database = getDatabase(app);

// Initialize Firestore with improved error handling
let db: Firestore | null = null;

try {
  db = getFirestore(app);
  
  // Only connect to emulators if explicitly enabled and in development
  if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true") {
    try {
      connectAuthEmulator(auth, "http://localhost:9099");
      connectFirestoreEmulator(db, "localhost", 8080);
      connectDatabaseEmulator(realtimeDb, "localhost", 9000);
      console.log("Connected to Firebase emulators");
    } catch (error) {
      console.log("Firebase emulators not running, using production");
    }
  }
} catch (error) {
  console.error("Failed to initialize Firestore:", error);
  db = null;
}

export { db };
