// lib/firebase-lazy.ts - Lazy Firebase initialization
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAtLH8W3637tYcbMADk8VS7leWiL7x5pQM",
  authDomain: "comparison-application.firebaseapp.com",
  projectId: "comparison-application",
  storageBucket: "comparison-application.appspot.com",
  messagingSenderId: "269616461467",
  appId: "1:269616461467:web:d835d0fedd8eeef315b83e",
  measurementId: "G-MQV33QTTXW",
};

// Lazy initialization variables
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Initialize Firebase only when needed
function initializeFirebase() {
  if (app) return { app, auth, db };

  try {
    // Initialize Firebase only if not already initialized
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }

    // Initialize Auth
    auth = getAuth(app);

    // Initialize Firestore
    db = getFirestore(app);
    
    // Connect to emulators in development
    if (process.env.NODE_ENV === "development") {
      try {
        connectAuthEmulator(auth, "http://localhost:9099");
        connectFirestoreEmulator(db, "localhost", 8080);
      } catch (error) {
        // Emulators might not be running, which is fine
        console.log("Firebase emulators not running, using production");
      }
    }

    return { app, auth, db };
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
    return { app: null, auth: null, db: null };
  }
}

// Export lazy getters
export function getFirebaseApp(): FirebaseApp | null {
  if (!app) {
    const { app: initializedApp } = initializeFirebase();
    return initializedApp;
  }
  return app;
}

export function getFirebaseAuth(): Auth | null {
  if (!auth) {
    const { auth: initializedAuth } = initializeFirebase();
    return initializedAuth;
  }
  return auth;
}

export function getFirebaseDb(): Firestore | null {
  if (!db) {
    const { db: initializedDb } = initializeFirebase();
    return initializedDb;
  }
  return db;
}

// Check if Firebase is available
export function isFirebaseAvailable(): boolean {
  return typeof window !== "undefined" && getFirebaseDb() !== null;
} 