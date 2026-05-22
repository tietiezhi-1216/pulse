import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (file) => fs.readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8');
const stat = (file) => fs.statSync(new URL(`../../${file}`, import.meta.url));

test('electron-builder uses Pulse app identity', () => {
  const config = read('packages/bruno-electron/electron-builder-config.js');

  assert.match(config, /appId:\s*'app\.pulse\.client'/);
  assert.match(config, /productName:\s*'Pulse'/);
  assert.match(config, /name:\s*'Pulse'/);
  assert.match(config, /schemes:\s*\[\s*'pulse'\s*\]/);
  assert.doesNotMatch(config, /com\.usebruno\.app/);
  assert.doesNotMatch(config, /publisherName:\s*'Bruno Software Inc'/);
});

test('electron main process registers Pulse protocol and title', () => {
  const main = read('packages/bruno-electron/src/index.js');

  assert.match(main, /removeAsDefaultProtocolClient\('pulse'\)/);
  assert.match(main, /setAsDefaultProtocolClient\('pulse'\)/);
  assert.match(main, /title:\s*'Pulse'/);
  assert.doesNotMatch(main, /bruno:\/\//);
  assert.doesNotMatch(main, /title:\s*'Bruno'/);
});

test('about window presents Pulse as an independent fork', () => {
  const about = read('packages/bruno-electron/src/app/about-bruno.js');

  assert.match(about, /<title>About Pulse<\/title>/);
  assert.match(about, /Pulse \$\{version\}/);
  assert.match(about, /independent fork/i);
  assert.doesNotMatch(about, /Bruno Software Inc/);
});

test('root metadata and README describe Pulse without pretending to be Bruno official', () => {
  const rootPackage = read('package.json');
  const electronPackage = read('packages/bruno-electron/package.json');
  const readme = read('README.md');

  assert.match(rootPackage, /"name":\s*"pulse-api-client"/);
  assert.match(electronPackage, /"name":\s*"pulse"/);
  assert.match(readme, /^# Pulse/m);
  assert.match(readme, /fork of Bruno/i);
  assert.match(readme, /not affiliated with or endorsed by Bruno/i);
});

test('Pulse icon assets exist for Electron packaging', () => {
  const requiredAssets = [
    ['assets/brand/pulse-icon.svg', 1000],
    ['packages/bruno-electron/resources/icons/png/16x16.png', 100],
    ['packages/bruno-electron/resources/icons/png/256x256.png', 1000],
    ['packages/bruno-electron/resources/icons/png/1024x1024.png', 1000],
    ['packages/bruno-electron/resources/icons/mac/icon.icns', 1000],
    ['packages/bruno-electron/resources/icons/win/icon.ico', 1000],
    ['packages/bruno-electron/src/about/256x256.png', 1000],
    ['packages/bruno-app/public/favicon.ico', 1000]
  ];

  for (const [asset, minSize] of requiredAssets) {
    assert.ok(stat(asset).size > minSize, `${asset} should be a non-empty icon asset`);
  }
});
