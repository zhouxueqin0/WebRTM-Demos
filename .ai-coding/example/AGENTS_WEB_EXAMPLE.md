<!-- ai-coding-scaffold: v0.1.3 -->

# Web 项目 AGENTS.md 示例

## 对话模式

根据用户输入识别 Mode，采用不同响应策略：

| Mode | 识别特征 | 响应策略 |
|------|---------|---------|
| **workflow** | 包含 feat/fix/refactor/chore，或明确的开发任务 | **启动工作流（强制状态管理）** |
| **continue** | "继续 / 接着做"，或存在未完成的 PROJECT_STATE.md | 读取状态文件，恢复上下文，进入 workflow |
| **general** | 技术咨询、代码解释、一般问题 | 直接回答，不启动工作流 |

---

## 模式切换规则

### general → workflow 回切

当 **general 模式下的回答涉及以下操作时**，必须提示用户切换到 workflow 模式：

- 文件修改（创建、编辑、删除）
- 命令执行（git、build、test 等）
- todo 变化（新增、更新任务）

**提示格式**：

```
⚠️ 检测到需要执行开发操作

当前操作需要：
- [具体操作列表]

建议切换到 workflow 模式以确保状态追踪。是否切换？
```

这可以防止"顺便改一下"导致的状态丢失。

---

## workflow 模式（强制状态机）

### workflow 启动门禁（Hard Gate）

> **只要进入 workflow 模式，以下步骤必须首先完成，否则不得执行任何开发动作。**

1. **检查 `PROJECT_STATE.md`**
   - 不存在 → 立即创建（使用 `docs/PROJECT_STATE_TEMPLATE.md`）
   - 存在 → 检查是否需要更新

2. **在本轮输出中显式声明状态结果（必填）**：

```
[STATE] PROJECT_STATE.md：已检查 / 已更新
```

> ⚠️ **未出现 `[STATE]` 声明，视为 workflow 未启动。**

---

### workflow 进度展示（标准输出）

```
进入 workflow 模式

[🔍 澄清] → [📐 设计] → [⚡ 执行] → [✅ 校验] → [📝 总结]
  ▲ 当前
```

---

## 偏好

- 语言：中文
- 时间：Asia/Shanghai，YYYY-MM-DD，24h

---

## AI 行为规范

### PROJECT_STATE.md 维护（硬约束）

**核心原则**：
> **状态维护是 workflow 的一部分，而不是可选行为。**

#### 1. 每轮强制检查（workflow 模式）

在 workflow 模式下，**每一轮回复前必须完成**：

- PROJECT_STATE.md 是否存在
- 当前阶段 / todo / 决策是否需要更新

并在输出中提供**状态锚点**，例如：

```
[STATE] PROJECT_STATE.md：todo 3 → 2，阶段：📐设计
```

**⚠️ 最低输出频率要求**：

> **即使状态未变化，也必须在每轮输出中给出 `[STATE]` 行。**

这可以防止长执行流中的"状态疲劳"。

#### 2. 强制更新节点（不可跳过）

- 创建 / 更新 todo
- 完成 todo item
- 提交 commit 后
- 阶段切换时
- 遇到阻塞 / 决策点时
- **即使是轻量任务（单文件修改、同步、微调）**

> ⚠️ **禁止以"任务太小"为由跳过状态更新。**

#### 3. 模板

- 使用 `docs/PROJECT_STATE_TEMPLATE.md`

---

### Git Commit 策略

- **提交频率**：每完成一个 todo item 后立即 commit
- **不要累积**：不要跟着 todo list 一直做完再提交
- **原子提交**：一个 commit = 一个完整、独立的变更单元

---

### 质量审查

- **生成 ≠ 完成**
- 每完成一个 todo item 后：
  - 主动询问是否需要 review
- Review 内容：
  - 代码：逻辑正确性、类型安全、边界处理
  - 文档：内容准确性、表达清晰度、示例可用性
- **发现问题立即修复，不得累积**

---

### 对话评审（自动执行）

#### 常规轮次（简化）

```
进度：📐设计 → ⚡执行 | 轮次 5 | +32 -10 行
```

#### 阶段切换（完整）

```
进入 ⚡执行 阶段

[🔍 澄清] → [📐 设计] → [⚡ 执行] → [✅ 校验] → [📝 总结]
                          ▲ 当前
```

#### 任务完成（效率统计）

```
📊 本次对话统计
轮次：12 | Tokens：~8.2k | 变更：+156 -23 ~45
🤖 15min | 🧑‍💻 3h | ⬇️ 2.75h
```

评审标准参考：`docs/REVIEW_TEMPLATES.md`

---

### 上下文管理（强制收尾）

当出现以下任一情况：

- 对话超过 10 轮
- 大量代码或文档变更
- 用户提示上下文不足
- Agent 感知上下文风险

**必须执行以下流程：**

1. 暂停当前任务
2. 更新 PROJECT_STATE.md（进度 / 待办 / 关键决策）
3. 提交所有未提交的变更
4. 输出切换提示：

```
⚠️ 建议切换新对话

已完成：
- [已完成任务列表]

待继续：
- [未完成任务列表]

下一步：开启新对话，输入「继续 <任务名>」
```

---

## 文档导航

| 文档 | 说明 |
|---|---|
| PROJECT_STATE.md | 项目状态记录（workflow 必需） |
| docs/ARCHITECTURE.md | 项目架构 |

---

## 项目概述

<一句话项目描述>

## 核心规则

### 技术栈

| 项 | 值 |
|---|---|
| 包管理器 | <bun/pnpm/yarn/npm> |
| 框架 | <React/Vue/...> |
| 路由 | <Router 方案> |
| 样式 | <Tailwind/CSS Modules/...> |
| Lint/Format | <Biome/ESLint/Prettier> |

### 关键约束

1. 提交前必须运行 `<lint 命令>` 并确保通过
2. 配置集中管理：<说明/路径>
3. 类型优先：<说明>

### 文件命名

- 文件：`kebab-case`
- 组件：`PascalCase`

### 代码风格

<Biome/ESLint 强制执行的规则说明>

路径别名：`@/*` → `./src/*`

---

## 常用命令

```bash
<dev 命令>
<build 命令>
<lint 命令>
```

## Git Commit 格式

```bash
git commit -m "<type>(<scope>): <summary>

## Changes
- <detail 1>
- <detail 2>

Generated with AI Agent"
```

**Type**：`feat` / `fix` / `docs` / `refactor` / `perf` / `test` / `chore` / `style`
