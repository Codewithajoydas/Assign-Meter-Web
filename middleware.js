import { NextResponse } from "next/server";

export default function middleware(request) {
  const accsess_token = request.cookies.get("accsess_token")?.value;
  console.log("accsess_token", accsess_token);
  const { pathname } = request.nextUrl;

  if (!accsess_token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (accsess_token && pathname === "/login") {
    return NextResponse.redirect(new URL("/meter", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
