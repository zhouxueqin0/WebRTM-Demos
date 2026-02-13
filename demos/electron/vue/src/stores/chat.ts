import { defineStore } from "pinia";
import { ref } from "vue";
import type { Message } from "../types/chat";

export const useChatStore = defineStore("chat", () => {
  // 私聊消息：{ userId: Message[] }
  const privateMessages = ref<Record<string, Message[]>>({});

  // 频道消息：{ channelId: Message[] }
  const channelMessages = ref<Record<string, Message[]>>({});

  // 未读消息数：{ userId: number }
  const unreadCounts = ref<Record<string, number>>({});

  function addPrivateMessage(userId: string, message: Message) {
    if (!privateMessages.value[userId]) {
      privateMessages.value[userId] = [];
    }
    privateMessages.value[userId].push(message);
  }

  function addChannelMessage(channelId: string, message: Message) {
    if (!channelMessages.value[channelId]) {
      channelMessages.value[channelId] = [];
    }
    channelMessages.value[channelId].push(message);
  }

  function incrementUnread(userId: string) {
    if (!unreadCounts.value[userId]) {
      unreadCounts.value[userId] = 0;
    }
    unreadCounts.value[userId]++;
  }

  function clearUnread(userId: string) {
    unreadCounts.value[userId] = 0;
  }

  return {
    privateMessages,
    channelMessages,
    unreadCounts,
    addPrivateMessage,
    addChannelMessage,
    incrementUnread,
    clearUnread,
  };
});

// 处理用户私聊消息
export function handleUserMessage(eventData: any) {
  const { message, publisher } = eventData;
  const chatStore = useChatStore();

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

// 处理频道消息
export function handleChannelMessage(eventData: any) {
  const { message, publisher, channelName } = eventData;
  const chatStore = useChatStore();

  const msg: Message = {
    id: `${Date.now()}-${Math.random()}`,
    senderId: publisher,
    senderName: publisher,
    content: message,
    timestamp: Date.now(),
  };

  chatStore.addChannelMessage(channelName, msg);
}
