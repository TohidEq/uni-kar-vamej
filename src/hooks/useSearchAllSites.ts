// src/hooks/useSearchAllSites.ts
import { useState, useEffect, useMemo, useRef } from "react";

// آبجکت تنظیمات سایت‌ها
const SITES_CONFIG = {
  karlancer: { type: "freelancer" as const, default: [] as FreelancerItem[] },
  punisha: { type: "freelancer" as const, default: [] as FreelancerItem[] },
  jobinja: { type: "job" as const, default: [] as JobItem[] },
  jobvision: { type: "job" as const, default: [] as JobItem[] },
};

// تعریف نوع نام سایت‌ها بر اساس کلیدهای آبجکت تنظیمات
export type SiteName = keyof typeof SITES_CONFIG;

// اینترفیس برای ساختار نتایج جستجو
export interface SearchResults {
  karlancer: FreelancerItem[] | null;
  punisha: FreelancerItem[] | null;
  jobinja: JobItem[] | null;
  jobvision: JobItem[] | null;
}

// اینترفیس برای پاسخ مورد انتظار از API داخلی شما
interface ApiSearchResponse {
  jobs: JobItem[];
  freelancers: FreelancerItem[];
  // می‌توانید فیلدهای دیگری مثل keyword, searchableSites و ... را هم اینجا اضافه کنید اگر API شما آن‌ها را برمی‌گرداند
}

// تعریف اینترفیس برای خطای سفارشی که شامل نام سایت هم هست
interface SiteSpecificError extends Error {
  site?: SiteName;
}

export function useSearchAllSites(
  keyword: string | string[] | undefined,
  ignoredSites: SiteName[] = [] // آرایه‌ای از سایت‌هایی که باید نادیده گرفته شوند
) {
  const [results, setResults] = useState<SearchResults>({
    karlancer: null,
    punisha: null,
    jobinja: null,
    jobvision: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref برای پیگیری اینکه آیا اولین پاسخ موفقیت آمیز پردازش شده است یا خیر
  const firstSuccessProcessedRef = useRef(false);
  // Ref برای تعداد درخواست‌های در حال انتظار
  const pendingRequestsRef = useRef(0);

  // برای جلوگیری از اجرای بی‌مورد افکت در صورت تغییر رفرنس آرایه ignoredSites، آن را به رشته تبدیل می‌کنیم
  const stableIgnoredSites = useMemo(
    () => ignoredSites.join(","),
    [ignoredSites]
  );

  useEffect(() => {
    const currentKeyword = Array.isArray(keyword) ? keyword[0] : keyword;
    const currentIgnoredSites = stableIgnoredSites
      ? (stableIgnoredSites.split(",") as SiteName[])
      : [];

    // اگر کلمه کلیدی وجود نداشته باشد، وضعیت‌ها را ریست کن و خارج شو
    if (!currentKeyword) {
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

    // ریست کردن نتایج و وضعیت‌ها برای جستجوی جدید
    setResults({
      karlancer: null,
      punisha: null,
      jobinja: null,
      jobvision: null,
    });
    setIsLoading(true);
    setError(null);
    firstSuccessProcessedRef.current = false; // ریست کردن ref برای هر جستجوی جدید

    const siteNamesToFetch = (Object.keys(SITES_CONFIG) as SiteName[]).filter(
      (site) => !currentIgnoredSites.includes(site)
    );

    // اگر هیچ سایتی برای جستجو وجود ندارد
    if (siteNamesToFetch.length === 0) {
      setIsLoading(false);
      pendingRequestsRef.current = 0;
      return;
    }

    pendingRequestsRef.current = siteNamesToFetch.length;

    // ارسال درخواست‌ها به صورت جداگانه برای هر سایت
    siteNamesToFetch.forEach((siteName) => {
      fetch(
        `/api/search?keyword=${encodeURIComponent(
          currentKeyword
        )}&allowSites=${siteName}`
      )
        .then((res) => {
          if (!res.ok) {
            // ایجاد خطای سفارشی
            const fetchError: SiteSpecificError = new Error(
              `Failed to fetch data for ${siteName}. Status: ${res.status}`
            );
            fetchError.site = siteName; // ضمیمه کردن نام سایت به خطا
            throw fetchError;
          }
          return res.json() as Promise<ApiSearchResponse>;
        })
        .then((data: ApiSearchResponse) => {
          // پردازش و به‌روزرسانی نتایج برای سایت فعلی
          setResults((prevResults) => {
            let siteData: JobItem[] | FreelancerItem[] | null = null;
            const config = SITES_CONFIG[siteName]; // siteName اینجا از نوع SiteName است

            if (config.type === "freelancer") {
              siteData = data.freelancers || config.default;
            } else {
              // config.type === "job"
              siteData = data.jobs || config.default;
            }
            return {
              ...prevResults,
              [siteName]: siteData,
            };
          });

          // اگر این اولین پاسخ موفقیت آمیز است، isLoading را false کن
          if (!firstSuccessProcessedRef.current) {
            setIsLoading(false);
            firstSuccessProcessedRef.current = true;
          }
        })
        .catch((err: Error | SiteSpecificError) => {
          // نوع خطا می‌تواند Error یا SiteSpecificError باشد
          const siteNameForError = (err as SiteSpecificError).site || siteName; // دریافت نام سایت از خطا یا closure

          console.error(
            `Error fetching data for ${siteNameForError}:`,
            err.message
          );
          setError((prevError) => {
            const message =
              err.message || `Error with site: ${siteNameForError}`;
            return prevError ? `${prevError}\n${message}` : message;
          });
          // در صورت خطا، نتیجه آن سایت را null قرار می‌دهیم
          setResults((prevResults) => ({
            ...prevResults,
            [siteNameForError]: null,
          }));
        })
        .finally(() => {
          pendingRequestsRef.current -= 1;
          // اگر همه درخواست‌ها تمام شده‌اند و هیچکدام موفقیت آمیز نبوده (isLoading هنوز true است)
          // یا به عبارت دیگر، firstSuccessProcessedRef هنوز false است
          if (
            pendingRequestsRef.current === 0 &&
            !firstSuccessProcessedRef.current
          ) {
            setIsLoading(false);
          }
        });
    });

    // نکته: برای جلوگیری از آپدیت state روی کامپوننت unmount شده، می‌توان از AbortController
    // در یک cleanup function مربوط به useEffect استفاده کرد. پیاده‌سازی آن در اینجا برای سادگی حذف شده است.
    // return () => {
    // controller.abort() for each request
    // };
  }, [keyword, stableIgnoredSites]); // وابستگی‌های useEffect

  return { results, isLoading, error };
}
