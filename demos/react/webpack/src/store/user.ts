import { create } from "zustand";
import type { User } from "../types/user";

interface UserStore extends User {
  setUserId: (uid: string) => void;
  setRole: (role: "teacher" | "student") => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userId: "",
  name: "",
  avatar: "",
  role: "student",

  setUserId: (uid) =>
    set((state) => ({
      ...state,
      userId: uid,
    })),
  setRole: (role) =>
    set((state) => ({
      ...state,
      role,
    })),
}));
