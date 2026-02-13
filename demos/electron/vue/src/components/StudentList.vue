<script setup lang="ts">
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
</script>

<template>
  <div class="student-list-container">
    <h2 class="student-list-title">Student List</h2>
    <div class="student-list">
      <div
        v-for="student in students"
        :key="student.userId"
        class="student-list-item"
        @click="emit('studentClick', student)"
      >
        <span class="student-list-avatar">{{ student.avatar }}</span>
        <span class="student-list-name">{{ student.name }}</span>
        <span
          v-if="chatStore.unreadCounts[student.userId]"
          class="student-list-badge"
        >
          {{ chatStore.unreadCounts[student.userId] }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped src="./StudentList.css"></style>
