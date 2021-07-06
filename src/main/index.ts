/**
 * electron 主文件
 */
import '@src/common/patch'
import { join } from 'path'
import { app, BrowserWindow, globalShortcut } from 'electron'
import dotenv from 'dotenv'

dotenv.config({ path: join(__dirname, '../../.env') })

let win: BrowserWindow

function createWin() {
  // 创建浏览器窗口
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: join(__dirname, '../../src/preload/index.js'),
    },
  })

  globalShortcut.register('F12', function () {
    win.webContents.openDevTools()
  })

  win.webContents.openDevTools()

  const URL = app.isPackaged
    ? `file://${join(__dirname, '../render/index.html')}` // vite 构建后的静态文件地址
    : `http://localhost:${process.env.PORT}` // vite 启动的服务器地址

  win?.loadURL(URL)
}

app.whenReady().then(createWin)
