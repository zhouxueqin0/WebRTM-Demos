import { create } from "zustand";
import { useRTMStore } from "./rtm";

interface AppStore {
  isLoggedIn: boolean;
  login: (userId: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set) => ({
  isLoggedIn: false,

  login: async (_userId: string) => {
    const rtmStore = useRTMStore.getState();
    await rtmStore.initAndLogin();
    set({ isLoggedIn: true });
  },

  logout: async () => {
    const rtmStore = useRTMStore.getState();
    await rtmStore.logout();
    set({ isLoggedIn: false });
  },
}));
