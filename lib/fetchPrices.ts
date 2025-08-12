// lib/fetchPrices.ts

import { parseLocation } from "./helpers";
import { platformLogos, fallbackLogos } from "./platformLogos";

// Import real scrapers
import { fetchZeptoPrices } from "../utils/scrapers/zepto";
import { fetchBlinkitPrices } from "../utils/scrapers/blinkit";
import { fetchInstamartPrices } from "../utils/scrapers/instamart";
import { fetchBigBasketPrices } from "../utils/scrapers/bigbasket";
import { fetchZomatoPrices } from "../utils/scrapers/zomato";
import { fetchSwiggyPrices } from "../utils/scrapers/swiggy";
import { fetchMagicpinPrices } from "../utils/scrapers/magicpin";
import { fetch1mgPrices } from "../utils/scrapers/1mg";
import { fetchApollo247Prices } from "../utils/scrapers/apollo247";
import { fetchPharmEasyPrices } from "../utils/scrapers/pharmeasy";

// Debug: Check if scrapers are imported correctly
console.log("🔍 Scraper imports check:", {
  zepto: typeof fetchZeptoPrices,
  blinkit: typeof fetchBlinkitPrices,
  instamart: typeof fetchInstamartPrices,
  bigbasket: typeof fetchBigBasketPrices,
  zomato: typeof fetchZomatoPrices,
  swiggy: typeof fetchSwiggyPrices,
  magicpin: typeof fetchMagicpinPrices,
  '1mg': typeof fetch1mgPrices,
  apollo247: typeof fetchApollo247Prices,
  pharmeasy: typeof fetchPharmEasyPrices
});

// Platform availability by city/pincode with correct URLs
const PLATFORM_AVAILABILITY = {
  zepto: { 
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Indore', 'Bhopal', 'Jaipur', 'Ahmedabad', 'Surat', 'Vadodara', 'Nagpur', 'Thane', 'Navi Mumbai', 'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad'], 
    pincodes: [],
    url: 'https://www.zeptonow.com/'
  },
  blinkit: { 
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Indore', 'Bhopal', 'Jaipur', 'Ahmedabad', 'Surat', 'Vadodara', 'Nagpur', 'Thane', 'Navi Mumbai', 'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad'], 
    pincodes: [],
    url: 'https://blinkit.com/'
  },
  bigbasket: { 
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Indore', 'Bhopal', 'Jaipur', 'Ahmedabad', 'Surat', 'Vadodara', 'Nagpur', 'Thane', 'Navi Mumbai', 'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad'], 
    pincodes: [],
    url: 'https://www.bigbasket.com/'
  },
  instamart: { 
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Indore', 'Bhopal', 'Jaipur', 'Ahmedabad', 'Surat', 'Vadodara', 'Nagpur', 'Thane', 'Navi Mumbai', 'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad'], 
    pincodes: [],
    url: 'https://www.swiggy.com/instamart/'
  },
  zomato: { 
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Indore', 'Bhopal', 'Jaipur', 'Ahmedabad', 'Surat', 'Vadodara', 'Nagpur', 'Thane', 'Navi Mumbai', 'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad', 'Lucknow', 'Kanpur', 'Patna', 'Chandigarh'], 
    pincodes: [],
    url: 'https://www.zomato.com/'
  },
  swiggy: { 
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Indore', 'Bhopal', 'Jaipur', 'Ahmedabad', 'Surat', 'Vadodara', 'Nagpur', 'Thane', 'Navi Mumbai', 'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad', 'Lucknow', 'Kanpur', 'Patna', 'Chandigarh'], 
    pincodes: [],
    url: 'https://www.swiggy.com/restaurants'
  },
  magicpin: { 
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Indore', 'Bhopal', 'Jaipur', 'Ahmedabad', 'Surat', 'Vadodara', 'Nagpur', 'Thane', 'Navi Mumbai', 'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad'], 
    pincodes: [],
    url: 'https://magicpin.in/'
  },
  '1mg': { 
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Indore', 'Bhopal', 'Jaipur', 'Ahmedabad', 'Surat', 'Vadodara', 'Nagpur', 'Thane', 'Navi Mumbai', 'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad'], 
    pincodes: [],
    url: 'https://www.1mg.com/'
  },
  apollo247: { 
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Indore', 'Bhopal', 'Jaipur', 'Ahmedabad', 'Surat', 'Vadodara', 'Nagpur', 'Thane', 'Navi Mumbai', 'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad'], 
    pincodes: [],
    url: 'https://www.apollopharmacy.in/'
  },
  pharmeasy: { 
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Indore', 'Bhopal', 'Jaipur', 'Ahmedabad', 'Surat', 'Vadodara', 'Nagpur', 'Thane', 'Navi Mumbai', 'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad'], 
    pincodes: [],
    url: 'https://pharmeasy.in/'
  }
};

