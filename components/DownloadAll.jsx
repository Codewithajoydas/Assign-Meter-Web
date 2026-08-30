"use client";

import { DownloadIcon } from "lucide-react";
import { useState } from "react";

export function DownloadAll() {
  const [downloading, setDownloading] = useState(false);
  const [downloadedMB, setDownloadedMB] = useState(0);

  const downloadReport = async () => {
    try {
      setDownloading(true);
      setDownloadedMB(0);

      const response = await fetch("/api/downloadall", {
        method: "GET",
      });

      if (!response.ok) {
        let errorMessage = "Failed to download report";

        try {
          const errorData = await response.json();

          errorMessage = errorData?.message || errorMessage;
        } catch {}

        throw new Error(errorMessage);
      }

      if (!response.body) {
        throw new Error("Readable stream is not available");
      }

      const reader = response.body.getReader();

      const chunks = [];

      let receivedBytes = 0;

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        chunks.push(value);
        receivedBytes += value.length;
        const mb = receivedBytes / (1024 * 1024);
        setDownloadedMB(mb.toFixed(1));
      }

      const blob = new Blob(chunks, {
        type:
          response.headers.get("content-type") ||
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = "meters-assignment-report.xlsx";

      document.body.appendChild(anchor);

      anchor.click();

      anchor.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("DOWNLOAD ERROR:", error);

      alert(error.message || "Failed to download report");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={downloadReport}
      disabled={downloading}
      className="bg-gray-500 hover:bg-gray-700 disabled:bg-gray-400 text-white text-sm py-2 px-4 rounded"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        fontSize: "12px",
        cursor: downloading ? "not-allowed" : "pointer",
        minWidth: "140px",
      }}
    >
      <DownloadIcon size={16} />

      {downloading
        ? `Downloading ${downloadedMB} MB`
        : "Download All"}
    </button>
  );
}