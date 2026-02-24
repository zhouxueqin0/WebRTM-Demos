"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "./styles/Navbar.css";
import { useAppStore } from "@/store/app";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = useAppStore((s) => s.logout);

  const navItems = [
    { path: "/home", label: "Home", icon: "🏠" },
    { path: "/message", label: "Message", icon: "💬" },
    { path: "/more", label: "More", icon: "⋯" },
  ];

  const handleLogout = async () => {
    try {
      await logout();

      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // 即使出错也跳转到登录页
      router.push("/");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>RTM Demo</h2>
      </div>
      <ul className="navbar-menu">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className={`navbar-link ${
                pathname === item.path ? "active" : ""
              }`}
            >
              <span className="navbar-icon">{item.icon}</span>
              <span className="navbar-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="navbar-footer">
        <button onClick={handleLogout} className="logout-button">
          <span className="navbar-icon">🚪</span>
          <span className="navbar-label">Logout</span>
        </button>
      </div>
    </nav>
  );
}
