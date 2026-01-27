"use client";

import { useState, useEffect, useRef } from "react";
import type { ChatDrawerState, Message } from "../../types/chat";
import { useChatStore } from "../../store/chat";
import styles from "./ChatDrawer.module.css";

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
        className={`${styles.overlay} ${state.isOpen ? styles.open : ""}`}
        onClick={onClose}
      />
      <div className={`${styles.drawer} ${state.isOpen ? styles.open : ""}`}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={onClose}>
            ←
          </button>
          <div className={styles.headerTitle}>
            {state.mode === "private" ? "💬" : "📚"} {state.targetName}
          </div>
        </div>

        <div className={styles.messages}>
          {messages.map((msg) => {
            const isSent = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`${styles.message} ${
                  isSent ? styles.sent : styles.received
                }`}
              >
                <div className={styles.messageSender}>{msg.senderName}</div>
                <div className={styles.messageContent}>{msg.content}</div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputArea}>
          <input
            type="text"
            className={styles.input}
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className={styles.sendButton}
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
