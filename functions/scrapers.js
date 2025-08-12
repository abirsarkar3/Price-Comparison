const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const UserAgent = require("user-agents");

puppeteer.use(StealthPlugin());

async function createBrowser() {
  return await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
}

async function scrapeWithTimeout(page, url, evaluateFn) {
  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 20000 });
    return await page.evaluate(evaluateFn);
  } catch (err) {
    console.error(`Failed to scrape ${url}:`, err.message);
    return [];
  }
}

// ✅ GROCERY SCRAPER
async function scrapeGroceries(query) {
  const browser = await createBrowser();
  const page = await browser.newPage();
  page.setUserAgent(new UserAgent().toString());

  const [zepto, blinkit, bigBasket, instamart] = await Promise.all([
    scrapeWithTimeout(page, `https://www.zeptonow.com/search?query=${query}`, () =>
      Array.from(document.querySelectorAll(".ProductCard__name")).slice(0, 5).map((el, i) => ({
        store: "Zepto",
        name: el.innerText,
        price: document.querySelectorAll(".ProductCard__price")[i]?.innerText || "",
        image: document.querySelectorAll(".ProductCard__image img")[i]?.src || "",
        link: window.location.href
      }))
    ),
    scrapeWithTimeout(page, `https://blinkit.com/s/?q=${query}`, () =>
      Array.from(document.querySelectorAll(".Product__name")).slice(0, 5).map((el, i) => ({
        store: "Blinkit",
        name: el.innerText,
        price: document.querySelectorAll(".Product__price")[i]?.innerText || "",
        image: document.querySelectorAll(".Product__img img")[i]?.src || "",
        link: window.location.href
      }))
    ),
    scrapeWithTimeout(page, `https://www.bigbasket.com/ps/?q=${query}`, () =>
      Array.from(document.querySelectorAll(".col-sm-12 .desc")).slice(0, 5).map((el, i) => ({
        store: "BigBasket",
        name: el.innerText,
        price: document.querySelectorAll(".col-sm-12 .discnt-price")[i]?.innerText || "",
        image: document.querySelectorAll(".product-image img")[i]?.src || "",
        link: window.location.href
      }))
    ),
    scrapeWithTimeout(page, `https://www.swiggy.com/instamart/search?query=${query}`, () =>
      Array.from(document.querySelectorAll(".product-name")).slice(0, 5).map((el, i) => ({
        store: "Swiggy Instamart",
        name: el.innerText,
        price: document.querySelectorAll(".price")[i]?.innerText || "",
        image: document.querySelectorAll(".product-image img")[i]?.src || "",
        link: window.location.href
      }))
    )
  ]);

  await browser.close();
  return [...zepto, ...blinkit, ...bigBasket, ...instamart];
}

// ✅ FOOD SCRAPER
async function scrapeFood(query) {
  const browser = await createBrowser();
  const page = await browser.newPage();
  page.setUserAgent(new UserAgent().toString());

  const [swiggy, zomato] = await Promise.all([
    scrapeWithTimeout(page, `https://www.swiggy.com/search?query=${query}`, () =>
      Array.from(document.querySelectorAll(".nA6kb")).slice(0, 5).map((el, i) => ({
        store: "Swiggy",
        name: el.innerText,
        price: "See Menu",
        image: document.querySelectorAll(".restaurant-img")[i]?.src || "",
        link: window.location.href
      }))
    ),
    scrapeWithTimeout(page, `https://www.zomato.com/search?q=${query}`, () =>
      Array.from(document.querySelectorAll(".sc-bke1zw-1")).slice(0, 5).map((el, i) => ({
        store: "Zomato",
        name: el.innerText,
        price: "See Menu",
        image: document.querySelectorAll(".sc-s1isp7-5")[i]?.src || "",
        link: window.location.href
      }))
    )
  ]);

  await browser.close();
  return [...swiggy, ...zomato];
}

// ✅ MEDICINE SCRAPER
async function scrapeMeds(query) {
  const browser = await createBrowser();
  const page = await browser.newPage();
  page.setUserAgent(new UserAgent().toString());

  const [apollo, tata1mg, pharmeasy] = await Promise.all([
    scrapeWithTimeout(page, `https://www.apollopharmacy.in/search-medicines/${query}`, () =>
      Array.from(document.querySelectorAll(".ProductCard_productName__3UInN")).slice(0, 5).map((el, i) => ({
        store: "Apollo 247",
        name: el.innerText,
        price: document.querySelectorAll(".ProductCard_price__3QGsU")[i]?.innerText || "",
        image: document.querySelectorAll(".ProductCard_image__1oXd7 img")[i]?.src || "",
        link: window.location.href
      }))
    ),
    scrapeWithTimeout(page, `https://www.1mg.com/search/all?name=${query}`, () =>
      Array.from(document.querySelectorAll(".style__pro-title___3zxNC")).slice(0, 5).map((el, i) => ({
        store: "Tata 1mg",
        name: el.innerText,
        price: document.querySelectorAll(".style__price-tag___B2csA")[i]?.innerText || "",
        image: document.querySelectorAll(".style__product-image___1yE9C")[i]?.src || "",
        link: window.location.href
      }))
    ),
    scrapeWithTimeout(page, `https://pharmeasy.in/search/all?name=${query}`, () =>
      Array.from(document.querySelectorAll(".ProductCard_productName__3UInN")).slice(0, 5).map((el, i) => ({
        store: "Pharmeasy",
        name: el.innerText,
        price: document.querySelectorAll(".ProductCard_price__3QGsU")[i]?.innerText || "",
        image: document.querySelectorAll(".ProductCard_image__1oXd7 img")[i]?.src || "",
        link: window.location.href
      }))
    )
  ]);

  await browser.close();
  return [...apollo, ...tata1mg, ...pharmeasy];
}

module.exports = { scrapeGroceries, scrapeFood, scrapeMeds };
