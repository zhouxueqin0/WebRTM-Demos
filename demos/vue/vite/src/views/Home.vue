<template>
  <div class="home-container">
    <div class="home-content">
      <h1>Hello World</h1>
      <p class="home-subtitle">Welcome to RTM SDK Demo</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { isAuthenticated } from "../../../../shared/utils/auth";

const router = useRouter();

onMounted(() => {
  if (!isAuthenticated()) {
    router.push("/");
  }
});
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.home-content {
  text-align: center;
  color: white;
}

.home-content h1 {
  font-size: 4rem;
  margin: 0 0 1rem 0;
  font-weight: bold;
}

.home-subtitle {
  font-size: 1.5rem;
  opacity: 0.9;
}
</style>
