<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useRtmStore } from "../stores/rtm";

const router = useRouter();
const rtmStore = useRtmStore();

onMounted(() => {
  // 检查 RTM 登录状态
  if (!rtmStore.checkRtmStatus()) {
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

<style scoped src="./styles/Home.css"></style>
