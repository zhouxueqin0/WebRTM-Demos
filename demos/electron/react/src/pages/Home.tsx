import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../../../shared/utils/auth";
import "./Home.less";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // 检查登录状态
    if (!isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="home">
      <div className="home-content">
        <h1>Hello World</h1>
        <p className="home-subtitle">Welcome to RTM SDK Demo</p>
      </div>
    </div>
  );
}
