"use client";

import { useState, useEffect } from "react";
import { FaInfoCircle } from "react-icons/fa";
import FilterBox from "@/components/search/FilterBox";
import ResultsTabs from "@/components/search/ResultsTabs";
import { useFavorites } from "@/hooks/useFavorites";
// import { JobItem, FreelancerItem } from "@/types/itemTypes";
import { sortItemsByPrice } from "@/utils/searchUtils";

interface AggregatedResults {
  jobs: JobItem[];
  freelancers: FreelancerItem[];
}

type ActiveTabType = "jobs" | "freelancers";
type SiteName = "karlancer" | "ponisha" | "jobinja" | "jobvision";
type SortOrderType = "none" | "asc" | "desc";

const ALL_AVAILABLE_SITES: SiteName[] = [
  "karlancer",
  "ponisha",
  "jobinja",
  "jobvision",
];
const IGNORED_SITES_LOCAL_STORAGE_KEY = "favoritesPageIgnoredSites";

export default function FavoritesPage() {
  console.log("FavoritesPage Rendering");

  const [activeTab, setActiveTab] = useState<ActiveTabType>("jobs");
  const [sortOrder, setSortOrder] = useState<SortOrderType>("none");
  const [ignoredSites, setIgnoredSites] = useState<SiteName[]>([]);
  const [ignoredSites_apply, setIgnoredSites_apply] = useState<SiteName[]>([]);
  const [aggregatedResults, setAggregatedResults] = useState<AggregatedResults>(
    {
      jobs: [],
      freelancers: [],
    }
  );
  const { favoriteItems, toggleFavorite } = useFavorites();
  const [showFilterBox, setShowFilterBox] = useState(false);

  // Load ignored sites from localStorage on mount
  useEffect(() => {
    const storedIgnoredSites = localStorage.getItem(
      IGNORED_SITES_LOCAL_STORAGE_KEY
    );
    const initialSites = storedIgnoredSites
      ? JSON.parse(storedIgnoredSites)
      : [];
    setIgnoredSites(initialSites);
    setIgnoredSites_apply(initialSites);
  }, []);

  // Aggregate favorite items
  useEffect(() => {
    console.log("++++++++++++++++++++++++++++++++++++");
    console.log("Aggregating favorite items...");
    console.log("Favorite Items:", favoriteItems);
    console.log("++++++++++++++++++++++++++++++++++++");

    const jobs: JobItem[] = favoriteItems.filter(
      (item): item is JobItem =>
        item.type === "jobinja" || item.type === "jobvision"
    );
    const freelancers: FreelancerItem[] = favoriteItems.filter(
      (item): item is FreelancerItem =>
        item.type === "karlancer" || item.type === "ponisha"
    );

    setAggregatedResults({ jobs, freelancers });

    console.log("Aggregated Results:", { jobs, freelancers });
    console.log("++++++++++++++++++++++++++++++++++++");
  }, [favoriteItems]);

  // Filter and sort displayed results
  const displayedJobs = sortItemsByPrice(
    aggregatedResults.jobs.filter(
      (job) => !ignoredSites_apply.includes(job.type as SiteName)
    ),
    sortOrder
  );

  const displayedFreelancers = sortItemsByPrice(
    aggregatedResults.freelancers.filter(
      (freelancer) => !ignoredSites_apply.includes(freelancer.type as SiteName)
    ),
    sortOrder
  );

  // Handle filter changes
  const handleFilterChange = (site: SiteName, isChecked: boolean) => {
    const newIgnoredSites = isChecked
      ? [...new Set([...ignoredSites, site])]
      : ignoredSites.filter((s) => s !== site);
    setIgnoredSites(newIgnoredSites);
    localStorage.setItem(
      IGNORED_SITES_LOCAL_STORAGE_KEY,
      JSON.stringify(newIgnoredSites)
    );
  };

  const filterBtn = (
    <button
      className="btn btn-primary join-item rounded-full me-2 !px-3"
      onClick={() => setShowFilterBox(!showFilterBox)}
      aria-label="نمایش/مخفی کردن فیلترها و مرتب‌سازی"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L13 10.414V15a1 1 0 01-.293.707l-2 2A1 1 0 019 17v-1.586L4.293 6.707A1 1 0 014 6V3z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );

  return (
    <div
      className="container my-container rounded-box mx-auto p-2 sm:p-6 lg:p-8 bg-base-200 min-h-screen"
      dir="rtl"
    >
      {/* Filter Button */}
      <div className="join w-full mb-3 print:hidden">
        <div className="flex join-item w-full justify-center">{filterBtn}</div>
      </div>

      <button
        className={`btn w-full mx-auto max-w-[390px] btn-primary my-3 ${
          ignoredSites_apply !== ignoredSites ? "block" : "hidden"
        }`}
        onClick={() => setIgnoredSites_apply(ignoredSites)}
      >
        اعمال فیلتر
      </button>

      {/* Filter Box */}
      <FilterBox
        allSites={ALL_AVAILABLE_SITES}
        ignoredSites={ignoredSites}
        onFilterChange={handleFilterChange}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        showFilterBox={showFilterBox}
      />

      {/* Page Title */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-8 text-center text-primary">
        آیتم‌های مورد علاقه
      </h1>

      {/* Empty State */}
      {displayedJobs.length === 0 && displayedFreelancers.length === 0 && (
        <div
          role="alert"
          className="alert alert-info my-8 shadow-md items-start"
        >
          <FaInfoCircle className="text-2xl mt-1 shrink-0" />
          <div>
            <h3 className="font-bold text-lg">هیچ آیتمی یافت نشد!</h3>
            <p className="text-sm whitespace-pre-wrap">
              هیچ آیتم مورد علاقه‌ای ثبت نشده یا همه آیتم‌ها فیلتر شده‌اند.
            </p>
          </div>
        </div>
      )}

      {/* Results Tabs */}
      <ResultsTabs
        jobs={displayedJobs}
        freelancers={displayedFreelancers}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isLoadingMore={false} // بدون لودینگ
        favoriteItems={favoriteItems}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}
