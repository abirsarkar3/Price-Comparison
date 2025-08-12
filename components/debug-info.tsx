"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Info, AlertCircle, CheckCircle } from "lucide-react";

interface DebugInfoProps {
  query: string;
  category: string;
  location: string;
}

export function DebugInfo({ query, category, location }: DebugInfoProps) {
  const [debugData, setDebugData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDebugInfo = async () => {
    if (!query || !category || !location) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Check platform availability
      const [city, pincode] = location.split(' - ');
      const cleanCity = city.replace(/\([^)]*\)/g, '').trim();
      
      const platformResponse = await fetch(`/api/location-platforms?city=${encodeURIComponent(cleanCity)}&pincode=${pincode}`);
      const platformData = await platformResponse.ok ? await platformResponse.json() : null;
      
      // Check search status
      const searchResponse = await fetch(`/api/search?q=${encodeURIComponent(query)}&category=${category}&location=${encodeURIComponent(location)}`);
      const searchData = searchResponse.ok ? await searchResponse.json() : null;
      
      setDebugData({
        platformAvailability: platformData,
        searchResults: searchData,
        timestamp: new Date().toISOString()
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query && category && location) {
      fetchDebugInfo();
    }
  }, [query, category, location]);

  if (!query || !category || !location) {
    return null;
  }

  return (
    <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
          <Info className="h-5 w-5" />
          Debug Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-700 dark:text-blue-300">Last updated:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDebugInfo}
            disabled={loading}
            className="text-blue-600 border-blue-300 hover:bg-blue-100"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
          </div>
        )}

        {debugData && (
          <div className="space-y-3">
            {/* Platform Availability */}
            {debugData.platformAvailability && (
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Platform Availability</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600">Total Platforms:</span>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      {debugData.platformAvailability.platformAvailability.total}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(debugData.platformAvailability.platformAvailability.byCategory).map(([cat, platforms]: [string, any]) => (
                      <div key={cat} className="text-sm">
                        <span className="text-blue-600 capitalize">{cat}:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {platforms.map((platform: string) => (
                            <Badge key={platform} variant="secondary" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Search Results */}
            {debugData.searchResults && (
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Search Results</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600">Status:</span>
                    <Badge variant={debugData.searchResults.results?.length > 0 ? "default" : "secondary"}>
                      {debugData.searchResults.results?.length > 0 ? "Success" : "No Results"}
                    </Badge>
                  </div>
                  {debugData.searchResults.results?.length > 0 && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-600">Results:</span>
                        <Badge variant="outline">{debugData.searchResults.results.length}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-600">Search Time:</span>
                        <span className="text-sm text-blue-700">{debugData.searchResults.metadata?.searchTime}</span>
                      </div>
                    </>
                  )}
                  {debugData.searchResults.metadata?.suggestions && (
                    <div>
                      <span className="text-sm text-blue-600">Suggestions:</span>
                      <ul className="text-xs text-blue-700 mt-1 space-y-1">
                        {debugData.searchResults.metadata.suggestions.map((suggestion: string, index: number) => (
                          <li key={index}>• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timestamp */}
            <div className="text-xs text-blue-500 text-center pt-2 border-t border-blue-200 dark:border-blue-800">
              {new Date(debugData.timestamp).toLocaleTimeString()}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm">Fetching debug info...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 