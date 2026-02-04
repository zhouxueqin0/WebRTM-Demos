# SOP 初始化（下一步）

用途：根据项目类型与偏好，生成项目内可用的对话式工作流文件。

说明：优先使用 `INIT_DIALOGUE.md` 中已确认的信息；仅在缺失时再询问。

## 生成步骤

1. 读取 `INIT_DIALOGUE.md` 中已确认的项目类型，如未确认则询问：
   - 1) Web（默认）
   - 2) Backend
   - 3) Library
2. 询问需要哪些工作流（可多选）：
   - 1) feat
   - 2) fix
   - 3) refactor
   - 4) chore
   - 5) docs
   - 6) test
   - 7) 全部

   默认：1,2,3,4（常用四种）
3. 读取模板：`example/WORKFLOW_TEMPLATES_EXAMPLE.md`
4. 根据用户选择裁剪，只保留选中的工作流类型
5. 根据项目技术栈微调命令（如 bun/npm/pnpm）
6. 将内容写入 `docs/WORKFLOW_TEMPLATES.md`
7. 复制 `example/PROJECT_STATE_EXAMPLE.md` 到 `docs/PROJECT_STATE_TEMPLATE.md`
8. 更新 `AGENTS.md` 文档导航

## 关于 PROJECT_STATE.md

不在初始化时生成。Agent 开始实际任务时自动创建。

模板参考：`docs/PROJECT_STATE_TEMPLATE.md`

## 输出

- `docs/WORKFLOW_TEMPLATES.md`
- `docs/PROJECT_STATE_TEMPLATE.md`

完成后进入 `INIT_REVIEW.md` 生成评审模板。
