"use client";
import { useState, useCallback } from "react";
// import { JobItem, FreelancerItem } from "@/types/itemTypes";

interface FetchOneResult {
  data: JobItem | FreelancerItem | null;
  isLoading: boolean;
  error: string | null;
}

export const useOneSearchResult = () => {
  const [result, setResult] = useState<FetchOneResult>({
    data: null,
    isLoading: false,
    error: null,
  });

  const fetchOneResult = useCallback(async (url: string, siteType: string) => {
    setResult({ data: null, isLoading: true, error: null });

    try {
      const response = await fetch("/api/get-one", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, siteType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در دریافت اطلاعات");
      }

      const { result: fetchedData } = await response.json();
      if (!fetchedData) {
        throw new Error("داده‌ای برای این URL یافت نشد");
      }

      setResult({ data: fetchedData, isLoading: false, error: null });
    } catch (error) {
      console.error("خطا در فچ داده:", error);
      setResult({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error.message : "خطا در دریافت اطلاعات",
      });
    }
  }, []);

  return { ...result, fetchOneResult };
};
