<p align="center">
  <img src="./packages/bruno-app/public/pulse.svg" width="96" alt="Pulse Logo" />
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
