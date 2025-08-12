interface CartItem {
  id: string
  name: string
  quantity: number
  platforms: {
    [platform: string]: {
      price: number
      deliveryCharge: number
      coupon?: string
      available: boolean
    }
  }
}

interface OptimizationResult {
  platform: string
  items: string[]
  totalCost: number
  savings: number
  totalSavings?: number
}

export async function getCartOptimization(cartItems: CartItem[]): Promise<OptimizationResult[]> {
  if (!cartItems || cartItems.length === 0) {
    return []
  }

  const platforms = [
    "Zepto",
    "Blinkit",
    "Swiggy Instamart",
    "BigBasket",
    "Zomato",
    "Swiggy",
    "Apollo 24/7",
    "PharmEasy",
    "Tata 1mg",
  ]

  // Calculate best distribution across platforms
  const optimizations: OptimizationResult[] = []

  // Find the cheapest platform for each item
  const itemOptimizations = cartItems.map((item) => {
    let cheapestPlatform = ""
    let cheapestCost = Number.POSITIVE_INFINITY
    let originalCost = 0

    Object.entries(item.platforms).forEach(([platform, data]) => {
      if (data.available) {
        const totalCost = data.price * item.quantity + data.deliveryCharge
        if (totalCost < cheapestCost) {
          cheapestCost = totalCost
          cheapestPlatform = platform
        }
        // Use first available platform as baseline for savings calculation
        if (originalCost === 0) {
          originalCost = totalCost
        }
      }
    })

    return {
      item,
      cheapestPlatform,
      cheapestCost,
      originalCost,
      savings: originalCost - cheapestCost,
    }
  })

  // Group items by their cheapest platform
  const platformGroups: { [platform: string]: typeof itemOptimizations } = {}

  itemOptimizations.forEach((opt) => {
    if (!platformGroups[opt.cheapestPlatform]) {
      platformGroups[opt.cheapestPlatform] = []
    }
    platformGroups[opt.cheapestPlatform].push(opt)
  })

  // Create optimization suggestions
  Object.entries(platformGroups).forEach(([platform, items]) => {
    const totalCost = items.reduce((sum, item) => sum + item.cheapestCost, 0)
    const totalSavings = items.reduce((sum, item) => sum + item.savings, 0)

    optimizations.push({
      platform,
      items: items.map((item) => item.item.name),
      totalCost,
      savings: totalSavings,
    })
  })

  // Calculate total savings across all optimizations
  const totalSavings = optimizations.reduce((sum, opt) => sum + opt.savings, 0)
  optimizations.forEach((opt) => {
    opt.totalSavings = totalSavings
  })

  // Sort by savings (highest first)
  return optimizations.sort((a, b) => b.savings - a.savings)
}

// Mock function to simulate cart optimization with delivery charge considerations
export function optimizeCartWithDelivery(cartItems: CartItem[]): OptimizationResult[] {
  // This would implement more sophisticated logic considering:
  // - Minimum order values for free delivery
  // - Bulk discounts
  // - Platform-specific coupons
  // - Delivery time preferences

  return getCartOptimization(cartItems)
}
