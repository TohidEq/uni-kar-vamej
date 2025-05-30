"use client";
import { FaBriefcase, FaUsersCog, FaSearch, FaSpinner } from "react-icons/fa";
import ItemCard from "@/components/ItemCard";
// import { JobItem, FreelancerItem } from "@/types/itemTypes";

type ActiveTabType = "jobs" | "freelancers";

interface ResultsTabsProps {
  jobs: JobItem[];
  freelancers: FreelancerItem[];
  activeTab: ActiveTabType;
  onTabChange: (tab: ActiveTabType) => void;
  isLoadingMore: boolean;
  favoriteItems: (JobItem | FreelancerItem)[];
  onToggleFavorite: (item: JobItem | FreelancerItem) => void;
}

export default function ResultsTabs({
  jobs,
  freelancers,
  activeTab,
  onTabChange,
  isLoadingMore,
  favoriteItems,
  onToggleFavorite,
}: ResultsTabsProps) {
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

  return (
    <>
      <div className="flex justify-center mb-0 print:hidden">
        <div role="tablist" className="tabs tabs-lifted sm:tabs-lg">
          <a
            role="tab"
            aria-label={`شاغل (${jobs.length})`}
            className={`tab rounded-t-box h-auto !px-1 !py-2 sm:!px-6 sm:!py-3 text-sm sm:text-base flex items-center gap-2 ${
              activeTab === "jobs"
                ? "tab-active font-semibold !bg-base-100 text-primary"
                : "hover:bg-base-300/70"
            }`}
            onClick={() => onTabChange("jobs")}
          >
            <FaBriefcase className="ms-1" /> شغل‌ها
            <span
              className={`badge badge-sm sm:badge-md ${
                activeTab === "jobs" ? "badge-primary" : "badge-ghost"
              } px-1 sm:px-1.5 md:px-2 ml-0.5 sm:ml-1`}
            >
              {jobs.length}
            </span>
          </a>
          <a
            role="tab"
            aria-label={`پروژه‌ها (${freelancers.length})`}
            className={`tab rounded-t-box h-auto !px-1 !py-2 sm:!px-6 sm:!py-3 text-sm sm:text-base flex items-center gap-2 ${
              activeTab === "freelancers"
                ? "tab-active font-semibold !bg-base-100 text-primary"
                : "hover:bg-base-300/70"
            }`}
            onClick={() => onTabChange("freelancers")}
          >
            <FaUsersCog className="ms-1" /> پروژه‌ها
            <span
              className={`badge badge-sm sm:badge-md ${
                activeTab === "freelancers" ? "badge-primary" : "badge-ghost"
              } px-1 sm:px-1.5 md:px-2 ml-0.5 sm:ml-1`}
            >
              {freelancers.length}
            </span>
          </a>
        </div>
      </div>

      <div className="bg-base-100 p-4 sm:p-6 rounded-box shadow-xl border-t-0">
        {activeTab === "jobs" &&
          (jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {jobs.map((item) => (
                <ItemCard
                  key={`${item.type}-${item.url}`}
                  item={item}
                  isFavorite={item.url ? favoriteItems.includes(item) : false}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          ) : (
            (!isLoadingMore || (isLoadingMore && jobs.length === 0)) &&
            renderNoResultsMessage("شغلی")
          ))}
        {activeTab === "freelancers" &&
          (freelancers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {freelancers.map((item) => (
                <ItemCard
                  key={`${item.type}-${item.url}`}
                  item={item}
                  isFavorite={item.url ? favoriteItems.includes(item) : false}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          ) : (
            (!isLoadingMore || (isLoadingMore && freelancers.length === 0)) &&
            renderNoResultsMessage("پروژه فریلنسری")
          ))}
        {isLoadingMore &&
          ((activeTab === "jobs" && jobs.length === 0) ||
            (activeTab === "freelancers" && freelancers.length === 0)) && (
            <div className="text-center my-10">
              <FaSpinner className="animate-spin text-3xl text-secondary mx-auto" />
              <p className="mt-2 text-md opacity-75">درحال بارگذاری...</p>
            </div>
          )}
      </div>
    </>
  );
}
