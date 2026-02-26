<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";
import { useAppStore } from "../stores/app";

const userStore = useUserStore();
const appStore = useAppStore();
const router = useRouter();

const loading = ref(false);
const error = ref("");

const handleLogin = async (e: Event) => {
  e.preventDefault();

  if (!userStore.userId.trim()) {
    error.value = "Please enter a username";
    return;
  }

  try {
    loading.value = true;
    await appStore.login();

    localStorage.setItem("username", userStore.userId);
    localStorage.setItem("token", "mock-token-" + Date.now());

    // 登录后跳转
    router.push("/home");
  } catch (err) {
    error.value = "Login failed. Please try again.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1>RTM SDK Demo</h1>
      <form @submit="handleLogin">
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

<style scoped src="./styles/Login.css"></style>
