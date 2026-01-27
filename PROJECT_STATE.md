# PROJECT_STATE.md（项目状态记录）

## 目标

- 同步 mockLogin 改造到所有 demo 项目
- 更新测试用例以适配新的 RTM 登录方式
- 更新文档说明

## 上下文总结

- mockLogin 已改造为直接调用 RTM 登录（initRtm）
- 不再返回 LoginResult，改为 Promise<void>
- 需要同步所有 demo 项目的登录页面
- 需要更新测试用例，mock RTM 模块
- Next.js 项目已完成改造，作为参考模板
- 当前运行时：Node.js v22.21.1，包管理器：npm

## 注意点

- mockLogin 现在直接调用 RTM 登录，不返回结果
- 登录成功后需要手动设置 localStorage token
- 登录失败会抛出异常，需要 try-catch 处理
- 测试用例需要 mock RTM 模块
- 所有 demo 项目的登录逻辑需要统一

## 待办（带复选框）

- [x] 清理 demos/shared/utils/auth.ts 代码
- [x] 更新 demos/shared/utils/**tests**/auth.test.ts
- [x] 更新 demos/vue/vite/src/views/Login.vue
- [x] 更新 demos/vue/webpack/src/views/Login.vue
- [x] 更新 demos/react/vite/src/pages/Login.tsx
- [x] 更新 demos/react/webpack/src/pages/Login.tsx
- [x] 更新 demos/nuxt/pages/index.vue
- [x] 更新 demos/h5/src/main.ts
- [x] 更新 demos/electron/vue/src/views/Login.vue
- [x] 更新 demos/electron/react/src/pages/Login.tsx
- [x] 更新 AGENTS.md 文档
- [x] 用户 review 代码

## 已完成/变更摘要（PR 可直接使用）

- 变更摘要：同步 mockLogin 改造到所有 demo 项目
- 影响范围：
  - demos/shared/utils/auth.ts（清理代码和注释）
  - demos/shared/utils/**tests**/auth.test.ts（更新测试，mock RTM）
  - 所有 demo 项目的登录页面（移除 result 判断，添加 try-catch）
  - AGENTS.md（更新使用示例）
- 关键变更：mockLogin 不再返回 LoginResult，改为 Promise<void>
- 验证方式：运行测试，手动测试各项目登录功能
- 风险与回滚：登录逻辑变更，需要确保所有项目都已更新

## 会话评审记录（每个 Session 追加一段）

### Session 2026-01-26-01

- 对话评审结论：待进行
- 变更评审结论：待进行
- 评审备注：项目状态文件已创建
