# Price Comparison Platform

A comprehensive price comparison platform that fetches real-time prices from multiple e-commerce platforms based on user location. The platform supports groceries, food delivery, and medicines across major Indian cities.

## 🚀 Features

### Real-Time Price Fetching
- **Live Scraping**: Real-time price data from major platforms
- **Location-Based**: Prices specific to user's city and pincode
- **Multi-Platform Support**: Covers groceries, food, and medicines
- **Fallback Mechanisms**: Intelligent fallback for unavailable locations

### Supported Platforms

#### 🛒 Groceries
- **Zepto** - Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune, Kolkata
- **Blinkit** - Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune, Kolkata, Noida, Gurgaon
- **BigBasket** - Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad, Jaipur
- **Swiggy Instamart** - Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune, Kolkata

#### 🍕 Food Delivery
- **Zomato** - Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad, Jaipur, Lucknow
- **Swiggy** - Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad, Jaipur, Lucknow
- **Magicpin** - Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune, Kolkata

#### 💊 Medicines
- **Tata 1mg** - Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad, Jaipur
- **Apollo 24|7** - Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad, Jaipur
- **PharmEasy** - Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad, Jaipur

### Location Intelligence
- **GPS Integration**: Automatic location detection
- **Reverse Geocoding**: Convert coordinates to city/pincode
- **IP Fallback**: Location detection when GPS unavailable
- **Platform Validation**: Check platform availability by location
- **Smart Fallbacks**: Nearby city suggestions for unavailable areas

## 🔥 Firebase Configuration

### Environment Variables (Recommended)
For production deployments, it's recommended to use environment variables instead of hardcoded values. Create a `.env.local` file in your project root:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here

# Firebase Emulator Settings (optional)
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=false
```

### Current Configuration
The platform is currently configured with the following Firebase services:
- **Authentication**: User login/signup
- **Firestore**: Database for user data, search history, preferences, and analytics
- **Realtime Database**: Real-time data synchronization and live updates
- **Storage**: File uploads and media storage

### Firestore Collections
The platform uses several Firestore collections for data management:
- **`userLocations`**: Store user location preferences
- **`userPreferences`**: User settings and preferences
- **`searchHistory`**: Track search queries for analytics
- **`platformAvailability`**: Cache platform availability by location
- **`priceComparisons`**: Store price comparison results

See [FIRESTORE_SCHEMA.md](./FIRESTORE_SCHEMA.md) for detailed schema documentation.

### Security Rules
Make sure to configure proper security rules in your Firebase console for:
- Firestore collections
- Realtime Database paths
- Storage buckets

## 🛠️ Technical Architecture

### Core Components

#### 1. Price Fetching Engine (`lib/fetchPrices.ts`)
```typescript
// Enhanced price fetching with location validation
export async function fetchPrices({
  item: string,
  category: string,
  location: string
}) {
  // Location validation
  // Platform availability check
  // Real-time scraping
  // Fallback mechanisms
}
```

#### 2. Location Management (`lib/location-client.ts`)
```typescript
// Location validation and formatting
export function validateLocation(location: UserLocation | null): boolean
export function getFormattedLocation(location: UserLocation | null): string
export function getSupportedPlatforms(location: UserLocation | null): string[]
```

#### 3. Search API (`app/api/search/route.ts`)
```typescript
// Enhanced search with metadata
GET /api/search?q={item}&category={category}&location={location}
```

#### 4. Platform Availability API (`app/api/location-platforms/route.ts`)
```typescript
// Check platform support for location
GET /api/location-platforms?city={city}&pincode={pincode}
```

#### 5. Firestore Utilities (`lib/firestore.ts`)
```typescript
// Enhanced Firestore operations
export const saveSearchHistory = async (userId: string, searchData: SearchData)
export const getUserPreferences = async (userId: string): Promise<UserPreferences>
export const savePlatformAvailability = async (location: string, availability: PlatformAvailability)
export const savePriceComparison = async (comparisonData: PriceComparisonData)
```

### Scraping Infrastructure

Each platform has dedicated scrapers with:
- **Puppeteer Integration**: Headless browser automation
- **Location Handling**: Automatic pincode input and validation
- **Error Handling**: Graceful fallbacks and retry mechanisms
- **Rate Limiting**: Respectful scraping practices

## 📱 User Experience

### Location Setup
1. **Automatic Detection**: GPS-based location detection
2. **Manual Input**: City and pincode entry
3. **IP Fallback**: Automatic location from IP address
4. **Validation**: Real-time location validation

### Search Process
1. **Category Selection**: Choose groceries, food, or medicines
2. **Item Search**: Enter product name or description
3. **Location Validation**: Confirm platform availability
4. **Real-Time Results**: Live price comparison across platforms

### Results Display
- **Price Comparison**: Side-by-side platform comparison
- **Total Cost**: Including delivery fees
- **Best Deals**: Highlighted cheapest options
- **Platform Status**: Availability and delivery times

## 🔧 Setup and Installation

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Modern browser with geolocation support

### Installation
```bash
# Clone repository
git clone <repository-url>
cd price-comparison-platform

