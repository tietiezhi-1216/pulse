import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const repoRoot = path.resolve(import.meta.dirname, '../..');

const readJson = (relativePath) => JSON.parse(readFileSync(path.join(repoRoot, relativePath), 'utf8'));

const rootPackage = readJson('package.json');
const electronPackage = readJson('packages/bruno-electron/package.json');
const appPackage = readJson('packages/bruno-app/package.json');
const buildElectronScript = readFileSync(path.join(repoRoot, 'scripts/build-electron.js'), 'utf8');
const buildElectronShellScript = readFileSync(path.join(repoRoot, 'scripts/build-electron.sh'), 'utf8');
const electronBuilderConfig = readFileSync(
  path.join(repoRoot, 'packages/bruno-electron/electron-builder-config.js'),
  'utf8'
);
const materializeRuntimeDepsScript = readFileSync(
  path.join(repoRoot, 'scripts/materialize-electron-runtime-deps.mjs'),
  'utf8'
);
const releaseWorkflow = readFileSync(path.join(repoRoot, '.github/workflows/release.yml'), 'utf8');

const workspacePackagePaths = new Map([
  ['@usebruno/common', 'packages/bruno-common/package.json'],
  ['@usebruno/converters', 'packages/bruno-converters/package.json'],
  ['@usebruno/filestore', 'packages/bruno-filestore/package.json'],
  ['@usebruno/graphql-docs', 'packages/bruno-graphql-docs/package.json'],
  ['@usebruno/query', 'packages/bruno-query/package.json'],
  ['@usebruno/requests', 'packages/bruno-requests/package.json'],
  ['@usebruno/schema-types', 'packages/bruno-schema-types/package.json']
]);

function getRuntimeWorkspaceDependencies() {
  const dependencyNames = new Set([
    ...Object.keys(electronPackage.dependencies || {}),
    ...Object.keys(appPackage.dependencies || {})
  ]);

  return [...dependencyNames]
    .filter((name) => workspacePackagePaths.has(name))
    .map((name) => {
      const packageJsonPath = workspacePackagePaths.get(name);
      const packageJson = readJson(packageJsonPath);
      return { name, packageJsonPath, packageJson };
    })
    .filter(({ packageJson }) => packageJson.main?.startsWith('dist/') && packageJson.scripts?.build);
}

test('Electron runtime workspace packages with dist entrypoints are built before packaging', () => {
  const buildWorkspaceLibs = rootPackage.scripts?.['build:workspace-libs'] || '';
  assert.ok(buildWorkspaceLibs, 'root package.json must define build:workspace-libs');

  for (const { name } of getRuntimeWorkspaceDependencies()) {
    const buildScript = Object.entries(rootPackage.scripts || {}).find(([, command]) =>
      command.includes(`--filter ${name} build`)
    );

    assert.ok(buildScript, `${name} must have a root build script`);
    assert.match(
      buildWorkspaceLibs,
      new RegExp(`pnpm ${buildScript[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`),
      `${name} must be included in build:workspace-libs so Electron releases contain its dist files`
    );
  }
});

test('Electron packaging materializes pnpm runtime dependencies before building installers', () => {
  assert.match(
    buildElectronScript,
    /materialize-electron-runtime-deps\.mjs/,
    'scripts/build-electron.js must materialize pnpm runtime dependencies before electron-builder runs'
  );
  assert.match(
    buildElectronShellScript,
    /materialize-electron-runtime-deps\.mjs/,
    'scripts/build-electron.sh must materialize pnpm runtime dependencies before electron-builder runs'
  );
});

test('Electron runtime dependency materialization invokes pnpm through the shell', () => {
  assert.match(
    materializeRuntimeDepsScript,
    /execSync\('pnpm --filter pulse list --prod --depth Infinity --json'/,
    'runtime dependency materialization must invoke pnpm through the shell for Windows runners'
  );
});

test('Release workflow verifies packaged app.asar runtime dependencies before publishing artifacts', () => {
  assert.match(
    releaseWorkflow,
    /pnpm check:electron-asar/,
    'release workflow must inspect built app.asar files before uploading desktop artifacts'
  );
});

test('Electron builder does not rebuild package-manager native helper dependencies in CI', () => {
  assert.match(
    electronBuilderConfig,
    /npmRebuild:\s*false/,
    'electron-builder must not invoke pnpm native rebuild helpers during release packaging'
  );
});
