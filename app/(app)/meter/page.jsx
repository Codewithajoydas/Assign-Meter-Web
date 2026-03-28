import RefreshButton from "@/components/RefreshButton";
import { DownloadIcon, Filter } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
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
import FilterButton from "@/components/FilterButton";
import SortButton from "@/components/SortButton";
import DownloadButton from "@/components/Download";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Meter Issue | Assign Meter",
  description:
    "This is a utily app for Genus Power Infrastructure for Meter Assignment",
};

const headers = [
  { label: "S.No.", icon: Hash },
  { label: "Date", icon: Calendar },
  { label: "Meter No", icon: Gauge },
  { label: "Type", icon: Settings },
  { label: "Installation", icon: Wrench },
  { label: "Store", icon: MapPin },
  { label: "Agency", icon: Building2 },
  { label: "Installer ID", icon: User },
  { label: "Status", icon: CheckCircle },
];

export default async function Home({ searchParams }) {
const search = (await searchParams) ?? {};

const page = Number(search?.page ?? 1);
const sort = search?.sort || "desc";

const { startDate, endDate, agency, meterType, store, installationType } =
  search;

const limit = 100;

const cookieStore = await cookies();
const token = cookieStore.get("token")?.value;

// Build query params properly
const query = new URLSearchParams();

query.set("pageNumber", page);
query.set("limit", limit);
query.set("sort", sort);

// Only include filters if they exist
if (startDate) query.set("startDate", startDate);
if (endDate) query.set("endDate", endDate);
if (agency) query.set("agency", agency);
if (meterType) query.set("meterType", meterType);
if (store) query.set("store", store);
if (installationType) query.set("installationType", installationType);

const res = await fetch(
  `https://assign-meter-backend.onrender.com/api/getmeterdetails/pending?${query.toString()}`,
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  },
);



const data = await res.json();
  
  
  const generatePages = (totalPages, currentPage, maxButtons = 3) => {
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = generatePages(data.totalPages, page);

  return (
    <div key={page} className="p-2 min-h-screen">
      {" "}
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
          <RefreshButton />
          <SortButton />
          <FilterButton />
          {/* <button className=" cursor-pointer flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg" onClick={downloadButton}>
            <DownloadIcon size={16} /> Export
          </button> */}
          <DownloadButton/>
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
              {Array.isArray(data.data) && data.data.length > 0 ? (
                data.data.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-bold">{item.meterNumber}</td>
                    <td className="px-4 py-3">{item.meterType}</td>
                    <td className="px-4 py-3">{item.installationType}</td>
                    <td className="px-4 py-3">{item.storeLocation}</td>
                    <td className="px-4 py-3">{item.agency}</td>
                    <td className="px-4 py-3 text-blue-600 font-medium">
                      {item.installerId}
                    </td>
                    <td>
                      <span
                        className={` p-2 text-center capitalize rounded text-xs ${item.status === "pending" ? "bg-red-500 text-white" : ""}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-500">
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
        <p className="text-sm text-gray-500">
          Showing {data?.totalData || 0} entries
        </p>

        <div className="flex items-center gap-1 bg-white border rounded-lg shadow-sm overflow-hidden">
          {/* Prev */}
          <Link href={`?page=${Math.max(1, page - 1)}`}>
            <button className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
              Prev
            </button>
          </Link>

          {/* Numbers */}
          {pages.map((num) => (
            <Link key={num} href={`?page=${num}`}>
              <button
                className={`px-3 py-2 text-sm cursor-pointer ${
                  num === page ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                }`}
              >
                {num}
              </button>
            </Link>
          ))}

          {/* Next */}
          <Link href={`?page=${Math.min(data.totalPages, page + 1)}`}>
            <button className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
              Next
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
