// src/app/search/[keyword]/page.tsx
"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState, useMemo, useCallback } from "react";
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
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import SearchInput from "@/components/SearchInput"; // فرض می‌کنیم این کامپوننت برای جستجوی جدید، صفحه را با keyword جدید هدایت می‌کند

const ALL_AVAILABLE_SITES: SiteName[] = [
  "karlancer",
  "punisha",
  "jobinja",
  "jobvision",
];

// کلید برای ذخیره در localStorage
const IGNORED_SITES_LOCAL_STORAGE_KEY = "searchPageIgnoredSites";

// interface FilterState { // دیگر به این شکل استفاده نمی‌شود، مستقیما از آرایه SiteName[] استفاده می‌کنیم
//   ignoredSites: SiteName[];
// }

interface JobItem extends CardItemType {
  type: SiteName;
  price?: string | number;
  url: string;
}

interface FreelancerItem extends CardItemType {
  type: SiteName;
  price?: string | number;
  url: string;
}

interface AggregatedResults {
  jobs: JobItem[];
  freelancers: FreelancerItem[];
}

type ActiveTabType = "jobs" | "freelancers";
type SortOrderType = "none" | "asc" | "desc";

// تابع کمکی برای استخراج و نرمال‌سازی قیمت (بدون تغییر)
const parsePrice = (
  priceInput: string | number | undefined | null
): number | null => {
  if (priceInput === undefined || priceInput === null) return null;

  if (typeof priceInput === "number") {
    return isNaN(priceInput) ? null : priceInput;
  }

  if (typeof priceInput === "string") {
    const nonNumericKeywords = [
      "توافقی",
      "مقطوع",
      "نامشخص",
      "negotiable",
      "n/a",
      "na",
      "to be agreed",
      "upon agreement",
    ];
    const lowerCasePriceInput = priceInput.toLowerCase();
    if (
      nonNumericKeywords.some((keyword) =>
        lowerCasePriceInput.includes(keyword)
      )
    ) {
      return null;
    }
    const numericString = priceInput
      .replace(/[^0-9.,]/g, "")
      .replace(/,/g, ".");
    const price = parseFloat(numericString);
    return isNaN(price) ? null : price;
  }
  return null;
};

