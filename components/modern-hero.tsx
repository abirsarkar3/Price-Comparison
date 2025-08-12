"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaShoppingBasket, FaCapsules, FaUtensils, FaShoppingCart, FaStar, FaMapMarkerAlt, FaExclamationTriangle } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LocationDisplay from "@/components/location-display";
import LocationPermissionPrompt from "@/components/location-permission-prompt";
import { getLocationFromFirestore, getFallbackLocation, validateLocation, getFormattedLocation, getSupportedPlatforms, UserLocation } from "@/lib/location-client";

type Category = "groceries" | "food" | "medicines";

export function ModernHero() {
  const router = useRouter();
  const [item, setItem] = useState("");
  const [category, setCategory] = useState<Category>("groceries");
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [supportedPlatforms, setSupportedPlatforms] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        // Try to get saved location first
        let loc = await getLocationFromFirestore();
        
        // If no saved location, try fallback
        if (!loc || !validateLocation(loc)) {
          console.log("No valid saved location, trying fallback...");
          loc = await getFallbackLocation();
          if (loc && validateLocation(loc)) {
            await getLocationFromFirestore(); // Save fallback location
          }
        }
        
        setLocation(loc);
        
        // Get supported platforms for this location
        if (loc && validateLocation(loc)) {
          const platforms = getSupportedPlatforms(loc);
          setSupportedPlatforms(platforms);
          console.log("Supported platforms for location:", platforms);
        }
      } catch (error) {
        console.error("Error loading location:", error);
        setLocationError("Failed to load location. Please enable location services.");
      }
    })();
  }, []);

  const handleSearch = async () => {
    if (!item.trim() || isSearching) return;
    
    // Check if we have a valid location
    if (!location || !validateLocation(location)) {
      setLocationError("Please set a valid location to search for prices.");
      return;
    }
    
    setIsSearching(true);
    setLocationError(null);
    
    try {
      const locationStr = getFormattedLocation(location);
      
      await router.push(
        `/search?q=${encodeURIComponent(item.trim())}&category=${category}&location=${encodeURIComponent(locationStr)}`
      );
    } catch (error) {
      console.error("Navigation error:", error);
      setLocationError("Failed to start search. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLocationRefresh = async () => {
    try {
      setLocationError(null);
      const loc = await getLocationFromFirestore();
      if (loc && validateLocation(loc)) {
        setLocation(loc);
        const platforms = getSupportedPlatforms(loc);
        setSupportedPlatforms(platforms);
      } else {
        setLocationError("Location not available. Please enable location services.");
      }
    } catch (error) {
      setLocationError("Failed to refresh location.");
    }
  };

  const hasValidLocation = location && validateLocation(location);
  const canSearch = hasValidLocation && item.trim() && !isSearching;

  return (
    <section className="w-full bg-gradient-to-r from-[#1f1f1f] to-[#111] dark:from-[#1f1f1f] dark:to-[#111] py-20 px-6 sm:px-12 min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        <div className="text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white">
            Compare Prices, Save{" "}
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent animate-typing">
              Money
            </span>
            <span className="inline-block w-1 h-16 bg-gray-400 ml-2 animate-pulse"></span>
          </h1>
          
          <div className="flex items-center justify-center gap-4 text-gray-300 text-lg">
            <FaShoppingCart className="text-2xl" />
            <span>Compare & Save Instantly</span>
            <FaStar className="text-2xl" />
          </div>
          
          <p className="text-gray-300 max-w-3xl mx-auto text-xl leading-relaxed">
            Find the best deals across groceries, food delivery, and medicines from top platforms. 
            Our AI assistant helps you optimize your cart and save money effortlessly.
          </p>
        </div>

        {/* Category Selection */}
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => setCategory("groceries")}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 transition-all duration-300 ${
              category === "groceries"
                ? "bg-green-500/20 border-green-500 text-green-400 shadow-lg shadow-green-500/25"
                : "bg-white/5 border-gray-600 text-gray-300 hover:bg-white/10 hover:border-gray-500"
            }`}
          >
            <FaShoppingBasket className="text-xl" />
            <span className="font-medium">Groceries</span>
          </button>
          <button
            onClick={() => setCategory("food")}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 transition-all duration-300 ${
              category === "food"
                ? "bg-orange-500/20 border-orange-500 text-orange-400 shadow-lg shadow-orange-500/25"
                : "bg-white/5 border-gray-600 text-gray-300 hover:bg-white/10 hover:border-gray-500"
            }`}
          >
            <FaUtensils className="text-xl" />
            <span className="font-medium">Food</span>
          </button>
          <button
            onClick={() => setCategory("medicines")}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 transition-all duration-300 ${
              category === "medicines"
                ? "bg-blue-500/20 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/25"
                : "bg-white/5 border-gray-600 text-gray-300 hover:bg-white/10 hover:border-gray-500"
            }`}
          >
            <FaCapsules className="text-xl" />
            <span className="font-medium">Medicines</span>
          </button>
        </div>

        {/* Location Status */}
        <div className="text-center space-y-4">
          {locationError && (
            <Alert className="max-w-md mx-auto bg-red-900/20 border-red-500 text-red-200">
              <FaExclamationTriangle className="h-4 w-4" />
              <AlertDescription>{locationError}</AlertDescription>
            </Alert>
          )}
          
          {hasValidLocation && (
            <div className="flex items-center justify-center gap-2 text-green-400">
              <FaMapMarkerAlt className="text-lg" />
              <span className="font-medium">
                Searching in: {getFormattedLocation(location)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLocationRefresh}
                className="text-green-400 hover:text-green-300 hover:bg-green-500/20"
              >
                Refresh
              </Button>
            </div>
          )}
          
          {supportedPlatforms.length > 0 && (
            <div className="text-sm text-gray-400">
              Available platforms: {supportedPlatforms.slice(0, 5).join(", ")}
              {supportedPlatforms.length > 5 && ` +${supportedPlatforms.length - 5} more`}
            </div>
          )}
        </div>

        {/* Search Preview */}
        {item.trim() && hasValidLocation && (
          <div className="text-center mb-4">
            <p className="text-gray-400 text-sm">
              Searching for <span className="text-white font-medium">{item.trim()}</span> in{" "}
              <span className="text-white font-medium capitalize">{category}</span>
              <span> near <span className="text-white font-medium">{location.city}</span></span>
            </p>
          </div>
        )}

        {/* Search Input */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <div className="flex items-center bg-white/10 backdrop-blur-sm border border-gray-600 px-6 py-4 rounded-xl shadow-lg w-full max-w-2xl">
            {category === "groceries" && <FaShoppingBasket className="text-2xl text-green-400 mr-4" />}
            {category === "food" && <FaUtensils className="text-2xl text-orange-400 mr-4" />}
            {category === "medicines" && <FaCapsules className="text-2xl text-blue-400 mr-4" />}
            <Input
              placeholder={`Search for ${category}...`}
              value={item}
              onChange={(e) => setItem(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none focus:ring-0 w-full text-white placeholder:text-gray-400 text-lg"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!canSearch}
            className={`px-8 py-4 text-white rounded-xl font-medium text-lg shadow-lg transition-all duration-300 whitespace-nowrap ${
              canSearch
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl cursor-pointer' 
                : 'bg-gray-600 cursor-not-allowed opacity-50'
            }`}
          >
            {isSearching ? 'Searching...' : canSearch ? 'Compare Prices' : 'Set Location First'}
          </button>
        </div>

        {/* Location Section */}
        <div className="text-center space-y-6 mt-8">
          <LocationPermissionPrompt />
          <div className="mt-6">
            <LocationDisplay />
          </div>
        </div>
      </div>
    </section>
  );
}

