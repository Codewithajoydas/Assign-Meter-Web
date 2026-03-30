"use client";
import { Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function SignupForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/");
      } else {
        console.log("response", res);
        setLoading(false);
        alert("Login Faild!");
      }
    } catch (error) {
      setLoading(false);
      console.log("Something went wrong ", error);
      alert("Login Faild!");
    }
  };
  return (
    <div className="w-100 p-4  rounded shadow-md border-[.3px]">
      <h1 className="text-2xl font-bold text-center">Sign In</h1>
      <p className="text-center">Sign-In to Access Your Account</p>
      <form onSubmit={handleSubmit} method="post" className="flex flex-col ">
        <label htmlFor="email" className="mt-2 flex flex-col">
          <span className="flex flex-row gap-2">
            <Mail size={20} />
            Email
          </span>
          <input
            className="p-2 rounded border-b"
            type="email"
            placeholder="E.g. xyz@zyx.com"
            name="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label htmlFor="password" className="mt-2 flex flex-col">
          <span className="flex flex-row gap-2">
            <Lock size={20} /> Password
          </span>
          <input
            className="p-2 rounded border-b"
            type="password"
            placeholder="Password"
            name="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className="p-2 cursor-pointer rounded bg-black text-white w-full mt-2 disabled:cursor-not-allowed disabled:opacity-50" disabled={loading} >
          {loading ? "Submiting..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
