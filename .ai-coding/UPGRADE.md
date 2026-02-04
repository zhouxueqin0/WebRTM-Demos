# 升级指南

## 检查当前版本

查看 `AGENTS.md` 顶部注释：

```markdown
<!-- ai-coding-scaffold: v0.1.3 -->
```

## 升级方式

1. 备份当前 `.ai-coding/` 目录
2. 下载/覆盖新版 `.ai-coding/`
3. 查看 `CHANGELOG.md` 了解变化
4. 按下方「版本迁移」章节逐版本执行

## 跳版本升级

若跨多个版本（如 0.1.0 → 0.3.0），需按顺序执行中间版本的迁移步骤：

```
0.1.0 → 0.2.0 → 0.3.0
```

每个版本的迁移步骤见下方。

## 已生成文件的处理

| 文件 | 升级建议 |
|---|---|
| `.ai-coding/*` | 直接覆盖（模板文件） |
| `AGENTS.md` | 对比新模板，手动合并差异 |
| `CLAUDE.md` | 与 AGENTS.md 保持一致 |
| `docs/WORKFLOW_TEMPLATES.md` | 对比新模板，按需更新 |
| `docs/PROJECT_STATE_TEMPLATE.md` | 对比新模板，按需更新 |
| `docs/REVIEW_TEMPLATES.md` | 对比新模板，按需更新 |
| `docs/ARCHITECTURE.md` | 保留不动（项目特定） |
| `PROJECT_STATE.md` | 保留不动（任务记录） |

## 版本迁移

### 0.1.0（初始版本）

首次安装，无需迁移。

### 0.1.0 → 0.1.1

#### 变更概要
- 用「对话模式」替代「Greeting」
- 强化 PROJECT_STATE.md 维护规则
- 简化文档导航

#### 迁移步骤
1. 在 `AGENTS.md` 顶部将版本号改为 `v0.1.1`
2. 删除「Greeting」部分，替换为「对话模式」部分（参考 `.ai-coding/example/AGENTS_WEB_EXAMPLE.md`）
3. 将「PROJECT_STATE.md」部分改为新格式，新增「每次回复前检查」规则
4. 简化「文档导航」，移除 WORKFLOW_TEMPLATES 和 REVIEW_TEMPLATES 引用
5. 同步更新 `CLAUDE.md`（若存在）

#### 影响的已生成文件
- `AGENTS.md`：结构变化，需手动合并
- `CLAUDE.md`：与 AGENTS.md 保持一致

---

### 0.1.1 → 0.1.2

#### 变更概要
- workflow 模式升级为「强制状态机」
- 新增 Hard Gate 机制：workflow 启动门禁
- 新增 `[STATE]` 声明强制要求
- PROJECT_STATE.md 维护从「主动检查」升级为「硬约束」

#### 迁移步骤
1. 在 `AGENTS.md` 顶部将版本号改为 `v0.1.2`
2. 在「workflow 模式」部分新增「workflow 启动门禁（Hard Gate）」章节
3. 在「PROJECT_STATE.md 维护」中新增「每轮强制检查」规则，添加 `[STATE]` 声明要求
4. 强调「即使是轻量任务也必须更新状态」
5. 将「上下文管理」改名为「上下文管理（强制收尾）」
6. 同步更新 `CLAUDE.md`（若存在）

#### 影响的已生成文件
- `AGENTS.md`：新增 Hard Gate 章节，强化状态维护规则
- `CLAUDE.md`：与 AGENTS.md 保持一致
- `docs/PROJECT_STATE_TEMPLATE.md`：可选更新，建议对比新模板

---

### 0.1.2 → 0.1.3

#### 变更概要
- 新增「模式切换规则」：general → workflow 回切机制
- 新增「最低输出频率要求」：即使状态未变也必须输出 `[STATE]`
- 强化边界情况处理，提升稳定性

#### 迁移步骤
1. 在 `AGENTS.md` 顶部将版本号改为 `v0.1.3`
2. 在「对话模式」表格后新增「模式切换规则」章节
   - 添加 general → workflow 回切规则
   - 包含提示格式示例
3. 在「PROJECT_STATE.md 维护 > 每轮强制检查」中新增「最低输出频率要求」
   - 添加：即使状态未变化，也必须在每轮输出中给出 `[STATE]` 行
4. 同步更新 `CLAUDE.md`（若存在）

#### 影响的已生成文件
- `AGENTS.md`：新增模式切换规则章节，强化状态输出频率要求
- `CLAUDE.md`：与 AGENTS.md 保持一致

---

<!-- 后续版本迁移步骤追加在此 -->

<!--
### 0.1.0 → 0.2.0

#### 变更概要
- xxx

#### 迁移步骤
1. xxx
2. xxx

#### 影响的已生成文件
- `AGENTS.md`：需新增 xxx 字段
-->
