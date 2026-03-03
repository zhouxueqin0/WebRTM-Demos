import { create } from "zustand";
import { useRTMStore, type Message, RTMEvents } from "./rtm";
import { useUserStore } from "./user";

type ChatTarget = {
  type: "USER" | "MESSAGE";
  id: string;
};

interface ChatStore {
  privateMessages: Record<string, Message[]>;
  channelMessages: Record<string, Message[]>;
  unreadCounts: Record<string, number>;
  currentChat: ChatTarget | null;
  channelMessageListenerRegistered: boolean;
  privateMessageListenerRegistered: boolean;

  // 消息管理
  addPrivateMessage: (userId: string, message: Message) => void;
  addChannelMessage: (channelId: string, message: Message) => void;
  clearUnread: (userId: string) => void;
  clearChannelMessages: (channelId: string) => void;
  incrementUnread: (userId: string) => void;

  // 聊天操作
  openPrivateChat: (userId: string) => void;
  openChannelChat: (channelName: string) => Promise<void>;
  closeChat: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;

  // 事件监听器注册
  registerPrivateMessageListener: () => void;
  unregisterPrivateMessageListener: () => void;
  registerChannelMessageListener: () => void;
  unregisterChannelMessageListener: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  privateMessages: {},
  channelMessages: {},
  unreadCounts: {},
  currentChat: null,
  channelMessageListenerRegistered: false,
  privateMessageListenerRegistered: false,

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

  openPrivateChat: (userId: string) => {
    set({ currentChat: { type: "USER", id: userId } });
    get().clearUnread(userId);
  },

  openChannelChat: async (channelName: string) => {
    const rtmStore = useRTMStore.getState();

    // 注册频道消息监听器（仅注册一次）
    if (!get().channelMessageListenerRegistered) {
      get().registerChannelMessageListener();
    }

    // 订阅频道
    await rtmStore.subscribeChannel(channelName);

    set({ currentChat: { type: "MESSAGE", id: channelName } });
  },

  closeChat: async () => {
    const state = get();
    const rtmStore = useRTMStore.getState();

    if (state.currentChat?.type === "MESSAGE") {
      // 取消订阅频道
      await rtmStore.unsubscribeChannel(state.currentChat.id);

      // 移除频道消息监听器
      if (state.channelMessageListenerRegistered) {
        get().unregisterChannelMessageListener();
      }
    }

    set({ currentChat: null });
  },

  sendMessage: async (content: string) => {
    const state = get();
    const rtmStore = useRTMStore.getState();
    const userStore = useUserStore.getState();

    if (!state.currentChat) {
      throw new Error("No active chat");
    }

    const message: Message = {
      id: `${Date.now()}-${Math.random()}`,
      senderId: userStore.userId,
      senderName: "Me",
      content,
      timestamp: Date.now(),
    };

    if (state.currentChat.type === "USER") {
      await rtmStore.sendPrivateMessage(state.currentChat.id, content);
      state.addPrivateMessage(state.currentChat.id, message);
    } else if (state.currentChat.type === "MESSAGE") {
      await rtmStore.sendChannelMessage(state.currentChat.id, content);
      state.addChannelMessage(state.currentChat.id, message);
    }
  },

  // 注册私聊消息监听器
  registerPrivateMessageListener: () => {
    if (get().privateMessageListenerRegistered) {
      return;
    }

    const rtmStore = useRTMStore.getState();
    rtmStore.registerMessageListener(handleUserMessage);
    set({ privateMessageListenerRegistered: true });
  },

  // 取消私聊消息监听器
  unregisterPrivateMessageListener: () => {
    if (!get().privateMessageListenerRegistered) {
      return;
    }

    const rtmStore = useRTMStore.getState();
    rtmStore.unregisterMessageListener(handleUserMessage);
    set({ privateMessageListenerRegistered: false });
  },

  // 注册频道消息监听器
  registerChannelMessageListener: () => {
    if (get().channelMessageListenerRegistered) {
      return;
    }

    const rtmStore = useRTMStore.getState();
    rtmStore.registerMessageListener(handleChannelMessage);
    set({ channelMessageListenerRegistered: true });
  },

  // 取消频道消息监听器
  unregisterChannelMessageListener: () => {
    if (!get().channelMessageListenerRegistered) {
      return;
    }

    const rtmStore = useRTMStore.getState();
    rtmStore.unregisterMessageListener(handleChannelMessage);
    set({ channelMessageListenerRegistered: false });
  },
}));

// 全局私聊消息处理器（在 GlobalEventHandler 中注册）
export const handleUserMessage = (eventData: RTMEvents.MessageEvent) => {
  const localUserId = useUserStore.getState().userId;
  const { publisher, message, channelType } = eventData;

  if (channelType !== "USER") {
    return;
  }

  if (publisher === localUserId) {
    return;
  }

  // 确保 message 是字符串
  const messageContent =
    typeof message === "string" ? message : new TextDecoder().decode(message);

  const msg: Message = {
    id: `${Date.now()}-${Math.random()}`,
    senderId: publisher,
    senderName: publisher,
    content: messageContent,
    timestamp: Date.now(),
  };

  useChatStore.getState().addPrivateMessage(publisher, msg);
  useChatStore.getState().incrementUnread(publisher);
};

// 频道消息处理器（在 openChannelChat 时注册）
export const handleChannelMessage = (eventData: RTMEvents.MessageEvent) => {
  const localUserId = useUserStore.getState().userId;
  const { publisher, message, channelType, channelName } = eventData;

  if (channelType !== "MESSAGE") {
    return;
  }

  let senderName = publisher;
  if (publisher === localUserId) {
    senderName = "Me";
  }

  // 确保 message 是字符串
  const messageContent =
    typeof message === "string" ? message : new TextDecoder().decode(message);

  const msg: Message = {
    id: `${Date.now()}-${Math.random()}`,
    senderId: publisher,
    senderName,
    content: messageContent,
    timestamp: Date.now(),
  };

  useChatStore.getState().addChannelMessage(channelName, msg);
};
