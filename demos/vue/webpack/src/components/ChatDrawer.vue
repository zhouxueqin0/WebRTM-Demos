<template>
  <div>
    <div :class="['overlay', { open: state.isOpen }]" @click="emit('close')" />
    <div :class="['drawer', { open: state.isOpen }]">
      <div class="header">
        <button class="back-button" @click="emit('close')">←</button>
        <div class="header-title">
          {{ state.mode === "private" ? "💬" : "📚" }} {{ state.targetName }}
        </div>
      </div>

      <div class="messages">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="[
            'message',
            msg.senderId === currentUserId ? 'sent' : 'received',
          ]"
        >
          <div class="message-sender">{{ msg.senderName }}</div>
          <div class="message-content">{{ msg.content }}</div>
        </div>
        <div ref="messagesEndRef" />
      </div>

      <div class="input-area">
        <input
          type="text"
          class="input"
          placeholder="Type a message..."
          v-model="inputValue"
          @keydown.enter.prevent="handleSend"
        />
        <button
          class="send-button"
          @click="handleSend"
          :disabled="!inputValue.trim()"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from "vue";
import type { ChatDrawerState } from "../types/chat";
import { useChatStore, handleChannelMessage } from "../stores/chat";
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

watch(
  messages,
  async () => {
    await nextTick();
    messagesEndRef.value?.scrollIntoView({ behavior: "smooth" });
  },
  { deep: true },
);

onUnmounted(() => {
  rtmEventEmitter.removeListener("message", handleChannelMessage);
});

const handleSend = () => {
  if (!inputValue.value.trim()) return;
  emit("sendMessage", inputValue.value.trim());
  inputValue.value = "";
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
  z-index: 999;
}

.overlay.open {
  opacity: 1;
  visibility: visible;
}

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 400px;
  background: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  transform: translateX(100%);
  transition: transform 0.3s;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.drawer.open {
  transform: translateX(0);
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f7fafc;
}

.back-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  color: #4a5568;
}

.back-button:hover {
  color: #2d3748;
}

.header-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 70%;
}

.message.sent {
  align-self: flex-end;
  align-items: flex-end;
}

.message.received {
  align-self: flex-start;
  align-items: flex-start;
}

.message-sender {
  font-size: 0.75rem;
  color: #718096;
  margin-bottom: 0.25rem;
}

.message-content {
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  word-wrap: break-word;
}

.message.sent .message-content {
  background: #667eea;
  color: white;
}

.message.received .message-content {
  background: #e2e8f0;
  color: #2d3748;
}

.input-area {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  background: #f7fafc;
}

.input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #cbd5e0;
  border-radius: 0.5rem;
  font-size: 0.95rem;
}

.input:focus {
  outline: none;
  border-color: #667eea;
}

.send-button {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.send-button:hover:not(:disabled) {
  background: #5568d3;
}

.send-button:disabled {
  background: #a0aec0;
  cursor: not-allowed;
}
</style>
