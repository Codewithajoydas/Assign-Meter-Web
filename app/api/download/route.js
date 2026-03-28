import { cookies } from "next/headers";

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }
  const { searchParams } = new URL(req.url);

  const queryString = searchParams.toString();

  const backendUrl = `https://assign-meter-backend.onrender.com/api/download${
    queryString ? `?${queryString}` : ""
  }`;
      

    const backendRes = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!backendRes.ok) {
      return new Response("Failed to fetch file", { status: 500 });
    }

    const fileStream = backendRes.body;

    const contentType =
      backendRes.headers.get("content-type") || "application/octet-stream";

    const contentDisposition =
      backendRes.headers.get("content-disposition") ||
      "attachment; filename=report.xlsx";

    return new Response(fileStream, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Server Error", { status: 500 });
  }
}
