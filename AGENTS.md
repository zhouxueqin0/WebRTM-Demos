<!-- ai-coding-scaffold: v0.1.3 -->

# 前端框架 Demo 合集 - AGENTS.md

## 对话模式

根据用户输入识别 Mode，采用不同响应策略：

| Mode         | 识别特征                                         | 响应策略                                |
| ------------ | ------------------------------------------------ | --------------------------------------- |
| **workflow** | 包含 feat/fix/refactor/chore，或明确的开发任务   | **启动工作流（强制状态管理）**          |
| **continue** | "继续 / 接着做"，或存在未完成的 PROJECT_STATE.md | 读取状态文件，恢复上下文，进入 workflow |
| **general**  | 技术咨询、代码解释、一般问题                     | 直接回答，不启动工作流                  |

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

- 工具：Kiro
- 语言：中文
- 时区：Asia/Shanghai
- 日期格式：YYYY-MM-DD
- 时间格式：24h

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

### 修改前确认（项目特定约束）

**在执行任何文件修改前，必须：**

1. **推测影响范围**：列出可能需要修改的目录/文件
2. **询问用户确认**：等待用户确认后再执行

**⚠️ 特别注意（强制规则）**：

- **跨项目目录修改必须询问**：修改任何不在当前任务目录下的文件前，必须先询问用户
- **共享代码修改必须询问**：`demos/shared/` 目录的任何修改都必须先询问用户，因为会影响所有项目
- **根目录文件修改必须询问**：项目根目录的配置文件（如 `package.json`、`.gitignore` 等）修改前必须询问
- **文档修改必须询问**：`docs/` 目录、`README.md`、`AGENTS.md` 等文档修改前必须询问

**示例格式**：

```
📋 影响范围推测

本次修改可能涉及：
- demos/vue/vite/src/
- demos/shared/utils/  ⚠️ 共享代码，会影响所有项目
- demos/README.md

是否确认修改这些目录？
```

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

| 文档                       | 说明                                              |
| -------------------------- | ------------------------------------------------- |
| PROJECT_STATE.md           | 项目状态记录（workflow 必需，首次使用时自动创建） |
| docs/ARCHITECTURE.md       | 项目架构文档                                      |
| docs/WORKFLOW_TEMPLATES.md | 工作流模板                                        |
| docs/REVIEW_TEMPLATES.md   | 评审清单模板                                      |
| demos/README.md            | Demo 项目使用说明                                 |
| demos/ENV_SETUP.md         | 环境变量配置指南                                  |

---

## 项目概述

这是一个包含多个前端框架的 Demo 合集项目，用于展示和学习不同前端技术栈的实现方式。每个 demo 都实现了简单的登录和主页功能，并配备了完整的测试。

## 核心规则

### 项目结构

```
.
├── demos/                   # 所有 demo 项目
│   ├── shared/             # 共享工具库（auth, storage, validator）
│   ├── vue/                # Vue3 demos (vite/webpack)
│   ├── react/              # React demos (vite/webpack)
│   ├── nuxt/               # Nuxt 3
│   ├── nextjs/             # Next.js 14
│   ├── h5/                 # Vite + Vanilla TS
│   └── electron/           # Electron demos (vue/react)
├── docs/                   # 项目文档
└── .ai-coding/             # AI Coding 脚手架
```

### 技术栈

| 项          | 值                                                       |
| ----------- | -------------------------------------------------------- |
| 包管理器    | npm                                                      |
| 运行时      | Node.js v22.21.1                                         |
| 框架        | Vue3, React 18, Nuxt 3, Next.js 14, Vanilla TS, Electron |
| 路由        | Vue Router 4.x, React Router 6.x, Nuxt/Next.js 内置      |
| 样式        | CSS (Scoped CSS / CSS Modules)                           |
| 测试框架    | Vitest 1.x + @vue/test-utils / @testing-library/react    |
| 构建工具    | Vite 5.x / Webpack 5.x                                   |
| Lint/Format | 无（待配置）                                             |

### 关键约束

1. **Demo 项目互不依赖**：每个 demo 都是独立的，可以单独运行和测试
2. **共享工具统一管理**：所有公共函数放在 `demos/shared/` 目录
3. **修改前必须确认**：推测影响范围并询问用户
4. **测试覆盖**：每个项目都有对应的测试文件
5. **每次提交前**：让用户阶段性验证当前代码是否符合要求，如果不符合要求则进行 fix，如果符合要求，则提交代码
6. **待后续补充**：更多约束将在开发过程中添加

