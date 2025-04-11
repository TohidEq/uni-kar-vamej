import getSearchResult from "@/lib/getSearchResult";
import { ALL_SITES } from "@/lib/globalVars";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword");
  const denySites = searchParams.get("denySites")?.split(",") || [];

  // Remove sites that are Denied
  const searchableSites = [...ALL_SITES.freelancer, ...ALL_SITES.job].filter(
    (item) => !denySites.includes(item)
  );

  if (!keyword) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  const a: JobItem = {
    title: "",
    caption: null,
    salary: 0,
    salaryStart: 0,
    salaryEnd: 0,
    image: null,
    time: null,
    owner: "",
    location: "",
    jobType: null,
    url: "",
  };

  const searchedResult = await getSearchResult({
    keyword: keyword,
    searchableSites: searchableSites,
  });

  return new Response(
    JSON.stringify({
      keyword,
      a,
      searchableSites: searchableSites,
      ...searchedResult,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
