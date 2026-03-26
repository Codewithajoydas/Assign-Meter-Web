'use client'
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RefreshButton() {
    const router = useRouter();
    return (
      <div
        className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-100 transition"
        title="Refresh"
        role="button"
            aria-label="Refresh"
            onClick={()=>router.refresh()}
      >
        <RefreshCw size={16} /> Refresh 
      </div>
    );
}