# Pulse CI/CD Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复 Pulse 当前 GitHub Actions 的发布门禁，并发布第一个 Pulse 版本。

**Architecture:** 将上游 Bruno 的超长 E2E workflow 从 `main` 必跑链路中移出，保留为手动回归入口。新增稳定的 `CI` workflow 作为日常门禁，新增 `Release` workflow 负责 tag 发布、三平台构建和 GitHub Release 资产上传。

**Tech Stack:** GitHub Actions, pnpm 10.30.3, Node.js 22.17.0, Electron Builder, GitHub CLI.

---

### Task 1: Stabilize Push CI

**Files:**
- Create: `.github/workflows/ci.yml`
- Modify: `.github/workflows/lint-checks.yml`
- Modify: `.github/workflows/tests-linux.yml`
- Modify: `.github/workflows/tests-macos.yml`
- Modify: `.github/workflows/tests-windows.yml`
- Modify: `.github/workflows/benchmarks.yml`
- Modify: `.github/workflows/flaky-test-detector.yml`

- [ ] **Step 1: Create the stable CI workflow**

Create `.github/workflows/ci.yml` with:

```yaml
name: CI

on:
  workflow_dispatch:
  push:
    branches: [main, 'release/v*']
  pull_request:
    branches: [main, 'release/v*']

concurrency:
  group: ci-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read

jobs:
  validate:
    name: Validate
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v6

      - name: Setup Node Dependencies
        uses: ./.github/actions/common/setup-node-deps
        with:
          skip-build: 'true'

      - name: Lint
        run: pnpm lint
        env:
          ESLINT_PLUGIN_DIFF_COMMIT: ${{ github.event_name == 'pull_request' && github.event.pull_request.base.ref || 'main' }}

      - name: Pulse branding tests
        run: node tests/branding/pulse-branding.test.mjs

      - name: Pulse i18n tests
        run: node tests/i18n/pulse-i18n.test.mjs

      - name: Build web app
        run: pnpm build:web
```

- [ ] **Step 2: Make legacy lint workflow manual only**

Update `.github/workflows/lint-checks.yml` so it keeps `workflow_dispatch` and no longer runs on every push/pull request.

- [ ] **Step 3: Make legacy full test workflows manual only**

Update `.github/workflows/tests-linux.yml`, `.github/workflows/tests-macos.yml`, and `.github/workflows/tests-windows.yml` so they keep `workflow_dispatch` and no longer run on every push/pull request.

- [ ] **Step 4: Make legacy benchmark/flaky workflows manual only**

Update `.github/workflows/benchmarks.yml` and `.github/workflows/flaky-test-detector.yml` so only the stable `CI` workflow runs automatically on pull requests.

- [ ] **Step 5: Verify workflow YAML parses**

Run:

```bash
ruby -e "require 'yaml'; Dir['.github/workflows/*.yml'].sort.each { |f| YAML.load_file(f); puts f }"
```

Expected: every workflow path prints and exit code is `0`.

### Task 2: Add Release Workflow

**Files:**
- Create: `.github/workflows/release.yml`
- Modify: `scripts/build-electron.js`

- [ ] **Step 1: Create release workflow**

Create `.github/workflows/release.yml` with:

