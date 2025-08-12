"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Star, Clock, Truck, Tag, ExternalLink, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingSearches } from "@/components/trending-searches";
import { LocationStatusIndicator } from "@/components/location-status-indicator";
import { DebugInfo } from "@/components/debug-info";
import { useToast } from "@/hooks/use-toast";

type PlatformPrice = {
  platform: string;
  price: number;
  delivery_fee: number;
  offer?: string;
  logo: string;
  link: string;
  item: string;
  originalPrice?: number;
  rating?: number;
  deliveryTime?: string;
  inStock: boolean;
  category: string;
  image: string;
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const location = searchParams.get("location") || "";
  const { toast } = useToast();

  const [data, setData] = useState<PlatformPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrices() {
      try {
        console.log("🔍 Starting price fetch for:", { query, category, location });
        setLoading(true);
        
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&category=${category}&location=${encodeURIComponent(location)}`
        );
        
        console.log("📡 Search API response status:", res.status);
        
        if (!res.ok) {
          const errorData = await res.json();
          console.error("❌ Search API error:", errorData);
          throw new Error(errorData.message || `HTTP ${res.status}`);
        }
        
        const json = await res.json();
        console.log("✅ Search API response:", json);
        
        setData(json.results || []);
        
        // Save search to history
        const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        const newSearch = {
          query: query,
          category: category,
          location: location,
          date: new Date().toISOString(),
          resultsCount: json.results?.length || 0
        };
        
        // Remove duplicate searches and add new one at the beginning
        const filteredHistory = searchHistory.filter((item: any) => 
          !(item.query === query && item.category === category && item.location === location)
        );
        filteredHistory.unshift(newSearch);
        
        // Keep only last 20 searches
        if (filteredHistory.length > 20) {
          filteredHistory.splice(20);
        }
        
        localStorage.setItem('searchHistory', JSON.stringify(filteredHistory));
      } catch (err) {
        console.error("❌ Price fetch error:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    
    if (query && category && location) {
      fetchPrices();
    }
  }, [query, category, location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-3/4 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const cheapest = data.length > 0
    ? data.reduce((a, b) => (a.price + a.delivery_fee) < (b.price + b.delivery_fee) ? a : b)
    : null;

  // Check if we have a valid location (not just coordinates)
  const hasValidLocation = Boolean(location && 
    location !== "Unknown Location" && 
    !location.includes(",") && 
    location.length > 3);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getDiscountPercentage = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Search Results for{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                "{query}"
              </span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {data.length} results found in {category} • {location}
            </p>
            
                      {/* Location Status Indicator */}
          <LocationStatusIndicator location={location} hasValidLocation={hasValidLocation} />
          
          {/* Debug Information */}
          <div className="mt-6">
            <DebugInfo query={query} category={category} location={location} />
          </div>
        </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item, index) => {
              const total = item.price + item.delivery_fee;
              const isCheapest = cheapest && item.platform === cheapest.platform;
              const discount = item.originalPrice ? getDiscountPercentage(item.originalPrice, item.price) : 0;

              return (
                <Card 
                  key={`${item.platform}-${index}`}
                  className={`overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    isCheapest 
                      ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' 
                      : 'hover:ring-2 hover:ring-blue-500'
                  }`}
                >
                  {/* Platform Header */}
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-lg bg-white dark:bg-slate-800 p-2 flex items-center justify-center">
                          <img 
                            src={item.logo} 
                            alt={item.platform} 
                            className="h-8 w-8 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/platform-placeholder.svg";
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                            {item.platform}
                          </h3>
                          {item.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-slate-600 dark:text-slate-400">
                                {item.rating}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      {isCheapest && (
                        <Badge className="bg-green-500 text-white">
                          Best Price
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Product Image */}
                    <div className="relative">
                      <img 
                        src={item.image} 
                        alt={item.item}
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=200&fit=crop";
                        }}
                      />
                      {discount > 0 && (
                        <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                          {discount}% OFF
                        </Badge>
                      )}
                    </div>

                    {/* Product Details */}
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 line-clamp-2 mb-2">
                        {item.item}
                      </h4>
                      
                      {/* Price Information */}
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            {formatPrice(item.price)}
                          </span>
                          {item.originalPrice && (
                            <span className="text-sm text-slate-500 line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center space-x-1">
                            <Truck className="h-3 w-3" />
                            <span>{formatPrice(item.delivery_fee)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{item.deliveryTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* Total Price */}
                      <div className="mt-3 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            Total:
                          </span>
                          <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            {formatPrice(total)}
                          </span>
                        </div>
                      </div>

                      {/* Offer */}
                      {item.offer && (
                        <div className="flex items-center space-x-1 text-sm text-green-600 dark:text-green-400">
                          <Tag className="h-3 w-3" />
                          <span>{item.offer}</span>
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="flex gap-2 mt-4">
                        <Button 
                          className="flex-1"
                          variant={isCheapest ? "default" : "outline"}
                          onClick={() => window.open(item.link, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Shop on {item.platform}
                        </Button>
                        <Button 
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const savedItems = JSON.parse(localStorage.getItem('savedItems') || '[]');
                            const newItem = {
                              id: Date.now().toString(),
                              name: item.item,
                              platform: item.platform,
                              price: item.price,
                              image: item.image,
                              link: item.link,
                              date: new Date().toISOString()
                            };
                            savedItems.push(newItem);
                            localStorage.setItem('savedItems', JSON.stringify(savedItems));
                            
                            toast({
                              title: "Item Saved!",
                              description: `${item.item} has been saved to your profile.`,
                            });
                          }}
                          className="bg-green-50 hover:bg-green-100 text-green-600 border-green-200 hover:border-green-300"
                          title="Save to Profile"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            // Add to cart functionality
                            const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
                            const newCartItem = {
                              item: item.item,
                              platform: item.platform,
                              price: item.price,
                              delivery_fee: item.delivery_fee,
                              offer: item.offer,
                              logo: item.logo,
                              quantity: 1
                            };
                            cartItems.push(newCartItem);
                            localStorage.setItem('cart', JSON.stringify(cartItems));
                            
                            toast({
                              title: "Added to Cart!",
                              description: `${item.item} has been added to your cart.`,
                            });
                          }}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200 hover:border-blue-300"
                          title="Add to Cart"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* No Results */}
          {data.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                No real-time data available
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                We couldn't fetch real-time prices from the platforms for "{query}" in {location}.
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Possible reasons:</strong>
                </p>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-2 space-y-1">
                  <li>• The item might not be available in your area</li>
                  <li>• Platform websites might be temporarily unavailable</li>
                  <li>• Location might not be supported by all platforms</li>
                  <li>• Try a different search term or category</li>
                </ul>
              </div>
              <TrendingSearches category={category} location={location} />
            </div>
          )}

          {/* Trending Searches */}
          {data.length > 0 && (
            <div className="mt-12">
              <TrendingSearches category={category} location={location} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
