# PROJECT_STATE.md（项目状态记录）

## 目标

- 为 Next.js demo 实现完整的 RTM 聊天功能
- 支持 Teacher 和 Student 两种角色
- 实现私聊和频道消息功能
- 使用 Zustand 状态管理，抽屉组件展示聊天界面

## 上下文总结

- Next.js 14 + App Router + TypeScript
- 使用 Zustand 进行状态管理（chat + user）
- Mock 数据：5 个老师，3 个课程，5 个学生
- 支持 Teacher 和 Student 两种角色切换
- 私聊消息显示未读数，频道消息不显示
- 抽屉从右侧滑出，离开频道时取消订阅
- RTM 事件通过 EventEmitter 统一管理
- 当前运行时：Node.js v22.21.1，包管理器：npm

## 注意点

- RTM 事件监听使用 EventEmitter 模式，在 Next.js 层处理
- 使用 Zustand 管理消息状态和用户状态，确保 UI 响应式更新
- 私聊消息按 userId 分组，频道消息按 channelId 分组
- 抽屉打开时清零未读数，离开频道时取消订阅
- 消息仅存储在内存中，刷新页面清空
- 所有导入使用 TypeScript 标准（不带扩展名）
- **重要**：事件回调函数中必须使用 `store.getState()` 而不是 Hooks
- Next.js 页面必须标记 `'use client'` 和 `export const dynamic = 'force-dynamic'`

## 待办（带复选框）

### Next.js Demo（已完成）

- [x] 安装 zustand 依赖
- [x] 创建类型定义（User, Classroom, Message）
- [x] 创建 Mock 数据（5 老师 + 3 课程 + 5 学生）
- [x] 创建 Zustand store（chat + user）
- [x] 创建 TeacherList 组件（含未读徽章）
- [x] 创建 StudentList 组件（含未读徽章）
- [x] 创建 ClassroomList 组件
- [x] 创建 ChatDrawer 组件（私聊 + 频道模式）
- [x] 更新 Dashboard 页面（集成 RTM + 组件）
- [x] 扩展 shared/rtm 功能（EventEmitter + 频道订阅）
- [x] 更新登录页面（添加 userRole 单选按钮）
- [x] 修复 useEffect 重复执行问题
- [x] 修复 Hook 调用错误（使用 getState()）
- [x] 更新 AGENTS.md 文档
- [x] **实现互踢处理逻辑**
- [x] **添加全局导航栏（Next.js demo）**

### Nuxt Demo（对齐 Next.js 功能）

- [x] 1. 更新 package.json（添加 agora-rtm、@pinia/nuxt 等依赖）
- [x] 2. 创建类型定义（types/user.ts, types/chat.ts）
- [x] 3. 创建 Mock 数据（mocks/data.ts）
- [x] 4. 创建 Pinia stores（stores/chat.ts, stores/user.ts）
- [x] 5. 创建登录页面（pages/index.vue - 含角色选择）
- [x] 6. 创建 Home 页面（pages/home.vue）
- [x] 7. 创建 Message 页面（pages/message.vue）
- [x] 8. 创建 More 页面（pages/more.vue）
- [x] 9. 创建 Navbar 组件（components/Navbar.vue）
- [x] 10. 创建 ChatDrawer 组件（components/ChatDrawer.vue）
- [x] 11. 创建 TeacherList 组件（components/TeacherList.vue）
- [x] 12. 创建 StudentList 组件（components/StudentList.vue）
- [x] 13. 创建 ClassroomList 组件（components/ClassroomList.vue）
- [x] 14. 创建 GlobalEventHandler 组件（components/GlobalEventHandler.vue）
- [x] 15. 更新 app.vue（集成布局和全局组件）
- [x] 16. 更新 nuxt.config.ts（配置 Pinia、环境变量等）
- [x] 17. 创建测试文件
- [x] 18. 修复导入路径（shared 目录相对路径）
- [x] 19. 创建 tsconfig.json
- [ ] 20. 提交代码
- [ ] 21. 安装依赖并测试运行
- [ ] 22. 用户测试验证功能

## 已完成/变更摘要（PR 可直接使用）

### 本次会话改动（未提交）

**变更摘要**：重构 RTM 事件管理，添加用户角色系统

**影响范围**：

- demos/nextjs/（新增 user store, StudentList 组件，重构 Dashboard）
- demos/shared/rtm/（添加 EventEmitter 事件管理）
- 登录页面（添加角色选择）

**关键变更**：

1. **用户系统**：

   - 新增 `types/user.ts` 定义 User 类型（支持 teacher/student 角色）
   - 新增 `store/user.ts` 管理用户状态（userId, role）
   - 登录页面添加角色单选按钮（Teacher / Student）

2. **组件扩展**：

   - 新增 `StudentList` 组件（与 TeacherList 对应）
   - 更新 `TeacherList` 使用统一的 User 类型
   - Dashboard 根据角色显示不同列表

3. **RTM 事件管理重构**：

   - shared/rtm 添加 `rtmEventEmitter` (EventEmitter)
   - 统一事件管理：message, linkState 等
   - 修复 Hook 调用错误：`handleMessage` 使用 `getState()`

4. **性能优化**：

   - 修复 useEffect 依赖问题，确保只执行一次
   - 事件监听器使用 EventEmitter 模式，避免重复注册

5. **Mock 数据**：
   - 添加 5 个学生数据（MOCK_STUDENTS）
   - 统一使用 User 类型

**技术细节**：

- 事件回调函数中使用 `store.getState()` 避免 Hook 规则错误
- EventEmitter 模式解耦 RTM 事件和组件
- Zustand store 分离：chat store + user store
- 类型安全：User 类型统一 teacher 和 student

**验证方式**：

```bash
cd demos/nextjs
npm run dev
```

测试：

- 登录时选择角色（Teacher / Student）
- Teacher 看到 Student List + Classroom Channels
- Student 看到 Teacher List + Classroom Channels
- 私聊消息未读计数
- 频道消息订阅/取消订阅

**已知问题**：

- 构建时会有预渲染警告（agora-rtm 依赖浏览器环境），不影响功能

## 会话评审记录（每个 Session 追加一段）

### Session 2026-01-27-01

- 对话评审结论：重构完成
- 变更评审结论：代码已完成，等待用户测试
- 评审备注：
  - 添加用户角色系统（Teacher/Student）
  - 重构 RTM 事件管理（EventEmitter）
  - 修复 Hook 调用错误和 useEffect 依赖问题
  - 新增 StudentList 组件
  - 需要用户运行 `npm run dev` 测试验证

### Session 2026-01-27-02 (之前)

- 对话评审结论：基本完成
- 变更评审结论：代码已完成，等待用户测试
- 评审备注：
  - 所有组件和功能已实现
  - 类型检查通过
  - 构建有预渲染警告但不影响功能（开发模式正常）
