# PROJECT_STATE.md（项目状态记录）

## 目标

- 为 Next.js demo 实现完整的 RTM 聊天功能
- 包含老师列表（私聊 + 未读消息）和课程频道列表
- 使用 Zustand 状态管理，抽屉组件展示聊天界面

## 上下文总结

- Next.js 14 + App Router + TypeScript
- 使用 Zustand 进行状态管理（已安装）
- Mock 数据：5 个老师，3 个课程
- 学生 uid = 登录的 username
- 私聊消息显示未读数，频道消息不显示
- 抽屉从右侧滑出，离开频道时取消订阅
- RTM 事件在 Next.js 层处理，不修改 shared 层核心逻辑
- 当前运行时：Node.js v22.21.1，包管理器：npm
- **重要**：Next.js 构建会有预渲染警告（agora-rtm 需要浏览器环境），但不影响开发和运行

## 注意点

- RTM 事件监听在 Next.js 组件中完成，保持 shared 层兼容性
- 使用 Zustand 管理消息状态，确保 UI 响应式更新
- 私聊消息按 teacherUid 分组，频道消息按 channelId 分组
- 抽屉打开时清零未读数，离开频道时取消订阅
- 消息仅存储在内存中，刷新页面清空
- 所有导入使用 TypeScript 标准（不带扩展名）
- Next.js 页面必须标记 `'use client'` 和 `export const dynamic = 'force-dynamic'`

## 待办（带复选框）

- [x] 安装 zustand 依赖
- [x] 创建类型定义（Teacher, Classroom, Message）
- [x] 创建 Mock 数据（5 老师 + 3 课程）
- [x] 创建 Zustand store（消息 + 未读计数）
- [x] 创建 TeacherList 组件（含未读徽章）
- [x] 创建 ClassroomList 组件
- [x] 创建 ChatDrawer 组件（私聊 + 频道模式）
- [x] 更新 Dashboard 页面（集成 RTM + 组件）
- [x] 扩展 shared/rtm 功能（频道订阅/取消订阅/发送消息）
- [x] 更新登录页面（保存 username）
- [x] 修复导入扩展名（全部改为 TS 标准）
- [x] 更新 AGENTS.md 文档
- [x] 配置 Next.js（webpack externals + dynamic）
- [ ] 用户测试验证功能

## 已完成/变更摘要（PR 可直接使用）

- 变更摘要：为 Next.js demo 实现完整的 RTM 聊天功能
- 影响范围：
  - demos/nextjs/（新增 store, types, mocks, components 目录，更新页面）
  - demos/shared/rtm/（扩展频道订阅和消息发送功能）
  - AGENTS.md（更新导入规则说明）
- 关键变更：
  - 使用 Zustand 管理聊天状态（私聊消息、频道消息、未读计数）
  - 实现老师列表（5 个）和课程列表（3 个）
  - 实现聊天抽屉组件（支持私聊和频道两种模式）
  - RTM 事件监听在 Next.js 层处理，保持 shared 层兼容性
  - 扩展 shared/rtm 功能：subscribeChannel, unsubscribeChannel, sendChannelMessage, sendMessageToUser
  - 修复所有导入为 TypeScript 标准（不带扩展名）
  - 配置 Next.js 支持客户端专用 SDK
- 验证方式：`cd demos/nextjs && npm run dev`，测试登录、私聊、频道消息功能
- 风险与回滚：新增功能，不影响其他 demo 项目
- 已知问题：构建时会有预渲染警告（agora-rtm 依赖浏览器环境），不影响功能

## 会话评审记录（每个 Session 追加一段）

### Session 2026-01-27-01

- 对话评审结论：基本完成
- 变更评审结论：代码已完成，等待用户测试
- 评审备注：
  - 所有组件和功能已实现
  - 类型检查通过
  - 构建有预渲染警告但不影响功能（开发模式正常）
  - 需要用户运行 `npm run dev` 测试验证
