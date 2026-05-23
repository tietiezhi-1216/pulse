# Pulse GitHub Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 Pulse 仓库首页、GitHub 协作入口和仓库元信息整理成中文优先、品牌完整的开源项目展示。

**Architecture:** 本次只改文档、GitHub 模板和仓库元信息，不改应用运行代码。README 负责项目展示，`.github` 模板负责贡献者入口，`package.json` 只修正仓库主页地址。

**Tech Stack:** Markdown、GitHub Issue Forms YAML、GitHub CLI、pnpm workspace metadata.

---

### Task 1: 中文 README 首页

**Files:**
- Modify: `README.md`

- [ ] **Step 1: 用中文品牌首页替换现有 README**

将 `README.md` 改成以下结构：

```md
<p align="center">
  <img src="./assets/brand/pulse-icon.svg" width="96" alt="Pulse Logo" />
</p>

<h1 align="center">Pulse</h1>

<p align="center">
  面向 AI 时代的本地优先 API 客户端。
</p>

<p align="center">
  <a href="./license.md"><img alt="License" src="https://img.shields.io/badge/license-MIT-blue.svg" /></a>
  <img alt="pnpm" src="https://img.shields.io/badge/package-pnpm-F69220.svg" />
  <img alt="Electron" src="https://img.shields.io/badge/desktop-Electron-47848F.svg" />
  <img alt="中文优先" src="https://img.shields.io/badge/i18n-%E4%B8%AD%E6%96%87%E4%BC%98%E5%85%88-red.svg" />
  <img alt="AI Ready" src="https://img.shields.io/badge/AI-ready-111827.svg" />
</p>

## Pulse 是什么

Pulse 是一个从 Bruno fork 而来的本地优先 API 客户端。它保留文件化 API 集合、离线可用、适合 Git 管理的核心工作流，同时建立独立品牌、中文优先体验和面向 AI 辅助接口开发的产品方向。

## 为什么做 Pulse

- 中文用户需要完整、稳定、可维护的本地化 API 工具。
- AI 时代的接口开发需要更适合生成、审查、运行和解释请求的工作台。
- 本地优先和文件化集合让团队可以用 Git 管理 API 资产，而不是把数据锁进云端。

## 功能亮点

- **本地优先**：集合存储在本机文件系统中，适合离线和隐私敏感场景。
- **文件化集合**：请求、脚本、测试和文档都可以进入 Git 工作流。
- **中文优先**：界面、设置、请求面板、响应面板和社区入口持续中文化。
- **多协议支持**：HTTP、GraphQL、WebSocket、gRPC 等常见 API 调试流程。
- **面向 AI**：后续会围绕请求编写、测试生成、响应分析和文档生成增强。
- **开源透明**：保留 MIT License，尊重 Bruno 原始版权声明。

## 快速开始

```bash
pnpm install
pnpm dev
```

如果依赖下载较慢，可以按本机环境启用代理后再安装依赖。

## 开发与构建

```bash
pnpm dev:web
pnpm dev:electron
pnpm build:web
pnpm build:electron:mac
```

常用验证：

```bash
node tests/i18n/pulse-i18n.test.mjs
pnpm build:web
```

## 国际化

Pulse 当前内置英文和简体中文。新增界面文案时，请优先添加到：

- `packages/bruno-app/src/i18n/translation/en.json`
- `packages/bruno-app/src/i18n/translation/zh-CN.json`

并运行：

```bash
node tests/i18n/pulse-i18n.test.mjs
```

## 路线图

- 完成核心界面中文化和语言设置。
- 清理 Bruno 品牌残留，形成 Pulse 独立产品识别。
- 增强 AI 辅助请求编写、测试生成和响应解释能力。
- 优化 macOS / Windows / Linux 桌面构建发布流程。
- 建立中文优先的贡献、Issue 和发布流程。

## 贡献方式

欢迎提交 Issue 和 Pull Request。提交前请尽量保持改动聚焦，并说明你修改的界面、命令或行为。

提交信息建议使用中文：

```bash
git commit -m "文档：完善 Pulse 中文 README"
git commit -m "修复：稳定响应面板国际化"
git commit -m "功能：添加语言设置入口"
```

## 与 Bruno 的关系

Pulse fork 自 Bruno。Bruno 采用 MIT License 发布，Pulse 保留原始版权与许可证声明。本项目是独立维护的开源版本，不隶属于 Bruno，也不代表 Bruno 官方。

## 许可证

本项目遵循 MIT License。请查看仓库中的许可证文件和原始版权声明。
```

- [ ] **Step 2: 验证 Markdown 引用的资源存在**

Run:

```bash
test -f assets/brand/pulse-icon.svg && test -f license.md
```

Expected: exit code `0`.

### Task 2: 中文化 GitHub Issue / PR 模板

**Files:**
- Modify: `.github/PULL_REQUEST_TEMPLATE.md`
- Modify: `.github/ISSUE_TEMPLATE/BugReport.yaml`
- Modify: `.github/ISSUE_TEMPLATE/FeatureRequest.yaml`
- Modify: `.github/ISSUE_TEMPLATE/config.yaml`

