import { defineStore } from "pinia";
import { useRtmStore } from "./rtm";

interface AppState {
  isLoading: boolean;
}

export const useAppStore = defineStore("app", {
  state: (): AppState => ({
    isLoading: false,
  }),

  actions: {
    async login(): Promise<void> {
      this.isLoading = true;

      try {
        const rtmStore = useRtmStore();
        // RTM 初始化和登录
        await rtmStore.initAndLogin();
      } finally {
        this.isLoading = false;
      }
    },

    async logout(): Promise<void> {
      const rtmStore = useRtmStore();
      await rtmStore.logout();
    },
  },
});
