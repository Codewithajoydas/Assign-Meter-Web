import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect(
    new URL("/login", "http://localhost:3001"),
  );

  response.cookies.delete("token");

  return response;
}
