# Firestore Database Schema

This document outlines the Firestore collections and their structure for the Price Comparison Platform.

## 📊 Collections Overview

### 1. `userLocations`
Stores user location data for personalized experiences.

**Document ID**: `{userId}` (user's Firebase Auth UID)

**Fields**:
```typescript
{
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  lat?: number;
  lng?: number;
  updatedAt: string; // ISO timestamp
}
```

**Access**: Users can only read/write their own location data.

---

### 2. `userPreferences`
Stores user preferences and settings.

**Document ID**: `{userId}` (user's Firebase Auth UID)

**Fields**:
```typescript
{
  defaultCategory?: 'groceries' | 'food' | 'medicines';
  preferredPlatforms?: string[]; // Array of platform names
  notifications?: boolean;
  theme?: 'light' | 'dark' | 'system';
  updatedAt: string; // ISO timestamp
}
```

**Access**: Users can only read/write their own preferences.

---

### 3. `searchHistory`
Tracks user search queries for analytics and personalization.

**Document ID**: Auto-generated

**Fields**:
```typescript
{
  userId: string; // Firebase Auth UID
  query: string; // Search query
  category: string; // groceries, food, or medicines
  location: string; // User's location
  resultsCount: number; // Number of results found
  searchTime: number; // Search execution time in ms
  timestamp: Timestamp; // Server timestamp
}
```

**Access**: Users can only read/write their own search history.

---

### 4. `platformAvailability`
Stores platform availability data for different locations.

**Document ID**: `{city}_{pincode}` (e.g., "Mumbai_400058")

**Fields**:
```typescript
{
  city: string;
  pincode: string;
  platforms: {
    groceries: string[]; // Available grocery platforms
    food: string[]; // Available food delivery platforms
    medicines: string[]; // Available medicine platforms
  };
  lastUpdated: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}
```

**Access**: Public read, authenticated write.

---

### 5. `priceComparisons`
Stores price comparison results for analytics and caching.

**Document ID**: Auto-generated

**Fields**:
```typescript
{
  query: string; // Search query
  category: string; // groceries, food, or medicines
  location: string; // User's location
  results: Array<{
    platform: string; // Platform name
    price: number; // Base price
    deliveryFee?: number; // Delivery fee if applicable
    totalPrice: number; // Total price including delivery
    availability: boolean; // Product availability
  }>;
  searchTime: number; // Search execution time in ms
  timestamp: Timestamp; // Server timestamp
}
```

**Access**: Public read, authenticated create, no updates/deletions.

---

## 🔐 Security Rules

### Firestore Rules (`firestore.rules`)
- **User Data**: Users can only access their own data
- **Public Data**: Platform availability and price comparisons are publicly readable
- **Write Access**: Only authenticated users can create/update data
- **Data Integrity**: Price comparisons cannot be modified once created

### Realtime Database Rules (`database.rules.json`)
- **User Data**: Users can only access their own data
- **Public Data**: Platform availability and price comparisons are publicly readable
- **Write Access**: Only authenticated users can create/update data

---

## 📈 Data Usage Patterns

### Read Operations
- **Frequent**: Platform availability, user preferences
- **Moderate**: Search history, recent price comparisons
- **Rare**: User locations (only when location changes)

### Write Operations
- **Frequent**: Search history, price comparisons
- **Moderate**: User preferences, platform availability
- **Rare**: User locations

---

## 🚀 Performance Considerations

### Indexes
Create composite indexes for:
```typescript
// Search history queries
collection: 'searchHistory'
fields: ['userId', 'timestamp']

// Price comparisons queries
collection: 'priceComparisons'
fields: ['timestamp']
```

### Caching Strategy
- **Platform Availability**: Cache for 24 hours
- **Price Comparisons**: Cache for 1 hour
- **User Preferences**: Cache until user changes them
- **Search History**: No caching (real-time data)

---

## 🔄 Data Lifecycle

### Retention Policy
- **Search History**: Keep for 1 year
- **Price Comparisons**: Keep for 6 months
- **Platform Availability**: Keep indefinitely
- **User Data**: Keep until user account deletion

### Cleanup Jobs
- Run daily to remove expired search history
- Run weekly to remove expired price comparisons
- Monitor collection sizes and optimize as needed

---

## 📱 Integration Examples

### Save Search History
```typescript
import { saveSearchHistory } from '@/lib/firestore';

await saveSearchHistory(userId, {
  query: "milk",
  category: "groceries",
  location: "Mumbai (Andheri) - 400058",
  resultsCount: 8,
  searchTime: 2300
});
```

### Get User Preferences
```typescript
import { getUserPreferences } from '@/lib/firestore';

const prefs = await getUserPreferences(userId);
if (prefs?.defaultCategory) {
  // Use default category
}
```

### Save Platform Availability
```typescript
import { savePlatformAvailability } from '@/lib/firestore';

await savePlatformAvailability("Mumbai_400058", {
  city: "Mumbai",
  pincode: "400058",
  platforms: {
    groceries: ["Zepto", "Blinkit", "BigBasket"],
    food: ["Zomato", "Swiggy"],
    medicines: ["1mg", "Apollo247"]
  },
  lastUpdated: new Date().toISOString()
});
```

---

## 🛠️ Development Setup

### Local Development
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Use emulators: Set `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true`

### Production Deployment
1. Deploy rules: `firebase deploy --only firestore:rules`
2. Deploy database rules: `firebase deploy --only database`
3. Verify security rules are active

---

## 📊 Monitoring & Analytics

### Key Metrics
- **Collection Sizes**: Monitor document counts
- **Read/Write Operations**: Track usage patterns
- **Query Performance**: Monitor slow queries
- **Security Violations**: Track rule violations

### Alerts
- Set up alerts for unusual data growth
- Monitor authentication failures
- Track rule violation attempts

