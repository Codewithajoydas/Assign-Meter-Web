"use client";

import { CardSim, Gauge, Lock, Option, ParkingMeterIcon, PlugZap, Projector } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";

const menuSections = [
  {
    title: "Categories",
    items: [
      { name: "Meter", icon: Gauge, path: "/meter" },
      { name: "Current Transformers", icon: PlugZap, path: "/ct" },
      { name: "Network Interface Card", icon: Projector, path: "/nic" },
      { name: "Potential Transformers", icon: Option, path: "/pt" },
      { name: "Subscriber Identity Module", icon: CardSim, path: "/sim" },
      { name: "Seal", icon: Lock, path: "/seal" },
    ],
  },
  {
    title: "Workforce Management",
    items: [
      {
        name: "Create New User",
        icon: Gauge,
        path: "/createuser",
      },
      {
        name: "Assign Meter",
        icon: ParkingMeterIcon,
        path: "/statusupdate",
      },
    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname();
const router = useRouter()
  const isActive = (path) => pathname === path;

  return (
    <aside className="min-w-56 w-75 border-r p-4 sticky top-16 bg-[#F8FAFC] h-[calc(100vh-64px)] overflow-y-auto ">
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
                        className={`flex items-center gap-2 text-sm p-2 rounded-lg transition-all border whitespace-nowrap
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
        <li
          onClick={()=>router.push("/api/logout")}
          className={`flex items-center gap-2 text-sm p-2 rounded-lg transition-all border absolute bottom-0 w-full hover:bg-red-300 hover:text-red-500 hover:font-bold`}
        >
          <Lock size={18} />
          Logout
        </li>
      </nav>
    </aside>
  );
};

export default Sidebar;
