// src/app/search/[keyword]/page.tsx
"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import { useSearchAllSites, SiteName } from "@/hooks/useSearchAllSites";

import ItemCard from "@/components/ItemCard";
import type { Item as CardItemType } from "@/components/ItemCard";
import {
  FaBriefcase,
  FaUsersCog,
  FaExclamationCircle,
  FaInfoCircle,
  FaSearch,
  FaSpinner,
} from "react-icons/fa"; // آیکون‌ها برای تب‌ها و پیام‌ها

const ALL_AVAILABLE_SITES: SiteName[] = [
  "karlancer",
  "punisha",
  "jobinja",
  "jobvision",
];

interface FilterState {
  ignoredSites: SiteName[];
}

interface AggregatedResults {
  jobs: JobItem[];
  freelancers: FreelancerItem[];
}

type ActiveTabType = "jobs" | "freelancers";

export default function SearchKeywordPage() {
  const params = useParams();
  const keyword = params.keyword;

  const [frontFilter, setFrontFilter] = useState<FilterState>({
    ignoredSites: [],
  });
  const [backFilter, setBackFilter] = useState<FilterState>({
    ignoredSites: [],
  });

  const {
    results: rawResultsFromHook,
    isLoading,
    error,
  } = useSearchAllSites(keyword, backFilter.ignoredSites);

  const [aggregatedResults, setAggregatedResults] = useState<AggregatedResults>(
    {
      jobs: [],
      freelancers: [],
    }
  );

  const [favoriteItems, setFavoriteItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTabType>("jobs"); // State برای تب فعال

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteItems");
    if (storedFavorites) {
      setFavoriteItems(JSON.parse(storedFavorites));
    }
  }, []);

  const handleToggleFavorite = (item: CardItemType) => {
    const itemId = item.url;
    let updatedFavorites: string[];
    if (favoriteItems.includes(itemId)) {
      updatedFavorites = favoriteItems.filter((id) => id !== itemId);
    } else {
      updatedFavorites = [...favoriteItems, itemId];
    }
    setFavoriteItems(updatedFavorites);
    localStorage.setItem("favoriteItems", JSON.stringify(updatedFavorites));
  };

  useEffect(() => {
    const newJobs: JobItem[] = [];
    if (rawResultsFromHook.jobinja) newJobs.push(...rawResultsFromHook.jobinja);
    if (rawResultsFromHook.jobvision)
      newJobs.push(...rawResultsFromHook.jobvision);

    const newFreelancers: FreelancerItem[] = [];
    if (rawResultsFromHook.karlancer)
      newFreelancers.push(...rawResultsFromHook.karlancer);
    if (rawResultsFromHook.punisha)
      newFreelancers.push(...rawResultsFromHook.punisha);

    setAggregatedResults({ jobs: newJobs, freelancers: newFreelancers });

    // اگر تب فعلی مشاغل است و نتیجه‌ای برای مشاغل نیامده اما برای فریلنسرها آمده، تب را عوض کن
    if (
      activeTab === "jobs" &&
      newJobs.length === 0 &&
      newFreelancers.length > 0
    ) {
      // setActiveTab('freelancers'); // یا این منطق را بر اساس اولویت کاربر تنظیم کنید
    } else if (
      activeTab === "freelancers" &&
      newFreelancers.length === 0 &&
      newJobs.length > 0
    ) {
      // setActiveTab('jobs');
    }
  }, [rawResultsFromHook]); // activeTab را از وابستگی‌ها حذف کردیم تا باعث حلقه نشود

  const displayedJobs = useMemo(() => {
    return aggregatedResults.jobs.filter(
      (job) => !frontFilter.ignoredSites.includes(job.type as SiteName)
    );
  }, [aggregatedResults.jobs, frontFilter.ignoredSites]);

  const displayedFreelancers = useMemo(() => {
    return aggregatedResults.freelancers.filter(
      (freelancer) =>
        !frontFilter.ignoredSites.includes(freelancer.type as SiteName)
    );
  }, [aggregatedResults.freelancers, frontFilter.ignoredSites]);

  const handleFilterChange = (
    site: SiteName,
    isChecked: boolean,
    filterType: "front" | "back"
  ) => {
    const setter = filterType === "front" ? setFrontFilter : setBackFilter;
    setter((prevFilter) => {
      const currentIgnored = prevFilter.ignoredSites;
      if (isChecked) {
        return { ignoredSites: Array.from(new Set([...currentIgnored, site])) };
      } else {
        return { ignoredSites: currentIgnored.filter((s) => s !== site) };
      }
    });
  };

  const totalJobs = displayedJobs.length;
  const totalFreelancers = displayedFreelancers.length;
  const noResultsFromHook =
    rawResultsFromHook &&
    Object.values(rawResultsFromHook).every(
      (val) => val === null || val.length === 0
    );

  const isInitialLoading =
    isLoading &&
    totalJobs === 0 &&
    totalFreelancers === 0 &&
    !error &&
    !noResultsFromHook;
  const isLoadingMore =
    isLoading && (totalJobs > 0 || totalFreelancers > 0 || noResultsFromHook);

  const renderNoResultsMessage = (itemType: string) => (
    <div className="text-center py-12">
      <FaSearch size={48} className="mx-auto  mb-4" />
      <p className="text-lg text-gray-600">
        هیچ {itemType} مطابق با جستجو و فیلتر شما یافت نشد.
      </p>
    </div>
  );

  return (
    <div
      className="container my-container rounded-box mx-auto p-2 sm:p-6 lg:p-8 bg-base-200 min-h-screen"
      dir="rtl"
    >
      {/* <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center text-primary">
        نتایج جستجو برای: «{String(keyword)}»
      </h1> */}

      <div className="my-8 p-4 sm:p-6 bg-base-100 rounded-xl shadow-lg">
        {/* بخش فیلترها ... (بدون تغییر از کد قبلی) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 ">
              فیلتر نمایش (سمت کاربر):
            </h3>
            <div className="space-y-2">
              {ALL_AVAILABLE_SITES.map((site) => (
                <div className="form-control" key={`front-filter-${site}`}>
                  <label className="label cursor-pointer justify-start p-0">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm checkbox-secondary mr-3"
                      checked={frontFilter.ignoredSites.includes(site)}
                      onChange={(e) =>
                        handleFilterChange(site, e.target.checked, "front")
                      }
                    />
                    <span className="label-text text-sm sm:text-base">
                      نادیده گرفتن {site}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 ">
              فیلتر جستجو (سمت سرور):
            </h3>
            <div className="space-y-2">
              {ALL_AVAILABLE_SITES.map((site) => (
                <div className="form-control" key={`back-filter-${site}`}>
                  <label className="label cursor-pointer justify-start p-0">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm checkbox-secondary mr-3"
                      checked={backFilter.ignoredSites.includes(site)}
                      onChange={(e) =>
                        handleFilterChange(site, e.target.checked, "back")
                      }
                    />
                    <span className="label-text text-sm sm:text-base">
                      نادیده گرفتن {site} در جستجوی بعدی
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isInitialLoading && (
        <div className="text-center my-10">
          <FaSpinner className="animate-spin text-4xl sm:text-5xl text-primary mx-auto" />
          <p className="mt-3 text-lg opacity-75">
            درحال بارگذاری اولیه نتایج...
          </p>
        </div>
      )}

      {isLoadingMore && (
        <div className="text-center my-6">
          <span className="loading loading-sm loading-dots text-secondary"></span>
          <p className="mt-1 text-base text-secondary">درحال دریافت نتایج...</p>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="alert alert-error my-8 shadow-md items-start"
        >
          <FaExclamationCircle className="text-2xl mt-1" />
          <div>
            <h3 className="font-bold text-lg">خطا در دریافت اطلاعات!</h3>
            <div className="text-sm whitespace-pre-wrap">{error}</div>
          </div>
        </div>
      )}

      {/* پیام کلی "نتیجه‌ای یافت نشد" اگر هیچ داده‌ای از هوک نیامده باشد */}
      {!isInitialLoading &&
      !isLoadingMore &&
      noResultsFromHook &&
      totalJobs === 0 &&
      totalFreelancers === 0 &&
      !error ? (
        <div className="text-center py-12">
          <FaInfoCircle size={48} className="mx-auto  mb-4" />
          <p className="text-lg text-gray-600">
            در حال حاضر هیچ نتیجه‌ای برای «{String(keyword)}» از منابع دریافت
            نشده است.
          </p>
        </div>
      ) : (
        <>
          {/* بخش تب‌ها */}
          {!isInitialLoading && !error && !isLoading && (
            <>
              <div className="flex justify-center mb-0">
                {" "}
                {/* mb-0 چون خود تب‌ها حاشیه پایینی دارند که با محتوا ادغام می‌شود */}
                <div role="tablist" className="tabs tabs-lifted sm:tabs-lg">
                  {" "}
                  {/* tabs-lg برای تب‌های بزرگتر در صفحات بزرگتر */}
                  <a
                    role="tab"
                    className={`tab rounded-t-box h-auto !px-1 !py-2 sm:!px-6 sm:!py-3 text-sm sm:text-base flex items-center gap-2 ${
                      activeTab === "jobs"
                        ? "tab-active font-semibold !bg-base-100 "
                        : "hover:bg-base-300/70"
                    }`}
                    onClick={() => setActiveTab("jobs")}
                  >
                    <FaBriefcase className="ms-1" /> مشاغل
                    <span className="badge badge-sm sm:badge-md badge-ghost px-1 sm:px-1.5 md:px-2 ml-0.5 sm:ml-1">
                      {totalJobs}
                    </span>
                  </a>
                  <a
                    role="tab"
                    className={`tab rounded-t-box h-auto !px-1 !py-2 sm:!px-6 sm:!py-3 text-sm sm:text-base flex items-center gap-2 ${
                      activeTab === "freelancers"
                        ? "tab-active font-semibold !bg-base-100 "
                        : "hover:bg-base-300/70"
                    }`}
                    onClick={() => setActiveTab("freelancers")}
                  >
                    <FaUsersCog className="ms-1" /> پروژه‌ها
                    <span className="badge badge-sm sm:badge-md badge-ghost px-1 sm:px-1.5 md:px-2 ml-0.5 sm:ml-1">
                      {totalFreelancers}
                    </span>
                  </a>
                </div>
              </div>

              {/* محتوای تب‌ها */}

              <div className="bg-base-100 p-4 sm:p-6 rounded-box shadow-xl border-t-0">
                {activeTab === "jobs" &&
                  (totalJobs > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {displayedJobs.map((item) => (
                        <ItemCard
                          key={`${item.type}-${item.url}`}
                          item={item as CardItemType}
                          isFavorite={favoriteItems.includes(item.url)}
                          onToggleFavorite={handleToggleFavorite}
                        />
                      ))}
                    </div>
                  ) : (
                    renderNoResultsMessage("شغلی")
                  ))}

                {activeTab === "freelancers" &&
                  (totalFreelancers > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {displayedFreelancers.map((item) => (
                        <ItemCard
                          key={`${item.type}-${item.url}`}
                          item={item as CardItemType}
                          isFavorite={favoriteItems.includes(item.url)}
                          onToggleFavorite={handleToggleFavorite}
                        />
                      ))}
                    </div>
                  ) : (
                    renderNoResultsMessage("پروژه فریلنسری")
                  ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
