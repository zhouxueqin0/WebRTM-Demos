import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/app";
import { useRTMStore } from "../store/rtm";
import "./styles/More.css";

export default function More() {
  const navigate = useNavigate();
  const appStore = useAppStore();
  const rtmStore = useRTMStore();

  useEffect(() => {
    if (!appStore.isLoggedIn || !rtmStore.isLoggedIn) {
      navigate("/");
    }
  }, [appStore.isLoggedIn, rtmStore.isLoggedIn, navigate]);

  return (
    <div className="more-container">
      <div className="more-content">
        <h1>More</h1>
        <p className="more-message">请自行补充其他业务功能</p>
      </div>
    </div>
  );
}
