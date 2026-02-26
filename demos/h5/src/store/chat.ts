// Chat Store - 聊天状态管理 + 业务逻辑（Jotai）

import { atom } from "jotai";
import type { Message } from "./rtm";
import { rtmStore } from "./rtm";
import { RTMEvents } from "agora-rtm";

// 私聊消息：userId -> Message[]
export const privateMessagesAtom = atom<Record<string, Message[]>>({});

// 频道消息：channelId -> Message[]
export const channelMessagesAtom = atom<Record<string, Message[]>>({});

// 未读计数：userId -> count
export const unreadCountsAtom = atom<Record<string, number>>({});

// 当前频道 ID
export const currentChannelIdAtom = atom<string | null>(null);

// 派生 atom：添加私聊消息
export const addPrivateMessageAtom = atom(
  null,
  (get, set, { userId, message }: { userId: string; message: Message }) => {
    const current = get(privateMessagesAtom);
    set(privateMessagesAtom, {
      ...current,
      [userId]: [...(current[userId] || []), message],
    });
  },
);

// 派生 atom：添加频道消息
export const addChannelMessageAtom = atom(
  null,
  (
    get,
    set,
    { channelId, message }: { channelId: string; message: Message },
  ) => {
    const current = get(channelMessagesAtom);
    set(channelMessagesAtom, {
      ...current,
      [channelId]: [...(current[channelId] || []), message],
    });
  },
);

// 派生 atom：清零未读数
export const clearUnreadAtom = atom(null, (get, set, userId: string) => {
  const current = get(unreadCountsAtom);
  set(unreadCountsAtom, {
    ...current,
    [userId]: 0,
  });
});

// 派生 atom：增加未读数
export const incrementUnreadAtom = atom(null, (get, set, userId: string) => {
  const current = get(unreadCountsAtom);
  set(unreadCountsAtom, {
    ...current,
    [userId]: (current[userId] || 0) + 1,
  });
});

// 派生 atom：清空频道消息
export const clearChannelMessagesAtom = atom(
  null,
  (get, set, channelId: string) => {
    const current = get(channelMessagesAtom);
    set(channelMessagesAtom, {
      ...current,
      [channelId]: [],
    });
  },
);

// Chat Store 类（单例模式）- 业务逻辑封装
class ChatStore {
  private static instance: ChatStore;
  private privateMessageHandler: ((eventData: RTMEvents.MessageEvent) => void) | null = null;
  private channelMessageHandler: ((eventData: RTMEvents.MessageEvent) => void) | null = null;

  // Jotai setter 引用（由组件注入）
  private addPrivateMessageFn: ((params: { userId: string; message: Message }) => void) | null = null;
  private addChannelMessageFn: ((params: { channelId: string; message: Message }) => void) | null = null;
  private incrementUnreadFn: ((userId: string) => void) | null = null;
  private clearUnreadFn: ((userId: string) => void) | null = null;
  private setCurrentChannelIdFn: ((channelId: string | null) => void) | null = null;
  private currentUserId: string = "";

  private constructor() {}

  static getInstance(): ChatStore {
    if (!ChatStore.instance) {
      ChatStore.instance = new ChatStore();
    }
    return ChatStore.instance;
  }

  // 注入 Jotai setters（由 GlobalEventHandler 调用）
  injectSetters(setters: {
    addPrivateMessage: (params: { userId: string; message: Message }) => void;
    addChannelMessage: (params: { channelId: string; message: Message }) => void;
    incrementUnread: (userId: string) => void;
    clearUnread: (userId: string) => void;
    setCurrentChannelId: (channelId: string | null) => void;
    currentUserId: string;
  }): void {
    this.addPrivateMessageFn = setters.addPrivateMessage;
    this.addChannelMessageFn = setters.addChannelMessage;
    this.incrementUnreadFn = setters.incrementUnread;
    this.clearUnreadFn = setters.clearUnread;
    this.setCurrentChannelIdFn = setters.setCurrentChannelId;
    this.currentUserId = setters.currentUserId;
  }

