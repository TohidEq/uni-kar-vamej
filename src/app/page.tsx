"use client";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import SearchInput from "@/components/SearchInput";

export default function Home() {
  const [hasFavorites, setHasFavorites] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (Array.isArray(favorites) && favorites.length > 0) {
      setHasFavorites(true);
    }
  }, []);

  return (
    <div className="main min-h-screen flex flex-col">
      <Navbar enableFavoriteLink={true} />

      {/* محتوای اصلی در یک‌سوم بالای صفحه */}
      <div
        className="flex flex-col items-center justify-start flex-grow px-4 text-center pt-[8vh] md:pt-[10vh]"
        dir="rtl"
      >
        <div className="w-full max-w-md">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-4">
            چه شغل یا پروژه‌ای تو ذهنته؟
          </h2>

          <SearchInput />

          {!hasFavorites && (
            <div className="mt-4 text-sm flex items-center gap-1  justify-center">
              <Link
                href="/favorites"
                className="flex items-center gap-1 border-b border-gray-400 pb-[1px] group"
              >
                <Heart
                  className="w-4 h-4 text-red-500 animate-pulse transition-all duration-300 group-hover:scale-110 group-hover:animate-[pulse_2s_infinite]"
                  fill="currentColor"
                />
                <span className="text-red-500">علاقمندی‌هات</span>
              </Link>
              <span>رو ببین</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
