// lib/firebase-service.ts - Enhanced Firebase service with better error handling
import { db, auth } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  addDoc,
  deleteDoc,
  onSnapshot,
  DocumentData,
  QuerySnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Utility function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retry wrapper for Firebase operations
async function withRetry<T>(operation: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (retries > 0 && (error.code === 'unavailable' || error.code === 'deadline-exceeded' || error.message?.includes('network'))) {
      console.warn(`Firebase operation failed, retrying... (${retries} attempts left)`);
      await delay(RETRY_DELAY);
      return withRetry(operation, retries - 1);
    }
    throw error;
  }
}

// Check if Firebase is available
export function isFirebaseAvailable(): boolean {
  return db !== null && auth !== null;
}

// Check if user ID is anonymous
export function isAnonymousUser(userId?: string | null): boolean {
  return !userId || 
         userId.startsWith("user_") || 
         userId === "anonymous" || 
         userId === "ssr-anon";
}

// Check if user is authenticated (has a real Firebase UID)
export function isAuthenticatedUser(userId?: string | null): boolean {
  return !isAnonymousUser(userId);
}

// Authentication functions
export const authService = {
  async signIn(email: string, password: string) {
    return withRetry(() => signInWithEmailAndPassword(auth, email, password));
  },

  async signUp(email: string, password: string) {
    return withRetry(() => createUserWithEmailAndPassword(auth, email, password));
  },

  async signOut() {
    return withRetry(() => signOut(auth));
  },

  onAuthStateChanged(callback: (user: User | null) => void): Unsubscribe {
    return onAuthStateChanged(auth, callback);
  },

  getCurrentUser(): User | null {
    return auth.currentUser;
  }
};

// Firestore functions
export const firestoreService = {
  async getDocument(collectionName: string, docId: string) {
    if (!db) throw new Error('Firestore not initialized');
    
    return withRetry(async () => {
      const docRef = doc(db!, collectionName, docId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    });
  },

  async setDocument(collectionName: string, docId: string, data: any) {
    if (!db) throw new Error('Firestore not initialized');
    
    return withRetry(async () => {
      const docRef = doc(db!, collectionName, docId);
      await setDoc(docRef, data, { merge: true });
      return docRef;
    });
  },

  async updateDocument(collectionName: string, docId: string, data: any) {
    if (!db) throw new Error('Firestore not initialized');
    
    return withRetry(async () => {
      const docRef = doc(db!, collectionName, docId);
      await updateDoc(docRef, data);
      return docRef;
    });
  },

  async addDocument(collectionName: string, data: any) {
    if (!db) throw new Error('Firestore not initialized');
    
    return withRetry(async () => {
      const collectionRef = collection(db!, collectionName);
      return await addDoc(collectionRef, data);
    });
  },

  async deleteDocument(collectionName: string, docId: string) {
    if (!db) throw new Error('Firestore not initialized');
    
    return withRetry(async () => {
      const docRef = doc(db!, collectionName, docId);
      await deleteDoc(docRef);
    });
  },

  async queryDocuments(collectionName: string, field: string, operator: any, value: any) {
    if (!db) throw new Error('Firestore not initialized');
    
    return withRetry(async () => {
      const collectionRef = collection(db!, collectionName);
      const q = query(collectionRef, where(field, operator, value));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });
  },

  onDocumentSnapshot(collectionName: string, docId: string, callback: (data: DocumentData | null) => void): Unsubscribe {
    if (!db) throw new Error('Firestore not initialized');
    
    const docRef = doc(db!, collectionName, docId);
    return onSnapshot(docRef, (doc) => {
      callback(doc.exists() ? doc.data() : null);
    }, (error) => {
      console.error('Document snapshot error:', error);
      callback(null);
    });
  },

  onCollectionSnapshot(collectionName: string, callback: (snapshot: QuerySnapshot) => void): Unsubscribe {
    if (!db) throw new Error('Firestore not initialized');
    
    const collectionRef = collection(db!, collectionName);
    return onSnapshot(collectionRef, callback, (error) => {
      console.error('Collection snapshot error:', error);
    });
  }
};

// User-specific functions
export const userService = {
  async getUserProfile(userId: string) {
    return firestoreService.getDocument('users', userId);
  },

  async updateUserProfile(userId: string, data: any) {
    return firestoreService.updateDocument('users', userId, data);
  },

  async createUserProfile(userId: string, data: any) {
    return firestoreService.setDocument('users', userId, {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
};

// Cart functions
export const cartService = {
  async getUserCart(userId: string) {
    return firestoreService.getDocument('carts', userId);
  },

  async updateUserCart(userId: string, cartData: any) {
    return firestoreService.updateDocument('carts', userId, {
      ...cartData,
      updatedAt: new Date()
    });
  },

  async createUserCart(userId: string, cartData: any) {
    return firestoreService.setDocument('carts', userId, {
      ...cartData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
};

// Search history functions
export const searchHistoryService = {
  async addSearchHistory(userId: string, searchData: any) {
    return firestoreService.addDocument('searchHistory', {
      userId,
      ...searchData,
      timestamp: new Date()
    });
  },

  async getUserSearchHistory(userId: string) {
    return firestoreService.queryDocuments('searchHistory', 'userId', '==', userId);
  }
};

// Legacy FirebaseService class for backward compatibility
export class FirebaseService {
  static async saveToFirestore(collection: string, docId: string, data: any): Promise<void> {
    // Early exit for anonymous users or when Firebase is not available
    if (isAnonymousUser(docId) || !isFirebaseAvailable()) {
      console.log("Skipping Firestore save - anonymous user or Firebase unavailable");
      return;
    }

    try {
      await firestoreService.setDocument(collection, docId, data);
    } catch (error) {
      console.warn(`Failed to save to Firestore (${collection}/${docId}):`, error);
      // Don't throw error, just log it
    }
  }

  static async getFromFirestore(collection: string, docId: string): Promise<any | null> {
    // Early exit for anonymous users or when Firebase is not available
    if (isAnonymousUser(docId) || !isFirebaseAvailable()) {
      console.log("Skipping Firestore read - anonymous user or Firebase unavailable");
      return null;
    }

    try {
      return await firestoreService.getDocument(collection, docId);
    } catch (error) {
      console.warn(`Failed to read from Firestore (${collection}/${docId}):`, error);
      return null;
    }
  }
}

// Local storage wrapper for anonymous users
export class LocalStorageService {
  static save(key: string, data: any): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn("Failed to save to localStorage:", error);
    }
  }

  static get(key: string): any | null {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn("Failed to read from localStorage:", error);
      return null;
    }
  }

  static remove(key: string): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("Failed to remove from localStorage:", error);
    }
  }
} 