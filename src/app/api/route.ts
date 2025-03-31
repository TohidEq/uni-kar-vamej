import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword");
  const startSalary = searchParams.get("startSalary");

  if (!keyword) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }
  return new Response(JSON.stringify({ keyword, startSalary }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
