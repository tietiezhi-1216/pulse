import { execSync } from 'node:child_process';
import { existsSync, lstatSync, mkdirSync, readlinkSync, symlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const electronDir = path.join(repoRoot, 'packages/bruno-electron');
const electronNodeModules = path.join(electronDir, 'node_modules');

function normalizePath(filePath) {
  return path.resolve(filePath);
}

function collectDependencies(node, dependencies = new Map()) {
  for (const [name, dependency] of Object.entries(node.dependencies || {})) {
    if (dependency?.path) {
      const targetPath = normalizePath(dependency.path);
      const existingTarget = dependencies.get(name);
      if (!existingTarget || (!existsSync(existingTarget) && existsSync(targetPath))) {
        dependencies.set(name, targetPath);
      }
    }
    collectDependencies(dependency, dependencies);
  }

  return dependencies;
}

function linkDependency(name, targetPath) {
  if (!existsSync(targetPath)) {
    return { status: 'missing-target', name, targetPath };
  }

  const destination = path.join(electronNodeModules, ...name.split('/'));
  const parent = path.dirname(destination);
  mkdirSync(parent, { recursive: true });

  if (existsSync(destination)) {
    const stat = lstatSync(destination);
    if (stat.isSymbolicLink()) {
      const currentTarget = normalizePath(path.resolve(parent, readlinkSync(destination)));
      if (currentTarget === targetPath) {
        return { status: 'existing', name, targetPath };
      }
    }

    return { status: 'skipped-existing', name, targetPath };
  }

  symlinkSync(targetPath, destination, process.platform === 'win32' ? 'junction' : 'dir');
  return { status: 'linked', name, targetPath };
}

function main() {
  mkdirSync(electronNodeModules, { recursive: true });

  const listOutput = execSync('pnpm --filter pulse list --prod --depth Infinity --json', {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit']
  });

  const [pulsePackage] = JSON.parse(listOutput);
  if (!pulsePackage) {
    throw new Error('Could not read pulse production dependency graph from pnpm.');
  }

  const dependencies = collectDependencies(pulsePackage);
  let linked = 0;
  let skipped = 0;
  let missing = 0;

  for (const [name, targetPath] of dependencies) {
    const result = linkDependency(name, targetPath);
    if (result.status === 'linked') {
      linked += 1;
    } else if (result.status === 'missing-target') {
      missing += 1;
    } else {
      skipped += 1;
    }
  }

  console.log(
    `Materialized Electron runtime dependencies: ${linked} linked, ${skipped} already present/skipped, ${missing} missing optional targets.`
  );
}

main();
