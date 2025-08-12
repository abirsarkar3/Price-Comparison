const puppeteer = require('puppeteer');

async function testZeptoScraper() {
  console.log('🧪 Testing Zepto scraper...');
  
  try {
    const browser = await puppeteer.launch({ 
      headless: false, // Set to false to see what's happening
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--window-size=1920,1080'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('🌐 Navigating to Zepto...');
    await page.goto('https://www.zepto.in/', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    console.log('✅ Zepto homepage loaded');
    
    // Wait a bit to see the page
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Try to search for something
    console.log('🔍 Searching for "milk"...');
    await page.goto('https://www.zepto.in/search?q=milk', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    console.log('✅ Search page loaded');
    
    // Wait for products
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check if products are visible
    const productCount = await page.evaluate(() => {
      const selectors = [
        '[data-testid="product-card"]',
        '.product-card',
        '.search-result-item',
        '.ProductCard',
        '[class*="product"]',
        '[class*="Product"]',
        '.item'
      ];
      
      let count = 0;
      selectors.forEach(selector => {
        count += document.querySelectorAll(selector).length;
      });
      
      return count;
    });
    
    console.log('📊 Products found:', productCount);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'zepto-debug.png', fullPage: true });
    console.log('📸 Screenshot saved as zepto-debug.png');
    
    await browser.close();
    console.log('✅ Zepto test completed');
    
  } catch (error) {
    console.error('❌ Zepto test failed:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
  }
}

testZeptoScraper();
