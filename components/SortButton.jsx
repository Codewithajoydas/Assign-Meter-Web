"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { SortAsc, SortDesc } from "lucide-react";
import { useState } from "react";

export default function SortButton() {
  const [sortValue, setSortValue] = useState("asc");
  const [active, setActive] = useState(false);

  const router = useRouter();
  const params = useSearchParams();

  const handleSort = () => {
    const newSort = sortValue === "asc" ? "desc" : "asc";
    setSortValue(newSort);
    setActive(!active);

    const newParams = new URLSearchParams(params.toString());
    newParams.set("sort", newSort);

    router.push(`?${newParams.toString()}`);
  };

  return (
    <button
      className={`flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-100 cursor-pointer ${
        active ? "bg-gray-100 font-bold" : ""
      }`}
      onClick={handleSort}
    >
      {sortValue === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />}
      Sort by Date
    </button>
  );
}
