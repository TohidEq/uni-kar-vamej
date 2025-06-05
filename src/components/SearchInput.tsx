"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaSpinner } from "react-icons/fa";

interface SearchInputProps {
  no_mx_auto?: boolean;
  default_value?: string | null;
}

export default function SearchInput({
  no_mx_auto = false,
  default_value = null,
}: SearchInputProps) {
  const [query, setQuery] = useState(default_value || "");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setQuery(default_value || "");
  }, [default_value]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleSearch = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setIsLoading(true);
    const formattedQuery = encodeURIComponent(
      trimmedQuery.replace(/\s+/g, "+")
    );
    const targetPath = `/search/${formattedQuery}`;

    if (targetPath === pathname) {
      router.refresh();
    } else {
      router.push(targetPath);
    }

    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      timeoutRef.current = null;
    }, 700);
  }, [query, pathname, router]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
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
          disabled={isLoading}
        />
        <button
          className="btn btn-primary rounded-3xl px-3 ms-2"
          onClick={handleSearch}
          aria-label="جستجو"
          disabled={isLoading}
        >
          {isLoading ? (
            <FaSpinner className="w-5 h-5 animate-spin" />
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
