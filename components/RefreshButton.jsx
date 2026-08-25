"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCwIcon } from "lucide-react";

export default function RefreshButton({ fn }) {
  const [refreshing, setRefreshing] = useState(false);
  return (
    <button
      onClick={async () => {
        setRefreshing(true);
        await fn();
        setRefreshing(false);
      }}
      disabled={refreshing}
      className="flex justify-center items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-lg border text-sm cursor-pointer"
      style={refreshing ? { opacity: 0.5, cursor: "not-allowed" } : {}}
    >
      {refreshing ? "Refreshing..." : "Refresh"}{" "}
      {refreshing ? (
        <RefreshCwIcon size={16} className="animate-spin" />
      ) : (
        <RefreshCwIcon size={16} />
      )}
    </button>
  );
}
