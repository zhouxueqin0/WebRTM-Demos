<script setup lang="ts">
import type { Classroom } from "../stores/rtm";

interface Props {
  classrooms: Classroom[];
}

defineProps<Props>();
const emit = defineEmits<{
  classroomClick: [classroom: Classroom];
}>();
</script>

<template>
  <div class="classroom-list-container">
    <h2 class="classroom-list-title">Classroom Channels</h2>
    <div class="classroom-list">
      <div
        v-for="classroom in classrooms"
        :key="classroom.id"
        class="classroom-list-item"
        @click="emit('classroomClick', classroom)"
      >
        <span class="classroom-list-icon">📚</span>
        <span class="classroom-list-name">{{ classroom.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped src="./styles/ClassroomList.css"></style>
