"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { authService, isFirebaseAvailable } from "@/lib/firebase-service";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only initialize Firebase auth if we're in the browser
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    // Check if Firebase is available
    if (!isFirebaseAvailable()) {
      console.log("Firebase not available, using anonymous mode");
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = authService.onAuthStateChanged((firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });
      
      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase auth initialization error:", error);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

