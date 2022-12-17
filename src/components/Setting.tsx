import { useState } from "react";
import { cloneMap } from "@/utils/cloneMap";
import styles from "styles/app.module.scss";

interface ISetting {
  thing2cnt: Map<string, number>;
  setThing2cnt: React.Dispatch<React.SetStateAction<Map<any, any>>>;
}
const Setting: React.FC<ISetting> = ({ thing2cnt, setThing2cnt }) => {
  const [archiveFlag, setArchiveFlag] = useState(true);
  const [textFoucsFlag, setTextFoucsFlag] = useState(false);
  const [text, setText] = useState(`record doing something
for example :
Writing the personal Settings module
...
  `);
  const [inputs, setInputs] = useState([
    "to drink",
    "to exercise",
    "to chat",
    "do4",
    "do5",
  ]);
  const handleArchiveFlag = () => {
    setArchiveFlag(!archiveFlag);
  };
  const handleChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  const handleChangeTextFocus = (flag: boolean) => () => {
    setTextFoucsFlag(flag);
  };
  const handleChangeInput =
    (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newClocks = [...inputs];
      const lastValue = newClocks.splice(idx, 1, e.target.value)[0];
      thing2cnt.delete(lastValue);
      setInputs(newClocks);
    };
  const handleClickAddBtn = (idx: number) => () => {
    const thing = inputs[idx];
    if (!thing2cnt.get(thing)) thing2cnt.set(thing, 0);
    thing2cnt.set(thing, thing2cnt.get(thing)! + 1);
    thing2cnt = cloneMap(thing2cnt);
    setThing2cnt(cloneMap(thing2cnt));
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
          onFocus={handleChangeTextFocus(true)}
          onBlur={handleChangeTextFocus(false)}
          spellCheck="false"
        ></textarea>
      ) : (
        <></>
      )}
      <div
        className={[styles.restSelect, textFoucsFlag ? styles.short : ""].join(
          " "
        )}
      >
        <h2>休息选择</h2>
        {inputs.map((input, idx) => (
          <div className={styles.inputItem} key={idx}>
            <input
              className={styles.restSelectItem}
              type="text"
              defaultValue={input}
              onChange={handleChangeInput(idx)}
              spellCheck="false"
            ></input>
            <div className={styles.itembtn} onClick={handleClickAddBtn(idx)}>
              ✅
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Setting;
