"use client";

import { useRouter, usePathname } from "next/navigation";
import { Menu, SearchIcon, Settings, User, Loader2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import "./styles/css/header.css";
import { SidebarContext } from "@/contexts/Sidebar.context";

const Header = () => {
  const { closed, setClosed } = useContext(SidebarContext);
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async function () {
      try {
        const res = await fetch("/api/getuserdetails");
        const data = await res.json();

        setUserName(data.userData?.name || "");
        setEmail(data.userData?.email || "");
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Stop loading after navigation completes
  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  const submitSearch = () => {
    if (!search.trim() || loading) return;

    setLoading(true);
    router.push(`/meter/${search.trim()}`);
  };

  // Prefetch while typing
  useEffect(() => {
    const value = search.trim();

    if (value.length > 3) {
      router.prefetch(`/meter/${value}`);
    }
  }, [search, router]);

  return (
    <header className="sticky top-0 z-10 border-b bg-[#F8FAFC] px-2 py-3 flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-2">
        <span
          className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-gray-200 cursor-pointer"
          onClick={() => setClosed(!closed)}
        >
          <Menu size={18} />
        </span>

        <div className="logo flex items-center gap-1">
          <img src="/icon.png" alt="Logo" className="w-10 h-10 rounded-full" />
          <span className="font-bold">Assign Meter</span>
        </div>
      </div>

      {/* Search */}
      <search className="flex items-center gap-2">
        <label
          htmlFor="searchMeter"
          className="flex items-center gap-2 p-2 rounded-lg border focus-within:outline-1 w-80"
        >
          <SearchIcon size={20} />

          <input
            id="searchMeter"
            type="search"
            placeholder="Search Meter..."
            className="outline-none w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitSearch();
            }}
          />
        </label>

        <button
          type="button"
          onClick={submitSearch}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <SearchIcon size={18} />
              Search
            </>
          )}
        </button>
      </search>

      {/* Right */}
      <span className="flex items-center gap-7 relative">
        <span
          className="flex w-10 h-10 hover:bg-gray-200 justify-center items-center rounded-full cursor-pointer transition"
          onClick={() => router.push("/settings")}
        >
          <Settings size={20} />
        </span>

        <span className="profile">
          <span className="flex w-10 h-10 hover:bg-gray-200 justify-center items-center rounded-full cursor-pointer transition">
            <User size={20} />
          </span>

          <div
            className="details absolute bg-white p-2 text-sm whitespace-nowrap shadow-2xl rounded-lg border"
            style={{ bottom: -80, right: 10 }}
          >
            <p
              style={{
                paddingBottom: 10,
                fontSize: "small",
                color: "gray",
              }}
            >
              Logged In User Details
            </p>
            <span className="font-bold">Name</span>:{" "}
            {userName || "Not logged in"}
            <br />
            <span className="font-bold">Email</span>: {email || "Not logged in"}
          </div>
        </span>
      </span>
    </header>
  );
};

export default Header;
