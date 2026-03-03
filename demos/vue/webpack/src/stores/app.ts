import { defineStore } from "pinia";
import { useRtmStore } from "./rtm";
import { useUserStore } from "./user";
import { useChatStore } from "./chat";

interface AppState {
  isLoading: boolean;
}

export const useAppStore = defineStore("app", {
  state: (): AppState => ({
    isLoading: false,
  }),

  actions: {
    async login() {
      const rtmStore = useRtmStore();
      const userStore = useUserStore();

      if (!userStore.userId) {
        throw new Error("User ID is required");
      }

      this.isLoading = true;

      try {
        await rtmStore.initAndLogin(userStore.userId);
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async logout() {
      const rtmStore = useRtmStore();
      const chatStore = useChatStore();

      this.isLoading = true;

      try {
        chatStore.reset();
        await rtmStore.logout();
      } catch (error) {
        console.error("Logout failed:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
