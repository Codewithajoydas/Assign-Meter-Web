'use client'
import { createContext, useState } from "react";

export const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [closed, setClosed] = useState(false);
  return (
    <SidebarContext.Provider value={{ closed, setClosed }}>
      {children}
    </SidebarContext.Provider>
  );
}