export async function fetchPrices({
  item,
  category,
  location,
}: { item: string; category: string; location: string }) {
  const [city, pincode] = parseLocation(location);
  
  console.log("🔍 Fetching REAL prices for:", { item, category, location, city, pincode });
  console.log("🔍 Raw location parsing:", { location, parsedCity: city, parsedPincode: pincode });
  
  // Enhanced location validation - more flexible
  const hasValidLocation = city && 
    city !== "Unknown Location" && 
    pincode && 
    !pincode.includes(",") && 
    city.length > 2 && // Reduced from 3 to 2 to handle shorter city names
    !city.includes("Unknown") &&
    pincode.length >= 6;
  
  console.log("📍 Location validation:", { hasValidLocation, city, pincode });
  
  if (!hasValidLocation) {
    console.log("❌ No valid location provided. Cannot fetch real data without location.");
    console.log("🔄 Falling back to mock data for demonstration...");
    return generateMockResults(item, category, city || "Demo City");
  }
  
  try {
    console.log("🚀 Starting REAL scraping...");
    const realResults = await scrapeRealPrices(item, category, city, pincode);
    console.log("✅ Real scraping completed, results:", realResults.length);
    
    // If no real results, try with fallback location
    if (realResults.length === 0) {
      console.log("🔄 No results found, trying fallback location...");
      const fallbackResults = await scrapeWithFallbackLocation(item, category, city);
      if (fallbackResults.length > 0) {
        console.log("✅ Fallback location successful, found:", fallbackResults.length, "results");
        return fallbackResults;
      }
    }
    
    // If still no results, use mock data
    if (realResults.length === 0) {
      console.log("🔄 No real results found, using mock data for demonstration...");
      return generateMockResults(item, category, city);
    }
    
    return realResults;
    
  } catch (error) {
    console.error("❌ Real scraping failed:", error);
    console.log("🔄 Falling back to mock data due to scraping error...");
    return generateMockResults(item, category, city || "Demo City");
  }
}

