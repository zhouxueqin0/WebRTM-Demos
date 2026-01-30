<template>
  <ClientOnly>
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
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const router = useRouter();
const showKickDialog = ref(false);

let handleLinkState: ((eventData: any) => void) | null = null;
let rtmEventEmitter: any;
let rtmLogin: any;

onMounted(async () => {
  if (process.client) {
    const rtmModule = await import("../../shared/rtm");
    rtmEventEmitter = rtmModule.rtmEventEmitter;
    rtmLogin = rtmModule.rtmLogin;

    // 全局监听 linkState 事件，处理互踢
    handleLinkState = (eventData: any) => {
      const { currentState, reasonCode } = eventData;

      if (currentState === "FAILED" && reasonCode === "SAME_UID_LOGIN") {
        // 显示互踢提示框
        showKickDialog.value = true;
      }
    };
    rtmEventEmitter.addListener("linkstate", handleLinkState);
  }
});

onUnmounted(() => {
  if (handleLinkState && rtmEventEmitter) {
    rtmEventEmitter.removeListener("linkstate", handleLinkState);
  }
});

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
</script>

<style scoped>
.kick-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.kick-dialog {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
}

.kick-dialog h2 {
  margin: 0 0 1rem 0;
  color: #e53e3e;
  font-size: 1.25rem;
}

.kick-dialog p {
  margin: 0 0 1.5rem 0;
  color: #4a5568;
  line-height: 1.5;
}

.kick-dialog-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.kick-dialog-buttons button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover {
  background: #cbd5e0;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5568d3;
}
</style>
