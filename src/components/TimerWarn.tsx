import { ipcRenderer } from "electron";
import { useState, useEffect } from "react";
import styles from "styles/app.module.scss";

const TimerWarn: React.FC = () => {
  const [clocks, setClocks] = useState([
    "10:30",
    "11:00",
    "12:30",
    "15:30",
    "18:00",
    "20:00",
    "21:00",
    "22:00",
  ]);
  const handleChangeClock =
    (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newClocks = [...clocks];
      newClocks.splice(idx, 1, e.target.value);
      setClocks(newClocks);
    };
  const getTime = () => {
    const supple = (s: number) => s.toString().padStart(2, "0");
    const d = new Date();
    const h = supple(d.getHours()),
      m = supple(d.getMinutes());
    const s = `${h}:${m}`;
    return s;
  };
  const clock = () => {
    const s = getTime();
    const NOTIFICATION_TITLE = "休息助手";
    const NOTIFICATION_BODY = `已经${s}了,注意休息~`;

    new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY }).onclick =
      () => {
        ipcRenderer.send("showMainWindow", "展示主窗口");
      };
  };
  let timer: NodeJS.Timer | null;
  const check = () => {
    const s = getTime();
    clocks.find((c) => {
      if (c === s) {
        clock();
        clearInterval(timer as NodeJS.Timer);
        setTimeout(() => {
          timer = setInterval(() => {
            check();
          }, 1000 * 60);
        });
        return true;
      }
    });
  };
  useEffect(() => {
    clearInterval(timer as NodeJS.Timer);
    timer = setInterval(() => {
      check();
    }, 1000);
    return () => {
      clearInterval(timer as NodeJS.Timer);
    };
  }, [clocks]);

  return (
    <div className={styles.left_down}>
      <h2>定时休息</h2>
      {clocks.map((clock, idx) => {
        return (
          <div key={idx} className={styles.clockItem}>
            <input
              id="appt-time"
              type="time"
              name="appt-time"
              defaultValue={clock}
              onChange={handleChangeClock(idx)}
            />
          </div>
        );
      })}
    </div>
  );
};
export default TimerWarn;
