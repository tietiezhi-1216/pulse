import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const repoRoot = new URL('../../', import.meta.url);

async function readRepoFile(path) {
  return readFile(new URL(path, repoRoot), 'utf8');
}

test('GitHub Actions install root dependencies with pnpm lockfile', async () => {
  const setupAction = await readRepoFile('.github/actions/common/setup-node-deps/action.yml');

  assert.match(setupAction, /pnpm\/action-setup@v4/);
  assert.match(setupAction, /cache:\s*'pnpm'/);
  assert.match(setupAction, /cache-dependency-path:\s*'\.\/pnpm-lock\.yaml'/);
  assert.match(setupAction, /pnpm install --frozen-lockfile/);
  assert.doesNotMatch(setupAction, /package-lock\.json/);
  assert.doesNotMatch(setupAction, /npm ci --legacy-peer-deps/);
});

test('GitHub Actions run repository scripts with pnpm', async () => {
  const lintWorkflow = await readRepoFile('.github/workflows/lint-checks.yml');
  const unitAction = await readRepoFile('.github/actions/tests/run-unit-tests/action.yml');

  assert.match(lintWorkflow, /run: pnpm lint/);
  assert.match(unitAction, /pnpm --filter \.\/packages\/bruno-app test/);
  assert.doesNotMatch(unitAction, /npm run test/);
});
