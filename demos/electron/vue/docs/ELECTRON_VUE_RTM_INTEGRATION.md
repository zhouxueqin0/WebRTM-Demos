# Electron Vue 项目 RTM 集成文档

本文档说明 Electron Vue 项目集成 Agora RTM SDK 的架构设计和实现细节。

---

## 1. 概述

### 1.1 核心目标

- ✅ **单例管理**：全局唯一 RTM 实例，避免多个实例重复登录引发未知问题
- ✅ **事件集中处理**：统一事件监听和分发机制
- ✅ **连接状态同步**：跨组件的消息和连接状态管理
- ✅ **防止互踢**：正确处理 `SAME_UID_LOGIN` 事件

### 1.2 技术栈

- **框架**：Vue 3
- **状态管理**：Pinia
- **路由**：Vue Router 4
- **构建工具**：Vite 5
- **桌面框架**：Electron
- **RTM SDK**：agora-rtm

---

## 2. 分层架构

### 2.1 架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                    UI Layer (Pages & Components)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  Login.vue   │  │  Home.vue    │  │ Message.vue  │           │
│  │  (登录页)     │  │  (首页)       │  │ (消息页)      │           │
│  └──────────────┘  └──────────────┘  └──────┬───────┘           │
│                                             │                   │
│  ┌──────────────────────────────────────────┼──────────────┐    │
│  │  App.vue（全局布局）                       │              │    │
│  │  ┌────────────────┐  ┌───────────────────▼──────────┐   │    │
│  │  │ Navbar.vue     │  │ GlobalEventHandler.vue       │   │    │
│  │  │ （登出/导航）    │  │ （互踢 / Token 过期 /私聊监听）  │  │    │
│  │  └────────────────┘  └──────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────┼───────────────────────────────────────┼───────────────┘
          │                                       │
┌─────────┼───────────────────────────────────────┼────────────────┐
│         │    State Layer (Pinia Stores)         │                │
│  ┌──────▼───────┐  ┌──────────────┐  ┌──────────▼─────┐          │
│  │  App Store   │  │  User Store  │  │  Chat Store    │          │
│  │  (登录/登出)  │  │  (用户状态)   │   │  (消息/业务)    │          │
│  └──────┬───────┘  └──────────────┘  └─────────┬──────┘          │
│         │                                      │                 │
│  ┌──────▼──────────────────────────────────────▼──────┐          │
│  │              RTM Store（薄封装层）                   │          │
│  │  - 事件监听器注册/清理                                │          │
│  │  - RTM 操作封装（消息 / 订阅 / 登录 / 登出）           │           │
│  │  - 状态检查                                         │          │
│  └──────┬──────────────────────────────────────────────┘         │
└─────────┼────────────────────────────────────────────────────────┘
          │
┌─────────▼────────────────────────────────────────────────────────┐
│              RTM Layer (shared/rtm)                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ RTM Client   │  │ Event Emitter│  │ Message API  │            │
│  │  (Singleton) │  │  (EventBus)  │  │ Channel API  │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 目录结构

```
demos/electron/vue/
├── src/
│   ├── App.vue                     # 主应用（集成 GlobalEventHandler 和 Navbar）
│   ├── pages/
│   │   ├── Login.vue               # 登录页
│   │   ├── Home.vue                # Home 页面
│   │   ├── Message.vue             # Message 页面（聊天功能）
│   │   └── More.vue                # More 页面
│   ├── components/
│   │   ├── GlobalEventHandler.vue  # 全局事件处理（互踢/Token过期/私聊监听）
│   │   ├── Navbar.vue              # 全局导航栏
│   │   └── ChatDrawer.vue          # 聊天抽屉组件
│   ├── stores/
│   │   ├── app.ts                  # 应用状态（登录/登出）
│   │   ├── rtm.ts                  # RTM 操作薄封装层
│   │   ├── chat.ts                 # 消息状态 + 消息处理器
│   │   └── user.ts                 # 用户状态
│   ├── router/
│   │   └── index.ts                # 路由配置
│   └── types/
│       └── chat.ts                 # 聊天相关类型定义
│
├── main.js                         # Electron 主进程
├── package.json                    # 项目依赖
└── vite.config.ts                  # Vite 配置
```

---

## 2.3 核心组件

| 组件                       | 职责                                     | 位置                                |
| -------------------------- | ---------------------------------------- | ----------------------------------- |
| **RTM Store**              | RTM 操作薄封装层（提供事件监听注册）     | `stores/rtm.ts`                     |
| **App Store**              | 应用级状态管理（登录/登出）              | `stores/app.ts`                     |
| **Chat Store**             | 消息状态管理 + 业务逻辑                  | `stores/chat.ts`                    |
| **User Store**             | 用户状态管理                             | `stores/user.ts`                    |
| **GlobalEventHandler.vue** | 全局事件处理（互踢/Token 过期/私聊监听） | `components/GlobalEventHandler.vue` |
| **Navbar.vue**             | 全局导航栏（登出）                       | `components/Navbar.vue`             |

