import { NextResponse } from "next/server";
import { fetchPrices } from "@/lib/fetchPrices";
import { validateLocation } from "@/lib/location-client";
import { saveSearchHistory, savePriceComparison } from "@/lib/firestore";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const category = searchParams.get("category");
  const location = searchParams.get("location");

  if (!query || !category) {
    return NextResponse.json({ 
      error: "Missing query or category",
      message: "Please provide both search query and category"
    }, { status: 400 });
  }

  // Validate category
  const validCategories = ["groceries", "food", "medicines"];
  if (!validCategories.includes(category)) {
    return NextResponse.json({ 
      error: "Invalid category",
      message: `Category must be one of: ${validCategories.join(", ")}`,
      validCategories 
    }, { status: 400 });
  }

  // Enhanced location validation
  let validatedLocation = location;
  if (!location || location === "Unknown Location" || location.includes("Unknown")) {
    return NextResponse.json({ 
      error: "Invalid location",
      message: "Please provide a valid location to search for prices",
      suggestions: [
        "Enable location services in your browser",
        "Enter your city and pincode manually",
        "Try searching with a major city near you"
      ]
    }, { status: 400 });
  }

  try {
    console.log(`🔍 Search request: "${query}" in ${category} category for location: ${validatedLocation}`);
    
    const startTime = Date.now();
    const results = await fetchPrices({
      item: query,
      category: category,
      location: validatedLocation
    });
    const searchTime = Date.now() - startTime;

    console.log(`✅ Search completed in ${searchTime}ms, found ${results.length} results`);

    // Enhanced response with metadata
    const response = {
      results,
      metadata: {
        query,
        category,
        location: validatedLocation,
        totalResults: results.length,
        searchTime: `${searchTime}ms`,
        timestamp: new Date().toISOString(),
        platforms: results.map(r => r.platform),
        priceRange: results.length > 0 ? {
          min: Math.min(...results.map(r => r.price)),
          max: Math.max(...results.map(r => r.price)),
          average: Math.round(results.reduce((sum, r) => sum + r.price, 0) / results.length)
        } : null
      }
    };

    // Save search analytics to Firestore (non-blocking)
    // Extract user ID from request headers if available
    const userId = request.headers.get('x-user-id') || 'anonymous';
    
    if (userId !== 'anonymous') {
      // Save search history for authenticated users (non-blocking)
      saveSearchHistory(userId, {
        query,
        category,
        location: validatedLocation,
        resultsCount: results.length,
        searchTime
      }).catch(error => {
        console.warn("Failed to save search history:", error);
      });

      // Save price comparison data for analytics (non-blocking)
      if (results.length > 0) {
        savePriceComparison({
          query,
          category,
          location: validatedLocation,
          results: results.map(r => ({
            platform: r.platform,
            price: r.price,
            deliveryFee: r.deliveryFee || 0,
            totalPrice: r.totalPrice || r.price,
            availability: r.availability !== false
          })),
          searchTime
        }).catch(error => {
          console.warn("Failed to save price comparison:", error);
        });
      }
    }

    // If no results, provide helpful suggestions
    if (results.length === 0) {
      response.metadata.suggestions = [
        "Try a different search term",
        "Check if the item is available in your area",
        "Try searching in a nearby major city",
        "Verify your location is correct"
      ];
    }

    return NextResponse.json(response);
    
  } catch (error) {
    console.error("Search error:", error);
    
    // Provide more specific error messages
    let errorMessage = "Search failed";
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        errorMessage = "Search timed out. Please try again.";
        statusCode = 408;
      } else if (error.message.includes("network")) {
        errorMessage = "Network error. Please check your connection.";
        statusCode = 503;
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      message: "Unable to fetch prices at the moment. Please try again later.",
      retryAfter: 30 // seconds
    }, { status: statusCode });
  }
} 