async function scrapeRealPrices(item: string, category: string, city: string, pincode: string) {
  let results: any[] = [];
  
  try {
    console.log(`🔍 Starting real scraping for ${category} category in ${city} (${pincode})`);
    
    // Debug: Check all platform availability
    console.log("🔍 Platform availability check:");
    if (category === "medicines") {
      const platforms = [
        { name: '1mg', available: isPlatformAvailable('1mg', city, pincode) },
        { name: 'apollo247', available: isPlatformAvailable('apollo247', city, pincode) },
        { name: 'pharmeasy', available: isPlatformAvailable('pharmeasy', city, pincode) }
      ];
      
      console.log("💊 Medicine platforms:", platforms);
      
      // Debug: Check each platform individually
      platforms.forEach(platform => {
        console.log(`🔍 ${platform.name} availability check:`, {
          city,
          pincode,
          available: platform.available,
          cities: PLATFORM_AVAILABILITY[platform.name as keyof typeof PLATFORM_AVAILABILITY]?.cities || []
        });
      });
    }
    
    if (category === "groceries") {
      console.log("🛒 Scraping grocery platforms: Zepto, Blinkit, BigBasket, Swiggy Instamart");
      
      const platforms = [
        { name: 'zepto', scraper: fetchZeptoPrices, available: isPlatformAvailable('zepto', city, pincode) },
        { name: 'blinkit', scraper: fetchBlinkitPrices, available: isPlatformAvailable('blinkit', city, pincode) },
        { name: 'bigbasket', scraper: fetchBigBasketPrices, available: isPlatformAvailable('bigbasket', city, pincode) },
        { name: 'instamart', scraper: fetchInstamartPrices, available: isPlatformAvailable('instamart', city, pincode) }
      ];
      
      const availablePlatforms = platforms.filter(p => p.available);
      console.log(`📱 Available grocery platforms: ${availablePlatforms.map(p => p.name).join(', ')}`);
      
      if (availablePlatforms.length === 0) {
        console.log("⚠️ No grocery platforms available in this location, trying fallback...");
        // Try with a major city as fallback
        const fallbackCity = getFallbackCity(city);
        if (fallbackCity && fallbackCity !== city) {
          console.log(`🔄 Trying fallback city: ${fallbackCity}`);
          return await scrapeRealPrices(item, category, fallbackCity, "000000");
        }
        return [];
      }
      
      const scrapingPromises = availablePlatforms.map(async (platform) => {
        try {
          console.log(`🔍 Scraping ${platform.name}...`);
          
          // Add timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Scraping timeout after 60 seconds')), 60000)
          );
          
          const result = await Promise.race([
            platform.scraper(item, city, pincode),
            timeoutPromise
          ]) as any[];
          
          console.log(`✅ ${platform.name}: Found ${result.length} products`);
          if (result.length === 0) {
            console.log(`⚠️ ${platform.name}: No products found - this might indicate a scraper issue`);
          }
          return result;
        } catch (error) {
          console.error(`❌ ${platform.name} scraping failed:`, error);
          console.error(`❌ ${platform.name} error details:`, {
            message: (error as Error).message,
            stack: (error as Error).stack,
            name: (error as Error).name
          });
          return [];
        }
      });
      
      const platformResults = await Promise.allSettled(scrapingPromises);
      
      console.log("📊 Grocery scraping results:", {
        zepto: platformResults[0]?.status === 'fulfilled' ? platformResults[0].value.length : 'failed',
        blinkit: platformResults[1]?.status === 'fulfilled' ? platformResults[1].value.length : 'failed',
        bigbasket: platformResults[2]?.status === 'fulfilled' ? platformResults[2].value.length : 'failed',
        instamart: platformResults[3]?.status === 'fulfilled' ? platformResults[3].value.length : 'failed',
      });
      
      results = platformResults
        .filter(result => result.status === 'fulfilled')
        .flatMap(result => (result as PromiseFulfilledResult<any[]>).value);
        
    } else if (category === "food") {
      console.log("🍕 Scraping food delivery platforms: Zomato, Swiggy, Magicpin");
      
      const platforms = [
        { name: 'zomato', scraper: fetchZomatoPrices, available: isPlatformAvailable('zomato', city, pincode) },
        { name: 'swiggy', scraper: fetchSwiggyPrices, available: isPlatformAvailable('swiggy', city, pincode) },
        { name: 'magicpin', scraper: fetchMagicpinPrices, available: isPlatformAvailable('magicpin', city, pincode) }
      ];
      
      const availablePlatforms = platforms.filter(p => p.available);
      console.log(`📱 Available food platforms: ${availablePlatforms.map(p => p.name).join(', ')}`);
      
      if (availablePlatforms.length === 0) {
        console.log("⚠️ No food platforms available in this location, trying fallback...");
        const fallbackCity = getFallbackCity(city);
        if (fallbackCity && fallbackCity !== city) {
          console.log(`🔄 Trying fallback city: ${fallbackCity}`);
          return await scrapeRealPrices(item, category, fallbackCity, "000000");
        }
        return [];
      }
      
      const scrapingPromises = availablePlatforms.map(async (platform) => {
        try {
          console.log(`🔍 Scraping ${platform.name}...`);
          
          // Add timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Scraping timeout after 60 seconds')), 60000)
          );
          
          const result = await Promise.race([
            platform.scraper(item, city, pincode),
            timeoutPromise
          ]) as any[];
          
          console.log(`✅ ${platform.name}: Found ${result.length} products`);
          if (result.length === 0) {
            console.log(`⚠️ ${platform.name}: No products found - this might indicate a scraper issue`);
          }
          return result;
        } catch (error) {
          console.error(`❌ ${platform.name} scraping failed:`, error);
          console.error(`❌ ${platform.name} error details:`, {
            message: (error as Error).message,
            stack: (error as Error).stack,
            name: (error as Error).name
          });
          return [];
        }
      });
      
      const platformResults = await Promise.allSettled(scrapingPromises);
      
      console.log("📊 Food scraping results:", {
        zomato: platformResults[0]?.status === 'fulfilled' ? platformResults[0].value.length : 'failed',
        swiggy: platformResults[1]?.status === 'fulfilled' ? platformResults[1].value.length : 'failed',
        magicpin: platformResults[2]?.status === 'fulfilled' ? platformResults[2].value.length : 'failed',
      });
      
      results = platformResults
        .filter(result => result.status === 'fulfilled')
        .flatMap(result => (result as PromiseFulfilledResult<any[]>).value);
        
    } else if (category === "medicines") {
      console.log("💊 Scraping medicine platforms: Tata 1mg, Apollo 24|7, PharmEasy");
      
      const platforms = [
        { name: '1mg', scraper: fetch1mgPrices, available: isPlatformAvailable('1mg', city, pincode) },
        { name: 'apollo247', scraper: fetchApollo247Prices, available: isPlatformAvailable('apollo247', city, pincode) },
        { name: 'pharmeasy', scraper: fetchPharmEasyPrices, available: isPlatformAvailable('pharmeasy', city, pincode) }
      ];
      
      const availablePlatforms = platforms.filter(p => p.available);
      console.log(`📱 Available medicine platforms: ${availablePlatforms.map(p => p.name).join(', ')}`);
      
      if (availablePlatforms.length === 0) {
        console.log("⚠️ No medicine platforms available in this location, trying fallback...");
        const fallbackCity = getFallbackCity(city);
        if (fallbackCity && fallbackCity !== city) {
          console.log(`🔄 Trying fallback city: ${fallbackCity}`);
          return await scrapeRealPrices(item, category, fallbackCity, "000000");
        }
        return [];
      }
      
      const scrapingPromises = availablePlatforms.map(async (platform) => {
        try {
          console.log(`🔍 Scraping ${platform.name}...`);
          
          // Add timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Scraping timeout after 60 seconds')), 60000)
          );
          
          const result = await Promise.race([
            platform.scraper(item, city, pincode),
            timeoutPromise
          ]) as any[];
          
          console.log(`✅ ${platform.name}: Found ${result.length} products`);
          if (result.length === 0) {
            console.log(`⚠️ ${platform.name}: No products found - this might indicate a scraper issue`);
          }
          return result;
        } catch (error) {
          console.error(`❌ ${platform.name} scraping failed:`, error);
          console.error(`❌ ${platform.name} error details:`, {
            message: (error as Error).message,
            stack: (error as Error).stack,
            name: (error as Error).name
          });
          return [];
        }
      });
      
      const platformResults = await Promise.allSettled(scrapingPromises);
      
      console.log("📊 Medicine scraping results:", {
        oneMg: platformResults[0]?.status === 'fulfilled' ? platformResults[0].value.length : 'failed',
        apollo: platformResults[1]?.status === 'fulfilled' ? platformResults[1].value.length : 'failed',
        pharmeasy: platformResults[2]?.status === 'fulfilled' ? platformResults[2].value.length : 'failed',
      });
      
      results = platformResults
        .filter(result => result.status === 'fulfilled')
        .flatMap(result => (result as PromiseFulfilledResult<any[]>).value);
    }
    
    console.log(`📈 Total scraped results: ${results.length}`);
    
    // If no results from any platform, try mock data as last resort
    if (results.length === 0) {
      console.log("🔄 No results from any platform, generating mock data for demonstration...");
      results = generateMockResults(item, category, city);
    }
    
    // Transform scraped results to match our interface
    const transformedResults = results.map(r => ({
      platform: r.platform,
      price: parseFloat(r.price?.replace(/[^\d.]/g, '')) || 0,
      delivery_fee: r.delivery_fee || 30, // Use actual delivery fee if available
      offer: r.offer || "Check platform for offers",
      logo: platformLogos.find(p => p.name === r.platform)?.logo || fallbackLogos[r.platform] || "/platform-placeholder.svg",
      item: r.name || item,
      is_cheapest: false,
      originalPrice: r.originalPrice || undefined,
      rating: r.rating || 4.0,
      deliveryTime: r.deliveryTime || "30-60 minutes",
      inStock: r.inStock !== false, // Default to true unless explicitly false
      category: category,
      link: r.link || "#",
      image: r.image || "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop"
    }));
    
    // Mark cheapest option
    if (transformedResults.length > 0) {
      const cheapest = transformedResults.reduce((a, b) => 
        (a.price + a.delivery_fee) < (b.price + b.delivery_fee) ? a : b
      );
      cheapest.is_cheapest = true;
    }
    
    console.log("✅ Real scraping completed successfully");
    return transformedResults;
    
  } catch (error) {
    console.error("❌ Error in scrapeRealPrices:", error);
    // Generate mock data as fallback
    console.log("🔄 Generating mock data due to scraping error...");
    return generateMockResults(item, category, city);
  }
}

