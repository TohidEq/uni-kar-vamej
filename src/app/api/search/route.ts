import getSearchResult from "@/lib/getSearchResult";
import { ALL_SITES } from "@/lib/globalVars";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword")?.replaceAll("+", " ");
  const allowSites = searchParams.get("allowSites")?.split(",") || [];

  // Remove sites that are Denied
  const searchableSites =
    allowSites[0] == "all"
      ? [...ALL_SITES.freelancer, ...ALL_SITES.job]
      : [...ALL_SITES.freelancer, ...ALL_SITES.job].filter((item) =>
          allowSites.includes(item)
        );

  if (!keyword) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  const searchedResult = await getSearchResult({
    keyword: keyword,
    searchableSites: searchableSites,
  });

  return new Response(
    JSON.stringify({
      keyword,
      searchableSites: searchableSites,
      ...searchedResult,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
