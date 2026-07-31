import { cookies } from "next/headers";
import MapLoader from "@/components/MapLoader";
import TemButton from "@/components/TemButton";

// TODO: move to an env var (e.g. process.env.BACKEND_URL) so dev/staging/prod
// don't require editing this file each time.
const BACKEND_URL = "https://assign-meter-backend.onrender.com/api/bledevices";

export default async function Page({ params }) {
  const cookieStore = await cookies();
  const paramss = await params;
  const access_token = cookieStore.get("access_token")?.value;

  let data;
  try {
    const res = await fetch(BACKEND_URL, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <p className="text-gray-400">
            Backend returned an error (HTTP {res.status})
          </p>
        </div>
      );
    }

    data = await res.json();
  } catch (err) {
    console.error("Failed to reach backend:", err.message);
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 font-medium">Can't reach the backend</p>
          <p className="text-gray-400 text-sm mt-1">
            {BACKEND_URL} — is the API server running?
          </p>
        </div>
      </div>
    );
  }

  // /api/bledevices returns a list of scanned devices, not a single
  // meter — each item carries its own location.
  const devices = Array.isArray(data.data) ? data.data : [];

  const located = devices.filter(
    (d) => d.location?.latitude != null && d.location?.longitude != null,
  );

  if (located.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-400">No located devices found</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-2">
        <h1 className="text-2xl font-bold">BLE Devices</h1>
       <TemButton/>
      </div>
      {/* Header End */}
      <MapLoader
        devices={located.map((d) => ({
          id: d._id,
          deviceId: d.deviceId,
          name: d.name,
          localName: d.localName,
          latitude: d.location.latitude,
          longitude: d.location.longitude,
          accuracy: d.location.accuracy,
        }))}
      />
    </div>
  );
}
