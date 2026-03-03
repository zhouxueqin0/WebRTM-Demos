import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRtmStore } from "../store/rtm";
import "./styles/More.css";

export default function More() {
  const navigate = useNavigate();
  const checkRtmStatus = useRtmStore((s) => s.checkRtmStatus);

  useEffect(() => {
    if (!checkRtmStatus()) {
      navigate("/");
    }
  }, [navigate, checkRtmStatus]);

  return (
    <div className="more-container">
      <div className="more-content">
        <h1>More</h1>
        <p className="more-message">请自行补充其他业务功能</p>
      </div>
    </div>
  );
}
