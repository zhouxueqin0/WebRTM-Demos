import { NavLink, useNavigate } from "react-router-dom";
import { appStore } from "../store/app";
import "./styles/Navbar.less";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 调用 App Store 的 logout 方法
      await appStore.logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // 即使出错也跳转到登录页
      navigate("/");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-menu">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive ? "navbar-item active" : "navbar-item"
          }
        >
          <span className="navbar-icon">🏠</span>
          <span className="navbar-label">Home</span>
        </NavLink>
        <NavLink
          to="/message"
          className={({ isActive }) =>
            isActive ? "navbar-item active" : "navbar-item"
          }
        >
          <span className="navbar-icon">💬</span>
          <span className="navbar-label">Message</span>
        </NavLink>
        <NavLink
          to="/more"
          className={({ isActive }) =>
            isActive ? "navbar-item active" : "navbar-item"
          }
        >
          <span className="navbar-icon">⚙️</span>
          <span className="navbar-label">More</span>
        </NavLink>
      </div>

      <div className="navbar-footer">
        <button onClick={handleLogout} className="logout-button">
          <span className="navbar-icon">🚪</span>
          <span className="navbar-label">Logout</span>
        </button>
      </div>
    </nav>
  );
}
