# PROJECT_STATE.md（项目状态记录）

## 目标

- 将所有 demo 项目的 JavaScript 文件迁移到 TypeScript

## 上下文总结

- 项目包含多个前端框架 demo：Vue3 (vite/webpack)、React (vite/webpack)、Nuxt 3、Next.js 14、H5 (Vanilla)、Electron (vue/react)
- 共享工具库位于 `demos/shared/`，其中 `rtm/` 目录已经是 TypeScript
- 需要迁移的主要是各 demo 的源码文件和配置文件
- 当前运行时：Node.js v22.21.1，包管理器：npm

## 注意点

- 每个 demo 项目互不依赖，需要独立处理
- 需要为每个项目添加/更新 `tsconfig.json`
- 测试文件也需要从 `.test.js/.spec.js` 迁移到 `.test.ts/.spec.ts`
- Vitest 配置文件需要从 `.js` 迁移到 `.ts`
- 共享工具的 `utils/` 目录需要迁移（`rtm/` 已是 TS）
- 修改前需要推测影响范围并确认

## 待办（带复选框）

- [x] 推测影响范围并获取用户确认
- [x] 迁移 demos/shared/utils（auth.js, storage.js, validator.js 及测试）
- [x] 迁移 demos/vue/vite（含打包脚本）
- [x] 迁移 demos/vue/webpack（含打包脚本）
- [x] 迁移 demos/react/vite（含打包脚本）
- [x] 迁移 demos/react/webpack（含打包脚本）
- [x] 迁移 demos/nuxt（含打包脚本）
- [x] 迁移 demos/nextjs（含打包脚本）
- [x] 迁移 demos/h5（已是 TS，无需迁移）
- [x] 迁移 demos/electron/vue（含打包脚本）
- [x] 迁移 demos/electron/react（含打包脚本）
- [x] 更新 AGENTS.md 中的共享工具使用指南（.js → .ts）
- [ ] 各项目安装新的 TypeScript 依赖（需用户执行 npm install）
- [ ] 验证所有项目的类型检查和测试

## 已完成/变更摘要（PR 可直接使用）

- 变更摘要：将所有 demo 项目从 JavaScript 迁移到 TypeScript
- 影响范围：
  - demos/shared/utils（auth, storage, validator 及测试）
  - demos/vue/vite, demos/vue/webpack
  - demos/react/vite, demos/react/webpack
  - demos/nextjs
  - demos/nuxt（仅更新 Vue 组件）
  - demos/electron/vue, demos/electron/react
  - 所有项目的配置文件（vite.config, webpack.config, vitest.config, package.json）
- 验证方式：待执行类型检查和测试
- 风险与回滚：所有旧 JS 文件已删除，可通过 git 回滚

## 会话评审记录（每个 Session 追加一段）

### Session 2026-01-26-01

- 对话评审结论：待进行
- 变更评审结论：待进行
- 评审备注：项目状态文件已创建
