import puppeteer from "puppeteer";
import { handleLocationModal } from "./location-automation";

export async function fetchApollo247Prices(item: string, city: string, pincode: string) {
  console.log(`🚀 Apollo 24|7 scraper STARTED for "${item}" in ${city} (${pincode})`);
  
  console.log(`💊 Apollo 24|7: Starting search for "${item}" in ${city} (${pincode})`);
  
  const browser = await puppeteer.launch({ 
    headless: true,
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
      '--window-size=1920,1080',
      '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ]
  });
  
  const page = await browser.newPage();
  
  try {
    // Enhanced anti-detection measures
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Referer': 'https://www.google.com/'
    });
    
    // Block unnecessary resources
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });
    
    console.log("🌐 Apollo 24|7: Navigating to homepage...");
    await page.goto("https://www.apollo247.com/", { 
      waitUntil: "domcontentloaded",
      timeout: 30000 
    });
    
    // Wait a bit for the page to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Try to find and click the search box
    console.log("🔍 Apollo 24|7: Looking for search box...");
    try {
      // Try multiple selectors for search box
      const searchSelectors = [
        'input[type="search"]',
        'input[placeholder*="search"]',
        'input[placeholder*="Search"]',
        '.search-input',
        '#search',
        'input[name="q"]',
        'input[name="search"]'
      ];
      
      let searchBox = null;
      for (const selector of searchSelectors) {
        try {
          searchBox = await page.$(selector);
          if (searchBox) {
            console.log(`✅ Apollo 24|7: Found search box with selector: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      if (searchBox) {
        // Clear and type the search term
        await searchBox.click();
        await searchBox.type(item);
        await page.keyboard.press('Enter');
        
        // Wait for search results
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log("🔍 Apollo 24|7: Search submitted, waiting for results...");
      } else {
        console.log("⚠️ Apollo 24|7: No search box found, trying direct URL...");
        // Fallback: try direct search URL
        const searchUrl = `https://www.apollo247.com/search?q=${encodeURIComponent(item)}`;
        await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
      }
    } catch (error) {
      console.log("⚠️ Apollo 24|7: Search box interaction failed, trying direct URL...");
      const searchUrl = `https://www.apollo247.com/search?q=${encodeURIComponent(item)}`;
      await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
    }
    
    // Debug: Check page title and URL
    const pageTitle = await page.title();
    const currentUrl = page.url();
    console.log(`🔍 Apollo 24|7: Page title: "${pageTitle}"`);
    console.log(`🔍 Apollo 24|7: Current URL: "${currentUrl}"`);
    
    // Debug: Check page content
    const pageContent = await page.content();
    console.log(`🔍 Apollo 24|7: Page content length: ${pageContent.length} characters`);
    
    // Wait for products to load with better selectors
    console.log("⏳ Apollo 24|7: Waiting for products to load...");
    
    // Try to wait for any content to load
    try {
      await page.waitForFunction(() => {
        const selectors = [
          '[data-testid="product-card"]',
          '.product-card',
          '.search-result-item',
          '.ProductCard',
          '[class*="product"]',
          '[class*="Product"]',
          '.item',
          '.product',
          '.Product'
        ];
        return selectors.some(selector => document.querySelectorAll(selector).length > 0);
      }, { timeout: 15000 });
    } catch (error) {
      console.log("⚠️ Apollo 24|7: Timeout waiting for products, continuing anyway...");
    }
    
    // Additional wait for dynamic content
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const results = await page.evaluate(() => {
      console.log("🔍 Apollo 24|7: Evaluating page content...");
      const products: any[] = [];
      
      // Updated selectors based on current Apollo 24|7 structure
      const selectors = [
        '[data-testid="product-card"]',
        '.product-card',
        '.search-result-item',
        '.ProductCard',
        '[class*="product"]',
        '[class*="Product"]',
        '.item',
        '.product',
        '.Product'
      ];
      
      let productCards: Element[] = [];
      for (const selector of selectors) {
        productCards = Array.from(document.querySelectorAll(selector));
        if (productCards.length > 0) {
          console.log(`✅ Apollo 24|7: Found ${productCards.length} products with selector: ${selector}`);
          break;
        }
      }
      
      // If no product cards found, try looking for any product-like elements
      if (productCards.length === 0) {
        productCards = Array.from(document.querySelectorAll('[class*="product"], [class*="Product"], [class*="item"], [class*="card"]'));
        console.log(`🔍 Apollo 24|7: Fallback search found ${productCards.length} potential items`);
      }
      
      console.log(`📦 Apollo 24|7: Processing ${productCards.length} product cards`);
      
      productCards.slice(0, 5).forEach((card, index) => {
        try {
          // Updated selectors for product name
          const nameSelectors = [
            '[data-testid="product-name"]',
            '.product-name',
            '.ProductCard__name',
            '.name',
            'h3',
            'h4',
            '[class*="name"]',
            '[class*="title"]',
            'a[title]'
          ];
          
          let name = '';
          for (const selector of nameSelectors) {
            const element = card.querySelector(selector);
            if (element?.textContent) {
              name = element.textContent.trim();
              break;
            } else if (element?.getAttribute('title')) {
              name = element.getAttribute('title')?.trim() || '';
              break;
            }
          }
          
          // Updated selectors for price
          const priceSelectors = [
            '[data-testid="price"]',
            '.price',
            '.ProductCard__price',
            '.product-price',
            '[class*="price"]',
            '[class*="Price"]',
            '.amount'
          ];
          
          let price = '';
          for (const selector of priceSelectors) {
            const element = card.querySelector(selector);
            if (element?.textContent) {
              price = element.textContent.trim();
              break;
            }
          }
          
          // Updated selectors for image
          const imageSelectors = [
            '[data-testid="product-image"] img',
            '.ProductCard__image img',
            '.product-image img',
            'img[src*="product"]',
            'img'
          ];
          
          let image = '';
          for (const selector of imageSelectors) {
            const element = card.querySelector(selector) as HTMLImageElement;
            if (element?.src) {
              image = element.src;
              break;
            }
          }
          
          // Get product link
          let link = '';
          const linkElement = card.querySelector('a') || card.closest('a');
          if (linkElement) {
            link = (linkElement as HTMLAnchorElement).href;
          }
          
          if (name) {
            console.log(`✅ Apollo 24|7: Found product ${index + 1}: ${name} - ${price}`);
            products.push({
              platform: "Apollo 24|7",
              name: name,
              price: price || "Price not available",
              image: image || "",
              link: link || window.location.href,
              offer: "Check Apollo 24|7 for current offers"
            });
          } else {
            console.log(`⚠️ Apollo 24|7: Product ${index + 1} has no name`);
          }
        } catch (error) {
          console.log(`❌ Apollo 24|7: Error parsing product ${index}:`, error);
        }
      });
      
      console.log(`🎉 Apollo 24|7: Successfully extracted ${products.length} products`);
      return products;
    });
    
    console.log(`✅ Apollo 24|7: Scraping completed, found ${results.length} products`);
    await browser.close();
    return results;
    
  } catch (error) {
    console.error("❌ Apollo 24|7 scraping error:", error);
    await browser.close();
    return [];
  }
}