// RTM 操作层 - 封装所有 RTM SDK 调用
// UI 层不直接调用此 store，而是通过 Chat Store 间接调用

import { defineStore } from "pinia";
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
  getGlobalRtmClient,
} from "../../../../shared/rtm";
import { useUserStore } from "./user";

export * from "../../../../shared/rtm";
export * from "../../../../shared/data-mock/data";
export * from "../../../../shared/data-mock/types/chat";
export * from "../../../../shared/data-mock/types/user";

interface RtmState {
  isInitialized: boolean;
  isLoggedIn: boolean;
}

export const useRtmStore = defineStore("rtm", {
  state: (): RtmState => ({
    isInitialized: false,
    isLoggedIn: false,
  }),

  actions: {
    async generateRTMToken(): Promise<string | undefined> {
      // need fetch
      const token = undefined;
      return token;
    },

    // RTM 初始化和登录
    async initAndLogin(): Promise<void> {
      try {
        const userStore = useUserStore();
        const userId = userStore.userId;
        // gen token
        const token = await this.generateRTMToken();
        // login
        await initRtm(userId, token);

        this.isLoggedIn = true;
        console.log("RTM initialized and logged in successfully");
      } catch (error) {
        this.isInitialized = false;
        this.isLoggedIn = false;
        throw error;
      }
    },

    async rtmLogin(): Promise<void> {
      // gen token
      const token = await this.generateRTMToken();
      await rtmLogin(token);
    },

    // 检查 RTM 状态
    checkRtmStatus(): boolean {
      try {
        getGlobalRtmClient();
        return true;
      } catch {
        return false;
      }
    },

    // 登出
    async logout(): Promise<void> {
      try {
        // 清理所有事件监听
        rtmEventEmitter.removeAllListeners();

        // 释放 RTM 资源
        await releaseRtm();

        this.isInitialized = false;
        this.isLoggedIn = false;
        console.log("RTM logged out successfully");
      } catch (error) {
        console.error("RTM logout failed:", error);
        throw error;
      }
    },

    // 发送私聊消息
    async sendPrivateMessage(targetId: string, content: string): Promise<void> {
      try {
        await rtmSendMessageToUser(targetId, content);
      } catch (error) {
        console.error("Failed to send private message:", error);
        throw error;
      }
    },

    // 发送频道消息
    async sendChannelMessage(
      channelId: string,
      content: string,
    ): Promise<void> {
      try {
        await rtmSendChannelMessage(channelId, content);
      } catch (error) {
        console.error("Failed to send channel message:", error);
        throw error;
      }
    },

    // 订阅频道
    async subscribeChannel(channelId: string): Promise<void> {
      try {
        await rtmSubscribeChannel(channelId);
        console.log(`Subscribed to channel: ${channelId}`);
      } catch (error) {
        console.error("Failed to subscribe channel:", error);
        throw error;
      }
    },

    // 取消订阅频道
    async unsubscribeChannel(channelId: string): Promise<void> {
      try {
        await rtmUnsubscribeChannel(channelId);
        console.log(`Unsubscribed from channel: ${channelId}`);
      } catch (error) {
        console.error("Failed to unsubscribe channel:", error);
        throw error;
      }
    },

    // 注册消息监听器
    registerMessageListener(
      handler: (eventData: RTMEvents.MessageEvent) => void,
    ): void {
      rtmEventEmitter.addListener("message", handler);
    },

    // 取消消息监听器
    unregisterMessageListener(
      handler: (eventData: RTMEvents.MessageEvent) => void,
    ): void {
      rtmEventEmitter.removeListener("message", handler);
    },

    registerLinkStateListener(
      handler: (eventData: RTMEvents.LinkStateEvent) => void,
    ): void {
      rtmEventEmitter.addListener("linkState", handler);
    },

    unregisterLinkStateListener(
      handler: (eventData: RTMEvents.LinkStateEvent) => void,
    ): void {
      rtmEventEmitter.removeListener("linkState", handler);
    },

    registerTokenPrivillegeExpiredListener(
      handler: (eventData: RTMEvents.TokenEvent) => void,
    ): void {
      rtmEventEmitter.addListener("token", handler);
    },

    unregisterTokenPrivillegeExpiredListener(
      handler: (eventData: RTMEvents.TokenEvent) => void,
    ): void {
      rtmEventEmitter.removeListener("token", handler);
    },
  },
});
