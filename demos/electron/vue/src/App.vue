<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Navbar from "./components/Navbar.vue";
import GlobalEventHandler from "./components/GlobalEventHandler.vue";

const route = useRoute();
const showNavbar = computed(() => route.path !== "/");
</script>

<template>
  <div>
    <Navbar v-if="showNavbar" />
    <main :style="{ marginLeft: showNavbar ? '200px' : '0' }">
      <router-view />
    </main>
    <GlobalEventHandler />
  </div>
</template>

<style scoped>
main {
  transition: margin-left 0.3s ease;
}
</style>
