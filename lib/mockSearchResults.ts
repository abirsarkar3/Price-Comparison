export interface SearchResult {
  platform: string;
  name: string;
  price: number;
  originalPrice?: number;
  delivery_fee: number;
  offer?: string;
  image: string;
  link: string;
  rating?: number;
  deliveryTime?: string;
  inStock: boolean;
  category: string;
}

// Mock data for different categories
const groceriesData: Record<string, SearchResult[]> = {
  "milk": [
    {
      platform: "Zepto",
      name: "Amul Gold Full Cream Milk 1L",
      price: 58,
      originalPrice: 65,
      delivery_fee: 0,
      offer: "10% off on first order",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop",
      link: "https://www.zeptonow.com/product/amul-gold-milk",
      rating: 4.5,
      deliveryTime: "10 minutes",
      inStock: true,
      category: "groceries"
    },
    {
      platform: "Blinkit",
      name: "Mother Dairy Full Cream Milk 1L",
      price: 56,
      originalPrice: 62,
      delivery_fee: 0,
      offer: "Free delivery",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop",
      link: "https://blinkit.com/product/mother-dairy-milk",
      rating: 4.3,
      deliveryTime: "10 minutes",
      inStock: true,
      category: "groceries"
    },
    {
      platform: "BigBasket",
      name: "Nestle A+ Toned Milk 1L",
      price: 54,
      originalPrice: 60,
      delivery_fee: 20,
      offer: "5% off on subscription",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop",
      link: "https://bigbasket.com/product/nestle-milk",
      rating: 4.2,
      deliveryTime: "90 minutes",
      inStock: true,
      category: "groceries"
    },
    {
      platform: "Swiggy Instamart",
      name: "Amul Taaza Toned Milk 1L",
      price: 52,
      originalPrice: 58,
      delivery_fee: 0,
      offer: "First order free delivery",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop",
      link: "https://instamart.swiggy.com/product/amul-taaza",
      rating: 4.4,
      deliveryTime: "15 minutes",
      inStock: true,
      category: "groceries"
    }
  ],
  "bread": [
    {
      platform: "Zepto",
      name: "Britannia Brown Bread 400g",
      price: 35,
      originalPrice: 40,
      delivery_fee: 0,
      offer: "10% off on first order",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop",
      link: "https://www.zeptonow.com/product/britannia-brown-bread",
      rating: 4.2,
      deliveryTime: "10 minutes",
      inStock: true,
      category: "groceries"
    },
    {
      platform: "Blinkit",
      name: "Harvest Gold Wheat Bread 400g",
      price: 32,
      originalPrice: 38,
      delivery_fee: 0,
      offer: "Free delivery",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop",
      link: "https://blinkit.com/product/harvest-gold-bread",
      rating: 4.0,
      deliveryTime: "10 minutes",
      inStock: true,
      category: "groceries"
    },
    {
      platform: "BigBasket",
      name: "Modern Brown Bread 400g",
      price: 30,
      originalPrice: 35,
      delivery_fee: 20,
      offer: "5% off on subscription",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop",
      link: "https://bigbasket.com/product/modern-bread",
      rating: 4.1,
      deliveryTime: "90 minutes",
      inStock: true,
      category: "groceries"
    }
  ],
  "eggs": [
    {
      platform: "Zepto",
      name: "Fresh Farm Eggs (Pack of 6)",
      price: 45,
      originalPrice: 50,
      delivery_fee: 0,
      offer: "10% off on first order",
      image: "https://images.unsplash.com/photo-1489171078254-c3365d6e359f?w=200&h=200&fit=crop",
      link: "https://www.zeptonow.com/product/fresh-eggs",
      rating: 4.6,
      deliveryTime: "10 minutes",
      inStock: true,
      category: "groceries"
    },
    {
      platform: "Blinkit",
      name: "Organic Eggs (Pack of 6)",
      price: 48,
      originalPrice: 55,
      delivery_fee: 0,
      offer: "Free delivery",
      image: "https://images.unsplash.com/photo-1489171078254-c3365d6e359f?w=200&h=200&fit=crop",
      link: "https://blinkit.com/product/organic-eggs",
      rating: 4.4,
      deliveryTime: "10 minutes",
      inStock: true,
      category: "groceries"
    },
    {
      platform: "BigBasket",
      name: "Country Eggs (Pack of 12)",
      price: 85,
      originalPrice: 95,
      delivery_fee: 20,
      offer: "5% off on subscription",
      image: "https://images.unsplash.com/photo-1489171078254-c3365d6e359f?w=200&h=200&fit=crop",
      link: "https://bigbasket.com/product/country-eggs",
      rating: 4.3,
      deliveryTime: "90 minutes",
      inStock: true,
      category: "groceries"
    }
  ]
};

