// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const body = await req.json();

//     const backendResponse = await fetch(
//       `${process.env.BACKEND_URL}/api/signin`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//       },
//     );

//     const data = await backendResponse.json();

//     if (!backendResponse.ok) {
//       return NextResponse.json(
//         {
//           status: "error",
//           message: data.message || "Login failed",
//         },
//         {
//           status: backendResponse.status,
//         },
//       );
//     }

//     const response = NextResponse.json(
//       {
//         status: "success",
//         data: {
//           user: data.data.user,
//         },
//       },
//       {
//         status: 200,
//       },
//     );

//     response.cookies.set("access_token", data.data.token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//       maxAge: 60 * 60 * 24 * 7,
//     });

//     response.cookies.set(
//       "user",
//       JSON.stringify(data.data.user),
//       {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "lax",
//         path: "/",
//         maxAge: 60 * 60 * 24 * 7,
//       },
//     );

//     return response;
//   } catch (error) {
//     console.error("Login proxy error:", error);

//     return NextResponse.json(
//       {
//         status: "error",
//         message: "Internal server error",
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }