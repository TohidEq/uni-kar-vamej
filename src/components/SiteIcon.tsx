import Link from "next/link";
import React from "react";

function SiteIcon() {
  const siteSVG = (
    <svg
      className="w-8 h-8 transition-transform duration-500 ease-in-out group-hover:rotate-12"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      version="1.0"
      viewBox="0 0 214 223"
      fill="currentColor"
      stroke="none"
    >
      <g>
        <path d="M75 8c-32 7-55 29-65 59-3 11-4 31-1 43a86 86 0 0 0 93 66c11-1 25-6 33-11l6-4 4 5c4 3 5 5 5 9 1 4 2 5 18 22l20 20c9 6 23-3 20-15 0-3-3-6-20-23-18-19-20-20-23-20s-4-1-7-4l-4-4 5-7c7-9 13-21 16-31 2-9 2-34 0-43-7-26-28-48-52-57-14-6-35-8-48-5zm38 15a71 71 0 0 1 28 120 70 70 0 0 1-46 20c-14 0-23-2-35-8-8-4-11-6-19-13l-13-18c-6-12-8-19-7-33 0-9 0-13 2-19a72 72 0 0 1 90-49z" />
        <path d="M78 41c-4 2-8 7-8 12v3H60c-12 0-16 1-18 6s-2 16-1 18l40 9 1-4c0-4 2-5 10-5s10 1 10 6c0 4-2 4 24-2l17-4v-8l-1-11c-2-4-7-5-18-5h-10v-4c0-5-3-9-7-11-6-3-24-3-29 0zm27 8 1 4v3H92c-13 0-14 0-14-2l1-4c1-2 2-2 13-2l13 1z" />
        <path d="M40 104c0 18 1 22 6 25l46 1c42 0 44 0 47-2l3-2 1-38-20 4-20 5-1 3c-2 6-9 9-16 5-3-1-4-3-4-6 0-2 1-2-20-6l-19-5h-3v16z" />
      </g>
    </svg>
  );

  return (
    <Link
      href="/"
      className="flex items-center gap-2 px-3 py-2 group select-none"
    >
      {siteSVG}
      <span className="text-lg font-semibold transition-transform duration-300 hover:scale-105 ">
        کاروامج
      </span>
    </Link>
  );
}

export default SiteIcon;
