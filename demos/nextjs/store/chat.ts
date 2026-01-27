// Zustand 聊天状态管理

import { create } from "zustand";
import type { Message } from "../types/chat";

interface ChatStore {
  // 私聊消息：teacherUid -> Message[]
  privateMessages: Record<string, Message[]>;

  // 频道消息：channelId -> Message[]
  channelMessages: Record<string, Message[]>;

  // 未读计数：teacherUid -> count
  unreadCounts: Record<string, number>;

  // Actions
  addPrivateMessage: (teacherUid: string, message: Message) => void;
  addChannelMessage: (channelId: string, message: Message) => void;
  clearUnread: (teacherUid: string) => void;
  clearChannelMessages: (channelId: string) => void;
  incrementUnread: (teacherUid: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  privateMessages: {},
  channelMessages: {},
  unreadCounts: {},

  addPrivateMessage: (teacherUid, message) =>
    set((state) => ({
      privateMessages: {
        ...state.privateMessages,
        [teacherUid]: [...(state.privateMessages[teacherUid] || []), message],
      },
    })),

  addChannelMessage: (channelId, message) =>
    set((state) => ({
      channelMessages: {
        ...state.channelMessages,
        [channelId]: [...(state.channelMessages[channelId] || []), message],
      },
    })),

  clearUnread: (teacherUid) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [teacherUid]: 0,
      },
    })),

  clearChannelMessages: (channelId) =>
    set((state) => ({
      channelMessages: {
        ...state.channelMessages,
        [channelId]: [],
      },
    })),

  incrementUnread: (teacherUid) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [teacherUid]: (state.unreadCounts[teacherUid] || 0) + 1,
      },
    })),
}));
