import { defineStore } from "pinia";
import { useRtmStore, type Message, type RTMEvents } from "./rtm";
import { useUserStore } from "./user";

interface ChatState {
  privateMessages: Record<string, Message[]>;
  channelMessages: Record<string, Message[]>;
  unreadCounts: Record<string, number>;
  currentChannelId: string | null;
  privateMessageListenerRegistered: boolean;
  channelMessageListenerRegistered: boolean;
}

export const useChatStore = defineStore("chat", {
  state: (): ChatState => ({
    privateMessages: {},
    channelMessages: {},
    unreadCounts: {},
    currentChannelId: null,
    privateMessageListenerRegistered: false,
    channelMessageListenerRegistered: false,
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

    reset() {
      this.privateMessages = {};
      this.channelMessages = {};
      this.unreadCounts = {};
      this.currentChannelId = null;
      this.privateMessageListenerRegistered = false;
      this.channelMessageListenerRegistered = false;
    },

    registerPrivateMessageListener() {
      if (this.privateMessageListenerRegistered) {
        return;
      }
      const rtmStore = useRtmStore();
      rtmStore.registerMessageListener(handleUserMessage);
      this.privateMessageListenerRegistered = true;
    },

    unregisterPrivateMessageListener() {
      if (!this.privateMessageListenerRegistered) {
        return;
      }
      const rtmStore = useRtmStore();
      rtmStore.unregisterMessageListener(handleUserMessage);
      this.privateMessageListenerRegistered = false;
    },

    registerChannelMessageListener() {
      if (this.channelMessageListenerRegistered) {
        return;
      }
      const rtmStore = useRtmStore();
      rtmStore.registerMessageListener(handleChannelMessage);
      this.channelMessageListenerRegistered = true;
    },

    unregisterChannelMessageListener() {
      if (!this.channelMessageListenerRegistered) {
        return;
      }
      const rtmStore = useRtmStore();
      rtmStore.unregisterMessageListener(handleChannelMessage);
      this.channelMessageListenerRegistered = false;
    },

    openPrivateChat(userId: string) {
      this.clearUnread(userId);
    },

    async openChannelChat(channelId: string) {
      const rtmStore = useRtmStore();

      try {
        this.registerChannelMessageListener();
        await rtmStore.subscribeChannel(channelId);
        this.currentChannelId = channelId;
      } catch (error) {
        console.error("Failed to open channel chat:", error);
        this.unregisterChannelMessageListener();
        throw error;
      }
    },

    async closeChat(mode: "private" | "channel") {
      if (mode === "channel" && this.currentChannelId) {
        const rtmStore = useRtmStore();

        try {
          this.unregisterChannelMessageListener();
          await rtmStore.unsubscribeChannel(this.currentChannelId);
          this.currentChannelId = null;
        } catch (error) {
          console.error("Failed to close channel chat:", error);
          throw error;
        }
      }
    },

    async sendMessage(targetId: string, content: string, mode: "private" | "channel") {
      const rtmStore = useRtmStore();
      const userStore = useUserStore();

      if (mode === "private") {
        await rtmStore.sendPrivateMessage(targetId, content);

        const msg: Message = {
          id: `${Date.now()}-${Math.random()}`,
          senderId: userStore.userId,
          senderName: "Me",
          content,
          timestamp: Date.now(),
        };
        this.addPrivateMessage(targetId, msg);
      } else {
        await rtmStore.sendChannelMessage(targetId, content);
      }
    },
  },
});

export const handleUserMessage = (eventData: RTMEvents.MessageEvent) => {
  const chatStore = useChatStore();
  const { publisher, message, channelType } = eventData;

  if (channelType !== "USER") {
    return;
  }

  const msg: Message = {
    id: `${Date.now()}-${Math.random()}`,
    senderId: publisher,
    senderName: publisher,
    content: message as string,
    timestamp: Date.now(),
  };
  chatStore.addPrivateMessage(publisher, msg);
  chatStore.incrementUnread(publisher);
};

export const handleChannelMessage = (eventData: RTMEvents.MessageEvent) => {
  const chatStore = useChatStore();
  const userStore = useUserStore();
  const { publisher, message, channelType, channelName } = eventData;

  if (channelType !== "MESSAGE") {
    return;
  }

  let senderName = publisher;
  if (publisher === userStore.userId) {
    senderName = "Me";
  }

  const msg: Message = {
    id: `${Date.now()}-${Math.random()}`,
    senderId: publisher,
    senderName,
    content: message as string,
    timestamp: Date.now(),
  };

  chatStore.addChannelMessage(channelName, msg);
};
