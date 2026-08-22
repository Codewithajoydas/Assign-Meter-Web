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
  SUCCESS: { backgroundColor: "#22c55e", color: "#fff" },
  FAILED: { backgroundColor: "#ef4444", color: "#fff" },
};

const SSE_URL =
  process.env.NEXT_PUBLIC_SSE_URL || `${process.env.NEXT_PUBLIC_BACKEND_URL}/events`;
const LIMIT = 100;

function StatusBadge({ status }) {
  return (
    <span
      style={{
        padding: "5px 9px",
        textAlign: "center",
        textTransform: "capitalize",
        borderRadius: "4px",
        fontSize: "11px",
        display: "inline-block",
        whiteSpace: "nowrap",
        ...(statusStyles[status] || {
          backgroundColor: "#e5e7eb",
          color: "#000",
        }),
      }}
    >
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

      console.log("New meters added via SSE:", newMeters);

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
    return <div className="p-6 sm:p-10 text-red-500">Unauthorized</div>;
  }

  if (error) {
    return <div className="p-6 sm:p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="p-2 sm:p-3 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col gap-3 pb-3 mb-4 sm:mb-6 sticky top-16 sm:top-16.25 bg-white z-10">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Meter Assignment
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Manage and assign pending meters
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap overflow-x-auto sm:overflow-visible -mx-2 px-2 sm:mx-0 sm:px-0 pb-1 sm:pb-0">
          <RefreshButton onClick={fetchData} />
          <SortButton />
          <FilterButton />
          <DownloadButton />
        </div>
      </div>

      {/* ================= MOBILE: CARD LIST (below sm) ================= */}
      <div className="sm:hidden space-y-3">
        {loading ? (
          <div className="text-center py-10 text-gray-500 text-sm">
            Loading...
          </div>
        ) : rows.length > 0 ? (
          rows.map((item, index) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-sm border p-3.5 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] text-gray-400">
                    #{(page - 1) * LIMIT + index + 1}
                  </span>
                  <Link
                    href={`/meter/${item.meterNumber}`}
                    className="block font-bold text-sm text-gray-900"
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
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 text-sm">
            No pending meters found
          </div>
        )}
      </div>

      {/* ================= DESKTOP/TABLET: TABLE (sm and up) ================= */}
      <div className="hidden sm:block w-full overflow-x-auto">
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden min-w-[900px] lg:min-w-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                <tr>
                  {headers.map(({ label, icon: Icon }) => (
                    <th
                      key={label}
                      className="px-2 lg:px-3 py-2 lg:py-3 text-left text-[11px] lg:text-xs font-semibold text-gray-600 uppercase whitespace-nowrap"
                    >
                      <div className="flex items-center gap-1.5 lg:gap-2">
                        <Icon size={13} className="text-gray-400 shrink-0" />
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
                      <td className="px-3 lg:px-4 py-2.5 lg:py-3 text-gray-500 whitespace-nowrap">
                        {(page - 1) * LIMIT + index + 1}
                      </td>
                      <td className="px-3 lg:px-4 py-2.5 lg:py-3 whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 lg:px-4 py-2.5 lg:py-3 font-bold max-w-[140px] truncate whitespace-nowrap">
                        <Link href={`/meter/${item.meterNumber}`}>
                          {item.meterNumber}
                        </Link>
                      </td>
                      <td className="px-3 lg:px-4 py-2.5 lg:py-3 whitespace-nowrap">
                        {item.meterType}
                      </td>
                      <td className="px-3 lg:px-4 py-2.5 lg:py-3 whitespace-nowrap">
                        {item.installationType}
                      </td>
                      <td className="px-3 lg:px-4 py-2.5 lg:py-3 whitespace-nowrap">
                        {item.storeLocation}
                      </td>
                      <td className="px-3 lg:px-4 py-2.5 lg:py-3 whitespace-nowrap">
                        {item?.agency}
                      </td>
                      <td className="px-3 lg:px-4 py-2.5 lg:py-3 whitespace-nowrap">
                        {item?.supervisor?.name ?? "No Supervisor"}
                      </td>
                      <td className="px-3 lg:px-4 py-2.5 lg:py-3 text-blue-600 font-medium max-w-[140px] truncate whitespace-nowrap">
                        {item.installerId}
                      </td>
                      <td className="px-2 lg:px-4 py-2.5 lg:py-3 whitespace-nowrap">
                        <StatusBadge status={item.status} />
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
      </div>

      {/* FOOTER */}
      <div className="flex flex-col gap-3 sm:gap-4 justify-between items-center mt-4">
        <div className="flex items-center gap-2 flex-wrap justify-center text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            Showing {total} entries
          </p>
          <DownloadAll count={total} />
        </div>

        <div className="flex items-center gap-1 bg-white border rounded-lg shadow-sm overflow-x-auto max-w-full">
          <Link href={createPageLink(Math.max(1, page - 1))} prefetch>
            <button className="px-2.5 sm:px-3 py-2 text-xs sm:text-sm hover:bg-gray-100 cursor-pointer whitespace-nowrap">
              Prev
            </button>
          </Link>

          {pages.map((num) => (
            <Link key={num} href={createPageLink(num)} prefetch>
              <button
                className={`px-2.5 sm:px-3 py-2 text-xs sm:text-sm cursor-pointer ${
                  num === page ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                }`}
              >
                {num}
              </button>
            </Link>
          ))}

          <Link href={createPageLink(Math.min(totalPages, page + 1))} prefetch>
            <button className="px-2.5 sm:px-3 py-2 text-xs sm:text-sm hover:bg-gray-100 cursor-pointer whitespace-nowrap">
              Next
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}