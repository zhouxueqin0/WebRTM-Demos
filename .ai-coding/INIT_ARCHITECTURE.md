# 架构初始化（下一步）

用途：在完成初始化问答后，生成项目架构文档 `docs/ARCHITECTURE.md`。

说明：
- 优先使用 `INIT_DIALOGUE.md` 中已确认的信息
- Agent 扫描项目文件，一次性总结架构，后续无需重复分析
- 仅记录已确认事实，不写猜测

## 生成步骤

1. 读取模板：`example/ARCHITECTURE_TEMPLATE_EXAMPLE.md`
2. 分析项目现有文件（`package.json`、锁文件、目录结构、入口文件、配置文件）
3. 将模板条目与项目事实逐项匹配并填充
4. 生成项目版 `docs/ARCHITECTURE.md`
5. 更新 `AGENTS.md` 文档导航

## 最小检查清单（Web 通用）

- `package.json`（脚本、依赖、工具链）
- 入口文件（如 `index.html` / `src/main.*`）
- 路由结构（文件路由或手动路由）
- 构建配置（如 `vite.config.*` / `webpack.config.*`）
- 样式与 UI 方案（Tailwind/CSS Modules/其他）
- 状态管理与数据请求（Redux/Query/SWR/其他）
- i18n 与文案目录（如有）
- 环境变量与运行入口（`.env*`、端口）

## 最小检查清单（React 常见）

### Next.js
- `app/` 或 `pages/`
- `next.config.*`

### Vite React
- `vite.config.*`
- `src/` 下的入口与路由组织

## 输出

- `docs/ARCHITECTURE.md`

初始化流程完成。
