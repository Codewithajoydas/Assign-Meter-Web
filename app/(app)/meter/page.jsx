"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Hash,
  Calendar,
  Gauge,
  Settings,
  Wrench,
  MapPin,
  Building2,
  User,
  CheckCircle,
} from "lucide-react";
import RefreshButton from "@/components/RefreshButton";
import FilterButton from "@/components/FilterButton";
import SortButton from "@/components/SortButton";
import DownloadButton from "@/components/Download";
import { DownloadAll } from "@/components/DownloadAll";

const headers = [
  { label: "S.No.", icon: Hash },
  { label: "Date", icon: Calendar },
  { label: "Meter No", icon: Gauge },
  { label: "Type", icon: Settings },
  { label: "Installation", icon: Wrench },
  { label: "Store", icon: MapPin },
  { label: "Agency", icon: Building2 },
  { label: "Supervisor", icon: User },
  { label: "Installer ID", icon: User },
  { label: "Status", icon: CheckCircle },
];

const statusStyles = {
  pending: { backgroundColor: "#ef4444", color: "#ffffff" },
  active: { backgroundColor: "#22c55e", color: "#fff" },
  rejected: { backgroundColor: "#6b7280", color: "#000000" },
  installed: { backgroundColor: "#3b82f6", color: "#000000" },
};

const SSE_URL =
  process.env.NEXT_PUBLIC_SSE_URL || "http://localhost:9000/events";
const LIMIT = 100;

export default function Home() {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const sort = searchParams.get("sort") || "desc";
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const agency = searchParams.get("agency");
  const meterType = searchParams.get("meterType");
  const store = searchParams.get("store");
  const installationType = searchParams.get("installationType");
  const status = searchParams.get("status");

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const query = new URLSearchParams();
    query.set("page", page);
    query.set("limit", LIMIT);
    query.set("sort", sort);
    if (startDate) query.set("startDate", startDate);
    if (endDate) query.set("endDate", endDate);
    if (agency) query.set("agency", agency);
    if (meterType) query.set("meterType", meterType);
    if (store) query.set("store", store);
    if (installationType) query.set("installationType", installationType);
    if (status) query.set("status", status);

    try {
      // hits OUR OWN API route, not the backend directly.
      // browser automatically sends httpOnly cookies to same-origin requests.
      const res = await fetch(`/api/meters?${query.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to fetch data");
        setLoading(false);
        return;
      }

      setRows(Array.isArray(data.data) ? data.data : []);
      setTotal(data.totalData ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    sort,
    startDate,
    endDate,
    agency,
    meterType,
    store,
    installationType,
    status,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const eventSource = new EventSource(SSE_URL);

    eventSource.addEventListener("meter-added", (event) => {
      let newMeter;
      try {
        newMeter = JSON.parse(event.data);
      } catch (err) {
        console.error("Failed to parse SSE payload:", err);
        return;
      }

      setRows((prev) => {
        if (prev.some((m) => m._id === newMeter._id)) return prev;
        if (page === 1) {
          const next = [newMeter, ...prev];
          return next.length > LIMIT ? next.slice(0, LIMIT) : next;
        }
        return prev;
      });

      setTotal((prev) => prev + 1);
    });

    eventSource.onerror = (err) => {
      console.log("SSE Error:", err);
    };

    return () => {
      eventSource.close();
    };
  }, [page]);

  const createPageLink = (newPage) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("page", newPage);
    return `?${params.toString()}`;
  };

  const generatePages = (totalPagesArg, currentPage, maxButtons = 3) => {
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPagesArg, start + maxButtons - 1);
    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const pages = generatePages(totalPages, page);

  if (error === "Unauthorized") {
    return <div className="p-10 text-red-500">Unauthorized</div>;
  }

  if (error) {
    return <div className="p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="p-2 min-h-screen">
      {/* HEADER */}
      <div className="flex pb-2 justify-between items-center mb-6 sticky top-16.25 bg-white">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Meter Assignment
          </h1>
          <p className="text-sm text-gray-500">
            Manage and assign pending meters
          </p>
        </div>

        <div className="flex items-center gap-3">
          <RefreshButton onClick={fetchData} />
          <SortButton />
          <FilterButton />
          <DownloadButton />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
              <tr>
                {headers.map(({ label, icon: Icon }) => (
                  <th
                    key={label}
                    className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase"
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={14} className="text-gray-400" />
                      {label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan="10" className="text-center py-10 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : rows.length > 0 ? (
                rows.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">
                      {(page - 1) * LIMIT + index + 1}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-bold max-w-[140px] truncate whitespace-nowrap">
                      <Link href={`/meter/${item.meterNumber}`}>
                        {item.meterNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{item.meterType}</td>
                    <td className="px-4 py-3">{item.installationType}</td>
                    <td className="px-4 py-3">{item.storeLocation}</td>
                    <td className="px-4 py-3">{item?.agency}</td>
                    <td className="px-4 py-3">
                      {item?.supervisor?.name ?? "No Supervisor"}
                    </td>
                    <td className="px-4 py-3 text-blue-600 font-medium max-w-[140px] truncate whitespace-nowrap">
                      {item.installerId}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "6px 10px",
                          textAlign: "center",
                          textTransform: "capitalize",
                          borderRadius: "4px",
                          fontSize: "12px",
                          display: "inline-block",
                          ...(statusStyles[item.status] || {
                            backgroundColor: "#e5e7eb",
                            color: "#000",
                          }),
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-10 text-gray-500">
                    No pending meters found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500">Showing {total} entries</p>
          <DownloadAll count={total} />
        </div>

        <div className="flex items-center gap-1 bg-white border rounded-lg shadow-sm overflow-hidden">
          <Link href={createPageLink(Math.max(1, page - 1))} prefetch>
            <button className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
              Prev
            </button>
          </Link>

          {pages.map((num) => (
            <Link key={num} href={createPageLink(num)} prefetch>
              <button
                className={`px-3 py-2 text-sm cursor-pointer ${
                  num === page ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                }`}
              >
                {num}
              </button>
            </Link>
          ))}

          <Link href={createPageLink(Math.min(totalPages, page + 1))} prefetch>
            <button className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
              Next
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
