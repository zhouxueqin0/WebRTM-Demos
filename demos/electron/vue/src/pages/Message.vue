<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useRtmStore } from "../stores/rtm";
import { handleChannelMessage, useChatStore } from "../stores/chat";
import { MOCK_TEACHERS, MOCK_CLASSROOMS, MOCK_STUDENTS } from "../stores/rtm";
import TeacherList from "../components/TeacherList.vue";
import StudentList from "../components/StudentList.vue";
import ClassroomList from "../components/ClassroomList.vue";
import ChatDrawer from "../components/ChatDrawer.vue";
import type { User, Classroom, ChatDrawerState, Message } from "../stores/rtm";
import { useUserStore } from "../stores/user";

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

const currentChannel = ref<string | null>(null);

onMounted(() => {
  // 检查登录状态
  if (!rtmStore.checkRtmStatus()) {
    router.push("/");
    return;
  }
});

const handlePrivateChatClick = (user: User) => {
  drawerState.value = {
    isOpen: true,
    mode: "private",
    targetId: user.userId,
    targetName: user.name ?? user.userId,
  };

  // 清零未读数
  chatStore.clearUnread(user.userId);
};

const handleClassroomClick = async (classroom: Classroom) => {
  // 订阅前监听
  rtmStore.registerMessageListener(handleChannelMessage);

  // 订阅频道
  try {
    await rtmStore.subscribeChannel(classroom.id);
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
  // 如果是频道模式，取消订阅
  if (drawerState.value.mode === "channel" && currentChannel.value) {
    try {
      rtmStore.unregisterMessageListener(handleChannelMessage);
      await rtmStore.unsubscribeChannel(currentChannel.value);
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
      // 发送私聊消息
      await rtmStore.sendPrivateMessage(drawerState.value.targetId, content);

      // 添加到本地消息列表
      const msg: Message = {
        id: `${Date.now()}-${Math.random()}`,
        senderId: userStore.userId,
        senderName: "Me",
        content,
        timestamp: Date.now(),
      };
      chatStore.addPrivateMessage(drawerState.value.targetId, msg);
    } else {
      // 发送频道消息
      await rtmStore.sendChannelMessage(drawerState.value.targetId, content);

      // 添加到本地消息列表
      const msg: Message = {
        id: `${Date.now()}-${Math.random()}`,
        senderId: userStore.userId,
        senderName: "Me",
        content,
        timestamp: Date.now(),
      };
    }
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};
</script>

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

<style scoped src="./styles/Message.css"></style>
