"use client";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import SearchInput from "@/components/SearchInput";

export default function Home() {
  const [hasFavorites, setHasFavorites] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favoriteItems") || "[]");
    if (Array.isArray(favorites) && favorites.length > 0) {
      setHasFavorites(true);
    }
  }, []);
  // TODO: font fix for main title and Shoaar and other...
  return (
    <div className="main min-h-screen flex flex-col">
      <Navbar enableFavoriteLink={hasFavorites} />

      {/* محتوای اصلی در یک‌سوم بالای صفحه */}
      <div
        className="flex flex-col items-center justify-start flex-grow px-4 text-center pt-[10vh] md:pt-[20vh]"
        dir="rtl"
      >
        <div className="w-full max-w-md">
          {/* شعار سایت */}
          <p className="text-sm md:text-base mb-2 font-medium">
            با چند کلمه، فرصت‌هاتو پیدا کن!
          </p>

          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-4">
            چه شغل یا پروژه‌ای تو ذهنته؟
          </h2>

          <SearchInput />

          {hasFavorites && (
            <div className="mt-4 text-sm flex items-center gap-1 justify-center">
              <Link
                href="/favorites"
                className="flex items-center gap-1 border-b border-blue-600/40 pb-[1px] group custom-link-underline"
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
