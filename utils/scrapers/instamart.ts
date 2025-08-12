import puppeteer from "puppeteer";
import { handleLocationModal } from "./location-automation";

export async function fetchInstamartPrices(item: string, city: string, pincode: string) {
  console.log(`🛒 Swiggy Instamart: Starting search for "${item}" in ${city} (${pincode})`);
  
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
      '--window-size=1920,1080'
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
      'Pragma': 'no-cache'
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
    
    console.log("🌐 Swiggy Instamart: Navigating to homepage...");
    await page.goto("https://www.swiggy.com/instamart", { 
      waitUntil: "domcontentloaded",
      timeout: 30000 
    });
    
    // Handle location modal if it appears
    try {
      console.log("📍 Swiggy Instamart: Handling location modal...");
      await handleLocationModal(page, pincode, "Swiggy Instamart");
    } catch (error) {
      console.log("⚠️ Swiggy Instamart: Location modal handling failed, continuing...");
    }
    
    // Navigate to search page - using the correct Swiggy Instamart search URL
    const searchUrl = `https://www.swiggy.com/instamart/search?query=${encodeURIComponent(item)}`;
    console.log(`🔍 Swiggy Instamart: Searching at ${searchUrl}`);
    await page.goto(searchUrl, { 
      waitUntil: "domcontentloaded",
      timeout: 30000 
    });
    
    // Wait for products to load with better selectors
    console.log("⏳ Swiggy Instamart: Waiting for products to load...");
    await page.waitForFunction(() => {
      const selectors = [
        '[data-testid="product-card"]',
        '.product-card',
        '.search-result-item',
        '.ProductCard',
        '[class*="product"]',
        '[class*="Product"]',
        '.item'
      ];
      return selectors.some(selector => document.querySelectorAll(selector).length > 0);
    }, { timeout: 15000 });
    
    // Additional wait for dynamic content
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const results = await page.evaluate(() => {
      console.log("🔍 Swiggy Instamart: Evaluating page content...");
      const products: any[] = [];
      
      // Updated selectors based on current Swiggy Instamart structure
      const selectors = [
        '[data-testid="product-card"]',
        '.product-card',
        '.search-result-item',
        '.ProductCard',
        '[class*="product"]',
        '[class*="Product"]',
        '.item'
      ];
      
      let productCards: Element[] = [];
      for (const selector of selectors) {
        productCards = Array.from(document.querySelectorAll(selector));
        if (productCards.length > 0) {
          console.log(`✅ Swiggy Instamart: Found ${productCards.length} products with selector: ${selector}`);
          break;
        }
      }
      
      // If no product cards found, try looking for any product-like elements
      if (productCards.length === 0) {
        productCards = Array.from(document.querySelectorAll('[class*="product"], [class*="Product"], [class*="item"], [class*="card"]'));
        console.log(`🔍 Swiggy Instamart: Fallback search found ${productCards.length} potential items`);
      }
      
      console.log(`📦 Swiggy Instamart: Processing ${productCards.length} product cards`);
      
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
            '[class*="title"]'
          ];
          
          let name = '';
          for (const selector of nameSelectors) {
            const element = card.querySelector(selector);
            if (element?.textContent) {
              name = element.textContent.trim();
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
            '[class*="Price"]'
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
            console.log(`✅ Swiggy Instamart: Found product ${index + 1}: ${name} - ${price}`);
            products.push({
              platform: "Swiggy Instamart",
              name: name,
              price: price || "Price not available",
              image: image || "",
              link: link || window.location.href,
              offer: "Check Swiggy Instamart for current offers"
            });
          } else {
            console.log(`⚠️ Swiggy Instamart: Product ${index + 1} has no name`);
          }
        } catch (error) {
          console.log(`❌ Swiggy Instamart: Error parsing product ${index}:`, error);
        }
      });
      
      console.log(`🎉 Swiggy Instamart: Successfully extracted ${products.length} products`);
      return products;
    });
    
    console.log(`✅ Swiggy Instamart: Scraping completed, found ${results.length} products`);
    await browser.close();
    return results;
    
  } catch (error) {
    console.error("❌ Swiggy Instamart scraping error:", error);
    await browser.close();
    return [];
  }
}