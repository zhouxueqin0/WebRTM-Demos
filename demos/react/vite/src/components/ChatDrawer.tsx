import { useState, useEffect, useRef } from "react";
import type { ChatDrawerState } from "../types/chat";
import { handleChannelMessage, useChatStore } from "../store/chat";
import { rtmEventEmitter } from "../../../../shared/rtm";
import "./ChatDrawer.css";

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
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
        className={`drawer-overlay ${state.isOpen ? "open" : ""}`}
        onClick={onClose}
      />
      <div className={`drawer ${state.isOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <button className="back-button" onClick={onClose}>
            ←
          </button>
          <div className="header-title">
            {state.mode === "private" ? "💬" : "📚"} {state.targetName}
          </div>
        </div>

        <div className="drawer-messages">
          {messages.map((msg) => {
            const isSent = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`message ${isSent ? "sent" : "received"}`}
              >
                <div className="message-sender">{msg.senderName}</div>
                <div className="message-content">{msg.content}</div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <input
            type="text"
            className="message-input"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="send-button"
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
