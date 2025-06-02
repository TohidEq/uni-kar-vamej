"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";

export default function SearchInput({
  no_mx_auto = false,
  default_value = null,
}: {
  no_mx_auto?: boolean;
  default_value?: string | null;
}) {
  const [query, setQuery] = useState(default_value || "");
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const router = useRouter();

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsLoading(true); // Start loading

    // جایگزین کردن فاصله با + برای URL
    const formattedQuery = trimmed.replace(/\s+/g, "+");
    router.push(`/search/${formattedQuery}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      // Prevent double trigger if already loading
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className={`w-full max-w-md ${no_mx_auto ? "" : "mx-auto"}`} dir="rtl">
      <div className="form-control flex flex-row w-full rounded-xl">
        <input
          type="search"
          id="search-input"
          placeholder="جستجو کن..."
          className="input input-bordered rounded-3xl flex-grow"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          dir="rtl"
          disabled={isLoading} // Disable input while loading
        />
        <button
          className="btn btn-primary rounded-3xl px-3 ms-2"
          onClick={handleSearch}
          aria-label="جستجو"
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? (
            <FaSpinner className="w-5 h-5 animate-spin" /> // Show spinner if loading
          ) : (
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}