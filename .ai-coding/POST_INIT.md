# 初始化收尾（POST_INIT）

初始化流程完成后执行。

## 自动执行

1. 将 `.ai-coding/` 加入 `.gitignore`（如未存在）
2. 展示生成文件清单

## 提示用户

```
✅ 初始化完成！

生成的文件：
- AGENTS.md
- CLAUDE.md
- docs/WORKFLOW_TEMPLATES.md
- docs/PROJECT_STATE_TEMPLATE.md
- docs/REVIEW_TEMPLATES.md
- docs/ARCHITECTURE.md

后续步骤：
1. 检查生成的文件内容是否正确
2. 提交这些文件到版本控制
3. 清空当前对话，开始使用

有问题随时调整。
```

## 可选操作

是否立即提交生成的文件？
1) 是
2) 否，稍后手动提交

若选择 1，按项目 commit 格式提交：
```
chore(ai-coding): initialize AI coding scaffold

## Changes
- Add AGENTS.md and CLAUDE.md
- Add docs/WORKFLOW_TEMPLATES.md
- Add docs/PROJECT_STATE_TEMPLATE.md
- Add docs/REVIEW_TEMPLATES.md
- Add docs/ARCHITECTURE.md

Generated with AI Agent
```

## 清空上下文

初始化完成后，当前对话上下文已不需要，应清空后开始新对话。

根据用户在 INIT_DIALOGUE 中选择的工具，提示对应命令：

| 工具 | 清空命令 |
|---|---|
| Codex | `/new` |
| Claude Code | `/clear` |
| Cursor | 新建聊天 |
| Copilot | 新建聊天 |
| 其他 | 新建聊天 |

提示用户：

```
🔄 请清空当前对话开始使用：

<根据用户工具显示对应命令>

新对话中我会自动读取 AGENTS.md 并打招呼。
```
