const { ipcMain } = require('electron');
const os = require('os');
const { BrowserWindow } = require('electron');
const { version } = require('../../package.json');
const aboutPulse = require('./about-bruno');

const isZh = `${process.env.LANG || ''}`.toLowerCase().includes('zh');
const label = isZh
  ? {
      collection: '集合',
      openCollection: '打开集合',
      openRecent: '最近打开',
      clearRecent: '清除最近记录',
      quit: '退出',
      forceQuit: '强制退出',
      edit: '编辑',
      view: '视图',
      actualSize: '实际大小',
      zoomIn: '放大',
      zoomOut: '缩小',
      about: '关于 Pulse',
      documentation: '文档'
    }
  : {
      collection: 'Collection',
      openCollection: 'Open Collection',
      openRecent: 'Open Recent',
      clearRecent: 'Clear Recent',
      quit: 'Quit',
      forceQuit: 'Force Quit',
      edit: 'Edit',
      view: 'View',
      actualSize: 'Actual Size',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      about: 'About Pulse',
      documentation: 'Documentation'
    };

const template = [
  {
    label: label.collection,
    submenu: [
      {
        label: label.openCollection,
        click() {
          ipcMain.emit('main:open-collection');
        }
      },
      {
        label: label.openRecent,
        role: 'recentdocuments',
        visible: os.platform() == 'darwin',
        submenu: [
          {
            label: label.clearRecent,
            role: 'clearrecentdocuments'
          }
        ]
      },
      { type: 'separator' },
      {
        label: label.quit,
        click() {
          ipcMain.emit('main:start-quit-flow');
        }
      },
      {
        label: label.forceQuit,
        click() {
          process.exit();
        }
      }
    ]
  },
  {
    label: label.edit,
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'selectAll' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' }
    ]
  },
  {
    label: label.view,
    submenu: [
      { role: 'toggledevtools' },
      { type: 'separator' },
      {
        label: label.actualSize,
        accelerator: 'CommandOrControl+0',
        registerAccelerator: false,
        click() {
          ipcMain.emit('menu:reset-zoom');
        }
      },
      {
        label: label.zoomIn,
        accelerator: 'CommandOrControl+Plus',
        registerAccelerator: false,
        click() {
          ipcMain.emit('menu:zoom-in');
        }
      },
      {
        label: label.zoomOut,
        accelerator: 'CommandOrControl+-',
        registerAccelerator: false,
        click() {
          ipcMain.emit('menu:zoom-out');
        }
      },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    role: 'window',
    submenu: [{ role: 'minimize' }, { role: 'close', accelerator: 'CommandOrControl+Shift+Q' }]
  },
  {
    role: 'help',
    submenu: [
      {
        label: label.about,
        click: () => {
          const aboutWindow = new BrowserWindow({
            width: 350,
            height: 250,
            webPreferences: {
              nodeIntegration: true
            }
          });
          aboutWindow.removeMenu();
          aboutWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(aboutPulse({ version }))}`);
        }
      },
      { label: label.documentation, click: () => ipcMain.emit('main:open-docs') }
    ]
  }
];

module.exports = template;
