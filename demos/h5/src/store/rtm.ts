// RTM Store - RTM 操作薄封装层（Jotai）

import { atom } from "jotai";
import {
  initRtm,
  releaseRtm,
  rtmLogin as rtmSdkLogin,
  subscribeChannel as rtmSubscribeChannel,
  unsubscribeChannel as rtmUnsubscribeChannel,
  sendMessageToUser as rtmSendMessageToUser,
  sendChannelMessage as rtmSendChannelMessage,
  rtmEventEmitter,
  getGlobalRtmClient,
} from "../../../shared/rtm";
import { RTMEvents } from "agora-rtm";

export { MOCK_TEACHERS, MOCK_CLASSROOMS, MOCK_STUDENTS } from "../../../shared/data-mock/data";
export type { Classroom, ChatDrawerState, Message} from "../../../shared/data-mock/types/chat";
export type { User } from "../../../shared/data-mock/types/user";

// RTM 状态 atoms
export const isRtmInitializedAtom = atom(false);
export const isRtmLoggedInAtom = atom(false);

// RTM Store 类（单例模式）
class RtmStore {
  private static instance: RtmStore;

  private constructor() {}

  static getInstance(): RtmStore {
    if (!RtmStore.instance) {
      RtmStore.instance = new RtmStore();
    }
    return RtmStore.instance;
  }

  // 生成 RTM Token
  async generateRTMToken(): Promise<string | undefined> {
    // need fetch
    const token = undefined;
    return Promise.resolve(token);
  }

  // RTM 初始化和登录
  async initAndLogin(userId: string): Promise<void> {
    const appId = import.meta.env.VITE_APP_ID;
    if (!appId) {
      throw new Error("VITE_APP_ID is not set");
    }

    const token = await this.generateRTMToken();
    await initRtm(userId, token);
  }

  // RTM 重新登录（用于互踢后重新登录）
  async rtmLogin(): Promise<void> {
    const token = await this.generateRTMToken();
    await rtmSdkLogin(token);
  }

  // RTM 登出
  async logout(): Promise<void> {
    rtmEventEmitter.removeAllListeners();
    await releaseRtm();
  }

  // 检查 RTM 状态
  checkRtmStatus(): boolean {
    try {
      getGlobalRtmClient();
      return true;
    } catch {
      return false;
    }
  }

  // 订阅频道
  async subscribeChannel(channelId: string): Promise<void> {
    await rtmSubscribeChannel(channelId);
  }

  // 取消订阅频道
  async unsubscribeChannel(channelId: string): Promise<void> {
    await rtmUnsubscribeChannel(channelId);
  }

  // 发送私聊消息
  async sendPrivateMessage(userId: string, content: string): Promise<void> {
    await rtmSendMessageToUser(userId, content);
  }

  // 发送频道消息
  async sendChannelMessage(channelId: string, content: string): Promise<void> {
    await rtmSendChannelMessage(channelId, content);
  }

  // 注册消息监听器
  registerMessageListener(
    handler: (eventData: RTMEvents.MessageEvent) => void,
  ): void {
    rtmEventEmitter.addListener("message", handler);
  }

  // 取消消息监听器
  unregisterMessageListener(
    handler: (eventData: RTMEvents.MessageEvent) => void,
  ): void {
    rtmEventEmitter.removeListener("message", handler);
  }

  // 注册 linkState 监听器
  registerLinkStateListener(
    handler: (eventData: RTMEvents.LinkStateEvent) => void,
  ): void {
    rtmEventEmitter.addListener("linkState", handler);
  }

  // 取消 linkState 监听器
  unregisterLinkStateListener(
    handler: (eventData: RTMEvents.LinkStateEvent) => void,
  ): void {
    rtmEventEmitter.removeListener("linkState", handler);
  }
}

// 导出单例
export const rtmStore = RtmStore.getInstance();

// 导出类型
export type { RTMEvents };
