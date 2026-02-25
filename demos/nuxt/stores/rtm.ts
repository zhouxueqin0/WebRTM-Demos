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
  rtmLogin as rtmSdkLogin,
  getGlobalRtmClient,
} from "../../shared/rtm";
import type { RTMEvents } from "../../shared/rtm";

export { MOCK_TEACHERS, MOCK_CLASSROOMS, MOCK_STUDENTS } from "../../shared/data-mock/data";
export type { Classroom, ChatDrawerState } from "../../shared/data-mock/types/chat";
export type { User } from "../../shared/data-mock/types/user";

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
    // 生成 RTM Token
    async generateRTMToken(): Promise<string | undefined> {
      // TODO: fetch token from your server
      const token = undefined;
      return token;
    },

    // RTM 初始化和登录
    async initAndLogin(userId: string): Promise<void> {
      try {
        const token = await this.generateRTMToken();
        await initRtm(userId, token);

        this.isInitialized = true;
        this.isLoggedIn = true;
        console.log("RTM initialized and logged in successfully");
      } catch (error) {
        this.isInitialized = false;
        this.isLoggedIn = false;
        throw error;
      }
    },

    // 重新登录（用于 Token 过期或互踢后重连）
    async rtmLogin(): Promise<void> {
      const token = await this.generateRTMToken();
      await rtmSdkLogin(token);
      this.isLoggedIn = true;
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
      content: string
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
      handler: (eventData: RTMEvents.MessageEvent) => void
    ): void {
      rtmEventEmitter.addListener("message", handler);
    },

    // 取消消息监听器
    unregisterMessageListener(
      handler: (eventData: RTMEvents.MessageEvent) => void
    ): void {
      rtmEventEmitter.removeListener("message", handler);
    },

    // 注册 linkState 监听器
    registerLinkStateListener(
      handler: (eventData: RTMEvents.LinkStateEvent) => void
    ): void {
      rtmEventEmitter.addListener("linkState", handler);
    },

    // 取消 linkState 监听器
    unregisterLinkStateListener(
      handler: (eventData: RTMEvents.LinkStateEvent) => void
    ): void {
      rtmEventEmitter.removeListener("linkState", handler);
    },

    // 注册 Token 过期监听器
    registerTokenExpiredListener(
      handler: (eventData: RTMEvents.TokenEvent) => void
    ): void {
      rtmEventEmitter.addListener("token", handler);
    },

    // 取消 Token 过期监听器
    unregisterTokenExpiredListener(
      handler: (eventData: RTMEvents.TokenEvent) => void
    ): void {
      rtmEventEmitter.removeListener("token", handler);
    },
  },
});
