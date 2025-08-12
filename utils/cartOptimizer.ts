// utils/cartOptimizer.ts

export type Item = {
  name: string;
};

export type PriceData = {
  item: string;
  platform: string;
  price: number;
  delivery_fee: number;
  offer?: string;
};

export type OptimizedCartResult = {
  breakdown: { platform: string; items: string[]; subtotal: number; delivery_fee: number }[];
  total: number;
  savings: number;
  message: string;
};

export function optimizeCart(items: Item[], prices: PriceData[]): OptimizedCartResult {
  // Group all prices by item
  const itemPrices: Record<string, PriceData[]> = {};
  for (const item of items) {
    itemPrices[item.name] = prices.filter(p => p.item === item.name);
  }

  // Find the cheapest platform for each item
  const bestForEach: { item: string; platform: string; price: number; delivery_fee: number }[] = [];
  for (const item of items) {
    const options = itemPrices[item.name];
    if (!options || options.length === 0) continue;
    const cheapest = options.reduce((a, b) => (a.price < b.price ? a : b));
    bestForEach.push({
      item: item.name,
      platform: cheapest.platform,
      price: cheapest.price,
      delivery_fee: cheapest.delivery_fee,
    });
  }

  // Group items by platform
  const platformMap: Record<string, { items: string[]; subtotal: number; delivery_fee: number }> = {};
  for (const entry of bestForEach) {
    if (!platformMap[entry.platform]) {
      platformMap[entry.platform] = { items: [], subtotal: 0, delivery_fee: entry.delivery_fee };
    }
    platformMap[entry.platform].items.push(entry.item);
    platformMap[entry.platform].subtotal += entry.price;
  }

  // Calculate total and savings
  const breakdown = Object.entries(platformMap).map(([platform, data]) => ({
    platform,
    items: data.items,
    subtotal: data.subtotal,
    delivery_fee: data.delivery_fee,
  }));
  const total = breakdown.reduce((sum, b) => sum + b.subtotal + b.delivery_fee, 0);

  // Calculate cost if all bought from the single cheapest platform (for all items)
  let singlePlatformTotal = Infinity;
  let singlePlatform = "";
  for (const platform of Object.keys(platformMap)) {
    const allItems = items.map(i => prices.find(p => p.item === i.name && p.platform === platform));
    if (allItems.some(i => !i)) continue; // Not all items available
    const subtotal = allItems.reduce((sum, p) => sum + (p?.price || 0), 0);
    const delivery = allItems[0]?.delivery_fee || 0;
    const totalCost = subtotal + delivery;
    if (totalCost < singlePlatformTotal) {
      singlePlatformTotal = totalCost;
      singlePlatform = platform;
    }
  }
  const savings = singlePlatformTotal === Infinity ? 0 : singlePlatformTotal - total;

  const message =
    breakdown.length > 1
      ? `Buy ${breakdown
          .map(b => `${b.items.length} item${b.items.length > 1 ? "s" : ""} from ${b.platform}`)
          .join(" and ")} — total ₹${total} (save ₹${Math.abs(savings)} compared to buying all from one platform).`
      : `Buy all from ${breakdown[0].platform} — total ₹${total}.`;

  return { breakdown, total, savings: Math.abs(savings), message };
}