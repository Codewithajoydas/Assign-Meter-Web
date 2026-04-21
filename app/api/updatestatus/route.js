import { cookies } from "next/headers";

export async function POST(req) {
  try {
    // 1. Get form data (NOT json)
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "File missing" }, { status: 400 });
    }

    // 2. Get token
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Recreate FormData for forwarding
    const newFormData = new FormData();
    newFormData.append("file", file);

    // 4. Send to Express backend
    const response = await fetch(
      "http://localhost:9000/api/statusupdate",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: newFormData,
      },
    );

    const data = await response.json();

    return Response.json(data, { status: response.status });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
