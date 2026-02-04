# Changelog

所有版本变更记录。格式遵循 [Keep a Changelog](https://keepachangelog.com/)。

## [0.1.3] - 2026-01-09

### Added
- 新增「模式切换规则」：general → workflow 回切机制
  - 当 general 模式涉及文件修改、命令执行、todo 变化时，提示切换到 workflow
  - 提供标准提示格式，防止"顺便改一下"导致的状态丢失
- 新增「最低输出频率要求」：即使状态未变化，每轮也必须输出 `[STATE]` 行
  - 防止长执行流中的"状态疲劳"

### Changed
- 强化状态维护机制，减少边界情况下的状态遗漏

## [0.1.2] - 2026-01-09

### Changed
- workflow 模式升级为「强制状态机」，新增 Hard Gate 机制
- 新增 `[STATE]` 声明要求：每轮必须显式声明 PROJECT_STATE.md 状态
- PROJECT_STATE.md 维护从「主动检查」升级为「硬约束」
- 新增状态锚点格式示例
- 强调轻量任务也必须更新状态（禁止以"任务太小"为由跳过）
- 上下文管理改名为「强制收尾」，明确触发条件

### Fixed
- 解决 Agent 在轻量任务时跳过状态更新的问题

## [0.1.1] - 2026-01-09

### Changed
- 用「对话模式」替代「Greeting」，Agent 根据用户输入自动识别 Mode（workflow/continue/general）
- 强化 PROJECT_STATE.md 维护规则：新增「每次回复前检查」原则
- 简化文档导航，移除 WORKFLOW_TEMPLATES 和 REVIEW_TEMPLATES 的显式引用
- 精简 AGENTS.md 模板，控制在 200 行内
- 重构 INIT_DIALOGUE.md：从 7 步缩减到 5 步，扫描优先 + 只问是否补充

### Fixed
- 解决 Agent 不主动维护 PROJECT_STATE.md 的问题

## [0.1.0] - 2026-01-07

### Added
- ENTRY.md 入口流程
- INIT_DIALOGUE.md 问答收集（编号选项 + 快速推进模式）
- INIT_WORKFLOW.md 工作流生成（可选类型）
- INIT_REVIEW.md 评审标准（低感知自动评审）
- INIT_ARCHITECTURE.md 架构文档生成
- POST_INIT.md 收尾流程（含清空上下文引导）
- AGENTS.md 模板 Greeting（新对话主动打招呼）
- AI 行为规范（PROJECT_STATE.md 创建/更新时机、对话评审自动执行、上下文管理）
- UPGRADE.md 升级指南
- example/ 模板目录
