// Zustand 聊天状态管理 - 业务逻辑层
// 通过引入 RTM Store 调用 RTM 功能，UI 层只需调用此 store

import { create } from "zustand";
import type { Message } from "./rtm";
import { useUserStore } from "./user";
import { useRtmStore } from "./rtm";

interface ChatStore {
  // 私聊消息：userId -> Message[]
  privateMessages: Record<string, Message[]>;

  // 频道消息：channelId -> Message[]
  channelMessages: Record<string, Message[]>;

  // 未读计数：userId -> count
  unreadCounts: Record<string, number>;

  // 当前订阅的频道
  currentChannelId: string | null;

  // Actions - 消息状态管理
  addPrivateMessage: (userId: string, message: Message) => void;
  addChannelMessage: (channelId: string, message: Message) => void;
  clearUnread: (userId: string) => void;
  clearChannelMessages: (channelId: string) => void;
  incrementUnread: (userId: string) => void;

  // Actions - 业务方法（内部调用 RTM Store）
  sendMessage: (
    targetId: string,
    content: string,
    mode: "private" | "channel",
  ) => Promise<void>;
  openPrivateChat: (userId: string) => void;
  openChannelChat: (channelId: string) => Promise<void>;
  closeChat: (mode: "private" | "channel") => Promise<void>;

  // 消息监听器注册
  registerPrivateMessageListener: () => void;
  unregisterPrivateMessageListener: () => void;
  registerChannelMessageListener: () => void;
  unregisterChannelMessageListener: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  privateMessages: {},
  channelMessages: {},
  unreadCounts: {},
  currentChannelId: null,

  // ========== 消息状态管理 ==========
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

  // ========== 业务方法（调用 RTM Store）==========
  sendMessage: async (targetId, content, mode) => {
    const rtmStore = useRtmStore.getState();
    const userId = useUserStore.getState().userId;

    try {
      if (mode === "private") {
        // 发送私聊消息
        await rtmStore.sendPrivateMessage(targetId, content);

        // 添加到本地消息列表
        const msg: Message = {
          id: `${Date.now()}-${Math.random()}`,
          senderId: userId,
          senderName: "Me",
          content,
          timestamp: Date.now(),
        };
        get().addPrivateMessage(targetId, msg);
      } else {
        // 发送频道消息
        await rtmStore.sendChannelMessage(targetId, content);

        // 频道消息会通过监听器自动添加，这里不需要手动添加
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  },

  openPrivateChat: (userId) => {
    // 打开私聊，清零未读数
    get().clearUnread(userId);
  },

  openChannelChat: async (channelId) => {
    const rtmStore = useRtmStore.getState();

    try {
      // 订阅前先注册监听器
      get().registerChannelMessageListener();

      // 订阅频道
      await rtmStore.subscribeChannel(channelId);

      // 记录当前频道
      set({ currentChannelId: channelId });
    } catch (error) {
      console.error("Failed to open channel chat:", error);
      throw error;
    }
  },

  closeChat: async (mode) => {
    if (mode === "channel") {
      const rtmStore = useRtmStore.getState();
      const { currentChannelId } = get();

      if (currentChannelId) {
        try {
          // 先取消监听器
          get().unregisterChannelMessageListener();

          // 取消订阅频道
          await rtmStore.unsubscribeChannel(currentChannelId);

          // 清空当前频道
          set({ currentChannelId: null });
        } catch (error) {
          console.error("Failed to close channel chat:", error);
          throw error;
        }
      }
    }
  },

  // ========== 消息监听器注册 ==========
  registerPrivateMessageListener: () => {
    const rtmStore = useRtmStore.getState();
    rtmStore.registerMessageListener(handleUserMessage);
  },

  unregisterPrivateMessageListener: () => {
    const rtmStore = useRtmStore.getState();
    rtmStore.unregisterMessageListener(handleUserMessage);
  },

  registerChannelMessageListener: () => {
    const rtmStore = useRtmStore.getState();
    rtmStore.registerMessageListener(handleChannelMessage);
  },

  unregisterChannelMessageListener: () => {
    const rtmStore = useRtmStore.getState();
    rtmStore.unregisterMessageListener(handleChannelMessage);
  },
}));

// ========== 消息处理器（供 RTM Store 回调）==========

// 私有消息处理器（全局监听）
export const handleUserMessage = (eventData: any) => {
  const { publisher, message, channelType } = eventData;

  // 严格检查：只处理私聊消息
  if (channelType !== "USER") {
    return;
  }

  const msg: Message = {
    id: `${Date.now()}-${Math.random()}`,
    senderId: publisher,
    senderName: publisher,
    content: message,
    timestamp: Date.now(),
  };

  useChatStore.getState().addPrivateMessage(publisher, msg);
  useChatStore.getState().incrementUnread(publisher);
};

// 频道消息处理器（按需监听）
export const handleChannelMessage = (eventData: any) => {
  const localUserId = useUserStore.getState().userId;
  const { publisher, message, channelType, channelName } = eventData;

  // 严格检查：只处理频道消息
  if (channelType !== "MESSAGE") {
    return;
  }

  const senderName = publisher === localUserId ? "Me" : publisher;

  const msg: Message = {
    id: `${Date.now()}-${Math.random()}`,
    senderId: publisher,
    senderName,
    content: message,
    timestamp: Date.now(),
  };

  useChatStore.getState().addChannelMessage(channelName, msg);
};
