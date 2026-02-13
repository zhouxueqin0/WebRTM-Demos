// Zustand 聊天状态管理

import { create } from "zustand";
import type { Message } from "../types/chat";
import { useUserStore } from "./user";

interface ChatStore {
  // 私聊消息：userId -> Message[]
  privateMessages: Record<string, Message[]>;

  // 频道消息：channelId -> Message[]
  channelMessages: Record<string, Message[]>;

  // 未读计数：userId -> count
  unreadCounts: Record<string, number>;

  // Actions
  addPrivateMessage: (userId: string, message: Message) => void;
  addChannelMessage: (channelId: string, message: Message) => void;
  clearUnread: (userId: string) => void;
  clearChannelMessages: (channelId: string) => void;
  incrementUnread: (userId: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  privateMessages: {},
  channelMessages: {},
  unreadCounts: {},

  addPrivateMessage: (userId, message) =>
    set((state) => ({
      privateMessages: {
        ...state.privateMessages,
        [userId]: [...(state.privateMessages[userId] || []), message],
      },
    })),

  addChannelMessage: (channelId, message) =>
    set((state) => ({
      channelMessages: {
        ...state.channelMessages,
        [channelId]: [...(state.channelMessages[channelId] || []), message],
      },
    })),

  clearUnread: (userId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [userId]: 0,
      },
    })),

  clearChannelMessages: (channelId) =>
    set((state) => ({
      channelMessages: {
        ...state.channelMessages,
        [channelId]: [],
      },
    })),

  incrementUnread: (userId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [userId]: (state.unreadCounts[userId] || 0) + 1,
      },
    })),
}));

export const handleUserMessage = (eventData: any) => {
  const localUserId = useUserStore.getState().userId;
  const { publisher, message, channelType } = eventData;
  if (channelType === "USER") {
    // 处理私聊消息
    const msg: Message = {
      id: `${Date.now()}-${Math.random()}`,
      senderId: publisher,
      senderName: publisher,
      content: message,
      timestamp: Date.now(),
    };
    // 直接使用 store 的 getState() 方法，避免依赖
    useChatStore.getState().addPrivateMessage(publisher, msg);
    useChatStore.getState().incrementUnread(publisher);
  }
};

export const handleChannelMessage = (eventData: any) => {
  const localUserId = useUserStore.getState().userId;
  const { publisher, message, channelType } = eventData;

  if (channelType === "MESSAGE") {
    // 处理频道消息
    const { channelName } = eventData;

    let senderName = publisher;
    if (publisher === localUserId) {
      senderName = "Me";
    }

    const msg: Message = {
      id: `${Date.now()}-${Math.random()}`,
      senderId: publisher,
      senderName,
      content: message,
      timestamp: Date.now(),
    };

    useChatStore.getState().addChannelMessage(channelName, msg);
  }
};
