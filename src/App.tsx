import { useState } from "react";
import { Header, Setting, Show, SmartWarn, TimerWarn } from "./components";

import styles from "styles/app.module.scss";

const App: React.FC = () => {
  const initMp = new Map();
  const [thing2cnt, setThing2cnt] = useState(initMp);
  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.body}>
        <SmartWarn />
        <TimerWarn />
        <Setting thing2cnt={thing2cnt} setThing2cnt={setThing2cnt} />
        <Show thing2cnt={thing2cnt} />
      </div>
      {/* <div className={styles.footer}></div> */}
    </div>
  );
};

export default App;
