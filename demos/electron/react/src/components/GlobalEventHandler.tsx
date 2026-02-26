import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRtmStore, RTMEvents } from "../store/rtm";
import { useChatStore } from "../store/chat";
import "./styles/GlobalEventHandler.less";

export default function GlobalEventHandler() {
  const navigate = useNavigate();
  const [showKickDialog, setShowKickDialog] = useState(false);
  const rtmLogin = useRtmStore().rtmLogin;
  const chatStore = useChatStore();
  const registerLinkStateListener = useRtmStore().registerLinkStateListener;
  const unRegisterLinkStateListener = useRtmStore().unRegisterLinkStateListener;

  const handleLinkState = useMemo(() => {
    return async (eventData: RTMEvents.LinkStateEvent) => {
      const { currentState, reasonCode } = eventData;

      if (currentState === "FAILED" && reasonCode === "SAME_UID_LOGIN") {
        // 显示互踢提示框
        setShowKickDialog(true);
      }

      // token 过期，需要重新登录
      if (currentState === "FAILED" && reasonCode === "TOKEN_EXPIRED") {
        await rtmLogin();
      }

      // 其他处理
    };
  }, [rtmLogin]);

  useEffect(() => {
    // 全局监听私聊消息
    chatStore.registerPrivateMessageListener();

    // 全局监听 linkState 事件，处理互踢
    registerLinkStateListener(handleLinkState);

    return () => {
      chatStore.unregisterPrivateMessageListener();
      unRegisterLinkStateListener(handleLinkState);
    };
  }, []);

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

  return (
    <>
      {showKickDialog && (
        <div className="kick-overlay">
          <div className="kick-dialog">
            <h2>⚠️ 账号在其他设备登录</h2>
            <p>检测到您的账号在其他设备登录，当前连接已断开。</p>
            <div className="kick-buttons">
              <button onClick={handleDismiss} className="btn-secondary">
                我知道了
              </button>
              <button onClick={handleRelogin} className="btn-primary">
                再次登录
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
