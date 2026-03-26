import "./globals.css";
import { Mulish } from "next/font/google";

export const metadata = {
  title: "Assign Meter | Genus Power Infrastructure Ltd.",
  description: "This is a utily app for Genus Power Infrastructure for Meter Assignment",
};

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={mulish.className}>
        {children}
      </body>
    </html>
  );
}
