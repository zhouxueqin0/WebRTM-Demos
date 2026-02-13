<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { isAuthenticated } from "../../../../shared/utils/auth";

const router = useRouter();

onMounted(() => {
  // 检查登录状态
  if (!isAuthenticated()) {
    router.push("/");
  }
});
</script>

<template>
  <div class="home-container">
    <div class="home-content">
      <h1>Hello World</h1>
      <p class="home-subtitle">Welcome to RTM SDK Demo</p>
    </div>
  </div>
</template>

<style scoped src="./Home.css"></style>
