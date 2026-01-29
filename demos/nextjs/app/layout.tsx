"use client";

import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import GlobalEventHandler from "./components/GlobalEventHandler";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 登录页面不显示导航栏
  const showNavbar = pathname !== "/";

  return (
    <html lang="en">
      <body>
        <GlobalEventHandler />
        {showNavbar && <Navbar />}
        <main style={showNavbar ? { marginLeft: "200px" } : {}}>
          {children}
        </main>
      </body>
    </html>
  );
}
