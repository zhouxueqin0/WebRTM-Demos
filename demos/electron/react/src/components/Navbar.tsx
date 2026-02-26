import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/app";
import "./styles/Navbar.less";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAppStore((s) => s.logout);

  const navItems = [
    { path: "/home", label: "Home", icon: "🏠" },
    { path: "/message", label: "Message", icon: "💬" },
    { path: "/more", label: "More", icon: "⋯" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // 即使出错也跳转到登录页
      navigate("/");
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
              to={item.path}
              className={`navbar-link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <span className="navbar-icon">{item.icon}</span>
              <span className="navbar-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="navbar-footer">
        <button onClick={handleLogout} className="logout">
          <span className="navbar-icon">🚪</span>
          <span className="navbar-label">Logout</span>
        </button>
      </div>
    </nav>
  );
}
