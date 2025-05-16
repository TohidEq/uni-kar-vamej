"use client";

import React from "react";
import { Github, BookOpen, Info } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-t-gray-500/40 pt-4 pb-6 mt-8 text-sm text-right bg-base-100 text-base-content">
      <div className="container max-w-[1000px] mx-auto flex flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between">
        {/* کپی‌رایت */}
        <p className="rtl text-center">
          © {2025} تمامی حقوق برای <span className="font-bold">کاروامج</span>{" "}
          محفوظ است.
        </p>

        {/* لینک‌ها */}
        <div className="flex flex-wrap gap-6 rtl text-center justify-center">
          <Link
            href="https://github.com/TohidEq/uni-kar-vamej"
            className="footer-link custom-link-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={18} className="footer-icon" />
            گیت‌هاب
          </Link>

          <Link
            href="https://deepwiki.com/TohidEq/uni-kar-vamej"
            className="footer-link custom-link-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BookOpen size={18} className="footer-icon" />
            مستندات
          </Link>

          <Link href="/about" className="footer-link custom-link-underline">
            <Info size={18} className="footer-icon" />
            درباره پروژه
          </Link>
        </div>
      </div>
    </footer>
  );
}
