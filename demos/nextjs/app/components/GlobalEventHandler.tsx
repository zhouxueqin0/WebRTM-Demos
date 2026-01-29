"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { rtmEventEmitter, rtmLogin } from "../../../shared/rtm";
import "./GlobalEventHandler.css";

export default function GlobalEventHandler() {
  const router = useRouter();
  const [showKickDialog, setShowKickDialog] = useState(false);

  useEffect(() => {
    // 全局监听 linkState 事件，处理互踢
    const handleLinkState = (eventData: any) => {
      const { currentState, reasonCode } = eventData;

      if (currentState === "FAILED" && reasonCode === "SAME_UID_LOGIN") {
        // 显示互踢提示框
        setShowKickDialog(true);
      }
    };
    rtmEventEmitter.addListener("linkstate", handleLinkState);

    return () => {
      rtmEventEmitter.removeListener("linkstate", handleLinkState);
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
    router.push("/");
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
