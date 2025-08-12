// app/compare/page.tsx
import { notFound } from "next/navigation";
import { fetchPricesAPI } from "@/lib/api";
import PlatformCard from "@/components/PlatformCard";
import { optimizeCart, Item, PriceData } from "@/utils/cartOptimizer";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ item?: string; category?: string; location?: string }>;
}) {
  const params = await searchParams;
  const item = params?.item?.trim();
  const category = params?.category as string | undefined;
  const location = params?.location?.trim();

  if (!item || !category || !location) return notFound();

  // For now, single item; structure for multi-item in future
  const results = await fetchPricesAPI({ item, category, location });
  const items: Item[] = [{ name: item }];
  const prices: PriceData[] = results.map((r: any) => ({
    item: r.item,
    platform: r.platform,
    price: r.price,
    delivery_fee: r.delivery_fee,
    offer: r.offer,
  }));
  const optimized = optimizeCart(items, prices);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">
        Results for: <span className="text-blue-600">{item}</span> in <span className="text-green-600 capitalize">{category}</span> @ <span className="text-purple-600">{location}</span>
      </h1>
      {results.length === 0 ? (
        <p className="mt-4 text-gray-500">Not available in your location.</p>
      ) : (
        <div className="grid gap-4">
          {results.map((r: any) => (
            <PlatformCard key={r.platform} {...r} />
          ))}
        </div>
      )}
      {/* Cart Optimization Result */}
      {results.length > 0 && (
        <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <div className="font-semibold mb-2">🛒 Best Cart Combo to Save More</div>
          <div>{optimized.message}</div>
          <ul className="mt-2 ml-4 list-disc text-sm">
            {optimized.breakdown.map(b => (
              <li key={b.platform}>
                <span className="font-medium">{b.platform}:</span> {b.items.join(", ")} (Subtotal: ₹{b.subtotal}, Delivery: ₹{b.delivery_fee})
              </li>
            ))}
          </ul>
          <div className="mt-2 font-bold">Final Amount: ₹{optimized.total}</div>
          {optimized.savings > 0 && (
            <div className="text-green-700 font-semibold">You save ₹{optimized.savings}!</div>
          )}
        </div>
      )}
      {/* AI Assistant Message */}
      {results.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
          <div className="font-semibold mb-2">🤖 AI Assistant Suggestion</div>
          <div>{optimized.message}</div>
        </div>
      )}
    </main>
  );
}
