"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockLogin } from "../../shared/utils/auth";
import "./page.css";

// 强制动态渲染
export const dynamic = "force-dynamic";

export default function Login() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await mockLogin(username, "password");
      localStorage.setItem("username", username);
      localStorage.setItem("token", "mock-token-" + Date.now());
      router.push("/dashboard");
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>RTM SDK Demo</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">User ID</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your user ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login to App"}
          </button>
        </form>
      </div>
    </div>
  );
}
