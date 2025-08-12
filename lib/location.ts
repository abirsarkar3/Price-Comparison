// lib/location.ts
import { adminDb } from "./firebase-admin";
import { getAnonUserId } from "./anonUserId";

// Type for location
export type UserLocation = {
  city: string;
  pincode: string;
};

// Reverse geocode using BigDataCloud API
export async function reverseGeocode(lat: number, lon: number): Promise<UserLocation | null> {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return {
    city: data.city || data.locality || "",
    pincode: data.postcode || "",
  };
}

// Prompt for geolocation and reverse geocode
export async function promptAndSaveLocation(): Promise<UserLocation | null> {
  if (typeof window === "undefined") return null;
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const loc = await reverseGeocode(latitude, longitude);
        if (loc && loc.city && loc.pincode) {
          await saveLocationToFirestore(loc);
          resolve(loc);
        } else {
          resolve(null);
        }
      },
      (err) => {
        resolve(null);
      }
    );
  });
}

// Save location to Firestore
export async function saveLocationToFirestore(loc: UserLocation) {
  const userId = getAnonUserId();
  await adminDb.collection("users").doc(userId).set(
    { location: loc },
    { merge: true }
  );
}

// Get location from Firestore
export async function getLocationFromFirestore(): Promise<UserLocation | null> {
  const userId = getAnonUserId();
  const doc = await adminDb.collection("users").doc(userId).get();
  if (!doc.exists) return null;
  return doc.data()?.location || null;
}