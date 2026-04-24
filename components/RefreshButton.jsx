"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCwIcon } from "lucide-react";

export default function RefreshButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    if (refreshing) {
      startTransition(() => {
        router.refresh();
      });
      setRefreshing(false);
    }
  }, [])
  return (
    <button
      onClick={() => {
        setRefreshing(true);
      }}
      disabled={pending}
      className="flex justify-center items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-lg border text-sm cursor-pointer">
      {pending ? "Refreshing..." : ` Refresh`} <RefreshCwIcon size={16} />
    </button>
  );
}
