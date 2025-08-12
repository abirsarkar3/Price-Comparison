import puppeteer from "puppeteer";
import { handleLocationModal } from "./location-automation";

export async function fetchZomatoPrices(item: string, city: string, pincode: string) {
  console.log(`🍕 Zomato: Starting search for "${item}" in ${city} (${pincode})`);
  
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
    
    console.log("🌐 Zomato: Navigating to homepage...");
    await page.goto("https://www.zomato.com/", { 
      waitUntil: "domcontentloaded",
      timeout: 30000 
    });
    
    // Handle location modal if it appears
    try {
      console.log("📍 Zomato: Handling location modal...");
      await handleLocationModal(page, pincode, "Zomato");
    } catch (error) {
      console.log("⚠️ Zomato: Location modal handling failed, continuing...");
    }
    
    // Navigate to search page - using the correct Zomato search URL
    const searchUrl = `https://www.zomato.com/search?q=${encodeURIComponent(item)}`;
    console.log(`🔍 Zomato: Searching at ${searchUrl}`);
    await page.goto(searchUrl, { 
      waitUntil: "domcontentloaded",
      timeout: 30000 
    });
    
    // Wait for products to load with better selectors
    console.log("⏳ Zomato: Waiting for products to load...");
    await page.waitForFunction(() => {
      const selectors = [
        '[data-testid="restaurant-card"]',
        '.restaurant-card',
        '.search-result-item',
        '.RestaurantCard',
        '[class*="restaurant"]',
        '[class*="Restaurant"]',
        '.item'
      ];
      return selectors.some(selector => document.querySelectorAll(selector).length > 0);
    }, { timeout: 15000 });
    
    // Additional wait for dynamic content
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const results = await page.evaluate(() => {
      console.log("🔍 Zomato: Evaluating page content...");
      const products: any[] = [];
      
      // Updated selectors based on current Zomato structure
      const selectors = [
        '[data-testid="restaurant-card"]',
        '.restaurant-card',
        '.search-result-item',
        '.RestaurantCard',
        '[class*="restaurant"]',
        '[class*="Restaurant"]',
        '.item'
      ];
      
      let restaurantCards: Element[] = [];
      for (const selector of selectors) {
        restaurantCards = Array.from(document.querySelectorAll(selector));
        if (restaurantCards.length > 0) {
          console.log(`✅ Zomato: Found ${restaurantCards.length} restaurants with selector: ${selector}`);
          break;
        }
      }
      
      // If no restaurant cards found, try looking for any restaurant-like elements
      if (restaurantCards.length === 0) {
        restaurantCards = Array.from(document.querySelectorAll('[class*="restaurant"], [class*="Restaurant"], [class*="item"], [class*="card"]'));
        console.log(`🔍 Zomato: Fallback search found ${restaurantCards.length} potential items`);
      }
      
      console.log(`🍕 Zomato: Processing ${restaurantCards.length} restaurant cards`);
      
      restaurantCards.slice(0, 5).forEach((card, index) => {
        try {
          // Updated selectors for restaurant name
          const nameSelectors = [
            '[data-testid="restaurant-name"]',
            '.restaurant-name',
            '.RestaurantCard__name',
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
          
          // Updated selectors for price/rating
          const ratingSelectors = [
            '[data-testid="rating"]',
            '.rating',
            '.RestaurantCard__rating',
            '.restaurant-rating',
            '[class*="rating"]',
            '[class*="Rating"]'
          ];
          
          let rating = '';
          for (const selector of ratingSelectors) {
            const element = card.querySelector(selector);
            if (element?.textContent) {
              rating = element.textContent.trim();
              break;
            }
          }
          
          // Updated selectors for image
          const imageSelectors = [
            '[data-testid="restaurant-image"] img',
            '.RestaurantCard__image img',
            '.restaurant-image img',
            'img[src*="restaurant"]',
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
          
          // Get restaurant link
          let link = '';
          const linkElement = card.querySelector('a') || card.closest('a');
          if (linkElement) {
            link = (linkElement as HTMLAnchorElement).href;
          }
          
          if (name) {
            console.log(`✅ Zomato: Found restaurant ${index + 1}: ${name} - ${rating}`);
            products.push({
              platform: "Zomato",
              name: name,
              price: rating || "Rating not available",
              image: image || "",
              link: link || window.location.href,
              offer: "Check Zomato for current offers"
            });
          } else {
            console.log(`⚠️ Zomato: Restaurant ${index + 1} has no name`);
          }
        } catch (error) {
          console.log(`❌ Zomato: Error parsing restaurant ${index}:`, error);
        }
      });
      
      console.log(`🎉 Zomato: Successfully extracted ${products.length} restaurants`);
      return products;
    });
    
    console.log(`✅ Zomato: Scraping completed, found ${results.length} restaurants`);
    await browser.close();
    return results;
    
  } catch (error) {
    console.error("❌ Zomato scraping error:", error);
    await browser.close();
    return [];
  }
}