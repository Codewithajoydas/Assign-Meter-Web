"use client";

import { SidebarContext } from "@/contexts/Sidebar.context";
import {
  Bluetooth,
  CardSim,
  Gauge,
  Lock,
  Option,
  ParkingMeterIcon,
  PlugZap,
  Projector,
  HelpCircle,
  ShieldCheck,
  FileSearch,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext } from "react";

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
      { name: "BLE Devices", icon: Bluetooth, path: "/bledevices" },
    ],
  },
  {
    title: "Management Tools",
    items: [
      { name: "Create New User", icon: Gauge, path: "/createuser" },
      { name: "Assign Meter", icon: ParkingMeterIcon, path: "/statusupdate" },
      {
        name: "Generate Unmapped Report",
        icon: FileSearch,
        path: "/generate-unmapped-report",
      },
    ],
  },
];

const Sidebar = () => {
  const { closed } = useContext(SidebarContext);
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <aside
      className="sidebar-scroll transition-all duration-300 border-r border-gray-200 sticky top-16 bg-white h-[calc(100vh-64px)] overflow-y-auto"
      style={{
        width: closed ? "0" : "260px",
        padding: closed ? "0" : "10px",
        overflow: closed ? "hidden" : "auto",
        minWidth: closed ? "0" : "250px",
      }}
    >
      <style jsx>{`
        .sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db transparent;
        }
        .sidebar-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 999px;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>

      <nav className="relative h-full">
        <div className="flex flex-col h-full">
          {/* Main Navigation */}
          <ul className="space-y-4">
            {menuSections.map((section) => (
              <li key={section.title}>
                <span className="font-semibold text-xs text-gray-500 mb-2 flex px-2">
                  {section.title}
                </span>

                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                      <li key={item.name}>
                        <Link
                          href={item.path}
                          className={`flex items-center gap-2 text-sm p-2 rounded-lg transition-colors whitespace-nowrap
                            ${
                              active
                                ? "bg-gray-100 font-medium text-gray-900"
                                : "text-gray-600 hover:bg-gray-50"
                            }
                          `}
                        >
                          <Icon size={18} className={active ? "text-gray-900" : "text-gray-400"} />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>

          {/* Bottom Support Area */}
          <div className="mt-auto pt-4 ">
            {/* Logout */}
            <button
              onClick={() => window.location.assign("/api/logout")}
              className="flex items-center gap-2 text-sm p-2 rounded-lg w-full text-gray-600 hover:bg-red-60 hover:text-red-600 bg-red-50 b-red-100 transition-all cursor-pointer"
            >
              <Lock size={18} />
              Logout
            </button> <br/>
            {/* Support Links */}
            <div className="flex items-center gap-4 px-2 mb-3 justify-between">
              <a target="_self"
                href="https://assign-meter-backend.onrender.com/web/index.html"
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors"
              >
                <HelpCircle size={14} />
                Help
              </a>

              <a target="_self"
                href="https://assign-meter-backend.onrender.com/web/index.html"
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ShieldCheck size={14} />
                Privacy
              </a>
            </div>

          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;