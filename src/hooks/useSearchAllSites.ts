"use client";
import { getFileNameOfWord } from "@/utils/wordsUtils";
import { useState, useEffect } from "react";

const SITES_CONFIG = {
  karlancer: { type: "freelancer" as const, default: [] as FreelancerItem[] },
  ponisha: { type: "freelancer" as const, default: [] as FreelancerItem[] },
  jobinja: { type: "job" as const, default: [] as JobItem[] },
  jobvision: { type: "job" as const, default: [] as JobItem[] },
};

export type SiteName = keyof typeof SITES_CONFIG;

export interface SearchResults {
  karlancer: FreelancerItem[] | null;
  ponisha: FreelancerItem[] | null;
  jobinja: JobItem[] | null;
  jobvision: JobItem[] | null;
}

interface ApiSearchResponse {
  jobs: JobItem[];
  freelancers: FreelancerItem[];
}

interface SiteSpecificError extends Error {
  site?: SiteName;
}

export function useSearchAllSites(
  keyword: string,
  ignoredSites: SiteName[] = []
) {
  const [results, setResults] = useState<SearchResults>({
    karlancer: null,
    ponisha: null,
    jobinja: null,
    jobvision: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [endSearch, setEndSearch] = useState(false);
  const [counterSearchEnd, setCounterSearchEnd] = useState(0);

  useEffect(() => {
    if (
      counterSearchEnd ===
      Object.keys(SITES_CONFIG).length - ignoredSites.length
    ) {
      setEndSearch(true);
    }
  }, [counterSearchEnd]);

  useEffect(() => {
    if (!keyword.trim()) {
      setResults({
        karlancer: null,
        ponisha: null,
        jobinja: null,
        jobvision: null,
      });
      setIsLoading(false);
      setError(null);
      setCounterSearchEnd(0);
      setEndSearch(false);
      return;
    }

    const siteNamesToFetch = (Object.keys(SITES_CONFIG) as SiteName[]).filter(
      (site) => !ignoredSites.includes(site)
    );

    if (siteNamesToFetch.length === 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setResults({
      karlancer: null,
      ponisha: null,
      jobinja: null,
      jobvision: null,
    });
    setError(null);
    setCounterSearchEnd(0);
    setEndSearch(false);

    const { isExist, fileName } = getFileNameOfWord(
      keyword.replaceAll("+", " ")
    );

    if (isExist && fileName) {
      fetch(
        `https://raw.githubusercontent.com/TohidEq/uni-kar-vamej-data/main/data/${fileName}`
      )
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to fetch from GitHub`);
          return res.json() as Promise<ApiSearchResponse>;
        })
        .then((data) => {
          setResults({
            karlancer: data.freelancers.filter(
              (item) => item.type === "karlancer"
            ),
            ponisha: data.freelancers.filter((item) => item.type === "ponisha"),
            jobinja: data.jobs.filter((item) => item.type === "jobinja"),
            jobvision: data.jobs.filter((item) => item.type === "jobvision"),
          });
        })
        .catch((err) => {
          console.error("GitHub fetch error:", err.message);
          setError(err.message);
        })
        .finally(() => {
          setIsLoading(false);
          setEndSearch(true);
        });
    } else {
      siteNamesToFetch.forEach((siteName) => {
        fetch(`/api/search?keyword=${keyword}&allowSites=${siteName}`)
          .then((res) => {
            if (!res.ok) {
              const err: SiteSpecificError = new Error(
                `Failed to fetch ${siteName} (${res.status})`
              );
              err.site = siteName;
              throw err;
            }
            return res.json() as Promise<ApiSearchResponse>;
          })
          .then((data) => {
            const config = SITES_CONFIG[siteName];
            const siteData =
              config.type === "freelancer" ? data.freelancers : data.jobs;
            setResults((prev) => ({ ...prev, [siteName]: siteData }));
          })
          .catch((err: Error | SiteSpecificError) => {
            const site = (err as SiteSpecificError).site || siteName;
            console.error(`Error fetching ${site}:`, err.message);
            setError((prev) =>
              prev ? `${prev}\n${err.message}` : err.message
            );
            setResults((prev) => ({ ...prev, [site]: null }));
          })
          .finally(() => {
            setCounterSearchEnd((prev) => prev + 1);
          });
      });
    }
  }, [keyword, ignoredSites]);

  return { results, isLoading, error, endSearch };
}
