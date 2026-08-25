import { cookies } from "next/headers";
import WorkforceManage from "./WorkforceManage";

export default async function Page() {
  const cookieStore = await cookies();

  const token = cookieStore.get("access_token")?.value;
  console.log(token)
  if (!token) {
    return (
      <WorkforceManage
        initialUsers={[]}
        initialError="Unauthorized"
      />
    );
  }

  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/getusers`,
      {
        method: "GET",
        headers: {
          content: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return (
        // eslint-disable-next-line react-hooks/error-boundaries
        <WorkforceManage
          initialUsers={[]}
          initialError={data.message || "Failed to load users"}
        />
      );
    }

    return (
      // eslint-disable-next-line react-hooks/error-boundaries
      <WorkforceManage
        initialUsers={data.users || []}
        initialError=""
      />
    );
  } catch (error) {
    console.error("Failed to fetch users:", error);

    return (
      <WorkforceManage
        initialUsers={[]}
        initialError="Network error while loading users"
      />
    );
  }
}