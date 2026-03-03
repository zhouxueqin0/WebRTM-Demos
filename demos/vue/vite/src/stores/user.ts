import { defineStore } from "pinia";
import type { User } from "./rtm";

export const useUserStore = defineStore("user", {
  state: (): User => ({
    userId: "",
    name: "",
    avatar: "",
    role: "student",
  }),

  actions: {
    setUserId(uid: string) {
      this.userId = uid;
    },
    setRole(role: "teacher" | "student") {
      this.role = role;
    },
    reset() {
      this.userId = "";
      this.name = "";
      this.avatar = "";
      this.role = "student";
    },
  },
});
