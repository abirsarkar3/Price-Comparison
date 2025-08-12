"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, XCircle, Loader2 } from "lucide-react";

export function FirebaseDiagnostics() {
  const [status, setStatus] = useState<{
    firebase: "loading" | "success" | "error";
    auth: "loading" | "success" | "error";
    firestore: "loading" | "success" | "error";
    user: any;
    error: string | null;
  }>({
    firebase: "loading",
    auth: "loading",
    firestore: "loading",
    user: null,
    error: null,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    try {
      // Test Firebase initialization
      setStatus(prev => ({ ...prev, firebase: "loading" }));
      if (db && auth) {
        setStatus(prev => ({ ...prev, firebase: "success" }));
      } else {
        setStatus(prev => ({ ...prev, firebase: "error", error: "Firebase not initialized" }));
        return;
      }

      // Test Authentication
      setStatus(prev => ({ ...prev, auth: "loading" }));
      try {
        const authResult = await signInAnonymously(auth);
        setStatus(prev => ({ ...prev, auth: "success", user: authResult.user }));
      } catch (authError: any) {
        setStatus(prev => ({ 
          ...prev, 
          auth: "error", 
          error: `Auth error: ${authError.message}` 
        }));
      }

      // Test Firestore
      setStatus(prev => ({ ...prev, firestore: "loading" }));
      try {
        const testDoc = doc(db, "test", "connection");
        await setDoc(testDoc, { 
          timestamp: new Date(),
          test: true 
        });
        const docSnap = await getDoc(testDoc);
        if (docSnap.exists()) {
          setStatus(prev => ({ ...prev, firestore: "success" }));
        } else {
          setStatus(prev => ({ 
            ...prev, 
            firestore: "error", 
            error: "Firestore write succeeded but read failed" 
          }));
        }
      } catch (firestoreError: any) {
        setStatus(prev => ({ 
          ...prev, 
          firestore: "error", 
          error: `Firestore error: ${firestoreError.message}` 
        }));
      }

    } catch (error: any) {
      setStatus(prev => ({ 
        ...prev, 
        error: `General error: ${error.message}` 
      }));
    }
  };

  const getStatusIcon = (status: "loading" | "success" | "error") => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: "loading" | "success" | "error") => {
    switch (status) {
      case "loading":
        return "bg-yellow-100 text-yellow-800";
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
    }
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-50"
      >
        <AlertCircle className="h-4 w-4 mr-2" />
        Firebase Diagnostics
      </Button>
    );
  }

  return (
    <Card className="fixed top-4 left-4 z-50 w-80 max-h-96 overflow-y-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          Firebase Diagnostics
          <Button
            onClick={() => setIsVisible(false)}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Firebase SDK</span>
            <Badge className={getStatusColor(status.firebase)}>
              {getStatusIcon(status.firebase)}
              <span className="ml-1 capitalize">{status.firebase}</span>
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Authentication</span>
            <Badge className={getStatusColor(status.auth)}>
              {getStatusIcon(status.auth)}
              <span className="ml-1 capitalize">{status.auth}</span>
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Firestore</span>
            <Badge className={getStatusColor(status.firestore)}>
              {getStatusIcon(status.firestore)}
              <span className="ml-1 capitalize">{status.firestore}</span>
            </Badge>
          </div>
        </div>

        {status.user && (
          <div className="text-xs text-muted-foreground">
            <div>User ID: {status.user.uid}</div>
            <div>Anonymous: {status.user.isAnonymous ? "Yes" : "No"}</div>
          </div>
        )}

        {status.error && (
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
            <strong>Error:</strong> {status.error}
          </div>
        )}

        <Button
          onClick={runDiagnostics}
          size="sm"
          className="w-full"
          disabled={status.firebase === "loading" || status.auth === "loading" || status.firestore === "loading"}
        >
          <Loader2 className="h-3 w-3 mr-1" />
          Re-run Tests
        </Button>
      </CardContent>
    </Card>
  );
} 