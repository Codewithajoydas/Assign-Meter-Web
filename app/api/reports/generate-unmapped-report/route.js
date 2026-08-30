import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return Response.json(
        {
          status: "error",
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const formData = await request.formData();

    const response = await fetch(
      `${process.env.BACKEND_URL}/api/generateReport`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const error = await response.json();

        return Response.json(error, {
          status: response.status,
        });
      }

      const errorText = await response.text();

      return Response.json(
        {
          status: "error",
          message: errorText || "Failed to generate report",
        },
        {
          status: response.status,
        },
      );
    }

    const blob = await response.blob();

    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "text/csv",
        "Content-Disposition":
          response.headers.get("content-disposition") ||
          'attachment; filename="unmapped_report.csv"',
      },
    });
  } catch (error) {
    console.error("Generate report proxy error:", error);

    return Response.json(
      {
        status: "error",
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}