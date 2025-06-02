"use client";
import Image from "next/image";
// import { JobItem, FreelancerItem } from "@/types/itemTypes";

interface ItemCardProps {
  item: JobItem | FreelancerItem;
  isFavorite: boolean;
  onToggleFavorite: (item: JobItem | FreelancerItem) => void;
}

// src/components/ItemCard.tsx
import React, { memo } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaBriefcase,
  FaClock,
  FaDollarSign,
  FaBuilding,
} from "react-icons/fa";
import Link from "next/link";
import { PriceFormatter } from "@/utils/iranianMoneyUtils";

// تایپ‌ها باید از فایل مربوطه import شوند
// import type { JobItem, FreelancerItem } from "@/types/itemTypes";

export type Item = JobItem | FreelancerItem; // JobItem و FreelancerItem باید تعریف شده باشند

interface ItemCardProps {
  item: Item;
  isFavorite: boolean;
  onToggleFavorite: (item: Item) => void;
}

const DEFAULT_IMAGE_URL_SQUARE = "/smile.svg"; // کمی بزرگتر برای وضوح بهتر

const truncateText = (
  text: string | null | undefined,
  maxLength: number
): string => {
  if (!text) return "توضیحات موجود نیست.";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isFavorite,
  onToggleFavorite,
}) => {
  const { title, owner, salary, caption, time, image, url, type } = item;

  const displayCaption = truncateText(caption, 150); // طول توضیحات ممکن است نیاز به تنظیم داشته باشد
  const isJobType = "jobinja jobvision".includes(item.type);

  const handleViewDetailsLocal = () => {
    try {
      localStorage.setItem("selectedItemForDetailPage", JSON.stringify(item));
    } catch (e) {
      console.error("خطا در ذخیره‌سازی در localStorage:", e);
      alert("مشکلی در آماده‌سازی اطلاعات برای نمایش جزئیات پیش آمد.");
    }
  };

  return (
    <div
      dir="rtl"
      className="card w-full max-w-lg bg-base-100 shadow-xl border border-gray-200/20 hover:shadow-2xl transition-shadow duration-300 ease-in-out mx-auto rounded-box"
    >
      <div className="card-body p-4 sm:p-5 flex flex-col">
        {/* بخش بالایی: تصویر کوچک + (عنوان/مالک/دستمزد/مکان) */}
        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
          {/* تصویر کوچک و گرد شده در سمت راست */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
            <Image
              src={image || DEFAULT_IMAGE_URL_SQUARE}
              onError={(e) => {
                e.currentTarget.src = DEFAULT_IMAGE_URL_SQUARE;
              }}
              alt={title || "تصویر آگهی"}
              width={100}
              height={100}
              className="w-full object-cover rounded-xl"
              loading="lazy"
            />
          </div>

          {/* محتوای کنار تصویر (عنوان، مالک، دستمزد، مکان) */}
          <div className="flex-1 min-w-0">
            {/* عنوان */}
            <h2 className="card-title text-base sm:text-lg md:text-xl font-bold  leading-tight LTR:mr-1 RTL:ml-1 mb-0.5 sm:mb-1">
              {title}
            </h2>
            {/* مالک */}
            {owner && (
              <div className="flex items-center text-xs sm:text-sm text-xx mb-1 sm:mb-1.5">
                {isJobType ? (
                  <FaBuilding className="ml-1.5 opactiy-70 flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <FaBriefcase className="ml-1.5 opactiy-70 flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4" />
                )}
                <span className="truncate">{owner}</span>
              </div>
            )}
            {/* دستمزد */}
            {(salary || salary === 0) && (
              <div className="flex items-center text-xs sm:text-sm text-primary font-semibold mb-1 sm:mb-1.5">
                <FaDollarSign className="ml-1.5 w-3 h-3 sm:w-4 sm:h-4" />
                <span>{salary < 1 ? "توافقی" : PriceFormatter(salary)}</span>
              </div>
            )}
            {/* مکان */}
            {"location" in item && item.location && (
              <div className="flex items-center text-xs opactiy-70">
                <FaMapMarkerAlt className="ml-1.5 w-3 h-3 sm:w-4 sm:h-4" />
                <span className="truncate">{item.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* توضیحات */}
        <p className="text-sm opacity-75 mb-3 sm:mb-4 leading-relaxed min-h-[40px] sm:min-h-[60px]">
          {displayCaption}
        </p>

        {/* زمان و منبع */}
        <div className="flex justify-between items-center text-xs  mb-3 sm:mb-4">
          {time && (
            <div className="flex items-center">
              <FaClock className="ml-1.5 w-3 h-3" />{" "}
              {/* آیکون کمی بزرگتر و با فاصله */}
              <span>{time}</span>
            </div>
          )}
          <span className="badge badge-outline badge-xs sm:badge-sm py-2">
            {type}
          </span>
        </div>

        {/* بخش دکمه‌ها و قلب */}
        <div className="card-actions justify-between items-center border-t border-gray-200/10 pt-3 sm:pt-4 mt-auto">
          {/* گروه دکمه‌های اصلی در سمت راست */}
          <div className="flex gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline px-1.5 sm:!px-4 md:!px-6 btn-primary btn-sm !text-xs sm:!text-sm !leading-none"
            >
              <FaExternalLinkAlt className="ml-1 sm:ml-2" />
              آگهی اصلی
            </a>
            <Link href="/one-result" legacyBehavior>
              <a
                onClick={handleViewDetailsLocal}
                className="btn btn-primary px-1.5 sm:!px-4 md:!px-6 btn-sm !text-xs sm:!text-sm !leading-none"
              >
                <FaInfoCircle className="ml-1 sm:ml-2" />
                جزئیات
              </a>
            </Link>
          </div>

          {/* دکمه قلب در سمت چپ */}
          <button
            onClick={() => onToggleFavorite(item)}
            className="btn btn-ghost btn-circle btn-sm  hover:text-red-500 hover:bg-red-100/60 transition-colors flex-shrink-0"
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
  );
};

export default memo(ItemCard);
