// lib/location-client.ts - Client-side location functions
import { getAnonUserId } from "./anonUserId";

// Type for location
export type UserLocation = {
  city: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  area?: string;
  fullAddress?: string;
};

// Enhanced location validation
export function validateLocation(location: UserLocation | null): boolean {
  if (!location) return false;
  
  return !!(
    location.city &&
    location.city !== "Unknown Location" &&
    location.city.length > 3 &&
    !location.city.includes("Unknown") &&
    location.pincode &&
    location.pincode.length >= 6 &&
    !location.pincode.includes(",")
  );
}

// Get formatted location string for search
export function getFormattedLocation(location: UserLocation | null): string {
  if (!validateLocation(location)) {
    return "Unknown Location";
  }
  
  if (location!.area && location!.area !== "Unknown Area") {
    return `${location!.city} (${location!.area}) - ${location!.pincode}`;
  }
  
  return `${location!.city} (${location!.pincode})`;
}

// Save location to localStorage (client-side only)
export async function saveLocationToFirestore(loc: UserLocation, userId?: string | null) {
  if (typeof window === "undefined") return;
  
  const id = userId || getAnonUserId();
  localStorage.setItem(`location_${id}`, JSON.stringify(loc));
  
  // If user is authenticated, also save to server via API
  if (userId) {
    try {
      await fetch('/api/save-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location: loc }),
      });
    } catch (error) {
      console.warn('Failed to save location to server:', error);
    }
  }
}

// Get location from localStorage (client-side only)
export async function getLocationFromFirestore(userId?: string | null): Promise<UserLocation | null> {
  if (typeof window === "undefined") return null;
  
  const id = userId || getAnonUserId();
  const saved = localStorage.getItem(`location_${id}`);
  
  if (saved) {
    try {
      const location = JSON.parse(saved);
      // Validate the saved location
      if (validateLocation(location)) {
        return location;
      } else {
        console.warn('Saved location is invalid, removing...');
        localStorage.removeItem(`location_${id}`);
      }
    } catch (error) {
      console.warn('Failed to parse saved location:', error);
      localStorage.removeItem(`location_${id}`);
    }
  }
  
  return null;
}

// Reverse geocode using BigDataCloud API
export async function reverseGeocode(lat: number, lon: number): Promise<UserLocation | null> {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    
    const location: UserLocation = {
      city: data.city || data.locality || "",
      pincode: data.postcode || "",
      latitude: lat,
      longitude: lon,
      area: data.suburb || data.neighbourhood || "",
      fullAddress: data.display_name || ""
    };
    
    // Validate the geocoded location
    if (validateLocation(location)) {
      return location;
    }
    
    return null;
  } catch (error) {
    console.warn('Reverse geocoding failed:', error);
    return null;
  }
}

// Prompt for geolocation and reverse geocode
export async function promptAndSaveLocation(): Promise<UserLocation | null> {
  if (typeof window === "undefined") return null;
  
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const loc = await reverseGeocode(latitude, longitude);
        if (loc && validateLocation(loc)) {
          await saveLocationToFirestore(loc);
          resolve(loc);
        } else {
          resolve(null);
        }
      },
      (err) => {
        console.warn('Geolocation failed:', err);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
}

// Get fallback location based on IP or default
export async function getFallbackLocation(): Promise<UserLocation | null> {
  try {
    // Try to get location from IP geolocation
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      const data = await response.json();
      const location: UserLocation = {
        city: data.city || "Mumbai",
        pincode: data.postal || "400001",
        area: data.region || "",
        fullAddress: `${data.city}, ${data.country_name}`
      };
      
      if (validateLocation(location)) {
        return location;
      }
    }
  } catch (error) {
    console.warn('IP geolocation failed:', error);
  }
  
  // Return default location (Mumbai)
  return {
    city: "Mumbai",
    pincode: "400001",
    area: "Mumbai",
    fullAddress: "Mumbai, Maharashtra, India"
  };
}

// Check if location supports specific platforms
export function getSupportedPlatforms(location: UserLocation | null): string[] {
  if (!validateLocation(location)) return [];
  
  const city = location!.city.toLowerCase();
  const supportedPlatforms: string[] = [];
  
  // Grocery platforms
  if (['mumbai', 'delhi', 'bangalore', 'hyderabad', 'chennai', 'pune', 'kolkata'].some(c => city.includes(c))) {
    supportedPlatforms.push('zepto', 'blinkit', 'bigbasket', 'instamart');
  }
  
  // Food platforms
  if (['mumbai', 'delhi', 'bangalore', 'hyderabad', 'chennai', 'pune', 'kolkata', 'ahmedabad', 'jaipur', 'lucknow'].some(c => city.includes(c))) {
    supportedPlatforms.push('zomato', 'swiggy', 'magicpin');
  }
  
  // Medicine platforms
  if (['mumbai', 'delhi', 'bangalore', 'hyderabad', 'chennai', 'pune', 'kolkata', 'ahmedabad', 'jaipur'].some(c => city.includes(c))) {
    supportedPlatforms.push('1mg', 'apollo247', 'pharmeasy');
  }
  
  return supportedPlatforms;
} 