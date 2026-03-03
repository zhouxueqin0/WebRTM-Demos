import { useNavigate, useLocation } from "react-router-dom";
import { useAppStore } from "../store/app";
import "./styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAppStore((s) => s.logout);

  const navItems = [
    { path: "/home", label: "Home", icon: "🏠" },
    { path: "/message", label: "Message", icon: "💬" },
    { path: "/more", label: "More", icon: "⋯" },
  ];

  const handleNavigate = async (path: string) => {
    await navigate(path);
  };

  const handleLogout = async () => {
    try {
      // 调用 App Store 的 logout 方法
      await logout();
      await navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      await navigate("/");
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
            <button
              type="button"
              className={`navbar-link ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => handleNavigate(item.path)}
            >
              <span className="navbar-icon">{item.icon}</span>
              <span className="navbar-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="navbar-footer">
        <button type="button" onClick={handleLogout} className="logout-button">
          <span className="navbar-icon">🚪</span>
          <span className="navbar-label">Logout</span>
        </button>
      </div>
    </nav>
  );
}
