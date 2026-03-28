"use client";
import { useRouter } from "next/navigation";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { SearchIcon, Settings, User } from "lucide-react";
import { useEffect, useState } from "react";
import "./styles/css/header.css";
const Header = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("");
useEffect(() => {
  const user = localStorage.getItem("user");

  if (user) {
    const parsedUser = JSON.parse(user);
    setUserName(parsedUser.name);
    setEmail(parsedUser.email);
  }
}, []);
  const submitSearch = () => {
    if (!search) return;
    router.push(`/meter/${search}`);
  };
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
      <span className="flex items-center gap-7 relative">
        <span className="flex w-10 h-10 circle hover:bg-gray-200 justify-center items-center rounded-full cursor-pointer transition" onClick={() => router.push("/settings")}>
          <Settings size={20} />
        </span>
        <span className="profile">
          <span className=" flex w-10 h-10 circle hover:bg-gray-200 justify-center items-center rounded-full cursor-pointer transition flex-col">
            <User size={20} />
          </span>
          <div
            className="details absolute  bg-white p-2 text-sm whitespace-nowrap shadow-2xl rounded-lg border"
            style={{ bottom: -60, right: 10 }}
          >
            <span className="font-bold">Name</span>:{" "}
            {userName || "not logged in"} <br />
            <span className="font-bold">Email</span>: {email || "not logged in"}
          </div>
        </span>
      </span>
    </header>
  );
};

export default Header;
