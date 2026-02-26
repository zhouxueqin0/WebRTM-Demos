import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAtomValue, useSetAtom } from "jotai";
import { userIdAtom } from "../store/user";
import {
  addPrivateMessageAtom,
  addChannelMessageAtom,
  incrementUnreadAtom,
  clearUnreadAtom,
  currentChannelIdAtom,
  chatStore,
} from "../store/chat";
import { rtmStore } from "../store/rtm";
import { RTMEvents } from "agora-rtm";
import "./styles/GlobalEventHandler.less";

export default function GlobalEventHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = useAtomValue(userIdAtom);
  const addPrivateMessage = useSetAtom(addPrivateMessageAtom);
  const addChannelMessage = useSetAtom(addChannelMessageAtom);
  const incrementUnread = useSetAtom(incrementUnreadAtom);
  const clearUnread = useSetAtom(clearUnreadAtom);
  const setCurrentChannelId = useSetAtom(currentChannelIdAtom);
  const [showKickDialog, setShowKickDialog] = useState(false);
  const isListenerRegistered = useRef(false);

  // 处理 linkState 事件（互踢、Token过期）
  const handleLinkState = useCallback(async (eventData: RTMEvents.LinkStateEvent) => {
    const { currentState, reasonCode } = eventData;

    // 处理互踢
    if (currentState === "FAILED" && reasonCode === "SAME_UID_LOGIN") {
      setShowKickDialog(true);
    }

    // 处理 Token 过期
    if (currentState === "FAILED" && (reasonCode === "INVALID_TOKEN" || reasonCode === "TOKEN_EXPIRED")) {
      try {
        await rtmStore.rtmLogin();
      } catch (error) {
        console.error("Token refresh failed:", error);
      }
    }
  }, []);

  // 注册监听器
  const registerListeners = useCallback(() => {
    if (isListenerRegistered.current) return;
    if (!rtmStore.checkRtmStatus()) return;

    // 注入 Jotai setters 到 chatStore
    chatStore.injectSetters({
      addPrivateMessage,
      addChannelMessage,
      incrementUnread,
      clearUnread,
      setCurrentChannelId,
      currentUserId: userId,
    });

    // 1. 注册私有消息监听（全局生命周期）
    chatStore.registerPrivateMessageListener();

    // 2. 注册 linkState 监听（处理互踢/Token过期）
    rtmStore.registerLinkStateListener(handleLinkState);

    isListenerRegistered.current = true;
  }, [userId, addPrivateMessage, addChannelMessage, incrementUnread, clearUnread, setCurrentChannelId, handleLinkState]);

  useEffect(() => {
    // 非登录页时注册监听器
    if (location.pathname !== "/") {
      registerListeners();
    }

    return () => {
      if (isListenerRegistered.current) {
        chatStore.unregisterPrivateMessageListener();
        rtmStore.unregisterLinkStateListener(handleLinkState);
        isListenerRegistered.current = false;
      }
    };
  }, [location.pathname, registerListeners, handleLinkState]);

  // 监听 userId 变化，更新 chatStore
  useEffect(() => {
    if (userId && isListenerRegistered.current) {
      chatStore.injectSetters({
        addPrivateMessage,
        addChannelMessage,
        incrementUnread,
        clearUnread,
        setCurrentChannelId,
        currentUserId: userId,
      });
    }
  }, [userId, addPrivateMessage, addChannelMessage, incrementUnread, clearUnread, setCurrentChannelId]);

  const handleRelogin = async () => {
    try {
      await rtmStore.rtmLogin();
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
