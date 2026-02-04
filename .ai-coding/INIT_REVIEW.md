# 评审初始化（下一步）

用途：生成 Agent 自检用的评审标准，评审过程低感知/无感知。

## 设计原则

- **默认无感**：Agent 按标准自动评审，输出结果即可
- **按需交互**：仅当用户明确要求时才进入交互式评审
- **结果导向**：用户只看评审结论，不参与评审过程

## 生成步骤

1. 读取模板：`example/REVIEW_TEMPLATES_EXAMPLE.md`
2. 询问是否需要新增评审项（可跳过）：
   - 1) 不需要，使用默认
   - 2) 需要（请写明）
3. 将内容写入 `docs/REVIEW_TEMPLATES.md`
4. 更新 `AGENTS.md` 文档导航

## 输出

- `docs/REVIEW_TEMPLATES.md`

完成后进入 `INIT_ARCHITECTURE.md` 继续。
