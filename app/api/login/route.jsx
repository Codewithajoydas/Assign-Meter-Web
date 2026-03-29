import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  const res = await fetch(
    "https://assign-meter-backend.onrender.com/api/signin",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  const data = await res.json();
console.log(data)
  if (!res.ok) {
    return NextResponse.json({ error: "Login failed" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("token", data.data.token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax", 
    path: "/",
  });
    response.cookies.set("user", data.data.user, {
      httpOnly: true,
      secure: true,
      sameSite: "lax", 
      path: "/",
    });

  return response;
}
