import React, { useState } from "react";
import axios from "axios";

const API_URL = "https://fetchprices-v2tzcimlea-uc.a.run.app";

const categories = [
  { id: "groceries", label: "Groceries" },
  { id: "food", label: "Food" },
  { id: "meds", label: "Medicines" }
];

export default function PriceComparison() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("groceries");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query) return alert("Enter a search term");
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        params: { query, category }
      });

      // ✅ Clean invalid prices and broken links
      const cleanedData = response.data
        .filter(item => item.link && !item.link.includes("404")) // Remove broken links
        .map(item => ({
          ...item,
          price:
            item.price && item.price.match(/₹\d+/)
              ? item.price
              : "Price Unavailable"
        }));

      setResults(cleanedData);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch data");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-slate-900 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Price Comparison</h1>

      {/* ✅ Only ONE Search Bar (removed other two) */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search for an item..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded-lg w-64"
        />
        <button
          onClick={handleSearch}
          className="ml-3 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Search
        </button>
      </div>

      {/* ✅ Category Tabs */}
      <div className="flex justify-center mb-4">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`px-4 py-2 rounded-lg mx-2 ${
              category === cat.id ? "bg-blue-500 text-white" : "bg-white border"
            }`}
            onClick={() => setCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ✅ Loading */}
      {loading && <p className="text-center text-blue-500">Loading...</p>}

      {/* ✅ Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {results.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center"
          >
            {/* Store Logo */}
            {item.logo && (
              <img src={item.logo} alt={item.store} className="h-10 mb-2" />
            )}
            <h2 className="text-lg font-semibold mb-2">{item.name}</h2>
            <p className="text-green-600 font-bold">{item.price}</p>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 bg-blue-500 text-white px-3 py-1 rounded"
            >
              View on {item.store}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
