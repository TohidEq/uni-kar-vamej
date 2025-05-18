"use client";

import { useEffect, useState } from "react";
import { Loader, Moon, Sun } from "lucide-react";

const lightThemes = [
  "light",
  "retro",
  "fantasy",
  "emerald",
  "silk",
  "corporate",
  "autumn",
];
const darkThemes = [
  "dark",
  "business",
  "luxury",
  "forest",
  "abyss",
  "dracula",
  "halloween",
];

export default function ChangeTheme() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const html = document.documentElement;
    const storedTheme = localStorage.getItem("theme");
    const currentTheme = storedTheme || html.dataset.theme || "light";

    setIsDark(darkThemes.includes(currentTheme));
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;

    // انتخاب تم رندوم از دسته مقابل
    const newTheme = isDark
      ? lightThemes[Math.floor(Math.random() * lightThemes.length)]
      : darkThemes[Math.floor(Math.random() * darkThemes.length)];

    html.dataset.theme = newTheme;
    localStorage.setItem("theme", newTheme);
    setIsDark(!isDark);
  };

  if (!mounted)
    return <Loader size={20} className="animate-spin text-gray-500" />;

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-transform duration-300 hover:scale-110 hover:rotate-12 cursor-pointer"
      aria-label="تغییر تم"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
