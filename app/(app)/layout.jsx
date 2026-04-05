import Header from "@/components/Header";
import { Mulish } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/contexts/Sidebar.context"; 
import ProtectedRoute from "@/components/Protected";
export const metadata = {
  title: "Assign Meter | Genus Power Infrastructure Ltd.",
  description:
    "This is a utily app for Genus Power Infrastructure for Meter Assignment",
};

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <div className={mulish.className}>
        <Header />
        <div className="flex justify-between">
          <Sidebar />
          <main className="p-2 flex-1 w-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
