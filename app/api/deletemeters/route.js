import { handleBackendResponse } from "@/lib/handleBackendResponse";
import { cookies } from "next/headers";

export async function DELETE(req) {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("access_token")?.value;

  if (!access_token) {
    return Response.json(
      {
        status: "error",
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  try {
    const body = await req.json();

    const backendRes = await fetch(
      `${process.env.BACKEND_URL}/api/deletemeter`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );
    if(!backendRes.ok) {
      return handleBackendResponse(backendRes);
    }
    const data = await backendRes.json();
    return Response.json(data, {
      status: backendRes.status,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        status: "error",
        message: "Failed to delete meters",
      },
      { status: 500 },
    );
  }
}