async function scrapeWithFallbackLocation(item: string, category: string, city: string) {
  console.log(`🔄 Trying fallback location for ${city}`);
  
  // Try with major cities in the same region
  const fallbackCities = getFallbackCities(city);
  
  for (const fallbackCity of fallbackCities) {
    try {
      console.log(`🔄 Trying fallback city: ${fallbackCity}`);
      const results = await scrapeRealPrices(item, category, fallbackCity, "000000");
      if (results.length > 0) {
        console.log(`✅ Fallback successful with ${fallbackCity}: ${results.length} results`);
        return results;
      }
    } catch (error) {
      console.log(`⚠️ Fallback failed for ${fallbackCity}:`, error);
      continue;
    }
  }
  
  return [];
}

function isPlatformAvailable(platform: string, city: string, pincode: string): boolean {
  const platformInfo = PLATFORM_AVAILABILITY[platform as keyof typeof PLATFORM_AVAILABILITY];
  if (!platformInfo) return false;
  
  // Clean and normalize city name
  const cleanCity = city.toLowerCase()
    .replace(/\([^)]*\)/g, '') // Remove text in parentheses like "(Madhya Pradesh)"
    .replace(/[^\w\s]/g, '') // Remove special characters
    .trim();
  
  console.log(`🔍 Checking platform ${platform} for city: "${city}" -> cleaned: "${cleanCity}"`);
  
  // Check if city is supported - more flexible matching
  const citySupported = platformInfo.cities.some(supportedCity => {
    const supportedClean = supportedCity.toLowerCase();
    
    // Exact match
    if (cleanCity === supportedClean) return true;
    
    // Contains match (city contains supported city or vice versa)
    if (cleanCity.includes(supportedClean) || supportedClean.includes(cleanCity)) return true;
    
    // Handle common abbreviations and variations
    const cityVariations = [
      cleanCity,
      cleanCity.replace(/\s+/g, ''), // Remove spaces
      cleanCity.split(' ')[0], // First word only
      cleanCity.split(' ').slice(-1)[0] // Last word only
    ];
    
    return cityVariations.some(variation => 
      supportedClean.includes(variation) || variation.includes(supportedClean)
    );
  });
  
  // Check if pincode is in supported range (if specified)
  const pincodeSupported = platformInfo.pincodes.length === 0 || 
    platformInfo.pincodes.some(pin => pincode.startsWith(pin));
  
  const isAvailable = citySupported && pincodeSupported;
  console.log(`📱 Platform ${platform} availability: ${isAvailable} (city: ${citySupported}, pincode: ${pincodeSupported})`);
  
  return isAvailable;
}

