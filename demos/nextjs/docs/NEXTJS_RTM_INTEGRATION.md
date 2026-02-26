# Next.js 项目 RTM 集成文档

本文档说明 Next.js 项目集成 Agora RTM SDK 时的特殊配置和注意事项。

> 通用 RTM 集成架构、流程图、Store 设计、消息监听策略、防止多端互踢等内容请参考：[docs/RTM_INTEGRATION.md](../../../docs/RTM_INTEGRATION.md)

---

## 1. 目录结构

```
demos/nextjs/
├── app/
│   ├── layout.tsx                  # 根布局（集成 GlobalEventHandler 和 Navbar）
│   ├── page.tsx                    # 登录页
│   ├── home/page.tsx               # Home 页面
│   ├── message/page.tsx            # Message 页面（聊天功能）
│   ├── more/page.tsx               # More 页面
│   └── components/
│       ├── GlobalEventHandler.tsx  # 全局事件处理（互踢/Token过期/私聊监听）
│       ├── Navbar.tsx              # 全局导航栏
│       ├── ChatDrawer.tsx          # 聊天抽屉组件
│       ├── ClassroomList.tsx       # 教室列表组件
│       ├── TeacherList.tsx         # 教师列表组件
│       └── StudentList.tsx         # 学生列表组件
│
├── store/
│   ├── app.ts                      # 应用状态（登录/登出）
│   ├── rtm.ts                      # RTM 操作薄封装层
│   ├── chat.ts                     # 消息状态 + 消息处理器
│   ├── user.ts                     # 用户状态
│   └── mocks/                      # Mock 数据
│
├── next.config.js                  # Next.js 配置
├── tsconfig.json                   # TypeScript 配置
└── package.json                    # 项目依赖
```

---

## 2. Next.js 特殊配置

### 2.1 客户端组件标记

Agora RTM SDK 仅在客户端可用，所有使用 RTM 功能的组件必须添加 `'use client'` 指令：

```typescript
// app/page.tsx
'use client';

import { useAppStore } from '@/store/app';
// ...
```

**需要标记的文件**：

- `app/page.tsx` - 登录页
- `app/layout.tsx` - 根布局
- `app/home/page.tsx` - Home 页面
- `app/message/page.tsx` - Message 页面
- `app/components/GlobalEventHandler.tsx` - 全局事件处理
- `app/components/Navbar.tsx` - 导航栏
- `app/components/ChatDrawer.tsx` - 聊天抽屉

### 2.2 动态渲染配置

为避免 SSR 时访问浏览器 API 导致的错误，需要在页面中强制动态渲染：

```typescript
// app/page.tsx
'use client';

// 强制动态渲染，禁用静态生成
export const dynamic = 'force-dynamic';

export default function Login() {
  // ...
}
```

### 2.3 环境变量配置

Next.js 环境变量需要使用 `NEXT_PUBLIC_` 前缀才能在客户端访问：

```bash
# .env.local
NEXT_PUBLIC_APP_ID=your_app_id
NEXT_PUBLIC_APP_CERT=your_app_cert
```

在代码中使用：

```typescript
const appId = process.env.NEXT_PUBLIC_APP_ID;
```

### 2.4 路径别名配置

项目使用 `@/` 作为路径别名，在 `tsconfig.json` 中配置：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

使用示例：

```typescript
import { useAppStore } from '@/store/app';
import { useRtmStore } from '@/store/rtm';
```

---

## 3. 常见问题

### Q1: 为什么要使用 `'use client'` 指令？

Agora RTM SDK 依赖浏览器 API（如 WebSocket），无法在服务端运行。Next.js 默认使用 Server Components，必须显式标记为 Client Component。

### Q2: 为什么要使用 `force-dynamic`？

防止 Next.js 在构建时尝试预渲染页面，避免访问 `localStorage` 等浏览器 API 时报错。

### Q3: 环境变量为什么要加 `NEXT_PUBLIC_` 前缀？

Next.js 出于安全考虑，默认只在服务端暴露环境变量。添加 `NEXT_PUBLIC_` 前缀后，变量会被打包到客户端代码中。

---

## 4. 更多信息

- 分层架构设计：参考 [RTM_INTEGRATION.md - 2. APP 最佳实践架构](../../../docs/RTM_INTEGRATION.md#2-app-最佳实践架构)
- 消息监听策略：参考 [RTM_INTEGRATION.md - 2.3 消息监听策略](../../../docs/RTM_INTEGRATION.md#23-消息监听策略-)
- 流程图：参考 [RTM_INTEGRATION.md - 3. 流程图](../../../docs/RTM_INTEGRATION.md#3-流程图)
- Store 设计：参考 [RTM_INTEGRATION.md - 4. 关键设计决策](../../../docs/RTM_INTEGRATION.md#4-关键设计决策)
- 防止多端互踢：参考 [RTM_INTEGRATION.md - 5. 防止多端互踢的最佳实践](../../../docs/RTM_INTEGRATION.md#5-防止多端互踢的最佳实践)
- 使用示例：参考 [RTM_INTEGRATION.md - 7. 使用示例](../../../docs/RTM_INTEGRATION.md#7-使用示例)

---

**文档版本**：v1.0  
**最后更新**：2026-02-24
