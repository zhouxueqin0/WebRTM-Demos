# Electron 项目 RTM 集成特殊配置

本文档说明 Electron 项目集成 Agora RTM SDK 时需要注意的特殊配置。

## 框架配置问题

### 1. process.env 支持

**问题**：Electron 渲染进程是浏览器环境，没有 Node.js 的 `process` 对象。

**解决方案**：

1. 在 `vite.config.ts` 中配置 `define`（基础配置）：

```typescript
export default defineConfig({
  define: {
    "process.env": {},
  },
});
```

2. 创建 `src/utils/env-polyfill.ts` 文件（⚠️ 关键步骤）：

```typescript
// Polyfill for process.env in browser environment
if (typeof process === "undefined") {
  (window as any).process = {
    env: {},
  };
}
```

3. 在 `src/main.ts` 中**最先导入** env-polyfill：

```typescript
import { createApp } from "vue";
import { createPinia } from "pinia";
import "./utils/env-polyfill"; // ⚠️ Must be imported before any RTM code
import App from "./App.vue";
import router from "./router";
import "./index.css";
```

**原因**：

- 共享代码 `demos/shared/rtm/util.ts` 使用 `process.env` 读取环境变量
- Vite 使用 `import.meta.env` 而不是 `process.env`
- 需要 polyfill 将 `import.meta.env` 映射到 `process.env`
- ⚠️ 必须在任何使用 RTM 的代码之前导入

### 2. EventEmitter Polyfill

**问题**：浏览器环境中没有 Node.js 的 `EventEmitter` 类。

**解决方案**：

1. 安装 `events` 包作为 polyfill：

```bash
npm install events
```

2. 在 `vite.config.ts` 中配置 CommonJS 模块转换：

```typescript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],

  optimizeDeps: {
    include: ["events", "agora-rtm"],
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
});
```

**原因**：

- 共享代码 `demos/shared/rtm/util.ts` 使用 `import EventEmitter from "events"`
- `events` 是 CommonJS 格式的包，需要特殊配置才能在 ESM 环境中使用
- Vite 需要显式配置 `optimizeDeps` 来正确处理

### 3. 环境变量前缀

Electron + Vite 项目使用 `VITE_` 前缀：

```env
VITE_APP_ID=your_app_id_here
VITE_APP_CERT=your_app_certificate_here
```

## 通用框架配置注意事项

以下是所有前端框架项目在集成 RTM SDK 时需要注意的配置问题：

### 必需的 Polyfill

1. **EventEmitter**：

   - 所有浏览器环境项目都需要安装 `events` 包
   - 包括：Vite、Webpack、Next.js、Nuxt、Electron 等

2. **process.env**：
   - Vite 项目：需要在 `vite.config.ts` 中配置 `define: { "process.env": {} }`
   - Webpack 项目：通常已内置支持
   - Next.js：已内置支持
   - Nuxt：已内置支持

### 环境变量前缀规则

| 框架/工具       | 前缀           | 示例                 |
| --------------- | -------------- | -------------------- |
| Vite            | `VITE_`        | `VITE_APP_ID`        |
| Webpack         | 无前缀         | `APP_ID`             |
| Next.js         | `NEXT_PUBLIC_` | `NEXT_PUBLIC_APP_ID` |
| Nuxt            | `NUXT_PUBLIC_` | `NUXT_PUBLIC_APP_ID` |
| Electron (Vite) | `VITE_`        | `VITE_APP_ID`        |

### 依赖安装清单

所有项目必需的依赖：

```json
{
  "dependencies": {
    "agora-rtm": "^2.2.3-2",
    "events": "^3.3.0"
  }
}
```

## 开发模式启动

Electron 项目需要两个终端：

```bash
# 终端 1：启动 Vite 开发服务器
npm run dev

# 终端 2：启动 Electron（等待终端 1 启动完成）
NODE_ENV=development npm run electron
```

## 常见错误

### 错误 1：process is not defined

```
Uncaught ReferenceError: process is not defined
```

**解决**：在 `vite.config.ts` 中添加 `define: { "process.env": {} }`

### 错误 2：EventEmitter is not a constructor

```
Uncaught TypeError: EventEmitter is not a constructor
```

**解决**：安装 `events` 包：`npm install events`

### 错误 3：ERR_FILE_NOT_FOUND

```
Failed to load URL: file:///.../dist/index.html with error: ERR_FILE_NOT_FOUND
```

**解决**：先启动 Vite 开发服务器（`npm run dev`），再启动 Electron

## 更多信息

更多 RTM SDK 集成说明，请参考：[docs/RTM_INTEGRATION.md](../../../docs/RTM_INTEGRATION.md)