# Install dependencies
npm install
# or
pnpm install

# Set environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

### Environment Variables
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# API Keys (if needed)
BIGDATA_CLOUD_API_KEY=
IPAPI_CO_KEY=
```

## 🚀 Usage Examples

### Basic Search
```typescript
// Search for groceries in Mumbai
const results = await fetchPrices({
  item: "milk",
  category: "groceries",
  location: "Mumbai (Andheri) - 400058"
});
```

### Location Validation
```typescript
import { validateLocation, getSupportedPlatforms } from '@/lib/location-client';

const location = { city: "Mumbai", pincode: "400058" };
if (validateLocation(location)) {
  const platforms = getSupportedPlatforms(location);
  console.log("Available platforms:", platforms);
}
```

### Platform Availability Check
```typescript
// Check which platforms support a location
const response = await fetch('/api/location-platforms?city=Mumbai&pincode=400058');
const { platformAvailability } = await response.json();
```

## 🔍 API Endpoints

### Search API
```
GET /api/search?q={item}&category={category}&location={location}
```

**Response:**
```json
{
  "results": [...],
  "metadata": {
    "query": "milk",
    "category": "groceries",
    "location": "Mumbai (Andheri) - 400058",
    "totalResults": 8,
    "searchTime": "2.3s",
    "platforms": ["Zepto", "Blinkit", "BigBasket"],
    "priceRange": {
      "min": 45,
      "max": 65,
      "average": 55
    }
  }
}
```

### Location Platforms API
```
GET /api/location-platforms?city={city}&pincode={pincode}
```

**Response:**
```json
{
  "location": {
    "city": "Mumbai",
    "pincode": "400058",
    "formatted": "Mumbai (400058)"
  },
  "platformAvailability": {
    "total": 9,
    "byCategory": {
      "groceries": ["Zepto", "Blinkit", "BigBasket", "Instamart"],
      "food": ["Zomato", "Swiggy", "Magicpin"],
      "medicines": ["1mg", "Apollo247", "PharmEasy"]
    }
  }
}
```

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Scraper tests
npm run test:scrapers
```

### Test Scrapers
```bash
# Test specific platform
npm run test:zepto
npm run test:blinkit
npm run test:bigbasket
```

## 🚨 Important Notes

### Rate Limiting
- Respect platform rate limits
- Implement delays between requests
- Use proxy rotation if needed

### Legal Compliance
- Check platform terms of service
- Implement robots.txt compliance
- Respect platform usage policies

### Error Handling
- Graceful fallbacks for failed scrapes
- User-friendly error messages
- Retry mechanisms for transient failures

## 🤝 Contributing

### Adding New Platforms
1. Create scraper in `utils/scrapers/`
2. Add platform to `PLATFORM_AVAILABILITY`
3. Update location validation
4. Add platform logos and branding

### Improving Scrapers
1. Enhance error handling
2. Add more robust selectors
3. Implement better location automation
4. Add data validation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review existing issues and solutions

## 🔮 Future Enhancements

- **AI-Powered Search**: Better product matching
- **Price History**: Track price changes over time
- **Alerts**: Price drop notifications
- **Mobile App**: Native mobile experience
- **More Platforms**: Expand to international markets
- **Analytics**: User behavior and platform performance insights 