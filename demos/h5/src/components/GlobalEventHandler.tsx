import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAtomValue, useSetAtom } from "jotai";
import { userIdAtom } from "../store/user";
import {
  addPrivateMessageAtom,
  addChannelMessageAtom,
  incrementUnreadAtom,
} from "../store/chat";
import { rtmEventEmitter, rtmLogin } from "../../../shared/rtm";
import type { Message } from "../types/chat";
import "./GlobalEventHandler.less";

export default function GlobalEventHandler() {
  const navigate = useNavigate();
  const userId = useAtomValue(userIdAtom);
  const addPrivateMessage = useSetAtom(addPrivateMessageAtom);
  const addChannelMessage = useSetAtom(addChannelMessageAtom);
  const incrementUnread = useSetAtom(incrementUnreadAtom);
  const [showKickDialog, setShowKickDialog] = useState(false);

  useEffect(() => {
    // 处理私聊消息
    const handleUserMessage = (eventData: any) => {
      const { publisher, message, channelType } = eventData;
      if (channelType === "USER") {
        const msg: Message = {
          id: `${Date.now()}-${Math.random()}`,
          senderId: publisher,
          senderName: publisher,
          content: message,
          timestamp: Date.now(),
        };
        addPrivateMessage({ userId: publisher, message: msg });
        incrementUnread(publisher);
      }
    };

    // 处理频道消息
    const handleChannelMessage = (eventData: any) => {
      const { publisher, message, channelType, channelName } = eventData;
      if (channelType === "MESSAGE") {
        let senderName = publisher;
        if (publisher === userId) {
          senderName = "Me";
        }

        const msg: Message = {
          id: `${Date.now()}-${Math.random()}`,
          senderId: publisher,
          senderName,
          content: message,
          timestamp: Date.now(),
        };

        addChannelMessage({ channelId: channelName, message: msg });
      }
    };

    // 处理连接状态变化（互踢）
    const handleLinkState = (eventData: any) => {
      const { currentState, reasonCode } = eventData;

      if (currentState === "FAILED" && reasonCode === "SAME_UID_LOGIN") {
        // 显示互踢提示框
        setShowKickDialog(true);
      }
    };

    // 注册事件监听
    rtmEventEmitter.addListener("message", handleUserMessage);
    rtmEventEmitter.addListener("message", handleChannelMessage);
    rtmEventEmitter.addListener("linkstate", handleLinkState);

    return () => {
      // 清理事件监听
      rtmEventEmitter.removeListener("message", handleUserMessage);
      rtmEventEmitter.removeListener("message", handleChannelMessage);
      rtmEventEmitter.removeListener("linkstate", handleLinkState);
    };
  }, [userId, navigate, addPrivateMessage, addChannelMessage, incrementUnread]);

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
    localStorage.removeItem("token");
    localStorage.removeItem("username");
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
