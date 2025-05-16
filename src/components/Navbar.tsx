"use client";
import React from "react";
import ChangeTheme from "./ChangeTheme";
import { Heart, Loader } from "lucide-react";
import SiteIcon from "./SiteIcon";

type Props = {
  enableFavoriteLink?: boolean;
};

function Navbar({ enableFavoriteLink = false }: Props) {
  const changeThemeBtn: boolean = ChangeTheme() !== null;
  return (
    <nav className="navbar container mx-auto my-container">
      <div className="flex w-full items-center justify-between md:p-4">
        {/* راست: لوگو */}
        <div className="flex items-center">
          <SiteIcon />
        </div>

        {/* چپ: علاقه‌مندی‌ها و دکمه تم */}
        <div className="flex items-center gap-4">
          {enableFavoriteLink && (
            <a
              href="/favorites"
              className="flex items-center gap-1 text-sm group"
            >
              <Heart
                size={20}
                className="text-red-500 animate-pulse transition-all duration-300 group-hover:animate-pulse-slow group-hover:scale-125 sm:me-1"
              />
              <span className="navbar__favorites__text hidden sm:inline-block transition-opacity duration-500 group-hover:opacity-80">
                علاقه‌مندی‌ها
              </span>
            </a>
          )}
          {changeThemeBtn ? (
            <ChangeTheme />
          ) : (
            <Loader size={20} className="animate-spin text-gray-500" />
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
