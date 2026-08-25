import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;
/*
 * Get authentication token from Next.js server cookie.
 */
async function getToken() {
  const cookieStore = await cookies();
  const accesstoken = cookieStore.get("access_token")?.value;
  return accesstoken;
}

/*
 * Create authorization headers for backend requests.
 */
function getAuthHeaders(token, contentType = false) {
  return {
    ...(contentType && {
      "Content-Type": "application/json",
    }),

    Authorization: `Bearer ${token}`,
  };
}

/*
 * Forward backend response.
 */
async function forwardResponse(response) {
  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
}

/*
 * GET
 *
 * Browser
 *   ↓
 * Next.js /api/workforce
 *   ↓
 * cookies()
 *   ↓
 * Authorization: Bearer <token>
 *   ↓
 * Backend /api/getusers
 */
export async function GET() {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json(
        {
          status: "error",
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/getusers`, {
      method: "GET",

      headers: getAuthHeaders(token),

      cache: "no-store",
    });

    return forwardResponse(response);
  } catch (error) {
    console.error("GET /api/workforce:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch users",
      },
      {
        status: 500,
      },
    );
  }
}

/*
 * POST
 *
 * Create user
 */
export async function POST(request) {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json(
        {
          status: "error",
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/createuser`, {
      method: "POST",

      headers: getAuthHeaders(token, true),

      body: JSON.stringify(body),
    });

    return forwardResponse(response);
  } catch (error) {
    console.error("POST /api/workforce:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Failed to create user",
      },
      {
        status: 500,
      },
    );
  }
}

/*
 * PATCH
 *
 * Update user
 */
export async function PATCH(request) {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json(
        {
          status: "error",
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/updateuser`, {
      method: "PATCH",

      headers: getAuthHeaders(token, true),

      body: JSON.stringify(body),
    });

    return forwardResponse(response);
  } catch (error) {
    console.error("PATCH /api/workforce:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Failed to update user",
      },
      {
        status: 500,
      },
    );
  }
}

/*
 * DELETE
 *
 * Delete user
 */
export async function DELETE(request) {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json(
        {
          status: "error",
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/deleteuser`, {
      method: "DELETE",

      headers: getAuthHeaders(token, true),

      body: JSON.stringify(body),
    });

    return forwardResponse(response);
  } catch (error) {
    console.error("DELETE /api/workforce:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Failed to delete user",
      },
      {
        status: 500,
      },
    );
  }
}
