import { defineStore } from "pinia";
import type { Message } from "../types/chat";
import { useUserStore } from "./user";

interface ChatState {
  privateMessages: Record<string, Message[]>;
  channelMessages: Record<string, Message[]>;
  unreadCounts: Record<string, number>;
}

export const useChatStore = defineStore("chat", {
  state: (): ChatState => ({
    privateMessages: {},
    channelMessages: {},
    unreadCounts: {},
  }),

  actions: {
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
  },
});

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

export const handleChannelMessage = (eventData: any) => {
  const chatStore = useChatStore();
  const userStore = useUserStore();
  const { publisher, message, channelType } = eventData;

  if (channelType === "MESSAGE") {
    const { channelName } = eventData;

    let senderName = publisher;
    if (publisher === userStore.userId) {
      senderName = "Me";
    }

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
