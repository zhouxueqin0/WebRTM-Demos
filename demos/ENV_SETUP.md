# 环境变量配置指南

## 概述

所有 demo 项目都支持通过 `.env` 文件配置环境变量，主要用于 Agora RTM 配置。

## 配置步骤

### 1. 复制示例文件

每个项目都提供了 `.env.example` 文件作为模板：

```bash
# 以 Vue Vite 项目为例
cd demos/vue/vite
cp .env.example .env
```

### 2. 填写配置

编辑 `.env` 文件，填入你的 Agora 配置：

```env
# Vite 项目（vue/vite, react/vite, h5, electron）
VITE_APP_ID="your_app_id_here"
VITE_APP_CERT="your_app_cert_here"

# Webpack 项目（vue/webpack, react/webpack）
APP_ID="your_app_id_here"
APP_CERT="your_app_cert_here"

# Next.js 项目
NEXT_PUBLIC_APP_ID="your_app_id_here"
NEXT_PUBLIC_APP_CERT="your_app_cert_here"

# Nuxt 项目
NUXT_PUBLIC_APP_ID="your_app_id_here"
NUXT_PUBLIC_APP_CERT="your_app_cert_here"
```

## 各框架使用方式

### Vite 项目（Vue/React/H5/Electron）

Vite 内置支持 `.env` 文件，使用 `VITE_` 前缀：

```typescript
// 在代码中访问
const appId = import.meta.env.VITE_APP_ID;
const appCert = import.meta.env.VITE_APP_CERT;
```

### Webpack 项目（Vue/React）

使用 `dotenv-webpack` 插件，无需前缀：

```typescript
// 在代码中访问
const appId = process.env.APP_ID;
const appCert = process.env.APP_CERT;
```

**安装依赖**：

```bash
cd demos/vue/webpack  # 或 demos/react/webpack
npm install
```

### Next.js 项目

Next.js 内置支持，使用 `NEXT_PUBLIC_` 前缀：

```typescript
// 在代码中访问
const appId = process.env.NEXT_PUBLIC_APP_ID;
const appCert = process.env.NEXT_PUBLIC_APP_CERT;
```

### Nuxt 项目

Nuxt 内置支持，使用 `NUXT_PUBLIC_` 前缀：

```typescript
// 在代码中访问
const config = useRuntimeConfig();
const appId = config.public.appId;
const appCert = config.public.appCert;
```

## 注意事项

1. **不要提交 `.env` 文件**：`.env` 文件已添加到 `.gitignore`，避免泄露敏感信息
2. **使用 `.env.example`**：提交 `.env.example` 作为模板，方便团队成员配置
3. **环境变量前缀**：
   - Vite: `VITE_`
   - Next.js: `NEXT_PUBLIC_`
   - Nuxt: `NUXT_PUBLIC_`
   - Webpack: 无前缀
4. **重启开发服务器**：修改 `.env` 后需要重启开发服务器才能生效
5. **共享代码自动适配**：`demos/shared/rtm/util.ts` 会自动检测并使用正确的环境变量前缀

## 项目列表

| 项目                 | 配置文件   | 前缀         | 依赖安装 |
| -------------------- | ---------- | ------------ | -------- |
| demos/vue/vite       | .env       | VITE\_       | 无需     |
| demos/vue/webpack    | .env       | 无           | 需要     |
| demos/react/vite     | .env       | VITE\_       | 无需     |
| demos/react/webpack  | .env       | 无           | 需要     |
| demos/nextjs         | .env.local | NEXT*PUBLIC* | 无需     |
| demos/nuxt           | .env       | NUXT*PUBLIC* | 无需     |
| demos/h5             | .env       | VITE\_       | 无需     |
| demos/electron/vue   | .env       | VITE\_       | 无需     |
| demos/electron/react | .env       | VITE\_       | 无需     |

## 安装依赖

Webpack 项目需要安装 `dotenv-webpack`：

```bash
# Vue Webpack
cd demos/vue/webpack
npm install

# React Webpack
cd demos/react/webpack
npm install
```

其他项目框架内置支持，无需额外安装。
