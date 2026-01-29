"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockAppLogin } from "../../shared/utils/auth";
import "./page.css";
import { useUserStore } from "@/store/user";
import { rtmEventEmitter } from "../../shared/rtm";
import { handleUserMessage } from "@/store/chat";

// 强制动态渲染
export const dynamic = "force-dynamic";

export default function Login() {
  const userId = useUserStore((s) => s.userId);
  const userRole = useUserStore((s) => s.role);
  const setUserId = useUserStore((s) => s.setUserId);
  const setUserRole = useUserStore((s) => s.setRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId.trim()) {
      setError("Please enter a username");
      return;
    }

    try {
      setLoading(true);
      // 如需使用 rtm 点对点消息，登录前监听，以防漏掉消息
      rtmEventEmitter.addListener("message", handleUserMessage);
      await mockAppLogin(userId, "password");

      localStorage.setItem("username", userId);
      localStorage.setItem("token", "mock-token-" + Date.now());

      // 登录后跳转
      router.push("/home");
    } catch (err) {
      // 登录失败移除事件监听
      rtmEventEmitter.removeListener("message", handleUserMessage);
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
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login to App"}
          </button>
        </form>
      </div>
    </div>
  );
}
