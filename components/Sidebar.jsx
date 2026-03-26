"use client";

import { CardSim, Gauge, Lock, Option, PlugZap, Projector } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const menuSections = [
  {
    title: "Categories",
    items: [
      { name: "Meter", icon: Gauge, path: "/meter" },
      { name: "CT", icon: PlugZap, path: "/ct" },
      { name: "NIC", icon: Projector, path: "/nic" },
      { name: "PT", icon: Option, path: "/pt" },
      { name: "SIM", icon: CardSim, path: "/sim" },
      { name: "SEAL", icon: Lock, path: "/seal" },
    ],
  },
  {
    title: "Workforce Management",
    items: [
      {
        name: "Create New User",
        icon: Gauge,
        path: "/workforce/create",
      },
    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <aside className="min-w-56 w-56 border-r p-4 sticky top-16 bg-[#F8FAFC] h-[calc(100vh-64px)] overflow-y-auto ">
      <nav className="relative h-full">
        <ul className="space-y-4 ">
          {menuSections.map((section) => (
            <li key={section.title}>
              <p className="font-semibold text-xs text-gray-500 mb-2">
                {section.title}
              </p>

              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.path}
                        className={`flex items-center gap-2 text-sm p-2 rounded-lg transition-all border
                          ${
                            isActive(item.path)
                              ? "bg-white  border-gray-200 font-bold text-gray-900"
                              : "border-transparent hover:bg-white"
                          }
                        `}
                      >
                        <Icon size={18} />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
          {/* Logout */}
        </ul>
        <Link
          href="/api/logout"
          className={`flex items-center gap-2 text-sm p-2 rounded-lg transition-all border absolute bottom-0 w-full hover:bg-red-300 hover:text-red-500 hover:font-bold`}
        >
          <Lock size={18} />
          Logout
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
