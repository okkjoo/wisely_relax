import styles from "styles/app.module.scss";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}> 休息time</div>
      <div className={styles.introduce}>关于我们 | 反馈</div>
      <div className={styles.close}>❎</div>
    </header>
  );
};
export default Header;
