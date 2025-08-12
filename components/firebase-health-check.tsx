'use client';

import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { logFirebaseError } from '@/lib/firebase-error-handler';

interface FirebaseHealthStatus {
  firestore: 'connected' | 'disconnected' | 'error' | 'checking';
  auth: 'connected' | 'disconnected' | 'error' | 'checking';
  lastCheck: Date | null;
}

export default function FirebaseHealthCheck() {
  const [healthStatus, setHealthStatus] = useState<FirebaseHealthStatus>({
    firestore: 'checking',
    auth: 'checking',
    lastCheck: null
  });

  useEffect(() => {
    const checkFirebaseHealth = async () => {
      const newStatus: FirebaseHealthStatus = {
        firestore: 'checking',
        auth: 'checking',
        lastCheck: new Date()
      };

      // Check Firestore connection
      try {
        if (db) {
          // Try to get a simple document to test connection
          const { collection, getDocs, limit } = await import('firebase/firestore');
          await getDocs(collection(db, '_health_check'), limit(1));
          newStatus.firestore = 'connected';
        } else {
          newStatus.firestore = 'disconnected';
        }
      } catch (error) {
        logFirebaseError(error, "Firestore Health Check");
        newStatus.firestore = 'error';
      }

      // Check Auth connection
      try {
        if (auth) {
          // Check if auth is properly initialized
          const currentUser = auth.currentUser;
          newStatus.auth = 'connected';
        } else {
          newStatus.auth = 'disconnected';
        }
      } catch (error) {
        logFirebaseError(error, "Auth Health Check");
        newStatus.auth = 'error';
      }

      setHealthStatus(newStatus);
    };

    // Initial check
    checkFirebaseHealth();

    // Check every 30 seconds
    const interval = setInterval(checkFirebaseHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-100';
      case 'disconnected':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return '✅';
      case 'disconnected':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '⏳';
    }
  };

  // Only show in development or when there are errors
  if (process.env.NODE_ENV === 'production' && 
      healthStatus.firestore === 'connected' && 
      healthStatus.auth === 'connected') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border p-3 max-w-xs">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Firebase Status
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Firestore:</span>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(healthStatus.firestore)}`}>
              {getStatusIcon(healthStatus.firestore)} {healthStatus.firestore}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Auth:</span>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(healthStatus.auth)}`}>
              {getStatusIcon(healthStatus.auth)} {healthStatus.auth}
            </span>
          </div>
        </div>

        {healthStatus.lastCheck && (
          <div className="text-xs text-gray-500 mt-2 text-center">
            Last check: {healthStatus.lastCheck.toLocaleTimeString()}
          </div>
        )}

        {(healthStatus.firestore === 'error' || healthStatus.auth === 'error') && (
          <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
            Firebase connection issues detected. Some features may not work properly.
          </div>
        )}
      </div>
    </div>
  );
}