---

## 2.4 消息监听策略 ⭐

本架构采用**分层监听策略**，根据消息类型的特点采用不同的监听生命周期：

| 消息类型               | 监听时机       | 生命周期             | 注册位置                            | 处理函数               |
| ---------------------- | -------------- | -------------------- | ----------------------------------- | ---------------------- |
| **私有消息 (USER)**    | 登录成功后     | 伴随 App 生命周期    | `components/GlobalEventHandler.vue` | `handleUserMessage`    |
| **频道消息 (MESSAGE)** | 打开频道聊天时 | 仅在聊天窗口打开期间 | `stores/chat.ts` (openChannelChat)  | `handleChannelMessage` |

#### 设计理由

**私有消息 - 全局监听**：

- ✅ 用户随时可能收到私聊消息
- ✅ 需要实时更新未读数和消息列表
- ✅ 即使用户不在聊天界面，也要接收并存储消息
- ✅ 在 GlobalEventHandler 中注册，伴随 App 生命周期

**频道消息 - 按需监听**：

- ✅ 仅在用户主动进入频道时才需要接收
- ✅ 离开频道后取消监听，节省资源
- ✅ 避免接收用户未订阅频道的消息
- ✅ 在 Chat Store 的 openChannelChat 方法中注册，closeChat 时清理

#### 实现示例

```typescript
// 1. GlobalEventHandler - 注册私有消息监听（全局生命周期）
// components/GlobalEventHandler.vue
<script setup lang="ts">
import { onMounted, onUnmounted, watch } from "vue";
import { useRtmStore } from "../stores/rtm";
import { useChatStore } from "../stores/chat";

const rtmStore = useRtmStore();
const chatStore = useChatStore();

onMounted(() => {
  if (rtmStore.checkRtmStatus()) {
    // 登录后，全局监听私聊消息
    chatStore.registerPrivateMessageListener();
  }
});

onUnmounted(() => {
  chatStore.unregisterPrivateMessageListener();
});

// 监听 RTM 登录状态变化
watch(() => rtmStore.isLoggedIn, (isLoggedIn) => {
  if (isLoggedIn) {
    chatStore.registerPrivateMessageListener();
  }
});
</script>
```

```typescript
// 2. Chat Store - 打开频道聊天时注册频道消息监听
// stores/chat.ts
async openChannelChat(channelId: string): Promise<void> {
  const rtmStore = useRtmStore();

  // 订阅前先注册监听器
  this.registerChannelMessageListener();

  // 订阅频道
  await rtmStore.subscribeChannel(channelId);

  // 记录当前频道
  this.currentChannelId = channelId;
},

// 3. Chat Store - 关闭聊天时清理频道消息监听
async closeChat(mode: "private" | "channel"): Promise<void> {
  if (mode === "channel" && this.currentChannelId) {
    const rtmStore = useRtmStore();

    // 先取消监听器
    this.unregisterChannelMessageListener();

    // 取消订阅频道
    await rtmStore.unsubscribeChannel(this.currentChannelId);

    // 清空当前频道
    this.currentChannelId = null;
  }
},
```

---

## 3. 流程图

### 3.1 登录流程

```mermaid
sequenceDiagram
    participant User
    participant LoginPage as Login.vue
    participant AppStore as App Store
    participant RtmStore as RTM Store
    participant Router

    User->>LoginPage: 输入用户名
    LoginPage->>AppStore: login()
    AppStore->>RtmStore: initAndLogin(userId)
    RtmStore->>RtmStore: 创建单例实例
    RtmStore->>RtmStore: rtmEventEmitter 注册所有 rtm 事件
    RtmStore->>RtmStore: rtmLogin(token)
    RtmStore-->>AppStore: 登录成功
    AppStore-->>LoginPage: 返回成功
    LoginPage->>Router: router.push('/home')
```

### 3.2 私有消息接收流程

```mermaid
sequenceDiagram
    participant RTMServer as RTM Server
    participant RTMClient as RTM SDK
    participant RtmStore as RTM Store (eventEmitter)
    participant ChatStore as Chat Store
    participant UI as UI Component

    Note over RtmStore: rtm 初始化成功
    RtmStore-->>RTMClient: rtm.addEventListener('message', handleMessage)

    Note over ChatStore: 用户登录成功
    ChatStore-->>RtmStore: registerPrivateMessageListener(handleUserMessage)

    Note over RTMServer: 收到私聊消息
    RTMServer->>RTMClient: 推送消息
    RTMClient->>RtmStore: handleMessage(eventData)
    RtmStore->>ChatStore: handleUserMessage(eventData)

    alt channelType === 'USER'
        ChatStore->>ChatStore: incrementUnread(userId)
        ChatStore->>UI: 状态更新触发重渲染
        UI->>UI: 显示新消息 / 更新未读数
    end
```

### 3.3 频道消息接收流程

