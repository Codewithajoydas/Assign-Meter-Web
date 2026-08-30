import { cookies } from "next/headers";

export async function GET() {
  try {
    // Get access token from cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return Response.json(
        {
          status: "error",
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    // Call backend API
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/last-unmapped-report/last-modified`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    // Handle backend errors
    if (!response.ok) {
      let errorData;

      try {
        errorData = await response.json();
      } catch {
        errorData = null;
      }

      return Response.json(
        {
          status: "error",
          message:
            errorData?.message || "Failed to fetch last modified date",
        },
        {
          status: response.status,
        },
      );
    }

    // Return backend response
    const data = await response.json();
    console.log(response)
    return Response.json(data, {
      status: 200,
    });
  } catch (error) {
    console.error("GET /last-modified-date error:", error);

    return Response.json(
      {
        status: "error",
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}