"use client";

import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  return (
    <div
      className="min-h-screen flex items-center justify-center text-center"
      dir="rtl"
    >
      {query ? (
        <h1 className="text-2xl font-bold">
          نتایج برای: <span className="text-blue-600">{query}</span>
        </h1>
      ) : (
        <h1 className="text-xl text-gray-500">هیچ عبارتی وارد نشده!</h1>
      )}
    </div>
  );
}
