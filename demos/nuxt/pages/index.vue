<template>
  <div class="login-container">
    <div class="login-card">
      <h1>RTM SDK Demo</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">User ID</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your user ID"
            v-model="userStore.userId"
            :disabled="loading"
          />
        </div>
        <div class="form-group">
          <label for="userrole">User Role</label>
          <div class="radio-group">
            <label class="radio-label">
              <input
                type="radio"
                name="userrole"
                value="teacher"
                v-model="userStore.role"
                :disabled="loading"
              />
              Teacher
            </label>
            <label class="radio-label">
              <input
                type="radio"
                name="userrole"
                value="student"
                v-model="userStore.role"
                :disabled="loading"
              />
              Student
            </label>
          </div>
        </div>
        <div v-if="error" class="error-message">{{ error }}</div>
        <button type="submit" :disabled="loading">
          {{ loading ? "Logging in..." : "Login to App" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const userStore = useUserStore();
const loading = ref(false);
const error = ref("");
const router = useRouter();

// 动态导入 RTM 相关模块（仅客户端）
let mockAppLogin: any;
let rtmEventEmitter: any;
let handleUserMessage: any;

onMounted(async () => {
  if (process.client) {
    const authModule = await import("../../shared/utils/auth");
    const rtmModule = await import("../../shared/rtm");
    const chatModule = await import("../stores/chat");

    mockAppLogin = authModule.mockAppLogin;
    rtmEventEmitter = rtmModule.rtmEventEmitter;
    handleUserMessage = chatModule.handleUserMessage;
  }
});

const handleLogin = async () => {
  if (!userStore.userId.trim()) {
    error.value = "Please enter a username";
    return;
  }

  // 确保模块已加载
  if (!mockAppLogin || !rtmEventEmitter || !handleUserMessage) {
    error.value = "System is initializing, please try again.";
    return;
  }

  try {
    loading.value = true;
    // 如需使用 rtm 点对点消息，登录前监听，以防漏掉消息
    rtmEventEmitter.addListener("message", handleUserMessage);
    await mockAppLogin(userStore.userId, "password");

    localStorage.setItem("username", userStore.userId);
    localStorage.setItem("token", "mock-token-" + Date.now());

    // 登录后跳转
    await router.push("/home");
  } catch (err) {
    // 登录失败移除事件监听
    rtmEventEmitter.removeListener("message", handleUserMessage);
    error.value = "Login failed. Please try again.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-card h1 {
  margin: 0 0 1.5rem 0;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.form-group input[type="text"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group input[type="text"]:focus {
  outline: none;
  border-color: #667eea;
}

.radio-group {
  display: flex;
  gap: 1rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.radio-label input[type="radio"] {
  cursor: pointer;
}

.error-message {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover:not(:disabled) {
  background: #5568d3;
}

button:disabled {
  background: #a0aec0;
  cursor: not-allowed;
}
</style>
