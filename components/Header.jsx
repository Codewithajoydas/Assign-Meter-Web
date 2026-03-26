'use client'
import { useRouter } from "next/navigation";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import {SearchIcon, Settings, User } from "lucide-react";
import { useState } from "react";


const Header = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const submitSearch = () => {
    if (!search) return;
    router.push(`/meter/${search}`)
    
  }
  return (
    <header className="sticky top-0 z-10  border-b bg-[#F8FAFC] px-6 py-3 flex items-center justify-between">
      <div className="logo flex items-center gap-1">
        <img
          src="/icon.png"
          alt=""
          style={{ width: 40, height: 40, borderRadius: 100 }}
        />
        <span className="font-bold">Assign Meter</span>
      </div>
      <search className="flex items-center gap-2">
        <label
          htmlFor="searchMeter"
          className="flex justify-start items-center gap-2  p-2 rounded-lg focus-within:outline-1 w-80 border"
        >
          <SearchIcon size={20} />
          <input
            type="search"
            placeholder="Search Meter..."
            id="searchMeter"
            className="outline-0 w-full text-sm"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </label>
        <button
          type="submit"
          onClick={submitSearch}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 cursor-pointer"
        >
          Search
        </button>
      </search>
      <span className="flex items-center gap-7">
        <span className="flex w-10 h-10 circle hover:bg-gray-200 justify-center items-center rounded-full cursor-pointer transition">
          <Settings size={20} />
        </span>
        <span className="flex w-10 h-10 circle hover:bg-gray-200 justify-center items-center rounded-full cursor-pointer transition">
          <User size={20} />
        </span>
      </span>
    </header>
  );
};

export default Header;
