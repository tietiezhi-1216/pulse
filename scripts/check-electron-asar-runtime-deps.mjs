import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import Module from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const builtinModules = new Set(Module.builtinModules.map((name) => name.replace(/^node:/, '')));

function readAsar(asarPath) {
  const buffer = readFileSync(asarPath);
  const headerSize = buffer.readUInt32LE(12);
  const headerStart = 16;
  const headerEnd = headerStart + headerSize;
  const dataStart = Math.ceil(headerEnd / 4) * 4;
  const header = JSON.parse(buffer.slice(headerStart, headerEnd).toString('utf8'));

  return { asarPath, buffer, dataStart, header };
}

function getEntry(header, entryPath) {
  let node = header;
  for (const part of entryPath.split('/').filter(Boolean)) {
    node = node.files?.[part];
    if (!node) {
      return null;
    }
  }
  return node;
}

function hasEntry(header, entryPath) {
  return Boolean(getEntry(header, entryPath));
}

function readEntry(asar, entryPath) {
  const entry = getEntry(asar.header, entryPath);
  if (!entry || entry.files || entry.link) {
    return null;
  }

  if (entry.unpacked) {
    const unpackedPath = path.join(`${asar.asarPath}.unpacked`, entryPath);
    return existsSync(unpackedPath) ? readFileSync(unpackedPath, 'utf8') : null;
  }

  const offset = asar.dataStart + Number(entry.offset || 0);
  return asar.buffer.slice(offset, offset + entry.size).toString('utf8');
}

function walkPackageJsonFiles(node, prefix = '', files = []) {
  if (!node.files) {
    return files;
  }

  for (const [name, child] of Object.entries(node.files)) {
    const childPath = prefix ? `${prefix}/${name}` : name;
    if (name === 'package.json') {
      files.push(childPath);
    }
    walkPackageJsonFiles(child, childPath, files);
  }

  return files;
}

function packageRoot(packageJsonPath) {
  return packageJsonPath.slice(0, -'/package.json'.length);
}

function isPackageManifest(packageJsonPath) {
  if (packageJsonPath === 'package.json') {
    return true;
  }

  const parts = packageJsonPath.split('/');
  const nodeModulesIndex = parts.lastIndexOf('node_modules');
  if (nodeModulesIndex === -1) {
    return false;
  }

  const packageNameParts = parts[nodeModulesIndex + 1]?.startsWith('@') ? 2 : 1;
  const expectedLength = nodeModulesIndex + 1 + packageNameParts + 1;
  return parts.length === expectedLength && parts.at(-1) === 'package.json';
}

function dependencyCandidates(fromRoot, dependencyName) {
  const parts = fromRoot.split('/').filter(Boolean);
  const candidates = [];

  for (let i = parts.length; i >= 0; i -= 1) {
    const base = parts.slice(0, i).join('/');
    candidates.push(`${base ? `${base}/` : ''}node_modules/${dependencyName}/package.json`);
  }

  return candidates;
}

function findAsarFiles(rootDir) {
  const found = [];

  function walk(dir) {
    for (const entry of readdirSync(dir)) {
      const entryPath = path.join(dir, entry);
      const stats = statSync(entryPath);

      if (stats.isDirectory()) {
        walk(entryPath);
      } else if (entry === 'app.asar') {
        found.push(entryPath);
      }
    }
  }

  if (existsSync(rootDir)) {
    walk(rootDir);
  }

  return found;
}

function checkAsar(asarPath) {
  const asar = readAsar(asarPath);
  const packageJsonFiles = walkPackageJsonFiles(asar.header).filter(isPackageManifest);
  const missing = [];

  for (const packageJsonPath of packageJsonFiles) {
    const packageJson = JSON.parse(readEntry(asar, packageJsonPath));
    const root = packageRoot(packageJsonPath);
    const dependencies = packageJson.dependencies || {};

    for (const dependencyName of Object.keys(dependencies)) {
      if (dependencyName.startsWith('@types/')) {
        continue;
      }

      const normalizedName = dependencyName.replace(/^node:/, '');
      if (builtinModules.has(normalizedName)) {
        continue;
      }

      const dependencyFound = dependencyCandidates(root, dependencyName).some((candidate) =>
        hasEntry(asar.header, candidate)
      );

      if (!dependencyFound) {
        missing.push(`${root || '.'} -> ${dependencyName}@${dependencies[dependencyName]}`);
      }
    }
  }

  assert.equal(
    missing.length,
    0,
    `Missing runtime dependencies in ${asarPath}:\n${missing.sort().join('\n')}`
  );

  console.log(`OK ${asarPath}: ${packageJsonFiles.length} package manifests checked.`);
}

const explicitAsarPaths = process.argv.slice(2);
const asarPaths = explicitAsarPaths.length
  ? explicitAsarPaths.map((asarPath) => path.resolve(asarPath))
  : findAsarFiles(path.join(repoRoot, 'packages/bruno-electron/out'));

assert.ok(asarPaths.length, 'No app.asar files found to inspect.');

for (const asarPath of asarPaths) {
  checkAsar(asarPath);
}
