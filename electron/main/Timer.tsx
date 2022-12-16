export const SECONDS = 1000;
export const UNIT = 60;
export const MINUTES = SECONDS * UNIT;
export const HOURS = MINUTES * UNIT;

type TsetTime = "setTime";

/* 接收信息相关定义 */
interface ReceiveMsgNoProps {
  type: Exclude<keyof Timer, TsetTime>;
}

interface ReceiveMsgHasProps {
  type: TsetTime;
  data: number;
}

export type ReceiveMsg =
  | ReceiveMsgNoProps
  | ReceiveMsgHasProps
  | Array<ReceiveMsgNoProps | ReceiveMsgHasProps>;

interface Msg {
  time: {
    h: string;
    m: string;
    s: string;
  };
  ms: number;
}

/* 发送消息接口 */
export interface SendMsg {
  time: {
    h: string;
    m: string;
    s: string;
  };
  ms: number;
  resetFlag: boolean;
}

class Timer {
  private curTime = 0;
  private preTime = 0;
  private timer?: NodeJS.Timeout;

  /* 时间戳转换 */
  static ms2time(ms: number) {
    return {
      h: String((ms / HOURS) | 0).padStart(2, "0"),
      m: String((ms / MINUTES) % UNIT | 0).padStart(2, "0"),
      s: String((ms / SECONDS) % UNIT | 0).padStart(2, "0"),
    };
  }

  /* 刷新、重置时间  */
  refreshTime() {
    this.curTime = this.preTime;
    this.send({
      time: Timer.ms2time(this.curTime),
      ms: this.curTime,
    });
    return this;
  }

  /* 设置时间 */
  setTime(ms: number) {
    this.clear();
    this.curTime = this.preTime = ms;
    return this;
  }

  /* 开始计时 */
  run() {
    this.send({
      time: Timer.ms2time(this.curTime),
      ms: this.curTime,
    });
    this.timer = setInterval(() => {
      this.send({
        time: Timer.ms2time((this.curTime -= SECONDS)),
        ms: this.curTime,
      });
      if (this.curTime <= 0) this.clear();
    }, SECONDS);
  }
  private send(msg: Msg) {
    process.send!({ ...msg, resetFlag: msg.ms <= 0 });
  }

  /* 暂停：清空之前的计时器 */
  clear() {
    this.timer && clearInterval(this.timer);
  }
}
