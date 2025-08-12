"use client";

import { Badge } from "@/components/ui/badge";
import { getTrendingSearches } from "@/lib/mockSearchResults";
import { useRouter } from "next/navigation";

interface TrendingSearchesProps {
  category: string;
  location?: string;
}

export function TrendingSearches({ category, location }: TrendingSearchesProps) {
  const router = useRouter();
  const trendingItems = getTrendingSearches(category);

  const handleSearch = (item: string) => {
    const locationParam = location ? `&location=${encodeURIComponent(location)}` : "";
    router.push(`/search?q=${encodeURIComponent(item)}&category=${category}${locationParam}`);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Trending in {category.charAt(0).toUpperCase() + category.slice(1)}
      </h3>
      <div className="flex flex-wrap gap-2">
        {trendingItems.map((item) => (
          <Badge
            key={item}
            variant="outline"
            className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
            onClick={() => handleSearch(item)}
          >
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
} 