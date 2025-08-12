import { Page } from "puppeteer";

export async function handleLocationModal(page: Page, pincode: string, platformName: string): Promise<void> {
  try {
    // Wait for location modal to appear
    await page.waitForSelector("input[placeholder*='pincode'], input[placeholder*='Pincode'], .location-input, #location-input", { timeout: 10000 });
    
    // Try different possible selectors for the pincode input
    const pincodeSelectors = [
      "input[placeholder*='pincode']",
      "input[placeholder*='Pincode']", 
      ".location-input",
      "#location-input",
      "input[type='text']"
    ];
    
    let pincodeInput = null;
    for (const selector of pincodeSelectors) {
      try {
        pincodeInput = await page.$(selector);
        if (pincodeInput) break;
      } catch (e) {
        continue;
      }
    }
    
    if (pincodeInput) {
      await pincodeInput.type(pincode);
      
      // Try to find and click submit button
      const submitSelectors = [
        "button[type='submit']",
        "button:contains('Submit')",
        "button:contains('Continue')",
        "button:contains('Set Location')",
        ".submit-btn",
        ".continue-btn"
      ];
      
      for (const selector of submitSelectors) {
        try {
          const submitBtn = await page.$(selector);
          if (submitBtn) {
            await submitBtn.click();
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  } catch (e) {
    // If modal doesn't appear or fails, continue
    console.log(`Location modal not found or failed to set location for ${platformName}`);
  }
} 