import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/app";
import { useRTMStore } from "../store/rtm";
import "./styles/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const appStore = useAppStore();
  const rtmStore = useRTMStore();

  useEffect(() => {
    if (!appStore.isLoggedIn || !rtmStore.isLoggedIn) {
      navigate("/");
    }
  }, [appStore.isLoggedIn, rtmStore.isLoggedIn, navigate]);

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Hello World</h1>
        <p className="home-subtitle">Welcome to RTM SDK Demo</p>
      </div>
    </div>
  );
}
