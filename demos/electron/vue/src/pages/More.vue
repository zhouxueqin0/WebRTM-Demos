<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useRtmStore } from "../stores/rtm";

const router = useRouter();
const rtmStore = useRtmStore();

onMounted(() => {
  if (!rtmStore.checkRtmStatus()) {
    router.push("/");
  }
});
</script>

<template>
  <div class="more-container">
    <div class="more-content">
      <h1>More</h1>
      <p class="more-subtitle">More features coming soon...</p>
    </div>
  </div>
</template>

<style scoped>
.more-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.more-content {
  text-align: center;
  color: white;
}

.more-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.more-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}
</style>
