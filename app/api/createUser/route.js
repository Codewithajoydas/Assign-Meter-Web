import { cookies } from "next/headers";

export async function POST(req) {
  let body;

  try {
    body = await req.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
    });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("accsess_token")?.value;
  console.log("The Token is ", token);
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

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Invalid JSON from backend",
        raw: text,
      }),
      { status: 500 },
    );
  }

  return new Response(JSON.stringify(data), {
    status: response.status,
  });
}
