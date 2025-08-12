const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { scrapeGroceries, scrapeFood, scrapeMeds } = require("./scrapers");

admin.initializeApp();
const db = admin.database();

const LOGOS = {
  Zepto: "https://upload.wikimedia.org/wikipedia/commons/4/45/Zepto_logo.png",
  Blinkit: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Blinkit_Logo.png",
  BigBasket: "https://upload.wikimedia.org/wikipedia/commons/e/e4/BigBasket_logo.png",
  "Swiggy Instamart": "https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.png",
  Swiggy: "https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.png",
  Zomato: "https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png",
  "Apollo 247": "https://upload.wikimedia.org/wikipedia/en/1/1a/Apollo_Pharmacy_logo.png",
  "Tata 1mg": "https://upload.wikimedia.org/wikipedia/commons/2/2d/1mg_Logo.png",
  Pharmeasy: "https://upload.wikimedia.org/wikipedia/commons/0/0a/PharmEasy_Logo.png"
};

exports.fetchPrices = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  try {
    const query = req.query.query;
    const category = req.query.category;

    if (!query || !category) {
      return res.status(400).json({ error: "Missing query or category" });
    }

    const cacheKey = `${category}_${query}`;
    const cacheRef = db.ref(`priceCache/${cacheKey}`);
    const cacheSnap = await cacheRef.once("value");

    if (cacheSnap.exists()) {
      return res.json(cacheSnap.val());
    }

    let data = [];
    if (category === "groceries") {
      data = await scrapeGroceries(query);
    } else if (category === "food") {
      data = await scrapeFood(query);
    } else if (category === "meds") {
      data = await scrapeMeds(query);
    } else {
      return res.status(400).json({ error: "Invalid category" });
    }

    data = data.map(item => ({
      ...item,
      logo: LOGOS[item.store] || ""
    }));

    await cacheRef.set(data);
    await cacheRef.child("_timestamp").set(Date.now());

    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});
