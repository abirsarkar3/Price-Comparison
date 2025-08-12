import { type NextRequest, NextResponse } from "next/server"
import { getCartOptimization } from "@/lib/cart-optimization"
import { getUserCart } from "@/lib/cart-storage"

// Enhanced AI response generation with more features
async function generateAIResponse(message: string, language: string, optimizations: any[], cartData: any[]) {
  const responses = {
    en: {
      greeting:
        "Hello! I'm your AI shopping assistant. I can help you find the best deals, optimize your cart, compare prices, and provide delivery tips. What would you like to know?",
      optimization: `Based on your cart, I found some great savings opportunities! ${optimizations.length > 0 ? `You could save up to ₹${optimizations[0]?.totalSavings || 0} by splitting your purchases across different platforms.` : "Add some items to your cart and I'll help you optimize it!"}`,
      best_deals: "Here are today's best deals across platforms:\n\n🔥 **Zepto**: 50% off on fresh vegetables\n🔥 **Blinkit**: Buy 1 Get 1 on dairy products\n🔥 **Swiggy**: Free delivery on orders above ₹199\n🔥 **Apollo**: 20% off on medicines\n\nWould you like me to help you add any of these to your cart?",
      cart_optimize: `Let me analyze your cart with ${cartData.length} items:\n\n${cartData.length > 0 ? `💡 **Optimization Tips**:\n• Group items by platform to minimize delivery fees\n• Check for bundle deals on similar items\n• Consider bulk purchases for better rates\n\n${optimizations.length > 0 ? `🎯 **Smart Suggestions**:\n${optimizations.map((opt, i) => `${i + 1}. ${opt.platform}: Save ₹${opt.savings} on ${opt.items.join(', ')}`).join('\n')}` : 'Add more items to see optimization suggestions!'}` : 'Your cart is empty! Start adding items to get optimization suggestions.'}`,
      price_compare: "I can help you compare prices across platforms! Here's what I can do:\n\n🔍 **Search & Compare**: Tell me what you're looking for\n📊 **Price Analysis**: Get detailed price breakdowns\n💡 **Best Deals**: Find the cheapest options\n🚚 **Delivery Costs**: Include delivery fees in comparison\n\nWhat product would you like me to compare?",
      delivery_tips: "🚚 **Smart Delivery Tips to Save Money**:\n\n1. **Bundle Orders**: Combine items to meet free delivery thresholds\n2. **Timing**: Order during off-peak hours for faster delivery\n3. **Location**: Set your location accurately for better rates\n4. **Platforms**: Compare delivery fees across different apps\n5. **Subscriptions**: Consider monthly plans for regular items\n6. **Cashback**: Use platform-specific offers and cashback\n\nWould you like me to help you find the best delivery options for your area?",
      general:
        "I can help you compare prices, find the best deals, optimize your shopping cart, and provide delivery tips. Try asking me about specific products, cart optimization, or use the quick action buttons!",
      error: "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.",
    },
    hi: {
      greeting:
        "नमस्ते! मैं आपका AI शॉपिंग असिस्टेंट हूं। मैं आपको सबसे अच्छे डील्स खोजने और पैसे बचाने के लिए आपकी कार्ट को ऑप्टिमाइज़ करने में मदद कर सकता हूं। आप क्या जानना चाहते हैं?",
      optimization: `आपकी कार्ट के आधार पर, मुझे कुछ बेहतरीन बचत के अवसर मिले हैं! ${optimizations.length > 0 ? `आप विभिन्न प्लेटफॉर्म पर अपनी खरीदारी को बांटकर ₹${optimizations[0]?.totalSavings || 0} तक बचा सकते हैं।` : "अपनी कार्ट में कुछ आइटम जोड़ें और मैं इसे ऑप्टिमाइज़ करने में आपकी मदद करूंगा!"}`,
      best_deals: "यहाँ आज के सबसे अच्छे डील्स हैं:\n\n🔥 **Zepto**: ताजी सब्जियों पर 50% छूट\n🔥 **Blinkit**: डेयरी उत्पादों पर 1 खरीदें 1 मुफ्त\n🔥 **Swiggy**: ₹199 से ऊपर के ऑर्डर पर मुफ्त डिलीवरी\n🔥 **Apollo**: दवाओं पर 20% छूट",
      cart_optimize: `मैं आपकी ${cartData.length} आइटम वाली कार्ट का विश्लेषण करता हूं:\n\n${cartData.length > 0 ? `💡 **ऑप्टिमाइज़ेशन टिप्स**:\n• डिलीवरी शुल्क को कम करने के लिए प्लेटफॉर्म के अनुसार आइटम को समूहित करें\n• समान आइटमों पर बंडल डील्स की जांच करें\n• बेहतर दरों के लिए बल्क खरीदारी पर विचार करें` : 'आपकी कार्ट खाली है! ऑप्टिमाइज़ेशन सुझावों के लिए आइटम जोड़ना शुरू करें।'}`,
      price_compare: "मैं आपको प्लेटफॉर्म के बीच कीमतों की तुलना करने में मदद कर सकता हूं!",
      delivery_tips: "🚚 **पैसे बचाने के स्मार्ट डिलीवरी टिप्स**:\n\n1. **बंडल ऑर्डर**: मुफ्त डिलीवरी के लिए आइटम को जोड़ें\n2. **समय**: तेज डिलीवरी के लिए ऑफ-पीक घंटों में ऑर्डर करें\n3. **स्थान**: बेहतर दरों के लिए अपना स्थान सटीक रूप से सेट करें",
      general:
        "मैं आपको कीमतों की तुलना करने, सबसे अच्छे डील्स खोजने और आपकी शॉपिंग कार्ट को ऑप्टिमाइज़ करने में मदद कर सकता हूं।",
      error: "मुझे खेद है, मुझे अभी आपके अनुरोध को संसाधित करने में परेशानी हो रही है। कृपया एक क्षण में फिर से कोशिश करें।",
    },
    bn: {
      greeting:
        "হ্যালো! আমি আপনার AI শপিং সহায়ক। আমি আপনাকে সেরা ডিল খুঁজে পেতে এবং অর্থ সাশ্রয় করতে আপনার কার্ট অপ্টিমাইজ করতে সাহায্য করতে পারি। আপনি কী জানতে চান?",
      optimization: `আপনার কার্টের ভিত্তিতে, আমি কিছু দুর্দান্ত সাশ্রয়ের সুযোগ পেয়েছি! ${optimizations.length > 0 ? `আপনি বিভিন্ন প্ল্যাটফর্মে আপনার কেনাকাটা ভাগ করে ₹${optimizations[0]?.totalSavings || 0} পর্যন্ত সাশ্রয় করতে পারেন।` : "আপনার কার্টে কিছু আইটেম যোগ করুন এবং আমি এটি অপ্টিমাইজ করতে সাহায্য করব!"}`,
      best_deals: "এখানে আজকের সেরা ডিলগুলি:\n\n🔥 **Zepto**: তাজা সবজিতে 50% ছাড়\n🔥 **Blinkit**: দুগ্ধজাত পণ্যে 1 কিনুন 1 বিনামূল্যে\n🔥 **Swiggy**: ₹199 এর উপরে অর্ডারে বিনামূল্যে ডেলিভারি",
      cart_optimize: `আমি আপনার ${cartData.length} আইটেমের কার্ট বিশ্লেষণ করি:\n\n${cartData.length > 0 ? `💡 **অপ্টিমাইজেশন টিপস**:\n• ডেলিভারি ফি কমাতে প্ল্যাটফর্ম অনুযায়ী আইটেম গ্রুপ করুন\n• একই রকম আইটেমে বান্ডেল ডিল চেক করুন` : 'আপনার কার্ট খালি! অপ্টিমাইজেশন পরামর্শের জন্য আইটেম যোগ করা শুরু করুন।'}`,
      price_compare: "আমি আপনাকে বিভিন্ন প্ল্যাটফর্মে দাম তুলনা করতে সাহায্য করতে পারি!",
      delivery_tips: "🚚 **টাকা বাঁচানোর স্মার্ট ডেলিভারি টিপস**:\n\n1. **বান্ডেল অর্ডার**: বিনামূল্যে ডেলিভারির জন্য আইটেম একত্রিত করুন\n2. **সময়**: দ্রুত ডেলিভারির জন্য অফ-পিক ঘণ্টায় অর্ডার করুন",
      general:
        "আমি আপনাকে দামের তুলনা করতে, সেরা ডিল খুঁজে পেতে এবং আপনার শপিং কার্ট অপ্টিমাইজ করতে সাহায্য করতে পারি।",
      error: "আমি দুঃখিত, আমি এখন আপনার অনুরোধ প্রক্রিয়া করতে সমস্যা হচ্ছে। অনুগ্রহ করে একটু পরে আবার চেষ্টা করুন।",
    },
  }

  const langResponses = responses[language as keyof typeof responses] || responses.en

  // Enhanced keyword matching for better responses
  const messageLower = message.toLowerCase()
  
  if (messageLower.includes("cart") || messageLower.includes("optimize") || messageLower.includes("optimization")) {
    return langResponses.cart_optimize
  } else if (messageLower.includes("best") && (messageLower.includes("deal") || messageLower.includes("offer"))) {
    return langResponses.best_deals
  } else if (messageLower.includes("price") && (messageLower.includes("compare") || messageLower.includes("comparison"))) {
    return langResponses.price_compare
  } else if (messageLower.includes("delivery") && (messageLower.includes("tip") || messageLower.includes("advice"))) {
    return langResponses.delivery_tips
  } else if (messageLower.includes("hello") || messageLower.includes("hi") || messageLower.includes("namaste")) {
    return langResponses.greeting
  } else {
    return langResponses.general
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, userId, language, conversationHistory } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Get user's cart data
    const cartData = userId ? await getUserCart(userId) : []

    // Calculate cart optimizations
    const optimizations = await getCartOptimization(cartData)

    // Generate AI response
    const aiResponse = await generateAIResponse(message, language || "en", optimizations, cartData)

    return NextResponse.json({
      message: aiResponse,
      optimizations: optimizations.slice(0, 3), // Return top 3 optimizations
      timestamp: new Date().toISOString(),
      cartSummary: {
        itemCount: cartData.length,
        totalValue: cartData.reduce((sum, item) => sum + (item.price || 0), 0),
        platforms: [...new Set(cartData.map(item => item.platform))]
      }
    })
  } catch (error) {
    console.error("AI Assistant API error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
