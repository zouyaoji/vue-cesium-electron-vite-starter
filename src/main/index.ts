/**
 * electron 主文件
 */
import '@src/common/patch'
import { join } from 'path'
import { app, BrowserWindow, globalShortcut, MenuItem, MenuItemConstructorOptions, Menu } from 'electron'
import dotenv from 'dotenv'
const isMac = process.platform === 'darwin'

dotenv.config({ path: join(__dirname, '../../.env') })

let win: BrowserWindow

function createWin () {
  // 创建浏览器窗口
  win = new BrowserWindow({
    width: 1440,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: join(__dirname, '../../src/preload/index.js'),
    },
  })

  globalShortcut.register('CommandOrControl + D', () => {
    win.webContents.openDevTools()
  })

  // win.webContents.openDevTools()



  const URL = app.isPackaged
    ? `file://${join(__dirname, '../render/index.html')}` // vite 构建后的静态文件地址
    : `http://localhost:${process.env.PORT}` // vite 启动的服务器地址

  win?.loadURL(URL)
}

const template: Array<(MenuItemConstructorOptions) | (MenuItem)> = [
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'delete' },
      { type: 'separator' },
      { role: 'selectAll' }
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      { role: 'close' }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }
      },
      {
        label: 'VueCesium Document',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://zouyaoji.top/vue-cesium')
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

app.whenReady().then(createWin)