```mermaid
sequenceDiagram
    participant MessagePage as Message.vue
    participant ChatDrawer as ChatDrawer.vue
    participant ChatStore as Chat Store
    participant RtmStore as RTM Store
    participant RTMSDK as RTM SDK
    participant RTMServer as RTM Server

    Note over RtmStore: rtm 初始化成功
    RtmStore->>RTMSDK: addListener('message', handleMessage)
    MessagePage->>ChatStore: 用户点击教室
    ChatStore->>ChatStore: registerChannelMessageListener()
    ChatStore->>RtmStore: subscribeChannel(channelId)
    RtmStore->>RTMSDK: subscribe(channelId)
    RTMSDK->>RTMServer: subscribe
    RTMServer-->>MessagePage: 订阅成功
    MessagePage->>ChatDrawer: 打开抽屉 (mode: channel)

    Note over RTMServer: 收到频道消息
    RTMServer->>RTMSDK: 推送消息
    RTMSDK->>RtmStore: handleMessage(eventData)
    RtmStore->>ChatStore: handleChannelMessage(eventData)

    alt channelType === 'MESSAGE'
        ChatStore->>ChatDrawer: 状态更新触发重渲染
        ChatDrawer->>ChatDrawer: UI 变更
    end

    MessagePage->>ChatDrawer: 关闭抽屉
    ChatDrawer->>ChatStore: closeChat('channel')
    ChatStore->>ChatStore: unregisterChannelMessageListener()
    ChatStore->>RtmStore: unsubscribeChannel(channelId)
    RtmStore->>RTMServer: unsubscribe(channelId)
    RTMServer-->>ChatDrawer: unsubscribe success
```

### 3.4 多端互踢处理流程

```mermaid
sequenceDiagram
    participant EventHandler1 as GlobalEventHandler
    participant Device1 as 设备 1 (已登录)
    participant RTMServer as RTM Server
    participant Device2 as 设备 2 (新登录)
    participant EventHandler2 as GlobalEventHandler

    Note over Device1, RTMServer: 设备 1 全局在线中...

    Note over Device2: 设备 2 登录
    Device2->>RTMServer: login(userId, token)
    RTMServer->>Device1: 设备 1 被踢下线
    Device1-->>EventHandler1: handleLinkState(FAILED, SAME_UID_LOGIN)
    EventHandler1-->>Device1: 显示弹窗 "账号在其他设备登录"

    alt 策略 1: 设备1用户选择再次登录
        Device1->>Device1: 点击'再次登录'
        Device1->>RTMServer: rtmLogin(token)
        Note over Device1, RTMServer: 设备 1 全局在线中...
        RTMServer->>Device2: 设备 2 被踢下线
        Device2-->>EventHandler2: handleLinkState(FAILED, SAME_UID_LOGIN)
    else 策略 2: 设备1用户选择退出
        Device1->>Device1: 点击'我知道了'
        Device1->>Device1: router.push('/')
    end
```

---

## 4. 关键设计决策

### 4.1 RTM Store - 薄封装层

**位置**：`stores/rtm.ts`

```typescript
// stores/rtm.ts
import { defineStore } from "pinia";
import {
  initRtm,
  releaseRtm,
  subscribeChannel as rtmSubscribeChannel,
  unsubscribeChannel as rtmUnsubscribeChannel,
  sendMessageToUser as rtmSendMessageToUser,
  sendChannelMessage as rtmSendChannelMessage,
  rtmEventEmitter,
  rtmLogin as rtmSdkLogin,
  getGlobalRtmClient,
} from "../../../shared/rtm";
import type { RTMEvents } from "../../../shared/rtm";

export const useRtmStore = defineStore("rtm", {
  state: () => ({
    isInitialized: false,
    isLoggedIn: false,
  }),

  actions: {
    // RTM 初始化和登录
    async initAndLogin(userId: string): Promise<void> {
      const token = await this.generateRTMToken();
      await initRtm(userId, token);
      this.isInitialized = true;
      this.isLoggedIn = true;
    },

    // 检查 RTM 状态
    checkRtmStatus(): boolean {
      try {
        getGlobalRtmClient();
        return true;
      } catch {
        return false;
      }
    },

    // 事件监听器注册
    registerMessageListener(
      handler: (eventData: RTMEvents.MessageEvent) => void,
    ): void {
      rtmEventEmitter.addListener("message", handler);
    },

    unregisterMessageListener(
      handler: (eventData: RTMEvents.MessageEvent) => void,
    ): void {
      rtmEventEmitter.removeListener("message", handler);
    },

    registerLinkStateListener(
      handler: (eventData: RTMEvents.LinkStateEvent) => void,
    ): void {
      rtmEventEmitter.addListener("linkState", handler);
    },

    unregisterLinkStateListener(
      handler: (eventData: RTMEvents.LinkStateEvent) => void,
    ): void {
      rtmEventEmitter.removeListener("linkState", handler);
    },

    // 其他 RTM 操作封装...
  },
});
```

**设计原则**：

