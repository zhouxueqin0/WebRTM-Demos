<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <h2>RTM Demo</h2>
    </div>
    <ul class="navbar-menu">
      <li v-for="item in navItems" :key="item.path">
        <a
          href="#"
          :class="['navbar-link', { active: route.path === item.path }]"
          @click.prevent="navigateTo(item.path)"
        >
          <span class="navbar-icon">{{ item.icon }}</span>
          <span class="navbar-label">{{ item.label }}</span>
        </a>
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

const navigateTo = async (path: string) => {
  await router.push(path);
};

const handleLogout = async () => {
  try {
    await mockAppLogout();
    await router.push("/");
  } catch (error) {
    console.error("Logout failed:", error);
    await router.push("/");
  }
};
</script>

<style scoped>
.navbar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 200px;
  background: #2d3748;
  color: white;
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.navbar-brand {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.navbar-brand h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.navbar-menu {
  flex: 1;
  list-style: none;
  padding: 1rem 0;
  margin: 0;
}

.navbar-menu li {
  margin: 0;
}

.navbar-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.2s;
}

.navbar-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.navbar-link.active {
  background: rgba(102, 126, 234, 0.2);
  color: white;
  border-left: 3px solid #667eea;
}

.navbar-icon {
  font-size: 1.25rem;
}

.navbar-label {
  font-size: 0.95rem;
}

.navbar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.logout-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}
</style>
