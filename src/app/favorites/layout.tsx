"use client";

import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="px-1 sm:p-4">
      <Navbar enableFavoriteLink={true} />
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <Loader2
              size={48}
              className="animate-spin"
              strokeWidth={2}
              color="#4F46E5"
            />
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}
