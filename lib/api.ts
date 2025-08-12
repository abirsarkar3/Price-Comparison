// lib/api.ts
import puppeteer from 'puppeteer';

const websites = {
  zepto: 'https://www.zeptonow.com',
  bigbasket: 'https://www.bigbasket.com',
  blinkit: 'https://blinkit.com',
  swiggyInstamart: 'https://www.swiggy.com/instamart',
  swiggy: 'https://www.swiggy.com',
  zomato: 'https://www.zomato.com',
  magicpin: 'https://magicpin.in',
  apollo247: 'https://www.apollopharmacy.in',
  tata1mg: 'https://www.1mg.com',
  pharmeasy: 'https://pharmeasy.in'
};

export async function searchProducts(query: string, category: string = 'all') {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const results: any[] = [];

  for (const [site, baseUrl] of Object.entries(websites)) {
    try {
      const searchUrl = `${baseUrl}/search?q=${encodeURIComponent(query)}`;
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

      const items = await page.evaluate(() => {
        const productNodes = Array.from(document.querySelectorAll('div, li, .product-card'));
        return productNodes.slice(0, 5).map((el) => ({
          title: el.querySelector('h1,h2,h3')?.textContent?.trim() || 'No title',
          price: el.querySelector('.price, .Price, .cost')?.textContent?.trim() || 'N/A',
          image: el.querySelector('img')?.src || '',
          link: window.location.href,
          source: window.location.hostname
        }));
      });

      results.push(...items.map(item => ({ ...item, site })));
    } catch (err) {
      console.error(`❌ Error scraping ${site}:`, err.message);
    }
  }

  await browser.close();
  return results;
}

export async function fetchPricesAPI({ item, category, location }: { item: string; category: string; location: string }) {
  const res = await fetch("http://localhost:4000/api/fetch-prices", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ item, category, location }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data;
}
