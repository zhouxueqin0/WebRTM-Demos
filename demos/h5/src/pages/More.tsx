import { useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { userIdAtom } from "../store/user";
import { rtmStore } from "../store/rtm";
import "./styles/More.less";

export default function More() {
  const navigate = useNavigate();
  const userId = useAtomValue(userIdAtom);

  const handleLogout = async () => {
    await rtmStore.logout();
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
