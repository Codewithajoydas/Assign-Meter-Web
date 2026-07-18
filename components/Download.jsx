"use client";

import { Download, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function DownloadButton() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const query = new URLSearchParams({
        startDate: searchParams.get("startDate") || "",
        endDate: searchParams.get("endDate") || "",
        agency: searchParams.get("agency") || "",
        meterType: searchParams.get("meterType") || "",
        store: searchParams.get("store") || "",
        installationType: searchParams.get("installationType") || "",
        status: searchParams.get("status") || "",
      }).toString();

      const res = await fetch(`/api/download?${query}`);

      if (!res.ok) {
        throw new Error("Failed to download file");
      }

      // Get filename from response header (if available)
      const disposition = res.headers.get("Content-Disposition");
      let fileName = "meters.xlsx";

      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) {
          fileName = match[1];
        }
      }

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Downloading...
        </>
      ) : (
        <>
          <Download size={16} />
          Download Files
        </>
      )}
    </button>
  );
}