- [ ] **Step 1: 替换 PR 模板**

将 `.github/PULL_REQUEST_TEMPLATE.md` 改为中文结构：

```md
## 变更说明

请说明这次 PR 修改了什么，以及为什么需要这次修改。

## 类型

- [ ] 修复问题
- [ ] 新功能
- [ ] 文档
- [ ] 国际化
- [ ] 构建 / 工程配置
- [ ] 其他

## 检查清单

- [ ] 我确认这次改动范围聚焦，便于审查。
- [ ] 我已经运行了相关测试或说明了无法运行的原因。
- [ ] 如果改动涉及界面，我已附上截图或说明可见变化。
- [ ] 如果新增文案，我已同步更新英文和简体中文翻译。
- [ ] 我理解 Pulse fork 自 Bruno，并会保留必要的原始版权与许可证声明。

## 验证方式

请填写你运行过的命令，例如：

```bash
node tests/i18n/pulse-i18n.test.mjs
pnpm build:web
```
```

- [ ] **Step 2: 替换 Bug Report 表单**

将 `.github/ISSUE_TEMPLATE/BugReport.yaml` 改为中文字段，并把 Bruno 改为 Pulse。

- [ ] **Step 3: 替换 Feature Request 表单**

将 `.github/ISSUE_TEMPLATE/FeatureRequest.yaml` 改为中文字段，并把 Bruno 改为 Pulse。

- [ ] **Step 4: 检查 Issue 模板配置**

确保 `.github/ISSUE_TEMPLATE/config.yaml` 没有指向 Bruno 官方 issue 链接；如果存在，改为 Pulse 当前仓库。

- [ ] **Step 5: 验证 YAML 能解析**

Run:

```bash
ruby -e "require 'yaml'; ['.github/ISSUE_TEMPLATE/BugReport.yaml','.github/ISSUE_TEMPLATE/FeatureRequest.yaml','.github/ISSUE_TEMPLATE/config.yaml'].each { |f| YAML.load_file(f); puts f }"
```

Expected: 输出三个文件名，exit code `0`。

### Task 3: 仓库元信息与 package 地址

**Files:**
- Modify: `package.json`
- External: GitHub repository metadata via `gh repo edit`

- [ ] **Step 1: 修正 package homepage**

把 `package.json` 的 `homepage` 改为：

```json
"homepage": "https://github.com/tietiezhi-1216/pulse"
```

- [ ] **Step 2: 验证 JSON**

Run:

```bash
node -e "JSON.parse(require('fs').readFileSync('package.json')); console.log('package json ok')"
```

Expected: `package json ok`.

- [ ] **Step 3: 设置 GitHub 仓库描述和 topics**

Run:

```bash
gh repo edit tietiezhi-1216/pulse \
  --description "面向 AI 时代的本地优先 API 客户端，中文优先、多语言、文件化集合。" \
  --add-topic api-client \
  --add-topic local-first \
  --add-topic electron \
  --add-topic i18n \
  --add-topic ai-tools \
  --add-topic opencollection \
  --add-topic chinese
```

Expected: exit code `0`.

### Task 4: 验证、提交、推送

**Files:**
- Verify all files from Tasks 1-3.

- [ ] **Step 1: 运行格式与解析检查**

Run:

```bash
git diff --check
node -e "JSON.parse(require('fs').readFileSync('package.json')); console.log('package json ok')"
ruby -e "require 'yaml'; ['.github/ISSUE_TEMPLATE/BugReport.yaml','.github/ISSUE_TEMPLATE/FeatureRequest.yaml','.github/ISSUE_TEMPLATE/config.yaml'].each { |f| YAML.load_file(f); puts f }"
```

Expected: all commands exit code `0`.

- [ ] **Step 2: 检查 README 首屏文字**

Run:

```bash
rg -n "Pulse 是什么|为什么做 Pulse|功能亮点|与 Bruno 的关系|文档：完善 Pulse 中文 README" README.md
```

Expected: 找到所有关键段落。

- [ ] **Step 3: 提交中文提交信息**

Run:

```bash
git add README.md .github/PULL_REQUEST_TEMPLATE.md .github/ISSUE_TEMPLATE/BugReport.yaml .github/ISSUE_TEMPLATE/FeatureRequest.yaml .github/ISSUE_TEMPLATE/config.yaml package.json
git commit -m "文档：完善 Pulse GitHub 首页"
```

Expected: commit succeeds.

- [ ] **Step 4: 推送**

Run:

```bash
git push
```

Expected: `main -> main`.

---

## Self-Review

- Spec coverage: README、GitHub 模板、仓库元信息、中文提交策略均有任务覆盖。
- Placeholder scan: 本计划没有未明确的实施步骤。
- Scope check: 历史重写不在本计划执行范围内，符合已批准规格中的安全整理默认策略。
