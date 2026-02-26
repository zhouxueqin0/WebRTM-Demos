// RTM 操作层 - 封装所有 RTM SDK 调用
// UI 层不直接调用此 store，而是通过 Chat Store 间接调用

import { create } from "zustand";
import {
  initRtm,
  releaseRtm,
  subscribeChannel as rtmSubscribeChannel,
  unsubscribeChannel as rtmUnsubscribeChannel,
  sendMessageToUser as rtmSendMessageToUser,
  sendChannelMessage as rtmSendChannelMessage,
  rtmEventEmitter,
  rtmLogin,
  RTMEvents,
} from "../../shared/rtm";
import { isAuthenticated } from "../../shared/utils/auth";
import { useUserStore } from "./user";

export * from "../../shared/rtm";

interface RtmStore {
  // 连接状态
  isInitialized: boolean;
  isLoggedIn: boolean;

  // 生成 RTM Token
  generateRTMToken: () => Promise<string | undefined>;

  // RTM 初始化和登录
  initAndLogin: () => Promise<void>;

  rtmLogin: () => Promise<void>;

  // 检查 RTM 状态
  checkRtmStatus: () => boolean;

  // 登出
  logout: () => Promise<void>;

  // 消息发送
  sendPrivateMessage: (targetId: string, content: string) => Promise<void>;
  sendChannelMessage: (channelId: string, content: string) => Promise<void>;

  // 频道订阅
  subscribeChannel: (channelId: string) => Promise<void>;
  unsubscribeChannel: (channelId: string) => Promise<void>;

  // 事件监听管理
  registerMessageListener: (
    handler: (eventData: RTMEvents.MessageEvent) => void,
  ) => void;
  unregisterMessageListener: (
    handler: (eventData: RTMEvents.MessageEvent) => void,
  ) => void;
  registerLinkStateListener: (
    handler: (eventData: RTMEvents.LinkStateEvent) => void,
  ) => void;
  unRegisterLinkStateListener: (
    handler: (eventData: RTMEvents.LinkStateEvent) => void,
  ) => void;
  registerTokenPrivillegeExpiredListener: (
    handler: (eventData: RTMEvents.TokenEvent) => void,
  ) => void;
  unRegisterTokenPrivillegeExpiredListener: (
    handler: (eventData: RTMEvents.TokenEvent) => void,
  ) => void;
}

export const useRtmStore = create<RtmStore>((set, get) => ({
  isInitialized: false,
  isLoggedIn: false,

  generateRTMToken: async () => {
    // need fetch
    const token = undefined;
    return token;
  },

  // RTM 初始化和登录
  initAndLogin: async () => {
    try {
      const userId = useUserStore.getState().userId;
      // gen token
      const token = await get().generateRTMToken();
      // login
      await initRtm(userId, token);

      set({ isLoggedIn: true });
      console.log("RTM initialized and logged in successfully");
    } catch (error) {
      set({ isInitialized: false, isLoggedIn: false });
      throw error;
    }
  },

  rtmLogin: async () => {
    // gen token
    const token = await get().generateRTMToken();
    await rtmLogin(token);
  },

  // 检查 RTM 状态
  checkRtmStatus: () => {
    return isAuthenticated();
  },

  // 登出
  logout: async () => {
    try {
      // 清理所有事件监听
      rtmEventEmitter.removeAllListeners();

      // 释放 RTM 资源
      await releaseRtm();

      set({ isInitialized: false, isLoggedIn: false });
      console.log("RTM logged out successfully");
    } catch (error) {
      console.error("RTM logout failed:", error);
      throw error;
    }
  },

  // 发送私聊消息
  sendPrivateMessage: async (targetId: string, content: string) => {
    try {
      await rtmSendMessageToUser(targetId, content);
    } catch (error) {
      console.error("Failed to send private message:", error);
      throw error;
    }
  },

  // 发送频道消息
  sendChannelMessage: async (channelId: string, content: string) => {
    try {
      await rtmSendChannelMessage(channelId, content);
    } catch (error) {
      console.error("Failed to send channel message:", error);
      throw error;
    }
  },

  // 订阅频道
  subscribeChannel: async (channelId: string) => {
    try {
      await rtmSubscribeChannel(channelId);
      console.log(`Subscribed to channel: ${channelId}`);
    } catch (error) {
      console.error("Failed to subscribe channel:", error);
      throw error;
    }
  },

  // 取消订阅频道
  unsubscribeChannel: async (channelId: string) => {
    try {
      await rtmUnsubscribeChannel(channelId);
      console.log(`Unsubscribed from channel: ${channelId}`);
    } catch (error) {
      console.error("Failed to unsubscribe channel:", error);
      throw error;
    }
  },

  // 注册消息监听器
  registerMessageListener: (
    handler: (eventData: RTMEvents.MessageEvent) => void,
  ) => {
    rtmEventEmitter.addListener("message", handler);
  },

  // 取消消息监听器
  unregisterMessageListener: (
    handler: (eventData: RTMEvents.MessageEvent) => void,
  ) => {
    rtmEventEmitter.removeListener("message", handler);
  },

  registerLinkStateListener: (
    handler: (eventData: RTMEvents.LinkStateEvent) => void,
  ) => {
    rtmEventEmitter.addListener("linkState", handler);
  },

  unRegisterLinkStateListener: (
    handler: (eventData: RTMEvents.LinkStateEvent) => void,
  ) => {
    rtmEventEmitter.removeListener("linkState", handler);
  },

  registerTokenPrivillegeExpiredListener: (
    handler: (eventData: RTMEvents.TokenEvent) => void,
  ) => {
    rtmEventEmitter.addListener("token", handler);
  },

  unRegisterTokenPrivillegeExpiredListener: (
    handler: (eventData: RTMEvents.TokenEvent) => void,
  ) => {
    rtmEventEmitter.removeListener("token", handler);
  },
}));
