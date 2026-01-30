<template>
  <div>
    <GlobalEventHandler />
    <Navbar v-if="showNavbar" />
    <main :style="showNavbar ? { marginLeft: '200px' } : {}">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const route = useRoute();

// 登录页面不显示导航栏
const showNavbar = computed(() => route.path !== "/");
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html,
body,
#__nuxt {
  height: 100%;
}
</style>
