import { cookies } from "next/headers";

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const access_token = cookieStore.get("access_token")?.value;

    if (!access_token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const backendRes = await fetch(
      "https://assign-meter-backend.onrender.com/api/download/whole",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    if (!backendRes.ok) {
      return new Response("Failed to fetch file", { status: 500 });
    }

    return new Response(backendRes.body, {
      headers: {
        "Content-Type":
          backendRes.headers.get("content-type") || "application/octet-stream",

        // ✅ VERY IMPORTANT
        "Content-Disposition":
          backendRes.headers.get("content-disposition") ||
          "attachment; filename=download.xlsx",
      },
    });
  } catch (err) {
    return new Response("Failed to fetch file", { status: 500 });
  }
}