const foodData: Record<string, SearchResult[]> = {
  "pizza": [
    {
      platform: "Zomato",
      name: "Margherita Pizza - Domino's",
      price: 199,
      originalPrice: 299,
      delivery_fee: 40,
      offer: "33% off on pizza",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop",
      link: "https://www.zomato.com/restaurant/dominos-pizza",
      rating: 4.2,
      deliveryTime: "30-45 minutes",
      inStock: true,
      category: "food"
    },
    {
      platform: "Swiggy",
      name: "Pepperoni Pizza - Pizza Hut",
      price: 249,
      originalPrice: 349,
      delivery_fee: 30,
      offer: "28% off on pizza",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop",
      link: "https://www.swiggy.com/restaurant/pizza-hut",
      rating: 4.1,
      deliveryTime: "35-50 minutes",
      inStock: true,
      category: "food"
    },
    {
      platform: "Magicpin",
      name: "Veg Supreme Pizza - Papa John's",
      price: 179,
      originalPrice: 259,
      delivery_fee: 25,
      offer: "30% off + cashback",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop",
      link: "https://www.magicpin.in/restaurant/papa-johns",
      rating: 4.0,
      deliveryTime: "40-55 minutes",
      inStock: true,
      category: "food"
    }
  ],
  "burger": [
    {
      platform: "Zomato",
      name: "Chicken Burger - McDonald's",
      price: 149,
      originalPrice: 199,
      delivery_fee: 40,
      offer: "25% off on burgers",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop",
      link: "https://www.zomato.com/restaurant/mcdonalds",
      rating: 4.3,
      deliveryTime: "25-35 minutes",
      inStock: true,
      category: "food"
    },
    {
      platform: "Swiggy",
      name: "Veg Burger - Burger King",
      price: 129,
      originalPrice: 179,
      delivery_fee: 30,
      offer: "28% off on burgers",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop",
      link: "https://www.swiggy.com/restaurant/burger-king",
      rating: 4.0,
      deliveryTime: "30-40 minutes",
      inStock: true,
      category: "food"
    },
    {
      platform: "Magicpin",
      name: "Classic Burger - Wendy's",
      price: 159,
      originalPrice: 219,
      delivery_fee: 25,
      offer: "27% off + cashback",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop",
      link: "https://www.magicpin.in/restaurant/wendys",
      rating: 4.1,
      deliveryTime: "35-45 minutes",
      inStock: true,
      category: "food"
    }
  ],
  "biryani": [
    {
      platform: "Zomato",
      name: "Chicken Biryani - Paradise",
      price: 299,
      originalPrice: 399,
      delivery_fee: 40,
      offer: "25% off on biryani",
      image: "https://images.unsplash.com/photo-1563379091339-03246963d4a9?w=200&h=200&fit=crop",
      link: "https://www.zomato.com/restaurant/paradise-biryani",
      rating: 4.5,
      deliveryTime: "45-60 minutes",
      inStock: true,
      category: "food"
    },
    {
      platform: "Swiggy",
      name: "Veg Biryani - Bawarchi",
      price: 249,
      originalPrice: 349,
      delivery_fee: 30,
      offer: "28% off on biryani",
      image: "https://images.unsplash.com/photo-1563379091339-03246963d4a9?w=200&h=200&fit=crop",
      link: "https://www.swiggy.com/restaurant/bawarchi",
      rating: 4.2,
      deliveryTime: "50-65 minutes",
      inStock: true,
      category: "food"
    },
    {
      platform: "Magicpin",
      name: "Mutton Biryani - Shah Ghouse",
      price: 399,
      originalPrice: 499,
      delivery_fee: 25,
      offer: "20% off + cashback",
      image: "https://images.unsplash.com/photo-1563379091339-03246963d4a9?w=200&h=200&fit=crop",
      link: "https://www.magicpin.in/restaurant/shah-ghouse",
      rating: 4.4,
      deliveryTime: "55-70 minutes",
      inStock: true,
      category: "food"
    }
  ]
};

