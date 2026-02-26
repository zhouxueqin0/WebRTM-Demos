// 应用状态管理 - 登录/登出

import { defineStore } from "pinia";
import { useRtmStore } from "./rtm";
import { useUserStore } from "./user";

interface AppState {
  isLoading: boolean;
}

export const useAppStore = defineStore("app", {
  state: (): AppState => ({
    isLoading: false,
  }),

  actions: {
    // 应用登录
    async login(): Promise<void> {
      this.isLoading = true;

      try {
        const rtmStore = useRtmStore();
        const userStore = useUserStore();

        // RTM 初始化和登录
        await rtmStore.initAndLogin(userStore.userId);

        // 保存登录状态到 localStorage
        localStorage.setItem("username", userStore.userId);
        localStorage.setItem("token", "mock-token-" + Date.now());
      } finally {
        this.isLoading = false;
      }
    },

    // 应用登出
    async logout(): Promise<void> {
      try {
        const rtmStore = useRtmStore();

        // RTM 登出
        await rtmStore.logout();

        // 清理本地存储
        localStorage.removeItem("token");
        localStorage.removeItem("username");
      } catch (error) {
        console.error("Logout failed:", error);
        throw error;
      }
    },
  },
});
