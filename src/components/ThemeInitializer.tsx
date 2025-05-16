"use client";

import { useEffect } from "react";

const ThemeInitializer = () => {
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      document.documentElement.setAttribute("data-theme", storedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "dark"); // default
      localStorage.setItem("theme", "dark");
    }
  }, []);

  return null;
};

export default ThemeInitializer;