const medicinesData: Record<string, SearchResult[]> = {
  "paracetamol": [
    {
      platform: "Tata 1mg",
      name: "Dolo 650mg Tablet (15 tablets)",
      price: 25,
      originalPrice: 35,
      delivery_fee: 0,
      offer: "28% off on medicines",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop",
      link: "https://www.1mg.com/otc/dolo-650mg-tablet-otc-325089",
      rating: 4.6,
      deliveryTime: "2-4 hours",
      inStock: true,
      category: "medicines"
    },
    {
      platform: "Apollo 24|7",
      name: "Crocin Advance 500mg Tablet (10 tablets)",
      price: 28,
      originalPrice: 40,
      delivery_fee: 0,
      offer: "30% off on medicines",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop",
      link: "https://www.apollo247.com/otc/crocin-advance-500mg-tablet-otc-325090",
      rating: 4.4,
      deliveryTime: "1-3 hours",
      inStock: true,
      category: "medicines"
    },
    {
      platform: "PharmEasy",
      name: "Calpol 500mg Tablet (15 tablets)",
      price: 22,
      originalPrice: 32,
      delivery_fee: 0,
      offer: "31% off on medicines",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop",
      link: "https://pharmeasy.in/otc/calpol-500mg-tablet-otc-325091",
      rating: 4.5,
      deliveryTime: "2-4 hours",
      inStock: true,
      category: "medicines"
    }
  ],
  "vitamin c": [
    {
      platform: "Tata 1mg",
      name: "Limcee 500mg Chewable Tablet (15 tablets)",
      price: 45,
      originalPrice: 65,
      delivery_fee: 0,
      offer: "30% off on vitamins",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop",
      link: "https://www.1mg.com/otc/limcee-500mg-chewable-tablet-otc-325092",
      rating: 4.3,
      deliveryTime: "2-4 hours",
      inStock: true,
      category: "medicines"
    },
    {
      platform: "Apollo 24|7",
      name: "Celin 500mg Tablet (30 tablets)",
      price: 55,
      originalPrice: 75,
      delivery_fee: 0,
      offer: "26% off on vitamins",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop",
      link: "https://www.apollo247.com/otc/celin-500mg-tablet-otc-325093",
      rating: 4.2,
      deliveryTime: "1-3 hours",
      inStock: true,
      category: "medicines"
    },
    {
      platform: "PharmEasy",
      name: "Chewable Vitamin C 500mg (20 tablets)",
      price: 48,
      originalPrice: 68,
      delivery_fee: 0,
      offer: "29% off on vitamins",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop",
      link: "https://pharmeasy.in/otc/chewable-vitamin-c-500mg-otc-325094",
      rating: 4.4,
      deliveryTime: "2-4 hours",
      inStock: true,
      category: "medicines"
    }
  ],
  "cough syrup": [
    {
      platform: "Tata 1mg",
      name: "Benadryl Cough Syrup 100ml",
      price: 85,
      originalPrice: 120,
      delivery_fee: 0,
      offer: "29% off on cough medicines",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop",
      link: "https://www.1mg.com/otc/benadryl-cough-syrup-otc-325095",
      rating: 4.1,
      deliveryTime: "2-4 hours",
      inStock: true,
      category: "medicines"
    },
    {
      platform: "Apollo 24|7",
      name: "Corex Cough Syrup 100ml",
      price: 78,
      originalPrice: 110,
      delivery_fee: 0,
      offer: "29% off on cough medicines",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop",
      link: "https://www.apollo247.com/otc/corex-cough-syrup-otc-325096",
      rating: 4.0,
      deliveryTime: "1-3 hours",
      inStock: true,
      category: "medicines"
    },
    {
      platform: "PharmEasy",
      name: "Phensedyl Cough Syrup 100ml",
      price: 92,
      originalPrice: 130,
      delivery_fee: 0,
      offer: "29% off on cough medicines",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop",
      link: "https://pharmeasy.in/otc/phensedyl-cough-syrup-otc-325097",
      rating: 4.2,
      deliveryTime: "2-4 hours",
      inStock: true,
      category: "medicines"
    }
  ]
};

// Generic search function that returns results based on category and search term
export function getMockSearchResults(item: string, category: string): SearchResult[] {
  const searchTerm = item.toLowerCase().trim();
  
  if (category === "groceries") {
    // Check for specific grocery items
    for (const [key, results] of Object.entries(groceriesData)) {
      if (searchTerm.includes(key)) {
        return results;
      }
    }
    
    // Generic grocery results
    return [
      ...groceriesData.milk.slice(0, 2),
      ...groceriesData.bread.slice(0, 1),
      ...groceriesData.eggs.slice(0, 1)
    ];
  }
  
  if (category === "food") {
    // Check for specific food items
    for (const [key, results] of Object.entries(foodData)) {
      if (searchTerm.includes(key)) {
        return results;
      }
    }
    
    // Generic food results
    return [
      ...foodData.pizza.slice(0, 2),
      ...foodData.burger.slice(0, 1),
      ...foodData.biryani.slice(0, 1)
    ];
  }
  
  if (category === "medicines") {
    // Check for specific medicine items
    for (const [key, results] of Object.entries(medicinesData)) {
      if (searchTerm.includes(key)) {
        return results;
      }
    }
    
    // Generic medicine results
    return [
      ...medicinesData.paracetamol.slice(0, 2),
      ...medicinesData["vitamin c"].slice(0, 1),
      ...medicinesData["cough syrup"].slice(0, 1)
    ];
  }
  
  // Default fallback
  return [
    ...groceriesData.milk.slice(0, 1),
    ...foodData.pizza.slice(0, 1),
    ...medicinesData.paracetamol.slice(0, 1)
  ];
}

// Function to get trending searches for each category
export function getTrendingSearches(category: string): string[] {
  const trending = {
    groceries: ["milk", "bread", "eggs", "rice", "oil", "sugar", "tea", "coffee"],
    food: ["pizza", "burger", "biryani", "noodles", "chicken", "rice", "ice cream"],
    medicines: ["paracetamol", "vitamin c", "cough syrup", "multivitamin", "calcium", "iron"]
  };
  
  return trending[category as keyof typeof trending] || trending.groceries;
} 