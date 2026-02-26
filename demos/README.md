# 前端框架 Demo 合集

这是一个包含多个前端框架的 demo 项目合集，每个 demo 都实现了简单的登录和主页功能。

## 项目结构

```
demos/
├── shared/            # 共享工具和函数
│   ├── utils/
│   │   ├── auth.ts       # 认证相关工具（mockLogin, mockLogout, isAuthenticated）
│   │   ├── storage.ts    # LocalStorage 封装
│   │   └── validator.ts  # 表单验证工具
│   └── test-utils/       # 测试工具
├── vue/
│   ├── vite/          # Vue3 + Vite
│   └── webpack/       # Vue3 + Webpack
├── react/
│   ├── vite/          # React + Vite
│   └── webpack/       # React + Webpack
├── nuxt/              # Nuxt 3
├── nextjs/            # Next.js 14
├── h5/                # H5 (Vite + Vanilla TS)
└── electron/
    ├── vue/           # Electron + Vue3 + Vite + Pinia
    └── react/         # Electron + React + Vite + Zustand
```

## 功能说明

### 基础 Demo（Vue/React/Nuxt/Next.js/H5）

每个基础 demo 包含：

- **登录页面**：一个 Login 按钮，点击后调用共享的 `mockLogin` 函数
- **Dashboard 页面**：显示 "Hello World"
- **单元测试**：使用 Vitest 进行组件和功能测试

### Electron Demo（electron/vue, electron/react）

Electron demo 包含完整的 RTM SDK 集成功能：

- **用户登录**：支持 Teacher/Student 角色切换，使用 RTM 登录
- **私聊消息**：Teacher List / Student List，点对点消息
- **频道消息**：Classroom Channels，频道订阅和消息
- **未读消息计数**：仅私聊消息显示未读数
- **聊天抽屉**：右侧滑出的聊天界面
- **互踢处理**：同账号多设备登录时的提示和处理
- **全局导航栏**：Home / Message / More 页面切换
- **响应式设计**：适配不同屏幕尺寸

## 共享工具

所有项目共享以下工具函数（位于 `demos/shared/` 目录）：

### 认证工具 (auth.ts)

- `mockLogin(username, password)` - 模拟登录（1 秒延迟）
- `mockLogout()` - 模拟登出
- `isAuthenticated()` - 检查是否已认证

### 存储工具 (storage.ts)

- `storage.set(key, value)` - 存储数据
- `storage.get(key)` - 获取数据
- `storage.remove(key)` - 删除数据
- `storage.clear()` - 清空所有数据

### 验证工具 (validator.ts)

- `isValidEmail(email)` - 验证邮箱格式
- `validatePassword(password)` - 验证密码强度
- `validateUsername(username)` - 验证用户名

## 快速开始

### 1. Vue3 + Vite

```bash
cd vue/vite
npm install
npm run dev      # 启动开发服务器
npm test         # 运行测试
```

访问：http://localhost:5173

### 2. Vue3 + Webpack

```bash
cd vue/webpack
npm install
npm run dev
npm test
```

访问：http://localhost:8080

### 3. React + Vite

```bash
cd react/vite
npm install
npm run dev
npm test
```

访问：http://localhost:5173

### 4. React + Webpack

```bash
cd react/webpack
npm install
npm run dev
npm test
```

访问：http://localhost:8081

### 5. Nuxt 3

```bash
cd nuxt
npm install
npm run dev
npm test
```

访问：http://localhost:3000

### 6. Next.js

```bash
cd nextjs
npm install
npm run dev
npm test
```

访问：http://localhost:3000

### 7. H5 (Vite + Vanilla TS)

```bash
cd h5
npm install
npm run dev
npm test
```

访问：http://localhost:5173

### 8. Electron + Vue3

```bash
cd electron/vue
npm install
# 终端 1：启动 Vite 开发服务器
npm run dev
# 终端 2：启动 Electron（等待终端 1 启动完成）
NODE_ENV=development npm run electron
# 运行测试
npm test
```

⚠️ **重要**：必须先启动 Vite 开发服务器，等待启动完成后再启动 Electron。

### 9. Electron + React

```bash
cd electron/react
npm install
# 终端 1：启动 Vite 开发服务器
npm run dev
# 终端 2：启动 Electron（等待终端 1 启动完成）
NODE_ENV=development npm run electron
# 运行测试
npm test
```

⚠️ **重要**：必须先启动 Vite 开发服务器，等待启动完成后再启动 Electron。

### 10. 共享工具测试

```bash
cd shared
npm install
npm test
```

## 运行所有测试

你可以创建一个脚本来运行所有项目的测试：

```bash
# 在 demos 目录下
for dir in vue/vite vue/webpack react/vite react/webpack nuxt nextjs h5 electron/vue electron/react shared; do
  echo "Testing $dir..."
  cd $dir && npm test && cd - || cd -
done
```

## 测试框架

所有项目使用 **Vitest** 作为测试框架：

- Vue 项目：使用 `@vue/test-utils` 进行组件测试
- React 项目：使用 `@testing-library/react` 进行组件测试
- H5 项目：使用 `@testing-library/dom` 进行 DOM 测试

## 技术栈

- **Vue3**: 渐进式 JavaScript 框架
- **React**: 用于构建用户界面的 JavaScript 库
- **Nuxt 3**: Vue.js 的服务端渲染框架
- **Next.js**: React 的服务端渲染框架
- **Vite**: 下一代前端构建工具
- **Webpack**: 模块打包工具
- **TypeScript**: JavaScript 的超集
- **Electron**: 跨平台桌面应用开发框架
- **Pinia**: Vue 官方推荐的状态管理库
- **Zustand**: React 轻量级状态管理库
- **Agora RTM SDK**: 实时消息服务
- **Vitest**: 快速的单元测试框架

## 开发建议

1. 所有项目都使用了共享的 `mockLogin` 函数，你可以在 `demos/shared/utils/auth.ts` 中实现真实的登录逻辑
2. 使用 `npm test` 运行测试，使用 `npm run test:watch` 进入监听模式
3. 共享工具可以根据需要扩展，所有项目都可以直接引用
4. Electron 项目需要配置环境变量（`.env` 文件），详见各项目的 README.md
5. Electron 项目集成了 Agora RTM SDK，需要有效的 App ID 和 App Certificate

## 环境变量配置

Electron 项目需要配置 Agora RTM 环境变量：

```bash
# 进入 Electron 项目目录
cd electron/vue  # 或 electron/react

# 复制环境变量示例文件
cp .env.example .env

# 编辑 .env 文件，填入你的 Agora App ID 和 App Certificate
# VITE_APP_ID=your_app_id_here
# VITE_APP_CERT=your_app_certificate_here
```

详细配置说明请参考：`demos/ENV_SETUP.md`

## 相关文档

- [环境变量配置指南](./ENV_SETUP.md)
- [RTM SDK 集成文档](../docs/RTM_INTEGRATION.md)
- [Electron Vue Demo README](./electron/vue/README.md)
- [Electron React Demo README](./electron/react/README.md)
