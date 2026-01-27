"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockLogin } from "../../shared/utils/auth";
import "./page.css";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    await mockLogin("user", "password");
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="login-container">
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Loading..." : "Login"}
      </button>
    </div>
  );
}
