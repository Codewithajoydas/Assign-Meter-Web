"use client";

import React, { memo } from "react";

const TemButton = memo(() => {
  const handleDownload = () => {
    window.location.assign("https://assign-meter-backend.onrender.com/api/bledevices/download");
  };

  return (
    <button
      onClick={handleDownload}
      className="
        group
        relative
        overflow-hidden
        rounded-sm
        bg-gradient-to-r
        from-blue-600
        to-indigo-600
        px-4
        py-2
        font-semibold
        text-white
        shadow-lg
        transition-all
        duration-300
        hover:scale-105
        hover:shadow-2xl
        hover:from-blue-500
        hover:to-indigo-500
        active:scale-95
        focus:outline-none
        focus:ring-4
        focus:ring-blue-300
      "
    >
      <span
        className="
          absolute
          inset-0
          -translate-x-full
          bg-white/20
          transition-transform
          duration-700
          group-hover:translate-x-full
        "
      />

      <span className="relative flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v11m0 0l4-4m-4 4l-4-4M5 20h14"
          />
        </svg>

        <span>Download BLE Excel</span>
      </span>
    </button>
  );
});

TemButton.displayName = "TemButton";

export default TemButton;
