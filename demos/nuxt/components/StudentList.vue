<template>
  <div class="container">
    <h2 class="title">Student List</h2>
    <div class="list">
      <div
        v-for="student in students"
        :key="student.userId"
        class="item"
        @click="emit('studentClick', student)"
      >
        <span class="avatar">{{ student.avatar }}</span>
        <span class="name">{{ student.name }}</span>
        <span v-if="unreadCounts[student.userId]" class="badge">
          {{ unreadCounts[student.userId] }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { User } from "../types/user";
import { useChatStore } from "../stores/chat";

interface Props {
  students: User[];
}

defineProps<Props>();

const emit = defineEmits<{
  studentClick: [student: User];
}>();

const chatStore = useChatStore();
const unreadCounts = computed(() => chatStore.unreadCounts);
</script>

<style scoped>
.container {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: #2d3748;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
}

.item:hover {
  background: #f7fafc;
}

.avatar {
  font-size: 1.5rem;
}

.name {
  flex: 1;
  color: #4a5568;
  font-weight: 500;
}

.badge {
  background: #e53e3e;
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}
</style>