- ✅ **薄封装**：不重新实现逻辑，只是包装 `shared/rtm` 的方法
- ✅ **状态管理**：维护 RTM 连接状态（isInitialized, isLoggedIn）
- ✅ **事件管理**：提供统一的事件监听器注册/清理接口
- ✅ **类型安全**：提供 TypeScript 类型定义

### 4.2 App Store - 应用级状态管理

**位置**：`stores/app.ts`

```typescript
// stores/app.ts
import { defineStore } from "pinia";
import { useRtmStore } from "./rtm";
import { useUserStore } from "./user";

export const useAppStore = defineStore("app", {
  state: () => ({
    isLoading: false,
  }),

  actions: {
    async login(): Promise<void> {
      this.isLoading = true;

      try {
        const rtmStore = useRtmStore();
        const userStore = useUserStore();

        // RTM 初始化和登录
        await rtmStore.initAndLogin(userStore.userId);

        // 保存登录状态
        localStorage.setItem("username", userStore.userId);
        localStorage.setItem("token", "mock-token-" + Date.now());
      } finally {
        this.isLoading = false;
      }
    },

    async logout(): Promise<void> {
      const rtmStore = useRtmStore();
      await rtmStore.logout();
      localStorage.removeItem("token");
      localStorage.removeItem("username");
    },
  },
});
```

**好处**：

- ✅ **集中管理**：登录/登出逻辑集中在一个地方
- ✅ **UI 简化**：UI 层只需调用 `login()` 和 `logout()`
- ✅ **易于维护**：修改登录流程只需改一个地方

### 4.3 GlobalEventHandler 作为全局事件中心

**位置**：`components/GlobalEventHandler.vue`

```vue
<!-- components/GlobalEventHandler.vue -->
<template>
  <ClientOnly>
    <div v-if="showKickDialog" class="kick-dialog-overlay">
      <div class="kick-dialog">
        <h2>⚠️ 账号在其他设备登录</h2>
        <p>检测到您的账号在其他设备登录，当前连接已断开。</p>
        <div class="kick-dialog-buttons">
          <button @click="handleDismiss" class="btn-secondary">我知道了</button>
          <button @click="handleRelogin" class="btn-primary">再次登录</button>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useRtmStore } from "../stores/rtm";
import { useChatStore } from "../stores/chat";
import type { RTMEvents } from "../stores/rtm";

const router = useRouter();
const route = useRoute();
const showKickDialog = ref(false);
const isListenerRegistered = ref(false);

const rtmStore = useRtmStore();
const chatStore = useChatStore();

// ⭐ 处理 linkState 事件（互踢、Token过期）
const handleLinkState = async (eventData: RTMEvents.LinkStateEvent) => {
  const { currentState, reasonCode } = eventData;

  // 处理互踢
  if (currentState === "FAILED" && reasonCode === "SAME_UID_LOGIN") {
    showKickDialog.value = true;
  }

  // 处理 Token 过期
  if (
    currentState === "FAILED" &&
    (reasonCode === "INVALID_TOKEN" || reasonCode === "TOKEN_EXPIRED")
  ) {
    try {
      await rtmStore.rtmLogin();
    } catch (error) {
      console.error("Token refresh failed:", error);
    }
  }
};

// 注册监听器
const registerListeners = () => {
  if (isListenerRegistered.value) return;
  if (!rtmStore.checkRtmStatus()) return;

  // 1. 注册私有消息监听（全局生命周期）
  chatStore.registerPrivateMessageListener();

  // 2. 注册 linkState 监听（处理互踢/Token过期）
  rtmStore.registerLinkStateListener(handleLinkState);

  isListenerRegistered.value = true;
};

// 监听 RTM 登录状态
watch(
  () => rtmStore.isLoggedIn,
  (isLoggedIn) => {
    if (isLoggedIn) {
      registerListeners();
    }
  },
);

onMounted(() => {
  if (route.path !== "/") {
    registerListeners();
  }
});

onUnmounted(() => {
  if (isListenerRegistered.value) {
    chatStore.unregisterPrivateMessageListener();
    rtmStore.unregisterLinkStateListener(handleLinkState);
  }
});

const handleRelogin = async () => {
  try {
    await rtmStore.rtmLogin();
    showKickDialog.value = false;
  } catch (error) {
    console.error("重新登录失败:", error);
  }
};

const handleDismiss = () => {
  showKickDialog.value = false;
  router.push("/");
};
</script>
```

**架构**：

- ✅ **全局组件**：在 App.vue 中引入，伴随应用生命周期
- ✅ **集中处理**：所有全局事件（互踢、Token 过期、私聊监听）在一个组件中管理
- ✅ **自动清理**：组件卸载时自动清理所有监听器

### 4.4 Chat Store 管理业务逻辑

**位置**：`stores/chat.ts`

