import { cookies } from "next/headers";

export async function GET() {
  try {
    const token = (await cookies()).get("access_token")?.value;

    if (!token) {
      return Response.json(
        {
          status: "error",
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const response = await fetch(
      `${process.env.BACKEND_URL}/api/last-unmapped-report`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response;
  } catch (error) {
    console.error("Last Unmapped Report Error:", error);

    return Response.json(
      {
        status: "error",
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}