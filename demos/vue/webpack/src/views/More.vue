<template>
  <div class="more-container">
    <div class="more-content">
      <h1>More</h1>
      <p class="more-message">请自行补充其他业务功能</p>
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
.more-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.more-content {
  text-align: center;
  color: white;
}

.more-content h1 {
  font-size: 3rem;
  margin: 0 0 1rem 0;
  font-weight: bold;
}

.more-message {
  font-size: 1.25rem;
  opacity: 0.9;
}
</style>
