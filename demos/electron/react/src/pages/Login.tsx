import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockLogin } from "../../../../shared/utils/auth";
import "./Login.css";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await mockLogin("user", "password");
      localStorage.setItem("token", "mock-token-" + Date.now());
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Loading..." : "Login"}
      </button>
    </div>
  );
}
