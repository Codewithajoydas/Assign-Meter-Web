import { NextResponse } from "next/server";

export default function middleware(request) {
  const access_token = request.cookies.get("access_token")?.value;
  console.log("access_token", access_token);
  console.log("request", request);
  const { pathname } = request.nextUrl;

  if (!access_token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (access_token && pathname === "/login") {
    return NextResponse.redirect(new URL("/meter", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
