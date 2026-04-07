"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";
import { useState, useTransition } from "react";

export default function FilterButton() {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const isFilterApplied =
    params.get("startDate") ||
    params.get("endDate") ||
    params.get("agency") ||
    params.get("meterType") ||
    params.get("store") ||
    params.get("installationType") ||
    params.get("status");

  const [active, setActive] = useState(false);

  const [startDate, setStartDate] = useState(params.get("startDate") || "");
  const [endDate, setEndDate] = useState(params.get("endDate") || "");
  const [agency, setAgency] = useState(params.get("agency") || "");
  const [meterType, setMeterType] = useState(params.get("meterType") || "");
  const [store, setStore] = useState(params.get("store") || "");
  const [installationType, setInstallationType] = useState(
    params.get("installationType") || "",
  );
  const [status, setStatus] = useState(params.get("status") || "");
  const applyFilter = () => {
    const newParams = new URLSearchParams(params.toString());

    const setOrDelete = (key, value) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    };

    setOrDelete("startDate", startDate);
    setOrDelete("endDate", endDate);
    setOrDelete("agency", agency);
    setOrDelete("meterType", meterType);
    setOrDelete("store", store);
    setOrDelete("installationType", installationType);
    setOrDelete("status", status);
    startTransition(() => router.replace(`?${newParams.toString()}`));
    setActive(false);
  };
  const clearFilter = () => {
    router.push("?");
    setActive(false);
  };
  return (
    <>
      <button
        className={`flex justify-center items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-lg border text-sm cursor-pointer ${
          isFilterApplied ? "bg-gray-100 font-bold" : ""
        }`}
        onClick={() => setActive(!active)}
      >
        <Filter size={16} /> Filter
      </button>
      {active && (
        <div className=" filter-popup fixed z-20 inset-0 transition  bg-gray-50/2 backdrop-blur w-full h-screen flex justify-center items-center">
          <div className="p-4 filter-container min-w-75 w-fit bg-white shadow rounded-lg">
            <div className="filter-header flex justify-between items-center pb-2">
              <p className="font-bold text-xl">Filter by:</p>
              <span
                className="w-10 h-10 flex justify-center items-center rounded-full hover:bg-gray-100"
                onClick={() => setActive(false)}
              >
                <X />
              </span>
            </div>
            <hr className="p-1" />
            <div className="selectDate grid grid-cols-2 gap-2">
              <label htmlFor="startDate " className="flex flex-col gap-2">
                <span className="text-sm font-bold">Start Date</span>
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  className="border p-2 rounded-lg hover:bg-gray-100 text-sm"
                  onChange={(e) => setStartDate(e.target.value)}
                  value={startDate}
                />
              </label>
              <label htmlFor="endDate" className="flex flex-col gap-2">
                <span className="text-sm font-bold">End Date</span>
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  className="border p-2 rounded-lg hover:bg-gray-100 text-sm"
                  onChange={(e) => setEndDate(e.target.value)}
                  value={endDate}
                />
              </label>
            </div>
            <div className="selectAgency grid grid-cols-1 gap-2 mt-3 ">
              <label htmlFor="agency" className="text-sm font-bold">
                Agency
              </label>
              <select
                name="agency"
                id="agency"
                className="p-2 border rounded-lg hover:bg-gray-100 text-sm"
                onChange={(e) => setAgency(e.target.value)}
                value={agency}
              >
                {[
                  "All",
                  "M/S Prashuya Bor Borah",
                  "M/S SINGHAL IT SERVICES PRIVATE LIMITED",
                  "Akibur Rahaman Laskar",
                  "CHOUDHURY POWER ENERGY PVT. LTD.",
                  "Hi-Print Metering Solutions Pvt. Ltd.",
                  "Assam Power Distribution Company Ltd.",
                  "Genus Power Infrastructures Ltd.",
                  "BHUYAN ENTERPRISE",
                  "Ms.Nadim Enterprise",
                  "UM Construction",
                  "M/S Maa Enterprise",
                  "K K ELECTRICALS",
                  "Nanda Enterprise",
                  "Innovation N Ingeneria",
                  "RB DEVELOPERS AND ASSOCIATES",
                  "POWER LINE",
                  "M/S Uttam Gogoi",
                  "Dipjyoti Tamuly",
                  "J.B. Electricity",
                  "M/S Pradip Baruah",
                  "PRATEEK ENTERPRISE",
                  "Anika Electricals",
                  "M/s. Abdul Wahid Barbhuyan",
                  "Tripex Engineering Services pvt ltd",
                  "M/S Noor Enterprise",
                  "SAMIA ENTERPRISE",
                  "Green Hub",
                  "N and N Enterprise",
                  "Tesla Electricals and Construction",
                  "AN2 Skills Private Limited",
                  "Youth Care",
                  "Azahar Enterprise",
                  "ARS Associates",
                  "Barbhuyan Electricals",
                  "Islam Brother Electricals",
                  "Alliance Telenet Pvt Ltd",
                  "Grocery Shop",
                  "Karan Electrical",
                  "Biswakarma Electricals",
                  "Super Electric Company",
                  "Yogesh Enterprises",
                  "Ayush Info Solutions",
                  "RT Network Solutions Pvt. Ltd.",
                  "Onfoari Enterprise",
                  "Mukesh Kumar Mandal",
                  "Mahiya Enterprise",
                  "Barman Agency",
                  "Dhruba Enterprise",
                  "A1 Solution",
                  "G AID LLP",
                  "Hello Saikia",
                  "Flourishing Enterprise",
                  "Tatrari Electrical and Traders",
                  "Destination Technohub India Pvt Ltd",
                  "Montrona Construction",
                  "Diag Engineering Pvt Ltd",
                  "CSC Computer",
                ].map((agency) => {
                  return (
                    <option value={agency === "All" ? "" : agency}>
                      {agency}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="selectMeterType grid grid-cols-1">
                <label htmlFor="meterType" className="text-sm font-bold mb-2">
                  Meter Type
                </label>
                <select
                  name="meterType"
                  id="meterType"
                  className="p-2 rounded-lg border hover:bg-gray-100 text-sm"
                  onChange={(e) => setMeterType(e.target.value)}
                  value={meterType}
                >
                  {[
                    "All",
                    "1P,2W,5-30A",
                    "3P,4W,-/1A",
                    "3P,4W,-/5A",
                    "3P,4W,10-60A",
                    "3P,4W,100/5A",
                    "3P,4W,200/5A",
                    "3P,4W,400/5A",
                    "3P,4W,50/5A",
                  ].map((meterType) => {
                    return (
                      <option value={meterType === "All" ? "" : meterType}>
                        {meterType}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="status grid grid-cols-1">
                <label htmlFor="status" className="text-sm font-bold mb-2">
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  className="p-2 rounded-lg border hover:bg-gray-100 text-sm"
                  onChange={(e) => setStatus(e.target.value)}
                  value={status}
                >
                  {["active", "pending", "installed", "rejected"].map(
                    (status) => {
                      return (
                        <option value={status === "All" ? "" : status}>
                          {status}
                        </option>
                      );
                    },
                  )}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 mt-3 gap-2">
              <div className="store grid grid-cols-1">
                <label htmlFor="" className="text-sm font-bold mb-2">
                  Store
                </label>
                <select
                  name="store"
                  id="store"
                  className="border p-2 rounded-lg hover:bg-gray-100 text-sm"
                  onChange={(e) => setStore(e.target.value)}
                  value={store}
                >
                  <option value="">All</option>
                  <option value="nagaon">Nagaon</option>
                  <option value="golaghat">Golaghat</option>
                </select>
              </div>
              <div className="installationType grid grid-cols-1">
                <label htmlFor="" className="text-sm font-bold mb-2">
                  Installation Type
                </label>
                <select
                  name="installationType"
                  id="installationType"
                  className="border p-2 rounded-lg hover:bg-gray-100 text-sm"
                  onChange={(e) => setInstallationType(e.target.value)}
                  value={installationType}
                >
                  {[
                    "All",
                    "LTWC",
                    "DTMeter",
                    "FeederMeter",
                    "HTCT",
                    "LTCT",
                  ].map((installationType) => {
                    return (
                      <option
                        value={
                          installationType === "All" ? "" : installationType
                        }
                      >
                        {installationType}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={applyFilter}
                disabled={isPending}
                className="w-full p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {isPending ? "Applying..." : "Apply"}
              </button>

              <button
                onClick={clearFilter}
                className="w-full p-2 border rounded-lg hover:bg-gray-100"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
