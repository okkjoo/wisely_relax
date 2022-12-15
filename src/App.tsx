import { useState } from "react";
import styles from "styles/app.module.scss";

const App: React.FC = () => {
  return (
    <div className={styles.app}>
      <div className={styles.header}></div>
      <div className={styles.body}>
        <div className={styles.left_up}></div>
        <div className={styles.left_down}></div>
        <div className={styles.middle}></div>
        <div className={styles.right}></div>
      </div>
      <div className={styles.footer}></div>
    </div>
  );
};

export default App;
