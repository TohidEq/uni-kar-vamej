// import { useState } from "react";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { SiteName } from "@/hooks/useSearchAllSites";

type SortOrderType = "none" | "asc" | "desc";

interface FilterBoxProps {
  allSites: SiteName[];
  ignoredSites: SiteName[];
  onFilterChange: (site: SiteName, isChecked: boolean) => void;
  sortOrder: SortOrderType;
  onSortChange: (order: SortOrderType) => void;
  showFilterBox: boolean;
}

export default function FilterBox({
  allSites,
  ignoredSites,
  onFilterChange,
  sortOrder,
  onSortChange,
  showFilterBox,
}: FilterBoxProps) {
  return (
    <div>
      <div
        className={`${
          showFilterBox
            ? "auto-height opacity-100 visible"
            : "no-height opacity-0 invisible"
        } overflow-hidden transition-all duration-300 ease-in-out  mt-3 mb-8 p-4 sm:p-6 bg-base-100 rounded-xl shadow-lg print:hidden`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Filter Sites */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3">
              نادیده گرفتن نتایج از:
            </h3>
            <div className="space-y-2">
              {allSites.map((site) => (
                <div className="form-control" key={`filter-${site}`}>
                  <label className="label cursor-pointer justify-start p-0">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm checkbox-secondary me-3"
                      checked={ignoredSites.includes(site)}
                      onChange={(e) => onFilterChange(site, e.target.checked)}
                    />
                    <span className="label-text text-sm sm:text-base">
                      {site}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3">
              مرتب‌سازی بر اساس قیمت:
            </h3>
            <div className="space-y-2">
              <div className="form-control">
                <label className="label cursor-pointer justify-start p-0">
                  <input
                    type="radio"
                    name="sortOrder"
                    className="radio radio-sm radio-primary me-3"
                    checked={sortOrder === "none"}
                    onChange={() => onSortChange("none")}
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
                    onChange={() => onSortChange("asc")}
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
                    onChange={() => onSortChange("desc")}
                  />
                  <span className="label-text text-sm sm:text-base flex items-center">
                    <FaSortAmountDown className="ms-1" /> زیاد به کم
                  </span>
                </label>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              آیتم‌هایی با قیمت «توافقی» یا نامشخص در انتهای لیست نمایش داده
              می‌شوند.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
