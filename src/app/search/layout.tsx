"use client";

import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ padding: "1rem" }}>
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
