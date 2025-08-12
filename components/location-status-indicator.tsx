"use client";

import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaShoppingBasket, FaUtensils, FaCapsules } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getSupportedPlatforms, UserLocation } from "@/lib/location-client";

interface LocationStatusIndicatorProps {
  location: string;
  hasValidLocation: boolean;
}

export function LocationStatusIndicator({ location, hasValidLocation }: LocationStatusIndicatorProps) {
  const [supportedPlatforms, setSupportedPlatforms] = useState<string[]>([]);
  const [parsedLocation, setParsedLocation] = useState<UserLocation | null>(null);

  useEffect(() => {
    // Parse location string to extract city and pincode
    if (location && hasValidLocation) {
      try {
        // Extract city and pincode from location string like "Mumbai (Andheri) - 400058"
        const match = location.match(/^([^(]+)\s*(?:\(([^)]+)\))?\s*-\s*(\d+)$/);
        if (match) {
          const [, city, area, pincode] = match;
          const loc: UserLocation = {
            city: city.trim(),
            pincode: pincode.trim(),
            area: area?.trim() || ""
          };
          setParsedLocation(loc);
          
          // Get supported platforms for this location
          const platforms = getSupportedPlatforms(loc);
          setSupportedPlatforms(platforms);
        }
      } catch (error) {
        console.error("Error parsing location:", error);
      }
    }
  }, [location, hasValidLocation]);

  if (!hasValidLocation) {
    return (
      <div className="flex items-center justify-center gap-2 text-amber-500 bg-amber-500/10 px-4 py-2 rounded-lg border border-amber-500/20">
        <FaExclamationTriangle className="h-4 w-4" />
        <span className="text-sm font-medium">Location not set</span>
      </div>
    );
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'zepto':
      case 'blinkit':
      case 'bigbasket':
      case 'instamart':
        return <FaShoppingBasket className="h-3 w-3" />;
      case 'zomato':
      case 'swiggy':
      case 'magicpin':
        return <FaUtensils className="h-3 w-3" />;
      case '1mg':
      case 'apollo247':
      case 'pharmeasy':
        return <FaCapsules className="h-3 w-3" />;
      default:
        return <FaInfoCircle className="h-3 w-3" />;
    }
  };

  const getPlatformCategory = (platform: string) => {
    const groceryPlatforms = ['zepto', 'blinkit', 'bigbasket', 'instamart'];
    const foodPlatforms = ['zomato', 'swiggy', 'magicpin'];
    const medicinePlatforms = ['1mg', 'apollo247', 'pharmeasy'];
    
    if (groceryPlatforms.includes(platform.toLowerCase())) return 'groceries';
    if (foodPlatforms.includes(platform.toLowerCase())) return 'food';
    if (medicinePlatforms.includes(platform.toLowerCase())) return 'medicines';
    return 'other';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'groceries': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'food': return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
      case 'medicines': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-4">
      {/* Location Status */}
      <div className="flex items-center justify-center gap-2 text-green-500 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">
        <FaMapMarkerAlt className="h-4 w-4" />
        <span className="text-sm font-medium">Searching in: {location}</span>
        <FaCheckCircle className="h-4 w-4" />
      </div>

      {/* Platform Availability */}
      {supportedPlatforms.length > 0 && (
        <Card className="bg-white/5 border-gray-600/30">
          <CardContent className="p-4">
            <div className="text-center mb-3">
              <h4 className="text-sm font-medium text-gray-300 mb-2">
                Available Platforms in Your Area
              </h4>
              <p className="text-xs text-gray-400">
                {supportedPlatforms.length} platforms support your location
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {supportedPlatforms.map((platform) => {
                const category = getPlatformCategory(platform);
                const colorClass = getCategoryColor(category);
                
                return (
                  <Badge 
                    key={platform}
                    variant="outline"
                    className={`${colorClass} border text-xs px-2 py-1 flex items-center gap-1 justify-center`}
                  >
                    {getPlatformIcon(platform)}
                    <span className="capitalize">{platform}</span>
                  </Badge>
                );
              })}
            </div>
            
            <div className="mt-3 text-center">
              <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <FaShoppingBasket className="h-3 w-3 text-green-400" />
                  <span>Groceries</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaUtensils className="h-3 w-3 text-orange-400" />
                  <span>Food</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaCapsules className="h-3 w-3 text-blue-400" />
                  <span>Medicines</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Location Details */}
      {parsedLocation && (
        <div className="text-center text-xs text-gray-400 space-y-1">
          <p>City: {parsedLocation.city}</p>
          {parsedLocation.area && <p>Area: {parsedLocation.area}</p>}
          <p>Pincode: {parsedLocation.pincode}</p>
        </div>
      )}
    </div>
  );
} 