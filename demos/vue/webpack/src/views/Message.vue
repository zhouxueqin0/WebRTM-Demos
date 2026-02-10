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
import { MOCK_TEACHERS, MOCK_CLASSROOMS, MOCK_STUDENTS } from "../mocks/data";
import type { Classroom, ChatDrawerState, Message } from "../types/chat";
import type { User } from "../types/user";
import { isAuthenticated } from "../../../../shared/utils/auth";
import {
  subscribeChannel,
  unsubscribeChannel,
  sendChannelMessage,
  sendMessageToUser,
  getGlobalRtmClient,
  rtmEventEmitter,
} from "../../../../shared/rtm";
import { handleChannelMessage } from "../stores/chat";

const router = useRouter();
const userStore = useUserStore();
const chatStore = useChatStore();

const drawerState = ref<ChatDrawerState>({
  isOpen: false,
  mode: "private",
  targetId: "",
  targetName: "",
});

const currentChannel = ref<string | null>(null);

onMounted(() => {
  if (!isAuthenticated()) {
    router.push("/");
    return;
  }

  try {
    getGlobalRtmClient();
  } catch (e) {
    router.push("/");
  }
});

const handlePrivateChatClick = (user: User) => {
  drawerState.value = {
    isOpen: true,
    mode: "private",
    targetId: user.userId,
    targetName: user.name ?? user.userId,
  };

  chatStore.clearUnread(user.userId);
};

const handleClassroomClick = async (classroom: Classroom) => {
  rtmEventEmitter.addListener("message", handleChannelMessage);

  try {
    await subscribeChannel(classroom.id);
    currentChannel.value = classroom.id;

    drawerState.value = {
      isOpen: true,
      mode: "channel",
      targetId: classroom.id,
      targetName: classroom.name,
    };
  } catch (error) {
    console.error("Failed to subscribe channel:", error);
  }
};

const handleCloseDrawer = async () => {
  if (drawerState.value.mode === "channel" && currentChannel.value) {
    try {
      rtmEventEmitter.removeListener("message", handleChannelMessage);
      await unsubscribeChannel(currentChannel.value);
      currentChannel.value = null;
    } catch (error) {
      console.error("Failed to unsubscribe channel:", error);
    }
  }

  drawerState.value = {
    ...drawerState.value,
    isOpen: false,
  };
};

const handleSendMessage = async (content: string) => {
  try {
    if (drawerState.value.mode === "private") {
      await sendMessageToUser(drawerState.value.targetId, content);

      const msg: Message = {
        id: `${Date.now()}-${Math.random()}`,
        senderId: userStore.userId,
        senderName: "Me",
        content,
        timestamp: Date.now(),
      };
      chatStore.addPrivateMessage(drawerState.value.targetId, msg);
    } else {
      await sendChannelMessage(drawerState.value.targetId, content);
    }
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
