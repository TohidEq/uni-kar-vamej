"use client";
// import { useState, useEffect } from "react';
import { useEffect, useState } from "react";
import { useSearchAllSites, SiteName } from "./useSearchAllSites";
// import { JobItemType, FreelancerItem } from '@/types';

interface CachedSearchResult {
  results: Partial<{
    jobinja: JobItem[] | null;
    jobvision: JobItem[] | null;
    karlancer: FreelancerItem[] | null;
    punisha: FreelancerItem[] | null;
  }>;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 دقیقه

export const useCachedSearch = (keyword: string, ignoredSites: SiteName[]) => {
  const [cache, setCache] = useState<Map<string, CachedSearchResult>>(
    new Map()
  );
  const { results, isLoading, error } = useSearchAllSites(
    keyword,
    ignoredSites
  );

  useEffect(() => {
    const cacheKey = `${keyword}:${ignoredSites.sort().join(",")}`;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return;
    }

    if (results) {
      setCache((prev) => {
        const newCache = new Map(prev);
        newCache.set(cacheKey, { results, timestamp: Date.now() });
        return newCache;
      });
    }
  }, [keyword, ignoredSites, results]);

  const cacheKey = `${keyword}:${ignoredSites.sort().join(",")}`;
  const cachedResults = cache.get(cacheKey)?.results;

  return {
    results: cachedResults || results,
    isLoading,
    error,
  };
};
