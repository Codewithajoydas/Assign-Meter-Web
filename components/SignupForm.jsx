"use client";
import { Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function SignupForm() {
    const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/signin", {
        method: "POST",
          headers: {
          "Content-Type": "application/json"  
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: "include",
      });
        const data = await res.json();
        console.log(data)
      if (res.ok) {
          console.log(data);
          router.replace("/")
        } else {
            console.log("response", res);
        }
        console.log(data);
    } catch (error) {
      console.log("Something went wrong ", error);
    }
    console.log(email, password);
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
        <button className="p-2 cursor-pointer rounded bg-black text-white w-full mt-2">
          Sign In
        </button>
      </form>
    </div>
  );
}
