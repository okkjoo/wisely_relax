import { useState } from "react";
import styles from "styles/app.module.scss";
const Setting: React.FC = () => {
  const [archiveFlag, setArchiveFlag] = useState(true);
  const [text, setText] = useState("");
  const handleArchiveFlag = () => {
    setArchiveFlag(!archiveFlag);
  };
  const handleChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  return (
    <div className={styles.middle}>
      <h2>个性化设置</h2>
      <input
        type="checkbox"
        value="archiveFlag"
        id="archiveFlag"
        onChange={handleArchiveFlag}
        checked={archiveFlag}
      />
      需要工作存档
      {archiveFlag ? (
        <textarea
          className={styles.archiveText}
          defaultValue={text}
          onChange={handleChangeText}
        ></textarea>
      ) : (
        <></>
      )}
    </div>
  );
};
export default Setting;
