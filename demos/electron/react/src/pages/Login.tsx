import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockLogin } from "../../../../../shared/utils/auth.js";
import "./Login.css";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    const result = await mockLogin("user", "password");
    setLoading(false);

    if (result.success && result.token) {
      localStorage.setItem("token", result.token);
      navigate("/dashboard");
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
