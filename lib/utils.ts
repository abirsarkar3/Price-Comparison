import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Combines Tailwind classes and merges overrides
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

// Converts price string like "₹1,299" to number
export function normalizePrice(s?: string): number {
  if (!s) return Infinity;
  const m = s.replace(/[₹,]/g, '').match(/\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : Infinity;
}

// Maps platform name to logo URL
export function mapPlatformLogo(platform: string): string {
  const logos: Record<string, string> = {
    Zepto: "https://upload.wikimedia.org/wikipedia/commons/4/45/Zepto_logo.png",
    Blinkit: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Blinkit_Logo.png",
    BigBasket: "https://upload.wikimedia.org/wikipedia/commons/e/e4/BigBasket_logo.png",
    "Swiggy Instamart": "https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.png",
    Swiggy: "https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.png",
    Zomato: "https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png",
    "Apollo 247": "https://upload.wikimedia.org/wikipedia/en/1/1a/Apollo_Pharmacy_logo.png",
    "Tata 1mg": "https://upload.wikimedia.org/wikipedia/commons/2/2d/1mg_Logo.png",
    Pharmeasy: "https://upload.wikimedia.org/wikipedia/commons/0/0a/PharmEasy_Logo.png",
    Magicpin: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Magicpin_logo.png",
  };
  return logos[platform] || "";
}

// Converts latitude and longitude to address, city, pincode using Nominatim API
export async function getLocationDetailsFromCoords(lat: number, lng: number) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }

    const data = await response.json();

    return {
      address: data.address.road || data.display_name || "Unknown",
      city:
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.district ||
        "",
      state: data.address.state || "",
      pincode: data.address.postcode || "",
    };
  } catch (error) {
    console.error("Error fetching location details:", error);
    return null;
  }
}
