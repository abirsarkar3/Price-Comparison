"use client"

import { useState, useEffect, useCallback } from "react"

interface LocationData {
  latitude: number
  longitude: number
  city: string
  area: string
  fullAddress: string
}

interface LocationState {
  location: LocationData | null
  loading: boolean
  error: string | null
  permissionStatus: "prompt" | "granted" | "denied" | "unknown"
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    location: null,
    loading: false,
    error: null,
    permissionStatus: "unknown",
  })

  // Load saved location from localStorage on mount
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const savedLocation = localStorage.getItem("userLocation")
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation)
        setState((prev) => ({ ...prev, location: parsedLocation }))
      } catch (error) {
        console.error("Failed to parse saved location:", error)
        localStorage.removeItem("userLocation")
      }
    }

    // Check current permission status
    if ("permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setState((prev) => ({ ...prev, permissionStatus: result.state as any }))
      })
    }
  }, [])

  // Reverse geocode coordinates to get address
  const reverseGeocode = async (lat: number, lng: number): Promise<LocationData> => {
    try {
      // Using Nominatim (OpenStreetMap) for free reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            "User-Agent": "PriceCompare-App",
          },
        },
      )

      if (!response.ok) {
        throw new Error("Geocoding failed")
      }

      const data = await response.json()
      const address = data.address || {}

      const city = address.city || address.town || address.village || address.county || "Unknown City"
      const area = address.suburb || address.neighbourhood || address.road || address.postcode || "Unknown Area"
      const fullAddress = data.display_name || `${city}, ${area}`

      return {
        latitude: lat,
        longitude: lng,
        city,
        area,
        fullAddress,
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error)
      // Fallback location data
      return {
        latitude: lat,
        longitude: lng,
        city: "Unknown City",
        area: "Unknown Area",
        fullAddress: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      }
    }
  }

  // Request location permission and get coordinates
  const requestLocation = useCallback(async () => {
    // Only run on client side
    if (typeof window === "undefined") return;

    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by this browser",
        permissionStatus: "denied",
      }))
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        })
      })

      const { latitude, longitude } = position.coords
      const locationData = await reverseGeocode(latitude, longitude)

      // Save to localStorage
      localStorage.setItem("userLocation", JSON.stringify(locationData))

      setState((prev) => ({
        ...prev,
        location: locationData,
        loading: false,
        error: null,
        permissionStatus: "granted",
      }))
    } catch (error: any) {
      let errorMessage = "Failed to get location"
      let permissionStatus: "denied" | "prompt" = "denied"

      if (error.code === 1) {
        // PERMISSION_DENIED
        errorMessage = "Location access denied. Please enable location services."
        permissionStatus = "denied"
      } else if (error.code === 2) {
        // POSITION_UNAVAILABLE
        errorMessage = "Location information is unavailable."
      } else if (error.code === 3) {
        // TIMEOUT
        errorMessage = "Location request timed out."
      }

      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
        permissionStatus,
      }))
    }
  }, [])

  // Clear location data
  const clearLocation = useCallback(() => {
    if (typeof window === "undefined") return;
    
    localStorage.removeItem("userLocation")
    setState((prev) => ({
      ...prev,
      location: null,
      error: null,
    }))
  }, [])

  // Set manual location (for fallback)
  const setManualLocation = useCallback((city: string, area = "") => {
    if (typeof window === "undefined") return;
    
    const locationData: LocationData = {
      latitude: 0,
      longitude: 0,
      city,
      area,
      fullAddress: area ? `${city}, ${area}` : city,
    }

    localStorage.setItem("userLocation", JSON.stringify(locationData))
    setState((prev) => ({ ...prev, location: locationData, error: null }))
  }, [])

  return {
    ...state,
    requestLocation,
    clearLocation,
    setManualLocation,
  }
}
