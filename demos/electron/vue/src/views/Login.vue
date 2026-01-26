<template>
  <div class="login-container">
    <button @click="handleLogin" :disabled="loading">
      {{ loading ? "Loading..." : "Login" }}
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { mockLogin } from "../../../../../shared/utils/auth.js";

const router = useRouter();
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  const result = await mockLogin("user", "password");
  loading.value = false;

  if (result.success) {
    localStorage.setItem("token", result.token);
    router.push("/dashboard");
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

button {
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
}

button:hover:not(:disabled) {
  background-color: #35a372;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
