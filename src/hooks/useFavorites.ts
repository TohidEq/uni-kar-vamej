import { useState, useEffect } from "react";
// import { JobItem, FreelancerItem } from "@/types/itemTypes";

export const useFavorites = () => {
  const [favoriteItems, setFavoriteItems] = useState<
    (JobItem | FreelancerItem)[]
  >([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteItems");
    if (storedFavorites) {
      try {
        const parsedFavorites: (JobItem | FreelancerItem)[] =
          JSON.parse(storedFavorites);
        setFavoriteItems(parsedFavorites);
      } catch (err) {
        console.error("Error parsing favorite items from localStorage:", err);
        setFavoriteItems([]);
      }
    }
  }, []);

  const toggleFavorite = (item: JobItem | FreelancerItem) => {
    if (!item.url) return;

    const itemId = item.url; // استفاده از url به‌عنوان شناسه یکتا
    const isAlreadyFavorite = favoriteItems.some((fav) => fav.url === itemId);

    let updatedFavorites: (JobItem | FreelancerItem)[];
    if (isAlreadyFavorite) {
      // حذف آیتم از لیست
      updatedFavorites = favoriteItems.filter((fav) => fav.url !== itemId);
    } else {
      // اضافه کردن آیتم به لیست
      updatedFavorites = [...favoriteItems, item];
    }

    setFavoriteItems(updatedFavorites);
    try {
      localStorage.setItem("favoriteItems", JSON.stringify(updatedFavorites));
    } catch (err) {
      console.error("Error saving favorite items to localStorage:", err);
    }
  };

  return { favoriteItems, toggleFavorite };
};
