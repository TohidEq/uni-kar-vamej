"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ChangeTheme() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const html = document.documentElement;
    const storedTheme = localStorage.getItem("theme");

    if (
      storedTheme === "dark" ||
      (!storedTheme && html.dataset.theme === "dark")
    ) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const newTheme = isDark ? "light" : "dark";

    html.dataset.theme = newTheme;
    localStorage.setItem("theme", newTheme);
    setIsDark(!isDark);
  };

  if (!mounted) return null;

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