```typescript
// stores/chat.ts
import { defineStore } from "pinia";
import type { Message } from "../types/chat";
import { useUserStore } from "./user";
import { useRtmStore } from "./rtm";

export const useChatStore = defineStore("chat", {
  state: () => ({
    privateMessages: {} as Record<string, Message[]>,
    channelMessages: {} as Record<string, Message[]>,
    unreadCounts: {} as Record<string, number>,
    currentChannelId: null as string | null,
  }),

  actions: {
    // 业务方法：发送消息
    async sendMessage(
      targetId: string,
      content: string,
      mode: "private" | "channel",
    ): Promise<void> {
      const rtmStore = useRtmStore();
      const userStore = useUserStore();

      if (mode === "private") {
        // 调用 RTM Store 发送
        await rtmStore.sendPrivateMessage(targetId, content);

        // 更新本地状态
        const msg: Message = {
          id: `${Date.now()}-${Math.random()}`,
          senderId: userStore.userId,
          senderName: "Me",
          content,
          timestamp: Date.now(),
        };
        this.addPrivateMessage(targetId, msg);
      } else {
        await rtmStore.sendChannelMessage(targetId, content);
        // 频道消息通过监听器自动添加
      }
    },

    // 业务方法：打开频道聊天
    async openChannelChat(channelId: string): Promise<void> {
      const rtmStore = useRtmStore();

      // 1. 注册监听器
      this.registerChannelMessageListener();

      // 2. 订阅频道
      await rtmStore.subscribeChannel(channelId);

      // 3. 记录状态
      this.currentChannelId = channelId;
    },

    // 业务方法：关闭聊天
    async closeChat(mode: "private" | "channel"): Promise<void> {
      if (mode === "channel" && this.currentChannelId) {
        const rtmStore = useRtmStore();

        // 先取消监听器
        this.unregisterChannelMessageListener();

        // 取消订阅频道
        await rtmStore.unsubscribeChannel(this.currentChannelId);

        this.currentChannelId = null;
      }
    },

    // 消息监听器注册
    registerPrivateMessageListener() {
      const rtmStore = useRtmStore();
      rtmStore.registerMessageListener(handleUserMessage);
    },

    unregisterPrivateMessageListener() {
      const rtmStore = useRtmStore();
      rtmStore.unregisterMessageListener(handleUserMessage);
    },

    registerChannelMessageListener() {
      const rtmStore = useRtmStore();
      rtmStore.registerMessageListener(handleChannelMessage);
    },

    unregisterChannelMessageListener() {
      const rtmStore = useRtmStore();
      rtmStore.unregisterMessageListener(handleChannelMessage);
    },
  },
});

// 消息处理器（供 RTM Store 回调）
export const handleUserMessage = (eventData: any) => {
  const chatStore = useChatStore();
  const { publisher, message, channelType } = eventData;

  if (channelType === "USER") {
    const msg: Message = {
      id: `${Date.now()}-${Math.random()}`,
      senderId: publisher,
      senderName: publisher,
      content: message,
      timestamp: Date.now(),
    };
    chatStore.addPrivateMessage(publisher, msg);
    chatStore.incrementUnread(publisher);
  }
};

export const handleChannelMessage = (eventData: any) => {
  const chatStore = useChatStore();
  const userStore = useUserStore();
  const { publisher, message, channelType, channelName } = eventData;

  if (channelType === "MESSAGE") {
    const senderName = publisher === userStore.userId ? "Me" : publisher;
    const msg: Message = {
      id: `${Date.now()}-${Math.random()}`,
      senderId: publisher,
      senderName,
      content: message,
      timestamp: Date.now(),
    };
    chatStore.addChannelMessage(channelName, msg);
  }
};
```

**好处**：

- ✅ **业务封装**：UI 层不需要知道 RTM 的存在
- ✅ **状态管理**：统一管理消息状态（privateMessages, channelMessages）
- ✅ **逻辑复用**：业务方法可以在多个组件中复用

---

## 5. 防止多端互踢的最佳实践

### 5.1 问题根源

**互踢原因**：

- 每个声网签发的 AppId 下，同一 `userId` 在多个设备/浏览器标签页登录
  - App 初始化页面被执行多次，每次用同一个 userId 创建新的 RTM 实例并登录
  - App 各组件都调用了 rtm login，可能存在同实例在本地多次同时执行 login
- RTM Server 默认只保留最新登录的连接

### 5.2 解决方案

#### 方案 1：单例模式（推荐）

```typescript
// ✅ 正确：全局单例
let globalRtmClient: RTM | null = null;

export function initRtm(appId: string, userId: string): RTM {
  if (globalRtmClient) {
    console.log("RTM client already exists, reusing...");
    return globalRtmClient;
  }
  globalRtmClient = new RTM(appId, userId);
  return globalRtmClient;
}

// ❌ 错误：每次都创建新实例
export function initRtm(appId: string, userId: string): RTM {
  return new RTM(appId, userId); // 可能导致互踢！
}
```

#### 方案 2：检测并处理 SAME_UID_LOGIN

