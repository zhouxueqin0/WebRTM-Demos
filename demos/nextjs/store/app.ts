import { create } from "zustand";
import { useRtmStore } from "./rtm";

interface AppStore {
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set) => ({
  login: async () => {
    // app login
    // TODO: connect your server or database
    // rtm login
    const initAndLogin = useRtmStore.getState().initAndLogin;
    await initAndLogin();
  },
  logout: async () => {
    // app logout
    const rtmLogout = useRtmStore.getState().logout;
    await rtmLogout();
  },
}));
