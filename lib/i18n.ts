import i18n from "i18next"
import { initReactI18next } from "react-i18next"

const resources = {
  en: {
    translation: {
      // Navigation
      home: "Home",
      categories: "Categories",
      deals: "Deals",
      profile: "Profile",
      signIn: "Sign In",
      signOut: "Sign Out",

      // Search
      search: "Search",
      searchPlaceholder: "Search for products...",
      searching: "Searching...",
      searchResults: "Search results for",
      results: "results",
      noResults: "No results found",

      // Categories
      groceries: "Groceries",
      groceriesDesc: "Daily essentials and fresh produce",
      foodDelivery: "Food Delivery",
      foodDeliveryDesc: "Restaurant meals and quick bites",
      medicines: "Medicines",
      medicinesDesc: "Healthcare and wellness products",
      categoriesDesc: "Choose a category to start comparing prices",
      platforms: "Platforms",

      // Location
      location: "Location",
      detectLocation: "Detect Location",
      enterPincode: "Enter Pincode",
      set: "Set",
      deliverTo: "Deliver to",
      locationNotSet: "Location not set",
      useMyLocation: "Use My Location",
      detectingLocation: "Detecting location...",
      detecting: "Detecting...",
      enterManually: "Enter Manually",
      enterCity: "Enter City",
      enterArea: "Enter Area (Optional)",
      setLocation: "Set Location",
      cancel: "Cancel",

      // Price Comparison
      bestPrice: "Best Price",
      recommended: "Recommended",
      total: "Total",
      order: "Order",

      // Featured Deals
      featuredDeals: "Featured Deals",
      featuredDealsDesc: "Don't miss these limited-time offers",
      endsIn: "Ends in",

      // Profile
      saved: "Saved",
      alerts: "Alerts",
      history: "History",
      settings: "Settings",
      savedProducts: "Saved Products",
      savedProductsDesc: "Products you've saved for later",
      noSavedProducts: "No saved products yet",
      priceAlerts: "Price Alerts",
      priceAlertsDesc: "Get notified when prices drop",
      noPriceAlerts: "No price alerts set",
      searchHistory: "Search History",
      searchHistoryDesc: "Your recent searches",
      noSearchHistory: "No search history",
      preferences: "Preferences",
      preferencesDesc: "Manage your account settings",

      // Settings
      email: "Email",
      emailNotifications: "Email Notifications",
      emailNotificationsDesc: "Receive price alerts via email",
      pushNotifications: "Push Notifications",
      pushNotificationsDesc: "Receive push notifications",
      saveSettings: "Save Settings",
      saving: "Saving...",

      // Auth
      signInDescription: "Sign in to save your preferences and get personalized deals",
      signInWithGoogle: "Sign in with Google",
      orContinueWith: "Or continue with",
      password: "Password",
      signingIn: "Signing in...",

      // Footer
      footerDesc: "Compare prices across multiple platforms and save money on your daily purchases.",
      support: "Support",
      help: "Help",
      contact: "Contact",
      privacy: "Privacy",
      company: "Company",
      about: "About",
      careers: "Careers",
      terms: "Terms",
      allRightsReserved: "All rights reserved.",

      // Misc
      manageAccount: "Manage your account and preferences",

      // AI Assistant
      aiGreeting:
        "Hello! I'm your AI shopping assistant. I can help you find the best deals and optimize your cart to save money. What would you like to know?",
      aiAssistant: "AI Assistant",
      cartOptimizer: "Cart Optimizer",
      openAIAssistant: "Open AI Assistant",
      askAIAssistant: "Ask me anything about deals and savings...",
      aiInputPlaceholder: "Ask me anything, e.g., 'cheapest milk in groceries'",
      aiError: "I'm sorry, I'm having trouble right now. Please try again.",
      optimizationApplied: "Great! I've applied the optimization to your cart.",
      applySuggestion: "Apply",
      save: "Save",
      addToCart: "Add to Cart",
      addedToCart: "Added to Cart",
      itemAddedToCart: "{{item}} has been added to your cart",
      signInRequired: "Sign In Required",
      signInToAddToCart: "Please sign in to add items to your cart",
      failedToAddToCart: "Failed to add item to cart",
      error: "Error",
    },
  },
  hi: {
    translation: {
      // Navigation
      home: "होम",
      categories: "श्रेणियां",
      deals: "डील्स",
      profile: "प्रोफाइल",
      signIn: "साइन इन",
      signOut: "साइन आउट",

      // Search
      search: "खोजें",
      searchPlaceholder: "उत्पादों की खोज करें...",
      searching: "खोज रहे हैं...",
      searchResults: "खोज परिणाम",
      results: "परिणाम",
      noResults: "कोई परिणाम नहीं मिला",

      // Categories
      groceries: "किराना",
      groceriesDesc: "दैनिक आवश्यकताएं और ताजा उत्पाद",
      foodDelivery: "फूड डिलीवरी",
      foodDeliveryDesc: "रेस्टोरेंट भोजन और त्वरित नाश्ता",
      medicines: "दवाइयां",
      medicinesDesc: "स्वास्थ्य और कल्याण उत्पाद",
      categoriesDesc: "कीमतों की तुलना शुरू करने के लिए एक श्रेणी चुनें",
      platforms: "प्लेटफॉर्म",

      // Location
      location: "स्थान",
      detectLocation: "स्थान का पता लगाएं",
      enterPincode: "पिनकोड दर्ज करें",
      set: "सेट करें",
      deliverTo: "डिलीवर करें",
      locationNotSet: "स्थान सेट नहीं है",
      useMyLocation: "मेरा स्थान उपयोग करें",
      detectingLocation: "स्थान का पता लगा रहे हैं...",
      detecting: "पता लगा रहे हैं...",
      enterManually: "मैन्युअल रूप से दर्ज करें",
      enterCity: "शहर दर्ज करें",
      enterArea: "क्षेत्र दर्ज करें (वैकल्पिक)",
      setLocation: "स्थान सेट करें",
      cancel: "रद्द करें",

      // Price Comparison
      bestPrice: "सबसे अच्छी कीमत",
      recommended: "अनुशंसित",
      total: "कुल",
      order: "ऑर्डर करें",

      // Featured Deals
      featuredDeals: "विशेष डील्स",
      featuredDealsDesc: "इन सीमित समय के ऑफर्स को न चूकें",
      endsIn: "समाप्त होने में",

      // Profile
      saved: "सेव किए गए",
      alerts: "अलर्ट",
      history: "इतिहास",
      settings: "सेटिंग्स",
      savedProducts: "सेव किए गए उत्पाद",
      savedProductsDesc: "आपके द्वारा बाद के लिए सेव किए गए उत्पाद",
      noSavedProducts: "अभी तक कोई उत्पाद सेव नहीं किया गया",
      priceAlerts: "कीमत अलर्ट",
      priceAlertsDesc: "कीमत गिरने पर सूचना पाएं",
      noPriceAlerts: "कोई कीमत अलर्ट सेट नहीं है",
      searchHistory: "खोज इतिहास",
      searchHistoryDesc: "आपकी हाल की खोजें",
      noSearchHistory: "कोई खोज इतिहास नहीं",
      preferences: "प्राथमिकताएं",
      preferencesDesc: "अपनी खाता सेटिंग्स प्रबंधित करें",

      // Settings
      email: "ईमेल",
      emailNotifications: "ईमेल सूचनाएं",
      emailNotificationsDesc: "ईमेल के माध्यम से कीमत अलर्ट प्राप्त करें",
      pushNotifications: "पुश सूचनाएं",
      pushNotificationsDesc: "पुश सूचनाएं प्राप्त करें",
      saveSettings: "सेटिंग्स सेव करें",
      saving: "सेव कर रहे हैं...",

      // Auth
      signInDescription: "अपनी प्राथमिकताएं सेव करने और व्यक्तिगत डील्स पाने के लिए साइन इन करें",
      signInWithGoogle: "Google के साथ साइन इन करें",
      orContinueWith: "या इसके साथ जारी रखें",
      password: "पासवर्ड",
      signingIn: "साइन इन हो रहे हैं...",

      // Footer
      footerDesc: "कई प्लेटफॉर्म पर कीमतों की तुलना करें और अपनी दैनिक खरीदारी पर पैसे बचाएं।",
      support: "सहायता",
      help: "मदद",
      contact: "संपर्क",
      privacy: "गोपनीयता",
      company: "कंपनी",
      about: "के बारे में",
      careers: "करियर",
      terms: "नियम",
      allRightsReserved: "सभी अधिकार सुरक्षित।",

      // Misc
      manageAccount: "अपना खाता और प्राथमिकताएं प्रबंधित करें",

      // AI Assistant
      aiGreeting:
        "नमस्ते! मैं आपका AI शॉपिंग असिस्टेंट हूं। मैं आपको सबसे अच्छे डील्स खोजने और पैसे बचाने के लिए आपकी कार्ट को ऑप्टिमाइज़ करने में मदद कर सकता हूं।",
      aiAssistant: "AI असिस्टेंट",
      cartOptimizer: "कार्ट ऑप्टिमाइज़र",
      openAIAssistant: "AI असिस्टेंट खोलें",
      askAIAssistant: "डील्स और बचत के बारे में मुझसे कुछ भी पूछें...",
      aiInputPlaceholder: "मुझसे कुछ भी पूछें, जैसे 'किराने में सबसे सस्ता दूध'",
      aiError: "मुझे खुशी है, मुझे अभी परेशानी हो रही है। कृपया फिर से कोशिश करें।",
      optimizationApplied: "बहुत बढ़िया! मैंने आपकी कार्ट में ऑप्टिमाइज़ेशन लागू कर दिया है।",
      applySuggestion: "लागू करें",
      save: "बचाएं",
      addToCart: "कार्ट में जोड़ें",
      addedToCart: "कार्ट में जोड़ा गया",
      itemAddedToCart: "{{item}} आपकी कार्ट में जोड़ दिया गया है",
      signInRequired: "साइन इन आवश्यक",
      signInToAddToCart: "कार्ट में आइटम जोड़ने के लिए कृपया साइन इन करें",
      failedToAddToCart: "कार्ट में आइटम जोड़ने में विफल",
      error: "त्रुटि",
    },
  },
  bn: {
    translation: {
      // Navigation
      home: "হোম",
      categories: "বিভাগসমূহ",
      deals: "ডিলস",
      profile: "প্রোফাইল",
      signIn: "সাইন ইন",
      signOut: "সাইন আউট",

      // Search
      search: "অনুসন্ধান",
      searchPlaceholder: "পণ্যের জন্য অনুসন্ধান করুন...",
      searching: "অনুসন্ধান করা হচ্ছে...",
      searchResults: "অনুসন্ধানের ফলাফল",
      results: "ফলাফল",
      noResults: "কোন ফলাফল পাওয়া যায়নি",

      // Categories
      groceries: "মুদি",
      groceriesDesc: "দৈনন্দিন প্রয়োজনীয় এবং তাজা পণ্য",
      foodDelivery: "খাবার ডেলিভারি",
      foodDeliveryDesc: "রেস্তোরাঁর খাবার এবং দ্রুত নাস্তা",
      medicines: "ওষুধ",
      medicinesDesc: "স্বাস্থ্যসেবা এবং সুস্থতার পণ্য",
      categoriesDesc: "দামের তুলনা শুরু করতে একটি বিভাগ বেছে নিন",
      platforms: "প্ল্যাটফর্ম",

      // Location
      location: "অবস্থান",
      detectLocation: "অবস্থান সনাক্ত করুন",
      enterPincode: "পিনকোড লিখুন",
      set: "সেট করুন",
      deliverTo: "ডেলিভার করুন",
      locationNotSet: "অবস্থান সেট করা হয়নি",
      useMyLocation: "আমার অবস্থান ব্যবহার করুন",
      detectingLocation: "অবস্থান সনাক্ত করা হচ্ছে...",
      detecting: "সনাক্ত করা হচ্ছে...",
      enterManually: "ম্যানুয়ালি প্রবেশ করুন",
      enterCity: "শহর প্রবেশ করুন",
      enterArea: "এলাকা প্রবেশ করুন (ঐচ্ছিক)",
      setLocation: "অবস্থান সেট করুন",
      cancel: "বাতিল",

      // Price Comparison
      bestPrice: "সেরা দাম",
      recommended: "প্রস্তাবিত",
      total: "মোট",
      order: "অর্ডার করুন",

      // Featured Deals
      featuredDeals: "বিশেষ ডিলস",
      featuredDealsDesc: "এই সীমিত সময়ের অফারগুলি মিস করবেন না",
      endsIn: "শেষ হবে",

      // Profile
      saved: "সংরক্ষিত",
      alerts: "সতর্কতা",
      history: "ইতিহাস",
      settings: "সেটিংস",
      savedProducts: "সংরক্ষিত পণ্য",
      savedProductsDesc: "আপনি পরবর্তীতে ব্যবহারের জন্য সংরক্ষিত পণ্য",
      noSavedProducts: "এখনও কোন পণ্য সংরক্ষিত নেই",
      priceAlerts: "দাম সতর্কতা",
      priceAlertsDesc: "দাম কমলে বিজ্ঞপ্তি পান",
      noPriceAlerts: "কোন দাম সতর্কতা সেট নেই",
      searchHistory: "অনুসন্ধান ইতিহাস",
      searchHistoryDesc: "আপনার সাম্প্রতিক অনুসন্ধান",
      noSearchHistory: "কোন অনুসন্ধান ইতিহাস নেই",
      preferences: "পছন্দসমূহ",
      preferencesDesc: "আপনার অ্যাকাউন্ট সেটিংস পরিচালনা করুন",

      // Settings
      email: "ইমেইল",
      emailNotifications: "ইমেইল বিজ্ঞপ্তি",
      emailNotificationsDesc: "ইমেইলের মাধ্যমে দাম সতর্কতা পান",
      pushNotifications: "পুশ বিজ্ঞপ্তি",
      pushNotificationsDesc: "পুশ বিজ্ঞপ্তি পান",
      saveSettings: "সেটিংস সংরক্ষণ করুন",
      saving: "সংরক্ষণ করা হচ্ছে...",

      // Auth
      signInDescription: "আপনার পছন্দ সংরক্ষণ করতে এবং ব্যক্তিগত ডিল পেতে সাইন ইন করুন",
      signInWithGoogle: "Google দিয়ে সাইন ইন করুন",
      orContinueWith: "অথবা এর সাথে চালিয়ে যান",
      password: "পাসওয়ার্ড",
      signingIn: "সাইন ইন করা হচ্ছে...",

      // Footer
      footerDesc: "একাধিক প্ল্যাটফর্মে দামের তুলনা করুন এবং আপনার দৈনন্দিন কেনাকাটায় অর্থ সাশ্রয় করুন।",
      support: "সহায়তা",
      help: "সাহায্য",
      contact: "যোগাযোগ",
      privacy: "গোপনীয়তা",
      company: "কোম্পানি",
      about: "সম্পর্কে",
      careers: "ক্যারিয়ার",
      terms: "শর্তাবলী",
      allRightsReserved: "সকল অধিকার সংরক্ষিত।",

      // Misc
      manageAccount: "আপনার অ্যাকাউন্ট এবং পছন্দসমূহ পরিচালনা করুন",

      // AI Assistant
      aiGreeting:
        "হ্যালো! আমি আপনার AI শপিং সহায়ক। আমি আপনাকে সেরা ডিল খুঁজে পেতে এবং অর্থ সাশ্রয় করতে আপনার কার্ট অপ্টিমাইজ করতে সাহায্য করতে পারি।",
      aiAssistant: "AI সহায়ক",
      cartOptimizer: "কার্ট অপ্টিমাইজার",
      openAIAssistant: "AI সহায়ক খুলুন",
      askAIAssistant: "ডিল এবং সাশ্রয় সম্পর্কে আমাকে কিছু জিজ্ঞাসা করুন...",
      aiInputPlaceholder: "আমাকে কিছু জিজ্ঞাসা করুন, যেমন 'মুদিতে সবচেয়ে সস্তা দুধ'",
      aiError: "আমি দুঃখিত, আমার এখন সমস্যা হচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      optimizationApplied: "দুর্দান্ত! আমি আপনার কার্টে অপ্টিমাইজেশন প্রয়োগ করেছি।",
      applySuggestion: "প্রয়োগ করুন",
      save: "সাশ্রয় করুন",
      addToCart: "কার্টে যোগ করুন",
      addedToCart: "কার্টে যোগ করা হয়েছে",
      itemAddedToCart: "{{item}} আপনার কার্টে যোগ করা হয়েছে",
      signInRequired: "সাইন ইন প্রয়োজন",
      signInToAddToCart: "কার্টে আইটেম যোগ করতে অনুগ্রহ করে সাইন ইন করুন",
      failedToAddToCart: "কার্টে আইটেম যোগ করতে ব্যর্থ",
      error: "ত্রুটি",
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
