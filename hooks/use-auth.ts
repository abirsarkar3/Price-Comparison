// hooks/use-auth.ts
"use client";

import { useState, useEffect } from "react";
import type { Auth } from "firebase/auth";
import { useAuth as useAuthContext } from "@/components/auth-provider";

export function useAuth() {
  const { user, loading } = useAuthContext();
  const [authLoading, setAuthLoading] = useState(false);
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window !== "undefined") {
        try {
          const { auth: firebaseAuth } = await import("@/lib/firebase");
          setAuth(firebaseAuth);
        } catch (error) {
          console.error("Failed to initialize auth:", error);
        }
      }
    };

    initAuth();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) return;
    setAuthLoading(true);
    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setAuthLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!auth) return;
    setAuthLoading(true);
    try {
      const { createUserWithEmailAndPassword } = await import("firebase/auth");
      await createUserWithEmailAndPassword(auth, email, password);
    } finally {
      setAuthLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    if (!auth) return;
    setAuthLoading(true);
    try {
      const { signInWithPopup, GoogleAuthProvider } = await import("firebase/auth");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    if (!auth) return;
    try {
      const { signOut } = await import("firebase/auth");
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return {
    user,
    loading: loading || authLoading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut, // ✅ Match what modern-header uses
  };
}
