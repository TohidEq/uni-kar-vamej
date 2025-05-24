"use client";

import { useParams } from "next/navigation";

export default function SearchKeywordPage() {
  const params = useParams();
  const keyword = params.keyword || ":)";

  return (
    <div
      className="min-h-screen flex items-center justify-center text-center"
      dir="rtl"
    >
      {keyword ? (
        <h1 className="text-2xl font-bold">
          نتایج برای: <span className="text-blue-600">{keyword}</span>
        </h1>
      ) : (
        <h1 className="text-xl text-gray-500">هیچ عبارتی وارد نشده!</h1>
      )}
    </div>
  );
}