```vue
<script setup lang="ts">
import type { RTMEvents } from "agora-rtm";

const router = useRouter();
const rtmStore = useRtmStore();

const handleLinkState = async (eventData: RTMEvents.LinkStateEvent) => {
  if (eventData.currentState === "FAILED") {
    if (eventData.reasonCode === "SAME_UID_LOGIN") {
      // 显示对话框让用户选择
      showKickDialog.value = true;
    }
  }
};

const handleRelogin = async () => {
  // 策略 A：保留当前设备，重新登录
  await rtmStore.rtmLogin();
  showKickDialog.value = false;
};

const handleDismiss = () => {
  // 策略 B：保留新设备，退出当前设备
  showKickDialog.value = false;
  router.push("/");
};
</script>
```

---

## 6. Electron 特殊配置

### 6.1 主进程与渲染进程

Electron 应用分为两个进程：

- **主进程（Main Process）**：运行 Node.js，负责窗口管理、系统交互
- **渲染进程（Renderer Process）**：运行浏览器环境，负责 UI 渲染

**RTM SDK 仅在渲染进程中使用**，主进程不需要引入 RTM 相关代码。

### 6.2 开发模式启动

Electron 项目需要两个终端同时运行：

```bash
# 终端 1：启动 Vite 开发服务器
npm run dev

# 终端 2：启动 Electron
NODE_ENV=development npm run electron
```

或使用快捷命令：

```bash
npm run electron:dev
```

### 6.3 环境变量配置

Electron 使用 Vite 构建，环境变量需要使用 `VITE_` 前缀：

```bash
# .env
VITE_APP_ID=your_app_id
VITE_APP_CERT=your_app_cert
```

在代码中使用：

```typescript
const appId = import.meta.env.VITE_APP_ID;
```

### 6.4 路由配置

Electron Vue 使用 `vue-router` 进行路由管理：

```typescript
// src/router/index.ts
import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", component: () => import("../pages/Login.vue") },
    { path: "/home", component: () => import("../pages/Home.vue") },
    { path: "/message", component: () => import("../pages/Message.vue") },
    { path: "/more", component: () => import("../pages/More.vue") },
  ],
});

export default router;
```

**注意**：Electron 应用使用 `createWebHashHistory()` 而不是 `createWebHistory()`。

### 6.5 状态管理

使用 Pinia 进行状态管理

```typescript
// src/stores/rtm.ts
import { defineStore } from "pinia";

export const useRtmStore = defineStore("rtm", {
  state: () => ({
    // ...
  }),
  actions: {
    // ...
  },
});
```

---

## 7. 使用示例

### 7.1 App.vue - 主应用

```vue
<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Navbar from "./components/Navbar.vue";
import GlobalEventHandler from "./components/GlobalEventHandler.vue";

const route = useRoute();
const showNavbar = computed(() => route.path !== "/");
</script>

<template>
  <div>
    <Navbar v-if="showNavbar" />
    <main :style="{ marginLeft: showNavbar ? '200px' : '0' }">
      <router-view />
    </main>
    <GlobalEventHandler />
  </div>
</template>
```

### 7.2 GlobalEventHandler - 全局事件处理

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useRtmStore } from "../stores/rtm";
import { useChatStore } from "../stores/chat";
import type { RTMEvents } from "../stores/rtm";

const router = useRouter();
const route = useRoute();
const showKickDialog = ref(false);
const isListenerRegistered = ref(false);

const rtmStore = useRtmStore();
const chatStore = useChatStore();

const handleLinkState = async (eventData: RTMEvents.LinkStateEvent) => {
  if (
    eventData.currentState === "FAILED" &&
    eventData.reasonCode === "SAME_UID_LOGIN"
  ) {
    showKickDialog.value = true;
  }
  // Token 过期处理
  if (
    eventData.currentState === "FAILED" &&
    eventData.reasonCode === "TOKEN_EXPIRED"
  ) {
    await rtmStore.rtmLogin();
  }
};

const registerListeners = () => {
  if (isListenerRegistered.value) return;
  if (!rtmStore.checkRtmStatus()) return;

  chatStore.registerPrivateMessageListener();
  rtmStore.registerLinkStateListener(handleLinkState);
  isListenerRegistered.value = true;
};

watch(
  () => rtmStore.isLoggedIn,
  (isLoggedIn) => {
    if (isLoggedIn) registerListeners();
  },
);

onMounted(() => {
  if (route.path !== "/") registerListeners();
});

onUnmounted(() => {
  if (isListenerRegistered.value) {
    chatStore.unregisterPrivateMessageListener();
    rtmStore.unregisterLinkStateListener(handleLinkState);
  }
});
</script>
```

### 7.3 Login - 登录页

```vue
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";
import { useAppStore } from "../stores/app";