  // 注册私有消息监听器
  registerPrivateMessageListener(): void {
    if (this.privateMessageHandler) return;

    this.privateMessageHandler = (eventData: RTMEvents.MessageEvent) => {
      const { publisher, message, channelType } = eventData;
      if (channelType === "USER" && this.addPrivateMessageFn && this.incrementUnreadFn) {
        const msg: Message = {
          id: `${Date.now()}-${Math.random()}`,
          senderId: publisher,
          senderName: publisher,
          content: message as string,
          timestamp: Date.now(),
        };
        this.addPrivateMessageFn({ userId: publisher, message: msg });
        this.incrementUnreadFn(publisher);
      }
    };

    rtmStore.registerMessageListener(this.privateMessageHandler);
  }

  // 取消私有消息监听器
  unregisterPrivateMessageListener(): void {
    if (this.privateMessageHandler) {
      rtmStore.unregisterMessageListener(this.privateMessageHandler);
      this.privateMessageHandler = null;
    }
  }

  // 注册频道消息监听器
  registerChannelMessageListener(): void {
    if (this.channelMessageHandler) return;

    this.channelMessageHandler = (eventData: RTMEvents.MessageEvent) => {
      const { publisher, message, channelType, channelName } = eventData;
      if (channelType === "MESSAGE" && this.addChannelMessageFn) {
        const senderName = publisher === this.currentUserId ? "Me" : publisher;
        const msg: Message = {
          id: `${Date.now()}-${Math.random()}`,
          senderId: publisher,
          senderName,
          content: message as string,
          timestamp: Date.now(),
        };
        this.addChannelMessageFn({ channelId: channelName, message: msg });
      }
    };

    rtmStore.registerMessageListener(this.channelMessageHandler);
  }

  // 取消频道消息监听器
  unregisterChannelMessageListener(): void {
    if (this.channelMessageHandler) {
      rtmStore.unregisterMessageListener(this.channelMessageHandler);
      this.channelMessageHandler = null;
    }
  }

  // 打开私聊
  openPrivateChat(userId: string): void {
    if (this.clearUnreadFn) {
      this.clearUnreadFn(userId);
    }
  }

  // 打开频道聊天
  async openChannelChat(channelId: string): Promise<void> {
    // 1. 注册监听器
    this.registerChannelMessageListener();

    // 2. 订阅频道
    await rtmStore.subscribeChannel(channelId);

    // 3. 记录当前频道
    if (this.setCurrentChannelIdFn) {
      this.setCurrentChannelIdFn(channelId);
    }
  }

  // 关闭聊天
  async closeChat(mode: "private" | "channel", currentChannelId: string | null): Promise<void> {
    if (mode === "channel" && currentChannelId) {
      // 先取消监听器
      this.unregisterChannelMessageListener();

      // 取消订阅频道
      await rtmStore.unsubscribeChannel(currentChannelId);

      // 清空当前频道
      if (this.setCurrentChannelIdFn) {
        this.setCurrentChannelIdFn(null);
      }
    }
  }

  // 发送消息
  async sendMessage(
    targetId: string,
    content: string,
    mode: "private" | "channel",
  ): Promise<void> {
    if (mode === "private") {
      // 发送私聊消息
      await rtmStore.sendPrivateMessage(targetId, content);

      // 添加到本地消息列表
      if (this.addPrivateMessageFn) {
        const msg: Message = {
          id: `${Date.now()}-${Math.random()}`,
          senderId: this.currentUserId,
          senderName: "Me",
          content,
          timestamp: Date.now(),
        };
        this.addPrivateMessageFn({ userId: targetId, message: msg });
      }
    } else {
      // 发送频道消息
      await rtmStore.sendChannelMessage(targetId, content);
      // 频道消息通过监听器自动添加
    }
  }
}

// 导出单例
export const chatStore = ChatStore.getInstance();
