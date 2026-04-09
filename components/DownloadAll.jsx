'use client'
import { DownloadIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function DownloadAll({count}) {
    const router = useRouter();
  return (
    <button className="bg-gray-500 hover:bg-gray-700 text-white text-sm  py-2 px-4 rounded" onClick={()=>router.push("/api/downloadall")} style={{display:"flex", justifyContent:"center", alignItems:"center", gap:10, fontSize:"12px", cursor:"pointer"}}>
      <DownloadIcon size={16} />Download All {count} Records
    </button>
  );
}
