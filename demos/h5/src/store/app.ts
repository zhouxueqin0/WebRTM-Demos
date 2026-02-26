// App Store - 应用级状态管理（Jotai）

import { atom } from "jotai";
import { rtmStore, isRtmInitializedAtom, isRtmLoggedInAtom } from "./rtm";

// 应用状态 atoms
export const isLoadingAtom = atom(false);
export const isLoggedInAtom = atom(false);

// App Store 类（单例模式）
class AppStore {
  private static instance: AppStore;
  private setIsRtmInitialized: ((value: boolean) => void) | null = null;
  private setIsRtmLoggedIn: ((value: boolean) => void) | null = null;
  private setIsLoggedIn: ((value: boolean) => void) | null = null;

  private constructor() {}

  static getInstance(): AppStore {
    if (!AppStore.instance) {
      AppStore.instance = new AppStore();
    }
    return AppStore.instance;
  }

  // 登录
  async login(userId: string): Promise<void> {
    // RTM 初始化和登录
    await rtmStore.initAndLogin(userId);
  }

  // 登出
  async logout(): Promise<void> {
    // RTM 登出
    await rtmStore.logout();
  }
}

// 导出单例
export const appStore = AppStore.getInstance();

// 导出 atoms
export { isRtmInitializedAtom, isRtmLoggedInAtom };
