#!/usr/bin/env node

/**
 * Test script for enhanced price comparison platform
 * Demonstrates location-based price fetching and platform availability
 */

const BASE_URL = 'http://localhost:3000';

// Test data
const testCases = [
  {
    name: "Mumbai Groceries",
    item: "milk",
    category: "groceries",
    city: "Mumbai",
    pincode: "400001"
  },
  {
    name: "Delhi Food",
    item: "pizza",
    category: "food",
    city: "Delhi",
    pincode: "110001"
  },
  {
    name: "Bangalore Medicines",
    item: "paracetamol",
    category: "medicines",
    city: "Bangalore",
    pincode: "560001"
  },
  {
    name: "Chennai Groceries",
    item: "bread",
    category: "groceries",
    city: "Chennai",
    pincode: "600001"
  }
];

async function testLocationPlatforms(city, pincode) {
  try {
    console.log(`\n🔍 Testing platform availability for ${city} (${pincode})`);
    
    const response = await fetch(`${BASE_URL}/api/location-platforms?city=${encodeURIComponent(city)}&pincode=${pincode}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log(`✅ Location: ${data.location.formatted}`);
    console.log(`📱 Total platforms: ${data.platformAvailability.total}`);
    
    Object.entries(data.platformAvailability.byCategory).forEach(([category, platforms]) => {
      if (platforms.length > 0) {
        console.log(`  ${getCategoryIcon(category)} ${category}: ${platforms.join(', ')}`);
      }
    });
    
    return data;
  } catch (error) {
    console.error(`❌ Failed to test platform availability:`, error.message);
    return null;
  }
}

async function testSearch(item, category, city, pincode) {
  try {
    const location = `${city} (${pincode})`;
    console.log(`\n🔍 Testing search: "${item}" in ${category} for ${location}`);
    
    const response = await fetch(`${BASE_URL}/api/search?q=${encodeURIComponent(item)}&category=${category}&location=${encodeURIComponent(location)}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log(`✅ Search completed in ${data.metadata.searchTime}`);
    console.log(`📊 Found ${data.results.length} results`);
    
    if (data.results.length > 0) {
      console.log(`💰 Price range: ₹${data.metadata.priceRange.min} - ₹${data.metadata.priceRange.max}`);
      console.log(`📱 Platforms: ${data.metadata.platforms.join(', ')}`);
      
      // Show top 3 results
      data.results.slice(0, 3).forEach((result, index) => {
        const total = result.price + result.delivery_fee;
        const badge = result.is_cheapest ? '🏆 BEST' : '';
        console.log(`  ${index + 1}. ${result.platform}: ₹${result.price} + ₹${result.delivery_fee} = ₹${total} ${badge}`);
      });
    } else {
      console.log(`⚠️ No results found. Suggestions:`);
      data.metadata.suggestions?.forEach(suggestion => {
        console.log(`  • ${suggestion}`);
      });
    }
    
    return data;
  } catch (error) {
    console.error(`❌ Search failed:`, error.message);
    return null;
  }
}

function getCategoryIcon(category) {
  const icons = {
    groceries: '🛒',
    food: '🍕',
    medicines: '💊'
  };
  return icons[category] || '📱';
}

async function runTests() {
  console.log('🚀 Testing Enhanced Price Comparison Platform\n');
  console.log('=' .repeat(60));
  
  for (const testCase of testCases) {
    console.log(`\n🧪 Test Case: ${testCase.name}`);
    console.log('-'.repeat(40));
    
    // Test platform availability
    const platformData = await testLocationPlatforms(testCase.city, testCase.pincode);
    
    if (platformData) {
      // Test search functionality
      await testSearch(testCase.item, testCase.category, testCase.city, testCase.pincode);
    }
    
    // Add delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ All tests completed!');
}

// Error handling for fetch (Node.js compatibility)
if (typeof fetch === 'undefined') {
  console.log('📦 Installing fetch for Node.js...');
  const { default: fetch } = await import('node-fetch');
  globalThis.fetch = fetch;
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
}); 