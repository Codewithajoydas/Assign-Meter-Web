import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/download/whole`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  );
  console.log("The response is ", backendRes);

  if (!backendRes.ok) {
    return new Response(await backendRes.text(), {
      status: backendRes.status,
    });
  }

  const buffer = await backendRes.arrayBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type":
        backendRes.headers.get("content-type") ??
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

      "Content-Disposition":
        backendRes.headers.get("content-disposition") ??
        'attachment; filename="download.xlsx"',
    },
  });
}