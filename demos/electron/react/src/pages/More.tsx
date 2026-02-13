import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../../../shared/utils/auth";
import "./More.less";

export default function More() {
  const navigate = useNavigate();

  useEffect(() => {
    // 检查登录状态
    if (!isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="more">
      <div className="more-content">
        <h1>More</h1>
        <p className="more-message">请自行补充其他业务功能</p>
      </div>
    </div>
  );
}
