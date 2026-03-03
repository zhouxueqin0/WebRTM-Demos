import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRtmStore } from "../store/rtm";
import "./styles/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const checkRtmStatus = useRtmStore((s) => s.checkRtmStatus);

  useEffect(() => {
    if (!checkRtmStatus()) {
      navigate("/");
    }
  }, [navigate, checkRtmStatus]);

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Hello World</h1>
        <p className="home-subtitle">Welcome to RTM SDK Demo</p>
      </div>
    </div>
  );
}
