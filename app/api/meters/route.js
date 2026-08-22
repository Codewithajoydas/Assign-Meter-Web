import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("access_token")?.value;

  if (!access_token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const query = new URLSearchParams();
  query.set("pageNumber", searchParams.get("page") ?? "1");
  query.set("limit", searchParams.get("limit") ?? "100");
  query.set("sort", searchParams.get("sort") ?? "desc");

  const passthroughKeys = [
    "startDate",
    "endDate",
    "agency",
    "meterType",
    "store",
    "installationType",
    "status",
  ];
  for (const key of passthroughKeys) {
    const val = searchParams.get(key);
    if (val) query.set(key, val);
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getmeterdetails?${query.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Proxy fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}