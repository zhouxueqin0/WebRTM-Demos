// Pinia 聊天状态管理 - 业务逻辑层
// 通过引入 RTM Store 调用 RTM 功能，UI 层只需调用此 store

import { defineStore } from "pinia";
import type { Message } from "../types/chat";
import { useUserStore } from "./user";
import { useRtmStore } from "./rtm";

interface ChatState {
  // 私聊消息：userId -> Message[]
  privateMessages: Record<string, Message[]>;

  // 频道消息：channelId -> Message[]
  channelMessages: Record<string, Message[]>;

  // 未读计数：userId -> count
  unreadCounts: Record<string, number>;

  // 当前订阅的频道
  currentChannelId: string | null;
}

export const useChatStore = defineStore("chat", {
  state: (): ChatState => ({
    privateMessages: {},
    channelMessages: {},
    unreadCounts: {},
    currentChannelId: null,
  }),

  actions: {
    // ========== 消息状态管理 ==========
    addPrivateMessage(userId: string, message: Message) {
      if (!this.privateMessages[userId]) {
        this.privateMessages[userId] = [];
      }
      this.privateMessages[userId].push(message);
    },

    addChannelMessage(channelId: string, message: Message) {
      if (!this.channelMessages[channelId]) {
        this.channelMessages[channelId] = [];
      }
      this.channelMessages[channelId].push(message);
    },

    clearUnread(userId: string) {
      this.unreadCounts[userId] = 0;
    },

    clearChannelMessages(channelId: string) {
      this.channelMessages[channelId] = [];
    },

    incrementUnread(userId: string) {
      if (!this.unreadCounts[userId]) {
        this.unreadCounts[userId] = 0;
      }
      this.unreadCounts[userId]++;
    },

    // ========== 业务方法（调用 RTM Store）==========

    // 发送消息
    async sendMessage(
      targetId: string,
      content: string,
      mode: "private" | "channel"
    ): Promise<void> {
      const rtmStore = useRtmStore();
      const userStore = useUserStore();

      try {
        if (mode === "private") {
          // 发送私聊消息
          await rtmStore.sendPrivateMessage(targetId, content);

          // 添加到本地消息列表
          const msg: Message = {
            id: `${Date.now()}-${Math.random()}`,
            senderId: userStore.userId,
            senderName: "Me",
            content,
            timestamp: Date.now(),
          };
          this.addPrivateMessage(targetId, msg);
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

    // 打开私聊
    openPrivateChat(userId: string) {
      // 打开私聊，清零未读数
      this.clearUnread(userId);
    },

    // 打开频道聊天
    async openChannelChat(channelId: string): Promise<void> {
      const rtmStore = useRtmStore();

      try {
        // 订阅前先注册监听器
        this.registerChannelMessageListener();

        // 订阅频道
        await rtmStore.subscribeChannel(channelId);

        // 记录当前频道
        this.currentChannelId = channelId;
      } catch (error) {
        console.error("Failed to open channel chat:", error);
        throw error;
      }
    },

    // 关闭聊天
    async closeChat(mode: "private" | "channel"): Promise<void> {
      if (mode === "channel") {
        const rtmStore = useRtmStore();
        const currentChannelId = this.currentChannelId;

        if (currentChannelId) {
          try {
            // 先取消监听器
            this.unregisterChannelMessageListener();

            // 取消订阅频道
            await rtmStore.unsubscribeChannel(currentChannelId);

            // 清空当前频道
            this.currentChannelId = null;
          } catch (error) {
            console.error("Failed to close channel chat:", error);
            throw error;
          }
        }
      }
    },

    // ========== 消息监听器注册 ==========

    // 注册私有消息监听器
    registerPrivateMessageListener() {
      const rtmStore = useRtmStore();
      rtmStore.registerMessageListener(handleUserMessage);
    },

    // 取消私有消息监听器
    unregisterPrivateMessageListener() {
      const rtmStore = useRtmStore();
      rtmStore.unregisterMessageListener(handleUserMessage);
    },

    // 注册频道消息监听器
    registerChannelMessageListener() {
      const rtmStore = useRtmStore();
      rtmStore.registerMessageListener(handleChannelMessage);
    },

    // 取消频道消息监听器
    unregisterChannelMessageListener() {
      const rtmStore = useRtmStore();
      rtmStore.unregisterMessageListener(handleChannelMessage);
    },
  },
});

// ========== 消息处理器（供 RTM Store 回调）==========

// 私有消息处理器（全局监听）
export const handleUserMessage = (eventData: any) => {
  const chatStore = useChatStore();
  const { publisher, message, channelType } = eventData;

  if (channelType === "USER") {
    const msg: Message = {
      id: `${Date.now()}-${Math.random()}`,
      senderId: publisher,
      senderName: publisher,
      content: message,
      timestamp: Date.now(),
    };

    chatStore.addPrivateMessage(publisher, msg);
    chatStore.incrementUnread(publisher);
  }
};

// 频道消息处理器（按需监听）
export const handleChannelMessage = (eventData: any) => {
  const chatStore = useChatStore();
  const userStore = useUserStore();
  const { publisher, message, channelType, channelName } = eventData;

  if (channelType === "MESSAGE") {
    const senderName = publisher === userStore.userId ? "Me" : publisher;

    const msg: Message = {
      id: `${Date.now()}-${Math.random()}`,
      senderId: publisher,
      senderName,
      content: message,
      timestamp: Date.now(),
    };

    chatStore.addChannelMessage(channelName, msg);
  }
};
