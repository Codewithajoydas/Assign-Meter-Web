"use client";
import { Boxes, KeyRound, Mail, User, UserStar } from "lucide-react";
import { useState } from "react";

export default function WorkforceCreate() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading]  = useState(false);
//   const [pkg, setPkg] = useState("ASS1");

  const submitData = async () => {
    setLoading(true);
    const res = await fetch(
      "/api/createuser",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          isAdmin,
        }),
      },
    );

    const data = await res.json();

    if (res.ok) {
      alert("Id Created Successfully");
      console.log(data);
    } else {
      setLoading(false);
      console.log(data);
      alert(data.message);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div
        className="mx-auto p-6 bg-white rounded-2xl flex flex-col gap-5 shadow-md"
        style={{ width: "300px" }}
      >
        {/* Name */}
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Name</span>
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50 focus-within:border-black">
            <User size={16} />
            <input
              type="text"
              className="w-full bg-transparent outline-none text-sm"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </label>

        {/* Email */}
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Email</span>
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50 focus-within:border-black">
            <Mail size={16} />
            <input
              type="email"
              className="w-full bg-transparent outline-none text-sm"
              placeholder="Enter email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </label>

        {/* Password */}
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Password</span>
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50 focus-within:border-black">
            <KeyRound size={16} />
            <input
              type="password"
              className="w-full bg-transparent outline-none text-sm"
              placeholder="Enter password"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </label>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Is Admin */}
          <label className="flex flex-col gap-1">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <UserStar size={16} /> Is Admin
            </span>
            <select
              className="p-2 border rounded-lg bg-gray-50 text-sm focus:border-black outline-none"
              value={isAdmin ? "yes" : "no"}
              onChange={(e) => setIsAdmin(e.target.value === "yes")}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>

          {/* Package */}
          <label className="flex flex-col gap-1">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <Boxes size={16} /> Package
            </span>
            <select
            disabled
              className="p-2 border rounded-lg bg-gray-50 text-sm focus:border-black outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {[
                "ASS1",
                "ASS2",
                "ASS3",
                "ASS4",
                "ASS5",
                "ASS6",
                "ASS7",
                "ASS8",
                "ASS9",
                "ASS10",
              ].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Button */}
        <button
          type="button"
          className="mt-4 w-full bg-black text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition"
          onClick={submitData}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </div>
    </div>
  );
}
