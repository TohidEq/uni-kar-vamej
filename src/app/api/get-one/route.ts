import { NextResponse } from "next/server";
import getOneSearchResult from "@/lib/getOneSearchResult";
import { ALL_SITES } from "@/lib/globalVars";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { url, siteType } = body;

    // Validate inputs
    if (!url || !siteType) {
      return NextResponse.json(
        { error: "url and siteType are required" },
        { status: 400 }
      );
    }

    // Validate siteType
    const validSiteTypes = [...ALL_SITES.freelancer, ...ALL_SITES.job];
    if (!validSiteTypes.includes(siteType)) {
      return NextResponse.json(
        {
          error: `Invalid siteType. Must be one of: ${validSiteTypes.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // Call getOneSearchResult to scrape the specific item
    const result = await getOneSearchResult({ url, siteType });

    // Check if result is valid
    if (!result) {
      return NextResponse.json(
        { error: "No data found for the provided URL" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      url,
      siteType,
      result,
    });
  } catch (error) {
    console.error("Error in get-one API:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
