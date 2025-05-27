// src/app/search/[keyword]/page.tsx
"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import { useSearchAllSites, SiteName } from "@/hooks/useSearchAllSites"; // SiteName رو هم از هوک ایمپورت می‌کنیم
// اطمینان حاصل کنید که مسیر itemTypes درست است و این تایپ‌ها در آن فایل تعریف شده‌اند
import type { JobItem, FreelancerItem } from "@/types/itemTypes";

// این لیست را می‌توان از SITES_CONFIG در هوک یا یک فایل مشترک خواند
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

export default function SearchKeywordPage() {
  const params = useParams();
  const keyword = params.keyword;

  // 1. State برای فیلترهای فرانت‌اند و بک‌اند
  const [frontFilter, setFrontFilter] = useState<FilterState>({
    ignoredSites: [],
  });
  const [backFilter, setBackFilter] = useState<FilterState>({
    ignoredSites: [],
  });

  // 2. هوک جستجو که backFilter.ignoredSites را به عنوان ورودی می‌گیرد
  const {
    results: rawResultsFromHook,
    isLoading,
    error,
  } = useSearchAllSites(
    keyword,
    backFilter.ignoredSites // پاس دادن ignoredSites از backFilter به هوک
  );

  // 3. State برای نتایج تجمیع شده
  const [aggregatedResults, setAggregatedResults] = useState<AggregatedResults>(
    {
      jobs: [],
      freelancers: [],
    }
  );

  // 4. useEffect برای تجمیع نتایج خام دریافتی از هوک
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
  }, [rawResultsFromHook]); // این افکت با تغییر نتایج هوک اجرا می‌شود

  // 5. useMemo برای اعمال frontFilter روی نتایج تجمیع شده (فیلتر سمت کلاینت)
  const displayedJobs = useMemo(() => {
    if (!aggregatedResults.jobs) return [];
    return aggregatedResults.jobs.filter(
      (job) => !frontFilter.ignoredSites.includes(job.type as SiteName)
    );
  }, [aggregatedResults.jobs, frontFilter.ignoredSites]);

  const displayedFreelancers = useMemo(() => {
    if (!aggregatedResults.freelancers) return [];
    return aggregatedResults.freelancers.filter(
      (freelancer) =>
        !frontFilter.ignoredSites.includes(freelancer.type as SiteName)
    );
  }, [aggregatedResults.freelancers, frontFilter.ignoredSites]);

  // توابع برای مدیریت تغییرات در چک‌باکس‌های فیلتر
  const handleFilterChange = (
    site: SiteName,
    isChecked: boolean, // true if "ignore this site" is checked
    filterType: "front" | "back"
  ) => {
    const setter = filterType === "front" ? setFrontFilter : setBackFilter;
    setter((prevFilter) => {
      const currentIgnored = prevFilter.ignoredSites;
      if (isChecked) {
        // Add to ignored sites
        return {
          ignoredSites: [...currentIgnored, site].filter(
            (value, index, self) => self.indexOf(value) === index
          ),
        }; // Ensure unique
      } else {
        // Remove from ignored sites
        return { ignoredSites: currentIgnored.filter((s) => s !== site) };
      }
    });
  };

  if (
    isLoading &&
    displayedJobs.length === 0 &&
    displayedFreelancers.length === 0
  ) {
    return (
      <div dir="rtl" className="container mx-auto p-4">
        درحال بارگذاری اولیه نتایج برای "{String(keyword)}"...
      </div>
    );
  }

  if (error) {
    return (
      <div dir="rtl" className="container mx-auto p-4">
        <p className="text-red-500">خطا در دریافت اطلاعات:</p>
        <pre className="whitespace-pre-wrap">{error}</pre>
      </div>
    );
  }

  // شمارش تعداد کل آیتم‌های نمایش داده شده
  const totalDisplayedItems =
    displayedJobs.length + displayedFreelancers.length;

  return (
    <div className="container mx-auto p-4" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">
        نتایج جستجو برای: "{String(keyword)}"
      </h1>

      {/* بخش فیلترها */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 border rounded-lg">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            فیلتر نمایش (سمت کاربر):
          </h3>
          {ALL_AVAILABLE_SITES.map((site) => (
            <label key={`front-filter-${site}`} className="mr-4 block">
              <input
                type="checkbox"
                className="ml-2"
                checked={frontFilter.ignoredSites.includes(site)}
                onChange={(e) =>
                  handleFilterChange(site, e.target.checked, "front")
                }
              />
              نادیده گرفتن {site}
            </label>
          ))}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">
            فیلتر جستجو (سمت سرور - نیاز به جستجوی مجدد):
          </h3>
          {ALL_AVAILABLE_SITES.map((site) => (
            <label key={`back-filter-${site}`} className="mr-4 block">
              <input
                type="checkbox"
                className="ml-2"
                checked={backFilter.ignoredSites.includes(site)}
                onChange={(e) =>
                  handleFilterChange(site, e.target.checked, "back")
                }
              />
              نادیده گرفتن {site} در جستجوی بعدی
            </label>
          ))}
        </div>
      </div>

      {isLoading && (
        <p className="my-4 text-blue-600">درحال بارگذاری نتایج بیشتر...</p>
      )}

      {/* نمایش نتایج فریلنسرها */}
      {displayedFreelancers.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            پروژه‌های فریلنسری ({displayedFreelancers.length})
          </h2>
          <ul>
            {displayedFreelancers.map((item, index) => (
              <li
                key={`freelancer-${item.type}-${index}`}
                className="border p-3 my-2 rounded-md shadow-sm hover:shadow-md transition-shadow"
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-lg font-medium"
                >
                  {item.title}
                </a>
                <p className="text-sm text-gray-600">منبع: {item.type}</p>
                {item.salary && (
                  <p className="text-sm text-gray-700">
                    حقوق: {String(item.salary)}
                  </p>
                )}
                {item.caption && (
                  <p className="text-sm text-gray-500 mt-1 truncate">
                    {item.caption}
                  </p>
                )}
                {/* سایر اطلاعات آیتم */}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* نمایش نتایج شغل‌ها */}
      {displayedJobs.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            آگهی‌های شغلی ({displayedJobs.length})
          </h2>
          <ul>
            {displayedJobs.map((item, index) => (
              <li
                key={`job-${item.type}-${index}`}
                className="border p-3 my-2 rounded-md shadow-sm hover:shadow-md transition-shadow"
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-lg font-medium"
                >
                  {item.title}
                </a>
                <p className="text-sm text-gray-600">
                  شرکت: {item.owner} (منبع: {item.type})
                </p>
                {item.location && (
                  <p className="text-sm text-gray-700">
                    موقعیت: {item.location}
                  </p>
                )}
                {/* سایر اطلاعات آیتم */}
              </li>
            ))}
          </ul>
        </section>
      )}

      {!isLoading && totalDisplayedItems === 0 && !error && (
        <p>
          هیچ نتیجه‌ای مطابق با فیلترهای شما برای "{String(keyword)}" یافت نشد.
        </p>
      )}
      {!isLoading &&
        rawResultsFromHook &&
        totalDisplayedItems === 0 &&
        Object.values(rawResultsFromHook).every(
          (val) => val === null || val.length === 0
        ) &&
        !error && (
          <p>
            در حال حاضر هیچ نتیجه‌ای برای "{String(keyword)}" از منابع دریافت
            نشده است.
          </p>
        )}
    </div>
  );
}
