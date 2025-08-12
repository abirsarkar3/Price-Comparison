"use client";

import { useState } from "react";

function SearchBar() {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.href = `/compare?query=${encodeURIComponent(query)}`;
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search items..."
        className="border border-gray-300 px-4 py-2 rounded w-full"
      />
      <button type="submit" className="bg-black text-white px-4 py-2 rounded">
        Search
      </button>
    </form>
  );
}

export default SearchBar;