const router = useRouter();
const userStore = useUserStore();
const appStore = useAppStore();
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;

  try {
    await appStore.login();
    await router.push("/home");
  } catch (err) {
    console.error("Login failed:", err);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="handleLogin">
    <input v-model="userStore.userId" />
    <button type="submit" :disabled="loading">Login</button>
  </form>
</template>
```

---

### 5.4 Message 页 - 使用 Chat Store

```vue
<!-- src/pages/Message.vue -->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";
import { useChatStore } from "../stores/chat";
import { useRtmStore } from "../stores/rtm";
import ChatDrawer from "../components/ChatDrawer.vue";
import ClassroomList from "../components/ClassroomList.vue";
import TeacherList from "../components/TeacherList.vue";

const router = useRouter();
const userStore = useUserStore();
const chatStore = useChatStore();
const rtmStore = useRtmStore();

const drawerState = ref({
  isOpen: false,
  mode: "private" as "private" | "channel",
  targetId: "",
  targetName: "",
});

onMounted(() => {
  // 检查 RTM 状态
  if (!rtmStore.checkRtmStatus()) {
    router.push("/");
  }
});

const handlePrivateChatClick = (teacher: any) => {
  // 打开私聊（清零未读数）
  chatStore.openPrivateChat(teacher.userId);

  drawerState.value = {
    isOpen: true,
    mode: "private",
    targetId: teacher.userId,
    targetName: teacher.name,
  };
};

const handleClassroomClick = async (classroom: any) => {
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

    drawerState.value = { ...drawerState.value, isOpen: false };
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
      drawerState.value.mode,
    );
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};
</script>

<template>
  <div class="message-container">
    <ClassroomList @classroom-click="handleClassroomClick" />
    <TeacherList @teacher-click="handlePrivateChatClick" />
    <ChatDrawer
      :state="drawerState"
      :current-user-id="userStore.userId"
      @close="handleCloseDrawer"
      @send-message="handleSendMessage"
    />
  </div>
</template>
```

**注意**：

- ✅ UI 层不直接调用 RTM API
- ✅ 所有操作通过 Chat Store 完成
- ✅ Chat Store 内部调用 RTM Store

### 5.5 ChatDrawer - 纯展示组件

```vue
<!-- src/components/ChatDrawer.vue -->
<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import { useChatStore } from "../stores/chat";

interface Props {
  state: {
    isOpen: boolean;
    mode: "private" | "channel";
    targetId: string;
    targetName: string;
  };
  currentUserId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  sendMessage: [content: string];
}>();

const chatStore = useChatStore();
const inputValue = ref("");
const messagesEndRef = ref<HTMLDivElement | null>(null);

const messages = computed(() => {
  if (props.state.mode === "private") {
    return chatStore.privateMessages[props.state.targetId] || [];
  } else {
    return chatStore.channelMessages[props.state.targetId] || [];
  }
});

// 自动滚动到底部
watch(
  messages,
  async () => {
    await nextTick();
    messagesEndRef.value?.scrollIntoView({ behavior: "smooth" });
  },
  { deep: true },
);

const handleSend = () => {
  if (!inputValue.value.trim()) return;
  emit("sendMessage", inputValue.value.trim());
  inputValue.value = "";
};
</script>

<template>
  <div v-if="state.isOpen" class="chat-drawer-overlay" @click="emit('close')">
    <div class="chat-drawer" @click.stop>
      <div class="chat-drawer-header">
        <h3>{{ state.targetName }}</h3>
        <button @click="emit('close')" class="close-button">×</button>
      </div>

      <div class="chat-drawer-messages">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="[
            'message',
            msg.senderId === currentUserId ? 'sent' : 'received',
          ]"
        >
          <div class="message-sender">{{ msg.senderName }}</div>
          <div class="message-content">{{ msg.content }}</div>
        </div>
        <div ref="messagesEndRef" />
      </div>

      <div class="chat-drawer-input">
        <input
          v-model="inputValue"
          placeholder="Type a message..."
          @keyup.enter="handleSend"
        />
        <button @click="handleSend">Send</button>
      </div>
    </div>
  </div>
</template>
```

**注意**：

- ✅ 纯展示组件，不包含任何 RTM 逻辑
- ✅ 通过 props 接收状态，通过 emit 触发事件
- ✅ 从 Chat Store 读取消息状态

### 5.6 Navbar - 登出处理

```vue
<!-- src/components/Navbar.vue -->
<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { useAppStore } from "../stores/app";

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();

const navItems = [
  { path: "/home", label: "Home", icon: "🏠" },
  { path: "/message", label: "Message", icon: "💬" },
  { path: "/more", label: "More", icon: "⋯" },
];

const handleLogout = async () => {
  try {
    // 调用 App Store 的 logout 方法
    await appStore.logout();
    await router.push("/");
  } catch (error) {
    console.error("Logout failed:", error);
    await router.push("/");
  }
};
</script>

<template>
  <nav class="navbar">
    <div class="navbar-menu">
      <a
        v-for="item in navItems"
        :key="item.path"
        @click.prevent="router.push(item.path)"
        :class="{ active: route.path === item.path }"
      >
        <span class="navbar-icon">{{ item.icon }}</span>
        <span class="navbar-label">{{ item.label }}</span>
      </a>
    </div>

    <div class="navbar-footer">
      <button @click="handleLogout" class="logout-button">
        <span class="navbar-icon">🚪</span>
        <span class="navbar-label">Logout</span>
      </button>
    </div>
  </nav>
