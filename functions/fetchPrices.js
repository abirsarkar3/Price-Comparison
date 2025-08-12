const { onCall } = require("firebase-functions/v2/https");
const { scrapeGroceries, scrapeFood, scrapeMeds } = require("./scrapers");

const storeLogos = {
  "Zepto": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Zepto_logo.png",
  "Blinkit": "https://upload.wikimedia.org/wikipedia/commons/7/72/Blinkit_Logo.png",
  "BigBasket": "https://upload.wikimedia.org/wikipedia/commons/4/4d/Bigbasket_Logo.png",
  "Swiggy Instamart": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Swiggy_logo.png",
  "Swiggy": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Swiggy_logo.png",
  "Zomato": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Zomato_logo.png",
  "Apollo 247": "https://upload.wikimedia.org/wikipedia/commons/6/61/Apollo_Pharmacy_Logo.png",
  "Tata 1mg": "https://upload.wikimedia.org/wikipedia/commons/0/09/1mg_Logo.png",
  "Pharmeasy": "https://upload.wikimedia.org/wikipedia/commons/2/28/Pharmeasy_logo.png"
};

exports.fetchPrices = onCall(async (request) => {
  const { query, category } = request.data;

  if (!query || !category) {
    return { error: "Missing query or category" };
  }

  let results = [];

  try {
    if (category === "Groceries") {
      results = await scrapeGroceries(query);
    } else if (category === "Food Delivery") {
      results = await scrapeFood(query);
    } else if (category === "Medicines") {
      results = await scrapeMeds(query);
    } else {
      return { error: "Invalid category" };
    }

    // ✅ Add store logos
    results = results.map(item => ({
      ...item,
      logo: storeLogos[item.store] || ""
    }));

    return { success: true, data: results };

  } catch (error) {
    console.error("Error in fetchPrices:", error.message);
    return { success: false, error: error.message };
  }
});
