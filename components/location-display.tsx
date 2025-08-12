// components/location-display.tsx
"use client";

import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLocationFromFirestore, saveLocationToFirestore, UserLocation } from "../lib/location-client";
import { getLocationDetailsFromCoords, LocationDetails } from "../lib/getLocationDetailsFromCoords";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "react-i18next";

export default function LocationDisplay({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<UserLocation>({ city: "", pincode: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const userId = user?.uid || null;
      const loc = await getLocationFromFirestore(userId);
      setLocation(loc);
      setForm(loc || { city: "", pincode: "" });
      setLoading(false);
    })();
  }, [user?.uid]);

  const handleEdit = () => setEditing(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    const userId = user?.uid || null;
    await saveLocationToFirestore(form, userId);
    setLocation(form);
    setEditing(false);
    setSaving(false);
  };

  const handleUseMyLocation = async () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      return;
    }

    setDetectingLocation(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Get location details using reverse geocoding
      const details = await getLocationDetailsFromCoords(latitude, longitude);
      
      if (details) {
        const locationData = {
          city: details.city,
          pincode: details.pincode || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        };

        const userId = user?.uid || null;
        await saveLocationToFirestore(locationData, userId);
        setLocation(locationData);
        setLocationDetails(details);
      }
    } catch (error) {
      console.warn("Failed to get location:", error);
    } finally {
      setDetectingLocation(false);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <MapPin className="h-4 w-4 text-slate-500" />
        <span className="text-slate-700 dark:text-slate-300">
          {location ? 
            (locationDetails ? 
              `${locationDetails.city}, ${locationDetails.state}` : 
              `${location.city} (${location.pincode})`
            ) : 
            t("locationNotSet")
          }
        </span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-gray-600 rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-600 rounded w-1/3 mb-2"></div>
          <div className="h-6 bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-gray-600 rounded-xl p-6 shadow-lg max-w-sm">
      {!editing ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{t("deliverTo")}</h3>
              <p className="text-gray-300 text-sm">
                {location ? 
                  (locationDetails ? 
                    `${locationDetails.city}, ${locationDetails.state}` : 
                    `${location.city} (${location.pincode})`
                  ) : 
                  t("locationNotSet")
                }
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleUseMyLocation}
            disabled={detectingLocation}
            className="w-full bg-white text-gray-900 hover:bg-gray-100 font-medium disabled:opacity-50"
          >
            <MapPin className="h-4 w-4 mr-2 text-yellow-500" />
            {detectingLocation ? t("detecting") : t("useMyLocation")}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="font-semibold text-white">{t("setLocation")}</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">{t("enterCity")}</label>
              <input
                className="w-full bg-white/10 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder={t("enterCity")}
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-1">{t("enterPincode")}</label>
              <input
                className="w-full bg-white/10 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder={t("enterPincode")}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? t("saving") : t("save")}
            </Button>
            <Button
              onClick={() => setEditing(false)}
              disabled={saving}
              variant="outline"
              className="flex-1 bg-white/10 border-gray-600 text-white hover:bg-white/20"
            >
              {t("cancel")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
