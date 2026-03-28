"use client";
import { useState } from "react";
import { User, Mail, Lock, Shield, Bell, Moon } from "lucide-react";

export default function SettingsPage() {
  return (
    <>
      <h1 className="text-2xl font-bold">Settings</h1>
      <div
        className="p-6 max-w-3xl mx-auto space-y-6"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Account Settings */}
        <div
          className="bg-white shadow-md rounded-xl p-5 space-y-4 border"
          style={{ width: 400, padding: 10 }}
        >
          <h2 className="font-semibold text-lg">Account</h2>

          {/* Name */}
          <div>
            <label className="text-sm font-medium">Name</label>
            <div className="flex items-center gap-2 border rounded-lg p-2 mt-1">
              <User size={16} />
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="flex items-center gap-2 border rounded-lg p-2 mt-1">
              <Mail size={16} />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          <button className="bg-black text-white px-4 py-2 rounded-lg text-sm">
            Save Changes
          </button>
        </div>

        {/* Security Settings */}
        <div
          className="bg-white shadow-md rounded-xl p-5 space-y-4 border"
          style={{ width: 400, padding: 10 }}
        >
          <h2 className="font-semibold text-lg">Security</h2>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Change Password</label>
            <div className="flex items-center gap-2 border rounded-lg p-2 mt-1">
              <Lock size={16} />
              <input
                type="password"
                placeholder="New password"
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          <button className="bg-black text-white px-4 py-2 rounded-lg text-sm">
            Update Password
          </button>
        </div>
      </div>
    </>
  );
}
