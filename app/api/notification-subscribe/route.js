import { handleBackendResponse } from "@/lib/handleBackendResponse";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.text();
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/push/subscribe`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body,
      },
    );

    if (!response.ok) {
      return handleBackendResponse(response);
    }

    return response;
  } catch (error) {
    console.error("Push subscribe proxy error:", error);

    return Response.json(
      { error: error.message },
      { status: 500 },
    );
  }
}