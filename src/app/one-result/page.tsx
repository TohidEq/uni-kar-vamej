"use client";

import { useEffect, useState } from "react";
import {
  FaSpinner,
  FaInfoCircle,
  FaHeart,
  FaRegHeart,
  FaExternalLinkAlt,
  FaBuilding,
  FaBriefcase,
  FaDollarSign,
  FaMapMarkerAlt,
  FaClock,
  FaSync,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
// import { JobItem, FreelancerItem } from "@/types/itemTypes";
import { useFavorites } from "@/hooks/useFavorites";
import { useOneSearchResult } from "@/hooks/useOneSearchResult";

const DEFAULT_IMAGE_URL_SQUARE = "/smile.svg";

export default function OneResultPage() {
  const [localItem, setLocalItem] = useState<JobItem | FreelancerItem | null>(
    null
  );
  const [displayItem, setDisplayItem] = useState<
    JobItem | FreelancerItem | null
  >(null);
  const [loadingLocal, setLoadingLocal] = useState(true);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const { favoriteItems, toggleFavorite } = useFavorites();
  const {
    data: fetchedItem,
    isLoading: isFetching,
    error: fetchError,
    fetchOneResult,
  } = useOneSearchResult();

  useEffect(() => {
    try {
      const storedItem = localStorage.getItem("selectedItemForDetailPage");
      if (storedItem) {
        const parsedItem: JobItem | FreelancerItem = JSON.parse(storedItem);
        setLocalItem(parsedItem);
        setDisplayItem(parsedItem);
      } else {
        setErrorLocal("هیچ آیتمی انتخاب نشده است.");
      }
    } catch (e) {
      console.error("خطا در بارگذاری آیتم:", e);
      setErrorLocal("مشکلی در بارگذاری اطلاعات پیش آمد.");
    } finally {
      setLoadingLocal(false);
    }
  }, []);

  useEffect(() => {
    if (fetchedItem) {
      setDisplayItem(fetchedItem);
    }
  }, [fetchedItem]);

  const handleFetchDetails = () => {
    if (localItem) {
      fetchOneResult(localItem.url, localItem.type);
    }
  };

  const isFavorite = displayItem
    ? favoriteItems.some((fav) => fav.url === displayItem.url)
    : false;
  const isJobType = displayItem
    ? ["jobinja", "jobvision"].includes(displayItem.type)
    : false;
  const displayCaptionLines = displayItem
    ? displayItem.caption
    : ["توضیحات موجود نیست."];

  if (loadingLocal) {
    return (
      <div className="min-h-screen flex justify-center items-center" dir="rtl">
        <div className="text-center my-10">
          <FaSpinner className="animate-spin text-4xl text-primary mx-auto" />
          <p className="mt-3 text-lg opacity-75">درحال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (errorLocal || !displayItem) {
    return (
      <div className="min-h-screen flex justify-center items-center" dir="rtl">
        <div className="alert alert-error my-8 shadow-md items-start max-w-lg mx-auto">
          <FaInfoCircle className="text-2xl mt-1 shrink-0" />
          <div>
            <h3 className="font-bold text-lg">خطا!</h3>
            <p className="text-sm whitespace-pre-wrap">
              {errorLocal || "آیتم یافت نشد."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container my-container rounded-box mx-auto p-2 sm:p-6 lg:p-8 bg-base-200 min-h-screen"
      dir="rtl"
    >
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-8 text-center text-primary">
        جزئیات آگهی: {displayItem.title}
      </h1>

      {fetchError && (
        <div className="alert alert-error my-4 shadow-md items-start max-w-lg mx-auto">
          <FaInfoCircle className="text-2xl mt-1 shrink-0" />
          <div>
            <h3 className="font-bold text-lg">خطا در دریافت اطلاعات!</h3>
            <p className="text-sm whitespace-pre-wrap">{fetchError}</p>
          </div>
        </div>
      )}

      <div className="card w-full max-w-2xl bg-base-100 shadow-xl border border-gray-200/20 hover:shadow-2xl transition-shadow duration-300 ease-in-out mx-auto rounded-box">
        <div className="card-body p-4 sm:p-6 flex flex-col">
          {/* Image and Main Info */}
          <div className="flex items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
              <Image
                src={displayItem.image || DEFAULT_IMAGE_URL_SQUARE}
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_IMAGE_URL_SQUARE;
                }}
                alt={displayItem.title || "تصویر آگهی"}
                width={120}
                height={120}
                className="w-full object-cover rounded-xl"
                loading="lazy"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="card-title text-lg sm:text-xl md:text-2xl font-bold leading-tight mb-1 sm:mb-2">
                {displayItem.title}
              </h2>
              {displayItem.owner && (
                <div className="flex items-center text-sm text-gray-600 mb-1.5 sm:mb-2">
                  {isJobType ? (
                    <FaBuilding className="ml-1.5 opacity-70 flex-shrink-0 w-4 h-4" />
                  ) : (
                    <FaBriefcase className="ml-1.5 opacity-70 flex-shrink-0 w-4 h-4" />
                  )}
                  <span className="truncate">{displayItem.owner}</span>
                </div>
              )}
              {displayItem.salary && (
                <div className="flex items-center text-sm text-primary font-semibold mb-1.5 sm:mb-2">
                  <FaDollarSign className="ml-1.5 w-4 h-4" />
                  <span>
                    {displayItem.salary === -1 ? "توافقی" : displayItem.salary}
                  </span>
                </div>
              )}
              {"location" in displayItem && displayItem.location && (
                <div className="flex items-center text-sm text-gray-600 mb-1.5 sm:mb-2">
                  <FaMapMarkerAlt className="ml-1.5 w-4 h-4" />
                  <span className="truncate">{displayItem.location}</span>
                </div>
              )}
              {displayItem.time && (
                <div className="flex items-center text-sm text-gray-600">
                  <FaClock className="ml-1.5 w-4 h-4" />
                  <span>{displayItem.time}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-2">توضیحات</h3>
            <div className="text-sm sm:text-base opacity-75 leading-relaxed space-y-2">
              <p className="text-right">{displayCaptionLines}</p>
            </div>
          </div>

          {/* Additional Job Details */}
          {"jobType" in displayItem && displayItem.jobType && (
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                نوع شغل
              </h3>
              <p className="text-sm sm:text-base opacity-75">
                {displayItem.jobType}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="card-actions justify-between items-center border-t border-gray-200/10 pt-4 sm:pt-5 mt-auto">
            <div className="flex gap-2">
              <a
                href={displayItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline px-4 sm:px-6 btn-primary btn-sm text-sm leading-none"
              >
                <FaExternalLinkAlt className="ml-2" />
                مشاهده آگهی اصلی
              </a>
              <button
                onClick={handleFetchDetails}
                className="btn btn-primary px-4 sm:px-6 btn-sm text-sm leading-none flex items-center"
                disabled={isFetching}
              >
                {isFetching ? (
                  <FaSpinner className="animate-spin w-5 h-5 ml-2" />
                ) : (
                  <FaSync className="ml-2" />
                )}
                دریافت اطلاعات کامل
              </button>
            </div>
            <button
              onClick={() => toggleFavorite(displayItem)}
              className="btn btn-ghost btn-circle btn-sm hover:text-red-500 hover:bg-red-100/60 transition-colors flex-shrink-0"
              aria-label="علاقه‌مندی"
            >
              {isFavorite ? (
                <FaHeart className="w-5 h-5 text-red-500" />
              ) : (
                <FaRegHeart className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <Link
        href="/search"
        className="btn btn-ghost mt-6 mx-auto block max-w-xs text-center"
      >
        بازگشت به جستجو
      </Link>
    </div>
  );
}
