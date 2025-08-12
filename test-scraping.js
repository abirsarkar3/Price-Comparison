#!/usr/bin/env node

/**
 * Simple test script to verify scraping functionality
 */

const BASE_URL = 'http://localhost:3000';

async function testScraping() {
  console.log('🧪 Testing Scraping Functionality\n');
  
  try {
    // Test 1: Check platform availability for Indore
    console.log('1️⃣ Testing platform availability for Indore...');
    const platformResponse = await fetch(`${BASE_URL}/api/location-platforms?city=Indore&pincode=452001`);
    
    if (platformResponse.ok) {
      const platformData = await platformResponse.json();
      console.log('✅ Platform availability:', platformData.platformAvailability.total, 'platforms');
      console.log('📱 Available platforms:', platformData.platformAvailability.all.join(', '));
    } else {
      console.log('❌ Platform availability check failed');
    }
    
    // Test 2: Test search for chicken in groceries
    console.log('\n2️⃣ Testing search for "chicken" in groceries...');
    const searchResponse = await fetch(`${BASE_URL}/api/search?q=chicken&category=groceries&location=Indore%20(Madhya%20Pradesh)%20-%20452001`);
    
    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      console.log('✅ Search successful!');
      console.log('📊 Results found:', searchData.results.length);
      console.log('⏱️ Search time:', searchData.metadata.searchTime);
      
      if (searchData.results.length > 0) {
        console.log('💰 Price range:', `₹${searchData.metadata.priceRange.min} - ₹${searchData.metadata.priceRange.max}`);
        console.log('🏆 Cheapest option:', searchData.results.find(r => r.is_cheapest)?.platform);
      }
    } else {
      const errorData = await searchResponse.json();
      console.log('❌ Search failed:', errorData.message);
    }
    
    // Test 3: Test with a supported city (Mumbai)
    console.log('\n3️⃣ Testing with supported city (Mumbai)...');
    const mumbaiResponse = await fetch(`${BASE_URL}/api/search?q=milk&category=groceries&location=Mumbai%20-%20400001`);
    
    if (mumbaiResponse.ok) {
      const mumbaiData = await mumbaiResponse.json();
      console.log('✅ Mumbai search successful!');
      console.log('📊 Results found:', mumbaiData.results.length);
    } else {
      const errorData = await mumbaiResponse.json();
      console.log('❌ Mumbai search failed:', errorData.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
  
  console.log('\n✅ Test completed!');
}

// Run test
testScraping(); 