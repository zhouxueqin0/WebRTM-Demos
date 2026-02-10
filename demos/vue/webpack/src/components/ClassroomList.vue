<template>
  <div class="container">
    <h2 class="title">Classroom Channels</h2>
    <div class="list">
      <div
        v-for="classroom in classrooms"
        :key="classroom.id"
        class="item"
        @click="emit('classroomClick', classroom)"
      >
        <span class="icon">📚</span>
        <span class="name">{{ classroom.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Classroom } from "../types/chat";

interface Props {
  classrooms: Classroom[];
}

defineProps<Props>();

const emit = defineEmits<{
  classroomClick: [classroom: Classroom];
}>();
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
}

.item:hover {
  background: #f7fafc;
}

.icon {
  font-size: 1.5rem;
}

.name {
  flex: 1;
  color: #4a5568;
  font-weight: 500;
}
</style>
