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
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRtmStore } from "../stores/rtm";
import { useChatStore } from "../stores/chat";
import type { RTMEvents } from "agora-rtm";

const router = useRouter();
const route = useRoute();
const showKickDialog = ref(false);
const isListenerRegistered = ref(false);

const rtmStore = useRtmStore();
const chatStore = useChatStore();

// linkState 事件处理器
const handleLinkState = async (eventData: RTMEvents.LinkStateEvent) => {
  const { currentState, reasonCode } = eventData;

  console.log("linkState event:", currentState, reasonCode);

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

  // 检查 RTM 是否已登录
  if (!rtmStore.checkRtmStatus()) {
    return;
  }

  // 注册私有消息监听（全局生命周期）
  chatStore.registerPrivateMessageListener();

  // 注册 linkState 监听（处理互踢/Token过期）
  rtmStore.registerLinkStateListener(handleLinkState);

  isListenerRegistered.value = true;
  console.log("GlobalEventHandler: listeners registered");
};

// 取消监听器
const unregisterListeners = () => {
  if (!isListenerRegistered.value) return;

  try {
    // 取消私有消息监听
    chatStore.unregisterPrivateMessageListener();

    // 取消 linkState 监听
    rtmStore.unregisterLinkStateListener(handleLinkState);

    isListenerRegistered.value = false;
    console.log("GlobalEventHandler: listeners unregistered");
  } catch (error) {
    console.error("Failed to unregister listeners:", error);
  }
};

// 监听路由变化，登录成功后注册监听器
watch(
  () => route.path,
  (newPath) => {
    if (newPath !== "/") {
      // 非登录页，尝试注册监听器
      registerListeners();
    }
  },
  { immediate: true }
);

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
  unregisterListeners();
});

const handleRelogin = async () => {
  try {
    await rtmStore.rtmLogin();
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
