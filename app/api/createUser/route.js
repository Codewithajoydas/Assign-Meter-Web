import { cookies } from "next/headers";

export async function POST(req) {
  const body = await req.json();

  const token = cookies().get("access_token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const response = await fetch(
    "https://assign-meter-backend.onrender.com/api/createuser",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
  });
}