### 文件命名

- 组件文件：`PascalCase.vue` / `PascalCase.tsx`
- 工具文件：`kebab-case.ts`
- 测试文件：`*.spec.ts` (Vue) / `*.test.tsx` (React)
- 配置文件：`kebab-case.config.ts`

### 代码风格

- Vue3：使用 `<script setup lang="ts">` 语法
- React：使用函数组件 + Hooks + TypeScript
- 导入路径：使用相对路径
- **共享工具导入**：
  - TypeScript 项目：直接导入不带扩展名 `import { xxx } from '../../shared/utils/auth'`
  - Next.js 注意：agora-rtm SDK 仅客户端可用，页面需标记 `'use client'`

---

## 常用命令

### 开发命令（各 demo 项目内）

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行测试
npm test

# 监听模式测试
npm run test:watch

# 构建
npm run build
```

### Electron 项目特殊命令

```bash
# 终端 1：启动 Vite 开发服务器
npm run dev

# 终端 2：启动 Electron
NODE_ENV=development npm run electron
```

### 共享工具测试

```bash
cd demos/shared
npm install
npm test
```

### 环境变量配置

每个项目都支持 `.env` 文件配置，详见 `demos/ENV_SETUP.md`。

```bash
# 1. 复制示例文件
cp .env.example .env

# 2. 编辑 .env 填入配置

# 3. Webpack 项目需要安装依赖
cd demos/vue/webpack  # 或 demos/react/webpack
npm install

# 4. 重启开发服务器
npm run dev
```

**环境变量前缀**：

- Vite 项目：`VITE_APP_ID`, `VITE_APP_CERT`
- Webpack 项目：`APP_ID`, `APP_CERT`
- Next.js：`NEXT_PUBLIC_APP_ID`, `NEXT_PUBLIC_APP_CERT`
- Nuxt：`NUXT_PUBLIC_APP_ID`, `NUXT_PUBLIC_APP_CERT`

---

## Git Commit 格式

```bash
git commit -m "<type>(<scope>): <summary>

## Changes
- <detail 1>
- <detail 2>

Generated with AI Agent"
```

**Type**：

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具链相关
- `style`: 代码格式调整

**Scope** 示例：

- `vue-vite`: Vue3 + Vite demo
- `react-webpack`: React + Webpack demo
- `shared`: 共享工具
- `docs`: 文档
- `all`: 影响所有项目

---

## 共享工具使用指南

### 认证工具 (auth.ts)

```typescript
import {
  mockLogin,
  mockLogout,
  isAuthenticated,
} from "../../shared/utils/auth";

// 登录（现在使用 RTM 登录）
try {
  await mockLogin("username", "password");
  localStorage.setItem("token", "mock-token-" + Date.now());
  // 登录成功，跳转到 dashboard
} catch (error) {
  console.error("Login failed:", error);
  // 处理登录失败
}

// 登出
await mockLogout();

// 检查认证状态
if (isAuthenticated()) {
  // 已登录
}
```

**注意**：Next.js 项目中使用 RTM 功能的页面必须添加 `'use client'` 指令。

### 存储工具 (storage.ts)

```typescript
import { storage } from "../../shared/utils/storage";

storage.set("key", { data: "value" });
const data = storage.get<{ data: string }>("key");
storage.remove("key");
storage.clear();
```

### 验证工具 (validator.ts)

```typescript
import {
  isValidEmail,
  validatePassword,
  validateUsername,
  type ValidationResult,
} from "../../shared/utils/validator";

if (isValidEmail("test@example.com")) {
  /* ... */
}

const pwdResult: ValidationResult = validatePassword("password123");
if (pwdResult.valid) {
  /* ... */
}

const userResult: ValidationResult = validateUsername("user123");
if (!userResult.valid) {
  console.log(userResult.message);
}
```

---

## 待办事项

- [ ] 配置 ESLint/Prettier 统一代码风格
- [ ] 添加 CI/CD 配置（GitHub Actions）
- [ ] 完善共享工具的功能（真实登录逻辑）
- [ ] 添加更多测试用例
- [ ] 补充更多约束和最佳实践

---

**最后更新**：2026-01-22
