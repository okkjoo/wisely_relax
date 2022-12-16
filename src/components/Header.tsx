import { ipcRenderer } from "electron";
import styles from "styles/app.module.scss";

const Header: React.FC = () => {
  const clickIntro = () => {
    window.open("https://github.com/okkjoo/wisely_relax");
  };
  const clickClose = () => {
    ipcRenderer.send("clickClose", "关闭窗口");
  };
  return (
    <header className={styles.header}>
      <div className={styles.logo}> 休息time</div>
      <div className={styles.introduce} onClick={clickIntro}>
        关于我们 | 反馈
      </div>
      <div className={styles.close} onClick={clickClose}>
        ❎
      </div>
    </header>
  );
};
export default Header;
