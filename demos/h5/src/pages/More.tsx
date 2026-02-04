import { useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { userIdAtom } from "../store/user";
import { mockAppLogout } from "../../../shared/utils/auth";
import "./More.less";

export default function More() {
  const navigate = useNavigate();
  const userId = useAtomValue(userIdAtom);

  const handleLogout = async () => {
    await mockAppLogout();
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="more-container">
      <h1>More</h1>
      <div className="more-content">
        <p>User ID: {userId}</p>
        <p>This is the More page. You can add more features here.</p>
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
