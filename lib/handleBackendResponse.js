export async function handleBackendResponse(backendRes) {
  let data;

  try {
    data = await backendRes.json();
  } catch {
    data = null;
  }

  const errorMessages = {
    400: "Invalid request",
    401: "Unauthorized. Please login again",
    403: "You are not allowed to do any action here",
    404: "The requested resource was not found",
    405: "This method is not allowed",
    408: "Request timed out",
    409: "The request conflicts with the current state",
    410: "The requested resource is no longer available",
    422: "The provided data is invalid",
    429: "Too many requests. Please try again later",
    500: "Internal server error",
    502: "Bad gateway",
    503: "Service is temporarily unavailable",
    504: "Backend server timed out",
  };

  if (!backendRes.ok) {
    return Response.json(
      {
        status: "error",
        message:
          errorMessages[backendRes.status] ||
          data?.message ||
          "Something went wrong",
      },
      {
        status: backendRes.status,
      },
    );
  }

  return Response.json(data, {
    status: backendRes.status,
  });
}