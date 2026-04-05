"use client";
import { Download } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function DownloadButton() {
  const searchParams = useSearchParams();

  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const agency = searchParams.get("agency");
  const meterType = searchParams.get("meterType");
  const store = searchParams.get("store");
  const installationType = searchParams.get("installationType");
  const status = searchParams.get("status");
  // Build query string
  const query = new URLSearchParams({
    startDate: startDate || "",
    endDate: endDate || "",
    agency: agency || "",
    meterType: meterType || "",
    store: store || "",
    installationType: installationType || "",
    status: status || "",
  }).toString();

  return (
    <Link href={`/api/download?${query}`}>
      <button className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-blue-700 bg-blue-600 text-white transition cursor-pointer">
        <Download size={16} /> Download Files
      </button>
    </Link>
  );
}
