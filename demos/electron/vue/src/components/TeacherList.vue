<script setup lang="ts">
import type { User } from "../types/user";
import { useChatStore } from "../stores/chat";

interface Props {
  teachers: User[];
}

defineProps<Props>();
const emit = defineEmits<{
  teacherClick: [teacher: User];
}>();

const chatStore = useChatStore();
</script>

<template>
  <div class="teacher-list-container">
    <h2 class="teacher-list-title">Teacher List</h2>
    <div class="teacher-list">
      <div
        v-for="teacher in teachers"
        :key="teacher.userId"
        class="teacher-list-item"
        @click="emit('teacherClick', teacher)"
      >
        <span class="teacher-list-avatar">{{ teacher.avatar }}</span>
        <span class="teacher-list-name">{{ teacher.name }}</span>
        <span
          v-if="chatStore.unreadCounts[teacher.userId]"
          class="teacher-list-badge"
        >
          {{ chatStore.unreadCounts[teacher.userId] }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped src="./TeacherList.css"></style>
