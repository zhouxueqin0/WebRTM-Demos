# Project State

## 当前任务

**refactor(electron-react): 将 CSS 迁移到 Less 并优化**

将 `demos/electron/react` 项目中的所有 CSS 文件迁移到 Less 技术栈，并使用 Less 特性优化代码结构。

## 阶段

✅ 完成

## Todo List

- [x] 1. 安装 less 依赖
- [x] 2. 重命名所有 .css 文件为 .less
- [x] 3. 更新所有 .tsx 文件中的 import 语句
- [x] 4. 优化 Less 文件（使用嵌套、变量等特性）
- [x] 5. 简化组件 className
- [x] 6. 验证样式和功能正常
- [x] 7. 提交代码

## 关键决策

1. **公共变量管理**: 创建 `styles/variables.less` 统一管理颜色、间距、圆角、阴影、过渡等
2. **公共样式复用**: 创建 `styles/list-common.less` 使用 Mixin 复用列表组件样式
3. **Less 嵌套特性**: 使用父组件包裹子元素的嵌套写法，简化 className 命名
4. **BEM 简化**: 使用 `&` 父选择器引用简化 BEM 命名规范

## 上下文

- 参考项目: `demos/electron/react`
- 技术栈: React 18 + TypeScript + Vite + Less
- 优化内容: CSS → Less 迁移 + 样式结构优化

---

**创建时间**: 2026-02-13
**最后更新**: 2026-02-13
**完成时间**: 2026-02-13

## 关键决策

1. **状态管理**: 使用 Pinia（Vue 官方推荐）替代 Zustand
2. **路由**: 使用 Vue Router 4
3. **组件语法**: 使用 `<script setup lang="ts">` 语法
4. **互踢处理**: GlobalEventHandler.vue 监听 linkstate 事件
5. **环境变量**: 使用 VITE_APP_ID 和 VITE_APP_CERT 前缀

## 上下文

- 参考项目: `demos/electron/react`
- 对话记录: `.ai-coding/feat/electron-vue.md`
- 共享工具: `demos/shared/`

---

**创建时间**: 2026-02-13
**最后更新**: 2026-02-13
