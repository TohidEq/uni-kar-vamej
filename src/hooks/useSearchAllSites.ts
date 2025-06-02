"use client";
import { getFileNameOfWord } from "@/utils/wordsUtils";
// src/hooks/useSearchAllSites.ts
import { useState, useEffect, useMemo, useRef } from "react";

const SITES_CONFIG = {
  karlancer: { type: "freelancer" as const, default: [] as FreelancerItem[] },
  punisha: { type: "freelancer" as const, default: [] as FreelancerItem[] },
  jobinja: { type: "job" as const, default: [] as JobItem[] },
  jobvision: { type: "job" as const, default: [] as JobItem[] },
};

export type SiteName = keyof typeof SITES_CONFIG;

export interface SearchResults {
  karlancer: FreelancerItem[] | null;
  punisha: FreelancerItem[] | null;
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
    punisha: null,
    jobinja: null,
    jobvision: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const firstSuccessProcessedRef = useRef(false);
  const pendingRequestsRef = useRef(0);

  const stableIgnoredSites = useMemo(
    () => ignoredSites.join(","),
    [ignoredSites]
  );

  useEffect(() => {
    const currentIgnoredSites = stableIgnoredSites
      ? (stableIgnoredSites.split(",") as SiteName[])
      : [];

    if (!keyword.trim()) {
      setResults({
        karlancer: null,
        punisha: null,
        jobinja: null,
        jobvision: null,
      });
      setIsLoading(false);
      setError(null);
      firstSuccessProcessedRef.current = false;
      pendingRequestsRef.current = 0;
      return;
    }

    setResults({
      karlancer: null,
      punisha: null,
      jobinja: null,
      jobvision: null,
    });
    setIsLoading(true);
    setError(null);
    firstSuccessProcessedRef.current = false;

    const siteNamesToFetch = (Object.keys(SITES_CONFIG) as SiteName[]).filter(
      (site) => !currentIgnoredSites.includes(site)
    );

    if (siteNamesToFetch.length === 0) {
      setIsLoading(false);
      pendingRequestsRef.current = 0;
      return;
    }

    pendingRequestsRef.current = siteNamesToFetch.length;

    const { isExist, fileName } = getFileNameOfWord(
      keyword.replaceAll("+", " ")
    );

    if (isExist && fileName) {
      fetch(
        `https://raw.githubusercontent.com/TohidEq/uni-kar-vamej-data/main/data/${fileName}`
      )
        .then((res) => {
          if (!res.ok) {
            const fetchError = new Error(`Failed to fetch data from GitHub`);
            throw fetchError;
          }
          return res.json() as Promise<ApiSearchResponse>;
        })
        .then((data: ApiSearchResponse) => {
          setResults({
            karlancer: data.freelancers.filter(
              (item) => item.type == "karlancer"
            ),
            punisha: data.freelancers.filter((item) => item.type == "punisha"),
            jobinja: data.jobs.filter((item) => item.type == "jobinja"),
            jobvision: data.jobs.filter((item) => item.type == "jobvision"),
          });

          if (!firstSuccessProcessedRef.current) {
            setIsLoading(false);
            firstSuccessProcessedRef.current = true;
          }
        })
        .catch((err: Error) => {
          console.error(err.message);
        })
        .finally(() => {
          pendingRequestsRef.current -= 1;
          if (
            pendingRequestsRef.current === 0 &&
            !firstSuccessProcessedRef.current
          ) {
            setIsLoading(false);
          }
        });
    } else {
      siteNamesToFetch.forEach((siteName) => {
        fetch(
          `/api/search?keyword=${keyword.replaceAll(
            "+",
            " "
          )}&allowSites=${siteName}`
        )
          .then((res) => {
            if (!res.ok) {
              const fetchError: SiteSpecificError = new Error(
                `Failed to fetch data for ${siteName}. Status: ${res.status}`
              );
              fetchError.site = siteName;
              throw fetchError;
            }
            return res.json() as Promise<ApiSearchResponse>;
          })
          .then((data: ApiSearchResponse) => {
            setResults((prevResults) => {
              let siteData: JobItem[] | FreelancerItem[] | null = null;
              const config = SITES_CONFIG[siteName];

              if (config.type === "freelancer") {
                siteData = data.freelancers || config.default;
              } else {
                siteData = data.jobs || config.default;
              }

              return {
                ...prevResults,
                [siteName]: siteData,
              };
            });

            if (!firstSuccessProcessedRef.current) {
              setIsLoading(false);
              firstSuccessProcessedRef.current = true;
            }
          })
          .catch((err: Error | SiteSpecificError) => {
            const siteNameForError =
              (err as SiteSpecificError).site || siteName;

            console.error(
              `Error fetching data for ${siteNameForError}:`,
              err.message
            );
            setError((prevError) => {
              const message =
                err.message || `Error with site: ${siteNameForError}`;
              return prevError ? `${prevError}\n${message}` : message;
            });
            setResults((prevResults) => ({
              ...prevResults,
              [siteNameForError]: null,
            }));
          })
          .finally(() => {
            pendingRequestsRef.current -= 1;
            if (
              pendingRequestsRef.current === 0 &&
              !firstSuccessProcessedRef.current
            ) {
              setIsLoading(false);
            }
          });
      });
    }

    //

    //
  }, [keyword, stableIgnoredSites]);

  return { results, isLoading, error };
}
