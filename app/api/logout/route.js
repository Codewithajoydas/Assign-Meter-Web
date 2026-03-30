import { NextResponse } from "next/server";

export async function GET(req) {
  const response = NextResponse.redirect(new URL("/login", req.url));

  response.cookies.delete("access_token");

  return response;
}
