import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRtmStore } from "../store/rtm";
import "./styles/Home.less";

export default function Home() {
  const navigate = useNavigate();
  const checkRtmStatus = useRtmStore((s) => s.checkRtmStatus);

  useEffect(() => {
    // 检查 RTM 登录状态
    if (!checkRtmStatus()) {
      navigate("/");
    }
  }, [navigate, checkRtmStatus]);

  return (
    <div className="home">
      <div className="home-content">
        <h1>Hello World</h1>
        <p className="home-subtitle">Welcome to RTM SDK Demo</p>
      </div>
    </div>
  );
}
