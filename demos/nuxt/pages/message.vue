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
import { MOCK_TEACHERS, MOCK_CLASSROOMS, MOCK_STUDENTS } from "../mocks/data";
import type { Classroom, ChatDrawerState, Message } from "../types/chat";
import type { User } from "../types/user";

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

// 动态导入 RTM 模块
let isAuthenticated: any;
let subscribeChannel: any;
let unsubscribeChannel: any;
let sendChannelMessage: any;
let sendMessageToUser: any;
let getGlobalRtmClient: any;
let rtmEventEmitter: any;
let handleChannelMessage: any;

onMounted(async () => {
  if (process.client) {
    const authModule = await import("../../shared/utils/auth");
    const rtmModule = await import("../../shared/rtm/index");
    const chatModule = await import("../stores/chat");

    isAuthenticated = authModule.isAuthenticated;
    subscribeChannel = rtmModule.subscribeChannel;
    unsubscribeChannel = rtmModule.unsubscribeChannel;
    sendChannelMessage = rtmModule.sendChannelMessage;
    sendMessageToUser = rtmModule.sendMessageToUser;
    getGlobalRtmClient = rtmModule.getGlobalRtmClient;
    rtmEventEmitter = rtmModule.rtmEventEmitter;
    handleChannelMessage = chatModule.handleChannelMessage;

    // 检查登录状态
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }

    try {
      getGlobalRtmClient();
    } catch (e) {
      router.push("/");
      return;
    }
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
  rtmEventEmitter.addListener("message", handleChannelMessage);

  // 订阅频道
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
  // 如果是频道模式，取消订阅
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
      // 发送私聊消息
      await sendMessageToUser(drawerState.value.targetId, content);

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
