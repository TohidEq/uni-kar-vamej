import React from "react";
import { FaRocket, FaCode, FaUsers, FaStar } from "react-icons/fa"; // Import icons
import Link from "next/link";

export default function AboutPage() {
  return (
    <div
      className="container my-container mx-auto p-6 sm:p-8 lg:p-10"
      dir="rtl"
    >
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-primary">
        درباره‌ی کاروامج
      </h1>

      {/* Introduction Section */}
      <section className="mb-8">
        <p className="text-base opacity-80 leading-relaxed mb-4">
          کاروامج{" "}
          <span className="text-secondary">
            (Kar Vamej - وامج به گیلکی یعنی کاویدن و چنگ زدن برای جست و جو)
          </span>{" "}
          یک پلتفرم جستجوی کار است که با هدف متمرکز کردن آگهی‌های استخدامی و
          پروژه‌های فریلنسری از منابع مختلف ایجاد شده است. ما می‌خواهیم به شما
          کمک کنیم تا با صرف کمترین زمان، بهترین فرصت‌های شغلی را پیدا کنید.
        </p>
        <div className="flex items-center gap-2">
          <FaRocket className="text-2xl text-secondary" />
          <span className="text-sm opacity-70">
            شروعی دوباره برای جستجوی کار!
          </span>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">ویژگی‌های کلیدی</h2>
        <ul className="space-y-3 list-inside list-disc opacity-80">
          <li>
            <span className="font-medium">یکپارچه‌سازی آگهی‌ها:</span> جمع‌آوری
            آگهی‌های استخدامی از منابع مختلف برای صرفه‌جویی در زمان شما.
          </li>
          <li>
            <span className="font-medium">جستجوی پیشرفته:</span> فیلتر کردن و
            مرتب‌سازی نتایج برای یافتن سریع‌تر فرصت‌های مناسب.
          </li>
          <li>
            <span className="font-medium">رابط کاربری ساده:</span> تجربه‌ای
            کاربرپسند و آسان برای استفاده.
          </li>
        </ul>
      </section>

      {/* Technology Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">فناوری‌های استفاده شده</h2>
        <div className="flex items-center gap-2">
          <FaCode className="text-2xl text-accent" />
          <span className="text-sm opacity-70">
            Next.js, React, Tailwind CSS, DaisyUI
          </span>
        </div>
      </section>

      {/* Team/Community Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">جامعه و توسعه</h2>
        <p className="text-base opacity-80 leading-relaxed mb-4">
          این پروژه متن‌باز است و توسط یک تیم کوچک توسعه داده می‌شود. ما از
          بازخورد شما استقبال می‌کنیم و از مشارکت شما در توسعه پروژه خوشحال
          می‌شویم.
        </p>
        <div className="flex items-center gap-2">
          <FaUsers className="text-2xl text-gray-500" />
          <span className="text-sm opacity-70">
            با ما در ارتباط باشید و به ما بپیوندید!
          </span>
        </div>
      </section>

      {/* Open Source & Contribution Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">متن‌باز و مشارکت</h2>
        <p className="text-base opacity-80 leading-relaxed mb-4">
          کد منبع این پروژه در گیت‌هاب در دسترس است. اگر علاقه‌مند به مشارکت در
          توسعه هستید، لطفاً از طریق گیت‌هاب با ما در ارتباط باشید.
        </p>
        <Link
          href="https://github.com/TohidEq/uni-kar-vamej"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline btn-primary"
        >
          <FaStar className="ml-2" />
          مشاهده در گیت‌هاب
        </Link>
      </section>
    </div>
  );
}
