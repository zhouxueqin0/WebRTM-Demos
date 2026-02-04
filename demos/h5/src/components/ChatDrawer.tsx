import { useState, useEffect, useRef } from "react";
import { useAtomValue } from "jotai";
import type { ChatDrawerState } from "../types/chat";
import { privateMessagesAtom, channelMessagesAtom } from "../store/chat";
import "./ChatDrawer.less";

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

  const privateMessages = useAtomValue(privateMessagesAtom);
  const channelMessages = useAtomValue(channelMessagesAtom);

  const messages =
    state.mode === "private"
      ? privateMessages[state.targetId] || []
      : channelMessages[state.targetId] || [];

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        className={`chat-overlay ${state.isOpen ? "open" : ""}`}
        onClick={onClose}
      />
      <div className={`chat-drawer ${state.isOpen ? "open" : ""}`}>
        <div className="chat-header">
          <button className="chat-back-button" onClick={onClose}>
            ←
          </button>
          <div className="chat-header-title">
            {state.mode === "private" ? "💬" : "📚"} {state.targetName}
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((msg) => {
            const isSent = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`chat-message ${isSent ? "sent" : "received"}`}
              >
                <div className="chat-message-sender">{msg.senderName}</div>
                <div className="chat-message-content">{msg.content}</div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="chat-send-button"
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
