// components/price-comparison-card.tsx
import React from "react";

interface PriceData {
  platform: string;
  price: number | string;
  deliveryCharge: number;
  link: string;
}

interface PriceComparisonCardProps {
  product: {
    name: string;
    prices: PriceData[];
  };
}

const PriceComparisonCard: React.FC<PriceComparisonCardProps> = ({ product }) => {
  // Filter out invalid prices (e.g., strings like "Price Unavailable")
  const validPrices = product.prices.filter(
    (p) => typeof p.price === "number" && typeof p.deliveryCharge === "number"
  );

  // Calculate cheapest platform
  const cheapestTotal = validPrices.length
    ? Math.min(...validPrices.map((p) => p.price + p.deliveryCharge))
    : null;

  const recommendedPlatform = validPrices.find(
    (p) => p.price + p.deliveryCharge === cheapestTotal
  );

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-xl p-4 mb-6 shadow-md bg-white dark:bg-[#111111] transition-all">
      <h2 className="text-xl font-semibold mb-3 text-black dark:text-white">
        {product.name}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {product.prices.map((priceData, index) => {
          const isRecommended =
            recommendedPlatform &&
            typeof priceData.price === "number" &&
            typeof priceData.deliveryCharge === "number" &&
            priceData.price + priceData.deliveryCharge === cheapestTotal;

          return (
            <div
              key={index}
              className={`border rounded-lg p-4 transition-all ${
                isRecommended
                  ? "border-green-500 bg-green-100 dark:bg-green-900"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            >
              <h3 className="text-lg font-bold text-black dark:text-white">
                {priceData.platform}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Price:{" "}
                <span className="text-base font-semibold text-black dark:text-white">
                  {typeof priceData.price === "number"
                    ? `₹${priceData.price}`
                    : "Unavailable"}
                </span>
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Delivery:{" "}
                {typeof priceData.deliveryCharge === "number"
                  ? `₹${priceData.deliveryCharge}`
                  : "N/A"}
              </p>

              {typeof priceData.price === "number" &&
              typeof priceData.deliveryCharge === "number" ? (
                <p className="text-sm font-medium text-black dark:text-white mt-1">
                  Total: ₹{priceData.price + priceData.deliveryCharge}
                </p>
              ) : (
                <p className="text-sm font-medium text-gray-500 mt-1">
                  Total: N/A
                </p>
              )}

              {isRecommended && (
                <div className="mt-2 inline-block bg-green-500 text-white px-3 py-1 rounded-full text-xs">
                  Recommended
                </div>
              )}

              {priceData.link && (
                <a
                  href={priceData.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  View on {priceData.platform}
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PriceComparisonCard;
