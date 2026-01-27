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
    ├── vue/           # Electron + Vue3
    └── react/         # Electron + React
```

## 功能说明

每个 demo 包含：

- **登录页面**：一个 Login 按钮，点击后调用共享的 `mockLogin` 函数
- **Dashboard 页面**：显示 "Hello World"
- **单元测试**：使用 Vitest 进行组件和功能测试

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
# 终端 2：启动 Electron
NODE_ENV=development npm run electron
# 运行测试
npm test
```

### 9. Electron + React

```bash
cd electron/react
npm install
# 终端 1：启动 Vite 开发服务器
npm run dev
# 终端 2：启动 Electron
NODE_ENV=development npm run electron
# 运行测试
npm test
```

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
- **Vitest**: 快速的单元测试框架

## 开发建议

1. 所有项目都使用了共享的 `mockLogin` 函数，你可以在 `demos/shared/utils/auth.ts` 中实现真实的登录逻辑
2. 使用 `npm test` 运行测试，使用 `npm run test:watch` 进入监听模式
3. 共享工具可以根据需要扩展，所有项目都可以直接引用
