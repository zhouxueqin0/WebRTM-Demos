import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const userId = ref("");
  const role = ref<"teacher" | "student">("student");

  function setUserId(id: string) {
    userId.value = id;
  }

  function setRole(r: "teacher" | "student") {
    role.value = r;
  }

  return {
    userId,
    role,
    setUserId,
    setRole,
  };
});
