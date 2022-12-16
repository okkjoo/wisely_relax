import { useState, useEffect } from "react";
import { ipcRenderer } from "electron";
import styles from "styles/app.module.scss";

const SmartWarn: React.FC = () => {
  const [time, setTime] = useState("10");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
    if (time === "") {
      e.target.value = "1";
      setTime("1");
    }
  };
  const clock = () => {
    const NOTIFICATION_TITLE = "休息助手";
    const NOTIFICATION_BODY = "到时间休息了~";

    new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY }).onclick =
      () => {
        ipcRenderer.send("showMainWindow", "展示主窗口");
      };
  };
  let timer: NodeJS.Timer | null;
  useEffect(() => {
    clearInterval(timer as NodeJS.Timer);
    if (time !== "") timer = setInterval(clock, parseInt(time) * 60 * 1000);
    return () => {
      clearInterval(timer as NodeJS.Timer);
      timer = null;
    };
  }, [time]);

  return (
    <div className={styles.left_up}>
      <h2>按时休息</h2>
      <label>
        工作
        <input
          list="suggest"
          type="number"
          name="time2rest"
          min="1"
          onChange={handleChange}
          defaultValue={time}
        />
        分钟就休息
      </label>
      <datalist id="suggest">
        <option value="20" />
        <option value="30" />
        <option value="40" />
        <option value="50" />
        <option value="60" />
        <option value="80" />
      </datalist>
    </div>
  );
};
export default SmartWarn;
