import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const repoRoot = path.resolve(import.meta.dirname, '../..');
const appRoot = path.join(repoRoot, 'packages/bruno-app');
const electronRoot = path.join(repoRoot, 'packages/bruno-electron');
const enPath = path.join(appRoot, 'src/i18n/translation/en.json');
const zhCnPath = path.join(appRoot, 'src/i18n/translation/zh-CN.json');

const readText = (relativePath) => readFileSync(path.join(repoRoot, relativePath), 'utf8');
const readJson = (filePath) => JSON.parse(readFileSync(filePath, 'utf8'));

function flattenKeys(value, prefix = '') {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return Object.entries(value).flatMap(([key, child]) => flattenKeys(child, prefix ? `${prefix}.${key}` : key));
  }
  return [prefix];
}

test('Simplified Chinese translation exists with the same keys as English', () => {
  assert.equal(existsSync(zhCnPath), true);

  const enKeys = flattenKeys(readJson(enPath)).sort();
  const zhCnKeys = flattenKeys(readJson(zhCnPath)).sort();

  assert.deepEqual(zhCnKeys, enKeys);
  assert.equal(readJson(zhCnPath).COMMON.COLLECTIONS, '集合');
});

test('i18n registers zh-CN and keeps English as fallback', () => {
  const i18nSource = readText('packages/bruno-app/src/i18n/index.js');

  assert.match(i18nSource, /translationZhCN/);
  assert.match(i18nSource, /['"]zh-CN['"]/);
  assert.match(i18nSource, /fallbackLng:\s*['"]en['"]/);
});

test('preferences persist the selected UI language', () => {
  const appSliceSource = readText('packages/bruno-app/src/providers/ReduxStore/slices/app.js');
  const preferencesStoreSource = readText('packages/bruno-electron/src/store/preferences.js');
  const generalPreferencesSource = readText('packages/bruno-app/src/components/Preferences/General/index.js');

  assert.match(appSliceSource, /language:\s*['"]system['"]/);
  assert.match(preferencesStoreSource, /language:\s*['"]system['"]/);
  assert.match(preferencesStoreSource, /oneOf\(\[['"]system['"],\s*['"]en['"],\s*['"]zh-CN['"]\]\)/);
  assert.match(generalPreferencesSource, /name=["']language["']/);
  assert.match(generalPreferencesSource, /SUPPORTED_LANGUAGES/);
});
