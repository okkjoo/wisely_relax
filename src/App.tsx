import { Header, Setting, Show, SmartWarn, TimerWarn } from "./components";

import styles from "styles/app.module.scss";

const App: React.FC = () => {
  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.body}>
        <SmartWarn />
        <TimerWarn />
        <Setting />
        <Show />
      </div>
      {/* <div className={styles.footer}></div> */}
    </div>
  );
};

export default App;
