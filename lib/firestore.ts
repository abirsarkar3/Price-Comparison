import type { Firestore } from "firebase/firestore";
import { logFirebaseError } from "./firebase-error-handler";

// Lazy Firestore instance (client-only)
let db: Firestore | null = null;

// Lazy load Firestore only on the client
export const getDb = async (): Promise<Firestore | null> => {
  if (!db && typeof window !== "undefined") {
    const { db: firebaseDb } = await import("./firebase");
    db = firebaseDb;
  }
  return db;
};

// Save detected user location to Firestore
export const saveDetectedLocation = async (
  userId: string,
  location: {
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    lat?: number;
    lng?: number;
  }
) => {
  const database = await getDb();
  if (!database) return;

  const { doc, setDoc } = await import("firebase/firestore");

  const locationRef = doc(database, "userLocations", userId);

  await setDoc(
    locationRef,
    {
      ...location,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
};

// Save search history to Firestore
export const saveSearchHistory = async (
  userId: string,
  searchData: {
    query: string;
    category: string;
    location: string;
    resultsCount: number;
    searchTime: number;
  }
) => {
  try {
    const database = await getDb();
    if (!database) {
      console.warn("Firestore database not available, skipping search history save");
      return;
    }

    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");

    await addDoc(collection(database, "searchHistory"), {
      userId,
      ...searchData,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    logFirebaseError(error, "Save Search History");
    // Don't throw error to avoid breaking the main search functionality
  }
};

// Get user search history
export const getUserSearchHistory = async (userId: string, limit = 10) => {
  const database = await getDb();
  if (!database) return [];

  const { collection, query, where, orderBy, limit: limitQuery, getDocs } = await import("firebase/firestore");

  const q = query(
    collection(database, "searchHistory"),
    where("userId", "==", userId),
    orderBy("timestamp", "desc"),
    limitQuery(limit)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Save user preferences
export const saveUserPreferences = async (
  userId: string,
  preferences: {
    defaultCategory?: string;
    preferredPlatforms?: string[];
    notifications?: boolean;
    theme?: 'light' | 'dark' | 'system';
  }
) => {
  const database = await getDb();
  if (!database) return;

  const { doc, setDoc } = await import("firebase/firestore");

  const prefsRef = doc(database, "userPreferences", userId);

  await setDoc(
    prefsRef,
    {
      ...preferences,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
};

// Get user preferences
export const getUserPreferences = async (userId: string) => {
  const database = await getDb();
  if (!database) return null;

  const { doc, getDoc } = await import("firebase/firestore");

  const prefsRef = doc(database, "userPreferences", userId);
  const snapshot = await getDoc(prefsRef);

  return snapshot.exists() ? snapshot.data() : null;
};

// Save platform availability data
export const savePlatformAvailability = async (
  location: string,
  availability: {
    city: string;
    pincode: string;
    platforms: {
      groceries: string[];
      food: string[];
      medicines: string[];
    };
    lastUpdated: string;
  }
) => {
  const database = await getDb();
  if (!database) return;

  const { doc, setDoc } = await import("firebase/firestore");

  const availabilityRef = doc(database, "platformAvailability", location);

  await setDoc(
    availabilityRef,
    {
      ...availability,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
};

// Get platform availability for a location
export const getPlatformAvailability = async (location: string) => {
  const database = await getDb();
  if (!database) return null;

  const { doc, getDoc } = await import("firebase/firestore");

  const availabilityRef = doc(database, "platformAvailability", location);
  const snapshot = await getDoc(availabilityRef);

  return snapshot.exists() ? snapshot.data() : null;
};

// Save price comparison results
export const savePriceComparison = async (
  comparisonData: {
    query: string;
    category: string;
    location: string;
    results: Array<{
      platform: string;
      price: number;
      deliveryFee?: number;
      totalPrice: number;
      availability: boolean;
    }>;
    searchTime: number;
  }
) => {
  try {
    const database = await getDb();
    if (!database) {
      console.warn("Firestore database not available, skipping price comparison save");
      return;
    }

    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");

    await addDoc(collection(database, "priceComparisons"), {
      ...comparisonData,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    logFirebaseError(error, "Save Price Comparison");
    // Don't throw error to avoid breaking the main search functionality
  }
};

// Get recent price comparisons
export const getRecentPriceComparisons = async (limit = 20) => {
  const database = await getDb();
  if (!database) return [];

  const { collection, query, orderBy, limit: limitQuery, getDocs } = await import("firebase/firestore");

  const q = query(
    collection(database, "priceComparisons"),
    orderBy("timestamp", "desc"),
    limitQuery(limit)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

