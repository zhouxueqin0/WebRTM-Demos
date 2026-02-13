<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { mockAppLogout } from "../../../../shared/utils/auth";

const route = useRoute();
const router = useRouter();

const navItems = [
  { path: "/home", label: "Home", icon: "🏠" },
  { path: "/message", label: "Message", icon: "💬" },
  { path: "/more", label: "More", icon: "⋯" },
];

const handleLogout = async () => {
  try {
    await mockAppLogout();
    router.push("/");
  } catch (error) {
    console.error("Logout failed:", error);
    // 即使出错也跳转到登录页
    router.push("/");
  }
};
</script>

<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <h2>RTM Demo</h2>
    </div>
    <ul class="navbar-menu">
      <li v-for="item in navItems" :key="item.path">
        <router-link
          :to="item.path"
          class="navbar-link"
          :class="{ active: route.path === item.path }"
        >
          <span class="navbar-icon">{{ item.icon }}</span>
          <span class="navbar-label">{{ item.label }}</span>
        </router-link>
      </li>
    </ul>
    <div class="navbar-footer">
      <button @click="handleLogout" class="logout-button">
        <span class="navbar-icon">🚪</span>
        <span class="navbar-label">Logout</span>
      </button>
    </div>
  </nav>
</template>

<style scoped src="./Navbar.css"></style>
