import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useRTMStore, RTMEvents } from "../store/rtm";
import { useChatStore } from "../store/chat";
import "./styles/GlobalEventHandler.css";

export default function GlobalEventHandler() {
  const navigate = useNavigate();
  const [showKickDialog, setShowKickDialog] = useState(false);

  const rtmLogin = useRTMStore((s) => s.rtmLogin);
  const registerLinkStateListener = useRTMStore(
    (s) => s.registerLinkStateListener,
  );
  const unRegisterLinkStateListener = useRTMStore(
    (s) => s.unRegisterLinkStateListener,
  );
  const registerPrivateMessageListener = useChatStore(
    (s) => s.registerPrivateMessageListener,
  );
  const unregisterPrivateMessageListener = useChatStore(
    (s) => s.unregisterPrivateMessageListener,
  );

  // 处理 linkState 事件（互踢、Token过期）
  const handleLinkState = useMemo(() => {
    return async (eventData: RTMEvents.LinkStateEvent) => {
      const { currentState, reasonCode } = eventData;

      // 处理互踢
      if (currentState === "FAILED" && reasonCode === "SAME_UID_LOGIN") {
        setShowKickDialog(true);
      }

      // 处理 Token 过期
      if (currentState === "FAILED" && reasonCode === "TOKEN_EXPIRED") {
        try {
          await rtmLogin();
          console.log("Token 过期，已自动重新登录");
        } catch (error) {
          console.error("Token 过期重新登录失败:", error);
        }
      }
    };
  }, [rtmLogin]);

  useEffect(() => {
    // 1. 注册私有消息监听（全局生命周期）
    registerPrivateMessageListener();

    // 2. 注册 linkState 监听（处理互踢/Token过期）
    registerLinkStateListener(handleLinkState);

    return () => {
      unregisterPrivateMessageListener();
      unRegisterLinkStateListener(handleLinkState);
    };
  }, [
    registerPrivateMessageListener,
    unregisterPrivateMessageListener,
    registerLinkStateListener,
    unRegisterLinkStateListener,
    handleLinkState,
  ]);

  const handleRelogin = async () => {
    try {
      await rtmLogin();
      setShowKickDialog(false);
      console.log("重新登录成功");
    } catch (error) {
      console.error("重新登录失败:", error);
      alert("重新登录失败，请刷新页面重试");
    }
  };

  const handleDismiss = () => {
    setShowKickDialog(false);
    navigate("/");
  };

  if (!showKickDialog) {
    return null;
  }

  return (
    <div className="kick-dialog-overlay">
      <div className="kick-dialog">
        <h2>⚠️ 账号在其他设备登录</h2>
        <p>检测到您的账号在其他设备登录，当前连接已断开。</p>
        <div className="kick-dialog-buttons">
          <button onClick={handleDismiss} className="btn-secondary">
            我知道了
          </button>
          <button onClick={handleRelogin} className="btn-primary">
            再次登录
          </button>
        </div>
      </div>
    </div>
  );
}
