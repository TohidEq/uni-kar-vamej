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
  };

  return new Response(JSON.stringify({ keyword, startSalary, a }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
