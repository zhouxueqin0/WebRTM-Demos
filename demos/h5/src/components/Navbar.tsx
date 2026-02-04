import { NavLink } from "react-router-dom";
import "./Navbar.less";

export default function Navbar() {
  return (
    <nav className="navbar">
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
    </nav>
  );
}
