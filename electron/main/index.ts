// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, "../..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : join(process.env.DIST_ELECTRON, "../public");

import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Tray,
  Menu,
  nativeImage,
} from "electron";
import { release } from "os";
import { join } from "path";

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;
const BrowserWindowsMap = new Map<number, BrowserWindow>();
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

let tray: Tray;
let mainWindowId: number;
async function createWindow() {
  win = new BrowserWindow({
    width: 768,
    height: 539,
    titleBarStyle: "hidden",
    resizable: false,
    frame: false,
    transparent: true,
    icon: join(process.env.PUBLIC, "favicon.svg"),
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindowId = win.id;
  BrowserWindowsMap.set(win.id, win);

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
  win.on("close", (event) => {
    // 如果关闭的是主窗口，阻止，并仅仅隐藏
    if (win.id === mainWindowId) {
      event.preventDefault();
      win.hide();
    }
  });

  /* 托盘设置 */
  const icon = nativeImage.createFromPath(
    join(process.env.PUBLIC, "favicon.ico")
  );
  tray = new Tray(icon);
  const mainWindow = BrowserWindowsMap.get(mainWindowId);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "打开设置",
      click: () => {
        if (mainWindow) {
          mainWindow.restore();
          mainWindow.show();
        }
      },
    },
    {
      label: "离开",
      click: () => {
        if (mainWindow) {
          mainWindowId = -1;
          mainWindow.close();
        }
        tray.destroy();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);
  tray.setToolTip("休息助手");
  tray.setTitle("休息助手");
  tray.on("double-click", () => {
    if (mainWindow) {
      mainWindow.restore();
      mainWindow.show();
    }
  });

  /* 点击浮窗展示主窗口 */
  ipcMain.on("showMainWindow", () => {
    if (mainWindow) {
      mainWindow.restore();
      mainWindow.show();
    }
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// new window example arg: new windows url
ipcMain.handle("open-win", (event, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
/* 渲染进程中自定义按钮事件：关闭窗口 */
ipcMain.on("clickClose", () => {
  app.quit();
});
