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
import { useChatStore } from "../stores/chat";
import { useUserStore } from "../stores/user";
import { useRtmStore } from "../stores/rtm";
import { MOCK_TEACHERS, MOCK_CLASSROOMS, MOCK_STUDENTS } from "../stores/rtm";
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
  // 检查 RTM 状态
  if (!rtmStore.checkRtmStatus()) {
    router.push("/");
  }
});

const handlePrivateChatClick = (user: User) => {
  // 打开私聊（清零未读数）
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
    // 打开频道聊天（订阅 + 注册监听器）
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
    // 关闭聊天（取消订阅 + 清理监听器）
    await chatStore.closeChat(drawerState.value.mode);

    drawerState.value = {
      ...drawerState.value,
      isOpen: false,
    };
  } catch (error) {
    console.error("Failed to close chat:", error);
  }
};

const handleSendMessage = async (content: string) => {
  try {
    // 发送消息（通过 Chat Store）
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
