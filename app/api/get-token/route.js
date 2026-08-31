import { cookies } from "next/headers";

export async function GET(req) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) {
        return new Response("Unauthorized", { status: 401 });
    }
    return new Response(token);
}