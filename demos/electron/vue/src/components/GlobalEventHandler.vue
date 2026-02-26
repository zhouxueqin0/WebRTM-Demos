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

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useRtmStore } from "../stores/rtm";
import { useChatStore } from "../stores/chat";
import type { RTMEvents } from "../stores/rtm";

const router = useRouter();
const route = useRoute();
const showKickDialog = ref(false);
const isListenerRegistered = ref(false);

const rtmStore = useRtmStore();
const chatStore = useChatStore();

// ⭐ 处理 linkState 事件（互踢、Token过期）
const handleLinkState = async (eventData: RTMEvents.LinkStateEvent) => {
  const { currentState, reasonCode } = eventData;

  // 处理互踢
  if (currentState === "FAILED" && reasonCode === "SAME_UID_LOGIN") {
    showKickDialog.value = true;
  }

  // 处理 Token 过期
  if (
    currentState === "FAILED" &&
    (reasonCode === "INVALID_TOKEN" || reasonCode === "TOKEN_EXPIRED")
  ) {
    try {
      await rtmStore.rtmLogin();
    } catch (error) {
      console.error("Token refresh failed:", error);
    }
  }
};

// 注册监听器
const registerListeners = () => {
  if (isListenerRegistered.value) return;
  if (!rtmStore.checkRtmStatus()) return;

  // 1. 注册私有消息监听（全局生命周期）
  chatStore.registerPrivateMessageListener();

  // 2. 注册 linkState 监听（处理互踢/Token过期）
  rtmStore.registerLinkStateListener(handleLinkState);

  isListenerRegistered.value = true;
};

// 监听 RTM 登录状态
watch(
  () => rtmStore.isLoggedIn,
  (isLoggedIn) => {
    if (isLoggedIn) {
      registerListeners();
    }
  }
);

onMounted(() => {
  if (route.path !== "/") {
    registerListeners();
  }
});

onUnmounted(() => {
  if (isListenerRegistered.value) {
    chatStore.unregisterPrivateMessageListener();
    rtmStore.unregisterLinkStateListener(handleLinkState);
  }
});

const handleRelogin = async () => {
  try {
    await rtmStore.rtmLogin();
    showKickDialog.value = false;
  } catch (error) {
    console.error("重新登录失败:", error);
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
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.kick-dialog {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
}

.kick-dialog h2 {
  margin: 0 0 1rem 0;
  color: #2d3748;
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
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-secondary {
  background: #e2e8f0;
  color: #2d3748;
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
