//TODO 还有一些问题，时间关系..
import {
  Tray as eTray,
  Menu,
  BrowserWindow,
  ipcMain,
  IpcMainEvent,
} from "electron";
import path from "path";
import { fork, ChildProcess } from "child_process";
import { ReceiveMsg, SendMsg } from "./Timer";

export const TIPS_MESSAGE = "TIPS_MESSAGE";
interface TipsMsgData {
  type: "CLOSE" | "RESET" | "STOP";
}
type TimeType = "REST" | "WORK";

/* 扩充 Tray */
class Tray {
  constructor() {
    this.setContextMenu();
    this.handleTimeChange();
    this.startWorkTime();
  }

  // 初始化托盘栏，并传入托盘图标
  private tray: eTray = new eTray(path.resolve(__dirname, "favicon.ico"));
  // 标示当前时间为工作时间或休息时间
  private timeType: TimeType = "WORK";
  // 菜单实例
  private menu: Menu | null = null;
  // 锁屏窗口实例
  private restWindows: BrowserWindow[] | null = null;
  // 提示框口实例
  private tipsWindow: BrowserWindow | null = null;
  // 倒计时模块 使用 child_process.fork 创建一个子进程
  private countDown: ChildProcess = fork(
    path.resolve(__dirname, "./countDown")
  );

  send(message: ReceiveMsg | ReceiveMsg[]) {
    this.countDown.send(message);
  }
  /* 开始计时 */
  private startWorkTime() {
    this.send([
      {
        type: "setTime",
        data: workTime,
      },
      {
        type: "run",
      },
    ]);
  }
  /* 时间变化 */
  handleWorkTimeChange({ time: { h, m, s }, ms, resetFlag }: SendMsg) {
    this.tray.setTitle(`${h}:${m}:${s}`); //托盘title设为时间
    if (ms <= tipsTime) {
      this.handleTipsTime(s, resetFlag); // 到时间了就弹窗提醒
    } else if (this.tipsWindow) {
      this.closeTipsWindow(); //否则就关闭
    }
    if (resetFlag) {
      this.toggleRest(); //进入休息时间
    }
  }
  /* 监听时间 */
  handleTimeChange() {
    this.countDown.on("message", (data: SendMsg) => {
      if (this.timeType === "WORK") {
        this.handleWorkTimeChange(data);
      } else {
        this.handleRestTimeChange(data);
      }
    });
  }
  /* 提示框 */
  handleTipsTime(s: string, done: boolean) {
    if (!this.tipsWindow) {
      // 初始化
      ipcMain.on(TIPS_MESSAGE, this.handleTipsMsg); //监听渲染进程的消息，创建提示气泡窗口
      this.tipsWindow = createTipsWindow(this.tray.getBounds(), s);
    } else {
      // 已经初始化了窗口就向窗口中发送时间变化的消息
      this.tipsWindow.webContents.send(TIPS_MESSAGE, {
        s,
        done,
      });
    }
  }
  handleTipsMsg = (event: IpcMainEvent, { type }: TipsMsgData) => {
    if (type === "CLOSE") {
      this.closeTipsWindow();
    } else if (type === "RESET") {
      this.closeTipsWindow();
      this.send({
        type: "refreshTime",
      });
    } else if (type === "STOP") {
      this.closeTipsWindow();
      this.send({
        type: "clear",
      });
      this.menu.getMenuItemById("play").visible = true;
      this.menu.getMenuItemById("pause").visible = false;
    }
  };
  closeTipsWindow() {
    if (this.tipsWindow) {
      ipcMain.removeListener(TIPS_MESSAGE, this.handleTipsMsg);
      this.tipsWindow.close();
      this.tipsWindow = null;
    }
  }
  /* 右键菜单设置 */
  private setContextMenu() {
    this.menu = Menu.buildFromTemplate([
      {
        label: "偏好设置",
        click: () => {},
      },
      {
        type: "separator",
      },
      {
        id: "play",
        label: "继续",
        visible: false,
        click: (menuItem) => {
          this.send({
            type: "run",
          });
          // 暂停和继续 只显示一个
          menuItem.menu.getMenuItemById("pause").visible = true;
          menuItem.visible = false;
        },
      },
      {
        id: "pause",
        label: "暂停",
        visible: true,
        click: (menuItem) => {
          this.send({
            type: "clear",
          });
          menuItem.menu.getMenuItemById("play").visible = true;
          menuItem.visible = false;
        },
      },
      {
        label: "重置",
        click: (menuItem) => {
          menuItem.menu.getMenuItemById("play").visible = false;
          menuItem.menu.getMenuItemById("pause").visible = true;
          this.startWorkTime();
        },
      },
      {
        type: "separator",
      },
      { label: "退出", role: "quit" },
    ]);
    this.tray.setContextMenu(this.menu);
  }
}
