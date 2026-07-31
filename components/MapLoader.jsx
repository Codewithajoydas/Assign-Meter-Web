"use client";

import dynamic from "next/dynamic";

// Leaflet touches `window`/`document` on import, so it must never run
// during server-side rendering. This wrapper is the client-boundary
// that makes ssr: false valid (it can't be used directly in a
// server component under the app router).
const MeterMap = dynamic(() => import("./MeterMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-50">
      <p className="text-gray-400 text-sm">Loading map…</p>
    </div>
  ),
});

export default function MapLoader(props) {
  return <MeterMap {...props} />;
}
