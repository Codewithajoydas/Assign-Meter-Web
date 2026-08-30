import { handleBackendResponse } from "@/lib/handleBackendResponse";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return Response.json(
        {
          status: "error",
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const backendResponse = await fetch(
      `${process.env.BACKEND_URL}/api/download/whole`,
      {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        cache: "no-store",
      },
    );

    if (!backendResponse.ok) {
      return handleBackendResponse(backendResponse);
    }

    const headers = new Headers();

    const contentType = backendResponse.headers.get("content-type");

    const contentDisposition = backendResponse.headers.get(
      "content-disposition",
    );

    if (contentType) {
      headers.set("Content-Type", contentType);
    }

    if (contentDisposition) {
      headers.set("Content-Disposition", contentDisposition);
    }

    headers.set("Cache-Control", "no-cache");

    return new Response(backendResponse.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("DOWNLOAD PROXY ERROR:", error);

    return Response.json(
      {
        status: "error",
        message: "Unable to download report",
      },
      {
        status: 500,
      },
    );
  }
}
