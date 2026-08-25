"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  Trash2,
  ChevronLeft,
  ChevronRight,
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
  { label: "", icon: Trash2 },
];

// dot color + text color per status — used for the badge dot AND the card accent bar
const statusColors = {
  pending: { dot: "#ef4444", text: "#b91c1c", bg: "#fef2f2" },
  active: { dot: "#22c55e", text: "#15803d", bg: "#f0fdf4" },
  rejected: { dot: "#6b7280", text: "#374151", bg: "#f3f4f6" },
  installed: { dot: "#3b82f6", text: "#1d4ed8", bg: "#eff6ff" },
  SUCCESS: { dot: "#22c55e", text: "#15803d", bg: "#f0fdf4" },
  FAILED: { dot: "#ef4444", text: "#b91c1c", bg: "#fef2f2" },
};
const fallbackStatus = { dot: "#9ca3af", text: "#374151", bg: "#f3f4f6" };

const SSE_URL =
  process.env.NEXT_PUBLIC_SSE_URL ||
  `${process.env.NEXT_PUBLIC_BACKEND_URL}/events`;
const LIMIT = 100;

function StatusBadge({ status }) {
  const c = statusColors[status] || fallbackStatus;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium capitalize"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full shrink-0"
        style={{ backgroundColor: c.dot }}
      />
      {status}
    </span>
  );
}

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
  const pageRef = useRef(page);
  useEffect(() => {
    pageRef.current = page;
  }, [page]);

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

  const handleDeleteMeters = async (meters) => {
    try {
      const confirmation = window.confirm("Are you sure you want to delete?");
      if (!confirmation) {
        return;
      }
      const res = await fetch(`/api/deletemeters`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ meters }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to delete meters");
      }
      alert("Meters deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Failed to delete meters:", error);
      alert("Failed to delete meters");
    }
  };

  useEffect(() => {
    const eventSource = new EventSource(SSE_URL, { withCredentials: true });

    eventSource.addEventListener("meter-added", (event) => {
      let payload;
      try {
        payload = JSON.parse(event.data);
      } catch (err) {
        console.error("Failed to parse SSE payload:", err);
        return;
      }

      const newMeters = Array.isArray(payload?.meters) ? payload.meters : [];
      if (!newMeters.length) return;

      setRows((prev) => {
        if (pageRef.current !== 1) return prev;

        const existingIds = new Set(prev.map((m) => m._id));
        const toAdd = newMeters.filter((m) => !existingIds.has(m._id));
        if (!toAdd.length) return prev;

        const next = [...toAdd, ...prev];
        return next.length > LIMIT ? next.slice(0, LIMIT) : next;
      });

      setTotal((prev) => prev + (payload?.insertedCount ?? newMeters.length));
    });

    eventSource.onerror = (err) => {
      console.log("SSE Error:", err);
    };

    return () => {
      eventSource.close();
    };
  }, []);

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-red-50/40">
        <div className="text-red-500 font-medium">Unauthorized</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-red-50/40">
        <div className="text-red-500 font-medium">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="p-2 sm:p-3">
        {/* HEADER */}
        <div className="flex flex-col gap-3 pb-3 mb-4 sm:mb-6 sticky top-16 sm:top-16.25 bg-white/80 backdrop-blur-md z-10 border-b border-gray-100">
          <div className="flex items-center justify-between gap-3 pt-1">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="h-6 w-1 rounded-full bg-gradient-to-b from-blue-500 to-blue-700" />
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  Meter Assignment
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 ml-3.5">
                Manage and assign pending meters
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 border border-blue-100">
              {total} total
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap overflow-x-auto sm:overflow-visible -mx-2 px-2 sm:mx-0 sm:px-0 pb-2 sm:pb-0">
            <RefreshButton fn={fetchData} />
            <SortButton />
            <FilterButton />
            <DownloadButton />
          </div>
        </div>

        {/* ================= MOBILE: CARD LIST (below sm) ================= */}
        <div className="sm:hidden space-y-2.5">
          {loading ? (
            <div className="text-center py-14 text-gray-400 text-sm">
              Loading meters…
            </div>
          ) : rows.length > 0 ? (
            rows.map((item, index) => {
              const c = statusColors[item.status] || fallbackStatus;
              return (
                <div
                  key={item._id}
                  className="relative bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-gray-100 pl-4 pr-3.5 py-3 flex flex-col gap-2 overflow-hidden"
                >
                  <span
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{ backgroundColor: c.dot }}
                  />
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-gray-400 font-medium">
                        #{(page - 1) * LIMIT + index + 1}
                      </span>
                      <Link
                        href={`/meter/${item.meterNumber}`}
                        className="block font-bold text-sm text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {item.meterNumber}
                      </Link>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Calendar size={12} className="text-gray-400 shrink-0" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Settings size={12} className="text-gray-400 shrink-0" />
                      {item.meterType}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Wrench size={12} className="text-gray-400 shrink-0" />
                      {item.installationType}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <MapPin size={12} className="text-gray-400 shrink-0" />
                      {item.storeLocation}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Building2 size={12} className="text-gray-400 shrink-0" />
                      {item?.agency}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <User size={12} className="text-gray-400 shrink-0" />
                      {item?.supervisor?.name ?? "No Supervisor"}
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-600 font-medium col-span-2 truncate">
                      <User size={12} className="text-blue-400 shrink-0" />
                      {item.installerId}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteMeters([item._id])}
                    className="self-end mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-red-500 hover:text-red-600 active:scale-95 transition"
                  >
                    <Trash2 size={13} />
                    Remove
                  </button>
                </div>
              );
            })
          ) : (
            <div className="text-center py-14 text-gray-400 text-sm">
              No pending meters found
            </div>
          )}
        </div>

        {/* ================= DESKTOP/TABLET: TABLE (sm and up) ================= */}
        <div className="hidden sm:block w-full overflow-x-auto">
          <div className="relative bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden min-w-[900px] lg:min-w-0">
            <div className="h-[3px] bg-gradient-to-r from-blue-500 via-blue-400 to-blue-200" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50/80 text-gray-500">
                  <tr>
                    {headers.map(({ label, icon: Icon }) => (
                      <th
                        key={label || "actions"}
                        className="px-3 lg:px-4 py-2.5 lg:py-3 text-left text-[10.5px] lg:text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap"
                      >
                        <div className="flex items-center gap-1.5">
                          <Icon size={12.5} className="text-gray-400 shrink-0" />
                          {label}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="11" className="text-center py-14 text-gray-400">
                        Loading meters…
                      </td>
                    </tr>
                  ) : rows.length > 0 ? (
                    rows.map((item, index) => {
                      const c = statusColors[item.status] || fallbackStatus;
                      return (
                        <tr
                          key={item._id}
                          className="group hover:bg-blue-50/30 transition-colors border-l-2 border-l-transparent hover:border-l-blue-400"
                        >
                          <td className="px-3 lg:px-4 py-2.5 lg:py-3 text-gray-400 whitespace-nowrap text-xs">
                            {(page - 1) * LIMIT + index + 1}
                          </td>
                          <td className="px-3 lg:px-4 py-2.5 lg:py-3 whitespace-nowrap text-gray-600">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-3 lg:px-4 py-2.5 lg:py-3 font-bold max-w-[140px] truncate whitespace-nowrap">
                            <Link
                              href={`/meter/${item.meterNumber}`}
                              className="text-gray-900 group-hover:text-blue-600 transition-colors"
                            >
                              {item.meterNumber}
                            </Link>
                          </td>
                          <td className="px-3 lg:px-4 py-2.5 lg:py-3 whitespace-nowrap text-gray-600">
                            {item.meterType}
                          </td>
                          <td className="px-3 lg:px-4 py-2.5 lg:py-3 whitespace-nowrap text-gray-600">
                            {item.installationType}
                          </td>
                          <td className="px-3 lg:px-4 py-2.5 lg:py-3 whitespace-nowrap text-gray-600">
                            {item.storeLocation}
                          </td>
                          <td className="px-3 lg:px-4 py-2.5 lg:py-3 whitespace-nowrap text-gray-600">
                            {item?.agency}
                          </td>
                          <td className="px-3 lg:px-4 py-2.5 lg:py-3 whitespace-nowrap text-gray-600">
                            {item?.supervisor?.name ?? (
                              <span className="text-gray-300">No Supervisor</span>
                            )}
                          </td>
                          <td className="px-3 lg:px-4 py-2.5 lg:py-3 text-blue-600 font-medium max-w-[140px] truncate whitespace-nowrap">
                            {item.installerId}
                          </td>
                          <td className="px-2 lg:px-4 py-2.5 lg:py-3 whitespace-nowrap">
                            <StatusBadge status={item.status} />
                          </td>
                          <td className="px-2 lg:px-4 py-2.5 lg:py-3 whitespace-nowrap">
                            <button
                              className="p-1.5 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 ring-1 ring-transparent hover:ring-red-100 transition-all"
                              onClick={() => handleDeleteMeters([item._id])}
                              title="Remove"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="11" className="text-center py-14 text-gray-400">
                        No pending meters found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col gap-3 sm:gap-4 justify-between items-center mt-5">
          <div className="flex items-center gap-2 flex-wrap justify-center text-center">
            <p className="text-xs sm:text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-700">{total}</span> entries
            </p>
            <DownloadAll count={total} />
          </div>

          <div className="flex items-center gap-0.5 bg-white border border-gray-100 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-1 overflow-x-auto max-w-full">
            <Link href={createPageLink(Math.max(1, page - 1))} prefetch>
              <button className="p-1.5 sm:p-2 rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-40 cursor-pointer">
                <ChevronLeft size={16} />
              </button>
            </Link>

            {pages.map((num) => (
              <Link key={num} href={createPageLink(num)} prefetch>
                <button
                  className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full text-xs sm:text-sm cursor-pointer transition-all ${
                    num === page
                      ? "bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-sm font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {num}
                </button>
              </Link>
            ))}

            <Link href={createPageLink(Math.min(totalPages, page + 1))} prefetch>
              <button className="p-1.5 sm:p-2 rounded-full text-gray-500 hover:bg-gray-100 cursor-pointer">
                <ChevronRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}