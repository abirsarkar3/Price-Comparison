"use client";

import { useState, useEffect } from "react";
import { MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLocationDetailsFromCoords } from "@/lib/getLocationDetailsFromCoords";
import { saveLocationToFirestore, UserLocation } from "@/lib/location-client";
import { useAuth } from "@/hooks/use-auth";

export default function LocationPermissionPrompt() {
  const { user } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;
    
    // Check if location is already set
    const savedLocation = localStorage.getItem("location");
    if (!savedLocation) {
      // Show prompt after a short delay
      const timer = setTimeout(() => setShowPrompt(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAllowLocation = async () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      return;
    }

    setLoading(true);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;
      const locationDetails = await getLocationDetailsFromCoords(latitude, longitude);

      if (locationDetails) {
        // Convert LocationDetails to UserLocation format
        const userLocation: UserLocation = {
          city: locationDetails.city,
          pincode: locationDetails.pincode || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        };

        // Save to localStorage
        localStorage.setItem("location", JSON.stringify(locationDetails));

        // Save to our client-side storage
        await saveLocationToFirestore(userLocation, user?.uid || null);
      }

      setShowPrompt(false);
    } catch (error) {
      console.warn("Location access denied or failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotNow = () => {
    setShowPrompt(false);
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-6 max-w-sm">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Enable Location</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Get personalized deals near you</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
          Allow location access to find the best deals and accurate delivery times in your area.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleNotNow}
            className="flex-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Not Now
          </Button>
          <Button
            onClick={handleAllowLocation}
            disabled={loading}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            {loading ? "Getting Location..." : "Allow"}
          </Button>
        </div>
      </div>
    </div>
  );
}

