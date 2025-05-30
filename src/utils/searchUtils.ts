// import { JobItem, FreelancerItem } from "@/types/itemTypes";

type SortOrderType = "none" | "asc" | "desc";

export const parsePrice = (
  priceInput: string | number | undefined | null
): number | null => {
  if (priceInput === undefined || priceInput === null) return null;

  if (typeof priceInput === "number") {
    return isNaN(priceInput) ? null : priceInput;
  }

  const nonNumericKeywords = [
    "توافقی",
    "مطلوب",
    "نامشخص",
    "negotiable",
    "n/a",
    "na",
    "to be agreed",
    "upon agreement",
  ];
  const lowerCasePriceInput = priceInput.toLowerCase();
  if (
    nonNumericKeywords.some((keyword) => lowerCasePriceInput.includes(keyword))
  ) {
    return null;
  }

  // بهینه‌سازی: حذف regex و استفاده از روش ساده‌تر
  const numericString = priceInput.replace(/[^0-9.]/g, "");
  const price = parseFloat(numericString);
  return isNaN(price) ? null : price;
};

export const sortItemsByPrice = <T extends { salary?: string | number }>(
  items: T[],
  order: SortOrderType
): T[] => {
  if (order === "none") return items;

  // کش کردن قیمت‌های پارس‌شده
  const priceCache = new Map<T, number | null>();
  const getCachedPrice = (item: T) => {
    if (!priceCache.has(item)) {
      priceCache.set(item, parsePrice(item.salary));
    }
    return priceCache.get(item);
  };

  return [...items].sort((a, b) => {
    const priceA = getCachedPrice(a);
    const priceB = getCachedPrice(b);

    if (priceA === null && priceB === null) return 0;
    if (priceA === null) return 1;
    if (priceB === null) return -1;
    if (priceA !== undefined && priceB !== undefined)
      return order === "asc" ? priceA - priceB : priceB - priceA;
    return 0;
  });
};