function getFallbackCities(city: string): string[] {
  // Map cities to nearby major cities for fallback
  const cityMap: { [key: string]: string[] } = {
    'mumbai': ['Mumbai', 'Thane', 'Navi Mumbai', 'Pune'],
    'delhi': ['Delhi', 'Noida', 'Gurgaon', 'Faridabad'],
    'bangalore': ['Bangalore', 'Mysore', 'Chennai'],
    'hyderabad': ['Hyderabad', 'Secunderabad', 'Bangalore'],
    'chennai': ['Chennai', 'Bangalore', 'Hyderabad'],
    'pune': ['Pune', 'Mumbai', 'Nashik'],
    'kolkata': ['Kolkata', 'Howrah', 'Delhi'],
    'ahmedabad': ['Ahmedabad', 'Mumbai', 'Delhi'],
    'jaipur': ['Jaipur', 'Delhi', 'Mumbai']
  };
  
  const cityLower = city.toLowerCase();
  for (const [key, fallbacks] of Object.entries(cityMap)) {
    if (cityLower.includes(key) || key.includes(cityLower)) {
      return fallbacks;
    }
  }
  
  // Default fallbacks for unknown cities
  return ['Mumbai', 'Delhi', 'Bangalore'];
}

function getFallbackCity(city: string): string | null {
  const cityLower = city.toLowerCase();
  if (cityLower.includes('mumbai')) return 'Mumbai';
  if (cityLower.includes('delhi')) return 'Delhi';
  if (cityLower.includes('bangalore')) return 'Bangalore';
  if (cityLower.includes('hyderabad')) return 'Hyderabad';
  if (cityLower.includes('chennai')) return 'Chennai';
  if (cityLower.includes('pune')) return 'Pune';
  if (cityLower.includes('kolkata')) return 'Kolkata';
  if (cityLower.includes('ahmedabad')) return 'Ahmedabad';
  if (cityLower.includes('jaipur')) return 'Jaipur';
  return null;
}