</template>
```

**注意**：

- ✅ UI 层只调用 App Store 的 logout 方法
- ✅ App Store 内部处理所有清理逻辑（取消监听、登出 RTM、清理存储）

---

## 8. 常见问题

### Q1: Electron 和 Web 应用有什么区别？

Electron 应用运行在桌面环境，但渲染进程本质上是一个浏览器环境。RTM SDK 的使用方式与 Web 应用完全相同。

### Q2: 为什么需要两个终端启动？

- 终端 1 运行 Vite 开发服务器，提供热更新
- 终端 2 运行 Electron，加载 Vite 服务器的内容

生产环境只需要一个命令：`npm run build && npm run electron`

### Q3: 为什么使用 createWebHashHistory？

Electron 应用使用 `file://` 协议加载本地文件，`createWebHistory()` 需要服务器支持。`createWebHashHistory()` 使用 URL hash 进行路由，不需要服务器配置。

### Q4: 如何调试 Electron 应用？

Electron 渲染进程可以使用 Chrome DevTools 调试，快捷键：`Ctrl+Shift+I`（Windows/Linux）或 `Cmd+Option+I`（macOS）

### Q5: 为什么私有消息和频道消息要分开监听？

基于不同的业务需求和生命周期：

- **私有消息**：用户随时可能收到，需要全局监听以实时更新未读数
- **频道消息**：仅在用户主动进入频道时才需要，按需监听节省资源

这种设计符合用户预期，也更高效。

### Q6: 如何避免多端互踢？

三个关键点：

1. 使用单例模式，全局只创建一个 RTM 实例
2. **监听 `linkState` 事件，检测 `SAME_UID_LOGIN`**
3. 页面切换时复用实例，不要重复登录（使用 rtmStore 即可保证）

### Q7: 与 Nuxt 项目的主要区别？

| 特性         | Electron Vue               | Nuxt 3                     |
| ------------ | -------------------------- | -------------------------- |
| **运行环境** | 桌面应用（Electron）       | Web 应用（浏览器）         |
| **路由模式** | `createWebHashHistory()`   | 文件系统路由               |
| **SSR**      | 无需考虑                   | `ssr: false` 全局禁用      |
| **环境变量** | `VITE_*` 前缀              | `VITE_*` 前缀              |
| **状态管理** | Pinia (`defineStore`)      | Pinia (`defineStore`)      |
| **组件语法** | Vue SFC (`<script setup>`) | Vue SFC (`<script setup>`) |

---

## 9. 总结

### 9.1 架构优势

| 优势             | 说明                                                                 |
| ---------------- | -------------------------------------------------------------------- |
| **单例管理**     | 全局唯一 RTM 实例，避免重复登录和互踢                                |
| **分层监听**     | 私有消息全局监听，频道消息按需监听                                   |
| **事件解耦**     | EventEmitter 解耦 SDK 和业务，灵活订阅                               |
| **集中处理**     | 所有 RTM SDK 事件在 `rtm-events.ts` 中统一注册，由 EventEmitter 派发 |
| **状态同步**     | Pinia 跨组件共享消息状态                                             |
| **生命周期清晰** | 组件级别的事件订阅，自动清理                                         |
| **资源优化**     | 按需监听频道消息，节省资源                                           |
| **易于测试**     | 业务逻辑和 SDK 分离，便于 Mock 测试                                  |

### 9.2 最佳实践清单

**RTM 实例管理**：

- ✅ 使用单例模式管理 RTM 实例
- ✅ 在 `shared/rtm/rtm-events.ts` 中注册全局事件监听器
- ✅ 页面切换时复用实例，不要重复登录
- ✅ **使用 GlobalEventHandler 组件全局监听 `linkState` 事件处理互踢**
- ✅ 在 App.vue 中引入 GlobalEventHandler，所有页面自动生效
- ✅ 收到掉线通知时，提供用户选择："我知道了，回到首页" 或 "再次登录"

**消息监听策略**：

- ✅ 私有消息在登录成功后立即注册全局监听
- ✅ 频道消息订阅频道时按需监听
- ✅ 组件卸载时取消事件订阅，防止内存泄漏
- ✅ 使用不同的处理函数区分消息类型

### 9.3 架构图总结

```
登录流程：
Login Page → rtm 封装层: initRtm() / 注册全局监听 → 业务层: 注册私有消息监听 / 注册互踢掉线监听 → Home Page

全局互踢处理：
GlobalEventHandler (App.vue) → 监听 linkState → 检测 SAME_UID_LOGIN → 显示对话框

私有消息流程：
RTM Server → SDK → SDK Events → EventEmitter → handleUserMessage → Chat Store → UI

频道消息流程：
打开频道 → 注册频道消息监听 → subscribeChannel() →
RTM Server → SDK → SDK Events → EventEmitter → handleChannelMessage → Chat Store → UI →
关闭频道 → 取消监听 → unsubscribeChannel()
```

---

**文档版本**：v1.0  
**最后更新**：2026-02-26  
**维护者**：AI Agent
