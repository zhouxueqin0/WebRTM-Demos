import { useState, useEffect, useRef } from "react";
import type { ChatDrawerState, Message } from "../types/chat";
import { handleChannelMessage, useChatStore } from "../store/chat";
import "./ChatDrawer.less";
import { rtmEventEmitter } from "../../../../shared/rtm";

interface ChatDrawerProps {
  state: ChatDrawerState;
  currentUserId: string;
  onClose: () => void;
  onSendMessage: (content: string) => void;
}

export default function ChatDrawer({
  state,
  currentUserId,
  onClose,
  onSendMessage,
}: ChatDrawerProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const privateMessages = useChatStore((s) => s.privateMessages);
  const channelMessages = useChatStore((s) => s.channelMessages);

  const messages =
    state.mode === "private"
      ? privateMessages[state.targetId] || []
      : channelMessages[state.targetId] || [];

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      // 退出聊天，清理消息监听
      rtmEventEmitter.removeListener("message", handleChannelMessage);
    };
  }, []);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue.trim());
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div
        className={`chat-drawer-overlay ${state.isOpen ? "open" : ""}`}
        onClick={onClose}
      />
      <div className={`chat-drawer ${state.isOpen ? "open" : ""}`}>
        <div className="chat-drawer-header">
          <button className="chat-drawer-back" onClick={onClose}>
            ←
          </button>
          <div className="chat-drawer-header-title">
            {state.mode === "private" ? "💬" : "📚"} {state.targetName}
          </div>
        </div>

        <div className="chat-drawer-messages">
          {messages.map((msg) => {
            const isSent = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`chat-drawer-message ${
                  isSent ? "sent" : "received"
                }`}
              >
                <div className="chat-drawer-message-sender">
                  {msg.senderName}
                </div>
                <div className="chat-drawer-message-content">{msg.content}</div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-drawer-input-area">
          <input
            type="text"
            className="chat-drawer-input"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="chat-drawer-send"
            onClick={handleSend}
            disabled={!inputValue.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
