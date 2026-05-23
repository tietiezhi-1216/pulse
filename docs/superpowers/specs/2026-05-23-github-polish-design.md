# Pulse GitHub 展示与仓库整理设计

## 目标

把 Pulse 仓库整理成一个中文优先、品牌完整、适合公开协作的开源项目首页。README 需要让新用户在 30 秒内知道 Pulse 是什么、为什么存在、如何运行、如何参与；GitHub 仓库配置需要减少 Bruno 原项目残留带来的混淆。

## 当前仓库事实

- `main` 当前基于 Bruno 上游提交 `8cd7c2664`，之后追加了 Pulse 自有提交。
- `origin/main` 与本地 `main` 一致。
- `upstream/*` 是 Bruno 原仓库的远程分支，不是 Pulse 自有分支。
- 当前只有一个本地产品分支：`main`。
- 项目已有 Pulse 白底图标资源：`packages/bruno-app/public/pulse.svg`、Electron 图标资源。

## README 方向

采用“产品品牌型首屏 + 开源社区型内容结构 + 工程说明后置”的混合方案。

README 首屏包含：

- 居中展示 Pulse 图标。
- 中文项目名与一句话定位：`面向 AI 时代的本地优先 API 客户端`。
- 徽章：License、构建状态、pnpm、Electron、中文优先、多语言。
- 简短价值主张：本地优先、文件化集合、中文界面、面向 AI 辅助接口开发。
- 快速入口：快速开始、功能亮点、开发构建、路线图、与 Bruno 的关系。

README 主体结构：

1. `Pulse 是什么`
2. `为什么做 Pulse`
3. `功能亮点`
4. `截图与图标`
5. `快速开始`
6. `开发与构建`
7. `国际化`
8. `路线图`
9. `贡献方式`
10. `与 Bruno 的关系`
11. `许可证`

## GitHub 装饰

使用仓库内现有 Pulse 图标，不依赖外部图片服务。README 顶部引用：

```md
<img src="./packages/bruno-app/public/pulse.svg" width="96" alt="Pulse Logo" />
```

建议设置 GitHub 仓库元信息：

- Description：`面向 AI 时代的本地优先 API 客户端，中文优先、多语言、文件化集合。`
- Website：留空，或后续添加项目文档站点。
- Topics：`api-client`、`local-first`、`electron`、`i18n`、`ai-tools`、`opencollection`、`chinese`

这些元信息可以用 `gh repo edit` 设置。

## 模板与社区文件

将 `.github` 下直接面向贡献者的入口改为中文：

- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/ISSUE_TEMPLATE/BugReport.yaml`
- `.github/ISSUE_TEMPLATE/FeatureRequest.yaml`
- `.github/ISSUE_TEMPLATE/config.yaml`

Issue 与 PR 模板保留英文技术关键词，但说明文案使用中文。模板中的 Bruno 指向改为 Pulse，并保留“本项目 fork 自 Bruno”的说明。

## 分支与提交策略

当前不建议把 Bruno 的所有远程分支合并到 Pulse。原因是 `upstream/*` 分支属于 Bruno 原项目历史，合并到 Pulse 会制造大量无关分支、CI 噪音和维护负担。

建议采用：

- `main`：Pulse 当前开发主线。
- `upstream-main`：保留为 Bruno 上游同步参考分支，不推送为产品分支。
- 后续功能分支使用中文或清晰英文均可，例如 `feat/中文首页`、`feat/readme-polish`。

提交信息策略：

- 从下一次提交开始使用中文提交信息。
- 不强行改写已经推送过的提交，除非用户明确批准强推。
- 中文提交格式示例：
  - `文档：完善 Pulse 中文 README`
  - `配置：中文化 GitHub Issue 模板`
  - `仓库：设置 Pulse 项目元信息`

## 历史整理策略

有两个可选层级：

### 安全整理

不重写历史。保持 Bruno 上游历史完整，之后所有 Pulse 提交使用中文。优点是安全、不需要强推、不影响已经推送的远端历史。缺点是历史里仍能看到之前的英文提交。

### 历史重写

以 Bruno 上游 `8cd7c2664` 作为初始化点，将其后的 Pulse 自有提交 squash/rebase 成少量中文提交，然后强推 `main`。优点是项目历史更干净。风险是会改写远端历史，任何已拉取仓库的人都需要重新同步。

本轮默认采用安全整理；历史重写必须单独获得用户批准后执行。

## 需要修改的文件

- `README.md`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/ISSUE_TEMPLATE/BugReport.yaml`
- `.github/ISSUE_TEMPLATE/FeatureRequest.yaml`
- `.github/ISSUE_TEMPLATE/config.yaml`
- 可选：`package.json` 的 `homepage` 从占位组织地址改为当前仓库地址。

## 验证

文档与配置修改完成后运行：

```bash
git diff --check
node -e "JSON.parse(require('fs').readFileSync('package.json'))"
```

如果修改 YAML 模板，额外用 Ruby 或 Python 解析 YAML；本仓库如果没有稳定 YAML 解析依赖，则至少用 GitHub 模板文件结构检查和 `git diff --check`。

## 非目标

- 不在本轮继续大规模代码国际化。
- 不默认删除 CI/CD workflow。
- 不默认强推重写历史。
- 不默认改动 Bruno 上游远程分支。