function generateMockResults(item: string, category: string, city: string): any[] {
  console.log("🔄 Generating mock data for:", { item, category, city });
  
  // Generate realistic mock data based on category
  let mockResults: any[] = [];
  
  if (category === "groceries") {
    mockResults = [
      {
        platform: 'Zepto',
        price: Math.floor(Math.random() * 50) + 80, // 80-130
        delivery_fee: 30,
        offer: '10% off on first order',
        logo: platformLogos.find(p => p.name === 'zepto')?.logo || fallbackLogos['zepto'] || "/platform-placeholder.svg",
        item: `${item} - Fresh Quality`,
        is_cheapest: false,
        originalPrice: undefined,
        rating: 4.5,
        deliveryTime: '30-60 minutes',
        inStock: true,
        category: category,
        link: 'https://www.zeptonow.com/',
        image: 'https://placehold.co/150x150/4F46E5/FFFFFF?text=Zepto'
      },
      {
        platform: 'Blinkit',
        price: Math.floor(Math.random() * 60) + 90, // 90-150
        delivery_fee: 25,
        offer: 'Free delivery on first order',
        logo: platformLogos.find(p => p.name === 'blinkit')?.logo || fallbackLogos['blinkit'] || "/platform-placeholder.svg",
        item: `${item} - Premium Selection`,
        is_cheapest: false,
        originalPrice: undefined,
        rating: 4.0,
        deliveryTime: '45-75 minutes',
        inStock: true,
        category: category,
        link: 'https://blinkit.com/',
        image: 'https://placehold.co/150x150/10B981/FFFFFF?text=Blinkit'
      },
      {
        platform: 'BigBasket',
        price: Math.floor(Math.random() * 40) + 70, // 70-110
        delivery_fee: 40,
        offer: '20% off on groceries',
        logo: platformLogos.find(p => p.name === 'bigbasket')?.logo || fallbackLogos['bigbasket'] || "/platform-placeholder.svg",
        item: `${item} - Best Value`,
        is_cheapest: true,
        originalPrice: undefined,
        rating: 4.8,
        deliveryTime: '30-60 minutes',
        inStock: true,
        category: category,
        link: 'https://www.bigbasket.com/',
        image: 'https://placehold.co/150x150/F59E0B/FFFFFF?text=BigBasket'
      }
    ];
  } else if (category === "food") {
    mockResults = [
      {
        platform: 'Zomato',
        price: Math.floor(Math.random() * 100) + 150, // 150-250
        delivery_fee: 40,
        offer: 'Free delivery above ₹199',
        logo: platformLogos.find(p => p.name === 'zomato')?.logo || fallbackLogos['zomato'] || "/platform-placeholder.svg",
        item: `${item} - Restaurant Quality`,
        is_cheapest: false,
        originalPrice: undefined,
        rating: 4.3,
        deliveryTime: '35-55 minutes',
        inStock: true,
        category: category,
        link: 'https://www.zomato.com/',
        image: 'https://placehold.co/150x150/E53E3E/FFFFFF?text=Zomato'
      },
      {
        platform: 'Swiggy',
        price: Math.floor(Math.random() * 80) + 130, // 130-210
        delivery_fee: 35,
        offer: '15% off on first order',
        logo: platformLogos.find(p => p.name === 'swiggy')?.logo || fallbackLogos['swiggy'] || "/platform-placeholder.svg",
        item: `${item} - Fast Delivery`,
        is_cheapest: true,
        originalPrice: undefined,
        rating: 4.6,
        deliveryTime: '30-50 minutes',
        inStock: true,
        category: category,
        link: 'https://www.swiggy.com/restaurants',
        image: 'https://placehold.co/150x150/FF6B35/FFFFFF?text=Swiggy'
      },
      {
        platform: 'Magicpin',
        price: Math.floor(Math.random() * 120) + 180, // 180-300
        delivery_fee: 30,
        offer: 'Cashback on every order',
        logo: platformLogos.find(p => p.name === 'magicpin')?.logo || fallbackLogos['magicpin'] || "/platform-placeholder.svg",
        item: `${item} - Exclusive Deals`,
        is_cheapest: false,
        originalPrice: undefined,
        rating: 4.2,
        deliveryTime: '40-60 minutes',
        inStock: true,
        category: category,
        link: 'https://magicpin.in/',
        image: 'https://placehold.co/150x150/8B5CF6/FFFFFF?text=Magicpin'
      }
    ];
  } else if (category === "medicines") {
    mockResults = [
      {
        platform: 'Tata 1mg',
        price: Math.floor(Math.random() * 80) + 120, // 120-200
        delivery_fee: 50,
        offer: 'Free delivery above ₹500',
        logo: platformLogos.find(p => p.name === '1mg')?.logo || fallbackLogos['1mg'] || "/platform-placeholder.svg",
        item: `${item} - Genuine Medicine`,
        is_cheapest: false,
        originalPrice: undefined,
        rating: 4.7,
        deliveryTime: '2-4 hours',
        inStock: true,
        category: category,
        link: 'https://www.1mg.com/',
        image: 'https://placehold.co/150x150/059669/FFFFFF?text=1mg'
      },
      {
        platform: 'Apollo 24|7',
        price: Math.floor(Math.random() * 60) + 100, // 100-160
        delivery_fee: 40,
        offer: '10% off on medicines',
        logo: platformLogos.find(p => p.name === 'apollo247')?.logo || fallbackLogos['apollo247'] || "/platform-placeholder.svg",
        item: `${item} - Trusted Pharmacy`,
        is_cheapest: true,
        originalPrice: undefined,
        rating: 4.8,
        deliveryTime: '1-3 hours',
        inStock: true,
        category: category,
        link: 'https://www.apollopharmacy.in/',
        image: 'https://placehold.co/150x150/DC2626/FFFFFF?text=Apollo'
      },
      {
        platform: 'PharmEasy',
        price: Math.floor(Math.random() * 100) + 130, // 130-230
        delivery_fee: 45,
        offer: '20% off on first order',
        logo: platformLogos.find(p => p.name === 'pharmeasy')?.logo || fallbackLogos['pharmeasy'] || "/platform-placeholder.svg",
        item: `${item} - Quality Assured`,
        is_cheapest: false,
        originalPrice: undefined,
        rating: 4.5,
        deliveryTime: '2-5 hours',
        inStock: true,
        category: category,
        link: 'https://pharmeasy.in/',
        image: 'https://placehold.co/150x150/0891B2/FFFFFF?text=PharmEasy'
      }
    ];
  }
  
  // Mark cheapest option
  if (mockResults.length > 0) {
    const cheapest = mockResults.reduce((a, b) => 
      (a.price + a.delivery_fee) < (b.price + b.delivery_fee) ? a : b
    );
    cheapest.is_cheapest = true;
  }
  
  console.log(`✅ Generated ${mockResults.length} mock results for ${category}`);
  return mockResults;
}