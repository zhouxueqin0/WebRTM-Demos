import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.less";
import { useUserStore } from "../store/user";
import { useAppStore } from "../store/app";

export default function Login() {
  const userId = useUserStore((s) => s.userId);
  const userRole = useUserStore((s) => s.role);
  const setUserId = useUserStore((s) => s.setUserId);
  const setUserRole = useUserStore((s) => s.setRole);
  const login = useAppStore((s) => s.login);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId.trim()) {
      setError("Please enter a username");
      return;
    }

    try {
      setLoading(true);
      await login();

      localStorage.setItem("username", userId);
      localStorage.setItem("token", "mock-token-" + Date.now());

      // 登录后跳转
      navigate("/home");
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login-card">
        <h1>RTM SDK Demo</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">User ID</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="userrole">User Role</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="userrole"
                  value="teacher"
                  checked={userRole === "teacher"}
                  onChange={(e) =>
                    setUserRole(e.target.value as "teacher" | "student")
                  }
                  disabled={loading}
                />
                Teacher
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="userrole"
                  value="student"
                  checked={userRole === "student"}
                  onChange={(e) =>
                    setUserRole(e.target.value as "teacher" | "student")
                  }
                  disabled={loading}
                />
                Student
              </label>
            </div>
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login to App"}
          </button>
        </form>
      </div>
    </div>
  );
}
