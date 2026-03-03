<template>
  <div class="message-container">
    <h1>RTM SDK Demo</h1>

    <div class="lists-container">
      <TeacherList
        v-if="userStore.role === 'student'"
        :teachers="MOCK_TEACHERS"
        @teacher-click="handlePrivateChatClick"
      />
      <StudentList
        v-else
        :students="MOCK_STUDENTS"
        @student-click="handlePrivateChatClick"
      />
      <ClassroomList
        :classrooms="MOCK_CLASSROOMS"
        @classroom-click="handleClassroomClick"
      />
    </div>

    <ChatDrawer
      :state="drawerState"
      :current-user-id="userStore.userId"
      @close="handleCloseDrawer"
      @send-message="handleSendMessage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import TeacherList from "../components/TeacherList.vue";
import StudentList from "../components/StudentList.vue";
import ClassroomList from "../components/ClassroomList.vue";
import ChatDrawer from "../components/ChatDrawer.vue";
import { useChatStore } from "../stores/chat";
import { useUserStore } from "../stores/user";
import { useRtmStore, MOCK_TEACHERS, MOCK_CLASSROOMS, MOCK_STUDENTS } from "../stores/rtm";
import type { Classroom, ChatDrawerState, User } from "../stores/rtm";

const router = useRouter();
const userStore = useUserStore();
const chatStore = useChatStore();
const rtmStore = useRtmStore();

const drawerState = ref<ChatDrawerState>({
  isOpen: false,
  mode: "private",
  targetId: "",
  targetName: "",
});

onMounted(() => {
  if (!rtmStore.checkRtmStatus()) {
    router.push("/");
    return;
  }
});

const handlePrivateChatClick = (user: User) => {
  chatStore.openPrivateChat(user.userId);

  drawerState.value = {
    isOpen: true,
    mode: "private",
    targetId: user.userId,
    targetName: user.name ?? user.userId,
  };
};

const handleClassroomClick = async (classroom: Classroom) => {
  try {
    await chatStore.openChannelChat(classroom.id);

    drawerState.value = {
      isOpen: true,
      mode: "channel",
      targetId: classroom.id,
      targetName: classroom.name,
    };
  } catch (error) {
    console.error("Failed to open channel chat:", error);
  }
};

const handleCloseDrawer = async () => {
  try {
    await chatStore.closeChat(drawerState.value.mode);
  } catch (error) {
    console.error("Failed to close chat:", error);
  }

  drawerState.value = {
    ...drawerState.value,
    isOpen: false,
  };
};

const handleSendMessage = async (content: string) => {
  try {
    await chatStore.sendMessage(
      drawerState.value.targetId,
      content,
      drawerState.value.mode
    );
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};
</script>

<style scoped>
.message-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.message-container h1 {
  margin-bottom: 2rem;
  color: #333;
}

.lists-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
</style>
