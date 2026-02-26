# Electron Vue Demo

基于 Electron + Vue 3 + Vite + Pinia 的 RTM SDK Demo 项目。

## 技术栈

- **Electron**: 桌面应用框架
- **Vue 3**: UI 框架
- **TypeScript**: 类型安全
- **Vite**: 构建工具
- **Vue Router 4**: 路由管理
- **Pinia**: 状态管理
- **Agora RTM SDK**: 实时消息服务

## 功能特性

- ✅ 用户登录（支持 Teacher/Student 角色切换）
- ✅ 私聊消息（Teacher List / Student List）
- ✅ 频道消息（Classroom Channels）
- ✅ 未读消息计数（仅私聊）
- ✅ 聊天抽屉（右侧滑出）
- ✅ 互踢处理（同账号多设备登录）
- ✅ 全局导航栏
- ✅ 响应式设计

## 项目结构

```
demos/electron/vue/
├── src/
│   ├── components/          # 组件
│   │   ├── Navbar.vue       # 导航栏
│   │   ├── ChatDrawer.vue   # 聊天抽屉
│   │   ├── TeacherList.vue  # 教师列表
│   │   ├── StudentList.vue  # 学生列表
│   │   ├── ClassroomList.vue # 课堂列表
│   │   └── GlobalEventHandler.vue # 全局事件处理
│   ├── pages/               # 页面
│   │   ├── Login.vue        # 登录页
│   │   ├── Home.vue         # 主页
│   │   ├── Message.vue      # 消息页
│   │   └── More.vue         # 更多页
│   ├── stores/              # Pinia 状态管理
│   │   ├── user.ts          # 用户状态
│   │   └── chat.ts          # 聊天状态
│   ├── types/               # 类型定义
│   │   ├── user.ts
│   │   └── chat.ts
│   ├── mocks/               # Mock 数据
│   │   └── data.ts
│   ├── router/              # 路由配置
│   │   └── index.ts
│   ├── utils/               # 工具函数
│   │   └── env-polyfill.ts
│   ├── App.vue              # 根组件
│   └── main.ts              # 入口文件
├── main.js                  # Electron 主进程
├── package.json
├── vite.config.ts
├── .env.example             # 环境变量示例
├── README.md
└── docs/
    └── ELECTRON_RTM_INTEGRATION.md
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的 Agora App ID 和 App Certificate：

```env
VITE_APP_ID=your_app_id_here
VITE_APP_CERT=your_app_certificate_here
```

### 3. 开发模式

⚠️ **重要**：必须按顺序执行以下步骤

**步骤 1：启动 Vite 开发服务器（终端 1）**

```bash
npm run dev
```

等待 Vite 启动完成，看到类似输出：

```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

**步骤 2：启动 Electron（终端 2）**

```bash
NODE_ENV=development npm run electron
```

⚠️ **常见错误**：

- 如果看到 `ERR_FILE_NOT_FOUND`，说明 Vite 开发服务器未启动
- 解决方法：先在终端 1 运行 `npm run dev`，等待启动完成后再运行 Electron

### 4. 构建

```bash
npm run build
```

## 使用说明

### 登录

1. 输入 User ID（任意字符串）
2. 选择角色（Teacher 或 Student）
3. 点击 "Login to App"

### 私聊

- **Student 角色**：可以看到 Teacher List，点击教师头像开始私聊
- **Teacher 角色**：可以看到 Student List，点击学生头像开始私聊
- 未读消息会显示红色徽章

### 频道消息

- 点击 Classroom Channels 中的任意课堂
- 自动订阅频道并打开聊天抽屉
- 离开抽屉时自动取消订阅

### 互踢处理

- 当同一账号在其他设备登录时，会弹出提示框
- 可选择"我知道了"返回登录页，或"再次登录"重新连接

## 注意事项

1. **Electron 环境**：

   - 使用 BrowserRouter（而不是 HashRouter）
   - 主进程和渲染进程分离
   - 开发模式需要同时运行 Vite 和 Electron

2. **环境变量配置**：

   - Vite 项目使用 `VITE_` 前缀：`VITE_APP_ID`, `VITE_APP_CERT`
   - ⚠️ **重要**：需要在 vite.config.ts 中配置 `define: { "process.env": {} }` 支持 process.env
   - 渲染进程（浏览器环境）中 process 对象需要通过 Vite 注入

3. **依赖 Polyfill**：

   - ⚠️ **必需**：安装 `events` 包支持 EventEmitter（`npm install events`）
   - 浏览器环境需要 polyfill 才能使用 Node.js 的 EventEmitter
   - 详见：[docs/ELECTRON_RTM_INTEGRATION.md](./docs/ELECTRON_RTM_INTEGRATION.md)

4. **RTM SDK**：

   - 需要配置有效的 App ID 和 App Certificate
   - 消息仅存储在内存中，刷新页面会清空
   - 私聊消息显示未读数，频道消息不显示

5. **状态管理**：
   - 使用 Pinia 管理全局状态
   - 响应式数据自动更新视图

## 测试

```bash
# 运行测试
npm test

# 监听模式
npm run test:watch

# 类型检查
npm run type-check
```

## 相关文档

- [Electron RTM 集成配置](./docs/ELECTRON_RTM_INTEGRATION.md) - Electron 特殊配置说明
- [RTM SDK 集成文档](../../../docs/RTM_INTEGRATION.md) - 通用 RTM 集成说明
- [Agora RTM SDK 文档](https://docs.agora.io/cn/real-time-messaging/overview/product-overview)
- [Electron 文档](https://www.electronjs.org/docs/latest/)
- [Vue Router 文档](https://router.vuejs.org/)
- [Pinia 文档](https://pinia.vuejs.org/)

## License

MIT
