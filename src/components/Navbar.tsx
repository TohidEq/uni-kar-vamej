"use client";

import ChangeTheme from "./ChangeTheme";
import { Heart } from "lucide-react";
import SiteIcon from "./SiteIcon";
import Link from "next/link";

type Props = {
  enableFavoriteLink?: boolean;
};

import React, { memo } from "react";

function Navbar({ enableFavoriteLink = false }: Props) {
  return (
    <nav className="navbar container mx-auto my-container">
      <div className="flex w-full items-center justify-between md:p-4">
        {/* راست: لوگو */}
        <div className="flex items-center ">
          <SiteIcon />
        </div>

        {/* چپ: علاقه‌مندی‌ها و دکمه تم */}
        <div className="flex items-center gap-4">
          {enableFavoriteLink && (
            <Link
              href="/favorites"
              className="items-center gap-1 text-sm group custom-link-underline flex"
            >
              <Heart
                size={20}
                className="text-red-500 animate-pulse transition-all duration-300 group-hover:animate-pulse-slow group-hover:scale-125 sm:me-1"
              />
              <span className="navbar__favorites__text hidden sm:inline-block transition-opacity duration-500 group-hover:opacity-80">
                علاقه‌مندی‌ها
              </span>
            </Link>
          )}
          <ChangeTheme />
        </div>
      </div>
    </nav>
  );
}

export default memo(Navbar);