export default function SearchKeywordPage() {
  const params = useParams();
  const keyword = params.keyword as string;

  // State برای چک‌باکس‌های UI و فیلتر سمت کاربر. با localStorage همگام‌سازی می‌شود.
  const [uiIgnoredSites, setUiIgnoredSites] = useState<SiteName[]>([]);

  // State برای سایت‌های نادیده گرفته شده که به هوک useSearchAllSites پاس داده می‌شود.
  // این State فقط زمانی آپدیت می‌شود که جستجوی جدیدی (تغییر keyword) آغاز شود.
  const [hookIgnoredSites, setHookIgnoredSites] = useState<SiteName[]>([]);

  useEffect(() => {
    // در بارگذاری اولیه، سایت‌های نادیده گرفته شده از localStorage خوانده می‌شوند
    // هم برای UI و هم برای اولین فراخوانی هوک.
    // console.log("Initial mount: Reading from localStorage for keyword:", keyword);
    const storedIgnoredSites = localStorage.getItem(
      IGNORED_SITES_LOCAL_STORAGE_KEY
    );
    const initialSites = storedIgnoredSites
      ? JSON.parse(storedIgnoredSites)
      : [];
    setUiIgnoredSites(initialSites);
    setHookIgnoredSites(initialSites); // برای اولین فراخوانی API
  }, []); // آرایه وابستگی خالی: فقط یک بار در زمان mount اجرا می‌شود

  useEffect(() => {
    // زمانی که keyword تغییر می‌کند (جستجوی جدید توسط روتر/SearchInput آغاز شده)
    // آخرین لیست سایت‌های نادیده گرفته شده از localStorage خوانده و برای هوک تنظیم می‌شود.
    // همچنین، چک‌باکس‌های UI برای انعکاس وضعیت localStorage برای این جستجوی جدید، همگام‌سازی می‌شوند.
    // console.log("Keyword changed to:", keyword, "Reading from localStorage for hook.");
    const storedIgnoredSites = localStorage.getItem(
      IGNORED_SITES_LOCAL_STORAGE_KEY
    );
    const sitesForNewSearch = storedIgnoredSites
      ? JSON.parse(storedIgnoredSites)
      : [];
    setHookIgnoredSites(sitesForNewSearch);
    setUiIgnoredSites(sitesForNewSearch); // اطمینان از همگام‌سازی چک‌باکس‌های UI
  }, [keyword]); // با تغییر keyword اجرا می‌شود

  const {
    results: rawResultsFromHook,
    isLoading,
    error,
  } = useSearchAllSites(keyword, ["jobinja", "punisha", "jobvision"]); // hookIgnoredSites پایدار بین کلیک‌های چک‌باکس است
  // } = useSearchAllSites(keyword, hookIgnoredSites); // hookIgnoredSites پایدار بین کلیک‌های چک‌باکس است

  const [aggregatedResults, setAggregatedResults] = useState<AggregatedResults>(
    {
      jobs: [],
      freelancers: [],
    }
  );

  const [favoriteItems, setFavoriteItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTabType>("jobs");
  const [sortOrder, setSortOrder] = useState<SortOrderType>("none");

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteItems");
    if (storedFavorites) {
      setFavoriteItems(JSON.parse(storedFavorites));
    }
  }, []);

  const handleToggleFavorite = (item: CardItemType) => {
    if (!item.url) return;
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
    if (rawResultsFromHook.jobinja)
      newJobs.push(...(rawResultsFromHook.jobinja as JobItem[]));
    if (rawResultsFromHook.jobvision)
      newJobs.push(...(rawResultsFromHook.jobvision as JobItem[]));

    const newFreelancers: FreelancerItem[] = [];
    if (rawResultsFromHook.karlancer)
      newFreelancers.push(
        ...(rawResultsFromHook.karlancer as FreelancerItem[])
      );
    if (rawResultsFromHook.punisha)
      newFreelancers.push(...(rawResultsFromHook.punisha as FreelancerItem[]));

    setAggregatedResults({ jobs: newJobs, freelancers: newFreelancers });
  }, [rawResultsFromHook]);

  const sortItemsByPrice = <T extends { price?: string | number }>(
    items: T[],
    order: SortOrderType
  ): T[] => {
    if (order === "none") return items;

    return [...items].sort((a, b) => {
      const priceA = parsePrice(a.price);
      const priceB = parsePrice(b.price);

      if (priceA === null && priceB === null) return 0;
      if (priceA === null) return 1;
      if (priceB === null) return -1;

      if (order === "asc") {
        return priceA - priceB;
      } else {
        return priceB - priceA;
      }
    });
  };

  const displayedJobs = useMemo(() => {
    const filtered = aggregatedResults.jobs.filter(
      (job) => !uiIgnoredSites.includes(job.type as SiteName) // فیلتر با uiIgnoredSites
    );
    return sortItemsByPrice(filtered, sortOrder);
  }, [aggregatedResults.jobs, uiIgnoredSites, sortOrder]);

  const displayedFreelancers = useMemo(() => {
    const filtered = aggregatedResults.freelancers.filter(
      (freelancer) => !uiIgnoredSites.includes(freelancer.type as SiteName) // فیلتر با uiIgnoredSites
    );
    return sortItemsByPrice(filtered, sortOrder);
  }, [aggregatedResults.freelancers, uiIgnoredSites, sortOrder]);

  // مدیریت تغییرات چک‌باکس‌های نادیده گرفتن سایت‌ها
  const handleIgnoredSiteChange = useCallback(
    (site: SiteName, isChecked: boolean) => {
      setUiIgnoredSites((prevIgnored) => {
        const newIgnored = isChecked
          ? Array.from(new Set([...prevIgnored, site]))
          : prevIgnored.filter((s) => s !== site);
        localStorage.setItem(
          IGNORED_SITES_LOCAL_STORAGE_KEY,
          JSON.stringify(newIgnored)
        );
        // console.log("Checkbox changed, uiIgnoredSites updated, localStorage updated. No API call.", newIgnored);
        return newIgnored;
      });
      // این تابع دیگر باعث ارسال مجدد درخواست از طریق هوک نمی‌شود
    },
    []
  );

  const totalJobs = displayedJobs.length;
  const totalFreelancers = displayedFreelancers.length;
  const noResultsFromHook =
    rawResultsFromHook &&
    Object.values(rawResultsFromHook).every(
      (val) => val === null || (Array.isArray(val) && val.length === 0)
    );

  const isInitialLoading =
    isLoading &&
    totalJobs === 0 &&
    totalFreelancers === 0 &&
    !error &&
    !noResultsFromHook;

  const isLoadingMore = isLoading && !isInitialLoading;

  const renderNoResultsMessage = (itemType: string) => (
    <div className="text-center py-12">
      <FaSearch size={48} className="mx-auto text-gray-400 mb-4" />
      <p className="text-lg text-gray-600">
        هیچ {itemType} مطابق با جستجو و فیلترهای شما یافت نشد.
      </p>
      <p className="text-sm text-gray-500 mt-1">
        ممکن است برخی سایت‌ها در بخش فیلتر نادیده گرفته شده باشند.
      </p>
    </div>
  );

  const [showFilterBox, setShowFilterBox] = useState(false);
  const handleFilterToggle = () => {
    setShowFilterBox(!showFilterBox);
  };

  return (
    <div
      className="container my-container rounded-box mx-auto p-2 sm:p-6 lg:p-8 bg-base-200 min-h-screen"
      dir="rtl"
    >
      {/* نوار جستجو و دکمه فیلتر - اصلاح شده برای چیدمان */}
      <div className="join w-full mb-6 print:hidden">
        {/* استفاده از join برای چسباندن */}
        <div className="flex join-item w-full justify-center">
          <button
            className="btn btn-primary join-item rounded-full me-2 !px-3" // دکمه به عنوان یک join item
            onClick={handleFilterToggle}
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
          {/* SearchInput به عنوان یک join item */}
          <SearchInput no_mx_auto={true} />
          {/* اطمینان حاصل کنید که SearchInput با استایل join سازگار است */}
        </div>
      </div>

      {/* باکس فیلتر و مرتب‌سازی */}
      <div
        className={`${
          showFilterBox
            ? "auto-height opacity-100 visible"
            : "no-height opacity-0 invisible"
        }
        overflow-hidden transition-all duration-500 ease-in-out my-8 p-4 sm:p-6 bg-base-100 rounded-xl shadow-lg print:hidden`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* بخش فیلتر نادیده گرفتن سایت‌ها */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3">
              نادیده گرفتن نتایج از:
            </h3>
            <div className="space-y-2">
              {ALL_AVAILABLE_SITES.map((site) => (
                <div className="form-control" key={`front-filter-${site}`}>
                  <label className="label cursor-pointer justify-start p-0">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm checkbox-secondary me-3"
                      checked={uiIgnoredSites.includes(site)} // استفاده از uiIgnoredSites
                      onChange={
                        (e) => handleIgnoredSiteChange(site, e.target.checked) // استفاده از handleIgnoredSiteChange
                      }
                    />
                    <span className="label-text text-sm sm:text-base">
                      {site}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* بخش مرتب‌سازی بر اساس قیمت */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3">
              مرتب‌سازی بر اساس قیمت:
            </h3>
            <div className="space-y-2">
              {/* گزینه‌های مرتب‌سازی بدون تغییر */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start p-0">
                  <input
                    type="radio"
                    name="sortOrder"
                    className="radio radio-sm radio-primary me-3"
                    checked={sortOrder === "none"}
                    onChange={() => setSortOrder("none")}
                  />
                  <span className="label-text text-sm sm:text-base">
                    پیش‌فرض (بدون مرتب‌سازی)
                  </span>
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer justify-start p-0">
                  <input
                    type="radio"
                    name="sortOrder"
                    className="radio radio-sm radio-primary me-3"
                    checked={sortOrder === "asc"}
                    onChange={() => setSortOrder("asc")}
                  />
                  <span className="label-text text-sm sm:text-base flex items-center">
                    <FaSortAmountUp className="ms-1" /> کم به زیاد
                  </span>
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer justify-start p-0">
                  <input
                    type="radio"
                    name="sortOrder"
                    className="radio radio-sm radio-primary me-3"
                    checked={sortOrder === "desc"}
                    onChange={() => setSortOrder("desc")}
                  />
                  <span className="label-text text-sm sm:text-base flex items-center">
                    <FaSortAmountDown className="ms-1" /> زیاد به کم
                  </span>
                </label>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              آیتم‌های با قیمت "توافقی" یا نامشخص، همیشه در انتهای لیست نمایش
              داده می‌شوند.
            </p>
          </div>
        </div>
      </div>

      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-8 text-center text-primary">
        نتایج جستجو برای: «{String(keyword)}»
      </h1>

      {/* وضعیت‌های بارگذاری */}
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
          <p className="mt-1 text-base text-secondary">
            درحال به‌روزرسانی نتایج...
          </p>
        </div>
      )}

      {/* پیام خطا */}
      {error && (
        <div
          role="alert"
          className="alert alert-error my-8 shadow-md items-start"
        >
          <FaExclamationCircle className="text-2xl mt-1 shrink-0" />
          <div>
            <h3 className="font-bold text-lg">خطا در دریافت اطلاعات!</h3>
            <div className="text-sm whitespace-pre-wrap">{error}</div>
          </div>
        </div>
      )}

      {/* پیام "هیچ نتیجه‌ای دریافت نشد" کلی */}
      {!isInitialLoading &&
      !isLoadingMore &&
      noResultsFromHook &&
      totalJobs === 0 &&
      totalFreelancers === 0 &&
      !error ? (
        <div className="text-center py-12">
          <FaInfoCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-600">
            در حال حاضر هیچ نتیجه‌ای برای «{String(keyword)}» از منابع دریافت
            نشده است.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            ممکن است لازم باشد فیلتر نادیده گرفتن سایت‌ها را بررسی کنید یا
            کلیدواژه دیگری را امتحان نمایید.
          </p>
        </div>
      ) : (
        <>
          {/* تب‌ها و محتوای اصلی */}
          {!isInitialLoading &&
            !error &&
            (totalJobs > 0 ||
              totalFreelancers > 0 ||
              isLoadingMore ||
              !noResultsFromHook) && (
              <>
                <div className="flex justify-center mb-0 print:hidden">
                  <div role="tablist" className="tabs tabs-lifted sm:tabs-lg">
                    {/* تب مشاغل */}
                    <a
                      role="tab"
                      aria-label={`مشاغل (${totalJobs})`}
                      className={`tab rounded-t-box h-auto !px-1 !py-2 sm:!px-6 sm:!py-3 text-sm sm:text-base flex items-center gap-2 ${
                        activeTab === "jobs"
                          ? "tab-active font-semibold !bg-base-100 text-primary"
                          : "hover:bg-base-300/70"
                      }`}
                      onClick={() => setActiveTab("jobs")}
                    >
                      <FaBriefcase className="ms-1" /> مشاغل
                      <span
                        className={`badge badge-sm sm:badge-md ${
                          activeTab === "jobs" ? "badge-primary" : "badge-ghost"
                        } px-1 sm:px-1.5 md:px-2 ml-0.5 sm:ml-1`}
                      >
                        {totalJobs}
                      </span>
                    </a>
                    {/* تب پروژه‌ها */}
                    <a
                      role="tab"
                      aria-label={`پروژه‌ها (${totalFreelancers})`}
                      className={`tab rounded-t-box h-auto !px-1 !py-2 sm:!px-6 sm:!py-3 text-sm sm:text-base flex items-center gap-2 ${
                        activeTab === "freelancers"
                          ? "tab-active font-semibold !bg-base-100 text-primary"
                          : "hover:bg-base-300/70"
                      }`}
                      onClick={() => setActiveTab("freelancers")}
                    >
                      <FaUsersCog className="ms-1" /> پروژه‌ها
                      <span
                        className={`badge badge-sm sm:badge-md ${
                          activeTab === "freelancers"
                            ? "badge-primary"
                            : "badge-ghost"
                        } px-1 sm:px-1.5 md:px-2 ml-0.5 sm:ml-1`}
                      >
                        {totalFreelancers}
                      </span>
                    </a>
                  </div>
                </div>

                {/* محتوای تب */}
                <div className="bg-base-100 p-4 sm:p-6 rounded-box shadow-xl border-t-0">
                  {activeTab === "jobs" &&
                    (totalJobs > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {displayedJobs.map((item) => (
                          <ItemCard
                            key={`${item.type}-${item.url}`}
                            item={item}
                            isFavorite={
                              item.url
                                ? favoriteItems.includes(item.url)
                                : false
                            }
                            onToggleFavorite={handleToggleFavorite}
                          />
                        ))}
                      </div>
                    ) : (
                      (!isLoadingMore || (isLoadingMore && totalJobs === 0)) &&
                      renderNoResultsMessage("شغلی")
                    ))}
                  {activeTab === "freelancers" &&
                    (totalFreelancers > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {displayedFreelancers.map((item) => (
                          <ItemCard
                            key={`${item.type}-${item.url}`}
                            item={item}
                            isFavorite={
                              item.url
                                ? favoriteItems.includes(item.url)
                                : false
                            }
                            onToggleFavorite={handleToggleFavorite}
                          />
                        ))}
                      </div>
                    ) : (
                      (!isLoadingMore ||
                        (isLoadingMore && totalFreelancers === 0)) &&
                      renderNoResultsMessage("پروژه فریلنسری")
                    ))}
                  {/* نمایش لودینگ در داخل تب اگر نتایج تب فعلی صفر است ولی isLoadingMore فعال است */}
                  {isLoadingMore &&
                    ((activeTab === "jobs" && totalJobs === 0) ||
                      (activeTab === "freelancers" &&
                        totalFreelancers === 0)) && (
                      <div className="text-center my-10">
                        <FaSpinner className="animate-spin text-3xl text-secondary mx-auto" />
                        <p className="mt-2 text-md opacity-75">
                          درحال بارگذاری...
                        </p>
                      </div>
                    )}
                </div>
              </>
            )}
        </>
      )}
    </div>
  );
}
