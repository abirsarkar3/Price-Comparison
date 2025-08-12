// Simple test script to test scrapers
const { fetch1mgPrices } = require('./utils/scrapers/1mg.ts');
const { fetchApollo247Prices } = require('./utils/scrapers/apollo247.ts');
const { fetchPharmEasyPrices } = require('./utils/scrapers/pharmeasy.ts');

async function testScrapers() {
  console.log('🧪 Testing scrapers...');
  
  try {
    // Test 1mg
    console.log('\n🔍 Testing 1mg scraper...');
    const results1mg = await fetch1mgPrices('vitamin c', 'Indore', '452001');
    console.log('1mg results:', results1mg.length);
    
    // Test Apollo 24|7
    console.log('\n🔍 Testing Apollo 24|7 scraper...');
    const resultsApollo = await fetchApollo247Prices('vitamin c', 'Indore', '452001');
    console.log('Apollo results:', resultsApollo.length);
    
    // Test PharmEasy
    console.log('\n🔍 Testing PharmEasy scraper...');
    const resultsPharmEasy = await fetchPharmEasyPrices('vitamin c', 'Indore', '452001');
    console.log('PharmEasy results:', resultsPharmEasy.length);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testScrapers();
