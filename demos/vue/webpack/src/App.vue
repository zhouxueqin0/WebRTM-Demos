<template>
  <div>
    <GlobalEventHandler />
    <Navbar v-if="showNavbar" />
    <main :style="showNavbar ? { marginLeft: '200px' } : {}">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import GlobalEventHandler from "./components/GlobalEventHandler.vue";
import Navbar from "./components/Navbar.vue";

const route = useRoute();
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
#app {
  height: 100%;
}
</style>
