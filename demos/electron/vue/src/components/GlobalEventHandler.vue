<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { rtmEventEmitter, rtmLogin } from "../../../../shared/rtm";

const router = useRouter();
const showKickDialog = ref(false);

const handleLinkState = (eventData: any) => {
  const { currentState, reasonCode } = eventData;

  if (currentState === "FAILED" && reasonCode === "SAME_UID_LOGIN") {
    // 显示互踢提示框
    showKickDialog.value = true;
  }
};

const handleRelogin = async () => {
  try {
    await rtmLogin();
    showKickDialog.value = false;
    console.log("重新登录成功");
  } catch (error) {
    console.error("重新登录失败:", error);
    alert("重新登录失败，请刷新页面重试");
  }
};

const handleDismiss = () => {
  showKickDialog.value = false;
  router.push("/");
};

onMounted(() => {
  // 全局监听 linkState 事件，处理互踢
  rtmEventEmitter.addListener("linkstate", handleLinkState);
});

onUnmounted(() => {
  rtmEventEmitter.removeListener("linkstate", handleLinkState);
});
</script>

<template>
  <div v-if="showKickDialog" class="kick-dialog-overlay">
    <div class="kick-dialog">
      <h2>⚠️ 账号在其他设备登录</h2>
      <p>检测到您的账号在其他设备登录，当前连接已断开。</p>
      <div class="kick-dialog-buttons">
        <button @click="handleDismiss" class="btn-secondary">我知道了</button>
        <button @click="handleRelogin" class="btn-primary">再次登录</button>
      </div>
    </div>
  </div>
</template>

<style scoped src="./GlobalEventHandler.css"></style>
