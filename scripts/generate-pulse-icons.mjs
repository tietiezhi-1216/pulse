import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const svgPath = path.join(rootDir, 'packages/bruno-electron/resources/icons/pulse.svg');
const pngDir = path.join(rootDir, 'packages/bruno-electron/resources/icons/png');
const macIconPath = path.join(rootDir, 'packages/bruno-electron/resources/icons/mac/icon.icns');
const winIconPath = path.join(rootDir, 'packages/bruno-electron/resources/icons/win/icon.ico');
const aboutIconPath = path.join(rootDir, 'packages/bruno-electron/src/about/256x256.png');
const appFaviconPath = path.join(rootDir, 'packages/bruno-app/public/favicon.ico');
const electronFaviconPath = path.join(rootDir, 'packages/bruno-electron/web/favicon.ico');
const appSvgPath = path.join(rootDir, 'packages/bruno-app/public/pulse.svg');

const pngSizes = [16, 24, 32, 48, 64, 128, 256, 512, 1024];
const icoSizes = [16, 24, 32, 48, 256];

const writeIco = (entries, outPath) => {
  const headerSize = 6;
  const directorySize = entries.length * 16;
  let offset = headerSize + directorySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);

  const directories = entries.map(({ size, data }) => {
    const directory = Buffer.alloc(16);
    directory.writeUInt8(size >= 256 ? 0 : size, 0);
    directory.writeUInt8(size >= 256 ? 0 : size, 1);
    directory.writeUInt8(0, 2);
    directory.writeUInt8(0, 3);
    directory.writeUInt16LE(1, 4);
    directory.writeUInt16LE(32, 6);
    directory.writeUInt32LE(data.length, 8);
    directory.writeUInt32LE(offset, 12);
    offset += data.length;
    return directory;
  });

  writeFileSync(outPath, Buffer.concat([header, ...directories, ...entries.map((entry) => entry.data)]));
};

const renderPngs = async () => {
  const svg = readFileSync(svgPath, 'utf8');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1024, height: 1024 }, deviceScaleFactor: 1 });

  for (const size of pngSizes) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`
      <!doctype html>
      <html>
        <body style="margin:0;width:${size}px;height:${size}px;background:#fff;overflow:hidden;">
          <img id="icon" alt="Pulse logo" src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}" style="width:${size}px;height:${size}px;display:block;" />
        </body>
      </html>
    `);
    await page.locator('#icon').screenshot({ path: path.join(pngDir, `${size}x${size}.png`) });
  }

  await browser.close();
};

const buildIcns = () => {
  const iconsetDir = mkdtempSync(path.join(os.tmpdir(), 'pulse-iconset-')) + '.iconset';
  mkdirSync(iconsetDir, { recursive: true });

  const iconsetMap = {
    'icon_16x16.png': '16x16.png',
    'icon_16x16@2x.png': '32x32.png',
    'icon_32x32.png': '32x32.png',
    'icon_32x32@2x.png': '64x64.png',
    'icon_128x128.png': '128x128.png',
    'icon_128x128@2x.png': '256x256.png',
    'icon_256x256.png': '256x256.png',
    'icon_256x256@2x.png': '512x512.png',
    'icon_512x512.png': '512x512.png',
    'icon_512x512@2x.png': '1024x1024.png'
  };

  for (const [target, source] of Object.entries(iconsetMap)) {
    copyFileSync(path.join(pngDir, source), path.join(iconsetDir, target));
  }

  execFileSync('iconutil', ['-c', 'icns', iconsetDir, '-o', macIconPath], { stdio: 'inherit' });
  rmSync(iconsetDir, { recursive: true, force: true });
};

mkdirSync(pngDir, { recursive: true });
await renderPngs();
buildIcns();
writeIco(
  icoSizes.map((size) => ({ size, data: readFileSync(path.join(pngDir, `${size}x${size}.png`)) })),
  winIconPath
);
copyFileSync(winIconPath, appFaviconPath);
copyFileSync(winIconPath, electronFaviconPath);
copyFileSync(path.join(pngDir, '256x256.png'), aboutIconPath);
copyFileSync(svgPath, appSvgPath);

console.log('Pulse icons generated.');