```yaml
name: Release

on:
  workflow_dispatch:
    inputs:
      tag:
        description: Release tag, for example v2.0.0
        required: true
        type: string
      prerelease:
        description: Mark this release as a prerelease
        required: true
        default: false
        type: boolean
  push:
    tags:
      - 'v*'

concurrency:
  group: release-${{ github.ref }}
  cancel-in-progress: false

permissions:
  contents: write

jobs:
  validate:
    name: Validate Release
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v6

      - name: Setup Node Dependencies
        uses: ./.github/actions/common/setup-node-deps
        with:
          skip-build: 'true'

      - name: Lint
        run: pnpm lint
        env:
          ESLINT_PLUGIN_DIFF_COMMIT: main

      - name: Pulse branding tests
        run: node tests/branding/pulse-branding.test.mjs

      - name: Pulse i18n tests
        run: node tests/i18n/pulse-i18n.test.mjs

      - name: Build web app
        run: pnpm build:web

  build:
    name: Build ${{ matrix.name }}
    needs: validate
    runs-on: ${{ matrix.os }}
    timeout-minutes: 90
    strategy:
      fail-fast: false
      matrix:
        include:
          - name: macOS
            os: macos-latest
            artifact: pulse-macos
          - name: Windows
            os: windows-latest
            artifact: pulse-windows
          - name: Linux
            os: ubuntu-24.04
            artifact: pulse-linux
    steps:
      - uses: actions/checkout@v6

      - name: Install Linux packaging dependencies
        if: matrix.name == 'Linux'
        run: |
          sudo apt-get update
          sudo apt-get --no-install-recommends install -y rpm

      - name: Setup Node Dependencies
        uses: ./.github/actions/common/setup-node-deps
        with:
          skip-build: 'true'

      - name: Build Electron package
        run: pnpm build:electron

      - name: Build Linux deb and rpm packages
        if: matrix.name == 'Linux'
        run: |
          pnpm --filter pulse dist:deb
          pnpm --filter pulse dist:rpm

      - name: Upload desktop artifacts
        uses: actions/upload-artifact@v6
        with:
          name: ${{ matrix.artifact }}
          path: |
            packages/bruno-electron/out/*.AppImage
            packages/bruno-electron/out/*.deb
            packages/bruno-electron/out/*.dmg
            packages/bruno-electron/out/*.exe
            packages/bruno-electron/out/*.rpm
            packages/bruno-electron/out/*.zip
            packages/bruno-electron/out/*.blockmap
            packages/bruno-electron/out/latest*.yml
          if-no-files-found: error
          retention-days: 14

  publish:
    name: Publish GitHub Release
    needs: build
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v6

      - name: Download desktop artifacts
        uses: actions/download-artifact@v6
        with:
          path: release-assets

      - name: Create release notes
        run: |
          cat > RELEASE_NOTES.md <<'EOF'
          Pulse 首个公开版本。

          - 独立 Pulse 品牌和白底红色脉搏图标
          - 中文优先界面和语言设置
          - 本地优先 API 集合、脚本、测试和文档工作流
          - macOS、Windows、Linux 桌面安装包
          EOF

      - name: Publish release
        uses: softprops/action-gh-release@v2
        with:
          tag_name: ${{ github.event_name == 'workflow_dispatch' && inputs.tag || github.ref_name }}
          name: Pulse ${{ github.event_name == 'workflow_dispatch' && inputs.tag || github.ref_name }}
          body_path: RELEASE_NOTES.md
          prerelease: ${{ github.event_name == 'workflow_dispatch' && inputs.prerelease || false }}
          files: release-assets/**/*
```

- [ ] **Step 2: Verify release workflow YAML parses**

Run:

```bash
node -c scripts/build-electron.js
```

Expected: exit code `0`.

- [ ] **Step 3: Verify release workflow YAML parses**

Run:

```bash
ruby -e "require 'yaml'; YAML.load_file('.github/workflows/release.yml'); puts 'release workflow ok'"
```

Expected: `release workflow ok`.

### Task 3: Local Verification, Commit, Push, Release

**Files:**
- Modify: `.github/workflows/*.yml`

- [ ] **Step 1: Run local checks**

Run:

```bash
node tests/branding/pulse-branding.test.mjs
node tests/i18n/pulse-i18n.test.mjs
pnpm build:web
git diff --check
```

Expected: all commands exit `0`.

- [ ] **Step 2: Commit and push**

Run:

```bash
git add .github/workflows docs/superpowers/plans/2026-05-23-cicd-release.md
git commit -m "修复：重建 Pulse CI 发布流程"
git push
```

Expected: `main -> main` push succeeds.

- [ ] **Step 3: Trigger first release**

Create and push the first Pulse tag:

```bash
git tag -a v2.0.0 -m "发布 Pulse v2.0.0"
git push origin v2.0.0
```

Expected: GitHub starts the `Release` workflow.

- [ ] **Step 4: Verify release exists**

Run:

```bash
gh release view v2.0.0 --repo tietiezhi-1216/pulse
```

Expected: Release exists and includes uploaded desktop artifacts.
