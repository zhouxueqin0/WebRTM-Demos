# AI Coding 初始化入口

本入口用于启动 AI Coding 脚手架初始化流程，适用于空项目或新项目。

## 目标

通过对话收集信息，自动生成项目的 AI 协作资产（如 `AGENTS.md`、工作流模板、评审模板、架构文档），让没有上下文的 Agent 也能安全推进。

## 初始化流程（执行顺序）

1. 选择工具与偏好
   - 工具：Codex / Claude Code / Cursor / Copilot
   - 语言与时间偏好
2. 生成基础资产
   - `AGENTS.md`（项目协作规则，包含对话模式分流）
   - `CLAUDE.md`（若使用 Claude Code，与 `AGENTS.md` 内容一致）
3. 工作流与评审
   - `docs/WORKFLOW_TEMPLATES.md`
   - `docs/PROJECT_STATE_TEMPLATE.md`
   - `docs/REVIEW_TEMPLATES.md`
4. 架构文档
   - `docs/ARCHITECTURE.md`
5. 收尾
   - `.ai-coding/` 加入 `.gitignore`
   - 提示检查并提交

## 下一步

进入 `INIT_DIALOGUE.md` 开始初始化问答，必须按以下顺序执行（除非用户明确要求跳过）：

1) `INIT_WORKFLOW.md`
2) `INIT_REVIEW.md`
3) `INIT_ARCHITECTURE.md`
4) `POST_INIT.md`

## 关于 PROJECT_STATE.md

不在初始化时生成。Agent 开始实际任务时自动创建。模板参考：`docs/PROJECT_STATE_TEMPLATE.md`
