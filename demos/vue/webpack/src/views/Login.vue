<template>
  <div class="login-container">
    <button @click="handleLogin" :disabled="loading">
      {{ loading ? "Loading..." : "Login" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { mockLogin } from "../../../../shared/utils/auth";

const router = useRouter();
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  try {
    await mockLogin("user", "password");
    localStorage.setItem("token", "mock-token-" + Date.now());
    router.push("/dashboard");
  } catch (error) {
    console.error("Login failed:", error);
  } finally {
    loading.value = false;
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
