<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from "vue";
import type { ChatDrawerState, Message } from "../types/chat";
import { handleChannelMessage, useChatStore } from "../stores/chat";
import { rtmEventEmitter } from "../../../../shared/rtm";

interface Props {
  state: ChatDrawerState;
  currentUserId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  sendMessage: [content: string];
}>();

const chatStore = useChatStore();
const inputValue = ref("");
const messagesEndRef = ref<HTMLDivElement | null>(null);

const messages = computed(() => {
  if (props.state.mode === "private") {
    return chatStore.privateMessages[props.state.targetId] || [];
  } else {
    return chatStore.channelMessages[props.state.targetId] || [];
  }
});

// 自动滚动到底部
watch(
  messages,
  async () => {
    await nextTick();
    messagesEndRef.value?.scrollIntoView({ behavior: "smooth" });
  },
  { deep: true }
);

const handleSend = () => {
  if (!inputValue.value.trim()) return;
  emit("sendMessage", inputValue.value.trim());
  inputValue.value = "";
};

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
};

onUnmounted(() => {
  // 退出聊天，清理消息监听
  rtmEventEmitter.removeListener("message", handleChannelMessage);
});
</script>

<template>
  <div>
    <div
      :class="['chat-drawer-overlay', { open: state.isOpen }]"
      @click="emit('close')"
    />
    <div :class="['chat-drawer', { open: state.isOpen }]">
      <div class="chat-drawer-header">
        <button class="chat-drawer-back-button" @click="emit('close')">
          ←
        </button>
        <div class="chat-drawer-header-title">
          {{ state.mode === "private" ? "💬" : "📚" }} {{ state.targetName }}
        </div>
      </div>

      <div class="chat-drawer-messages">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="[
            'chat-drawer-message',
            msg.senderId === currentUserId ? 'sent' : 'received',
          ]"
        >
          <div class="chat-drawer-message-sender">{{ msg.senderName }}</div>
          <div class="chat-drawer-message-content">{{ msg.content }}</div>
        </div>
        <div ref="messagesEndRef" />
      </div>

      <div class="chat-drawer-input-area">
        <input
          type="text"
          class="chat-drawer-input"
          placeholder="Type a message..."
          v-model="inputValue"
          @keypress="handleKeyPress"
        />
        <button
          class="chat-drawer-send-button"
          @click="handleSend"
          :disabled="!inputValue.trim()"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped src="./ChatDrawer.css"></style>
